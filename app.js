/* 
   Inwoovation Lab Portal Logic (v12.0 Interactive & High-Performance)
   Author: vmffkxhs2362-svg
   Features: Zero-Latency Biophysical VPD Micro-Simulator, Real-Time Filter & Search
*/

document.addEventListener('DOMContentLoaded', () => {
    localStorage.removeItem('inwoovation_pref_lang');
    localStorage.setItem('inwoovation_pref_lang', 'en');

    initVPDSimulator();
});

// Interactive Biophysical VPD Micro-Simulator
function initVPDSimulator() {
    const tempSlider = document.getElementById('sim-temp');
    const rhSlider = document.getElementById('sim-rh');
    const leafSlider = document.getElementById('sim-leaf');

    if (!tempSlider || !rhSlider || !leafSlider) return;

    function updateSimulation() {
        const tAir = parseFloat(tempSlider.value);
        const rh = parseFloat(rhSlider.value);
        const leafOffset = parseFloat(leafSlider.value);
        const tLeaf = tAir + leafOffset;

        // Display current slider values
        document.getElementById('sim-temp-val').innerText = `${tAir.toFixed(1)} °C`;
        document.getElementById('sim-rh-val').innerText = `${rh.toFixed(0)} %`;
        document.getElementById('sim-leaf-val').innerText = `${leafOffset >= 0 ? '+' : ''}${leafOffset.toFixed(1)} °C (${tLeaf.toFixed(1)} °C)`;

        // Tetens Equation for Saturation Vapor Pressure [kPa]
        const vpSatAir = 0.61078 * Math.exp((17.27 * tAir) / (tAir + 237.3));
        const vpSatLeaf = 0.61078 * Math.exp((17.27 * tLeaf) / (tLeaf + 237.3));
        const vpAct = vpSatAir * (rh / 100);

        // VPD Values [kPa]
        const vpdLeaf = Math.max(0, vpSatLeaf - vpAct);
        const vpdAir = Math.max(0, vpSatAir - vpAct);

        // Dew Point via Magnus formula [°C]
        const alpha = Math.log(rh / 100) + (17.27 * tAir) / (237.3 + tAir);
        const dewPoint = (237.3 * alpha) / (17.27 - alpha);

        // Update DOM Output
        document.getElementById('sim-vpd-leaf').innerText = `${vpdLeaf.toFixed(2)} kPa`;
        document.getElementById('sim-vpd-air').innerText = `${vpdAir.toFixed(2)} kPa`;
        document.getElementById('sim-dew-point').innerText = `${dewPoint.toFixed(1)} °C`;

        // Crop Steering Zone Badge
        const badge = document.getElementById('sim-zone-badge');
        if (vpdLeaf < 0.40) {
            badge.innerText = '⚠️ Under-Transpiration / Fungal Risk';
            badge.style.background = 'rgba(239, 68, 68, 0.2)';
            badge.style.color = '#f87171';
            badge.style.border = '1px solid rgba(239, 68, 68, 0.4)';
        } else if (vpdLeaf <= 0.80) {
            badge.innerText = '🌱 Optimal Vegetative Growth';
            badge.style.background = 'rgba(56, 189, 248, 0.2)';
            badge.style.color = '#38bdf8';
            badge.style.border = '1px solid rgba(56, 189, 248, 0.4)';
        } else if (vpdLeaf <= 1.25) {
            badge.innerText = '🌸 Optimal Generative Steering (Golden Zone)';
            badge.style.background = 'rgba(16, 185, 129, 0.2)';
            badge.style.color = '#10b981';
            badge.style.border = '1px solid rgba(16, 185, 129, 0.4)';
        } else if (vpdLeaf <= 1.60) {
            badge.innerText = '⚡ High Transpiration Pull';
            badge.style.background = 'rgba(245, 158, 11, 0.2)';
            badge.style.color = '#fbbf24';
            badge.style.border = '1px solid rgba(245, 158, 11, 0.4)';
        } else {
            badge.innerText = '🛑 Severe Water Deficit / Stomatal Closure';
            badge.style.background = 'rgba(239, 68, 68, 0.25)';
            badge.style.color = '#f87171';
            badge.style.border = '1px solid rgba(239, 68, 68, 0.5)';
        }
    }

    tempSlider.addEventListener('input', updateSimulation);
    rhSlider.addEventListener('input', updateSimulation);
    leafSlider.addEventListener('input', updateSimulation);
    updateSimulation();
}

