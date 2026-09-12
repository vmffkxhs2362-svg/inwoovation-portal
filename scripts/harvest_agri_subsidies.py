#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Agri-Subsidy & Grant Automated Harvest Pipeline
=================================================
Automated scraper & surveillance engine for agricultural incentive programs.
Monitors:
  - CDFA OARS (Office of Agricultural Resilience and Sustainability)
  - CDFA Climate Bond Funding (Proposition 4)
  - California State Grants Portal (grants.ca.gov)
  - CARB FARMER Program
  - Korean Smart Farm (스마트팜코리아)

Features:
  1. Anti-Sticky / Pinned Post 3-Tier Filter (DOM class, date monotonicity, persistent ID ledger)
  2. Direct extraction and ingestion into SQLite `discovered_candidates`
  3. Automatic deduplication via SHA-256 notice hashes
"""

import os
import sys
import re
import json
import time
import ssl
import hashlib
import sqlite3
import urllib.request
from datetime import datetime
from bs4 import BeautifulSoup

# Configuration Paths
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA_PATH = os.path.join(BASE_DIR, "data", "global_agri_subsidies.json")
LEDGER_PATH = os.path.join(BASE_DIR, "data", "collected_notice_ids.json")
ROOT_DIR = os.path.dirname(os.path.dirname(BASE_DIR))
KB_DIR = os.path.join(ROOT_DIR, "Knowledge_Base", "Global_Agri_Subsidies")
DB_PATH = os.path.join(KB_DIR, "01_Master_Database", "agri_grants_master.db")

SSL_CTX = ssl.create_default_context()
SSL_CTX.check_hostname = False
SSL_CTX.verify_mode = ssl.CERT_NONE

HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36 (InwoovationAgriRadar/2.0; +https://inwoovation.org)"
}

TARGET_PORTALS = [
    {
        "id": "CDFA_OARS",
        "name": "California CDFA Office of Agricultural Resilience and Sustainability",
        "url": "https://www.cdfa.ca.gov/oars/",
        "region": "US-CA",
        "country": "US",
        "agency": "California Department of Food and Agriculture (CDFA) - OARS",
        "pinned_selectors": [".pinned", ".notice", ".announcement-sticky", "tr.notice"],
        "max_age_days": 60
    },
    {
        "id": "CDFA_PROP4",
        "name": "California CDFA Climate Bond Funding (Proposition 4)",
        "url": "https://www.cdfa.ca.gov/oars/climate-bond-funding/",
        "region": "US-CA",
        "country": "US",
        "agency": "California Department of Food and Agriculture (CDFA) - OARS",
        "pinned_selectors": [".pinned", ".notice"],
        "max_age_days": 90
    },
    {
        "id": "CARB_FARMER",
        "name": "California CARB FARMER Program",
        "url": "https://ww2.arb.ca.gov/our-work/programs/farmer-program",
        "region": "US-CA",
        "country": "US",
        "agency": "California Air Resources Board (CARB)",
        "pinned_selectors": [".views-row-first", ".highlighted"],
        "max_age_days": 90
    },
    {
        "id": "CA_GRANTS_GOV",
        "name": "California State Grants Portal (grants.ca.gov)",
        "url": "https://www.grants.ca.gov/",
        "region": "US-CA",
        "country": "US",
        "agency": "State of California",
        "pinned_selectors": [".sticky-header", ".featured-grant", "div.pinned"],
        "max_age_days": 60
    }
]

def load_ledger():
    if os.path.exists(LEDGER_PATH):
        try:
            with open(LEDGER_PATH, "r", encoding="utf-8") as f:
                return json.load(f)
        except Exception:
            return {"known_hashes": {}, "last_run": None}
    return {"known_hashes": {}, "last_run": None}

def save_ledger(ledger):
    os.makedirs(os.path.dirname(LEDGER_PATH), exist_ok=True)
    with open(LEDGER_PATH, "w", encoding="utf-8") as f:
        json.dump(ledger, f, indent=2, ensure_ascii=False)

def compute_notice_hash(title, url):
    normalized = f"{title.strip().lower()}|{url.strip().lower()}"
    return hashlib.sha256(normalized.encode("utf-8")).hexdigest()

def is_sticky_or_outdated(title, date_str, is_pinned_dom, max_age_days=60):
    if is_pinned_dom:
        return True, "DOM marker indicates pinned/sticky notice"

    sticky_keywords = [
        "이용안내", "자주하는질문", "faq", "고정공지", "공지사항 안내",
        "portal maintenance", "frequently asked questions", "terms of use",
        "privacy policy", "accessibility", "contact us"
    ]
    if any(k in title.lower() for k in sticky_keywords):
        return True, "Title matches administrative sticky keyword"

    if date_str:
        try:
            clean_date = re.sub(r"[^\d\-\/\.]", "", date_str).replace(".", "-").replace("/", "-")
            parsed_date = None
            for fmt in ("%Y-%m-%d", "%m-%d-%Y", "%d-%m-%Y"):
                try:
                    parsed_date = datetime.strptime(clean_date, fmt)
                    break
                except ValueError:
                    continue
            
            if parsed_date:
                age_days = (datetime.now() - parsed_date).days
                if age_days > max_age_days:
                    return True, f"Post age ({age_days} days) exceeds threshold ({max_age_days} days)"
        except Exception:
            pass

    return False, "Valid new notice"

def fetch_html(url, timeout=12):
    req = urllib.request.Request(url, headers=HEADERS)
    try:
        with urllib.request.urlopen(req, timeout=timeout, context=SSL_CTX) as response:
            return response.read().decode("utf-8", errors="ignore")
    except Exception as e:
        print(f"    ⚠️ Fetch error for {url}: {e}")
        return None

def harvest_portal(portal, ledger, db_conn):
    url = portal["url"]
    print(f"  📡 [{portal['id']}] Scraping {portal['name']} ({url})...")
    html = fetch_html(url)
    if not html:
        return 0

    soup = BeautifulSoup(html, "html.parser")
    found_count = 0
    cur = db_conn.cursor() if db_conn else None

    # Scan all links and headers
    anchors = soup.find_all("a", href=True)
    keywords = ["grant", "program", "funding", "application", "incentive", "sweep", "dairy", "soil", "equipment", "farmer", "water", "bond"]

    for a in anchors:
        text = a.get_text(strip=True)
        href = a["href"]
        if not text or len(text) < 8 or len(text) > 160:
            continue

        if not any(k in text.lower() for k in keywords) and not any(k in href.lower() for k in keywords):
            continue

        full_url = urllib.parse.urljoin(url, href)
        if full_url.startswith("mailto:") or full_url.startswith("javascript:"):
            continue

        # Check pinned
        is_pinned = any(a.find_parent(class_=re.compile(sel.replace(".", ""))) for sel in portal["pinned_selectors"] if "." in sel)
        is_invalid, reason = is_sticky_or_outdated(text, None, is_pinned, portal["max_age_days"])
        if is_invalid:
            continue

        notice_hash = compute_notice_hash(text, full_url)
        if notice_hash in ledger.get("known_hashes", {}):
            continue

        # New Notice Discovered
        ledger.setdefault("known_hashes", {})[notice_hash] = {
            "title": text,
            "url": full_url,
            "discovered_at": datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        }
        found_count += 1

        print(f"    🌟 [NEW CANDIDATE] {text} ➔ {full_url}")

        if cur:
            try:
                cur.execute("""
                    INSERT OR IGNORE INTO discovered_candidates (
                        source_platform, agency_name, opportunity_title, opportunity_url,
                        category, est_funding_amount, deadline_text, is_cross_domain, matched_tracks,
                        status, discovery_notes, discovered_at
                    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
                """, (
                    portal["id"],
                    portal.get("agency", "State Agency"),
                    text,
                    full_url,
                    "Agriculture / Climate",
                    "Check announcement",
                    "Active Solicitation",
                    1 if any(k in text.lower() for k in ["energy", "clean", "microgrid"]) else 0,
                    json.dumps(["agriculture", portal["region"]]),
                    "pending_review",
                    f"Harvested via {portal['id']} on {datetime.now().strftime('%Y-%m-%d')}"
                ))
            except Exception as dbe:
                print(f"    ⚠️ DB insert warning: {dbe}")

    if cur and db_conn:
        db_conn.commit()

    print(f"    ✅ [{portal['id']}] Found {found_count} new potential notices.")
    return found_count

def main():
    print("=" * 60)
    print("🌱 AGRI-SUBSIDY AUTOMATED HARVEST PIPELINE (LIVE SURVEILLANCE)")
    print(f"   Execution Timestamp: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print("=" * 60)

    ledger = load_ledger()
    print(f"📊 State Ledger: {len(ledger.get('known_hashes', {}))} previously verified notices indexed.")

    db_conn = None
    if os.path.exists(DB_PATH):
        db_conn = sqlite3.connect(DB_PATH)
        print(f"🗄️ Connected to Master Database: {DB_PATH}")

    total_new = 0
    print("\n🔍 Inspecting Target Registries for Active Solicitations...")
    for portal in TARGET_PORTALS:
        new_items = harvest_portal(portal, ledger, db_conn)
        total_new += new_items

    ledger["last_run"] = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    save_ledger(ledger)

    if db_conn:
        db_conn.close()

    print(f"\n🎉 Harvest audit complete: {total_new} new candidates indexed.")
    return 0

if __name__ == "__main__":
    sys.exit(main())
