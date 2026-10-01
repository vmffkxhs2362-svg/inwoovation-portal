#!/usr/bin/env python3
"""
Commercial Greenhouse Construction Cost & BOM Reverse-Engineering Engine
-----------------------------------------------------------------------
Author: Inwoovation Horticultural Engineering
License: Commercial Closed-Source Digital Asset
Runtime: Python 3.9+ (Zero External Dependencies)

Reverse-engineers the pure material Bill of Materials (BOM), structural steel tonnage,
cladding surface area, motor/fan requirements, and fair labor installation costs
for commercial single-span and multi-span greenhouses. Compares against contractor quotes
to detect price gouging and unfair contractor markups.
"""

import argparse
import json
import math
import sys

# Standard Unit Costs (Korea / Global 2026 Reference Benchmarks)
COST_BENCHMARKS = {
    'steel_hdg_krw_per_kg': 1950,       # Hot-dip galvanized structural pipe/trusses (₩/kg)
    'steel_pregalv_krw_per_kg': 1650,   # Pre-galvanized purlins/arches (₩/kg)
    'concrete_krw_per_m3': 95000,       # Ready-mix concrete C20/25 for pad footings
    'cladding_po_film_krw_m2': 3200,    # 0.15mm high-tech anti-fog PO film
    'cladding_twin_pc_krw_m2': 22000,   # 8-10mm twin-wall polycarbonate sheet
    'cladding_glass_esg_krw_m2': 42000, # 4mm diffuse tempered safety glass (ESG)
    'screen_system_krw_m2': 8500,       # Drive rack, tubes, and woven screen fabric (per layer)
    'vent_drive_motor_krw': 450000,     # Electric tubular/gear motor (0.37-0.75kW)
    'rack_pinion_krw_per_m': 16000,     # Straight gear rack + housing per meter
    'circ_fan_krw': 180000,             # High-efficiency circulation fan (4500 m3/h)
    'irrigation_krw_per_pyeong': 18000, # PVC mains, solenoids, pressure-compensating drip lines
    'electrical_krw_per_pyeong': 22000, # Wiring, cables, cable trays, junction panels
    'labor_vinyl_krw_per_pyeong': 120000, # Fair installation labor: vinyl multi-span
    'labor_glass_krw_per_pyeong': 220000, # Fair installation labor: glass multi-span
    'labor_single_krw_per_pyeong': 55000, # Fair installation labor: single arch
}

# Type Multipliers and Structural Weights
GREENHOUSE_MODELS = {
    'single_vinyl': {
        'name': 'Single-Span High-Profile Vinyl Arch',
        'steel_kg_m2': 9.5,
        'steel_type': 'pregalv',
        'cladding': 'po_film',
        'labor_rate': 'labor_single_krw_per_pyeong',
        'roof_surface_ratio': 1.45,
        'sidewall_surface_ratio': 0.35,
        'screens_layers': 1,
    },
    'multi_vinyl': {
        'name': 'Multi-Span High-Tech Vinyl/PO Commercial Greenhouse',
        'steel_kg_m2': 18.5,
        'steel_type': 'hdg',
        'cladding': 'po_film',
        'labor_rate': 'labor_vinyl_krw_per_pyeong',
        'roof_surface_ratio': 1.15,
        'sidewall_surface_ratio': 0.25,
        'screens_layers': 2,
    },
    'multi_pc': {
        'name': 'Multi-Span Twin-Wall Polycarbonate Facility',
        'steel_kg_m2': 21.0,
        'steel_type': 'hdg',
        'cladding': 'twin_pc',
        'labor_rate': 'labor_vinyl_krw_per_pyeong',
        'roof_surface_ratio': 1.15,
        'sidewall_surface_ratio': 0.25,
        'screens_layers': 2,
    },
    'multi_venlo_glass': {
        'name': 'Venlo High-Wire Commercial Glasshouse',
        'steel_kg_m2': 28.5,
        'steel_type': 'hdg',
        'cladding': 'glass_esg',
        'labor_rate': 'labor_glass_krw_per_pyeong',
        'roof_surface_ratio': 1.12,
        'sidewall_surface_ratio': 0.22,
        'screens_layers': 2,
    }
}


