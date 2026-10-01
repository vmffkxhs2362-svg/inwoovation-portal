#!/usr/bin/env python3
"""
package_free_assets.py
----------------------
Generates standalone, ready-to-download ZIP archives for all 7 engineering suites
and the unified 7-in-1 Master Enterprise Vault under Career/Inwoovation_Portal/digital_assets/.
100% Free & Open Access (MIT / CC-BY).
"""

import os
import zipfile

DIGITAL_ASSETS_DIR = os.path.dirname(os.path.abspath(__file__))
PACKAGES = [
    "01_USDA_GRANT_PLAYBOOK",
    "02_OPENCEA_PRO_ENGINEERING_SUITE",
    "03_BAVARIAN_MEISTER_DOSSIER",
    "04_HYDRO_NUTRIENT_FORMULATOR",
    "05_GREENHOUSE_BOM_COST_ESTIMATOR",
    "06_VERTICAL_FARM_UNIT_ECONOMICS",
    "07_HIGH_VALUE_CROPS_WASABI_VANILLA"
]

def make_master_readme():
    content = """# 🌿 Inwoovation Lab - Complete 7-in-1 Open-Access AgTech Engineering Master Vault
> **License**: MIT License (Code) & Creative Commons Attribution 4.0 International (CC-BY 4.0 - Documentation)
> **Published by**: Inwoovation Engineering Research Lab (https://inwoovation.com)
> **Philosophy**: 100% Free, Open-Source, and Unrestricted Access for Global Agricultural Practitioners, Researchers, and Students.

---

## 🏛️ Welcome to the Open-Access Engineering Vault

This unified archive contains the complete institutional digital engineering assets developed by Inwoovation Lab.
Every line of Python code, thermodynamic algorithm, spreadsheet calculation, and regulatory checklist is provided
**100% free of charge**, unlocked, and without paywalls or subscriptions.

### 📦 Included Packages:

1. **`01_USDA_GRANT_PLAYBOOK`**:
   - Turnkey commercial feasibility narrative for federal and state non-dilutive capital (USDA REAP / EQIP / CDFA).
   - VDI 4640 & ASABE S640 energy audit calculation worksheet.
   - 50-State scoring rubric & match rate calculator CSV.

2. **`02_OPENCEA_PRO_ENGINEERING_SUITE`**:
   - Standalone Python 3.9+ psychrometric Mollier solver (enthalpy, dew point, VPD).
   - DIN/VDI 2073 3-way mixing valve Kv & buffer stratification sizing.
   - Biomass CHP pyrolysis mass-energy balance.
   - Semi-closed greenhouse ATU corridor positive pressure & duct sizing.

3. **`03_BAVARIAN_MEISTER_DOSSIER`**:
   - DIN 11535 / BayBO glasshouse structural compliance load matrix (snow, wind, crop loads).
   - DüV 2026 zero-runoff hydrology & differential equations for ballast ion accumulation (Na+/Cl-).
   - 400-term German-English professional horticultural lexicon with technical context.
   - VDI 4640 geothermal Aquifer Thermal Energy Storage (ATES) audit worksheet.

4. **`04_HYDRO_NUTRIENT_FORMULATOR`**:
   - Groundwater deduction algorithm & linear ion solver (`groundwater_nutrient_formulator.py`).
   - 15 commercial crop nutrient recipes (meq/L & ppm) across phenological phases.
   - Fertilizer salt solubility limits (10°C/20°C) & A/B tank precipitation prevention matrix.

5. **`05_GREENHOUSE_BOM_COST_ESTIMATOR`**:
   - Structural steel tonnage & bill of materials calculator (`greenhouse_bom_cost_calculator.py`).
   - Single-span, multi-span PO vinyl, polycarbonate, and Venlo glass models.
   - Contractor price-gouging detector (12% fair margin benchmark).
   - Top 10 Predatory Construction Contract Defense Checklist & Counter-Clauses.

6. **`06_VERTICAL_FARM_UNIT_ECONOMICS`**:
   - Thermodynamic sensible heat & latent dehumidification chiller solver (`vertical_farm_unit_economics_simulator.py`).
   - Monthly biomass yield (heads/kg) & power tariff sensitivity analysis.
   - True Cost of Goods Sold (COGS) per kg and 100g retail pack break-even calculator.
   - 100-Pyeong 5-tier ₩380M BOQ schedule and 10-year pro-forma income statement.

7. **`07_HIGH_VALUE_CROPS_WASABI_VANILLA`**:
   - Sawa-wasabi chilled gravel gutter continuous flow engineering (11°C-14°C, DO >= 8.5 mg/L).
   - Vanilla orchid high-wire vine looping and morning hand pollination protocol (>=92% fruit set).
   - 4-Stage Bourbon vanilla curing protocol achieving >=2.0% vanillin.
   - B2B fine-dining & omakase direct supply agreement contract template.

---

### 🚀 Usage Instructions
- All Python scripts require only Python 3.9+ with **zero external pip dependencies**.
- Inspect or modify any script directly.
- Commercial reuse, internal corporate deployment, academic citation, and teaching usage are unconditionally permitted.

*Dedicated to advancing sustainable, data-driven, and democratized controlled-environment agriculture worldwide.*
"""
    readme_path = os.path.join(DIGITAL_ASSETS_DIR, "README_MASTER_VAULT.md")
    with open(readme_path, "w", encoding="utf-8") as f:
        f.write(content)
    print(f"Created: {readme_path}")
    return readme_path

def build_individual_zips():
    for pkg in PACKAGES:
        pkg_dir = os.path.join(DIGITAL_ASSETS_DIR, pkg)
        if not os.path.isdir(pkg_dir):
            continue
        zip_name = f"{pkg}.zip"
        zip_path = os.path.join(DIGITAL_ASSETS_DIR, zip_name)
        with zipfile.ZipFile(zip_path, "w", zipfile.ZIP_DEFLATED) as zf:
            for root, _, files in os.walk(pkg_dir):
                for f in files:
                    file_path = os.path.join(root, f)
                    arcname = os.path.join(pkg, os.path.relpath(file_path, pkg_dir))
                    zf.write(file_path, arcname)
        size_kb = os.path.getsize(zip_path) / 1024
        print(f"Created ZIP: {zip_name} ({size_kb:.1f} KB)")

def build_master_vault_zip(master_readme):
    master_zip_name = "00_INWOOVATION_7IN1_MASTER_ENTERPRISE_VAULT.zip"
    master_zip_path = os.path.join(DIGITAL_ASSETS_DIR, master_zip_name)
    with zipfile.ZipFile(master_zip_path, "w", zipfile.ZIP_DEFLATED) as zf:
        # Add master readme at root
        zf.write(master_readme, "README_MASTER_VAULT.md")
        # Add all packages
        for pkg in PACKAGES:
            pkg_dir = os.path.join(DIGITAL_ASSETS_DIR, pkg)
            if not os.path.isdir(pkg_dir):
                continue
            for root, _, files in os.walk(pkg_dir):
                for f in files:
                    file_path = os.path.join(root, f)
                    arcname = os.path.join("Inwoovation_Master_Vault", pkg, os.path.relpath(file_path, pkg_dir))
                    zf.write(file_path, arcname)
    size_kb = os.path.getsize(master_zip_path) / 1024
    print(f"Created Master ZIP: {master_zip_name} ({size_kb:.1f} KB)")

if __name__ == "__main__":
    master_readme = make_master_readme()
    build_individual_zips()
    build_master_vault_zip(master_readme)
    print("All free open-access asset archives generated successfully!")
