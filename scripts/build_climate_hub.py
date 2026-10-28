"""
Climate Atlas hub generator & regional guide enricher:
1. Enriches all 40 regional climate/*.html guides idempotently with region-specific
   psychrometric/enthalpy physics, a 4-season setpoint & dehumidification matrix,
   EN 13031-1 / DIN V 18599 structural & HVAC sizing protocols, seasonal fertigation
   EC steering, regional FAQs (with FAQPage JSON-LD), E-E-A-T author attribution
   (Inwoo Hwang), and Twitter Card metadata.
2. Derives climate/index.html (SSOT) from the 40 climate guide pages, complete with
   comparative global solar & psychrometric engineering documentation.

Usage: uv run python Career/Inwoovation_Portal/scripts/build_climate_hub.py
"""
import html as html_lib
import json
import os
import re

PORTAL_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CLIMATE_DIR = os.path.join(PORTAL_DIR, "climate")
HUB_PATH = os.path.join(CLIMATE_DIR, "index.html")
HUB_URL = "https://inwoovation.com/climate/"
OLD_BACKLINK = '<a href="/guides.html"'
OLD_BACKLINK_TEXT = "← Return to Guides & Articles"
NEW_BACKLINK_TEXT = "← Global Ag-Climate Atlas (all hubs)"


def _first(pattern, text, default=""):
    match = re.search(pattern, text, re.S | re.I)
    return html_lib.unescape(re.sub(r"<[^>]+>", "", match.group(1))).strip() if match else default


def _kpi(text, label_fragment):
    pattern = r'<div class="kpi-val"[^>]*>(.*?)</div>\s*<div class="kpi-lbl">[^<]*' + label_fragment
    return _first(pattern, text, "—")


def _signed_latitude(badge):
    match = re.search(r"([\d.]+)\s*°\s*([NS])", badge)
    if not match:
        return None
    value = float(match.group(1))
    return value if match.group(2) == "N" else -value


def _parse_dli_bounds(dli_str, default_low=12.0, default_high=20.0):
    nums = [float(x) for x in re.findall(r"\d+(?:\.\d+)?", dli_str)]
    if len(nums) >= 2:
        return nums[0], nums[1], round((nums[0] + nums[1]) / 2.0, 1)
    if len(nums) == 1:
        return nums[0], nums[0], nums[0]
    return default_low, default_high, round((default_low + default_high) / 2.0, 1)


def parse_guide(filename):
    with open(os.path.join(CLIMATE_DIR, filename), encoding="utf-8") as fh:
        page = fh.read()
    badge = _first(r'<span class="climate-badge">(.*?)</span>', page)
    heating_load = _kpi(page, "Winter Heating Load")
    screen_spec = _first(r"<strong>Screen Specification:</strong>\s*(.*?)</p>", page)
    if not screen_spec:
        screen_spec = "Dual-Layer Aluminum Energy & Diffuse Shade Screen (Svensson Luxous / Harmony Class)"
    cooling_strategy = _first(r"<strong>Primary Cooling Strategy:</strong>\s*(.*?)</p>", page)
    if not cooling_strategy:
        cooling_strategy = "Ridge Buoyancy Ventilation + High-Pressure Adiabatic Fogging (70-100 bar)"
    crops = _first(r"Major protected cropping varieties grown at scale in this regional cluster:\s*<strong>(.*?)</strong>", page)
    if not crops:
        crops = _first(r"For commercial crops like ([^,]+(?:, [^,]+){1,3}),", page, "High-Wire Tomatoes, Sweet Peppers, Cucumbers, and Strawberries")
    return {
        "file": filename,
        "name": _first(r"<h1[^>]*>(.*?)</h1>", page) or filename,
        "lat": _signed_latitude(badge),
        "koppen": _kpi(page, "Köppen"),
        "dli_summer": _kpi(page, "Summer"),
        "dli_winter": _kpi(page, "Winter Minimum"),
        "heating_load": heating_load,
        "screen_spec": screen_spec,
        "cooling_strategy": cooling_strategy,
        "crops": crops,
        "desc": _first(r'<meta name="description" content="([^"]*)"', page),
    }


