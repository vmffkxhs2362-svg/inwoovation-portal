# Düngeverordnung (DüV 2026) Closed-Loop Runoff & Mass Balance Protocol
**Mandatory Closed-Circuit Hydrological & Nutrient Recirculation Architecture for Soilless Horticultural Facilities under German WHG §62 & EU Nitrates Directive**

---

## 1. Regulatory Context & Legal Mandates (DüV & WHG)

Under the updated **Düngeverordnung (DüV 2026)** and §62 of the German Federal Water Resources Act (**Wasserhaushaltsgesetz - WHG**), commercial horticultural production in soilless substrates (rockwool, coir, perlite) is categorized as a facility handling water-polluting substances (*Anlagen zum Umgang mit wassergefährdenden Stoffen - AwSV*).

### Strict Prohibition of Environmental Discharge
1. **Zero Point-Source Runoff**: Discharge of nutrient-laden drain water into surface water bodies (creeks, retention ditches) or soil infiltration beds is an administrative offense (*Ordnungswidrigkeit*) carrying penalties up to €50,000 and revocation of commercial water withdrawal rights (*Wasserrechtliche Erlaubnis*).
2. **Nitrate Vulnerable Zones (*Rote Gebiete*)**: Facilities located in Bavarian red zones are subject to unannounced audits by the State Office for the Environment (*Bayerisches Landesamt für Umwelt - LfU*) and must maintain a digitally signed nutrient mass balance (*Stoffstrombilanz*).
3. **Mandatory 100% Closed Recirculation**: Drain water collected in gutters must be sterilized (UV disinfection or heat pasteurization) and re-injected into the mixing irrigation circuit until ballast ion concentrations reach physiological phytotoxicity thresholds.

---

## 2. Closed-Loop Hydrological Balance Equations

```
   ┌────────────────────────────────────────────────────────┐
   │             Fresh Raw Water Source (Rainwater)         │
   │               V_fresh [L/day], EC_raw, Na_raw          │
   └───────────────────────────┬────────────────────────────┘
                               │
                               ▼
┌──────────────────┐    ┌─────────────┐    ┌────────────────┐
│ Concentrated Fert│───>│ Mixing Tank │───>│ Irrigation Line│───> Crop Canopy
│  Stock A & B     │    │  (A-B Tank) │    │  V_irr [L/day] │     (V_trans)
└──────────────────┘    └──────▲──────┘    └────────────────┘        │
                               │                                     ▼
                        ┌──────┴──────┐                    ┌────────────────┐
                        │ Disinfection│<───────────────────│ Drainage Gutter│
                        │ (UV / Heat) │   Recirculation    │ V_drain [L/day]│
                        └─────────────┘   V_recirc [L/day] └────────────────┘
```

### 2.1. Daily Water Volume Balance
The daily volumetric relationship in a closed greenhouse cultivation zone ($A = 10,000 \text{ m}^2$) is:

$$V_{irr} = V_{trans} + V_{evap} + V_{drain}$$

Where:
- $V_{irr}$: Total daily irrigation volume injected ($L/\text{m}^2/\text{day}$, typically $4.0 - 7.5 \text{ L/m}^2/\text{day}$).
- $V_{trans}$: Crop transpiration volume ($L/\text{m}^2/\text{day}$, governed by solar radiation $I_{glob}$ and VPD).
- $V_{evap}$: Substrate surface evaporation ($\approx 0.05 \cdot V_{irr}$ in slab culture).
- $V_{drain}$: Drainage volume collected in troughs ($L/\text{m}^2/\text{day}$).

### 2.2. Drain Fraction Ratio ($D_{\%}$)
To prevent local salt buildup in the rootzone slab and maintain uniform electrical conductivity (EC):
$$D_{\%} = \frac{V_{drain}}{V_{irr}} \times 100\%$$
*Design Range*: $28\% \le D_{\%} \le 35\%$ during peak photoperiod; $15\% \le D_{\%} \le 20\%$ during overcast low-radiation cycles.

### 2.3. Fresh Water Replenishment Requirement ($V_{fresh}$)
In a 100% closed-loop system ($V_{recirc} = V_{drain}$):
$$V_{fresh} = V_{irr} - V_{recirc} = V_{trans} + V_{evap}$$

---

## 3. Ballast Ion Accumulation & Recirculation Lifetime Differential Model

In closed-loop systems, non-essential ballast ions (specifically **Sodium $\text{Na}^+$** and **Chloride $\text{Cl}^-$**) enter the system via raw water, substrate leaching, and fertilizer impurities, but are taken up by plants in negligible quantities ($U_{Na} \approx 0.05 - 0.15 \text{ mmol/L of transpiration}$).

### 3.1. Discrete Daily Mass Balance for Sodium Accumulation
The daily change in sodium concentration in the total system buffer reservoir ($V_{sys}$) is:

$$C_{Na}(t+1) = C_{Na}(t) + \frac{V_{fresh}(t) \cdot C_{Na,raw} - V_{trans}(t) \cdot U_{Na}}{V_{sys}}$$