def calculate_greenhouse_bom(model_key, area_pyeong, eave_height_m, contractor_quote_krw=None):
    """
    Reverse-engineers complete greenhouse bill of materials and benchmarks fair pricing.
    """
    if model_key not in GREENHOUSE_MODELS:
        raise ValueError(f"Invalid model key: {model_key}. Available: {list(GREENHOUSE_MODELS.keys())}")

    model = GREENHOUSE_MODELS[model_key]
    area_m2 = area_pyeong * 3.305785

    # 1. Structural Steel Sizing
    # Height adjustment: Base height is 4.0m; add 4% steel per additional meter of eave height
    height_factor = 1.0 + max(0.0, (eave_height_m - 4.0) * 0.04)
    steel_mass_kg = area_m2 * model['steel_kg_m2'] * height_factor
    steel_tons = steel_mass_kg / 1000.0

    steel_rate = COST_BENCHMARKS['steel_hdg_krw_per_kg'] if model['steel_type'] == 'hdg' else COST_BENCHMARKS['steel_pregalv_krw_per_kg']
    steel_cost_krw = steel_mass_kg * steel_rate

    # 2. Substructure Concrete Footings
    # 1 isolated pier foundation per 24 m2 floor area (approx 0.35 m3 concrete per pier)
    num_piers = math.ceil(area_m2 / 24.0)
    concrete_vol_m3 = num_piers * 0.35
    concrete_cost_krw = concrete_vol_m3 * COST_BENCHMARKS['concrete_krw_per_m3']

    # 3. Cladding Surface Area & Material Cost (including 10% wastage/overlap)
    roof_area_m2 = area_m2 * model['roof_surface_ratio'] * 1.10
    wall_area_m2 = area_m2 * model['sidewall_surface_ratio'] * (eave_height_m / 4.0) * 1.10
    total_cladding_area_m2 = roof_area_m2 + wall_area_m2

    if model['cladding'] == 'po_film':
        cladding_unit_cost = COST_BENCHMARKS['cladding_po_film_krw_m2']
    elif model['cladding'] == 'twin_pc':
        cladding_unit_cost = COST_BENCHMARKS['cladding_twin_pc_krw_m2']
    else:
        cladding_unit_cost = COST_BENCHMARKS['cladding_glass_esg_krw_m2']

    cladding_cost_krw = total_cladding_area_m2 * cladding_unit_cost

    # 4. Energy / Shading Screen Systems
    screen_layers = model['screens_layers']
    screen_area_m2 = area_m2 * screen_layers
    screen_cost_krw = screen_area_m2 * COST_BENCHMARKS['screen_system_krw_m2']

    # 5. Ventilation & Circulation Systems
    # 1 gear motor per 40m length of vent run (~ 1 per 600 m2)
    num_vent_motors = max(2, math.ceil(area_m2 / 600.0))
    vent_motors_cost_krw = num_vent_motors * COST_BENCHMARKS['vent_drive_motor_krw']
    rack_length_m = area_m2 * 0.15 # Approx 0.15m rack per m2
    rack_cost_krw = rack_length_m * COST_BENCHMARKS['rack_pinion_krw_per_m']

    # Circulation Fans: 1 fan per 70 m2
    num_circ_fans = math.ceil(area_m2 / 70.0)
    circ_fans_cost_krw = num_circ_fans * COST_BENCHMARKS['circ_fan_krw']

    # 6. Fertigation & Electrical Subsystems
    irrigation_cost_krw = area_pyeong * COST_BENCHMARKS['irrigation_krw_per_pyeong']
    electrical_cost_krw = area_pyeong * COST_BENCHMARKS['electrical_krw_per_pyeong']

    # Total Pure Material BOM Cost
    pure_bom_materials_krw = (
        steel_cost_krw +
        concrete_cost_krw +
        cladding_cost_krw +
        screen_cost_krw +
        vent_motors_cost_krw +
        rack_cost_krw +
        circ_fans_cost_krw +
        irrigation_cost_krw +
        electrical_cost_krw
    )

    # 7. Labor, Machinery & Fair General Contractor Overhead
    labor_rate_py = COST_BENCHMARKS[model['labor_rate']]
    labor_cost_krw = area_pyeong * labor_rate_py
    machinery_equipment_krw = pure_bom_materials_krw * 0.04 # 4% cranes, lifts, diggers
    site_overhead_permits_krw = pure_bom_materials_krw * 0.04 # 4% safety, insurance, temp power

    # Direct Production Cost (Materials + Direct Labor + Machines)
    direct_cost_krw = pure_bom_materials_krw + labor_cost_krw + machinery_equipment_krw + site_overhead_permits_krw

    # Fair Contractor Profit (12.0% Net Margin)
    fair_margin_rate = 0.12
    fair_turnkey_price_krw = direct_cost_krw * (1.0 + fair_margin_rate)
    fair_price_per_pyeong_krw = fair_turnkey_price_krw / area_pyeong
    fair_price_per_m2_krw = fair_turnkey_price_krw / area_m2

    # 8. Contractor Quote Audit (if provided)
    audit = None
    if contractor_quote_krw and contractor_quote_krw > 0:
        quote_per_pyeong = contractor_quote_krw / area_pyeong
        discrepancy_krw = contractor_quote_krw - fair_turnkey_price_krw
        markup_over_fair_percent = (discrepancy_krw / fair_turnkey_price_krw) * 100.0

        if markup_over_fair_percent <= 5.0:
            verdict = "FAIR & COMPETITIVE (Within standard market range)"
            risk_level = "LOW"
        elif markup_over_fair_percent <= 18.0:
            verdict = "MODERATE MARKUP (5-10% price negotiation advised)"
            risk_level = "MEDIUM"
        else:
            verdict = "OVERPRICED / GOUGING (Detailed itemized BOM audit required)"
            risk_level = "HIGH"

        audit = {
            'contractor_quote_krw': round(contractor_quote_krw, 0),
            'contractor_quote_per_pyeong_krw': round(quote_per_pyeong, 0),
            'discrepancy_krw': round(discrepancy_krw, 0),
            'markup_over_fair_percent': round(markup_over_fair_percent, 1),
            'verdict': verdict,
            'risk_level': risk_level
        }

    return {
        'model_name': model['name'],
        'area_pyeong': area_pyeong,
        'area_m2': round(area_m2, 1),
        'eave_height_m': eave_height_m,
        'structural_steel': {
            'mass_kg': round(steel_mass_kg, 0),
            'mass_tons': round(steel_tons, 2),
            'cost_krw': round(steel_cost_krw, 0),
        },
        'foundations_concrete': {
            'num_piers': num_piers,
            'volume_m3': round(concrete_vol_m3, 1),
            'cost_krw': round(concrete_cost_krw, 0),
        },
        'cladding_system': {
            'material': model['cladding'],
            'total_area_m2': round(total_cladding_area_m2, 1),
            'cost_krw': round(cladding_cost_krw, 0),
        },
        'climate_subsystems': {
            'screens_cost_krw': round(screen_cost_krw, 0),
            'ventilation_motors_cost_krw': round(vent_motors_cost_krw + rack_cost_krw, 0),
            'circulation_fans_qty': num_circ_fans,
            'circulation_fans_cost_krw': round(circ_fans_cost_krw, 0),
            'irrigation_lines_cost_krw': round(irrigation_cost_krw, 0),
            'electrical_panels_cost_krw': round(electrical_cost_krw, 0),
        },
        'cost_summary': {
            'pure_materials_bom_krw': round(pure_bom_materials_krw, 0),
            'installation_labor_krw': round(labor_cost_krw, 0),
            'machinery_and_cranes_krw': round(machinery_equipment_krw, 0),
            'site_overhead_permits_krw': round(site_overhead_permits_krw, 0),
            'contractor_fair_profit_12pct_krw': round(fair_turnkey_price_krw - direct_cost_krw, 0),
            'fair_turnkey_total_krw': round(fair_turnkey_price_krw, 0),
            'fair_price_per_pyeong_krw': round(fair_price_per_pyeong_krw, 0),
            'fair_price_per_m2_krw': round(fair_price_per_m2_krw, 0),
            'fair_turnkey_usd': round(fair_turnkey_price_krw / 1360.0, 2),
        },
        'contractor_audit': audit
    }


