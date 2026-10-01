# Commercial Vertical Farm Unit Economics & CapEx/OpEx Sizing Suite
**Thermodynamic Heat Dissipation Balance, Power Tariff Sensitivity, and 100-Pyeong Modular Financial Model**

---

## 1. Executive Summary & Industry Reality

Vertical farming (Indoor Controlled Environment Agriculture / Plant Factory with Artificial Lighting - PFAL) offers unprecedented crop yield per unit land area, zero pesticide use, and 95% water reduction.

However, globally and in Korea, over **85% of commercial vertical farming startups face insolvency within 24 to 36 months**. The root cause is almost never biological or agronomic; it is a failure of **thermodynamic unit economics**:
1. **Light-to-Heat Conversion Underestimation**: 100% of the electrical energy fed to horticultural LED lights is ultimately dissipated as thermal energy inside the insulated envelope (approximately 50% as sensible radiant/conductive heat and 50% as latent heat via crop transpiration).
2. **Cascading HVAC Cooling Loads**: For every $1.0 \text{ kW}$ of LED light added, the facility requires $0.30 - 0.45 \text{ kW}$ of chiller compressor electrical power to pump that heat out, doubling operational electricity bills.
3. **Unrealistic Yield & Price Projections**: Basing business plans on retail supermarket shelf prices (₩35,000/kg) rather than actual wholesale B2B farmgate prices (₩12,000 - ₩18,000/kg).

This engineering suite provides the rigorous mathematical model required to compute **the true Cost of Goods Sold (COGS) per kilogram** before investing hundreds of millions in cleanroom panels and LED fixtures.

---

## 2. Thermodynamic Mass & Energy Balance Model

```
   ┌────────────────────────────────────────────────────────┐
   │             Total Electrical Input to LEDs             │
   │                      P_elec [kW]                       │
   └───────────────────────────┬────────────────────────────┘
                               │
               ┌───────────────┴───────────────┐
               ▼                               ▼
 ┌───────────────────────────┐   ┌───────────────────────────┐
 │ Sensible Thermal Heat     │   │ Photosynthetic Radiation  │
 │ Dissipation (Heatsink/Air)│   │ (PAR Absorbed by Canopy)  │
 │     Q_sens = 0.50*P       │   │        0.50*P             │
 └─────────────┬─────────────┘   └─────────────┬─────────────┘
               │                               │
               │                               ▼ Crop Transpiration (98%)
               │                 ┌───────────────────────────┐
               │                 │ Latent Moisture Load      │
               │                 │ Q_latent = m_water * h_fg │
               │                 └─────────────┬─────────────┘
               │                               │
               └───────────────┬───────────────┘
                               ▼
            ┌─────────────────────────────────────┐
            │ Total HVAC Thermal Extraction Load  │
            │ Q_cooling = Q_sens + Q_latent       │
            │ Required Chiller Power:             │
            │ P_HVAC = Q_cooling / COP_cooling    │
            └─────────────────────────────────────┘
```

### 2.1. LED Heat Dissipation & Efficacy (PPE)
Modern horticultural LEDs (Samsung LM301H / Osram Square Hyper Red) achieve photosynthetic photon efficacy ($\text{PPE}$) of:
$$\text{PPE} \approx 2.7 - 3.2 \ \mu\text{mol/J}$$

To achieve a commercial target PPFD ($\text{PPFD} = 220 \ \mu\text{mol/m}^2/\text{s}$) over active cultivation canopy area $A_{canopy}$:
$$P_{LED,elec} = \frac{\text{PPFD} \times A_{canopy}}{\text{PPE}} \quad \text{[Watts]}$$

### 2.2. Crop Transpiration & Latent Dehumidification Load
Over 98% of the water absorbed by indoor crops is transpired into the ambient room air as water vapor. The latent heat of vaporization of water at $20^\circ\text{C}$ is $h_{fg} \approx 2,454 \text{ kJ/kg}$.

Daily moisture release rate ($\dot{m}_{water}$ in $\text{L/day}$ or $\text{kg/day}$):
$$\dot{m}_{water} = A_{canopy} \times \text{Daily Transpiration Rate} \quad (\approx 2.5 - 4.0 \text{ L/m}^2/\text{day})$$

Hourly latent dehumidification heat load ($Q_{latent}$):
$$Q_{latent} = \frac{\dot{m}_{water} \times 2454 \text{ kJ/kg}}{86400 \text{ s}} \quad \text{[kW]}$$

### 2.3. Total HVAC Power Demand
Given a seasonal cooling coefficient of performance ($\text{COP}_{chiller} \approx 3.2 - 3.8$):
$$P_{HVAC,elec} = \frac{P_{LED,elec} + Q_{aux}}{\text{COP}_{chiller}} \quad \text{[kW]}$$

---

## 3. Cost of Goods Sold (COGS) Breakdown per Kilogram

In a properly designed 100-pyeong (5-tier) vertical farm, the direct production cost structure per $1.0\text{ kg}$ of fresh leafy greens (Butterhead, Roman, Frill Ice) averages:

$$\text{COGS}_{kg} = C_{power} + C_{seeds\_plugs} + C_{nutrients} + C_{labor} + C_{packaging} + C_{deprec}$$

| Cost Component | Typical Share (%) | Benchmark Cost (₩ / kg) | Cost Reduction Levers |
| :--- | :---: | :---: | :--- |
| **Electricity (LED + HVAC)** | **$38 - 48\%$** | ₩3,800 - ₩5,500 | Off-peak night photoperiod; high-PPE fixtures ($\ge 3.0 \mu\text{mol/J}$). |
| **Direct Farm Labor** | **$22 - 28\%$** | ₩2,400 - ₩3,200 | Automated seeding/transplanting benches; ergonomic harvesting carts. |
| **Facility Depreciation (10-Yr)**| **$14 - 18\%$** | ₩1,500 - ₩2,200 | Modular cleanroom panels; sourcing standardized aluminum extrusions. |
| **Packaging & Cold Chain** | $6 - 10\%$ | ₩800 - ₩1,200 | Modified Atmosphere Packaging (MAP); bulk B2B crate delivery. |
| **Seeds, Plugs & Substrates** | $4 - 6\%$ | ₩450 - ₩700 | Sowing precision coated seeds in 200-cell rockwool/sponge plugs. |
| **Fertilizer Inorganic Salts** | $2 - 4\%$ | ₩250 - ₩400 | Custom raw salt mixing (Suite 04) instead of liquid pre-mixes. |
| **Total Production Cost** | **$100\%$** | **₩9,200 - ₩13,200 / kg** | **Target Wholesale Price: ₩15,000 - ₩18,000 / kg** |

---

## 4. Software Usage: `vertical_farm_unit_economics_simulator.py`

```bash
# Run 100-pyeong 5-tier vertical farm simulation with Agricultural Power Tariff (Tier 2):
python vertical_farm_unit_economics_simulator.py \
  --area 100 \
  --tiers 5 \
  --ppe 2.8 \
  --ppfd 220 \
  --photoperiod 16 \
  --power-tariff 65.0 \
  --wholesale-price 16000 \
  --format table
```
Use this computational engine to prove bankability and establish debt-service coverage before applying for agricultural tech loans.