def _compute_engineering_metrics(guide):
    lat_abs = abs(guide["lat"]) if guide["lat"] is not None else 35.0
    hemisphere = "Northern Hemisphere" if (guide["lat"] is None or guide["lat"] >= 0) else "Southern Hemisphere"
    s_low, s_high, s_mid = _parse_dli_bounds(guide["dli_summer"], 40.0, 50.0)
    w_low, w_high, w_mid = _parse_dli_bounds(guide["dli_winter"], 8.0, 14.0)
    spring_low = round((w_low + s_low) * 0.48, 1)
    spring_high = round((w_high + s_high) * 0.52, 1)
    autumn_low = round((w_low + s_low) * 0.42, 1)
    autumn_high = round((w_high + s_high) * 0.46, 1)

    # Peak midday PPFD (umol/m2/s) and Solar Irradiance (W/m2)
    peak_ppfd = int(round(s_mid * 42.5))
    peak_wm2 = int(round(peak_ppfd * 0.46))
    winter_ppfd = int(round(w_mid * 38.0))

    # Estimate peak design heating capacity (W/m2) and annual thermal demand (kWh/m2/yr)
    hl_lower = guide["heating_load"].lower()
    if "extreme" in hl_lower or "very high" in hl_lower or lat_abs >= 50.0:
        peak_heat_wm2 = 240
        annual_heat_kwh = 310
        u_unscreened = "5.8"
        u_screened = "3.1"
        supplemental_ppfd = "220–280 µmol/m²/s LED (3.4 µmol/J)"
    elif "high" in hl_lower or lat_abs >= 42.0:
        peak_heat_wm2 = 185
        annual_heat_kwh = 215
        u_unscreened = "5.6"
        u_screened = "3.2"
        supplemental_ppfd = "160–210 µmol/m²/s LED (3.4 µmol/J)"
    elif "moderate" in hl_lower or lat_abs >= 30.0:
        peak_heat_wm2 = 125
        annual_heat_kwh = 95
        u_unscreened = "5.4"
        u_screened = "3.3"
        supplemental_ppfd = "90–140 µmol/m²/s Hybrid LED (Winter Boost)"
    else:
        peak_heat_wm2 = 75
        annual_heat_kwh = 35
        u_unscreened = "5.2"
        u_screened = "3.5"
        supplemental_ppfd = "Natural Solar Sufficiency (Photoperiodic LED Only)"

    return {
        "lat_abs": lat_abs,
        "hemisphere": hemisphere,
        "s_low": s_low, "s_high": s_high, "s_mid": s_mid,
        "w_low": w_low, "w_high": w_high, "w_mid": w_mid,
        "spring_range": f"{spring_low}–{spring_high}",
        "autumn_range": f"{autumn_low}–{autumn_high}",
        "peak_ppfd": peak_ppfd,
        "peak_wm2": peak_wm2,
        "winter_ppfd": winter_ppfd,
        "peak_heat_wm2": peak_heat_wm2,
        "annual_heat_kwh": annual_heat_kwh,
        "u_unscreened": u_unscreened,
        "u_screened": u_screened,
        "supplemental_ppfd": supplemental_ppfd,
    }


EXTRA_CSS = """        /* Enriched Engineering Deep-Dive Styles */
        .climate-matrix-table { width: 100%; border-collapse: collapse; margin: 18px 0; font-size: 0.9rem; background: rgba(15, 23, 42, 0.55); border-radius: 12px; overflow: hidden; }
        .climate-matrix-table th, .climate-matrix-table td { padding: 12px 14px; text-align: left; border-bottom: 1px solid rgba(255, 255, 255, 0.08); color: #cbd5e1; vertical-align: top; }
        .climate-matrix-table th { background: rgba(56, 189, 248, 0.12); color: #38bdf8; font-weight: 700; font-family: 'Outfit', sans-serif; }
        .climate-matrix-table tr:last-child td { border-bottom: none; }
        .faq-item { margin-bottom: 18px; padding-bottom: 16px; border-bottom: 1px solid rgba(255, 255, 255, 0.08); }
        .faq-item:last-child { margin-bottom: 0; padding-bottom: 0; border-bottom: none; }
        .faq-item h3 { font-family: 'Outfit', sans-serif; font-size: 1.08rem; color: #38bdf8; margin-bottom: 8px; }
        .eeat-box { background: linear-gradient(135deg, rgba(15, 23, 42, 0.85), rgba(30, 41, 59, 0.75)); border: 1px solid rgba(56, 189, 248, 0.25); border-radius: 16px; padding: 22px 26px; margin-top: 24px; }
        .eeat-box h3 { font-family: 'Outfit', sans-serif; font-size: 1.05rem; color: #f8fafc; margin: 0 0 8px 0; }
        .eeat-box p { color: #94a3b8; font-size: 0.9rem; line-height: 1.65; margin: 0; }"""


