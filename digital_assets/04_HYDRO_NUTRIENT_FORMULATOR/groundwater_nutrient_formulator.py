#!/usr/bin/env python3
"""
Precision Hydroponic Nutrient Formulation & Groundwater Correction Engine
-------------------------------------------------------------------------
Author: Inwoovation Horticultural Engineering
License: Commercial Closed-Source Digital Asset
Runtime: Python 3.9+ (Zero External Dependencies)

Solves stoichiometric ion balance equations for 15 commercial horticultural crops,
subtracts native groundwater mineral ions, neutralizes bicarbonates with nitric/phosphoric acid,
and outputs exact mass (grams) of salts required for Stock Tank A and Stock Tank B (100x).
"""

import argparse
import json
import math
import sys

# Molar Masses & Equivalent Weights (g/mol, g/eq)
MW = {
    'NO3': 62.0049,
    'NH4': 18.0385,
    'H2PO4': 96.9871,
    'K': 39.0983,
    'Ca': 40.078,
    'Mg': 24.305,
    'SO4': 96.0626,
    'HCO3': 61.0168,
    'Na': 22.9898,
    'Cl': 35.453,
    'Fe': 55.845,
    'Mn': 54.938,
    'Zn': 65.38,
    'B': 10.811,
    'Cu': 63.546,
    'Mo': 95.95,
}

# Commercial Fertilizer Salts Elemental Compositions (% by weight)
FERTILIZERS = {
    'calcium_nitrate': {
        'name': 'Calcium Nitrate (5Ca(NO3)2·NH4NO3·10H2O)',
        'tank': 'A',
        'Ca': 0.190,  # 19.0% Ca
        'NO3_N': 0.144, # 14.4% NO3-N
        'NH4_N': 0.011, # 1.1% NH4-N
        'cost_per_kg_krw': 1800, # Approx market price
        'cost_per_kg_usd': 1.35,
    },
    'potassium_nitrate': {
        'name': 'Potassium Nitrate (KNO3)',
        'tank': 'A_B_split',
        'K': 0.3867, # 38.67% K
        'NO3_N': 0.1386, # 13.86% NO3-N
        'cost_per_kg_krw': 2600,
        'cost_per_kg_usd': 1.95,
    },
    'mkp': {
        'name': 'Monopotassium Phosphate (KH2PO4)',
        'tank': 'B',
        'K': 0.2873, # 28.73% K
        'P': 0.2276, # 22.76% P (71.2% H2PO4)
        'cost_per_kg_krw': 3800,
        'cost_per_kg_usd': 2.85,
    },
    'magnesium_sulfate': {
        'name': 'Magnesium Sulfate Heptahydrate (MgSO4·7H2O)',
        'tank': 'B',
        'Mg': 0.0986, # 9.86% Mg
        'S': 0.1301, # 13.01% S (39.0% SO4)
        'cost_per_kg_krw': 900,
        'cost_per_kg_usd': 0.68,
    },
    'potassium_sulfate': {
        'name': 'Potassium Sulfate (K2SO4)',
        'tank': 'B',
        'K': 0.4487, # 44.87% K
        'S': 0.1840, # 18.40% S
        'cost_per_kg_krw': 2200,
        'cost_per_kg_usd': 1.65,
    },
    'iron_dtpa': {
        'name': 'Iron Chelate (Fe-DTPA 7%)',
        'tank': 'A',
        'Fe': 0.070, # 7.0% Fe
        'cost_per_kg_krw': 28000,
        'cost_per_kg_usd': 21.00,
    },
    'nitric_acid': {
        'name': 'Nitric Acid 68% (HNO3, density 1.41 kg/L)',
        'tank': 'Acid_Direct',
        'NO3_N': 0.151, # 15.1% N
        'density': 1.41,
        'cost_per_L_krw': 2500,
        'cost_per_L_usd': 1.88,
    }
}