def print_formatted_table(res):
    print("=" * 78)
    print("🏗️  INWOOVATION GREENHOUSE BOM & CONSTRUCTION COST REVERSE ESTIMATOR")
    print(f"   Model: {res['model_name']}")
    print(f"   Dimensions: {res['area_pyeong']:,} pyeong ({res['area_m2']} m2) | Eave Height: {res['eave_height_m']} m")
    print("=" * 78)

    cs = res['cost_summary']
    st = res['structural_steel']
    cl = res['cladding_system']
    fn = res['foundations_concrete']
    sub = res['climate_subsystems']

    print("\n📦 REVERSE-ENGINEERED BILL OF MATERIALS (BOM):")
    print(f"   1. Structural Steel Framework:    {st['mass_tons']:>6.2f} tons  --> ₩{st['cost_krw']:>12,}")
    print(f"   2. Concrete Pad Footings:         {fn['num_piers']:>6} piers --> ₩{fn['cost_krw']:>12,}")
    print(f"   3. Roof & Wall Cladding:          {cl['total_area_m2']:>6.0f} m2    --> ₩{cl['cost_krw']:>12,}")
    print(f"   4. Dual Automated Screen System:                 --> ₩{sub['screens_cost_krw']:>12,}")
    print(f"   5. Roof Vent Drives & Racks:                     --> ₩{sub['ventilation_motors_cost_krw']:>12,}")
    print(f"   6. Circulation Axial Fans:        {sub['circulation_fans_qty']:>6} units --> ₩{sub['circulation_fans_cost_krw']:>12,}")
    print(f"   7. Drip Fertigation Network:                     --> ₩{sub['irrigation_lines_cost_krw']:>12,}")
    print(f"   8. Electric Panels & Main Cables:                --> ₩{sub['electrical_panels_cost_krw']:>12,}")
    print(f"   -------------------------------------------------------------------")
    print(f"   >>> PURE MATERIAL BOM SUBTOTAL:                      ₩{cs['pure_materials_bom_krw']:>12,}")

    print("\n👷 LABOR, LOGISTICS & FAIR PROFIT BREAKDOWN:")
    print(f"   - On-Site Foundation & Erection Labor:            ₩{cs['installation_labor_krw']:>12,}")
    print(f"   - Heavy Equipment (Cranes, Scissor Lifts):        ₩{cs['machinery_and_cranes_krw']:>12,}")
    print(f"   - Site Overhead, Safety & Permitting:             ₩{cs['site_overhead_permits_krw']:>12,}")
    print(f"   - Fair Contractor Net Margin (12.0%):             ₩{cs['contractor_fair_profit_12pct_krw']:>12,}")
    print(f"   ===================================================================")
    print(f"   ⭐ FAIR TURNKEY CONTRACT VALUE:                    ₩{cs['fair_turnkey_total_krw']:>12,}")
    print(f"      (Unit Cost: ${cs['fair_price_per_m2_usd']} USD/m² | ${cs['fair_turnkey_usd']:,} USD Total)")

    if res['contractor_audit']:
        aud = res['contractor_audit']
        print("\n🔍 CONTRACTOR QUOTE VERIFICATION AUDIT:")
        print(f"   Contractor's Quoted Total:    ₩{aud['contractor_quote_krw']:,} (${aud['contractor_quote_krw']/USD_KRW_EXCHANGE_RATE:,.0f} USD)")
        print(f"   Difference from Fair Price:   ₩{aud['discrepancy_krw']:+,} ({aud['markup_over_fair_percent']:+.1f}%)")
        print(f"   Contractor Audit Verdict:     [{aud['risk_level']}] {aud['verdict']}")
    print("=" * 78)


