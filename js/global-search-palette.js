/**
 * Inwoovation Global Command Palette (Spotlight Search) & Reader Convenience Engine (v3.0)
 * Triggers on Ctrl+K / Cmd+K or clicking any search trigger button.
 * Dynamically indexes all 327 live pages across Tools, Simulators, Wiki, Crops, Climate Hubs, and Multilingual Articles (EN/DE/JA).
 * Also mounts:
 *  1) Top Reading Progress Bar (#inw-reading-progress-bar)
 *  2) Collapsible Quick-Jump Table of Contents (TOC) + 1-Click Citation Copy & PDF Print Toolbar
 *  3) Floating Bottom-Right Quick Action Bar (🔍 Ctrl+K + ↑ Top)
 */
(function() {
  const ECOSYSTEM_INDEX = [
  {
    "title": "🏛️ VenloCAD 3D",
    "cat": "tool",
    "url": "tools/venlocad-3d.html",
    "icon": "📐",
    "desc": "Industrial 3D parametric CAD and structural engineering engine for Venlo greenhouses. Features real-time WebGL frame generation, NEN 3859 / EN 13",
    "tags": "tools venlocad-3d html venlocad 3d industrial 3d parametric cad and structural engineering engine for venlo greenhouses features real-time webgl frame generation nen 3859 en 13"
  },
  {
    "title": "🇩🇪 EU Greenhouse Energy Audit (DIN V 18599 / BLE) & Hofnachfolge Equity Simulator",
    "cat": "tool",
    "url": "tools/eu-greenhouse-energy-hofnachfolge-roi-simulator.html",
    "icon": "🇩🇪",
    "desc": "Interactive European glasshouse energy modernization (DIN V 18599, EN 13031-1, BLE 40% CAPEX grant, BEHG CO2 tax savings) and German farm success",
    "tags": "tools eu-greenhouse-energy-hofnachfolge-roi-simulator html eu greenhouse energy audit din v 18599 ble hofnachfolge equity simulator interactive european glasshouse energy moderniza"
  },
  {
    "title": "Deutscher Gartenbau-Meister & KTBL-Standard Rechner",
    "cat": "tool",
    "url": "meister.html",
    "icon": "🇩🇪",
    "desc": "Offizielle deutsche Gartenbau-Normen (KTBL Datensammlung, DIN V 18599, DIN EN 13031-1, QS-GAP 2026, IFS Food v8, SVLFG VSG 4.2). Heizwärmebedarf,",
    "tags": "meister html deutscher gartenbau-meister ktbl-standard rechner offizielle deutsche gartenbau-normen ktbl datensammlung din v 18599 din en 13031-1 qs-gap 2026 ifs food v8 svlfg vsg "
  },
  {
    "title": "🔬 Precision Engineering Articles Archive (78 Volumes (147 Multilingual Editions))",
    "cat": "article",
    "url": "guides.html",
    "icon": "📚",
    "desc": "78-volume (147 multilingual editions) open-access Controlled Environment Agriculture (CEA) archive — VPD physics, biomass CHP, photobiology, clos",
    "tags": "guides html precision engineering articles archive 78 volumes 147 multilingual editions 78-volume 147 multilingual editions open-access controlled environment agriculture cea archi"
  },
  {
    "title": "🛠️ Commercial CEA Engineering Tools Suite",
    "cat": "tool",
    "url": "tools/index.html",
    "icon": "🛠️",
    "desc": "A comprehensive suite of 41 industrial-grade commercial greenhouse engineering calculators, 3D WebGL digital twin simulators, global agri-subsidy",
    "tags": "tools index html commercial cea engineering tools suite a comprehensive suite of 41 industrial-grade commercial greenhouse engineering calculators 3d webgl digital twin simulators "
  },
  {
    "title": "Global Ag-Climate Atlas",
    "cat": "climate",
    "url": "climate/index.html",
    "icon": "🌍",
    "desc": "Compare 40 commercial greenhouse regions by latitude, Köppen climate class and seasonal Daily Light Integral (DLI) to plan screens, lighting and ",
    "tags": "climate index html global ag-climate atlas compare 40 commercial greenhouse regions by latitude köppen climate class and seasonal daily light integral dli to plan screens lighting "
  },
  {
    "title": "Commercial Greenhouse & Vertical Farm Crop Steering Atlas",
    "cat": "crop",
    "url": "crops/index.html",
    "icon": "🌱",
    "desc": "Biophysical crop steering blueprints for 10 major commercial greenhouse and vertical farm crops: Tomato, Strawberry, Cucumber, Sweet Pepper, Lett",
    "tags": "crops index html commercial greenhouse vertical farm crop steering atlas biophysical crop steering blueprints for 10 major commercial greenhouse and vertical farm crops tomato stra"
  },
  {
    "title": "AgriAtlas: Controlled Environment Agriculture (CEA) & Plant Systems Engineering Encyclopedia",
    "cat": "wiki",
    "url": "wiki/index.html",
    "icon": "🧬",
    "desc": "AgriAtlas CEA Engineering Encyclopedia: quantitative crop steering, psychrometric VPD control, hydroponic fertigation, and plant physiology resea",
    "tags": "wiki index html agriatlas controlled environment agriculture cea plant systems engineering encyclopedia agriatlas cea engineering encyclopedia quantitative crop steering psychromet"
  },
  {
    "title": "🛠️ Smart Farm Simulators & Modeler Suite",
    "cat": "sim",
    "url": "smartfarm/index.html",
    "icon": "🧪",
    "desc": "Free online precision engineering tools for greenhouse growers: VPD calculator, fertigation solver, heat loss estimator, mixing valve sizer, crop",
    "tags": "smartfarm index html smart farm simulators modeler suite free online precision engineering tools for greenhouse growers vpd calculator fertigation solver heat loss estimator mixing"
  },
  {
    "title": "Deutscher Meisterfunk",
    "cat": "article",
    "url": "podcasts/index.html",
    "icon": "🎙️",
    "desc": "Der deutsche Lernpodcast für Gewächshaustechnik, Nachrichten, Wissenschaft und die Gärtnermeister-Karriere. Gesprochen in langsamem, deutlichem D",
    "tags": "podcasts index html deutscher meisterfunk der deutsche lernpodcast für gewächshaustechnik nachrichten wissenschaft und die gärtnermeister-karriere gesprochen in langsamem deutliche"
  },
  {
    "title": "Biophysical Foundations of Vapor Pressure Deficit (VPD) Thermodynamics in CEA Greenhouses",
    "cat": "article",
    "url": "articles/article-01-vpd-master-class.html",
    "icon": "📚",
    "desc": "Mastering VPD (kPa) computation over relative humidity (RH%) to eliminate crop stress, balance stomatal conductance, and drive transpirational xy",
    "tags": "articles article-01-vpd-master-class html biophysical foundations of vapor pressure deficit vpd thermodynamics in cea greenhouses mastering vpd kpa computation over relative humidi"
  },
  {
    "title": "Daily Light Integral (DLI) & Photonic Efficacy Engineering in Vertical Plant Factories",
    "cat": "article",
    "url": "articles/article-02-dli-vertical-farming.html",
    "icon": "📚",
    "desc": "Calculated PPFD (µmol/m²/s) and DLI (mol/m²/day) formulations for indoor LED vertical farming to maximize dry biomass yield per kWh of electricit",
    "tags": "articles article-02-dli-vertical-farming html daily light integral dli photonic efficacy engineering in vertical plant factories calculated ppfd mol m s and dli mol m day formulati"
  },
  {
    "title": "Greenhouse Bumblebee Protection & Restricted-Entry Intervals (REI) in Precision CEA",
    "cat": "article",
    "url": "articles/article-03-pollinator-safety-rei.html",
    "icon": "📚",
    "desc": "Biological pollinator stewardship in commercial greenhouses: protecting Bombus terrestris from pesticide residue toxicity, REI mathematical model",
    "tags": "articles article-03-pollinator-safety-rei html greenhouse bumblebee protection restricted-entry intervals rei in precision cea biological pollinator stewardship in commercial green"
  },
  {
    "title": "Greenhouse Envelope Peak Heat Loss Coefficients (U-Values) & Thermodynamic Thermal Screen Modeling",
    "cat": "article",
    "url": "articles/article-04-greenhouse-heating-loss.html",
    "icon": "📚",
    "desc": "Engineering greenhouse heating loads using Q = U·A·ΔT heat transfer dynamics, cover glazing U-values, wind infiltration friction, and multilayer.",
    "tags": "articles article-04-greenhouse-heating-loss html greenhouse envelope peak heat loss coefficients u-values thermodynamic thermal screen modeling engineering greenhouse heating loads"
  },
  {
    "title": "Hourly Penman-Monteith Evapotranspiration (ET0) Modeling & Stomatal Resistance Kinetics",
    "cat": "article",
    "url": "articles/article-05-penman-monteith-transpiration.html",
    "icon": "📚",
    "desc": "Mathematical implementation of the FAO-56 Penman-Monteith equation for commercial greenhouse irrigation steering, canopy energy balance, and sola",
    "tags": "articles article-05-penman-monteith-transpiration html hourly penman-monteith evapotranspiration et0 modeling stomatal resistance kinetics mathematical implementation of the fao-56"
  },
  {
    "title": "Molar Stoichiometry & Sonneveld/Steiner Ion Balancing (meq/L) in Closed-Loop Hydroponics",
    "cat": "article",
    "url": "articles/article-06-hydroponic-nutrient-formulation.html",
    "icon": "📚",
    "desc": "Precision closed-loop hydroponic nutrient balancing: milliequivalent calculations, Steiner cation-anion stoichiometry, salt solubility products, ",
    "tags": "articles article-06-hydroponic-nutrient-formulation html molar stoichiometry sonneveld steiner ion balancing meq l in closed-loop hydroponics precision closed-loop hydroponic nutri"
  },
  {
    "title": "Photomorphogenesis & PAR Spectral Quality: Red/Blue Ratios and Emerson Enhancement Effect",
    "cat": "article",
    "url": "articles/article-07-indoor-plant-lighting-spectrum.html",
    "icon": "📚",
    "desc": "Photobiological plant responses across McCree action spectra, phytochrome photoequilibria (Pfr/Pr), far-red Emerson enhancement, and spectral tai",
    "tags": "articles article-07-indoor-plant-lighting-spectrum html photomorphogenesis par spectral quality red blue ratios and emerson enhancement effect photobiological plant responses acros"
  },
  {
    "title": "Horticultural Physics & Environmental Physiology of Monstera deliciosa: Hydroponics & VPD Optimization",
    "cat": "article",
    "url": "articles/article-08-monstera-deliciosa-care-guide.html",
    "icon": "📚",
    "desc": "Commercial tropical foliage engineering: hydroponic cultivation of Monstera deliciosa, leaf marginal necrosis prevention via VPD steering, and au",
    "tags": "articles article-08-monstera-deliciosa-care-guide html horticultural physics environmental physiology of monstera deliciosa hydroponics vpd optimization commercial tropical foliage"
  },
  {
    "title": "Stomatal Conductance Dynamics & Farquhar-von Caemmerer-Berry (FvCB) Photosynthesis Coupling",
    "cat": "article",
    "url": "articles/article-09-stomata-conductance-photosynthesis.html",
    "icon": "📚",
    "desc": "Coupled Farquhar-von Caemmerer-Berry photosynthesis and Ball-Berry stomatal conductance models under elevated CO2 enrichment and light-saturated.",
    "tags": "articles article-09-stomata-conductance-photosynthesis html stomatal conductance dynamics farquhar-von caemmerer-berry fvcb photosynthesis coupling coupled farquhar-von caemmerer-b"
  },
  {
    "title": "Commercial Vertical Farming HVAC Sizing: Dehumidification Latent Loads & Microclimate Fluid Dynamics",
    "cat": "article",
    "url": "articles/article-10-vertical-farm-hvac-design.html",
    "icon": "📚",
    "desc": "HVAC and psychrometric dehumidification engineering for commercial indoor vertical farms: calculating sensible vs latent cooling loads, airflow.",
    "tags": "articles article-10-vertical-farm-hvac-design html commercial vertical farming hvac sizing dehumidification latent loads microclimate fluid dynamics hvac and psychrometric dehumidi"
  },
  {
    "title": "High-Wire Strawberry Greenhouse Microclimate: Flower Bud Differentiation & Diurnal Temperature Integration",
    "cat": "article",
    "url": "articles/article-11-strawberry-greenhouse-climate.html",
    "icon": "📚",
    "desc": "Precision microclimate management for day-neutral and short-day greenhouse strawberries: chilling hour accumulation, flower bud initiation, and d",
    "tags": "articles article-11-strawberry-greenhouse-climate html high-wire strawberry greenhouse microclimate flower bud differentiation diurnal temperature integration precision microclimat"
  },
  {
    "title": "Xylem Calcium Partitioning & Transpirational Prevention of Blossom-End Rot (BER) in Greenhouse Tomatoes",
    "cat": "article",
    "url": "articles/article-12-tomato-blossom-end-rot-calcium.html",
    "icon": "📚",
    "desc": "Apoplastic calcium transport mechanics, xylem-to-phloem immobility, root hydraulic pressure, and nighttime VPD steering to prevent Blossom-End Ro",
    "tags": "articles article-12-tomato-blossom-end-rot-calcium html xylem calcium partitioning transpirational prevention of blossom-end rot ber in greenhouse tomatoes apoplastic calcium trans"
  },
  {
    "title": "Precision Agricultural Sensor Calibration: NDIR CO2, TDR Soil Moisture, EC & pH Electrochemistry",
    "cat": "article",
    "url": "articles/article-13-smartfarm-sensor-calibration.html",
    "icon": "📚",
    "desc": "Engineering calibration protocols for CEA instrumentation: NDIR dual-beam optical drift, two-point pH/EC Nernstian slope correction, and dielectr",
    "tags": "articles article-13-smartfarm-sensor-calibration html precision agricultural sensor calibration ndir co2 tdr soil moisture ec ph electrochemistry engineering calibration protocols "
  },
  {
    "title": "Dual Horticultural Education & Vocational Engineering in Germany: Gärtner Ausbildung to Meister",
    "cat": "article",
    "url": "articles/article-14-ausbildung-horticulture-germany.html",
    "icon": "📚",
    "desc": "Comprehensive structural guide to Germany's dual vocational education system (Duale Ausbildung) in commercial production horticulture (Gartenbau)",
    "tags": "articles article-14-ausbildung-horticulture-germany html dual horticultural education vocational engineering in germany gärtner ausbildung to meister comprehensive structural guide"
  },
  {
    "title": "Biophilic Architecture & Indoor Environmental Physics in Commercial Living Spaces",
    "cat": "article",
    "url": "articles/article-15-plant-interior-biophilic-design.html",
    "icon": "📚",
    "desc": "Architectural integration of living vegetation in high-performance buildings: daylight factor modeling, sub-irrigation hydraulics, particulate ma",
    "tags": "articles article-15-plant-interior-biophilic-design html biophilic architecture indoor environmental physics in commercial living spaces architectural integration of living vegetat"
  },
  {
    "title": "German Master Grower (Gärtnermeister) Greenhouse Climate Steering Strategy for Solanaceae",
    "cat": "article",
    "url": "articles/article-16-german-meister-greenhouse-climate.html",
    "icon": "📚",
    "desc": "Advanced European greenhouse climate steering: 24-hour temperature integration (RTI), pre-night temperature drops (DIP), and 3-way mixing valve h",
    "tags": "articles article-16-german-meister-greenhouse-climate html german master grower gärtnermeister greenhouse climate steering strategy for solanaceae advanced european greenhouse clim"
  },
  {
    "title": "Biophysical Soil Physics: Air Porosity, Water Retention Curves & Root Zone Aeration",
    "cat": "article",
    "url": "articles/article-17-indoor-plant-soil-aeration-porosity.html",
    "icon": "📚",
    "desc": "Engineering potting media physics: Total Porosity, Container Capacity (CC), and Air-Filled Porosity (AFP) to eliminate root hypoxia in containeri",
    "tags": "articles article-17-indoor-plant-soil-aeration-porosity html biophysical soil physics air porosity water retention curves root zone aeration engineering potting media physics total"
  },
  {
    "title": "Closed-Loop Hydroponic Drain Water Disinfection: UV-C, Ozone, Heat & Ultrafiltration",
    "cat": "article",
    "url": "articles/article-18-recirculating-nutrient-sterilization.html",
    "icon": "📚",
    "desc": "Engineering recirculating hydroponic drain water disinfection: UV-C irradiance dosage (mJ/cm2), ozone oxidation redox potential (ORP), and automa",
    "tags": "articles article-18-recirculating-nutrient-sterilization html closed-loop hydroponic drain water disinfection uv-c ozone heat ultrafiltration engineering recirculating hydroponic d"
  },
  {
    "title": "Photon Use Efficiency (PUE) & Electric Power to Fresh Biomass Kinetics in Vertical Farming",
    "cat": "article",
    "url": "articles/article-19-vertical-farm-biomass-conversion-efficiency.html",
    "icon": "📚",
    "desc": "Quantifying photon use efficiency (g/mol) and energy yield (g/kWh) in indoor plant factories with artificial lighting (PFAL) across leafy greens.",
    "tags": "articles article-19-vertical-farm-biomass-conversion-efficiency html photon use efficiency pue electric power to fresh biomass kinetics in vertical farming quantifying photon use e"
  },
  {
    "title": "Leaf Temperature Infrared Thermometry & Crop Water Stress Index (CWSI) Sensing",
    "cat": "article",
    "url": "articles/article-20-leaf-temperature-infrared-thermometry.html",
    "icon": "📚",
    "desc": "Physics of infrared canopy radiometry: Stefan-Boltzmann law, leaf-to-air temperature differential (ΔT), and Crop Water Stress Index (CWSI) for co",
    "tags": "articles article-20-leaf-temperature-infrared-thermometry html leaf temperature infrared thermometry crop water stress index cwsi sensing physics of infrared canopy radiometry stef"
  },
  {
    "title": "Chlorophyll a Fluorescence Kinetics (Fv/Fm & OJIP) & Pre-Symptomatic Stress Metrology",
    "cat": "article",
    "url": "articles/article-21-chlorophyll-a-fluorescence-fvfm-stress.html",
    "icon": "📚",
    "desc": "Photosystem II maximum quantum yield (Fv/Fm), OJIP induction curves, and non-photochemical quenching (NPQ) for real-time non-destructive plant st",
    "tags": "articles article-21-chlorophyll-a-fluorescence-fvfm-stress html chlorophyll a fluorescence kinetics fv fm ojip pre-symptomatic stress metrology photosystem ii maximum quantum yield"
  },
  {
    "title": "HPS vs. LED Supplemental Lighting Physics: Photon Efficacy, Far-Red Kinetics & Greenhouse Heat Balance",
    "cat": "article",
    "url": "articles/article-22-hps-vs-led-supplemental-lighting.html",
    "icon": "📚",
    "desc": "Comparative biophysics of High-Pressure Sodium (HPS) and LED supplemental fixtures: PAR photon efficacy (µmol/J), Far-Red Emerson enhancement, an",
    "tags": "articles article-22-hps-vs-led-supplemental-lighting html hps vs led supplemental lighting physics photon efficacy far-red kinetics greenhouse heat balance comparative biophysics o"
  },
  {
    "title": "Closed-Loop DWC & Micro-Dosing Automation: Dissolved Oxygen, Ion-Selective ORP Metrology & PID Fertigation",
    "cat": "article",
    "url": "articles/article-23-closed-loop-dwc-automation.html",
    "icon": "📚",
    "desc": "Engineering recirculating Deep Water Culture (DWC) systems: Henry's Law dissolved oxygen (DO) dynamics, ion-selective electrode (ISE) feedback.",
    "tags": "articles article-23-closed-loop-dwc-automation html closed-loop dwc micro-dosing automation dissolved oxygen ion-selective orp metrology pid fertigation engineering recirculating d"
  },
  {
    "title": "Optimizing Far-Red (730nm) & Deep-Red (660nm) Spectral Ratios for Commercial Greenhouse Crops",
    "cat": "article",
    "url": "articles/article-24-far-red-deep-red-led-spectrum-optimization.html",
    "icon": "📚",
    "desc": "A comprehensive engineering masterclass on the Emerson Enhancement Effect, Photosystem I/II excitation balance, and Far-Red (730nm) spectrum.",
    "tags": "articles article-24-far-red-deep-red-led-spectrum-optimization html optimizing far-red 730nm deep-red 660nm spectral ratios for commercial greenhouse crops a comprehensive engineer"
  },
  {
    "title": "Closed-Loop Nutrient Recirculation & Nanobubble Dissolved Oxygen Kinetics in Commercial Greenhouses",
    "cat": "article",
    "url": "articles/article-25-closed-loop-hydroponic-nanobubble-oxygenation.html",
    "icon": "📚",
    "desc": "Engineering analysis of closed-loop hydroponic recirculation, rhizosphere dissolved oxygen (DO > 8.5 mg/L), and Pythium root-rot suppression in c",
    "tags": "articles article-25-closed-loop-hydroponic-nanobubble-oxygenation html closed-loop nutrient recirculation nanobubble dissolved oxygen kinetics in commercial greenhouses engineering"
  },
  {
    "title": "Greenhouse Heating Load Modeling & Thermal Screen Dynamics under DIN V 18599 Standards",
    "cat": "article",
    "url": "articles/article-26-greenhouse-heating-load-din-v-18599.html",
    "icon": "📚",
    "desc": "Comprehensive engineering analysis of peak heat transmission, thermal screen radiative resistance, and pipe rail hydraulics in commercial Venlo.",
    "tags": "articles article-26-greenhouse-heating-load-din-v-18599 html greenhouse heating load modeling thermal screen dynamics under din v 18599 standards comprehensive engineering analysis"
  },
  {
    "title": "Predictive Biomass Accumulation & Light Use Efficiency (LUE) Under Dynamic DLI",
    "cat": "article",
    "url": "articles/article-27-crop-yield-biomass-light-use-efficiency.html",
    "icon": "📚",
    "desc": "Commercial greenhouse yield forecasting based on cumulative DLI, Light Use Efficiency (LUE = 2.8 - 3.4 g/mol), and Harvest Index (HI) modeling.",
    "tags": "articles article-27-crop-yield-biomass-light-use-efficiency html predictive biomass accumulation light use efficiency lue under dynamic dli commercial greenhouse yield forecasting "
  },
  {
    "title": "Greenhouse CO₂ Enrichment Kinetics & Economic Thresholds under Dynamic Ventilation",
    "cat": "article",
    "url": "articles/article-28-greenhouse-co2-enrichment-economics.html",
    "icon": "📚",
    "desc": "Industrial analysis of pure liquid CO2 vs CHP flue gas dosing, ventilation exchange losses, and net economic ROI thresholds in commercial horticu",
    "tags": "articles article-28-greenhouse-co2-enrichment-economics html greenhouse co enrichment kinetics economic thresholds under dynamic ventilation industrial analysis of pure liquid co2 "
  },
  {
    "title": "Hourly Penman-Monteith Evapotranspiration Modeling & Stomatal Resistance Dynamics",
    "cat": "article",
    "url": "articles/article-29-hourly-penman-monteith-evapotranspiration.html",
    "icon": "📚",
    "desc": "Engineering analysis of hourly crop evapotranspiration (ETc), stomatal resistance (rs), aerodynamic boundary layer resistance (ra), and precision",
    "tags": "articles article-29-hourly-penman-monteith-evapotranspiration html hourly penman-monteith evapotranspiration modeling stomatal resistance dynamics engineering analysis of hourly cr"
  },
  {
    "title": "Rockwool Slab Hydrodynamics, TDR Moisture Sensors & Drainage EC Balancing",
    "cat": "article",
    "url": "articles/article-30-rockwool-slab-tdr-moisture-drain-ec.html",
    "icon": "📚",
    "desc": "Engineering analysis of volumetric water content (VWC %), overnight dry-down kinetics, and drainage EC balancing in commercial rockwool hydroponi",
    "tags": "articles article-30-rockwool-slab-tdr-moisture-drain-ec html rockwool slab hydrodynamics tdr moisture sensors drainage ec balancing engineering analysis of volumetric water content"
  },
  {
    "title": "High-Pressure (70 bar) Fogging Physics & Sauter Droplet Evaporative Cooling",
    "cat": "article",
    "url": "articles/article-31-high-pressure-fogging-droplet-physics.html",
    "icon": "📚",
    "desc": "Industrial engineering analysis of 70 bar high-pressure fogging, Sauter Mean Diameter (D32 < 10µm), flash evaporative cooling, and VPD.",
    "tags": "articles article-31-high-pressure-fogging-droplet-physics html high-pressure 70 bar fogging physics sauter droplet evaporative cooling industrial engineering analysis of 70 bar hig"
  },
  {
    "title": "Horticultural LED Fixture Thermal Management & Diode Junction Temperature (Tj) Dynamics",
    "cat": "article",
    "url": "articles/article-32-horticultural-led-thermal-junction-temperature.html",
    "icon": "📚",
    "desc": "Engineering analysis of LED diode junction temperature (Tj), thermal resistance (Rth), spectral photon efficacy derating, and canopy convective h",
    "tags": "articles article-32-horticultural-led-thermal-junction-temperature html horticultural led fixture thermal management diode junction temperature tj dynamics engineering analysis of "
  },
  {
    "title": "Precision Crop Steering Dynamics: Balancing Generative vs Vegetative Growth",
    "cat": "article",
    "url": "articles/article-33-precision-crop-steering-dif-vpd-drydown.html",
    "icon": "📚",
    "desc": "Industrial crop steering masterclass: Balancing vegetative stem growth vs generative flowering using 24h DIF, diurnal VPD differentials, and slab",
    "tags": "articles article-33-precision-crop-steering-dif-vpd-drydown html precision crop steering dynamics balancing generative vs vegetative growth industrial crop steering masterclass bal"
  },
  {
    "title": "Closed-Loop UV-C Disinfection & Viral Pathogen Inactivation Kinetics",
    "cat": "article",
    "url": "articles/article-34-closed-loop-uvc-drain-disinfection.html",
    "icon": "📚",
    "desc": "Engineering analysis of UV-C radiation dose (250 mJ/cm2), UVT% transmission correction, and viral/fungal log-reduction in recirculating greenhous",
    "tags": "articles article-34-closed-loop-uvc-drain-disinfection html closed-loop uv-c disinfection viral pathogen inactivation kinetics engineering analysis of uv-c radiation dose 250 mj cm"
  },
  {
    "title": "Computational Fluid Dynamics (CFD) of Horizontal Air Flow (HAF) Fans",
    "cat": "article",
    "url": "articles/article-35-greenhouse-haf-fan-cfd-modeling.html",
    "icon": "📚",
    "desc": "Industrial CFD modeling of Horizontal Air Flow (HAF) fan spacing, jet velocity decay, Bernoulli air entrainment, and canopy boundary layer.",
    "tags": "articles article-35-greenhouse-haf-fan-cfd-modeling html computational fluid dynamics cfd of horizontal air flow haf fans industrial cfd modeling of horizontal air flow haf fan spa"
  },
  {
    "title": "Combined Heat & Power (CHP) Flue Gas SCR Denitrification & Safe CO₂ Dosing",
    "cat": "article",
    "url": "articles/article-36-chp-flue-gas-scr-denitrification.html",
    "icon": "📚",
    "desc": "Industrial engineering analysis of gas engine Selective Catalytic Reduction (SCR), stoichiometric urea injection, NOx < 5 ppm elimination, and au",
    "tags": "articles article-36-chp-flue-gas-scr-denitrification html combined heat power chp flue gas scr denitrification safe co dosing industrial engineering analysis of gas engine selectiv"
  },
  {
    "title": "Hot Water Buffer Tank Stratification & Thermal Energy Storage Sizing",
    "cat": "article",
    "url": "articles/article-37-thermal-buffer-tank-stratification-sizing.html",
    "icon": "📚",
    "desc": "Industrial engineering analysis of greenhouse hot-water thermal buffer tanks, thermocline Richardson number stability, and night peak heating dis",
    "tags": "articles article-37-thermal-buffer-tank-stratification-sizing html hot water buffer tank stratification thermal energy storage sizing industrial engineering analysis of greenhouse "
  },
  {
    "title": "Xylem Calcium Transport Dynamics & Blossom-End Rot (BER) Prevention",
    "cat": "article",
    "url": "articles/article-38-xylem-calcium-flux-blossom-end-rot.html",
    "icon": "📚",
    "desc": "Plant physiology analysis of xylem transpirational calcium flux, distal fruit cell membrane stability, and Blossom-End Rot (BER) prevention via V",
    "tags": "articles article-38-xylem-calcium-flux-blossom-end-rot html xylem calcium transport dynamics blossom-end rot ber prevention plant physiology analysis of xylem transpirational calci"
  },
  {
    "title": "Closed-Loop Reverse Osmosis (RO) Desalination & Sodium (Na+) Rejection Kinetics",
    "cat": "article",
    "url": "articles/article-39-closed-loop-ro-desalination-energy.html",
    "icon": "📚",
    "desc": "Industrial engineering analysis of greenhouse reverse osmosis (RO) membrane flux (LMH), sodium (Na+) rejection (99.2%), energy recovery devices (",
    "tags": "articles article-39-closed-loop-ro-desalination-energy html closed-loop reverse osmosis ro desalination sodium na rejection kinetics industrial engineering analysis of greenhouse r"
  },
  {
    "title": "Canopy Light Extinction (Beer-Lambert Law) & Diffuse Glass Transmission",
    "cat": "article",
    "url": "articles/article-40-beer-lambert-canopy-light-extinction.html",
    "icon": "📚",
    "desc": "Industrial plant physiology analysis of Beer-Lambert light extinction, canopy extinction coefficient (k), Leaf Area Index (LAI), and diffuse glas",
    "tags": "articles article-40-beer-lambert-canopy-light-extinction html canopy light extinction beer-lambert law diffuse glass transmission industrial plant physiology analysis of beer-lambe"
  },
  {
    "title": "The Biochemical Farquhar (FvCB) Photosynthesis Model & CO₂ Dosing Dynamics",
    "cat": "article",
    "url": "articles/article-41-farquhar-photosynthesis-fvcb-co2.html",
    "icon": "📚",
    "desc": "Industrial plant physiology analysis of the Farquhar-von Caemmerer-Berry (FvCB) model, Rubisco kinetics (Vcmax), electron transport (Jmax), and C",
    "tags": "articles article-41-farquhar-photosynthesis-fvcb-co2 html the biochemical farquhar fvcb photosynthesis model co dosing dynamics industrial plant physiology analysis of the farquhar"
  },
  {
    "title": "Substrate Matric Potential (Ψm), pF Water Retention Curves & van Genuchten Physics",
    "cat": "article",
    "url": "articles/article-42-substrate-matric-potential-pf-curves.html",
    "icon": "📚",
    "desc": "Industrial agricultural physics analysis of substrate matric suction potential (Psi_m), pF retention curves, van Genuchten hydraulic models, and ",
    "tags": "articles article-42-substrate-matric-potential-pf-curves html substrate matric potential m pf water retention curves van genuchten physics industrial agricultural physics analysis "
  },
  {
    "title": "Greenhouse Structural Standards (EN 13031-1 & NEN 3859): Wind, Snow & Crop Loads",
    "cat": "article",
    "url": "articles/article-43-greenhouse-structural-standards-en13031.html",
    "icon": "📚",
    "desc": "Civil engineering analysis of commercial Venlo greenhouse structural design according to EN 13031-1 and NEN 3859, wind suction (qw), snow drift, ",
    "tags": "articles article-43-greenhouse-structural-standards-en13031 html greenhouse structural standards en 13031-1 nen 3859 wind snow crop loads civil engineering analysis of commercial v"
  },
  {
    "title": "Meister-Deutsch: Open-Source Horticultural German SRS & Phonetic Engine",
    "cat": "article",
    "url": "articles/article-44-meister-deutsch-open-source-srs-engine.html",
    "icon": "📚",
    "desc": "Open-source Spaced Repetition System (SRS) for German Meisterprüfung horticulture, Web Speech API pronunciation synthesis, and botanical taxonomy",
    "tags": "articles article-44-meister-deutsch-open-source-srs-engine html meister-deutsch open-source horticultural german srs phonetic engine open-source spaced repetition system srs for ge"
  },
  {
    "title": "AgriQuant: Open-Source Greenhouse Energy & Commodity Quant Terminal",
    "cat": "article",
    "url": "articles/article-45-agriquant-energy-commodity-quant-terminal.html",
    "icon": "📚",
    "desc": "Open-source financial engineering and energy analytics terminal for commercial greenhouses. Simulates Dutch TTF natural gas spark spreads, electr",
    "tags": "articles article-45-agriquant-energy-commodity-quant-terminal html agriquant open-source greenhouse energy commodity quant terminal open-source financial engineering and energy ana"
  },
  {
    "title": "OpenCEA: Open-Source Python Micro-Framework for Greenhouse Physics",
    "cat": "article",
    "url": "articles/article-46-opencea-python-micro-framework-release.html",
    "icon": "📚",
    "desc": "Release of OpenCEA, an open-source Python micro-framework for commercial greenhouse physics, crop photobiology, substrate hydrodynamics, and clim",
    "tags": "articles article-46-opencea-python-micro-framework-release html opencea open-source python micro-framework for greenhouse physics release of opencea an open-source python micro-fra"
  },
  {
    "title": "Computer Vision & Multispectral Disease Diagnostics in Protected Cropping",
    "cat": "article",
    "url": "articles/article-47-computer-vision-crop-disease-diagnostics.html",
    "icon": "📚",
    "desc": "Computer vision edge algorithms for early detection of Botrytis cinerea, iron chlorosis, and foliar necrotic lesions in commercial high-wire gree",
    "tags": "articles article-47-computer-vision-crop-disease-diagnostics html computer vision multispectral disease diagnostics in protected cropping computer vision edge algorithms for early "
  },
  {
    "title": "Commercial Greenhouse 10-Year CapEx, OpEx & IRR Investment Modeling",
    "cat": "article",
    "url": "articles/article-48-greenhouse-capex-opex-irr-npv-financial-model.html",
    "icon": "📚",
    "desc": "Bankable financial feasibility analysis for high-tech commercial Venlo glasshouse projects: Turnkey CapEx (180-320/m²), Discounted Cash Flows.",
    "tags": "articles article-48-greenhouse-capex-opex-irr-npv-financial-model html commercial greenhouse 10-year capex opex irr investment modeling bankable financial feasibility analysis for "
  },
  {
    "title": "Hydroponic Chemical Speciation, Debye-Hückel Activity & Saturation Indices",
    "cat": "article",
    "url": "articles/article-49-hydroponic-chemical-speciation-debye-huckel.html",
    "icon": "📚",
    "desc": "Chemical thermodynamics of closed-loop hydroponic nutrient solutions: Debye-Hückel ionic strength, ion activity coefficients, and Saturation Inde",
    "tags": "articles article-49-hydroponic-chemical-speciation-debye-huckel html hydroponic chemical speciation debye-hückel activity saturation indices chemical thermodynamics of closed-loop "
  },
  {
    "title": "Smart Greenhouse Edge IoT & MQTT Fleet Telemetry Architecture",
    "cat": "article",
    "url": "articles/article-50-smart-greenhouse-mqtt-edge-iot-fleet.html",
    "icon": "📚",
    "desc": "Industrial IoT architecture for commercial protected cropping: LoRaWAN, MQTT broker topologies, JSON schema telemetry, and edge anomaly detection",
    "tags": "articles article-50-smart-greenhouse-mqtt-edge-iot-fleet html smart greenhouse edge iot mqtt fleet telemetry architecture industrial iot architecture for commercial protected cropp"
  },
  {
    "title": "Autonomous Greenhouse AI: Reinforcement Learning & Model Predictive Control",
    "cat": "article",
    "url": "articles/article-51-autonomous-greenhouse-ai-mpc-reinforcement-learning.html",
    "icon": "📚",
    "desc": "Autonomous climate computer optimization using Reinforcement Learning and Model Predictive Control (MPC). Optimizes 24h temperature trajectories ",
    "tags": "articles article-51-autonomous-greenhouse-ai-mpc-reinforcement-learning html autonomous greenhouse ai reinforcement learning model predictive control autonomous climate computer op"
  },
  {
    "title": "Aquifer Thermal Energy Storage (ATES) & Industrial Heat Pumps in Dutch Venlo Greenhouses",
    "cat": "article",
    "url": "articles/article-52-aquifer-thermal-energy-storage-ates-heat-pump.html",
    "icon": "📚",
    "desc": "Thermodynamic modeling of Aquifer Thermal Energy Storage (ATES / WKO) doublet systems, seasonal heat recovery efficiency, and high-temperature.",
    "tags": "articles article-52-aquifer-thermal-energy-storage-ates-heat-pump html aquifer thermal energy storage ates industrial heat pumps in dutch venlo greenhouses thermodynamic modeling o"
  },
  {
    "title": "Biomass CHP Flue Gas SCR Cleaning & Biogenic CO2 Direct Enrichment in Venlo Glasshouses",
    "cat": "article",
    "url": "articles/article-53-biomass-chp-scr-co2-recovery-horticulture.html",
    "icon": "📚",
    "desc": "Engineering thermodynamics of biomass combined heat and power (CHP), Selective Catalytic Reduction (SCR) DeNOx, ethylene scrubbers, and safe biog",
    "tags": "articles article-53-biomass-chp-scr-co2-recovery-horticulture html biomass chp flue gas scr cleaning biogenic co2 direct enrichment in venlo glasshouses engineering thermodynamics "
  },
  {
    "title": "AI-Driven Model Predictive Control (MPC) in Commercial Venlo Greenhouses: Real-Time Energy-Yield Optimization",
    "cat": "article",
    "url": "articles/article-54-ai-model-predictive-control-mpc-venlo-greenhouse.html",
    "icon": "📚",
    "desc": "Engineering mathematical formulation of Model Predictive Control (MPC), transient thermodynamic microclimate modeling, dynamic assimilation light",
    "tags": "articles article-54-ai-model-predictive-control-mpc-venlo-greenhouse html ai-driven model predictive control mpc in commercial venlo greenhouses real-time energy-yield optimization"
  },
  {
    "title": "Nutrient Uptake Concentration Factor (UCF) in Recirculating Hydroponics: Closed-Loop Mass Balance & Ion Dynamics",
    "cat": "article",
    "url": "articles/article-55-nutrient-uptake-concentration-factor-recirculating-hydroponics.html",
    "icon": "📚",
    "desc": "Engineering mass balance formulation of nutrient uptake concentration factors (UCF), ion accumulation kinetics, sodium salinity limits, and optim",
    "tags": "articles article-55-nutrient-uptake-concentration-factor-recirculating-hydroponics html nutrient uptake concentration factor ucf in recirculating hydroponics closed-loop mass balan"
  },
  {
    "title": "Far-Red Photobiology (ePAR 400–750 nm) & Phytochrome Photostationary State (PSS) in Greenhouse Horticulture",
    "cat": "article",
    "url": "articles/article-56-far-red-photobiology-epar-phytochrome-photostationary-state.html",
    "icon": "📚",
    "desc": "Engineering biophysics of far-red photon efficacy, ePAR extended photosynthetic range (400-750 nm), phytochrome photostationary state (PSS), and ",
    "tags": "articles article-56-far-red-photobiology-epar-phytochrome-photostationary-state html far-red photobiology epar 400 750 nm phytochrome photostationary state pss in greenhouse hortic"
  },
  {
    "title": "The 8% Out-of-Pocket Playbook: Stacking USDA REAP, CDFA SWEEP, and IOU Utility Rebates for California CEA Greenhouses",
    "cat": "article",
    "url": "articles/article-57-california-cea-greenhouse-electrification-rebate-grant-stacking.html",
    "icon": "📚",
    "desc": "Engineering and grant stacking playbook for California commercial greenhouses, nurseries, and vertical farms to achieve up to 92% non-dilutive ca",
    "tags": "articles article-57-california-cea-greenhouse-electrification-rebate-grant-stacking html the 8 out-of-pocket playbook stacking usda reap cdfa sweep and iou utility rebates for cali"
  },
  {
    "title": "Dynamic CO2 Enrichment Kinetics & RuBisCO Carboxylation Thermodynamics in High-Wire Venlo Greenhouses",
    "cat": "article",
    "url": "articles/article-58-dynamic-co2-enrichment-kinetics-rubisco-carboxylation-venlo.html",
    "icon": "📚",
    "desc": "Engineering biophysics and microeconomic modeling of dynamic CO2 enrichment, RuBisCO carboxylation kinetics (Farquhar FvCB model), stomatal condu",
    "tags": "articles article-58-dynamic-co2-enrichment-kinetics-rubisco-carboxylation-venlo html dynamic co2 enrichment kinetics rubisco carboxylation thermodynamics in high-wire venlo greenho"
  },
  {
    "title": "EPEX Spot Negative Day-Ahead Arbitrage, Hybrid BESS Sizing & Power-to-Heat Thermal Buffering in Modern European Venlo Greenhouses",
    "cat": "article",
    "url": "articles/article-59-epex-spot-negative-pricing-bess-power-to-heat-greenhouse.html",
    "icon": "📚",
    "desc": "Engineering thermodynamics and quantitative energy arbitrage: electrode boilers, heat pump integration, atmospheric thermocline buffer tanks, and",
    "tags": "articles article-59-epex-spot-negative-pricing-bess-power-to-heat-greenhouse html epex spot negative day-ahead arbitrage hybrid bess sizing power-to-heat thermal buffering in moder"
  },
  {
    "title": "Real-Time Ion-Selective Electrode (ISE) Arrays, Nicolsky-Eisenman Potentiometry & Closed-Loop Autonomous Nutrient Dosing in Commercial High-Wire Hydroponics",
    "cat": "article",
    "url": "articles/article-60-potentiometric-ion-selective-electrode-ise-closed-loop-hydroponics.html",
    "icon": "📚",
    "desc": "Engineering principles of real-time multi-ion sensing (NO3-, K+, Ca2+, Mg2+, H2PO4-), Nicolsky-Eisenman interference correction, Davies activity.",
    "tags": "articles article-60-potentiometric-ion-selective-electrode-ise-closed-loop-hydroponics html real-time ion-selective electrode ise arrays nicolsky-eisenman potentiometry closed-loop"
  },
  {
    "title": "Dynamic Thermal Screen Gap Control, Evaporative Transpiration Latent Heat & Psychrometric Energy Optimization in Semi-Closed Venlo Greenhouses",
    "cat": "article",
    "url": "articles/article-61-thermal-screen-gap-transpiration-latent-heat-greenhouse-energy.html",
    "icon": "📚",
    "desc": "Thermodynamic modeling of thermal screen gaps, Rayleigh-Bénard cold downdraft convection, crop latent heat transpiration, and active psychrometri",
    "tags": "articles article-61-thermal-screen-gap-transpiration-latent-heat-greenhouse-energy html dynamic thermal screen gap control evaporative transpiration latent heat psychrometric energ"
  },
  {
    "title": "2026-2027 US 50-State Agricultural Grant & Subsidy Playbook: Non-Dilutive Capital for Smart Farms & CEA Growers",
    "cat": "article",
    "url": "articles/article-62-us-50-state-agricultural-grant-playbook.html",
    "icon": "📚",
    "desc": "Comprehensive 50-state commercial agricultural subsidy and grant playbook. How US farmers, CEA greenhouse operators, and agribusinesses secure up",
    "tags": "articles article-62-us-50-state-agricultural-grant-playbook html 2026-2027 us 50-state agricultural grant subsidy playbook non-dilutive capital for smart farms cea growers comprehe"
  },
  {
    "title": "Precision Irrigation & Water Grants in Florida & Texas: FDACS BMP Cost-Share and TWDB Funding Guide",
    "cat": "article",
    "url": "articles/article-63-florida-texas-agricultural-water-irrigation-grants.html",
    "icon": "📚",
    "desc": "Technical guide for Florida and Texas commercial agricultural producers to secure up to 87.5% cost-share for precision micro-irrigation, subsurfa",
    "tags": "articles article-63-florida-texas-agricultural-water-irrigation-grants html precision irrigation water grants in florida texas fdacs bmp cost-share and twdb funding guide technical"
  },
  {
    "title": "Midwest & Corn Belt Soil Health Grants: Iowa WQI, Ohio H2Ohio, and Minnesota AGRI Programs",
    "cat": "article",
    "url": "articles/article-64-midwest-corn-belt-water-quality-soil-health-subsidies.html",
    "icon": "📚",
    "desc": "Technical guide for Midwest row-crop producers and livestock operators to access 75% to 100% grant funding for edge-of-field bioreactors, saturat",
    "tags": "articles article-64-midwest-corn-belt-water-quality-soil-health-subsidies html midwest corn belt soil health grants iowa wqi ohio h2ohio and minnesota agri programs technical guide"
  },
  {
    "title": "Greenhouse Energy Efficiency & Thermal Screen Grants: Oregon ETO, Washington WSDA, and NYSERDA Guide",
    "cat": "article",
    "url": "articles/article-65-pnw-northeast-cea-greenhouse-energy-grants.html",
    "icon": "📚",
    "desc": "Technical guide for commercial greenhouse and CEA nursery growers in Oregon, Washington, New York, and Massachusetts to capture up to 85% grant f",
    "tags": "articles article-65-pnw-northeast-cea-greenhouse-energy-grants html greenhouse energy efficiency thermal screen grants oregon eto washington wsda and nyserda guide technical guide "
  },
  {
    "title": "California SWEEP vs. Texas TWDB Agricultural Water Grants: Precision Irrigation & Cost-Share Architecture",
    "cat": "article",
    "url": "articles/article-66-california-sweep-vs-texas-twdb-agricultural-water-grants.html",
    "icon": "📚",
    "desc": "Technical comparison of California CDFA SWEEP ($200,000 cap) and Texas TWDB Agricultural Water Conservation Grants ($500,000 cap). Detailed engin",
    "tags": "articles article-66-california-sweep-vs-texas-twdb-agricultural-water-grants html california sweep vs texas twdb agricultural water grants precision irrigation cost-share architect"
  },
  {
    "title": "Deep Geothermal Heating & Industrial Heat Pumps in Commercial Venlo Greenhouses: German Meister Engineering (VDI 4640 / DIN EN 13031) vs. US DOE & USDA REAP Grants",
    "cat": "article",
    "url": "articles/article-67-geothermal-district-heating-industrial-heat-pumps-greenhouse.html",
    "icon": "📚",
    "desc": "Technical engineering guide to deep geothermal doublets, industrial heat pumps (R717/R1233zd(E)), VDI 4640 / DIN EN 13031 standards, root-zone.",
    "tags": "articles article-67-geothermal-district-heating-industrial-heat-pumps-greenhouse html deep geothermal heating industrial heat pumps in commercial venlo greenhouses german meister e"
  },
  {
    "title": "Direct Air Capture (DAC) & Low-Temperature Solid-Amine CO₂ Desorption in Decarbonized Venlo Greenhouses: Resolving the Carbon Deficit via Heat Pump Thermal Cascading & 45Q Grants",
    "cat": "article",
    "url": "articles/article-68-direct-air-capture-solid-amine-co2-greenhouse-heat-pumps.html",
    "icon": "📚",
    "desc": "Technical guide to solid-amine TVSA Direct Air Capture (DAC) integrated with heat pump low-grade thermal waste heat (65°C–80°C) for fossil-free V",
    "tags": "articles article-68-direct-air-capture-solid-amine-co2-greenhouse-heat-pumps html direct air capture dac low-temperature solid-amine co desorption in decarbonized venlo greenhouses"
  },
  {
    "title": "Biomass-Fired CHP District Energy Integration in Venlo Greenhouses: High-Temperature Flue Gas Cleaning, Substrate Heating, and Cross-Sector Municipal Heat Sharing",
    "cat": "article",
    "url": "articles/article-69-biomass-chp-flue-gas-scr-district-heating-greenhouse.html",
    "icon": "📚",
    "desc": "Technical whitepaper on biomass-fired combined heat and power (CHP) in high-wire Venlo greenhouses: fluidized bed combustion, catalytic SCR DeNOx",
    "tags": "articles article-69-biomass-chp-flue-gas-scr-district-heating-greenhouse html biomass-fired chp district energy integration in venlo greenhouses high-temperature flue gas cleaning "
  },
  {
    "title": "Nanobubble Oxy-Fertigation & Cavitation Physics in Closed-Loop Venlo Hydroponics: Dissolved Oxygen Supersaturation (DO > 30 mg/L), Pythium Suppression, and Rootzone Respiration Kinetics",
    "cat": "article",
    "url": "articles/article-70-nanobubble-dissolved-oxygen-pythium-suppression-rockwool.html",
    "icon": "📚",
    "desc": "Technical whitepaper on nanobubble oxy-fertigation in high-wire Venlo greenhouses: Young-Laplace internal bubble pressure, zeta potential stabili",
    "tags": "articles article-70-nanobubble-dissolved-oxygen-pythium-suppression-rockwool html nanobubble oxy-fertigation cavitation physics in closed-loop venlo hydroponics dissolved oxygen su"
  },
  {
    "title": "Horizontal Air Flow (HAF) Aerodynamics & Boundary Layer Decoupling in Venlo Greenhouses: Microclimate Stratification, Sherwood Mass Transfer Kinetics, and Heat Recovery Dehumidification",
    "cat": "article",
    "url": "articles/article-71-haf-fan-microclimate-boundary-layer-dynamics.html",
    "icon": "📚",
    "desc": "Technical whitepaper on horizontal air flow (HAF) aerodynamics in commercial Venlo greenhouses: microclimate stratification elimination, boundary",
    "tags": "articles article-71-haf-fan-microclimate-boundary-layer-dynamics html horizontal air flow haf aerodynamics boundary layer decoupling in venlo greenhouses microclimate stratificatio"
  },
  {
    "title": "Thermodynamic Optimization of Semi-Closed Venlo Greenhouses: High-Pressure Fogging, Active Mechanical Dehumidification, and Latent Heat Recovery",
    "cat": "article",
    "url": "articles/article-72-semi-closed-greenhouse-mollier-psychrometrics-latent-heat.html",
    "icon": "📚",
    "desc": "Technical engineering monograph on semi-closed Venlo greenhouse thermodynamics: positive-pressure air distribution ducts, Mollier h-x psychrometr",
    "tags": "articles article-72-semi-closed-greenhouse-mollier-psychrometrics-latent-heat html thermodynamic optimization of semi-closed venlo greenhouses high-pressure fogging active mechanic"
  },
  {
    "title": "Closed-Loop Hydroponic Drainage Recirculation: Davies Chemical Speciation, Multi-Cycle Ballast Ion (Na⁺/Cl⁻) Accumulation Kinetics, and German DüV Zero-Discharge Economics",
    "cat": "article",
    "url": "articles/article-73-closed-loop-nutrient-recirculation-davies-ion-balance.html",
    "icon": "📚",
    "desc": "Technical engineering monograph on closed-loop hydroponic drainage recirculation: Davies ionic activity speciation, multi-cycle sodium and chlori",
    "tags": "articles article-73-closed-loop-nutrient-recirculation-davies-ion-balance html closed-loop hydroponic drainage recirculation davies chemical speciation multi-cycle ballast ion na c"
  },
  {
    "title": "Semi-Closed Greenhouse Corridor Air Treatment Units (ATU): Positive-Pressure Insect Exclusion (+20~25 Pa), Mollier Enthalpy Balancing, and 1-Click VenloCAD 3D Integration",
    "cat": "article",
    "url": "articles/article-74-semi-closed-greenhouse-atu-mollier-venlocad-integration.html",
    "icon": "📚",
    "desc": "Technical engineering monograph on semi-closed greenhouse corridor Air Treatment Units (ATU): positive-pressure insect exclusion (+20~25 Pa), Mol",
    "tags": "articles article-74-semi-closed-greenhouse-atu-mollier-venlocad-integration html semi-closed greenhouse corridor air treatment units atu positive-pressure insect exclusion 20 25 pa"
  },
  {
    "title": "Aquifer Thermal Energy Storage (ATES) & Industrial Heat Pump Integration in Commercial Greenhouses",
    "cat": "article",
    "url": "articles/article-75-ates-aquifer-thermal-energy-storage-heat-pumps-greenhouse.html",
    "icon": "📚",
    "desc": "Technical engineering monograph on Aquifer Thermal Energy Storage (ATES) and industrial heat pump integration in commercial CEA greenhouses.",
    "tags": "articles article-75-ates-aquifer-thermal-energy-storage-heat-pumps-greenhouse html aquifer thermal energy storage ates industrial heat pump integration in commercial greenhouses te"
  },
  {
    "title": "High-Tech Venlo Greenhouse Climate Engineering & Biocontrol Cybernetics in Knoblauchsland",
    "cat": "article",
    "url": "articles/article-76-knoblauchsland-greenhouse-climate-vpd-biocontrol-oecd.html",
    "icon": "📚",
    "desc": "Technical engineering monograph on modern CEA greenhouse management in Nuremberg Knoblauchsland: AR diffuse glass (96% transmission, 25% haze), V",
    "tags": "articles article-76-knoblauchsland-greenhouse-climate-vpd-biocontrol-oecd html high-tech venlo greenhouse climate engineering biocontrol cybernetics in knoblauchsland technical eng"
  },
  {
    "title": "High-Tech Greenhouse Postharvest Intralogistics & Cold Chain Engineering",
    "cat": "article",
    "url": "articles/article-77-greenhouse-postharvest-intralogistics-cold-chain-quality.html",
    "icon": "📚",
    "desc": "Technical monograph on modern CEA postharvest engineering: AGV/FTS fleet intralogistics, forced-air precooling thermodynamics (12–15°C), chilling",
    "tags": "articles article-77-greenhouse-postharvest-intralogistics-cold-chain-quality html high-tech greenhouse postharvest intralogistics cold chain engineering technical monograph on mode"
  },
  {
    "title": "EU Commercial Greenhouse Energy Auditing (DIN V 18599 / EN 13031-1), German Federal BLE 40% Decarbonization Grants, and 10-Year Hofnachfolge Equity Succession Engineering",
    "cat": "article",
    "url": "articles/article-78-eu-greenhouse-energy-audit-din-18599-ble-grant-hofnachfolge.html",
    "icon": "📚",
    "desc": "Technical engineering and agri-finance monograph on EU commercial greenhouse energy auditing (DIN V 18599 / EN 13031-1), German Federal BLE 40% d",
    "tags": "articles article-78-eu-greenhouse-energy-audit-din-18599-ble-grant-hofnachfolge html eu commercial greenhouse energy auditing din v 18599 en 13031-1 german federal ble 40 decarboni"
  },
  {
    "title": "🇩🇪 VPD-Meisterklasse im Gewächshaus: Dampfdruckdefizit, Blatt-zu-Luft-Physik & Klimacomputer-Steuerung",
    "cat": "article",
    "url": "articles/de/article-01-vpd-meisterklasse.html",
    "icon": "🇩🇪",
    "desc": "Physikalische Berechnung des Dampfdruckdefizits (VPD), Blatt-zu-Luft-Transpirationsdynamik und Vermeidung von Blütenendfäule im modernen Untergla",
    "tags": "articles de article-01-vpd-meisterklasse html vpd-meisterklasse im gewächshaus dampfdruckdefizit blatt-zu-luft-physik klimacomputer-steuerung physikalische berechnung des dampfdruc"
  },
  {
    "title": "🇩🇪 Wärmedurchgangskoeffizienten (U'-Werte), Kittlose Verglasung und Mehrlagenschirm-Thermodynamik im Venlo-Gewächshaus",
    "cat": "article",
    "url": "articles/de/article-04-gewaechshaus-waermeverlust-u-wert-energieschirme.html",
    "icon": "🇩🇪",
    "desc": "Bauphysikalische Berechnung von Spitzenheizlasten (Q = U'·A·ΔT), kittloser Verglasung, Kamineffekt, Mehrlagenschirmen (Luxous 1147 FR) und Latent",
    "tags": "articles de article-04-gewaechshaus-waermeverlust-u-wert-energieschirme html wärmedurchgangskoeffizienten u -werte kittlose verglasung und mehrlagenschirm-thermodynamik im venlo-ge"
  },
  {
    "title": "🇩🇪 Stündliche Penman-Monteith-Evapotranspiration (ET₀), Strahlungssummen-Bewässerung und Autonome Klimacomputer-Architekturen (RAM CC600 & Priva Operator)",
    "cat": "article",
    "url": "articles/de/article-05-penman-monteith-transpiration-automatisierung-ram-priva.html",
    "icon": "🇩🇪",
    "desc": "Biophysikalische Modellierung der FAO-56 Penman-Monteith-Transpiration (ET₀), Strahlungssummen-Tropfbewässerung und dezentrale Klimacomputer-Fern",
    "tags": "articles de article-05-penman-monteith-transpiration-automatisierung-ram-priva html stündliche penman-monteith-evapotranspiration et strahlungssummen-bewässerung und autonome klima"
  },
  {
    "title": "🇩🇪 Molare Stöchiometrie, Sonneveld/Steiner-Ionenbilanz (mmol/L & meq/L) und Geschlossene A/B-Fertigationssysteme im Unterglasgartenbau",
    "cat": "article",
    "url": "articles/de/article-06-naehrloesungsberechnung-stammbehaelter-ab-ec-duengung.html",
    "icon": "🇩🇪",
    "desc": "Molare Nährlösungsberechnung (mmol/L & meq/L) nach Sonneveld und Steiner, Kationen-Anionen-Äquivalenz, A/B-Stammlösungsbehälter (Gipsfällungsschu",
    "tags": "articles de article-06-naehrloesungsberechnung-stammbehaelter-ab-ec-duengung html molare stöchiometrie sonneveld steiner-ionenbilanz mmol l meq l und geschlossene a b-fertigationss"
  },
  {
    "title": "🇩🇪 Photomorphogenese, PAR/ePAR-Spektralqualität (DIN 5031-10) und der Emerson-Steigerungseffekt in der modernen LED-Gewächshausbelichtung",
    "cat": "article",
    "url": "articles/de/article-07-belichtungsspektrum-par-epar-photomorphogenese-led-gartenbau.html",
    "icon": "🇩🇪",
    "desc": "Photobiologische Steuerung im Unterglasgartenbau und Vertical Farming nach DIN 5031-10: McCree-Quantenspektrum, Phytochrom-Photogleichgewicht (PS",
    "tags": "articles de article-07-belichtungsspektrum-par-epar-photomorphogenese-led-gartenbau html photomorphogenese par epar-spektralqualität din 5031-10 und der emerson-steigerungseffekt i"
  },
  {
    "title": "🇩🇪 Optimierung des Dunkelrot- (730nm) und Hellrot- (660nm) LED-Spektrums für Gewächshauskulturen",
    "cat": "article",
    "url": "articles/de/article-24-far-red-deep-red-spektrum-optimierung.html",
    "icon": "🇩🇪",
    "desc": "Wissenschaftliche Analyse des Emerson-Effekts, des Photosystem-Gleichgewichts und der Dunkelrot-Zusatzbelichtung im erwerbsmäßigen Gewächshausanb",
    "tags": "articles de article-24-far-red-deep-red-spektrum-optimierung html optimierung des dunkelrot- 730nm und hellrot- 660nm led-spektrums für gewächshauskulturen wissenschaftliche analys"
  },
  {
    "title": "🇩🇪 Geschlossene Nährlösungs-Kreisläufe und Nanoblasen-Sauerstoffbegasung im modernen Gewächshaus",
    "cat": "article",
    "url": "articles/de/article-25-geschlossene-hydrokultur-nanoblasen-sauerstoff.html",
    "icon": "🇩🇪",
    "desc": "Ingenieurwissenschaftliche Analyse geschlossener Hydrokultursysteme, Rhizosphären-Sauerstoffgehalt (DO > 8,5 mg/L) und Pythium-Prävention im gesc",
    "tags": "articles de article-25-geschlossene-hydrokultur-nanoblasen-sauerstoff html geschlossene nährlösungs-kreisläufe und nanoblasen-sauerstoffbegasung im modernen gewächshaus ingenieurwi"
  },
  {
    "title": "🇩🇪 Gewächshaus-Heizlastberechnung und Energieschirm-Dynamik nach DIN V 18599",
    "cat": "article",
    "url": "articles/de/article-26-gewaechshaus-heizlast-din-v-18599.html",
    "icon": "🇩🇪",
    "desc": "Ingenieurwissenschaftliche Berechnung von Spitzenheizlasten, Rohrheizungs-Hydraulik und Energieschirmeinsparungen nach DIN V 18599.",
    "tags": "articles de article-26-gewaechshaus-heizlast-din-v-18599 html gewächshaus-heizlastberechnung und energieschirm-dynamik nach din v 18599 ingenieurwissenschaftliche berechnung von sp"
  },
  {
    "title": "🇩🇪 Vorhersagbare Biomasseakkumulation und Lichtnutzungseffizienz (LUE) unter dynamischem DLI",
    "cat": "article",
    "url": "articles/de/article-27-pflanzenertrag-biomasse-lichtnutzungseffizienz.html",
    "icon": "🇩🇪",
    "desc": "Ertragsprognosen im erwerbsmäßigen Gewächshausanbau basierend auf dem kumulierten DLI und der Lichtnutzungseffizienz (LUE = 2,8 - 3,4 g/mol).",
    "tags": "articles de article-27-pflanzenertrag-biomasse-lichtnutzungseffizienz html vorhersagbare biomasseakkumulation und lichtnutzungseffizienz lue unter dynamischem dli ertragsprognosen "
  },
  {
    "title": "🇩🇪 CO₂-Begasungskinetik und Wirtschaftlichkeitsgrenzen unter dynamischer Lüftung",
    "cat": "article",
    "url": "articles/de/article-28-gewaechshaus-co2-duengung-oekonomie.html",
    "icon": "🇩🇪",
    "desc": "Analyse der CO2-Düngung, Lüftungsverlust-Dynamik und ökonomischen ROI-Schwellenwerte im geschützten Erwerbsanbau.",
    "tags": "articles de article-28-gewaechshaus-co2-duengung-oekonomie html co -begasungskinetik und wirtschaftlichkeitsgrenzen unter dynamischer lüftung analyse der co2-düngung lüftungsverlus"
  },
  {
    "title": "🇩🇪 Stundengenaue Penman-Monteith Evapotranspiration und Stomatawiderstands-Dynamik",
    "cat": "article",
    "url": "articles/de/article-29-stundengenaue-penman-monteith-evapotranspiration.html",
    "icon": "🇩🇪",
    "desc": "Ingenieurwissenschaftliche Modellierung der stündlichen Evapotranspiration (ETc), des Spaltöffnungswiderstands (rs) und der Präzisionsbewässerung",
    "tags": "articles de article-29-stundengenaue-penman-monteith-evapotranspiration html stundengenaue penman-monteith evapotranspiration und stomatawiderstands-dynamik ingenieurwissenschaftli"
  },
  {
    "title": "🇩🇪 Steinwolle-Hydrodynamik, TDR-Feuchtesensoren und Drainage-EC-Steuerung",
    "cat": "article",
    "url": "articles/de/article-30-steinwolle-tdr-feuchte-drain-ec.html",
    "icon": "🇩🇪",
    "desc": "Ingenieuranalyse von volumetrischem Wassergehalt (VWC %), Nachtabtrocknung und Drainage-EC-Steuerung im Steinwolleanbau.",
    "tags": "articles de article-30-steinwolle-tdr-feuchte-drain-ec html steinwolle-hydrodynamik tdr-feuchtesensoren und drainage-ec-steuerung ingenieuranalyse von volumetrischem wassergehalt v"
  },
  {
    "title": "🇩🇪 Hochdruck-Nebeltechnik (70 bar), Sauter-Tropfendurchmesser und adiabatische Kühlung",
    "cat": "article",
    "url": "articles/de/article-31-hochdruck-nebel-tropfenphysik.html",
    "icon": "🇩🇪",
    "desc": "Ingenieuranalyse der 70-bar-Hochdruckvernebelung, Sauter-Durchmesser (D32 < 10µm), adiabaten Verdunstungskühlung und VPD-Stabilisierung im Gewäch",
    "tags": "articles de article-31-hochdruck-nebel-tropfenphysik html hochdruck-nebeltechnik 70 bar sauter-tropfendurchmesser und adiabatische kühlung ingenieuranalyse der 70-bar-hochdruckvern"
  },
  {
    "title": "🇩🇪 Gartenbau-LED-Wärmemanagement, Sperrschichttemperatur (Tj) und Lebensdauer",
    "cat": "article",
    "url": "articles/de/article-32-led-waermemanagement-sperrschichttemperatur.html",
    "icon": "🇩🇪",
    "desc": "Ingenieurwissenschaftliche Berechnung von LED-Kühlkörpern, Sperrschichttemperaturen (Tj), thermischer Effizienzdegradation und Konvektionswärme i",
    "tags": "articles de article-32-led-waermemanagement-sperrschichttemperatur html gartenbau-led-wärmemanagement sperrschichttemperatur tj und lebensdauer ingenieurwissenschaftliche berechnun"
  },
  {
    "title": "🇩🇪 Präzisions-Pflanzensteuerung: Balance zwischen vegetativem und generativem Wachstum",
    "cat": "article",
    "url": "articles/de/article-33-praezisions-pflanzensteuerung-dif-vpd.html",
    "icon": "🇩🇪",
    "desc": "Gartenbauliche Pflanzensteuerung (Crop Steering): Steuerung des vegetativen Wachstums und Fruchtansatzes über Temperatur-DIF, VPD und Substratabt",
    "tags": "articles de article-33-praezisions-pflanzensteuerung-dif-vpd html präzisions-pflanzensteuerung balance zwischen vegetativem und generativem wachstum gartenbauliche pflanzensteuerun"
  },
  {
    "title": "🇩🇪 UV-C Entkeimung und Pathogeninaktivierungs-Kinetik im geschlossenen Anbau",
    "cat": "article",
    "url": "articles/de/article-34-uvc-entkeimung-geschlossene-hydrokultur.html",
    "icon": "🇩🇪",
    "desc": "Ingenieurwissenschaftliche Berechnung von UV-C-Strahlungsdosen (250 mJ/cm2), UVT%-Transmission und 5-Log-Pathogeninaktivierung (ToBRFV, Pythium) ",
    "tags": "articles de article-34-uvc-entkeimung-geschlossene-hydrokultur html uv-c entkeimung und pathogeninaktivierungs-kinetik im geschlossenen anbau ingenieurwissenschaftliche berechnung "
  },
  {
    "title": "🇩🇪 CFD-Strömungssimulation von horizontalen Umluftventilatoren (HAF)",
    "cat": "article",
    "url": "articles/de/article-35-gewaechshaus-haf-ventilatoren-cfd.html",
    "icon": "🇩🇪",
    "desc": "Numerische Strömungsmechanik (CFD) von horizontalen Umluftventilatoren (HAF), Wurfweiten, Bernoulli-Induktion und Mikroklima-Homogenisierung im G",
    "tags": "articles de article-35-gewaechshaus-haf-ventilatoren-cfd html cfd-strömungssimulation von horizontalen umluftventilatoren haf numerische strömungsmechanik cfd von horizontalen umlu"
  },
  {
    "title": "🇩🇪 BHKW-Rauchgasreinigung, SCR-Katalysatortechnik und CO₂-Düngung",
    "cat": "article",
    "url": "articles/de/article-36-bhkw-rauchgas-scr-entstickung.html",
    "icon": "🇩🇪",
    "desc": "Ingenieurwissenschaftliche Auslegung von SCR-Entstickungsanlagen, Harnstoffdosierung (AdBlue) und Reingas-CO2-Düngung im Gewächshaus.",
    "tags": "articles de article-36-bhkw-rauchgas-scr-entstickung html bhkw-rauchgasreinigung scr-katalysatortechnik und co -düngung ingenieurwissenschaftliche auslegung von scr-entstickungsanl"
  },
  {
    "title": "🇩🇪 Wärmepufferspeicher-Schichtung und thermische Energiespeicherung",
    "cat": "article",
    "url": "articles/de/article-37-waermepufferspeicher-schichtung-auslegung.html",
    "icon": "🇩🇪",
    "desc": "Ingenieurwissenschaftliche Berechnung von Heißwasser-Wärmepufferspeichern, Thermokline-Richardson-Zahl und nächtlicher Entladedauer im Erwerbsgar",
    "tags": "articles de article-37-waermepufferspeicher-schichtung-auslegung html wärmepufferspeicher-schichtung und thermische energiespeicherung ingenieurwissenschaftliche berechnung von hei"
  },
  {
    "title": "🇩🇪 Xylem-Kalziumtransport, Ionen-Partitionierung und Blütenendfäule (BER)",
    "cat": "article",
    "url": "articles/de/article-38-xylem-kalzium-bluetenendfaeule.html",
    "icon": "🇩🇪",
    "desc": "Pflanzenphysiologische Analyse des Xylem-Transpirationsstroms, Kalziumverteilung in der Frucht und Vorbeugung von Blütenendfäule (BER) im Untergl",
    "tags": "articles de article-38-xylem-kalzium-bluetenendfaeule html xylem-kalziumtransport ionen-partitionierung und blütenendfäule ber pflanzenphysiologische analyse des xylem-transpiratio"
  },
  {
    "title": "🇩🇪 Umkehrosmose-Entsalzung, Natriumrückhaltung (Na+) und Energieeffizienz",
    "cat": "article",
    "url": "articles/de/article-39-umkehrosmose-entsalzung-energieeffizienz.html",
    "icon": "🇩🇪",
    "desc": "Ingenieurwissenschaftliche Berechnung von Niederdruck-Umkehrosmose (RO), Natriumrückhaltung (99,2%), Energierückgewinnung (PX) und geschlossener ",
    "tags": "articles de article-39-umkehrosmose-entsalzung-energieeffizienz html umkehrosmose-entsalzung natriumrückhaltung na und energieeffizienz ingenieurwissenschaftliche berechnung von ni"
  },
  {
    "title": "🇩🇪 Lichtextinktion im Pflanzenbestand (Beer-Lambert) und Diffusglas-Technologie",
    "cat": "article",
    "url": "articles/de/article-40-beer-lambert-lichtextinktion-diffusglas.html",
    "icon": "🇩🇪",
    "desc": "Pflanzenphysiologische Berechnung der Lichtextinktion im Pflanzenbestand (Beer-Lambertsches Gesetz), Blattflächenindex (LAI) und Ertragssteigerun",
    "tags": "articles de article-40-beer-lambert-lichtextinktion-diffusglas html lichtextinktion im pflanzenbestand beer-lambert und diffusglas-technologie pflanzenphysiologische berechnung der"
  },
  {
    "title": "🇩🇪 Das biochemische Farquhar-Photosynthesemodell (FvCB) und CO₂-Düngung",
    "cat": "article",
    "url": "articles/de/article-41-farquhar-fvcb-photosynthese-co2.html",
    "icon": "🇩🇪",
    "desc": "Biochemische Modellierung der C3-Photosynthese nach Farquhar, von Caemmerer und Berry (FvCB), Rubisco-Carboxylierungsrate (Vcmax) und Elektronent",
    "tags": "articles de article-41-farquhar-fvcb-photosynthese-co2 html das biochemische farquhar-photosynthesemodell fvcb und co -düngung biochemische modellierung der c3-photosynthese nach f"
  },
  {
    "title": "🇩🇪 Substrat-Matrixpotential (Ψm), pF-Wasserspannungskurven und van-Genuchten-Modell",
    "cat": "article",
    "url": "articles/de/article-42-substrat-matrixpotential-pf-kurven.html",
    "icon": "🇩🇪",
    "desc": "Ingenieurwissenschaftliche Bodenphysik: Matrixpotential (Psi_m), pF-Wasserspannungskurven, van-Genuchten-Gleichung und leicht verfügbares Wasser ",
    "tags": "articles de article-42-substrat-matrixpotential-pf-kurven html substrat-matrixpotential m pf-wasserspannungskurven und van-genuchten-modell ingenieurwissenschaftliche bodenphysik m"
  },
  {
    "title": "🇩🇪 Gewächshaus-Tragwerksplanung (DIN EN 13031-1 & NEN 3859): Wind-, Schnee- und Kulturlasten",
    "cat": "article",
    "url": "articles/de/article-43-gewaechshaus-tragwerksplanung-din-en-13031.html",
    "icon": "🇩🇪",
    "desc": "Bauingenieurtechnische Bemessung von Venlo-Gewächshäusern nach DIN EN 13031-1, Windlasten (qw), Schneelasten, Kulturpflanzenlasten und Fundamentb",
    "tags": "articles de article-43-gewaechshaus-tragwerksplanung-din-en-13031 html gewächshaus-tragwerksplanung din en 13031-1 nen 3859 wind- schnee- und kulturlasten bauingenieurtechnische be"
  },
  {
    "title": "🇩🇪 Meister-Deutsch: Open-Source Spaced Repetition System für den Gartenbau",
    "cat": "article",
    "url": "articles/de/article-44-meister-deutsch-open-source-srs-lernsystem.html",
    "icon": "🇩🇪",
    "desc": "Open-Source Spaced Repetition System (SRS) für die deutsche Gärtnermeisterprüfung mit Web Speech API Sprachausgabe und farbenblindengerechter Ben",
    "tags": "articles de article-44-meister-deutsch-open-source-srs-lernsystem html meister-deutsch open-source spaced repetition system für den gartenbau open-source spaced repetition system s"
  },
  {
    "title": "🇩🇪 AgriQuant: Open-Source Energie- und Rohstoff-Quant-Terminal",
    "cat": "article",
    "url": "articles/de/article-45-agriquant-energie-rohstoff-quant-terminal.html",
    "icon": "🇩🇪",
    "desc": "Open-Source Finanz- und Energie-Quant-Terminal für den Erwerbsgartenbau. Berechnung von TTF-Erdgas-Spark-Spreads, Strombörsen-Arbitrage und CO2-W",
    "tags": "articles de article-45-agriquant-energie-rohstoff-quant-terminal html agriquant open-source energie- und rohstoff-quant-terminal open-source finanz- und energie-quant-terminal für "
  },
  {
    "title": "🇩🇪 OpenCEA: Open-Source Python-Framework für die Gewächshausthermodynamik",
    "cat": "article",
    "url": "articles/de/article-46-opencea-python-framework-veroeffentlichung.html",
    "icon": "🇩🇪",
    "desc": "Veröffentlichung von OpenCEA: Quelloffenes Python-Microframework für Gewächshausthermodynamik, Photosyntheseberechnung und Klimasteuerung.",
    "tags": "articles de article-46-opencea-python-framework-veroeffentlichung html opencea open-source python-framework für die gewächshausthermodynamik veröffentlichung von opencea quelloffen"
  },
  {
    "title": "🇩🇪 Computer Vision & Bildverarbeitung zur Schadbilddiagnose im Gartenbau",
    "cat": "article",
    "url": "articles/de/article-47-computer-vision-pflanzenkrankheiten-diagnostik.html",
    "icon": "🇩🇪",
    "desc": "Einsatz von Computer Vision und HSV-Farbraumsegmentierung zur Früherkennung von Botrytis cinerea und Nährstoffmangel im modernen Erwerbsgartenbau",
    "tags": "articles de article-47-computer-vision-pflanzenkrankheiten-diagnostik html computer vision bildverarbeitung zur schadbilddiagnose im gartenbau einsatz von computer vision und hsv-f"
  },
  {
    "title": "🇩🇪 Gewächshaus-Investitionsrechnung: 10-Jahres-CapEx, OpEx & IRR-Modellierung",
    "cat": "article",
    "url": "articles/de/article-48-gewaechshaus-capex-opex-irr-investitionsrechnung.html",
    "icon": "🇩🇪",
    "desc": "Finanzmathematische Investitions- und Wirtschaftlichkeitsrechnung für moderne Venlo-Großgewächshäuser: CapEx (180-320 €/m²), 10-Jahres-Cashflow, ",
    "tags": "articles de article-48-gewaechshaus-capex-opex-irr-investitionsrechnung html gewächshaus-investitionsrechnung 10-jahres-capex opex irr-modellierung finanzmathematische investitions"
  },
  {
    "title": "🇩🇪 Hydrokultur: Chemische Speziation, Debye-Hückel-Aktivität & Sättigungsindex",
    "cat": "article",
    "url": "articles/de/article-49-hydrokultur-chemische-speziation-debye-hueckel.html",
    "icon": "🇩🇪",
    "desc": "Chemische Thermodynamik geschlossener Nährlösungs-Kreisläufe: Debye-Hückel-Aktivitätskoeffizienten und Sättigungsindex (SI) zur Verhinderung von ",
    "tags": "articles de article-49-hydrokultur-chemische-speziation-debye-hueckel html hydrokultur chemische speziation debye-hückel-aktivität sättigungsindex chemische thermodynamik geschloss"
  },
  {
    "title": "🇩🇪 Smart Greenhouse: MQTT- und Edge-IoT-Flottentelemetrie im Großgartenbau",
    "cat": "article",
    "url": "articles/de/article-50-smart-gewaechshaus-mqtt-edge-iot-flotte.html",
    "icon": "🇩🇪",
    "desc": "Industrielle IoT-Architektur für den modernen Erwerbsgartenbau: MQTT-Broker-Topologien, JSON-Telemetrie und echtzeitfähige Edge-Anomalieerkennung",
    "tags": "articles de article-50-smart-gewaechshaus-mqtt-edge-iot-flotte html smart greenhouse mqtt- und edge-iot-flottentelemetrie im großgartenbau industrielle iot-architektur für den mode"
  },
  {
    "title": "🇩🇪 Autonome Gewächshäuser: KI, Reinforcement Learning & Modellprädiktive Regelung",
    "cat": "article",
    "url": "articles/de/article-51-autonome-gewaechshaeuser-ki-mpc-reinforcement-learning.html",
    "icon": "🇩🇪",
    "desc": "Moderne Klimacomputer-Regelung im Unterglasanbau: Modellprädiktive Regelung (MPC) und Reinforcement Learning zur Senkung des Heizenergiebedarfs u",
    "tags": "articles de article-51-autonome-gewaechshaeuser-ki-mpc-reinforcement-learning html autonome gewächshäuser ki reinforcement learning modellprädiktive regelung moderne klimacomputer-"
  },
  {
    "title": "🇩🇪 Aquifer-Wärmespeicher (ATES) & Industrielle Großwärmepumpen im Venlo-Gewächshaus",
    "cat": "article",
    "url": "articles/de/article-52-aquifer-waermespeicher-ates-waermepumpen.html",
    "icon": "🇩🇪",
    "desc": "Thermodynamische Modellierung von Aquifer-Wärmespeichern (ATES / WKO), saisonaler Wärmerückgewinnung und industrieller Wärmepumpen-COP für fossil",
    "tags": "articles de article-52-aquifer-waermespeicher-ates-waermepumpen html aquifer-wärmespeicher ates industrielle großwärmepumpen im venlo-gewächshaus thermodynamische modellierung von "
  },
  {
    "title": "🇩🇪 Biomasse-BHKW Rauchgas-SCR-Reinigung & Biogene CO2-Düngung im Venlo-Gewächshaus",
    "cat": "article",
    "url": "articles/de/article-53-biomasse-bhkw-scr-co2-rueckgewinnung-gartenbau.html",
    "icon": "🇩🇪",
    "desc": "Thermodynamische Modellierung von Biomasse-Heizkraftwerken, selektiver katalytischer Reduktion (SCR), Ethylen-Katalysatoren und phytotoxizitätsfr",
    "tags": "articles de article-53-biomasse-bhkw-scr-co2-rueckgewinnung-gartenbau html biomasse-bhkw rauchgas-scr-reinigung biogene co2-düngung im venlo-gewächshaus thermodynamische modellieru"
  },
  {
    "title": "🇩🇪 KI-basierte Modellprädiktive Regelung (MPC) im Venlo-Gewächshaus: Echtzeit-Energie- und Ertragsoptimierung",
    "cat": "article",
    "url": "articles/de/article-54-ki-modellpraediktive-regelung-mpc-venlo-gewaechshaus.html",
    "icon": "🇩🇪",
    "desc": "Mathematische Zustandsraum-Modellierung der Gewächshaus-Thermodynamik, nichtlineare MPC-Kostenfunktions-Optimierung, Spotmarkt-Integration und au",
    "tags": "articles de article-54-ki-modellpraediktive-regelung-mpc-venlo-gewaechshaus html ki-basierte modellprädiktive regelung mpc im venlo-gewächshaus echtzeit-energie- und ertragsoptimie"
  },
  {
    "title": "🇩🇪 Nährstoff-Aufnahmekonzentrationsfaktor (UCF) in der geschlossenen Hydrokultur: Massenbilanz & Ionendynamik",
    "cat": "article",
    "url": "articles/de/article-55-naehrstoff-aufnahmekonzentrationsfaktor-geschlossene-hydrokultur.html",
    "icon": "🇩🇪",
    "desc": "Ingenieurwissenschaftliche Modellierung des Nährstoff-Aufnahmekonzentrationsfaktors (UCF), Ionenakkumulationskinetik, Natrium-Grenzwerte und Entl",
    "tags": "articles de article-55-naehrstoff-aufnahmekonzentrationsfaktor-geschlossene-hydrokultur html nährstoff-aufnahmekonzentrationsfaktor ucf in der geschlossenen hydrokultur massenbilan"
  },
  {
    "title": "🇩🇪 Dunkelrot-Photobiologie (ePAR 400–750 nm) & Phytochrom-Photostationärer Zustand (PSS) im Unterglasanbau",
    "cat": "article",
    "url": "articles/de/article-56-dunkelrot-photobiologie-epar-phytochrom-photostationaerer-zustand.html",
    "icon": "🇩🇪",
    "desc": "Ingenieurwissenschaftliche Photobiologie von Dunkelrot-Photonen (Far-Red), ePAR (400-750 nm), Phytochrom-Gleichgewicht (PSS) und End-of-Day-Steue",
    "tags": "articles de article-56-dunkelrot-photobiologie-epar-phytochrom-photostationaerer-zustand html dunkelrot-photobiologie epar 400 750 nm phytochrom-photostationärer zustand pss im unt"
  },
  {
    "title": "🇩🇪 Gewächshaus-Energieeffizienz, BLE & KfW-Förderprogramme & DIN EN 13031-1 Smart-Farming-Standards (2026/2027)",
    "cat": "article",
    "url": "articles/de/article-57-gewaechshaus-energieeffizienz-foerderung-ble-kfw-din13031.html",
    "icon": "🇩🇪",
    "desc": "Umfassender B2B-Leitfaden zur Energiewende im deutschen Gartenbau: BLE-Bundesprogramm Energieeffizienz, BAFA/KfW-Modul 4, DIN EN 13031-1 in comme",
    "tags": "articles de article-57-gewaechshaus-energieeffizienz-foerderung-ble-kfw-din13031 html gewächshaus-energieeffizienz ble kfw-förderprogramme din en 13031-1 smart-farming-standards 20"
  },
  {
    "title": "Controlled Environment Agriculture (CEA) & Venlo Greenhouse Engineering Whitepapers Library",
    "cat": "article",
    "url": "articles/index.html",
    "icon": "📚",
    "desc": "Multilingual library of 142 horticultural engineering articles on VPD psychrometrics, DIN V 18599 heating loads, FvCB CO2 kinetics, and MPC contr",
    "tags": "articles index html controlled environment agriculture cea venlo greenhouse engineering whitepapers library multilingual library of 142 horticultural engineering articles on vpd ps"
  },
  {
    "title": "🇯🇵 施設園芸・スマート農業のための飽差（VPD）最適化マスタークラス：物理計算と気候制御",
    "cat": "article",
    "url": "articles/ja/article-01-vpd-masterclass-jp.html",
    "icon": "🇯🇵",
    "desc": "温室栽培および植物工場における飽差（Vapour Pressure Deficit, VPD）の物理計算、葉温と気温差による蒸散ダイナミクス、カルシウム欠乏（尻腐れ病）防止制御。",
    "tags": "articles ja article-01-vpd-masterclass-jp html 施設園芸 スマ ト農業のための飽差 vpd 最適化マスタ クラス 物理計算と気候制御 温室栽培および植物工場における飽差 vapour pressure deficit vpd の物理計算 葉温と気温差による蒸散ダイナミクス カルシウム欠乏 尻腐れ病 防止制御"
  },
  {
    "title": "🇯🇵 遠赤色光（730nm）と深赤色光（660nm）の最適LEDスペクトル比率による光合成量子収率の最大化",
    "cat": "article",
    "url": "articles/ja/article-24-far-red-deep-red-led-spectrum-optimization-jp.html",
    "icon": "🇯🇵",
    "desc": "商業用施設園芸におけるエマーソン効果、光化学系I・IIの励起バランス、および遠赤色光（730nm）補光最適化に関する専門技術解説。",
    "tags": "articles ja article-24-far-red-deep-red-led-spectrum-optimization-jp html 遠赤色光 730nm と深赤色光 660nm の最適ledスペクトル比率による光合成量子収率の最大化 商業用施設園芸におけるエマ ソン効果 光化学系i iiの励起バランス および遠赤色光 730nm 補光最適化に"
  },
  {
    "title": "🇯🇵 完全閉鎖型循環式水耕栽培とナノバブル溶存酸素（DO）動態による生産性最大化",
    "cat": "article",
    "url": "articles/ja/article-25-closed-loop-hydroponic-nanobubble-oxygenation-jp.html",
    "icon": "🇯🇵",
    "desc": "商業用施設園芸における完全循環式養液管理、根圏溶存酸素（DO > 8.5mg/L）制御、およびピシウム根腐れ病抑制のバイオエンジニアリング解説。",
    "tags": "articles ja article-25-closed-loop-hydroponic-nanobubble-oxygenation-jp html 完全閉鎖型循環式水耕栽培とナノバブル溶存酸素 do 動態による生産性最大化 商業用施設園芸における完全循環式養液管理 根圏溶存酸素 do 8 5mg l 制御 およびピシウム根腐れ病抑制のバイオエンジニアリ"
  },
  {
    "title": "🇯🇵 DIN V 18599規格に基づく温室暖房負荷モデリングと保温カーテン熱力学",
    "cat": "article",
    "url": "articles/ja/article-26-greenhouse-heating-load-din-v-18599-jp.html",
    "icon": "🇯🇵",
    "desc": "温室暖房負荷モデリングと保温カーテン熱力学（DIN V 18599） — 商業用連棟温室および植物工場 (CEA) における熱力学・生物物理モデル、環境制御セットポイント、省エネ設計の技術解説。",
    "tags": "articles ja article-26-greenhouse-heating-load-din-v-18599-jp html din v 18599規格に基づく温室暖房負荷モデリングと保温カ テン熱力学 温室暖房負荷モデリングと保温カ テン熱力学 din v 18599 商業用連棟温室および植物工場 cea における熱力学 生物物理モデル 環境制御セ"
  },
  {
    "title": "🇯🇵 動的DLI環境下におけるバイオマス蓄積予測と光利用効率（LUE）",
    "cat": "article",
    "url": "articles/ja/article-27-crop-yield-biomass-light-use-efficiency-jp.html",
    "icon": "🇯🇵",
    "desc": "商業用温室における積算受光量（DLI）、光利用効率（LUE = 2.8 - 3.4 g/mol）、および収穫指数（HI）に基づく収量予測モデル。",
    "tags": "articles ja article-27-crop-yield-biomass-light-use-efficiency-jp html 動的dli環境下におけるバイオマス蓄積予測と光利用効率 lue 商業用温室における積算受光量 dli 光利用効率 lue 2 8 - 3 4 g mol および収穫指数 hi に基づく収量予測モデル"
  },
  {
    "title": "🇯🇵 動的換気環境下における温室CO₂施用動態と経済的ROI閾値",
    "cat": "article",
    "url": "articles/ja/article-28-greenhouse-co2-enrichment-economics-jp.html",
    "icon": "🇯🇵",
    "desc": "商業用施設園芸および大規模ガラス温室における液化炭酸ガス（LCO2）とボイラー排ガス施用の経済性比較、換気ロス動態モデル、および光合成促進によるCO2施用の投資対効果（ROI）を徹底解析。",
    "tags": "articles ja article-28-greenhouse-co2-enrichment-economics-jp html 動的換気環境下における温室co 施用動態と経済的roi閾値 商業用施設園芸および大規模ガラス温室における液化炭酸ガス lco2 とボイラ 排ガス施用の経済性比較 換気ロス動態モデル および光合成促進によるco2施用の投資対効果"
  },
  {
    "title": "🇯🇵 時間別ペンマン・モンティス蒸発散量（ETc）モデリングと気孔抵抗動態",
    "cat": "article",
    "url": "articles/ja/article-29-hourly-penman-monteith-evapotranspiration-jp.html",
    "icon": "🇯🇵",
    "desc": "温室における時間別ペンマン・モンティス蒸発散量（ETc）モデリング — 商業用連棟温室および植物工場 (CEA) における熱力学・生物物理モデル、環境制御セットポイント、省エネ設計の技術解説。",
    "tags": "articles ja article-29-hourly-penman-monteith-evapotranspiration-jp html 時間別ペンマン モンティス蒸発散量 etc モデリングと気孔抵抗動態 温室における時間別ペンマン モンティス蒸発散量 etc モデリング 商業用連棟温室および植物工場 cea における熱力学 生物物理モデル 環境制"
  },
  {
    "title": "🇯🇵 ロックウール培地の水力学、TDR水分センサー較正および排液ECバランシング",
    "cat": "article",
    "url": "articles/ja/article-30-rockwool-slab-tdr-moisture-drain-ec-jp.html",
    "icon": "🇯🇵",
    "desc": "商業用水耕栽培におけるロックウールスラブの体積含水率（VWC %）、夜間ドライダウン動態、および排液ECバランシングの解析。",
    "tags": "articles ja article-30-rockwool-slab-tdr-moisture-drain-ec-jp html ロックウ ル培地の水力学 tdr水分センサ 較正および排液ecバランシング 商業用水耕栽培におけるロックウ ルスラブの体積含水率 vwc 夜間ドライダウン動態 および排液ecバランシングの解析"
  },
  {
    "title": "🇯🇵 高圧細霧冷房（70 bar）の液滴物理学とザウター平均粒径（D32 < 10µm）",
    "cat": "article",
    "url": "articles/ja/article-31-high-pressure-fogging-droplet-physics-jp.html",
    "icon": "🇯🇵",
    "desc": "商業用温室における70 bar高圧フォグ、ザウター平均粒径（D32 < 10µm）、断熱蒸発冷却、およびVPD安定化の工学的解析。",
    "tags": "articles ja article-31-high-pressure-fogging-droplet-physics-jp html 高圧細霧冷房 70 bar の液滴物理学とザウタ 平均粒径 d32 10 m 商業用温室における70 bar高圧フォグ ザウタ 平均粒径 d32 10 m 断熱蒸発冷却 およびvpd安定化の工学的解析"
  },
  {
    "title": "🇯🇵 園芸用LED照明の熱管理、ジャンクション温度（Tj）および寿命動態",
    "cat": "article",
    "url": "articles/ja/article-32-horticultural-led-thermal-junction-temperature-jp.html",
    "icon": "🇯🇵",
    "desc": "商業用温室における園芸用LED器具の放熱設計、ジャンクション温度（Tj）、熱抵抗（Rth）、および発光量子効率の熱劣化メカニズム。",
    "tags": "articles ja article-32-horticultural-led-thermal-junction-temperature-jp html 園芸用led照明の熱管理 ジャンクション温度 tj および寿命動態 商業用温室における園芸用led器具の放熱設計 ジャンクション温度 tj 熱抵抗 rth および発光量子効率の熱劣化メカニズム"
  },
  {
    "title": "🇯🇵 精密クロップステアリング動態：栄養生長と生殖生長の最適バランス制御",
    "cat": "article",
    "url": "articles/ja/article-33-precision-crop-steering-dif-vpd-drydown-jp.html",
    "icon": "🇯🇵",
    "desc": "商業用施設園芸におけるクロップステアリング技術：昼夜温差（DIF）、飽差（VPD）、および培地ドライダウンによる着花・着果最適化。",
    "tags": "articles ja article-33-precision-crop-steering-dif-vpd-drydown-jp html 精密クロップステアリング動態 栄養生長と生殖生長の最適バランス制御 商業用施設園芸におけるクロップステアリング技術 昼夜温差 dif 飽差 vpd および培地ドライダウンによる着花 着果最適化"
  },
  {
    "title": "🇯🇵 完全循環式水耕栽培におけるUV-C殺菌速度論と病原体不活化",
    "cat": "article",
    "url": "articles/ja/article-34-closed-loop-uvc-drain-disinfection-jp.html",
    "icon": "🇯🇵",
    "desc": "商業用循環式水耕栽培におけるUV-C照射線量（250 mJ/cm2）、透過率（UVT%）、およびToBRFV・ピシウム菌の5-Log不活化動態解析。",
    "tags": "articles ja article-34-closed-loop-uvc-drain-disinfection-jp html 完全循環式水耕栽培におけるuv-c殺菌速度論と病原体不活化 商業用循環式水耕栽培におけるuv-c照射線量 250 mj cm2 透過率 uvt およびtobrfv ピシウム菌の5-log不活化動態解析"
  },
  {
    "title": "🇯🇵 水平循環扇（HAF）の数値流体力学（CFD）気流モデリングと微気象均一化",
    "cat": "article",
    "url": "articles/ja/article-35-greenhouse-haf-fan-cfd-modeling-jp.html",
    "icon": "🇯🇵",
    "desc": "商業用温室における水平循環扇（HAF）の配置間隔、噴流到達距離、ベルヌーイ誘引効果、および群落内微気象均一化のCFD解析。",
    "tags": "articles ja article-35-greenhouse-haf-fan-cfd-modeling-jp html 水平循環扇 haf の数値流体力学 cfd 気流モデリングと微気象均一化 商業用温室における水平循環扇 haf の配置間隔 噴流到達距離 ベルヌ イ誘引効果 および群落内微気象均一化のcfd解析"
  },
  {
    "title": "🇯🇵 コージェネ排ガスSCR脱硝、尿素水注入動態および安全なCO₂施用技術",
    "cat": "article",
    "url": "articles/ja/article-36-chp-flue-gas-scr-denitrification-jp.html",
    "icon": "🇯🇵",
    "desc": "商業用施設園芸におけるガスエンジンCHP排ガスの選択的触媒還元（SCR）、尿素水添加化学量論、NOx < 5mg/Nm3除去、および高純度CO2施用技術。",
    "tags": "articles ja article-36-chp-flue-gas-scr-denitrification-jp html コ ジェネ排ガスscr脱硝 尿素水注入動態および安全なco 施用技術 商業用施設園芸におけるガスエンジンchp排ガスの選択的触媒還元 scr 尿素水添加化学量論 nox 5mg nm3除去 および高純度co2施用技術"
  },
  {
    "title": "🇯🇵 温水蓄熱バッファタンクの温度成層動態と蓄熱容量（MWh）設計",
    "cat": "article",
    "url": "articles/ja/article-37-thermal-buffer-tank-stratification-sizing-jp.html",
    "icon": "🇯🇵",
    "desc": "商業用温室における温水蓄熱タンクの温度成層（リチャードソン数 Ri > 10）、蓄熱容量（MWh）、および夜間ピーク暖房放熱時間の工学計算。",
    "tags": "articles ja article-37-thermal-buffer-tank-stratification-sizing-jp html 温水蓄熱バッファタンクの温度成層動態と蓄熱容量 mwh 設計 商業用温室における温水蓄熱タンクの温度成層 リチャ ドソン数 ri 10 蓄熱容量 mwh および夜間ピ ク暖房放熱時間の工学計算"
  },
  {
    "title": "🇯🇵 木部導管カルシウム輸送動態、イオン分配および尻腐れ病（BER）予防",
    "cat": "article",
    "url": "articles/ja/article-38-xylem-calcium-flux-blossom-end-rot-jp.html",
    "icon": "🇯🇵",
    "desc": "植物生理学解析：木部蒸散流によるカルシウム分配機構、果頂部細胞壁の安定化、および昼夜VPD制御による尻腐れ病の完全予防技術。",
    "tags": "articles ja article-38-xylem-calcium-flux-blossom-end-rot-jp html 木部導管カルシウム輸送動態 イオン分配および尻腐れ病 ber 予防 植物生理学解析 木部蒸散流によるカルシウム分配機構 果頂部細胞壁の安定化 および昼夜vpd制御による尻腐れ病の完全予防技術"
  },
  {
    "title": "🇯🇵 完全循環式水耕栽培の逆浸透（RO）脱塩、ナトリウム（Na⁺）阻止動態および省エネ技術",
    "cat": "article",
    "url": "articles/ja/article-39-closed-loop-ro-desalination-energy-jp.html",
    "icon": "🇯🇵",
    "desc": "商業用温室における逆浸透膜（RO）透過流束（LMH）、ナトリウム（Na+）阻止率（99.2%）、等圧式エネルギー回収装置（PX）、および排水ゼロ循環技術。",
    "tags": "articles ja article-39-closed-loop-ro-desalination-energy-jp html 完全循環式水耕栽培の逆浸透 ro 脱塩 ナトリウム na 阻止動態および省エネ技術 商業用温室における逆浸透膜 ro 透過流束 lmh ナトリウム na 阻止率 99 2 等圧式エネルギ 回収装置 px および排水ゼロ循環技術"
  },
  {
    "title": "🇯🇵 群落内光減衰（ランベルト・ベールの法則）と散乱光（ディフューズ）ガラス工学",
    "cat": "article",
    "url": "articles/ja/article-40-beer-lambert-canopy-light-extinction-jp.html",
    "icon": "🇯🇵",
    "desc": "植物生理学解析：ランベルト・ベールの法則に基づく光減衰係数（k）、葉面積指数（LAI）、および散乱光温室ガラス（Hortiscatter 65%）による群落全体の光合成促進効果。",
    "tags": "articles ja article-40-beer-lambert-canopy-light-extinction-jp html 群落内光減衰 ランベルト ベ ルの法則 と散乱光 ディフュ ズ ガラス工学 植物生理学解析 ランベルト ベ ルの法則に基づく光減衰係数 k 葉面積指数 lai および散乱光温室ガラス hortiscatter 65 による群"
  },
  {
    "title": "🇯🇵 ファーカー（FvCB）光合成生化学モデルとCO₂施用反応速度論",
    "cat": "article",
    "url": "articles/ja/article-41-farquhar-photosynthesis-fvcb-co2-jp.html",
    "icon": "🇯🇵",
    "desc": "植物生理学・生化学解析：ファーカー・フォン・ケメラー・ベリー（FvCB）モデル、ルビスコ最大カルボキシル化速度（Vcmax）、電子伝達速度（J）、およびCO2施用飽和動態。",
    "tags": "articles ja article-41-farquhar-photosynthesis-fvcb-co2-jp html ファ カ fvcb 光合成生化学モデルとco 施用反応速度論 植物生理学 生化学解析 ファ カ フォン ケメラ ベリ fvcb モデル ルビスコ最大カルボキシル化速度 vcmax 電子伝達速度 j およびco2施用飽和動態"
  },
  {
    "title": "🇯🇵 培地マトリックポテンシャル（Ψm）、pF 水分保持曲線およびファン・ヘヌフテン理論",
    "cat": "article",
    "url": "articles/ja/article-42-substrate-matric-potential-pf-curves-jp.html",
    "icon": "🇯🇵",
    "desc": "農業土壌物理学解析：マトリック吸引圧（Psi_m）、pF水分保持曲線、ファン・ヘヌフテン（van Genuchten）水理モデル、およびロックウール・ココピートの易有効水分（EAW）管理。",
    "tags": "articles ja article-42-substrate-matric-potential-pf-curves-jp html 培地マトリックポテンシャル m pf 水分保持曲線およびファン ヘヌフテン理論 農業土壌物理学解析 マトリック吸引圧 psi m pf水分保持曲線 ファン ヘヌフテン van genuchten 水理モデル およびロックウ "
  },
  {
    "title": "🇯🇵 温室構造設計基準（EN 13031-1 & NEN 3859）：風圧・積雪・作物誘引荷重力学",
    "cat": "article",
    "url": "articles/ja/article-43-greenhouse-structural-standards-en13031-jp.html",
    "icon": "🇯🇵",
    "desc": "土木建築構造力学解析：EN 13031-1およびNEN 3859に基づくフェンロー型温室の風圧（qw）、積雪荷重、作物誘引荷重、および支柱曲げモーメント設計。",
    "tags": "articles ja article-43-greenhouse-structural-standards-en13031-jp html 温室構造設計基準 en 13031-1 nen 3859 風圧 積雪 作物誘引荷重力学 土木建築構造力学解析 en 13031-1およびnen 3859に基づくフェンロ 型温室の風圧 qw 積雪荷重 作物誘引荷重 およ"
  },
  {
    "title": "🇯🇵 Meister-Deutsch：施設園芸ドイツ語オープンソースSRS＆音声合成エンジン",
    "cat": "article",
    "url": "articles/ja/article-44-meister-deutsch-open-source-srs-engine-jp.html",
    "icon": "🇯🇵",
    "desc": "ドイツ・ゲルトナーマイスター（農業マイスター）資格試験向けのオープンソース分散反復（SRS）学習Webアプリ。Web Speech API音声合成および色覚バリアフリー設計。",
    "tags": "articles ja article-44-meister-deutsch-open-source-srs-engine-jp html meister-deutsch 施設園芸ドイツ語オ プンソ スsrs 音声合成エンジン ドイツ ゲルトナ マイスタ 農業マイスタ 資格試験向けのオ プンソ ス分散反復 srs 学習webアプリ web speech ap"
  },
  {
    "title": "🇯🇵 AgriQuant：施設園芸エネルギー＆一次産品オープンソース・クオンツ端末",
    "cat": "article",
    "url": "articles/ja/article-45-agriquant-energy-commodity-quant-terminal-jp.html",
    "icon": "🇯🇵",
    "desc": "商業用施設園芸向けオープンソース金融工学・エネルギー分析ターミナル。オランダTTF天然ガス価格、スパークスプレッド、電力売電アービトラージ、およびCO2施用ROI分析。",
    "tags": "articles ja article-45-agriquant-energy-commodity-quant-terminal-jp html agriquant 施設園芸エネルギ 一次産品オ プンソ ス クオンツ端末 商業用施設園芸向けオ プンソ ス金融工学 エネルギ 分析タ ミナル オランダttf天然ガス価格 スパ クスプレッド 電力売電ア ビトラ ジ"
  },
  {
    "title": "🇯🇵 OpenCEA：施設園芸物理オープンソースPythonフレームワークの公開",
    "cat": "article",
    "url": "articles/ja/article-46-opencea-python-micro-framework-release-jp.html",
    "icon": "🇯🇵",
    "desc": "商業用温室物理モデリング、光生物学計算、および環境制御アルゴリズム向けオープンソースPythonフレームワーク「OpenCEA」の公開リリース。",
    "tags": "articles ja article-46-opencea-python-micro-framework-release-jp html opencea 施設園芸物理オ プンソ スpythonフレ ムワ クの公開 商業用温室物理モデリング 光生物学計算 および環境制御アルゴリズム向けオ プンソ スpythonフレ ムワ ク opencea の公開リリ ス"
  },
  {
    "title": "🇯🇵 コンピュータビジョン＆分光画像解析による施設園芸病害虫早期診断",
    "cat": "article",
    "url": "articles/ja/article-47-computer-vision-crop-disease-diagnostics-jp.html",
    "icon": "🇯🇵",
    "desc": "大規模施設園芸における灰色かび病（Botrytis cinerea）や鉄欠乏性クロロシスのコンピュータビジョンHSV画像色空間解析および自動処方。",
    "tags": "articles ja article-47-computer-vision-crop-disease-diagnostics-jp html コンピュ タビジョン 分光画像解析による施設園芸病害虫早期診断 大規模施設園芸における灰色かび病 botrytis cinerea や鉄欠乏性クロロシスのコンピュ タビジョンhsv画像色空間解析および自動処方"
  },
  {
    "title": "🇯🇵 大規模ハイテク温室10カ年CapEx/OpEx・IRR・NPV投資採算性工学",
    "cat": "article",
    "url": "articles/ja/article-48-greenhouse-capex-opex-irr-npv-financial-model-jp.html",
    "icon": "🇯🇵",
    "desc": "商業用ハイテク・フェンロー温室の大規模投資財務モデリング。平米単価CapEx（25,000-45,000円/m²）、DCFキャッシュフロー、内部収益率（IRR）、および正味現在価値（NPV）。",
    "tags": "articles ja article-48-greenhouse-capex-opex-irr-npv-financial-model-jp html 大規模ハイテク温室10カ年capex opex irr npv投資採算性工学 商業用ハイテク フェンロ 温室の大規模投資財務モデリング 平米単価capex 25 000-45 000円 m dcfキャッシュ"
  },
  {
    "title": "🇯🇵 循環養液栽培における化学種分化・デバイ-ヒュッケル活量＆沈殿飽和指数（SI）",
    "cat": "article",
    "url": "articles/ja/article-49-hydroponic-chemical-speciation-debye-huckel-jp.html",
    "icon": "🇯🇵",
    "desc": "循環式養液栽培の熱力学的イオン活量モデリング。デバイ-ヒュッケル式、リン酸二カルシウム・方解石の飽和指数（SI）計算によるドリップ点滴チューブ目詰まり防止。",
    "tags": "articles ja article-49-hydroponic-chemical-speciation-debye-huckel-jp html 循環養液栽培における化学種分化 デバイ-ヒュッケル活量 沈殿飽和指数 si 循環式養液栽培の熱力学的イオン活量モデリング デバイ-ヒュッケル式 リン酸二カルシウム 方解石の飽和指数 si 計算によるドリップ点滴"
  },
  {
    "title": "🇯🇵 スマート温室におけるエッジIoT＆MQTTフリート・テレメトリ設計",
    "cat": "article",
    "url": "articles/ja/article-50-smart-greenhouse-mqtt-edge-iot-fleet-jp.html",
    "icon": "🇯🇵",
    "desc": "大規模施設園芸向け産業用IoTアーキテクチャ。LoRaWAN、MQTTブローカー構成、JSONテレメトリ、および100台規模のエッジ異常検知システム。",
    "tags": "articles ja article-50-smart-greenhouse-mqtt-edge-iot-fleet-jp html スマ ト温室におけるエッジiot mqttフリ ト テレメトリ設計 大規模施設園芸向け産業用iotア キテクチャ lorawan mqttブロ カ 構成 jsonテレメトリ および100台規模のエッジ異常検知システム"
  },
  {
    "title": "🇯🇵 自律型温室AIにおける強化学習＆モデル予測制御（MPC）軌道最適化",
    "cat": "article",
    "url": "articles/ja/article-51-autonomous-greenhouse-ai-mpc-reinforcement-learning-jp.html",
    "icon": "🇯🇵",
    "desc": "大規模商業温室の自律環境制御。深層強化学習とモデル予測制御（MPC）を融合し、24時間の外気象予測に基づき暖房エネルギーを22.4%削減。",
    "tags": "articles ja article-51-autonomous-greenhouse-ai-mpc-reinforcement-learning-jp html 自律型温室aiにおける強化学習 モデル予測制御 mpc 軌道最適化 大規模商業温室の自律環境制御 深層強化学習とモデル予測制御 mpc を融合し 24時間の外気象予測に基づき暖房エネルギ を22"
  },
  {
    "title": "🇯🇵 帯水層蓄熱システム (ATES) と産業用大型ヒートポンプによる施設園芸の脱炭素化",
    "cat": "article",
    "url": "articles/ja/article-52-aquifer-thermal-energy-storage-ates-heat-pump-jp.html",
    "icon": "🇯🇵",
    "desc": "Venlo型温室における帯水層蓄熱（ATES / WKO）ダブレット井戸システム、季節蓄熱回収効率、および高温産業用ヒートポンプのCOP熱力学モデル。",
    "tags": "articles ja article-52-aquifer-thermal-energy-storage-ates-heat-pump-jp html 帯水層蓄熱システム ates と産業用大型ヒ トポンプによる施設園芸の脱炭素化 venlo型温室における帯水層蓄熱 ates wko ダブレット井戸システム 季節蓄熱回収効率 および高温産業用ヒ トポンプの"
  },
  {
    "title": "Toyohashi, Aichi Prefecture, Japan",
    "cat": "climate",
    "url": "climate/aichi-toyohashi-japan-protected-agriculture-guide.html",
    "icon": "🌍",
    "desc": "Precision CEA engineering and climate guide for commercial greenhouses in Toyohashi, Aichi Prefecture, Japan (34.8°N). Solar DLI analysis (40-48 ",
    "tags": "climate aichi-toyohashi-japan-protected-agriculture-guide html toyohashi aichi prefecture japan precision cea engineering and climate guide for commercial greenhouses in toyohashi "
  },
  {
    "title": "Al Ain, Abu Dhabi, United Arab Emirates",
    "cat": "climate",
    "url": "climate/al-ain-abu-dhabi-uae-desert-greenhouse-guide.html",
    "icon": "🌍",
    "desc": "Precision CEA engineering and climate guide for commercial greenhouses in Al Ain, Abu Dhabi, United Arab Emirates (24.2°N). Solar DLI analysis (5",
    "tags": "climate al-ain-abu-dhabi-uae-desert-greenhouse-guide html al ain abu dhabi united arab emirates precision cea engineering and climate guide for commercial greenhouses in al ain abu"
  },
  {
    "title": "Almería (Campo de Dalías), Spain",
    "cat": "climate",
    "url": "climate/almeria-spain-parral-greenhouse-climate-guide.html",
    "icon": "🌍",
    "desc": "Comprehensive CEA microclimate engineering guide for commercial Parral greenhouses in Almería, Spain (36.8°N). Solar DLI analysis (50-58 summer /",
    "tags": "climate almeria-spain-parral-greenhouse-climate-guide html almer a campo de dal as spain comprehensive cea microclimate engineering guide for commercial parral greenhouses in almer"
  },
  {
    "title": "Antalya (Aksu & Kumluca), Turkey",
    "cat": "climate",
    "url": "climate/antalya-turkey-mediterranean-greenhouse-guide.html",
    "icon": "🌍",
    "desc": "Precision CEA engineering and climate guide for commercial greenhouses in Antalya (Aksu & Kumluca), Turkey (36.9°N). Solar DLI analysis (50-58 su",
    "tags": "climate antalya-turkey-mediterranean-greenhouse-guide html antalya aksu kumluca turkey precision cea engineering and climate guide for commercial greenhouses in antalya aksu kumluc"
  },
  {
    "title": "Morehead (Appalachian Basin), Kentucky, USA",
    "cat": "climate",
    "url": "climate/appharvest-morehead-kentucky-cea-guide.html",
    "icon": "🌍",
    "desc": "Precision CEA engineering and climate guide for commercial greenhouses in Morehead (Appalachian Basin), Kentucky, USA (38.2°N). Solar DLI analysi",
    "tags": "climate appharvest-morehead-kentucky-cea-guide html morehead appalachian basin kentucky usa precision cea engineering and climate guide for commercial greenhouses in morehead appal"
  },
  {
    "title": "Arava Valley / Ein Yahav, Israel",
    "cat": "climate",
    "url": "climate/arava-valley-israel-desert-fertigation-guide.html",
    "icon": "🌍",
    "desc": "Precision CEA engineering and climate guide for commercial greenhouses in Arava Valley / Ein Yahav, Israel (30.5°N). Solar DLI analysis (58-68 su",
    "tags": "climate arava-valley-israel-desert-fertigation-guide html arava valley ein yahav israel precision cea engineering and climate guide for commercial greenhouses in arava valley ein y"
  },
  {
    "title": "Bleiswijk, Netherlands",
    "cat": "climate",
    "url": "climate/bleiswijk-netherlands-cea-research-cluster.html",
    "icon": "🌍",
    "desc": "Precision CEA engineering and climate guide for commercial greenhouses in Bleiswijk, Netherlands (52.0°N). Solar DLI analysis (34-40 summer / 6-9",
    "tags": "climate bleiswijk-netherlands-cea-research-cluster html bleiswijk netherlands precision cea engineering and climate guide for commercial greenhouses in bleiswijk netherlands 52 0 n"
  },
  {
    "title": "Bogotá Savanna, Colombia",
    "cat": "climate",
    "url": "climate/bogota-savanna-colombia-cut-flower-guide.html",
    "icon": "🌍",
    "desc": "Precision CEA engineering and climate guide for commercial greenhouses in Bogotá Savanna, Colombia (4.7°N). Solar DLI analysis (30-36 (12h consta",
    "tags": "climate bogota-savanna-colombia-cut-flower-guide html bogot savanna colombia precision cea engineering and climate guide for commercial greenhouses in bogot savanna colombia 4 7 n "
  },
  {
    "title": "Brittany (Finistère), France",
    "cat": "climate",
    "url": "climate/brittany-finistere-france-tomato-cluster-guide.html",
    "icon": "🌍",
    "desc": "Precision CEA engineering and climate guide for commercial greenhouses in Brittany (Finistère), France (48.4°N). Solar DLI analysis (32-38 summer",
    "tags": "climate brittany-finistere-france-tomato-cluster-guide html brittany finist re france precision cea engineering and climate guide for commercial greenhouses in brittany finist re f"
  },
  {
    "title": "Buyeo (Geum River Basin), South Korea",
    "cat": "climate",
    "url": "climate/buyeo-chungnam-korea-tomato-cluster-guide.html",
    "icon": "🌍",
    "desc": "Precision CEA engineering and climate guide for commercial greenhouses in Buyeo (Geum River Basin), South Korea (36.2°N). Solar DLI analysis (36-",
    "tags": "climate buyeo-chungnam-korea-tomato-cluster-guide html buyeo geum river basin south korea precision cea engineering and climate guide for commercial greenhouses in buyeo geum river"
  },
  {
    "title": "Cameron Highlands, Pahang, Malaysia",
    "cat": "climate",
    "url": "climate/cameron-highlands-malaysia-tropical-highland-guide.html",
    "icon": "🌍",
    "desc": "Precision CEA engineering and climate guide for commercial greenhouses in Cameron Highlands, Pahang, Malaysia (4.5°N). Solar DLI analysis (28-34 ",
    "tags": "climate cameron-highlands-malaysia-tropical-highland-guide html cameron highlands pahang malaysia precision cea engineering and climate guide for commercial greenhouses in cameron "
  },
  {
    "title": "Cayambe, Pichincha, Ecuador",
    "cat": "climate",
    "url": "climate/cayambe-pichincha-ecuador-hyper-radiation-guide.html",
    "icon": "🌍",
    "desc": "Precision CEA engineering and climate guide for commercial greenhouses in Cayambe, Pichincha, Ecuador (0.0°N). Solar DLI analysis (35-42 (Extreme",
    "tags": "climate cayambe-pichincha-ecuador-hyper-radiation-guide html cayambe pichincha ecuador precision cea engineering and climate guide for commercial greenhouses in cayambe pichincha e"
  },
  {
    "title": "Culiacán (Sinaloa Valley), Mexico",
    "cat": "climate",
    "url": "climate/culiacan-sinaloa-mexico-winter-vegetable-guide.html",
    "icon": "🌍",
    "desc": "Precision CEA engineering and climate guide for commercial greenhouses in Culiacán (Sinaloa Valley), Mexico (24.8°N). Solar DLI analysis (50-58 s",
    "tags": "climate culiacan-sinaloa-mexico-winter-vegetable-guide html culiac n sinaloa valley mexico precision cea engineering and climate guide for commercial greenhouses in culiac n sinalo"
  },
  {
    "title": "Đà Lạt, Central Highlands, Vietnam",
    "cat": "climate",
    "url": "climate/dalat-vietnam-central-highlands-horticulture-guide.html",
    "icon": "🌍",
    "desc": "Precision CEA engineering and climate guide for commercial greenhouses in Đà Lạt, Central Highlands, Vietnam (11.9°N). Solar DLI analysis (32-38 ",
    "tags": "climate dalat-vietnam-central-highlands-horticulture-guide html l t central highlands vietnam precision cea engineering and climate guide for commercial greenhouses in l t central "
  },
  {
    "title": "Delta / Fraser Valley, BC, Canada",
    "cat": "climate",
    "url": "climate/delta-fraser-valley-bc-canada-greenhouse-guide.html",
    "icon": "🌍",
    "desc": "Precision CEA engineering and climate guide for commercial greenhouses in Delta / Fraser Valley, BC, Canada (49.1°N). Solar DLI analysis (36-44 s",
    "tags": "climate delta-fraser-valley-bc-canada-greenhouse-guide html delta fraser valley bc canada precision cea engineering and climate guide for commercial greenhouses in delta fraser val"
  },
  {
    "title": "Gimje Smart Farm Valley, South Korea",
    "cat": "climate",
    "url": "climate/gimje-smart-farm-innovation-valley-korea-guide.html",
    "icon": "🌍",
    "desc": "Precision CEA engineering and climate guide for commercial greenhouses in Gimje Smart Farm Valley, South Korea (35.8°N). Solar DLI analysis (38-4",
    "tags": "climate gimje-smart-farm-innovation-valley-korea-guide html gimje smart farm valley south korea precision cea engineering and climate guide for commercial greenhouses in gimje smar"
  },
  {
    "title": "Guyra (New England Plateau), NSW, Australia",
    "cat": "climate",
    "url": "climate/guyra-new-south-wales-australia-highland-tomato-guide.html",
    "icon": "🌍",
    "desc": "Precision CEA engineering and climate guide for commercial greenhouses in Guyra (New England Plateau), NSW, Australia (30.2°S). Solar DLI analysi",
    "tags": "climate guyra-new-south-wales-australia-highland-tomato-guide html guyra new england plateau nsw australia precision cea engineering and climate guide for commercial greenhouses in"
  },
  {
    "title": "Ierapetra, Crete, Greece",
    "cat": "climate",
    "url": "climate/ierapetra-crete-greece-solar-greenhouse-guide.html",
    "icon": "🌍",
    "desc": "Precision CEA engineering and climate guide for commercial greenhouses in Ierapetra, Crete, Greece (35.0°N). Solar DLI analysis (54-62 summer / 2",
    "tags": "climate ierapetra-crete-greece-solar-greenhouse-guide html ierapetra crete greece precision cea engineering and climate guide for commercial greenhouses in ierapetra crete greece 3"
  },
  {
    "title": "Kochi (Tosa Bay), Japan",
    "cat": "climate",
    "url": "climate/kochi-japan-warm-climate-horticulture-guide.html",
    "icon": "🌍",
    "desc": "Precision CEA engineering and climate guide for commercial greenhouses in Kochi (Tosa Bay), Japan (33.6°N). Solar DLI analysis (42-50 summer / 16",
    "tags": "climate kochi-japan-warm-climate-horticulture-guide html kochi tosa bay japan precision cea engineering and climate guide for commercial greenhouses in kochi tosa bay japan 33 6 n "
  },
  {
    "title": "Kunming (Spring City), Yunnan, China",
    "cat": "climate",
    "url": "climate/kunming-yunnan-china-asian-flower-capital-guide.html",
    "icon": "🌍",
    "desc": "Precision CEA engineering and climate guide for commercial greenhouses in Kunming (Spring City), Yunnan, China (25.0°N). Solar DLI analysis (38-4",
    "tags": "climate kunming-yunnan-china-asian-flower-capital-guide html kunming spring city yunnan china precision cea engineering and climate guide for commercial greenhouses in kunming spri"
  },
  {
    "title": "Lake Naivasha (Rift Valley), Kenya",
    "cat": "climate",
    "url": "climate/lake-naivasha-kenya-geothermal-floriculture-guide.html",
    "icon": "🌍",
    "desc": "Precision CEA engineering and climate guide for commercial greenhouses in Lake Naivasha (Rift Valley), Kenya (0.7°S). Solar DLI analysis (38-44 (",
    "tags": "climate lake-naivasha-kenya-geothermal-floriculture-guide html lake naivasha rift valley kenya precision cea engineering and climate guide for commercial greenhouses in lake naivas"
  },
  {
    "title": "Leamington / Kingsville, Ontario, Canada",
    "cat": "climate",
    "url": "climate/leamington-ontario-canada-greenhouse-guide.html",
    "icon": "🌍",
    "desc": "Precision CEA engineering and climate guide for commercial greenhouses in Leamington / Kingsville, Ontario, Canada (42.0°N). Solar DLI analysis (",
    "tags": "climate leamington-ontario-canada-greenhouse-guide html leamington kingsville ontario canada precision cea engineering and climate guide for commercial greenhouses in leamington ki"
  },
  {
    "title": "Marana & Tucson, Arizona, USA",
    "cat": "climate",
    "url": "climate/marana-tucson-arizona-hyper-solar-cea-guide.html",
    "icon": "🌍",
    "desc": "Precision CEA engineering and desert microclimate guide for commercial greenhouses in Marana and Tucson, Arizona, USA (32.4°N). Hyper-solar DLI a",
    "tags": "climate marana-tucson-arizona-hyper-solar-cea-guide html marana tucson arizona usa precision cea engineering and desert microclimate guide for commercial greenhouses in marana and "
  },
  {
    "title": "Miryang, Gyeongnam, South Korea",
    "cat": "climate",
    "url": "climate/miryang-gyeongnam-korea-strawberry-capital-guide.html",
    "icon": "🌍",
    "desc": "Precision CEA engineering and climate guide for commercial greenhouses in Miryang, Gyeongnam, South Korea (35.5°N). Solar DLI analysis (40-48 sum",
    "tags": "climate miryang-gyeongnam-korea-strawberry-capital-guide html miryang gyeongnam south korea precision cea engineering and climate guide for commercial greenhouses in miryang gyeong"
  },
  {
    "title": "Murcia (Campo de Cartagena), Spain",
    "cat": "climate",
    "url": "climate/murcia-spain-precision-hydroponics-guide.html",
    "icon": "🌍",
    "desc": "Precision CEA engineering and climate guide for commercial greenhouses in Murcia (Campo de Cartagena), Spain (38.0°N). Solar DLI analysis (48-56 ",
    "tags": "climate murcia-spain-precision-hydroponics-guide html murcia campo de cartagena spain precision cea engineering and climate guide for commercial greenhouses in murcia campo de cart"
  },
  {
    "title": "Naaldwijk (Westland East), Netherlands",
    "cat": "climate",
    "url": "climate/naaldwijk-netherlands-floriculture-hub-guide.html",
    "icon": "🌍",
    "desc": "Precision CEA engineering and climate guide for commercial greenhouses in Naaldwijk (Westland East), Netherlands (52.0°N). Solar DLI analysis (35",
    "tags": "climate naaldwijk-netherlands-floriculture-hub-guide html naaldwijk westland east netherlands precision cea engineering and climate guide for commercial greenhouses in naaldwijk we"
  },
  {
    "title": "Nonsan, Chungnam, South Korea",
    "cat": "climate",
    "url": "climate/nonsan-chungnam-korea-smart-berry-guide.html",
    "icon": "🌍",
    "desc": "Precision CEA engineering and climate guide for commercial greenhouses in Nonsan, Chungnam, South Korea (36.2°N). Solar DLI analysis (36-44 summe",
    "tags": "climate nonsan-chungnam-korea-smart-berry-guide html nonsan chungnam south korea precision cea engineering and climate guide for commercial greenhouses in nonsan chungnam south kor"
  },
  {
    "title": "Nürnberg / Knoblauchsland, Bavaria",
    "cat": "climate",
    "url": "climate/nuernberg-knoblauchsland-bavaria-greenhouse-climate-guide.html",
    "icon": "🌍",
    "desc": "Precision CEA engineering and climate guide for commercial glasshouses in Nürnberg / Knoblauchsland, Bavaria (49.48°N). Solar DLI curves (38-45 s",
    "tags": "climate nuernberg-knoblauchsland-bavaria-greenhouse-climate-guide html nürnberg knoblauchsland bavaria precision cea engineering and climate guide for commercial glasshouses in nür"
  },
  {
    "title": "Pukekohe, Auckland Region, New Zealand",
    "cat": "climate",
    "url": "climate/pukekohe-auckland-new-zealand-greenhouse-guide.html",
    "icon": "🌍",
    "desc": "Precision CEA engineering and climate guide for commercial greenhouses in Pukekohe, Auckland Region, New Zealand (37.2°S). Solar DLI analysis (44",
    "tags": "climate pukekohe-auckland-new-zealand-greenhouse-guide html pukekohe auckland region new zealand precision cea engineering and climate guide for commercial greenhouses in pukekohe "
  },
  {
    "title": "Querétaro (Agropark), Mexico",
    "cat": "climate",
    "url": "climate/queretaro-agropark-mexico-high-altitude-guide.html",
    "icon": "🌍",
    "desc": "Precision CEA engineering and climate guide for commercial greenhouses in Querétaro (Agropark), Mexico (20.6°N). Solar DLI analysis (46-54 summer",
    "tags": "climate queretaro-agropark-mexico-high-altitude-guide html quer taro agropark mexico precision cea engineering and climate guide for commercial greenhouses in quer taro agropark me"
  },
  {
    "title": "Ragusa / Vittoria, Sicily, Italy",
    "cat": "climate",
    "url": "climate/ragusa-sicily-italy-protected-cropping-guide.html",
    "icon": "🌍",
    "desc": "Precision CEA engineering and climate guide for commercial greenhouses in Ragusa / Vittoria, Sicily, Italy (36.9°N). Solar DLI analysis (52-60 su",
    "tags": "climate ragusa-sicily-italy-protected-cropping-guide html ragusa vittoria sicily italy precision cea engineering and climate guide for commercial greenhouses in ragusa vittoria sic"
  },
  {
    "title": "Al-Kharj / Riyadh Oasis, Saudi Arabia",
    "cat": "climate",
    "url": "climate/riyadh-al-kharj-saudi-arabia-desert-cea-guide.html",
    "icon": "🌍",
    "desc": "Precision CEA engineering and climate guide for commercial greenhouses in Al-Kharj / Riyadh Oasis, Saudi Arabia (24.7°N). Solar DLI analysis (60-",
    "tags": "climate riyadh-al-kharj-saudi-arabia-desert-cea-guide html al-kharj riyadh oasis saudi arabia precision cea engineering and climate guide for commercial greenhouses in al-kharj riy"
  },
  {
    "title": "Salinas Valley, California, USA",
    "cat": "climate",
    "url": "climate/salinas-valley-california-salad-bowl-guide.html",
    "icon": "🌍",
    "desc": "Precision CEA engineering and climate guide for commercial greenhouses in Salinas Valley, California, USA (36.7°N). Solar DLI analysis (42-50 sum",
    "tags": "climate salinas-valley-california-salad-bowl-guide html salinas valley california usa precision cea engineering and climate guide for commercial greenhouses in salinas valley calif"
  },
  {
    "title": "Santa Maria, California, USA",
    "cat": "climate",
    "url": "climate/santa-maria-valley-california-berry-tunnel-guide.html",
    "icon": "🌍",
    "desc": "Precision CEA engineering and climate guide for commercial greenhouses in Santa Maria, California, USA (34.9°N). Solar DLI analysis (45-52 summer",
    "tags": "climate santa-maria-valley-california-berry-tunnel-guide html santa maria california usa precision cea engineering and climate guide for commercial greenhouses in santa maria calif"
  },
  {
    "title": "Shouguang, Shandong, China",
    "cat": "climate",
    "url": "climate/shouguang-shandong-china-solar-greenhouse-guide.html",
    "icon": "🌍",
    "desc": "Precision CEA engineering and climate guide for commercial greenhouses in Shouguang, Shandong, China (36.9°N). Solar DLI analysis (42-50 summer /",
    "tags": "climate shouguang-shandong-china-solar-greenhouse-guide html shouguang shandong china precision cea engineering and climate guide for commercial greenhouses in shouguang shandong c"
  },
  {
    "title": "Souss-Massa Valley (Agadir), Morocco",
    "cat": "climate",
    "url": "climate/souss-massa-agadir-morocco-export-greenhouse-guide.html",
    "icon": "🌍",
    "desc": "Precision CEA engineering and climate guide for commercial greenhouses in Souss-Massa Valley (Agadir), Morocco (30.4°N). Solar DLI analysis (50-5",
    "tags": "climate souss-massa-agadir-morocco-export-greenhouse-guide html souss-massa valley agadir morocco precision cea engineering and climate guide for commercial greenhouses in souss-ma"
  },
  {
    "title": "Stellenbosch / Boland, Western Cape, South Africa",
    "cat": "climate",
    "url": "climate/stellenbosch-western-cape-south-africa-guide.html",
    "icon": "🌍",
    "desc": "Precision CEA engineering and climate guide for commercial greenhouses in Stellenbosch / Boland, Western Cape, South Africa (33.9°S). Solar DLI a",
    "tags": "climate stellenbosch-western-cape-south-africa-guide html stellenbosch boland western cape south africa precision cea engineering and climate guide for commercial greenhouses in st"
  },
  {
    "title": "Straelen / Lower Rhine, Germany",
    "cat": "climate",
    "url": "climate/straelen-lower-rhine-germany-horticulture-guide.html",
    "icon": "🌍",
    "desc": "Precision CEA engineering and climate guide for commercial greenhouses in Straelen / Lower Rhine, Germany (51.4°N). Solar DLI analysis (36-42 sum",
    "tags": "climate straelen-lower-rhine-germany-horticulture-guide html straelen lower rhine germany precision cea engineering and climate guide for commercial greenhouses in straelen lower r"
  },
  {
    "title": "Adelaide Plains (Virginia), South Australia",
    "cat": "climate",
    "url": "climate/virginia-adelaide-plains-australia-guide.html",
    "icon": "🌍",
    "desc": "Precision CEA engineering and climate guide for commercial greenhouses in Adelaide Plains (Virginia), South Australia (34.7°S). Solar DLI analysi",
    "tags": "climate virginia-adelaide-plains-australia-guide html adelaide plains virginia south australia precision cea engineering and climate guide for commercial greenhouses in adelaide pl"
  },
  {
    "title": "Westland, Netherlands",
    "cat": "climate",
    "url": "climate/westland-netherlands-greenhouse-climate-guide.html",
    "icon": "🌍",
    "desc": "Precision CEA engineering and climate guide for commercial greenhouses in Westland, Netherlands (52.0°N). Solar DLI analysis (35-42 summer / 6-10",
    "tags": "climate westland-netherlands-greenhouse-climate-guide html westland netherlands precision cea engineering and climate guide for commercial greenhouses in westland netherlands 52 0 "
  },
  {
    "title": "About Inwoovation Lab",
    "cat": "core",
    "url": "about.html",
    "icon": "🏛️",
    "desc": "Inwoovation Lab is an independent R&D lab building open-access biophysical simulators and engineering tools for commercial greenhouse growers, ve",
    "tags": "about html about inwoovation lab inwoovation lab is an independent r d lab building open-access biophysical simulators and engineering tools for commercial greenhouse growers ve"
  },
  {
    "title": "Customer Support & Instant A/S Center",
    "cat": "core",
    "url": "contact.html",
    "icon": "🏛️",
    "desc": "Instant after-service (A/S) and 24/7 AI Agronomist support desk for OpenCEA Pro users and greenhouse growers. License recovery, facility audits, ",
    "tags": "contact html customer support instant a s center instant after-service a s and 24 7 ai agronomist support desk for opencea pro users and greenhouse growers license recovery facilit"
  },
  {
    "title": "Institutional Engineering & Grant Intelligencefor Commercial Agriculture",
    "cat": "core",
    "url": "index.html",
    "icon": "🏛️",
    "desc": "Inwoovation Lab - Precision AgTech biophysical simulators, real-time VPD microclimate engines, plant disease diagnostics, 78-volume (147 multilin",
    "tags": "index html institutional engineering grant intelligencefor commercial agriculture inwoovation lab - precision agtech biophysical simulators real-time vpd microclimate engines plant"
  },
  {
    "title": "Privacy Policy",
    "cat": "core",
    "url": "privacy-policy.html",
    "icon": "🏛️",
    "desc": "Privacy Policy and Cookie Policy for Inwoovation Engineering Lab - GDPR and CCPA compliant data protection disclosure.",
    "tags": "privacy-policy html privacy policy privacy policy and cookie policy for inwoovation engineering lab - gdpr and ccpa compliant data protection disclosure"
  },
  {
    "title": "🏆 OpenCEA Horticultural Biophysics Mastery Assessment",
    "cat": "core",
    "url": "quiz.html",
    "icon": "🏛️",
    "desc": "Test your precision CEA horticultural biophysics knowledge. Solve 10 questions on VPD, DLI, DIN V 18599, and fertigation to earn a free verifiabl",
    "tags": "quiz html opencea horticultural biophysics mastery assessment test your precision cea horticultural biophysics knowledge solve 10 questions on vpd dli din v 18599 and fertigation t"
  },
  {
    "title": "Open-Access Digital Engineering Asset Repository",
    "cat": "core",
    "url": "store.html",
    "icon": "🏛️",
    "desc": "100% Free, open-access institutional engineering assets: Python fertigation solvers, 50-State USDA grant playbooks, smart greenhouse BOM estimato",
    "tags": "store html open-access digital engineering asset repository 100 free open-access institutional engineering assets python fertigation solvers 50-state usda grant playbooks smart gre"
  },
  {
    "title": "OpenCEA Pro Cloud Live Suite",
    "cat": "core",
    "url": "suite/index.html",
    "icon": "🏛️",
    "desc": "OpenCEA Pro is an always-updated commercial CEA biophysics suite with 24/7 AI Agronomist Co-Pilot and 33 specialized greenhouse engineering engin",
    "tags": "suite index html opencea pro cloud live suite opencea pro is an always-updated commercial cea biophysics suite with 24 7 ai agronomist co-pilot and 33 specialized greenhouse engine"
  },
  {
    "title": "Terms of Service",
    "cat": "core",
    "url": "terms-of-service.html",
    "icon": "🏛️",
    "desc": "Terms of Service and computational simulation disclaimers for Inwoovation Engineering Lab CEA tools and open-source models.",
    "tags": "terms-of-service html terms of service terms of service and computational simulation disclaimers for inwoovation engineering lab cea tools and open-source models"
  },
  {
    "title": "Commercial Greenhouse Troubleshooting Wizard",
    "cat": "core",
    "url": "troubleshoot.html",
    "icon": "🏛️",
    "desc": "Instant diagnostic wizard for commercial greenhouse and indoor farm issues. Identify root causes for tip burn, blossom-end rot, condensation, and",
    "tags": "troubleshoot html commercial greenhouse troubleshooting wizard instant diagnostic wizard for commercial greenhouse and indoor farm issues identify root causes for tip burn blossom-"
  },
  {
    "title": "Commercial Greenhouse & Indoor Cannabis (Cannabis sativa)",
    "cat": "crop",
    "url": "crops/commercial-cannabis-microclimate-vpd-photobiology-guide.html",
    "icon": "🌱",
    "desc": "Precision CEA engineering guide for Commercial Greenhouse & Indoor Cannabis (Cannabis sativa). Optimal VPD bands (1.0 - 1.5 kPa), DLI targets (35",
    "tags": "crops commercial-cannabis-microclimate-vpd-photobiology-guide html commercial greenhouse indoor cannabis cannabis sativa precision cea engineering guide for commercial greenhouse i"
  },
  {
    "title": "Commercial Greenhouse Strawberry (Fragaria × ananassa)",
    "cat": "crop",
    "url": "crops/commercial-strawberry-greenhouse-climate-dli-guide.html",
    "icon": "🌱",
    "desc": "Precision CEA engineering guide for Commercial Greenhouse Strawberry (Fragaria × ananassa). Optimal VPD bands (0.7 - 1.1 kPa), DLI targets (16 - ",
    "tags": "crops commercial-strawberry-greenhouse-climate-dli-guide html commercial greenhouse strawberry fragaria ananassa precision cea engineering guide for commercial greenhouse strawberr"
  },
  {
    "title": "Commercial Greenhouse Cucumber (Cucumis sativus)",
    "cat": "crop",
    "url": "crops/greenhouse-cucumber-high-humidity-transpiration-guide.html",
    "icon": "🌱",
    "desc": "Precision CEA engineering guide for Commercial Greenhouse Cucumber (Cucumis sativus). Optimal VPD bands (0.6 - 1.0 kPa), DLI targets (20 - 30 mol",
    "tags": "crops greenhouse-cucumber-high-humidity-transpiration-guide html commercial greenhouse cucumber cucumis sativus precision cea engineering guide for commercial greenhouse cucumber c"
  },
  {
    "title": "Commercial Greenhouse Cut Rose (Rosa hybrida)",
    "cat": "crop",
    "url": "crops/greenhouse-cut-flower-rose-microclimate-guide.html",
    "icon": "🌱",
    "desc": "Precision CEA engineering guide for Commercial Greenhouse Cut Rose (Rosa hybrida). Optimal VPD bands (0.8 - 1.2 kPa), DLI targets (20 - 30 mol/m²",
    "tags": "crops greenhouse-cut-flower-rose-microclimate-guide html commercial greenhouse cut rose rosa hybrida precision cea engineering guide for commercial greenhouse cut rose rosa hybrida"
  },
  {
    "title": "Commercial Greenhouse Eggplant / Aubergine (Solanum melongena)",
    "cat": "crop",
    "url": "crops/greenhouse-eggplant-aubergine-microclimate-guide.html",
    "icon": "🌱",
    "desc": "Precision CEA engineering guide for Commercial Greenhouse Eggplant / Aubergine (Solanum melongena). Optimal VPD bands (0.8 - 1.2 kPa), DLI target",
    "tags": "crops greenhouse-eggplant-aubergine-microclimate-guide html commercial greenhouse eggplant aubergine solanum melongena precision cea engineering guide for commercial greenhouse egg"
  },
  {
    "title": "Phalaenopsis Orchid Microclimate & Spike Induction Guide",
    "cat": "crop",
    "url": "crops/greenhouse-phalaenopsis-orchid-climate-spike-induction-guide.html",
    "icon": "🌱",
    "desc": "Precision CEA engineering guide for Phalaenopsis Orchid Microclimate & Spike Induction Guide. Optimal VPD bands (0.5 - 0.9 kPa), DLI targets (6 -",
    "tags": "crops greenhouse-phalaenopsis-orchid-climate-spike-induction-guide html phalaenopsis orchid microclimate spike induction guide precision cea engineering guide for phalaenopsis orch"
  },
  {
    "title": "Commercial Greenhouse Sweet Pepper (Capsicum annuum)",
    "cat": "crop",
    "url": "crops/greenhouse-sweet-pepper-climate-blossom-end-rot-guide.html",
    "icon": "🌱",
    "desc": "Precision CEA engineering guide for Commercial Greenhouse Sweet Pepper (Capsicum annuum). Optimal VPD bands (0.9 - 1.3 kPa), DLI targets (22 - 32",
    "tags": "crops greenhouse-sweet-pepper-climate-blossom-end-rot-guide html commercial greenhouse sweet pepper capsicum annuum precision cea engineering guide for commercial greenhouse sweet "
  },
  {
    "title": "Commercial Greenhouse Tomato (Solanum lycopersicum)",
    "cat": "crop",
    "url": "crops/greenhouse-tomato-microclimate-vpd-steering-guide.html",
    "icon": "🌱",
    "desc": "Precision CEA engineering guide for Commercial Greenhouse Tomato (Solanum lycopersicum). Optimal VPD bands (0.8 - 1.2 kPa), DLI targets (25 - 35 ",
    "tags": "crops greenhouse-tomato-microclimate-vpd-steering-guide html commercial greenhouse tomato solanum lycopersicum precision cea engineering guide for commercial greenhouse tomato sola"
  },
  {
    "title": "Hydroponic Greenhouse Sweet Basil & Culinary Herbs (Ocimum basilicum)",
    "cat": "crop",
    "url": "crops/hydroponic-basil-culinary-herbs-climate-guide.html",
    "icon": "🌱",
    "desc": "Precision CEA engineering guide for Hydroponic Greenhouse Sweet Basil & Culinary Herbs (Ocimum basilicum). Optimal VPD bands (0.7 - 1.1 kPa), DLI",
    "tags": "crops hydroponic-basil-culinary-herbs-climate-guide html hydroponic greenhouse sweet basil culinary herbs ocimum basilicum precision cea engineering guide for hydroponic greenhouse"
  },
  {
    "title": "Controlled Environment Leafy Greens & Lettuce (Lactuca sativa)",
    "cat": "crop",
    "url": "crops/vertical-farm-lettuce-leafy-greens-tipburn-prevention-guide.html",
    "icon": "🌱",
    "desc": "Precision CEA engineering guide for Controlled Environment Leafy Greens & Lettuce (Lactuca sativa). Optimal VPD bands (0.8 - 1.1 kPa), DLI target",
    "tags": "crops vertical-farm-lettuce-leafy-greens-tipburn-prevention-guide html controlled environment leafy greens lettuce lactuca sativa precision cea engineering guide for controlled env"
  },
  {
    "title": "Industrial Heat Pump vs. Gas Boiler: Heating Cost & COP Model",
    "cat": "part",
    "url": "benchmarks/greenhouse-heat-pump-vs-gas-boiler-heating-cost.html",
    "icon": "⚙️",
    "desc": "Economic & carbon lifecycle comparison between Industrial Air/Water Heat Pumps (COP 3.8) and Condensing Natural Gas Boilers (95% efficiency). Spa",
    "tags": "benchmarks greenhouse-heat-pump-vs-gas-boiler-heating-cost html industrial heat pump vs gas boiler heating cost cop model economic carbon lifecycle comparison between industrial ai"
  },
  {
    "title": "LED Toplighting vs. 1000W HPS: 5-Year ROI & Heat Balance Model",
    "cat": "part",
    "url": "benchmarks/greenhouse-led-vs-hps-lighting-efficiency-roi.html",
    "icon": "⚙️",
    "desc": "Comprehensive technical comparison between Horticultural LED fixtures (3.5 µmol/J) and High-Pressure Sodium (1.8 µmol/J) lamps. 5-year electricit",
    "tags": "benchmarks greenhouse-led-vs-hps-lighting-efficiency-roi html led toplighting vs 1000w hps 5-year roi heat balance model comprehensive technical comparison between horticultural le"
  },
  {
    "title": "Commercial Greenhouse Hardware & Material Benchmarks",
    "cat": "part",
    "url": "benchmarks/index.html",
    "icon": "⚙️",
    "desc": "Engineering comparison benchmarks for CEA growers: LED vs HPS lighting, Heat Pump vs Gas Boilers, Rockwool vs Cocopeat substrates, and Diffuse Gl",
    "tags": "benchmarks index html commercial greenhouse hardware material benchmarks engineering comparison benchmarks for cea growers led vs hps lighting heat pump vs gas boilers rockwool vs "
  },
  {
    "title": "Grodan Rockwool vs. Cocopeat: Hydroponic Yield & Cost Model",
    "cat": "part",
    "url": "benchmarks/rockwool-vs-cocopeat-hydroponic-substrate-comparison.html",
    "icon": "⚙️",
    "desc": "Agronomic comparison between Grodan Rockwool stone wool slabs and Cocopeat (coir) substrate. Water retention curves, cation exchange capacity (CE",
    "tags": "benchmarks rockwool-vs-cocopeat-hydroponic-substrate-comparison html grodan rockwool vs cocopeat hydroponic yield cost model agronomic comparison between grodan rockwool stone wool"
  },
  {
    "title": "Global AgTech Component & Equipment Search",
    "cat": "part",
    "url": "parts/index.html",
    "icon": "⚙️",
    "desc": "Industrial parametric search engine for commercial greenhouse components, fertigation valves, LED toplights, climate sensors, and Dutch bucket su",
    "tags": "parts index html global agtech component equipment search industrial parametric search engine for commercial greenhouse components fertigation valves led toplights climate sensors "
  },
  {
    "title": "Privacy Policy & Data Governance Statement",
    "cat": "part",
    "url": "parts/privacy.html",
    "icon": "⚙️",
    "desc": "Comprehensive Privacy Policy for AgriMaster (Inwoovation Lab) Global CEA Parts & Vacuum Engineering Catalog. GDPR, CCPA/CPRA, Google AdSense DART",
    "tags": "parts privacy html privacy policy data governance statement comprehensive privacy policy for agrimaster inwoovation lab global cea parts vacuum engineering catalog gdpr ccpa cpra g"
  },
  {
    "title": "Terms of Service & Engineering Disclaimer",
    "cat": "part",
    "url": "parts/terms.html",
    "icon": "⚙️",
    "desc": "Terms of Service and Engineering Disclaimer for AgriMaster (Inwoovation Lab) Global CEA Parts, Fertigation Hardware, and Vacuum Systems Engineeri",
    "tags": "parts terms html terms of service engineering disclaimer terms of service and engineering disclaimer for agrimaster inwoovation lab global cea parts fertigation hardware and vacuum"
  },
  {
    "title": "Industrial Vacuum & SemiconductorEquipment Engineering Suite",
    "cat": "part",
    "url": "parts/vacuum-systems.html",
    "icon": "⚙️",
    "desc": "Industrial vacuum engineering catalog & mechatronics specification suite. Featuring thermal evaporators (DEV), magnetron sputtering systems (DSP)",
    "tags": "parts vacuum-systems html industrial vacuum semiconductorequipment engineering suite industrial vacuum engineering catalog mechatronics specification suite featuring thermal evapor"
  },
  {
    "title": "About the Lab",
    "cat": "sim",
    "url": "smartfarm/about.html",
    "icon": "🧪",
    "desc": "Learn about Smart Farm Engineering Lab's mission to provide free, science-backed precision calculators for greenhouse growers, designers, and agr",
    "tags": "smartfarm about html about the lab learn about smart farm engineering lab s mission to provide free science-backed precision calculators for greenhouse growers designers and agr"
  },
  {
    "title": "🧪 CO2 Injection Parameters",
    "cat": "sim",
    "url": "smartfarm/co2_calculator.html",
    "icon": "🧪",
    "desc": "Calculate greenhouse CO2 injection rates, target ppm enrichment, cylinder/tank consumption rates, and hourly enrichment costs for commercial grow",
    "tags": "smartfarm co2 calculator html co2 injection parameters calculate greenhouse co2 injection rates target ppm enrichment cylinder tank consumption rates and hourly enrichment costs fo"
  },
  {
    "title": "Contact Us",
    "cat": "sim",
    "url": "smartfarm/contact.html",
    "icon": "🧪",
    "desc": "Submit inquiries, feature requests, or partnership proposals for Smart Farm Engineering Lab's free greenhouse calculators and AgTech precision to",
    "tags": "smartfarm contact html contact us submit inquiries feature requests or partnership proposals for smart farm engineering lab s free greenhouse calculators and agtech precision to"
  },
  {
    "title": "Symptom Scouting Variables",
    "cat": "sim",
    "url": "smartfarm/diagnosis.html",
    "icon": "🧪",
    "desc": "Free AI-powered crop disease and pest diagnosis for tomato, strawberry, blueberry, melon, and pepper. Includes pesticide bee toxicity database wi",
    "tags": "smartfarm diagnosis html symptom scouting variables free ai-powered crop disease and pest diagnosis for tomato strawberry blueberry melon and pepper includes pesticide bee toxicity"
  },
  {
    "title": "💡 DLI & LED Lighting Parameters",
    "cat": "sim",
    "url": "smartfarm/dli_calculator.html",
    "icon": "🧪",
    "desc": "Calculate Daily Light Integral (DLI) targets, supplemental LED PPFD requirements, photoperiod hours, and daily/monthly electricity ROI costs for ",
    "tags": "smartfarm dli calculator html dli led lighting parameters calculate daily light integral dli targets supplemental led ppfd requirements photoperiod hours and daily monthly electric"
  },
  {
    "title": "Stock Tank Parameter",
    "cat": "sim",
    "url": "smartfarm/fertigation.html",
    "icon": "🧪",
    "desc": "Calculate precise raw fertilizer compounding weights and acid neutralization dosages for greenhouse stock tank fertigation. Supports multiple dil",
    "tags": "smartfarm fertigation html stock tank parameter calculate precise raw fertilizer compounding weights and acid neutralization dosages for greenhouse stock tank fertigation supports "
  },
  {
    "title": "GreenPocket Directory",
    "cat": "sim",
    "url": "smartfarm/greenpocket.html",
    "icon": "🧪",
    "desc": "Curated selection of home indoor farming kits, grow LEDs, and nutrient sensors for urban gardeners.",
    "tags": "smartfarm greenpocket html greenpocket directory curated selection of home indoor farming kits grow leds and nutrient sensors for urban gardeners"
  },
  {
    "title": "Structure & Climate Data",
    "cat": "sim",
    "url": "smartfarm/heat_loss.html",
    "icon": "🧪",
    "desc": "Calculate maximum greenhouse heating load in kW and BTU/h using ASABE EP406 Q=UAΔT heat transfer formulas, wind infiltration modifiers, regional ",
    "tags": "smartfarm heat loss html structure climate data calculate maximum greenhouse heating load in kw and btu h using asabe ep406 q ua t heat transfer formulas wind infiltration modifier"
  },
  {
    "title": "Commercial Greenhouse 3D Physics Simulator",
    "cat": "sim",
    "url": "smartfarm/korean_greenhouse_3d.html",
    "icon": "🧪",
    "desc": "Interactive 3D digital twin for multi-span arch poly and Venlo glass greenhouses. Real-time solar azimuth, roll-up roof/side ventilation, thermal",
    "tags": "smartfarm korean greenhouse 3d html commercial greenhouse 3d physics simulator interactive 3d digital twin for multi-span arch poly and venlo glass greenhouses real-time solar azim"
  },
  {
    "title": "Optimization of Vapor Pressure Deficit (VPD) for Greenhouse Tomato Yield, Transpiration Kinetics & Calcium Allocation",
    "cat": "sim",
    "url": "smartfarm/library_vpd_optimization_tomato.html",
    "icon": "🧪",
    "desc": "Vapor pressure deficit (VPD) is a critical climate parameter that directly influences plant transpiration, nutrient uptake, and overall yield in ",
    "tags": "smartfarm library vpd optimization tomato html optimization of vapor pressure deficit vpd for greenhouse tomato yield transpiration kinetics calcium allocation vapor pressure defic"
  },
  {
    "title": "Supplemental Lighting & ROI Engine",
    "cat": "sim",
    "url": "smartfarm/lighting_efficacy.html",
    "icon": "🧪",
    "desc": "Calculate greenhouse supplemental PPFD, daily DLI contribution, electrical power demand, and financial payback ROI comparing 1000W HPS with high-",
    "tags": "smartfarm lighting efficacy html supplemental lighting roi engine calculate greenhouse supplemental ppfd daily dli contribution electrical power demand and financial payback roi co"
  },
  {
    "title": "🌍 Global Agri-Market Index",
    "cat": "sim",
    "url": "smartfarm/market.html",
    "icon": "🧪",
    "desc": "Real-time tracking of global wholesale prices for agricultural commodities including tomatoes, cucumbers, peppers, and natural gas.",
    "tags": "smartfarm market html global agri-market index real-time tracking of global wholesale prices for agricultural commodities including tomatoes cucumbers peppers and natural gas"
  },
  {
    "title": "Hydraulic Profile",
    "cat": "sim",
    "url": "smartfarm/mixing_valve.html",
    "icon": "🧪",
    "desc": "Calculate the correct Kv coefficient, DN pipe diameter, and flow rates for greenhouse heating 3-way mixing valves. Includes heat load estimator a",
    "tags": "smartfarm mixing valve html hydraulic profile calculate the correct kv coefficient dn pipe diameter and flow rates for greenhouse heating 3-way mixing valves includes heat load est"
  },
  {
    "title": "Privacy Policy",
    "cat": "sim",
    "url": "smartfarm/privacy.html",
    "icon": "🧪",
    "desc": "Comprehensive GDPR, CCPA, and Google AdSense compliant privacy policy for Smart Farm Engineering Lab.",
    "tags": "smartfarm privacy html privacy policy comprehensive gdpr ccpa and google adsense compliant privacy policy for smart farm engineering lab"
  },
  {
    "title": "Energy Price & Equipment Specs",
    "cat": "sim",
    "url": "smartfarm/roi_simulator.html",
    "icon": "🧪",
    "desc": "Compare annual heating costs between conventional boilers (gas, oil, LPG) and heat pumps. Calculate payback period, energy savings, and return on",
    "tags": "smartfarm roi simulator html energy price equipment specs compare annual heating costs between conventional boilers gas oil lpg and heat pumps calculate payback period energy savin"
  },
  {
    "title": "📐 WFC Smartfarm Layout Planner",
    "cat": "sim",
    "url": "smartfarm/smartfarm_layout_wfc.html",
    "icon": "🧪",
    "desc": "Autonomous Wave Function Collapse (WFC) and A* pathfinding algorithm for smart farm greenhouse design. Automatically routes cultivation gutters, ",
    "tags": "smartfarm smartfarm layout wfc html wfc smartfarm layout planner autonomous wave function collapse wfc and a pathfinding algorithm for smart farm greenhouse design automatically ro"
  },
  {
    "title": "Terms of Service",
    "cat": "sim",
    "url": "smartfarm/terms.html",
    "icon": "🧪",
    "desc": "Terms of service and usage disclaimers for Smart Farm Engineering Lab's free online greenhouse calculators and agricultural engineering simulatio",
    "tags": "smartfarm terms html terms of service terms of service and usage disclaimers for smart farm engineering lab s free online greenhouse calculators and agricultural engineering simula"
  },
  {
    "title": "Microclimate & Canopy Data",
    "cat": "sim",
    "url": "smartfarm/transpiration.html",
    "icon": "🧪",
    "desc": "Calculate real-time crop transpiration rates using the biophysical Penman-Monteith equation. Supports tomato, pepper, cucumber, and strawberry st",
    "tags": "smartfarm transpiration html microclimate canopy data calculate real-time crop transpiration rates using the biophysical penman-monteith equation supports tomato pepper cucumber an"
  },
  {
    "title": "Photosynthetic Photon Flux & DLI Optimizer",
    "cat": "sim",
    "url": "smartfarm/vertical_dli.html",
    "icon": "🧪",
    "desc": "Calculate Daily Light Integral (DLI), LED PPFD requirements, photoperiod optimization, and thermal heat dissipation for vertical farming and indo",
    "tags": "smartfarm vertical dli html photosynthetic photon flux dli optimizer calculate daily light integral dli led ppfd requirements photoperiod optimization and thermal heat dissipation "
  },
  {
    "title": "Environmental Data",
    "cat": "sim",
    "url": "smartfarm/vpd.html",
    "icon": "🧪",
    "desc": "Calculate leaf-to-air Vapor Pressure Deficit (VPD) in real-time using the Tetens equation. Optimize greenhouse climate for seedling, vegetative, ",
    "tags": "smartfarm vpd html environmental data calculate leaf-to-air vapor pressure deficit vpd in real-time using the tetens equation optimize greenhouse climate for seedling vegetative"
  },
  {
    "title": "📊 AgriQuant CEA Energy & Commodity Terminal",
    "cat": "tool",
    "url": "tools/agriquant-greenhouse-energy-commodity-terminal.html",
    "icon": "🛠️",
    "desc": "Open-source financial and energy quant terminal for commercial high-tech greenhouses. Simulates Dutch TTF natural gas prices, electricity spark s",
    "tags": "tools agriquant-greenhouse-energy-commodity-terminal html agriquant cea energy commodity terminal open-source financial and energy quant terminal for commercial high-tech greenhous"
  },
  {
    "title": "AgriVision™ Real-Time Leaf Disease Diagnostic Engine",
    "cat": "tool",
    "url": "tools/agrivision-ai-crop-disease-analyzer.html",
    "icon": "🛠️",
    "desc": "Client-side AI computer vision analyzer for greenhouse leaf pathology. Real-time webcam or image upload, spectral chlorosis segmentation, boundin",
    "tags": "tools agrivision-ai-crop-disease-analyzer html agrivision real-time leaf disease diagnostic engine client-side ai computer vision analyzer for greenhouse leaf pathology real-time w"
  },
  {
    "title": "Aquifer Thermal Energy Storage (ATES) & Heat Pump Sizing Simulator",
    "cat": "tool",
    "url": "tools/ates-aquifer-thermal-energy-storage-heat-pump-simulator.html",
    "icon": "🛠️",
    "desc": "Industrial CEA Aquifer Thermal Energy Storage (ATES) doublet well and heat pump simulator. Models warm/cold well seasonal hydraulics, Darcy drawd",
    "tags": "tools ates-aquifer-thermal-energy-storage-heat-pump-simulator html aquifer thermal energy storage ates heat pump sizing simulator industrial cea aquifer thermal energy storage ates"
  },
  {
    "title": "⚡ CHP Flue Gas SCR & Urea Dosing Engine",
    "cat": "tool",
    "url": "tools/chp-flue-gas-scr-urea-dosing-calculator.html",
    "icon": "🛠️",
    "desc": "Industrial Selective Catalytic Reduction (SCR) calculator for natural gas CHP engines. Compute stoichiometric urea dosing, NOx to N2 conversion, ",
    "tags": "tools chp-flue-gas-scr-urea-dosing-calculator html chp flue gas scr urea dosing engine industrial selective catalytic reduction scr calculator for natural gas chp engines compute s"
  },
  {
    "title": "Closed-Loop Drainage Recirculation & Ion Balance Simulator",
    "cat": "tool",
    "url": "tools/closed-loop-nutrient-recirculation-ion-balance-simulator.html",
    "icon": "🛠️",
    "desc": "Commercial greenhouse closed-loop hydroponics drainage reuse simulator. Models multi-cycle Na/Cl accumulation, Davies ionic activity coefficients",
    "tags": "tools closed-loop-nutrient-recirculation-ion-balance-simulator html closed-loop drainage recirculation ion balance simulator commercial greenhouse closed-loop hydroponics drainage "
  },
  {
    "title": "💧 Closed-Loop RO Desalination & Energy Engine",
    "cat": "tool",
    "url": "tools/closed-loop-reverse-osmosis-desalination-energy-optimizer.html",
    "icon": "🛠️",
    "desc": "Industrial engineering calculator for greenhouse reverse osmosis (RO) membrane flux (LMH), specific energy consumption (kWh/m3), sodium Na+ rejec",
    "tags": "tools closed-loop-reverse-osmosis-desalination-energy-optimizer html closed-loop ro desalination energy engine industrial engineering calculator for greenhouse reverse osmosis ro m"
  },
  {
    "title": "🍃 Farquhar (FvCB) Leaf Photosynthesis Engine",
    "cat": "tool",
    "url": "tools/co2-enrichment-leaf-photosynthesis-farquhar-calculator.html",
    "icon": "🛠️",
    "desc": "Industrial plant physiology calculator for Farquhar-von Caemmerer-Berry (FvCB) C3 leaf photosynthesis, Rubisco kinetics (Vcmax), electron transpo",
    "tags": "tools co2-enrichment-leaf-photosynthesis-farquhar-calculator html farquhar fvcb leaf photosynthesis engine industrial plant physiology calculator for farquhar-von caemmerer-berry f"
  },
  {
    "title": "Commercial CEA Feasibility &Non-Dilutive Grant Dossier Generator",
    "cat": "tool",
    "url": "tools/commercial-feasibility-grant-dossier-generator.html",
    "icon": "🛠️",
    "desc": "Institutional agricultural feasibility modeler and non-dilutive grant dossier generator across 50 US states. Computes CAPEX, OPEX, USDA REAP/EQIP",
    "tags": "tools commercial-feasibility-grant-dossier-generator html commercial cea feasibility non-dilutive grant dossier generator institutional agricultural feasibility modeler and non-dil"
  },
  {
    "title": "🌱 Crop Steering Matrix (Generative vs Vegetative)",
    "cat": "tool",
    "url": "tools/crop-steering-generative-vegetative-matrix.html",
    "icon": "🛠️",
    "desc": "Industrial crop steering optimizer for high-wire greenhouse tomatoes, peppers, and cannabis. Calculate 24h DIF, VPD differential, and irrigation ",
    "tags": "tools crop-steering-generative-vegetative-matrix html crop steering matrix generative vs vegetative industrial crop steering optimizer for high-wire greenhouse tomatoes peppers and"
  },
  {
    "title": "🍅 Xylem Calcium Flux & Blossom-End Rot (BER) Engine",
    "cat": "tool",
    "url": "tools/crop-transpiration-calcium-blossom-end-rot-risk-model.html",
    "icon": "🛠️",
    "desc": "Industrial plant physiology calculator for xylem calcium transport kinetics, transpiration pull, and Blossom-End Rot (BER) risk forecasting in co",
    "tags": "tools crop-transpiration-calcium-blossom-end-rot-risk-model html xylem calcium flux blossom-end rot ber engine industrial plant physiology calculator for xylem calcium transport ki"
  },
  {
    "title": "📈 Crop Yield & Biomass DLI Forecaster",
    "cat": "tool",
    "url": "tools/crop-yield-biomass-dli-forecaster.html",
    "icon": "🛠️",
    "desc": "Predictive photosynthetic dry matter accumulation, Light Use Efficiency (LUE), and weekly commercial crop harvest yields based on cumulative Dail",
    "tags": "tools crop-yield-biomass-dli-forecaster html crop yield biomass dli forecaster predictive photosynthetic dry matter accumulation light use efficiency lue and weekly commercial crop"
  },
  {
    "title": "🌿 Greenhouse Digital Twin Simulator",
    "cat": "tool",
    "url": "tools/digital-twin-greenhouse-simulator.html",
    "icon": "🛠️",
    "desc": "Industrial-grade interactive Venlo greenhouse digital twin simulator. Model real-time solar radiation, VPD, crop transpiration, thermal screens, ",
    "tags": "tools digital-twin-greenhouse-simulator html greenhouse digital twin simulator industrial-grade interactive venlo greenhouse digital twin simulator model real-time solar radiation "
  },
  {
    "title": "💡 DLI & Far-Red Spectrum Calculator",
    "cat": "tool",
    "url": "tools/dli-spectrum-photomorphogenesis-calculator.html",
    "icon": "🛠️",
    "desc": "Industrial-grade Daily Light Integral (DLI) & Far-Red (730nm) Emerson Enhancement Effect spectral calculator for commercial greenhouse horticultu",
    "tags": "tools dli-spectrum-photomorphogenesis-calculator html dli far-red spectrum calculator industrial-grade daily light integral dli far-red 730nm emerson enhancement effect spectral ca"
  },
  {
    "title": "💧 Greenhouse Hourly Penman-Monteith ETc Engine",
    "cat": "tool",
    "url": "tools/evapotranspiration-penman-monteith-calculator.html",
    "icon": "🛠️",
    "desc": "Industrial FAO-56 Penman-Monteith hourly crop evapotranspiration (ETc), canopy resistance (rc), and aerodynamic resistance (ra) calculator for co",
    "tags": "tools evapotranspiration-penman-monteith-calculator html greenhouse hourly penman-monteith etc engine industrial fao-56 penman-monteith hourly crop evapotranspiration etc canopy re"
  },
  {
    "title": "💨 High-Pressure Fogging (70 bar) Droplet Engine",
    "cat": "tool",
    "url": "tools/fogging-nozzle-droplet-evaporative-cooling-engine.html",
    "icon": "🛠️",
    "desc": "Industrial 70 bar high-pressure fogging calculator. Compute Sauter Mean Diameter (D32 < 10µm), flash evaporation rates, adiabatic temperature dro",
    "tags": "tools fogging-nozzle-droplet-evaporative-cooling-engine html high-pressure fogging 70 bar droplet engine industrial 70 bar high-pressure fogging calculator compute sauter mean diam"
  },
  {
    "title": "Global Agri-Subsidy & Grant Navigator",
    "cat": "tool",
    "url": "tools/global-agri-subsidy-grant-navigator.html",
    "icon": "🛠️",
    "desc": "Official California (CDFA SWEEP/HSP/AMMP/FPIP/PHP/OTPP, CARB FARMER, CEC), USDA, European (BLE/GAP), and South Korean agricultural subsidy intell",
    "tags": "tools global-agri-subsidy-grant-navigator html global agri-subsidy grant navigator official california cdfa sweep hsp ammp fpip php otpp carb farmer cec usda european ble gap and s"
  },
  {
    "title": "3D Venlo Greenhouse Physics Simulator",
    "cat": "tool",
    "url": "tools/greenhouse-3d-digital-twin-simulator.html",
    "icon": "🛠️",
    "desc": "Interactive 3D WebGL Venlo glasshouse digital twin. Real-time solar trajectory shadow mapping, dynamic thermal screen deployment, roof vent airfl",
    "tags": "tools greenhouse-3d-digital-twin-simulator html 3d venlo greenhouse physics simulator interactive 3d webgl venlo glasshouse digital twin real-time solar trajectory shadow mapping d"
  },
  {
    "title": "🧠 Autonomous AI Climate Computer & MPC Optimizer",
    "cat": "tool",
    "url": "tools/greenhouse-autonomous-ai-climate-controller.html",
    "icon": "🛠️",
    "desc": "Reinforcement learning and Model Predictive Control (MPC) simulator for autonomous greenhouse climate computers, optimizing 24h temperature traje",
    "tags": "tools greenhouse-autonomous-ai-climate-controller html autonomous ai climate computer mpc optimizer reinforcement learning and model predictive control mpc simulator for autonomous"
  },
  {
    "title": "🐞 Greenhouse Biological Pest Control (IPM) Sizing Engine",
    "cat": "tool",
    "url": "tools/greenhouse-biological-pest-control-ipm-calculator.html",
    "icon": "🛠️",
    "desc": "Industrial Integrated Pest Management (IPM) bio-control calculator for commercial greenhouses. Calculate predatory mite (Phytoseiulus, Amblyseius",
    "tags": "tools greenhouse-biological-pest-control-ipm-calculator html greenhouse biological pest control ipm sizing engine industrial integrated pest management ipm bio-control calculator f"
  },
  {
    "title": "Greenhouse Biomass CHP & Waste Heat ROI Simulator",
    "cat": "tool",
    "url": "tools/greenhouse-biomass-chp-energy-roi-calculator.html",
    "icon": "🛠️",
    "desc": "Interactive precision engineering calculator for greenhouse biomass-fired CHP systems: model wood-chip fuel costs, fossil natural gas replacement",
    "tags": "tools greenhouse-biomass-chp-energy-roi-calculator html greenhouse biomass chp waste heat roi simulator interactive precision engineering calculator for greenhouse biomass-fired ch"
  },
  {
    "title": "💰 Greenhouse 10-Year CapEx, OpEx, IRR & NPV Investment Engine",
    "cat": "tool",
    "url": "tools/greenhouse-capex-opex-10year-roi-calculator.html",
    "icon": "🛠️",
    "desc": "Industrial financial engineering calculator for high-tech commercial glasshouse investments: CapEx breakdown, 10-year OpEx cash flows, Internal R",
    "tags": "tools greenhouse-capex-opex-10year-roi-calculator html greenhouse 10-year capex opex irr npv investment engine industrial financial engineering calculator for high-tech commercial "
  },
  {
    "title": "💨 Greenhouse CO₂ Enrichment & Economics Engine",
    "cat": "tool",
    "url": "tools/greenhouse-co2-enrichment-optimizer.html",
    "icon": "🛠️",
    "desc": "Industrial CO2 dosing kinetics and economics optimizer. Calculate pure liquid vs flue gas dosing costs, ventilation purge losses, and net crop yi",
    "tags": "tools greenhouse-co2-enrichment-optimizer html greenhouse co enrichment economics engine industrial co2 dosing kinetics and economics optimizer calculate pure liquid vs flue gas do"
  },
  {
    "title": "🔥 Greenhouse Heating Load, Thermal Screen & Green Energy Sizer",
    "cat": "tool",
    "url": "tools/greenhouse-heating-load-thermal-screen-calculator.html",
    "icon": "🛠️",
    "desc": "Commercial engineering calculator for greenhouse peak heating demand, DIN V 18599 thermal screen savings, hydronic pipe rail sizing, and geotherm",
    "tags": "tools greenhouse-heating-load-thermal-screen-calculator html greenhouse heating load thermal screen green energy sizer commercial engineering calculator for greenhouse peak heating"
  },
  {
    "title": "💡 LED Thermal Heat-Sink & Tj Optimizer",
    "cat": "tool",
    "url": "tools/greenhouse-lighting-led-thermal-cfd-optimizer.html",
    "icon": "🛠️",
    "desc": "Industrial engineering calculator for horticultural LED fixture thermal dissipation, junction temperature (Tj), photon efficacy derating, and can",
    "tags": "tools greenhouse-lighting-led-thermal-cfd-optimizer html led thermal heat-sink tj optimizer industrial engineering calculator for horticultural led fixture thermal dissipation junc"
  },
  {
    "title": "💨 Greenhouse HAF Air Circulation & CFD Optimizer",
    "cat": "tool",
    "url": "tools/greenhouse-microclimate-cfd-air-velocity-optimizer.html",
    "icon": "🛠️",
    "desc": "Industrial CFD calculator for horizontal air flow (HAF) fan spacing, jet throw distance, Bernoulli air entrainment, and microclimate boundary lay",
    "tags": "tools greenhouse-microclimate-cfd-air-velocity-optimizer html greenhouse haf air circulation cfd optimizer industrial cfd calculator for horizontal air flow haf fan spacing jet thr"
  },
  {
    "title": "📡 Greenhouse Edge IoT & MQTT Fleet Simulator",
    "cat": "tool",
    "url": "tools/greenhouse-mqtt-edge-iot-fleet-simulator.html",
    "icon": "🛠️",
    "desc": "Industrial IoT simulator streaming real-time MQTT telemetry across 100 virtual greenhouse microclimate, slab TDR, and PAR sensor nodes with edge ",
    "tags": "tools greenhouse-mqtt-edge-iot-fleet-simulator html greenhouse edge iot mqtt fleet simulator industrial iot simulator streaming real-time mqtt telemetry across 100 virtual greenhou"
  },
  {
    "title": "Greenhouse Natural Ventilation & Buoyancy-Driven Airflow Calculator",
    "cat": "tool",
    "url": "tools/greenhouse-natural-ventilation-buoyancy-airflow-calculator.html",
    "icon": "🛠️",
    "desc": "Calculate natural ventilation rates, buoyancy-driven (stack effect) and wind-driven airflow through greenhouse vents using ASABE EP406.4 and De J",
    "tags": "tools greenhouse-natural-ventilation-buoyancy-airflow-calculator html greenhouse natural ventilation buoyancy-driven airflow calculator calculate natural ventilation rates buoyancy"
  },
  {
    "title": "🏗️ Greenhouse Structural Load (EN 13031-1 / NEN 3859) Engine",
    "cat": "tool",
    "url": "tools/greenhouse-structural-wind-snow-load-nen3859-calculator.html",
    "icon": "🛠️",
    "desc": "Industrial structural engineering calculator for Venlo greenhouse wind pressure (qw), snow load (qs), trellised crop wire weight, and column mome",
    "tags": "tools greenhouse-structural-wind-snow-load-nen3859-calculator html greenhouse structural load en 13031-1 nen 3859 engine industrial structural engineering calculator for venlo gree"
  },
  {
    "title": "🧪 Hydroponic Chemical Speciation & Mineral Precipitation Engine",
    "cat": "tool",
    "url": "tools/hydroponic-chemical-speciation-precipitation-index.html",
    "icon": "🛠️",
    "desc": "Industrial chemical speciation calculator for hydroponic nutrient solutions: Debye-Hückel ionic strength, ion activity coefficients, and Saturati",
    "tags": "tools hydroponic-chemical-speciation-precipitation-index html hydroponic chemical speciation mineral precipitation engine industrial chemical speciation calculator for hydroponic n"
  },
  {
    "title": "🧪 Hydroponic Nutrient & Ion Balance Calculator",
    "cat": "tool",
    "url": "tools/hydroponic-nutrient-solution-calculator.html",
    "icon": "🛠️",
    "desc": "Industrial-grade commercial hydroponic nutrient solution calculator. Optimize Hoagland, Sonneveld, and Steiner ionic ratios (NO3, K, Ca, Mg, P) f",
    "tags": "tools hydroponic-nutrient-solution-calculator html hydroponic nutrient ion balance calculator industrial-grade commercial hydroponic nutrient solution calculator optimize hoagland "
  },
  {
    "title": "🔬 Nutrient Uptake Concentration Factor Analyzer",
    "cat": "tool",
    "url": "tools/nutrient-uptake-concentration-factor-analyzer.html",
    "icon": "🛠️",
    "desc": "Model nutrient uptake concentration factors in recirculating and drain-to-waste hydroponic systems. Simulate EC drift, ion accumulation, and opti",
    "tags": "tools nutrient-uptake-concentration-factor-analyzer html nutrient uptake concentration factor analyzer model nutrient uptake concentration factors in recirculating and drain-to-was"
  },
  {
    "title": "OpenCEA Developer Playground",
    "cat": "tool",
    "url": "tools/opencea-python-micro-framework-playground.html",
    "icon": "🛠️",
    "desc": "Open-access developer documentation, interactive REST API playground, and open-source MCP server for greenhouse physics, VPD, DLI, evapotranspira",
    "tags": "tools opencea-python-micro-framework-playground html opencea developer playground open-access developer documentation interactive rest api playground and open-source mcp server for"
  },
  {
    "title": "☀️ Canopy Light Extinction (Beer-Lambert & LAI) Engine",
    "cat": "tool",
    "url": "tools/par-far-red-canopy-extinction-beer-lambert-calculator.html",
    "icon": "🛠️",
    "desc": "Industrial plant physiology calculator for multi-layer canopy light extinction (Beer-Lambert Law), Leaf Area Index (LAI), and diffuse vs direct p",
    "tags": "tools par-far-red-canopy-extinction-beer-lambert-calculator html canopy light extinction beer-lambert lai engine industrial plant physiology calculator for multi-layer canopy light"
  },
  {
    "title": "🌡️ Psychrometric Mollier & Dehumidification Optimizer",
    "cat": "tool",
    "url": "tools/psychrometric-mollier-greenhouse-dehumidifier.html",
    "icon": "🛠️",
    "desc": "Industrial psychrometric air state and greenhouse dehumidification energy optimizer. Compare mechanical heat pumps vs ridge vent purging.",
    "tags": "tools psychrometric-mollier-greenhouse-dehumidifier html psychrometric mollier dehumidification optimizer industrial psychrometric air state and greenhouse dehumidification energy "
  },
  {
    "title": "🧱 Rockwool TDR Moisture & Drain EC Optimizer",
    "cat": "tool",
    "url": "tools/rockwool-substrate-tdr-moisture-drain-optimizer.html",
    "icon": "🛠️",
    "desc": "Industrial substrate water content (VWC %), dry-down kinetics, and drainage EC balancing calculator for commercial rockwool slab hydroponics.",
    "tags": "tools rockwool-substrate-tdr-moisture-drain-optimizer html rockwool tdr moisture drain ec optimizer industrial substrate water content vwc dry-down kinetics and drainage ec balanci"
  },
  {
    "title": "Semi-Closed Greenhouse ATU & Mollier h-x Simulator",
    "cat": "tool",
    "url": "tools/semi-closed-greenhouse-atu-mollier-simulator.html",
    "icon": "🛠️",
    "desc": "산업용 반밀폐 온실(Semi-Closed Greenhouse) 공조기(ATU) 및 몰리에르 선도(Mollier h-x) 실시간 3D 열역학 시뮬레이터. Kubo Ultra-Clima & Van der Hoeven ModulAIR 벤치마크, 타공 덕트 기류, 양",
    "tags": "tools semi-closed-greenhouse-atu-mollier-simulator html semi-closed greenhouse atu mollier h-x simulator 산업용 반밀폐 온실 semi-closed greenhouse 공조기 atu 및 몰리에르 선도 mollier h-x 실시간 3d 열역학 "
  },
  {
    "title": "💧 Substrate Matric Potential (Ψm) & pF Curve Engine",
    "cat": "tool",
    "url": "tools/soil-matrix-water-potential-matric-suction-calculator.html",
    "icon": "🛠️",
    "desc": "Industrial agricultural physics calculator for substrate matric water potential (Psi_m), pF retention curves, van Genuchten model, and field capa",
    "tags": "tools soil-matrix-water-potential-matric-suction-calculator html substrate matric potential m pf curve engine industrial agricultural physics calculator for substrate matric water "
  },
  {
    "title": "🔥 Hot Water Buffer Tank & Stratification Engine",
    "cat": "tool",
    "url": "tools/solar-thermal-buffer-tank-stratification-calculator.html",
    "icon": "🛠️",
    "desc": "Industrial engineering calculator for greenhouse hot-water buffer tank thermal storage (MWh), thermocline stratification stability, and night pea",
    "tags": "tools solar-thermal-buffer-tank-stratification-calculator html hot water buffer tank stratification engine industrial engineering calculator for greenhouse hot-water buffer tank th"
  },
  {
    "title": "🧬 UV-C Pathogen Disinfection & Fluence Engine",
    "cat": "tool",
    "url": "tools/uvc-drainage-pathogen-disinfection-calculator.html",
    "icon": "🛠️",
    "desc": "Industrial UV-C radiation dose (mJ/cm2), UVT% water transmissivity, and Chick-Watson log-reduction kinetics for ToBRFV, Pythium, and Fusarium in ",
    "tags": "tools uvc-drainage-pathogen-disinfection-calculator html uv-c pathogen disinfection fluence engine industrial uv-c radiation dose mj cm2 uvt water transmissivity and chick-watson l"
  },
  {
    "title": "Photomorphogenic Regulation of Anthocyanin Biosynthetic Genes via Blue-to-Red Spectral Ratios",
    "cat": "wiki",
    "url": "wiki/anthocyanin_led_spectral_kinetics.html",
    "icon": "🧬",
    "desc": "Photomorphogenic regulation of Chalcone Synthase (CHS) and DFR gene expression via blue-to-red LED spectral ratios for anthocyanin induction.",
    "tags": "wiki anthocyanin led spectral kinetics html photomorphogenic regulation of anthocyanin biosynthetic genes via blue-to-red spectral ratios photomorphogenic regulation of chalcone sy"
  },
  {
    "title": "Arugula / Rocket (Eruca vesicaria)",
    "cat": "wiki",
    "url": "wiki/arugula.html",
    "icon": "🧬",
    "desc": "Precision CEA engineering guide for hydroponic arugula (Eruca vesicaria): DLI photoperiod steering, sulfur-glucosinolate kinetics, and NFT EC con",
    "tags": "wiki arugula html arugula rocket eruca vesicaria precision cea engineering guide for hydroponic arugula eruca vesicaria dli photoperiod steering sulfur-glucosinolate kinetics and n"
  },
  {
    "title": "Sweet Basil (Ocimum basilicum L.)",
    "cat": "wiki",
    "url": "wiki/basil.html",
    "icon": "🧬",
    "desc": "Hydroponic sweet basil (Ocimum basilicum) CEA engineering guide: LED spectrum steering for eugenol/linalool oils and Ca tip-burn prevention.",
    "tags": "wiki basil html sweet basil ocimum basilicum l hydroponic sweet basil ocimum basilicum cea engineering guide led spectrum steering for eugenol linalool oils and ca tip-burn prevent"
  },
  {
    "title": "Xylem-Mediated Calcium Translocation Kinetics and Root-Pressure Driven Guttation Steering",
    "cat": "wiki",
    "url": "wiki/calcium_channel_xylem_transport.html",
    "icon": "🧬",
    "desc": "Xylem-mediated calcium translocation kinetics, mechanosensitive Ca2+ channels, and nocturnal root-pressure guttation steering in Solanaceae.",
    "tags": "wiki calcium channel xylem transport html xylem-mediated calcium translocation kinetics and root-pressure driven guttation steering xylem-mediated calcium translocation kinetics me"
  },
  {
    "title": "Care Farming (치유농업)",
    "cat": "wiki",
    "url": "wiki/care_farming.html",
    "icon": "🧬",
    "desc": "Therapeutic Care Farming & Barrier-Free CEA Engineering: clinical horticultural therapy, ergonomic glasshouse design, and sensory steering.",
    "tags": "wiki care farming html care farming 치유농업 therapeutic care farming barrier-free cea engineering clinical horticultural therapy ergonomic glasshouse design and sensory steering"
  },
  {
    "title": "Pulse-Amplitude-Modulation (PAM) Fluorometry and Fv/Fm Quantum Yield Kinetics under Rapid Spectrum Transitions",
    "cat": "wiki",
    "url": "wiki/chlorophyll_fluorescence_pam_stress_kinetics.html",
    "icon": "🧬",
    "desc": "Pulse-Amplitude-Modulation (PAM) fluorometry modeling of PSII quantum yield (Fv/Fm) and NPQ relaxation kinetics during LED spectrum ramping.",
    "tags": "wiki chlorophyll fluorescence pam stress kinetics html pulse-amplitude-modulation pam fluorometry and fv fm quantum yield kinetics under rapid spectrum transitions pulse-amplitude-"
  },
  {
    "title": "Canopy CO2 Enrichment Dynamics (1200 ppm) and Rubisco Carboxylation Kinetics under Variable PPFD Regimes",
    "cat": "wiki",
    "url": "wiki/co2_injection_canopy_assimilation_kinetics.html",
    "icon": "🧬",
    "desc": "Canopy CO2 enrichment dynamics (1200 ppm), Rubisco carboxylation velocity (Vcmax), and photorespiration suppression under high PPFD regimes.",
    "tags": "wiki co2 injection canopy assimilation kinetics html canopy co2 enrichment dynamics 1200 ppm and rubisco carboxylation kinetics under variable ppfd regimes canopy co2 enrichment dy"
  },
  {
    "title": "Cucumber (Cucumis sativus)",
    "cat": "wiki",
    "url": "wiki/cucumber.html",
    "icon": "🧬",
    "desc": "High-wire greenhouse cucumber (Cucumis sativus) CEA engineering guide: high-LAI transpiration modeling, VPD steering, and K-dominant fertigation.",
    "tags": "wiki cucumber html cucumber cucumis sativus high-wire greenhouse cucumber cucumis sativus cea engineering guide high-lai transpiration modeling vpd steering and k-dominant fertigat"
  },
  {
    "title": "Thermodynamic Optimization of Daily Light Integral (DLI) and Phytochrome Photostationary State (PSS)",
    "cat": "wiki",
    "url": "wiki/dli_photomorphogenesis_steering.html",
    "icon": "🧬",
    "desc": "Thermodynamic optimization of Daily Light Integral (DLI) and Phytochrome Photostationary State (Pfr/Ptotal) in LED vertical farming canopies.",
    "tags": "wiki dli photomorphogenesis steering html thermodynamic optimization of daily light integral dli and phytochrome photostationary state pss thermodynamic optimization of daily light"
  },
  {
    "title": "Far-Red (730nm) Photon Fraction Steering for Rapid Leaf Area Index Expansion without Stem Lodging",
    "cat": "wiki",
    "url": "wiki/far_red_shade_avoidance_yield_kinetics.html",
    "icon": "🧬",
    "desc": "End-of-day Far-Red (730 nm) phytochrome photo-equilibrium steering for 35% faster Leaf Area Index (LAI) closure without stem lodging.",
    "tags": "wiki far red shade avoidance yield kinetics html far-red 730nm photon fraction steering for rapid leaf area index expansion without stem lodging end-of-day far-red 730 nm phytochro"
  },
  {
    "title": "Root Zone Temperature (RZT) Dynamics, Dissolved Oxygen (DO) Saturation, and ATP Yield in NFT Spinach Channels",
    "cat": "wiki",
    "url": "wiki/hydroponic_root_zone_temperature_respiration.html",
    "icon": "🧬",
    "desc": "Hydroponic Root Zone Temperature (RZT 18°C) chilling, dissolved oxygen saturation, mitochondrial ATP yield, and Pythium root rot suppression.",
    "tags": "wiki hydroponic root zone temperature respiration html root zone temperature rzt dynamics dissolved oxygen do saturation and atp yield in nft spinach channels hydroponic root zone "
  },
  {
    "title": "400-1000nm Hyperspectral Leaf Reflectance Modeling for Early Discrimination of Fe vs N Chlorosis",
    "cat": "wiki",
    "url": "wiki/hyperspectral_leaf_reflectance_nutrient_stress.html",
    "icon": "🧬",
    "desc": "400-1000 nm hyperspectral leaf reflectance and SVM machine learning classification for pre-symptomatic Fe vs. N chlorosis detection in CEA.",
    "tags": "wiki hyperspectral leaf reflectance nutrient stress html 400-1000nm hyperspectral leaf reflectance modeling for early discrimination of fe vs n chlorosis 400-1000 nm hyperspectral "
  },
  {
    "title": "Real-Time Closed-Loop Machine Learning Ionic Activity Balancing in Recirculating Hydroponic Systems",
    "cat": "wiki",
    "url": "wiki/ion_selective_electrode_fertigation_ml.html",
    "icon": "🧬",
    "desc": "Closed-loop LSTM neural network and solid-state Ion-Selective Electrode (ISE) array for zero-discharge recirculating hydroponic fertigation.",
    "tags": "wiki ion selective electrode fertigation ml html real-time closed-loop machine learning ionic activity balancing in recirculating hydroponic systems closed-loop lstm neural network"
  },
  {
    "title": "Curly Kale (Brassica oleracea var. sabellica)",
    "cat": "wiki",
    "url": "wiki/kale.html",
    "icon": "🧬",
    "desc": "CEA engineering guide for hydroponic curly kale: cold-stress DIF steering, glucosinolate and anthocyanin biosynthesis, and vertical farm LED spec",
    "tags": "wiki kale html curly kale brassica oleracea var sabellica cea engineering guide for hydroponic curly kale cold-stress dif steering glucosinolate and anthocyanin biosynthesis and ve"
  },
  {
    "title": "Glucosinolate Accumulation Kinetics and Cold-Stress Induced Anthocyanin Biosynthesis in Brassica oleracea",
    "cat": "wiki",
    "url": "wiki/kale_glucosinolate_cold_stress.html",
    "icon": "🧬",
    "desc": "Cold-night DIF (+8°C) and sulfate fertigation kinetics driving myrosinase (EC 3.2.1.147), glucoraphanin, and anthocyanin synthesis in kale.",
    "tags": "wiki kale glucosinolate cold stress html glucosinolate accumulation kinetics and cold-stress induced anthocyanin biosynthesis in brassica oleracea cold-night dif 8 c and sulfate fe"
  },
  {
    "title": "Stoichiometric & Kinetic Modeling of Rubisco Carboxylation Efficiency under CO2 Enrichment",
    "cat": "wiki",
    "url": "wiki/kegg_carbon_rubisco_kinetics.html",
    "icon": "🧬",
    "desc": "Farquhar-von Caemmerer-Berry (FVCB) modeling of Rubisco carboxylation (Vcmax, Jmax) and KEGG carbon fixation under 1000 ppm CO2 enrichment.",
    "tags": "wiki kegg carbon rubisco kinetics html stoichiometric kinetic modeling of rubisco carboxylation efficiency under co2 enrichment farquhar-von caemmerer-berry fvcb modeling of rubisc"
  },
  {
    "title": "KEGG Carotenoid Biosynthetic Pathway Flux and Lutein Xanthophyll Photoprotection under High PPFD Regimes",
    "cat": "wiki",
    "url": "wiki/kegg_carotenoid_lutein_photoprotection.html",
    "icon": "🧬",
    "desc": "KEGG carotenoid pathway (sly00906) flux and lycopene epsilon-cyclase up-regulation for lutein xanthophyll photoprotection under UV-A + high PPFD.",
    "tags": "wiki kegg carotenoid lutein photoprotection html kegg carotenoid biosynthetic pathway flux and lutein xanthophyll photoprotection under high ppfd regimes kegg carotenoid pathway sl"
  },
  {
    "title": "Metabolic Flux Analysis of Flavonoid Biosynthesis (KEGG sly00941) under Osmotic and Thermal Stress",
    "cat": "wiki",
    "url": "wiki/kegg_flavonoid_secondary_metabolism.html",
    "icon": "🧬",
    "desc": "Metabolic flux analysis of the KEGG flavonoid biosynthesis pathway (sly00941) and flavonol synthase kinetics under thermal-osmotic steering.",
    "tags": "wiki kegg flavonoid secondary metabolism html metabolic flux analysis of flavonoid biosynthesis kegg sly00941 under osmotic and thermal stress metabolic flux analysis of the kegg f"
  },
  {
    "title": "Lettuce (Lactuca sativa)",
    "cat": "wiki",
    "url": "wiki/lettuce.html",
    "icon": "🧬",
    "desc": "Hydroponic and vertical farm lettuce (Lactuca sativa) CEA engineering guide: DLI optimization, CFD airflow tip-burn mitigation, and NFT control.",
    "tags": "wiki lettuce html lettuce lactuca sativa hydroponic and vertical farm lettuce lactuca sativa cea engineering guide dli optimization cfd airflow tip-burn mitigation and nft control"
  },
  {
    "title": "Navier-Stokes Fluid Dynamics Modeling of Leaf Boundary Layer Thermal Transport under Micro-Vectored Airflow",
    "cat": "wiki",
    "url": "wiki/micro_airflow_boundary_layer_fluid_dynamics.html",
    "icon": "🧬",
    "desc": "3D Navier-Stokes fluid dynamics modeling of leaf boundary layer thickness (0.6 mm) and transpirational Ca2+ flux under 0.35 m/s vertical airflow.",
    "tags": "wiki micro airflow boundary layer fluid dynamics html navier-stokes fluid dynamics modeling of leaf boundary layer thermal transport under micro-vectored airflow 3d navier-stokes f"
  },
  {
    "title": "Metagenomic Characterization of Rhizosphere PGPR Siderophore Production in Organic Substrates",
    "cat": "wiki",
    "url": "wiki/microbial_rhizosphere_metagenomics.html",
    "icon": "🧬",
    "desc": "16S rRNA metagenomic characterization of PGPR pyoverdine siderophore iron chelation and Pythium suppression in organic coir hydroponics.",
    "tags": "wiki microbial rhizosphere metagenomics html metagenomic characterization of rhizosphere pgpr siderophore production in organic substrates 16s rrna metagenomic characterization of "
  },
  {
    "title": "Pulsed Pre-Harvest UV-B (310nm) Irradiation for 3-Fold Expansion of Sulforaphane Content in Broccoli Microgreens",
    "cat": "wiki",
    "url": "wiki/microgreens_sulforaphane_enhancement_lighting.html",
    "icon": "🧬",
    "desc": "Pulsed pre-harvest UV-B (310 nm) elicitation up-regulating CYP79F1 and MYB28 for a 310% expansion of sulforaphane in Brassica microgreens.",
    "tags": "wiki microgreens sulforaphane enhancement lighting html pulsed pre-harvest uv-b 310nm irradiation for 3-fold expansion of sulforaphane content in broccoli microgreens pulsed pre-ha"
  },
  {
    "title": "Phosphate Transporter Gene Expression (Pht1 Family) and Arbuscular Mycorrhizal Symbiosis",
    "cat": "wiki",
    "url": "wiki/mycorrhizal_phosphate_transporter_kinetics.html",
    "icon": "🧬",
    "desc": "Arbuscular mycorrhizal symbiosis and Pht1 phosphate transporter gene expression kinetics under low-phosphorus (0.35 mM) organic hydroponics.",
    "tags": "wiki mycorrhizal phosphate transporter kinetics html phosphate transporter gene expression pht1 family and arbuscular mycorrhizal symbiosis arbuscular mycorrhizal symbiosis and pht"
  },
  {
    "title": "Circadian Clock Gating of Plastidic Nitrate Reductase (NR) Activity under Photoperiod Extension",
    "cat": "wiki",
    "url": "wiki/nitrate_reductase_circadian_rhythm.html",
    "icon": "🧬",
    "desc": "Circadian clock (CCA1/LHY) gating of plastidic Nitrate Reductase (EC 1.7.1.1) phosphorylation and vacuolar nitrate purging under 16h photoperiods",
    "tags": "wiki nitrate reductase circadian rhythm html circadian clock gating of plastidic nitrate reductase nr activity under photoperiod extension circadian clock cca1 lhy gating of plasti"
  },
  {
    "title": "Osmotic Steering & Translocational Sucrose Accumulation Kinetics via Root-Zone EC Modulation",
    "cat": "wiki",
    "url": "wiki/osmotic_brix_salt_stress_kinetics.html",
    "icon": "🧬",
    "desc": "Osmotic root-zone EC steering, Sucrose Synthase (EC 2.4.1.13) activation, and phloem sugar unloading kinetics for high-Brix CEA fruit crops.",
    "tags": "wiki osmotic brix salt stress kinetics html osmotic steering translocational sucrose accumulation kinetics via root-zone ec modulation osmotic root-zone ec steering sucrose synthas"
  },
  {
    "title": "Oxalate Biosynthesis and Ascorbate Recycling Kinetics under Dynamic LED Spectrum in Spinacia oleracea",
    "cat": "wiki",
    "url": "wiki/oxalate_biosynthesis_ascorbate_recycling.html",
    "icon": "🧬",
    "desc": "Metabolic flux control of L-galactono-1,4-lactone dehydrogenase and oxalate reduction in Spinacia oleracea via 25% blue LED spectral steering.",
    "tags": "wiki oxalate biosynthesis ascorbate recycling html oxalate biosynthesis and ascorbate recycling kinetics under dynamic led spectrum in spinacia oleracea metabolic flux control of l"
  },
  {
    "title": "Paprika (Capsicum annuum)",
    "cat": "wiki",
    "url": "wiki/paprika.html",
    "icon": "🧬",
    "desc": "High-wire sweet pepper / paprika (Capsicum annuum) CEA engineering guide: cyclic fruit-set steering, ADT/DIF control, and Ca/K fertigation.",
    "tags": "wiki paprika html paprika capsicum annuum high-wire sweet pepper paprika capsicum annuum cea engineering guide cyclic fruit-set steering adt dif control and ca k fertigation"
  },
  {
    "title": "Bioenergetic Modeling of Photorespiratory Nitrogen Flux & Stomatal Conductance",
    "cat": "wiki",
    "url": "wiki/photorespiratory_nitrogen_kinetics.html",
    "icon": "🧬",
    "desc": "Bioenergetic model coupling VPD stomatal closure, mesophyll CO2 limitation, and GS-GOGAT photorespiratory nitrogen flux in CEA Solanaceae.",
    "tags": "wiki photorespiratory nitrogen kinetics html bioenergetic modeling of photorespiratory nitrogen flux stomatal conductance bioenergetic model coupling vpd stomatal closure mesophyll"
  },
  {
    "title": "Acoustic Wave Resonance (1-5 kHz) Inducing Stomatal Pore Expansion for Enhanced Micro-Foliar Uptake",
    "cat": "wiki",
    "url": "wiki/plant_acoustic_frequency_stomatal_kinetics.html",
    "icon": "🧬",
    "desc": "Acoustic wave mechanosensory resonance (3.2 kHz at 80 dB) driving guard cell K+ influx, stomatal aperture expansion, and foliar Ca2+ uptake.",
    "tags": "wiki plant acoustic frequency stomatal kinetics html acoustic wave resonance 1-5 khz inducing stomatal pore expansion for enhanced micro-foliar uptake acoustic wave mechanosensory "
  },
  {
    "title": "Lead-Free Perovskite Quantum Dot Wavelength-Shifting Films for Solar Photonic Yield Optimization",
    "cat": "wiki",
    "url": "wiki/quantum_dot_wavelength_shifting_films.html",
    "icon": "🧬",
    "desc": "Lead-free Cs3Bi2Br9 perovskite quantum dot greenhouse films shifting 500-560 nm green solar photons to 660 nm red for +18.4% biomass yield.",
    "tags": "wiki quantum dot wavelength shifting films html lead-free perovskite quantum dot wavelength-shifting films for solar photonic yield optimization lead-free cs3bi2br9 perovskite quan"
  },
  {
    "title": "🔬 Scientific Research Library: CEA Biophysics & Metabolic Kinetics",
    "cat": "wiki",
    "url": "wiki/research.html",
    "icon": "🧬",
    "desc": "Chronological Index of PhD-Level CEA Plant Physiology, Bioenergetics, and Climate Steering Research Papers by Inwoovation Lab.",
    "tags": "wiki research html scientific research library cea biophysics metabolic kinetics chronological index of phd-level cea plant physiology bioenergetics and climate steering research p"
  },
  {
    "title": "Rhizosphere Proton (H+) Exudation and Cation Exchange Capacity (CEC) Kinetics under NO3-/NH4+ Dosing",
    "cat": "wiki",
    "url": "wiki/rhizosphere_ph_cation_exchange_kinetics.html",
    "icon": "🧬",
    "desc": "Root plasma membrane H+-ATPase proton flux, substrate Cation Exchange Capacity (CEC), and autonomous pH stabilization via NO3-/NH4+ dosing.",
    "tags": "wiki rhizosphere ph cation exchange kinetics html rhizosphere proton h exudation and cation exchange capacity cec kinetics under no3- nh4 dosing root plasma membrane h -atpase prot"
  },
  {
    "title": "Droplet Size Distribution (30-80 μm) Optimization in Aeroponic Misters for Maximum Dissolved Oxygen Absorption",
    "cat": "wiki",
    "url": "wiki/root_zone_hypoxia_aeroponic_droplet_physics.html",
    "icon": "🧬",
    "desc": "Ultrasonic aeroponic droplet size distribution (40-60 um) optimization for 5-10 um root liquid film thickness and maximal DO respiration.",
    "tags": "wiki root zone hypoxia aeroponic droplet physics html droplet size distribution 30-80 m optimization in aeroponic misters for maximum dissolved oxygen absorption ultrasonic aeropon"
  },
  {
    "title": "Plastidic Mitochondrial Coupling & Root-Zone Dissolved Oxygen (DO) Respiration Dynamics",
    "cat": "wiki",
    "url": "wiki/rootzone_dissolved_oxygen_respiration.html",
    "icon": "🧬",
    "desc": "Hydroponic root-zone dissolved oxygen (DO > 9 mg/L) nanobubble dynamics, mitochondrial ATP synthase coupling, and active nitrate symport.",
    "tags": "wiki rootzone dissolved oxygen respiration html plastidic mitochondrial coupling root-zone dissolved oxygen do respiration dynamics hydroponic root-zone dissolved oxygen do 9 mg l "
  },
  {
    "title": "Elicitation Kinetics of Phenolic Antioxidants & Solanine Glycoalkaloids via UV-B Irradiance",
    "cat": "wiki",
    "url": "wiki/secondary_metabolite_elicitation_uvb.html",
    "icon": "🧬",
    "desc": "UVR8 photoreceptor activation and Phenylalanine Ammonia-Lyase (PAL, EC 4.3.1.24) elicitation kinetics under pulsed UV-B greenhouse lighting.",
    "tags": "wiki secondary metabolite elicitation uvb html elicitation kinetics of phenolic antioxidants solanine glycoalkaloids via uv-b irradiance uvr8 photoreceptor activation and phenylala"
  },
  {
    "title": "Spinach (Spinacia oleracea)",
    "cat": "wiki",
    "url": "wiki/spinach.html",
    "icon": "🧬",
    "desc": "CEA engineering guide for hydroponic spinach (Spinacia oleracea): root-zone DO chilling, Pythium suppression, oxalate reduction, and nitrate stee",
    "tags": "wiki spinach html spinach spinacia oleracea cea engineering guide for hydroponic spinach spinacia oleracea root-zone do chilling pythium suppression oxalate reduction and nitrate s"
  },
  {
    "title": "Plastidic Nitrate Reductase (NR) Activation vs Petiole Nitrate Storage under Spectral Light Steering",
    "cat": "wiki",
    "url": "wiki/statal_nitrate_accumulation_light_spectrum.html",
    "icon": "🧬",
    "desc": "Pre-harvest end-of-day blue LED activation of plastidic Nitrate Reductase (EC 1.7.1.1) reducing petiole nitrate 41.5% in hydroponic spinach.",
    "tags": "wiki statal nitrate accumulation light spectrum html plastidic nitrate reductase nr activation vs petiole nitrate storage under spectral light steering pre-harvest end-of-day blue "
  },
  {
    "title": "Strawberry (Fragaria × ananassa)",
    "cat": "wiki",
    "url": "wiki/strawberry.html",
    "icon": "🧬",
    "desc": "Greenhouse strawberry (Fragaria x ananassa) CEA engineering guide: chill-unit steering, Botrytis VPD control, and low-salinity fertigation.",
    "tags": "wiki strawberry html strawberry fragaria ananassa greenhouse strawberry fragaria x ananassa cea engineering guide chill-unit steering botrytis vpd control and low-salinity fertigat"
  },
  {
    "title": "Swiss Chard (Beta vulgaris subsp. vulgaris)",
    "cat": "wiki",
    "url": "wiki/swiss_chard.html",
    "icon": "🧬",
    "desc": "CEA engineering guide for hydroponic Swiss chard (Beta vulgaris): betalain pigment spectrum steering, halophytic Na+/K+ salinity control, and VPD",
    "tags": "wiki swiss chard html swiss chard beta vulgaris subsp vulgaris cea engineering guide for hydroponic swiss chard beta vulgaris betalain pigment spectrum steering halophytic na k sal"
  },
  {
    "title": "Tomato (Solanum lycopersicum)",
    "cat": "wiki",
    "url": "wiki/tomato.html",
    "icon": "🧬",
    "desc": "Precision CEA engineering guide for greenhouse tomato (Solanum lycopersicum): VPD psychrometrics, DIF crop steering, and EC/Brix fertigation.",
    "tags": "wiki tomato html tomato solanum lycopersicum precision cea engineering guide for greenhouse tomato solanum lycopersicum vpd psychrometrics dif crop steering and ec brix fertigation"
  },
  {
    "title": "Boundary Layer Resistance (rb) & Micro-Vectored Canopy Air Speed Steering in Vertical Farms",
    "cat": "wiki",
    "url": "wiki/transpiration_boundary_layer_dynamics.html",
    "icon": "🧬",
    "desc": "3D CFD modeling of leaf boundary layer resistance (rb) and micro-vectored vertical airflow (0.35 m/s) for tip-burn elimination in vertical farms.",
    "tags": "wiki transpiration boundary layer dynamics html boundary layer resistance rb micro-vectored canopy air speed steering in vertical farms 3d cfd modeling of leaf boundary layer resis"
  },
  {
    "title": "Micro-Climatological Telemetry Coupling with USDA Wholesale Agricultural Price Elasticity",
    "cat": "wiki",
    "url": "wiki/usda_elasticity_market_index_model.html",
    "icon": "🧬",
    "desc": "Econometric coupling of NASA POWER solar irradiance telemetry with USDA MARS wholesale price elasticity for 14-day CEA harvest steering.",
    "tags": "wiki usda elasticity market index model html micro-climatological telemetry coupling with usda wholesale agricultural price elasticity econometric coupling of nasa power solar irra"
  },
  {
    "title": "Aquaporin Expression Dynamics and Root Hydraulic Conductivity (Lpr) under Micro-Climate VPD Impulse",
    "cat": "wiki",
    "url": "wiki/vapour_pressure_deficit_aquaporin_gating.html",
    "icon": "🧬",
    "desc": "PIP1/PIP2 aquaporin phosphorylation gating and root hydraulic conductivity (Lpr) stabilization under high-pressure greenhouse fogging impulses.",
    "tags": "wiki vapour pressure deficit aquaporin gating html aquaporin expression dynamics and root hydraulic conductivity lpr under micro-climate vpd impulse pip1 pip2 aquaporin phosphoryla"
  }
];

  function getRootPrefix() {
    const p = window.location.pathname;
    if (p.includes('/articles/de/') || p.includes('/articles/ja/')) {
      return '../../';
    }
    if (p.includes('/tools/') || p.includes('/crops/') || p.includes('/climate/') || p.includes('/articles/') || p.includes('/smartfarm/') || p.includes('/wiki/') || p.includes('/parts/') || p.includes('/podcasts/') || p.includes('/benchmarks/')) {
      return '../';
    }
    return '';
  }

  function initPaletteModal() {
    if (document.getElementById('inwoo-command-palette-modal')) return;

    const modal = document.createElement('div');
    modal.id = 'inwoo-command-palette-modal';
    modal.className = 'inwoo-palette-overlay';
    modal.innerHTML = `
      <div class="inwoo-palette-box" role="dialog" aria-modal="true" aria-label="Inwoovation Spotlight Search">
        <div class="inwoo-palette-header">
          <span class="inwoo-palette-search-icon">🔍</span>
          <input type="text" id="inwoo-palette-input" placeholder="Search all 327 tools, simulators, wiki, crops, climate hubs & EN/DE/JA articles..." autocomplete="off" />
          <span class="inwoo-palette-esc-badge" onclick="window.InwooPalette.close()">ESC</span>
        </div>
        <div class="inwoo-palette-tabs">
          <button class="inwoo-pal-tab active" data-cat="all">✨ All (327)</button>
          <button class="inwoo-pal-tab" data-cat="tool">🛠️ Tools (43)</button>
          <button class="inwoo-pal-tab" data-cat="article">📚 Articles (150)</button>
          <button class="inwoo-pal-tab" data-cat="wiki">🧬 Wiki (44)</button>
          <button class="inwoo-pal-tab" data-cat="climate">🌍 Climate (41)</button>
          <button class="inwoo-pal-tab" data-cat="sim">🧪 Simulators (21)</button>
          <button class="inwoo-pal-tab" data-cat="crop">🌱 Crops (11)</button>
          <button class="inwoo-pal-tab" data-cat="part">⚙️ Benchmarks & Parts (8)</button>
        </div>
        <div class="inwoo-palette-results" id="inwoo-palette-results"></div>
        <div class="inwoo-palette-footer">
          <div class="inwoo-pal-shortcuts">
            <span><kbd>↑</kbd><kbd>↓</kbd> Navigate</span>
            <span><kbd>↵</kbd> Open</span>
            <span><kbd>Esc</kbd> Close</span>
          </div>
          <div style="color: #64748b; font-size: 0.75rem;">Inwoovation Universal Spotlight (327 Indexed Pages)</div>
        </div>
      </div>
    `;
    document.body.appendChild(modal);

    modal.querySelectorAll('.inwoo-pal-tab').forEach(tab => {
      tab.addEventListener('click', () => {
        modal.querySelectorAll('.inwoo-pal-tab').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        renderResults();
      });
    });

    const input = document.getElementById('inwoo-palette-input');
    input.addEventListener('input', renderResults);
    input.addEventListener('keydown', handleKeyNavigation);

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

    const terms = query ? query.split(/\s+/) : [];
    currentFilteredList = ECOSYSTEM_INDEX.filter(item => {
      const matchCat = (activeCat === 'all') || (item.cat === activeCat);
      if (!matchCat) return false;
      if (!terms.length) return true;
      const hay = (item.title + ' ' + item.desc + ' ' + item.tags).toLowerCase();
      return terms.every(t => hay.includes(t));
    }).slice(0, 80);

    selectedIndex = 0;

    if (currentFilteredList.length === 0) {
      container.innerHTML = `
        <div style="padding: 40px 20px; text-align: center; color: #94a3b8;">
          <div style="font-size: 2rem; margin-bottom: 8px;">🔍</div>
          <div style="font-weight: 600; color: #f8fafc;">No matching resources found</div>
          <div style="font-size: 0.85rem; margin-top: 4px;">Try searching for "VPD", "DIN 18599", "Tomato", "Westland", "MPC", "Deutsch", or "VenloCAD".</div>
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

  window.addEventListener('keydown', function(e) {
    if ((e.ctrlKey || e.metaKey) && (e.key === 'k' || e.key === 'K')) {
      e.preventDefault();
      window.InwooPalette.toggle();
    }
  });

  // === READER CONVENIENCE ENHANCEMENTS (Progress Bar, Quick-Jump TOC, Citation Copy, Floating Action Bar) ===
  function initReaderConvenienceUX() {
    if (!document.body) return;

    // 1. Top Reading Progress Bar + Floating Bottom-Right Action Pill
    if (!document.getElementById('inw-reading-progress-bar')) {
      const prog = document.createElement('div');
      prog.id = 'inw-reading-progress-bar';
      document.body.appendChild(prog);

      const fab = document.createElement('div');
      fab.id = 'inw-floating-fab';
      fab.innerHTML = `
        <button type="button" class="inw-fab-btn" onclick="window.InwooPalette.open()" title="Open Global Search (Ctrl+K)">🔍 <span>Ctrl+K</span></button>
        <button type="button" class="inw-fab-btn" onclick="window.scrollTo({top: 0, behavior: 'smooth'})" title="Scroll to Top">↑ <span>Top</span></button>
      `;
      document.body.appendChild(fab);

      window.addEventListener('scroll', function() {
        const scrollTop = window.scrollY || document.documentElement.scrollTop;
        const docHeight = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
        const pct = Math.min(100, Math.max(0, (scrollTop / docHeight) * 100));
        prog.style.width = pct.toFixed(1) + '%';
        if (scrollTop > 320) {
          fab.classList.add('visible');
        } else {
          fab.classList.remove('visible');
        }
      }, { passive: true });
    }

    // 2. Auto Quick-Jump TOC & Reader Utility Toolbar on Long-Form Content Pages
    const path = window.location.pathname;
    const isLongForm = (
      (path.includes('/articles/') || path.includes('/wiki/') || path.includes('/crops/') || path.includes('/climate/') || path.includes('/benchmarks/')) &&
      !path.endsWith('/index.html') && !path.endsWith('/')
    );
    if (!isLongForm || document.querySelector('.inw-reader-utility-wrap')) return;

    const container = document.querySelector('.article-container, article, main, .container');
    const h1 = container ? container.querySelector('h1') : document.querySelector('h1');
    if (!container || !h1) return;

    const headings = Array.from(container.querySelectorAll('h2')).filter(h => h.textContent && h.textContent.trim().length > 3);
    if (headings.length < 2) return;

    const tocItems = [];
    headings.forEach((h, idx) => {
      if (!h.id) {
        h.id = 'inw-sec-' + (idx + 1);
      }
      const cleanText = h.textContent.replace(/\s+/g, ' ').trim();
      tocItems.push(`<li><a href="#${h.id}">${idx + 1}. ${cleanText}</a></li>`);
    });

    const isDE = path.includes('/de/');
    const isJA = path.includes('/ja/');
    const tocLabel = isDE ? `📑 Schnellnavigation (${headings.length} Abschnitte)` : (isJA ? `📑 目次ジャンプ (${headings.length} セクション)` : `📑 Quick Jump TOC (${headings.length} Sections)`);
    const citeLabel = isDE ? '📋 Zitat / Link kopieren' : (isJA ? '📋 引用・URLをコピー' : '📋 Copy Citation');
    const printLabel = isDE ? '🖨️ Drucken / PDF' : (isJA ? '🖨️ 印刷 / PDF保存' : '🖨️ Print / PDF');
    const searchLabel = isDE ? '🔍 Suche (Ctrl+K)' : (isJA ? '🔍 検索 (Ctrl+K)' : '🔍 Search (Ctrl+K)');

    const utilWrap = document.createElement('div');
    utilWrap.className = 'inw-reader-utility-wrap';
    utilWrap.innerHTML = `
      <div class="inw-reader-toolbar">
        <div class="inw-reader-btn-group">
          <button type="button" class="inw-reader-btn" id="inw-toc-toggle-btn">${tocLabel} ▾</button>
          <button type="button" class="inw-reader-btn" id="inw-copy-cite-btn">${citeLabel}</button>
          <button type="button" class="inw-reader-btn" onclick="window.print()">${printLabel}</button>
        </div>
        <button type="button" class="inw-reader-btn" onclick="window.InwooPalette.open()" style="border-color: rgba(56, 189, 248, 0.4); color: #38bdf8;">${searchLabel}</button>
      </div>
      <nav class="inw-quick-toc-panel" id="inw-quick-toc-panel" aria-label="Table of Contents">
        <ul class="inw-quick-toc-grid">${tocItems.join('')}</ul>
      </nav>
    `;

    // Insert right after .inw-lang-switcher-bar or .article-meta or h1
    const langBar = container.querySelector('.inw-lang-switcher-bar');
    const metaBar = container.querySelector('.article-meta, .meta');
    const anchor = langBar || metaBar || h1;
    anchor.insertAdjacentElement('afterend', utilWrap);

    const toggleBtn = document.getElementById('inw-toc-toggle-btn');
    const tocPanel = document.getElementById('inw-quick-toc-panel');
    if (toggleBtn && tocPanel) {
      toggleBtn.addEventListener('click', function() {
        tocPanel.classList.toggle('open');
      });
    }

    const citeBtn = document.getElementById('inw-copy-cite-btn');
    if (citeBtn) {
      citeBtn.addEventListener('click', function() {
        const pageTitle = document.title.split('|')[0].trim();
        const canonicalEl = document.querySelector('link[rel="canonical"]');
        const url = canonicalEl ? canonicalEl.href : window.location.href;
        const citation = `Hwang, I. (2026). ${pageTitle}. Inwoovation Lab — Controlled Environment Agriculture Engineering. ${url}`;
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(citation).then(() => {
            const orig = citeBtn.textContent;
            citeBtn.textContent = '✅ Citation Copied!';
            citeBtn.style.color = '#10b981';
            setTimeout(() => { citeBtn.textContent = orig; citeBtn.style.color = ''; }, 2200);
          });
        }
      });
    }
  }

  function bootAll() {
    initPaletteModal();
    initReaderConvenienceUX();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bootAll);
  } else {
    bootAll();
  }
})();


/* GDPR & Google AdSense Consent Notice Engine (v1.0) */
(function() {
  function initGdprConsentBar() {
    try {
      if (navigator.webdriver || /HeadlessChrome|PhantomJS|Lighthouse/i.test(navigator.userAgent || '')) return;
      if (window.location.pathname.indexOf('/embed/') === 0 && !window.location.pathname.endsWith('/index.html') && !window.location.pathname.endsWith('/embed/')) return;
      var saved = localStorage.getItem('inw_gdpr_consent_v1');
      if (saved) return;
      if (document.getElementById('inw-gdpr-consent-bar')) return;

      var p = window.location.pathname || '';
      var isDE = p.indexOf('/de/') !== -1 || p.indexOf('meister.html') !== -1 || p.indexOf('/podcasts/') !== -1;
      var isJA = p.indexOf('/ja/') !== -1;

      var msg = isDE
        ? '🍪 <strong>Datenschutz &amp; Cookies (DSGVO):</strong> Inwoovation Lab verwendet Cookies (Google Analytics &amp; Google AdSense), um unsere kostenlosen Gartenbau-Simulatoren bereitzustellen und den Datenverkehr zu analysieren. Details finden Sie in unserer <a href="/privacy-policy.html">Datenschutzerklärung</a> und den <a href="/terms-of-service.html">Nutzungsbedingungen</a>.'
        : (isJA
          ? '🍪 <strong>プライバシーとCookieに関する通知:</strong> Inwoovation Labでは、無料の農業工学シミュレーターの提供およびトラフィック分析のためにCookie（Google AnalyticsおよびGoogle AdSense）を使用しています。詳細は<a href="/privacy-policy.html">プライバシーポリシー</a>および<a href="/terms-of-service.html">利用規約</a>をご覧ください。'
          : '🍪 <strong>Privacy &amp; Cookie Disclosure (GDPR / CCPA):</strong> Inwoovation Lab uses cookies (Google Analytics &amp; Google AdSense) to keep our 330+ engineering calculators 100% free and analyze aggregate traffic. See our <a href="/privacy-policy.html">Privacy Policy</a> and <a href="/terms-of-service.html">Terms of Service</a>.');

      var acceptTxt = isDE ? 'Alle akzeptieren' : (isJA ? 'すべて同意する' : 'Accept All');
      var essentialTxt = isDE ? 'Nur notwendige' : (isJA ? '必須のみ' : 'Essential Only');

      var bar = document.createElement('div');
      bar.id = 'inw-gdpr-consent-bar';
      bar.setAttribute('role', 'region');
      bar.setAttribute('aria-label', 'Cookie and Privacy Consent');
      bar.innerHTML = '<div style="flex:1; min-width:240px;">' + msg + '</div>' +
        '<div class="inw-gdpr-actions">' +
          '<button type="button" class="inw-gdpr-btn-essential" id="inw-gdpr-essential">' + essentialTxt + '</button>' +
          '<button type="button" class="inw-gdpr-btn-accept" id="inw-gdpr-accept">' + acceptTxt + '</button>' +
        '</div>';
      document.body.appendChild(bar);

      function setChoice(mode) {
        try { localStorage.setItem('inw_gdpr_consent_v1', mode); } catch (e) {}
        if (typeof window.gtag === 'function') {
          var status = (mode === 'granted') ? 'granted' : 'denied';
          window.gtag('consent', 'update', {
            'ad_storage': status,
            'analytics_storage': status,
            'ad_user_data': status,
            'ad_personalization': status
          });
        }
        if (bar && bar.parentNode) bar.parentNode.removeChild(bar);
      }

      var btnAcc = document.getElementById('inw-gdpr-accept');
      var btnEss = document.getElementById('inw-gdpr-essential');
      if (btnAcc) btnAcc.addEventListener('click', function() { setChoice('granted'); });
      if (btnEss) btnEss.addEventListener('click', function() { setChoice('essential'); });
    } catch (err) {}
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initGdprConsentBar);
  } else {
    initGdprConsentBar();
  }
})();
