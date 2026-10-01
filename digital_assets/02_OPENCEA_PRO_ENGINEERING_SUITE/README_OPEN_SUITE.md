# 🚀 OpenCEA™ Pro Engineering Excel & Python Sizing Suite
> **Product ID**: `INW-OPENCEA-PRO-SUITE` | **License**: Commercial Professional License  
> **Author**: Inwoovation Lab Computational Agronomy & Biophysics Team  
> **Version**: 2026.10 Enterprise Release  
> **Runtime**: Python 3.9+ (Zero third-party dependencies required, pure Python standard library `math`, `json`, `sys`, `csv`)  

---

## 📦 Suite File Inventory

| Script / Tool File | Engineering Purpose | Standard / Method |
| :--- | :--- | :--- |
| `mollier_psychrometric_solver.py` | 5-Point Psychrometric Enthalpy Cycle & Evaporative Fogging | ASHRAE Fundamentals / Magnus-Tetens |
| `three_way_valve_kv_sizing.py` | 3-Way Motorized Heating Valve Kv, Authority $P_v$, & Buffer Tank | DIN EN 14336 & VDI 2073 |
| `biomass_chp_energy_balance.py` | Woodchip Pyrolysis Syngas Yield, Tar Cracking & Mass-Energy Balance | ASME PTC 46 / DIN EN 12952 |
| `semi_closed_atu_duct_sizing.py` | Perforated PE Air Duct Static Regain & Orifice Hole Spacing | VDI 2087 & Static Regain Method |

---

## ⚡ Execution Instructions

All scripts in this suite are engineered as **Deep Modules** with zero external pip dependencies. You can run them directly in any Python environment:

```bash
# 1. Run 5-point Mollier Psychrometric Analysis:
python mollier_psychrometric_solver.py --tout 34.0 --rhout 40.0 --tcanopy 26.0 --rhcanopy 75.0 --damper 35.0

# 2. Run 3-Way Mixing Valve & Buffer Tank Sizing:
python three_way_valve_kv_sizing.py --kw 850 --delta_t 20.0 --buffer_hrs 4.0

# 3. Run Biomass CHP Syngas & Energy Balance:
python biomass_chp_energy_balance.py --biomass_kg_h 450 --moisture 22.0

# 4. Run Semi-Closed Under-Gutter Air Duct Static Regain:
python semi_closed_atu_duct_sizing.py --airflow_m3_h 65000 --duct_dia 0.75 --duct_len 80
```

All tools support `--json` output flags for direct integration into commercial SCADA, Grafana dashboards, or automated PLC controllers.