// Category Filter for Homepage Cards
function filterCategory(cat, element) {
    // Update active button chip
    const chips = document.querySelectorAll('.filter-chip');
    chips.forEach(c => c.classList.remove('active'));
    if (element) element.classList.add('active');

    const cards = document.querySelectorAll('.blog-card, .card');
    cards.forEach(card => {
        const cardCat = card.getAttribute('data-category') || '';
        if (cat === 'all' || cardCat.includes(cat)) {
            card.style.display = 'flex';
        } else {
            card.style.display = 'none';
        }
    });
}

// ======================================================================
// 🎯 PERSONALIZED TOOL RECOMMENDATION & 🎲 RANDOM EXPLORER ENGINE
// ======================================================================

const ALL_TOOLS_CATALOG = [
    {
        id: "grant_nav",
        title: "50-State Agri-Subsidy Navigator",
        url: "tools/global-agri-subsidy-grant-navigator.html",
        icon: "🏛️",
        cat: "Grants & Finance",
        facilities: ["venlo", "poly", "vertical", "research"],
        goals: ["subsidy", "energy"],
        desc: "87 verified non-dilutive farm grants across 50 US States, USDA REAP, and EU modernization programs."
    },
    {
        id: "dt_twin",
        title: "3D Venlo Digital Twin Simulator",
        url: "tools/greenhouse-3d-digital-twin-simulator.html",
        icon: "🌟",
        cat: "3D Biophysics",
        facilities: ["venlo", "research"],
        goals: ["climate", "energy"],
        desc: "Interactive WebGL 3D glasshouse microclimate and solar angle thermodynamic simulation."
    },
    {
        id: "heating_load",
        title: "Greenhouse Heating Load (DIN V 18599)",
        url: "tools/greenhouse-heating-load-thermal-screen-calculator.html",
        icon: "🔥",
        cat: "Thermodynamics",
        facilities: ["venlo", "poly"],
        goals: ["energy"],
        desc: "Peak winter heating load, thermal screen savings, and boiler / heat pump sizing."
    },
    {
        id: "dli_spectrum",
        title: "DLI Spectrum & Photomorphogenesis",
        url: "tools/dli-spectrum-photomorphogenesis-calculator.html",
        icon: "💡",
        cat: "Photobiology",
        facilities: ["vertical", "venlo", "research"],
        goals: ["climate", "energy"],
        desc: "Cumulative daily photon fluence (mol/m²d), far-red (730nm) PSS, and fixture dimming schedules."
    },
    {
        id: "agriquant",
        title: "AgriQuant Energy Commodity Terminal",
        url: "tools/agriquant-greenhouse-energy-commodity-terminal.html",
        icon: "⚡",
        cat: "Energy Arbitrage",
        facilities: ["venlo", "vertical"],
        goals: ["energy", "subsidy"],
        desc: "Real-time natural gas vs grid electricity day-ahead peak-shaving and CHP buffer tank arbitrage."
    },
    {
        id: "nutrient_calc",
        title: "Hydroponic Nutrient & EC Balancer",
        url: "tools/hydroponic-nutrient-solution-calculator.html",
        icon: "🧪",
        cat: "Nutrients",
        facilities: ["venlo", "poly", "vertical", "research"],
        goals: ["nutrient"],
        desc: "Sonneveld ion speciation, 1:100 stock tank A/B blending, and crop-specific PPM target formulas."
    },
    {
        id: "crop_steering",
        title: "Crop Steering Generative/Vegetative Matrix",
        url: "tools/crop-steering-generative-vegetative-matrix.html",
        icon: "🌱",
        cat: "Agronomy",
        facilities: ["venlo", "poly"],
        goals: ["climate", "nutrient"],
        desc: "Grodan Rockwool dryback steering, day/night temperature drop (+DIF), and generative signaling."
    },
    {
        id: "calcium_ber",
        title: "Calcium & Blossom-End Rot Risk Model",
        url: "tools/crop-transpiration-calcium-blossom-end-rot-risk-model.html",
        icon: "🍅",
        cat: "Plant Physiology",
        facilities: ["venlo", "poly"],
        goals: ["climate", "nutrient"],
        desc: "Xylem transpirational flow vs night root pressure modeling to eradicate calcium tip burn and BER."
    },
    {
        id: "mollier_dehum",
        title: "Psychrometric Mollier Dehumidifier",
        url: "tools/psychrometric-mollier-greenhouse-dehumidifier.html",
        icon: "🌧️",
        cat: "HVAC Engineering",
        facilities: ["venlo", "poly", "vertical"],
        goals: ["climate", "energy"],
        desc: "Enthalpy condensation tracking, night dew-point avoidance, and mechanical compressor sizing."
    },
    {
        id: "closed_ro",
        title: "Closed-Loop Desalination & Na⁺ Optimizer",
        url: "tools/closed-loop-reverse-osmosis-desalination-energy-optimizer.html",
        icon: "🔄",
        cat: "Water Recycling",
        facilities: ["venlo", "research"],
        goals: ["nutrient", "subsidy"],
        desc: "Closed-loop drainage sodium accumulation modeling and reverse osmosis energy recovery (ERO)."
    },
    {
        id: "co2_enrich",
        title: "CO₂ Enrichment & Photosynthesis Engine",
        url: "tools/greenhouse-co2-enrichment-optimizer.html",
        icon: "🌿",
        cat: "Photosynthesis",
        facilities: ["venlo", "vertical", "poly"],
        goals: ["climate", "energy"],
        desc: "Farquhar C3 leaf assimilation kinetics, ventilation leakage loss, and flue gas injection tuning."
    },
    {
        id: "led_thermal_cfd",
        title: "LED Luminaire Thermal CFD Optimizer",
        url: "tools/greenhouse-lighting-led-thermal-cfd-optimizer.html",
        icon: "🌡️",
        cat: "Thermal Engineering",
        facilities: ["vertical", "venlo"],
        goals: ["energy", "climate"],
        desc: "Heatsink heat dissipation modeling, microclimate convective plumes, and HVAC cooling load offset."
    },
    {
        id: "wind_snow_load",
        title: "Greenhouse Wind & Snow Structural Sizer",
        url: "tools/greenhouse-structural-wind-snow-load-nen3859-calculator.html",
        icon: "🏗️",
        cat: "Structural Engineering",
        facilities: ["venlo", "poly"],
        goals: ["energy", "subsidy"],
        desc: "NEN 3859 / DIN EN 13031-1 structural steel truss and foundation wind uplift calculations."
    },
    {
        id: "ai_vision",
        title: "AgriVision AI Crop Pathology Analyzer",
        url: "tools/agrivision-ai-crop-disease-analyzer.html",
        icon: "👁️",
        cat: "AI Diagnostics",
        facilities: ["venlo", "poly", "vertical", "research"],
        goals: ["climate", "subsidy"],
        desc: "Browser-based neural vision classifier for early powdery mildew, botrytis, and nutrient deficiencies."
    },
    {
        id: "capex_opex",
        title: "10-Year Commercial Greenhouse ROI Sizer",
        url: "tools/greenhouse-capex-opex-10year-roi-calculator.html",
        icon: "📊",
        cat: "Financial Engineering",
        facilities: ["venlo", "poly", "vertical", "research"],
        goals: ["subsidy", "energy"],
        desc: "Discounted cash flow (DCF), IRR, loan amortization, and grant capital stack modeling."
    }
];

