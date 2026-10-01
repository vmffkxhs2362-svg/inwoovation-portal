# Hydroponic Fertilizer Salt Solubility & Chemical Compatibility Chart
**Laboratory Standards for Concentrated Stock Tanks (100x), Temperature Solubility Limits, and Precipitation Prevention**

---

## 1. Temperature-Dependent Solubility Limits

When preparing concentrated stock solutions (typically $100\times$ dilution), fertilizer salts must dissolve completely into solution without crystallization at winter room temperatures ($10^\circ\text{C}$ to $15^\circ\text{C}$). Exceeding the solubility limit causes crystalline sedimentation at the bottom of the stock tank, altering the fertigation injection ratio and starving crops.

| Fertilizer Salt | Chemical Formula | Max Solubility @ $10^\circ\text{C}$ ($\text{kg} / 100\text{L}$) | Max Solubility @ $20^\circ\text{C}$ ($\text{kg} / 100\text{L}$) | Safe Stock Tank Limit ($100\times$) | Dissolution Behavior |
| :--- | :--- | :---: | :---: | :---: | :--- |
| **Calcium Nitrate** | $5\text{Ca(NO}_3)_2 \cdot \text{NH}_4\text{NO}_3 \cdot 10\text{H}_2\text{O}$ | $102 \text{ kg}$ | $122 \text{ kg}$ | $\le 20 \text{ kg} / 100\text{L}$ | Highly endothermic (chills water) |
| **Potassium Nitrate** | $\text{KNO}_3$ | **$21 \text{ kg}$** (Critical!) | $32 \text{ kg}$ | $\le 12 \text{ kg} / 100\text{L}$ | Strongly endothermic; dissolves slowly in cold water |
| **Monopotassium Phosphate (MKP)**| $\text{KH}_2\text{PO}_4$ | $18 \text{ kg}$ | $23 \text{ kg}$ | $\le 10 \text{ kg} / 100\text{L}$ | Moderate dissolution |
| **Magnesium Sulfate (Epsom)** | $\text{MgSO}_4 \cdot 7\text{H}_2\text{O}$ | $30 \text{ kg}$ | $36 \text{ kg}$ | $\le 15 \text{ kg} / 100\text{L}$ | Fast dissolution |
| **Potassium Sulfate** | $\text{K}_2\text{SO}_4$ | **$9 \text{ kg}$** (Very low!) | $11 \text{ kg}$ | $\le 5 \text{ kg} / 100\text{L}$ | Poor solubility; avoid in high-concentration stock tanks |
| **Ammonium Nitrate** | $\text{NH}_4\text{NO}_3$ | $158 \text{ kg}$ | $192 \text{ kg}$ | $\le 25 \text{ kg} / 100\text{L}$ | Rapid, strongly endothermic |
| **Iron Chelate (Fe-DTPA 7%)** | $\text{NaFe-DTPA}$ | $10 \text{ kg}$ | $12 \text{ kg}$ | $\le 1.5 \text{ kg} / 100\text{L}$ | Highly soluble; photosensitive (keep tank dark) |

---

## 2. Chemical Incompatibility & Precipitation Matrix

```
                ┌─────────────────────────────────────────────────────────────┐
                │                  CHEMICAL COMPATIBILITY KEY                 │
                │  [+] FULLY COMPATIBLE (Can mix in same concentrated tank)   │
                │  [-] INCOMPATIBLE (Immediate precipitation / insoluble salt)│
                │  [!] CAUTION (Limit concentration / pH dependent)          │
                └─────────────────────────────────────────────────────────────┘
```

| Incompatible Pair | Reaction Product (Insoluble Precipitate) | Agronomic Impact | Proper Mitigation |
| :--- | :--- | :--- | :--- |
| **$\text{Ca}^{2+} + \text{SO}_4^{2-}$** | Gypsum ($\text{CaSO}_4 \cdot 2\text{H}_2\text{O} \downarrow$) | White crystalline sludge in tank; blocks 100% of drip emitters. | Separate Calcium Nitrate into **Tank A**; Magnesium/Potassium Sulfate into **Tank B**. |
| **$\text{Ca}^{2+} + \text{H}_2\text{PO}_4^-$** | Tricalcium Phosphate ($\text{Ca}_3(\text{PO}_4)_2 \downarrow$) | Severe phosphorus and calcium starvation in crops. | Never place MKP in Tank A. Put all phosphates strictly in **Tank B**. |
| **$\text{Fe-Chelate} + \text{H}_2\text{PO}_4^-$** | Ferric Phosphate ($\text{FePO}_4 \downarrow$) | Iron precipitates out of solution; severe interveinal chlorosis. | Keep Fe-Chelates in **Tank A** or isolated in separate **Tank C**. |
| **$\text{Mg}^{2+} + \text{PO}_4^{3-}$ (Alkaline)**| Magnesium Ammonium Phosphate (Struvite $\downarrow$) | Sludge forming at pH $> 6.5$ in concentrated mixtures. | Maintain Tank B pH strictly acidic ($\text{pH} \le 5.5$). |

---

## 3. Chelated Iron Selection Guide by Rootzone pH

Iron ($\text{Fe}$) is an essential cofactor in chlorophyll synthesis, but inorganic iron salts ($\text{FeSO}_4$) oxidize rapidly to insoluble ferric hydroxide ($\text{Fe(OH)}_3 \downarrow$) at $\text{pH} > 5.2$. Commercial hydroponics demands organic synthetic chelates:

| Chelate Formulation | Optimal pH Stability Window | Primary Use Case | Cost Index |
| :--- | :---: | :--- | :---: |
| **Fe-EDTA (13%)** | $\text{pH } 4.0 - 6.0$ | Rainwater hydroponics with low bicarbonate; ineffective above pH 6.2. | $1.0\times$ (Budget) |
| **Fe-DTPA (7%)** | $\text{pH } 4.0 - 7.0$ | **Industry Gold Standard**: Rockwool, coir, and NFT systems with standard groundwater. | $1.8\times$ (Standard) |
| **Fe-EDDHA (6%)** | $\text{pH } 4.0 - 9.0$ | High-alkalinity alkaline well water ($\text{pH} > 7.5$) and calcareous soils. | $3.5\times$ (Premium) |

---

## 4. Acid Dilution & Hazardous Materials Safety Protocol

### The Golden Plumbing Rule
> [!CAUTION]
> **ALWAYS ADD ACID TO WATER — NEVER ADD WATER TO ACID!**  
> Pouring water into concentrated Nitric Acid ($68\%$) or Phosphoric Acid ($75\%$) creates extreme localized exothermic boiling, causing violent acid splatter and catastrophic chemical burns to eyes and face.

### Required Personal Protective Equipment (PPE) per DGUV / OSHA:
1. Neoprene or chemical-resistant nitrile gauntlets (min 0.4mm thickness).
2. Indirectly ventilated safety goggles with face shield (DIN EN 166).
3. Acid-resistant PVC apron and steel-toe chemical rubber boots.
4. Eye-wash station (DIN EN 15154) located within a 5-second travel path ($< 7 \text{ meters}$) from dosing tanks.
