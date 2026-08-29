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
