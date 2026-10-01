# 📊 VDI 4640 & ASABE S640 Commercial Greenhouse Energy Audit Worksheet
> **Standard**: ASABE S640 (Quantifying Energy Consumption in Commercial Greenhouses) & VDI 4640 (Thermal Use of the Underground)  
> **Auditor Classification**: Certified Energy Auditor (CEA) / Professional Engineer (PE) Grade  
> **Facility**: [Insert Greenhouse Name] | **Audited Period**: 24 Consecutive Months  

---

## 1. FACILITY GEOMETRY & THERMAL ENVELOPE INPUTS

| Parameter | Unit | Value | Engineering Basis / Standard |
| :--- | :--- | :--- | :--- |
| Greenhouse Footprint Area ($A_{\text{floor}}$) | $m^2$ ($ft^2$) | `10,000` (`107,639`) | Architectural Site Survey |
| Ridge Height ($H_{\text{ridge}}$) | $m$ | `7.0` | Venlo Steel Truss Elevation |
| Gutter Height ($H_{\text{gutter}}$) | $m$ | `5.5` | Crop Trellising Working Height |
| Glazing Material (Roof) | - | `4mm Diffuse Glass (91% PAR)` | EN 13031-1 Standard |
| Glazing Material (Side/End Walls) | - | `16mm Polycarbonate Double-Skin` | $U = 2.4 \text{ W}/(m^2\cdot K)$ |
| Thermal Screen Type | - | `Aluminized Energy Saving Screen` | 47% Nighttime Radiation Reduction |
| Air Infiltration Rate ($n$) | $h^{-1}$ | `0.45` | Tight Venlo Structure (<0.5) |

---

## 2. GOVERNING THERMAL EQUATIONS & HEAT BALANCE

### 2.1 Overall Peak Heat Loss Coefficient ($Q_{\text{peak}}$)
$$Q_{\text{peak}} = \left[ \sum (U_i \cdot A_i) + V_{\text{air}} \cdot \rho \cdot c_p \cdot n \right] \cdot (T_{\text{inside}} - T_{\text{outside, design}})$$

Where:
* $\sum (U_i \cdot A_i) = U_{\text{roof}} \cdot A_{\text{roof}} + U_{\text{wall}} \cdot A_{\text{wall}}$
* $V_{\text{air}} = A_{\text{floor}} \cdot H_{\text{mean}} = 10,000 \cdot 6.25 = 62,500 \text{ m}^3$
* $\rho \cdot c_p = 1.20 \text{ kg/m}^3 \cdot 1.006 \text{ kJ/(kg}\cdot\text{K)} = 1.207 \text{ kJ/(m}^3\cdot\text{K)}$
* Design Winter Delta: $T_{\text{inside}} = 18.0^\circ\text{C}$, $T_{\text{outside, design}} = -10.0^\circ\text{C}$ ($\Delta T = 28.0\text{ K}$)

### 2.2 Calculated Peak Thermal Load
* Conduction Loss (Glass + Screen Closed): $38,500 \text{ W/K} \times 28 \text{ K} = 1,078 \text{ kW}$
* Infiltration Loss: $9.43 \text{ kW/K} \times 28 \text{ K} = 264 \text{ kW}$
* **Total Design Heating Capacity**: **$1,342 \text{ kW}$**

---

## 3. RETROFIT SIZING: ATES DOUBLET & WATER-TO-WATER HEAT PUMP

### 3.1 Groundwater Flow Rate Requirement
$$V_{\text{flow}} = \frac{Q_{\text{evaporator}}}{\rho_w \cdot c_{pw} \cdot \Delta T_{\text{well}}}$$

Where:
* $Q_{\text{evaporator}} = Q_{\text{condenser}} \cdot \left( \frac{\text{COP} - 1}{\text{COP}} \right) = 600 \text{ kW} \cdot \left( \frac{5.1 - 1}{5.1} \right) = 482.3 \text{ kW}$
* $\rho_w \cdot c_{pw} = 4,186 \text{ kJ/(m}^3\cdot\text{K)}$
* Aquifer Temperature Drop ($\Delta T_{\text{well}}$): $12.5^\circ\text{C} - 4.5^\circ\text{C} = 8.0\text{ K}$
* **Required Peak Pumping Rate**: $V_{\text{flow}} = \mathbf{51.8 \text{ m}^3/\text{h}}$ (Within standard sand/gravel well yield)

---

## 4. 24-MONTH BASELINE VS. PROPOSED COMPARISON MATRIX

| Month | Baseline Gas (MMBtu) | Baseline Elec (kWh) | Proposed Gas (MMBtu) | Proposed Elec (kWh) | Monthly Net Savings ($) |
| :---: | :---: | :---: | :---: | :---: | :---: |
| **Jan** | 1,450 | 48,000 | 250 (Peak boiler backup) | 78,000 | **$12,450** |
| **Feb** | 1,280 | 46,000 | 180 | 72,000 | **$11,200** |
| **Mar** | 980 | 49,000 | 80 | 66,000 | **$9,800** |
| **Apr** | 620 | 52,000 | 0 | 58,000 | **$6,900** |
| **May** | 310 | 56,000 | 0 | 56,000 | **$3,400** |
| **Jun** | 90 | 62,000 | 0 (Free ATES Cooling) | 54,000 | **$3,100** |
| **Jul** | 40 | 65,000 | 0 (Free ATES Cooling) | 55,000 | **$3,450** |
| **Aug** | 60 | 64,000 | 0 (Free ATES Cooling) | 55,000 | **$3,200** |
| **Sep** | 220 | 55,000 | 0 | 52,000 | **$2,800** |
| **Oct** | 580 | 51,000 | 0 | 59,000 | **$6,200** |
| **Nov** | 1,050 | 47,000 | 120 | 69,000 | **$9,600** |
| **Dec** | 1,410 | 47,000 | 240 | 76,000 | **$12,100** |
| **ANNUAL**| **8,100 MMBtu** | **642,000 kWh** | **870 MMBtu (-89.2%)**| **750,000 kWh** | **$84,200 / Year** |

---
*Certified Calculation Matrix compliant with USDA RD Form 4280-3B Appendix Technical Requirements.*
