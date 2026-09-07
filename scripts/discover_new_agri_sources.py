#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
California Agricultural Grants & Unregistered Agency Auto-Discovery Radar
==========================================================================
Autonomous surveillance engine targeting unlisted and newly published
California agricultural grants, incentives, and rebates.

Target Sources:
  1. California Grants Portal (grants.ca.gov) live search queries
  2. San Joaquin Valley Air Pollution Control District (SJVAPCD Ag Grants)
  3. California Energy Commission (CEC Clean Ag / Food Production Investment)
  4. University of California Agriculture & Natural Resources (UC ANR)

Storage & Deduplication:
  - Compares candidates against Master SQLite DB (agri_grants_master.db)
  - Compares candidates against JSON production feed (global_agri_subsidies.json)
  - Persists new candidate findings to discovered_candidates.json and SQLite

Author: Inwoovation AI Agent Pipeline
Standard: AGENTS.md Deep Module & Self-Verification Architecture
"""

import os
import sys
import re
import json
import time
import ssl
import sqlite3
import urllib.request
import urllib.parse
from datetime import datetime
from bs4 import BeautifulSoup

# Base paths calculation (4 levels up from this script to Headquater)
BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))
KB_DIR = os.path.join(BASE_DIR, "Knowledge_Base", "Global_Agri_Subsidies")
DB_PATH = os.path.join(KB_DIR, "01_Master_Database", "agri_grants_master.db")
SCHEMA_PATH = os.path.join(KB_DIR, "01_Master_Database", "schema.sql")
CANDIDATES_JSON = os.path.join(KB_DIR, "01_Master_Database", "discovered_candidates.json")
PRODUCTION_JSON = os.path.join(BASE_DIR, "Career", "Inwoovation_Portal", "data", "global_agri_subsidies.json")

# Default SSL Context (bypassing corporate/local inspection issues safely)
SSL_CTX = ssl.create_default_context()
SSL_CTX.check_hostname = False
SSL_CTX.verify_mode = ssl.CERT_NONE

HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36 (AgriDiscoveryBot/1.0; +https://inwoovation.org)"
}

DEFAULT_KEYWORDS = [
    # Pure Agriculture
    "agriculture",
    "irrigation",
    "tractor",
    "solar",
    "water efficiency",
    "greenhouse",
    "orchard",
    "dairy methane",
    "specialty crop",
    # Cross-Domain CleanTech & Startup (AgTech / CEA Eligible)
    "clean energy",
    "microgrid",
    "zero emission",
    "climate tech",
    "cleantech",
    "food production",
    "small business"
]

AG_RELATED_TRACKS = [
    "agriculture", "farming", "grower", "irrigation", "water", "food",
    "crop", "greenhouse", "soil", "tractor", "dairy", "agtech", "rural",
    "clean energy", "microgrid", "renewable", "solar", "emissions", "all sectors", "open to all"
]

EXCLUDED_SECTORS = [
    "gambling", "casino", "adult entertainment", "liquor store", "nightclub"
]

def evaluate_cross_domain_eligibility(title: str, text: str) -> dict:
    """Evaluates whether general cleantech, energy, or small business grant is eligible for AgTech/Growers."""
    corpus = (title + " " + text).lower()
    
    # 1. Negative exclusion check
    if any(ex in corpus for ex in EXCLUDED_SECTORS):
        return {"isEligible": False, "isCrossDomain": 0, "matchedTracks": [], "categoryLabel": "Excluded", "badge": "Excluded"}
        
    matched = [t for t in AG_RELATED_TRACKS if t in corpus]
    
    # 2. Check if cross-domain cleantech/startup
    is_cross = any(k in corpus for k in ["clean energy", "microgrid", "zero emission", "climate", "small business", "entrepreneur", "innovation"])
    
    return {
        "isEligible": True,
        "isCrossDomain": 1 if is_cross else 0,
        "matchedTracks": matched[:6],
        "categoryLabel": "California Cross-Domain CleanTech / Startup" if is_cross else "California State Agriculture / Energy",
        "badge": "🚀 Cross-Domain CleanTech / Startup (Ag-Eligible)" if is_cross else "🌾 Agricultural Incentive"
    }

def fetch_url(url: str, timeout: int = 15) -> str:
    """Fetch URL with user-agent headers and resilient timeout handling."""
    req = urllib.request.Request(url, headers=HEADERS)
    with urllib.request.urlopen(req, timeout=timeout, context=SSL_CTX) as resp:
        return resp.read().decode("utf-8", errors="ignore")

class CAGrantRadar:
    """Surveillance radar for California state agencies and regional authorities."""

    def __init__(self, db_path: str = DB_PATH, json_path: str = PRODUCTION_JSON):
        self.db_path = db_path
        self.json_path = json_path
        self.existing_names = set()
        self.existing_urls = set()
        self.existing_candidate_urls = set()
        self._load_existing_registry()

    def _load_existing_registry(self):
        """Loads known grant names and URLs to prevent false candidate flags."""
        # 1. Load from Production JSON
        if os.path.exists(self.json_path):
            try:
                with open(self.json_path, "r", encoding="utf-8") as f:
                    data = json.load(f)
                    for p in data.get("programs", []):
                        name = p.get("name", "").strip().lower()
                        url = p.get("officialUrl", "").strip().lower()
                        if name:
                            self.existing_names.add(name)
                        if url:
                            self.existing_urls.add(url.rstrip("/"))
            except Exception as e:
                print(f"⚠️ Warning loading production JSON: {e}")

        # 2. Load from SQLite Master DB
        if os.path.exists(self.db_path):
            try:
                conn = sqlite3.connect(self.db_path)
                cur = conn.cursor()
                # Check existing programs
                cur.execute("SELECT name, official_url FROM programs")
                for name, url in cur.fetchall():
                    if name:
                        self.existing_names.add(name.strip().lower())
                    if url:
                        self.existing_urls.add(url.strip().lower().rstrip("/"))
                
                # Check existing candidates table
                cur.execute("""
                    CREATE TABLE IF NOT EXISTS discovered_candidates (
                        id INTEGER PRIMARY KEY AUTOINCREMENT,
                        source_platform TEXT NOT NULL,
                        agency_name TEXT NOT NULL,
                        opportunity_title TEXT NOT NULL,
                        opportunity_url TEXT UNIQUE NOT NULL,
                        category TEXT,
                        est_funding_amount TEXT,
                        deadline_text TEXT,
                        status TEXT DEFAULT 'pending_review',
                        discovery_notes TEXT,
                        discovered_at DATETIME DEFAULT CURRENT_TIMESTAMP
                    )
                """)
                cur.execute("SELECT opportunity_url FROM discovered_candidates WHERE opportunity_url IS NOT NULL")
                for (c_url,) in cur.fetchall():
                    if c_url:
                        self.existing_candidate_urls.add(c_url.strip().lower().rstrip("/"))
                conn.close()
            except Exception as e:
                print(f"⚠️ Warning loading SQLite DB: {e}")

        # 3. Load from existing discovered_candidates.json
        if os.path.exists(CANDIDATES_JSON):
            try:
                with open(CANDIDATES_JSON, "r", encoding="utf-8") as f:
                    c_list = json.load(f)
                    for item in c_list:
                        c_url = item.get("opportunityUrl", "").strip().lower().rstrip("/")
                        if c_url:
                            self.existing_candidate_urls.add(c_url)
            except Exception as e:
                print(f"⚠️ Warning loading candidate JSON: {e}")

        print(f"📦 Registry Loaded: {len(self.existing_names)} active programs, {len(self.existing_urls)} URLs, {len(self.existing_candidate_urls)} prior candidates.")

    def is_known(self, title: str, url: str) -> bool:
        """Determines if a candidate grant has already been cataloged."""
        cleaned_url = url.strip().lower().rstrip("/")
        if cleaned_url in self.existing_urls or cleaned_url in self.existing_candidate_urls:
            return True
        
        cleaned_title = title.strip().lower()
        for existing in self.existing_names:
            if len(cleaned_title) > 10 and (cleaned_title in existing or existing in cleaned_title):
                return True
        return False

    def scan_ca_grants_portal(self, keywords=None, max_per_keyword=10):
        """Scans California Grants Portal (grants.ca.gov) across keywords."""
        keywords = keywords or DEFAULT_KEYWORDS
        discovered = []

        print(f"\n🔍 [1/3] Scanning California Grants Portal (grants.ca.gov) for {len(keywords)} keywords...")
        
        for kw in keywords:
            query_url = f"https://www.grants.ca.gov/?s={urllib.parse.quote(kw)}"
            try:
                html = fetch_url(query_url, timeout=12)
                soup = BeautifulSoup(html, "html.parser")
                
                # Find all grant links
                links = soup.find_all("a", href=re.compile(r"https://www\.grants\.ca\.gov/grants/[a-z0-9\-]+/"))
                unique_urls = []
                for a in links:
                    href = a["href"].split("?")[0].rstrip("/") + "/"
                    if href not in unique_urls and "/feed/" not in href and "/page/" not in href:
                        unique_urls.append(href)

                print(f"  • Keyword '{kw}': Found {len(unique_urls)} matching grant pages.")

                for detail_url in unique_urls[:max_per_keyword]:
                    if detail_url.lower().rstrip("/") in self.existing_urls or detail_url.lower().rstrip("/") in self.existing_candidate_urls:
                        continue
                    
                    try:
                        detail_html = fetch_url(detail_url, timeout=10)
                        dsoup = BeautifulSoup(detail_html, "html.parser")
                        h1 = dsoup.find("h1")
                        title = h1.get_text(strip=True) if h1 else "Unknown CA Grant"

                        if self.is_known(title, detail_url):
                            continue

                        text_corpus = dsoup.get_text(" ", strip=True)
                        
                        agency = "California State Agency"
                        dept_match = re.search(r"Department[:\s]+([^\n\r\t,]+)", text_corpus, re.I)
                        if dept_match:
                            agency = dept_match.group(1).strip()
                        elif "CDFA" in text_corpus or "Food and Agriculture" in text_corpus:
                            agency = "California Department of Food and Agriculture (CDFA)"
                        elif "CARB" in text_corpus or "Air Resources Board" in text_corpus:
                            agency = "California Air Resources Board (CARB)"
                        elif "Energy Commission" in text_corpus or "CEC" in text_corpus:
                            agency = "California Energy Commission (CEC)"

                        funding = "See official announcement"
                        fund_match = re.search(r"(\$[0-9,]+(?:\s*–\s*\$[0-9,]+|\s*to\s*\$[0-9,]+)?)", text_corpus)
                        if fund_match:
                            funding = fund_match.group(1).strip()

                        deadline = "Check announcement"
                        dl_match = re.search(r"Application deadline[^\n\r:]*:\s*([0-9]{1,2}/[0-9]{1,2}/[0-9]{2,4}[^\n\r<]*)", text_corpus, re.I)
                        if dl_match:
                            deadline = dl_match.group(1).strip()

                        eval_res = evaluate_cross_domain_eligibility(title, text_corpus)
                        if not eval_res["isEligible"]:
                            continue

                        candidate = {
                            "sourcePlatform": "grants_ca_gov",
                            "agencyName": agency,
                            "opportunityTitle": title,
                            "opportunityUrl": detail_url,
                            "category": eval_res["categoryLabel"],
                            "estFundingAmount": funding,
                            "deadlineText": deadline,
                            "isCrossDomain": eval_res["isCrossDomain"],
                            "matchedTracks": eval_res["matchedTracks"],
                            "badge": eval_res["badge"],
                            "status": "pending_review",
                            "discoveryNotes": f"Discovered via keyword '{kw}' | Tracks: {', '.join(eval_res['matchedTracks']) or 'General'}",
                            "discoveredAt": datetime.now().isoformat()
                        }
                        discovered.append(candidate)
                        self.existing_candidate_urls.add(detail_url.lower().rstrip("/"))
                        print(f"    ✨ DISCOVERED NEW: [{agency}] {title} ({funding}) [{'CROSS-DOMAIN' if eval_res['isCrossDomain'] else 'PURE-AG'}]")
                        time.sleep(0.4)
                    except Exception as e_detail:
                        print(f"    ⚠️ Error extracting {detail_url}: {e_detail}")

            except Exception as e_kw:
                print(f"  ⚠️ Error querying keyword '{kw}': {e_kw}")

        return discovered

    def scan_regional_air_districts(self):
        """Scans San Joaquin Valley APCD and regional ag incentive feeds."""
        discovered = []
        print("\n🔍 [2/3] Scanning Regional Air Quality Management Districts (SJVAPCD, etc.)...")
        
        sjv_url = "https://ww2.valleyair.org/grants/"
        try:
            html = fetch_url(sjv_url, timeout=12)
            soup = BeautifulSoup(html, "html.parser")
            for link in soup.find_all("a", href=True):
                href = urllib.parse.urljoin(sjv_url, link["href"])
                text = link.get_text(" ", strip=True)
                if any(term in text.lower() for term in ["agricultural", "tractor", "burn alternative", "engine", "irrigation pump"]):
                    if not self.is_known(text, href):
                        candidate = {
                            "sourcePlatform": "sjvapcd",
                            "agencyName": "San Joaquin Valley Air Pollution Control District (SJVAPCD)",
                            "opportunityTitle": text,
                            "opportunityUrl": href,
                            "category": "Ag Emission Reduction & Clean Machinery",
                            "estFundingAmount": "Rebate / Emission Incentive",
                            "deadlineText": "Rolling / Check Program Guidelines",
                            "status": "pending_review",
                            "discoveryNotes": "Discovered via SJVAPCD Official Grants Portal",
                            "discoveredAt": datetime.now().isoformat()
                        }
                        discovered.append(candidate)
                        self.existing_candidate_urls.add(href.lower().rstrip("/"))
                        print(f"    ✨ DISCOVERED NEW: [SJVAPCD] {text}")
        except Exception as e:
            print(f"  ⚠️ SJVAPCD scan error: {e}")

        return discovered

    def scan_uc_anr_extension(self):
        """Scans UC ANR Agriculture and Natural Resources funding notices."""
        discovered = []
        print("\n🔍 [3/3] Scanning UC ANR (University of California Ag & Natural Resources)...")
        
        uc_url = "https://ucanr.edu/sites/grantsearch/"
        try:
            html = fetch_url(uc_url, timeout=12)
            soup = BeautifulSoup(html, "html.parser")
            for link in soup.find_all("a", href=True):
                href = urllib.parse.urljoin(uc_url, link["href"])
                text = link.get_text(" ", strip=True)
                if len(text) > 12 and any(k in text.lower() for k in ["grant", "award", "funding", "specialty", "fellowship"]):
                    if not self.is_known(text, href):
                        candidate = {
                            "sourcePlatform": "uc_anr",
                            "agencyName": "University of California ANR / Extension",
                            "opportunityTitle": text,
                            "opportunityUrl": href,
                            "category": "Agricultural Research & Demonstration",
                            "estFundingAmount": "Variable Award",
                            "deadlineText": "See UC ANR notice",
                            "status": "pending_review",
                            "discoveryNotes": "Discovered via UC ANR Grants Portal",
                            "discoveredAt": datetime.now().isoformat()
                        }
                        discovered.append(candidate)
                        self.existing_candidate_urls.add(href.lower().rstrip("/"))
                        print(f"    ✨ DISCOVERED NEW: [UC ANR] {text}")
        except Exception as e:
            print(f"  ⚠️ UC ANR scan notice: {e}")

        return discovered

    def persist_candidates(self, candidates):
        """Persists candidates to both JSON and SQLite database."""
        if not candidates:
            print("\nℹ️ No new candidates to persist.")
            return

        # 1. Update discovered_candidates.json
        existing_list = []
        if os.path.exists(CANDIDATES_JSON):
            try:
                with open(CANDIDATES_JSON, "r", encoding="utf-8") as f:
                    existing_list = json.load(f)
            except Exception as e:
                print(f"⚠️ Error reading existing candidates JSON: {e}")

        existing_urls = {item.get("opportunityUrl", "").strip().lower().rstrip("/") for item in existing_list}
        added_count = 0
        for cand in candidates:
            cand_url = cand.get("opportunityUrl", "").strip().lower().rstrip("/")
            if cand_url not in existing_urls:
                existing_list.append(cand)
                existing_urls.add(cand_url)
                added_count += 1

        os.makedirs(os.path.dirname(CANDIDATES_JSON), exist_ok=True)
        with open(CANDIDATES_JSON, "w", encoding="utf-8") as f:
            json.dump(existing_list, f, indent=2, ensure_ascii=False)
        print(f"💾 Persisted {added_count} new candidates to: {CANDIDATES_JSON}")

        # 2. Insert into SQLite DB
        if os.path.exists(self.db_path):
            try:
                conn = sqlite3.connect(self.db_path)
                cur = conn.cursor()
                cur.execute("""
                    CREATE TABLE IF NOT EXISTS discovered_candidates (
                        id INTEGER PRIMARY KEY AUTOINCREMENT,
                        source_platform TEXT NOT NULL,
                        agency_name TEXT NOT NULL,
                        opportunity_title TEXT NOT NULL,
                        opportunity_url TEXT UNIQUE NOT NULL,
                        category TEXT,
                        est_funding_amount TEXT,
                        deadline_text TEXT,
                        is_cross_domain INTEGER NOT NULL DEFAULT 0,
                        matched_tracks TEXT,
                        status TEXT DEFAULT 'pending_review',
                        discovery_notes TEXT,
                        discovered_at DATETIME DEFAULT CURRENT_TIMESTAMP
                    )
                """)
                db_added = 0
                for cand in candidates:
                    try:
                        cur.execute("""
                            INSERT OR IGNORE INTO discovered_candidates (
                                source_platform, agency_name, opportunity_title, opportunity_url,
                                category, est_funding_amount, deadline_text, is_cross_domain, matched_tracks,
                                status, discovery_notes, discovered_at
                            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                        """, (
                            cand["sourcePlatform"],
                            cand["agencyName"],
                            cand["opportunityTitle"],
                            cand["opportunityUrl"],
                            cand["category"],
                            cand["estFundingAmount"],
                            cand["deadlineText"],
                            cand.get("isCrossDomain", 0),
                            json.dumps(cand.get("matchedTracks", []), ensure_ascii=False),
                            cand["status"],
                            cand["discoveryNotes"],
                            cand["discoveredAt"]
                        ))
                        if cur.rowcount > 0:
                            db_added += 1
                    except Exception:
                        pass
                conn.commit()
                conn.close()
                print(f"🗄️ Inserted {db_added} records into SQLite `discovered_candidates` table.")
            except Exception as e_db:
                print(f"⚠️ SQLite insertion error: {e_db}")

def main():
    print("=" * 78)
    print("🌾 CALIFORNIA AGRI-GRANTS & UNREGISTERED AGENCY AUTONOMOUS RADAR")
    print("=" * 78)
    
    radar = CAGrantRadar()
    
    all_candidates = []
    
    # 1. Scan CA Grants Portal across pure ag and cross-domain cleantech/startup terms
    all_candidates.extend(radar.scan_ca_grants_portal(keywords=DEFAULT_KEYWORDS))
    
    # 2. Scan Regional Air Districts
    all_candidates.extend(radar.scan_regional_air_districts())
    
    # 3. Scan UC ANR Extension
    all_candidates.extend(radar.scan_uc_anr_extension())

    print("\n" + "=" * 78)
    print(f"📊 RADAR SCAN COMPLETE: {len(all_candidates)} NEW CANDIDATE GRANTS IDENTIFIED")
    print("=" * 78)

    radar.persist_candidates(all_candidates)

    if all_candidates:
        print("\n📋 Top Discovered Candidates Ready for Review:")
        for idx, cand in enumerate(all_candidates[:5], 1):
            print(f" {idx}. [{cand['agencyName']}] {cand['opportunityTitle']}")
            print(f"    URL: {cand['opportunityUrl']}")
            print(f"    Est. Amount: {cand['estFundingAmount']} | Deadline: {cand['deadlineText']}")
            print("-" * 60)

if __name__ == "__main__":
    main()
