# Smart Greenhouse Construction Cost & BOM Reverse-Engineering Suite
**Bill of Materials (BOM) Itemization, KS Structural Steel Sizing, and Construction Contract Defense Protocols**

---

## 1. Executive Summary & Market Economics

Commercial greenhouse construction represents a substantial capital expenditure ($\text{CAPEX}$), typically ranging from **$150 to $350 per square meter** (₩500,000 to ₩1,500,000 per pyeong) for multi-span high-tech facilities.

However, the horticultural construction industry is notorious for opaque pricing. General contractors frequently provide high-level lump-sum quotes that conceal:
1. **Excessive markup on raw steel**: Charging $40\%$ to $60\%$ over actual mill price for galvanized pipe.
2. **Substandard structural substitutions**: Replacing specified KS certified pipe ($\text{SPPS 290} / \text{SPP}$) with thin-walled non-certified steel to pad contractor profits while endangering snow/wind load integrity.
3. **Double-charging on accessories**: Inflating prices on standard rack-and-pinion drives, gear motors, and circulation fans.
4. **Predatory contract clauses**: Shifting all price escalation risk onto the agricultural client while stripping the builder of delay penalties and warranty liabilities.

This engineering suite provides the client (farmer, investor, or municipal supervisor) with the exact mathematical tools to **reverse-engineer the true material cost (BOM)** of any single-span or multi-span greenhouse before signing a construction contract.

---

## 2. Structural Steel Breakdown & Sizing Benchmarks

The primary cost driver in any greenhouse structure is the **hot-dip galvanized steel framework** ($\text{SPPS 290} / \text{S235JR} / \text{S275JR}$ per KS D 3562 / DIN EN 10025).

### 2.1. Structural Steel Weight per Unit Area
- **1-2 Span High-Profile Vinyl Arch**: $8.0 - 12.0 \text{ kg/m}^2$ ($26 - 40 \text{ kg/pyeong}$)
- **Multi-Span Venlo Vinyl / Polycarbonate (Eave 4.5m - 6.0m)**: $16.0 - 24.0 \text{ kg/m}^2$ ($53 - 79 \text{ kg/pyeong}$)
- **Heavy Industrial Venlo Glass (Eave 6.0m - 7.5m, Trellis Heavy Crop)**: $26.0 - 35.0 \text{ kg/m}^2$ ($86 - 116 \text{ kg/pyeong}$)

### 2.2. Steel Specification & Sizing Standards
| Structural Component | Standard Dimension (DIN / ASTM / KS) | Wall Thickness ($t$) | Zinc Coating Mass ($\text{g/m}^2$) |
| :--- | :--- | :---: | :---: |
| **Main Columns** | Square Pipe $100 \times 100\text{mm}$ or $125 \times 75\text{mm}$ | $3.2 - 4.5\text{ mm}$ | $\ge 400 \text{ g/m}^2$ (HDG) |
| **Truss Chords** | Upper/Lower Chords: Rectangular $60 \times 40\text{mm}$ | $2.3 - 3.2\text{ mm}$ | $\ge 350 \text{ g/m}^2$ (HDG) |
| **Roof Gutters** | Roll-formed Galvanized Sheet $1.5 - 2.0\text{t}$ | $1.5 - 2.0\text{ mm}$ | $\ge 450 \text{ g/m}^2$ (Continuous Zinc) |
| **Arch Purlins & Rafters**| Round Pipe $\Phi 31.8\text{mm} - \Phi 48.6\text{mm}$ | $1.5 - 2.1\text{ mm}$ | $\ge 275 \text{ g/m}^2$ (Pre-Galv) |

---

## 3. Cladding Materials & Replacement Cost Index

| Cladding System | Light Transmittance | U-Value ($\text{W/m}^2\cdot\text{K}$) | Useful Lifespan | Raw Material Cost ($\text{USD/m}^2$) |
| :--- | :---: | :---: | :---: | :---: |
| **PO Film (0.15mm Anti-Fog/Drip)** | $89 - 91\%$ | $5.8 - 6.0$ | $3 - 5 \text{ Years}$ | $2.00 - $3.00 |
| **Double Inflatable Poly (0.15mm $\times 2$)** | $78 - 82\%$ | $3.2 - 3.5$ | $3 - 5 \text{ Years}$ | $4.20 - $5.80 |
| **Twin-Wall Polycarbonate (8mm-10mm)** | $79 - 82\%$ | $2.8 - 3.0$ | $10 - 12 \text{ Years}$| $14.00 - $19.00 |
| **ETFE Architectural Film (F-Clean 100$\mu$m)**| $93 - 94\%$ | $5.5$ | $15 - 20 \text{ Years}$| $22.00 - $29.00 |
| **4mm Tempered Diffuse Glass (ESG)** | $91 - 92\%$ | $5.7$ | $25+ \text{ Years}$ | $28.00 - $39.00 |

---

## 4. Fair Contractor Pricing Architecture

A fair, transparent commercial greenhouse turnkey contract adheres to the following cost ratio distribution:

$$C_{turnkey} = \text{BOM}_{materials} + C_{labor} + C_{machinery} + C_{overhead} + M_{contractor}$$

Where:
- $\text{BOM}_{materials}$: $60\% - 68\%$ of total project cost.
- $C_{labor}$ (Foundations, framework assembly, glazing, electrical): $16\% - 22\%$.
- $C_{machinery}$ (Cranes, scissor lifts, excavators): $3\% - 5\%$.
- $C_{overhead}$ (Insurance, site management, permits): $3\% - 5\%$.
- $M_{contractor}$ (Fair General Contractor Net Profit Margin): **$10\% - 15\%$ maximum**.

> [!WARNING]
> If a contractor quote exceeds the reverse-engineered BOM material cost by more than **$35\%$ to $45\%$**, the contractor is charging an extortionate markup or padding hidden contingency reserves. Use the output of `greenhouse_bom_cost_calculator.py` during contract price negotiations to demand line-item justification.
