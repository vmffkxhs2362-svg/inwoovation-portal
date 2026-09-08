let allParts = [];
let currentCategory = 'all';
let leafletMap = null;
let leafletMarkers = [];

document.addEventListener('DOMContentLoaded', () => {
    detectUserCountry();
    fetchParts();
});

window.addEventListener('load', () => {
    detectUserCountry();
});

async function fetchParts() {
    try {
        detectUserCountry();
        const response = await fetch('ag_parts_data.json');
        allParts = await response.json();
        renderParts(allParts);
    } catch (error) {
        console.error('Error loading parts data:', error);
    }
}



// ⚙️ Dynamic Parametric Spec & Title Generator based on Active Filters
function getDynamicPartData(part) {
    const pipeFilter = document.getElementById('filter-pipe')?.value || 'all';
    const voltageFilter = document.getElementById('filter-voltage')?.value || 'all';

    let dynamicName = part.name;
    let dynamicSpecs = { ...part.specs };

    // Dynamically update Pipe Size if filter is active
    if (pipeFilter !== 'all') {
        dynamicSpecs.pipe_size = pipeFilter;
        // Replace initial size mention (e.g. 2" or 25mm) with selected pipe filter
        dynamicName = dynamicName.replace(/^(\d+\.?\d*["'mm]|\d+mm\s*\(\d+["']?\))/i, pipeFilter);
    }

    // Dynamically update Voltage if filter is active
    if (voltageFilter !== 'all') {
        dynamicSpecs.voltage = voltageFilter;
    }

    return { dynamicName, dynamicSpecs };
}

function renderParts(parts) {
    const container = document.getElementById('parts-container');
    const countEl = document.getElementById('results-count');
    
    countEl.textContent = `Search Results: ${parts.length} Component(s) Found`;
    container.innerHTML = '';

    if (parts.length === 0) {
        container.innerHTML = `
            <div style="grid-column: 1 / -1; text-align: center; padding: 4rem 1rem; color: var(--text-gray);">
                <div style="font-size: 2.5rem; margin-bottom: 0.5rem;">🔍</div>
                <h3 style="color: #fff; margin-bottom: 0.5rem;">No Matching Components Found</h3>
                <p>Try adjusting your search keywords, pipe sizes, or operating voltage filters.</p>
            </div>
        `;
        return;
    }

    parts.forEach(part => {
        const { dynamicName, dynamicSpecs } = getDynamicPartData(part);

        const card = document.createElement('div');
        card.className = 'part-card';

        const specsHtml = Object.entries(dynamicSpecs)
            .map(([key, val]) => `<li><span>${formatSpecKey(key)}</span><strong>${val}</strong></li>`)
            .join('');

        card.innerHTML = `
            <div>
                <span class="card-tag">${part.category_label}</span>
                <div class="part-title">${dynamicName}</div>
                <ul class="spec-list">
                    ${specsHtml}
                </ul>
            </div>
            <div>
                <div class="price-row">
                    <span style="font-size:0.78rem; color:var(--text-gray);">Ref. Price</span>
                    <span class="part-price">From $${part.price_usd.toFixed(2)} USD</span>
                </div>

                <button class="btn-check-stock" onclick="openModal('${part.id}')">
                    View Component Options ↗
                </button>
            </div>
        `;

        container.appendChild(card);
    });
}

function formatSpecKey(key) {
    const map = {
        pipe_size: 'Pipe / Connection',
        voltage: 'Voltage',
        max_pressure: 'Max Pressure',
        flow_rate: 'Flow Rate',
        material: 'Material'
    };
    return map[key] || key;
}

function setCategory(cat, btn) {
    currentCategory = cat;
    document.querySelectorAll('.pill-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    filterParts();
}

function filterParts() {
    const keyword = document.getElementById('search-keyword').value.toLowerCase().trim();
    const pipeSize = document.getElementById('filter-pipe').value;
    const voltage = document.getElementById('filter-voltage').value;
    const localOnly = document.getElementById('filter-local-only').checked;

    const filtered = allParts.filter(part => {
        // Category Filter
        if (currentCategory !== 'all' && part.category !== currentCategory) {
            return false;
        }

        // Keyword Filter
        if (keyword) {
            const nameMatch = part.name.toLowerCase().includes(keyword);
            const catMatch = part.category_label.toLowerCase().includes(keyword);
            const idMatch = part.id.toLowerCase().includes(keyword);
            if (!nameMatch && !catMatch && !idMatch) return false;
        }

        // Local Dealer Only Filter
        if (localOnly && !part.local_dealer_available) {
            return false;
        }

        return true;
    });

    renderParts(filtered);
}

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
        } else if (lang) {
            locationName = `Region (${lang})`;
        }

        if (tz.includes("Seoul") || tz.includes("Korea") || lang.startsWith("ko")) {
            country = "KR";
            if (!tz) locationName = "Seoul (Asia)";
        } else if (tz.includes("America") || tz.includes("US") || lang.startsWith("en-US")) {
            country = "US";
            if (!tz) locationName = "Utah (America)";
        } else if (tz.includes("Europe") || lang.startsWith("cs") || lang.startsWith("de")) {
            country = "CZ";
            if (!tz) locationName = "Prague (Europe)";
        }
    } catch (e) {
        console.error("Timezone detection error: ", e);
    }

    // 📍 1. 즉시 타임존 감지 결과 뱃지 업데이트
    const updateBadge = (name) => {
        const badgeEl = document.getElementById('user-location-badge');
        if (badgeEl) {
            badgeEl.innerHTML = `📍 Detected Farm Location: <strong>${name}</strong>`;
        }
    };

    updateBadge(locationName);

    // 📍 2. 브라우저 GPS 허용 시 더 정밀한 GPS 좌표로 실시간 업그레이드
    if (navigator.geolocation && !window.geoRequested) {
        window.geoRequested = true;
        navigator.geolocation.getCurrentPosition(
            (pos) => {
                const lat = pos.coords.latitude.toFixed(2);
                const lng = pos.coords.longitude.toFixed(2);
                updateBadge(`GPS (${lat}°, ${lng}°) - ${locationName}`);
            },
            (err) => {
                // GPS 미허용 시 타임존 지역명 유지
            },
            { timeout: 3000 }
        );
    }

    return country;
}




function renderInteractiveMap(userCountry, nearbyDealers) {
    let centerLat = 36.3504, centerLng = 127.3845, regionName = "Daejeon, Korea";
    if (userCountry === 'US') { centerLat = 40.7608; centerLng = -111.8910; regionName = "Salt Lake City, UT"; }
    if (userCountry === 'CZ') { centerLat = 50.0755; centerLng = 14.4378; regionName = "Praha, Czechia"; }

    const mapContainer = document.getElementById('modal-map-view');
    if (!mapContainer) return;

    if (!leafletMap) {
        leafletMap = L.map('modal-map-view', { attributionControl: false }).setView([centerLat, centerLng], 10);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 18
        }).addTo(leafletMap);
    } else {
        leafletMap.setView([centerLat, centerLng], 10);
        leafletMarkers.forEach(m => leafletMap.removeLayer(m));
        leafletMarkers = [];
    }

    // Click map to open Google Maps search
    const globalGoogleMapUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent("Agricultural supplies " + regionName)}`;
    
    leafletMap.off('click');
    leafletMap.on('click', () => {
        window.open(globalGoogleMapUrl, '_blank');
    });

    // 🔴 1. User Location Pin & 50km Circle
    const userMarker = L.marker([centerLat, centerLng]).addTo(leafletMap)
        .bindPopup('<b>📍 Your Farm Location</b>').openPopup();
    leafletMarkers.push(userMarker);

    const radiusCircle = L.circle([centerLat, centerLng], {
        color: '#38bdf8',
        fillColor: '#0284c7',
        fillOpacity: 0.15,
        radius: 50000 // 50km
    }).addTo(leafletMap);
    leafletMarkers.push(radiusCircle);

    // 🏬 2. Dealer Pins within 50km
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
    }, 200);
}

function openModal(partId) {
    const part = allParts.find(p => p.id === partId);
    if (!part) return;

    // ⚙️ Compute Dynamic Spec & Name based on active filters
    const { dynamicName } = getDynamicPartData(part);

    document.getElementById('modal-part-name').textContent = dynamicName;
    document.getElementById('modal-amazon-link').href = part.amazon_link;
    document.getElementById('modal-ali-link').href = part.aliexpress_link;

    // 🔍 Option C: Generate 1-Click Google Search Link for Exact Spec
    const googleSearchUrl = `https://www.google.com/search?q=${encodeURIComponent(dynamicName)}`;
    const googleLinkEl = document.getElementById('modal-google-search-link');
    if (googleLinkEl) {
        googleLinkEl.href = googleSearchUrl;
    }

    const localContainer = document.getElementById('modal-local-container');
    
    if (part.local_dealers && part.local_dealers.length > 0) {
        let dealersHtml = '';
        
        const userCountry = detectUserCountry();
        const nearbyDealers = part.local_dealers.filter(dealer => dealer.country === userCountry && dealer.distance_km <= 50);
        const topTwoDealers = nearbyDealers.slice(0, 2);

        renderInteractiveMap(userCountry, nearbyDealers);

        if (topTwoDealers.length > 0) {
            topTwoDealers.forEach(dealer => {
                const searchQuery = `${dealer.store_name} ${dealer.region}`;
                const mapUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(searchQuery)}`;

                dealersHtml += `
                    <div style="background: rgba(15, 23, 42, 0.7); border: 1px solid rgba(56, 189, 248, 0.3); border-radius: 10px; padding: 0.8rem 1rem; margin-bottom: 0.6rem; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:0.5rem;">
                        <div>
                            <div style="font-weight:700; color:#fff; font-size:0.92rem; display:flex; align-items:center; gap:0.4rem;">
                                🏬 ${dealer.store_name}
                                <span style="font-size:0.7rem; color:#38bdf8; background:rgba(56,189,248,0.15); padding:0.1rem 0.4rem; border-radius:4px;">${dealer.distance_km} km</span>
                            </div>
                            <div style="font-size:0.78rem; color:var(--text-gray); margin-top:0.2rem;">📍 ${dealer.region}</div>
                        </div>
                        <a href="${mapUrl}" target="_blank" rel="noopener" style="display:inline-flex; align-items:center; gap:0.4rem; background:#4285f4; color:#fff; font-weight:700; font-size:0.8rem; padding:0.5rem 0.8rem; border-radius:8px; text-decoration:none;">
                            📍 View on Google Maps ↗
                        </a>
                    </div>
                `;
            });
            localContainer.innerHTML = dealersHtml;
        } else {
            localContainer.innerHTML = `
                <div style="font-size:0.82rem; color:var(--text-gray); background:rgba(255,255,255,0.03); padding:0.8rem; border-radius:8px;">
                    ⚠️ No local dealers carrying this specification within 50km of your farm. Please use <strong>Option A (Direct Buy)</strong>.
                </div>
            `;
        }
    } else {
        localContainer.innerHTML = `
            <div style="font-size:0.82rem; color:var(--text-gray); background:rgba(255,255,255,0.03); padding:0.8rem; border-radius:8px;">
                ⚠️ This specialty engineering component is unlikely to be stocked at general local farm stores. Please use <strong>Option A (Direct Buy)</strong>.
            </div>
        `;
    }

    document.getElementById('parts-modal').style.display = 'flex';
}

function closeModal() {
    document.getElementById('parts-modal').style.display = 'none';
}
