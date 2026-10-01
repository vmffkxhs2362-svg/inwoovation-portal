# DIN 11535 Greenhouse Structural Engineering Compliance Checklist
**Standardized Verification Protocol for Commercial CEA Facilities under DIN 11535-1 / DIN EN 13031-1 and the Bavarian Building Code (BayBO)**

---

## 1. Regulatory Context & Structural Standards

Commercial greenhouse structures in Germany, Austria, and Switzerland are governed by **DIN 11535** (*Gewächshäuser: Entwurf und Bemessung*) and harmonized European standard **DIN EN 13031-1** (*Greenhouses: Design and Construction - Part 1: Commercial production greenhouses*).

Unlike conventional industrial buildings designed under general Eurocode (EC 1 & EC 3), DIN 11535 permits specific reduction factors for snow loads when active internal heating and thermal screening maintain minimum gutter and roof surface temperatures above freezing point.

---

## 2. Structural Load Combination Formulas

According to DIN 11535, the design load $E_d$ at the Ultimate Limit State (ULS / *Grenzzustand der Tragfähigkeit*) must satisfy:

$$E_d = \gamma_G \cdot G_k + \gamma_Q \cdot \left( Q_{k,1} + \sum_{i>1} \psi_{0,i} \cdot Q_{k,i} \right)$$

Where:
- $\gamma_G = 1.35$ (Partial safety factor for permanent actions)
- $\gamma_Q = 1.50$ (Partial safety factor for variable actions)
- $\psi_{0,i} = 0.60$ (Combination factor for accompanying variable loads)

### 2.1. Dead Load ($G_k$ - Eigengewicht)
- Steel framework (posts, trusses, gutters): $0.12 - 0.22 \text{ kN/m}^2$ (Venlo 3.2m / 4.0m / 4.8m bay)
- Aluminum glazing bars & capping: $0.03 - 0.05 \text{ kN/m}^2$
- Roof glazing (4mm float or diffuse ESG glass): $0.10 \text{ kN/m}^2$
- Total characteristic dead load: $G_k \approx 0.25 - 0.37 \text{ kN/m}^2$

### 2.2. Crop Trellis Load ($Q_{k,cult}$ - Kulturlast)
- High-wire vining crops (Tomatoes, Cucumbers, Bell Peppers):
  $$Q_{k,cult} \ge 0.15 \text{ kN/m}^2 \quad (\text{Minimum standard DIN 11535 requirement})$$
  $$Q_{k,cult,max} = 0.25 \text{ kN/m}^2 \quad (\text{Heavy beefsteak tomato varieties with double stems})$$
- Note: Trellis loads must be assigned as point loads or line loads directly to the lower chords of the lattice roof girders (*Gitterbinder-Untergurt*).

### 2.3. Technical Installations ($Q_{k,inst}$ - Installationslasten)
- Overhead hot-water pipe rails (twin 51mm heating loops): $0.06 - 0.09 \text{ kN/m}^2$
- Dual automated shade/energy curtains (drives, cables, fabric): $0.03 - 0.05 \text{ kN/m}^2$
- Supplementary Top Lighting (HPS / LED luminaires + cabling): $0.04 - 0.08 \text{ kN/m}^2$
- Total characteristic technical installation load: $Q_{k,inst} \approx 0.13 - 0.22 \text{ kN/m}^2$

### 2.4. Snow Load Calculation with Thermal Melting Reduction ($s_k$ & $s$)
The effective roof snow load $s$ is calculated per DIN 11535:

$$s = \mu_i \cdot c_e \cdot c_t \cdot s_k$$

Where:
- $s_k$: Characteristic ground snow load per German Snow Zone Map (Bavaria typically Zone 1a, 2, or 3: $s_k = 0.85 - 2.80 \text{ kN/m}^2$).
- $\mu_i$: Roof shape coefficient ($\mu_1 = 0.80$ for pitched multi-span Venlo roofs with pitch angle $\alpha \approx 22^\circ$).
- $c_e$: Exposure coefficient ($c_e = 1.0$ for normal topography).
- $c_t$: Thermal melting factor ($0.20 \le c_t \le 1.00$).

#### Critical Rule for $c_t$ Reduction:
Under DIN 11535, $c_t < 1.0$ is permitted **ONLY IF** the greenhouse heating system is capable of supplying an emergency roof melting heat flux of:
$$q_{melt} \ge 120 \text{ W/m}^2 \quad \text{at outdoor temperature } T_{out} = -5^\circ\text{C}$$
with automated temperature sensors installed directly below the gutters (*Rinnenheizung*). If no automatic gutter heating is guaranteed, $c_t = 1.00$ must be enforced in the structural calculations.