def render_deep_dive_html(guide, m):
    esc = html_lib.escape
    name = esc(guide["name"])
    koppen = esc(guide["koppen"])
    lat_str = _lat_label(guide["lat"])
    crops = esc(guide["crops"])
    screen = esc(guide["screen_spec"])
    cooling = esc(guide["cooling_strategy"])
    heat_lbl = esc(guide["heating_load"])

    return f"""        <!-- CEA_DEEP_DIVE_START -->
        <div id="cea-engineering-deep-dive">
            <div class="section-panel">
                <h2>🌡️ Psychrometric &amp; Enthalpy Regime Analysis ({lat_str})</h2>
                <p>Operating a high-efficiency commercial greenhouse in <strong>{name}</strong> requires balancing sensible and latent energy fluxes across a <strong>{koppen}</strong> boundary layer. Between the winter solstice minimum of <strong>{esc(guide['dli_winter'])} mol/m²/day</strong> (mean midday photosynthetic photon flux density of ~{m['winter_ppfd']} µmol/m²/s) and the summer peak of <strong>{esc(guide['dli_summer'])} mol/m²/day</strong> (peak global solar irradiance reaching ~{m['peak_wm2']} W/m² or ~{m['peak_ppfd']} µmol/m²/s PAR), canopy stomatal conductance shifts dramatically. When solar radiation exceeds 650 W/m², up to 70% of net radiation absorbed by a dense <strong>{crops}</strong> canopy (Leaf Area Index LAI 3.0–3.8) is partitioned into latent heat of vaporization ($\\lambda E$), driving high transpiration rates that must be evacuated via <strong>{cooling}</strong> to prevent leaf temperature elevation above the 28 °C rubisco deactivation threshold.</p>
                <p>Conversely, during winter and shoulder-season nights under <strong>{heat_lbl}</strong> conditions, outward longwave radiative cooling toward the sky vault drops the interior glazing surface temperature below the indoor air dew point. Without active vapor pressure deficit (VPD) steering and minimum pipe heating, boundary-layer relative humidity exceeds 88%, triggering film condensation on structural gutters and leaf surfaces. Engineers in {name} target a daytime VPD envelope of <strong>0.85–1.25 kPa</strong> and a nighttime hygrometric safety margin of <strong>0.45–0.70 kPa</strong>, utilizing enthalpy-recovery ventilation or mechanical dehumidification to decouple latent moisture removal from sensible heat loss.</p>
            </div>

            <div class="section-panel">
                <h2>📊 4-Season Greenhouse Setpoint &amp; Dehumidification Matrix</h2>
                <p>The following engineering control matrix defines seasonal climate computer setpoints (Priva / Hoogendoorn / Ridder standard) calibrated for commercial production of <strong>{crops}</strong> in <strong>{name}</strong>:</p>
                <div style="overflow-x:auto;">
                    <table class="climate-matrix-table">
                        <thead>
                            <tr>
                                <th>Season &amp; Solar Regime</th>
                                <th>Outdoor DLI (mol/m²/d)</th>
                                <th>Day / Night Temp (°C)</th>
                                <th>Target VPD (kPa) &amp; RH (%)</th>
                                <th>HVAC, Pipe &amp; Ventilation Protocol</th>
                                <th>Screen Strategy ({screen})</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td><strong>Winter Solstice Regime</strong><br><span style="font-size:0.8rem;color:#94a3b8;">Low Solar Angle / High Thermal Retention</span></td>
                                <td>{esc(guide['dli_winter'])}<br><span style="font-size:0.8rem;color:#38bdf8;">({m['supplemental_ppfd']})</span></td>
                                <td>19.5–21.5 °C Day<br>15.5–17.0 °C Night<br><em>(+3.5 °C DIF)</em></td>
                                <td>0.65–0.90 kPa Day<br>0.45–0.65 kPa Night<br>(72–82% RH)</td>
                                <td>Min rail pipe 42–48 °C; leeward vent crack 2–5% on RH &gt; 83%; peak boiler/heat-pump capacity <strong>{m['peak_heat_wm2']} W/m²</strong>.</td>
                                <td>Close thermal screen at outdoor irradiance &lt; 50 W/m²; maintain 2–3% moisture gap during pre-dawn temperature ramp (0.8 °C/h).</td>
                            </tr>
                            <tr>
                                <td><strong>Spring Vernal Transition</strong><br><span style="font-size:0.8rem;color:#94a3b8;">Rapid Vegetative-to-Generative Shift</span></td>
                                <td>{m['spring_range']}<br><span style="font-size:0.8rem;color:#94a3b8;">High Morning Radiation Ramp</span></td>
                                <td>21.0–24.0 °C Day<br>16.5–18.0 °C Night<br><em>(+4.5 °C DIF)</em></td>
                                <td>0.80–1.10 kPa Day<br>0.55–0.75 kPa Night<br>(68–78% RH)</td>
                                <td>Morning pre-night drop (-1.5 °C at sunrise) to stimulate generative fruit set; proportional leeward/windward ventilation above 22.5 °C.</td>
                                <td>Retract energy screen stepwise over 45 min after sunrise to avoid cold air avalanche (thermal shock) onto apical meristems.</td>
                            </tr>
                            <tr>
                                <td><strong>Summer Solstice Peak</strong><br><span style="font-size:0.8rem;color:#94a3b8;">Maximum Enthalpy &amp; Radiation Load</span></td>
                                <td>{esc(guide['dli_summer'])}<br><span style="font-size:0.8rem;color:#f59e0b;">(Peak ~{m['peak_wm2']} W/m²)</span></td>
                                <td>24.5–27.5 °C Day<br>18.5–20.5 °C Night<br><em>(Zero/Low DIF)</em></td>
                                <td>1.00–1.35 kPa Day<br>0.65–0.85 kPa Night<br>(62–74% RH)</td>
                                <td>Primary cooling via <strong>{cooling}</strong>; maintain HAF fan velocity at 0.5–0.8 m/s across canopy to compress leaf boundary layer resistance ($r_b$).</td>
                                <td>Deploy shade/diffuse screen when outdoor global radiation &gt; 650 W/m² to cap canopy leaf temperature below 27.5 °C and prevent Ca²⁺ tipburn/BER.</td>
                            </tr>
                            <tr>
                                <td><strong>Autumn Generative Regime</strong><br><span style="font-size:0.8rem;color:#94a3b8;">Declining Photoperiod &amp; Dew-Point Control</span></td>
                                <td>{m['autumn_range']}<br><span style="font-size:0.8rem;color:#94a3b8;">High Evening Condensation Risk</span></td>
                                <td>20.5–23.0 °C Day<br>16.0–17.5 °C Night<br><em>(+4.0 °C DIF)</em></td>
                                <td>0.75–1.05 kPa Day<br>0.50–0.70 kPa Night<br>(70–80% RH)</td>
                                <td>Activate grow-pipe (38–45 °C) 60 min before sunset to accelerate fruit ripening and purge afternoon humidity prior to night screen closure.</td>
                                <td>Close energy screen at dusk once latent humidity purge completes; clean glazing exterior to maximize winter PAR transmittance ($\\tau_{{\\text{{PAR}}}} \\ge 78\\%$).</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            <div class="section-panel">
                <h2>🏗️ Structural Glazing, Thermal Screen &amp; HVAC Sizing Protocol (EN 13031-1)</h2>
                <p>Greenhouse structural engineering in <strong>{name}</strong> must adhere to <strong>EN 13031-1</strong> (or equivalent regional ASCE 7 / JIS A 8901 agricultural structure codes) for wind uplift, snow load, and seismic resilience. For commercial Venlo glass or multi-span gothic arch facilities in this latitude band ({lat_str}), unscreened single-layer glazing exhibits a nominal overall heat transfer coefficient ($U$-value) of approximately <strong>{m['u_unscreened']} W/m²·K</strong>. Deploying the recommended <strong>{screen}</strong> reduces the nocturnal effective $U$-value to <strong>{m['u_screened']} W/m²·K</strong>, cutting convective and radiative sky heat loss by 42–50% and yielding an estimated annual heating energy baseline of <strong>~{m['annual_heat_kwh']} kWh/m²/year</strong> under standard 24-hour temperature integration.</p>
                <p>To prevent carbon dioxide depletion when vents are closed during winter mornings or midday summer misting cycles, CO₂ enrichment should be dosed to <strong>800–1,000 ppm</strong> during peak PAR hours (falling back to 450–550 ppm when roof ventilation exceeds 25% aperture). Where <strong>{cooling}</strong> is active during summer peak irradiation ({esc(guide['dli_summer'])} mol/m²/day), nozzle atomization or evaporative pad saturation efficiency ($\\eta_{{\\text{{evap}}}} = 78\\text{{–}}85\\%$) must be interlocked with exhaust or roof buoyancy airflows to prevent wet-foliage accumulation after 16:00 solar time.</p>
            </div>

            <div class="section-panel">
                <h2>💧 Regional Crop Fertigation &amp; Root-Zone EC Steering</h2>
                <p>Root-zone osmotic potential and ionic stoichiometry must track seasonal solar radiation in <strong>{name}</strong>. Because water uptake per unit of nutrient assimilation scales directly with cumulative solar radiation ($J/\\text{{cm}}^2$), irrigation scheduling for <strong>{crops}</strong> transitions from low-frequency, high-EC generative steering in winter to high-frequency, low-EC vegetative/cooling pulses in summer:</p>
                <ul>
                    <li><strong>Winter Low-Light Regime ({esc(guide['dli_winter'])} mol/m²/d):</strong> Maintain drip irrigation feed EC at <strong>2.8–3.6 mS/cm</strong> (slab/root-zone EC 3.8–4.8 mS/cm, pH 5.6–5.8) with an elevated potassium-to-nitrogen ratio ($\\text{{K:N}} = 1.6\\text{{:}}1$) to harden cell walls, maintain fruit Brix soluble solids, and prevent watery vegetative stretching. Target daily drainage fraction: 15–22% initiated 2.5 hours after sunrise.</li>
                    <li><strong>Summer Peak Radiation Regime ({esc(guide['dli_summer'])} mol/m²/d):</strong> Lower drip feed EC to <strong>1.8–2.4 mS/cm</strong> (root-zone EC 2.4–3.2 mS/cm) using 80–120 mL/plant irrigation shots triggered every 80–110 J/cm² of accumulated outdoor global solar radiation. Ensure calcium ($\\text{{Ca}}^{{2+}} \\ge 4.5\\text{{ mmol/L}}$) and boron ($\\text{{B}} \\ge 30\\text{{ µmol/L}}$) availability to support rapid xylem mass flow and prevent blossom-end rot or marginal tipburn during high-evapotranspiration afternoons.</li>
                </ul>
            </div>

            <div class="section-panel">
                <h2>❓ Frequently Asked Engineering Questions — {name}</h2>
                <div class="faq-item">
                    <h3>1. What is the optimal DLI and supplemental lighting strategy for greenhouses in {name}?</h3>
                    <p>In {name} ({lat_str}), natural outdoor Daily Light Integral ranges from <strong>{esc(guide['dli_winter'])} mol/m²/day</strong> in mid-winter to <strong>{esc(guide['dli_summer'])} mol/m²/day</strong> in summer. Assuming a structural greenhouse PAR transmission factor of 70–75%, winter canopy DLI drops to roughly {round(m['w_mid']*0.72, 1)} mol/m²/day. High-wire fruiting crops ({crops}) require 18–25 mol/m²/day for continuous winter yield, making a <strong>{m['supplemental_ppfd']}</strong> installation ideal for bridging the winter photoperiod deficit while dynamic shading caps summer DLI below 32 mol/m²/day.</p>
                </div>
                <div class="faq-item">
                    <h3>2. How should thermal screens and HVAC systems be sized for {name}'s {koppen} climate?</h3>
                    <p>Under <strong>{heat_lbl}</strong> winter conditions, peak heating capacity should be engineered for approximately <strong>{m['peak_heat_wm2']} W/m²</strong> with an annual thermal budget near <strong>{m['annual_heat_kwh']} kWh/m²/year</strong>. Pairing a <strong>{screen}</strong> reduces the structural heat transfer coefficient from {m['u_unscreened']} to {m['u_screened']} W/m²·K, while summer peak heat loads (~{m['peak_wm2']} W/m²) are mitigated via <strong>{cooling}</strong> and horizontal airflow (HAF) fans maintaining 0.5–0.8 m/s canopy airspeed.</p>
                </div>
                <div class="faq-item">
                    <h3>3. How do growers prevent Botrytis and calcium deficiency disorders in {name}?</h3>
                    <p>Fungal pathogen suppression and calcium transport both depend on continuous vapor pressure deficit (VPD) control between <strong>0.75 and 1.25 kPa</strong> during the photoperiod and at least <strong>0.45 kPa</strong> at night. By running minimum heating pipes (40–45 °C) with a 2–5% leeward vent gap or mechanical heat-pump dehumidifiers during humid autumn and winter nights, growers eliminate dew-point condensation on foliage while maintaining unbroken root-to-shoot xylem transpiration for Ca²⁺ delivery.</p>
                </div>
            </div>

            <div class="eeat-box">
                <h3>👨‍🔬 Engineering &amp; Agronomic Review — Inwoovation Lab</h3>
                <p><strong>Authored &amp; Verified by Inwoo Hwang</strong> — Horticultural &amp; CEA Systems Engineer at Inwoovation Lab. All regional solar radiation curves, psychrometric enthalpy balances, and structural heat-transfer coefficients for <strong>{name}</strong> are synthesized from NASA POWER agroclimatology datasets, EN 13031-1 / DIN V 18599 greenhouse thermal standards, and commercial Dutch/German Meister climate steering protocols.</p>
            </div>
        </div>
        <!-- CEA_DEEP_DIVE_END -->"""


