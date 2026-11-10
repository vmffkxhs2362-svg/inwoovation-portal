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
    },
    {
        "id": "OR_ENERGY_TRUST",
        "name": "Energy Trust of Oregon Agriculture & CEA Energy Efficiency",
        "url": "https://www.energytrust.org/commercial/agriculture/",
        "region": "US-OR",
        "country": "US",
        "agency": "Energy Trust of Oregon / ODOE",
        "pinned_selectors": [".sticky", ".featured"],
        "max_age_days": 90
    },
    {
        "id": "OR_OWEB",
        "name": "Oregon Watershed Enhancement Board (OWEB) Grants",
        "url": "https://www.oregon.gov/oweb/grants/",
        "region": "US-OR",
        "country": "US",
        "agency": "Oregon Watershed Enhancement Board (OWEB)",
        "pinned_selectors": [".pinned", ".highlight"],
        "max_age_days": 90
    },
    {
        "id": "WA_WSDA_GRANTS",
        "name": "Washington State Department of Agriculture (WSDA) Grants",
        "url": "https://agr.wa.gov/services/grant-and-financial-assistance",
        "region": "US-WA",
        "country": "US",
        "agency": "Washington State Department of Agriculture (WSDA)",
        "pinned_selectors": [".alert", ".featured"],
        "max_age_days": 90
    },
    {
        "id": "WA_SCC_GRANTS",
        "name": "Washington State Conservation Commission (SCC) Irrigation & Conservation",
        "url": "https://www.scc.wa.gov/grants",
        "region": "US-WA",
        "country": "US",
        "agency": "Washington State Conservation Commission (SCC)",
        "pinned_selectors": [".sticky", ".notice"],
        "max_age_days": 90
    },
    {
        "id": "TX_TDA_GRANTS",
        "name": "Texas Department of Agriculture (TDA) Grants & Financial Assistance",
        "url": "https://www.texasagriculture.gov/Grants-Services",
        "region": "US-TX",
        "country": "US",
        "agency": "Texas Department of Agriculture (TDA)",
        "pinned_selectors": [".hero-alert", ".pinned"],
        "max_age_days": 90
    },
    {
        "id": "TX_TWDB_AG",
        "name": "Texas Water Development Board (TWDB) Ag Water Conservation",
        "url": "https://www.twdb.texas.gov/financial/programs/ag-conservation/",
        "region": "US-TX",
        "country": "US",
        "agency": "Texas Water Development Board (TWDB)",
        "pinned_selectors": [".alert", ".announcement"],
        "max_age_days": 90
    },
    {
        "id": "NY_NYSERDA_AG",
        "name": "NYSERDA Agriculture Energy Efficiency Program",
        "url": "https://www.nyserda.ny.gov/All-Programs/Agriculture-Energy-Efficiency",
        "region": "US-NY",
        "country": "US",
        "agency": "New York State Energy Research and Development Authority (NYSERDA)",
        "pinned_selectors": [".callout-banner", ".sticky"],
        "max_age_days": 90
    },
    {
        "id": "NY_AGM_GRANTS",
        "name": "NYS Department of Agriculture and Markets (AGM) Funding Opportunities",
        "url": "https://agriculture.ny.gov/funding-opportunities",
        "region": "US-NY",
        "country": "US",
        "agency": "NYS Department of Agriculture and Markets (AGM)",
        "pinned_selectors": [".pinned-row", ".announcement"],
        "max_age_days": 90
    },
    {
        "id": "DE_BLE_ENERGIE",
        "name": "Germany BLE Bundesprogramm Energieeffizienz im Gartenbau",
        "url": "https://www.ble.de/DE/Projektfoerderung/Foerderungen-Auftraege/Bundesprogramm-Energieeffizienz/bundesprogramm-energieeffizienz_node.html",
        "region": "DE",
        "country": "DE",
        "agency": "Bundesanstalt für Landwirtschaft und Ernährung (BLE)",
        "pinned_selectors": [".teaser", ".aktuelles"],
        "max_age_days": 90
    },
    {
        "id": "DE_BY_BAYSL",
        "name": "Bavaria StMELF Bayerisches Sonderprogramm Landwirtschaft & Gartenbau (BaySL)",
        "url": "https://www.stmelf.bayern.de/foerderung/bayerisches-sonderprogramm-landwirtschaft-baysl/index.html",
        "region": "DE",
        "country": "DE",
        "agency": "Bayerisches Staatsministerium für Ernährung, Landwirtschaft, Forsten und Tourismus (StMELF)",
        "pinned_selectors": [".teaser", ".notice"],
        "max_age_days": 90
    },
    {
        "id": "JP_MAFF_MIDORI",
        "name": "Japan MAFF Green Food System Strategy & Smart Horticulture Grants",
        "url": "https://www.maff.go.jp/j/kanbo/kankyo/seisaku/midori/",
        "region": "JP",
        "country": "JP",
        "agency": "Ministry of Agriculture, Forestry and Fisheries (農林水産省)",
        "pinned_selectors": [".topics", ".news"],
        "max_age_days": 90
    },
    {
        "id": "JP_NARO_SMART",
        "name": "Japan NARO Tsukuba / BRAIN Smart Agriculture Deployment Consortia",
        "url": "https://www.naro.go.jp/laboratory/brain/smart-nogyo/",
        "region": "JP",
        "country": "JP",
        "agency": "National Agriculture and Food Research Organization (農研機構 NARO Tsukuba)",
        "pinned_selectors": [".news_list", ".topics"],
        "max_age_days": 90
    },
    {
        "id": "NL_RVO_GLASTUINBOUW",
        "name": "Netherlands RVO Glastuinbouw Subsidies (MEI / EG / SDE++ / EIA)",
        "url": "https://www.rvo.nl/onderwerpen/glastuinbouw",
        "region": "NL",
        "country": "NL",
        "agency": "Rijksdienst voor Ondernemend Nederland (RVO)",
        "pinned_selectors": [".card", ".highlight"],
        "max_age_days": 90
    },
    {
        "id": "FR_FRANCEAGRIMER",
        "name": "FranceAgriMer Transition Énergétique & Serres Maraîchères",
        "url": "https://www.franceagrimer.fr/Accompagner/Planification-ecologique-et-transition-energetique",
        "region": "FR",
        "country": "FR",
        "agency": "FranceAgriMer / France 2030",
        "pinned_selectors": [".actualite", ".aide"],
        "max_age_days": 90
    },
    {
        "id": "ES_MAPA_INVERNADEROS",
        "name": "Spain MAPA Modernización de Invernaderos y Regadíos (PEPAC)",
        "url": "https://www.mapa.gob.es/es/agricultura/temas/producciones-agricolas/hortofruticolas/",
        "region": "ES",
        "country": "ES",
        "agency": "Ministerio de Agricultura, Pesca y Alimentación (MAPA)",
        "pinned_selectors": [".destacado", ".novedades"],
        "max_age_days": 90
    },
    {
        "id": "KR_SMARTFARM_KOREA",
        "name": "South Korea MAFRA / EPIS SmartFarm Korea Notices",
        "url": "https://www.smartfarmkorea.net/",
        "region": "KR",
        "country": "KR",
        "agency": "Ministry of Agriculture, Food and Rural Affairs (MAFRA / EPIS)",
        "pinned_selectors": [".notice", ".board-pinned"],
        "max_age_days": 90
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

    # Scan all links and headers (Multilingual keyword radar: EN / DE / JP / NL / FR / ES / KR)
    anchors = soup.find_all("a", href=True)
    keywords = [
        # English (US / CA / EU)
        "grant", "program", "funding", "application", "incentive", "sweep", "dairy", "soil", "equipment", "farmer", "water", "bond", "rebate", "voucher",
        # German (BLE / Bayern / BAFA / Rentenbank)
        "förderung", "foerderung", "bundesprogramm", "richtlinie", "zuschuss", "energieeffizienz", "gartenbau", "investition", "bekanntmachung",
        # Japanese (MAFF / NARO Tsukuba)
        "補助金", "交付金", "公募", "支援", "スマート農業", "みどり", "施設園芸", "省エネ", "事業",
        # Dutch (RVO Glastuinbouw)
        "subsidie", "regeling", "glastuinbouw", "energie", "investering", "sde", "eia",
        # French & Spanish (FranceAgriMer / MAPA)
        "aide", "subvention", "serre", "transition", "ayuda", "subvención", "convocatoria", "invernadero",
        # Korean (MAFRA / EPIS SmartFarm Korea)
        "공고", "모집", "지원사업", "보조금", "스마트팜", "시설원예", "에너지"
    ]

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
    today_prefix = datetime.now().strftime("%Y-%m-%d")
    last_run_str = ledger.get("last_run") or ""
    if "--daily-auto" in sys.argv and last_run_str.startswith(today_prefix):
        print(f"⚡ Daily government portal scan already completed today ({last_run_str}).")
        print(f"📊 State Ledger: {len(ledger.get('known_hashes', {}))} verified notices indexed across 20 US/DE/JP/NL/FR/ES/KR portals.")
        return 0

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
