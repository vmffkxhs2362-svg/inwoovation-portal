/**
 * Inwoovation Global Command Palette (Spotlight Search)
 * Triggers on Ctrl+K / Cmd+K or clicking the search trigger in navbar.
 * Indexes 41 Enterprise Tools, 15 Smart Farm Simulators, 10 Crop Atlases, 40 Climate Hubs, 52 Wiki Modules, and 143 Multilingual Articles (330+ items).
 */
(function() {
  const ECOSYSTEM_INDEX = [
    // 🛠️ TOOLS (41 Enterprise Tools + Meister Hub)
    { title: "VenloCAD 3D - Industrial Parametric Greenhouse CAD & Structural Engineering Engine", cat: "tool", url: "tools/venlocad-3d.html", icon: "📐", desc: "Industrial 3D parametric CAD and structural engineering engine for Venlo greenhouses. Features real-time WebGL frame generation...", tags: "venlocad 3d venlocad 3d  industrial parametric greenhouse cad  structural engineering engine" },
    { title: "EU Greenhouse Energy Audit (DIN V 18599 / BLE Grant) & Farm Succession (Hofnachfolge) ROI Simulator", cat: "tool", url: "tools/eu-greenhouse-energy-hofnachfolge-roi-simulator.html", icon: "🇩🇪", desc: "Interactive European glasshouse energy modernization (DIN V 18599, EN 13031-1, BLE 40% CAPEX grant, BEHG CO2 tax savings) and G...", tags: "eu greenhouse energy hofnachfolge roi simulator eu greenhouse energy audit din v 18599  ble grant  farm succession hofnachfolge roi simulator" },
    { title: "Deutscher Gartenbau-Meister & KTBL-Standard Rechner", cat: "tool", url: "meister.html", icon: "🇩🇪", desc: "KTBL Deckungsbeitragsrechner (DB I & II), DIN V 18599 Heizlast, QS-GAP 2026 / ToBRFV Menno Florades Desinfektion & ZVG Meisterprüfung Teil III", tags: "deutschland meister gartenbau ktbl deckungsbeitrag dbi din18599 qsgap ifs tobrfv menno florades svlfg knoblauchsland nuernberg" },
    { title: "3D WebGL Venlo Greenhouse Digital Twin & Real-Time Physics Simulator", cat: "tool", url: "tools/greenhouse-3d-digital-twin-simulator.html", icon: "🛠️", desc: "Interactive 3D WebGL Venlo glasshouse digital twin. Real-time solar trajectory shadow mapping, dynamic thermal screen deploymen...", tags: "greenhouse 3d digital twin simulator 3d webgl venlo greenhouse digital twin  realtime physics simulator" },
    { title: "AgriVision: In-Browser AI Computer Vision Crop Disease & Deficiency Analyzer", cat: "tool", url: "tools/agrivision-ai-crop-disease-analyzer.html", icon: "🛠️", desc: "Client-side AI computer vision analyzer for greenhouse leaf pathology. Real-time webcam or image upload, spectral chlorosis seg...", tags: "agrivision ai crop disease analyzer agrivision inbrowser ai computer vision crop disease  deficiency analyzer" },
    { title: "Global Agri-Subsidy & Grant Navigator", cat: "tool", url: "tools/global-agri-subsidy-grant-navigator.html", icon: "🛠️", desc: "Official California (CDFA SWEEP/HSP/AMMP/FPIP/PHP/OTPP, CARB FARMER, CEC), USDA, European (BLE/GAP), and South Korean agricultu...", tags: "global agri subsidy grant navigator global agrisubsidy  grant navigator" },
    { title: "Commercial CEA Feasibility & Grant Dossier Generator", cat: "tool", url: "tools/commercial-feasibility-grant-dossier-generator.html", icon: "🛠️", desc: "Institutional agricultural feasibility modeler and non-dilutive grant dossier generator across 50 US states. Computes CAPEX, OP...", tags: "commercial feasibility grant dossier generator commercial cea feasibility  grant dossier generator" },
    { title: "AgriQuant Commercial CEA Energy & Commodity Terminal", cat: "tool", url: "tools/agriquant-greenhouse-energy-commodity-terminal.html", icon: "🛠️", desc: "Open-source financial and energy quant terminal for commercial high-tech greenhouses. Simulates Dutch TTF natural gas prices, e...", tags: "agriquant greenhouse energy commodity terminal agriquant commercial cea energy  commodity terminal" },
    { title: "Aquifer Thermal Energy Storage (ATES) & Heat Pump Sizing Simulator", cat: "tool", url: "tools/ates-aquifer-thermal-energy-storage-heat-pump-simulator.html", icon: "🛠️", desc: "Industrial CEA Aquifer Thermal Energy Storage (ATES) doublet well and heat pump simulator. Models warm/cold well seasonal hydra...", tags: "ates aquifer thermal energy storage heat pump simulator aquifer thermal energy storage ates  heat pump sizing simulator" },
    { title: "CHP Flue Gas SCR Denitrification & Urea Dosing Calculator", cat: "tool", url: "tools/chp-flue-gas-scr-urea-dosing-calculator.html", icon: "🛠️", desc: "Industrial Selective Catalytic Reduction (SCR) calculator for natural gas CHP engines. Compute stoichiometric urea dosing, NOx ...", tags: "chp flue gas scr urea dosing calculator chp flue gas scr denitrification  urea dosing calculator" },
    { title: "Closed-Loop Hydroponic Drainage Recirculation & Ion Balance Simulator", cat: "tool", url: "tools/closed-loop-nutrient-recirculation-ion-balance-simulator.html", icon: "🛠️", desc: "Commercial greenhouse closed-loop hydroponics drainage reuse simulator. Models multi-cycle Na/Cl accumulation, Davies ionic act...", tags: "closed loop nutrient recirculation ion balance simulator closedloop hydroponic drainage recirculation  ion balance simulator" },
    { title: "Closed-Loop RO Desalination & Energy Recovery Optimizer", cat: "tool", url: "tools/closed-loop-reverse-osmosis-desalination-energy-optimizer.html", icon: "🛠️", desc: "Industrial engineering calculator for greenhouse reverse osmosis (RO) membrane flux (LMH), specific energy consumption (kWh/m3)...", tags: "closed loop reverse osmosis desalination energy optimizer closedloop ro desalination  energy recovery optimizer" },
    { title: "Biochemical Farquhar (FvCB) Leaf Photosynthesis Calculator", cat: "tool", url: "tools/co2-enrichment-leaf-photosynthesis-farquhar-calculator.html", icon: "🛠️", desc: "Industrial plant physiology calculator for Farquhar-von Caemmerer-Berry (FvCB) C3 leaf photosynthesis, Rubisco kinetics (Vcmax)...", tags: "co2 enrichment leaf photosynthesis farquhar calculator biochemical farquhar fvcb leaf photosynthesis calculator" },
    { title: "Commercial Crop Steering Matrix (Generative vs Vegetative)", cat: "tool", url: "tools/crop-steering-generative-vegetative-matrix.html", icon: "🛠️", desc: "Industrial crop steering optimizer for high-wire greenhouse tomatoes, peppers, and cannabis. Calculate 24h DIF, VPD differentia...", tags: "crop steering generative vegetative matrix commercial crop steering matrix generative vs vegetative" },
    { title: "Xylem Calcium Flux & Blossom-End Rot (BER) Risk Engine", cat: "tool", url: "tools/crop-transpiration-calcium-blossom-end-rot-risk-model.html", icon: "🛠️", desc: "Industrial plant physiology calculator for xylem calcium transport kinetics, transpiration pull, and Blossom-End Rot (BER) risk...", tags: "crop transpiration calcium blossom end rot risk model xylem calcium flux  blossomend rot ber risk engine" },
    { title: "Crop Yield & Biomass Accumulation DLI Forecaster", cat: "tool", url: "tools/crop-yield-biomass-dli-forecaster.html", icon: "🛠️", desc: "Predictive photosynthetic dry matter accumulation, Light Use Efficiency (LUE), and weekly commercial crop harvest yields based ...", tags: "crop yield biomass dli forecaster crop yield  biomass accumulation dli forecaster" },
    { title: "Greenhouse Digital Twin Microclimate Simulator", cat: "tool", url: "tools/digital-twin-greenhouse-simulator.html", icon: "🛠️", desc: "Industrial-grade interactive Venlo greenhouse digital twin simulator. Model real-time solar radiation, VPD, crop transpiration,...", tags: "digital twin greenhouse simulator greenhouse digital twin microclimate simulator" },
    { title: "Commercial Greenhouse DLI & LED Spectrum Photomorphogenesis Calculator", cat: "tool", url: "tools/dli-spectrum-photomorphogenesis-calculator.html", icon: "🛠️", desc: "Industrial-grade Daily Light Integral (DLI) & Far-Red (730nm) Emerson Enhancement Effect spectral calculator for commercial gre...", tags: "dli spectrum photomorphogenesis calculator commercial greenhouse dli  led spectrum photomorphogenesis calculator" },
    { title: "Greenhouse Hourly Penman-Monteith Evapotranspiration (ETc) Calculator", cat: "tool", url: "tools/evapotranspiration-penman-monteith-calculator.html", icon: "🛠️", desc: "Industrial FAO-56 Penman-Monteith hourly crop evapotranspiration (ETc), canopy resistance (rc), and aerodynamic resistance (ra)...", tags: "evapotranspiration penman monteith calculator greenhouse hourly penmanmonteith evapotranspiration etc calculator" },
    { title: "High-Pressure Fogging & Evaporative Cooling Droplet Engine", cat: "tool", url: "tools/fogging-nozzle-droplet-evaporative-cooling-engine.html", icon: "🛠️", desc: "Industrial 70 bar high-pressure fogging calculator. Compute Sauter Mean Diameter (D32 < 10µm), flash evaporation rates, adiabat...", tags: "fogging nozzle droplet evaporative cooling engine highpressure fogging  evaporative cooling droplet engine" },
    { title: "Autonomous Climate Computer AI & Model Predictive Control (MPC) Simulator", cat: "tool", url: "tools/greenhouse-autonomous-ai-climate-controller.html", icon: "🛠️", desc: "Reinforcement learning and Model Predictive Control (MPC) simulator for autonomous greenhouse climate computers, optimizing 24h...", tags: "greenhouse autonomous ai climate controller autonomous climate computer ai  model predictive control mpc simulator" },
    { title: "Greenhouse Biological Pest Control (IPM) & Predator Release Calculator", cat: "tool", url: "tools/greenhouse-biological-pest-control-ipm-calculator.html", icon: "🛠️", desc: "Industrial Integrated Pest Management (IPM) bio-control calculator for commercial greenhouses. Calculate predatory mite (Phytos...", tags: "greenhouse biological pest control ipm calculator greenhouse biological pest control ipm  predator release calculator" },
    { title: "Greenhouse Biomass CHP & Waste Heat ROI Simulator", cat: "tool", url: "tools/greenhouse-biomass-chp-energy-roi-calculator.html", icon: "🛠️", desc: "Interactive precision engineering calculator for greenhouse biomass-fired CHP systems: model wood-chip fuel costs, fossil natur...", tags: "greenhouse biomass chp energy roi calculator greenhouse biomass chp  waste heat roi simulator" },
    { title: "Commercial Greenhouse 10-Year CapEx, OpEx, IRR & NPV Investment Engine", cat: "tool", url: "tools/greenhouse-capex-opex-10year-roi-calculator.html", icon: "🛠️", desc: "Industrial financial engineering calculator for high-tech commercial glasshouse investments: CapEx breakdown, 10-year OpEx cash...", tags: "greenhouse capex opex 10year roi calculator commercial greenhouse 10year capex opex irr  npv investment engine" },
    { title: "Greenhouse CO2 Enrichment & Economics Optimizer", cat: "tool", url: "tools/greenhouse-co2-enrichment-optimizer.html", icon: "🛠️", desc: "Industrial CO2 dosing kinetics and economics optimizer. Calculate pure liquid vs flue gas dosing costs, ventilation purge losse...", tags: "greenhouse co2 enrichment optimizer greenhouse co2 enrichment  economics optimizer" },
    { title: "Greenhouse Heating Load, Thermal Screen & Green Energy Transition Sizer (DIN V 18599)", cat: "tool", url: "tools/greenhouse-heating-load-thermal-screen-calculator.html", icon: "🛠️", desc: "Commercial engineering calculator for greenhouse peak heating demand, DIN V 18599 thermal screen savings, hydronic pipe rail si...", tags: "greenhouse heating load thermal screen calculator greenhouse heating load thermal screen  green energy transition sizer din v 18599" },
    { title: "Horticultural LED Thermal Heat-Sink & Junction Temperature (Tj) Optimizer", cat: "tool", url: "tools/greenhouse-lighting-led-thermal-cfd-optimizer.html", icon: "🛠️", desc: "Industrial engineering calculator for horticultural LED fixture thermal dissipation, junction temperature (Tj), photon efficacy...", tags: "greenhouse lighting led thermal cfd optimizer horticultural led thermal heatsink  junction temperature tj optimizer" },
    { title: "Greenhouse HAF Air Circulation & CFD Air Velocity Optimizer", cat: "tool", url: "tools/greenhouse-microclimate-cfd-air-velocity-optimizer.html", icon: "🛠️", desc: "Industrial CFD calculator for horizontal air flow (HAF) fan spacing, jet throw distance, Bernoulli air entrainment, and microcl...", tags: "greenhouse microclimate cfd air velocity optimizer greenhouse haf air circulation  cfd air velocity optimizer" },
    { title: "Smart Greenhouse Edge IoT & MQTT Telemetry Fleet Simulator", cat: "tool", url: "tools/greenhouse-mqtt-edge-iot-fleet-simulator.html", icon: "🛠️", desc: "Industrial IoT simulator streaming real-time MQTT telemetry across 100 virtual greenhouse microclimate, slab TDR, and PAR senso...", tags: "greenhouse mqtt edge iot fleet simulator smart greenhouse edge iot  mqtt telemetry fleet simulator" },
    { title: "Greenhouse Natural Ventilation & Buoyancy-Driven Airflow Calculator", cat: "tool", url: "tools/greenhouse-natural-ventilation-buoyancy-airflow-calculator.html", icon: "🛠️", desc: "Calculate natural ventilation rates, buoyancy-driven (stack effect) and wind-driven airflow through greenhouse vents using ASAB...", tags: "greenhouse natural ventilation buoyancy airflow calculator greenhouse natural ventilation  buoyancydriven airflow calculator" },
    { title: "Greenhouse Structural Wind, Snow & Crop Load (EN 13031-1 / NEN 3859)", cat: "tool", url: "tools/greenhouse-structural-wind-snow-load-nen3859-calculator.html", icon: "🛠️", desc: "Industrial structural engineering calculator for Venlo greenhouse wind pressure (qw), snow load (qs), trellised crop wire weigh...", tags: "greenhouse structural wind snow load nen3859 calculator greenhouse structural wind snow  crop load en 130311  nen 3859" },
    { title: "Hydroponic Chemical Speciation & Mineral Precipitation Index (SI)", cat: "tool", url: "tools/hydroponic-chemical-speciation-precipitation-index.html", icon: "🛠️", desc: "Industrial chemical speciation calculator for hydroponic nutrient solutions: Debye-Hückel ionic strength, ion activity coeffici...", tags: "hydroponic chemical speciation precipitation index hydroponic chemical speciation  mineral precipitation index si" },
    { title: "Hydroponic Nutrient Formulation & Ion Balance Calculator", cat: "tool", url: "tools/hydroponic-nutrient-solution-calculator.html", icon: "🛠️", desc: "Industrial-grade commercial hydroponic nutrient solution calculator. Optimize Hoagland, Sonneveld, and Steiner ionic ratios (NO...", tags: "hydroponic nutrient solution calculator hydroponic nutrient formulation  ion balance calculator" },
    { title: "Greenhouse Nutrient Uptake Concentration Factor (UCF) & Drain-to-Waste Analyzer", cat: "tool", url: "tools/nutrient-uptake-concentration-factor-analyzer.html", icon: "🛠️", desc: "Model nutrient uptake concentration factors in recirculating and drain-to-waste hydroponic systems. Simulate EC drift, ion accu...", tags: "nutrient uptake concentration factor analyzer greenhouse nutrient uptake concentration factor ucf  draintowaste analyzer" },
    { title: "OpenCEA Developer Hub & Interactive REST API / MCP Playground", cat: "tool", url: "tools/opencea-python-micro-framework-playground.html", icon: "🛠️", desc: "Open-access developer documentation, interactive REST API playground, and open-source MCP server for greenhouse physics, VPD, D...", tags: "opencea python micro framework playground opencea developer hub  interactive rest api  mcp playground" },
    { title: "Canopy Light Extinction (Beer-Lambert & LAI) Calculator", cat: "tool", url: "tools/par-far-red-canopy-extinction-beer-lambert-calculator.html", icon: "🛠️", desc: "Industrial plant physiology calculator for multi-layer canopy light extinction (Beer-Lambert Law), Leaf Area Index (LAI), and d...", tags: "par far red canopy extinction beer lambert calculator canopy light extinction beerlambert  lai calculator" },
    { title: "Psychrometric Mollier Diagram & Greenhouse Dehumidification Optimizer", cat: "tool", url: "tools/psychrometric-mollier-greenhouse-dehumidifier.html", icon: "🛠️", desc: "Industrial psychrometric air state and greenhouse dehumidification energy optimizer. Compare mechanical heat pumps vs ridge ven...", tags: "psychrometric mollier greenhouse dehumidifier psychrometric mollier diagram  greenhouse dehumidification optimizer" },
    { title: "Rockwool Slab TDR Moisture & Drain EC Balancing Optimizer", cat: "tool", url: "tools/rockwool-substrate-tdr-moisture-drain-optimizer.html", icon: "🛠️", desc: "Industrial substrate water content (VWC %), dry-down kinetics, and drainage EC balancing calculator for commercial rockwool sla...", tags: "rockwool substrate tdr moisture drain optimizer rockwool slab tdr moisture  drain ec balancing optimizer" },
    { title: "Semi-Closed Greenhouse ATU & Mollier h-x Psychrometric 3D Simulator", cat: "tool", url: "tools/semi-closed-greenhouse-atu-mollier-simulator.html", icon: "🛠️", desc: "산업용 반밀폐 온실(Semi-Closed Greenhouse) 공조기(ATU) 및 몰리에르 선도(Mollier h-x) 실시간 3D 열역학 시뮬레이터. Kubo Ultra-Clima & Van der Hoeven ModulAIR...", tags: "semi closed greenhouse atu mollier simulator semiclosed greenhouse atu  mollier hx psychrometric 3d simulator" },
    { title: "Substrate Matric Potential (pF Curve & van Genuchten) Calculator", cat: "tool", url: "tools/soil-matrix-water-potential-matric-suction-calculator.html", icon: "🛠️", desc: "Industrial agricultural physics calculator for substrate matric water potential (Psi_m), pF retention curves, van Genuchten mod...", tags: "soil matrix water potential matric suction calculator substrate matric potential pf curve  van genuchten calculator" },
    { title: "Hot Water Buffer Tank Thermal Storage & Stratification Sizing", cat: "tool", url: "tools/solar-thermal-buffer-tank-stratification-calculator.html", icon: "🛠️", desc: "Industrial engineering calculator for greenhouse hot-water buffer tank thermal storage (MWh), thermocline stratification stabil...", tags: "solar thermal buffer tank stratification calculator hot water buffer tank thermal storage  stratification sizing" },
    { title: "Closed-Loop UV-C Disinfection & Pathogen Log-Reduction Calculator", cat: "tool", url: "tools/uvc-drainage-pathogen-disinfection-calculator.html", icon: "🛠️", desc: "Industrial UV-C radiation dose (mJ/cm2), UVT% water transmissivity, and Chick-Watson log-reduction kinetics for ToBRFV, Pythium...", tags: "uvc drainage pathogen disinfection calculator closedloop uvc disinfection  pathogen logreduction calculator" },
    { title: "Master 41 Enterprise Tools Suite Directory", cat: "tool", url: "tools/index.html", icon: "🛠️", desc: "Full catalog of 41 industrial-grade CEA simulators and calculation engines", tags: "all tools directory index calculators suite" },
    { title: "Deutscher Meisterfunk — Gartenbau & Wissenschaftspodcast (Folge 1–22)", cat: "article", url: "podcasts/index.html", icon: "🎙️", desc: "Täglicher Fachpodcast (A2/B1 bis Fachdeutsch): Weltnachrichten, Pflanzenphysiologie, VPD, IPM, KTBL & QS-GAP 2026 mit Audio-Player & RSS", tags: "podcast meisterfunk deutsch hoertraining audio mp3 rss youtube music gartenbau meisterpruefung" },
    { title: "Industrial Vacuum Systems & Semiconductor Equipment Suite", cat: "part", url: "parts/vacuum-systems.html", icon: "🔬", desc: "Ultra-high vacuum evaporators (DEV), magnetron sputtering (DSP), inert glove boxes (DGB) & Swagelok fittings", tags: "vacuum semiconductor evaporator sputter glove box swagelok uhv pump pvd kf cf fittings" },

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

    // 🌍 CLIMATE HUBS (40)
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
    { title: "EU Greenhouse Energy Audit (DIN V 18599), BLE 40% Grants & Hofnachfolge (Vol. 78)", cat: "article", url: "articles/article-78-eu-greenhouse-energy-audit-din-18599-ble-grant-hofnachfolge.html", icon: "🇩🇪", desc: "DIN V 18599 U-value retrofits, German BLE 40% grants, BEHG/ETS-2 carbon tax & 10-year Ertragspacht/Stille Beteiligung buyout engineering", tags: "article 78 eu germany din 18599 ble grant behg ets2 carbon tax hofnachfolge ertragspacht stille beteiligung ktbl" },
    { title: "78 Multilingual Precision Engineering Articles Directory (143 Editions)", cat: "article", url: "guides.html", icon: "📚", desc: "Peer-reviewed publications on biophysics, MPC, photobiology & AI in EN, DE, and JA", tags: "articles guides publications papers research vpd mpc deutsch japanese" },
    { title: "Autonomous Greenhouse AI: Reinforcement Learning & MPC (Vol. 51)", cat: "article", url: "articles/article-51-autonomous-greenhouse-ai-mpc-reinforcement-learning.html", icon: "🧠", desc: "24-hour predictive trajectory optimization saving 22.4% heating gas", tags: "autonomous ai reinforcement learning mpc gas savings article" },
    // 🧪 SMART FARM LAB SIMULATORS (15)
    { title: "Smart Farm Engineering Lab Dashboard", cat: "sim", url: "smartfarm/index.html", icon: "🧪", desc: "15 interactive biophysical simulators and crop modeling engines", tags: "smartfarm dashboard simulators vpd mixing valve fertigation heat loss" },
    { title: "Vapor Pressure Deficit (VPD) Microclimate Engine", cat: "sim", url: "smartfarm/vpd.html", icon: "💧", desc: "Leaf-to-air VPD, dewpoint temperature & ASAE standard transpiration model", tags: "vpd vapor pressure deficit leaf temperature humidity dewpoint" },
    { title: "3-Way Motorized Mixing Valve & Pipe Sizing Engine", cat: "sim", url: "smartfarm/mixing_valve.html", icon: "🚰", desc: "Kv/Cv valve coefficient, hot water flow rate & heating pipe sizing", tags: "mixing valve heating pipe kv cv flow rate boiler heating loop" },
    { title: "Stock Tank A/B Fertigation EC Blending Calculator", cat: "sim", url: "smartfarm/fertigation.html", icon: "🧪", desc: "Concentrated A/B stock tank dilution, injection ratio & target EC model", tags: "fertigation fertilizer stock tank a b dilution ec nutrient solution" },
    { title: "Greenhouse Peak Heat Loss & Fuel Consumption Model", cat: "sim", url: "smartfarm/heat_loss.html", icon: "🔥", desc: "U-value envelope transmission, infiltration & seasonal gas/biomass estimator", tags: "heat loss fuel u value transmission infiltration gas heating" },
    { title: "Vertical Farming DLI, Photoperiod & PPFD Calculator", cat: "sim", url: "smartfarm/vertical_dli.html", icon: "💡", desc: "Multi-tier vertical farm LED fluence, photoperiod & photon harvest model", tags: "vertical farm dli photoperiod ppfd led indoor farming" },
    { title: "Smart Farm 10-Year Capex/Opex Commercial ROI Simulator", cat: "sim", url: "smartfarm/roi_simulator.html", icon: "💰", desc: "Multi-span smart farm capital expenditure & operational cash flow forecast", tags: "roi capex opex payback cash flow financial simulator" },
    { title: "Canopy Transpiration & Calcium Xylem Flux Model", cat: "sim", url: "smartfarm/transpiration.html", icon: "🌿", desc: "Penman-Monteith canopy transpiration rate & calcium tipburn prevention", tags: "transpiration xylem calcium tipburn penman monteith flux" },
    { title: "Smart Farm Plant Pathology & Disease Diagnostic Tool", cat: "sim", url: "smartfarm/diagnosis.html", icon: "🔬", desc: "Symptom matrix, root-zone pathogen diagnostics & corrective actions", tags: "diagnosis plant disease pathogen mildew blight root rot" },
    { title: "LED Grow Light Efficacy (PPE) & PPFD Energy Simulator", cat: "sim", url: "smartfarm/lighting_efficacy.html", icon: "⚡", desc: "Photosynthetic photon efficacy (umol/J), electrical input & fixture sizing", tags: "lighting efficacy ppe led fixture umol j energy ppfd" },
    { title: "Greenhouse Layout Wave Function Collapse (WFC) Engine", cat: "sim", url: "smartfarm/smartfarm_layout_wfc.html", icon: "📐", desc: "Procedural smart farm layout generation & spatial optimization using WFC", tags: "layout wfc wave function collapse greenhouse design spatial" },

    // 📚 AGTECH WIKI PLANT PHYSIOLOGY & BIOCHEMISTRY (52)
    { title: "AgTech Wiki Master Botanical & Biochemical Encyclopedia", cat: "wiki", url: "wiki/index.html", icon: "📚", desc: "52 peer-reviewed research papers on plant physiology, molecular genetics & climate", tags: "wiki encyclopedia botany biochemistry physiology rubisco" },
    { title: "Tomato (Solanum lycopersicum) Physiology Wiki", cat: "wiki", url: "wiki/tomato.html", icon: "🍅", desc: "VPD 0.8-1.2 kPa, High-wire DIF steering, Rubisco activation & truss pruning", tags: "tomato solanaceae rubisco dif high wire crop wiki" },
    { title: "Lettuce (Lactuca sativa) Tipburn & Aquaporin Wiki", cat: "wiki", url: "wiki/lettuce.html", icon: "🥬", desc: "Inner-leaf calcium mobility, aquaporin gating & boundary layer dynamics", tags: "lettuce tipburn aquaporin calcium leaf airflow wiki" },
    { title: "Strawberry (Fragaria ananassa) Crown Cooling Wiki", cat: "wiki", url: "wiki/strawberry.html", icon: "🍓", desc: "Floral initiation chilling units, night table-top temperature & sucrose brix", tags: "strawberry brix crown cooling chilling flowering wiki" },
    { title: "Sweet Pepper (Capsicum annuum) Fruit Set Wiki", cat: "wiki", url: "wiki/paprika.html", icon: "🫑", desc: "Flower abortion mitigation, 24h mean temperature integration & sink strength", tags: "sweet pepper paprika blossom drop fruit set flower wiki" },
    { title: "Cucumber (Cucumis sativus) Boundary Layer Wiki", cat: "wiki", url: "wiki/cucumber.html", icon: "🥒", desc: "High transpiration guttation kinetics, micro-airflow & downy mildew resistance", tags: "cucumber cucurbitaceae guttation boundary layer transpiration wiki" },
    { title: "Rubisco Carbon Fixation & Calvin Cycle Kinetics", cat: "wiki", url: "wiki/kegg_carbon_rubisco_kinetics.html", icon: "🧬", desc: "Farquhar photosynthesis model, CO2 Km and photorespiration oxygenase suppression", tags: "rubisco carbon calvin cycle photosynthesis farquhar co2 enzyme" },
    { title: "Vapor Pressure Deficit & Stomatal Aquaporin Gating", cat: "wiki", url: "wiki/vapour_pressure_deficit_aquaporin_gating.html", icon: "💧", desc: "PIP aquaporin hydraulic conductivity, guard cell turgor & ABA signaling", tags: "vpd aquaporin gating stomata guard cell aba turgor hydraulic" },

    // ⚙️ AGRIMASTER GLOBAL COMPONENT & DEALER SEARCH ENGINE
    { title: "AgriMaster Global Agricultural Parts & Equipment Search Engine", cat: "part", url: "parts/index.html", icon: "⚙️", desc: "Parametric search for solenoid valves, vent motors, pH probes, LED lights with 50km local dealer maps", tags: "agrimaster parts equipment solenoid valve motor sensor led dealer locator" },
    { title: "AgriMaster Solenoid Valves & Fertigation Components", cat: "part", url: "parts/index.html", icon: "🚰", desc: "24VAC/220V irrigation solenoid valves, PVC diaphragm valves & flow meters", tags: "solenoid valve irrigation fertigation 24vac parts agrimaster" },
    { title: "AgriMaster Ridge Vent Motors & Greenhouse Actuators", cat: "part", url: "parts/index.html", icon: "🔄", desc: "Ridder/De Gier rack and pinion vent drive motors, limit switches & gearboxes", tags: "vent motor actuator rack pinion ridder de gier gearbox agrimaster" },
    { title: "AgriMaster Industrial pH, EC & DO Sensor Probes", cat: "part", url: "parts/index.html", icon: "🔬", desc: "Differential pH glass probes, toroidal EC transmitters & optical DO sensors", tags: "ph probe ec sensor do dissolved oxygen sensor transmitter agrimaster" },

    { title: "About Inwoovation Lab & Research Team", cat: "core", url: "about.html", icon: "ℹ️", desc: "Mission, open-source engineering standards, and founder background", tags: "about inwoovation team founder mission" }
  ];

  // Helper to determine relative root path
  function getRootPrefix() {
    const p = window.location.pathname;
    if (p.includes('/tools/') || p.includes('/crops/') || p.includes('/climate/') || p.includes('/articles/') || p.includes('/smartfarm/') || p.includes('/wiki/') || p.includes('/parts/') || p.includes('/podcasts/')) {
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
          <input type="text" id="inwoo-palette-input" placeholder="Search 330+ tools, simulators, wiki, parts, crops, articles... (Type to filter)" autocomplete="off" />
          <span class="inwoo-palette-esc-badge" onclick="window.InwooPalette.close()">ESC</span>
        </div>
        <div class="inwoo-palette-tabs">
          <button class="inwoo-pal-tab active" data-cat="all">✨ All (330+)</button>
          <button class="inwoo-pal-tab" data-cat="tool">🛠️ Tools (41)</button>
          <button class="inwoo-pal-tab" data-cat="sim">🧪 Simulators (15)</button>
          <button class="inwoo-pal-tab" data-cat="wiki">📚 Wiki (52)</button>
          <button class="inwoo-pal-tab" data-cat="part">⚙️ Parts</button>
          <button class="inwoo-pal-tab" data-cat="crop">🌱 Crops</button>
          <button class="inwoo-pal-tab" data-cat="climate">🌍 Climate</button>
          <button class="inwoo-pal-tab" data-cat="article">📚 Articles</button>
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
          <div style="color: #64748b; font-size: 0.75rem;">Inwoovation Universal Spotlight (330+ Endpoints)</div>
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
