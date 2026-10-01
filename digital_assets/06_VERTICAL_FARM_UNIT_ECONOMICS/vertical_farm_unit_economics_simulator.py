#!/usr/bin/env python3
"""
Commercial Vertical Farm Unit Economics & CapEx/OpEx Simulation Engine
---------------------------------------------------------------------
Author: Inwoovation Horticultural Engineering
License: Commercial Closed-Source Digital Asset
Runtime: Python 3.9+ (Zero External Dependencies)

Simulates the complete thermodynamic heat dissipation, power consumption,
crop biomass yield, operational costs (OpEx), Cost of Goods Sold (COGS) per kg,
break-even price, and CapEx payback horizon for indoor vertical plant factories.
"""

import argparse
import json
import math
import sys


def simulate_vertical_farm(
    footprint_pyeong=100.0,
    rack_tiers=5,
    utilization_ratio=0.65,
    ppfd=220.0,
    led_ppe=2.8,
    photoperiod_hours=16.0,
    crop_cycle_days=32.0,
    head_weight_g=150.0,
    plant_density_m2=28.0,
    power_tariff_krw=70.0,
    wholesale_price_krw=16000.0,
    capex_total_krw=380000000.0,
    labor_headcount=2.5,
    monthly_wage_krw=2800000.0
):
    """
    Computes mass and energy balances, unit economics, and investment payback.
    """
    floor_area_m2 = footprint_pyeong * 3.305785
    canopy_per_tier_m2 = floor_area_m2 * utilization_ratio
    total_canopy_m2 = canopy_per_tier_m2 * rack_tiers

    # 1. Biological Biomass Production
    standing_plants_capacity = total_canopy_m2 * plant_density_m2
    # Continuous rotation yield per day and month
    harvests_per_year = 365.0 / crop_cycle_days
    annual_heads_harvested = standing_plants_capacity * harvests_per_year
    monthly_heads_harvested = annual_heads_harvested / 12.0
    monthly_biomass_kg = (monthly_heads_harvested * head_weight_g) / 1000.0
    daily_biomass_kg = monthly_biomass_kg / 30.0

    # 2. Electrical LED Energy Balance
    # LED Watts per m2 = (PPFD / PPE)
    led_watts_per_m2 = ppfd / led_ppe
    total_led_kw = (led_watts_per_m2 * total_canopy_m2) / 1000.0
    monthly_led_kwh = total_led_kw * photoperiod_hours * 30.0

    # 3. HVAC Thermal Cooling & Dehumidification Load
    # 100% of LED power converts to heat (Sensible + Latent from crop transpiration)
    # Transpiration rate approx 3.0 L/m2/day
    daily_water_transpired_liters = total_canopy_m2 * 3.0
    latent_heat_kw = (daily_water_transpired_liters * 2454.0) / 86400.0 # Latent kW
    sensible_heat_kw = total_led_kw - latent_heat_kw
    total_cooling_load_kw = total_led_kw + 8.0 # +8 kW for pumps, fans, ballasts

    # Required Chiller Compressor Power at COP 3.4
    hvac_cop = 3.4
    total_hvac_kw = total_cooling_load_kw / hvac_cop
    # HVAC runs full power during lights-on, lower during lights-off
    monthly_hvac_kwh = (total_hvac_kw * photoperiod_hours + (total_hvac_kw * 0.35) * (24.0 - photoperiod_hours)) * 30.0

    # Ancillary loads (Aeration pumps, controls, lighting in prep rooms)
    monthly_aux_kwh = 1200.0

    # Total Electricity Cost
    total_monthly_kwh = monthly_led_kwh + monthly_hvac_kwh + monthly_aux_kwh
    monthly_power_cost_krw = total_monthly_kwh * power_tariff_krw

    # 4. Consumables & Input Costs
    # Seeds & 200-cell sponge/rockwool plugs: ₩35 per plant
    monthly_seeds_plugs_krw = monthly_heads_harvested * 35.0
    # Custom raw fertilizer salts (from Suite 04): ₩350 per kg produced
    monthly_fertilizer_krw = monthly_biomass_kg * 350.0
    # MAP Packaging Bags & Cartons: ₩120 per 150g head
    monthly_packaging_krw = monthly_heads_harvested * 120.0
    # Water & Disinfection sanitation: ₩150,000 / month
    monthly_water_sanitation_krw = 150000.0

    total_consumables_krw = (
        monthly_seeds_plugs_krw +
        monthly_fertilizer_krw +
        monthly_packaging_krw +
        monthly_water_sanitation_krw
    )

    # 5. Labor & Overhead
    monthly_labor_cost_krw = labor_headcount * monthly_wage_krw
    monthly_rent_insurance_krw = footprint_pyeong * 18000.0 # ₩18,000 / pyeong rent/insurance

    # 6. Straight-Line Equipment Depreciation (10-Year Horizon)
    monthly_depreciation_krw = capex_total_krw / (10.0 * 12.0)

    # 7. Total Operating Expenses (OpEx) & COGS
    total_monthly_opex_cash_krw = (
        monthly_power_cost_krw +
        total_consumables_krw +
        monthly_labor_cost_krw +
        monthly_rent_insurance_krw
    )
    total_monthly_cost_with_deprec_krw = total_monthly_opex_cash_krw + monthly_depreciation_krw

    # Unit Production Cost (COGS)
    cogs_per_kg_krw = total_monthly_cost_with_deprec_krw / monthly_biomass_kg
    cogs_per_100g_bag_krw = cogs_per_kg_krw * 0.10
    cogs_cash_only_per_kg_krw = total_monthly_opex_cash_krw / monthly_biomass_kg

    # 8. Revenue & Investment Payback
    monthly_gross_revenue_krw = monthly_biomass_kg * wholesale_price_krw
    monthly_ebitda_krw = monthly_gross_revenue_krw - total_monthly_opex_cash_krw
    monthly_net_profit_krw = monthly_gross_revenue_krw - total_monthly_cost_with_deprec_krw
    annual_net_profit_krw = monthly_net_profit_krw * 12.0

    net_margin_percent = (monthly_net_profit_krw / monthly_gross_revenue_krw) * 100.0
    breakeven_price_per_kg_krw = cogs_per_kg_krw

    if annual_net_profit_krw > 0:
        payback_period_years = capex_total_krw / annual_net_profit_krw
    else:
        payback_period_years = float('inf')

    return {
        'facility_metrics': {
            'footprint_pyeong': footprint_pyeong,
            'floor_area_m2': round(floor_area_m2, 1),
            'rack_tiers': rack_tiers,
            'total_canopy_m2': round(total_canopy_m2, 1),
            'standing_plants_capacity': round(standing_plants_capacity, 0),
        },
        'production_yield': {
            'monthly_heads_harvested': round(monthly_heads_harvested, 0),
            'monthly_biomass_kg': round(monthly_biomass_kg, 1),
            'daily_biomass_kg': round(daily_biomass_kg, 1),
        },
        'energy_and_hvac': {
            'led_connected_kw': round(total_led_kw, 1),
            'monthly_led_kwh': round(monthly_led_kwh, 0),
            'hvac_cooling_load_kw': round(total_cooling_load_kw, 1),
            'monthly_hvac_kwh': round(monthly_hvac_kwh, 0),
            'total_monthly_kwh': round(total_monthly_kwh, 0),
            'monthly_power_cost_krw': round(monthly_power_cost_krw, 0),
            'power_cost_share_pct': round((monthly_power_cost_krw / total_monthly_cost_with_deprec_krw) * 100.0, 1),
        },
        'monthly_opex_breakdown_krw': {
            'electricity': round(monthly_power_cost_krw, 0),
            'labor': round(monthly_labor_cost_krw, 0),
            'consumables': round(total_consumables_krw, 0),
            'rent_and_insurance': round(monthly_rent_insurance_krw, 0),
            'equipment_depreciation_10yr': round(monthly_depreciation_krw, 0),
            'total_monthly_cost': round(total_monthly_cost_with_deprec_krw, 0),
        },
        'unit_economics': {
            'cogs_per_kg_krw': round(cogs_per_kg_krw, 0),
            'cogs_per_100g_pack_krw': round(cogs_per_100g_bag_krw, 0),
            'cogs_cash_only_per_kg_krw': round(cogs_cash_only_per_kg_krw, 0),
            'breakeven_price_per_kg_krw': round(breakeven_price_per_kg_krw, 0),
            'breakeven_price_per_kg_usd': round(breakeven_price_per_kg_krw / 1360.0, 2),
        },
        'financial_returns': {
            'monthly_gross_revenue_krw': round(monthly_gross_revenue_krw, 0),
            'monthly_ebitda_krw': round(monthly_ebitda_krw, 0),
            'monthly_net_profit_krw': round(monthly_net_profit_krw, 0),
            'annual_net_profit_krw': round(annual_net_profit_krw, 0),
            'net_profit_margin_pct': round(net_margin_percent, 1),
            'total_capex_krw': round(capex_total_krw, 0),
            'payback_period_years': round(payback_period_years, 2) if payback_period_years != float('inf') else "UNPROFITABLE",
        }
    }