### 2.5. Wind Load ($w_k$ - Windlasten)
According to DIN EN 1991-1-4 and DIN 11535:
- Bavarian Wind Zone 1 ($v_{b,0} = 22.5 \text{ m/s}$, $q_b = 0.32 \text{ kN/m}^2$) or Zone 2 ($v_{b,0} = 25.0 \text{ m/s}$, $q_b = 0.39 \text{ kN/m}^2$).
- Pressure coefficients:
  - Windward gable wall: $c_{pe} = +0.80$
  - Leeward gable wall: $c_{pe} = -0.50$
  - Roof suction on ridge: $c_{pe} = -1.20$ to $-2.00$ (Critical load case for glass retention clips and ridge ventilators).

---

## 3. Structural & Glazing Verification Checklist

| Checkpoint | DIN Requirement | Verified Value / Specification | Status |
| :--- | :--- | :--- | :--- |
| **Gutter Deflection Limit** | Vertical deflection $\le L / 250$ under full snow + dead load | Maximum allowable sag at mid-span under $s + G_k$ | [ ] Pass |
| **Ridge Deflection Limit** | Horizontal deflection $\le H / 150$ under wind gust | Maximum sideways sway at post-ridge connection | [ ] Pass |
| **Glass Retention** | Wind suction resistance $p \ge 1.5 \times q_p(z)$ | Aluminum glazing profiles with continuous EPDM rubber seals; minimum clip resistance $\ge 0.45 \text{ kN/m}$ | [ ] Pass |
| **Glazing Safety** | Roof: Min 4mm Single-Pane Tempered Safety Glass (ESG per DIN EN 12150-1) | Sidewalls below 1.80m: Laminated safety glass (VSG per DIN EN ISO 12543) or impact-proof polycarbonate | [ ] Pass |
| **Thermal Break** | Condensation drain slots in glazing bars | Aluminum extrusion profiles with integral thermal decoupling to prevent freeze-thaw cracking | [ ] Pass |

---

## 4. Substructure & Foundation Mechanics (Bavarian Soil Conditions)

### 4.1. Frost-Free Depth (*Frostfreie Gründung*)
- Under Bavarian municipal building codes, concrete pad footings (*Einzelfundamente*) must extend to a minimum frost-free depth of:
  $$d_f \ge 800 \text{ mm} \quad (\text{Standard lowlands})$$
  $$d_f \ge 1000 - 1200 \text{ mm} \quad (\text{Alpine foothills / Bayerischer Wald})$$

### 4.2. Uplift & Overturning Safety (*Auftriebs- & Kippsicherheit*)
- Due to high wind suction on lightweight structures, greenhouse foundation concrete footings act primarily as **ballast anchors** rather than bearing supports:
  $$\frac{G_{found} + G_{soil}}{\gamma_{dst} \cdot W_{uplift}} \ge 1.50$$
- Concrete grade minimum: **C20/25 (XC2 / XF1)** per DIN EN 206 for sulfate resistance in agricultural soil.

---

## 5. Bavarian Building Permit (*Bauantragsunterlagen*) Dossier Checklist

To obtain a valid building permit (*Baugenehmigung*) from the local building authority (*Landratsamt / Bauordnungsamt*):
1. [ ] **Bauantragsformular** (Official Bavarian building application form per BayBO).
2. [ ] **Flurkarte / Auszug aus dem Liegenschaftskataster** (Official cadastral cadastral excerpt 1:1000, not older than 6 months).
3. [ ] **Lageplan & Freiflächengestaltungsplan** (Site layout showing property boundaries, fire access lanes min 3.5m width, turning radii for emergency vehicles per DIN 14090).
4. [ ] **Bauzeichnungen** (Floor plans, roof elevations, longitudinal cross-sections at 1:100 scale).
5. [ ] **Statischer Nachweis & Typenprüfung** (Certified structural analysis by an accredited structural engineer / *Prüfstatiker* compliant with DIN 11535).
6. [ ] **Brandschutznachweis** (Fire protection concept: compartmentation, emergency exits max 35m travel distance, fire water supply min $96 \text{ m}^3/\text{h}$ for 2 hours per DVGW W 405).
7. [ ] **Entwässerungsgesuch** (Rainwater harvesting and retention verification compliant with DWA-A 117).