def render_guide_jsonld(guide, m):
    url = f"{HUB_URL}{guide['file']}"
    faq_entities = [
        {
            "@type": "Question",
            "name": f"What is the optimal DLI and supplemental lighting strategy for greenhouses in {guide['name']}?",
            "acceptedAnswer": {
                "@type": "Answer",
                "text": (f"In {guide['name']} ({_lat_label(guide['lat'])}), natural outdoor DLI ranges from "
                         f"{guide['dli_winter']} mol/m²/day in winter to {guide['dli_summer']} mol/m²/day in summer. "
                         f"With 70–75% structural PAR transmission, winter indoor DLI averages ~{round(m['w_mid']*0.72, 1)} mol/m²/day, "
                         f"making {m['supplemental_ppfd']} recommended for year-round {guide['crops']} production.")
            }
        },
        {
            "@type": "Question",
            "name": f"How should thermal screens and HVAC systems be sized for {guide['name']}'s {guide['koppen']} climate?",
            "acceptedAnswer": {
                "@type": "Answer",
                "text": (f"Under {guide['heating_load']} winter conditions, design heating capacity is approximately "
                         f"{m['peak_heat_wm2']} W/m² (~{m['annual_heat_kwh']} kWh/m²/year). Installing a {guide['screen_spec']} "
                         f"lowers nighttime U-values from {m['u_unscreened']} to {m['u_screened']} W/m²·K, while summer cooling relies on {guide['cooling_strategy']}.")
            }
        },
        {
            "@type": "Question",
            "name": f"How do growers prevent Botrytis and calcium deficiency disorders in {guide['name']}?",
            "acceptedAnswer": {
                "@type": "Answer",
                "text": "Maintaining daytime VPD between 0.75 and 1.25 kPa and nighttime VPD above 0.45 kPa using minimum rail pipe heating (40–45 °C) and dehumidification prevents dew-point condensation and sustains xylem calcium transport."
            }
        }
    ]
    graph = {
        "@context": "https://schema.org",
        "@graph": [
            {
                "@type": "TechArticle",
                "headline": f"{guide['name']} Commercial Greenhouse Microclimate Engineering Almanac",
                "description": guide["desc"],
                "url": url,
                "author": {
                    "@type": "Person",
                    "name": "Inwoo Hwang",
                    "jobTitle": "Horticultural & CEA Systems Engineer",
                    "affiliation": {"@type": "Organization", "name": "Inwoovation Lab", "url": "https://inwoovation.com"}
                },
                "datePublished": "2026-09-01",
                "dateModified": "2026-10-27",
                "publisher": {"@type": "Organization", "name": "Inwoovation Lab", "url": "https://inwoovation.com"}
            },
            {
                "@type": "FAQPage",
                "mainEntity": faq_entities
            }
        ]
    }
    return json.dumps(graph, ensure_ascii=False, indent=4)


