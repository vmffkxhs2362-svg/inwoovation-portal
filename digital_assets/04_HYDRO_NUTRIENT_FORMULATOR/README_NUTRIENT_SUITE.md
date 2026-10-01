# Precision Hydroponic Nutrient Formulation & Groundwater Correction Suite
**Advanced Stoichiometric Ion Balancing, Groundwater Subtraction Algorithm, and 15 Commercial Crop Recipes**

---

## 1. Executive Summary & Agronomic Fundamentals

Fertilizer costs represent 15% to 25% of the ongoing operational expenses in commercial hydroponic and soilless culture facilities. However, over 70% of commercial growers either use generic, static nutrient formulas or rely on pre-mixed fertilizers that ignore the chemical composition of their local **groundwater supply**.

Raw groundwater from agricultural boreholes frequently contains substantial concentrations of:
- **Bicarbonate ($\text{HCO}_3^-$)**: Elevates pH and causes iron and phosphate precipitation.
- **Calcium ($\text{Ca}^{2+}$)**: Leads to blossom end rot or tipburn when unbalanced against potassium and magnesium.
- **Magnesium ($\text{Mg}^{2+}$)** and **Sulfate ($\text{SO}_4^{2-}$)**: Skews the ideal cation/anion ratio.
- **Sodium ($\text{Na}^+$)** and **Chloride ($\text{Cl}^-$)**: Induces osmotic stress and rootzone toxicity.

This suite provides the complete mathematical and computational architecture to:
1. **Subtract native groundwater ions** directly from target crop nutritional requirements.
2. **Eliminate over-fertilization**, reducing monthly raw fertilizer consumption by **20% to 35%**.
3. **Prevent catastrophic crop physiological disorders** (calcium tipburn, magnesium chlorosis, ammonium toxicity).
4. Calculate exact gram quantities of primary inorganic salts for concentrated **Stock Tank A** and **Stock Tank B** (100x to 200x concentration).

---

## 2. Mathematical Principles: Stoichiometry & Equivalent Weights

In scientific fertigation, crop nutritional targets are defined in milliequivalents per liter ($\text{meq/L}$) or millimoles per liter ($\text{mmol/L}$), rather than crude parts per million ($\text{ppm} = \text{mg/L}$), because ions interact electrostatically based on their electrical valence.

$$\text{meq/L} = \frac{\text{mg/L}}{\text{Equivalent Weight}} = \frac{\text{mg/L}}{\text{Molar Mass} / \text{Valence}}$$

### 2.1. Cation-Anion Charge Balance Principle
In every electrically neutral nutrient solution, the sum of cations must equal the sum of anions:

$$\sum \text{Cations} = [\text{K}^+] + 2[\text{Ca}^{2+}] + 2[\text{Mg}^{2+}] + [\text{NH}_4^+] + [\text{Na}^+]$$
$$\sum \text{Anions} = [\text{NO}_3^-] + [\text{H}_2\text{PO}_4^-] + 2[\text{SO}_4^{2-}] + [\text{Cl}^-]$$
$$\sum \text{Cations} \approx \sum \text{Anions} \quad (\text{Error tolerance } < 5\%)$$

### 2.2. Electrical Conductivity (EC) Estimation Model
The theoretical Electrical Conductivity ($\text{EC}$ in $\text{dS/m}$ or $\text{mS/cm}$) at $25^\circ\text{C}$ can be estimated from total ionic equivalents:

$$\text{EC}_{est} \approx \frac{\sum \text{Cations (meq/L)} + \sum \text{Anions (meq/L)}}{20} \approx \frac{\sum \text{Anions (meq/L)}}{10}$$

---

## 3. Groundwater Subtraction & Net Nutrient Delta Algorithm

```
┌─────────────────────────────────┐       ┌─────────────────────────────────┐
│ Target Crop Nutritional Profile │       │ Raw Groundwater Chemical Assay  │
│      C_target,i [meq/L]         │       │        C_raw,i [meq/L]          │
└────────────────┬────────────────┘       └────────────────┬────────────────┘
                 │                                         │
                 └───────────────────┬─────────────────────┘
                                     │
                                     ▼
                   ┌───────────────────────────────────┐
                   │ Net Required Salt Injections:     │
                   │ C_net,i = max(0, C_target - C_raw)│
                   └─────────────────┬─────────────────┘
                                     │
                                     ▼
                   ┌───────────────────────────────────┐
                   │ Acid Neutralization of HCO3-:     │
                   │ Required Acid = C_raw,HCO3 - 0.5  │
                   │ (HNO3 adds NO3- / H3PO4 adds P)   │
                   └─────────────────┬─────────────────┘
                                     │
                                     ▼
                   ┌───────────────────────────────────┐
                   │ Linear Matrix Salt Allocation:    │
                   │ Tank A (Ca-salts, Fe-chelate)     │
                   │ Tank B (Phosphates, Sulfates)     │
                   └───────────────────────────────────┘
```

