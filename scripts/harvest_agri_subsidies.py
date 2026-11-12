#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Agri-Subsidy & Grant Automated Harvest Pipeline (v5.0 Hyper-Local Multi-Tier Radar)
===================================================================================
Automated scraper, schema verifier & surveillance engine across 73 multi-tier
(Federal / Regional / Municipal) agricultural & CEA incentive portals in 8 countries:
  - Germany (DE): Federal (BMEL, BLE, Rentenbank) + 7 Bundesländer / LWK
  - Japan (JP): National (MAFF, Smart Agri, NARO Tsukuba) + 7 Prefectures / Tsukuba City
  - Netherlands (NL): National (RVO SDE++/EIA/MIA) + 3 Greenport Provinces
  - France (FR): National (FranceAgriMer, ADEME Fonds Chaleur) + 3 Horticultural Regions
  - Spain (ES): National (MAPA, IDAE) + Andalucía/Almería, Valencia/IVIA, Murcia
  - Canada (CA): Federal (AAFC Sustainable CAP) + OMAFRA Leamington, CleanBC Fraser, MAPAQ
  - United States (US): Federal (USDA NRCS EQIP, REAP) + 23 State Depts & Air/Water Districts
  - South Korea (KR): Central (SmartFarm Korea, MAFRA, RDA, KRC) + 4 Provincial Clusters +
                      Si-Gun-Gu Agricultural Tech Centers & Eup-Myeon-Dong Local Offices

CLI Modes:
  - `--fast-daily`: Deterministic <2s DB schema + active deadline + 8-country 3-tier coverage audit
                    (safe for daily `build_all.py` runs without hammering 73 government servers).
  - Default / `--live`: Live HTTP solicitation scraping with Anti-Sticky 3-Tier Filter & SHA-256 dedup.
  - Optional filters: `--country DE`, `--tier Municipal`, `--limit 5`, `--timeout 6`.