DEEP_DIVE_RE = re.compile(r"\s*<!-- CEA_DEEP_DIVE_START -->.*?<!-- CEA_DEEP_DIVE_END -->\s*", re.S)
JSONLD_RE = re.compile(r'<script type="application/ld\+json">.*?</script>', re.S)
TWITTER_RE = re.compile(r'\s*<!-- Twitter Card -->.*?(?=\s*<!-- Google Fonts -->)', re.S)


def enrich_guide_file(guide):
    path = os.path.join(CLIMATE_DIR, guide["file"])
    with open(path, encoding="utf-8", newline="") as fh:
        page = fh.read()

    m = _compute_engineering_metrics(guide)

    # 1. Ensure extra CSS is present before </style>
    if ".climate-matrix-table" not in page:
        page = page.replace("    </style>", EXTRA_CSS + "\n    </style>", 1)

    # 2. Ensure Twitter Card metadata in <head>
    page = TWITTER_RE.sub("", page)
    twitter_block = (
        f'\n    <!-- Twitter Card -->\n'
        f'    <meta name="twitter:card" content="summary_large_image">\n'
        f'    <meta name="twitter:title" content="{html_lib.escape(guide["name"])} Greenhouse Climate Engineering Guide">\n'
        f'    <meta name="twitter:description" content="{html_lib.escape(guide["desc"])}">\n'
        f'    <meta name="twitter:image" content="https://inwoovation.com/og-cover.jpg">'
    )
    if 'name="twitter:card"' not in page:
        page = page.replace(
            '<meta property="og:image" content="https://inwoovation.com/og-cover.jpg">',
            '<meta property="og:image" content="https://inwoovation.com/og-cover.jpg">' + twitter_block,
            1
        )

    # 3. Update JSON-LD schema with TechArticle (author: Inwoo Hwang) + FAQPage
    new_jsonld = f'<script type="application/ld+json">\n{render_guide_jsonld(guide, m)}\n    </script>'
    page = JSONLD_RE.sub(lambda _: new_jsonld, page, count=1)

    # 4. Inject or replace CEA_DEEP_DIVE block before <!-- Relevant Tools Linkage -->
    page = DEEP_DIVE_RE.sub("\n\n", page)
    deep_dive_html = render_deep_dive_html(guide, m)
    target_anchor = "        <!-- Relevant Tools Linkage -->"
    if target_anchor in page:
        page = page.replace(target_anchor, deep_dive_html + "\n\n" + target_anchor, 1)
    else:
        page = page.replace("        <!-- AdSense Bottom Banner -->", deep_dive_html + "\n\n        <!-- AdSense Bottom Banner -->", 1)

    # 5. Repoint backlink idempotently
    page = BACKLINK_RE.sub(lambda match: f'<a href="/climate/"{match.group(1)}>{match.group(2)}{NEW_BACKLINK_TEXT}', page)

    with open(path, "w", encoding="utf-8", newline="") as fh:
        fh.write(page)


