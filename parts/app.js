// AgriMaster - Global CEA Component Parametric Search & BOM Engine
// Inwoovation Lab (c) 2026

let allParts = [];
let currentCategory = 'all';
let currentCurrency = 'USD';
let currentUnitSystem = 'metric';
let leafletMap = null;
let leafletMarkers = [];

// Exchange rates relative to USD
const EXCHANGE_RATES = {
    USD: { rate: 1.0, symbol: '$', prefix: true, decimals: 2 },
    KRW: { rate: 1450.0, symbol: '₩', prefix: true, decimals: 0 },
    EUR: { rate: 0.92, symbol: '€', prefix: false, decimals: 2 }
};

// Bill of Materials (BOM) State (Stored in localStorage)
let bomCart = [];
try {
    const saved = localStorage.getItem('inwoovation_ag_bom');
    if (saved) bomCart = JSON.parse(saved);
} catch (e) {
    bomCart = [];
}

document.addEventListener('DOMContentLoaded', () => {
    detectUserCountry();
    fetchParts();
    updateBomBadge();
    initGlobalPaletteIntegration();
});

function initGlobalPaletteIntegration() {
    // If global palette is loaded, attach Ctrl+K
    if (window.InwooPalette) {
        document.addEventListener('keydown', (e) => {
            if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
                e.preventDefault();
                window.InwooPalette.open();
            }
        });
    }
}

async function fetchParts() {
    try {
        const response = await fetch('ag_parts_data.json');
        allParts = await response.json();
        updateCategoryCounts();
        filterParts();
    } catch (error) {
        console.error('Error loading parts data:', error);
    }
}

function updateCategoryCounts() {
    const counts = {
        all: allParts.length,
        irrigation: allParts.filter(p => p.category === 'irrigation').length,
        climate: allParts.filter(p => p.category === 'climate').length,
        sensors: allParts.filter(p => p.category === 'sensors').length,
        tools: allParts.filter(p => p.category === 'tools').length
    };

    document.querySelectorAll('.pill-btn').forEach(btn => {
        const cat = btn.getAttribute('data-category');
        if (cat && counts[cat] !== undefined) {
            const countSpan = btn.querySelector('.cat-count');
            if (countSpan) countSpan.textContent = `(${counts[cat]})`;
        }
    });
}

function formatPrice(usdAmount) {
    const info = EXCHANGE_RATES[currentCurrency] || EXCHANGE_RATES.USD;
    const converted = usdAmount * info.rate;
    const formatted = converted.toLocaleString(undefined, {
        minimumFractionDigits: info.decimals,
        maximumFractionDigits: info.decimals
    });
    return info.prefix ? `${info.symbol}${formatted}` : `${formatted} ${info.symbol}`;
}

function setCurrency(curr) {
    currentCurrency = curr;
    document.querySelectorAll('.currency-chip').forEach(c => {
        c.classList.toggle('active', c.getAttribute('data-curr') === curr);
    });
    renderParts(getFilteredParts());
    updateBomDrawer();
}

function setUnitSystem(system) {
    currentUnitSystem = system;
    document.querySelectorAll('.unit-chip').forEach(c => {
        c.classList.toggle('active', c.getAttribute('data-unit') === system);
    });
    renderParts(getFilteredParts());
}