"""

import os
import sys
import re
import json
import time
import ssl
import hashlib
import sqlite3
import argparse
import urllib.request
from concurrent.futures import ThreadPoolExecutor, as_completed
from datetime import datetime
from bs4 import BeautifulSoup

# Ensure UTF-8 stdout on Windows consoles
if hasattr(sys.stdout, "reconfigure"):
    try:
        sys.stdout.reconfigure(encoding="utf-8")
    except Exception:
        pass

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
    "User-Agent": (
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 "
        "(KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36 "
        "(InwoovationAgriRadar/5.0; +https://inwoovation.com)"
    )
}

TARGET_PORTALS = [
    # =========================================================================
    # 1. GERMANY (DE) — Federal + Regional Bundesländer & Landwirtschaftskammern
    # =========================================================================
    {
        "id": "DE_BMEL_FOERDERUNG",
        "name": "Germany BMEL Federal Agricultural & Horticultural Funding Portal",
        "url": "https://www.bmel.de/",
        "tier": "Federal",
        "region": "DE-FED",
        "country": "DE",
        "agency": "Bundesministerium für Ernährung und Landwirtschaft (BMEL)",
        "pinned_selectors": [".teaser", ".aktuelles"],
        "max_age_days": 90
    },
    {
        "id": "DE_BLE_ENERGIE",
        "name": "Germany BLE Bundesprogramm Energieeffizienz im Gartenbau",
        "url": "https://www.bundesprogramm-energieeffizienz.de/",
        "tier": "Federal",
        "region": "DE-FED",
        "country": "DE",
        "agency": "Bundesanstalt für Landwirtschaft und Ernährung (BLE)",
        "pinned_selectors": [".teaser", ".aktuelles"],
        "max_age_days": 90
    },
    {
        "id": "DE_RENTENBANK_AGRAR",
        "name": "Germany Rentenbank Zukunftsfelder im Gartenbau & Investitionskredite",
        "url": "https://www.rentenbank.de/foerderangebote/landwirtschaft/",
        "tier": "Federal",
        "region": "DE-FED",
        "country": "DE",
        "agency": "Landwirtschaftliche Rentenbank",
        "pinned_selectors": [".teaser", ".sticky"],
        "max_age_days": 90
    },
    {
        "id": "DE_BY_BAYSL",
        "name": "Bavaria StMELF BaySL & KULAP Gewächshaus- / Gartenbauförderung",
        "url": "https://www.stmelf.bayern.de/foerderung/bayerisches-sonderprogramm-landwirtschaft-baysl/index.html",
        "tier": "Regional",
        "region": "DE-BY",
        "country": "DE",
        "agency": "Bayerisches Staatsministerium für Ernährung, Landwirtschaft, Forsten und Tourismus (StMELF Bayern)",
        "pinned_selectors": [".teaser", ".notice"],
        "max_age_days": 90
    },
    {
        "id": "DE_NRW_LWK",
        "name": "LWK Nordrhein-Westfalen AFP & EIP-Agri Unterglas-Modernisierung",
        "url": "https://www.landwirtschaftskammer.de/foerderung/index.htm",
        "tier": "Regional",
        "region": "DE-NW",
        "country": "DE",
        "agency": "Landwirtschaftskammer Nordrhein-Westfalen (LWK NRW)",
        "pinned_selectors": [".aktuell", ".hinweis"],
        "max_age_days": 90
    },
    {
        "id": "DE_NI_LWK",
        "name": "LWK Niedersachsen Agrarinvestitionsförderungsprogramm (AFP Gartenbau)",
        "url": "https://www.lwk-niedersachsen.de/lwk/foerderung",
        "tier": "Regional",
        "region": "DE-NI",
        "country": "DE",
        "agency": "Landwirtschaftskammer Niedersachsen (LWK Niedersachsen)",
        "pinned_selectors": [".teaser", ".sticky"],
        "max_age_days": 90
    },
    {
        "id": "DE_BW_MLR",
        "name": "MLR Baden-Württemberg Agrarinvestitionsförderungsprogramm (AFP BW)",
        "url": "https://foerderung.landwirtschaft-bw.de/",
        "tier": "Regional",
        "region": "DE-BW",
        "country": "DE",
        "agency": "Ministerium für Ernährung, Ländlichen Raum und Verbraucherschutz Baden-Württemberg (MLR BW)",
        "pinned_selectors": [".hinweis", ".teaser"],
        "max_age_days": 90
    },
    {
        "id": "DE_SN_SMEKUL",
        "name": "SMEKUL Sachsen Richtlinie Landwirtschaft, Gartenbau & Klimaschutz",
        "url": "https://www.lsnq.de/landwirtschaft",
        "tier": "Regional",
        "region": "DE-SN",
        "country": "DE",
        "agency": "Sächsisches Staatsministerium für Energie, Klimaschutz, Umwelt und Landwirtschaft (SMEKUL)",
        "pinned_selectors": [".teaser", ".notice"],
        "max_age_days": 90
    },
    {
        "id": "DE_HE_HMLU",
        "name": "HMLU Hessen Agrarinvestitionsförderung & Spezialkulturen",
        "url": "https://landwirtschaft.hessen.de/foerderung",
        "tier": "Regional",
        "region": "DE-HE",
        "country": "DE",
        "agency": "Hessisches Ministerium für Landwirtschaft und Umwelt (HMLU / WIBank)",
        "pinned_selectors": [".teaser", ".aktuelles"],
        "max_age_days": 90
    },
    {
        "id": "DE_RP_MWVLW",
        "name": "MWVLW Rheinland-Pfalz Agrarförderung & Gartenbau Pfalz",
        "url": "https://mwvlw.rlp.de/themen/landwirtschaft/foerderung",
        "tier": "Regional",
        "region": "DE-RP",
        "country": "DE",
        "agency": "Ministerium für Wirtschaft, Verkehr, Landwirtschaft und Weinbau Rheinland-Pfalz (MWVLW)",
        "pinned_selectors": [".teaser", ".hinweis"],
        "max_age_days": 90
    },

    # =========================================================================
    # 2. JAPAN (JP) — National + Prefectural & Municipal (Tsukuba / Kochi / etc.)
    # =========================================================================
    {
        "id": "JP_MAFF_MIDORI",
        "name": "Japan MAFF Green Food System Strategy & Smart Horticulture Grants",
        "url": "https://www.maff.go.jp/j/kanbo/kankyo/seisaku/midori/",
        "tier": "Federal",
        "region": "JP-NAT",
        "country": "JP",
        "agency": "Ministry of Agriculture, Forestry and Fisheries (農林水産省 MAFF)",
        "pinned_selectors": [".topics", ".news"],
        "max_age_days": 90
    },
    {
        "id": "JP_MAFF_SMART_AGRI",
        "name": "Japan MAFF Smart Agriculture Promotion & Facility Horticulture Subsidies",
        "url": "https://www.maff.go.jp/j/kanbo/smart/",
        "tier": "Federal",
        "region": "JP-NAT",
        "country": "JP",
        "agency": "MAFF Smart Agriculture Acceleration Division (農林水産省 スマート農業推進室)",
        "pinned_selectors": [".topics", ".pickup"],
        "max_age_days": 90
    },
    {
        "id": "JP_NARO_SMART",
        "name": "Japan NARO Tsukuba / BRAIN Smart Agriculture Deployment Consortia",
        "url": "https://www.naro.go.jp/laboratory/brain/smart-nogyo/",
        "tier": "Federal",
        "region": "JP-08-TSUKUBA",
        "country": "JP",
        "agency": "National Agriculture and Food Research Organization (農研機構 NARO Tsukuba)",
        "pinned_selectors": [".news_list", ".topics"],
        "max_age_days": 90
    },
    {
        "id": "JP_IBARAKI_PREF_AGRI",
        "name": "Ibaraki Prefecture Smart Horticulture & Heat-Pump Subsidies",
        "url": "https://www.pref.ibaraki.jp/nourinsuisan/nosan/engei/",
        "tier": "Regional",
        "region": "JP-08",
        "country": "JP",
        "agency": "Ibaraki Prefectural Government Agriculture, Forestry & Fisheries Dept (茨城県農林水産部)",
        "pinned_selectors": [".oshirase", ".emergency"],
        "max_age_days": 90
    },
    {
        "id": "JP_TSUKUBA_CITY_SMART",
        "name": "Tsukuba City Smart Agriculture & Protected Horticulture Municipal Grants",
        "url": "https://www.city.tsukuba.lg.jp/shigoto/sangyo/nogyo/",
        "tier": "Municipal",
        "region": "JP-08-TSUKUBA",
        "country": "JP",
        "agency": "Tsukuba City Agriculture Policy Division (つくば市経済部農業政策課)",
        "pinned_selectors": [".important", ".pickup"],
        "max_age_days": 90
    },
    {
        "id": "JP_AICHI_PREF_HORT",
        "name": "Aichi Prefecture Facility Horticulture Modernization & Energy Grants",
        "url": "https://www.pref.aichi.jp/soshiki/engei/",
        "tier": "Regional",
        "region": "JP-23",
        "country": "JP",
        "agency": "Aichi Prefecture Horticulture & Agriculture Division (愛知県農業水産局園芸農産課)",
        "pinned_selectors": [".oshirase", ".topics"],
        "max_age_days": 90
    },
    {
        "id": "JP_KOCHI_NEXTGEN_GH",
        "name": "Kochi Prefecture Next-Generation Greenhouse & IoP Cloud Cluster Grants",
        "url": "https://www.pref.kochi.lg.jp/soshiki/160000/160901/",
        "tier": "Regional",
        "region": "JP-39",
        "country": "JP",
        "agency": "Kochi Prefecture Next-Generation Greenhouse Promotion Division (高知県農業振興部次世代型施設園芸推進課)",
        "pinned_selectors": [".oshirase", ".new"],
        "max_age_days": 90
    },
    {
        "id": "JP_KUMAMOTO_PREF_AGRI",
        "name": "Kumamoto Prefecture Protected Horticulture & Heat-Pump Transition",
        "url": "https://www.pref.kumamoto.jp/soshiki/75/",
        "tier": "Regional",
        "region": "JP-43",
        "country": "JP",
        "agency": "Kumamoto Prefecture Agricultural Production Division (熊本県農林水産部農산園芸課)",
        "pinned_selectors": [".oshirase", ".topics"],
        "max_age_days": 90
    },
    {
        "id": "JP_CHIBA_PREF_AGRI",
        "name": "Chiba Prefecture Smart Greenhouse & Strawberry/Tomato Facility Grants",
        "url": "https://www.pref.chiba.lg.jp/seisan/engei/",
        "tier": "Regional",
        "region": "JP-12",
        "country": "JP",
        "agency": "Chiba Prefecture Agriculture, Forestry & Fisheries Dept (千葉県農林水産部生産振興課)",
        "pinned_selectors": [".oshirase", ".topics"],
        "max_age_days": 90
    },
    {
        "id": "JP_SHIZUOKA_PREF_AGRI",
        "name": "Shizuoka Prefecture Next-Gen Horticulture & Smart Greenhouse Subsidies",
        "url": "https://www.pref.shizuoka.jp/sangyoshigoto/nogyo/",
        "tier": "Regional",
        "region": "JP-22",
        "country": "JP",
        "agency": "Shizuoka Prefecture Economy & Industry Agriculture Bureau (静岡県経済産業部農業局)",
        "pinned_selectors": [".oshirase", ".pickup"],
        "max_age_days": 90
    },

    # =========================================================================
    # 3. NETHERLANDS (NL) — National RVO + Provincial Greenport Clusters
    # =========================================================================
    {
        "id": "NL_RVO_GLASTUINBOUW",
        "name": "Netherlands RVO Glastuinbouw Subsidies (SDE++ / EIA / MIA / MEI / EG)",
        "url": "https://www.rvo.nl/onderwerpen/glastuinbouw",
        "tier": "Federal",
        "region": "NL-NAT",
        "country": "NL",
        "agency": "Rijksdienst voor Ondernemend Nederland (RVO)",
        "pinned_selectors": [".card", ".highlight"],
        "max_age_days": 90
    },
    {
        "id": "NL_ZH_GREENPORT_WESTLAND",
        "name": "Provincie Zuid-Holland / Greenport Westland-Oostland Warmte & Glastuinbouw",
        "url": "https://www.zuid-holland.nl/loket/subsidies/",
        "tier": "Regional",
        "region": "NL-ZH",
        "country": "NL",
        "agency": "Provincie Zuid-Holland & Greenport Westland-Oostland",
        "pinned_selectors": [".featured", ".sticky"],
        "max_age_days": 90
    },
    {
        "id": "NL_NH_AGRIPORT_A7",
        "name": "Provincie Noord-Holland / Agriport A7 & Greenport NHN Subsidieloket",
        "url": "https://www.noord-holland.nl/Loket/Subsidies",
        "tier": "Regional",
        "region": "NL-NH",
        "country": "NL",
        "agency": "Provincie Noord-Holland / Greenport Noord-Holland Noord",
        "pinned_selectors": [".featured", ".sticky"],
        "max_age_days": 90
    },
    {
        "id": "NL_LI_BRIGHTLANDS",
        "name": "Provincie Limburg / Brightlands Campus Greenport Venlo Agri-Tech Grants",
        "url": "https://www.limburg.nl/loket/subsidies/",
        "tier": "Regional",
        "region": "NL-LI",
        "country": "NL",
        "agency": "Provincie Limburg & Brightlands Campus Greenport Venlo",
        "pinned_selectors": [".highlight", ".sticky"],
        "max_age_days": 90
    },

    # =========================================================================
    # 4. FRANCE (FR) — National (FranceAgriMer, ADEME) + Regional Serres
    # =========================================================================
    {
        "id": "FR_FRANCEAGRIMER",
        "name": "FranceAgriMer Transition Énergétique & Serres Maraîchères",
        "url": "https://www.franceagrimer.fr/Accompagner/Planification-ecologique-et-transition-energetique",
        "tier": "Federal",
        "region": "FR-NAT",
        "country": "FR",
        "agency": "FranceAgriMer / France 2030",
        "pinned_selectors": [".actualite", ".aide"],
        "max_age_days": 90
    },
    {
        "id": "FR_ADEME_FONDS_CHALEUR",
        "name": "ADEME Fonds Chaleur & Décarbonation des Serres Horticoles",
        "url": "https://agirpourlatransition.ademe.fr/entreprises/aides-financieres",
        "tier": "Federal",
        "region": "FR-NAT",
        "country": "FR",
        "agency": "Agence de la transition écologique (ADEME)",
        "pinned_selectors": [".featured", ".mise-en-avant"],
        "max_age_days": 90
    },
    {
        "id": "FR_SUD_PACA_SERRES",
        "name": "Région Sud Provence-Alpes-Côte d'Azur (PACA) Modernisation des Serres",
        "url": "https://www.maregionsud.fr/aides-et-appels-a-projets",
        "tier": "Regional",
        "region": "FR-PAC",
        "country": "FR",
        "agency": "Conseil Régional Provence-Alpes-Côte d'Azur (Région Sud)",
        "pinned_selectors": [".epingle", ".featured"],
        "max_age_days": 90
    },
    {
        "id": "FR_BRETAGNE_AGRI",
        "name": "Région Bretagne Aides Agri-Invest & Transition Serres",
        "url": "https://www.bretagne.bzh/aides/",
        "tier": "Regional",
        "region": "FR-BRE",
        "country": "FR",
        "agency": "Conseil Régional de Bretagne",
        "pinned_selectors": [".epingle", ".featured"],
        "max_age_days": 90
    },
    {
        "id": "FR_PDL_VEGEPOLYS",
        "name": "Région Pays de la Loire / Végépolys Valley Filières Végétales & Serres",
        "url": "https://www.paysdelaloire.fr/les-aides",
        "tier": "Regional",
        "region": "FR-PDL",
        "country": "FR",
        "agency": "Région Pays de la Loire & Pôle Végépolys Valley",
        "pinned_selectors": [".epingle", ".featured"],
        "max_age_days": 90
    },

    # =========================================================================
    # 5. SPAIN (ES) — National (MAPA, IDAE) + Andalucía/Almería, Valencia, Murcia
    # =========================================================================
    {
        "id": "ES_MAPA_INVERNADEROS",
        "name": "Spain MAPA Modernización de Invernaderos y Regadíos (PEPAC)",
        "url": "https://www.mapa.gob.es/es/agricultura/temas/producciones-agricolas/hortofruticolas/",
        "tier": "Federal",
        "region": "ES-NAT",
        "country": "ES",
        "agency": "Ministerio de Agricultura, Pesca y Alimentación (MAPA)",
        "pinned_selectors": [".destacado", ".novedades"],
        "max_age_days": 90
    },
    {
        "id": "ES_IDAE_EFICIENCIA_AGRO",
        "name": "Spain IDAE Eficiencia Energética en Explotaciones Agropecuarias",
        "url": "https://www.idae.es/ayudas-y-financiacion",
        "tier": "Federal",
        "region": "ES-NAT",
        "country": "ES",
        "agency": "Instituto para la Diversificación y Ahorro de la Energía (IDAE)",
        "pinned_selectors": [".destacado", ".aviso"],
        "max_age_days": 90
    },
    {
        "id": "ES_AND_ALMERIA_INVERNADEROS",
        "name": "Junta de Andalucía — Almería Modernización de Invernaderos",
        "url": "https://www.juntadeandalucia.es/organismos/agriculturapescaaguaydesarrollorural/servicios.html",
        "tier": "Regional",
        "region": "ES-AN",
        "country": "ES",
        "agency": "Junta de Andalucía — Consejería de Agricultura, Pesca, Agua y Desarrollo Rural",
        "pinned_selectors": [".destacado", ".aviso"],
        "max_age_days": 90
    },
    {
        "id": "ES_GVA_VALENCIA_IVIA",
        "name": "Generalitat Valenciana — IVIA & Modernización Agraria",
        "url": "https://agricultura.gva.es/es/ayudas",
        "tier": "Regional",
        "region": "ES-VC",
        "country": "ES",
        "agency": "Generalitat Valenciana — Conselleria de Agricultura, Agua, Ganadería y Pesca / IVIA",
        "pinned_selectors": [".destacado", ".aviso"],
        "max_age_days": 90
    },
    {
        "id": "ES_MURCIA_AGUA_REGADIO",
        "name": "Región de Murcia — Agua, Agricultura y Modernización de Regadíos",
        "url": "https://www.carm.es/web/pagina?IDCONTENIDO=1174&IDTIPO=140",
        "tier": "Regional",
        "region": "ES-MC",
        "country": "ES",
        "agency": "Comunidad Autónoma de la Región de Murcia — Consejería de Agua y Agricultura",
        "pinned_selectors": [".destacado", ".novedad"],
        "max_age_days": 90
    },

    # =========================================================================
    # 6. CANADA (CA) — Federal AAFC + Ontario (Leamington), BC (Fraser), Québec
    # =========================================================================
    {
        "id": "CA_AAFC_SCAP",
        "name": "Canada AAFC Sustainable Canadian Agricultural Partnership & ACT",
        "url": "https://agriculture.canada.ca/en/programs",
        "tier": "Federal",
        "region": "CA-FED",
        "country": "CA",
        "agency": "Agriculture and Agri-Food Canada (AAFC)",
        "pinned_selectors": [".alert", ".featured"],
        "max_age_days": 90
    },
    {
        "id": "CA_ON_OMAFRA_LEAMINGTON",
        "name": "OMAFRA Ontario — Leamington / Essex Greenhouse Competitiveness (OGCII)",
        "url": "https://www.ontario.ca/page/available-funding-opportunities-ontario-government",
        "tier": "Regional",
        "region": "CA-ON",
        "country": "CA",
        "agency": "Ontario Ministry of Agriculture, Food and Agribusiness (OMAFRA / AAC)",
        "pinned_selectors": [".callout", ".alert"],
        "max_age_days": 90
    },
    {
        "id": "CA_BC_FRASER_CLEANBC",
        "name": "BC Ministry of Agriculture — Fraser Valley Greenhouse & CleanBC",
        "url": "https://www2.gov.bc.ca/gov/content/industry/agriculture-seafood/programs",
        "tier": "Regional",
        "region": "CA-BC",
        "country": "CA",
        "agency": "British Columbia Ministry of Agriculture and Food / CleanBC",
        "pinned_selectors": [".alert", ".featured"],
        "max_age_days": 90
    },
    {
        "id": "CA_QC_MAPAQ_SERRES",
        "name": "MAPAQ Québec Croissance des Serres & Programme Prime-Vert",
        "url": "https://www.mapaq.gouv.qc.ca/fr/Productions/aidefinanciere/",
        "tier": "Regional",
        "region": "CA-QC",
        "country": "CA",
        "agency": "Ministère de l'Agriculture, des Pêcheries et de l'Alimentation du Québec (MAPAQ)",
        "pinned_selectors": [".alerte", ".vedette"],
        "max_age_days": 90
    },

    # =========================================================================
    # 7. UNITED STATES (US) — Federal USDA + Key States + Local Air/Water Districts
    # =========================================================================
    {
        "id": "US_USDA_NRCS_EQIP",
        "name": "USDA NRCS Environmental Quality Incentives Program (EQIP / CEA)",
        "url": "https://www.nrcs.usda.gov/programs-initiatives/eqip-environmental-quality-incentives",
        "tier": "Federal",
        "region": "US-FED",
        "country": "US",
        "agency": "USDA Natural Resources Conservation Service (NRCS)",
        "pinned_selectors": [".usa-alert", ".featured"],
        "max_age_days": 90
    },
    {
        "id": "US_USDA_RD_REAP",
        "name": "USDA Rural Energy for America Program (REAP) Clean Energy Grants",
        "url": "https://www.rd.usda.gov/programs-services/energy-programs/rural-energy-america-program-renewable-energy-systems-energy-efficiency-improvement-guaranteed-loans",
        "tier": "Federal",
        "region": "US-FED",
        "country": "US",
        "agency": "USDA Rural Development (RD)",
        "pinned_selectors": [".usa-alert", ".featured"],
        "max_age_days": 90
    },
    {
        "id": "CDFA_SWEEP",
        "name": "California CDFA State Water Efficiency and Enhancement Program (SWEEP)",
        "url": "https://www.cdfa.ca.gov/oars/sweep/",
        "tier": "Regional",
        "region": "US-CA",
        "country": "US",
        "agency": "California Department of Food and Agriculture (CDFA) - OARS",
        "pinned_selectors": [".pinned", ".notice"],
        "max_age_days": 60
    },
    {
        "id": "CDFA_OARS",
        "name": "California CDFA Office of Agricultural Resilience and Sustainability",
        "url": "https://www.cdfa.ca.gov/oars/",
        "tier": "Regional",
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
        "tier": "Regional",
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
        "tier": "Regional",
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
        "tier": "Regional",
        "region": "US-CA",
        "country": "US",
        "agency": "State of California",
        "pinned_selectors": [".sticky-header", ".featured-grant", "div.pinned"],
        "max_age_days": 60
    },
    {
        "id": "CA_SJVAPCD_AG",
        "name": "San Joaquin Valley APCD Ag Pump, Thermal Boiler & Burn Grants",
        "url": "https://www.valleyair.org/grants/",
        "tier": "Municipal",
        "region": "US-CA-SJV",
        "country": "US",
        "agency": "San Joaquin Valley Air Pollution Control District (SJVAPCD)",
        "pinned_selectors": [".alert", ".sticky"],
        "max_age_days": 90
    },
    {
        "id": "CA_SCAQMD_AG",
        "name": "South Coast AQMD Commercial Ag & Greenhouse Zero-Emission Incentives",
        "url": "https://www.aqmd.gov/home/programs/business",
        "tier": "Municipal",
        "region": "US-CA-SC",
        "country": "US",
        "agency": "South Coast Air Quality Management District (SCAQMD)",
        "pinned_selectors": [".alert", ".featured"],
        "max_age_days": 90
    },
    {
        "id": "NY_NYSERDA_AG",
        "name": "NYSERDA New York Controlled Environment Agriculture (CEA) & Ag Energy",
        "url": "https://www.nyserda.ny.gov/All-Programs/Agriculture-Energy-Efficiency",
        "tier": "Regional",
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
        "tier": "Regional",
        "region": "US-NY",
        "country": "US",
        "agency": "NYS Department of Agriculture and Markets (AGM)",
        "pinned_selectors": [".pinned-row", ".announcement"],
        "max_age_days": 90
    },
    {
        "id": "TX_TDA_GRANTS",
        "name": "Texas Department of Agriculture (TDA) Grants & Financial Assistance",
        "url": "https://www.texasagriculture.gov/Grants-Services",
        "tier": "Regional",
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
        "tier": "Regional",
        "region": "US-TX",
        "country": "US",
        "agency": "Texas Water Development Board (TWDB)",
        "pinned_selectors": [".alert", ".announcement"],
        "max_age_days": 90
    },
    {
        "id": "FL_FDACS_BMP",
        "name": "Florida FDACS Office of Agricultural Water Policy BMP Cost-Share",
        "url": "https://www.fdacs.gov/Agriculture-Industry/Water/Agricultural-Best-Management-Practices",
        "tier": "Regional",
        "region": "US-FL",
        "country": "US",
        "agency": "Florida Department of Agriculture and Consumer Services (FDACS)",
        "pinned_selectors": [".alert", ".featured"],
        "max_age_days": 90
    },
    {
        "id": "OH_ODA_GRANTS",
        "name": "Ohio Department of Agriculture (ODA) H2Ohio & Specialty Crop Grants",
        "url": "https://agri.ohio.gov/programs",
        "tier": "Regional",
        "region": "US-OH",
        "country": "US",
        "agency": "Ohio Department of Agriculture (ODA)",
        "pinned_selectors": [".alert", ".featured"],
        "max_age_days": 90
    },
    {
        "id": "MI_MDARD_GRANTS",
        "name": "Michigan MDARD Value-Added & Greenhouse/Specialty Crop Grants",
        "url": "https://www.michigan.gov/mdard/business-development/grant-fund",
        "tier": "Regional",
        "region": "US-MI",
        "country": "US",
        "agency": "Michigan Department of Agriculture and Rural Development (MDARD)",
        "pinned_selectors": [".alert", ".featured"],
        "max_age_days": 90
    },
    {
        "id": "AZ_ADWR_CONSERVATION",
        "name": "Arizona Department of Water Resources (ADWR) Ag Water Conservation",
        "url": "https://www.azwater.gov/conservation/agriculture",
        "tier": "Regional",
        "region": "US-AZ",
        "country": "US",
        "agency": "Arizona Department of Water Resources (ADWR / WIFA)",
        "pinned_selectors": [".alert", ".featured"],
        "max_age_days": 90
    },
    {
        "id": "WA_WSDA_GRANTS",
        "name": "Washington State Department of Agriculture (WSDA) Grants",
        "url": "https://agr.wa.gov/services/grant-and-financial-assistance",
        "tier": "Regional",
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
        "tier": "Regional",
        "region": "US-WA",
        "country": "US",
        "agency": "Washington State Conservation Commission (SCC)",
        "pinned_selectors": [".sticky", ".notice"],
        "max_age_days": 90
    },
    {
        "id": "OR_ENERGY_TRUST",
        "name": "Oregon Department of Energy / Energy Trust Agriculture & CEA Efficiency",
        "url": "https://www.energytrust.org/commercial/agriculture/",
        "tier": "Regional",
        "region": "US-OR",
        "country": "US",
        "agency": "Oregon Department of Energy (ODOE) / Energy Trust of Oregon",
        "pinned_selectors": [".sticky", ".featured"],
        "max_age_days": 90
    },
    {
        "id": "OR_OWEB",
        "name": "Oregon Watershed Enhancement Board (OWEB) Agricultural Water Grants",
        "url": "https://www.oregon.gov/oweb/grants/",
        "tier": "Regional",
        "region": "US-OR",
        "country": "US",
        "agency": "Oregon Watershed Enhancement Board (OWEB)",
        "pinned_selectors": [".pinned", ".highlight"],
        "max_age_days": 90
    },
    {
        "id": "PA_PDA_GRANTS",
        "name": "Pennsylvania Department of Agriculture (PDA) PA Farm Bill Grants",
        "url": "https://www.pa.gov/agencies/pda/business-and-industry/grants-and-funding.html",
        "tier": "Regional",
        "region": "US-PA",
        "country": "US",
        "agency": "Pennsylvania Department of Agriculture (PDA)",
        "pinned_selectors": [".alert", ".featured"],
        "max_age_days": 90
    },
    {
        "id": "NC_NCDA_CS",
        "name": "North Carolina NCDA&CS Ag Cost Share & Specialty Crop Grants",
        "url": "https://www.ncagr.gov/divisions/soil-water-conservation/programs-initiatives/nc-agriculture-cost-share-program",
        "tier": "Regional",
        "region": "US-NC",
        "country": "US",
        "agency": "North Carolina Department of Agriculture and Consumer Services (NCDA&CS)",
        "pinned_selectors": [".alert", ".featured"],
        "max_age_days": 90
    },
    {
        "id": "GA_GDA_GRANTS",
        "name": "Georgia Department of Agriculture (GDA) Ag Grants & Cost-Share",
        "url": "https://agr.georgia.gov/",
        "tier": "Regional",
        "region": "US-GA",
        "country": "US",
        "agency": "Georgia Department of Agriculture (GDA)",
        "pinned_selectors": [".alert", ".featured"],
        "max_age_days": 90
    },
    {
        "id": "IL_IDOA_GRANTS",
        "name": "Illinois Department of Agriculture (IDOA) Conservation & Specialty Crop",
        "url": "https://agr.illinois.gov/assistance/grants.html",
        "tier": "Regional",
        "region": "US-IL",
        "country": "US",
        "agency": "Illinois Department of Agriculture (IDOA)",
        "pinned_selectors": [".alert", ".featured"],
        "max_age_days": 90
    },

    # =========================================================================
    # 8. SOUTH KOREA (KR) — Central + Provincial Valleys + Si-Gun-Gu / Eup-Myeon-Dong
    # =========================================================================
    {
        "id": "KR_SMARTFARM_KOREA",
        "name": "SmartFarm Korea Central Portal (스마트팜코리아)",
        "url": "https://www.smartfarmkorea.net/",
        "tier": "Federal",
        "region": "KR-NAT",
        "country": "KR",
        "agency": "Ministry of Agriculture, Food and Rural Affairs / EPIS (스마트팜코리아)",
        "pinned_selectors": [".notice", ".board-pinned"],
        "max_age_days": 90
    },
    {
        "id": "KR_MAFRA_NOTICES",
        "name": "South Korea MAFRA Public Announcements & Horticultural Policy Grants (농림축산식품부)",
        "url": "https://www.mafra.go.kr/home/5108/subview.do",
        "tier": "Federal",
        "region": "KR-NAT",
        "country": "KR",
        "agency": "Ministry of Agriculture, Food and Rural Affairs (농림축산식품부 MAFRA)",
        "pinned_selectors": [".notice", ".gongji"],
        "max_age_days": 90
    },
    {
        "id": "KR_RDA_TECH",
        "name": "Rural Development Administration New Agri-Tech Dissemination (농촌진흥청 RDA)",
        "url": "https://www.rda.go.kr/board/board.do?prgId=day_rdadataEntry",
        "tier": "Federal",
        "region": "KR-NAT",
        "country": "KR",
        "agency": "Rural Development Administration (농촌진흥청 RDA)",
        "pinned_selectors": [".notice", ".top_notice"],
        "max_age_days": 90
    },
    {
        "id": "KR_KRC_GREENHOUSE",
        "name": "Korea Rural Community Corporation Smart Farm & Geothermal Grants (한국농어촌공사 KRC)",
        "url": "https://www.ekr.or.kr/",
        "tier": "Federal",
        "region": "KR-NAT",
        "country": "KR",
        "agency": "Korea Rural Community Corporation (한국농어촌공사 KRC)",
        "pinned_selectors": [".notice", ".pinned"],
        "max_age_days": 90
    },
    {
        "id": "KR_CN_NONSAN_BUYEO",
        "name": "Chungnam / Nonsan & Buyeo Smart Horticulture Cluster Subsidies (충청남도 논산·부여 스마트원예)",
        "url": "https://www.chungnam.go.kr/dept/main.do?dept=cca",
        "tier": "Regional",
        "region": "KR-44",
        "country": "KR",
        "agency": "Chungcheongnam-do Provincial Government / Nonsan & Buyeo Agri-Tech (충남도청·논산·부여)",
        "pinned_selectors": [".notice", ".gongji"],
        "max_age_days": 90
    },
    {
        "id": "KR_JB_GIMJE_VALLEY",
        "name": "Jeollabuk-do Gimje Smart Farm Innovation Valley (전라북도 김제 스마트팜혁신밸리)",
        "url": "https://www.jeonbuk.go.kr/",
        "tier": "Regional",
        "region": "KR-45",
        "country": "KR",
        "agency": "Jeonbuk State Gimje Smart Farm Innovation Valley (전북 김제 스마트팜혁신밸리)",
        "pinned_selectors": [".notice", ".pinned"],
        "max_age_days": 90
    },
    {
        "id": "KR_GB_SANGJU_VALLEY",
        "name": "Gyeongsangbuk-do Sangju Smart Farm Innovation Valley (경상북도 상주 스마트팜혁신밸리)",
        "url": "https://www.gb.go.kr/",
        "tier": "Regional",
        "region": "KR-47",
        "country": "KR",
        "agency": "Gyeongsangbuk-do Sangju Smart Farm Innovation Valley (경북 상주 스마트팜혁신밸리)",
        "pinned_selectors": [".notice", ".pinned"],
        "max_age_days": 90
    },
    {
        "id": "KR_GN_MIRYANG_VALLEY",
        "name": "Gyeongsangnam-do Miryang Smart Farm Innovation Valley (경상남도 밀양 스마트팜혁신밸리)",
        "url": "https://www.gyeongnam.go.kr/",
        "tier": "Regional",
        "region": "KR-48",
        "country": "KR",
        "agency": "Gyeongsangnam-do Miryang Smart Farm Innovation Valley (경남 밀양 스마트팜혁신밸리)",
        "pinned_selectors": [".notice", ".pinned"],
        "max_age_days": 90
    },
    {
        "id": "KR_DJ_YUSEONG_ATC",
        "name": "Daejeon Yuseong-gu & Municipal Agricultural Tech Center Pilot Grants (대전 유성구/시·군·구 농업기술센터 보급사업)",
        "url": "https://www.daejeon.go.kr/ufa/index.do",
        "tier": "Municipal",
        "region": "KR-30-ATC",
        "country": "KR",
        "agency": "Daejeon & Si-Gun-Gu Agricultural Technology Centers (시·군·구 농업기술센터 기술보급과)",
        "pinned_selectors": [".notice", ".gongji"],
        "max_age_days": 90
    },
    {
        "id": "KR_EMD_LOCAL_HORT",
        "name": "Nationwide Eup-Myeon-Dong Local Office Smallholder Facility Matching (전국 읍·면·동 행정복지센터 산업팀 소규모 시설원예)",
        "url": "https://www.gov.kr/portal/rcvfvrSvc/main",
        "tier": "Municipal",
        "region": "KR-LOCAL-EMD",
        "country": "KR",
        "agency": "Eup-Myeon-Dong Administrative Welfare Centers / Subsidy24 (읍·면·동 행정복지센터 산업팀·보조금24)",
        "pinned_selectors": [".notice", ".pinned"],
        "max_age_days": 90
    }
]


def ensure_db_schema(conn):
    """Backward-compatible SQLite migration adding `tier` and `region` to `discovered_candidates`."""
    if not conn:
        return []
    cur = conn.cursor()
    cur.execute("PRAGMA table_info(discovered_candidates)")
    existing_cols = {row[1] for row in cur.fetchall()}
    added = []
    if "tier" not in existing_cols:
        cur.execute("ALTER TABLE discovered_candidates ADD COLUMN tier TEXT DEFAULT 'Regional'")
        added.append("discovered_candidates.tier")
    if "region" not in existing_cols:
        cur.execute("ALTER TABLE discovered_candidates ADD COLUMN region TEXT DEFAULT ''")
        added.append("discovered_candidates.region")

    cur.execute("PRAGMA table_info(programs)")
    prog_cols = {row[1] for row in cur.fetchall()}
    if "admin_tier" not in prog_cols:
        cur.execute("ALTER TABLE programs ADD COLUMN admin_tier TEXT DEFAULT 'Regional / State'")
        added.append("programs.admin_tier")
    if "region_scope" not in prog_cols:
        cur.execute("ALTER TABLE programs ADD COLUMN region_scope TEXT DEFAULT ''")
        added.append("programs.region_scope")
    if "filing_authority" not in prog_cols:
        cur.execute("ALTER TABLE programs ADD COLUMN filing_authority TEXT DEFAULT ''")
        added.append("programs.filing_authority")

    if added:
        conn.commit()
    return added


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
        "privacy policy", "accessibility", "contact us", "impressum", "datenschutz"
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


def fetch_html(url, timeout=10):
    req = urllib.request.Request(url, headers=HEADERS)
    try:
        with urllib.request.urlopen(req, timeout=timeout, context=SSL_CTX) as response:
            return response.read().decode("utf-8", errors="ignore")
    except Exception as e:
        print(f"    ⚠️ Fetch warning for {url}: {e}")
        return None


def harvest_portal(portal, ledger, db_conn, timeout=5, prefetched_html=None):
    url = portal["url"]
    tier = portal.get("tier", "Regional")
    region = portal.get("region", portal.get("country", ""))
    html = prefetched_html if prefetched_html is not None else fetch_html(url, timeout=timeout)
    if not html:
        return 0

    soup = BeautifulSoup(html, "html.parser")
    found_count = 0
    cur = db_conn.cursor() if db_conn else None

    anchors = soup.find_all("a", href=True)
    keywords = [
        # English (US / CA / EU)
        "grant", "program", "funding", "application", "incentive", "sweep", "dairy",
        "soil", "equipment", "farmer", "water", "bond", "rebate", "voucher", "greenhouse",
        # German (BMEL / BLE / Bayern / LWK / Rentenbank)
        "förderung", "foerderung", "bundesprogramm", "richtlinie", "zuschuss",
        "energieeffizienz", "gartenbau", "investition", "bekanntmachung", "kulap", "afp",
        # Japanese (MAFF / NARO Tsukuba / Prefectures)
        "補助金", "交付金", "公募", "支援", "スマート農業", "みどり", "施設園芸", "省エネ", "事業", "園芸",
        # Dutch (RVO / Provincie Greenports)
        "subsidie", "regeling", "glastuinbouw", "energie", "investering", "sde", "eia", "warmte",
        # French & Spanish (FranceAgriMer / ADEME / MAPA / Andalucía)
        "aide", "subvention", "serre", "transition", "chaleur",
        "ayuda", "subvención", "convocatoria", "invernadero", "regadío",
        # Korean (MAFRA / RDA / ATC / Eup-Myeon-Dong)
        "공고", "모집", "지원사업", "보조금", "스마트팜", "시설원예", "에너지", "보급사업", "양액기"
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

        is_pinned = any(
            a.find_parent(class_=re.compile(sel.replace(".", "")))
            for sel in portal.get("pinned_selectors", [])
            if "." in sel
        )
        is_invalid, _ = is_sticky_or_outdated(text, None, is_pinned, portal.get("max_age_days", 90))
        if is_invalid:
            continue

        notice_hash = compute_notice_hash(text, full_url)
        if notice_hash in ledger.get("known_hashes", {}):
            continue

        ledger.setdefault("known_hashes", {})[notice_hash] = {
            "title": text,
            "url": full_url,
            "country": portal["country"],
            "tier": tier,
            "region": region,
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
                        status, discovery_notes, tier, region, discovered_at
                    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
                """, (
                    portal["id"],
                    portal.get("agency", "Government Agency"),
                    text,
                    full_url,
                    "Agriculture /CEA / Climate",
                    "Check announcement",
                    "Active Solicitation",
                    1 if any(k in text.lower() for k in ["energy", "clean", "microgrid", "heat"]) else 0,
                    json.dumps(["agriculture", portal["country"], region, tier]),
                    "pending_review",
                    f"Harvested via {portal['id']} ({tier}) on {datetime.now().strftime('%Y-%m-%d')}",
                    tier,
                    region
                ))
            except Exception as dbe:
                print(f"    ⚠️ DB insert warning: {dbe}")

    if cur and db_conn:
        db_conn.commit()

    print(f"    ✅ [{portal['id']}] Found {found_count} new potential notices.")
    return found_count


