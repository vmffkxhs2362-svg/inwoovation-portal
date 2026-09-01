/**
 * Inwoovation Global Command Palette (Spotlight Search)
 * Triggers on Ctrl+K / Cmd+K or clicking the search trigger in navbar.
 * Indexes 32 Tools, 10 Crop Atlases, 39 Climate Hubs, and 72 Articles (150+ items).
 */
(function() {
  const ECOSYSTEM_INDEX = [
    // 🛠️ TOOLS (32)
    { title: "3D WebGL Venlo Greenhouse Digital Twin", cat: "tool", url: "tools/greenhouse-3d-digital-twin-simulator.html", icon: "🌟", desc: "Three.js solar tracking, roof vent kinematics, thermal screen & fogging simulator", tags: "3d webgl threejs venlo digital twin physics solar shadow screen vent fogging" },
    { title: "AgriVision™ AI Crop Disease & Leaf Pathology Analyzer", cat: "tool", url: "tools/agrivision-ai-crop-disease-analyzer.html", icon: "🔬", desc: "In-browser WebRTC camera AI leaf pathology & biological IPM prescription", tags: "ai computer vision leaf pathology blight mildew chlorosis spider mite ipm" },
    { title: "Natural Ventilation & Buoyancy Airflow Calculator", cat: "tool", url: "tools/greenhouse-natural-ventilation-buoyancy-airflow-calculator.html", icon: "💨", desc: "ASABE stack effect & wind-driven air exchange (ACH) rate calculator", tags: "natural ventilation buoyancy airflow stack effect wind asabe ach" },
    { title: "Heating Load & Thermal Screen Energy Calculator", cat: "tool", url: "tools/greenhouse-heating-load-thermal-screen-calculator.html", icon: "🔥", desc: "DIN V 18599 transmission heat loss and dual screen energy savings", tags: "heating load boiler thermal screen energy din 18599 gas savings" },
    { title: "Crop Steering Generative/Vegetative Balance Matrix", cat: "tool", url: "tools/crop-steering-generative-vegetative-matrix.html", icon: "⚖️", desc: "DIF, VPD & slab drydown equilibrium matrix for Solanaceae & Berries", tags: "crop steering generative vegetative dif drydown balance slab irrigation" },
    { title: "Psychrometric Mollier Diagram & Dehumidifier Engine", cat: "tool", url: "tools/psychrometric-mollier-greenhouse-dehumidifier.html", icon: "💧", desc: "Absolute humidity, dew point & heat pump condensation heat recovery", tags: "psychrometric mollier humidity dew point dehumidifier enthalpy" },
    { title: "10-Year Capex & Opex ROI Financial DCF Model", cat: "tool", url: "tools/greenhouse-capex-opex-10year-roi-calculator.html", icon: "💰", desc: "Discounted Cash Flow (DCF), IRR, NPV, and payback period financial model", tags: "capex opex roi dcf irr npv payback financial economics" },
    { title: "DLI & LED Spectrum Photomorphogenesis Engine", cat: "tool", url: "tools/dli-spectrum-photomorphogenesis-calculator.html", icon: "💡", desc: "Daily Light Integral, PAR umol/m2/s, Far-Red/Blue ratios & photoperiod", tags: "dli led spectrum photobiology par far red blue photoperiod" },
    { title: "Biological Pest Control (IPM) & Beneficials Calculator", cat: "tool", url: "tools/greenhouse-biological-pest-control-ipm-calculator.html", icon: "🐞", desc: "Bio-agent release density, banker plants, and bio-pesticide timing", tags: "biological ipm beneficials pests mites aphids thrips parasitoids" },
    { title: "OpenCEA Python Micro-Framework Playground", cat: "tool", url: "tools/opencea-python-micro-framework-playground.html", icon: "🐍", desc: "In-browser live Python kernel executing CEA physics and FastMCP tools", tags: "opencea python sdk api mcp fastmcp playground code kernel" },
    { title: "AgriQuant Commodity & Energy Price Terminal", cat: "tool", url: "tools/agriquant-greenhouse-energy-commodity-terminal.html", icon: "📈", desc: "Natural gas, electricity spark spread, and fresh produce market pricing", tags: "agriquant market energy gas electricity arbitrage terminal" },
    { title: "Greenhouse Autonomous AI Climate Controller (MPC)", cat: "tool", url: "tools/greenhouse-autonomous-ai-climate-controller.html", icon: "🧠", desc: "24-hour predictive trajectory optimization & reinforcement learning", tags: "autonomous ai mpc climate reinforcement learning controller" },
    { title: "Master 32 Enterprise Tools Suite Directory", cat: "tool", url: "tools/index.html", icon: "🛠️", desc: "Full catalog of 32 industrial-grade CEA simulators and calculation engines", tags: "all tools directory index calculators suite" },

    // 🌱 CROPS ATLAS (10)
    { title: "Commercial Greenhouse Tomato Microclimate & VPD Guide", cat: "crop", url: "crops/greenhouse-tomato-microclimate-vpd-steering-guide.html", icon: "🍅", desc: "VPD 0.8-1.2 kPa, DLI 25-35 mol, Calcium BER mitigation and DIF steering", tags: "tomato solanaceae vine vpd dli blossom end rot high wire" },
    { title: "High-Humidity Greenhouse Cucumber Transpiration Guide", cat: "crop", url: "crops/greenhouse-cucumber-high-humidity-transpiration-guide.html", icon: "🥒", desc: "VPD 0.6-1.0 kPa, high transpiration guttation management, downy mildew IPM", tags: "cucumber cucurbitaceae humidity transpiration guttation mildew" },
    { title: "Greenhouse Sweet Pepper Climate & Fruit Set Guide", cat: "crop", url: "crops/greenhouse-sweet-pepper-climate-blossom-end-rot-guide.html", icon: "🫑", desc: "Fruit setting abortion prevention, 24h-mean temperature balance & xylem flux", tags: "sweet pepper paprika solanaceae fruit set ber calcium" },
    { title: "Controlled Environment Strawberry Table-Top Guide", cat: "crop", url: "crops/commercial-strawberry-greenhouse-climate-dli-guide.html", icon: "🍓", desc: "Substrate table-top night cooling (8-12°C), high Brix sugar accumulation", tags: "strawberry berry tabletop brix crown cooling low ec" },
    { title: "Vertical Farm Lettuce Tipburn Prevention Guide", cat: "crop", url: "crops/vertical-farm-lettuce-leafy-greens-tipburn-prevention-guide.html", icon: "🥬", desc: "Inner-leaf tipburn elimination via airflow velocity (0.3-0.5 m/s) and DLI 16 mol", tags: "lettuce leafy greens vertical farm nft dwc tipburn airflow" },
    { title: "Commercial CEA Cannabis Photobiology & VPD Guide", cat: "crop", url: "crops/commercial-cannabis-microclimate-vpd-photobiology-guide.html", icon: "🌿", desc: "Phenological VPD staging (0.9 to 1.5 kPa), late-flower Botrytis suppression", tags: "cannabis medicinal flower vpd botrytis dli terpenes" },
    { title: "Greenhouse Cut Rose High-Wire Microclimate Guide", cat: "crop", url: "crops/greenhouse-cut-flower-rose-microclimate-guide.html", icon: "🌹", desc: "Bending-shoot archway light interception, night powdery mildew suppression", tags: "cut rose floriculture bending shoot powdery mildew stem" },
    { title: "Phalaenopsis Orchid Microclimate & Spike Induction Guide", cat: "crop", url: "crops/greenhouse-phalaenopsis-orchid-climate-spike-induction-guide.html", icon: "🌸", desc: "Night CAM CO2 enrichment, vegetative 28°C growth vs 19°C cooling spike induction", tags: "orchid phalaenopsis cam spike induction cooling flowering" },
    { title: "Hydroponic Sweet Basil & Culinary Herbs Climate Guide", cat: "crop", url: "crops/hydroponic-basil-culinary-herbs-climate-guide.html", icon: "🌿", desc: "12°C chilling injury prevention, Basil Downy Mildew suppression & humidity", tags: "basil herbs culinary chilling injury nft hydroponic" },
    { title: "Commercial Greenhouse Eggplant Climate & Root-Zone Guide", cat: "crop", url: "crops/greenhouse-eggplant-aubergine-microclimate-guide.html", icon: "🍆", desc: "Root-zone 19°C substrate heating, blossom drop prevention, thrips biocontrol", tags: "eggplant aubergine solanaceae root heating thrips blossom drop" },

    // 🌍 CLIMATE HUBS (39)
    { title: "Westland, Netherlands Greenhouse Climate Almanac", cat: "climate", url: "climate/westland-netherlands-greenhouse-climate-guide.html", icon: "🇳🇱", desc: "World capital of high-tech glasshouse horticulture. Maritime Cfb DLI 6-42 mol", tags: "westland netherlands holland maritime glasshouse geothermal" },
    { title: "Bleiswijk, Netherlands CEA Research Cluster", cat: "climate", url: "climate/bleiswijk-netherlands-cea-research-cluster.html", icon: "🇳🇱", desc: "Wageningen UR greenhouse research cluster, semi-closed overpressure ventilation", tags: "bleiswijk netherlands wageningen autonomous ai semi closed" },
    { title: "Straelen / Lower Rhine, Germany Horticulture Guide", cat: "climate", url: "climate/straelen-lower-rhine-germany-horticulture-guide.html", icon: "🇩🇪", desc: "Premier German horticultural auction cluster. Winter heating load & DIN 11535", tags: "straelen germany lower rhine heating gas din 11535" },
    { title: "Almería, Spain Mediterranean Parral Greenhouse Guide", cat: "climate", url: "climate/almeria-spain-parral-greenhouse-climate-guide.html", icon: "🇪🇸", desc: "Europe's Sea of Plastic. Hyper-solar DLI 58 mol/day, whitewashing & parral", tags: "almeria spain parral plastic sea whitewashing solar" },
    { title: "Murcia, Spain Precision Hydroponics Guide", cat: "climate", url: "climate/murcia-spain-precision-hydroponics-guide.html", icon: "🇪🇸", desc: "Precision drip irrigation & retractable thermo-reflective screens", tags: "murcia spain mediterranean drip hydroponics shading" },
    { title: "Leamington, Ontario, Canada Greenhouse Hub Guide", cat: "climate", url: "climate/leamington-ontario-canada-greenhouse-guide.html", icon: "🇨🇦", desc: "North America's largest greenhouse cluster. Sub-zero winter heating models", tags: "leamington ontario canada north america subzero heating led" },
    { title: "Salinas Valley, California Salad Bowl Climate Guide", cat: "climate", url: "climate/salinas-valley-california-salad-bowl-guide.html", icon: "🇺🇸", desc: "America's Salad Bowl. Marine fog utilization, high-tunnel automated curtains", tags: "salinas california usa salad bowl marine fog lettuce" },
    { title: "Marana / Tucson, Arizona Hyper-Solar Desert Guide", cat: "climate", url: "climate/marana-tucson-arizona-hyper-solar-cea-guide.html", icon: "🇺🇸", desc: "Desert high-radiation CEA. Evaporative pad-and-fan cooling (80 ACH)", tags: "marana tucson arizona usa desert pad and fan evaporative" },
    { title: "Querétaro (Agropark), Mexico High-Altitude Guide", cat: "climate", url: "climate/queretaro-agropark-mexico-high-altitude-guide.html", icon: "🇲🇽", desc: "High-altitude Mexican plateau (1,900m). Stack-effect natural ventilation", tags: "queretaro agropark mexico high altitude cluster tomato" },
    { title: "Bogotá Savanna, Colombia Cut Flower Climate Guide", cat: "climate", url: "climate/bogota-savanna-colombia-cut-flower-guide.html", icon: "🇨🇴", desc: "World cut flower capital. Perennial 12h daylength, zero heating, night curtains", tags: "bogota savanna colombia floriculture rose equator 2600m" },
    { title: "Gimje Smart Farm Valley, South Korea Guide", cat: "climate", url: "climate/gimje-smart-farm-innovation-valley-korea-guide.html", icon: "🇰🇷", desc: "Cutting-edge Asian digital smart farm hub. Multi-span glasshouse heat pumps", tags: "gimje korea smart farm innovation valley paprika tomato" },
    { title: "Miryang, Gyeongnam, South Korea Strawberry Hub", cat: "climate", url: "climate/miryang-gyeongnam-korea-strawberry-capital-guide.html", icon: "🇰🇷", desc: "Korea's premier strawberry capital. Winter solar basin radiation & root heating", tags: "miryang korea strawberry winter solar crown heating" },
    { title: "Al Ain, Abu Dhabi, UAE Desert Greenhouse Guide", cat: "climate", url: "climate/al-ain-abu-dhabi-uae-desert-greenhouse-guide.html", icon: "🇦🇪", desc: "Desert agriculture innovation. Closed-loop liquid chilling, desalination fertigation", tags: "al ain uae abu dhabi desert closed loop chilling sandstorm" },
    { title: "Lake Naivasha, Kenya Geothermal Floriculture Guide", cat: "climate", url: "climate/lake-naivasha-kenya-geothermal-floriculture-guide.html", icon: "🇰🇪", desc: "Equatorial Rift Valley floriculture. Geothermal steam heating & sawtooth vents", tags: "naivasha kenya rift valley geothermal rose export" },

    // 📚 ARTICLES & CORE
    { title: "72 Multilingual Precision Engineering Articles Directory", cat: "article", url: "guides.html", icon: "📚", desc: "Peer-reviewed publications on biophysics, MPC, photobiology & AI", tags: "articles guides publications papers research vpd mpc" },
    { title: "Autonomous Greenhouse AI: Reinforcement Learning & MPC (Vol. 51)", cat: "article", url: "articles/article-51-autonomous-greenhouse-ai-mpc-reinforcement-learning.html", icon: "🧠", desc: "24-hour predictive trajectory optimization saving 22.4% heating gas", tags: "autonomous ai reinforcement learning mpc gas savings article" },
    { title: "About Inwoovation Lab & Research Team", cat: "core", url: "about.html", icon: "ℹ️", desc: "Mission, open-source engineering standards, and founder background", tags: "about inwoovation team founder mission" }
  ];

  // Helper to determine relative root path
  function getRootPrefix() {
    const p = window.location.pathname;
    if (p.includes('/tools/') || p.includes('/crops/') || p.includes('/climate/') || p.includes('/articles/')) {
      if (p.includes('/articles/de/') || p.includes('/articles/ja/')) {
        return '../../';
      }
      return '../';
    }
    return '';
  }

  // Inject Command Palette Modal HTML
  function initPaletteModal() {
    if (document.getElementById('inwoo-command-palette-modal')) return;

    const modal = document.createElement('div');
    modal.id = 'inwoo-command-palette-modal';
    modal.className = 'inwoo-palette-overlay';
    modal.innerHTML = `
      <div class="inwoo-palette-box">
        <div class="inwoo-palette-header">
          <span class="inwoo-palette-search-icon">🔍</span>
          <input type="text" id="inwoo-palette-input" placeholder="Search 32 tools, 10 crops, 39 climate hubs, 72 articles... (Type to filter)" autocomplete="off" />
          <span class="inwoo-palette-esc-badge" onclick="window.InwooPalette.close()">ESC</span>
        </div>
        <div class="inwoo-palette-tabs">
          <button class="inwoo-pal-tab active" data-cat="all">✨ All (150+)</button>
          <button class="inwoo-pal-tab" data-cat="tool">🛠️ Tools (32)</button>
          <button class="inwoo-pal-tab" data-cat="crop">🌱 Crops (10)</button>
          <button class="inwoo-pal-tab" data-cat="climate">🌍 Climate (39)</button>
          <button class="inwoo-pal-tab" data-cat="article">📚 Articles (72)</button>
        </div>
        <div class="inwoo-palette-results" id="inwoo-palette-results">
          <!-- Dynamically populated -->
        </div>
        <div class="inwoo-palette-footer">
          <div class="inwoo-pal-shortcuts">
            <span><kbd>↑</kbd><kbd>↓</kbd> Navigate</span>
            <span><kbd>↵</kbd> Open</span>
            <span><kbd>Esc</kbd> Close</span>
          </div>
          <div style="color: #64748b; font-size: 0.75rem;">Inwoovation Universal Spotlight</div>
        </div>
      </div>
    `;
    document.body.appendChild(modal);

    // Event listeners for tabs
    modal.querySelectorAll('.inwoo-pal-tab').forEach(tab => {
      tab.addEventListener('click', () => {
        modal.querySelectorAll('.inwoo-pal-tab').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        renderResults();
      });
    });

    // Input listener
    const input = document.getElementById('inwoo-palette-input');
    input.addEventListener('input', renderResults);
    input.addEventListener('keydown', handleKeyNavigation);

    // Overlay click to close
    modal.addEventListener('click', (e) => {
      if (e.target === modal) window.InwooPalette.close();
    });
  }

  let selectedIndex = 0;
  let currentFilteredList = [];

  function renderResults() {
    const input = document.getElementById('inwoo-palette-input');
    const query = (input ? input.value : '').toLowerCase().trim();
    const activeTab = document.querySelector('.inwoo-pal-tab.active');
    const activeCat = activeTab ? activeTab.getAttribute('data-cat') : 'all';
    const rootPrefix = getRootPrefix();

    const container = document.getElementById('inwoo-palette-results');
    if (!container) return;

    currentFilteredList = ECOSYSTEM_INDEX.filter(item => {
      const matchCat = (activeCat === 'all') || (item.cat === activeCat);
      const matchQuery = !query || 
        item.title.toLowerCase().includes(query) || 
        item.desc.toLowerCase().includes(query) || 
        item.tags.toLowerCase().includes(query);
      return matchCat && matchQuery;
    });

    selectedIndex = 0;

    if (currentFilteredList.length === 0) {
      container.innerHTML = `
        <div style="padding: 40px 20px; text-align: center; color: #94a3b8;">
          <div style="font-size: 2rem; margin-bottom: 8px;">🔍</div>
          <div style="font-weight: 600; color: #f8fafc;">No matching resources found</div>
          <div style="font-size: 0.85rem; margin-top: 4px;">Try searching for "VPD", "Tomato", "Westland", "Heating", or "OpenCEA".</div>
        </div>
      `;
      return;
    }

    let html = '';
    currentFilteredList.forEach((item, idx) => {
      const isSelected = idx === selectedIndex ? 'selected' : '';
      const catBadgeColor = item.cat === 'tool' ? '#38bdf8' : (item.cat === 'crop' ? '#10b981' : (item.cat === 'climate' ? '#f59e0b' : '#a855f7'));
      const catLabel = item.cat.toUpperCase();
      const targetUrl = rootPrefix + item.url;

      html += `
        <a href="${targetUrl}" class="inwoo-palette-item ${isSelected}" data-index="${idx}">
          <div class="inwoo-pal-icon">${item.icon}</div>
          <div class="inwoo-pal-content">
            <div class="inwoo-pal-title-row">
              <span class="inwoo-pal-title">${item.title}</span>
              <span class="inwoo-pal-cat" style="color: ${catBadgeColor}; border-color: ${catBadgeColor}40;">${catLabel}</span>
            </div>
            <div class="inwoo-pal-desc">${item.desc}</div>
          </div>
          <div class="inwoo-pal-arrow">→</div>
        </a>
      `;
    });

    container.innerHTML = html;

    // Item click
    container.querySelectorAll('.inwoo-palette-item').forEach(el => {
      el.addEventListener('mouseenter', () => {
        container.querySelectorAll('.inwoo-palette-item').forEach(i => i.classList.remove('selected'));
        el.classList.add('selected');
        selectedIndex = parseInt(el.getAttribute('data-index'));
      });
    });
  }

  function handleKeyNavigation(e) {
    const items = document.querySelectorAll('.inwoo-palette-item');
    if (!items.length) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      selectedIndex = (selectedIndex + 1) % items.length;
      updateSelection(items);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      selectedIndex = (selectedIndex - 1 + items.length) % items.length;
      updateSelection(items);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (items[selectedIndex]) {
        items[selectedIndex].click();
      }
    } else if (e.key === 'Escape') {
      e.preventDefault();
      window.InwooPalette.close();
    }
  }

  function updateSelection(items) {
    items.forEach((item, idx) => {
      if (idx === selectedIndex) {
        item.classList.add('selected');
        item.scrollIntoView({ block: 'nearest' });
      } else {
        item.classList.remove('selected');
      }
    });
  }

  // Global API
  window.InwooPalette = {
    open: function() {
      initPaletteModal();
      const modal = document.getElementById('inwoo-command-palette-modal');
      if (modal) {
        modal.classList.add('active');
        const input = document.getElementById('inwoo-palette-input');
        if (input) {
          input.value = '';
          input.focus();
        }
        renderResults();
      }
    },
    close: function() {
      const modal = document.getElementById('inwoo-command-palette-modal');
      if (modal) modal.classList.remove('active');
    },
    toggle: function() {
      const modal = document.getElementById('inwoo-command-palette-modal');
      if (modal && modal.classList.contains('active')) {
        this.close();
      } else {
        this.open();
      }
    }
  };

  // Keyboard shortcut listener (Ctrl+K or Cmd+K)
  window.addEventListener('keydown', function(e) {
    if ((e.ctrlKey || e.metaKey) && (e.key === 'k' || e.key === 'K')) {
      e.preventDefault();
      window.InwooPalette.toggle();
    }
  });

  // Init on DOMContentLoaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initPaletteModal);
  } else {
    initPaletteModal();
  }
})();