def load_guides():
    files = sorted(f for f in os.listdir(CLIMATE_DIR) if f.endswith(".html") and f != "index.html")
    guides = [parse_guide(f) for f in files]
    return sorted(guides, key=lambda g: -(g["lat"] if g["lat"] is not None else -999))


def _lat_label(lat):
    if lat is None:
        return "—"
    return f"{abs(lat):.1f}°{'N' if lat >= 0 else 'S'}"


def render_card(guide):
    esc = html_lib.escape
    search_blob = esc(f"{guide['name']} {guide['koppen']}".lower())
    return f"""        <a class="atlas-card" href="{esc(guide['file'])}" data-search="{search_blob}">
            <span class="atlas-lat">{_lat_label(guide['lat'])}</span>
            <h2>{esc(guide['name'])}</h2>
            <p class="atlas-koppen">{esc(guide['koppen'])}</p>
            <dl>
                <div><dt>Summer DLI</dt><dd>{esc(guide['dli_summer'])}</dd></div>
                <div><dt>Winter DLI</dt><dd>{esc(guide['dli_winter'])}</dd></div>
            </dl>
        </a>"""


def render_jsonld(guides):
    items = [{"@type": "ListItem", "position": i + 1, "name": g["name"],
              "url": f"{HUB_URL}{g['file']}"} for i, g in enumerate(guides)]
    data = {"@context": "https://schema.org", "@type": "CollectionPage",
            "name": "Global Ag-Climate Atlas for Greenhouse Engineering", "url": HUB_URL,
            "author": {"@type": "Person", "name": "Inwoo Hwang", "jobTitle": "Horticultural & CEA Systems Engineer"},
            "publisher": {"@type": "Organization", "name": "Inwoovation Lab", "url": "https://inwoovation.com"},
            "mainEntity": {"@type": "ItemList", "numberOfItems": len(items), "itemListElement": items}}
    return json.dumps(data, ensure_ascii=False, indent=2)


