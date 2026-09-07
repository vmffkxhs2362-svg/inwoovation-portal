#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Master Subsidy Database Synchronizer (Google Drive Knowledge Base Engine)
==========================================================================
Bridges the local Google Drive relational database (SQLite) and the public
production portal JSON (global_agri_subsidies.json).

Paths:
  - SQLite Master: Knowledge_Base/Global_Agri_Subsidies/01_Master_Database/agri_grants_master.db
  - Schema:        Knowledge_Base/Global_Agri_Subsidies/01_Master_Database/schema.sql
  - Production:    Career/Inwoovation_Portal/data/global_agri_subsidies.json
"""

import os
import sys
import json
import sqlite3

BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))) # Antigravity/Headquater
KB_DIR = os.path.join(BASE_DIR, "Knowledge_Base", "Global_Agri_Subsidies")
DB_PATH = os.path.join(KB_DIR, "01_Master_Database", "agri_grants_master.db")
SCHEMA_PATH = os.path.join(KB_DIR, "01_Master_Database", "schema.sql")
JSON_PATH = os.path.join(BASE_DIR, "Career", "Inwoovation_Portal", "data", "global_agri_subsidies.json")

def init_db():
    print(f"🔧 Initializing SQLite Master Database at: {DB_PATH}")
    os.makedirs(os.path.dirname(DB_PATH), exist_ok=True)
    with open(SCHEMA_PATH, "r", encoding="utf-8") as f:
        schema_sql = f.read()
    
    conn = sqlite3.connect(DB_PATH)
    conn.executescript(schema_sql)
    conn.commit()
    conn.close()
    print("✅ Schema initialized successfully.")

def import_json_to_db():
    if not os.path.exists(JSON_PATH):
        print(f"❌ JSON file not found at: {JSON_PATH}")
        return False

    with open(JSON_PATH, "r", encoding="utf-8") as f:
        data = json.load(f)

    programs = data.get("programs", [])
    print(f"📥 Importing {len(programs)} programs from JSON into Master SQLite DB...")

    conn = sqlite3.connect(DB_PATH)
    cur = conn.cursor()

    for p in programs:
        # 1. Insert/Replace Program Core
        cur.execute("""
            INSERT OR REPLACE INTO programs (
                id, country, country_name, region, region_name, jurisdiction_label, flag,
                category, name, agency, subsidy_type, subsidy_rate, rate_decimal,
                max_amount, match_requirement, disbursement_type, currency,
                verified_date, deadline, selection_method, official_url, portal_name,
                contact_phone, contact_email, summary, deep_guide,
                linked_calculator, linked_tool_title, updated_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
        """, (
            p["id"], p["country"], p["countryName"], p["region"], p["regionName"], p["jurisdictionLabel"], p.get("flag", ""),
            p["category"], p["name"], p["agency"], p["subsidyType"], p["subsidyRate"], p["rateDecimal"],
            p["maxAmount"], p["matchRequirement"], p["disbursementType"], p["currency"],
            p["verifiedDate"], p.get("deadline", ""), p.get("selectionMethod", ""), p.get("officialUrl", ""), p.get("portalName", ""),
            p.get("contactPhone", ""), p.get("contactEmail", ""), p.get("summary", ""), p.get("deepGuide", ""),
            p.get("linkedCalculator", ""), p.get("linkedToolTitle", "")
        ))

        # 2. Insert/Replace Application Window
        app = p.get("applicationWindow", {})
        cur.execute("""
            INSERT OR REPLACE INTO application_windows (
                program_id, status, status_label, start_date, end_date,
                deadline_display, days_remaining, cycle_frequency, submission_portal
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (
            p["id"], app.get("status", "open"), app.get("statusLabel", "🟢 Open"),
            app.get("startDate", ""), app.get("endDate", ""),
            app.get("deadlineDisplay", p.get("deadline", "")), app.get("daysRemaining", -1),
            app.get("cycleFrequency", ""), app.get("submissionPortal", p.get("portalName", ""))
        ))

        # 3. Target Equipment (Clear old, insert new)
        cur.execute("DELETE FROM target_equipment WHERE program_id = ?", (p["id"],))
        for eq in p.get("targetEquipment", []):
            cur.execute("INSERT INTO target_equipment (program_id, item_description, is_eligible) VALUES (?, ?, 1)", (p["id"], eq))
        for ineq in p.get("ineligibleItems", []):
            cur.execute("INSERT INTO target_equipment (program_id, item_description, is_eligible) VALUES (?, ?, 0)", (p["id"], ineq))

        # 4. Qualification Criteria
        cur.execute("DELETE FROM qualification_criteria WHERE program_id = ?", (p["id"],))
        for qc in p.get("qualificationCriteria", []):
            cur.execute("INSERT INTO qualification_criteria (program_id, criterion) VALUES (?, ?)", (p["id"], qc))

        # 5. Document Checklist
        cur.execute("DELETE FROM document_checklist WHERE program_id = ?", (p["id"],))
        for doc in p.get("documentChecklist", []):
            cur.execute("INSERT INTO document_checklist (program_id, document_name, is_mandatory) VALUES (?, ?, 1)", (p["id"], doc))

        # 6. Facets
        facets = p.get("facets", {})
        cur.execute("""
            INSERT OR REPLACE INTO program_facets (
                program_id, funding_tier, match_tier, target_audience, technologies
            ) VALUES (?, ?, ?, ?, ?)
        """, (
            p["id"], facets.get("fundingTier", "tier_medium"), facets.get("matchTier", "zero_match"),
            json.dumps(facets.get("targetAudience", ["commercial_cea"]), ensure_ascii=False),
            json.dumps(facets.get("technologies", [p["category"]]), ensure_ascii=False)
        ))

    conn.commit()

    # Query validation
    cur.execute("SELECT COUNT(*) FROM programs")
    total_p = cur.fetchone()[0]
    cur.execute("SELECT COUNT(*) FROM target_equipment")
    total_eq = cur.fetchone()[0]
    cur.execute("SELECT COUNT(*) FROM document_checklist")
    total_doc = cur.fetchone()[0]

    conn.close()
    print(f"🎉 Master Database Synchronized: {total_p} programs | {total_eq} equipment items | {total_doc} document checklist requirements.")
    return True

if __name__ == "__main__":
    init_db()
    import_json_to_db()