def print_formatted_table(res):
    print("=" * 78)
    print("🏢 INWOOVATION COMMERCIAL VERTICAL FARM UNIT ECONOMICS & COGS REPORT")
    print(f"   Facility: {res['facility_metrics']['footprint_pyeong']} pyeong ({res['facility_metrics']['floor_area_m2']} m2) | {res['facility_metrics']['rack_tiers']} Tiers")
    print(f"   Active Canopy Area: {res['facility_metrics']['total_canopy_m2']} m2 | Capacity: {res['facility_metrics']['standing_plants_capacity']:,} plants")
    print("=" * 78)

    py = res['production_yield']
    print("\n🥗 MONTHLY BIOMASS PRODUCTION & HARVEST YIELD:")
    print(f"   - Finished Heads Harvested:       {py['monthly_heads_harvested']:>10,} heads / month")
    print(f"   - Total Fresh Biomass Yield:      {py['monthly_biomass_kg']:>10,} kg / month ({py['daily_biomass_kg']} kg/day)")

    en = res['energy_and_hvac']
    print("\n⚡ THERMODYNAMIC HVAC & ELECTRICAL POWER BALANCE:")
    print(f"   - Connected LED Fixture Load:     {en['led_connected_kw']:>10.1f} kW ({en['monthly_led_kwh']:,} kWh/mo)")
    print(f"   - Total Thermal Cooling Load:     {en['hvac_cooling_load_kw']:>10.1f} kW ({en['monthly_hvac_kwh']:,} kWh/mo)")
    print(f"   - Total Facility Power Draw:      {en['total_monthly_kwh']:>10,} kWh / month")
    print(f"   - Monthly Electricity Bill:       ₩{en['monthly_power_cost_krw']:>10,} ({en['power_cost_share_pct']}% of total OpEx)")

    ox = res['monthly_opex_breakdown_krw']
    print("\n📊 MONTHLY OPERATIONAL EXPENDITURE (OPEX) BREAKDOWN:")
    print(f"   1. Electricity (LEDs + HVAC):     ₩{ox['electricity']:>12,}")
    print(f"   2. Direct Farm Labor:             ₩{ox['labor']:>12,}")
    print(f"   3. Seeds, Plugs & Fertilizers:    ₩{ox['consumables']:>12,}")
    print(f"   4. Space Rent & Insurance:        ₩{ox['rent_and_insurance']:>12,}")
    print(f"   5. 10-Year Equipment Deprec:      ₩{ox['equipment_depreciation_10yr']:>12,}")
    print(f"   -------------------------------------------------------------------")
    print(f"   >>> TOTAL MONTHLY FULL COST:      ₩{ox['total_monthly_cost']:>12,}")

    ue = res['unit_economics']
    fr = res['financial_returns']
    print("\n🏷️  UNIT COST OF GOODS SOLD (COGS) & PROFITABILITY:")
    print(f"   ⭐ Full Production Cost per 1 kg:  ₩{ue['cogs_per_kg_krw']:,} / kg ($ {ue['breakeven_price_per_kg_usd']} / kg)")
    print(f"   ⭐ Cost per 100g Retail Pack:      ₩{ue['cogs_per_100g_pack_krw']:,} / 100g")
    print(f"   - Cash-Only Cost (excl Deprec):   ₩{ue['cogs_cash_only_per_kg_krw']:,} / kg")
    print(f"   - Minimum Break-Even Price:       ₩{ue['breakeven_price_per_kg_krw']:,} / kg")
    print(f"   -------------------------------------------------------------------")
    print(f"   Monthly Gross Wholesale Revenue:  ₩{fr['monthly_gross_revenue_krw']:,}")
    print(f"   Monthly EBITDA:                   ₩{fr['monthly_ebitda_krw']:,}")
    print(f"   Monthly Net Operating Profit:     ₩{fr['monthly_net_profit_krw']:,} (Net Margin: {fr['net_profit_margin_pct']}%)")
    print(f"   ⭐ Initial CapEx Payback Horizon:  {fr['payback_period_years']} Years (CapEx: ₩{fr['total_capex_krw']:,})")
    print("=" * 78)