function getDynamicPartData(part) {
    const pipeFilter = document.getElementById('filter-pipe')?.value || 'all';
    const voltageFilter = document.getElementById('filter-voltage')?.value || 'all';

    let dynamicName = part.name;
    let dynamicSpecs = { ...part.specs };

    if (pipeFilter !== 'all') {
        dynamicSpecs.pipe_size = pipeFilter;
        dynamicName = dynamicName.replace(/^(\d+\.?\d*["'mm]|\d+mm\s*\(\d+["']?\))/i, pipeFilter);
    }

    if (voltageFilter !== 'all') {
        dynamicSpecs.voltage = voltageFilter;
    }

    return { dynamicName, dynamicSpecs };
}

function getFilteredParts() {
    const keyword = document.getElementById('search-keyword')?.value.toLowerCase().trim() || '';
    const pipeSize = document.getElementById('filter-pipe')?.value || 'all';
    const voltage = document.getElementById('filter-voltage')?.value || 'all';
    const localOnly = document.getElementById('filter-local-only')?.checked || false;

    return allParts.filter(part => {
        if (currentCategory !== 'all' && part.category !== currentCategory) return false;

        if (keyword) {
            const nameMatch = part.name.toLowerCase().includes(keyword);
            const catMatch = (part.category_label || '').toLowerCase().includes(keyword);
            const idMatch = (part.id || '').toLowerCase().includes(keyword);
            const specsMatch = Object.values(part.specs || {}).some(val => String(val).toLowerCase().includes(keyword));
            if (!nameMatch && !catMatch && !idMatch && !specsMatch) return false;
        }

        if (pipeSize !== 'all') {
            const partPipe = (part.specs?.pipe_size || '').toLowerCase();
            if (!partPipe.includes(pipeSize.toLowerCase())) return false;
        }

        if (voltage !== 'all') {
            const partVolt = (part.specs?.voltage || '').toLowerCase();
            if (!partVolt.includes(voltage.toLowerCase())) return false;
        }

        if (localOnly && !part.local_dealer_available) return false;

        return true;
    });
}

function filterParts() {
    renderParts(getFilteredParts());
}

function setCategory(cat, btn) {
    currentCategory = cat;
    document.querySelectorAll('.pill-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    filterParts();
}

function renderParts(parts) {
    const container = document.getElementById('parts-container');
    const countEl = document.getElementById('results-count');
    if (!container) return;

    if (countEl) {
        countEl.textContent = `Showing ${parts.length} Industrial CEA Component(s)`;
    }
    container.innerHTML = '';

    if (parts.length === 0) {
        container.innerHTML = `
            <div style="grid-column: 1 / -1; text-align: center; padding: 4rem 1rem; color: var(--text-muted); background: rgba(30, 41, 59, 0.4); border-radius: 16px; border: 1px dashed rgba(255, 255, 255, 0.1);">
                <div style="font-size: 3rem; margin-bottom: 0.8rem;">🔍</div>
                <h3 style="color: #f8fafc; margin-bottom: 0.5rem; font-family: 'Outfit', sans-serif; font-size: 1.3rem;">No Matching Components Found</h3>
                <p style="font-size: 0.95rem; max-width: 500px; margin: 0 auto;">Try clearing search keywords, adjusting pipe connection sizes, or turning off the 50km local dealer filter.</p>
                <button onclick="resetFilters()" style="margin-top: 1.2rem; background: rgba(56, 189, 248, 0.15); border: 1px solid #38bdf8; color: #38bdf8; padding: 0.6rem 1.4rem; border-radius: 8px; font-weight: 700; cursor: pointer;">
                    Reset All Filters
                </button>
            </div>
        `;
        return;
    }

    parts.forEach(part => {
        const { dynamicName, dynamicSpecs } = getDynamicPartData(part);

        const card = document.createElement('div');
        card.className = 'part-card';

        // Ecosystem Link Badges
        let ecosystemLinksHtml = '';
        if (part.calculator_link) {
            ecosystemLinksHtml += `
                <a href="${part.calculator_link}" class="link-chip chip-calc" title="Open biophysical calculator to verify engineering requirements">
                    <span>🧮 ${part.calculator_label || 'Engineering Calculator'}</span> ↗
                </a>
            `;
        }
        if (part.wiki_link) {
            ecosystemLinksHtml += `
                <a href="${part.wiki_link}" class="link-chip chip-wiki" title="Read peer-reviewed research paper on physiological kinetics">
                    <span>🔬 ${part.wiki_label || 'Research Paper'}</span> ↗
                </a>
            `;
        }

        const specsHtml = Object.entries(dynamicSpecs)
            .map(([key, val]) => `<li><span>${formatSpecKey(key)}</span><strong>${val}</strong></li>`)
            .join('');

        const inBom = bomCart.some(item => item.id === part.id);
        const bomBtnText = inBom ? '✓ Added to BOM' : '+ Add to BOM';
        const bomBtnClass = inBom ? 'btn-bom-added' : 'btn-bom';

        card.innerHTML = `
            <div class="part-card-top">
                <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 0.6rem;">
                    <span class="card-tag">${part.category_label}</span>
                    <span class="part-sku">${part.id}</span>
                </div>
                <h3 class="part-title">${dynamicName}</h3>

                <!-- Cross-linked Ecosystem Badges -->
                <div class="ecosystem-chips-row">
                    ${ecosystemLinksHtml}
                </div>

                <ul class="spec-list">
                    ${specsHtml}
                </ul>
            </div>

            <div class="part-card-bottom">
                <div class="price-row">
                    <div style="display: flex; flex-direction: column;">
                        <span style="font-size:0.72rem; color:var(--text-muted); text-transform: uppercase; letter-spacing: 0.05em; font-weight: 700;">Ref. Price</span>
                        <span class="part-price">${formatPrice(part.price_usd)}</span>
                    </div>
                    <button class="${bomBtnClass}" onclick="toggleBomItem('${part.id}')" title="Add to Greenhouse Procurement BOM">
                        ${bomBtnText}
                    </button>
                </div>

                <button class="btn-check-stock" onclick="openModal('${part.id}')">
                    <span>View Procurement & 50km Dealers</span>
                    <span>→</span>
                </button>
            </div>
        `;

        container.appendChild(card);
    });
}

function resetFilters() {
    const kw = document.getElementById('search-keyword');
    if (kw) kw.value = '';
    const pipe = document.getElementById('filter-pipe');
    if (pipe) pipe.value = 'all';
    const volt = document.getElementById('filter-voltage');
    if (volt) volt.value = 'all';
    const local = document.getElementById('filter-local-only');
    if (local) local.checked = false;
    currentCategory = 'all';
    document.querySelectorAll('.pill-btn').forEach((b, i) => b.classList.toggle('active', i === 0));
    filterParts();
}

function formatSpecKey(key) {
    const map = {
        pipe_size: 'Pipe Connection',
        voltage: 'Operating Voltage',
        max_pressure: 'Max Working Pressure',
        flow_rate: 'Flow Rate / Kv',
        material: 'Wetted Material',
        torque: 'Rated Torque',
        rpm: 'Shaft Speed',
        dimensions: 'Roll Dimensions',
        shading_rate: 'Solar Shading Rate',
        energy_saving: 'Thermal Energy Saving',
        airflow: 'Max Airflow Volume',
        power: 'Motor Power',
        parameters: 'Measured Metrics',
        accuracy: 'Sensor Accuracy',
        interface: 'Output Interface',
        ppfd_output: 'Total Photon Output',
        efficacy: 'Electrical Efficacy',
        spectrum: 'Wavelength Spectrum',
        measurement_range: 'Measurement Range',
        field_of_view: 'Optical FOV'
    };
    return map[key] || key.replace(/_/g, ' ');
}

// ==========================================
// 📋 BILL OF MATERIALS (BOM) CART ENGINE
// ==========================================

function toggleBomItem(partId) {
    const idx = bomCart.findIndex(item => item.id === partId);
    if (idx >= 0) {
        bomCart.splice(idx, 1);
    } else {
        const part = allParts.find(p => p.id === partId);
        if (part) {
            bomCart.push({
                id: part.id,
                name: part.name,
                price_usd: part.price_usd,
                category: part.category,
                specs: part.specs,
                quantity: 1
            });
        }
    }
    saveBom();
    updateBomBadge();
    updateBomDrawer();
    renderParts(getFilteredParts());
}

function updateBomQuantity(partId, delta) {
    const item = bomCart.find(i => i.id === partId);
    if (item) {
        item.quantity = Math.max(1, (item.quantity || 1) + delta);
        saveBom();
        updateBomBadge();
        updateBomDrawer();
    }
}

function removeBomItem(partId) {
    bomCart = bomCart.filter(i => i.id !== partId);
    saveBom();
    updateBomBadge();
    updateBomDrawer();
    renderParts(getFilteredParts());
}

function clearBom() {
    if (confirm('Clear all items from your Greenhouse Bill of Materials?')) {
        bomCart = [];
        saveBom();
        updateBomBadge();
        updateBomDrawer();
        renderParts(getFilteredParts());
    }
}

function saveBom() {
    try {
        localStorage.setItem('inwoovation_ag_bom', JSON.stringify(bomCart));
    } catch (e) {}
}

function updateBomBadge() {
    const badgeCount = document.getElementById('bom-float-count');
    const badgeTotal = document.getElementById('bom-float-total');
    const floatBtn = document.getElementById('bom-floating-trigger');

    const totalCount = bomCart.reduce((sum, item) => sum + (item.quantity || 1), 0);
    const totalUsd = bomCart.reduce((sum, item) => sum + item.price_usd * (item.quantity || 1), 0);

    if (badgeCount) badgeCount.textContent = totalCount;
    if (badgeTotal) badgeTotal.textContent = formatPrice(totalUsd);

    if (floatBtn) {
        floatBtn.style.display = totalCount > 0 ? 'flex' : 'none';
    }
}

function toggleBomDrawer() {
    const drawer = document.getElementById('bom-drawer');
    if (!drawer) return;
    const isShown = drawer.classList.contains('open');
    if (isShown) {
        drawer.classList.remove('open');
    } else {
        updateBomDrawer();
        drawer.classList.add('open');
    }
}

function updateBomDrawer() {
    const container = document.getElementById('bom-items-container');
    const totalEl = document.getElementById('bom-drawer-total');
    if (!container) return;

    if (bomCart.length === 0) {
        container.innerHTML = `
            <div style="text-align:center; padding:3rem 1rem; color:var(--text-muted);">
                <div style="font-size:2.5rem; margin-bottom:0.5rem;">📋</div>
                <h4 style="color:#f8fafc; margin-bottom:0.4rem;">Your BOM is Empty</h4>
                <p style="font-size:0.85rem;">Click "+ Add to BOM" on any component to calculate procurement quantities and export specifications.</p>
            </div>
        `;
        if (totalEl) totalEl.textContent = formatPrice(0);
        return;
    }

    let totalUsd = 0;
    container.innerHTML = bomCart.map(item => {
        const itemTotal = item.price_usd * item.quantity;
        totalUsd += itemTotal;

        return `
            <div class="bom-item-row">
                <div style="flex:1;">
                    <div style="font-weight:700; font-size:0.9rem; color:#f8fafc;">${item.name}</div>
                    <div style="font-size:0.75rem; color:var(--text-muted); margin-top:0.2rem;">SKU: ${item.id} | Unit: ${formatPrice(item.price_usd)}</div>
                </div>
                <div class="bom-qty-controls">
                    <button onclick="updateBomQuantity('${item.id}', -1)" class="bom-qty-btn">-</button>
                    <span class="bom-qty-val">${item.quantity}</span>
                    <button onclick="updateBomQuantity('${item.id}', 1)" class="bom-qty-btn">+</button>
                </div>
                <div style="font-weight:800; color:#38bdf8; font-size:0.95rem; min-width:80px; text-align:right;">
                    ${formatPrice(itemTotal)}
                </div>
                <button onclick="removeBomItem('${item.id}')" class="bom-remove-btn" title="Remove item">✕</button>
            </div>
        `;
    }).join('');

    if (totalEl) totalEl.textContent = formatPrice(totalUsd);
}

function exportBomCsv() {
    if (bomCart.length === 0) {
        alert('Your BOM is empty.');
        return;
    }

    const today = new Date().toISOString().split('T')[0];
    let csvContent = 'data:text/csv;charset=utf-8,';
    csvContent += 'Inwoovation Lab - Greenhouse Equipment Bill of Materials (BOM)\n';
    csvContent += `Generated Date,${today}\n`;
    csvContent += `Selected Currency,${currentCurrency}\n\n`;
    csvContent += 'SKU,Component Name,Category,Quantity,Unit Price (USD),Subtotal (USD),Specs\n';

    let grandTotal = 0;
    bomCart.forEach(item => {
        const subtotal = item.price_usd * item.quantity;
        grandTotal += subtotal;
        const specsText = Object.entries(item.specs || {}).map(([k, v]) => `${k}:${v}`).join('; ');
        const cleanName = `"${item.name.replace(/"/g, '""')}"`;
        const cleanSpecs = `"${specsText.replace(/"/g, '""')}"`;

        csvContent += `${item.id},${cleanName},${item.category},${item.quantity},${item.price_usd.toFixed(2)},${subtotal.toFixed(2)},${cleanSpecs}\n`;
    });

    csvContent += `\n,,,TOTAL ESTIMATE (USD),${grandTotal.toFixed(2)}\n`;

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Inwoovation_Greenhouse_BOM_${today}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

// ==========================================
// 📍 LOCATION & INTERACTIVE LEAFLET MAP
// ==========================================

function detectUserCountry() {
    let country = "KR";
    let locationName = "Seoul (Asia)";

    try {
        const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || "";
        const lang = navigator.language || "";

        if (tz && tz.includes("/")) {
            const parts = tz.split("/");
            const continent = parts[0];
            const city = parts[1].replace(/_/g, " ");
            locationName = `${city} (${continent})`;
        } else if (tz) {
            locationName = tz;
        }

        if (tz.includes("Seoul") || tz.includes("Korea") || lang.startsWith("ko")) {
            country = "KR";
            currentCurrency = "KRW"; // Auto-set KRW for Korean visitors
        } else if (tz.includes("America") || tz.includes("US") || lang.startsWith("en-US")) {
            country = "US";
            currentCurrency = "USD";
        } else if (tz.includes("Europe") || lang.startsWith("de") || lang.startsWith("fr")) {
            country = "EU";
            currentCurrency = "EUR";
        }
    } catch (e) {}

    const badgeEl = document.getElementById('user-location-badge');
    if (badgeEl) {
        badgeEl.innerHTML = `📍 Detected Farm Location: <strong>${locationName}</strong>`;
    }

    // Update active currency chip
    document.querySelectorAll('.currency-chip').forEach(c => {
        c.classList.toggle('active', c.getAttribute('data-curr') === currentCurrency);
    });

    if (navigator.geolocation && !window.geoRequested) {
        window.geoRequested = true;
        navigator.geolocation.getCurrentPosition(
            (pos) => {
                const lat = pos.coords.latitude.toFixed(2);
                const lng = pos.coords.longitude.toFixed(2);
                if (badgeEl) {
                    badgeEl.innerHTML = `📍 Farm GPS: <strong>${lat}°, ${lng}°</strong> (${locationName})`;
                }
            },
            (err) => {},
            { timeout: 4000 }
        );
    }

    return country;
}

function renderInteractiveMap(userCountry, nearbyDealers) {
    let centerLat = 36.3504, centerLng = 127.3845, regionName = "Daejeon, Korea";
    if (userCountry === 'US') { centerLat = 40.7608; centerLng = -111.8910; regionName = "Salt Lake City, UT"; }
    if (userCountry === 'CZ' || userCountry === 'EU') { centerLat = 50.0755; centerLng = 14.4378; regionName = "Praha, Czechia"; }

    const mapContainer = document.getElementById('modal-map-view');
    if (!mapContainer || typeof L === 'undefined') return;

    if (!leafletMap) {
        leafletMap = L.map('modal-map-view', { attributionControl: false }).setView([centerLat, centerLng], 10);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 18 }).addTo(leafletMap);
    } else {
        leafletMap.setView([centerLat, centerLng], 10);
        leafletMarkers.forEach(m => leafletMap.removeLayer(m));
        leafletMarkers = [];
    }

    const globalGoogleMapUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent("Agricultural greenhouse supplies " + regionName)}`;
    leafletMap.off('click');
    leafletMap.on('click', () => { window.open(globalGoogleMapUrl, '_blank'); });

    // User Location Pin & 50km radius
    const userMarker = L.marker([centerLat, centerLng]).addTo(leafletMap)
        .bindPopup('<b>📍 Your Farm Location</b>').openPopup();
    leafletMarkers.push(userMarker);

    const radiusCircle = L.circle([centerLat, centerLng], {
        color: '#38bdf8',
        fillColor: '#0284c7',
        fillOpacity: 0.15,
        radius: 50000
    }).addTo(leafletMap);
    leafletMarkers.push(radiusCircle);

    // Nearby dealers pins
    nearbyDealers.forEach(dealer => {
        if (dealer.lat && dealer.lng) {
            const searchQuery = `${dealer.store_name} ${dealer.region}`;
            const mapUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(searchQuery)}`;

            const storeMarker = L.marker([dealer.lat, dealer.lng]).addTo(leafletMap)
                .bindPopup(`
                    <div style="font-family:sans-serif;">
                        <strong style="color:#0f172a;">🏬 ${dealer.store_name}</strong><br>
                        <span style="font-size:0.75rem; color:#475569;">📍 ${dealer.region} (${dealer.distance_km}km)</span><br>
                        <a href="${mapUrl}" target="_blank" style="display:inline-block; margin-top:0.3rem; font-size:0.75rem; color:#0284c7; font-weight:bold;">View on Google Maps ↗</a>
                    </div>
                `);
            leafletMarkers.push(storeMarker);
        }
    });

    setTimeout(() => {
        if (leafletMap) leafletMap.invalidateSize();
    }, 250);
}

