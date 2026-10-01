# Sawa-Wasabi Hydroponic Engineering & Cultivation Protocol
**Continuous Chilled-Flow Gravel Culture, Dissolved Oxygen Supersaturation, and Glucosinolate Steering for *Wasabia japonica***

---

## 1. Botanical Overview & The Chilled-Water Challenge

**Sawa-Wasabi (*Wasabia japonica* var. Daruma / Mazuma)** is a semi-aquatic perennial native to cool, fast-flowing mountain streams in Japan. Unlike field-grown "Hata-wasabi" (which yields fibrous, low-flavor stems for tube paste), true Sawa-wasabi produces dense, emerald-green rhizomes containing high concentrations of **allyl isothiocyanate** and **sinigrin**, commanding wholesale prices of **₩160,000 to ₩250,000 per kilogram**.

The engineering bottleneck of commercial wasabi production is absolute rootzone temperature regulation:
- **Optimal Water Temperature**: **$11.0^\circ\text{C}$ to $14.0^\circ\text{C}$** year-round.
- **Critical Mortality Threshold**: If water temperature exceeds **$16.5^\circ\text{C}$** for more than 48 hours, bacterial soft rot (*Erwinia carotovora*) and black rot (*Phoma wasabiae*) will destroy 90% of the standing crop within 14 days.

---

## 2. Hydraulic System Design: Modified Tatami-Ishi Gravel Gutters

```
[CLOSED-LOOP CHILLED WASABI RECIRCULATION LOOP]
 Reservoir Tank (11-13°C) ──> Inverter Chiller ──> UV-C Disinfection Reactor
          ▲                                                 │
          │                                                 ▼
          │                                      Venturi Nanobubble O2 Injector
          │                                      (Dissolved Oxygen >= 9.0 mg/L)
          │                                                 │
          │                                                 ▼
    Drain Catch Sump <─── Graded Gravel Gutters <─── Manifold Flow Inlets
                          (Slope: 1.5 - 2.0%)        (Velocity: 0.15 - 0.25 m/s)
```

### 2.1. Gutter Geometry & Substrate Gradient
- **Trough Dimensions**: Width $400\text{ mm}$, Depth $150\text{ mm}$, Length $12 - 18\text{ meters}$.
- **Longitudinal Slope**: Continuous gradient of **$1.5\%$ to $2.0\%$** guaranteeing dynamic, laminar water movement without stagnant eddies.
- **Layered Substrate Profile**:
  - Bottom Layer ($50\text{ mm}$): Coarse river gravel ($\Phi 20 - 30\text{ mm}$) facilitating frictionless subsurface water flow.
  - Middle Layer ($50\text{ mm}$): Medium volcanic scoria or basalt pea gravel ($\Phi 8 - 12\text{ mm}$).
  - Top Layer ($30\text{ mm}$): Fine quartz gravel ($\Phi 3 - 5\text{ mm}$) stabilizing the wasabi crown.

### 2.2. Dissolved Oxygen (DO) Supersaturation Protocol
Wasabi roots have an exceptionally high respiration rate. Ambient water at $13^\circ\text{C}$ naturally holds $\approx 10.5 \text{ mg/L}$ of DO at saturation. Under heavy canopy biomass, microbial biological oxygen demand (BOD) rapidly depletes DO, creating anoxic zones where pathogenic water molds thrive.
- **Mandatory Operating DO**: **$\text{DO} \ge 8.5 \text{ mg/L}$** (Minimum threshold at gutter discharge point).
- **Engineering Injection**: High-efficiency micro-nano bubble generator or Mazzei venturi injector operating on pure industrial oxygen ($\text{O}_2$), maintaining DO between **$12.0$ and $16.0 \text{ mg/L}$** at the inflow manifold.

---

## 3. Climate Regimes & Photoperiod Steering