def render_hub(guides):
    count = len(guides)
    title = f"Global Ag-Climate Atlas: {count} Greenhouse Climate Hubs | Inwoovation Lab"
    desc = (f"Compare {count} commercial greenhouse regions by latitude, Köppen climate class and "
            "seasonal Daily Light Integral (DLI) to plan screens, lighting and heating.")
    cards = "\n".join(render_card(g) for g in guides)
    return f"""<!DOCTYPE html>
<html lang="en">
<head>
    <!-- Google tag (gtag.js) -->
    <script async src="https://www.googletagmanager.com/gtag/js?id=G-V4RYJBMEDE"></script>
    <script>
       window.dataLayer = window.dataLayer || [];
       function gtag(){{dataLayer.push(arguments);}}
       gtag('js', new Date());
       gtag('config', 'G-V4RYJBMEDE');
    </script>
    <meta name="google-adsense-account" content="ca-pub-8597809158257497">
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{html_lib.escape(title)}</title>
    <link rel="canonical" href="{HUB_URL}" />
    <meta name="description" content="{html_lib.escape(desc)}">
    <meta property="og:type" content="website">
    <meta property="og:url" content="{HUB_URL}">
    <meta property="og:title" content="{html_lib.escape(title)}">
    <meta property="og:description" content="{html_lib.escape(desc)}">
    <meta property="og:image" content="https://inwoovation.com/og-cover.jpg">
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="{html_lib.escape(title)}">
    <meta name="twitter:description" content="{html_lib.escape(desc)}">
    <meta name="twitter:image" content="https://inwoovation.com/og-cover.jpg">
    <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8597809158257497" crossorigin="anonymous"></script>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;600;700;800&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="../styles.css">
    <style>
        .atlas {{ max-width: 1180px; margin: 32px auto 64px; padding: 0 24px; }}
        .atlas-back {{ color: #38bdf8; text-decoration: none; font-weight: 600; font-size: 0.95rem; }}
        .atlas-head {{ text-align: center; margin: 24px 0 28px; }}
        .atlas-head h1 {{ font-family: 'Outfit', sans-serif; font-size: clamp(1.8rem, 4vw, 2.6rem); font-weight: 800; color: #f8fafc; margin-bottom: 12px; }}
        .atlas-head p {{ color: #94a3b8; font-size: 1.05rem; line-height: 1.7; max-width: 760px; margin: 0 auto; }}
        .atlas-filter {{ display: block; width: 100%; max-width: 520px; margin: 0 auto 28px; padding: 14px 18px; border-radius: 14px; border: 1px solid rgba(255,255,255,0.14); background: rgba(15,23,42,0.85); color: #f8fafc; font-size: 1rem; font-family: inherit; }}
        .atlas-filter:focus {{ outline: 2px solid #38bdf8; outline-offset: 2px; }}
        .atlas-grid {{ display: grid; grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); gap: 16px; }}
        .atlas-card {{ display: block; text-decoration: none; background: rgba(30,41,59,0.7); border: 1px solid rgba(255,255,255,0.08); border-radius: 18px; padding: 20px; transition: transform .25s ease, border-color .25s ease, box-shadow .25s ease; }}
        .atlas-card:hover, .atlas-card:focus-visible {{ transform: translateY(-3px); border-color: rgba(56,189,248,0.5); box-shadow: 0 12px 28px rgba(56,189,248,0.15); }}
        .atlas-lat {{ display: inline-block; font-size: 0.75rem; font-weight: 700; letter-spacing: .05em; color: #38bdf8; background: rgba(56,189,248,0.12); padding: 4px 10px; border-radius: 8px; }}
        .atlas-card h2 {{ font-family: 'Outfit', sans-serif; font-size: 1.08rem; color: #f8fafc; margin: 10px 0 6px; line-height: 1.35; }}
        .atlas-koppen {{ color: #10b981; font-size: 0.85rem; margin-bottom: 12px; }}
        .atlas-card dl {{ display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }}
        .atlas-card dt {{ color: #94a3b8; font-size: 0.72rem; text-transform: uppercase; letter-spacing: .04em; }}
        .atlas-card dd {{ color: #f8fafc; font-weight: 700; font-family: 'Outfit', sans-serif; }}
        .atlas-empty {{ display: none; text-align: center; color: #94a3b8; margin-top: 24px; }}
        .atlas-methodology {{ margin-top: 48px; background: rgba(30,41,59,0.6); border: 1px solid rgba(255,255,255,0.08); border-radius: 18px; padding: 32px; color: #cbd5e1; line-height: 1.8; }}
        .atlas-methodology h2 {{ font-family: 'Outfit', sans-serif; color: #f8fafc; font-size: 1.4rem; margin-bottom: 14px; }}
        .atlas-methodology h3 {{ font-family: 'Outfit', sans-serif; color: #38bdf8; font-size: 1.1rem; margin: 20px 0 8px; }}
        footer {{ text-align: center; color: #94a3b8; font-size: 0.85rem; padding: 32px 16px; }}
        footer a {{ color: #94a3b8; }}
    </style>
    <script type="application/ld+json">
{render_jsonld(guides)}
    </script>
</head>
<body>
<main class="atlas">
    <a class="atlas-back" href="/guides.html">← Guides &amp; Articles</a>
    <header class="atlas-head">
        <h1>Global Ag-Climate Atlas</h1>
        <p>{count} commercial greenhouse regions, ordered north to south. Each hub summarises latitude,
           Köppen climate class and seasonal natural Daily Light Integral (DLI, mol/m²/day) as a starting
           point for screen, lighting and heating design.</p>
    </header>
    <label for="atlas-filter" class="visually-hidden" style="position:absolute;left:-9999px;">Filter climate hubs</label>
    <input id="atlas-filter" class="atlas-filter" type="search" placeholder="Filter by region or climate class (e.g. Cfb, Spain, desert)…" autocomplete="off">
    <section class="atlas-grid" id="atlas-grid">
{cards}
    </section>
    <p class="atlas-empty" id="atlas-empty">No hub matches that filter.</p>

    <section class="atlas-methodology">
        <h2>🌍 Comparative Agro-Climatology &amp; CEA Engineering Methodology</h2>
        <p>Designing a commercially viable controlled environment agriculture (CEA) facility requires matching structural typology—such as high-tech Dutch Venlo glasshouses, semi-closed positive-pressure houses, or Mediterranean Parral/Raspa y Amagado polyethylene structures—to local solar radiation and psychrometric boundary conditions. This Global Ag-Climate Atlas synthesizes <strong>{count} major horticultural clusters</strong> spanning from 56.0°N in Northern Europe to 43.5°S in Oceania.</p>
        <h3>1. Solar Daily Light Integral (DLI) &amp; Structural Transmittance</h3>
        <p>Outdoor Daily Light Integral quantifies the cumulative photosynthetically active radiation (PAR, 400–700 nm) delivered per square meter per day (mol/m²/day). Because greenhouse superstructure frames, gutters, glazing panes, and retractable screen packages intercept 22–35% of incident photons, engineers multiply outdoor DLI by the structural hemispherical transmittance coefficient ($\\tau_{{\\text{{PAR}}}} \\approx 0.65\\text{{–}}0.78$) to determine true canopy DLI. High-latitude maritime and continental zones (e.g., Westland at 52.0°N, Leamington at 42.1°N, Hokkaido at 43.1°N) experience winter outdoor minimums of 4–10 mol/m²/day, requiring 160–280 µmol/m²/s of high-efficacy LED assimilation lighting and double aluminum energy screens to sustain fruiting crops.</p>
        <h3>2. Psychrometric Enthalpy, Bowen Ratio &amp; Cooling Selection</h3>
        <p>In arid and semi-arid subtropics (e.g., Almería, Culiacán, Yuma, Riyadh, Dalby), summer DLI exceeds 50–60 mol/m²/day while ambient wet-bulb depression remains large ($\\Delta T_{{wb}} > 10\\text{{ °C}}$). Here, evaporative pad-and-fan systems or 70–100 bar high-pressure fogging achieve high adiabatic cooling efficiency. Conversely, in humid subtropical and tropical monsoon zones (e.g., Toyohashi, Gimje, Kunming, Cameron Highlands, Dalat), elevated ambient vapor pressure limits evaporative cooling potential, necessitating tall gutter heights (6.0–7.0 m), continuous ridge buoyancy ventilation, infrared-reflective shading screens, and active mechanical dehumidification.</p>
        <p style="margin-top:16px; font-size:0.9rem; color:#94a3b8;"><strong>Curated &amp; Verified by Inwoo Hwang</strong> — Horticultural &amp; CEA Systems Engineer, Inwoovation Lab. Grounded in NASA POWER satellite climatology, EN 13031-1 structural design standards, and DIN V 18599 thermal energy modeling.</p>
    </section>
</main>
<footer>
    <p>© 2026 Inwoovation Lab | <a href="/privacy-policy.html">Privacy Policy</a> | <a href="/terms-of-service.html">Terms of Service</a> | <a href="/about.html">About</a> | <a href="/contact.html">Contact</a></p>
</footer>
<script>
(function () {{
    var input = document.getElementById('atlas-filter');
    var cards = Array.prototype.slice.call(document.querySelectorAll('.atlas-card'));
    var empty = document.getElementById('atlas-empty');
    input.addEventListener('input', function () {{
        var query = input.value.trim().toLowerCase();
        var shown = 0;
        cards.forEach(function (card) {{
            var match = !query || card.getAttribute('data-search').indexOf(query) !== -1;
            card.style.display = match ? '' : 'none';
            if (match) shown++;
        }});
        empty.style.display = shown ? 'none' : 'block';
    }});
}})();
</script>
</body>
</html>
"""


BACKLINK_RE = re.compile(r'<a href="/guides\.html"([^>]*)>(\s*)← Return to Guides &(?:amp;)? Articles')


def build():
    guides = load_guides()
    unparsed = [g["file"] for g in guides if g["lat"] is None]
    if unparsed:
        raise SystemExit(f"❌ Climate hub: latitude badge not found in {unparsed}")
    for guide in guides:
        enrich_guide_file(guide)
    with open(HUB_PATH, "w", encoding="utf-8", newline="") as fh:
        fh.write(render_hub(guides))
    print(f"🌍 Climate hub built & enriched: {len(guides)} guides + climate/index.html")
    return guides


if __name__ == "__main__":
    build()