def run_fast_daily_audit(ledger):
    """Deterministic <2s DB schema + active deadline & multi-tier coverage audit."""
    t0 = time.perf_counter()
    print("⚡ [--fast-daily] Running Deterministic Schema, Deadline & Multi-Tier Coverage Audit...")

    # 1. Verify portals matrix across all 8 target countries & 3 tiers
    by_country = {}
    by_tier = {"Federal": 0, "Regional": 0, "Municipal": 0}
    for p in TARGET_PORTALS:
        c = p["country"]
        t = p.get("tier", "Regional")
        by_country[c] = by_country.get(c, 0) + 1
        by_tier[t] = by_tier.get(t, 0) + 1

    required_countries = {"DE", "NL", "FR", "ES", "JP", "KR", "US", "CA"}
    missing_countries = required_countries - set(by_country.keys())
    if missing_countries:
        raise RuntimeError(f"Missing target countries in TARGET_PORTALS: {missing_countries}")

    # 2. Verify SQLite Master DB & ensure backward-compatible tier/region columns
    db_programs = 0
    db_candidates = 0
    migrated = []
    if os.path.exists(DB_PATH):
        conn = sqlite3.connect(DB_PATH)
        migrated = ensure_db_schema(conn)
        cur = conn.cursor()
        cur.execute("SELECT COUNT(*) FROM programs")
        db_programs = cur.fetchone()[0]
        cur.execute("SELECT COUNT(*) FROM discovered_candidates")
        db_candidates = cur.fetchone()[0]
        conn.close()

    # 3. Verify JSON Production Feed & active deadlines
    json_programs = 0
    open_count = 0
    closing_soon_count = 0
    upcoming_count = 0
    tier_json_counts = {}
    if os.path.exists(DATA_PATH):
        with open(DATA_PATH, "r", encoding="utf-8") as f:
            feed = json.load(f)
        progs = feed.get("programs", [])
        json_programs = len(progs)
        for prog in progs:
            st = (prog.get("applicationWindow") or {}).get("status", "open")
            if st in ("open", "rolling"):
                open_count += 1
            elif st == "closing_soon":
                closing_soon_count += 1
            else:
                upcoming_count += 1
            at = prog.get("admin_tier", "Unassigned")
            tier_json_counts[at] = tier_json_counts.get(at, 0) + 1

    ledger["last_fast_audit"] = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    save_ledger(ledger)

    elapsed = time.perf_counter() - t0
    country_summary = ", ".join(f"{k}:{v}" for k, v in sorted(by_country.items()))
    print(f"  🌐 Surveillance Radar Matrix : {len(TARGET_PORTALS)} portals across 8 countries ({country_summary})")
    print(f"  🏛️ Portal Jurisdiction Tiers : Federal={by_tier['Federal']}, Regional={by_tier['Regional']}, Municipal={by_tier['Municipal']}")
    print(f"  🗄️ SQLite Master Database    : {db_programs} curated programs | {db_candidates} harvested candidates"
          + (f" (migrated: {', '.join(migrated)})" if migrated else " (schema intact)"))
    print(f"  📊 Production JSON Feed      : {json_programs} programs (Open/Rolling={open_count}, ClosingSoon={closing_soon_count}, Upcoming={upcoming_count})")
    if tier_json_counts:
        print(f"  🏷️ Promoted JSON Tiers       : {tier_json_counts}")
    print(f"  ⏱️ Fast Daily Audit Completed in {elapsed:.3f}s (< 2.000s budget).")
    return 0