| Parameter | Daylight Photoperiod | Night Dark Period | Agronomic Context |
| :--- | :---: | :---: | :--- |
| **Air Temperature** | $15.0^\circ\text{C} - 18.5^\circ\text{C}$ | $11.0^\circ\text{C} - 13.0^\circ\text{C}$ | High air temp ($>24^\circ\text{C}$) triggers flower bolting, exhausting rhizome starch. |
| **Vapor Pressure Deficit (VPD)**| $0.60 - 0.85 \text{ kPa}$ | $0.40 - 0.60 \text{ kPa}$ | Low VPD prevents leaf marginal scorch while sustaining transpiration. |
| **Light Intensity (PAR)**| $140 - 200 \mu\text{mol/m}^2/\text{s}$ | $0 \mu\text{mol/m}^2/\text{s}$ | Maximum DLI: $8.0 - 11.0 \text{ mol/m}^2/\text{day}$. Strictly shade in summer! |
| **Relative Humidity (RH)**| $75\% - 85\%$ | $85\% - 92\%$ | High humidity mimics cloud forest mountain canyon habitat. |

---

## 4. Specialized Nutrient Chemistry: Glucosinolate Pungency Formulation

The pungent kick of fresh wasabi is caused by **allyl isothiocyanate**, synthesized enzymatically by myrosinase from the sulfur-rich glucosinolate precursor **sinigrin**. To maximize pungency and rhizome density, the nutrient solution must supply elevated sulfate ($\text{SO}_4^{2-}$) while strictly capping vegetative nitrate ($\text{NO}_3^-$):

| Target Ion | Working Target (meq/L) | Working Target (ppm) | Agronomic Objective |
| :--- | :---: | :---: | :--- |
| **Nitrate ($\text{NO}_3\text{-N}$)** | **$6.5 \text{ meq/L}$** | $91 \text{ mg/L}$ | Moderate vegetative growth; excess N causes hollow rhizome centers. |
| **Ammonium ($\text{NH}_4\text{-N}$)**| $0.3 \text{ meq/L}$ | $4 \text{ mg/L}$ | Minimal; ammonium accelerates root rot in cool water. |
| **Phosphate ($\text{H}_2\text{PO}_4\text{-P}$)**| $1.8 \text{ meq/L}$ | $17 \text{ mg/L}$ | Sustains rhizome carbohydrate storage. |
| **Potassium ($\text{K}$)** | $3.5 \text{ meq/L}$ | $137 \text{ mg/L}$ | Osmotic turgor and starch translocation into rhizome. |
| **Calcium ($\text{Ca}$)** | $3.5 \text{ meq/L}$ | $70 \text{ mg/L}$ | Strong cell wall pectins resisting bacterial pectinase enzymes. |
| **Magnesium ($\text{Mg}$)** | $1.8 \text{ meq/L}$ | $22 \text{ mg/L}$ | Core chlorophyll atom and enzyme activation. |
| **Sulfate ($\text{SO}_4\text{-S}$)** | **$3.0 \text{ meq/L}$** | **$48 \text{ mg/L}$** | **Critical**: High sulfur substrate for sinigrin synthesis. |
| **Target EC & pH** | **$\text{EC: } 1.1 - 1.3 \text{ dS/m}$** | **$\text{pH: } 5.8 - 6.2$** | Slightly acidic pH optimizes iron DTPA availability. |

---

## 5. Harvest, Commercial Grading & Revenue Streams

Wasabi reaches commercial maturity between **14 and 18 months** from tissue-culture or crown transplanting:

### 5.1. Commercial Grading Standards
- **Grade 1 (Gourmet Omakase)**: Weight $\ge 120\text{g}$, straight rhizome, dense emerald-green flesh, zero internal blackening.  
  *Contract Farmgate Price*: **₩200,000 - ₩250,000 / kg ($150 - $185 USD/kg)**.
- **Grade 2 (Standard Culinary)**: Weight $70 - 119\text{g}$, slight curvature.  
  *Contract Farmgate Price*: **₩140,000 - ₩170,000 / kg ($100 - $125 USD/kg)**.

### 5.2. Secondary Revenue: Edible Leaves & Petioles (Wasabi Greens)
During the 16-month growth cycle, mature outer leaves and leaf stalks (*wasabi petioles*) can be harvested every 6 weeks without harming rhizome expansion.
- Leaves and stems are vacuum-packed and sold to gourmet pickle producers (*wasabi tsukemono*) and craft culinary distributors for **$16.00 to $22.00 / kg**, generating intermediate cashflow that covers all monthly electricity bills before main rhizome harvest.