def main():
    parser = argparse.ArgumentParser(description="Commercial Vertical Farm Unit Economics & Sizing Engine")
    parser.add_argument('--area', type=float, default=100.0, help="Floor footprint in Pyeong (default: 100)")
    parser.add_argument('--tiers', type=int, default=5, help="Number of vertical rack tiers (default: 5)")
    parser.add_argument('--ppe', type=float, default=2.8, help="LED Photosynthetic Efficacy in umol/J (default: 2.8)")
    parser.add_argument('--ppfd', type=float, default=220.0, help="Target PPFD in umol/m2/s (default: 220)")
    parser.add_argument('--photoperiod', type=float, default=16.0, help="Photoperiod hours/day (default: 16)")
    parser.add_argument('--power-tariff', type=float, default=70.0, help="Electricity cost in KRW/kWh (default: 70)")
    parser.add_argument('--wholesale-price', type=float, default=16000.0, help="Wholesale selling price KRW/kg (default: 16000)")
    parser.add_argument('--capex', type=float, default=380000000.0, help="Total turnkey CapEx investment in KRW (default: 3.8억)")
    parser.add_argument('--labor-count', type=float, default=2.5, help="Full-time labor equivalent (default: 2.5)")
    parser.add_argument('--format', type=str, choices=['table', 'json'], default='table', help="Output format: table or json")

    args = parser.parse_args()

    try:
        results = simulate_vertical_farm(
            footprint_pyeong=args.area,
            rack_tiers=args.tiers,
            ppfd=args.ppfd,
            led_ppe=args.ppe,
            photoperiod_hours=args.photoperiod,
            power_tariff_krw=args.power_tariff,
            wholesale_price_krw=args.wholesale_price,
            capex_total_krw=args.capex,
            labor_headcount=args.labor_count
        )
        if args.format == 'json':
            print(json.dumps(results, indent=2))
        else:
            print_formatted_table(results)
    except Exception as e:
        print(f"Simulation error: {e}", file=sys.stderr)
        sys.exit(1)


if __name__ == '__main__':
    main()