def parse_args(argv):
    parser = argparse.ArgumentParser(description="Global Multi-Tier Agri-Subsidy Radar Harvester")
    parser.add_argument("--fast-daily", action="store_true",
                        help="Run deterministic <2s DB schema, deadline & regional coverage audit without live HTTP calls")
    parser.add_argument("--daily-auto", action="store_true",
                        help="Skip live HTTP scan if already run today; run fast audit instead")
    parser.add_argument("--live", action="store_true",
                        help="Force live HTTP scraping across target government portals")
    parser.add_argument("--country", type=str, default="",
                        help="Filter live scrape to a 2-letter country code (DE, JP, NL, FR, ES, CA, US, KR)")
    parser.add_argument("--tier", type=str, default="",
                        help="Filter live scrape by tier (Federal, Regional, Municipal)")
    parser.add_argument("--limit", type=int, default=0,
                        help="Maximum number of portals to scrape in live mode (0 = all)")
    parser.add_argument("--timeout", type=int, default=5,
                        help="Per-portal HTTP timeout in seconds (default: 5)")
    parser.add_argument("--workers", type=int, default=16,
                        help="Concurrent HTTP worker threads for live scraping (default: 16)")
    return parser.parse_args(argv)


def main():
    args = parse_args(sys.argv[1:])
    print("=" * 68)
    print("🌱 GLOBAL HYPER-LOCAL AGRI-SUBSIDY RADAR (8 COUNTRIES · 3 TIERS)")
    print(f"   Execution Timestamp: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print("=" * 68)

    ledger = load_ledger()

    if args.fast_daily and not args.live:
        return run_fast_daily_audit(ledger)

    today_prefix = datetime.now().strftime("%Y-%m-%d")
    last_run_str = ledger.get("last_run") or ""
    if args.daily_auto and not args.live and last_run_str.startswith(today_prefix):
        print(f"⚡ Live government portal scan already completed today ({last_run_str}).")
        return run_fast_daily_audit(ledger)

    print(f"📊 State Ledger: {len(ledger.get('known_hashes', {}))} previously verified notices indexed.")

    db_conn = None
    if os.path.exists(DB_PATH):
        db_conn = sqlite3.connect(DB_PATH)
        migrated = ensure_db_schema(db_conn)
        print(f"🗄️ Connected to Master Database: {DB_PATH}" + (f" (Added columns: {migrated})" if migrated else ""))

    selected_portals = list(TARGET_PORTALS)
    if args.country:
        cc = args.country.strip().upper()
        selected_portals = [p for p in selected_portals if p["country"] == cc]
    if args.tier:
        tc = args.tier.strip().capitalize()
        selected_portals = [p for p in selected_portals if p.get("tier", "").lower() == tc.lower()]
    if args.limit and args.limit > 0:
        selected_portals = selected_portals[:args.limit]

    total_new = 0
    t_live = time.perf_counter()
    print(f"\n🔍 Parallel-Inspecting {len(selected_portals)} Target Registries (workers={args.workers}, timeout={args.timeout}s)...")
    prefetched = {}
    with ThreadPoolExecutor(max_workers=max(1, args.workers)) as pool:
        fut_map = {pool.submit(fetch_html, p["url"], args.timeout): p["id"] for p in selected_portals}
        for fut in as_completed(fut_map):
            pid = fut_map[fut]
            try:
                prefetched[pid] = fut.result()
            except Exception:
                prefetched[pid] = None

    for portal in selected_portals:
        html_doc = prefetched.get(portal["id"])
        if html_doc:
            new_items = harvest_portal(portal, ledger, db_conn, timeout=args.timeout, prefetched_html=html_doc)
            total_new += new_items
    print(f"  ⚡ Parallel HTTP scan across {len(selected_portals)} portals finished in {time.perf_counter() - t_live:.2f}s.")

    if not args.limit and not args.country and not args.tier:
        ledger["last_run"] = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    save_ledger(ledger)

    if db_conn:
        db_conn.close()

    print(f"\n🎉 Harvest audit complete across {len(selected_portals)} portals: {total_new} new candidates indexed.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
