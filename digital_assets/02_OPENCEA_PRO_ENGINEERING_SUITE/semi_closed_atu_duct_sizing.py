#!/usr/bin/env python3
"""
Semi-Closed Greenhouse Under-Gutter Air Duct & Static Regain Sizing
-------------------------------------------------------------------
Calculates:
1. In-duct air velocity profile v(x) and dynamic velocity pressure
2. Static regain (Druckrueckgewinn) across perforated polyethylene (PE) ducts
3. Orifice hole spacing and discharge jet velocity (4 - 8 m/s boundary layer decoupling)
4. Overall positive pressure delta (+15 to +30 Pa) for mechanical pest barrier
"""

import math
import sys
import json
import argparse

def size_perforated_duct(airflow_m3_h=65000.0, duct_dia_m=0.75, duct_len_m=80.0,
                         target_pressure_pa=22.0, hole_dia_mm=50.0):
    rho = 1.204 # kg/m3 dry air @ 20°C
    v_dot = airflow_m3_h / 3600.0 # m3/s
    
    # 1. Duct Cross-Sectional Geometry
    area_duct = math.pi * ((duct_dia_m / 2.0) ** 2)
    v_inlet = v_dot / area_duct # m/s
    
    # Dynamic velocity pressure at inlet: P_dyn = 0.5 * rho * v^2
    p_dyn_inlet = 0.5 * rho * (v_inlet ** 2)
    
    # 2. Static Regain Method (VDI 2087)
    # Regain coefficient R ≈ 0.75 (due to friction loss compensation)
    # As air discharges along length, velocity decreases, converting velocity pressure to static pressure.
    v_terminal = 2.5 # m/s designed residual end velocity
    p_dyn_terminal = 0.5 * rho * (v_terminal ** 2)
    delta_p_static_regain = 0.75 * (p_dyn_inlet - p_dyn_terminal)
    
    # 3. Orifice Hole Sizing
    # Orifice discharge equation: Q_hole = C_d * A_hole * sqrt(2 * P_static / rho)
    c_d = 0.62 # sharp-edged circular orifice discharge coefficient
    area_single_hole = math.pi * (((hole_dia_mm / 1000.0) / 2.0) ** 2)
    v_jet = c_d * math.sqrt((2.0 * target_pressure_pa) / rho)
    q_single_hole = area_single_hole * v_jet # m3/s
    
    # Total holes required along length
    total_holes_required = int(math.ceil(v_dot / q_single_hole))
    holes_per_meter = total_holes_required / duct_len_m
    hole_pitch_cm = (1.0 / holes_per_meter) * 100.0 if holes_per_meter > 0 else 0.0
    
    # 4. Greenhouse Positive Pressure & Pest Exclusion Barrier
    # P_inside = target_pressure_pa. 
    # Counter-wind velocity withstood before reverse infiltration: v_wind = sqrt(2 * Delta_P / rho)
    max_wind_defense_m_s = math.sqrt((2.0 * target_pressure_pa) / rho)
    max_wind_defense_km_h = max_wind_defense_m_s * 3.6
    
    return {
        "Total_Airflow_Rate_m3_h": airflow_m3_h,
        "Duct_Diameter_mm": round(duct_dia_m * 1000.0, 0),
        "Duct_Length_m": duct_len_m,
        "Inlet_Air_Velocity_m_s": round(v_inlet, 2),
        "Inlet_Dynamic_Pressure_Pa": round(p_dyn_inlet, 1),
        "Static_Regain_Pressure_Lift_Pa": round(delta_p_static_regain, 1),
        "Greenhouse_Target_Positive_Pressure_Pa": target_pressure_pa,
        "Orifice_Discharge_Jet_Velocity_m_s": round(v_jet, 2),
        "Total_Perforated_Holes_Required": total_holes_required,
        "Hole_Spacing_Pitch_cm": round(hole_pitch_cm, 1),
        "Pest_Exclusion_Max_Counter_Wind_m_s": round(max_wind_defense_m_s, 2),
        "Pest_Exclusion_Max_Counter_Wind_km_h": round(max_wind_defense_km_h, 1),
        "Boundary_Layer_Decoupling_Status": "OPTIMAL (4.0 - 8.0 m/s jet)" if 4.0 <= v_jet <= 8.5 else "SUB-OPTIMAL"
    }

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Semi-Closed Greenhouse Under-Gutter Air Duct Sizing")
    parser.add_argument("--airflow_m3_h", type=float, default=65000.0, help="Fan airflow rate (m3/h)")
    parser.add_argument("--duct_dia", type=float, default=0.75, help="Duct diameter in meters (e.g. 0.60, 0.75, 0.90)")
    parser.add_argument("--duct_len", type=float, default=80.0, help="Duct length in meters (e.g. 60, 80, 100)")
    parser.add_argument("--target_pressure", type=float, default=22.0, help="Target positive greenhouse pressure (Pa)")
    parser.add_argument("--hole_dia_mm", type=float, default=50.0, help="Orifice perforation diameter (mm)")
    parser.add_argument("--json", action="store_true", help="Output raw JSON")
    
    args = parser.parse_args()
    results = size_perforated_duct(args.airflow_m3_h, args.duct_dia, args.duct_len, args.target_pressure, args.hole_dia_mm)
    
    if args.json:
        print(json.dumps(results, indent=2))
    else:
        print("=" * 65)
        print("💨 OPENCEA PRO: UNDER-GUTTER AIR DUCT & STATIC REGAIN SIZING")
        print("=" * 65)
        for k, v in results.items():
            print(f"  • {k.replace('_', ' ')}: {v}")
        print("=" * 65)