Where:
- $C_{Na}(t)$: System sodium concentration on day $t$ ($\text{mmol/L}$).
- $C_{Na,raw}$: Sodium concentration in fresh replenishment water ($\text{mmol/L}$, ideally $< 0.2 \text{ mmol/L}$ for rainwater; $1.0 - 3.5 \text{ mmol/L}$ for municipal/well water).
- $U_{Na}$: Plant sodium absorption rate ($\text{mmol/L of transpired water}$, typically $0.10 \text{ mmol/L}$ for Solanaceae).
- $V_{sys}$: Total active water volume in mixing tanks, pipes, and buffer storage ($L/\text{m}^2$, typically $5.0 - 8.0 \text{ L/m}^2$).

### 3.2. Time to Critical Flush Threshold ($t_{crit}$)
Crop yield and calcium uptake are compromised when sodium exceeds the physiological threshold ($C_{Na,max} = 4.0 \text{ mmol/L}$ for tomato; $2.5 \text{ mmol/L}$ for cucumber).

$$t_{crit} = \frac{V_{sys} \cdot (C_{Na,max} - C_{Na,0})}{V_{fresh} \cdot C_{Na,raw} - V_{trans} \cdot U_{Na}} \quad \text{[days]}$$

*Engineering Consequence*: 
- If using pristine collected **rainwater** ($C_{Na,raw} \approx 0.08 \text{ mmol/L}$), $V_{fresh} \cdot C_{Na,raw} \le V_{trans} \cdot U_{Na}$, meaning sodium **never accumulates** to toxic levels, enabling indefinite closed-loop operation.
- If using **groundwater** ($C_{Na,raw} = 1.8 \text{ mmol/L}$), $t_{crit} \approx 28 \text{ to } 35 \text{ days}$, requiring secondary desalinization (Reverse Osmosis) or zero-discharge evaporation.

---

## 4. Drainage Buffer & Rainwater Storage Sizing (DWA-A 117 / DIN 1986-100)

Under Bavarian building regulations, every commercial greenhouse facility must maintain dual containment basins:

### 4.1. Closed-Loop Drain Water Equalization Tank ($V_{drain\_tank}$)
Must hold a minimum of 48 hours of peak drainage without overflow risk in case of disinfection unit shutdown:
$$V_{drain\_tank} \ge 2.0 \text{ days} \times \left( A_{cult} \times V_{drain,peak} \right)$$
*Example*: For $10,000 \text{ m}^2$ with $V_{drain,peak} = 2.5 \text{ L/m}^2/\text{day}$:
$$V_{drain\_tank} \ge 2 \times 25,000 \text{ L} = 50,000 \text{ L} = 50 \text{ m}^3$$

### 4.2. Rainwater Harvesting Basin Sizing ($V_{rain\_basin}$)
To guarantee zero-sodium replenishment and withstand 60-day summer drought conditions in Central Europe:
$$V_{rain\_basin} = A_{roof} \times H_{roof\_loss} \times C_{run} \ge 1,200 - 1,500 \text{ m}^3 \text{ per } 10,000 \text{ m}^2 \text{ greenhouse}$$
- Roof runoff coefficient ($C_{run}$): $0.95$ for glass roofs per DIN 1986-100.
- Retention pond emergency buffer: Additional volume for 100-year rain event ($r_{15,n=100}$) per DWA-A 117 with controlled throttle outflow ($q_{dr} \le 2.0 \text{ L/s/ha}$).

---

## 5. Stoffstrombilanz (Nutrient Audit) Documentation Table

Per §3 Stoffstrombilanzverordnung (StoffBilV), the annual nitrogen (N) and phosphate ($\text{P}_2\text{O}_5$) surplus must not exceed **$170 \text{ kg N/ha/year}$** and **$20 \text{ kg P}_2\text{O}_5\text{/ha/year}$**. In a verified 100% closed-loop soilless facility, the audit balance achieves virtually zero soil leaching:

| Parameter | Unit | Annual Input (Fertilizers) | Annual Output (Harvested Biomass) | Net Balance (Surplus/Deficit) | Legal Threshold |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Total Nitrogen (N)** | $\text{kg/ha/yr}$ | 1,250 | 1,215 | $+35 \text{ kg/ha/yr}$ | $\le 170 \text{ kg/ha/yr}$ (Pass) |
| **Phosphate ($\text{P}_2\text{O}_5$)** | $\text{kg/ha/yr}$ | 480 | 472 | $+8 \text{ kg/ha/yr}$ | $\le 20 \text{ kg/ha/yr}$ (Pass) |
| **Potassium ($\text{K}_2\text{O}$)** | $\text{kg/ha/yr}$ | 2,100 | 2,060 | $+40 \text{ kg/ha/yr}$ | Monitored |
| **Calcium ($\text{CaO}$)** | $\text{kg/ha/yr}$ | 950 | 935 | $+15 \text{ kg/ha/yr}$ | Monitored |

*Conclusion*: Closed-loop recirculation eliminates environmental contamination, guaranteeing 100% legal immunity during official state environmental inspections.