# 15 Master Commercial Crop Formulations (Standard Targets in meq/L for Final Working Solution)
CROP_DATABASE = {
    'strawberry_fruiting': {
        'name': 'Strawberry (Seolhyang / Maehyang - Flowering & Heavy Fruiting)',
        'target_ec': 1.4,
        'target_ph': 5.8,
        'meq': {'NO3': 9.0, 'NH4': 0.5, 'H2PO4': 2.5, 'K': 5.0, 'Ca': 4.0, 'Mg': 2.0, 'SO4': 2.0},
        'fe_ppm': 2.0,
    },
    'strawberry_vegetative': {
        'name': 'Strawberry (Establishment & Early Vegetative Canopy)',
        'target_ec': 1.1,
        'target_ph': 5.8,
        'meq': {'NO3': 7.5, 'NH4': 0.8, 'H2PO4': 2.0, 'K': 4.0, 'Ca': 3.5, 'Mg': 1.5, 'SO4': 1.5},
        'fe_ppm': 1.5,
    },
    'tomato_fruiting': {
        'name': 'Tomato (Beefsteak - Full Bearing & Fruiting Stage)',
        'target_ec': 2.6,
        'target_ph': 5.6,
        'meq': {'NO3': 16.0, 'NH4': 1.0, 'H2PO4': 3.5, 'K': 9.5, 'Ca': 9.0, 'Mg': 4.5, 'SO4': 4.5},
        'fe_ppm': 2.8,
    },
    'tomato_vegetative': {
        'name': 'Tomato (Beefsteak - Vegetative Vegetative Growth)',
        'target_ec': 2.0,
        'target_ph': 5.6,
        'meq': {'NO3': 12.0, 'NH4': 1.0, 'H2PO4': 3.0, 'K': 6.5, 'Ca': 7.0, 'Mg': 3.5, 'SO4': 3.5},
        'fe_ppm': 2.2,
    },
    'cherry_tomato_brix': {
        'name': 'Cherry Tomato (High-Brix Steering Formula)',
        'target_ec': 3.2,
        'target_ph': 5.5,
        'meq': {'NO3': 18.0, 'NH4': 0.8, 'H2PO4': 4.0, 'K': 12.5, 'Ca': 10.5, 'Mg': 5.5, 'SO4': 5.5},
        'fe_ppm': 3.0,
    },
    'paprika_fruiting': {
        'name': 'Bell Pepper / Paprika (Coloring & Mature Fruit Load)',
        'target_ec': 2.4,
        'target_ph': 5.7,
        'meq': {'NO3': 14.5, 'NH4': 0.8, 'H2PO4': 3.2, 'K': 8.5, 'Ca': 8.0, 'Mg': 4.0, 'SO4': 4.0},
        'fe_ppm': 2.5,
    },
    'paprika_vegetative': {
        'name': 'Bell Pepper / Paprika (Vegetative Shoot Development)',
        'target_ec': 1.9,
        'target_ph': 5.7,
        'meq': {'NO3': 11.5, 'NH4': 1.0, 'H2PO4': 2.8, 'K': 6.0, 'Ca': 6.5, 'Mg': 3.0, 'SO4': 3.0},
        'fe_ppm': 2.0,
    },
    'cucumber_fruiting': {
        'name': 'Cucumber (Dutch High-Wire - High Transpiration Bearing)',
        'target_ec': 2.2,
        'target_ph': 5.6,
        'meq': {'NO3': 15.0, 'NH4': 1.2, 'H2PO4': 3.0, 'K': 8.0, 'Ca': 7.5, 'Mg': 3.5, 'SO4': 3.5},
        'fe_ppm': 2.5,
    },
    'korean_melon': {
        'name': 'Korean Melon / Oriental Melon (Soilless Slab Culture)',
        'target_ec': 2.0,
        'target_ph': 5.8,
        'meq': {'NO3': 12.5, 'NH4': 0.8, 'H2PO4': 3.0, 'K': 7.0, 'Ca': 7.0, 'Mg': 3.5, 'SO4': 3.5},
        'fe_ppm': 2.2,
    },
    'lettuce_butterhead': {
        'name': 'Butterhead Lettuce (Tipburn-Suppression Deep Water / NFT)',
        'target_ec': 1.3,
        'target_ph': 5.8,
        'meq': {'NO3': 8.5, 'NH4': 0.5, 'H2PO4': 2.0, 'K': 4.5, 'Ca': 4.5, 'Mg': 1.5, 'SO4': 1.5},
        'fe_ppm': 1.8,
    },
    'basil_aromatic': {
        'name': 'Sweet Genovese Basil (High Terpene & Essential Oil Synthesis)',
        'target_ec': 1.6,
        'target_ph': 6.0,
        'meq': {'NO3': 10.5, 'NH4': 0.5, 'H2PO4': 2.5, 'K': 5.5, 'Ca': 5.0, 'Mg': 2.5, 'SO4': 2.5},
        'fe_ppm': 2.0,
    },
    'spinach_baby': {
        'name': 'Spinach & Baby Leaf (Low Oxalate Accumulation)',
        'target_ec': 1.5,
        'target_ph': 6.2,
        'meq': {'NO3': 9.5, 'NH4': 0.5, 'H2PO4': 2.2, 'K': 5.0, 'Ca': 4.5, 'Mg': 2.0, 'SO4': 2.0},
        'fe_ppm': 2.0,
    },
    'eggplant': {
        'name': 'Eggplant / Aubergine (Solanaceae Commercial Bearing)',
        'target_ec': 2.3,
        'target_ph': 5.8,
        'meq': {'NO3': 14.0, 'NH4': 1.0, 'H2PO4': 3.0, 'K': 8.0, 'Ca': 7.5, 'Mg': 3.5, 'SO4': 3.5},
        'fe_ppm': 2.5,
    },
    'blueberry_substrate': {
        'name': 'Southern Highbush Blueberry (Acidic Substrate pH 4.5-5.0)',
        'target_ec': 1.2,
        'target_ph': 4.8,
        'meq': {'NO3': 4.0, 'NH4': 3.5, 'H2PO4': 1.8, 'K': 3.0, 'Ca': 2.5, 'Mg': 1.5, 'SO4': 3.5},
        'fe_ppm': 3.0,
    },
    'wasabi_chilled': {
        'name': 'Wasabi (Water Sawa-wasabi - Continuous Chilled Flow)',
        'target_ec': 1.2,
        'target_ph': 6.0,
        'meq': {'NO3': 6.5, 'NH4': 0.3, 'H2PO4': 1.8, 'K': 3.5, 'Ca': 3.5, 'Mg': 1.8, 'SO4': 3.0},
        'fe_ppm': 2.0,
    }
}