function openModal(partId) {
    const part = allParts.find(p => p.id === partId);
    if (!part) return;

    const { dynamicName } = getDynamicPartData(part);

    document.getElementById('modal-part-name').textContent = dynamicName;
    document.getElementById('modal-amazon-link').href = part.amazon_link || '#';
    document.getElementById('modal-ali-link').href = part.aliexpress_link || '#';

    // Cross-link buttons in modal
    const modalLinksContainer = document.getElementById('modal-ecosystem-links');
    if (modalLinksContainer) {
        let linksHtml = '';
        if (part.calculator_link) {
            linksHtml += `
                <a href="${part.calculator_link}" target="_blank" class="btn-modal-link" style="background: rgba(16, 185, 129, 0.2); border: 1px solid #10b981; color: #34d399;">
                    <span>🧮 ${part.calculator_label || 'Launch Engineering Calculator'}</span> ↗
                </a>
            `;
        }
        if (part.wiki_link) {
            linksHtml += `
                <a href="${part.wiki_link}" target="_blank" class="btn-modal-link" style="background: rgba(56, 189, 248, 0.2); border: 1px solid #38bdf8; color: #38bdf8;">
                    <span>🔬 ${part.wiki_label || 'Read Scientific Paper'}</span> ↗
                </a>
            `;
        }
        modalLinksContainer.innerHTML = linksHtml;
    }

    const googleSearchUrl = `https://www.google.com/search?q=${encodeURIComponent(dynamicName + " greenhouse specification datasheet CAD")}`;
    const googleLinkEl = document.getElementById('modal-google-search-link');
    if (googleLinkEl) {
        googleLinkEl.href = googleSearchUrl;
    }

    const localContainer = document.getElementById('modal-local-container');
    if (part.local_dealers && part.local_dealers.length > 0) {
        const userCountry = detectUserCountry();
        const nearbyDealers = part.local_dealers.filter(d => d.country === userCountry && d.distance_km <= 50);
        const topDealers = nearbyDealers.length > 0 ? nearbyDealers.slice(0, 2) : part.local_dealers.slice(0, 2);

        renderInteractiveMap(userCountry, nearbyDealers);

        let dealersHtml = '';
        topDealers.forEach(dealer => {
            const searchQuery = `${dealer.store_name} ${dealer.region}`;
            const mapUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(searchQuery)}`;

            dealersHtml += `
                <div style="background: rgba(15, 23, 42, 0.75); border: 1px solid rgba(56, 189, 248, 0.3); border-radius: 10px; padding: 0.8rem 1rem; margin-bottom: 0.6rem; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:0.5rem;">
                    <div>
                        <div style="font-weight:700; color:#fff; font-size:0.92rem; display:flex; align-items:center; gap:0.4rem;">
                            🏬 ${dealer.store_name}
                            <span style="font-size:0.7rem; color:#38bdf8; background:rgba(56,189,248,0.15); padding:0.1rem 0.4rem; border-radius:4px;">${dealer.distance_km} km</span>
                        </div>
                        <div style="font-size:0.78rem; color:var(--text-muted); margin-top:0.2rem;">📍 ${dealer.region}</div>
                    </div>
                    <a href="${mapUrl}" target="_blank" rel="noopener" style="display:inline-flex; align-items:center; gap:0.4rem; background:#4285f4; color:#fff; font-weight:700; font-size:0.8rem; padding:0.5rem 0.8rem; border-radius:8px; text-decoration:none;">
                        📍 Google Maps ↗
                    </a>
                </div>
            `;
        });
        localContainer.innerHTML = dealersHtml;
    } else {
        localContainer.innerHTML = `
            <div style="font-size:0.82rem; color:var(--text-muted); background:rgba(255,255,255,0.03); padding:0.8rem; border-radius:8px;">
                ⚠️ Specialty engineering component. Direct wholesale sourcing recommended via <strong>Option A</strong>.
            </div>
        `;
    }

    document.getElementById('parts-modal').style.display = 'flex';
}

function closeModal() {
    document.getElementById('parts-modal').style.display = 'none';
}
