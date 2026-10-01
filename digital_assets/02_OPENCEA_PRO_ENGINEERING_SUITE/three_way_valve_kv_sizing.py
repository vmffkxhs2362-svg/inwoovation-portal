#!/usr/bin/env python3
"""
3-Way Motorized Mixing Valve Kv Sizing & Thermal Buffer Storage Solver
----------------------------------------------------------------------
Calculates:
1. Design hot water flow rate V_dot (m3/h)
2. Required Kv / Kvs flow coefficient for 3-way motorized mixing valve
3. Valve authority (Ventilautoritaet) P_v (Target: 0.35 - 0.50)
4. Buffer storage volume (VDI 2073) and stratification thermocline stability
"""

import math
import sys
import json
import argparse

def size_mixing_valve(heat_kw=850.0, t_supply=85.0, t_return=65.0, 
                      delta_p_circuit_kpa=35.0, buffer_hours=4.0):
    delta_T = max(1.0, t_supply - t_return)
    rho_c = 4186.0 # J / (kg * K)
    
    # 1. Flow Rate (m3/h)
    # Q = m_dot * c_p * delta_T => V_dot = Q / (rho * c_p * delta_T)
    # Q in Watts = heat_kw * 1000
    flow_m3_s = (heat_kw * 1000.0) / (1000.0 * 4186.0 * delta_T)
    flow_m3_h = flow_m3_s * 3600.0
    
    # 2. Optimal Valve Authority P_v = Delta_P_valve / (Delta_P_valve + Delta_P_circuit)
    # For linear / equal-percentage control, design P_v ≈ 0.40 - 0.50
    target_pv = 0.45
    delta_p_valve_kpa = (target_pv * delta_p_circuit_kpa) / (1.0 - target_pv)
    delta_p_valve_bar = delta_p_valve_kpa / 100.0
    
    # 3. Required Kv = V_dot / sqrt(Delta_P_bar)
    kv_required = flow_m3_h / math.sqrt(max(0.01, delta_p_valve_bar))
    
    # Standard Kvs series (DIN EN 60534): 1.0, 1.6, 2.5, 4.0, 6.3, 10, 16, 25, 40, 63, 100, 160, 250, 400
    KVS_SERIES = [1.0, 1.6, 2.5, 4.0, 6.3, 10, 16, 25, 40, 63, 100, 160, 250, 400]
    selected_kvs = next((k for k in KVS_SERIES if k >= kv_required), KVS_SERIES[-1])
    
    # Re-calculate actual pressure drop and authority with selected Kvs
    actual_delta_p_bar = (flow_m3_h / selected_kvs) ** 2
    actual_delta_p_kpa = actual_delta_p_bar * 100.0
    actual_pv = actual_delta_p_kpa / (actual_delta_p_kpa + delta_p_circuit_kpa)
    
    # 4. Thermal Buffer Tank Volume (VDI 2073)
    # Energy required = heat_kw * buffer_hours * 3600 kJ
    # Tank Volume = Energy / (rho * c_p * (T_top - T_bottom))
    t_buffer_top = 90.0
    t_buffer_bottom = 40.0
    delta_t_buffer = t_buffer_top - t_buffer_bottom
    buffer_vol_m3 = (heat_kw * buffer_hours * 3600.0) / (4186.0 * delta_t_buffer)
    
    return {
        "Design_Heating_Capacity_kW": heat_kw,
        "Supply_Return_Delta_T_K": delta_T,
        "Calculated_Flow_Rate_m3_h": round(flow_m3_h, 2),
        "Calculated_Kv_Required": round(kv_required, 2),
        "Selected_Standard_Kvs": selected_kvs,
        "Actual_Valve_Pressure_Drop_kPa": round(actual_delta_p_kpa, 2),
        "Actual_Valve_Authority_Pv": round(actual_pv, 3),
        "Authority_Status": "EXCELLENT (0.35 - 0.55)" if 0.35 <= actual_pv <= 0.55 else ("ACCEPTABLE" if 0.25 <= actual_pv <= 0.65 else "WARNING: AUTHORITY DEGRADED"),
        "Buffer_Storage_Hours": buffer_hours,
        "Recommended_Buffer_Tank_Volume_m3": round(buffer_vol_m3, 1),
        "Buffer_Thermal_Capacity_kWh": round(heat_kw * buffer_hours, 1)
    }

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="3-Way Motorized Valve & Buffer Tank Sizing")
    parser.add_argument("--kw", type=float, default=850.0, help="Heating loop thermal capacity (kW)")
    parser.add_argument("--tsupply", type=float, default=85.0, help="Supply hot water temperature (°C)")
    parser.add_argument("--treturn", type=float, default=65.0, help="Return water temperature (°C)")
    parser.add_argument("--dpcircuit", type=float, default=35.0, help="Circuit pipe pressure drop (kPa)")
    parser.add_argument("--buffer_hrs", type=float, default=4.0, help="Desired buffer storage runtime (hours)")
    parser.add_argument("--json", action="store_true", help="Output raw JSON")
    
    args = parser.parse_args()
    results = size_mixing_valve(args.kw, args.tsupply, args.treturn, args.dpcircuit, args.buffer_hrs)
    
    if args.json:
        print(json.dumps(results, indent=2))
    else:
        print("=" * 65)
        print("⚙️  OPENCEA PRO: 3-WAY MIXING VALVE & BUFFER SIZING RESULTS")
        print("=" * 65)
        for k, v in results.items():
            print(f"  • {k.replace('_', ' ')}: {v}")
        print("=" * 65)