def calculate_nutrient_solution(crop_key, raw_water, tank_volume_l, dilution_ratio):
    """
    Performs full stoichiometric ion balancing and groundwater correction.
    """
    if crop_key not in CROP_DATABASE:
        raise ValueError(f"Unknown crop key: {crop_key}. Available: {list(CROP_DATABASE.keys())}")

    crop = CROP_DATABASE[crop_key]
    target_meq = crop['meq']
    
    # 1. Convert Raw Water mg/L to meq/L
    raw_meq = {
        'Ca': (raw_water.get('ca', 0.0) / MW['Ca']) * 2.0,
        'Mg': (raw_water.get('mg', 0.0) / MW['Mg']) * 2.0,
        'K': (raw_water.get('k', 0.0) / MW['K']) * 1.0,
        'NO3': (raw_water.get('no3', 0.0) / MW['NO3']) * 1.0,
        'SO4': (raw_water.get('so4', 0.0) / MW['SO4']) * 2.0,
        'HCO3': (raw_water.get('hco3', 0.0) / MW['HCO3']) * 1.0,
        'Na': (raw_water.get('na', 0.0) / MW['Na']) * 1.0,
        'Cl': (raw_water.get('cl', 0.0) / MW['Cl']) * 1.0,
    }
    
    # 2. Bicarbonate Neutralization via Nitric Acid
    # Target residual HCO3: 0.5 meq/L to buffer pH ~5.6 - 5.8
    hco3_excess = max(0.0, raw_meq['HCO3'] - 0.5)
    acid_no3_meq = hco3_excess  # 1 meq HNO3 neutralizes 1 meq HCO3 and donates 1 meq NO3
    
    # 3. Calculate Net Mineral Requirements (meq/L)
    # Deduct native groundwater ions from target
    net_ca_meq = max(0.0, target_meq['Ca'] - raw_meq['Ca'])
    net_mg_meq = max(0.0, target_meq['Mg'] - raw_meq['Mg'])
    net_k_meq = max(0.0, target_meq['K'] - raw_meq['K'])
    net_h2po4_meq = target_meq['H2PO4'] # Raw water P usually negligible
    
    # Total available nitrate credit from groundwater and acid neutralization
    available_no3_credit = raw_meq['NO3'] + acid_no3_meq
    net_no3_meq = max(0.0, target_meq['NO3'] - available_no3_credit)
    net_so4_meq = max(0.0, target_meq['SO4'] - raw_meq['SO4'])

    # 4. Salt Allocation Calculations (Working Solution mg/L = g / 1000L)
    # Step A: All Net Ca supplied by Calcium Nitrate
    # Ca equivalent weight in Cal-Nit: Ca is 19% by weight -> 1 meq Ca (20.04 mg Ca) requires:
    cal_nit_mg_l = (net_ca_meq * (MW['Ca'] / 2.0)) / FERTILIZERS['calcium_nitrate']['Ca']
    no3_from_cal_nit_meq = (cal_nit_mg_l * FERTILIZERS['calcium_nitrate']['NO3_N']) / (MW['NO3'] * (14.007/62.0049))
    
    # Step B: All Net Phosphate supplied by MKP
    mkp_mg_l = (net_h2po4_meq * MW['H2PO4'] * (30.974/96.9871)) / FERTILIZERS['mkp']['P']
    k_from_mkp_meq = (mkp_mg_l * FERTILIZERS['mkp']['K']) / MW['K']
    
    # Step C: All Net Magnesium supplied by Magnesium Sulfate
    epsom_mg_l = (net_mg_meq * (MW['Mg'] / 2.0)) / FERTILIZERS['magnesium_sulfate']['Mg']
    so4_from_epsom_meq = (epsom_mg_l * FERTILIZERS['magnesium_sulfate']['S'] * (96.0626/32.065)) / (MW['SO4'] / 2.0)
    
    # Step D: Remaining Potassium allocation
    remaining_k_meq = max(0.0, net_k_meq - k_from_mkp_meq)
    remaining_no3_meq = max(0.0, net_no3_meq - no3_from_cal_nit_meq)
    
    # Use Potassium Nitrate to satisfy remaining K or NO3
    kno3_k_meq = min(remaining_k_meq, remaining_no3_meq)
    kno3_mg_l = (kno3_k_meq * MW['K']) / FERTILIZERS['potassium_nitrate']['K']
    
    remaining_k_after_kno3 = remaining_k_meq - kno3_k_meq
    k2so4_mg_l = 0.0
    if remaining_k_after_kno3 > 0.05:
        # Use Potassium Sulfate for excess K
        k2so4_mg_l = (remaining_k_after_kno3 * MW['K']) / FERTILIZERS['potassium_sulfate']['K']
        
    # Step E: Chelated Iron (Fe-DTPA 7%)
    fe_target_ppm = crop['fe_ppm']
    fe_dtpa_mg_l = fe_target_ppm / FERTILIZERS['iron_dtpa']['Fe']
    
    # Step F: Pure Nitric Acid volume required for raw water bicarbonate neutralization
    # 1 meq HNO3 = 63.01 mg HNO3. At 68% and 1.41 g/mL density:
    # 1 meq/L HNO3 = 63.01 / (0.68 * 1410) = 0.0657 mL of 68% HNO3 per Liter of working solution
    nitric_acid_ml_m3 = hco3_excess * 65.7  # mL per cubic meter (1000L) of raw water
    
    # 5. Scale Up to Concentrated Stock Tanks (Tank A & Tank B)
    # Total volume of working solution made by 1 stock tank volume:
    total_working_liters = tank_volume_l * dilution_ratio
    multiplier_stock = total_working_liters / 1000.0 # Factor to scale mg/L (g/1000L) to Stock Tank grams

    # Tank A Formulation (g per Stock Tank)
    # Half of KNO3 can go into Tank A, half into Tank B for balance
    tank_a_cal_nit_g = cal_nit_mg_l * multiplier_stock
    tank_a_kno3_g = (kno3_mg_l * 0.5) * multiplier_stock
    tank_a_fe_g = fe_dtpa_mg_l * multiplier_stock
    
    # Tank B Formulation (g per Stock Tank)
    tank_b_mkp_g = mkp_mg_l * multiplier_stock
    tank_b_epsom_g = epsom_mg_l * multiplier_stock
    tank_b_kno3_g = (kno3_mg_l * 0.5) * multiplier_stock
    tank_b_k2so4_g = k2so4_mg_l * multiplier_stock
    
    # 6. Economic Cost & Savings Comparison
    # Calculate uncorrected cost (assuming deionized water with zero native ions)
    uncorrected_cal_nit_g = ((target_meq['Ca'] * (MW['Ca'] / 2.0)) / FERTILIZERS['calcium_nitrate']['Ca']) * multiplier_stock
    uncorrected_epsom_g = ((target_meq['Mg'] * (MW['Mg'] / 2.0)) / FERTILIZERS['magnesium_sulfate']['Mg']) * multiplier_stock
    uncorrected_k_meq = target_meq['K'] - ((target_meq['H2PO4'] * MW['H2PO4'] * (30.974/96.9871)) / FERTILIZERS['mkp']['P'] * FERTILIZERS['mkp']['K'] / MW['K'])
    uncorrected_kno3_g = ((uncorrected_k_meq * MW['K']) / FERTILIZERS['potassium_nitrate']['K']) * multiplier_stock
    
    cost_corrected_krw = (
        (tank_a_cal_nit_g / 1000.0) * FERTILIZERS['calcium_nitrate']['cost_per_kg_krw'] +
        ((tank_a_kno3_g + tank_b_kno3_g) / 1000.0) * FERTILIZERS['potassium_nitrate']['cost_per_kg_krw'] +
        (tank_b_mkp_g / 1000.0) * FERTILIZERS['mkp']['cost_per_kg_krw'] +
        (tank_b_epsom_g / 1000.0) * FERTILIZERS['magnesium_sulfate']['cost_per_kg_krw'] +
        (tank_b_k2so4_g / 1000.0) * FERTILIZERS['potassium_sulfate']['cost_per_kg_krw'] +
        (tank_a_fe_g / 1000.0) * FERTILIZERS['iron_dtpa']['cost_per_kg_krw']
    )
    
    cost_uncorrected_krw = (
        (uncorrected_cal_nit_g / 1000.0) * FERTILIZERS['calcium_nitrate']['cost_per_kg_krw'] +
        (uncorrected_kno3_g / 1000.0) * FERTILIZERS['potassium_nitrate']['cost_per_kg_krw'] +
        (tank_b_mkp_g / 1000.0) * FERTILIZERS['mkp']['cost_per_kg_krw'] +
        (uncorrected_epsom_g / 1000.0) * FERTILIZERS['magnesium_sulfate']['cost_per_kg_krw'] +
        (tank_a_fe_g / 1000.0) * FERTILIZERS['iron_dtpa']['cost_per_kg_krw']
    )
    
    savings_percent = max(0.0, ((cost_uncorrected_krw - cost_corrected_krw) / cost_uncorrected_krw) * 100.0)

    return {
        'crop': crop['name'],
        'target_ec': crop['target_ec'],
        'target_ph': crop['target_ph'],
        'tank_volume_liters': tank_volume_l,
        'dilution_ratio': f"1:{dilution_ratio}",
        'total_working_solution_m3': total_working_liters / 1000.0,
        'groundwater_ions_meq': {k: round(v, 2) for k, v in raw_meq.items()},
        'acid_neutralization': {
            'hco3_excess_meq_l': round(hco3_excess, 2),
            'nitric_acid_68_ml_per_m3': round(nitric_acid_ml_m3, 1),
            'nitric_acid_total_L': round((nitric_acid_ml_m3 * (total_working_liters / 1000.0)) / 1000.0, 2),
        },
        'tank_A_salts_kg': {
            'calcium_nitrate': round(tank_a_cal_nit_g / 1000.0, 2),
            'potassium_nitrate_part1': round(tank_a_kno3_g / 1000.0, 2),
            'iron_dtpa_7pct': round(tank_a_fe_g / 1000.0, 3),
            'total_tank_a_mass_kg': round((tank_a_cal_nit_g + tank_a_kno3_g + tank_a_fe_g) / 1000.0, 2),
        },
        'tank_B_salts_kg': {
            'monopotassium_phosphate_mkp': round(tank_b_mkp_g / 1000.0, 2),
            'magnesium_sulfate_epsom': round(tank_b_epsom_g / 1000.0, 2),
            'potassium_nitrate_part2': round(tank_b_kno3_g / 1000.0, 2),
            'potassium_sulfate': round(tank_b_k2so4_g / 1000.0, 2),
            'total_tank_b_mass_kg': round((tank_b_mkp_g + tank_b_epsom_g + tank_b_kno3_g + tank_b_k2so4_g) / 1000.0, 2),
        },
        'economics': {
            'cost_corrected_krw': round(cost_corrected_krw, 0),
            'cost_uncorrected_krw': round(cost_uncorrected_krw, 0),
            'monthly_savings_krw': round(cost_uncorrected_krw - cost_corrected_krw, 0),
            'savings_percentage': round(savings_percent, 1),
            'cost_corrected_usd': round(cost_corrected_krw / 1360.0, 2),
        }
    }


