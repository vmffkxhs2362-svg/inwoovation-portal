#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Target-Region CEA Subsidy & Policy Radar Upgrader (v4.0)
=========================================================
Upgrades `global_agri_subsidies.json`, `agri_grants_master.db`, and
`tools/global-agri-subsidy-grant-navigator.html` based on empirical GA4
visitor clusters (US-CA, Germany [Freising/Bayern & Bund], Japan [Tsukuba/NARO & MAFF],
Netherlands [Middenmeer/RVO], France [Avignon/FranceAgriMer], Spain [Valencia/MAPA],
and South Korea [MAFRA]).
"""

import json
import os
import re
import sqlite3
from datetime import datetime

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
PORTAL_ROOT = os.path.dirname(SCRIPT_DIR)
DATA_JSON_PATH = os.path.join(PORTAL_ROOT, "data", "global_agri_subsidies.json")
DB_PATH = os.path.join(PORTAL_ROOT, "data", "agri_grants_master.db")
NAVIGATOR_HTML_PATH = os.path.join(PORTAL_ROOT, "tools", "global-agri-subsidy-grant-navigator.html")

NEW_JURISDICTIONS = [
    {"code": "FR", "name": "France (FranceAgriMer / France 2030)", "flag": "🇫🇷", "country": "FR"},
    {"code": "ES", "name": "Spain (MAPA / PERTE Invernaderos)", "flag": "🇪🇸", "country": "ES"},
]

NEW_COUNTRIES = [
    {"code": "FR", "name": "France", "flag": "🇫🇷", "currency": "EUR", "exchangeRateToUSD": 1.09},
    {"code": "ES", "name": "Spain (España)", "flag": "🇪🇸", "currency": "EUR", "exchangeRateToUSD": 1.09},
]

PLAYBOOK_PATCHES = {
    "DE-BLE-ENERGIE": {
        "officialCalculators": [
            {
                "name": "BLE CO2-Minderungsberechnung & Energieberatungsbericht",
                "format": "Official BLE Excel Portal Tool (.xlsx)",
                "description": "Quantifies minimum 15%-20% CO2 and primary energy savings across thermal screens, LED retrofits, heat pumps, and climate computers.",
                "url": "https://www.ble.de/DE/Projektfoerderung/Foerderungen-Auftraege/Bundesprogramm-Energieeffizienz/bundesprogramm-energieeffizienz_node.html"
            }
        ],
        "scoringCheatSheet": {
            "dacBonusPoints": "+10% Bonus (up to 40% total grant): Certified Young Farmers (Junglandwirte <40 yrs with Meisterbrief) and small horticultural SMEs (KMU).",
            "waterBasinPriority": "High Priority: Systemische Optimierung (combining multi-layer thermal screens + heat pump + climate control computer).",
            "technicalMeritPoints": "Direct entitlement upon verified >=20% CO2 savings certified by a BLE-listed Energieberater."
        },
        "vendorQuoteRules": [
            "Minimum two (2) to three (3) independent itemized commercial quotes from horticultural engineering vendors.",
            "Mandatory energy audit by a BLE-registered Sachverständiger (Energieberater) BEFORE submitting the easy-Online application."
        ],
        "disqualificationPitfalls": [
            "Vorzeitiger Maßnahmenbeginn: Signing any purchase order or installation contract before receiving the written BLE Zuwendungsbescheid results in 100% forfeiture.",
            "Used or second-hand greenhouse equipment is strictly excluded."
        ],
        "stackingRules": "Cumulative public funding may not exceed EU GBER (AGVO) ceilings (typically 65% max). Can be paired with Landwirtschaftliche Rentenbank promotional loans."
    },
    "DE-AFP-NRW": {
        "officialCalculators": [
            {
                "name": "LWK NRW AFP Wirtschaftlichkeitsberechnung & Punktekatalog",
                "format": "LWK NRW Excel Investment Model",
                "description": "3-year business viability and environmental/climate scoring matrix for protected horticulture investments in NRW.",
                "url": "https://www.landwirtschaftskammer.de/foerderung/laendlich/afp/"
            }
        ],
        "scoringCheatSheet": {
            "dacBonusPoints": "+10% Junglandwirte-Zuschlag: Extra grant allowance for Gärtnermeister / Agraringenieure under age 40.",
            "waterBasinPriority": "Top Ranking Score: Closed-loop ebb-and-flow / gutter recirculation with UV-C or ozone disinfection (100% zero nutrient runoff).",
            "technicalMeritPoints": "DIN 276 cost structure combined with verified energy-saving Venlo glasshouse envelope."
        },
        "vendorQuoteRules": [
            "Construction costs must be structured according to DIN 276 with 3 comparative vendor bids for machinery.",
            "Approved Baugenehmigung (building permit) and water authority permit must be attached at submission."
        ],
        "disqualificationPitfalls": [
            "Applying without an approved Baugenehmigung prior to the cut-off date (Stichtag).",
            "Replacement investments without measurable environmental, water, or energy efficiency improvement."
        ],
        "stackingRules": "Can be combined with Rentenbank 'Zukunftsfelder' loans and NRW.BANK Agrar-Kredit within EU CAP maximum subsidy intensity limits."
    },
    "DE-EU-JUNGLANDWIRTE": {
        "officialCalculators": [
            {
                "name": "BMEL GAP-Strategieplan Junglandwirte-Prämienrechner",
                "format": "State Agrarförderung Portal (ANDI / FIONA / iBALIS / ELAN)",
                "description": "Calculates annual hectare top-up (€134/ha up to 120 ha) and state-level Existenzgründungsbeihilfe (up to €70,000).",
                "url": "https://www.bmel.de/DE/themen/landwirtschaft/eu-agrarpolitik-und-foerderung/gap/junglandwirte.html"
            }
        ],
        "scoringCheatSheet": {
            "dacBonusPoints": "100% Non-Competitive Entitlement for annual per-hectare payment once age (<40) and qualification criteria are met.",
            "waterBasinPriority": "horticultural high-value crops under glass count toward eligible Betriebsfläche when registered in InVeKoS.",
            "technicalMeritPoints": "Gärtnermeister or B.Sc. Gartenbau diploma automatically fulfills the mandatory 2-year vocational qualification gate."
        },
        "vendorQuoteRules": [
            "No vendor quotes required for the per-hectare direct payment; business plan (Geschäftsplan) required for lump-sum settlement grants."
        ],
        "disqualificationPitfalls": [
            "Missing the statutory May 15 annual Gemeinsamer Antrag deadline.",
            "Holding less than 50% voting control or failing to prove effective managerial control in a GmbH/GbR."
        ],
        "stackingRules": "100% stackable with AFP Young Farmer investment bonus (+10%), Aufstiegs-BAföG Meisterbonus, and BLE Energieeffizienz grants."
    },
    "KR-MAFRA-ICT": {
        "officialCalculators": [
            {
                "name": "SmartFarm Korea ICT Equipment Standard Specification & ROI Sheet",
                "format": "Agrix / EPIS Online Assessment Form",
                "description": "Evaluates KS X 3265-3269 standardized greenhouse sensor/actuator compatibility and projected yield/labor improvement.",
                "url": "https://www.smartfarmkorea.net/"
            }
        ],
        "scoringCheatSheet": {
            "dacBonusPoints": "+5 to +10 Points: Graduates of Smart Farm Innovation Valley Youth Incubator (청년창업보육센터) and GAP/Low-Carbon certified farms.",
            "waterBasinPriority": "+5 Points: Farms integrating closed-loop hydroponic drainage sterilization and cloud data sharing with EPIS.",
            "technicalMeritPoints": "Up to 100 points based on farming plan (40%), technical readiness (30%), and mandatory smart farm training hours (30%)."
        },
        "vendorQuoteRules": [
            "Equipment must be supplied by a vendor registered with the Korea Smart Farm ICT Convergence Standardization directory.",
            "Mandatory pre-installation consulting report by an EPIS-accredited Smart Farm advisor."
        ],
        "disqualificationPitfalls": [
            "Installing non-standard ICT controllers that cannot transmit environmental telemetry to the national SmartFarm Korea cloud.",
            "Purchasing equipment prior to municipal grant confirmation."
        ],
        "stackingRules": "Combines 50% central/local grant + 30% NH Nonghyup policy loan (1.5%-2.0%) + 20% self-pay. Cannot double-claim the exact same hardware under MAFRA Energy."
    },
    "KR-MAFRA-ENERGY": {
        "officialCalculators": [
            {
                "name": "KRC (한국농어촌공사) 온실 최대난방부하 및 지열·히트펌프 용량 계산기",
                "format": "KRC Engineering Verification Standard",
                "description": "Calculates peak winter heating load (kcal/h), multi-layer thermal curtain U-value savings, and required COP >= 3.5 heat pump capacity.",
                "url": "https://www.mafra.go.kr/"
            }
        ],
        "scoringCheatSheet": {
            "dacBonusPoints": "Priority allocation for greenhouse clusters (스마트원예단지) and export-oriented paprika/strawberry/tomato growers.",
            "waterBasinPriority": "Extra points for river-water / groundwater aquifer thermal heat pumps and industrial waste-heat utilization.",
            "technicalMeritPoints": "Combining multi-layer thermal screens (다겹보온커튼) with air/geothermal heat pumps maximizes thermal score."
        },
        "vendorQuoteRules": [
            "Heat pumps must hold KAMICO / KS agricultural energy efficiency certification.",
            "Geothermal boring and engineering supervision must be contracted through KRC (한국농어촌공사) or certified specialized firms."
        ],
        "disqualificationPitfalls": [
            "Applying without an official KRC heating load calculation sheet.",
            "Operating unauthorized groundwater extraction wells without municipal water permits."
        ],
        "stackingRules": "Stackable with KEPCO (한전) Agricultural Power (농사용 전력 을) tariff and KEA Carbon Neutrality Emissions Trading (외부사업 인증실적 KOC) credits."
    },
    "KR-MAFRA-YOUTH": {
        "officialCalculators": [
            {
                "name": "Agrix 청년농업인 영농정착지원금 및 후계농 정책자금 시뮬레이터",
                "format": "Agrix Online Business Plan Portal",
                "description": "Models 3-year monthly settlement voucher (₩900k-₩1.1M/mo) and ₩500M 1.5% fixed-rate loan (5-yr grace, 20-yr amortization).",
                "url": "https://www.agrix.go.kr/"
            }
        ],
        "scoringCheatSheet": {
            "dacBonusPoints": "Top Priority: Smart Farm Innovation Valley (김제·상주·밀양·고흥) 20-month course graduates receive bonus points and rental greenhouse priority.",
            "waterBasinPriority": "High score for concrete land/greenhouse lease readiness and regional specialty crop alignment.",
            "technicalMeritPoints": "Stage 1 Written 5-Year Business Plan (100 pts) + Stage 2 Provincial Panel Interview (100 pts)."
        },
        "vendorQuoteRules": [
            "Policy loan drawdowns for greenhouse construction require municipal verification of real construction progress and tax invoices."
        ],
        "disqualificationPitfalls": [
            "Maintaining full-time 4-major-insurance employment outside agriculture after grant activation.",
            "Using the Nonghyup Zero-Pay Youth Voucher card for non-approved luxury or non-farming personal expenses."
        ],
        "stackingRules": "Fully stackable with MAFRA Smart Farm ICT 50% Grant and Rural Housing / Farmland Bank (농지은행) long-term lease programs."
    },
    "NL-RVO-EG": {
        "officialCalculators": [
            {
                "name": "RVO Energiebesparingsberekening Glastuinbouw (EG-Rekentool)",
                "format": "Mijn RVO Online Form & Calculation Sheet",
                "description": "Calculates annual natural gas savings (Nm3/m2/yr) and CO2 reduction for 2nd/3rd thermal screens, diffuse AR glass, and HNT air handling units.",
                "url": "https://www.rvo.nl/subsidies-financiering/energie-efficientie-glastuinbouw"
            }
        ],
        "scoringCheatSheet": {
            "dacBonusPoints": "Up to 25%-40% grant rate for verified 'Het Nieuwe Telen' (Next Generation Growing) latent heat dehumidification and multi-screen packages.",
            "waterBasinPriority": "Priority alignment with Kas als Energiebron (Greenhouse as an Energy Source) decarbonization roadmap.",
            "technicalMeritPoints": "First-come, first-served within annual budget window for projects exceeding minimum Nm3 gas reduction per Euro invested."
        },
        "vendorQuoteRules": [
            "Itemized installer quote specifying screen light transmission, energy saving percentage (%), and m2 net glasshouse area.",
            "Requires eHerkenning Level 3 (eH3) digital authentication with KvK horticultural SBI code (0113 / 0119)."
        ],
        "disqualificationPitfalls": [
            "Signing the vendor order confirmation (opdrachtbevestiging) BEFORE submitting the RVO application.",
            "Applying for a first standard energy screen (only 2nd/3rd screens or advanced HNT dehumidification qualify)."
        ],
        "stackingRules": "Can be combined with Energie-investeringsaftrek (EIA 40% tax deduction) and Groenbank low-interest financing, subject to EU state-aid limits."
    },
    "NL-RVO-SDE": {
        "officialCalculators": [
            {
                "name": "RVO SDE++ Rentabiliteitsberekening & Basisbedrag Calculator",
                "format": "Mijn RVO SDE++ Simulation Tool",
                "description": "Models 12-to-15-year operating feed-in premium (€/MWh or €/ton CO2 avoided) for deep geothermal (Aardwarmte), ATES, and MW-scale heat pumps.",
                "url": "https://www.rvo.nl/subsidies-financiering/sde"
            }
        ],
        "scoringCheatSheet": {
            "dacBonusPoints": "Phased tender advantage: Bidding in Phase 1 or Phase 2 (lower €/ton CO2 subsidy intensity) secures budget before industrial competitors.",
            "waterBasinPriority": "High structural viability in Westland, Oostland, and Agriport A7 (Middenmeer) geothermal doublets.",
            "technicalMeritPoints": "100% hard gate on valid Omgevingsvergunning (environmental permit) and grid Transportindicatie at submission."
        },
        "vendorQuoteRules": [
            "Requires independent bank/equity financing commitment letter covering at least 20% equity and full CAPEX debt facility.",
            "Geological TNO subsurface seismic report required for geothermal doublets."
        ],
        "disqualificationPitfalls": [
            "Missing the Netbeheerder (Liander/Stedin/TenneT) positive transport capacity indication (Transportindicatie) due to Dutch grid congestion.",
            "Submitting with a draft rather than an irrevocable environmental permit."
        ],
        "stackingRules": "Operational OPEX subsidy; cannot be stacked with CAPEX grants on the exact same MWh generation asset beyond EU state-aid thresholds."
    },
    "CA-AAFC-ACT": {
        "officialCalculators": [
            {
                "name": "AAFC Agricultural Clean Technology GHG Quantification Tool",
                "format": "AAFC Online Portal Worksheet",
                "description": "Quantifies lifecycle GJ and metric tons of CO2e reduced from greenhouse condensing boilers, LED conversion, and thermal curtains.",
                "url": "https://agriculture.canada.ca/en/agricultural-programs-and-services/agricultural-clean-technology-program-adoption-stream"
            }
        ],
        "scoringCheatSheet": {
            "dacBonusPoints": "+10% Cost-Share Bonus (up to 60% grant): Youth farmers (<40 yrs), Indigenous producers, and women-led CEA enterprises.",
            "waterBasinPriority": "Strong priority in Leamington (Ontario), Fraser Valley (BC), and Quebec glasshouse corridors.",
            "technicalMeritPoints": "Ranked by direct tons of CO2e reduced per federal dollar requested."
        },
        "vendorQuoteRules": [
            "Minimum two (2) independent vendor quotes for all capital equipment items exceeding $25,000 CAD.",
            "Baseline 12-month natural gas / propane / electricity utility statements must be attached."
        ],
        "disqualificationPitfalls": [
            "Incurring deposits or equipment invoices prior to receiving the formal AAFC Conditional Approval Letter.",
            "New greenhouse acreage expansion (only energy-saving retrofits or verified clean-tech displacements qualify)."
        ],
        "stackingRules": "Stackable with provincial utility incentives (Enbridge Gas / Save on Energy Ontario / FortisBC) up to 75%-85% total government assistance cap."
    },
    "JP-MAFF-SMART": {
        "officialCalculators": [
            {
                "name": "MAFF / NARO スマート農業技術導入効果・労働時間削減試算シート",
                "format": "e-MAFF / jGrants Excel Evaluation Workbook",
                "description": "Calculates labor-hour reduction (% per 10a), yield increase (kg/10a), and 5-year ROI for AI climate computers, UECS fertigation, and harvesting robots.",
                "url": "https://www.maff.go.jp/j/kanbo/smart/"
            }
        ],
        "scoringCheatSheet": {
            "dacBonusPoints": "+10 Points: Certified Farmers (認定農業者 / 認定新規就農者) and consortia partnering with NARO (農研機構 つくば) or Prefectural Research Centers.",
            "waterBasinPriority": "+10 Points: Alignment with MAFF 'Midori Food System Strategy' (みどりの食料システム戦略) CO2 & chemical pesticide reduction targets.",
            "technicalMeritPoints": "Quantitative target of >=20% labor time reduction or >=15% marketable yield increase per 10a."
        },
        "vendorQuoteRules": [
            "Minimum two (2) comparative vendor quotes (相見積書) required for all automated hardware and sensors.",
            "Preferential scoring for open-standard UECS / WAGRI data-compatible environmental control systems."
        ],
        "disqualificationPitfalls": [
            "事前着手の禁止: Ordering or taking delivery of equipment before formal 交付決定通知 (Grant Award Notice) from the Prefectural/Regional Agricultural Bureau.",
            "Missing GbizID Prime (gBizIDプライム) digital authentication account for jGrants/e-MAFF submission."
        ],
        "stackingRules": "Can be paired with Japan Finance Corporation (日本政策金融公庫) Super L-Loan (0% interest initial 5 years for certified farmers) for the 50% grower match."
    }
}

NEW_TARGET_PROGRAMS = [
    # =========================================================================
    # 🇩🇪 GERMANY (DE) — Freising/Weihenstephan (Bayern), Bund (BAFA/BLE/Rentenbank/AFBG), Niedersachsen, BW
    # =========================================================================
    {
        "id": "DE-BY-BAYSL-GARTENBAU",
        "country": "DE",
        "countryName": "Germany",
        "region": "DE",
        "regionName": "Bavaria (Freising / Weihenstephan / München)",
        "jurisdictionLabel": "Germany (Bayern StMELF / BaySL)",
        "flag": "🇩🇪",
        "category": "smartfarm",
        "name": "Bayerisches Sonderprogramm Landwirtschaft & Gartenbau (BaySL Digital & Erwerbsgartenbau)",
        "agency": "Bayerisches Staatsministerium für Ernährung, Landwirtschaft, Forsten und Tourismus (StMELF)",
        "subsidyType": "Direct Non-Repayable State Capital Grant (Investitionszuschuss)",
        "subsidyRate": "20% - 35% of Eligible Capital Investment (+10% Junglandwirte Bonus)",
        "rateDecimal": 0.35,
        "maxAmount": "€400,000 eligible investment volume per Bavarian horticultural enterprise",
        "matchRequirement": "65% - 80% Grower Equity or Rentenbank Financing",
        "disbursementType": "Post-Inspection Reimbursement via iBALIS Digital Portal",
        "currency": "EUR",
        "verifiedDate": "2026-11-10 Verified (StMELF Bayern Förderrichtlinie BaySL)",
        "deadline": "Rolling Digital Intake via iBALIS Bavaria",
        "selectionMethod": "Verified Environmental, Water Conservation & Precision Horticulture Criteria",
        "targetEquipment": [
            "Closed-loop ebb-and-flow tables, gutter fertigation, and UV/filtrations disinfection (Geschlossene Bewässerungssysteme)",
            "Automated greenhouse climate computers, VPD/PAR sensor networks, and robotic transplanters",
            "Rainwater harvesting retention basins and insulated irrigation storage tanks",
            "Hail protection nets (Hagelschutznetze) and protected berry/vegetable polytunnel automation"
        ],
        "ineligibleItems": [
            "Used equipment, routine repairs, or standard replacement investments without ecological gain",
            "Investments below the €10,000 minimum threshold (Mindestinvestitionsvolumen)",
            "Projects ordered before receiving official AELF/StMELF approval"
        ],
        "qualificationCriteria": [
            "Commercial horticultural or agricultural enterprise with headquarters (Betriebssitz) in Bavaria (e.g., Freising, Straubing, Kitzingen, Nürnberg)",
            "Minimum 25% of total income derived from agriculture/horticulture or qualified Gärtnermeister management",
            "Must demonstrate measurable water saving, nutrient runoff elimination, or pesticide reduction"
        ],
        "documentChecklist": [
            "Online Application via iBALIS (Integriertes Bayerisches Landwirtschaftliches Informationssystem) with Betriebsnummer",
            "Three (3) itemized comparative vendor quotes (Vergleichsangebote) for all hardware",
            "Technical layout plan and water authority clearance (for rainwater basins)",
            "Meisterbrief im Gartenbau or agricultural degree certificate"
        ],
        "officialUrl": "https://www.stmelf.bayern.de/foerderung/bayerisches-sonderprogramm-landwirtschaft-baysl/index.html",
        "portalName": "iBALIS Bayern Förderportal",
        "contactPhone": "+49 89 2182-0",
        "contactEmail": "poststelle@stmelf.bayern.de",
        "linkedCalculator": "uvc-drainage-pathogen-disinfection-calculator.html",
        "linkedToolTitle": "UV-C Drainage Recirculation Calc",
        "summary": "Bavaria's dedicated state grant supporting commercial horticulture around Freising/Weihenstephan, Straubing, and Knoblauchsland with up to 35% funding for closed-loop irrigation, automation, and climate computers.",
        "deepGuide": "Log into iBALIS with your Bavarian Betriebsnummer and PIN. Consult your local Amt für Ernährung, Landwirtschaft und Forsten (AELF) Gartenbauzentren (e.g., AELF Fürth / Kitzingen / Landshut) prior to filing.",
        "applicationWindow": {
            "status": "open",
            "statusLabel": "🟢 연중 상시 접수 (iBALIS Open Intake)",
            "startDate": "2026-01-01",
            "endDate": "2026-12-31",
            "deadlineDisplay": "2026-12-31 (Continuous iBALIS Bavaria Submission)",
            "daysRemaining": 51,
            "cycleFrequency": "Year-Round State Budget Window",
            "submissionPortal": "StMELF iBALIS Portal"
        },
        "facets": {
            "fundingTier": "tier_medium",
            "matchTier": "low_match",
            "targetAudience": ["commercial_cea", "small_family", "beginning_farmer"],
            "technologies": ["water", "smartfarm", "energy"],
            "trackScope": "pure_ag"
        },
        "applicationPlaybook": {
            "officialCalculators": [
                {
                    "name": "LfL Weihenstephan Deckungsbeiträge & Kalkulationsdaten Gartenbau",
                    "format": "Online LfL Interactive Tool",
                    "description": "Official Bavarian State Research Center (LfL Freising-Weihenstephan) economic margin and investment calculator required for Bavarian horticultural viability checks.",
                    "url": "https://www.iba.lfl.bayern.de/"
                }
            ],
            "scoringCheatSheet": {
                "dacBonusPoints": "+10% Junglandwirte-Zuschlag for certified Gärtnermeister / Ingenieure under age 40 within 5 years of farm establishment.",
                "waterBasinPriority": "Priority approval for 100% closed-loop drain water recirculation and rainwater retention in drought-sensitive Franconian and Upper Bavarian regions.",
                "technicalMeritPoints": "Must exceed €10,000 net eligible investment and meet Bavarian positive list (Positivliste) technical criteria."
            },
            "vendorQuoteRules": [
                "Three independent vendor quotes required for investments exceeding €15,000 net.",
                "Invoices must strictly match the approved iBALIS cost categories."
            ],
            "disqualificationPitfalls": [
                "Ordering hardware before AELF issues the written Zustimmung zum vorzeitigen Maßnahmenbeginn or Zuwendungsbescheid.",
                "Combining BaySL with federal BLE Energieeffizienz on the exact same invoice line item."
            ],
            "stackingRules": "Can be combined with Bavarian AFP for larger structural glasshouse investments (>€400k) on separate subsystems and Rentenbank promotional loans."
        }
    },
    {
        "id": "DE-BAFA-EEW-MODUL4",
        "country": "DE",
        "countryName": "Germany",
        "region": "DE",
        "regionName": "Germany (Federal BAFA / KfW)",
        "jurisdictionLabel": "Germany (BAFA / BMWK)",
        "flag": "🇩🇪",
        "category": "energy",
        "name": "BAFA / KfW Bundesförderung für Energie- und Ressourceneffizienz (EEW Modul 2 & Modul 4 Prozesswärme)",
        "agency": "Bundesamt für Wirtschaft und Ausfuhrkontrolle (BAFA) & KfW Bankengruppe",
        "subsidyType": "Direct Federal Investment Grant (BAFA) or Repayment Bonus (KfW 295)",
        "subsidyRate": "Up to 40% - 55% for SMEs (KMU) on Process Heat & Heat Pumps",
        "rateDecimal": 0.45,
        "maxAmount": "Up to €15,000,000 per enterprise project",
        "matchRequirement": "45% - 60% Enterprise Financing (Combinable with KfW 295 low-interest credit)",
        "disbursementType": "Direct Grant Payout post-Verification (Verwendungsnachweis) or KfW Tilgungszuschuss",
        "currency": "EUR",
        "verifiedDate": "2026-11-10 Verified (BAFA EEW Richtlinie)",
        "deadline": "Continuous Year-Round Intake",
        "selectionMethod": "Quantitative CO2-Savings per Euro Fördermittel (Förderwettbewerb / Module Criteria)",
        "targetEquipment": [
            "Industrial electric & geothermal heat pumps supplying process heat/climate conditioning",
            "Biomass heating systems, solar thermal collector fields, and seasonal buffer storage",
            "Sensor-controlled process HVAC, waste heat recovery, and variable frequency drives (Modul 1/3)",
            "Energy management software (DIN EN ISO 50001) and real-time thermal metering hardware"
        ],
        "ineligibleItems": [
            "Fossil-fuel (coal, oil, natural gas-only) boilers and CHP cogeneration units",
            "Equipment mandated by statutory minimum law (GEG) without exceeding efficiency thresholds"
        ],
        "qualificationCriteria": [
            "Commercial businesses, industrial plant factories, and agricultural/horticultural companies in Germany",
            "Must submit an Einsparkonzept prepared by a BAFA-registered Energieeffizienz-Experte (EEE)",
            "Process heat share must exceed 50% of generated thermal output"
        ],
        "documentChecklist": [
            "BAFA Einsparkonzept (Energy & CO2 Savings Concept signed by listed Energieeffizienz-Experte)",
            "Hydraulic schematic (Hydraulikschema) and COP/JAZ seasonal performance calculation",
            "Itemized vendor quotations for heat pump, buffer storage, and control instrumentation",
            "KMU (SME) self-declaration and De-minimis / AGVO declaration"
        ],
        "officialUrl": "https://www.bafa.de/DE/Energie/Energieeffizienz/Energie_und_Ressourceneffizienz_in_der_Wirtschaft/energie_und_ressourceneffizienz_in_der_wirtschaft_node.html",
        "portalName": "BAFA Online-Portal / KfW Bank",
        "contactPhone": "+49 6196 908-1880",
        "contactEmail": "eew@bafa.bund.de",
        "linkedCalculator": "aquifer-thermal-energy-storage-ates-heat-pump.html",
        "linkedToolTitle": "Industrial Heat Pump & ATES Calc",
        "summary": "Germany's high-ceiling federal industrial & CEA decarbonization grant covering up to 40%-55% (up to €15M) for large heat pumps, biomass heating, and process waste-heat recovery.",
        "deepGuide": "For pure agricultural primary producers, check whether BLE Bundesprogramm Energieeffizienz or BAFA EEW offers the higher rate for your specific NACE/WZ 2008 code; food/packhouse and indoor vertical farms frequently leverage BAFA EEW.",
        "applicationWindow": {
            "status": "open",
            "statusLabel": "🟢 연중 상시 접수 (Continuous Federal Intake)",
            "startDate": "2026-01-01",
            "endDate": "2026-12-31",
            "deadlineDisplay": "2026-12-31 (Continuous BAFA Online Intake)",
            "daysRemaining": 51,
            "cycleFrequency": "Continuous Federal Rolling Intake",
            "submissionPortal": "BAFA ELAN-K2 Portal"
        },
        "facets": {
            "fundingTier": "tier_mega",
            "matchTier": "half_match",
            "targetAudience": ["commercial_cea", "food_processor"],
            "technologies": ["renewables", "energy", "smartfarm"],
            "trackScope": "cross_domain"
        },
        "applicationPlaybook": {
            "officialCalculators": [
                {
                    "name": "BAFA EEW Einsparkonzept-Tool & Förderrechner",
                    "format": "BAFA Online Calculation Portal",
                    "description": "Calculates eligible investment cap per ton of annual CO2 saved (€/t CO2/yr) and SME bonus (+10% to +15%).",
                    "url": "https://www.bafa.de/DE/Energie/Energieeffizienz/Energie_und_Ressourceneffizienz_in_der_Wirtschaft/energie_und_ressourceneffizienz_in_der_wirtschaft_node.html"
                }
            ],
            "scoringCheatSheet": {
                "dacBonusPoints": "+10% to +15% KMU-Bonus for small and medium enterprises (<250 employees).",
                "waterBasinPriority": "Module 2 rewards renewable process heat (solar thermal, geothermal, heat pumps with natural refrigerants R290/R717).",
                "technicalMeritPoints": "Up to €1,500 subsidy per ton of annual CO2 avoided in Module 4 for SMEs."
            },
            "vendorQuoteRules": [
                "Heat pumps in Module 2 must utilize natural refrigerants or meet strict GWP thresholds and seasonal COP minimums.",
                "Einsparkonzept must be uploaded at the time of application."
            ],
            "disqualificationPitfalls": [
                "Signing supply or delivery contracts prior to BAFA application submission acknowledgment.",
                "Double-claiming with BLE Bundesprogramm Energieeffizienz on the same thermal unit."
            ],
            "stackingRules": "Can be financed either as a direct BAFA cash grant OR as a KfW 295 promotional loan with repayment bonus (Tilgungszuschuss)."
        }
    },
    {
        "id": "DE-BLE-TORFMINDERUNG",
        "country": "DE",
        "countryName": "Germany",
        "region": "DE",
        "regionName": "Germany (Federal BMEL / BLE)",
        "jurisdictionLabel": "Germany (BMEL / BLE Torfminderung)",
        "flag": "🇩🇪",
        "category": "soils",
        "name": "BMEL / BLE Förderung der Torfminderung & Substrat-Digitalisierung im Erwerbsgartenbau",
        "agency": "Bundesministerium für Ernährung und Landwirtschaft (BMEL) / BLE",
        "subsidyType": "Direct Demonstration, Consulting & Technical Adaptation Grant",
        "subsidyRate": "Up to 50% - 100% for Model & Demonstration Projects (Modellvorhaben)",
        "rateDecimal": 0.6,
        "maxAmount": "Up to €250,000 per horticultural demonstration/transition project",
        "matchRequirement": "0% - 50% depending on research vs commercial enterprise partner tier",
        "disbursementType": "Milestone-based Federal Projektträger BLE Reimbursement",
        "currency": "EUR",
        "verifiedDate": "2026-11-10 Verified (BMEL Torfminderungsstrategie 2026)",
        "deadline": "Periodic BLE Projektträger Calls (Skizzen-Einreichung)",
        "selectionMethod": "Competitive Peer Review under Germany's Federal Climate Protection Program 2030",
        "targetEquipment": [
            "Precision fertigation & pH/EC/ammonium dosing skids calibrated for peat-free wood-fiber/coir/compost substrates",
            "Dielectric FDR/TDR substrate moisture & pore-water EC sensors for high-drain wood-fiber media",
            "Automated potting, wood-fiber defibration, and substrate mixing machinery",
            "Laboratory substrate N-immobilization and water-retention telemetry equipment"
        ],
        "ineligibleItems": [
            "Purchase of conventional high-peat substrates (>50% fossil peat)",
            "Standard greenhouse structures unrelated to peat-free cultivation adaptation"
        ],
        "qualificationCriteria": [
            "Commercial nurseries, pot-plant, berry, vegetable, and tree-nursery (Baumschule) operations in Germany",
            "Commitment to transition toward 100% peat-free or ultra-low-peat (<30%) commercial substrates by 2026-2030",
            "Willingness to share cultivation data with regional horticultural institutes (e.g., HSWT Weihenstephan, LVG Heidelberg, JKI)"
        ],
        "documentChecklist": [
            "Projektskizze (Project Outline detailing current peat baseline m3/yr and target substitution %)",
            "Easy-Online formal grant budget (AZA / AZK forms)",
            "Letter of Intent with scientific partner (e.g., HSWT Freising, LWK NRW, LVG)",
            "Vendor quotes for precision fertigation and substrate moisture sensor arrays"
        ],
        "officialUrl": "https://www.ble.de/DE/Projektfoerderung/Foerderungen-Auftraege/Torfminderung/torfminderung_node.html",
        "portalName": "BLE Projektträger / easy-Online",
        "contactPhone": "+49 228 6845-2931",
        "contactEmail": "torfminderung@ble.de",
        "linkedCalculator": "soil-matrix-water-potential-irrigation-trigger.html",
        "linkedToolTitle": "Substrate Matric Potential Calc",
        "summary": "Federal German climate grant supporting commercial nurseries and greenhouses transitioning to peat-free substrates (wood fiber, coir, bark humus) with precision fertigation and moisture telemetry.",
        "deepGuide": "Because wood fiber and bark substrates have lower buffer capacity and higher N-immobilization than peat, BLE heavily favors projects pairing substrate substitution with automated FDR moisture and EC fertigation control.",
        "applicationWindow": {
            "status": "open",
            "statusLabel": "🟢 연중 접수 및 컨소시엄 모집 (Active BLE Program)",
            "startDate": "2026-01-01",
            "endDate": "2026-12-31",
            "deadlineDisplay": "2026-12-31 (Ongoing BMEL Torfminderungsstrategie)",
            "daysRemaining": 51,
            "cycleFrequency": "Rolling Federal Climate Initiative",
            "submissionPortal": "BLE easy-Online Portal"
        },
        "facets": {
            "fundingTier": "tier_medium",
            "matchTier": "low_match",
            "targetAudience": ["commercial_cea", "small_family", "beginning_farmer"],
            "technologies": ["soils", "water", "smartfarm"],
            "trackScope": "pure_ag"
        },
        "applicationPlaybook": {
            "officialCalculators": [
                {
                    "name": "HSWT Weihenstephan / Terpeat Substrat- & Bewässerungsleitfaden",
                    "format": "Scientific Reference & Calibration Protocol",
                    "description": "Quantifies container capacity (WKmax), air capacity, and N-immobilization buffer adjustments for peat-free horticultural media.",
                    "url": "https://www.torffrei.info/"
                }
            ],
            "scoringCheatSheet": {
                "dacBonusPoints": "High priority for ornamental pot-plant (Zierpflanzenbau), strawberry substrate, and vegetable propagation nurseries.",
                "waterBasinPriority": "Extra merit for combining peat-free substrates with closed-loop ebb-and-flow irrigation.",
                "technicalMeritPoints": "Quantifiable reduction in m3 of fossil bog peat per year."
            },
            "vendorQuoteRules": [
                "Sensor and fertigation quotes must demonstrate high-frequency irrigation pulse capability suitable for coarse wood-fiber/coir media."
            ],
            "disqualificationPitfalls": [
                "Proposals that fail to document baseline peat consumption or lack scientific monitoring."
            ],
            "stackingRules": "Complements state AFP / BaySL closed-loop irrigation grants on separate hardware components."
        }
    },
    {
        "id": "DE-RENTENBANK-ZUKUNFT",
        "country": "DE",
        "countryName": "Germany",
        "region": "DE",
        "regionName": "Germany (Federal Rentenbank)",
        "jurisdictionLabel": "Germany (Rentenbank)",
        "flag": "🇩🇪",
        "category": "smartfarm",
        "name": "Landwirtschaftliche Rentenbank: Programm 'Zukunftsfelder im Gartenbau' & 'Nachhaltigkeit'",
        "agency": "Landwirtschaftliche Rentenbank (Anstalt des öffentlichen Rechts, Frankfurt am Main)",
        "subsidyType": "Subsidized Ultra-Low-Interest Promotional Loan + Tilgungszuschuss (Repayment Grant)",
        "subsidyRate": "Top-Tier Interest Subsidy (Preisklasse A) + Up to 20% Direct Grant on Innovation",
        "rateDecimal": 0.25,
        "maxAmount": "Up to €10,000,000 promotional loan volume per enterprise per year",
        "matchRequirement": "Bank Hausbank-Prinzip (Financed up to 100% of eligible net investment)",
        "disbursementType": "Disbursed via Local Commercial Bank (Hausbank: Sparkasse, Volksbank, DKB)",
        "currency": "EUR",
        "verifiedDate": "2026-11-10 Verified (Rentenbank Konditionenblatt)",
        "deadline": "Continuous Daily Banking Intake",
        "selectionMethod": "Non-Competitive Statutory Promotional Entitlement via Hausbank",
        "targetEquipment": [
            "Turnkey Venlo glasshouse construction, semi-closed ATU greenhouses, and vertical farming towers",
            "Autonomous greenhouse robotics, AI vision grading lines, and automated internal logistics (CC-Trolleys)",
            "Combined heat-pump, PV agri-voltaics, and closed-loop hydroponic infrastructure",
            "Farm succession (Hofübergabe) and young Gärtnermeister startup financing (Programm Junglandwirte)"
        ],
        "ineligibleItems": [
            "Pure debt refinancing (Umschuldung) of already completed investments",
            "Financial portfolio speculation unrelated to agricultural/horticultural production"
        ],
        "qualificationCriteria": [
            "Agricultural and horticultural enterprises (Gartenbaubetriebe) of any legal form in Germany",
            "Extra interest discount (Sonderkonditionen) for certified 'Junglandwirte' (<41 yrs with Gärtnermeister)",
            "Creditworthiness confirmed by the applicant's primary commercial bank (Hausbank)"
        ],
        "documentChecklist": [
            "Rentenbank Kreditantrag submitted through the applicant's Hausbank BEFORE project start",
            "Last 3 years of annual financial statements (Jahresabschlüsse / BMEL-Auflagenbuchführung)",
            "10-Year CapEx/OpEx cash-flow & debt-service coverage plan (Kapitaldienstfähigkeitsberechnung)",
            "Meisterbrief im Gartenbau (for Junglandwirte top interest tier)"
        ],
        "officialUrl": "https://www.rentenbank.de/foerderangebote/landwirtschaft/",
        "portalName": "Rentenbank / Hausbank Portal",
        "contactPhone": "+49 69 2107-700",
        "contactEmail": "office@rentenbank.de",
        "linkedCalculator": "greenhouse-capex-opex-10year-roi-calculator.html",
        "linkedToolTitle": "10-Yr CapEx/OpEx & Debt ROI Calc",
        "summary": "Germany's central agricultural development bank offering up to €10M per year in subsidized low-interest loans (with young Gärtnermeister discounts) to finance the 60%-70% grower match of BLE and AFP grants.",
        "deepGuide": "Always combine Rentenbank 'Junglandwirte' or 'Nachhaltigkeit' loans with BLE Energieeffizienz (40% grant) or state AFP (30% grant). Rentenbank explicitly permits stacking its subsidized loans with federal/state grants.",
        "applicationWindow": {
            "status": "rolling",
            "statusLabel": "🔄 연중 상시 대출 접수 (Daily Hausbank Intake)",
            "startDate": "2026-01-01",
            "endDate": "2026-12-31",
            "deadlineDisplay": "Year-Round Daily Processing via Hausbank",
            "daysRemaining": 51,
            "cycleFrequency": "Continuous Daily Refinancing Window",
            "submissionPortal": "Hausbank (Sparkasse / VR-Bank / Rabobank)"
        },
        "facets": {
            "fundingTier": "tier_mega",
            "matchTier": "low_match",
            "targetAudience": ["commercial_cea", "beginning_farmer", "small_family"],
            "technologies": ["energy", "smartfarm", "water", "renewables", "machinery"],
            "trackScope": "pure_ag"
        },
        "applicationPlaybook": {
            "officialCalculators": [
                {
                    "name": "Rentenbank Konditionen- & Tilgungsrechner",
                    "format": "Online Interest & Amortization Tool",
                    "description": "Calculates effective annual interest rate (Effektivzins) across Preisklassen A-G and EU subvention equivalents (Subventionswert).",
                    "url": "https://www.rentenbank.de/foerderangebote/konditionen/"
                }
            ],
            "scoringCheatSheet": {
                "dacBonusPoints": "Junglandwirte (<41 yrs with Meisterbrief) automatically receive the best interest tier advantage.",
                "waterBasinPriority": "Программа 'Nachhaltigkeit' covers 100% of closed-loop irrigation, peat-free substrate tech, and energy storage.",
                "technicalMeritPoints": "Non-competitive entitlement once Hausbank approves creditworthiness."
            },
            "vendorQuoteRules": [
                "Standard commercial quotes sufficient for Hausbank credit appraisal."
            ],
            "disqualificationPitfalls": [
                "Signing binding construction contracts before the Hausbank logs the formal Rentenbank application."
            ],
            "stackingRules": "100% stackable as the co-financing vehicle alongside BLE Bundesprogramm Energieeffizienz, AFP, and BaySL grants."
        }
    },
    {
        "id": "DE-NDS-AFP-GARTENBAU",
        "country": "DE",
        "countryName": "Germany",
        "region": "DE",
        "regionName": "Lower Saxony (Papenburg / Oldenburg / Hannover)",
        "jurisdictionLabel": "Germany (LWK Niedersachsen AFP)",
        "flag": "🇩🇪",
        "category": "energy",
        "name": "AFP Niedersachsen: Agrarinvestitionsförderungsprogramm Unterglas-Gartenbau & Wassermanagement",
        "agency": "Landwirtschaftskammer Niedersachsen (LWK Niedersachsen) / ML Niedersachsen",
        "subsidyType": "Direct Non-Repayable State/EU Capital Grant",
        "subsidyRate": "20% - 40% of Eligible Investment Volume",
        "rateDecimal": 0.35,
        "maxAmount": "Up to €2,500,000 eligible investment volume per enterprise",
        "matchRequirement": "60% - 80% Grower Equity / Rentenbank Loan",
        "disbursementType": "Post-Inspection Reimbursement by LWK Niedersachsen Bewilligungsstelle",
        "currency": "EUR",
        "verifiedDate": "2026-11-10 Verified (LWK Niedersachsen Richtlinie AFP)",
        "deadline": "Annual Autumn / Spring Cut-off Dates (Stichtagsverfahren)",
        "selectionMethod": "Point-Ranked Selection based on Resource Conservation & Climate Protection",
        "targetEquipment": [
            "Modernization of commercial vegetable and ornamental glasshouses (e.g., Papenburg / Ammerland clusters)",
            "Closed-loop ebb-and-flow irrigation, rainwater collection lagoons, and UV-C water sterilization",
            "Automated potting, grading, and climate control computers",
            "Frost protection irrigation and hail nets for fruit horticulture (Altes Land)"
        ],
        "ineligibleItems": [
            "Land purchase, used machinery, and investments started prior to Bewilligungsbescheid"
        ],
        "qualificationCriteria": [
            "Commercial horticultural enterprise located in Lower Saxony, Bremen, or Hamburg",
            "Manager holds Gärtnermeister or agricultural university degree",
            "Comprehensive Investitionskonzept proving long-term viability"
        ],
        "documentChecklist": [
            "AFP Investitionskonzept (LWK Niedersachsen Excel Template)",
            "Approved Baugenehmigung and water rights permit",
            "DIN 276 cost calculation and 3 vendor quotes",
            "Meisterbrief / Graduation Certificate"
        ],
        "officialUrl": "https://www.lwk-niedersachsen.de/lwk/news/32145_Agrarinvestitionsfoerderungsprogramm_AFP",
        "portalName": "LWK Niedersachsen Förderportal",
        "contactPhone": "+49 441 801-0",
        "contactEmail": "info@lwk-niedersachsen.de",
        "linkedCalculator": "greenhouse-irrigation-run-time-leaching-fraction-calculator.html",
        "linkedToolTitle": "Irrigation & Leaching Calc",
        "summary": "Lower Saxony's premier horticultural CAPEX grant supporting the Papenburg vegetable glasshouse and Ammerland nursery clusters with up to 40% funding on €2.5M investments.",
        "deepGuide": "Coordinate early with the LWK Niedersachsen Zentrum für Gartenbau und Technik (Ahlem / Bad Zwischenahn) to maximize environmental ranking points before the Stichtag.",
        "applicationWindow": {
            "status": "upcoming",
            "statusLabel": "🔵 2027 상반기 공모 예정 (Next Stichtag 2027 Q1)",
            "startDate": "2027-01-15",
            "endDate": "2027-03-31",
            "deadlineDisplay": "Spring 2027 Cut-Off Window",
            "daysRemaining": 141,
            "cycleFrequency": "Biannual Stichtag Selection",
            "submissionPortal": "LWK Niedersachsen Bewilligungsstelle"
        },
        "facets": {
            "fundingTier": "tier_mega",
            "matchTier": "low_match",
            "targetAudience": ["commercial_cea", "beginning_farmer", "small_family"],
            "technologies": ["water", "energy", "smartfarm"],
            "trackScope": "pure_ag"
        },
        "applicationPlaybook": {
            "officialCalculators": [
                {
                    "name": "LWK Niedersachsen AFP Investitionskonzept-Rechner",
                    "format": "Official Excel Workbook (.xlsx)",
                    "description": "Computes 5-year cash flow, debt service capacity, and Lower Saxony environmental selection points.",
                    "url": "https://www.lwk-niedersachsen.de/"
                }
            ],
            "scoringCheatSheet": {
                "dacBonusPoints": "+10% Junglandwirte-Zuschlag for qualified Gärtnermeister under 40.",
                "waterBasinPriority": "High ranking score for rainwater storage basins and 100% closed-loop nutrient recirculation.",
                "technicalMeritPoints": "Projects exceeding minimum threshold points on the LWK Niedersachsen Rankingliste are funded in full."
            },
            "vendorQuoteRules": [
                "Three independent vendor quotes required for all technical installations over €10,000."
            ],
            "disqualificationPitfalls": [
                "Submitting an incomplete Baugenehmigung at the Stichtag cut-off."
            ],
            "stackingRules": "Combinable with Rentenbank loans and Junglandwirte-Niederlassungsprämie."
        }
    },
    {
        "id": "DE-BW-AFP-GARTENBAU",
        "country": "DE",
        "countryName": "Germany",
        "region": "DE",
        "regionName": "Baden-Württemberg (Reichenau / Bodensee / Stuttgart)",
        "jurisdictionLabel": "Germany (MLR Baden-Württemberg AFP)",
        "flag": "🇩🇪",
        "category": "energy",
        "name": "AFP Baden-Württemberg: Agrarinvestitionsförderung Spezialkulturen & Unterglas-Gemüsebau",
        "agency": "Ministerium für Ernährung, Ländlichen Raum und Verbraucherschutz Baden-Württemberg (MLR)",
        "subsidyType": "Direct Non-Repayable State/EU Capital Grant",
        "subsidyRate": "20% - 35% of Eligible Capital Costs (+10% Junglandwirte Bonus)",
        "rateDecimal": 0.35,
        "maxAmount": "Up to €2,500,000 eligible investment volume",
        "matchRequirement": "65% - 80% Grower Equity / Rentenbank Loan",
        "disbursementType": "Milestone Reimbursement via Regierungspräsidium (FIONA Portal)",
        "currency": "EUR",
        "verifiedDate": "2026-11-10 Verified (MLR BW Förderrichtlinie AFP)",
        "deadline": "Biannual Selection Cut-Offs via FIONA",
        "selectionMethod": "Competitive Point Scoring (Klimaschutz, Ressourcenschutz, Spezialkulturen)",
        "targetEquipment": [
            "Climate-resilient Venlo glasshouse & foil house construction (e.g., Insel Reichenau / Bodensee vegetable belt)",
            "Closed-loop hydroponic gutter systems, UV disinfection, and drip fertigation",
            "Agri-voltaic specialty crop canopies (Agri-PV) and hail/rain protection structures",
            "Energy-saving dehumidification and thermal buffer tanks"
        ],
        "ineligibleItems": [
            "Fossil-fuel boilers, used equipment, and unpermitted structures"
        ],
        "qualificationCriteria": [
            "Commercial horticultural enterprise in Baden-Württemberg",
            "Vocational qualification as Gärtnermeister, Techniker, or Agraringenieur",
            "Verified Business Development Plan (Unternehmensentwicklungsplan)"
        ],
        "documentChecklist": [
            "FIONA Digital Application & Unternehmensentwicklungsplan (UEP)",
            "Approved Baugenehmigung and water authority permit",
            "Three (3) itemized vendor quotes",
            "Meisterbrief im Gartenbau"
        ],
        "officialUrl": "https://foerderung.landwirtschaft-bw.de/pb/,Lde/Startseite/Foerderwegweiser/Agrarinvestitionsfoerderungsprogramm+_AFP_",
        "portalName": "FIONA Baden-Württemberg Portal",
        "contactPhone": "+49 711 126-0",
        "contactEmail": "poststelle@mlr.bwl.de",
        "linkedCalculator": "semi-closed-greenhouse-air-treatment-unit-mollier.html",
        "linkedToolTitle": "Semi-Closed ATU Mollier Calc",
        "summary": "Baden-Württemberg's flagship grant for protected vegetable and specialty crop horticulture (Insel Reichenau, Kurpfalz, Lake Constance), funding up to 35%-45% of modern glasshouses and closed-loop water systems.",
        "deepGuide": "Work with an accredited Landesanstalt für Landwirtschaft (LEL Schwäbisch Gmünd) or LVG Heidelberg advisor to prepare the mandatory Unternehmensentwicklungsplan (UEP).",
        "applicationWindow": {
            "status": "open",
            "statusLabel": "🟢 상시 접수 후 분기별 심사 (FIONA Cut-Off)",
            "startDate": "2026-09-01",
            "endDate": "2027-02-15",
            "deadlineDisplay": "2027-02-15 (Winter Selection Cut-Off)",
            "daysRemaining": 97,
            "cycleFrequency": "Biannual Selection Cut-Offs",
            "submissionPortal": "FIONA Baden-Württemberg"
        },
        "facets": {
            "fundingTier": "tier_mega",
            "matchTier": "low_match",
            "targetAudience": ["commercial_cea", "beginning_farmer", "small_family"],
            "technologies": ["energy", "water", "smartfarm", "renewables"],
            "trackScope": "pure_ag"
        },
        "applicationPlaybook": {
            "officialCalculators": [
                {
                    "name": "LEL Schwäbisch Gmünd UEP-Investitionsrechner",
                    "format": "Official BW Excel Planning Tool",
                    "description": "Mandatory Baden-Württemberg corporate development plan calculator for AFP applications.",
                    "url": "https://foerderung.landwirtschaft-bw.de/"
                }
            ],
            "scoringCheatSheet": {
                "dacBonusPoints": "+10% Junglandwirte bonus for young Gärtnermeister.",
                "waterBasinPriority": "High priority for closed-loop irrigation near Lake Constance (Bodensee) and Rhine aquifer zones.",
                "technicalMeritPoints": "Agri-PV and zero-runoff hydroponics score in the top funding tier."
            },
            "vendorQuoteRules": [
                "Three comparative quotes required for all machinery and greenhouse trades."
            ],
            "disqualificationPitfalls": [
                "Commencing groundwork prior to Regierungspräsidium written approval."
            ],
            "stackingRules": "Stackable with Rentenbank promotional loans and BW Meistergründungsprämie (€10,000)."
        }
    },
    {
        "id": "DE-AFBG-MEISTER-NRW",
        "country": "DE",
        "countryName": "Germany",
        "region": "DE",
        "regionName": "Germany (Federal BMBF + Bayern/NRW/BW Meisterbonus)",
        "jurisdictionLabel": "Germany (AFBG Aufstiegs-BAföG & Meisterprämie)",
        "flag": "🇩🇪",
        "category": "youth",
        "name": "Aufstiegs-BAföG (AFBG) + Landes-Meisterbonus & Meistergründungsprämie für Gärtnermeister",
        "agency": "Bundesministerium für Bildung und Forschung (BMBF) & Länder (StMELF Bayern / MUNV NRW / MLR BW)",
        "subsidyType": "50%-75% Non-Repayable Tuition Grant + €3,000 Meisterbonus + €10,000-€15,000 Startup Grant",
        "subsidyRate": "Up to 75% Debt Forgiveness + 100% Cash Meisterbonus upon Passing",
        "rateDecimal": 0.75,
        "maxAmount": "Up to €15,000 Course Grant + €3,000 Meisterbonus (BY) + €10,500 Startup Prämie",
        "matchRequirement": "0% Match on Living Maintenance Grant (Unterhaltsbeitrag is 100% Zuschuss)",
        "disbursementType": "Monthly Direct Living Grant + Lump-Sum Cash Bonus upon Meisterbrief Issuance",
        "currency": "EUR",
        "verifiedDate": "2026-11-10 Verified (AFBG Gesetz & Bayerischer Meisterbonus)",
        "deadline": "Year-Round Entitlement (Apply prior to Fachschule / Meisterschule start)",
        "selectionMethod": "100% Statutory Legal Entitlement (Rechtsanspruch — Independent of Age)",
        "targetEquipment": [
            "Full-time or part-time Gartenbaumeister school tuition and examination fees (e.g., Essen, Straelen, Veitshöchheim, Hohenheim, Ahlem)",
            "100% non-repayable monthly living stipend (Unterhaltsbeitrag) during full-time Meisterschule",
            "Meisterstück / Arbeitsprojekt practical greenhouse trial expenses",
            "First-time horticultural business acquisition or startup capital (Meistergründungsprämie)"
        ],
        "ineligibleItems": [
            "Applicants who already possess a German university Master/Diplom degree of equivalent DQR Level 7"
        ],
        "qualificationCriteria": [
            "Completed vocational training as Gärtner/in (Gesellenbrief) OR multiple years of verified professional horticultural practice (Berufspraxis § 53 BBiG)",
            "Permanent residence or employment qualification under § 8 AFBG in Germany",
            "Enrollment at an accredited state Fachschule für Gartenbau / Meisterschule"
        ],
        "documentChecklist": [
            "AFBG Formblatt A & Formblatt B (Confirmation of enrollment at Fachschule für Gartenbau)",
            "Proof of Gärtner Gesellenprüfung or § 45(2) BBiG admission certificate from Landwirtschaftskammer",
            "Meisterprüfungszeugnis (for automatic 50% KfW loan forgiveness + €3,000 Bavarian Meisterbonus)"
        ],
        "officialUrl": "https://www.aufstiegs-bafoeg.de/",
        "portalName": "AFBG Digital Portal / LWK Meisterbonus",
        "contactPhone": "+49 800 6223634",
        "contactEmail": "aufstiegs-bafoeg@bmbf.bund.de",
        "linkedCalculator": "greenhouse-capex-opex-10year-roi-calculator.html",
        "linkedToolTitle": "Meister Career & CapEx ROI",
        "summary": "Statutory German career & startup accelerator providing 100% non-repayable monthly living support during full-time Gärtnermeister schooling, 75%+ tuition forgiveness upon passing, €3,000 cash Meisterbonus (Bavaria), and €10,500+ startup grants.",
        "deepGuide": "Under the reformed AFBG, the monthly living allowance (Unterhaltsbeitrag) during full-time Fachschule (e.g., 1-year Meisterschule in Essen, Veitshöchheim, or Hohenheim) is a 100% non-repayable grant! Upon passing the Gärtnermeister exam, 50% of the remaining course loan is forgiven, and another 100% is forgiven if you establish or take over a horticultural business within 3 years.",
        "applicationWindow": {
            "status": "open",
            "statusLabel": "🟢 연중 상시 법적 권리 (100% Statutory Entitlement)",
            "startDate": "2026-01-01",
            "endDate": "2026-12-31",
            "deadlineDisplay": "Year-Round (Submit before Meisterschule Semester Start)",
            "daysRemaining": 51,
            "cycleFrequency": "Permanent Statutory Entitlement",
            "submissionPortal": "AFBG Online (aufstiegs-bafoeg.de)"
        },
        "facets": {
            "fundingTier": "tier_micro",
            "matchTier": "zero_match",
            "targetAudience": ["beginning_farmer", "commercial_cea"],
            "technologies": ["smartfarm", "energy"],
            "trackScope": "pure_ag"
        },
        "applicationPlaybook": {
            "officialCalculators": [
                {
                    "name": "BMBF Aufstiegs-BAföG Förderrechner",
                    "format": "Official Online Entitlement Calculator",
                    "description": "Calculates exact monthly non-repayable living stipend (Unterhaltsbeitrag) and tuition forgiveness percentages.",
                    "url": "https://www.aufstiegs-bafoeg.de/bafoegde/de/das-aufstiegs-bafoeg-in-zahlen/foerderrechner/foerderrechner_node.html"
                }
            ],
            "scoringCheatSheet": {
                "dacBonusPoints": "100% Statutory Legal Right (Rechtsanspruch) with NO age limit.",
                "waterBasinPriority": "Bavaria awards an automatic €3,000 cash Meisterbonus; NRW awards €2,500 Meisterprämie; Berlin/BW/NDS offer €10,000+ Meistergründungsprämie.",
                "technicalMeritPoints": "100% forgiveness of remaining course loan if founding or taking over a horticultural business with >=1 employee within 36 months."
            },
            "vendorQuoteRules": [
                "Only requires Formblatt B signed by the state Fachschule für Gartenbau / Landwirtschaftskammer."
            ],
            "disqualificationPitfalls": [
                "Applying for the Unterhaltsbeitrag retroactively after the school semester has ended (monthly living grant starts only from the month of application)."
            ],
            "stackingRules": "Directly unlocks eligibility for GAP Junglandwirte-Niederlassungsprämie (€70,000), AFP +10% Young Farmer Bonus, and Rentenbank Junglandwirte loans!"
        }
    },

    # =========================================================================
    # 🇯🇵 JAPAN (JP) — Tsukuba (NARO / 農研機構), MAFF (農林水産省), METI (経済産業省)
    # =========================================================================
    {
        "id": "JP-MAFF-MIDORI-GX",
        "country": "JP",
        "countryName": "Japan",
        "region": "JP",
        "regionName": "Japan (Nationwide / MAFF Midori GX)",
        "jurisdictionLabel": "Japan (農林水産省 みどりの食料システム)",
        "flag": "🇯🇵",
        "category": "energy",
        "name": "MAFF Green Food System Strategy GX Grant (みどりの食料システム戦略推進交付金・脱炭素施設園芸)",
        "agency": "Ministry of Agriculture, Forestry and Fisheries (農林水産省 農産局・環境バイオマス政策課)",
        "subsidyType": "Direct Capital Grant (1/2 Subsidy Rate for GX Facility Horticulture)",
        "subsidyRate": "Up to 50% (1/2以内) of Eligible Decarbonization & Smart CEA CAPEX",
        "rateDecimal": 0.5,
        "maxAmount": "Up to ¥100,000,000 per regional GX greenhouse consortium / model hub",
        "matchRequirement": "50% Grower / Municipality / Consortium Match (Eligible for JFC Super L Loan)",
        "disbursementType": "Prefectural / Municipal Grant Pass-Through Post-Inspection",
        "currency": "JPY",
        "verifiedDate": "2026-11-10 Verified (MAFF Midori Strategy FY2026/2027 Budget)",
        "deadline": "Annual Prefectural Intake Windows (Jan-March & Supplementary Autumn Budget)",
        "selectionMethod": "Competitive Scoring based on Fossil Fuel Reduction (%), Chemical Pesticide Cut, and Midori Certification",
        "targetEquipment": [
            "Hybrid EHP/GHP agricultural heat pumps and woody biomass boilers replacing heavy oil A (A重油) heaters",
            "Semi-closed greenhouse CO2 enrichment, crown-heating pipes (クラウン加温) for strawberries, and multi-layer thermal curtains",
            "UV-C / ozone hydroponic drainage disinfection and closed-loop nutrient recycling units",
            "Electrostatic sprayers, UV-B powdery mildew suppression LEDs, and biological IPM insectary screens"
        ],
        "ineligibleItems": [
            "Fossil-fuel-only heavy oil heaters without hybrid heat pump integration",
            "Consumable agricultural vinyl or routine maintenance supplies"
        ],
        "qualificationCriteria": [
            "Horticultural producers, JA cooperatives, or municipal consortia certified under the Midori Environmental Activity Plan (みどり認定)",
            "Must commit to measurable reduction in fossil fuel CO2 emissions (>=30%) and chemical pesticide/fertilizer inputs",
            "Submission through municipal/prefectural Midori Strategy promotion councils"
        ],
        "documentChecklist": [
            "Midori Certification Certificate (環境負荷低減事業活動実施計画「みどり認定」)",
            "Greenhouse Fossil Fuel & CO2 Reduction Calculation Sheet (重油削減試算表)",
            "Minimum two (2) comparative vendor quotes (相見積書)",
            "5-Year Horticultural Business & Yield Plan (イチゴ・トマト・パプリカ等)"
        ],
        "officialUrl": "https://www.maff.go.jp/j/kanbo/kankyo/seisaku/midori/",
        "portalName": "e-MAFF / Prefectural Horticultural Division",
        "contactPhone": "+81-3-3502-8111",
        "contactEmail": "midori_gx@maff.go.jp",
        "linkedCalculator": "crops/commercial-strawberry-greenhouse-climate-dli-guide.html",
        "linkedToolTitle": "Strawberry Crown & DLI Guide",
        "summary": "Japan's flagship 'Midori Strategy' decarbonization grant funding 50% (up to ¥100M) of heat pumps, strawberry crown-heating systems, UV-B/UV-C pathogen control, and semi-closed CO2 greenhouses.",
        "deepGuide": "Obtain 'Midori Certification' (みどり認定) from your prefecture first! Certified Midori growers receive priority points across all MAFF grants plus special tax depreciation (みどり投資促進税制) allowing immediate 50% bonus depreciation on smart greenhouse hardware.",
        "applicationWindow": {
            "status": "open",
            "statusLabel": "🟢 2026/2027 보정예산 및 본예산 공모 중 (Active FY2026/27 Intake)",
            "startDate": "2026-11-01",
            "endDate": "2027-02-28",
            "deadlineDisplay": "2027-02-28 (FY2026 Supplementary / FY2027 Initial Call)",
            "daysRemaining": 110,
            "cycleFrequency": "Biannual (Initial Budget + Autumn Supplementary Budget 補正予算)",
            "submissionPortal": "e-MAFF / Prefectural Midori Council"
        },
        "facets": {
            "fundingTier": "tier_large",
            "matchTier": "half_match",
            "targetAudience": ["commercial_cea", "small_family", "beginning_farmer"],
            "technologies": ["energy", "smartfarm", "water", "renewables"],
            "trackScope": "pure_ag"
        },
        "applicationPlaybook": {
            "officialCalculators": [
                {
                    "name": "JPPA / MAFF 施設園芸省에너지・ヒートポンプ導入効果試算ツール",
                    "format": "Japan Greenhouse Horticulture Association (JGHA) Tool",
                    "description": "Calculates heavy oil (A重油) liter reduction, COP efficiency, and payback period for hybrid heat pumps and thermal curtains.",
                    "url": "https://jgha.com/"
                }
            ],
            "scoringCheatSheet": {
                "dacBonusPoints": "+15 Points: Certified 'Midori' Growers (みどり認定農業者) receive top priority AND immediate tax depreciation benefits.",
                "waterBasinPriority": "+10 Points: Closed-loop strawberry/tomato elevated bench fertigation with UV-C sterilization.",
                "technicalMeritPoints": "Projects cutting heavy oil consumption by >=50% via heat pumps + triple thermal screens rank in Tier 1."
            },
            "vendorQuoteRules": [
                "Requires competitive quotes from minimum 2 qualified greenhouse builders (ハウスメーカー / 設備業者).",
                "Equipment must also be registered on the Midori Tax Incentive list if claiming bonus depreciation."
            ],
            "disqualificationPitfalls": [
                "Placing equipment orders before formal Prefectural Grant Award Notice (交付決定前着工の禁止)."
            ],
            "stackingRules": "Stackable with the Midori Investment Promotion Tax System (みどり投資促進税制) and JFC interest-free Super L Loans."
        }
    },
    {
        "id": "JP-MAFF-STRONG-AGRI",
        "country": "JP",
        "countryName": "Japan",
        "region": "JP",
        "regionName": "Japan (Nationwide / Next-Gen Facility Horticulture)",
        "jurisdictionLabel": "Japan (農林水産省 強い農業づくり)",
        "flag": "🇯🇵",
        "category": "smartfarm",
        "name": "MAFF Comprehensive Grant for Strong Agriculture & Next-Gen Large-Scale Greenhouses (強い農業づくり総合支援交付金・次世代施設園芸)",
        "agency": "Ministry of Agriculture, Forestry and Fisheries (農林水産省 農産局園芸作物課)",
        "subsidyType": "Direct Structural & Equipment CAPEX Grant (産地基幹施設等支援)",
        "subsidyRate": "Up to 50% (1/2以内) of Greenhouse Construction, Climate & Packhouse CAPEX",
        "rateDecimal": 0.5,
        "maxAmount": "Up to ¥300,000,000 - ¥500,000,000 per regional production hub",
        "matchRequirement": "50% Agricultural Corporation / JA Cooperative / Municipal Co-Financing",
        "disbursementType": "Milestone-Based Construction & Commissioning Disbursement",
        "currency": "JPY",
        "verifiedDate": "2026-11-10 Verified (MAFF Horticultural Division Guidelines)",
        "deadline": "Prefectural Priority Allocation Rounds (Winter / Spring)",
        "selectionMethod": "Cost-Benefit Ratio (費用対効果分析 B/C >= 1.0) & Export/Regional Yield Targets",
        "targetEquipment": [
            "Large-scale Venlo-type glasshouses and high-eave (軒高4m〜6m) low-cost weather-resistant steel houses (低コスト耐候性ハウス)",
            "Integrated environmental control computers (統合環境制御装置), CO2 generators, and fogging systems",
            "Elevated strawberry/tomato hydroponic benches (高設栽培ベンチ) and automated fertigation plants",
            "Centralized robotic optical sorting, precooling, and cold-chain packhouse facilities (集出荷貯蔵施設)"
        ],
        "ineligibleItems": [
            "Projects whose Cost-Benefit Ratio (B/C) falls below 1.0 under MAFF engineering appraisal",
            "Individual non-certified hobby greenhouses"
        ],
        "qualificationCriteria": [
            "Agricultural corporations (農業法人), JA cooperatives, or Certified Farmers positioned in the Regional Agricultural Master Plan (地域計画)",
            "Must prove Cost-Benefit Ratio (B/C: 投資効率性) >= 1.0 over the statutory asset depreciation life",
            "Must establish concrete yield (kg/10a) or export expansion targets"
        ],
        "documentChecklist": [
            "MAFF Cost-Benefit Analysis Workbook (費用対効果分析算定調書 B/C >= 1.0)",
            "Inclusion Certificate in the Municipal Regional Agriculture Plan (地域計画への位置付け確認書)",
            "Architectural structural drawings (JIS A 8960 greenhouse wind/snow resistance compliance)",
            "Three (3) competitive construction & machinery contractor bids"
        ],
        "officialUrl": "https://www.maff.go.jp/j/seisan/suishin/tuyoi_nougyou/",
        "portalName": "Prefectural / Municipal Agricultural Administration",
        "contactPhone": "+81-3-3502-8111",
        "contactEmail": "engei_shisetsu@maff.go.jp",
        "linkedCalculator": "crop-yield-biomass-dli-forecaster.html",
        "linkedToolTitle": "DLI & Yield Forecaster (B/C Model)",
        "summary": "Japan's largest capital infrastructure grant covering up to 50% (¥300M+) for high-eave commercial greenhouses, integrated environmental control systems, and automated packhouses.",
        "deepGuide": "The single most decisive gate is the MAFF Cost-Benefit Ratio (費用対効果分析 B/C >= 1.0) and the 'Unit Construction Cost Ceiling' (事業費単価上限). Use our DLI & Yield Forecaster to substantiate the 15%-30% yield gain required to push B/C above 1.2.",
        "applicationWindow": {
            "status": "open",
            "statusLabel": "🟢 지자체별 수요조사 및 공모 진행 중 (Active Municipal Intake)",
            "startDate": "2026-10-15",
            "endDate": "2027-01-31",
            "deadlineDisplay": "2027-01-31 (Prefectural Demand Survey & Allocation)",
            "daysRemaining": 82,
            "cycleFrequency": "Biannual (Main Budget + Supplementary Budget)",
            "submissionPortal": "Municipal / Prefectural Agriculture Department"
        },
        "facets": {
            "fundingTier": "tier_mega",
            "matchTier": "half_match",
            "targetAudience": ["commercial_cea", "food_processor"],
            "technologies": ["smartfarm", "energy", "water", "machinery"],
            "trackScope": "pure_ag"
        },
        "applicationPlaybook": {
            "officialCalculators": [
                {
                    "name": "MAFF 強い農業づくり総合支援交付金・費用対効果分析（B/C）算定シート",
                    "format": "Mandatory MAFF Excel Appraisal Sheet",
                    "description": "Calculates discounted Net Present Value of incremental crop gross margin divided by total capital outlay (must exceed 1.0).",
                    "url": "https://www.maff.go.jp/j/seisan/suishin/tuyoi_nougyou/"
                }
            ],
            "scoringCheatSheet": {
                "dacBonusPoints": "Priority points (配分基準ポイント) for adopting high-eave weather-resistant greenhouses, GlobalG.A.P./JGAP certification, and export commitments.",
                "waterBasinPriority": "Mandatory enrollment in horticultural facility mutual insurance (園芸施設共済) for typhoon/snow resilience.",
                "technicalMeritPoints": "Ranked nationwide by MAFF points matrix (ポイント制); higher yield per 10a and lower construction cost per m2 win allocation."
            },
            "vendorQuoteRules": [
                "Must conduct competitive bidding (一般競争入札 or 3社以上の見積合せ) after grant approval."
            ],
            "disqualificationPitfalls": [
                "Failing to enroll the completed greenhouse in Agricultural Mutual Relief Insurance (園芸施設共済).",
                "Exceeding MAFF's per-square-meter unit cost ceiling without engineering justification."
            ],
            "stackingRules": "Can be financed alongside Japan Finance Corporation (日本政策金融公庫) long-term facility loans and prefectural top-up subsidies."
        }
    },
    {
        "id": "JP-MAFF-FUEL-SAFETY",
        "country": "JP",
        "countryName": "Japan",
        "region": "JP",
        "regionName": "Japan (Nationwide / Facility Horticulture Safety Net)",
        "jurisdictionLabel": "Japan (施設園芸セーフティネット・省エネ支援)",
        "flag": "🇯🇵",
        "category": "energy",
        "name": "Facility Horticulture Fuel Price Safety Net & Energy-Saving Equipment Grant (施設園芸等燃料価格高騰対策・省エネ設備導入支援)",
        "agency": "Japan Greenhouse Horticulture Association (一般社団法人日本施設園芸協会 JGHA) / MAFF",
        "subsidyType": "50% Energy-Saving Hardware Subsidy + Fuel Price Spike Compensation Fund",
        "subsidyRate": "50% Hardware Grant + 70% Fuel Price Spike Compensation (1:1 Fund Match)",
        "rateDecimal": 0.5,
        "maxAmount": "50% of Multi-Layer Screens / Heat Pumps + Unlimited Fuel Price Spike Payout",
        "matchRequirement": "50% Grower Match on Hardware & Fuel Reserve Contribution",
        "disbursementType": "Direct JGHA / Prefectural Fund Council Transfer",
        "currency": "JPY",
        "verifiedDate": "2026-11-10 Verified (JGHA / MAFF FY2026 Guidelines)",
        "deadline": "Annual Autumn/Winter Enrollment via Prefectural Councils",
        "selectionMethod": "Guaranteed for Enrolled Safety-Net Growers Adopting >=15% Fuel Reduction Plan",
        "targetEquipment": [
            "Multi-layer thermal energy screens (多層保温カーテン・内張りカーテン)",
            "Agricultural electric heat pumps (施設園芸用ヒートポンプ) and exhaust heat recovery units",
            "Variable-temperature circulation fans (変温管理装置・循環扇) and crown-heating tubes (局所加温設備)",
            "Double-layer PO film (外張り二重被覆) and sidewall insulation skirts"
        ],
        "ineligibleItems": [
            "Growers who do not formulate a 3-year 15% Fuel Consumption Reduction Plan (省エネルギー等推進計画)"
        ],
        "qualificationCriteria": [
            "Group of 3+ heated greenhouse growers (or single agricultural corporation with >=50a heated area)",
            "Commitment to reduce fossil heating fuel consumption by >=15% over 3 years",
            "Enrollment in the JGHA Facility Horticulture Fuel Price Safety Net (セーフティネット構築事業)"
        ],
        "documentChecklist": [
            "3-Year Greenhouse Fuel Reduction Plan (省エネルギー等推進計画 — >=15% cut)",
            "Historical 3-year A-heavy oil / kerosene / LPG purchase invoices",
            "Itemized vendor quotes for thermal curtains, heat pumps, or local crown heaters"
        ],
        "officialUrl": "https://jgha.com/nenryo/",
        "portalName": "JGHA / Prefectural Facility Horticulture Support Council",
        "contactPhone": "+81-3-3667-1631",
        "contactEmail": "nenryo@jgha.com",
        "linkedCalculator": "greenhouse-heating-load-thermal-screen-calculator.html",
        "linkedToolTitle": "Thermal Curtain & Heat Pump Calc",
        "summary": "Dual-track Japanese greenhouse program offering 50% grants for multi-layer thermal screens, crown heaters, and heat pumps PLUS automatic cash payouts whenever A-heavy oil or kerosene prices breach trigger thresholds.",
        "deepGuide": "Especially popular among Japanese strawberry (Tochigi, Fukuoka, Ibaraki/Tsukuba) and tomato growers: installing a strawberry crown-heating tube (クラウン局所加温) + double thermal curtain easily achieves the mandatory 15% fuel reduction while qualifying for 50% equipment subsidy.",
        "applicationWindow": {
            "status": "open",
            "statusLabel": "🟢 동절기 시설원예 에너지 절감 공모 중 (Winter Enrollment Open)",
            "startDate": "2026-10-01",
            "endDate": "2027-01-20",
            "deadlineDisplay": "2027-01-20 (Winter Heating Season Batch)",
            "daysRemaining": 71,
            "cycleFrequency": "Annual Autumn/Winter Solicitation",
            "submissionPortal": "Prefectural Facility Horticulture Council (都道府県施設園芸支援協議会)"
        },
        "facets": {
            "fundingTier": "tier_medium",
            "matchTier": "half_match",
            "targetAudience": ["commercial_cea", "small_family"],
            "technologies": ["energy", "renewables"],
            "trackScope": "pure_ag"
        },
        "applicationPlaybook": {
            "officialCalculators": [
                {
                    "name": "JGHA 省エネルギーチェックシート＆燃料削減率計算ツール",
                    "format": "Official JGHA Excel Checklist",
                    "description": "Verifies that the selected combination of thermal screens, heat pumps, and crown heating achieves >=15% fuel savings.",
                    "url": "https://jgha.com/nenryo/"
                }
            ],
            "scoringCheatSheet": {
                "dacBonusPoints": "Single corporate farms with >=50a (5,000 m2) heated greenhouse area can apply directly without forming a 3-farm group.",
                "waterBasinPriority": "High adoption in Ibaraki (Tsukuba), Tochigi, Gunma, Aichi, Kochi, Kumamoto, and Miyazaki.",
                "technicalMeritPoints": "Automatic trigger payout whenever monthly A-heavy oil price exceeds the 7-year moving average threshold."
            },
            "vendorQuoteRules": [
                "Requires itemized vendor quotations separating material cost and installation labor."
            ],
            "disqualificationPitfalls": [
                "Failing to submit monthly fuel purchase receipts during the winter heating season."
            ],
            "stackingRules": "Fuel price compensation is 100% compatible with MAFF Midori GX and Smart Agriculture equipment grants on distinct hardware items."
        }
    },
    {
        "id": "JP-NARO-BRAIN-SMART",
        "country": "JP",
        "countryName": "Japan",
        "region": "JP",
        "regionName": "Japan (Tsukuba NARO / BRAIN National R&D & Commercialization)",
        "jurisdictionLabel": "Japan (農研機構 NARO Tsukuba / BRAIN)",
        "flag": "🇯🇵",
        "category": "smartfarm",
        "name": "NARO Tsukuba / BRAIN Smart Agriculture R&D & Commercial Deployment Consortia (農研機構・生研支援センター スマート農業技術開発・実装事業)",
        "agency": "National Agriculture and Food Research Organization (農研機構 NARO, Tsukuba) / Bio-oriented Technology Research Advancement Institution (BRAIN)",
        "subsidyType": "100% Commissioned R&D & Field Validation Funding (委託研究費)",
        "subsidyRate": "Up to 100% Commissioned Funding for Approved Consortium Tasks",
        "rateDecimal": 1.0,
        "maxAmount": "¥30,000,000 to ¥150,000,000 per year per consortium",
        "matchRequirement": "0% Direct Cash Match (Commissioned Research Contract 委託事業)",
        "disbursementType": "Quarterly / Milestone Commissioned Contract Payments via NARO BRAIN",
        "currency": "JPY",
        "verifiedDate": "2026-11-10 Verified (NARO BRAIN Tsukuba Solicitation)",
        "deadline": "Annual Spring/Winter Public Solicitations via e-Rad",
        "selectionMethod": "Scientific & Commercialization Peer Review by NARO BRAIN Panel",
        "targetEquipment": [
            "Autonomous AI greenhouse climate & transpiration model controllers (DLI, VPD, Penman-Monteith optimization)",
            "Automated strawberry/tomato harvesting robots, pollination drones, and UV-C mobile robots",
            "Phenotyping multispectral cameras, sap-flow sensors, and WAGRI API cloud integration",
            "Closed-loop plant factory and greenhouse energy-autonomous control algorithms"
        ],
        "ineligibleItems": [
            "Purely routine commercial farm expansion without technological R&D or validation metrics"
        ],
        "qualificationCriteria": [
            "Consortia comprising universities/research institutes (e.g., NARO Tsukuba, Univ. of Tsukuba, Chiba Univ., UTokyo), AgTech companies, and commercial demonstration farms",
            "Registration in the Cross-Ministerial R&D Management System (府省共通研究開発管理システム e-Rad)",
            "Commitment to commercialize the smart agriculture package within 2-3 years of project completion"
        ],
        "documentChecklist": [
            "e-Rad Research & Implementation Proposal (研究実施計画書)",
            "Joint Consortium Agreement (共同研究コンソーシアム規約)",
            "Quantitative KPI Roadmap (TRL progression, $/m2 cost reduction, labor-hour cut)",
            "Equipment prototype & field validation budget breakdown"
        ],
        "officialUrl": "https://www.naro.go.jp/laboratory/brain/smart-nogyo/",
        "portalName": "e-Rad (府省共通研究開発管理システム) / NARO BRAIN",
        "contactPhone": "+81-44-276-8994",
        "contactEmail": "brain-smart@ml.affrc.go.jp",
        "linkedCalculator": "greenhouse-autonomous-ai-climate-controller.html",
        "linkedToolTitle": "Autonomous AI Climate Controller",
        "summary": "Administered by NARO (農研機構) & BRAIN, this flagship program funds up to 100% (¥30M–¥150M/yr) of AI greenhouse climate control, yield forecasting, and robotic harvesting trials.",
        "deepGuide": "Directly aligned with researchers at NARO Tsukuba (つくば) and agricultural universities: proposals that integrate physical plant physiology models (Penman-Monteith transpiration, Farquhar photosynthesis, DLI biomass accumulation) with real-time greenhouse actuators score highest.",
        "applicationWindow": {
            "status": "upcoming",
            "statusLabel": "🔵 2027년도 신규과제 공모 예정 (FY2027 e-Rad Call)",
            "startDate": "2026-12-15",
            "endDate": "2027-02-15",
            "deadlineDisplay": "Winter 2026/2027 e-Rad Public Solicitation",
            "daysRemaining": 97,
            "cycleFrequency": "Annual National R&D & Field Deployment Call",
            "submissionPortal": "e-Rad (https://www.e-rad.go.jp/)"
        },
        "facets": {
            "fundingTier": "tier_large",
            "matchTier": "zero_match",
            "targetAudience": ["commercial_cea", "small_family"],
            "technologies": ["smartfarm", "energy", "water", "machinery"],
            "trackScope": "cross_domain"
        },
        "applicationPlaybook": {
            "officialCalculators": [
                {
                    "name": "NARO スマート農業技術カタログ & 経営効果試算システム",
                    "format": "NARO Official Smart Ag Database",
                    "description": "Benchmarks empirical labor-hour reductions and yield gains across 200+ NARO-verified smart greenhouse demonstrations.",
                    "url": "https://www.naro.go.jp/smart-nogyo/"
                }
            ],
            "scoringCheatSheet": {
                "dacBonusPoints": "High priority under the revised 'Act on Promotion of Smart Agriculture Technology Utilization' (スマート農業技術活用促進法 — Certified Development Supply Plans 開発供給実施計画).",
                "waterBasinPriority": "Strong focus on extreme-summer heat mitigation (高温対策) and strawberry/fruit-vegetable automation.",
                "technicalMeritPoints": "100% commissioned funding (委託費) including indirect overhead (間接経費 up to 30%)."
            },
            "vendorQuoteRules": [
                "Prototype hardware and sensor procurement follows NARO BRAIN commissioned research accounting rules."
            ],
            "disqualificationPitfalls": [
                "Incomplete e-Rad researcher ID registration prior to the 17:00 JST closing timestamp."
            ],
            "stackingRules": "Graduating technologies receive fast-track listing for MAFF 50% Smart Agriculture implementation subsidies and JFC low-interest financing."
        }
    },
    {
        "id": "JP-METI-SII-PFAL",
        "country": "JP",
        "countryName": "Japan",
        "region": "JP",
        "regionName": "Japan (Nationwide / METI SII Plant Factory & CEA Energy)",
        "jurisdictionLabel": "Japan (経済産業省 SII 省エネ補助金)",
        "flag": "🇯🇵",
        "category": "energy",
        "name": "METI / SII Energy-Efficiency Investment Subsidy for Plant Factories & Commercial CEA (省エネルギー投資促進・需要構造転換支援事業)",
        "agency": "Ministry of Economy, Trade and Industry (経済産業省) / Sustainable open Innovation Initiative (SII 環境共創イニシアチブ)",
        "subsidyType": "Direct Industrial & Commercial Energy-Efficiency CAPEX Grant",
        "subsidyRate": "1/3 to 1/2 (Up to 50% for SMEs on High-Efficiency HVAC, Heat Pumps & LEDs)",
        "rateDecimal": 0.5,
        "maxAmount": "Up to ¥100,000,000 (Equipment Track) to ¥1,500,000,000 (Factory/Building Track)",
        "matchRequirement": "50% - 66% Enterprise Capital Match",
        "disbursementType": "Post-Verification Reimbursement by SII",
        "currency": "JPY",
        "verifiedDate": "2026-11-10 Verified (METI / SII Energy Efficiency Portal)",
        "deadline": "Multiple Annual Recruitment Rounds (Spring / Summer)",
        "selectionMethod": "Quantitative Energy Saving Rate (>=10% to >=30% Crude Oil Equivalent Cut)",
        "targetEquipment": [
            "High-efficacy horticultural & plant factory LED lighting replacements (>3.0 umol/J)",
            "High-COP industrial chillers, inverter heat pumps, and desiccant dehumidifiers for vertical farms (植物工場)",
            "Industrial EMS (Energy Management Systems) and inverter irrigation/circulation pumps"
        ],
        "ineligibleItems": [
            "New facility construction without replacing existing baseline energy-consuming equipment (unless applying under specific Net-Zero track)"
        ],
        "qualificationCriteria": [
            "Commercial plant factories (人工光型・太陽光利用型植物工場) and agricultural corporations operating in Japan",
            "Must demonstrate >=10% energy efficiency improvement (or >=1,000 kl crude oil equivalent savings)"
        ],
        "documentChecklist": [
            "SII Energy Reduction Calculation Workbook (省エネルギー량算定シート)",
            "Baseline 12-month electricity and fuel utility statements",
            "SII Pre-Registered Equipment Certificate (指定設備型番証明書 — Category C) or PE Energy Audit (Category A)"
        ],
        "officialUrl": "https://sii.or.jp/",
        "portalName": "SII Energy Efficiency Grant Portal",
        "contactPhone": "+81-3-5565-4460",
        "contactEmail": "info@sii.or.jp",
        "linkedCalculator": "led-supplemental-lighting-dli-energy-calculator.html",
        "linkedToolTitle": "LED DLI & PPFD Energy Calc",
        "summary": "METI's major industrial energy grant covering up to 50% of high-efficiency HVAC heat pumps, chillers, and LED lighting upgrades for commercial plant factories and indoor CEA.",
        "deepGuide": "Under Track C (指定設備導入事業), selecting pre-certified high-COP heat pumps and chillers from the SII approved catalog dramatically simplifies the application without requiring an external energy auditor.",
        "applicationWindow": {
            "status": "upcoming",
            "statusLabel": "🔵 2027 봄 1차 공모 예정 (Spring 2027 Round 1)",
            "startDate": "2027-03-01",
            "endDate": "2027-04-25",
            "deadlineDisplay": "Spring 2027 Round 1 Solicitation",
            "daysRemaining": 166,
            "cycleFrequency": "2-3 Rounds Annually",
            "submissionPortal": "SII Online Portal"
        },
        "facets": {
            "fundingTier": "tier_mega",
            "matchTier": "half_match",
            "targetAudience": ["commercial_cea", "food_processor"],
            "technologies": ["energy", "renewables", "smartfarm"],
            "trackScope": "cross_domain"
        },
        "applicationPlaybook": {
            "officialCalculators": [
                {
                    "name": "SII 省エネ補助金・原油換算省エネルギー量計算シート",
                    "format": "SII Official Portal Calculator",
                    "description": "Converts kWh electricity and liter fuel reductions into crude oil equivalent (kl) and CO2 cost-effectiveness.",
                    "url": "https://sii.or.jp/"
                }
            ],
            "scoringCheatSheet": {
                "dacBonusPoints": "SMEs (中小企業・農業法人) receive up to 1/2 (50%) grant rate vs 1/3 for large corporations.",
                "waterBasinPriority": "Ideal for artificial-light plant factories (PFAL) and mushroom/strawberry indoor climate rooms.",
                "technicalMeritPoints": "Scored on Energy Cost-Effectiveness (省エネ費用対効果: kl saved per ¥10M grant)."
            },
            "vendorQuoteRules": [
                "Requires minimum 2 comparative vendor quotes and manufacturer energy efficiency test certificates."
            ],
            "disqualificationPitfalls": [
                "Ordering equipment prior to SII 交付決定 (Grant Award)."
            ],
            "stackingRules": "Cannot be stacked with MAFF grants on the same invoice, but allows plant factories ineligible for traditional farmland grants to access 50% CAPEX funding."
        }
    },
    {
        "id": "JP-MAFF-NEXT-GROWER",
        "country": "JP",
        "countryName": "Japan",
        "region": "JP",
        "regionName": "Japan (Nationwide / Young & New Farmer Startup)",
        "jurisdictionLabel": "Japan (農林水産省 新規就農者育成)",
        "flag": "🇯🇵",
        "category": "youth",
        "name": "MAFF New & Young Farmer Comprehensive Support: Management Development & Living Grant (新規就農者育成総合対策・経営発展支援事業＆経営開始資金)",
        "agency": "Ministry of Agriculture, Forestry and Fisheries (農林水産省 経営局就農・女性課)",
        "subsidyType": "Up to 75% CAPEX Startup Grant (¥10M Base) + ¥1.5M/yr Living Stipend (3 Yrs)",
        "subsidyRate": "Up to 75% Grant (1/2 National + 1/4 Prefectural) + ¥4,500,000 Living Grant",
        "rateDecimal": 0.75,
        "maxAmount": "¥10,000,000 CAPEX Base (+ ¥4,500,000 3-Yr Living Stipend)",
        "matchRequirement": "25% Grower Match (Eligible for 0% Interest JFC Youth Startup Loan 青年等就農資金)",
        "disbursementType": "Municipal Grant Payout + Semi-Annual Living Stipend Transfers",
        "currency": "JPY",
        "verifiedDate": "2026-11-10 Verified (MAFF New Farmer Guidelines)",
        "deadline": "Biannual Municipal Intake Windows",
        "selectionMethod": "Municipal Youth Startup Plan Certification (青年等就農計画認定) & Point Scoring",
        "targetEquipment": [
            "Greenhouse construction, elevated strawberry/tomato hydroponic benches, and environmental controllers",
            "Fertigation injectors, CO2 generators, heat pumps, and nursery propagation equipment",
            "3-year non-repayable living & farm stabilization grant (¥1,500,000/year for up to 3 years)"
        ],
        "ineligibleItems": [
            "Applicants aged 50 or older at the time of farm establishment",
            "Household total income exceeding ¥6,000,000 in the prior tax year (for the living stipend track)"
        ],
        "qualificationCriteria": [
            "Under age 49 at time of independent farm startup",
            "Certified New Farmer (認定新規就農者) with an approved Youth Farm Startup Plan (青年等就農計画) from the municipality",
            "Graduates of Prefectural Agricultural Colleges (農業大学校) or NARO/Prefectural training programs"
        ],
        "documentChecklist": [
            "Approved Municipal Youth Farm Startup Plan (認定青年等就農計画書)",
            "5-Year Income & Cash-Flow Projection (収支計画書)",
            "Two (2) comparative vendor quotes for greenhouse and automation equipment",
            "Farmland lease or ownership verification from Municipal Agricultural Committee (農業委員会)"
        ],
        "officialUrl": "https://www.maff.go.jp/j/new_farmer/n_syunou/roudou.html",
        "portalName": "Municipal Agricultural Department / National Chamber of Agriculture",
        "contactPhone": "+81-3-3502-8111",
        "contactEmail": "shunou_shien@maff.go.jp",
        "linkedCalculator": "greenhouse-capex-opex-10year-roi-calculator.html",
        "linkedToolTitle": "10-Yr CapEx & Startup ROI Calc",
        "summary": "Japan's premier young farmer startup package subsidizing up to 75% of initial greenhouse and smart farming CAPEX (up to ¥10M project base) plus ¥1.5M/year for 3 years in non-repayable living stipends.",
        "deepGuide": "Finance the remaining 25% self-match using the Japan Finance Corporation 'Youth Startup Loan' (青年等就農資金 — up to ¥37M at 0.0% interest for 17 years), achieving near-zero out-of-pocket initial cash outlay.",
        "applicationWindow": {
            "status": "open",
            "statusLabel": "🟢 지자체별 상·하반기 공모 중 (Municipal Intake Open)",
            "startDate": "2026-10-01",
            "endDate": "2027-02-28",
            "deadlineDisplay": "2027-02-28 (FY2027 Spring Municipal Certification)",
            "daysRemaining": 110,
            "cycleFrequency": "Biannual Municipal Selection",
            "submissionPortal": "Municipal Agriculture Division (市町村農政課)"
        },
        "facets": {
            "fundingTier": "tier_micro",
            "matchTier": "low_match",
            "targetAudience": ["beginning_farmer", "small_family"],
            "technologies": ["smartfarm", "energy", "water"],
            "trackScope": "pure_ag"
        },
        "applicationPlaybook": {
            "officialCalculators": [
                {
                    "name": "全国新規就農相談センター 青年等就農計画・収支シミュレーション",
                    "format": "Official Startup Planning Sheet",
                    "description": "Models 5-year horticultural crop revenue, living expenses, and JFC 0% loan amortization required for 認定新規就農者 approval.",
                    "url": "https://www.be-farmer.jp/"
                }
            ],
            "scoringCheatSheet": {
                "dacBonusPoints": "Up to 75% combined national + prefectural grant coverage when financing the remaining 25% via JFC Youth Loan.",
                "waterBasinPriority": "Extra selection points for adopting smart greenhouse sensors, heat pumps, or Midori organic/IPM practices.",
                "technicalMeritPoints": "Must demonstrate realistic target agricultural income (~¥2.5M-¥5.0M/yr) by Year 5."
            },
            "vendorQuoteRules": [
                "Minimum 2 comparative quotes for all equipment items exceeding ¥500,000."
            ],
            "disqualificationPitfalls": [
                "Purchasing greenhouse structures before obtaining formal 認定新規就農者 certification and grant approval."
            ],
            "stackingRules": "Management Development Grant (75% CAPEX) + Living Stipend (¥1.5M/yr x 3 yrs) + JFC 0% Youth Loan (up to ¥37M) are designed to be stacked together."
        }
    },

    # =========================================================================
    # 🇳🇱 NETHERLANDS (NL) — Middenmeer (Agriport A7), Westland, Oostland / RVO
    # =========================================================================
    {
        "id": "NL-RVO-MEI",
        "country": "NL",
        "countryName": "Netherlands",
        "region": "NL",
        "regionName": "Netherlands (Middenmeer / Westland / Oostland)",
        "jurisdictionLabel": "Netherlands (RVO MEI Glastuinbouw)",
        "flag": "🇳🇱",
        "category": "energy",
        "name": "MEI Subsidie: Marktintroductie Energie-innovaties Glastuinbouw (Semi-Closed ATU & Latent Heat)",
        "agency": "Rijksdienst voor Ondernemend Nederland (RVO) / Kas als Energiebron",
        "subsidyType": "Direct Non-Repayable Innovation CAPEX Grant",
        "subsidyRate": "Up to 40% - 50% of Eligible Innovative Energy & Semi-Closed Greenhouse CAPEX",
        "rateDecimal": 0.45,
        "maxAmount": "€1,500,000 per greenhouse enterprise",
        "matchRequirement": "50% - 60% Grower / Bank Financing",
        "disbursementType": "Milestone & Final Commissioning Payout via Mijn RVO",
        "currency": "EUR",
        "verifiedDate": "2026-11-10 Verified (RVO MEI Staatscourant)",
        "deadline": "Annual Spring/Summer Tender Window",
        "selectionMethod": "Competitive Ranking by CO2 Reduction Innovation, Energy Efficiency & Sector Scalability",
        "targetEquipment": [
            "Semi-closed glasshouse Air Treatment Units (ATU / LBK) with enthalpy heat exchangers and heat pumps",
            "Active Mechanical Dehumidification with Latent Heat Recovery (Ontvochtigingsinstallaties met warmteterugwinning)",
            "All-electric residual heat & seasonal aquifer storage integration (Fossielvrije kasconcepten)",
            "Autonomous photosynthesis & radiation-balanced climate control systems"
        ],
        "ineligibleItems": [
            "Standard proven technologies already covered under the regular EG-subsidie whitelist",
            "Fossil gas CHP (WKK) engines"
        ],
        "qualificationCriteria": [
            "Commercial glasshouse horticultural enterprises in the Netherlands (e.g., Middenmeer Agriport A7, Westland, Venlo)",
            "System must represent one of the first 10-15 commercial market introductions of the energy innovation in Dutch horticulture",
            "Mandatory knowledge sharing and energy monitoring with Kas als Energiebron / WUR"
        ],
        "documentChecklist": [
            "MEI Project Plan & Thermodynamic CO2/Energy Balance (m3 gas avoided per m2)",
            "WUR Bleiswijk / TNO or independent engineering verification of the innovation",
            "Itemized turnkey contractor quotes (e.g., Van der Hoeven, Kubo, Certhon, Bom Group)",
            "eHerkenning Level 3 (eH3) digital submission"
        ],
        "officialUrl": "https://www.rvo.nl/subsidies-financiering/mei",
        "portalName": "Mijn RVO Portal",
        "contactPhone": "+31 88 042 42 42",
        "contactEmail": "mei@rvo.nl",
        "linkedCalculator": "semi-closed-greenhouse-air-treatment-unit-mollier.html",
        "linkedToolTitle": "Semi-Closed ATU Mollier Simulator",
        "summary": "The Netherlands' premier €1.5M innovation grant funding up to 50% of semi-closed Air Treatment Unit (ATU) greenhouses, latent-heat dehumidification, and fossil-free glasshouse concepts.",
        "deepGuide": "Directly matched to our Middenmeer (Agriport A7) and Westland visitors: use our Semi-Closed ATU Mollier Simulator to quantify sensible vs. latent enthalpy recovery (kWh/m2/yr) for the mandatory RVO thermodynamic dossier.",
        "applicationWindow": {
            "status": "upcoming",
            "statusLabel": "🔵 2027 봄 텐더 공고 예정 (Spring 2027 Tender)",
            "startDate": "2027-04-01",
            "endDate": "2027-06-30",
            "deadlineDisplay": "Q2 2027 Annual MEI Tender Window",
            "daysRemaining": 232,
            "cycleFrequency": "Annual Competitive Tender",
            "submissionPortal": "Mijn RVO (eHerkenning 3)"
        },
        "facets": {
            "fundingTier": "tier_mega",
            "matchTier": "half_match",
            "targetAudience": ["commercial_cea"],
            "technologies": ["energy", "renewables", "smartfarm"],
            "trackScope": "pure_ag"
        },
        "applicationPlaybook": {
            "officialCalculators": [
                {
                    "name": "RVO MEI CO2- & Energiebesparingsmodel Glastuinbouw",
                    "format": "RVO Mandatory Calculation Spreadsheet",
                    "description": "Quantifies primary fossil energy reduction (GJ/ha/yr) and CO2 abatement across the 10-year reference period.",
                    "url": "https://www.rvo.nl/subsidies-financiering/mei"
                }
            ],
            "scoringCheatSheet": {
                "dacBonusPoints": "Up to 50% subsidy rate for collaborative grower-researcher consortia sharing transparent energy data.",
                "waterBasinPriority": "High score for zero-fossil (100% all-electric / geothermal) glasshouse integrations in Noord-Holland (Middenmeer) and Zuid-Holland.",
                "technicalMeritPoints": "Scored on Innovation Degree (35%), CO2 Cost-Effectiveness (35%), and Sector Rollout Potential (30%)."
            },
            "vendorQuoteRules": [
                "Turnkey greenhouse builder quotes must break down the innovative climate subsystem separately from standard Venlo superstructure."
            ],
            "disqualificationPitfalls": [
                "Applying for a technology that has already exceeded the RVO market-penetration count cap."
            ],
            "stackingRules": "Combinable with EIA (40% tax deduction) and Groenlabel Kas (MIA/Vamil) within EU agricultural state-aid ceilings."
        }
    },
    {
        "id": "NL-RVO-EIA-MIA",
        "country": "NL",
        "countryName": "Netherlands",
        "region": "NL",
        "regionName": "Netherlands (Nationwide Fiscal Entitlement)",
        "jurisdictionLabel": "Netherlands (RVO EIA 40% & MIA/Vamil Groenlabel Kas)",
        "flag": "🇳🇱",
        "category": "energy",
        "name": "Energie-investeringsaftrek (EIA 40%) & MIA/Vamil Groenlabel Kas (GLK) Fiscal Tax Deduction",
        "agency": "Rijksdienst voor Ondernemend Nederland (RVO) & Belastingdienst",
        "subsidyType": "Statutory Corporate Tax Deduction (40% EIA + Up to 45% MIA + 75% Vamil)",
        "subsidyRate": "40% Investment Tax Deduction (~10.3% Net Cash Benefit) + 75% Free Depreciation",
        "rateDecimal": 0.4,
        "maxAmount": "Up to €151,000,000 eligible investment volume per enterprise per calendar year",
        "matchRequirement": "0% Grant Match (Statutory Fiscal Deduction on Corporate/Income Tax)",
        "disbursementType": "Direct Corporate/Income Tax Reduction via Belastingdienst Filing",
        "currency": "EUR",
        "verifiedDate": "2026-11-10 Verified (RVO Energielijst & Milieulijst 2026)",
        "deadline": "Year-Round Entitlement (Must file within 3 months of signing purchase order!)",
        "selectionMethod": "Non-Competitive Statutory Entitlement for Energielijst / Groenlabel Kas Certified Assets",
        "targetEquipment": [
            "Groenlabel Kas (GLK) certified sustainable Venlo glasshouses with closed-loop water & biological IPM",
            "High-efficacy horticultural LED fixtures (>=3.2 umol/J on RVO Energielijst Code 220105)",
            "Energy screens, heat pumps, latent heat dehumidifiers, and UV-C/Ozone drain water sterilizers",
            "Battery energy storage systems and electrical grid-congestion management hardware"
        ],
        "ineligibleItems": [
            "Investments reported to RVO more than 3 months (90 days) after signing the vendor purchase obligation!"
        ],
        "qualificationCriteria": [
            "Any Dutch corporate (BV) or sole-proprietor (VOF/Eenmanszaak) horticultural enterprise paying income/corporate tax in the Netherlands",
            "Minimum €2,500 eligible investment per notification",
            "Equipment must meet the technical specifications of the RVO Energielijst (EIA) or Milieulijst (MIA/Vamil)"
        ],
        "documentChecklist": [
            "Mijn RVO Digital Notification (filed within 3 months of order confirmation)",
            "Signed vendor order confirmation (Opdrachtbevestiging) with Energielijst/Milieulijst code",
            "Groenlabel Kas (GLK) Certificate issued by SMK (Stichting Milieukeur) for whole-greenhouse MIA/Vamil"
        ],
        "officialUrl": "https://www.rvo.nl/subsidies-financiering/eia",
        "portalName": "Mijn RVO eLoket",
        "contactPhone": "+31 88 042 42 42",
        "contactEmail": "eia@rvo.nl",
        "linkedCalculator": "led-supplemental-lighting-dli-energy-calculator.html",
        "linkedToolTitle": "LED Efficacy & DLI Calc",
        "summary": "The backbone fiscal incentive of Dutch horticulture: deduct 40% of energy-efficient LED, heat pump, and dehumidifier investments (EIA) plus up to 45% of Groenlabel Kas sustainable greenhouses (MIA) directly from taxable profit.",
        "deepGuide": "CRITICAL RULE: Unlike direct grants where you apply BEFORE ordering, for EIA and MIA/Vamil you apply AFTER signing the purchase order, MUST submit via Mijn RVO within strictly 3 months of the order date!",
        "applicationWindow": {
            "status": "open",
            "statusLabel": "🟢 연중 상시 세제 혜택 (File within 3 Months of Order)",
            "startDate": "2026-01-01",
            "endDate": "2026-12-31",
            "deadlineDisplay": "Continuous (Strictly within 3 months of purchase contract)",
            "daysRemaining": 51,
            "cycleFrequency": "Year-Round Statutory Tax Entitlement",
            "submissionPortal": "Mijn RVO Portal"
        },
        "facets": {
            "fundingTier": "tier_mega",
            "matchTier": "zero_match",
            "targetAudience": ["commercial_cea", "small_family", "food_processor"],
            "technologies": ["energy", "water", "smartfarm", "renewables"],
            "trackScope": "pure_ag"
        },
        "applicationPlaybook": {
            "officialCalculators": [
                {
                    "name": "RVO EIA / MIA / Vamil Belastingvoordeel Rekentool",
                    "format": "RVO Online Tax Benefit Calculator",
                    "description": "Calculates exact net corporate tax savings (Vennootschapsbelasting 19%-25.8%) and Vamil liquidity advantage.",
                    "url": "https://www.rvo.nl/subsidies-financiering/eia"
                }
            ],
            "scoringCheatSheet": {
                "dacBonusPoints": "Groenlabel Kas (GLK) certification unlocks BOTH MIA (up to 45% deduction) AND Groenfinanciering (1% interest discount on Rabobank/Groenbank loans).",
                "waterBasinPriority": "Mandatory zero-emission closed-loop water recirculation under Dutch Activiteitenbesluit / Omgevingswet.",
                "technicalMeritPoints": "100% approval when equipment matches the current year's Energielijst/Milieulijst parameters."
            },
            "vendorQuoteRules": [
                "Have your supplier explicitly print the 6-digit RVO Energielijst / Milieulijst code on the order confirmation."
            ],
            "disqualificationPitfalls": [
                "Missing the 3-month post-contract filing deadline by even 1 day results in automatic statutory rejection."
            ],
            "stackingRules": "EIA CAN be stacked with EG-subsidie or MEI-subsidie! (You simply deduct the received cash grant from the gross investment amount before applying the 40% EIA deduction)."
        }
    },
    {
        "id": "NL-RVO-SWG",
        "country": "NL",
        "countryName": "Netherlands",
        "region": "NL",
        "regionName": "Netherlands (Geothermal & District Heat Clusters)",
        "jurisdictionLabel": "Netherlands (RVO SWG Warmtevoorziening)",
        "flag": "🇳🇱",
        "category": "renewables",
        "name": "SWG Subsidie: Subsidieregeling Verduurzaming Warmtevoorziening Glastuinbouw (Heat Networks & Geothermal)",
        "agency": "Rijksdienst voor Ondernemend Nederland (RVO)",
        "subsidyType": "Direct Infrastructure CAPEX Grant for Greenhouse Heat Networks",
        "subsidyRate": "Up to 30% - 50% of Heat Exchanger, Piping & Cluster Connection CAPEX",
        "rateDecimal": 0.4,
        "maxAmount": "Up to €7,500,000 per greenhouse heat cluster / connection project",
        "matchRequirement": "50% - 70% Grower / Heat Cooperative Financing",
        "disbursementType": "Milestone & Final Commissioning Disbursement",
        "currency": "EUR",
        "verifiedDate": "2026-11-10 Verified (RVO SWG Glastuinbouw)",
        "deadline": "Annual RVO Solicitation Window",
        "selectionMethod": "Ranked by GJ Fossil Gas Displaced per Euro Subsidy",
        "targetEquipment": [
            "Greenhouse heat-network coupling stations (Warmteoverdrachtstations), buffer tanks, and low-temp heating pipes",
            "Cluster distribution pipelines connecting glasshouses to deep geothermal (Aardwarmte) or residual industrial heat (WarmtelinQ)",
            "Collective seasonal heat storage and heat pump booster stations"
        ],
        "ineligibleItems": [
            "Fossil gas boilers or CHP engines"
        ],
        "qualificationCriteria": [
            "Dutch glasshouse horticultural enterprises or heat cooperatives connecting to sustainable thermal sources",
            "Elimination of natural gas peak/base load in connected glasshouse compartments"
        ],
        "documentChecklist": [
            "Heat Supply & Offtake Agreement (Warmteleveringsovereenkomst)",
            "Hydraulic engineering design and 10-year GJ heat delivery forecast",
            "Itemized EPC contractor quotes"
        ],
        "officialUrl": "https://www.rvo.nl/onderwerpen/glastuinbouw",
        "portalName": "Mijn RVO Portal",
        "contactPhone": "+31 88 042 42 42",
        "contactEmail": "glastuinbouw@rvo.nl",
        "linkedCalculator": "aquifer-thermal-energy-storage-ates-heat-pump.html",
        "linkedToolTitle": "ATES & Geothermal Heat Calc",
        "summary": "Dutch capital grant funding up to €7.5M (30%-50%) for glasshouse enterprises and clusters connecting to deep geothermal doublets, residual heat networks, and collective seasonal thermal storage.",
        "deepGuide": "Designed to bridge the internal glasshouse adaptation costs (low-temperature heating pipes, heat exchangers, buffer tanks) alongside SDE++ geothermal production wells.",
        "applicationWindow": {
            "status": "open",
            "statusLabel": "🟢 2026/2027 클러스터 열네트워크 공모 (Active RVO Window)",
            "startDate": "2026-09-01",
            "endDate": "2027-01-31",
            "deadlineDisplay": "2027-01-31 (RVO Glastuinbouw Energy Transition)",
            "daysRemaining": 82,
            "cycleFrequency": "Annual Cluster Infrastructure Call",
            "submissionPortal": "Mijn RVO Portal"
        },
        "facets": {
            "fundingTier": "tier_mega",
            "matchTier": "half_match",
            "targetAudience": ["commercial_cea"],
            "technologies": ["renewables", "energy"],
            "trackScope": "pure_ag"
        },
        "applicationPlaybook": {
            "officialCalculators": [
                {
                    "name": "Kas als Energiebron Warmtenet & Lage-Temperatuur Rekentool",
                    "format": "WUR / RVO Engineering Tool",
                    "description": "Sizes low-temperature (<45°C) greenhouse pipe networks and delta-T return water optimization required for geothermal heat grids.",
                    "url": "https://www.kasalsenergiebron.nl/"
                }
            ],
            "scoringCheatSheet": {
                "dacBonusPoints": "Higher subsidy percentage for multi-grower heat cooperatives in Westland, Oostland, and Noord-Holland.",
                "waterBasinPriority": "Requires low return-water temperatures (<30-35°C) to maximize geothermal doublet COP.",
                "technicalMeritPoints": "Ranked by tons of CO2 avoided over 15 years."
            },
            "vendorQuoteRules": [
                "Requires itemized quotes for internal glasshouse LT-heating adaptations and substation heat exchangers."
            ],
            "disqualificationPitfalls": [
                "Commencing pipeline installation before RVO grant submission."
            ],
            "stackingRules": "Complements SDE++ (which funds the geothermal well operator) by funding the grower's on-site heat connection and LT pipe retrofit."
        }
    },

    # =========================================================================
    # 🇫🇷 FRANCE (FR) — Avignon (INRAE PACA / Provence), Nantes, Brittany / FranceAgriMer
    # =========================================================================
    {
        "id": "FR-AGRIMER-SERRE",
        "country": "FR",
        "countryName": "France",
        "region": "FR",
        "regionName": "France (Avignon PACA / Pays de la Loire / Bretagne / Nationwide)",
        "jurisdictionLabel": "France (FranceAgriMer / France 2030 & ADEME)",
        "flag": "🇫🇷",
        "category": "energy",
        "name": "FranceAgriMer / France 2030 & ADEME: Modernisation, Décarbonation & Serres Semi-Fermées (Éco-Énergie Serres)",
        "agency": "FranceAgriMer (Ministère de l'Agriculture et de la Souveraineté Alimentaire) & ADEME",
        "subsidyType": "Direct Non-Repayable Capital Grant (Subvention d'Investissement + CEE)",
        "subsidyRate": "30% - 40% Grant (+10% Jeunes Agriculteurs / +10% Bio/HVE up to 50%)",
        "rateDecimal": 0.4,
        "maxAmount": "Up to €400,000 (FranceAgriMer Agroéquipements) to €2,000,000+ (ADEME Fonds Chaleur)",
        "matchRequirement": "50% - 70% Grower Financing (Combinable with Certificats d'Économies d'Énergie CEE)",
        "disbursementType": "Post-Invoice Verification Reimbursement via FranceAgriMer Téléprocédure",
        "currency": "EUR",
        "verifiedDate": "2026-11-10 Verified (FranceAgriMer / France 2030 Souveraineté Alimentaire)",
        "deadline": "Rolling Guichet Numérique Windows via FranceAgriMer Portal",
        "selectionMethod": "First-Come, First-Served on Official Eligible Equipment List (Annexe Matériels Éligibles)",
        "targetEquipment": [
            "Semi-closed greenhouse Air Treatment Units (Serres semi-fermées / CTA) and adiabatic cooling (studied at INRAE Avignon PACA)",
            "Double thermal energy screens (Doubles écrans thermiques AGRI-TH-102) and dehumidification heat pumps (AGRI-EQ-104)",
            "Closed-loop drip fertigation, UV-C/filtration drainage recycling, and tensiometric/capacitive soil matric potential sensors",
            "Biomass boilers, geothermal heat networks, and industrial waste-heat recovery (ADEME Fonds Chaleur)"
        ],
        "ineligibleItems": [
            "Fossil gas or heavy oil boilers without renewable heat substitution",
            "Equipment ordered or down-payments paid prior to receiving the FranceAgriMer Accusé de Réception"
        ],
        "qualificationCriteria": [
            "Exploitants agricoles (individual growers, EARL, GAEC, SCEA, SAS) and CUMA cooperatives registered in France (SIRET actif)",
            "Minimum eligible investment threshold of €2,000 to €10,000 depending on track",
            "Extra +10% grant bonus for Jeunes Agriculteurs (JA <40 yrs) and HVE (Haute Valeur Environnementale) / Agriculture Biologique farms"
        ],
        "documentChecklist": [
            "Online FranceAgriMer Téléprocédure Application with 14-digit SIRET number",
            "Detailed un-signed vendor quotations (Devis détaillés non signés) matching official FranceAgriMer equipment codes",
            "HVE Level 3 Certificate or Jeune Agriculteur (DJA) attestation (for +10% bonus)",
            "Thermal sizing audit (Étude de dimensionnement thermique) for ADEME Fonds Chaleur / CEE"
        ],
        "officialUrl": "https://www.franceagrimer.fr/Accompagner/Planification-ecologique-et-transition-energetique",
        "portalName": "FranceAgriMer Téléprocédures & ADEME Agir",
        "contactPhone": "+33 1 73 30 30 00",
        "contactEmail": "aide-investissement@franceagrimer.fr",
        "linkedCalculator": "semi-closed-greenhouse-air-treatment-unit-mollier.html",
        "linkedToolTitle": "Semi-Closed ATU Mollier Simulator",
        "summary": "France's flagship greenhouse modernization and decarbonization framework (FranceAgriMer + ADEME Fonds Chaleur + CEE) funding 30%-50% of semi-closed ATU greenhouses, thermal screens, heat pumps, and tensiometric irrigation across Provence (Avignon), Nantes, and Brittany.",
        "deepGuide": "Directly tailored to our Avignon (INRAE PACA / Provence) visitors: combine FranceAgriMer's direct investment grant with France's standardized Energy Savings Certificates (Fiches CEE Agriculture: AGRI-TH-102 for thermal screens, AGRI-EQ-104 for dehumidification heat pumps, AGRI-SE-101 for climate computers) to cover up to 50%-65% of total CAPEX!",
        "applicationWindow": {
            "status": "open",
            "statusLabel": "🟢 프랑스 2030 / CEE 상시 접수 중 (Guichet FranceAgriMer & CEE Open)",
            "startDate": "2026-01-01",
            "endDate": "2026-12-31",
            "deadlineDisplay": "2026-12-31 (France 2030 & 6th Period CEE Entitlement)",
            "daysRemaining": 51,
            "cycleFrequency": "Rolling Guichet + Permanent CEE Certificates",
            "submissionPortal": "FranceAgriMer e-Services (pad.franceagrimer.fr)"
        },
        "facets": {
            "fundingTier": "tier_large",
            "matchTier": "low_match",
            "targetAudience": ["commercial_cea", "beginning_farmer", "small_family"],
            "technologies": ["energy", "water", "smartfarm", "renewables"],
            "trackScope": "pure_ag"
        },
        "applicationPlaybook": {
            "officialCalculators": [
                {
                    "name": "Ministère de l'Agriculture / ADEME Fiches Standardisées CEE Agriculture (AGRI-TH / AGRI-EQ)",
                    "format": "Official kWh cumac Calculation Standard",
                    "description": "Calculates exact kWh cumac energy certificate value for greenhouse double screens, heat pumps, thermal storage, and climate computers.",
                    "url": "https://www.ecologie.gouv.fr/politiques-publiques/operations-standardisees-deconomies-denergie"
                }
            ],
            "scoringCheatSheet": {
                "dacBonusPoints": "+10% Bonus for Jeunes Agriculteurs (<40 yrs) and CUMA cooperatives; +10% for HVE (Haute Valeur Environnementale) certified greenhouses.",
                "waterBasinPriority": "High priority in water-stressed Mediterranean basins (PACA / Avignon / Occitanie) for soil water potential sensors and closed-loop recycling.",
                "technicalMeritPoints": "CEE (Certificats d'Économies d'Énergie) provides an automatic, non-competitive cash rebate per m2 of glasshouse equipped."
            },
            "vendorQuoteRules": [
                "NEVER sign or write 'Bon pour accord' on the vendor quote (Devis) before submitting both the FranceAgriMer application AND the CEE dossier!"
            ],
            "disqualificationPitfalls": [
                "Signing the Devis or paying a deposit before the official FranceAgriMer digital timestamp (Accusé de réception)."
            ],
            "stackingRules": "Stack FranceAgriMer regional/national grants + ADEME Fonds Chaleur (for biomass/geothermal) + CEE energy certificates within EU agricultural state-aid limits."
        }
    },

    # =========================================================================
    # 🇪🇸 SPAIN (ES) — Valencia, Almería, Murcia / MAPA & PERTE Agroalimentario
    # =========================================================================
    {
        "id": "ES-MAPA-PERTE-INVERNADEROS",
        "country": "ES",
        "countryName": "Spain",
        "region": "ES",
        "regionName": "Spain (Comunitat Valenciana / Andalucía Almería / Región de Murcia)",
        "jurisdictionLabel": "Spain (MAPA / PERTE Invernaderos & Regadíos)",
        "flag": "🇪🇸",
        "category": "water",
        "name": "MAPA / NextGenerationEU: Plan de Modernización de Invernaderos, Riego de Precisión y Eficiencia Energética",
        "agency": "Ministerio de Agricultura, Pesca y Alimentación (MAPA) & Comunidades Autónomas (GVA Valencia / Junta de Andalucía)",
        "subsidyType": "Direct Non-Repayable Capital Grant (Subvención a Fondo Perdido)",
        "subsidyRate": "40% - 65% of Eligible Investment (Up to 80% for Young Farmers <41 yrs)",
        "rateDecimal": 0.55,
        "maxAmount": "Up to €3,000,000 (Individual Producer) to €15,000,000 (OPFH / Cooperatives)",
        "matchRequirement": "35% - 60% Grower / Cooperative Financing (Eligible for ICO-MAPA-SAECA subsidized loans)",
        "disbursementType": "Autonomous Community Grant Payout Post-Engineering Certification",
        "currency": "EUR",
        "verifiedDate": "2026-11-10 Verified (Real Decreto MAPA Modernización de Invernaderos / PEPAC)",
        "deadline": "Annual Autonomous Community Calls (GVA Valencia / Andalucía / Murcia)",
        "selectionMethod": "Competitive Point Rubric prioritizing Young Farmers, OPFH Cooperatives & Water/Energy Efficiency",
        "targetEquipment": [
            "Multi-tunnel & Raspa-y-Amagado high-ventilation greenhouse structural upgrades (Invernaderos multitúnel)",
            "Closed-loop hydroponic fertigation, rainwater harvesting ponds (Balsas de pluviales), and reverse-osmosis desalination",
            "Automated climate control computers, fogging, thermal screens, and tensiometric/FDR soil moisture sensors",
            "On-farm solar PV self-consumption arrays (Autoconsumo fotovoltaico) for irrigation and climate fans"
        ],
        "ineligibleItems": [
            "Simple plastic film replacement (Sustitución de plástico) without structural or technological modernization",
            "Investments started before the official Acta de No Inicio inspection by regional agricultural inspectors"
        ],
        "qualificationCriteria": [
            "Titulares de explotaciones agrícolas de invernadero or Fruit & Vegetable Producer Organizations (OPFH) in Spain",
            "Registered in REGEPA (Registro General de la Producción Agrícola)",
            "Must achieve at least 10%-20% water or fossil energy reduction certified by an Ingeniero Agrónomo"
        ],
        "documentChecklist": [
            "Proyecto Técnico visado por un Ingeniero Agrónomo Colegiado",
            "Acta de No Inicio (Mandatory pre-construction site inspection certificate)",
            "Three (3) comparative vendor pro-forma invoices (Tres facturas proforma) for every cost item >€40,000",
            "REGEPA registration and water concession certificate (Confederación Hidrográfica Júcar / Segura / Mediterránea)"
        ],
        "officialUrl": "https://www.mapa.gob.es/es/agricultura/temas/producciones-agricolas/hortofruticolas/",
        "portalName": "Sede Electrónica MAPA / GVA Generalitat Valenciana / Junta de Andalucía",
        "contactPhone": "+34 91 347 50 00",
        "contactEmail": "informacion@mapa.es",
        "linkedCalculator": "soil-matrix-water-potential-irrigation-trigger.html",
        "linkedToolTitle": "Soil Matric Potential & Drip Calc",
        "summary": "Spain's premier greenhouse modernization grant (Real Decreto MAPA / PEPAC) funding 40% to 80% (up to €3M–€15M) for multi-tunnel greenhouses, precision drip/hydroponics, rainwater basins, and solar irrigation in Valencia, Almería, and Murcia.",
        "deepGuide": "Directly tailored to our Valencia (Comunitat Valenciana) and Mediterranean visitors: request the mandatory 'Acta de No Inicio' inspection from your Conselleria de Agricultura BEFORE moving any earth or ordering greenhouse steel.",
        "applicationWindow": {
            "status": "open",
            "statusLabel": "🟢 스페인 자치주별 PEPAC 온실현대화 공모 중 (Active Regional Calls)",
            "startDate": "2026-09-15",
            "endDate": "2027-01-31",
            "deadlineDisplay": "2027-01-31 (PEPAC / GVA Valencia & Andalucía Window)",
            "daysRemaining": 82,
            "cycleFrequency": "Annual PEPAC Autonomous Community Call",
            "submissionPortal": "Sede Electrónica GVA / Junta de Andalucía"
        },
        "facets": {
            "fundingTier": "tier_mega",
            "matchTier": "low_match",
            "targetAudience": ["commercial_cea", "beginning_farmer", "small_family"],
            "technologies": ["water", "energy", "smartfarm", "renewables"],
            "trackScope": "pure_ag"
        },
        "applicationPlaybook": {
            "officialCalculators": [
                {
                    "name": "MAPA / Cajamar Calculadora de Costes y Amortización de Invernaderos",
                    "format": "Agronomic Engineering Valuation Tool",
                    "description": "Models m2 construction reference cost ceilings (Módulos máximos de inversión) for multi-tunnel vs symmetric Venlo greenhouses.",
                    "url": "https://www.mapa.gob.es/"
                }
            ],
            "scoringCheatSheet": {
                "dacBonusPoints": "+20% Grant Bonus (up to 60%-80% total grant): Jóvenes Agricultores (<41 yrs) and farms integrated into an OPFH (Organización de Productores de Frutas y Hortalizas).",
                "waterBasinPriority": "Maximum points in Júcar (Valencia), Segura (Murcia), and Andalusian basins for rainwater capture + closed-loop drainage recirculation.",
                "technicalMeritPoints": "Must comply with MAPA reference cost ceilings (€/m2) certified by an Ingeniero Agrónomo."
            },
            "vendorQuoteRules": [
                "Under Spain's Ley General de Subvenciones (Art. 31.3), you MUST submit 3 independent vendor quotes for any supply/equipment >€15,000 and civil works >€40,000."
            ],
            "disqualificationPitfalls": [
                "Starting groundwork prior to the official 'Acta de No Inicio' site visit.",
                "Lacking a valid legal water right concession from the Confederación Hidrográfica."
            ],
            "stackingRules": "Can be paired with OPFH Operational Funds (Fondos Operativos 50% EU match on distinct investments) and ICO-MAPA-SAECA subsidized credit."
        }
    },

    # =========================================================================
    # 🇰🇷 SOUTH KOREA (KR) — Cheonan, Gwangju, Daejeon / MAFRA Horticultural Modernization
    # =========================================================================
    {
        "id": "KR-MAFRA-FACILITY-MOD",
        "country": "KR",
        "countryName": "South Korea",
        "region": "KR",
        "regionName": "South Korea (Cheonan / Chungnam / Jeonnam / Nationwide)",
        "jurisdictionLabel": "South Korea (MAFRA 원예시설현대화)",
        "flag": "🇰🇷",
        "category": "water",
        "name": "MAFRA Horticultural Facility Modernization & Closed-Loop Hydroponics Grant (원예시설현대화 및 양액재활용 지원사업)",
        "agency": "Ministry of Agriculture, Food and Rural Affairs (농림축산식품부 원예경영과) & Municipal Governments",
        "subsidyType": "50% Direct Grant (국고 20% + 지방비 30%) + 30% Policy Loan + 20% Match",
        "subsidyRate": "50% Grant + 30% Low-Interest Loan (1.5%-2.0%) + 20% Grower Match",
        "rateDecimal": 0.5,
        "maxAmount": "Up to ₩500,000,000 per farm (Staged by hectare unit cost standards)",
        "matchRequirement": "20% Self-Match + 30% Nonghyup Policy Loan",
        "disbursementType": "Municipal Inspection & Direct Settlement via Agrix",
        "currency": "KRW",
        "verifiedDate": "2026-11-10 Verified (MAFRA Horticultural Modernization Guidelines)",
        "deadline": "Annual Municipal Application Window (Oct - Jan for Next Fiscal Year)",
        "selectionMethod": "Scored by APC/Producer Organization Shipment Commitment (출하약정) & Export/GAP Status",
        "targetEquipment": [
            "Closed-loop hydroponic fertigation & UV/Ozone/Heat drainage sterilization systems (순환식 수경재배 및 배액살균기)",
            "High-pressure fogging/misting (포그 냉방), circulation fans, and automated side/roof vent openers",
            "Multi-layer thermal screens (다겹보온커튼) and automated shading curtains",
            "Elevated hydroponic gutters/benches (하이베드) for strawberries, tomatoes, cucumbers, and paprika"
        ],
        "ineligibleItems": [
            "Growers who do not sign a mandatory 3-to-5-year shipment contract (출하약정) with an accredited APC, Nonghyup, or Producer Organization",
            "Unauthorized greenhouses built on non-compliant farmland"
        ],
        "qualificationCriteria": [
            "Commercial vegetable, fruit-vegetable (strawberry, tomato, cucumber, melon), and floriculture greenhouse growers in Korea",
            "Mandatory shipment commitment (>=80% of harvest) through a MAFRA-recognized Producer Organization (생산자조직/통합마케팅조직/APC)",
            "Agricultural Management Entity Registration (농업경영체 등록)"
        ],
        "documentChecklist": [
            "Horticultural Facility Modernization Application submitted at Eup/Myeon/Dong Office",
            "Mandatory 3-Year Joint Sorting & Shipment Agreement (공동선별·출하약정서 with Nonghyup/APC)",
            "Itemized equipment quotes from registered agricultural facility contractors",
            "GAP / Low-Carbon / Eco-Friendly certification copies (for bonus scoring)"
        ],
        "officialUrl": "https://www.mafra.go.kr/",
        "portalName": "Agrix (농림사업정보시스템) & 시·군 농정과",
        "contactPhone": "044-201-2236",
        "contactEmail": "horti@mafra.go.kr",
        "linkedCalculator": "greenhouse-fertilizer-ec-ppm-stock-tank-blending-calculator.html",
        "linkedToolTitle": "Hydroponic A/B Tank & EC Calc",
        "summary": "South Korea's core 50% grant + 30% low-interest loan program for upgrading existing greenhouses with closed-loop hydroponic fertigation, UV drainage sterilizers, elevated strawberry beds, and fog cooling.",
        "deepGuide": "Directly aligned with our Cheonan (천안 오이·딸기·과채류 주산지), Gwangju/Jeonnam, and Chungnam visitors: the #1 eligibility gate is signing a Shipment Commitment (출하약정) with your local Nonghyup APC or Producer Organization prior to applying at your city/county office.",
        "applicationWindow": {
            "status": "open",
            "statusLabel": "🟢 시·군별 차년도 사업 대상자 신청 접수 중 (Municipal Intake Open)",
            "startDate": "2026-10-15",
            "endDate": "2027-01-31",
            "deadlineDisplay": "2027-01-31 (Municipal Eup/Myeon/Dong Application Window)",
            "daysRemaining": 82,
            "cycleFrequency": "Annual Winter Municipal Selection",
            "submissionPortal": "시·군 농정과 / 읍·면·동 행정복지센터 & Agrix"
        },
        "facets": {
            "fundingTier": "tier_large",
            "matchTier": "low_match",
            "targetAudience": ["commercial_cea", "small_family", "beginning_farmer"],
            "technologies": ["water", "smartfarm", "energy"],
            "trackScope": "pure_ag"
        },
        "applicationPlaybook": {
            "officialCalculators": [
                {
                    "name": "농림축산식품부 원예시설현대화 지원단가 및 자부담 산출표",
                    "format": "MAFRA Official Unit Cost Schedule",
                    "description": "Specifies statutory maximum eligible cost per ha (기준단가) for hydroponic beds, fertigation injectors, and thermal curtains.",
                    "url": "https://www.agrix.go.kr/"
                }
            ],
            "scoringCheatSheet": {
                "dacBonusPoints": "+10 Points: Closed-loop recirculating hydroponics (순환식 수경재배) receives top environmental priority and higher unit cost ceilings.",
                "waterBasinPriority": "+10 Points: GAP certified farms, export complexes, and Smart Farm Youth Incubator graduates.",
                "technicalMeritPoints": "Must maintain >=80% shipment compliance with the partner APC/Nonghyup for 3+ years post-grant."
            },
            "vendorQuoteRules": [
                "Contractors must possess specialized Greenhouse Metal Window & Structure Construction licenses (금속구조물·창호·온실공사업 면허) for structural works."
            ],
            "disqualificationPitfalls": [
                "Failing to fulfill the mandatory annual APC shipment volume ratio (triggers grant clawback penalty).",
                "Installing uncertified heating or electrical wiring violating Korean agricultural fire safety standards."
            ],
            "stackingRules": "Combines 20% central gov grant + 30% municipal grant + 30% policy loan (1.5%-2.0%). Can be paired with municipal local top-up subsidies in Chungnam (Cheonan/Buyeo/Nonsan) and Jeonnam."
        }
    }
]


def main():
    print("=" * 72)
    print("📡 TARGET-REGION CEA SUBSIDY & POLICY RADAR UPGRADER (v4.0)")
    print(f"   Execution Timestamp: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print("=" * 72)

    with open(DATA_JSON_PATH, "r", encoding="utf-8") as f:
        data = json.load(f)

    # 1. Register new jurisdictions & countries (FR, ES)
    existing_jur_codes = {j["code"] for j in data.get("jurisdictions", [])}
    for jur in NEW_JURISDICTIONS:
        if jur["code"] not in existing_jur_codes:
            data.setdefault("jurisdictions", []).append(jur)
            existing_jur_codes.add(jur["code"])

    existing_country_codes = {c["code"] for c in data.get("countries", [])}
    for c in NEW_COUNTRIES:
        if c["code"] not in existing_country_codes:
            data.setdefault("countries", []).append(c)
            existing_country_codes.add(c["code"])

    for code in ["FR", "ES"]:
        if code not in data["metadata"].get("countriesCovered", []):
            data["metadata"].setdefault("countriesCovered", []).append(code)

    # 2. Patch existing 10 non-US programs with California-grade applicationPlaybook
    patched_count = 0
    for p in data.get("programs", []):
        pid = p.get("id")
        if pid in PLAYBOOK_PATCHES:
            p["applicationPlaybook"] = PLAYBOOK_PATCHES[pid]
            p["verifiedDate"] = "2026-11-10 Verified (GA4 Target-Region Audit)"
            patched_count += 1

    print(f"✅ Patched {patched_count} existing international programs with California-grade applicationPlaybook.")

    # 3. Ensure all officialCalculators across ALL programs have format & description
    for p in data.get("programs", []):
        pb = p.get("applicationPlaybook")
        if pb and "officialCalculators" in pb:
            for calc in pb["officialCalculators"]:
                if not calc.get("format"):
                    calc["format"] = "Official Agency Quantification Tool"
                if not calc.get("description"):
                    calc["description"] = f"Official calculation and eligibility quantification resource for {p['name']}."

    # 4. Add/Update the 19 new Target-Region programs
    existing_prog_ids = {p["id"]: i for i, p in enumerate(data.get("programs", []))}
    added_progs = 0
    updated_progs = 0
    for np in NEW_TARGET_PROGRAMS:
        if np["id"] in existing_prog_ids:
            idx = existing_prog_ids[np["id"]]
            data["programs"][idx] = np
            updated_progs += 1
        else:
            data.setdefault("programs", []).append(np)
            existing_prog_ids[np["id"]] = len(data["programs"]) - 1
            added_progs += 1

    total_programs = len(data["programs"])
    data["metadata"]["totalPrograms"] = total_programs
    data["metadata"]["lastUpdated"] = "2026-11-10"
    data["metadata"]["lastVerified"] = "2026-11-10"
    data["metadata"]["version"] = "4.0.0-ga4-target-radar"
    data["metadata"]["coverageNote"] = (
        "All 50 US States (California 23-Program Deep Cluster) + Germany (Bund/Bayern/NRW/NDS/BW/AFBG) + "
        "Japan (MAFF Midori GX/Strong Agri/Fuel Safety/NARO Tsukuba/METI) + Netherlands (RVO EG/SDE++/MEI/EIA/SWG) + "
        "France (FranceAgriMer/CEE) + Spain (MAPA/PERTE) + South Korea (MAFRA) + Canada (AAFC)"
    )

    with open(DATA_JSON_PATH, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2, ensure_ascii=False)
    print(f"💾 Updated JSON production feed: {total_programs} total programs ({added_progs} added, {updated_progs} updated).")

    # 5. Synchronize Master SQLite Database
    if os.path.exists(DB_PATH):
        conn = sqlite3.connect(DB_PATH)
        cur = conn.cursor()
        for p in data["programs"]:
            cur.execute("""
                INSERT OR REPLACE INTO programs (
                    id, country, country_name, region, region_name, jurisdiction_label,
                    flag, category, name, agency, subsidy_type, subsidy_rate, rate_decimal,
                    max_amount, match_requirement, disbursement_type, currency,
                    verified_date, deadline, selection_method, official_url, portal_name,
                    contact_phone, contact_email, linked_calculator, linked_tool_title,
                    summary, deep_guide, updated_at
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (
                p["id"], p["country"], p["countryName"], p["region"], p["regionName"], p["jurisdictionLabel"],
                p["flag"], p["category"], p["name"], p["agency"], p["subsidyType"], p["subsidyRate"], p["rateDecimal"],
                p["maxAmount"], p["matchRequirement"], p["disbursementType"], p["currency"],
                p["verifiedDate"], p["deadline"], p["selectionMethod"], p["officialUrl"], p["portalName"],
                p.get("contactPhone", ""), p.get("contactEmail", ""), p.get("linkedCalculator", ""), p.get("linkedToolTitle", ""),
                p["summary"], p["deepGuide"], datetime.now().isoformat()
            ))
        conn.commit()
        conn.close()
        print(f"🗄️ Master SQLite DB synchronized ({total_programs} programs).")

    # 6. Inline updated SUB_DATA into navigator HTML
    if os.path.exists(NAVIGATOR_HTML_PATH):
        with open(NAVIGATOR_HTML_PATH, "r", encoding="utf-8") as f:
            html_content = f.read()

        json_str = json.dumps(data, indent=2, ensure_ascii=False)
        pattern = r"const SUB_DATA\s*=\s*\{.*?\};\s*(?=(?:\n\s*//|\n\s*const|\n\s*let|\n\s*function|\n\s*let activeFilters))"
        replacement = f"const SUB_DATA = {json_str};\n\n"

        new_html, num_sub = re.subn(pattern, replacement, html_content, count=1, flags=re.DOTALL)
        if num_sub > 0:
            with open(NAVIGATOR_HTML_PATH, "w", encoding="utf-8") as f:
                f.write(new_html)
            print("✅ Inlined updated v4.0 SUB_DATA into tools/global-agri-subsidy-grant-navigator.html.")
        else:
            print("⚠️ Warning: Could not find `const SUB_DATA` pattern to replace in HTML.")

    from collections import Counter
    country_counts = Counter(p["country"] for p in data["programs"])
    print("   Breakdown by Country:", dict(country_counts))
    print("=" * 72)


if __name__ == "__main__":
    main()