### Step 1: Bicarbonate Neutralization & Acid Ingestion
Raw water bicarbonate ($\text{HCO}_3^-$) buffers pH upwards. To stabilize rootzone pH between $5.5$ and $5.8$, bicarbonate must be reduced to a safe residual target of $0.5 \text{ meq/L}$ ($30.5 \text{ mg/L}$):

$$\Delta \text{Acid (meq/L)} = [\text{HCO}_3^-]_{raw} - 0.5 \text{ meq/L}$$

When using **Nitric Acid ($\text{HNO}_3$, 68%, density $1.41 \text{ kg/L}$)**:
- Each $1.0 \text{ meq/L}$ of nitric acid adds $+1.0 \text{ meq/L}$ of nitrate nitrogen ($[\text{NO}_3^-]$) to the water.
- This nitrate credit is deducted from the required Calcium Nitrate or Potassium Nitrate inputs!

### Step 2: Native Cation & Anion Deduction
For each mineral element $i$:
$$C_{net,i} = \max\left(0, C_{target,i} - C_{raw,i}\right)$$

*Critical Insight*: If raw groundwater already contains $2.5 \text{ meq/L}$ of Calcium ($50 \text{ mg/L}$), and target strawberry requirement is $3.5 \text{ meq/L}$, the grower only needs to inject $1.0 \text{ meq/L}$ of calcium salt. Buying and dissolving the full $3.5 \text{ meq/L}$ causes severe calcium over-saturation, antagonistic potassium blockage, and wastes hundreds of dollars per hectare.

---

## 4. Fertilizer Salt Matrix & Tank Separation Rules

Concentrated stock solutions (typically $100\times$ dilution) **MUST** be separated into two distinct vessels to prevent immediate insoluble precipitation:

### Tank A (The Calcium & Iron Tank)
- **Calcium Nitrate**: $\text{Ca(NO}_3)_2 \cdot 4\text{H}_2\text{O}$ or granular $5\text{Ca(NO}_3)_2 \cdot \text{NH}_4\text{NO}_3 \cdot 10\text{H}_2\text{O}$
- **Potassium Nitrate (Portion 1)**: $\text{KNO}_3$
- **Chelated Iron**: Fe-DTPA ($7\% \text{ Fe}$) or Fe-EDDHA ($6\% \text{ Fe}$)

### Tank B (The Phosphate, Sulfate & Trace Tank)
- **Monopotassium Phosphate (MKP)**: $\text{KH}_2\text{PO}_4$
- **Potassium Nitrate (Portion 2)**: $\text{KNO}_3$
- **Magnesium Sulfate (Epsom Salt)**: $\text{MgSO}_4 \cdot 7\text{H}_2\text{O}$
- **Potassium Sulfate (if extra K needed without N)**: $\text{K}_2\text{SO}_4$
- **Micronutrient Mix**: $\text{MnSO}_4$, $\text{ZnSO}_4$, $\text{H}_3\text{BO}_3$, $\text{CuSO}_4$, $\text{Na}_2\text{MoO}_4$

> [!WARNING]
> **NEVER MIX TANK A AND TANK B CONCENTRATES**: Mixing $\text{Ca}^{2+}$ directly with $\text{SO}_4^{2-}$ creates insoluble Gypsum ($\text{CaSO}_4 \downarrow$), and mixing $\text{Ca}^{2+}$ with $\text{H}_2\text{PO}_4^-$ creates Calcium Phosphate ($\text{Ca}_3(\text{PO}_4)_2 \downarrow$), permanently clogging drippers and starving the crop.

---

## 5. Software Usage: `groundwater_nutrient_formulator.py`

This suite includes an enterprise-grade, zero-dependency Python formulation engine:

```bash
# Formulate nutrient recipe for Strawberry with custom groundwater assay:
python groundwater_nutrient_formulator.py \
  --crop strawberry_fruiting \
  --tank-volume 1000 \
  --injection-ratio 100 \
  --raw-ca 45.0 \
  --raw-mg 12.0 \
  --raw-hco3 120.0 \
  --raw-no3 8.0 \
  --format table
```

Use `--format json` to pipe formulation data directly into automated dosing PLC systems or IoT fertigation dashboards.
