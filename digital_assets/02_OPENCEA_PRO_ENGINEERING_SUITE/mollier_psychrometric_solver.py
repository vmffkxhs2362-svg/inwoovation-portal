#!/usr/bin/env python3
"""
Mollier Psychrometric 5-Point Cycle Solver (mollier_psychrometric_solver.py)
---------------------------------------------------------------------------
Calculates the 5-point thermodynamic air treatment cycle for semi-closed greenhouses:
State 1: Outdoor ambient air
State 2: Canopy return air
State 3: Mixed air in corridor plenum
State 4: Adiabatic high-pressure fog cooling
State 5: Supply air discharge (heating/cooling coil adjusted)
"""

import math
import sys
import json
import argparse

def sat_vapor_pressure(T_celsius):
    """Calculates saturation vapor pressure (kPa) via Magnus-Tetens formula."""
    return 0.61078 * math.exp((17.27 * T_celsius) / (T_celsius + 237.3))

def humidity_ratio(T_celsius, rh_percent, P_atm=101.325):
    """Calculates humidity ratio x (kg water / kg dry air)."""
    es = sat_vapor_pressure(T_celsius)
    e = (rh_percent / 100.0) * es
    return 0.62198 * e / max(0.01, (P_atm - e))

def specific_enthalpy(T_celsius, x_kg):
    """Calculates specific enthalpy h (kJ / kg dry air)."""
    return 1.006 * T_celsius + x_kg * (2501.0 + 1.86 * T_celsius)

def temp_from_enthalpy_and_x(h, x_kg):
    """Solves temperature T from enthalpy h and humidity ratio x."""
    return (h - 2501.0 * x_kg) / (1.006 + 1.86 * x_kg)

def rh_from_temp_and_x(T_celsius, x_kg, P_atm=101.325):
    """Calculates relative humidity RH (%) from T and x."""
    e = (x_kg * P_atm) / (0.62198 + x_kg)
    es = sat_vapor_pressure(T_celsius)
    return min(100.0, max(0.0, (e / es) * 100.0))

def solve_5_point_cycle(t_out=32.0, rh_out=45.0, t_canopy=26.0, rh_canopy=75.0,
                        damper_pct=40.0, fog_pct=70.0, coil_pct=-30.0):
    alpha = damper_pct / 100.0
    
    # State 1: Outdoor
    x1 = humidity_ratio(t_out, rh_out)
    h1 = specific_enthalpy(t_out, x1)
    
    # State 2: Canopy Return
    x2 = humidity_ratio(t_canopy, rh_canopy)
    h2 = specific_enthalpy(t_canopy, x2)
    
    # State 3: Mixed Air
    t3 = alpha * t_out + (1.0 - alpha) * t_canopy
    x3 = alpha * x1 + (1.0 - alpha) * x2
    h3 = specific_enthalpy(t3, x3)
    rh3 = rh_from_temp_and_x(t3, x3)
    
    # State 4: Adiabatic Fog Cooling (Isenthalpic: h4 ≈ h3)
    x_sat = humidity_ratio(t3, 100.0)
    delta_x_max = max(0.0, x_sat - x3)
    delta_x_actual = delta_x_max * (fog_pct / 100.0)
    x4 = x3 + delta_x_actual
    h4 = h3
    t4 = temp_from_enthalpy_and_x(h4, x4)
    rh4 = rh_from_temp_and_x(t4, x4)
    
    # State 5: Supply Air (Heat exchange coil)
    # coil_pct: negative = cooling, positive = heating
    delta_t_coil = (coil_pct / 100.0) * 8.0 # up to 8 deg C lift/drop
    t5 = max(5.0, t4 + delta_t_coil)
    x5 = x4
    h5 = specific_enthalpy(t5, x5)
    rh5 = rh_from_temp_and_x(t5, x5)
    
    return {
        "State_1_Outdoor": {"T_degC": round(t_out, 2), "RH_pct": round(rh_out, 1), "x_g_kg": round(x1 * 1000, 2), "h_kJ_kg": round(h1, 2)},
        "State_2_Return": {"T_degC": round(t_canopy, 2), "RH_pct": round(rh_canopy, 1), "x_g_kg": round(x2 * 1000, 2), "h_kJ_kg": round(h2, 2)},
        "State_3_Mixed": {"T_degC": round(t3, 2), "RH_pct": round(rh3, 1), "x_g_kg": round(x3 * 1000, 2), "h_kJ_kg": round(h3, 2)},
        "State_4_Fogged": {"T_degC": round(t4, 2), "RH_pct": round(rh4, 1), "x_g_kg": round(x4 * 1000, 2), "h_kJ_kg": round(h4, 2)},
        "State_5_Supply": {"T_degC": round(t5, 2), "RH_pct": round(rh5, 1), "x_g_kg": round(x5 * 1000, 2), "h_kJ_kg": round(h5, 2)},
        "Delta_T_Cooling": round(t_out - t5, 2),
        "Moisture_Addition_g_kg": round((x5 - x3) * 1000, 2)
    }

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Mollier 5-Point Psychrometric Cycle Solver")
    parser.add_argument("--tout", type=float, default=32.0, help="Outdoor dry-bulb temperature (°C)")
    parser.add_argument("--rhout", type=float, default=45.0, help="Outdoor relative humidity (%)")
    parser.add_argument("--tcanopy", type=float, default=26.0, help="Greenhouse canopy air temp (°C)")
    parser.add_argument("--rhcanopy", type=float, default=75.0, help="Greenhouse canopy relative humidity (%)")
    parser.add_argument("--damper", type=float, default=40.0, help="Outdoor air damper opening (%)")
    parser.add_argument("--fog", type=float, default=70.0, help="High-pressure fog capacity (%)")
    parser.add_argument("--coil", type=float, default=-30.0, help="Coil capacity -100 (cooling) to +100 (heating)")
    parser.add_argument("--json", action="store_true", help="Output raw JSON")
    
    args = parser.parse_args()
    results = solve_5_point_cycle(args.tout, args.rhout, args.tcanopy, args.rhcanopy, args.damper, args.fog, args.coil)
    
    if args.json:
        print(json.dumps(results, indent=2))
    else:
        print("=" * 65)
        print("🌱 OPENCEA PRO: MOLLIER 5-POINT PSYCHROMETRIC CYCLE RESULTS")
        print("=" * 65)
        for state, data in results.items():
            if isinstance(data, dict):
                print(f"[{state.replace('_', ' ')}]: T={data['T_degC']:5.2f} °C | RH={data['RH_pct']:5.1f} % | x={data['x_g_kg']:5.2f} g/kg | h={data['h_kJ_kg']:5.2f} kJ/kg")
            else:
                print(f"  • {state}: {data}")
        print("=" * 65)