def print_formatted_table(res):
    print("=" * 78)
    print("🌾 INWOOVATION PRECISION HYDROPONIC NUTRIENT FORMULATION REPORT")
    print(f"   Crop Target: {res['crop']}")
    print(f"   Target EC: {res['target_ec']} dS/m | Target Rootzone pH: {res['target_ph']}")
    print(f"   Batch: {res['tank_volume_liters']} L Stock Tank @ {res['dilution_ratio']} -> {res['total_working_solution_m3']} m3 Working Solution")
    print("=" * 78)
    
    print("\n💧 RAW GROUNDWATER ASSAY DEDUCTIONS (Native Ions Subtracted):")
    gw = res['groundwater_ions_meq']
    print(f"   Ca: {gw['Ca']} meq/L | Mg: {gw['Mg']} meq/L | K: {gw['K']} meq/L | Na: {gw['Na']} meq/L")
    print(f"   HCO3: {gw['HCO3']} meq/L | NO3: {gw['NO3']} meq/L | SO4: {gw['SO4']} meq/L | Cl: {gw['Cl']} meq/L")
    
    acid = res['acid_neutralization']
    if acid['hco3_excess_meq_l'] > 0:
        print(f"\n🧪 ACID BUFFERING: {acid['hco3_excess_meq_l']} meq/L excess HCO3 neutralized.")
        print(f"   Inject {acid['nitric_acid_68_ml_per_m3']} mL of 68% Nitric Acid per 1,000 L raw water.")
        print(f"   Total acid for this batch: {acid['nitric_acid_total_L']} Liters.")

    print("\n📦 STOCK TANK A (Calcium & Iron Concentrate - Dissolve in Tank A):")
    ta = res['tank_A_salts_kg']
    print(f"   1. Calcium Nitrate:               {ta['calcium_nitrate']:>8.2f} kg")
    print(f"   2. Potassium Nitrate (Part 1):    {ta['potassium_nitrate_part1']:>8.2f} kg")
    print(f"   3. Chelated Iron (Fe-DTPA 7%):    {ta['iron_dtpa_7pct']:>8.3f} kg ({ta['iron_dtpa_7pct']*1000:.0f} g)")
    print(f"   --> Total Salt Mass in Tank A:     {ta['total_tank_a_mass_kg']:>8.2f} kg")

    print("\n📦 STOCK TANK B (Phosphates & Sulfates Concentrate - Dissolve in Tank B):")
    tb = res['tank_B_salts_kg']
    print(f"   1. Monopotassium Phosphate (MKP): {tb['monopotassium_phosphate_mkp']:>8.2f} kg")
    print(f"   2. Magnesium Sulfate (Epsom):     {tb['magnesium_sulfate_epsom']:>8.2f} kg")
    print(f"   3. Potassium Nitrate (Part 2):    {tb['potassium_nitrate_part2']:>8.2f} kg")
    if tb['potassium_sulfate'] > 0:
        print(f"   4. Potassium Sulfate:             {tb['potassium_sulfate']:>8.2f} kg")
    print(f"   --> Total Salt Mass in Tank B:     {tb['total_tank_b_mass_kg']:>8.2f} kg")

    print("\n💰 FINANCIAL & FERTILIZER COST SAVINGS AUDIT:")
    ec = res['economics']
    print(f"   Standard Uncorrected Fertilizer Cost: ₩{ec['cost_uncorrected_krw']:,} ($ {ec['cost_uncorrected_krw']/1360:.2f})")
    print(f"   Optimized Ground-Corrected Cost:      ₩{ec['cost_corrected_krw']:,} ($ {ec['cost_corrected_usd']})")
    print(f"   Direct Cash Savings per Batch:        ₩{ec['monthly_savings_krw']:,} ({ec['savings_percentage']}% COST REDUCTION)")
    print("=" * 78)