def main():
    parser = argparse.ArgumentParser(description="Greenhouse BOM & Construction Cost Reverse Estimator")
    parser.add_argument('--model', type=str, default='multi_vinyl',
                        choices=list(GREENHOUSE_MODELS.keys()),
                        help="Greenhouse type key")
    parser.add_argument('--area', type=float, default=1000.0,
                        help="Floor area in Pyeong (1 pyeong = 3.3058 m2, default: 1000)")
    parser.add_argument('--eave-height', type=float, default=4.5,
                        help="Eave height in meters (default: 4.5m)")
    parser.add_argument('--contractor-quote', type=float, default=0.0,
                        help="Contractor total quote in KRW for price gouging audit")
    parser.add_argument('--format', type=str, choices=['table', 'json'], default='table',
                        help="Output format: table or json")

    args = parser.parse_args()

    try:
        results = calculate_greenhouse_bom(
            model_key=args.model,
            area_pyeong=args.area,
            eave_height_m=args.eave_height,
            contractor_quote_krw=args.contractor_quote
        )
        if args.format == 'json':
            print(json.dumps(results, indent=2))
        else:
            print_formatted_table(results)
    except Exception as e:
        print(f"Error during estimation: {e}", file=sys.stderr)
        sys.exit(1)


if __name__ == '__main__':
    main()
