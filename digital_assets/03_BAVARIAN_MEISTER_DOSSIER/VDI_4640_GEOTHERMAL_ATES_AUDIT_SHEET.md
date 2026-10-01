# VDI 4640 Geothermal ATES & Borehole Engineering Audit Sheet
**Subsurface Thermal Energy Storage & Groundwater Heat Pump Sizing for Commercial CEA under VDI 4640 (Blatt 1-4) & Bavarian Water Law (WHG §8 / §9)**

---

## 1. Engineering Scope & Standard Overview

**VDI 4640** (*Thermische Nutzung des Untergrunds / Thermal use of the underground*) governs the thermodynamic calculation, environmental compliance, and long-term thermal sustainability of subsurface heating and cooling installations in Germany.

For commercial greenhouse complexes ($A \ge 10,000 \text{ m}^2$), shallow geothermal energy provides critical baseload heating in winter and low-cost sensible cooling in summer via:
1. **Aquifer Thermal Energy Storage (ATES / *Aquiferspeicher*)**: A seasonal open-loop groundwater doublet (Warm Well + Cold Well) circulating water through highly permeable alluvial gravel aquifers (e.g., Bavarian Molasse Basin / Munich Gravel Plain).
2. **Borehole Heat Exchanger Fields (BHE / *Erdwärmesondenfelder*)**: Closed-loop vertical U-tube arrays (typically $100 - 160 \text{ m}$ depth) circulating water-glycol mixtures.

---

## 2. Thermodynamic Sizing Equations

```
[WINTER HEATING MODE]
 Warm Well (14-16°C) ──> Heat Pump Evaporator (Ext: 10°C) ──> Cold Well Injection (6-8°C)
                                │
                                ▼
                         Heat Pump Condenser (Supply: 45-50°C) ──> Greenhouse Pipe Rails

[SUMMER FREE-COOLING MODE]
 Cold Well (6-8°C) ────> Plate Heat Exchanger (Absorbs Heat) ───> Warm Well Injection (16-18°C)
                                ▲
                                │
                         Greenhouse Fan Coils / ATU (Returns: 22-26°C)
```

### 2.1. Thermal Extraction & Injection Power
The instantaneous thermal transfer rate $Q_{th}$ ($\text{kW}$) is:

$$Q_{th} = \dot{V} \cdot \rho_{w} \cdot c_{p,w} \cdot \Delta T$$

Where:
- $\dot{V}$: Volumetric groundwater pumping rate ($\text{m}^3/\text{h}$ or $\text{m}^3/\text{s}$).
- $\rho_w$: Water density ($\approx 1000 \text{ kg/m}^3$).
- $c_{p,w}$: Specific heat capacity of water ($4.186 \text{ kJ/(kg}\cdot\text{K)}$).
- $\Delta T$: Temperature differential between extraction and re-injection ($\Delta T = |T_{ext} - T_{inj}|$).

*Engineering Baseline Rule*: Under Bavarian Water Authority guidelines, the maximum permissible thermal disturbance of the natural groundwater aquifer is:
$$\Delta T_{aquifer} \le \pm 6.0 \text{ K} \quad \text{and absolute injection temperature } 6^\circ\text{C} \le T_{inj} \le 20^\circ\text{C}$$

### 2.2. Groundwater Heat Pump Coefficient of Performance (COP)
The operational efficiency of the heat pump is determined by the Carnot efficiency factor ($\eta_{Carnot} \approx 0.50 - 0.58$ for modern semi-hermetic screw chillers):

$$\text{COP}_{heat} = \eta_{Carnot} \cdot \frac{T_{supply} + 273.15}{(T_{supply} + 273.15) - (T_{evap} + 273.15)}$$

*Example*: For $T_{supply} = 45^\circ\text{C}$ (low-temperature pipe rail) and $T_{evap} = 8^\circ\text{C}$ (groundwater entering at $14^\circ\text{C}$ and exiting at $9^\circ\text{C}$):
$$\text{COP}_{heat} = 0.54 \cdot \frac{318.15}{318.15 - 281.15} = 0.54 \cdot \frac{318.15}{37.0} = 4.64$$

### 2.3. Closed-Loop Borehole Field (BHE) Specific Heat Extraction (VDI 4640 Blatt 2)
For vertical closed-loop probes ($2 \times \text{DN32 PE100-RC}$), the specific extraction rate $q_E$ ($\text{W/m}$) over an annual operational window ($1,800 - 2,400 \text{ h/year}$) depends on lithology:

| Subsurface Lithology (Bavarian Region) | Effective Thermal Conductivity ($\lambda$) | Recommended Extraction Rate ($q_E$) |
| :--- | :--- | :--- |
| Dry sand / gravel (Upper vadose zone) | $0.4 - 1.0 \text{ W/(m}\cdot\text{K)}$ | $20 - 25 \text{ W/m}$ |
| Water-saturated gravel (*Münchner Schotterebene*) | $2.0 - 3.0 \text{ W/(m}\cdot\text{K)}$ | $55 - 70 \text{ W/m}$ |
| Molasse sandstone / Marls (*Südbayerische Molasse*) | $2.2 - 2.8 \text{ W/(m}\cdot\text{K)}$ | $50 - 65 \text{ W/m}$ |
| Heavy clay / Silt (*Tertiärhügelland*) | $1.5 - 2.0 \text{ W/(m}\cdot\text{K)}$ | $35 - 45 \text{ W/m}$ |

Total required borehole drilling depth ($L_{total}$):
$$L_{total} = \frac{Q_{peak,evap}}{q_E} = \frac{Q_{peak,heat} \cdot \left(1 - \frac{1}{\text{COP}}\right)}{q_E} \quad \text{[meters]}$$

---

## 3. Mandatory Annual Thermal Sustainability Balance ($R_{th}$)

Under VDI 4640 Blatt 1 and §8 WHG, an open-loop ATES or closed-loop borehole field must not cause continuous permafrost cooling or boiling heating of the geological strata over a 25-year operational horizon.

The annual thermal balance ratio ($R_{th}$) must satisfy:

$$R_{th} = \frac{Q_{inj,summer}}{Q_{ext,winter}} = \frac{\int_{summer} Q_{cooling}(t)\,dt}{\int_{winter} Q_{heating}(t)\,dt} \ge 0.80 \quad \text{and} \quad \le 1.20$$

### Remediation Protocol if $R_{th} < 0.80$ (Excess Winter Heating Extraction):
In Central European climates, greenhouse heating demands typically exceed summer cooling demands. To prevent the aquifer from dropping below $4^\circ\text{C}$ over a 5-year cycle, the system must incorporate:
1. **Solar Thermal Roof Gutter Regeneration**: Harvesting summer roof runoff heat ($T_{water} \approx 28 - 35^\circ\text{C}$) and re-injecting it into the warm well.
2. **CHP Intercooler Heat Rejection**: Routing waste heat from CHP engine oil/jacket circuits into the aquifer during low-demand summer periods.

---

## 4. Engineering Audit Checklist for Bavarian Permitting Authorities

| Phase | Milestone / Legal Mandate | Regulatory Authority | Compliance Parameter |
| :--- | :--- | :--- | :--- |
| **Phase 1** | Hydrogeological Desktop Feasibility Study | Wasserwirtschaftsamt (WWA) | Transmissivity $T \ge 10^{-3} \text{ m}^2/\text{s}$; Darcy velocity $v_f \le 1.0 \text{ m/day}$. |
| **Phase 2** | Thermal Response Test (TRT) | Accredited Geological Institute | In-situ measurement of $\lambda_{eff}$ and borehole thermal resistance $R_b$. |
| **Phase 3** | Mining Act Notification (§127 BBergG) | Bergamt Südbayern / Nordbayern | Mandatory notification prior to drilling depths exceeding $100 \text{ m}$. |
| **Phase 4** | Water Law Permit (*Erlaubnis nach §8 WHG*) | Landratsamt (Untere Wasserbehörde)| Binding decree approving seasonal water extraction volume ($m^3/\text{year}$). |
| **Phase 5** | Grouting & Sealing Verification | Independent Drilling Supervisor | Continuous pressure-grouted borehole sealing per VDI 4640 (thermally enhanced bentonite suspension $\lambda \ge 2.0 \text{ W/(m}\cdot\text{K)}$) protecting perched drinking water aquifers from contamination. |

---

## 5. CAPEX vs. OPEX Benchmark Calculation ($10,000 \text{ m}^2$ Facility)

| Cost Component | Conventional Gas Heating (Baseline) | VDI 4640 Geothermal ATES + Heat Pump | Delta / Savings |
| :--- | :--- | :--- | :--- |
| **Initial Turnkey CAPEX** | €85,000 (Boiler + gas hookup) | €420,000 (Doublet wells + pumps + W/W heat pump) | -€335,000 |
| **Federal Subsidy (BAFA / BLE)** | €0 | +€168,000 (40% Federal Energy Efficiency Grant) | +€168,000 |
| **Net Developer Outlay** | €85,000 | €252,000 | -€167,000 |
| **Annual Heating Fuel Cost** | €145,000 (Natural gas @ €0.085/kWh) | €48,000 (Electricity @ €0.16/kWh, COP 4.6) | **+€97,000 / year** |
| **Summer Free-Cooling Value**| €0 (Chiller power prohibitive) | €22,000 (Crop yield preservation under heatwaves) | **+€22,000 / year** |
| **Simple Amortization Horizon**| Baseline | **1.40 Years** (Net payback from annual savings) | **Exceptional IRR (47%)** |

*Conclusion*: VDI 4640 compliant shallow geothermal integration yields massive operational cost resilience against fossil fuel carbon taxation (*BEHG CO2-Preis*) while meeting all European sustainability benchmarks.