def main():
    parser = argparse.ArgumentParser(description="Precision Hydroponic Groundwater Nutrient Formulator")
    parser.add_argument('--crop', type=str, default='strawberry_fruiting',
                        choices=list(CROP_DATABASE.keys()),
                        help="Crop target formulation key")
    parser.add_argument('--tank-volume', type=float, default=1000.0,
                        help="Volume of Stock Tank A & B in Liters (default: 1000L)")
    parser.add_argument('--injection-ratio', type=float, default=100.0,
                        help="Dilution factor (default: 100 for 1:100 stock concentration)")
    parser.add_argument('--raw-ca', type=float, default=45.0, help="Raw water Calcium (mg/L)")
    parser.add_argument('--raw-mg', type=float, default=12.0, help="Raw water Magnesium (mg/L)")
    parser.add_argument('--raw-k', type=float, default=4.0, help="Raw water Potassium (mg/L)")
    parser.add_argument('--raw-no3', type=float, default=10.0, help="Raw water Nitrate (mg/L)")
    parser.add_argument('--raw-so4', type=float, default=25.0, help="Raw water Sulfate (mg/L)")
    parser.add_argument('--raw-hco3', type=float, default=120.0, help="Raw water Bicarbonate (mg/L)")
    parser.add_argument('--raw-na', type=float, default=15.0, help="Raw water Sodium (mg/L)")
    parser.add_argument('--raw-cl', type=float, default=20.0, help="Raw water Chloride (mg/L)")
    parser.add_argument('--format', type=str, choices=['table', 'json'], default='table',
                        help="Output format: table or json")

    args = parser.parse_args()

    raw_water = {
        'ca': args.raw_ca,
        'mg': args.raw_mg,
        'k': args.raw_k,
        'no3': args.raw_no3,
        'so4': args.raw_so4,
        'hco3': args.raw_hco3,
        'na': args.raw_na,
        'cl': args.raw_cl,
    }

    try:
        results = calculate_nutrient_solution(
            crop_key=args.crop,
            raw_water=raw_water,
            tank_volume_l=args.tank_volume,
            dilution_ratio=args.injection_ratio
        )
        if args.format == 'json':
            print(json.dumps(results, indent=2))
        else:
            print_formatted_table(results)
    except Exception as e:
        print(f"Error during calculation: {e}", file=sys.stderr)
        sys.exit(1)


if __name__ == '__main__':
    main()