let userPreference = {
    facility: "venlo",
    goal: "energy"
};

function initPersonalizedMatcher() {
    try {
        const saved = localStorage.getItem('inwoo_user_pref');
        if (saved) {
            userPreference = JSON.parse(saved);
        }
    } catch (e) {
        console.warn("Could not parse saved preferences", e);
    }

    // Sync button states
    document.querySelectorAll('#facilityGroup .pref-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.val === userPreference.facility);
    });
    document.querySelectorAll('#goalGroup .pref-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.val === userPreference.goal);
    });

    renderMatchedTools();
}

function setPreference(type, val, element) {
    userPreference[type] = val;
    try {
        localStorage.setItem('inwoo_user_pref', JSON.stringify(userPreference));
    } catch (e) {}

    const parent = element.parentElement;
    parent.querySelectorAll('.pref-btn').forEach(b => b.classList.remove('active'));
    element.classList.add('active');

    renderMatchedTools();
}

function renderMatchedTools() {
    const grid = document.getElementById('recomGrid');
    if (!grid) return;

    // Score tools based on match
    const scored = ALL_TOOLS_CATALOG.map(tool => {
        let score = 0;
        if (tool.facilities.includes(userPreference.facility)) score += 2;
        if (tool.goals.includes(userPreference.goal)) score += 3;
        return { ...tool, matchScore: score };
    });

    scored.sort((a, b) => b.matchScore - a.matchScore);
    const topTools = scored.slice(0, 4);

    grid.innerHTML = topTools.map(t => `
        <div style="background: rgba(15, 23, 42, 0.7); border: 1px solid rgba(56, 189, 248, 0.25); border-radius: 12px; padding: 18px; display: flex; flex-direction: column; justify-content: space-between; transition: transform 0.2s, border-color 0.2s;" onmouseenter="this.style.borderColor='#38bdf8'; this.style.transform='translateY(-2px)';" onmouseleave="this.style.borderColor='rgba(56, 189, 248, 0.25)'; this.style.transform='none';">
            <div>
                <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 8px;">
                    <span style="font-size: 1.6rem;">${t.icon}</span>
                    <span style="background: rgba(16, 185, 129, 0.15); color: #34d399; font-size: 0.7rem; font-weight: 800; padding: 2px 6px; border-radius: 4px; text-transform: uppercase;">Top Match</span>
                </div>
                <h4 style="color: #f8fafc; font-size: 1rem; margin: 0 0 6px 0; font-family: 'Outfit', sans-serif;">${t.title}</h4>
                <p style="color: #94a3b8; font-size: 0.8rem; line-height: 1.45; margin: 0 0 14px 0;">${t.desc}</p>
            </div>
            <a href="${t.url}" style="background: linear-gradient(135deg, rgba(6, 182, 212, 0.2), rgba(16, 185, 129, 0.2)); border: 1px solid rgba(16, 185, 129, 0.4); color: #34d399; text-decoration: none; padding: 8px 12px; border-radius: 8px; font-weight: 800; font-size: 0.82rem; text-align: center; display: flex; justify-content: space-between; align-items: center;">
                <span>Launch Engine</span>
                <span>→</span>
            </a>
        </div>
    `).join('');
}

function rollSurpriseTool() {
    const box = document.getElementById('surpriseCardBox');
    if (!box) return;

    const randIdx = Math.floor(Math.random() * ALL_TOOLS_CATALOG.length);
    const tool = ALL_TOOLS_CATALOG[randIdx];

    document.getElementById('surpriseIcon').textContent = tool.icon;
    document.getElementById('surpriseTitle').textContent = tool.title;
    document.getElementById('surpriseDesc').textContent = tool.desc;
    document.getElementById('surpriseLink').href = tool.url;

    box.style.display = 'block';
    box.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function closeSurprise() {
    const box = document.getElementById('surpriseCardBox');
    if (box) box.style.display = 'none';
}

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', () => {
    initPersonalizedMatcher();
});
