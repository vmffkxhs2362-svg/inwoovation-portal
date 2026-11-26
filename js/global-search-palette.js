/**
 * Inwoovation Global Command Palette (Spotlight Search) & Reader Convenience Engine (v3.0)
 * Triggers on Ctrl+K / Cmd+K or clicking any search trigger button.
 * Dynamically indexes all 360 live pages across Tools, Simulators, Wiki, Crops, Climate Hubs, and Multilingual Articles (EN/DE/JA).
 * Also mounts:
 *  1) Top Reading Progress Bar (#inw-reading-progress-bar)
 *  2) Collapsible Quick-Jump Table of Contents (TOC) + 1-Click Citation Copy & PDF Print Toolbar
 *  3) Floating Bottom-Right Quick Action Bar (🔍 Ctrl+K + ↑ Top)
 */
(function() {
  // Consent choice persistence key (early default/restore runs in inline <head> prior to gtag('js'))
  const CONSENT_STORAGE_KEY = 'inw_gdpr_consent_v2';
  window.dataLayer = window.dataLayer || [];

  const ECOSYSTEM_INDEX = [
  {
    "title": "Complete CEA Engineering Directory &amp; Index",
    "cat": "part",
    "url": "directory.html",
    "icon": "⚙️",
    "desc": "Master HTML sitemap and engineering taxonomy indexing all 397 calculators, 192 global agricultural grants, EN/DE/JA monographs, crop guides, and climate hubs.",
    "tags": "directory html complete cea engineering directory amp index master html sitemap and engineering taxonomy indexing all 397 calculators 192 global agricultural grants en de ja monographs crop "
  },
  {
    "title": "CEA &amp; Greenhouse Engineering Articles",
    "cat": "article",
    "url": "guides.html",
    "icon": "📚",
    "desc": "78-volume (199 EN/DE/JA editions) open-access CEA engineering library covering VPD physics, DLI photobiology, fertigation, CHP heat, and smart grants.",
    "tags": "guides html cea amp greenhouse engineering articles 78 volume 199 en de ja editions open access cea engineering library covering vpd physics dli photobiology fertigation chp heat and smart g"
  },
  {
    "title": "Inwoovation Lab",
    "cat": "tool",
    "url": "index.html",
    "icon": "🛠️",
    "desc": "Inwoovation Lab: 42 free CEA biophysics calculators, VenloCAD 3D glasshouse CAD, 192 global agricultural grants across 8 countries, and 199 monographs.",
    "tags": "index html inwoovation lab inwoovation lab 42 free cea biophysics calculators venlocad 3d glasshouse cad 192 global agricultural grants across 8 countries and 199 monographs"
  },
  {
    "title": "Gärtnermeister &amp; KTBL Rechner",
    "cat": "tool",
    "url": "meister.html",
    "icon": "🇩🇪",
    "desc": "Gartenbau-Meister &amp; KTBL Rechner für Deutschland: DIN V 18599 Heizwärmebedarf, Deckungsbeitrag, ToBRFV-Desinfektion, 34 Förderprogramme &amp; Podcast.",
    "tags": "meister html gärtnermeister amp ktbl rechner gartenbau meister amp ktbl rechner für deutschland din v 18599 heizwärmebedarf deckungsbeitrag tobrfv desinfektion 34 förderprogramme amp podcast"
  },
  {
    "title": "OpenCEA Biophysics Quiz &amp; Certificate",
    "cat": "tool",
    "url": "quiz.html",
    "icon": "🛠️",
    "desc": "Test your greenhouse biophysics mastery across 10 engineering questions on VPD, DLI, DIN V 18599, and fertigation to earn a free digital certificate.",
    "tags": "quiz html opencea biophysics quiz amp certificate test your greenhouse biophysics mastery across 10 engineering questions on vpd dli din v 18599 and fertigation to earn a free digital certif"
  },
  {
    "title": "Open-Access AgTech Engineering Repository",
    "cat": "tool",
    "url": "store.html",
    "icon": "🛠️",
    "desc": "Free open-access AgTech vault: Python fertigation solvers, 192 global &amp; USDA grant playbooks, VenloCAD 3D tools, and 42 biophysical calculators.",
    "tags": "store html open access agtech engineering repository free open access agtech vault python fertigation solvers 192 global amp usda grant playbooks venlocad 3d tools and 42 biophysical calcula"
  },
  {
    "title": "Greenhouse Climate Troubleshooting",
    "cat": "tool",
    "url": "troubleshoot.html",
    "icon": "🛠️",
    "desc": "Instant greenhouse diagnostic wizard: pinpoint root causes of tipburn, blossom-end rot, condensation, and heat spikes with 3-step CEA action plans.",
    "tags": "troubleshoot html greenhouse climate troubleshooting instant greenhouse diagnostic wizard pinpoint root causes of tipburn blossom end rot condensation and heat spikes with 3 step cea action "
  },
  {
    "title": "Vapor Pressure Deficit (VPD) Thermodynamics in CEA",
    "cat": "article",
    "url": "articles/article-01-vpd-master-class.html",
    "icon": "📚",
    "desc": "Mastering VPD (kPa) computation over relative humidity (RH%) to eliminate crop stress, balance stomatal conductance, and drive transpirational xylem flow.",
    "tags": "articles article 01 vpd master class html vapor pressure deficit vpd thermodynamics in cea mastering vpd kpa computation over relative humidity rh to eliminate crop stress balance stomatal c"
  },
  {
    "title": "Daily Light Integral (DLI) &amp; Photonic Efficacy",
    "cat": "article",
    "url": "articles/article-02-dli-vertical-farming.html",
    "icon": "📚",
    "desc": "Calculated PPFD (µmol/m²/s) and DLI (mol/m²/day) formulations for indoor LED vertical farming to maximize dry biomass yield per kWh of electricity.",
    "tags": "articles article 02 dli vertical farming html daily light integral dli amp photonic efficacy calculated ppfd mol m s and dli mol m day formulations for indoor led vertical farming to maximiz"
  },
  {
    "title": "Greenhouse Bumblebee Protection &amp; Restricted-Entry",
    "cat": "article",
    "url": "articles/article-03-pollinator-safety-rei.html",
    "icon": "📚",
    "desc": "Biological pollinator stewardship in commercial greenhouses: protecting Bombus terrestris from pesticide residue toxicity, REI mathematical models.",
    "tags": "articles article 03 pollinator safety rei html greenhouse bumblebee protection amp restricted entry biological pollinator stewardship in commercial greenhouses protecting bombus terrestris f"
  },
  {
    "title": "Greenhouse Envelope Peak Heat Loss Coefficients",
    "cat": "article",
    "url": "articles/article-04-greenhouse-heating-loss.html",
    "icon": "📚",
    "desc": "Engineering greenhouse heating loads using Q = U·A·ΔT heat transfer dynamics, cover glazing U-values, wind infiltration friction, and multilayer.",
    "tags": "articles article 04 greenhouse heating loss html greenhouse envelope peak heat loss coefficients engineering greenhouse heating loads using q u a t heat transfer dynamics cover glazing u val"
  },
  {
    "title": "Hourly Penman-Monteith Evapotranspiration (ET0)",
    "cat": "article",
    "url": "articles/article-05-penman-monteith-transpiration.html",
    "icon": "📚",
    "desc": "Mathematical implementation of the FAO-56 Penman-Monteith equation for commercial greenhouse irrigation steering, canopy energy balance, and solar.",
    "tags": "articles article 05 penman monteith transpiration html hourly penman monteith evapotranspiration et0 mathematical implementation of the fao 56 penman monteith equation for commercial greenho"
  },
  {
    "title": "Molar Stoichiometry &amp; Sonneveld/Steiner Ion",
    "cat": "article",
    "url": "articles/article-06-hydroponic-nutrient-formulation.html",
    "icon": "📚",
    "desc": "Precision closed-loop hydroponic nutrient balancing: milliequivalent calculations, Steiner cation-anion stoichiometry, salt solubility products.",
    "tags": "articles article 06 hydroponic nutrient formulation html molar stoichiometry amp sonneveld steiner ion precision closed loop hydroponic nutrient balancing milliequivalent calculations steine"
  },
  {
    "title": "Photomorphogenesis &amp; PAR Spectral Quality",
    "cat": "article",
    "url": "articles/article-07-indoor-plant-lighting-spectrum.html",
    "icon": "📚",
    "desc": "Photobiological plant responses across McCree action spectra, phytochrome photoequilibria (Pfr/Pr), far-red Emerson enhancement, and spectral tailoring.",
    "tags": "articles article 07 indoor plant lighting spectrum html photomorphogenesis amp par spectral quality photobiological plant responses across mccree action spectra phytochrome photoequilibria p"
  },
  {
    "title": "Horticultural Physics &amp; Environmental Physiology",
    "cat": "article",
    "url": "articles/article-08-monstera-deliciosa-care-guide.html",
    "icon": "📚",
    "desc": "Commercial tropical foliage engineering: hydroponic cultivation of Monstera deliciosa, leaf marginal necrosis prevention via VPD steering, and automated.",
    "tags": "articles article 08 monstera deliciosa care guide html horticultural physics amp environmental physiology commercial tropical foliage engineering hydroponic cultivation of monstera deliciosa"
  },
  {
    "title": "Stomatal Conductance Dynamics &amp; Farquhar-von",
    "cat": "article",
    "url": "articles/article-09-stomata-conductance-photosynthesis.html",
    "icon": "📚",
    "desc": "Coupled Farquhar-von Caemmerer-Berry photosynthesis and Ball-Berry stomatal conductance models under elevated CO2 enrichment and light-saturated.",
    "tags": "articles article 09 stomata conductance photosynthesis html stomatal conductance dynamics amp farquhar von coupled farquhar von caemmerer berry photosynthesis and ball berry stomatal conduct"
  },
  {
    "title": "Vertical Farming HVAC Sizing",
    "cat": "article",
    "url": "articles/article-10-vertical-farm-hvac-design.html",
    "icon": "📚",
    "desc": "HVAC and psychrometric dehumidification engineering for commercial indoor vertical farms: calculating sensible vs latent cooling loads, airflow.",
    "tags": "articles article 10 vertical farm hvac design html vertical farming hvac sizing hvac and psychrometric dehumidification engineering for commercial indoor vertical farms calculating sensible "
  },
  {
    "title": "High-Wire Strawberry Greenhouse Microclimate",
    "cat": "article",
    "url": "articles/article-11-strawberry-greenhouse-climate.html",
    "icon": "📚",
    "desc": "Precision microclimate management for day-neutral and short-day greenhouse strawberries: chilling hour accumulation, flower bud initiation, and diurnal.",
    "tags": "articles article 11 strawberry greenhouse climate html high wire strawberry greenhouse microclimate precision microclimate management for day neutral and short day greenhouse strawberries ch"
  },
  {
    "title": "Xylem Calcium Partitioning &amp; Transpirational",
    "cat": "article",
    "url": "articles/article-12-tomato-blossom-end-rot-calcium.html",
    "icon": "📚",
    "desc": "Apoplastic calcium transport mechanics, xylem-to-phloem immobility, root hydraulic pressure, and nighttime VPD steering to prevent Blossom-End Rot.",
    "tags": "articles article 12 tomato blossom end rot calcium html xylem calcium partitioning amp transpirational apoplastic calcium transport mechanics xylem to phloem immobility root hydraulic pressu"
  },
  {
    "title": "Precision Agricultural Sensor Calibration",
    "cat": "article",
    "url": "articles/article-13-smartfarm-sensor-calibration.html",
    "icon": "📚",
    "desc": "Engineering calibration protocols for CEA instrumentation: NDIR dual-beam optical drift, two-point pH/EC Nernstian slope correction, and dielectric.",
    "tags": "articles article 13 smartfarm sensor calibration html precision agricultural sensor calibration engineering calibration protocols for cea instrumentation ndir dual beam optical drift two poi"
  },
  {
    "title": "Dual Horticultural Education &amp; Vocational",
    "cat": "article",
    "url": "articles/article-14-ausbildung-horticulture-germany.html",
    "icon": "📚",
    "desc": "Comprehensive structural guide to Germany&#x27;s dual vocational education system (Duale Ausbildung) in commercial production horticulture (Gartenbau).",
    "tags": "articles article 14 ausbildung horticulture germany html dual horticultural education amp vocational comprehensive structural guide to germany x27 s dual vocational education system duale au"
  },
  {
    "title": "Biophilic Architecture &amp; Indoor Environmental",
    "cat": "article",
    "url": "articles/article-15-plant-interior-biophilic-design.html",
    "icon": "📚",
    "desc": "Architectural integration of living vegetation in high-performance buildings: daylight factor modeling, sub-irrigation hydraulics, particulate matter.",
    "tags": "articles article 15 plant interior biophilic design html biophilic architecture amp indoor environmental architectural integration of living vegetation in high performance buildings daylight"
  },
  {
    "title": "German Master Grower (Gärtnermeister) Greenhouse",
    "cat": "article",
    "url": "articles/article-16-german-meister-greenhouse-climate.html",
    "icon": "📚",
    "desc": "Advanced European greenhouse climate steering: 24-hour temperature integration (RTI), pre-night temperature drops (DIP), and 3-way mixing valve heating.",
    "tags": "articles article 16 german meister greenhouse climate html german master grower gärtnermeister greenhouse advanced european greenhouse climate steering 24 hour temperature integration rti pr"
  },
  {
    "title": "Biophysical Soil Physics",
    "cat": "article",
    "url": "articles/article-17-indoor-plant-soil-aeration-porosity.html",
    "icon": "📚",
    "desc": "Engineering potting media physics: Total Porosity, Container Capacity (CC), and Air-Filled Porosity (AFP) to eliminate root hypoxia in containerized.",
    "tags": "articles article 17 indoor plant soil aeration porosity html biophysical soil physics engineering potting media physics total porosity container capacity cc and air filled porosity afp to el"
  },
  {
    "title": "Closed-Loop Hydroponic Drain Water Disinfection",
    "cat": "article",
    "url": "articles/article-18-recirculating-nutrient-sterilization.html",
    "icon": "📚",
    "desc": "Engineering recirculating hydroponic drain water disinfection: UV-C irradiance dosage (mJ/cm2), ozone oxidation redox potential (ORP), and automated climate.",
    "tags": "articles article 18 recirculating nutrient sterilization html closed loop hydroponic drain water disinfection engineering recirculating hydroponic drain water disinfection uv c irradiance do"
  },
  {
    "title": "Photon Use Efficiency (PUE) &amp; Electric Power",
    "cat": "article",
    "url": "articles/article-19-vertical-farm-biomass-conversion-efficiency.html",
    "icon": "📚",
    "desc": "Quantifying photon use efficiency (g/mol) and energy yield (g/kWh) in indoor plant factories with artificial lighting (PFAL) across leafy greens.",
    "tags": "articles article 19 vertical farm biomass conversion efficiency html photon use efficiency pue amp electric power quantifying photon use efficiency g mol and energy yield g kwh in indoor pla"
  },
  {
    "title": "Leaf Temperature Infrared Thermometry &amp; Crop Water",
    "cat": "article",
    "url": "articles/article-20-leaf-temperature-infrared-thermometry.html",
    "icon": "📚",
    "desc": "Physics of infrared canopy radiometry: Stefan-Boltzmann law, leaf-to-air temperature differential (ΔT), and Crop Water Stress Index (CWSI) for commercial.",
    "tags": "articles article 20 leaf temperature infrared thermometry html leaf temperature infrared thermometry amp crop water physics of infrared canopy radiometry stefan boltzmann law leaf to air tem"
  },
  {
    "title": "Chlorophyll a Fluorescence Kinetics (Fv/Fm &amp; OJIP)",
    "cat": "article",
    "url": "articles/article-21-chlorophyll-a-fluorescence-fvfm-stress.html",
    "icon": "📚",
    "desc": "Photosystem II maximum quantum yield (Fv/Fm), OJIP induction curves, and non-photochemical quenching (NPQ) for real-time non-destructive plant stress.",
    "tags": "articles article 21 chlorophyll a fluorescence fvfm stress html chlorophyll a fluorescence kinetics fv fm amp ojip photosystem ii maximum quantum yield fv fm ojip induction curves and non ph"
  },
  {
    "title": "HPS vs. LED Supplemental Lighting Physics",
    "cat": "article",
    "url": "articles/article-22-hps-vs-led-supplemental-lighting.html",
    "icon": "📚",
    "desc": "Comparative biophysics of High-Pressure Sodium (HPS) and LED supplemental fixtures: PAR photon efficacy (µmol/J), Far-Red Emerson enhancement, and automated.",
    "tags": "articles article 22 hps vs led supplemental lighting html hps vs led supplemental lighting physics comparative biophysics of high pressure sodium hps and led supplemental fixtures par photon"
  },
  {
    "title": "Closed-Loop DWC &amp; Micro-Dosing Automation",
    "cat": "article",
    "url": "articles/article-23-closed-loop-dwc-automation.html",
    "icon": "📚",
    "desc": "Engineering recirculating Deep Water Culture (DWC) systems: Henry&#x27;s Law dissolved oxygen (DO) dynamics, ion-selective electrode (ISE) feedback.",
    "tags": "articles article 23 closed loop dwc automation html closed loop dwc amp micro dosing automation engineering recirculating deep water culture dwc systems henry x27 s law dissolved oxygen do d"
  },
  {
    "title": "Optimizing Far-Red (730nm) &amp; Deep-Red (660nm) LED",
    "cat": "article",
    "url": "articles/article-24-far-red-deep-red-led-spectrum-optimization.html",
    "icon": "📚",
    "desc": "A comprehensive engineering masterclass on the Emerson Enhancement Effect, Photosystem I/II excitation balance, and Far-Red (730nm) spectrum.",
    "tags": "articles article 24 far red deep red led spectrum optimization html optimizing far red 730nm amp deep red 660nm led a comprehensive engineering masterclass on the emerson enhancement effect "
  },
  {
    "title": "Closed-Loop Nutrient Recirculation &amp; Nanobubble",
    "cat": "article",
    "url": "articles/article-25-closed-loop-hydroponic-nanobubble-oxygenation.html",
    "icon": "📚",
    "desc": "Engineering analysis of closed-loop hydroponic recirculation, rhizosphere dissolved oxygen (DO &gt; 8.5 mg/L), and Pythium root-rot suppression in commercial.",
    "tags": "articles article 25 closed loop hydroponic nanobubble oxygenation html closed loop nutrient recirculation amp nanobubble engineering analysis of closed loop hydroponic recirculation rhizosph"
  },
  {
    "title": "Greenhouse Heating Load Modeling &amp; Thermal Screen",
    "cat": "article",
    "url": "articles/article-26-greenhouse-heating-load-din-v-18599.html",
    "icon": "📚",
    "desc": "Comprehensive engineering analysis of peak heat transmission, thermal screen radiative resistance, and pipe rail hydraulics in commercial Venlo.",
    "tags": "articles article 26 greenhouse heating load din v 18599 html greenhouse heating load modeling amp thermal screen comprehensive engineering analysis of peak heat transmission thermal screen r"
  },
  {
    "title": "Predictive Crop Biomass Accumulation &amp; Light Use",
    "cat": "article",
    "url": "articles/article-27-crop-yield-biomass-light-use-efficiency.html",
    "icon": "📚",
    "desc": "Commercial greenhouse yield forecasting based on cumulative DLI, Light Use Efficiency (LUE = 2.8 - 3.4 g/mol), and Harvest Index (HI) modeling.",
    "tags": "articles article 27 crop yield biomass light use efficiency html predictive crop biomass accumulation amp light use commercial greenhouse yield forecasting based on cumulative dli light use "
  },
  {
    "title": "Greenhouse CO2 Enrichment Kinetics &amp; Economic ROI",
    "cat": "article",
    "url": "articles/article-28-greenhouse-co2-enrichment-economics.html",
    "icon": "📚",
    "desc": "Industrial analysis of pure liquid CO2 vs CHP flue gas dosing, ventilation exchange losses, and net economic ROI thresholds in commercial horticulture.",
    "tags": "articles article 28 greenhouse co2 enrichment economics html greenhouse co2 enrichment kinetics amp economic roi industrial analysis of pure liquid co2 vs chp flue gas dosing ventilation exc"
  },
  {
    "title": "Hourly Penman-Monteith Evapotranspiration Modeling",
    "cat": "article",
    "url": "articles/article-29-hourly-penman-monteith-evapotranspiration.html",
    "icon": "📚",
    "desc": "Engineering analysis of hourly crop evapotranspiration (ETc), stomatal resistance (rs), aerodynamic boundary layer resistance (ra), and precision.",
    "tags": "articles article 29 hourly penman monteith evapotranspiration html hourly penman monteith evapotranspiration modeling engineering analysis of hourly crop evapotranspiration etc stomatal resi"
  },
  {
    "title": "Rockwool Slab Hydrodynamics &amp; TDR Moisture Sensor",
    "cat": "article",
    "url": "articles/article-30-rockwool-slab-tdr-moisture-drain-ec.html",
    "icon": "📚",
    "desc": "Engineering analysis of volumetric water content (VWC %), overnight dry-down kinetics, and drainage EC balancing in commercial rockwool hydroponics.",
    "tags": "articles article 30 rockwool slab tdr moisture drain ec html rockwool slab hydrodynamics amp tdr moisture sensor engineering analysis of volumetric water content vwc overnight dry down kinet"
  },
  {
    "title": "High-Pressure (70 bar) Fogging Physics &amp; Sauter",
    "cat": "article",
    "url": "articles/article-31-high-pressure-fogging-droplet-physics.html",
    "icon": "📚",
    "desc": "Industrial engineering analysis of 70 bar high-pressure fogging, Sauter Mean Diameter (D32 &lt; 10µm), flash evaporative cooling, and VPD.",
    "tags": "articles article 31 high pressure fogging droplet physics html high pressure 70 bar fogging physics amp sauter industrial engineering analysis of 70 bar high pressure fogging sauter mean dia"
  },
  {
    "title": "Horticultural LED Fixture Thermal Management",
    "cat": "article",
    "url": "articles/article-32-horticultural-led-thermal-junction-temperature.html",
    "icon": "📚",
    "desc": "Engineering analysis of LED diode junction temperature (Tj), thermal resistance (Rth), spectral photon efficacy derating, and canopy convective heat.",
    "tags": "articles article 32 horticultural led thermal junction temperature html horticultural led fixture thermal management engineering analysis of led diode junction temperature tj thermal resista"
  },
  {
    "title": "Precision Crop Steering Dynamics",
    "cat": "article",
    "url": "articles/article-33-precision-crop-steering-dif-vpd-drydown.html",
    "icon": "📚",
    "desc": "Industrial crop steering masterclass: Balancing vegetative stem growth vs generative flowering using 24h DIF, diurnal VPD differentials, and slab.",
    "tags": "articles article 33 precision crop steering dif vpd drydown html precision crop steering dynamics industrial crop steering masterclass balancing vegetative stem growth vs generative flowerin"
  },
  {
    "title": "Closed-Loop UV-C Disinfection &amp; Pathogen",
    "cat": "article",
    "url": "articles/article-34-closed-loop-uvc-drain-disinfection.html",
    "icon": "📚",
    "desc": "Engineering analysis of UV-C radiation dose (250 mJ/cm2), UVT% transmission correction, and viral/fungal log-reduction in recirculating greenhouse.",
    "tags": "articles article 34 closed loop uvc drain disinfection html closed loop uv c disinfection amp pathogen engineering analysis of uv c radiation dose 250 mj cm2 uvt transmission correction and "
  },
  {
    "title": "Computational Fluid Dynamics (CFD) of Greenhouse",
    "cat": "article",
    "url": "articles/article-35-greenhouse-haf-fan-cfd-modeling.html",
    "icon": "📚",
    "desc": "Industrial CFD modeling of Horizontal Air Flow (HAF) fan spacing, jet velocity decay, Bernoulli air entrainment, and canopy boundary layer.",
    "tags": "articles article 35 greenhouse haf fan cfd modeling html computational fluid dynamics cfd of greenhouse industrial cfd modeling of horizontal air flow haf fan spacing jet velocity decay bern"
  },
  {
    "title": "Combined Heat &amp; Power (CHP) Flue Gas SCR",
    "cat": "article",
    "url": "articles/article-36-chp-flue-gas-scr-denitrification.html",
    "icon": "📚",
    "desc": "Industrial engineering analysis of gas engine Selective Catalytic Reduction (SCR), stoichiometric urea injection, NOx &lt; 5 ppm elimination, and automated.",
    "tags": "articles article 36 chp flue gas scr denitrification html combined heat amp power chp flue gas scr industrial engineering analysis of gas engine selective catalytic reduction scr stoichiomet"
  },
  {
    "title": "Hot Water Buffer Tank Stratification &amp; Thermal",
    "cat": "article",
    "url": "articles/article-37-thermal-buffer-tank-stratification-sizing.html",
    "icon": "📚",
    "desc": "Industrial engineering analysis of greenhouse hot-water thermal buffer tanks, thermocline Richardson number stability, and night peak heating discharge.",
    "tags": "articles article 37 thermal buffer tank stratification sizing html hot water buffer tank stratification amp thermal industrial engineering analysis of greenhouse hot water thermal buffer tan"
  },
  {
    "title": "Xylem Calcium Transport &amp; Blossom-End Rot (BER)",
    "cat": "article",
    "url": "articles/article-38-xylem-calcium-flux-blossom-end-rot.html",
    "icon": "📚",
    "desc": "Plant physiology analysis of xylem transpirational calcium flux, distal fruit cell membrane stability, and Blossom-End Rot (BER) prevention via VPD.",
    "tags": "articles article 38 xylem calcium flux blossom end rot html xylem calcium transport amp blossom end rot ber plant physiology analysis of xylem transpirational calcium flux distal fruit cell "
  },
  {
    "title": "Closed-Loop RO Desalination &amp; Sodium (Na+)",
    "cat": "article",
    "url": "articles/article-39-closed-loop-ro-desalination-energy.html",
    "icon": "📚",
    "desc": "Industrial engineering analysis of greenhouse reverse osmosis (RO) membrane flux (LMH), sodium (Na+) rejection (99.2%), energy recovery devices (PX).",
    "tags": "articles article 39 closed loop ro desalination energy html closed loop ro desalination amp sodium na industrial engineering analysis of greenhouse reverse osmosis ro membrane flux lmh sodiu"
  },
  {
    "title": "Canopy Light Extinction (Beer-Lambert) &amp; Diffuse",
    "cat": "article",
    "url": "articles/article-40-beer-lambert-canopy-light-extinction.html",
    "icon": "📚",
    "desc": "Industrial plant physiology analysis of Beer-Lambert light extinction, canopy extinction coefficient (k), Leaf Area Index (LAI), and diffuse glass.",
    "tags": "articles article 40 beer lambert canopy light extinction html canopy light extinction beer lambert amp diffuse industrial plant physiology analysis of beer lambert light extinction canopy ex"
  },
  {
    "title": "Biochemical Farquhar (FvCB) Photosynthesis &amp; CO2",
    "cat": "article",
    "url": "articles/article-41-farquhar-photosynthesis-fvcb-co2.html",
    "icon": "📚",
    "desc": "Industrial plant physiology analysis of the Farquhar-von Caemmerer-Berry (FvCB) model, Rubisco kinetics (Vcmax), electron transport (Jmax), and CO2.",
    "tags": "articles article 41 farquhar photosynthesis fvcb co2 html biochemical farquhar fvcb photosynthesis amp co2 industrial plant physiology analysis of the farquhar von caemmerer berry fvcb model"
  },
  {
    "title": "Substrate Matric Potential (Ψm), pF Curves &amp; van",
    "cat": "article",
    "url": "articles/article-42-substrate-matric-potential-pf-curves.html",
    "icon": "📚",
    "desc": "Industrial agricultural physics analysis of substrate matric suction potential (Psi_m), pF retention curves, van Genuchten hydraulic models, and plant.",
    "tags": "articles article 42 substrate matric potential pf curves html substrate matric potential m pf curves amp van industrial agricultural physics analysis of substrate matric suction potential ps"
  },
  {
    "title": "Greenhouse Structural Standards",
    "cat": "article",
    "url": "articles/article-43-greenhouse-structural-standards-en13031.html",
    "icon": "📚",
    "desc": "Civil engineering analysis of commercial Venlo greenhouse structural design according to EN 13031-1 and NEN 3859, wind suction (qw), snow drift.",
    "tags": "articles article 43 greenhouse structural standards en13031 html greenhouse structural standards civil engineering analysis of commercial venlo greenhouse structural design according to en 1"
  },
  {
    "title": "Meister-Deutsch: Open-Source Horticultural German",
    "cat": "article",
    "url": "articles/article-44-meister-deutsch-open-source-srs-engine.html",
    "icon": "📚",
    "desc": "Open-source Spaced Repetition System (SRS) for German Meisterprüfung horticulture, Web Speech API pronunciation synthesis, and botanical taxonomy.",
    "tags": "articles article 44 meister deutsch open source srs engine html meister deutsch open source horticultural german open source spaced repetition system srs for german meisterprüfung horticultu"
  },
  {
    "title": "AgriQuant: Open-Source Greenhouse Energy",
    "cat": "article",
    "url": "articles/article-45-agriquant-energy-commodity-quant-terminal.html",
    "icon": "📚",
    "desc": "Open-source financial engineering and energy analytics terminal for commercial greenhouses. Simulates Dutch TTF natural gas spark spreads, electricity.",
    "tags": "articles article 45 agriquant energy commodity quant terminal html agriquant open source greenhouse energy open source financial engineering and energy analytics terminal for commercial gree"
  },
  {
    "title": "OpenCEA: Open-Source Python Micro-Framework",
    "cat": "article",
    "url": "articles/article-46-opencea-python-micro-framework-release.html",
    "icon": "📚",
    "desc": "Release of OpenCEA, an open-source Python micro-framework for commercial greenhouse physics, crop photobiology, substrate hydrodynamics, and climate.",
    "tags": "articles article 46 opencea python micro framework release html opencea open source python micro framework release of opencea an open source python micro framework for commercial greenhouse "
  },
  {
    "title": "Computer Vision &amp; Multispectral Disease",
    "cat": "article",
    "url": "articles/article-47-computer-vision-crop-disease-diagnostics.html",
    "icon": "📚",
    "desc": "Computer vision edge algorithms for early detection of Botrytis cinerea, iron chlorosis, and foliar necrotic lesions in commercial high-wire greenhouses.",
    "tags": "articles article 47 computer vision crop disease diagnostics html computer vision amp multispectral disease computer vision edge algorithms for early detection of botrytis cinerea iron chlor"
  },
  {
    "title": "10-Year CapEx, OpEx &amp; IRR Investment Modeling",
    "cat": "article",
    "url": "articles/article-48-greenhouse-capex-opex-irr-npv-financial-model.html",
    "icon": "📚",
    "desc": "Bankable financial feasibility analysis for high-tech commercial Venlo glasshouse projects: Turnkey CapEx (180-320/m²), Discounted Cash Flows.",
    "tags": "articles article 48 greenhouse capex opex irr npv financial model html 10 year capex opex amp irr investment modeling bankable financial feasibility analysis for high tech commercial venlo g"
  },
  {
    "title": "Hydroponic Chemical Speciation, Debye-Hückel",
    "cat": "article",
    "url": "articles/article-49-hydroponic-chemical-speciation-debye-huckel.html",
    "icon": "📚",
    "desc": "Chemical thermodynamics of closed-loop hydroponic nutrient solutions: Debye-Hückel ionic strength, ion activity coefficients, and Saturation Index (SI).",
    "tags": "articles article 49 hydroponic chemical speciation debye huckel html hydroponic chemical speciation debye hückel chemical thermodynamics of closed loop hydroponic nutrient solutions debye hü"
  },
  {
    "title": "Smart Greenhouse Edge IoT &amp; MQTT Fleet Telemetry",
    "cat": "article",
    "url": "articles/article-50-smart-greenhouse-mqtt-edge-iot-fleet.html",
    "icon": "📚",
    "desc": "Industrial IoT architecture for commercial protected cropping: LoRaWAN, MQTT broker topologies, JSON schema telemetry, and edge anomaly detection.",
    "tags": "articles article 50 smart greenhouse mqtt edge iot fleet html smart greenhouse edge iot amp mqtt fleet telemetry industrial iot architecture for commercial protected cropping lorawan mqtt br"
  },
  {
    "title": "Autonomous Greenhouse AI",
    "cat": "article",
    "url": "articles/article-51-autonomous-greenhouse-ai-mpc-reinforcement-learning.html",
    "icon": "📚",
    "desc": "Autonomous climate computer optimization using Reinforcement Learning and Model Predictive Control (MPC).",
    "tags": "articles article 51 autonomous greenhouse ai mpc reinforcement learning html autonomous greenhouse ai autonomous climate computer optimization using reinforcement learning and model predicti"
  },
  {
    "title": "Aquifer Thermal Energy Storage (ATES) &amp; Industrial",
    "cat": "article",
    "url": "articles/article-52-aquifer-thermal-energy-storage-ates-heat-pump.html",
    "icon": "📚",
    "desc": "Thermodynamic modeling of Aquifer Thermal Energy Storage (ATES / WKO) doublet systems, seasonal heat recovery efficiency, and high-temperature.",
    "tags": "articles article 52 aquifer thermal energy storage ates heat pump html aquifer thermal energy storage ates amp industrial thermodynamic modeling of aquifer thermal energy storage ates wko do"
  },
  {
    "title": "Biomass CHP Flue Gas SCR Cleaning &amp; Biogenic CO2",
    "cat": "article",
    "url": "articles/article-53-biomass-chp-scr-co2-recovery-horticulture.html",
    "icon": "📚",
    "desc": "Thermodynamic modeling of biomass CHP flue gas SCR DeNOx, Pt/Pd ethylene oxidation catalysis, and biogenic CO2 enrichment in commercial Venlo glasshouses.",
    "tags": "articles article 53 biomass chp scr co2 recovery horticulture html biomass chp flue gas scr cleaning amp biogenic co2 thermodynamic modeling of biomass chp flue gas scr denox pt pd ethylene "
  },
  {
    "title": "AI-Driven Model Predictive Control (MPC)",
    "cat": "article",
    "url": "articles/article-54-ai-model-predictive-control-mpc-venlo-greenhouse.html",
    "icon": "📚",
    "desc": "Engineering mathematical formulation of Model Predictive Control (MPC), transient thermodynamic microclimate modeling, VPD condensation control, and EPEX.",
    "tags": "articles article 54 ai model predictive control mpc venlo greenhouse html ai driven model predictive control mpc engineering mathematical formulation of model predictive control mpc transien"
  },
  {
    "title": "Nutrient Uptake Concentration Factor (UCF)",
    "cat": "article",
    "url": "articles/article-55-nutrient-uptake-concentration-factor-recirculating-hydroponics.html",
    "icon": "📚",
    "desc": "Engineering mass balance formulation of nutrient uptake concentration factors (UCF), ion accumulation kinetics, sodium salinity limits, and optimal.",
    "tags": "articles article 55 nutrient uptake concentration factor recirculating hydroponics html nutrient uptake concentration factor ucf engineering mass balance formulation of nutrient uptake conce"
  },
  {
    "title": "Far-Red Photobiology (ePAR 400–750 nm)",
    "cat": "article",
    "url": "articles/article-56-far-red-photobiology-epar-phytochrome-photostationary-state.html",
    "icon": "📚",
    "desc": "Engineering biophysics of far-red photon efficacy, ePAR extended photosynthetic range (400-750 nm), phytochrome photostationary state (PSS), and automated.",
    "tags": "articles article 56 far red photobiology epar phytochrome photostationary state html far red photobiology epar 400 750 nm engineering biophysics of far red photon efficacy epar extended phot"
  },
  {
    "title": "The 8% Out-of-Pocket Playbook",
    "cat": "article",
    "url": "articles/article-57-california-cea-greenhouse-electrification-rebate-grant-stacking.html",
    "icon": "📚",
    "desc": "Engineering and grant stacking playbook for California commercial greenhouses, nurseries, and vertical farms to achieve up to 92% non-dilutive capital.",
    "tags": "articles article 57 california cea greenhouse electrification rebate grant stacking html the 8 out of pocket playbook engineering and grant stacking playbook for california commercial greenh"
  },
  {
    "title": "Dynamic CO2 Enrichment Kinetics &amp; RuBisCO",
    "cat": "article",
    "url": "articles/article-58-dynamic-co2-enrichment-kinetics-rubisco-carboxylation-venlo.html",
    "icon": "📚",
    "desc": "Engineering biophysics and microeconomic modeling of dynamic CO2 enrichment, Farquhar-FvCB RuBisCO carboxylation kinetics, ventilation loss, and CHP dosing.",
    "tags": "articles article 58 dynamic co2 enrichment kinetics rubisco carboxylation venlo html dynamic co2 enrichment kinetics amp rubisco engineering biophysics and microeconomic modeling of dynamic "
  },
  {
    "title": "EPEX Spot Negative Day-Ahead Arbitrage, Hybrid",
    "cat": "article",
    "url": "articles/article-59-epex-spot-negative-pricing-bess-power-to-heat-greenhouse.html",
    "icon": "📚",
    "desc": "Engineering thermodynamics and quantitative energy arbitrage: electrode boilers, heat pump integration, atmospheric thermocline buffer tanks, and BESS.",
    "tags": "articles article 59 epex spot negative pricing bess power to heat greenhouse html epex spot negative day ahead arbitrage hybrid engineering thermodynamics and quantitative energy arbitrage e"
  },
  {
    "title": "Real-Time Ion-Selective Electrode (ISE) Arrays",
    "cat": "article",
    "url": "articles/article-60-potentiometric-ion-selective-electrode-ise-closed-loop-hydroponics.html",
    "icon": "📚",
    "desc": "Engineering principles of real-time multi-ion sensing (NO3-, K+, Ca2+, Mg2+, H2PO4-), Nicolsky-Eisenman interference correction, Davies activity.",
    "tags": "articles article 60 potentiometric ion selective electrode ise closed loop hydroponics html real time ion selective electrode ise arrays engineering principles of real time multi ion sensing"
  },
  {
    "title": "Dynamic Thermal Screen Gap Control, Evaporative",
    "cat": "article",
    "url": "articles/article-61-thermal-screen-gap-transpiration-latent-heat-greenhouse-energy.html",
    "icon": "📚",
    "desc": "Thermodynamic modeling of thermal screen gaps, Rayleigh-Bénard cold downdraft convection, crop latent heat transpiration, and active psychrometric.",
    "tags": "articles article 61 thermal screen gap transpiration latent heat greenhouse energy html dynamic thermal screen gap control evaporative thermodynamic modeling of thermal screen gaps rayleigh "
  },
  {
    "title": "2026-2027 US 50-State Agricultural Grant &amp; Subsidy",
    "cat": "article",
    "url": "articles/article-62-us-50-state-agricultural-grant-playbook.html",
    "icon": "📚",
    "desc": "Comprehensive 50-state commercial agricultural subsidy and grant playbook. How US farmers, CEA greenhouse operators, and agribusinesses secure up to 90%.",
    "tags": "articles article 62 us 50 state agricultural grant playbook html 2026 2027 us 50 state agricultural grant amp subsidy comprehensive 50 state commercial agricultural subsidy and grant playboo"
  },
  {
    "title": "Precision Irrigation &amp; Water Grants in Florida",
    "cat": "article",
    "url": "articles/article-63-florida-texas-agricultural-water-irrigation-grants.html",
    "icon": "📚",
    "desc": "Technical guide for Florida and Texas commercial agricultural producers to secure up to 87.5% cost-share for precision micro-irrigation, subsurface.",
    "tags": "articles article 63 florida texas agricultural water irrigation grants html precision irrigation amp water grants in florida technical guide for florida and texas commercial agricultural pro"
  },
  {
    "title": "Midwest &amp; Corn Belt Soil Health Grants",
    "cat": "article",
    "url": "articles/article-64-midwest-corn-belt-water-quality-soil-health-subsidies.html",
    "icon": "📚",
    "desc": "Technical guide for Midwest producers to access 75% to 100% grant funding for NRCS CPS 605 woodchip nitrate bioreactors, saturated buffers, and manure.",
    "tags": "articles article 64 midwest corn belt water quality soil health subsidies html midwest amp corn belt soil health grants technical guide for midwest producers to access 75 to 100 grant fundin"
  },
  {
    "title": "Greenhouse Energy Efficiency &amp; Thermal Screen",
    "cat": "article",
    "url": "articles/article-65-pnw-northeast-cea-greenhouse-energy-grants.html",
    "icon": "📚",
    "desc": "Technical guide for commercial greenhouse and CEA nursery growers in Oregon, Washington, New York, and Massachusetts to capture up to 85% grant funding.",
    "tags": "articles article 65 pnw northeast cea greenhouse energy grants html greenhouse energy efficiency amp thermal screen technical guide for commercial greenhouse and cea nursery growers in orego"
  },
  {
    "title": "California SWEEP vs. Texas TWDB Agricultural Water",
    "cat": "article",
    "url": "articles/article-66-california-sweep-vs-texas-twdb-agricultural-water-grants.html",
    "icon": "📚",
    "desc": "Technical comparison of California CDFA SWEEP ($200,000 cap) and Texas TWDB Agricultural Water Conservation Grants ($500,000 cap). Detailed engineering.",
    "tags": "articles article 66 california sweep vs texas twdb agricultural water grants html california sweep vs texas twdb agricultural water technical comparison of california cdfa sweep 200 000 cap "
  },
  {
    "title": "Deep Geothermal Heating &amp; Industrial Heat Pumps",
    "cat": "article",
    "url": "articles/article-67-geothermal-district-heating-industrial-heat-pumps-greenhouse.html",
    "icon": "📚",
    "desc": "Technical engineering guide to deep geothermal doublets, industrial heat pumps (R717/R1233zd(E)), VDI 4640 / DIN EN 13031 standards, root-zone.",
    "tags": "articles article 67 geothermal district heating industrial heat pumps greenhouse html deep geothermal heating amp industrial heat pumps technical engineering guide to deep geothermal doublet"
  },
  {
    "title": "Direct Air Capture (DAC) &amp; Solid-Amine CO₂",
    "cat": "article",
    "url": "articles/article-68-direct-air-capture-solid-amine-co2-greenhouse-heat-pumps.html",
    "icon": "📚",
    "desc": "Technical guide to solid-amine TVSA Direct Air Capture (DAC) integrated with heat pump low-grade thermal waste heat (65°C–80°C) for fossil-free Venlo.",
    "tags": "articles article 68 direct air capture solid amine co2 greenhouse heat pumps html direct air capture dac amp solid amine co technical guide to solid amine tvsa direct air capture dac integra"
  },
  {
    "title": "Biomass-Fired CHP District Energy Integration",
    "cat": "article",
    "url": "articles/article-69-biomass-chp-flue-gas-scr-district-heating-greenhouse.html",
    "icon": "📚",
    "desc": "Technical whitepaper on biomass-fired combined heat and power (CHP) in high-wire Venlo greenhouses: fluidized bed combustion, catalytic SCR DeNOx.",
    "tags": "articles article 69 biomass chp flue gas scr district heating greenhouse html biomass fired chp district energy integration technical whitepaper on biomass fired combined heat and power chp "
  },
  {
    "title": "Nanobubble Oxy-Fertigation &amp; Cavitation Physics",
    "cat": "article",
    "url": "articles/article-70-nanobubble-dissolved-oxygen-pythium-suppression-rockwool.html",
    "icon": "📚",
    "desc": "Technical whitepaper on nanobubble oxy-fertigation in high-wire Venlo greenhouses: Young-Laplace internal bubble pressure, zeta potential stability.",
    "tags": "articles article 70 nanobubble dissolved oxygen pythium suppression rockwool html nanobubble oxy fertigation amp cavitation physics technical whitepaper on nanobubble oxy fertigation in high"
  },
  {
    "title": "Horizontal Air Flow (HAF) Dynamics &amp; Boundary",
    "cat": "article",
    "url": "articles/article-71-haf-fan-microclimate-boundary-layer-dynamics.html",
    "icon": "📚",
    "desc": "Engineering monograph on Venlo greenhouse Horizontal Air Flow (HAF): boundary layer resistance ra, Sherwood mass transfer, fan sizing &amp; heat pump.",
    "tags": "articles article 71 haf fan microclimate boundary layer dynamics html horizontal air flow haf dynamics amp boundary engineering monograph on venlo greenhouse horizontal air flow haf boundary"
  },
  {
    "title": "Thermodynamic Optimization of Semi-Closed Venlo",
    "cat": "article",
    "url": "articles/article-72-semi-closed-greenhouse-mollier-psychrometrics-latent-heat.html",
    "icon": "📚",
    "desc": "Technical engineering monograph on semi-closed Venlo greenhouse thermodynamics: positive-pressure air distribution ducts, Mollier h-x psychrometric latent.",
    "tags": "articles article 72 semi closed greenhouse mollier psychrometrics latent heat html thermodynamic optimization of semi closed venlo technical engineering monograph on semi closed venlo greenh"
  },
  {
    "title": "Closed-Loop Hydroponic Drainage Recirculation",
    "cat": "article",
    "url": "articles/article-73-closed-loop-nutrient-recirculation-davies-ion-balance.html",
    "icon": "📚",
    "desc": "Technical engineering monograph on closed-loop hydroponic drainage recirculation: Davies ionic activity speciation, multi-cycle sodium and chloride.",
    "tags": "articles article 73 closed loop nutrient recirculation davies ion balance html closed loop hydroponic drainage recirculation technical engineering monograph on closed loop hydroponic drainag"
  },
  {
    "title": "Semi-Closed Greenhouse Corridor Air Treatment",
    "cat": "article",
    "url": "articles/article-74-semi-closed-greenhouse-atu-mollier-venlocad-integration.html",
    "icon": "📚",
    "desc": "Technical engineering monograph on semi-closed greenhouse corridor Air Treatment Units (ATU): positive-pressure insect exclusion (+20~25 Pa), Mollier.",
    "tags": "articles article 74 semi closed greenhouse atu mollier venlocad integration html semi closed greenhouse corridor air treatment technical engineering monograph on semi closed greenhouse corri"
  },
  {
    "title": "Aquifer Thermal Energy Storage (ATES) (Vol. 75)",
    "cat": "article",
    "url": "articles/article-75-ates-aquifer-thermal-energy-storage-heat-pumps-greenhouse.html",
    "icon": "📚",
    "desc": "Technical engineering monograph on Aquifer Thermal Energy Storage (ATES) and industrial heat pump integration in commercial CEA greenhouses.",
    "tags": "articles article 75 ates aquifer thermal energy storage heat pumps greenhouse html aquifer thermal energy storage ates vol 75 technical engineering monograph on aquifer thermal energy storag"
  },
  {
    "title": "High-Tech Venlo Greenhouse Climate Engineering",
    "cat": "article",
    "url": "articles/article-76-knoblauchsland-greenhouse-climate-vpd-biocontrol-oecd.html",
    "icon": "📚",
    "desc": "Technical engineering monograph on modern CEA greenhouse management in Nuremberg Knoblauchsland: double-AR diffuse glass (96.2% transmission, 25% haze).",
    "tags": "articles article 76 knoblauchsland greenhouse climate vpd biocontrol oecd html high tech venlo greenhouse climate engineering technical engineering monograph on modern cea greenhouse managem"
  },
  {
    "title": "High-Tech Greenhouse Postharvest Intralogistics",
    "cat": "article",
    "url": "articles/article-77-greenhouse-postharvest-intralogistics-cold-chain-quality.html",
    "icon": "📚",
    "desc": "Technical monograph on modern CEA postharvest engineering: induction-guided AGV/FTS harvest fleets, Biot and Newton cooling kinetics in forced-air precooling.",
    "tags": "articles article 77 greenhouse postharvest intralogistics cold chain quality html high tech greenhouse postharvest intralogistics technical monograph on modern cea postharvest engineering in"
  },
  {
    "title": "EU Commercial Greenhouse Energy Auditing",
    "cat": "article",
    "url": "articles/article-78-eu-greenhouse-energy-audit-din-18599-ble-grant-hofnachfolge.html",
    "icon": "📚",
    "desc": "Technical engineering and agri-finance monograph on EU commercial greenhouse energy auditing (DIN V 18599 / EN 13031-1), German Federal BLE 40%.",
    "tags": "articles article 78 eu greenhouse energy audit din 18599 ble grant hofnachfolge html eu commercial greenhouse energy auditing technical engineering and agri finance monograph on eu commercia"
  },
  {
    "title": "CEA &amp; Greenhouse Engineering Articles Library",
    "cat": "article",
    "url": "articles/index.html",
    "icon": "📚",
    "desc": "Multilingual library of 197 horticultural engineering articles on VPD psychrometrics, DIN V 18599 heating loads, FvCB CO2 kinetics, and MPC control.",
    "tags": "articles index html cea amp greenhouse engineering articles library multilingual library of 197 horticultural engineering articles on vpd psychrometrics din v 18599 heating loads fvcb co2 ki"
  },
  {
    "title": "VPD-Meisterklasse im Gewächshaus",
    "cat": "article",
    "url": "articles/de/article-01-vpd-meisterklasse.html",
    "icon": "🇩🇪",
    "desc": "Physikalische Berechnung des Dampfdruckdefizits (VPD), Blatt-zu-Luft-Transpirationsdynamik und Vermeidung von Blütenendfäule im modernen Unterglasgartenbau.",
    "tags": "articles de article 01 vpd meisterklasse html vpd meisterklasse im gewächshaus physikalische berechnung des dampfdruckdefizits vpd blatt zu luft transpirationsdynamik und vermeidung von blüt"
  },
  {
    "title": "Tägliches Lichtintegral (DLI) &amp; LED-Belichtung",
    "cat": "article",
    "url": "articles/de/article-02-dli-tageslichtintegral-vertikale-landwirtschaft-led-roi.html",
    "icon": "🇩🇪",
    "desc": "Praxisleitfaden und Berechnung für das tägliche Lichtintegral (DLI in mol/m²/d) aus PPFD (µmol/m²/s), McCree-Aktionsspektrum, Far-Red-Steuerung.",
    "tags": "articles de article 02 dli tageslichtintegral vertikale landwirtschaft led roi html tägliches lichtintegral dli amp led belichtung praxisleitfaden und berechnung für das tägliche lichtintegr"
  },
  {
    "title": "Hummelbestäubung (Bombus terrestris)",
    "cat": "article",
    "url": "articles/de/article-03-hummelbestaeubung-nuetzlinge-wartezeit-pflanzenschutz-gewaechshaus.html",
    "icon": "🇩🇪",
    "desc": "Leitfaden für den integrierten Pflanzenschutz (IPM) im Gewächshaus: Hummelbestäubung (Bombus terrestris), Mikroklima-Grenzen, Bienenschutzklassen B1–B4.",
    "tags": "articles de article 03 hummelbestaeubung nuetzlinge wartezeit pflanzenschutz gewaechshaus html hummelbestäubung bombus terrestris leitfaden für den integrierten pflanzenschutz ipm im gewächs"
  },
  {
    "title": "Wärmedurchgangskoeffizienten (U'-Werte), Kittlose",
    "cat": "article",
    "url": "articles/de/article-04-gewaechshaus-waermeverlust-u-wert-energieschirme.html",
    "icon": "🇩🇪",
    "desc": "Bauphysikalische Berechnung von Spitzenheizlasten (Q = U&#x27;·A·ΔT), kittloser Verglasung, Kamineffekt, Mehrlagenschirmen (Luxous 1147 FR).",
    "tags": "articles de article 04 gewaechshaus waermeverlust u wert energieschirme html wärmedurchgangskoeffizienten u werte kittlose bauphysikalische berechnung von spitzenheizlasten q u x27 a t kittl"
  },
  {
    "title": "Stündliche Penman-Monteith-Evapotranspiration",
    "cat": "article",
    "url": "articles/de/article-05-penman-monteith-transpiration-automatisierung-ram-priva.html",
    "icon": "🇩🇪",
    "desc": "Biophysikalische Modellierung der FAO-56 Penman-Monteith-Transpiration (ET₀), Strahlungssummen-Tropfbewässerung und dezentrale Klimacomputer-Fernsteuerung.",
    "tags": "articles de article 05 penman monteith transpiration automatisierung ram priva html stündliche penman monteith evapotranspiration biophysikalische modellierung der fao 56 penman monteith tra"
  },
  {
    "title": "Molare Stöchiometrie, Sonneveld/Steiner-Ionenbilanz",
    "cat": "article",
    "url": "articles/de/article-06-naehrloesungsberechnung-stammbehaelter-ab-ec-duengung.html",
    "icon": "🇩🇪",
    "desc": "Molare Nährlösungsberechnung (mmol/L &amp; meq/L) nach Sonneveld und Steiner, Kationen-Anionen-Äquivalenz, A/B-Stammlösungsbehälter (Gipsfällungsschutz).",
    "tags": "articles de article 06 naehrloesungsberechnung stammbehaelter ab ec duengung html molare stöchiometrie sonneveld steiner ionenbilanz molare nährlösungsberechnung mmol l amp meq l nach sonnev"
  },
  {
    "title": "Photomorphogenese, PAR/ePAR-Spektralqualität",
    "cat": "article",
    "url": "articles/de/article-07-belichtungsspektrum-par-epar-photomorphogenese-led-gartenbau.html",
    "icon": "🇩🇪",
    "desc": "Photobiologische Steuerung im Unterglasgartenbau und Vertical Farming nach DIN 5031-10: McCree-Quantenspektrum, Phytochrom-Photogleichgewicht.",
    "tags": "articles de article 07 belichtungsspektrum par epar photomorphogenese led gartenbau html photomorphogenese par epar spektralqualität photobiologische steuerung im unterglasgartenbau und vert"
  },
  {
    "title": "Vol. 08: Monstera deliciosa im Erwerbsgartenbau",
    "cat": "article",
    "url": "articles/de/article-08-monstera-deliciosa-kulturfuehrung-epiphyten-substrat-vpd.html",
    "icon": "🇩🇪",
    "desc": "Ingenieur-Monographie zur Kulturführung von Monstera deliciosa (Araceae): Hemiepiphytische Wurzelphysiologie, luftführende Substratporosität (ε_a ≥ 25 %).",
    "tags": "articles de article 08 monstera deliciosa kulturfuehrung epiphyten substrat vpd html vol 08 monstera deliciosa im erwerbsgartenbau ingenieur monographie zur kulturführung von monstera delici"
  },
  {
    "title": "Stomatäre Leitfähigkeit (Ball-Berry)",
    "cat": "article",
    "url": "articles/de/article-09-stomata-leitfaehigkeit-co2-assimilation-gaswechsel-kinetik.html",
    "icon": "🇩🇪",
    "desc": "Pflanzenbiophysikalische Modellierung der stomatären Leitfähigkeit (gs) nach Ball-Berry-Leuning, Farquhar-von-Caemmerer-Berry (FvCB) A-Ci-Assimilationskurven.",
    "tags": "articles de article 09 stomata leitfaehigkeit co2 assimilation gaswechsel kinetik html stomatäre leitfähigkeit ball berry pflanzenbiophysikalische modellierung der stomatären leitfähigkeit g"
  },
  {
    "title": "HLK-Dimensionierung und psychrometrische",
    "cat": "article",
    "url": "articles/de/article-10-vertikale-landwirtschaft-hlk-entfeuchtung-psychrometrie.html",
    "icon": "🇩🇪",
    "desc": "Ingenieurleitfaden (DE Vol. 10) zur HLK-Auslegung für kommerzielle Indoor Vertical Farms: Berechnung sensibler und latenter Kühllasten (SHR).",
    "tags": "articles de article 10 vertikale landwirtschaft hlk entfeuchtung psychrometrie html hlk dimensionierung und psychrometrische ingenieurleitfaden de vol 10 zur hlk auslegung für kommerzielle i"
  },
  {
    "title": "Unterglas-Erdbeeranbau auf Stellagen",
    "cat": "article",
    "url": "articles/de/article-11-erdbeeranbau-unterglas-blueteninduktion-dif-klimafuehrung.html",
    "icon": "🇩🇪",
    "desc": "Ingenieurleitfaden (DE Vol. 11) für den kommerziellen Erdbeeranbau im Venlo-Gewächshaus: Kurztag-Blüteninduktion, Kältesummen, Stickstoff-Restriktion.",
    "tags": "articles de article 11 erdbeeranbau unterglas blueteninduktion dif klimafuehrung html unterglas erdbeeranbau auf stellagen ingenieurleitfaden de vol 11 für den kommerziellen erdbeeranbau im "
  },
  {
    "title": "Blütenendfäule (BER) bei Gewächshaustomaten",
    "cat": "article",
    "url": "articles/de/article-12-tomate-bluetenendfaeule-kalziumtransport-xylem-vpd.html",
    "icon": "🇩🇪",
    "desc": "Ingenieurleitfaden (DE Vol. 12) zur Vermeidung der Blütenendfäule (Blossom-End Rot, BER) im Tomaten- und Paprikaanbau unter Glas: Apoplastische.",
    "tags": "articles de article 12 tomate bluetenendfaeule kalziumtransport xylem vpd html blütenendfäule ber bei gewächshaustomaten ingenieurleitfaden de vol 12 zur vermeidung der blütenendfäule blosso"
  },
  {
    "title": "Präzisions-Sensorkalibrierung im Smart-Greenhouse",
    "cat": "article",
    "url": "articles/de/article-13-sensorkalibrierung-messunsicherheit-pt100-ndir-fd-smartfarm.html",
    "icon": "🇩🇪",
    "desc": "Ingenieurleitfaden zur Sensorkalibrierung im Unterglasgartenbau: Zweipunkt-Kalibrierung nach der Nernst-Gleichung (pH 7,00/4,01), Temperaturkompensation.",
    "tags": "articles de article 13 sensorkalibrierung messunsicherheit pt100 ndir fd smartfarm html präzisions sensorkalibrierung im smart greenhouse ingenieurleitfaden zur sensorkalibrierung im untergl"
  },
  {
    "title": "Vol. 14: Duale Gartenbau-Ausbildung",
    "cat": "article",
    "url": "articles/de/article-14-duale-ausbildung-gaertnermeister-karriere-gehalt-deutschland.html",
    "icon": "🇩🇪",
    "desc": "Systemanalyse der dualen Gartenbau-Ausbildung nach BBiG (70 % Betrieb, 30 % Berufsschule), dreiteilige Meisterprüfung nach § 2 GartMstrV inkl.",
    "tags": "articles de article 14 duale ausbildung gaertnermeister karriere gehalt deutschland html vol 14 duale gartenbau ausbildung systemanalyse der dualen gartenbau ausbildung nach bbig 70 betrieb "
  },
  {
    "title": "Vol. 15: Innenraumbegrünung &amp; Biophiles Design",
    "cat": "article",
    "url": "articles/de/article-15-innenraumbegruenung-biophiles-design-lichtkompensationspunkt-voc.html",
    "icon": "🇩🇪",
    "desc": "Ingenieur-Monographie zur professionellen Innenraumbegrünung nach FLL-Richtlinien: Lichtkompensationspunkt (LCP), spektrale Lux-zu-PPFD-Umrechnung.",
    "tags": "articles de article 15 innenraumbegruenung biophiles design lichtkompensationspunkt voc html vol 15 innenraumbegrünung amp biophiles design ingenieur monographie zur professionellen innenrau"
  },
  {
    "title": "Vol. 16: Gärtnermeister-Klimasteuerung",
    "cat": "article",
    "url": "articles/de/article-16-gaertnermeister-gewaechshaus-klimasteuerung-taupunkt-heizrohr.html",
    "icon": "🇩🇪",
    "desc": "Ingenieur-Monographie zur deutschen Gärtnermeister-Klimasteuerung nach KTBL und DIN EN 13031-1: Mollier-h-x-Psychrometrie, Taupunktabstand ΔT_Tau.",
    "tags": "articles de article 16 gaertnermeister gewaechshaus klimasteuerung taupunkt heizrohr html vol 16 gärtnermeister klimasteuerung ingenieur monographie zur deutschen gärtnermeister klimasteueru"
  },
  {
    "title": "Vol. 17: Biophysikalische Substratphysik",
    "cat": "article",
    "url": "articles/de/article-17-substratphysik-luftkapazitaet-wasserretention-wurzelbelueftung.html",
    "icon": "🇩🇪",
    "desc": "Ingenieur-Monographie zur Substratphysik im Topf- und Containerbau: Gesamtporenvolumen (GPV), Luftkapazität bei pF 1,0, Stauwasserzone (Perched Water Table).",
    "tags": "articles de article 17 substratphysik luftkapazitaet wasserretention wurzelbelueftung html vol 17 biophysikalische substratphysik ingenieur monographie zur substratphysik im topf und contain"
  },
  {
    "title": "Vol. 18: Rezirkulierende Nährlösungsentkeimung",
    "cat": "article",
    "url": "articles/de/article-18-rezirkulierende-naehrloesungsentkeimung-uv-c-ozon-ultrafiltration-chelat.html",
    "icon": "🇩🇪",
    "desc": "Ingenieur-Monographie zur Dränwasser-Entkeimung im geschlossenen Hydroponik-Kreislauf nach WHG/DüV: Beer-Lambert-Transmission (T10).",
    "tags": "articles de article 18 rezirkulierende naehrloesungsentkeimung uv c ozon ultrafiltration chelat html vol 18 rezirkulierende nährlösungsentkeimung ingenieur monographie zur dränwasser entkeim"
  },
  {
    "title": "Vol. 19: Vertikale Landwirtschaft (PFAL)",
    "cat": "article",
    "url": "articles/de/article-19-vertikale-landwirtschaft-biomasse-konversionseffizienz-lue-ernteindex.html",
    "icon": "🇩🇪",
    "desc": "Ingenieur-Monographie zur Photonen- und Energiekonversion in der Vertikalen Landwirtschaft (Vertical Farming): Lichtnutzungseffizienz LUE (g/mol).",
    "tags": "articles de article 19 vertikale landwirtschaft biomasse konversionseffizienz lue ernteindex html vol 19 vertikale landwirtschaft pfal ingenieur monographie zur photonen und energiekonversio"
  },
  {
    "title": "Vol. 20: Blatttemperatur-Infrarot-Thermometrie",
    "cat": "article",
    "url": "articles/de/article-20-blatttemperatur-infrarot-thermometrie-emissionsgrad-energiebilanz.html",
    "icon": "🇩🇪",
    "desc": "Ingenieur-Monographie zur radiometrischen Blatttemperaturmessung im Gewächshaus: Stefan-Boltzmann-Gesetz, kutikulärer Emissionsgrad (0,98).",
    "tags": "articles de article 20 blatttemperatur infrarot thermometrie emissionsgrad energiebilanz html vol 20 blatttemperatur infrarot thermometrie ingenieur monographie zur radiometrischen blatttemp"
  },
  {
    "title": "Vol. 21: Chlorophyll-a-Fluoreszenzkinetik",
    "cat": "article",
    "url": "articles/de/article-21-chlorophyllfluoreszenz-fvfm-quantenausbeute-pflanzenstress-pam.html",
    "icon": "🇩🇪",
    "desc": "Ingenieur-Monographie zur zerstörungsfreien Echtzeit-Diagnose im Unterglasgartenbau: Kautsky-Effekt, maximale PSII-Quantenausbeute (Fv/Fm), effektive.",
    "tags": "articles de article 21 chlorophyllfluoreszenz fvfm quantenausbeute pflanzenstress pam html vol 21 chlorophyll a fluoreszenzkinetik ingenieur monographie zur zerstörungsfreien echtzeit diagno"
  },
  {
    "title": "Vol. 22: HPS- vs. LED-Assimilationsbelichtung",
    "cat": "article",
    "url": "articles/de/article-22-hps-vs-led-assimilation-belichtung-strahlungsheizung-wirtschaftlichkeit.html",
    "icon": "🇩🇪",
    "desc": "Ingenieur-Monographie zum Systemvergleich von 1000-W-Natriumdampf-Hochdrucklampen (SON-T/HPS) und Voll- bzw.",
    "tags": "articles de article 22 hps vs led assimilation belichtung strahlungsheizung wirtschaftlichkeit html vol 22 hps vs led assimilationsbelichtung ingenieur monographie zum systemvergleich von 10"
  },
  {
    "title": "Vol. 23: Geschlossene Tiefwasserkultur (DWC)",
    "cat": "article",
    "url": "articles/de/article-23-geschlossene-tiefwasserkultur-dwc-sauerstoffsaettigung-venturi-automatisierung.html",
    "icon": "🇩🇪",
    "desc": "Ingenieur-Monographie für rezirkulierende Tiefwasserkultur (DWC / Floating Raft) und NFT-Systeme: Gelöstsauerstoff-Kinetik nach dem Henry-Gesetz.",
    "tags": "articles de article 23 geschlossene tiefwasserkultur dwc sauerstoffsaettigung venturi automatisierung html vol 23 geschlossene tiefwasserkultur dwc ingenieur monographie für rezirkulierende "
  },
  {
    "title": "Optimierung des Dunkelrot (730nm) &amp; Hellrot",
    "cat": "article",
    "url": "articles/de/article-24-far-red-deep-red-spektrum-optimierung.html",
    "icon": "🇩🇪",
    "desc": "Wissenschaftliche Analyse des Emerson-Effekts, des Photosystem-Gleichgewichts und der Dunkelrot-Zusatzbelichtung im erwerbsmäßigen Gewächshausanbau.",
    "tags": "articles de article 24 far red deep red spektrum optimierung html optimierung des dunkelrot 730nm amp hellrot wissenschaftliche analyse des emerson effekts des photosystem gleichgewichts und"
  },
  {
    "title": "Geschlossene Nährlösungs-Kreisläufe",
    "cat": "article",
    "url": "articles/de/article-25-geschlossene-hydrokultur-nanoblasen-sauerstoff.html",
    "icon": "🇩🇪",
    "desc": "Ingenieurwissenschaftliche Analyse geschlossener Hydrokultursysteme, Rhizosphären-Sauerstoffgehalt (DO &gt; 8,5 mg/L) und Pythium-Prävention im geschlossenen.",
    "tags": "articles de article 25 geschlossene hydrokultur nanoblasen sauerstoff html geschlossene nährlösungs kreisläufe ingenieurwissenschaftliche analyse geschlossener hydrokultursysteme rhizosphäre"
  },
  {
    "title": "Gewächshaus-Heizlastberechnung &amp; Energieschirme",
    "cat": "article",
    "url": "articles/de/article-26-gewaechshaus-heizlast-din-v-18599.html",
    "icon": "🇩🇪",
    "desc": "Ingenieurwissenschaftliche Berechnung von Spitzenheizlasten, Rohrheizungs-Hydraulik und Energieschirmeinsparungen nach DIN V 18599.",
    "tags": "articles de article 26 gewaechshaus heizlast din v 18599 html gewächshaus heizlastberechnung amp energieschirme ingenieurwissenschaftliche berechnung von spitzenheizlasten rohrheizungs hydra"
  },
  {
    "title": "Biomasseakkumulation &amp; Lichtnutzungseffizienz",
    "cat": "article",
    "url": "articles/de/article-27-pflanzenertrag-biomasse-lichtnutzungseffizienz.html",
    "icon": "🇩🇪",
    "desc": "Ertragsprognosen im erwerbsmäßigen Gewächshausanbau basierend auf dem kumulierten DLI und der Lichtnutzungseffizienz (LUE = 2,8 - 3,4 g/mol).",
    "tags": "articles de article 27 pflanzenertrag biomasse lichtnutzungseffizienz html biomasseakkumulation amp lichtnutzungseffizienz ertragsprognosen im erwerbsmäßigen gewächshausanbau basierend auf d"
  },
  {
    "title": "CO2-Begasungskinetik &amp; Wirtschaftlichkeitsgrenzen",
    "cat": "article",
    "url": "articles/de/article-28-gewaechshaus-co2-duengung-oekonomie.html",
    "icon": "🇩🇪",
    "desc": "Analyse der CO2-Düngung, Lüftungsverlust-Dynamik und ökonomischen ROI-Schwellenwerte im geschützten Erwerbsanbau.",
    "tags": "articles de article 28 gewaechshaus co2 duengung oekonomie html co2 begasungskinetik amp wirtschaftlichkeitsgrenzen analyse der co2 düngung lüftungsverlust dynamik und ökonomischen roi schwe"
  },
  {
    "title": "Stundengenaue Penman-Monteith Evapotranspiration",
    "cat": "article",
    "url": "articles/de/article-29-stundengenaue-penman-monteith-evapotranspiration.html",
    "icon": "🇩🇪",
    "desc": "Ingenieurwissenschaftliche Modellierung der stündlichen Evapotranspiration (ETc), des Spaltöffnungswiderstands (rs) und der Präzisionsbewässerung.",
    "tags": "articles de article 29 stundengenaue penman monteith evapotranspiration html stundengenaue penman monteith evapotranspiration ingenieurwissenschaftliche modellierung der stündlichen evapotra"
  },
  {
    "title": "Steinwolle-Hydrodynamik &amp; TDR-Feuchtesensoren",
    "cat": "article",
    "url": "articles/de/article-30-steinwolle-tdr-feuchte-drain-ec.html",
    "icon": "🇩🇪",
    "desc": "Ingenieuranalyse von volumetrischem Wassergehalt (VWC %), Nachtabtrocknung und Drainage-EC-Steuerung im Steinwolleanbau.",
    "tags": "articles de article 30 steinwolle tdr feuchte drain ec html steinwolle hydrodynamik amp tdr feuchtesensoren ingenieuranalyse von volumetrischem wassergehalt vwc nachtabtrocknung und drainage"
  },
  {
    "title": "Hochdruck-Nebeltechnik (70 bar) &amp; Tropfenphysik",
    "cat": "article",
    "url": "articles/de/article-31-hochdruck-nebel-tropfenphysik.html",
    "icon": "🇩🇪",
    "desc": "Ingenieuranalyse der 70-bar-Hochdruckvernebelung, Sauter-Durchmesser (D32 &lt; 10µm), adiabaten Verdunstungskühlung und VPD-Stabilisierung im Gewächshaus.",
    "tags": "articles de article 31 hochdruck nebel tropfenphysik html hochdruck nebeltechnik 70 bar amp tropfenphysik ingenieuranalyse der 70 bar hochdruckvernebelung sauter durchmesser d32 lt 10 m adia"
  },
  {
    "title": "LED-Wärmemanagement &amp; Sperrschichttemperatur (Tj)",
    "cat": "article",
    "url": "articles/de/article-32-led-waermemanagement-sperrschichttemperatur.html",
    "icon": "🇩🇪",
    "desc": "Ingenieurwissenschaftliche Berechnung von LED-Kühlkörpern, Sperrschichttemperaturen (Tj), thermischer Effizienzdegradation und Konvektionswärme im Gewächshaus.",
    "tags": "articles de article 32 led waermemanagement sperrschichttemperatur html led wärmemanagement amp sperrschichttemperatur tj ingenieurwissenschaftliche berechnung von led kühlkörpern sperrschic"
  },
  {
    "title": "Präzisions-Pflanzensteuerung",
    "cat": "article",
    "url": "articles/de/article-33-praezisions-pflanzensteuerung-dif-vpd.html",
    "icon": "🇩🇪",
    "desc": "Gartenbauliche Pflanzensteuerung (Crop Steering): Steuerung des vegetativen Wachstums und Fruchtansatzes über Temperatur-DIF, VPD und Substratabtrocknung.",
    "tags": "articles de article 33 praezisions pflanzensteuerung dif vpd html präzisions pflanzensteuerung gartenbauliche pflanzensteuerung crop steering steuerung des vegetativen wachstums und fruchtan"
  },
  {
    "title": "UV-C Entkeimung in geschlossenen",
    "cat": "article",
    "url": "articles/de/article-34-uvc-entkeimung-geschlossene-hydrokultur.html",
    "icon": "🇩🇪",
    "desc": "Ingenieurwissenschaftliche Berechnung von UV-C-Strahlungsdosen (250 mJ/cm2), UVT%-Transmission und 5-Log-Pathogeninaktivierung (ToBRFV, Pythium).",
    "tags": "articles de article 34 uvc entkeimung geschlossene hydrokultur html uv c entkeimung in geschlossenen ingenieurwissenschaftliche berechnung von uv c strahlungsdosen 250 mj cm2 uvt transmissio"
  },
  {
    "title": "CFD-Strömungssimulation von HAF-Umluftventilatoren",
    "cat": "article",
    "url": "articles/de/article-35-gewaechshaus-haf-ventilatoren-cfd.html",
    "icon": "🇩🇪",
    "desc": "Numerische Strömungsmechanik (CFD) von horizontalen Umluftventilatoren (HAF), Wurfweiten, Bernoulli-Induktion und Mikroklima-Homogenisierung im Gewächshaus.",
    "tags": "articles de article 35 gewaechshaus haf ventilatoren cfd html cfd strömungssimulation von haf umluftventilatoren numerische strömungsmechanik cfd von horizontalen umluftventilatoren haf wurf"
  },
  {
    "title": "BHKW-Rauchgasreinigung &amp; SCR-Katalysator",
    "cat": "article",
    "url": "articles/de/article-36-bhkw-rauchgas-scr-entstickung.html",
    "icon": "🇩🇪",
    "desc": "Ingenieurwissenschaftliche Auslegung von SCR-Entstickungsanlagen, Harnstoffdosierung (AdBlue) und Reingas-CO2-Düngung im Gewächshaus.",
    "tags": "articles de article 36 bhkw rauchgas scr entstickung html bhkw rauchgasreinigung amp scr katalysator ingenieurwissenschaftliche auslegung von scr entstickungsanlagen harnstoffdosierung adblu"
  },
  {
    "title": "Wärmepufferspeicher-Schichtung &amp; MWh-Auslegung",
    "cat": "article",
    "url": "articles/de/article-37-waermepufferspeicher-schichtung-auslegung.html",
    "icon": "🇩🇪",
    "desc": "Ingenieurwissenschaftliche Berechnung von Heißwasser-Wärmepufferspeichern, Thermokline-Richardson-Zahl und nächtlicher Entladedauer im Erwerbsgartenbau.",
    "tags": "articles de article 37 waermepufferspeicher schichtung auslegung html wärmepufferspeicher schichtung amp mwh auslegung ingenieurwissenschaftliche berechnung von heißwasser wärmepufferspeiche"
  },
  {
    "title": "Xylem-Kalziumtransport &amp; Blütenendfäule",
    "cat": "article",
    "url": "articles/de/article-38-xylem-kalzium-bluetenendfaeule.html",
    "icon": "🇩🇪",
    "desc": "Pflanzenphysiologische Analyse des Xylem-Transpirationsstroms, Kalziumverteilung in der Frucht und Vorbeugung von Blütenendfäule (BER) im Unterglasanbau.",
    "tags": "articles de article 38 xylem kalzium bluetenendfaeule html xylem kalziumtransport amp blütenendfäule pflanzenphysiologische analyse des xylem transpirationsstroms kalziumverteilung in der fr"
  },
  {
    "title": "Umkehrosmose-Entsalzung im geschlossenen Anbau",
    "cat": "article",
    "url": "articles/de/article-39-umkehrosmose-entsalzung-energieeffizienz.html",
    "icon": "🇩🇪",
    "desc": "Ingenieurwissenschaftliche Berechnung von Niederdruck-Umkehrosmose (RO), Natriumrückhaltung (99,2%), Energierückgewinnung (PX) und geschlossener.",
    "tags": "articles de article 39 umkehrosmose entsalzung energieeffizienz html umkehrosmose entsalzung im geschlossenen anbau ingenieurwissenschaftliche berechnung von niederdruck umkehrosmose ro natr"
  },
  {
    "title": "Lichtextinktion (Beer-Lambert) &amp; Diffusglas",
    "cat": "article",
    "url": "articles/de/article-40-beer-lambert-lichtextinktion-diffusglas.html",
    "icon": "🇩🇪",
    "desc": "Pflanzenphysiologische Berechnung der Lichtextinktion im Pflanzenbestand (Beer-Lambertsches Gesetz), Blattflächenindex (LAI) und Ertragssteigerung.",
    "tags": "articles de article 40 beer lambert lichtextinktion diffusglas html lichtextinktion beer lambert amp diffusglas pflanzenphysiologische berechnung der lichtextinktion im pflanzenbestand beer "
  },
  {
    "title": "Farquhar (FvCB) Photosynthesemodell &amp; CO2-Begasung",
    "cat": "article",
    "url": "articles/de/article-41-farquhar-fvcb-photosynthese-co2.html",
    "icon": "🇩🇪",
    "desc": "Biochemische Modellierung der C3-Photosynthese nach Farquhar, von Caemmerer und Berry (FvCB), Rubisco-Carboxylierungsrate (Vcmax) und Elektronentransport.",
    "tags": "articles de article 41 farquhar fvcb photosynthese co2 html farquhar fvcb photosynthesemodell amp co2 begasung biochemische modellierung der c3 photosynthese nach farquhar von caemmerer und "
  },
  {
    "title": "Substrat-Matrixpotential & pF-Kurven",
    "cat": "article",
    "url": "articles/de/article-42-substrat-matrixpotential-pf-kurven.html",
    "icon": "🇩🇪",
    "desc": "Ingenieurwissenschaftliche Bodenphysik: Matrixpotential (Psi_m), pF-Wasserspannungskurven, van-Genuchten-Gleichung und leicht verfügbares Wasser (EAW).",
    "tags": "articles de article 42 substrat matrixpotential pf kurven html substrat matrixpotential pf kurven ingenieurwissenschaftliche bodenphysik matrixpotential psi m pf wasserspannungskurven van ge"
  },
  {
    "title": "Gewächshaus-Tragwerksplanung",
    "cat": "article",
    "url": "articles/de/article-43-gewaechshaus-tragwerksplanung-din-en-13031.html",
    "icon": "🇩🇪",
    "desc": "Bauingenieurtechnische Bemessung von Venlo-Gewächshäusern nach DIN EN 13031-1, Windlasten (qw), Schneelasten, Kulturpflanzenlasten und Fundamentbemessung.",
    "tags": "articles de article 43 gewaechshaus tragwerksplanung din en 13031 html gewächshaus tragwerksplanung bauingenieurtechnische bemessung von venlo gewächshäusern nach din en 13031 1 windlasten q"
  },
  {
    "title": "Meister-Deutsch: Open-Source SRS-Lernsystem",
    "cat": "article",
    "url": "articles/de/article-44-meister-deutsch-open-source-srs-lernsystem.html",
    "icon": "🇩🇪",
    "desc": "Open-Source Spaced Repetition System (SRS) für die deutsche Gärtnermeisterprüfung mit Web Speech API Sprachausgabe und farbenblindengerechter.",
    "tags": "articles de article 44 meister deutsch open source srs lernsystem html meister deutsch open source srs lernsystem open source spaced repetition system srs für die deutsche gärtnermeisterprüf"
  },
  {
    "title": "AgriQuant: Energie- &amp; Rohstoff-Quant-Terminal",
    "cat": "article",
    "url": "articles/de/article-45-agriquant-energie-rohstoff-quant-terminal.html",
    "icon": "🇩🇪",
    "desc": "Open-Source Finanz- und Energie-Quant-Terminal für den Erwerbsgartenbau. Berechnung von TTF-Erdgas-Spark-Spreads, Strombörsen-Arbitrage.",
    "tags": "articles de article 45 agriquant energie rohstoff quant terminal html agriquant energie amp rohstoff quant terminal open source finanz und energie quant terminal für den erwerbsgartenbau ber"
  },
  {
    "title": "OpenCEA: Open-Source Python-Framework",
    "cat": "article",
    "url": "articles/de/article-46-opencea-python-framework-veroeffentlichung.html",
    "icon": "🇩🇪",
    "desc": "Veröffentlichung von OpenCEA: Quelloffenes Python-Microframework für Gewächshausthermodynamik, Photosyntheseberechnung und Klimasteuerung.",
    "tags": "articles de article 46 opencea python framework veroeffentlichung html opencea open source python framework veröffentlichung von opencea quelloffenes python microframework für gewächshausthe"
  },
  {
    "title": "Computer Vision &amp; Schadbilddiagnose im Gartenbau",
    "cat": "article",
    "url": "articles/de/article-47-computer-vision-pflanzenkrankheiten-diagnostik.html",
    "icon": "🇩🇪",
    "desc": "Einsatz von Computer Vision und HSV-Farbraumsegmentierung zur Früherkennung von Botrytis cinerea und Nährstoffmangel im modernen Erwerbsgartenbau.",
    "tags": "articles de article 47 computer vision pflanzenkrankheiten diagnostik html computer vision amp schadbilddiagnose im gartenbau einsatz von computer vision und hsv farbraumsegmentierung zur fr"
  },
  {
    "title": "Gewächshaus-Investitionsrechnung (CapEx/OpEx/IRR)",
    "cat": "article",
    "url": "articles/de/article-48-gewaechshaus-capex-opex-irr-investitionsrechnung.html",
    "icon": "🇩🇪",
    "desc": "Finanzmathematische Investitions- und Wirtschaftlichkeitsrechnung für moderne Venlo-Großgewächshäuser: CapEx (180-320 €/m²), 10-Jahres-Cashflow, IRR.",
    "tags": "articles de article 48 gewaechshaus capex opex irr investitionsrechnung html gewächshaus investitionsrechnung capex opex irr finanzmathematische investitions und wirtschaftlichkeitsrechnung "
  },
  {
    "title": "Hydrokultur: Chemische Speziation &amp; Debye-Hückel",
    "cat": "article",
    "url": "articles/de/article-49-hydrokultur-chemische-speziation-debye-hueckel.html",
    "icon": "🇩🇪",
    "desc": "Chemische Thermodynamik geschlossener Nährlösungs-Kreisläufe: Debye-Hückel-Aktivitätskoeffizienten und Sättigungsindex (SI) zur Verhinderung von.",
    "tags": "articles de article 49 hydrokultur chemische speziation debye hueckel html hydrokultur chemische speziation amp debye hückel chemische thermodynamik geschlossener nährlösungs kreisläufe deby"
  },
  {
    "title": "Smart Greenhouse: MQTT &amp; Edge-IoT-Sensornetzwerke",
    "cat": "article",
    "url": "articles/de/article-50-smart-gewaechshaus-mqtt-edge-iot-flotte.html",
    "icon": "🇩🇪",
    "desc": "Industrielle IoT-Architektur für den modernen Erwerbsgartenbau: MQTT-Broker-Topologien, JSON-Telemetrie und echtzeitfähige Edge-Anomalieerkennung über 100.",
    "tags": "articles de article 50 smart gewaechshaus mqtt edge iot flotte html smart greenhouse mqtt amp edge iot sensornetzwerke industrielle iot architektur für den modernen erwerbsgartenbau mqtt bro"
  },
  {
    "title": "Autonome Gewächshäuser",
    "cat": "article",
    "url": "articles/de/article-51-autonome-gewaechshaeuser-ki-mpc-reinforcement-learning.html",
    "icon": "🇩🇪",
    "desc": "Moderne Klimacomputer-Regelung im Unterglasanbau: Modellprädiktive Regelung (MPC) und Reinforcement Learning zur Senkung des Heizenergiebedarfs um 22,4%.",
    "tags": "articles de article 51 autonome gewaechshaeuser ki mpc reinforcement learning html autonome gewächshäuser moderne klimacomputer regelung im unterglasanbau modellprädiktive regelung mpc und r"
  },
  {
    "title": "Aquifer-Wärmespeicher (ATES) &amp; Industrielle",
    "cat": "article",
    "url": "articles/de/article-52-aquifer-waermespeicher-ates-waermepumpen.html",
    "icon": "🇩🇪",
    "desc": "Thermodynamische Modellierung von Aquifer-Wärmespeichern (ATES / WKO), saisonaler Wärmerückgewinnung und industrieller Wärmepumpen-COP für fossilfreie.",
    "tags": "articles de article 52 aquifer waermespeicher ates waermepumpen html aquifer wärmespeicher ates amp industrielle thermodynamische modellierung von aquifer wärmespeichern ates wko saisonaler "
  },
  {
    "title": "Biomasse-BHKW Rauchgas-SCR-Reinigung &amp; Biogene",
    "cat": "article",
    "url": "articles/de/article-53-biomasse-bhkw-scr-co2-rueckgewinnung-gartenbau.html",
    "icon": "🇩🇪",
    "desc": "Thermodynamische Modellierung von Biomasse-Heizkraftwerken, selektiver katalytischer Reduktion (SCR), Ethylen-Katalysatoren und phytotoxizitätsfreier.",
    "tags": "articles de article 53 biomasse bhkw scr co2 rueckgewinnung gartenbau html biomasse bhkw rauchgas scr reinigung amp biogene thermodynamische modellierung von biomasse heizkraftwerken selekti"
  },
  {
    "title": "KI-basierte Modellprädiktive Regelung (MPC)",
    "cat": "article",
    "url": "articles/de/article-54-ki-modellpraediktive-regelung-mpc-venlo-gewaechshaus.html",
    "icon": "🇩🇪",
    "desc": "Mathematische Zustandsraum-Modellierung der Gewächshaus-Thermodynamik, nichtlineare MPC-Kostenfunktions-Optimierung, Spotmarkt-Integration und autonome.",
    "tags": "articles de article 54 ki modellpraediktive regelung mpc venlo gewaechshaus html ki basierte modellprädiktive regelung mpc mathematische zustandsraum modellierung der gewächshaus thermodynam"
  },
  {
    "title": "Nährstoff-Aufnahmekonzentrationsfaktor (UCF)",
    "cat": "article",
    "url": "articles/de/article-55-naehrstoff-aufnahmekonzentrationsfaktor-geschlossene-hydrokultur.html",
    "icon": "🇩🇪",
    "desc": "Ingenieurwissenschaftliche Modellierung des Nährstoff-Aufnahmekonzentrationsfaktors (UCF), Ionenakkumulationskinetik, Natrium-Grenzwerte.",
    "tags": "articles de article 55 naehrstoff aufnahmekonzentrationsfaktor geschlossene hydrokultur html nährstoff aufnahmekonzentrationsfaktor ucf ingenieurwissenschaftliche modellierung des nährstoff "
  },
  {
    "title": "Dunkelrot-Photobiologie (ePAR 400–750 nm)",
    "cat": "article",
    "url": "articles/de/article-56-dunkelrot-photobiologie-epar-phytochrom-photostationaerer-zustand.html",
    "icon": "🇩🇪",
    "desc": "Ingenieurwissenschaftliche Photobiologie von Dunkelrot-Photonen (Far-Red), ePAR (400-750 nm), Phytochrom-Gleichgewicht (PSS) und End-of-Day-Steuerung.",
    "tags": "articles de article 56 dunkelrot photobiologie epar phytochrom photostationaerer zustand html dunkelrot photobiologie epar 400 750 nm ingenieurwissenschaftliche photobiologie von dunkelrot p"
  },
  {
    "title": "Gewächshaus-Energieeffizienz, BLE",
    "cat": "article",
    "url": "articles/de/article-57-gewaechshaus-energieeffizienz-foerderung-ble-kfw-din13031.html",
    "icon": "🇩🇪",
    "desc": "Umfassender B2B-Leitfaden zur Energiewende im deutschen Gartenbau: BLE-Bundesprogramm Energieeffizienz, BAFA/KfW-Modul 4 und DIN EN 13031-1 im Unterglasanbau.",
    "tags": "articles de article 57 gewaechshaus energieeffizienz foerderung ble kfw din13031 html gewächshaus energieeffizienz ble umfassender b2b leitfaden zur energiewende im deutschen gartenbau ble b"
  },
  {
    "title": "Vol. 58: Dynamische CO₂-Begasungskinetik",
    "cat": "article",
    "url": "articles/de/article-58-dynamic-co2-enrichment-kinetics-rubisco-carboxylation-venlo.html",
    "icon": "🇩🇪",
    "desc": "Ingenieur-Monographie zur dynamischen CO₂-Anreicherung im Venlo-Gewächshaus: Farquhar-FvCB-Kinetik der RuBisCO, Firstlüftungs-Massenbilanz und BHKW-Ökonomie.",
    "tags": "articles de article 58 dynamic co2 enrichment kinetics rubisco carboxylation venlo html vol 58 dynamische co begasungskinetik ingenieur monographie zur dynamischen co anreicherung im venlo g"
  },
  {
    "title": "EPEX SPOT Negativstrompreis-Arbitrage",
    "cat": "article",
    "url": "articles/de/article-59-epex-spot-negativstrompreise-bess-power-to-heat-elektrokessel-venlo.html",
    "icon": "🇩🇪",
    "desc": "Ingenieurwissenschaftliche Analyse zu EPEX SPOT Negativstrompreisen (§ 51 EEG), 20-kV-Elektrokesseln, Richardson-Schichtenspeichern (Ri &gt; 5,0) und LFP-BESS.",
    "tags": "articles de article 59 epex spot negativstrompreise bess power to heat elektrokessel venlo html epex spot negativstrompreis arbitrage ingenieurwissenschaftliche analyse zu epex spot negativs"
  },
  {
    "title": "Potentiometrische Ionenselektive Elektroden (ISE)",
    "cat": "article",
    "url": "articles/de/article-60-potentiometrische-ionenselektive-elektroden-ise-geschlossene-hydroponik.html",
    "icon": "🇩🇪",
    "desc": "Ingenieurwissenschaftliche Analyse potentiometrischer ionenselektiver Elektroden (ISE: NO3-, K+, Ca2+, Na+, Cl-), Nernst-Gleichung.",
    "tags": "articles de article 60 potentiometrische ionenselektive elektroden ise geschlossene hydroponik html potentiometrische ionenselektive elektroden ise ingenieurwissenschaftliche analyse potenti"
  },
  {
    "title": "Thermodynamik der Energieschirm-Spaltöffnung",
    "cat": "article",
    "url": "articles/de/article-61-energieschirm-spaltoeffnung-transpiration-latente-waerme-kaltluftabfall.html",
    "icon": "🇩🇪",
    "desc": "Ingenieurwissenschaftliche Analyse zu Schirmspalt (Kierstand), gekoppeltem sensiblem und latentem Wärmetransport durch poröse Gewebe.",
    "tags": "articles de article 61 energieschirm spaltoeffnung transpiration latente waerme kaltluftabfall html thermodynamik der energieschirm spaltöffnung ingenieurwissenschaftliche analyse zu schirms"
  },
  {
    "title": "Agrar- &amp; Gewächshausförderung in allen 50",
    "cat": "article",
    "url": "articles/de/article-62-us-50-bundesstaaten-agrarfoerderung-eqip-reap-cea-leitfaden.html",
    "icon": "🇩🇪",
    "desc": "Ingenieur- und finanzwirtschaftlicher Leitfaden zur nicht-verwässernden Agrar- und CEA-Investitionsförderung in allen 50 US-Bundesstaaten.",
    "tags": "articles de article 62 us 50 bundesstaaten agrarfoerderung eqip reap cea leitfaden html agrar amp gewächshausförderung in allen 50 ingenieur und finanzwirtschaftlicher leitfaden zur nicht ve"
  },
  {
    "title": "Präzisionsbewässerung, Wassermanagement",
    "cat": "article",
    "url": "articles/de/article-63-praezisionsbewaesserung-wassermanagement-agrarsubventionen-florida-texas-vergleich.html",
    "icon": "🇩🇪",
    "desc": "Ingenieurhandbuch zu Bodenmatrixpotenzial-Telemetrie, Penman-Monteith-Bewässerungssteuerung, US-Wasserförderprogrammen (FDACS BMP 75-87,5 %, TWDB) sowie dem.",
    "tags": "articles de article 63 praezisionsbewaesserung wassermanagement agrarsubventionen florida texas vergleich html präzisionsbewässerung wassermanagement ingenieurhandbuch zu bodenmatrixpotenzia"
  },
  {
    "title": "Wasserqualität, Denitrifikations-Bioreaktoren",
    "cat": "article",
    "url": "articles/de/article-64-wasserqualitaet-bodenfruchtbarkeit-denitrifikationsbioreaktor-agrarfoerderung-vergleich.html",
    "icon": "🇩🇪",
    "desc": "Ingenieurhandbuch zu Holzhackschnitzel-Denitrifikationsbioreaktoren (NRCS CPS 605, HRT &gt;= 4 h), gesättigten Uferrandstreifen (CPS 604), DIN 38409-7.",
    "tags": "articles de article 64 wasserqualitaet bodenfruchtbarkeit denitrifikationsbioreaktor agrarfoerderung vergleich html wasserqualität denitrifikations bioreaktoren ingenieurhandbuch zu holzhack"
  },
  {
    "title": "Gewächshaus-Energieeffizienz, Energieschirme",
    "cat": "article",
    "url": "articles/de/article-65-gewaechshaus-energieeffizienz-energieschirme-agrarfoerderung-vergleich.html",
    "icon": "🇩🇪",
    "desc": "Ingenieurhandbuch zur energetischen Venlo-Gewächshaussanierung nach DIN V 18599.",
    "tags": "articles de article 65 gewaechshaus energieeffizienz energieschirme agrarfoerderung vergleich html gewächshaus energieeffizienz energieschirme ingenieurhandbuch zur energetischen venlo gewäc"
  },
  {
    "title": "Präzisionsbewässerung, Frequenzumrichter-Pumpenphys",
    "cat": "article",
    "url": "articles/de/article-66-kalifornien-sweep-vs-texas-twdb-bewaesserungsfoerderung-pumpeffizienz-vergleich.html",
    "icon": "🇩🇪",
    "desc": "Ingenieurhandbuch zur Pumpen-Affinitätsphysik (Drehzahlgesetz P ~ N³), spezifischen Förderenergie (kWh/m³), FDR/Tensiometer-Steuerung.",
    "tags": "articles de article 66 kalifornien sweep vs texas twdb bewaesserungsfoerderung pumpeffizienz vergleich html präzisionsbewässerung frequenzumrichter pumpenphys ingenieurhandbuch zur pumpen af"
  },
  {
    "title": "Tiefengeothermie, Fernwärme &amp; industrielle",
    "cat": "article",
    "url": "articles/de/article-67-tiefengeothermie-fernwaerme-grosswaermepumpen-gewaechshaus-dekarbonisierung.html",
    "icon": "🇩🇪",
    "desc": "Ingenieurhandbuch zur Integration hydrothermaler Tiefengeothermie, BEW-Wärmenetze und industrieller NH3/R290-Großwärmepumpen nach DIN V 18599 &amp; VDI 4640.",
    "tags": "articles de article 67 tiefengeothermie fernwaerme grosswaermepumpen gewaechshaus dekarbonisierung html tiefengeothermie fernwärme amp industrielle ingenieurhandbuch zur integration hydrothe"
  },
  {
    "title": "Direct Air Capture (DAC) &amp; Festamin-CO₂-Desorption",
    "cat": "article",
    "url": "articles/de/article-68-direct-air-capture-festamin-co2-desorption-waermepumpen-gewaechshaus.html",
    "icon": "🇩🇪",
    "desc": "Ingenieurhandbuch zur Festamin-TVSA-CO₂-Abscheidung aus Umgebungsluft (DAC) gekoppelt mit Großwärmepumpen (65 °C–85 °C) nach DIN EN 13031, KTBL, BMEL und IRA.",
    "tags": "articles de article 68 direct air capture festamin co2 desorption waermepumpen gewaechshaus html direct air capture dac amp festamin co desorption ingenieurhandbuch zur festamin tvsa co absc"
  },
  {
    "title": "Biomasse-BHKW, SCR-Rauchgasreinigung",
    "cat": "article",
    "url": "articles/de/article-69-biomasse-bhkw-rauchgasreinigung-scr-fernwaerme-gewaechshaus.html",
    "icon": "🇩🇪",
    "desc": "Ingenieurhandbuch zu Biomasse-Blockheizkraftwerken (BHKW/ORC) im Venlo-Gewächshaus: E-Filter, SCR-Entstickung (TA Luft / 44.",
    "tags": "articles de article 69 biomasse bhkw rauchgasreinigung scr fernwaerme gewaechshaus html biomasse bhkw scr rauchgasreinigung ingenieurhandbuch zu biomasse blockheizkraftwerken bhkw orc im ven"
  },
  {
    "title": "Nanoblasen-Sauerstofffertigation",
    "cat": "article",
    "url": "articles/de/article-70-nanoblasen-geloestsauerstoff-pythium-unterdrueckung-steinwolle.html",
    "icon": "🇩🇪",
    "desc": "Ingenieurmonographie zur Nanoblasen-Sauerstoffanreicherung im Venlo-Gewächshaus: Young-Laplace-Innendruck, Zeta-Potenzial (ISO 20480-1).",
    "tags": "articles de article 70 nanoblasen geloestsauerstoff pythium unterdrueckung steinwolle html nanoblasen sauerstofffertigation ingenieurmonographie zur nanoblasen sauerstoffanreicherung im venl"
  },
  {
    "title": "Horizontallüftung (HAF)",
    "cat": "article",
    "url": "articles/de/article-71-horizontallueftung-haf-grenzschicht-mikroklima-gewaechshaus.html",
    "icon": "🇩🇪",
    "desc": "Ingenieurmonographie zur Horizontallüftung (HAF) im Venlo-Gewächshaus: Blattgrenzschichtwiderstand, Sherwood-Stoffübergang, Racetrack-Auslegung.",
    "tags": "articles de article 71 horizontallueftung haf grenzschicht mikroklima gewaechshaus html horizontallüftung haf ingenieurmonographie zur horizontallüftung haf im venlo gewächshaus blattgrenzsc"
  },
  {
    "title": "Thermodynamische Optimierung halbgeschlossener",
    "cat": "article",
    "url": "articles/de/article-72-semi-closed-greenhouse-mollier-psychrometrics-latent-heat.html",
    "icon": "🇩🇪",
    "desc": "Ingenieurwissenschaftliche Meister-Monographie zum halbgeschlossenen Venlo-Gewächshaus: Überdruck-Folientransportschläuche (+15 bis +35 Pa).",
    "tags": "articles de article 72 semi closed greenhouse mollier psychrometrics latent heat html thermodynamische optimierung halbgeschlossener ingenieurwissenschaftliche meister monographie zum halbge"
  },
  {
    "title": "Geschlossene Nährlösungsrezirkulation auf",
    "cat": "article",
    "url": "articles/de/article-73-geschlossene-naehrloesungsrezirkulation-davies-ionenbilanz-steinwolle.html",
    "icon": "🇩🇪",
    "desc": "Ingenieurwissenschaftliche Meister-Monographie zur geschlossenen Nährlösungsrezirkulation im Unterglasgemüsebau: Erweiterte Davies-Gleichung.",
    "tags": "articles de article 73 geschlossene naehrloesungsrezirkulation davies ionenbilanz steinwolle html geschlossene nährlösungsrezirkulation auf ingenieurwissenschaftliche meister monographie zur"
  },
  {
    "title": "Halbgeschlossenes Gewächshaus &amp; ATU-Klimakorridore",
    "cat": "article",
    "url": "articles/de/article-74-halbgeschlossenes-gewaechshaus-atu-mollier-venlocad-integration.html",
    "icon": "🇩🇪",
    "desc": "Ingenieurwissenschaftliche Meister-Monographie zu ATU-Klimakorridoren im halbgeschlossenen Venlo-Gewächshaus: Überdruck-Insektenbarriere (+15 bis +35 Pa).",
    "tags": "articles de article 74 halbgeschlossenes gewaechshaus atu mollier venlocad integration html halbgeschlossenes gewächshaus amp atu klimakorridore ingenieurwissenschaftliche meister monographi"
  },
  {
    "title": "Aquifer-Wärmespeicher (ATES) &amp; Großwärmepumpen",
    "cat": "article",
    "url": "articles/de/article-75-ates-aquifer-waermespeicher-grosswaermepumpen-gewaechshaus.html",
    "icon": "🇩🇪",
    "desc": "Ingenieurwissenschaftliche Meister-Monographie zu saisonalen Aquifer-Wärmespeichern (ATES) und Großwärmepumpen im Unterglasgartenbau.",
    "tags": "articles de article 75 ates aquifer waermespeicher grosswaermepumpen gewaechshaus html aquifer wärmespeicher ates amp großwärmepumpen ingenieurwissenschaftliche meister monographie zu saison"
  },
  {
    "title": "Klimatechnik &amp; Biokontroll-Kybernetik",
    "cat": "article",
    "url": "articles/de/article-76-knoblauchsland-gewaechshausklima-vpd-nuetzlingseinsatz-oecd.html",
    "icon": "🇩🇪",
    "desc": "Ingenieurwissenschaftliche Fachmonographie zum Unterglasgemüsebau im Nürnberger Knoblauchsland: Doppel-AR-Diffusglas (96,2 % Transmission, 25 % Haze).",
    "tags": "articles de article 76 knoblauchsland gewaechshausklima vpd nuetzlingseinsatz oecd html klimatechnik amp biokontroll kybernetik ingenieurwissenschaftliche fachmonographie zum unterglasgemüse"
  },
  {
    "title": "Nacherntelogistik &amp; Kühlkettentechnik",
    "cat": "article",
    "url": "articles/de/article-77-gewaechshaus-nacherntelogistik-kuehlkette-qualitaetserhalt.html",
    "icon": "🇩🇪",
    "desc": "Ingenieurwissenschaftliche Monographie zur Nacherntelogistik im Unterglasgemüsebau: Induktionsgeführte FTS-Erntewagen, Biot- und Newton-Halbkühlzeit t1/2.",
    "tags": "articles de article 77 gewaechshaus nacherntelogistik kuehlkette qualitaetserhalt html nacherntelogistik amp kühlkettentechnik ingenieurwissenschaftliche monographie zur nacherntelogistik im"
  },
  {
    "title": "Energieaudit im Erwerbsgartenbau nach DIN V 18599",
    "cat": "article",
    "url": "articles/de/article-78-eu-gewaechshaus-energieaudit-din-18599-ble-foerderung-hofnachfolge.html",
    "icon": "🇩🇪",
    "desc": "Ingenieur- und betriebswirtschaftliche Fachmonographie zum Gewächshaus-Energieaudit (DIN V 18599, DIN EN 16247-1), BMLEH/BLE-Zuschuss (40 bis 50 %).",
    "tags": "articles de article 78 eu gewaechshaus energieaudit din 18599 ble foerderung hofnachfolge html energieaudit im erwerbsgartenbau nach din v 18599 ingenieur und betriebswirtschaftliche fachmon"
  },
  {
    "title": "Deutsche Gartenbau-Meister Fachartikel",
    "cat": "article",
    "url": "articles/de/index.html",
    "icon": "🇩🇪",
    "desc": "Vollständige deutschsprachige Wissensdatenbank mit 78 technischen Fachartikeln zu VPD-Psychrometrie, DIN V 18599 Heizlast, EN 13031-1 Venlo-Statik.",
    "tags": "articles de index html deutsche gartenbau meister fachartikel vollständige deutschsprachige wissensdatenbank mit 78 technischen fachartikeln zu vpd psychrometrie din v 18599 heizlast en 1303"
  },
  {
    "title": "施設園芸・スマート農業のための飽差（VPD）最適化マスタークラス",
    "cat": "article",
    "url": "articles/ja/article-01-vpd-masterclass-jp.html",
    "icon": "🇯🇵",
    "desc": "温室栽培および植物工場における飽差（Vapour Pressure Deficit, VPD）の物理計算、葉温と気温差による蒸散ダイナミクス、カルシウム欠乏（尻腐れ病）防止制御。",
    "tags": "articles ja article 01 vpd masterclass jp html 施設園芸 スマ ト農業のための飽差 vpd 最適化マスタ クラス 温室栽培および植物工場における飽差 vapour pressure deficit vpd の物理計算 葉温と気温差による蒸散ダイナミクス カルシウム欠乏 尻腐れ病 防止制御"
  },
  {
    "title": "日積算光量 (DLI) と植物工場・温室LED補光の計算式：PPFD換算・作用スペクトル・電力ROI",
    "cat": "article",
    "url": "articles/ja/article-02-dli-vertical-farming-led-photobiology-jp.html",
    "icon": "🇯🇵",
    "desc": "光合成有効光量子束密度 (PPFD: µmol/m²/s) から日積算光量 (DLI: mol/m²/d) への換算式、McCree作用スペクトル、遠赤色光 (ePAR) 制御、および補光用LEDの消費電力・投資回収 (ROI) を解説する技術モノグラフ。",
    "tags": "articles ja article 02 dli vertical farming led photobiology jp html 日積算光量 dli と植物工場 温室led補光の計算式 ppfd換算 作用スペクトル 電力roi 光合成有効光量子束密度 ppfd mol m s から日積算光量 dli mol m d への換算式 mccree作用スペクトル 遠赤色光 ep"
  },
  {
    "title": "施設園芸におけるマルハナバチ訪花受粉とIPM天敵保護・農薬再入場待機期間 (REI) の数理モデル",
    "cat": "article",
    "url": "articles/ja/article-03-pollinator-safety-bumblebee-ipm-rei-jp.html",
    "icon": "🇯🇵",
    "desc": "商業温室におけるセイヨウオオマルハナバチ・クロマルハナバチの振動受粉微気象条件（VPD・温度）、農薬残留半減期 (DT50) の一次減衰計算、および作業者再入場待機期間 (REI) を解説する技術モノグラフ。",
    "tags": "articles ja article 03 pollinator safety bumblebee ipm rei jp html 施設園芸におけるマルハナバチ訪花受粉とipm天敵保護 農薬再入場待機期間 rei の数理モデル 商業温室におけるセイヨウオオマルハナバチ クロマルハナバチの振動受粉微気象条件 vpd 温度 農薬残留半減期 dt50 の一次減衰計算 および作業者再"
  },
  {
    "title": "施設園芸の熱貫流率 (U'値)・多層保温カーテン・隙間換気熱損失・潜熱回収ヒートポンプ設計",
    "cat": "article",
    "url": "articles/ja/article-04-greenhouse-heat-loss-u-value-thermal-screen-design.html",
    "icon": "🇯🇵",
    "desc": "フェンロー型連棟温室および大型園芸施設におけるピーク暖房負荷計算式 (Q = U'·A·ΔT)、パテ無しガラスの煙突効果、多層保温カーテン (Luxous 1147 FR) の放射・対流抑制、および潜熱回収ヒートポンプ・蓄熱槽の設計指針。",
    "tags": "articles ja article 04 greenhouse heat loss u value thermal screen design html 施設園芸の熱貫流率 u 値 多層保温カ テン 隙間換気熱損失 潜熱回収ヒ トポンプ設計 フェンロ 型連棟温室および大型園芸施設におけるピ ク暖房負荷計算式 q u a t パテ無しガラスの煙突効果 多層保温カ テン lux"
  },
  {
    "title": "FAO-56 Penman-Monteith 蒸散モデル・気孔コンダクタンス・飽差 (VPD)",
    "cat": "article",
    "url": "articles/ja/article-05-penman-monteith-transpiration-vpd-environmental-control.html",
    "icon": "🇯🇵",
    "desc": "施設園芸におけるFAO-56 Penman-Monteith蒸発散方程式 (ET₀)・Stanghellini温室群落モデル、空気力学的境界層抵抗 (r_a) と気孔抵抗 (r_s)、飽差 (VPD) 制御、および積算日射比例灌水トリガーの設計。",
    "tags": "articles ja article 05 penman monteith transpiration vpd environmental control html fao 56 penman monteith 蒸散モデル 気孔コンダクタンス 飽差 vpd 施設園芸におけるfao 56 penman monteith蒸発散方程式 et stanghellini温室群落モデル "
  },
  {
    "title": "Vol. 06: 閉鎖型養液栽培におけるモル化学量論・Sonneveld/Steiner",
    "cat": "article",
    "url": "articles/ja/article-06-hydroponic-nutrient-formulation-ab-stock-tank-ec-ph-jp.html",
    "icon": "🇯🇵",
    "desc": "施設園芸および植物工場の閉鎖型循環式養液栽培におけるイオン当量設計 (mmol/L・meq/L)：Sonneveld・Steiner・山崎処方の比較、陽イオン・陰イオン電気的中性条件、A/B原液タンクの溶解度積 (Ksp・石膏沈殿防止)、NO₃⁻/NH₄⁺比による根圏pH自律緩衝、および排液循環ブレンド制御。",
    "tags": "articles ja article 06 hydroponic nutrient formulation ab stock tank ec ph jp html vol 06 閉鎖型養液栽培におけるモル化学量論 sonneveld steiner 施設園芸および植物工場の閉鎖型循環式養液栽培におけるイオン当量設計 mmol l meq l sonneveld steiner"
  },
  {
    "title": "Vol. 07: 植物工場・施設園芸のLED光質制御と光形態形成：McCree作用スペクトル・拡張光合",
    "cat": "article",
    "url": "articles/ja/article-07-horticultural-lighting-spectrum-par-epar-photomorphogenesis-jp.html",
    "icon": "🇯🇵",
    "desc": "植物工場 (PFAL) および施設園芸補光における光生物学・半導体照明工学：McCree・稲田の相対量子収率曲線、ePAR (400–750 nm)、フィトクロム光平衡 (PSS = Pfr/Ptotal)、クリプトクロム気孔開口、730 nm 遠赤色光によるエマーソン効果、および高効率LED.",
    "tags": "articles ja article 07 horticultural lighting spectrum par epar photomorphogenesis jp html vol 07 植物工場 施設園芸のled光質制御と光形態形成 mccree作用スペクトル 拡張光合 植物工場 pfal および施設園芸補光における光生物学 半導体照明工学 mccree 稲田の相対量"
  },
  {
    "title": "Vol. 08: モンステラ・デリシオサ (Monstera deliciosa)",
    "cat": "article",
    "url": "articles/ja/article-08-monstera-deliciosa-epiphyte-substrate-fenestration-vpd-jp.html",
    "icon": "🇯🇵",
    "desc": "サトイモ科半着生植物 Monstera deliciosa の施設園芸精密制御モノグラフ：気相率 ε_a ≥ 25 % の粗粒培地設計、Millington-Quirk 酸素拡散方程式、DLI 閾値とプログラム細胞死 (PCD) による葉身裂孔形成、および VPD 1.15 kPa 上限・溢液塩害防止制御。",
    "tags": "articles ja article 08 monstera deliciosa epiphyte substrate fenestration vpd jp html vol 08 モンステラ デリシオサ monstera deliciosa サトイモ科半着生植物 monstera deliciosa の施設園芸精密制御モノグラフ 気相率 a 25 の粗粒培地設計 mill"
  },
  {
    "title": "Vol. 09: 気孔コンダクタンス (gs) と光合成ガス交換動力学：Ball-Berry-Leun",
    "cat": "article",
    "url": "articles/ja/article-09-stomata-conductance-photosynthesis-jp.html",
    "icon": "🇯🇵",
    "desc": "施設園芸および太陽光利用型植物工場における気孔コンダクタンス (gs) と光合成ガス交換動力学の統合モデル。Farquhar-von Caemmerer-Berry (FvCB) 生化学モデルと Ball-Berry-Leuning (BBL) / Medlyn 気孔モデルの連成解法、葉面境界層抵抗.",
    "tags": "articles ja article 09 stomata conductance photosynthesis jp html vol 09 気孔コンダクタンス gs と光合成ガス交換動力学 ball berry leun 施設園芸および太陽光利用型植物工場における気孔コンダクタンス gs と光合成ガス交換動力学の統合モデル farquhar von caemmerer b"
  },
  {
    "title": "Vol. 10: 完全人工光型植物工場 (PFAL) の空調・潜熱除湿熱力学設計：湿り空気線図",
    "cat": "article",
    "url": "articles/ja/article-10-vertical-farm-hvac-design-jp.html",
    "icon": "🇯🇵",
    "desc": "完全人工光型植物工場 (PFAL) および垂直農業における空調・潜熱除湿の熱力学設計モノグラフ。湿り空気線図 (Psychrometrics)、低顕熱比.",
    "tags": "articles ja article 10 vertical farm hvac design jp html vol 10 完全人工光型植物工場 pfal の空調 潜熱除湿熱力学設計 湿り空気線図 完全人工光型植物工場 pfal および垂直農業における空調 潜熱除湿の熱力学設計モノグラフ 湿り空気線図 psychrometrics 低顕熱比"
  },
  {
    "title": "施設イチゴ高設養液栽培の環境制御工学：花芽分化・クラウン局所温度制御・DIF・VPD精密管理",
    "cat": "article",
    "url": "articles/ja/article-11-strawberry-high-bench-flower-bud-differentiation-dif-crown-heating-jp.html",
    "icon": "🇯🇵",
    "desc": "日本および欧州の商業施設イチゴ（Fragaria × ananassa）高設養液栽培における花芽分化検鏡基準（NO3-N管理・短日夜冷）、クラウン部局所加温・冷却、DIF温度差制御、VPDと灰色かび病予防の熱力学・生理学完全ガイド。",
    "tags": "articles ja article 11 strawberry high bench flower bud differentiation dif crown heating jp html 施設イチゴ高設養液栽培の環境制御工学 花芽分化 クラウン局所温度制御 dif vpd精密管理 日本および欧州の商業施設イチゴ fragaria ananassa 高設養液栽培における花"
  },
  {
    "title": "トマト尻腐れ果 (BER) の木部カルシウム輸送機構と夜間VPD・根圧・養液イオン拮抗の統合制御",
    "cat": "article",
    "url": "articles/ja/article-12-tomato-blossom-end-rot-calcium-xylem-transport-night-vpd-jp.html",
    "icon": "🇯🇵",
    "desc": "施設トマトの尻腐れ果 (Blossom-End Rot) を根絶するための技術詳解。Ca²⁺の師部非移動性と木部質量流、日中蒸散分配と夜間根圧制御 (VPD 0.35〜0.65 kPa)、K⁺/NH₄⁺カチオン拮抗比、最新研究に基づく環境・養液統合プロトコルを解説。",
    "tags": "articles ja article 12 tomato blossom end rot calcium xylem transport night vpd jp html トマト尻腐れ果 ber の木部カルシウム輸送機構と夜間vpd 根圧 養液イオン拮抗の統合制御 施設トマトの尻腐れ果 blossom end rot を根絶するための技術詳解 ca の師部非移動性と木部質量"
  },
  {
    "title": "スマート温室の精密センサ校正工学：ネルンスト式 (pH/EC)・TDR/FDR培地誘電率・NDIR式C",
    "cat": "article",
    "url": "articles/ja/article-13-smartfarm-sensor-calibration-nernst-tdr-ndir-jp.html",
    "icon": "🇯🇵",
    "desc": "施設園芸・養液栽培におけるガラス電極pHセンサ（ネルンスト勾配と非対称電位）、温度補償EC（25℃基準換算）、TDR/FDR培地体積含水率（Topp式）、および二重波長NDIR式CO₂センサの校正・不確かさ解析。",
    "tags": "articles ja article 13 smartfarm sensor calibration nernst tdr ndir jp html スマ ト温室の精密センサ校正工学 ネルンスト式 ph ec tdr fdr培地誘電率 ndir式c 施設園芸 養液栽培におけるガラス電極phセンサ ネルンスト勾配と非対称電位 温度補償ec 25 基準換算 tdr fdr培地体積"
  },
  {
    "title": "Vol. 14: ドイツのデュアル園芸職業教育（Ausbildung）と園芸マイスター（Gärtner",
    "cat": "article",
    "url": "articles/ja/article-14-ausbildung-horticulture-germany-jp.html",
    "icon": "🇯🇵",
    "desc": "ドイツ連邦職業教育法 (BBiG) に基づくデュアル園芸職業訓練 (70 % 経営実習・30 % 職業学校)、GartMstrV § 2 法定 3 部構成の国家資格「園芸マイスター (Gärtnermeister)」、2026 年バイエルン州協約訓練手当、および § 16a AufenthG.",
    "tags": "articles ja article 14 ausbildung horticulture germany jp html vol 14 ドイツのデュアル園芸職業教育 ausbildung と園芸マイスタ gärtner ドイツ連邦職業教育法 bbig に基づくデュアル園芸職業訓練 70 経営実習 30 職業学校 gartmstrv 2 法定 3 部構成の国家資格 園芸マイス"
  },
  {
    "title": "Vol. 15: バイオフィリック建築と室内緑化の環境物理学",
    "cat": "article",
    "url": "articles/ja/article-15-biophilic-architecture-indoor-light-compensation-voc-jp.html",
    "icon": "🇯🇵",
    "desc": "ドイツFLL室内緑化基準に基づくバイオフィリック建築の環境物理学。光補償点（LCP）、LuxからPPFDへの分光換算、底面灌水ハイドロニクスの毛管水理、根圏微生物によるVOCバイオ浄化（CADR）および多孔質吸音設計を数理モデルで詳説。",
    "tags": "articles ja article 15 biophilic architecture indoor light compensation voc jp html vol 15 バイオフィリック建築と室内緑化の環境物理学 ドイツfll室内緑化基準に基づくバイオフィリック建築の環境物理学 光補償点 lcp luxからppfdへの分光換算 底面灌水ハイドロニクスの毛管水理 根圏"
  },
  {
    "title": "Vol. 16: ドイツ園芸マイスターの温室気候制御工学",
    "cat": "article",
    "url": "articles/ja/article-16-german-meister-greenhouse-climate-dewpoint-jp.html",
    "icon": "🇯🇵",
    "desc": "ドイツ Gärtnermeister の高度施設園芸気候制御。Cool-Morning 戦略、植物体露点凝縮（Botrytis 防除）の臨界マージン ΔT_dew、DIN V 18599 二重保温スクリーン間隙（Screen Gap）除湿、51 mm レールパイプ最小水温制御の数理モデルを詳説。",
    "tags": "articles ja article 16 german meister greenhouse climate dewpoint jp html vol 16 ドイツ園芸マイスタ の温室気候制御工学 ドイツ gärtnermeister の高度施設園芸気候制御 cool morning 戦略 植物体露点凝縮 botrytis 防除 の臨界マ ジン t dew din v 18"
  },
  {
    "title": "Vol. 17: 園芸培地物理学（DIN EN 13041）",
    "cat": "article",
    "url": "articles/ja/article-17-substrate-physics-air-filled-porosity-root-aeration-jp.html",
    "icon": "🇯🇵",
    "desc": "DIN EN 13041 に基づく園芸培地物理学の徹底解説。pF 1.0 気相率（Luftkapazität）、鉢底の飽和水層（Stauwasserzone）の物理機構、Van Genuchten 水分特性曲線、Millington-Quirk 根圏酸素拡散モデル、RAL-GZ 250.",
    "tags": "articles ja article 17 substrate physics air filled porosity root aeration jp html vol 17 園芸培地物理学 din en 13041 din en 13041 に基づく園芸培地物理学の徹底解説 pf 1 0 気相率 luftkapazität 鉢底の飽和水層 stauwasserzone の"
  },
  {
    "title": "Vol. 18: 閉鎖型循環養液栽培の無放流排液殺菌工学（WHG / DüV）— UV-C 254",
    "cat": "article",
    "url": "articles/ja/article-18-recirculating-nutrient-sterilization-uvc-ozone-uf-jp.html",
    "icon": "🇯🇵",
    "desc": "ドイツ水資源法（WHG）および肥料令（DüV）が求めるゼロエミッション閉鎖型養液循環の殺菌工学。UV-C 254 nm の Beer-Lambert 減衰と Chick-Watson 4-Log 殺菌線量、オゾン ORP ≥ 750 mV の CT 値、限外濾過（UF 0.02 µm）、Fe-DTPA/EDDHA.",
    "tags": "articles ja article 18 recirculating nutrient sterilization uvc ozone uf jp html vol 18 閉鎖型循環養液栽培の無放流排液殺菌工学 whg düv uv c 254 ドイツ水資源法 whg および肥料令 düv が求めるゼロエミッション閉鎖型養液循環の殺菌工学 uv c 254 nm の bee"
  },
  {
    "title": "Vol. 19: 完全人工光型植物工場（Vertical",
    "cat": "article",
    "url": "articles/ja/article-19-vertical-farm-biomass-conversion-efficiency-lue-jp.html",
    "icon": "🇯🇵",
    "desc": "植物工場（PFAL）の光利用効率（LUE: g_DM/mol_PAR）、収穫指数（HI）、LED 電気→光子変換効率（PPE 3.4–3.8 µmol/J）、および製品 1 kg あたり消費電力量（kWh/kg_FW）の決定方程式と限界突破エンジニアリングを詳説。",
    "tags": "articles ja article 19 vertical farm biomass conversion efficiency lue jp html vol 19 完全人工光型植物工場 vertical 植物工場 pfal の光利用効率 lue g dm mol par 収穫指数 hi led 電気 光子変換効率 ppe 3 4 3 8 mol j および製品 1 kg"
  },
  {
    "title": "Vol. 20: 非接触赤外線葉温計測と葉面エネルギー収支",
    "cat": "article",
    "url": "articles/ja/article-20-leaf-temperature-infrared-thermometry-energy-balance-jp.html",
    "icon": "🇯🇵",
    "desc": "施設園芸における非接触赤外線放射温度計（IRT）による葉温計測の物理と誤差補正。植物葉の放射率 ε = 0.96–0.98、冷たいガラス屋根の背景長波反射誤差補償、葉面熱収支方程式と作物水ストレス指数 CWSI を数式で解明。",
    "tags": "articles ja article 20 leaf temperature infrared thermometry energy balance jp html vol 20 非接触赤外線葉温計測と葉面エネルギ 収支 施設園芸における非接触赤外線放射温度計 irt による葉温計測の物理と誤差補正 植物葉の放射率 0 96 0 98 冷たいガラス屋根の背景長波反射誤差補償 "
  },
  {
    "title": "Vol. 21: クロロフィル蛍光診断（PAM）・最大量子収率",
    "cat": "article",
    "url": "articles/ja/article-21-chlorophyll-fluorescence-fvfm-pam-stress-diagnostics-jp.html",
    "icon": "🇯🇵",
    "desc": "パルス振幅変調（PAM）クロロフィル a 蛍光法を用いた施設園芸作物の非破壊光合成ストレス診断。最大量子収率 Fv/Fm の健全閾値（0.78–0.84）、明順応下実効量子収率 ΦPSII、電子伝達速度 ETR、非光化学的消光 NPQ による LED 調光・気候制御フィードバックを解説。",
    "tags": "articles ja article 21 chlorophyll fluorescence fvfm pam stress diagnostics jp html vol 21 クロロフィル蛍光診断 pam 最大量子収率 パルス振幅変調 pam クロロフィル a 蛍光法を用いた施設園芸作物の非破壊光合成ストレス診断 最大量子収率 fv fm の健全閾値 0 78 0 84 "
  },
  {
    "title": "Vol. 22: 高圧ナトリウムランプ（HPS）対 LED 補光工学",
    "cat": "article",
    "url": "articles/ja/article-22-hps-vs-led-assimilation-lighting-radiant-heat-economics-jp.html",
    "icon": "🇯🇵",
    "desc": "商業ガラス温室における 1,000 W DE-HPS 対フル LED 補光の熱力学的・経済的完全比較。PPE（1.7 vs 3.6 µmol/J）、長波赤外放射による葉温 +1.5 K 上昇と LED 導入時の暖房負荷振替（Heat-Replacement Effect）、1.0 ha.",
    "tags": "articles ja article 22 hps vs led assimilation lighting radiant heat economics jp html vol 22 高圧ナトリウムランプ hps 対 led 補光工学 商業ガラス温室における 1 000 w de hps 対フル led 補光の熱力学的 経済的完全比較 ppe 1 7 vs 3 6 mol "
  },
  {
    "title": "Vol. 23: 閉鎖型湛液水耕（DWC）の溶存酸素（DO）物理・Henry",
    "cat": "article",
    "url": "articles/ja/article-23-closed-loop-dwc-dissolved-oxygen-venturi-automation-jp.html",
    "icon": "🇯🇵",
    "desc": "商業湛液水耕（Deep Water Culture, DWC）における水温上昇に伴う酸素溶解度低下（Henry の法則）、根呼吸酸素消費量と供給速度の物質収支、ベンチュリ（Venturi）マイクロバブル溶解効率、Pythium 抑止のための DO ≥ 7.0 mg/L 自動制御設計を数式で解明。",
    "tags": "articles ja article 23 closed loop dwc dissolved oxygen venturi automation jp html vol 23 閉鎖型湛液水耕 dwc の溶存酸素 do 物理 henry 商業湛液水耕 deep water culture dwc における水温上昇に伴う酸素溶解度低下 henry の法則 根呼吸酸素消費量と供給"
  },
  {
    "title": "遠赤色光（730nm）と深赤色光（660nm）の最適LEDスペクトル比率",
    "cat": "article",
    "url": "articles/ja/article-24-far-red-deep-red-led-spectrum-optimization-jp.html",
    "icon": "🇯🇵",
    "desc": "商業用施設園芸におけるエマーソン効果、光化学系I・IIの励起バランス、および遠赤色光（730nm）補光最適化に関する専門技術解説 施設園芸・植物工場の定量工学解説と無料計算シミュレーターを公開 (Inwoovation Lab)。",
    "tags": "articles ja article 24 far red deep red led spectrum optimization jp html 遠赤色光 730nm と深赤色光 660nm の最適ledスペクトル比率 商業用施設園芸におけるエマ ソン効果 光化学系i iiの励起バランス および遠赤色光 730nm 補光最適化に関する専門技術解説 施設園芸 植物工場の定量工学"
  },
  {
    "title": "完全閉鎖型循環式水耕栽培とナノバブル溶存酸素（DO）動態",
    "cat": "article",
    "url": "articles/ja/article-25-closed-loop-hydroponic-nanobubble-oxygenation-jp.html",
    "icon": "🇯🇵",
    "desc": "商業用施設園芸における完全循環式養液管理、根圏溶存酸素（DO &gt; 8.5mg/L）制御、およびピシウム根腐れ病抑制のバイオエンジニアリング解説。",
    "tags": "articles ja article 25 closed loop hydroponic nanobubble oxygenation jp html 完全閉鎖型循環式水耕栽培とナノバブル溶存酸素 do 動態 商業用施設園芸における完全循環式養液管理 根圏溶存酸素 do gt 8 5mg l 制御 およびピシウム根腐れ病抑制のバイオエンジニアリング解説"
  },
  {
    "title": "温室暖房負荷モデリングと保温カーテン熱力学（DIN V 18599）",
    "cat": "article",
    "url": "articles/ja/article-26-greenhouse-heating-load-din-v-18599-jp.html",
    "icon": "🇯🇵",
    "desc": "温室暖房負荷モデリングと保温カーテン熱力学（DIN V 18599） — 商業用連棟温室および植物工場 (CEA) における熱力学・生物物理モデル、環境制御セットポイント、省エネ設計の技術解説。",
    "tags": "articles ja article 26 greenhouse heating load din v 18599 jp html 温室暖房負荷モデリングと保温カ テン熱力学 din v 18599 温室暖房負荷モデリングと保温カ テン熱力学 din v 18599 商業用連棟温室および植物工場 cea における熱力学 生物物理モデル 環境制御セットポイント 省エネ設計の技術"
  },
  {
    "title": "作物のバイオマス蓄積予測と光利用効率（LUE）",
    "cat": "article",
    "url": "articles/ja/article-27-crop-yield-biomass-light-use-efficiency-jp.html",
    "icon": "🇯🇵",
    "desc": "商業用温室における積算受光量（DLI）、光利用効率（LUE = 2.8 - 3.4 g/mol）、および収穫指数（HI）に基づく収量予測モデル。",
    "tags": "articles ja article 27 crop yield biomass light use efficiency jp html 作物のバイオマス蓄積予測と光利用効率 lue 商業用温室における積算受光量 dli 光利用効率 lue 2 8 3 4 g mol および収穫指数 hi に基づく収量予測モデル"
  },
  {
    "title": "温室CO2施用動態と経済的ROI閾値",
    "cat": "article",
    "url": "articles/ja/article-28-greenhouse-co2-enrichment-economics-jp.html",
    "icon": "🇯🇵",
    "desc": "商業用施設園芸および大規模ガラス温室における液化炭酸ガス（LCO2）とボイラー排ガス施用の経済性比較、換気ロス動態モデル、および光合成促進によるCO2施用の投資対効果（ROI）を徹底解析。",
    "tags": "articles ja article 28 greenhouse co2 enrichment economics jp html 温室co2施用動態と経済的roi閾値 商業用施設園芸および大規模ガラス温室における液化炭酸ガス lco2 とボイラ 排ガス施用の経済性比較 換気ロス動態モデル および光合成促進によるco2施用の投資対効果 roi を徹底解析"
  },
  {
    "title": "温室における時間別ペンマン・モンティス蒸発散量（ETc）モデリング",
    "cat": "article",
    "url": "articles/ja/article-29-hourly-penman-monteith-evapotranspiration-jp.html",
    "icon": "🇯🇵",
    "desc": "温室における時間別ペンマン・モンティス蒸発散量（ETc）モデリング — 商業用連棟温室および植物工場 (CEA) における熱力学・生物物理モデル、環境制御セットポイント、省エネ設計の技術解説。",
    "tags": "articles ja article 29 hourly penman monteith evapotranspiration jp html 温室における時間別ペンマン モンティス蒸発散量 etc モデリング 温室における時間別ペンマン モンティス蒸発散量 etc モデリング 商業用連棟温室および植物工場 cea における熱力学 生物物理モデル 環境制御セットポイント 省エ"
  },
  {
    "title": "ロックウール培地の水力学とTDR水分センサー較正",
    "cat": "article",
    "url": "articles/ja/article-30-rockwool-slab-tdr-moisture-drain-ec-jp.html",
    "icon": "🇯🇵",
    "desc": "商業用水耕栽培におけるロックウールスラブの体積含水率（VWC %）、夜間ドライダウン動態、および排液ECバランシングの解析 施設園芸・植物工場の定量工学解説と無料計算シミュレーターを公開 (Inwoovation Lab)。",
    "tags": "articles ja article 30 rockwool slab tdr moisture drain ec jp html ロックウ ル培地の水力学とtdr水分センサ 較正 商業用水耕栽培におけるロックウ ルスラブの体積含水率 vwc 夜間ドライダウン動態 および排液ecバランシングの解析 施設園芸 植物工場の定量工学解説と無料計算シミュレ タ を公開 inwoova"
  },
  {
    "title": "高圧細霧冷房（70 bar）の液滴物理学とザウター平均粒径",
    "cat": "article",
    "url": "articles/ja/article-31-high-pressure-fogging-droplet-physics-jp.html",
    "icon": "🇯🇵",
    "desc": "商業用温室における70 bar高圧フォグ、ザウター平均粒径（D32 &lt; 10µm）、断熱蒸発冷却、およびVPD安定化の工学的解析 施設園芸・植物工場の定量工学解説と無料計算シミュレーターを公開 (Inwoovation Lab)。",
    "tags": "articles ja article 31 high pressure fogging droplet physics jp html 高圧細霧冷房 70 bar の液滴物理学とザウタ 平均粒径 商業用温室における70 bar高圧フォグ ザウタ 平均粒径 d32 lt 10 m 断熱蒸発冷却 およびvpd安定化の工学的解析 施設園芸 植物工場の定量工学解説と無料計算シミュレ "
  },
  {
    "title": "園芸用LEDの熱管理とジャンクション温度（Tj）解析",
    "cat": "article",
    "url": "articles/ja/article-32-horticultural-led-thermal-junction-temperature-jp.html",
    "icon": "🇯🇵",
    "desc": "商業用温室における園芸用LED器具の放熱設計、ジャンクション温度（Tj）、熱抵抗（Rth）、および発光量子効率の熱劣化メカニズム 施設園芸・植物工場の定量工学解説と無料計算シミュレーターを公開 (Inwoovation Lab)。",
    "tags": "articles ja article 32 horticultural led thermal junction temperature jp html 園芸用ledの熱管理とジャンクション温度 tj 解析 商業用温室における園芸用led器具の放熱設計 ジャンクション温度 tj 熱抵抗 rth および発光量子効率の熱劣化メカニズム 施設園芸 植物工場の定量工学解説と無料計算シ"
  },
  {
    "title": "精密クロップステアリング動態（栄養生長 vs 生殖生長）",
    "cat": "article",
    "url": "articles/ja/article-33-precision-crop-steering-dif-vpd-drydown-jp.html",
    "icon": "🇯🇵",
    "desc": "商業用施設園芸におけるクロップステアリング技術：昼夜温差（DIF）、飽差（VPD）、および培地ドライダウンによる着花・着果最適化 施設園芸・植物工場の定量工学解説と無料計算シミュレーターを公開 (Inwoovation Lab)。",
    "tags": "articles ja article 33 precision crop steering dif vpd drydown jp html 精密クロップステアリング動態 栄養生長 vs 生殖生長 商業用施設園芸におけるクロップステアリング技術 昼夜温差 dif 飽差 vpd および培地ドライダウンによる着花 着果最適化 施設園芸 植物工場の定量工学解説と無料計算シミュレ タ "
  },
  {
    "title": "完全循環式水耕栽培におけるUV-C殺菌速度論と病原体不活化",
    "cat": "article",
    "url": "articles/ja/article-34-closed-loop-uvc-drain-disinfection-jp.html",
    "icon": "🇯🇵",
    "desc": "商業用循環式水耕栽培におけるUV-C照射線量（250 mJ/cm2）、透過率（UVT%）、およびToBRFV・ピシウム菌の5-Log不活化動態解析。",
    "tags": "articles ja article 34 closed loop uvc drain disinfection jp html 完全循環式水耕栽培におけるuv c殺菌速度論と病原体不活化 商業用循環式水耕栽培におけるuv c照射線量 250 mj cm2 透過率 uvt およびtobrfv ピシウム菌の5 log不活化動態解析"
  },
  {
    "title": "温室循環扇（HAF）の数値流体力学（CFD）気流モデリング",
    "cat": "article",
    "url": "articles/ja/article-35-greenhouse-haf-fan-cfd-modeling-jp.html",
    "icon": "🇯🇵",
    "desc": "商業用温室における水平循環扇（HAF）の配置間隔、噴流到達距離、ベルヌーイ誘引効果、および群落内微気象均一化のCFD解析 施設園芸・植物工場の定量工学解説と無料計算シミュレーターを公開 (Inwoovation Lab)。",
    "tags": "articles ja article 35 greenhouse haf fan cfd modeling jp html 温室循環扇 haf の数値流体力学 cfd 気流モデリング 商業用温室における水平循環扇 haf の配置間隔 噴流到達距離 ベルヌ イ誘引効果 および群落内微気象均一化のcfd解析 施設園芸 植物工場の定量工学解説と無料計算シミュレ タ を公開 inwo"
  },
  {
    "title": "コージェネ排ガスSCR脱硝と安全なCO2施用技術",
    "cat": "article",
    "url": "articles/ja/article-36-chp-flue-gas-scr-denitrification-jp.html",
    "icon": "🇯🇵",
    "desc": "商業用施設園芸におけるガスエンジンCHP排ガスの選択的触媒還元（SCR）、尿素水添加化学量論、NOx &lt; 5mg/Nm3除去、および高純度CO2施用技術。",
    "tags": "articles ja article 36 chp flue gas scr denitrification jp html コ ジェネ排ガスscr脱硝と安全なco2施用技術 商業用施設園芸におけるガスエンジンchp排ガスの選択的触媒還元 scr 尿素水添加化学量論 nox lt 5mg nm3除去 および高純度co2施用技術"
  },
  {
    "title": "温水蓄熱バッファタンクの温度成層と蓄熱容量（MWh）設計",
    "cat": "article",
    "url": "articles/ja/article-37-thermal-buffer-tank-stratification-sizing-jp.html",
    "icon": "🇯🇵",
    "desc": "商業用温室における温水蓄熱タンクの温度成層（リチャードソン数 Ri &gt; 10）、蓄熱容量（MWh）、および夜間ピーク暖房放熱時間の工学計算。",
    "tags": "articles ja article 37 thermal buffer tank stratification sizing jp html 温水蓄熱バッファタンクの温度成層と蓄熱容量 mwh 設計 商業用温室における温水蓄熱タンクの温度成層 リチャ ドソン数 ri gt 10 蓄熱容量 mwh および夜間ピ ク暖房放熱時間の工学計算"
  },
  {
    "title": "木部導管カルシウム輸送動態と尻腐れ病（BER）予防",
    "cat": "article",
    "url": "articles/ja/article-38-xylem-calcium-flux-blossom-end-rot-jp.html",
    "icon": "🇯🇵",
    "desc": "植物生理学解析：木部蒸散流によるカルシウム分配機構、果頂部細胞壁の安定化、および昼夜VPD制御による尻腐れ病の完全予防技術 施設園芸・植物工場の定量工学解説と無料計算シミュレーターを公開 (Inwoovation Lab)。",
    "tags": "articles ja article 38 xylem calcium flux blossom end rot jp html 木部導管カルシウム輸送動態と尻腐れ病 ber 予防 植物生理学解析 木部蒸散流によるカルシウム分配機構 果頂部細胞壁の安定化 および昼夜vpd制御による尻腐れ病の完全予防技術 施設園芸 植物工場の定量工学解説と無料計算シミュレ タ を公開 inwo"
  },
  {
    "title": "完全循環式水耕栽培の逆浸透（RO）脱塩とナトリウム除去技術",
    "cat": "article",
    "url": "articles/ja/article-39-closed-loop-ro-desalination-energy-jp.html",
    "icon": "🇯🇵",
    "desc": "商業用温室における逆浸透膜（RO）透過流束（LMH）、ナトリウム（Na+）阻止率（99.2%）、等圧式エネルギー回収装置（PX）、および排水ゼロ循環技術。",
    "tags": "articles ja article 39 closed loop ro desalination energy jp html 完全循環式水耕栽培の逆浸透 ro 脱塩とナトリウム除去技術 商業用温室における逆浸透膜 ro 透過流束 lmh ナトリウム na 阻止率 99 2 等圧式エネルギ 回収装置 px および排水ゼロ循環技術"
  },
  {
    "title": "群落内光減衰（ランベルト・ベールの法則）と散乱光ガラス工学",
    "cat": "article",
    "url": "articles/ja/article-40-beer-lambert-canopy-light-extinction-jp.html",
    "icon": "🇯🇵",
    "desc": "植物生理学解析：ランベルト・ベールの法則に基づく光減衰係数（k）、葉面積指数（LAI）、および散乱光温室ガラス（Hortiscatter 65%）による群落全体の光合成促進効果。",
    "tags": "articles ja article 40 beer lambert canopy light extinction jp html 群落内光減衰 ランベルト ベ ルの法則 と散乱光ガラス工学 植物生理学解析 ランベルト ベ ルの法則に基づく光減衰係数 k 葉面積指数 lai および散乱光温室ガラス hortiscatter 65 による群落全体の光合成促進効果"
  },
  {
    "title": "ファーカー（FvCB）光合成生化学モデルとCO2施用動態",
    "cat": "article",
    "url": "articles/ja/article-41-farquhar-photosynthesis-fvcb-co2-jp.html",
    "icon": "🇯🇵",
    "desc": "植物生理学・生化学解析：ファーカー・フォン・ケメラー・ベリー（FvCB）モデル、ルビスコ最大カルボキシル化速度（Vcmax）、電子伝達速度（J）、およびCO2施用飽和動態。",
    "tags": "articles ja article 41 farquhar photosynthesis fvcb co2 jp html ファ カ fvcb 光合成生化学モデルとco2施用動態 植物生理学 生化学解析 ファ カ フォン ケメラ ベリ fvcb モデル ルビスコ最大カルボキシル化速度 vcmax 電子伝達速度 j およびco2施用飽和動態"
  },
  {
    "title": "培地マトリックポテンシャル（Ψm）とpF水分保持曲線",
    "cat": "article",
    "url": "articles/ja/article-42-substrate-matric-potential-pf-curves-jp.html",
    "icon": "🇯🇵",
    "desc": "農業土壌物理学解析：マトリック吸引圧（Psi_m）、pF水分保持曲線、ファン・ヘヌフテン（van Genuchten）水理モデル、およびロックウール・ココピートの易有効水分（EAW）管理。",
    "tags": "articles ja article 42 substrate matric potential pf curves jp html 培地マトリックポテンシャル m とpf水分保持曲線 農業土壌物理学解析 マトリック吸引圧 psi m pf水分保持曲線 ファン ヘヌフテン van genuchten 水理モデル およびロックウ ル ココピ トの易有効水分 eaw 管理"
  },
  {
    "title": "温室構造設計基準（EN 13031-1 & NEN 3859）",
    "cat": "article",
    "url": "articles/ja/article-43-greenhouse-structural-standards-en13031-jp.html",
    "icon": "🇯🇵",
    "desc": "土木建築構造力学解析：EN 13031-1およびNEN 3859に基づくフェンロー型温室の風圧（qw）、積雪荷重、作物誘引荷重、および支柱曲げモーメント設計。",
    "tags": "articles ja article 43 greenhouse structural standards en13031 jp html 温室構造設計基準 en 13031 1 nen 3859 土木建築構造力学解析 en 13031 1およびnen 3859に基づくフェンロ 型温室の風圧 qw 積雪荷重 作物誘引荷重 および支柱曲げモ メント設計"
  },
  {
    "title": "Meister-Deutsch：園芸ドイツ語オープンソースSRS学習エンジン",
    "cat": "article",
    "url": "articles/ja/article-44-meister-deutsch-open-source-srs-engine-jp.html",
    "icon": "🇯🇵",
    "desc": "ドイツ・ゲルトナーマイスター（農業マイスター）資格試験向けのオープンソース分散反復（SRS）学習Webアプリ。Web Speech API音声合成および色覚バリアフリー設計。",
    "tags": "articles ja article 44 meister deutsch open source srs engine jp html meister deutsch 園芸ドイツ語オ プンソ スsrs学習エンジン ドイツ ゲルトナ マイスタ 農業マイスタ 資格試験向けのオ プンソ ス分散反復 srs 学習webアプリ web speech api音声合成および色覚バリアフリ"
  },
  {
    "title": "AgriQuant：温室エネルギー＆一次産品オープンソース・クオンツ端末",
    "cat": "article",
    "url": "articles/ja/article-45-agriquant-energy-commodity-quant-terminal-jp.html",
    "icon": "🇯🇵",
    "desc": "商業用施設園芸向けオープンソース金融工学・エネルギー分析ターミナル。オランダTTF天然ガス価格、スパークスプレッド、電力売電アービトラージ、およびCO2施用ROI分析。",
    "tags": "articles ja article 45 agriquant energy commodity quant terminal jp html agriquant 温室エネルギ 一次産品オ プンソ ス クオンツ端末 商業用施設園芸向けオ プンソ ス金融工学 エネルギ 分析タ ミナル オランダttf天然ガス価格 スパ クスプレッド 電力売電ア ビトラ ジ およびco2施用roi"
  },
  {
    "title": "OpenCEA：温室物理オープンソースPythonマイクロフレームワーク",
    "cat": "article",
    "url": "articles/ja/article-46-opencea-python-micro-framework-release-jp.html",
    "icon": "🇯🇵",
    "desc": "商業用温室物理モデリング、光生物学計算、および環境制御アルゴリズム向けオープンソースPythonフレームワーク「OpenCEA」の公開リリース。",
    "tags": "articles ja article 46 opencea python micro framework release jp html opencea 温室物理オ プンソ スpythonマイクロフレ ムワ ク 商業用温室物理モデリング 光生物学計算 および環境制御アルゴリズム向けオ プンソ スpythonフレ ムワ ク opencea の公開リリ ス"
  },
  {
    "title": "コンピュータビジョン＆施設園芸病害虫早期画像診断",
    "cat": "article",
    "url": "articles/ja/article-47-computer-vision-crop-disease-diagnostics-jp.html",
    "icon": "🇯🇵",
    "desc": "大規模施設園芸における灰色かび病（Botrytis cinerea）や鉄欠乏性クロロシスのコンピュータビジョンHSV画像色空間解析および自動処方。",
    "tags": "articles ja article 47 computer vision crop disease diagnostics jp html コンピュ タビジョン 施設園芸病害虫早期画像診断 大規模施設園芸における灰色かび病 botrytis cinerea や鉄欠乏性クロロシスのコンピュ タビジョンhsv画像色空間解析および自動処方"
  },
  {
    "title": "商業用温室10カ年CapEx/OpEx・IRR・NPV投資採算性モデリング",
    "cat": "article",
    "url": "articles/ja/article-48-greenhouse-capex-opex-irr-npv-financial-model-jp.html",
    "icon": "🇯🇵",
    "desc": "商業用ハイテク・フェンロー温室の大規模投資財務モデリング。平米単価CapEx（25,000-45,000円/m²）、DCFキャッシュフロー、内部収益率（IRR）、および正味現在価値（NPV）。",
    "tags": "articles ja article 48 greenhouse capex opex irr npv financial model jp html 商業用温室10カ年capex opex irr npv投資採算性モデリング 商業用ハイテク フェンロ 温室の大規模投資財務モデリング 平米単価capex 25 000 45 000円 m dcfキャッシュフロ 内部収益率 ir"
  },
  {
    "title": "循環養液栽培：化学化学種分化・デバイ-ヒュッケル活量＆沈殿飽和指数（SI）",
    "cat": "article",
    "url": "articles/ja/article-49-hydroponic-chemical-speciation-debye-huckel-jp.html",
    "icon": "🇯🇵",
    "desc": "循環式養液栽培の熱力学的イオン活量モデリング。デバイ-ヒュッケル式、リン酸二カルシウム・方解石の飽和指数（SI）計算によるドリップ点滴チューブ目詰まり防止。",
    "tags": "articles ja article 49 hydroponic chemical speciation debye huckel jp html 循環養液栽培 化学化学種分化 デバイ ヒュッケル活量 沈殿飽和指数 si 循環式養液栽培の熱力学的イオン活量モデリング デバイ ヒュッケル式 リン酸二カルシウム 方解石の飽和指数 si 計算によるドリップ点滴チュ ブ目詰まり防止"
  },
  {
    "title": "スマート温室エッジIoT＆MQTTフリート・テレメトリ設計",
    "cat": "article",
    "url": "articles/ja/article-50-smart-greenhouse-mqtt-edge-iot-fleet-jp.html",
    "icon": "🇯🇵",
    "desc": "大規模施設園芸向け産業用IoTアーキテクチャ。LoRaWAN、MQTTブローカー構成、JSONテレメトリ、および100台規模のエッジ異常検知システム。",
    "tags": "articles ja article 50 smart greenhouse mqtt edge iot fleet jp html スマ ト温室エッジiot mqttフリ ト テレメトリ設計 大規模施設園芸向け産業用iotア キテクチャ lorawan mqttブロ カ 構成 jsonテレメトリ および100台規模のエッジ異常検知システム"
  },
  {
    "title": "自律型温室AI：強化学習＆モデル予測制御（MPC）最適化",
    "cat": "article",
    "url": "articles/ja/article-51-autonomous-greenhouse-ai-mpc-reinforcement-learning-jp.html",
    "icon": "🇯🇵",
    "desc": "大規模商業温室の自律環境制御。深層強化学習とモデル予測制御（MPC）を融合し、24時間の外気象予測に基づき暖房エネルギーを22.4%削減 施設園芸・植物工場の定量工学解説と無料計算シミュレーターを公開 (Inwoovation Lab)。",
    "tags": "articles ja article 51 autonomous greenhouse ai mpc reinforcement learning jp html 自律型温室ai 強化学習 モデル予測制御 mpc 最適化 大規模商業温室の自律環境制御 深層強化学習とモデル予測制御 mpc を融合し 24時間の外気象予測に基づき暖房エネルギ を22 4 削減 施設園芸 植物工場"
  },
  {
    "title": "帯水層蓄熱システム (ATES) と産業用ヒートポンプの温室熱工学モデル",
    "cat": "article",
    "url": "articles/ja/article-52-aquifer-thermal-energy-storage-ates-heat-pump-jp.html",
    "icon": "🇯🇵",
    "desc": "Venlo型温室における帯水層蓄熱（ATES / WKO）ダブレット井戸システム、季節蓄熱回収効率、および高温産業用ヒートポンプのCOP熱力学モデル。",
    "tags": "articles ja article 52 aquifer thermal energy storage ates heat pump jp html 帯水層蓄熱システム ates と産業用ヒ トポンプの温室熱工学モデル venlo型温室における帯水層蓄熱 ates wko ダブレット井戸システム 季節蓄熱回収効率 および高温産業用ヒ トポンプのcop熱力学モデル"
  },
  {
    "title": "Vol. 53: バイオマス熱電併給 (CHP/BHKW) の SCR 排ガス浄化と生源 CO2",
    "cat": "article",
    "url": "articles/ja/article-53-biomass-chp-scr-co2-recovery-horticulture-jp.html",
    "icon": "🇯🇵",
    "desc": "商業用フェンロー型温室における木質バイオマス CHP (BHKW) の熱力学収支、V2O5-WO3/TiO2 SCR 脱硝・Pt/Pd エチレン酸化触媒、植物毒性閾値管理および生源 CO2 施用の経済性 ROI モデルを詳説。",
    "tags": "articles ja article 53 biomass chp scr co2 recovery horticulture jp html vol 53 バイオマス熱電併給 chp bhkw の scr 排ガス浄化と生源 co2 商業用フェンロ 型温室における木質バイオマス chp bhkw の熱力学収支 v2o5 wo3 tio2 scr 脱硝 pt pd エチレン酸化"
  },
  {
    "title": "Vol. 54: 商業用フェンロー温室における AI モデル予測制御 (MPC)",
    "cat": "article",
    "url": "articles/ja/article-54-ai-model-predictive-control-mpc-venlo-greenhouse-jp.html",
    "icon": "🇯🇵",
    "desc": "商業用フェンロー型連棟温室における非線形状態空間モデル、日没前 VPD 結露パージ、24–48時間ローリングホライズン MPC 目的関数、および EPEX SPOT / JEPX 電力スポット裁定による LED 補光シフトの熱力学・制御工学を詳説。",
    "tags": "articles ja article 54 ai model predictive control mpc venlo greenhouse jp html vol 54 商業用フェンロ 温室における ai モデル予測制御 mpc 商業用フェンロ 型連棟温室における非線形状態空間モデル 日没前 vpd 結露パ ジ 24 48時間ロ リングホライズン mpc 目的関数 および "
  },
  {
    "title": "Vol. 55: 閉鎖型循環養液栽培における養分吸収濃縮係数 (UCF) とイオン蓄積・排液率設計",
    "cat": "article",
    "url": "articles/ja/article-55-nutrient-uptake-concentration-factor-recirculating-hydroponics-jp.html",
    "icon": "🇯🇵",
    "desc": "EU水枠組指令(WFD)およびドイツWHG/DüVゼロ排出規制に適合する閉鎖型循環養液栽培の養分吸収濃縮係数(UCF)、根圏物質収支、Na⁺蓄積限界、およびISE動的ブレンド・RO研磨設計を数理詳説。",
    "tags": "articles ja article 55 nutrient uptake concentration factor recirculating hydroponics jp html vol 55 閉鎖型循環養液栽培における養分吸収濃縮係数 ucf とイオン蓄積 排液率設計 eu水枠組指令 wfd およびドイツwhg düvゼロ排出規制に適合する閉鎖型循環養液栽培の養分吸収"
  },
  {
    "title": "Vol. 56: 遠赤色光 (Far-Red)・拡張光合成有効放射",
    "cat": "article",
    "url": "articles/ja/article-56-far-red-photobiology-epar-phytochrome-photostationary-state-jp.html",
    "icon": "🇯🇵",
    "desc": "Zhen & Bugbee の ePAR (400–750 nm) 理論、エマーソン増強効果 (PSI/PSII)、フィトクロム光平衡状態 (PSS = Pfr/P_total) による草姿制御、および日没時 EOD-FR パルス照射と省エネ設計を数理詳説。",
    "tags": "articles ja article 56 far red photobiology epar phytochrome photostationary state jp html vol 56 遠赤色光 far red 拡張光合成有効放射 zhen bugbee の epar 400 750 nm 理論 エマ ソン増強効果 psi psii フィトクロム光平衡状態 pss p"
  },
  {
    "title": "Vol. 57: 自己負担 8% モデルの多層補助金スタッキング工学",
    "cat": "article",
    "url": "articles/ja/article-57-california-cea-greenhouse-electrification-grant-stacking-jp.html",
    "icon": "🇯🇵",
    "desc": "商業温室・植物工場の LED 化、ヒートポンプ電化、VFD 灌漑更新において最大 92% の非希薄化補助金回収を実現するカリフォルニア 4 層スタッキング数理、逐次純支出原則、および独 BLE/KfW・日 MAFF 制度比較を完全解説。",
    "tags": "articles ja article 57 california cea greenhouse electrification grant stacking jp html vol 57 自己負担 8 モデルの多層補助金スタッキング工学 商業温室 植物工場の led 化 ヒ トポンプ電化 vfd 灌漑更新において最大 92 の非希薄化補助金回収を実現するカリフォルニア 4 層"
  },
  {
    "title": "Vol. 58: 動的 CO₂ 施用速度論と RuBisCO 光合成熱力学",
    "cat": "article",
    "url": "articles/ja/article-58-dynamic-co2-enrichment-kinetics-rubisco-carboxylation-venlo-jp.html",
    "icon": "🇯🇵",
    "desc": "高軒高フェンロー温室の動的 CO₂ 施用工学：Farquhar-FvCB モデルによる RuBisCO カルボキシル化速度論、葉温アレニウス依存性と光呼吸抑制、天窓換気ロス物質収支、CHP 排ガス触媒精製と限界収益最適化を解説。",
    "tags": "articles ja article 58 dynamic co2 enrichment kinetics rubisco carboxylation venlo jp html vol 58 動的 co 施用速度論と rubisco 光合成熱力学 高軒高フェンロ 温室の動的 co 施用工学 farquhar fvcb モデルによる rubisco カルボキシル化速度論 葉温"
  },
  {
    "title": "日本語 施設園芸・スマート農業工学モノグラフ一覧 (58 論文)",
    "cat": "article",
    "url": "articles/ja/index.html",
    "icon": "🇯🇵",
    "desc": "商業用 Venlo 型ガラス温室の VPD 飽差熱力学・DIN V 18599 暖房負荷・EN 13031-1 構造設計・FvCB CO2 施用・養液化学平衡を解説する 58 編の日本語技術論文アーカイブ。",
    "tags": "articles ja index html 日本語 施設園芸 スマ ト農業工学モノグラフ一覧 58 論文 商業用 venlo 型ガラス温室の vpd 飽差熱力学 din v 18599 暖房負荷 en 13031 1 構造設計 fvcb co2 施用 養液化学平衡を解説する 58 編の日本語技術論文ア カイブ"
  },
  {
    "title": "Diffuse AR Glass vs. Multi-Layer PO Film",
    "cat": "part",
    "url": "benchmarks/diffuse-glass-vs-po-film-greenhouse-glazing-roi.html",
    "icon": "⚙️",
    "desc": "5-year commercial greenhouse glazing ROI benchmark comparing 4mm low-iron AR diffuse glass (91% hemispherical PAR, 65% haze) vs double-layer anti-drip PO.",
    "tags": "benchmarks diffuse glass vs po film greenhouse glazing roi html diffuse ar glass vs multi layer po film 5 year commercial greenhouse glazing roi benchmark comparing 4mm low iron ar diffuse g"
  },
  {
    "title": "Greenhouse Heat Pump vs Natural Gas Boiler Heating",
    "cat": "part",
    "url": "benchmarks/greenhouse-heat-pump-vs-gas-boiler-heating-cost.html",
    "icon": "⚙️",
    "desc": "Economic &amp; carbon lifecycle comparison between Industrial Air/Water Heat Pumps (COP 3.8) and Condensing Natural Gas Boilers (95% efficiency).",
    "tags": "benchmarks greenhouse heat pump vs gas boiler heating cost html greenhouse heat pump vs natural gas boiler heating economic amp carbon lifecycle comparison between industrial air water heat "
  },
  {
    "title": "Greenhouse LED Toplighting vs HPS 5-Year Energy",
    "cat": "part",
    "url": "benchmarks/greenhouse-led-vs-hps-lighting-efficiency-roi.html",
    "icon": "⚙️",
    "desc": "Comprehensive technical comparison between Horticultural LED fixtures (3.5 µmol/J) and High-Pressure Sodium (1.8 µmol/J) lamps.",
    "tags": "benchmarks greenhouse led vs hps lighting efficiency roi html greenhouse led toplighting vs hps 5 year energy comprehensive technical comparison between horticultural led fixtures 3 5 mol j "
  },
  {
    "title": "Greenhouse Hardware & Materials Benchmark Hub",
    "cat": "part",
    "url": "benchmarks/index.html",
    "icon": "⚙️",
    "desc": "Engineering comparison benchmarks for CEA growers: LED vs HPS lighting, Heat Pump vs Gas Boilers, Rockwool vs Cocopeat substrates, and Diffuse Glass vs PO film.",
    "tags": "benchmarks index html greenhouse hardware materials benchmark hub engineering comparison benchmarks for cea growers led vs hps lighting heat pump vs gas boilers rockwool vs cocopeat substrat"
  },
  {
    "title": "Rockwool vs Cocopeat Hydroponic Substrate",
    "cat": "part",
    "url": "benchmarks/rockwool-vs-cocopeat-hydroponic-substrate-comparison.html",
    "icon": "⚙️",
    "desc": "Agronomic comparison between Grodan Rockwool stone wool slabs and Cocopeat (coir) substrate.",
    "tags": "benchmarks rockwool vs cocopeat hydroponic substrate comparison html rockwool vs cocopeat hydroponic substrate agronomic comparison between grodan rockwool stone wool slabs and cocopeat coir"
  },
  {
    "title": "Toyohashi, Aichi Prefecture, Japan Climate Guide",
    "cat": "climate",
    "url": "climate/aichi-toyohashi-japan-protected-agriculture-guide.html",
    "icon": "🌍",
    "desc": "Precision CEA engineering and climate guide for commercial greenhouses in Toyohashi, Aichi Prefecture, Japan (34.8°N).",
    "tags": "climate aichi toyohashi japan protected agriculture guide html toyohashi aichi prefecture japan climate guide precision cea engineering and climate guide for commercial greenhouses in toyoha"
  },
  {
    "title": "Al Ain, Abu Dhabi, United Arab Emirates Climate",
    "cat": "climate",
    "url": "climate/al-ain-abu-dhabi-uae-desert-greenhouse-guide.html",
    "icon": "🌍",
    "desc": "Precision CEA engineering and climate guide for commercial greenhouses in Al Ain, Abu Dhabi, United Arab Emirates (24.2°N).",
    "tags": "climate al ain abu dhabi uae desert greenhouse guide html al ain abu dhabi united arab emirates climate precision cea engineering and climate guide for commercial greenhouses in al ain abu d"
  },
  {
    "title": "Almería, Spain Climate Guide",
    "cat": "climate",
    "url": "climate/almeria-spain-parral-greenhouse-climate-guide.html",
    "icon": "🌍",
    "desc": "Comprehensive CEA microclimate engineering guide for commercial Parral greenhouses in Almería, Spain (36.8°N).",
    "tags": "climate almeria spain parral greenhouse climate guide html almer a spain climate guide comprehensive cea microclimate engineering guide for commercial parral greenhouses in almer a spain 36 "
  },
  {
    "title": "Antalya (Aksu &amp; Kumluca), Turkey Climate Guide",
    "cat": "climate",
    "url": "climate/antalya-turkey-mediterranean-greenhouse-guide.html",
    "icon": "🌍",
    "desc": "Precision CEA engineering and climate guide for commercial greenhouses in Antalya (Aksu &amp; Kumluca), Turkey (36.9°N).",
    "tags": "climate antalya turkey mediterranean greenhouse guide html antalya aksu amp kumluca turkey climate guide precision cea engineering and climate guide for commercial greenhouses in antalya aks"
  },
  {
    "title": "Morehead (Appalachian Basin), Kentucky, USA",
    "cat": "climate",
    "url": "climate/appharvest-morehead-kentucky-cea-guide.html",
    "icon": "🌍",
    "desc": "Precision CEA engineering and climate guide for commercial greenhouses in Morehead (Appalachian Basin), Kentucky, USA (38.2°N).",
    "tags": "climate appharvest morehead kentucky cea guide html morehead appalachian basin kentucky usa precision cea engineering and climate guide for commercial greenhouses in morehead appalachian bas"
  },
  {
    "title": "Arava Valley / Ein Yahav, Israel Climate Guide",
    "cat": "climate",
    "url": "climate/arava-valley-israel-desert-fertigation-guide.html",
    "icon": "🌍",
    "desc": "Precision CEA engineering and climate guide for commercial greenhouses in Arava Valley / Ein Yahav, Israel (30.5°N).",
    "tags": "climate arava valley israel desert fertigation guide html arava valley ein yahav israel climate guide precision cea engineering and climate guide for commercial greenhouses in arava valley e"
  },
  {
    "title": "Bleiswijk, Netherlands Climate Guide",
    "cat": "climate",
    "url": "climate/bleiswijk-netherlands-cea-research-cluster.html",
    "icon": "🌍",
    "desc": "Precision CEA engineering and climate guide for commercial greenhouses in Bleiswijk, Netherlands (52.0°N).",
    "tags": "climate bleiswijk netherlands cea research cluster html bleiswijk netherlands climate guide precision cea engineering and climate guide for commercial greenhouses in bleiswijk netherlands 52"
  },
  {
    "title": "Bogotá Savanna, Colombia Climate Guide",
    "cat": "climate",
    "url": "climate/bogota-savanna-colombia-cut-flower-guide.html",
    "icon": "🌍",
    "desc": "Precision CEA engineering and climate guide for commercial greenhouses in Bogotá Savanna, Colombia (4.7°N).",
    "tags": "climate bogota savanna colombia cut flower guide html bogot savanna colombia climate guide precision cea engineering and climate guide for commercial greenhouses in bogot savanna colombia 4 "
  },
  {
    "title": "Brittany (Finistère), France Climate Guide",
    "cat": "climate",
    "url": "climate/brittany-finistere-france-tomato-cluster-guide.html",
    "icon": "🌍",
    "desc": "Precision CEA engineering and climate guide for commercial greenhouses in Brittany (Finistère), France (48.4°N).",
    "tags": "climate brittany finistere france tomato cluster guide html brittany finist re france climate guide precision cea engineering and climate guide for commercial greenhouses in brittany finist "
  },
  {
    "title": "Buyeo (Geum River Basin), South Korea Climate Guide",
    "cat": "climate",
    "url": "climate/buyeo-chungnam-korea-tomato-cluster-guide.html",
    "icon": "🌍",
    "desc": "Precision CEA engineering and climate guide for commercial greenhouses in Buyeo (Geum River Basin), South Korea (36.2°N).",
    "tags": "climate buyeo chungnam korea tomato cluster guide html buyeo geum river basin south korea climate guide precision cea engineering and climate guide for commercial greenhouses in buyeo geum r"
  },
  {
    "title": "Cameron Highlands, Pahang, Malaysia Climate Guide",
    "cat": "climate",
    "url": "climate/cameron-highlands-malaysia-tropical-highland-guide.html",
    "icon": "🌍",
    "desc": "Precision CEA engineering and climate guide for commercial greenhouses in Cameron Highlands, Pahang, Malaysia (4.5°N).",
    "tags": "climate cameron highlands malaysia tropical highland guide html cameron highlands pahang malaysia climate guide precision cea engineering and climate guide for commercial greenhouses in came"
  },
  {
    "title": "Cayambe, Pichincha, Ecuador Climate Guide",
    "cat": "climate",
    "url": "climate/cayambe-pichincha-ecuador-hyper-radiation-guide.html",
    "icon": "🌍",
    "desc": "Precision CEA engineering and climate guide for commercial greenhouses in Cayambe, Pichincha, Ecuador (0.0°N).",
    "tags": "climate cayambe pichincha ecuador hyper radiation guide html cayambe pichincha ecuador climate guide precision cea engineering and climate guide for commercial greenhouses in cayambe pichinc"
  },
  {
    "title": "Culiacán (Sinaloa Valley), Mexico Climate Guide",
    "cat": "climate",
    "url": "climate/culiacan-sinaloa-mexico-winter-vegetable-guide.html",
    "icon": "🌍",
    "desc": "Precision CEA engineering and climate guide for commercial greenhouses in Culiacán (Sinaloa Valley), Mexico (24.8°N).",
    "tags": "climate culiacan sinaloa mexico winter vegetable guide html culiac n sinaloa valley mexico climate guide precision cea engineering and climate guide for commercial greenhouses in culiac n si"
  },
  {
    "title": "Đà Lạt, Central Highlands, Vietnam Climate Guide",
    "cat": "climate",
    "url": "climate/dalat-vietnam-central-highlands-horticulture-guide.html",
    "icon": "🌍",
    "desc": "Precision CEA engineering and climate guide for commercial greenhouses in Đà Lạt, Central Highlands, Vietnam (11.9°N).",
    "tags": "climate dalat vietnam central highlands horticulture guide html l t central highlands vietnam climate guide precision cea engineering and climate guide for commercial greenhouses in l t cent"
  },
  {
    "title": "Delta / Fraser Valley, BC, Canada Climate Guide",
    "cat": "climate",
    "url": "climate/delta-fraser-valley-bc-canada-greenhouse-guide.html",
    "icon": "🌍",
    "desc": "Precision CEA engineering and climate guide for commercial greenhouses in Delta / Fraser Valley, BC, Canada (49.1°N).",
    "tags": "climate delta fraser valley bc canada greenhouse guide html delta fraser valley bc canada climate guide precision cea engineering and climate guide for commercial greenhouses in delta fraser"
  },
  {
    "title": "Gimje Smart Farm Valley, South Korea Climate Guide",
    "cat": "climate",
    "url": "climate/gimje-smart-farm-innovation-valley-korea-guide.html",
    "icon": "🌍",
    "desc": "Precision CEA engineering and climate guide for commercial greenhouses in Gimje Smart Farm Valley, South Korea (35.8°N).",
    "tags": "climate gimje smart farm innovation valley korea guide html gimje smart farm valley south korea climate guide precision cea engineering and climate guide for commercial greenhouses in gimje "
  },
  {
    "title": "Guyra (New England Plateau), NSW, Australia",
    "cat": "climate",
    "url": "climate/guyra-new-south-wales-australia-highland-tomato-guide.html",
    "icon": "🌍",
    "desc": "Precision CEA engineering and climate guide for commercial greenhouses in Guyra (New England Plateau), NSW, Australia (30.2°S).",
    "tags": "climate guyra new south wales australia highland tomato guide html guyra new england plateau nsw australia precision cea engineering and climate guide for commercial greenhouses in guyra new"
  },
  {
    "title": "Ierapetra, Crete, Greece Climate Guide",
    "cat": "climate",
    "url": "climate/ierapetra-crete-greece-solar-greenhouse-guide.html",
    "icon": "🌍",
    "desc": "Precision CEA engineering and climate guide for commercial greenhouses in Ierapetra, Crete, Greece (35.0°N).",
    "tags": "climate ierapetra crete greece solar greenhouse guide html ierapetra crete greece climate guide precision cea engineering and climate guide for commercial greenhouses in ierapetra crete gree"
  },
  {
    "title": "Global Ag-Climate Atlas: 40 Greenhouse Climate Hubs",
    "cat": "climate",
    "url": "climate/index.html",
    "icon": "🌍",
    "desc": "Compare 40 commercial greenhouse regions by latitude, Köppen climate class and seasonal Daily Light Integral (DLI) to plan screens, lighting and heating.",
    "tags": "climate index html global ag climate atlas 40 greenhouse climate hubs compare 40 commercial greenhouse regions by latitude köppen climate class and seasonal daily light integral dli to plan "
  },
  {
    "title": "Kochi (Tosa Bay), Japan Climate Guide",
    "cat": "climate",
    "url": "climate/kochi-japan-warm-climate-horticulture-guide.html",
    "icon": "🌍",
    "desc": "Precision CEA engineering and climate guide for commercial greenhouses in Kochi (Tosa Bay), Japan (33.6°N).",
    "tags": "climate kochi japan warm climate horticulture guide html kochi tosa bay japan climate guide precision cea engineering and climate guide for commercial greenhouses in kochi tosa bay japan 33 "
  },
  {
    "title": "Kunming (Spring City), Yunnan, China Climate Guide",
    "cat": "climate",
    "url": "climate/kunming-yunnan-china-asian-flower-capital-guide.html",
    "icon": "🌍",
    "desc": "Precision CEA engineering and climate guide for commercial greenhouses in Kunming (Spring City), Yunnan, China (25.0°N).",
    "tags": "climate kunming yunnan china asian flower capital guide html kunming spring city yunnan china climate guide precision cea engineering and climate guide for commercial greenhouses in kunming "
  },
  {
    "title": "Lake Naivasha (Rift Valley), Kenya Climate Guide",
    "cat": "climate",
    "url": "climate/lake-naivasha-kenya-geothermal-floriculture-guide.html",
    "icon": "🌍",
    "desc": "Precision CEA engineering and climate guide for commercial greenhouses in Lake Naivasha (Rift Valley), Kenya (0.7°S).",
    "tags": "climate lake naivasha kenya geothermal floriculture guide html lake naivasha rift valley kenya climate guide precision cea engineering and climate guide for commercial greenhouses in lake na"
  },
  {
    "title": "Leamington / Kingsville, Ontario, Canada Climate",
    "cat": "climate",
    "url": "climate/leamington-ontario-canada-greenhouse-guide.html",
    "icon": "🌍",
    "desc": "Precision CEA engineering and climate guide for commercial greenhouses in Leamington / Kingsville, Ontario, Canada (42.0°N).",
    "tags": "climate leamington ontario canada greenhouse guide html leamington kingsville ontario canada climate precision cea engineering and climate guide for commercial greenhouses in leamington king"
  },
  {
    "title": "Marana &amp; Tucson, Arizona, USA Climate Guide",
    "cat": "climate",
    "url": "climate/marana-tucson-arizona-hyper-solar-cea-guide.html",
    "icon": "🌍",
    "desc": "Precision CEA engineering and desert microclimate guide for commercial greenhouses in Marana and Tucson, Arizona, USA (32.4°N).",
    "tags": "climate marana tucson arizona hyper solar cea guide html marana amp tucson arizona usa climate guide precision cea engineering and desert microclimate guide for commercial greenhouses in mar"
  },
  {
    "title": "Miryang, Gyeongnam, South Korea Climate Guide",
    "cat": "climate",
    "url": "climate/miryang-gyeongnam-korea-strawberry-capital-guide.html",
    "icon": "🌍",
    "desc": "Precision CEA engineering and climate guide for commercial greenhouses in Miryang, Gyeongnam, South Korea (35.5°N).",
    "tags": "climate miryang gyeongnam korea strawberry capital guide html miryang gyeongnam south korea climate guide precision cea engineering and climate guide for commercial greenhouses in miryang gy"
  },
  {
    "title": "Murcia (Campo de Cartagena), Spain Climate Guide",
    "cat": "climate",
    "url": "climate/murcia-spain-precision-hydroponics-guide.html",
    "icon": "🌍",
    "desc": "Precision CEA engineering and climate guide for commercial greenhouses in Murcia (Campo de Cartagena), Spain (38.0°N).",
    "tags": "climate murcia spain precision hydroponics guide html murcia campo de cartagena spain climate guide precision cea engineering and climate guide for commercial greenhouses in murcia campo de "
  },
  {
    "title": "Naaldwijk (Westland East), Netherlands Climate",
    "cat": "climate",
    "url": "climate/naaldwijk-netherlands-floriculture-hub-guide.html",
    "icon": "🌍",
    "desc": "Precision CEA engineering and climate guide for commercial greenhouses in Naaldwijk (Westland East), Netherlands (52.0°N).",
    "tags": "climate naaldwijk netherlands floriculture hub guide html naaldwijk westland east netherlands climate precision cea engineering and climate guide for commercial greenhouses in naaldwijk west"
  },
  {
    "title": "Nonsan, Chungnam, South Korea Climate Guide",
    "cat": "climate",
    "url": "climate/nonsan-chungnam-korea-smart-berry-guide.html",
    "icon": "🌍",
    "desc": "Precision CEA engineering and climate guide for commercial greenhouses in Nonsan, Chungnam, South Korea (36.2°N).",
    "tags": "climate nonsan chungnam korea smart berry guide html nonsan chungnam south korea climate guide precision cea engineering and climate guide for commercial greenhouses in nonsan chungnam south"
  },
  {
    "title": "Nürnberg / Knoblauchsland, Bavaria Climate Guide",
    "cat": "climate",
    "url": "climate/nuernberg-knoblauchsland-bavaria-greenhouse-climate-guide.html",
    "icon": "🌍",
    "desc": "Precision CEA engineering and climate guide for commercial glasshouses in Nürnberg / Knoblauchsland, Bavaria (49.48°N).",
    "tags": "climate nuernberg knoblauchsland bavaria greenhouse climate guide html nürnberg knoblauchsland bavaria climate guide precision cea engineering and climate guide for commercial glasshouses in"
  },
  {
    "title": "Pukekohe, Auckland Region, New Zealand Climate",
    "cat": "climate",
    "url": "climate/pukekohe-auckland-new-zealand-greenhouse-guide.html",
    "icon": "🌍",
    "desc": "Precision CEA engineering and climate guide for commercial greenhouses in Pukekohe, Auckland Region, New Zealand (37.2°S).",
    "tags": "climate pukekohe auckland new zealand greenhouse guide html pukekohe auckland region new zealand climate precision cea engineering and climate guide for commercial greenhouses in pukekohe au"
  },
  {
    "title": "Querétaro (Agropark), Mexico Climate Guide",
    "cat": "climate",
    "url": "climate/queretaro-agropark-mexico-high-altitude-guide.html",
    "icon": "🌍",
    "desc": "Precision CEA engineering and climate guide for commercial greenhouses in Querétaro (Agropark), Mexico (20.6°N).",
    "tags": "climate queretaro agropark mexico high altitude guide html quer taro agropark mexico climate guide precision cea engineering and climate guide for commercial greenhouses in quer taro agropar"
  },
  {
    "title": "Ragusa / Vittoria, Sicily, Italy Climate Guide",
    "cat": "climate",
    "url": "climate/ragusa-sicily-italy-protected-cropping-guide.html",
    "icon": "🌍",
    "desc": "Precision CEA engineering and climate guide for commercial greenhouses in Ragusa / Vittoria, Sicily, Italy (36.9°N).",
    "tags": "climate ragusa sicily italy protected cropping guide html ragusa vittoria sicily italy climate guide precision cea engineering and climate guide for commercial greenhouses in ragusa vittoria"
  },
  {
    "title": "Al-Kharj / Riyadh Oasis, Saudi Arabia Climate Guide",
    "cat": "climate",
    "url": "climate/riyadh-al-kharj-saudi-arabia-desert-cea-guide.html",
    "icon": "🌍",
    "desc": "Precision CEA engineering and climate guide for commercial greenhouses in Al-Kharj / Riyadh Oasis, Saudi Arabia (24.7°N).",
    "tags": "climate riyadh al kharj saudi arabia desert cea guide html al kharj riyadh oasis saudi arabia climate guide precision cea engineering and climate guide for commercial greenhouses in al kharj"
  },
  {
    "title": "Salinas Valley, California, USA Climate Guide",
    "cat": "climate",
    "url": "climate/salinas-valley-california-salad-bowl-guide.html",
    "icon": "🌍",
    "desc": "Precision CEA engineering and climate guide for commercial greenhouses in Salinas Valley, California, USA (36.7°N).",
    "tags": "climate salinas valley california salad bowl guide html salinas valley california usa climate guide precision cea engineering and climate guide for commercial greenhouses in salinas valley c"
  },
  {
    "title": "Santa Maria, California, USA Climate Guide",
    "cat": "climate",
    "url": "climate/santa-maria-valley-california-berry-tunnel-guide.html",
    "icon": "🌍",
    "desc": "Precision CEA engineering and climate guide for commercial greenhouses in Santa Maria, California, USA (34.9°N).",
    "tags": "climate santa maria valley california berry tunnel guide html santa maria california usa climate guide precision cea engineering and climate guide for commercial greenhouses in santa maria c"
  },
  {
    "title": "Shouguang, Shandong, China Climate Guide",
    "cat": "climate",
    "url": "climate/shouguang-shandong-china-solar-greenhouse-guide.html",
    "icon": "🌍",
    "desc": "Precision CEA engineering and climate guide for commercial greenhouses in Shouguang, Shandong, China (36.9°N).",
    "tags": "climate shouguang shandong china solar greenhouse guide html shouguang shandong china climate guide precision cea engineering and climate guide for commercial greenhouses in shouguang shando"
  },
  {
    "title": "Souss-Massa Valley (Agadir), Morocco Climate Guide",
    "cat": "climate",
    "url": "climate/souss-massa-agadir-morocco-export-greenhouse-guide.html",
    "icon": "🌍",
    "desc": "Precision CEA engineering and climate guide for commercial greenhouses in Souss-Massa Valley (Agadir), Morocco (30.4°N).",
    "tags": "climate souss massa agadir morocco export greenhouse guide html souss massa valley agadir morocco climate guide precision cea engineering and climate guide for commercial greenhouses in sous"
  },
  {
    "title": "Stellenbosch / Boland, Western Cape, South Africa",
    "cat": "climate",
    "url": "climate/stellenbosch-western-cape-south-africa-guide.html",
    "icon": "🌍",
    "desc": "Precision CEA engineering and climate guide for commercial greenhouses in Stellenbosch / Boland, Western Cape, South Africa (33.9°S).",
    "tags": "climate stellenbosch western cape south africa guide html stellenbosch boland western cape south africa precision cea engineering and climate guide for commercial greenhouses in stellenbosch"
  },
  {
    "title": "Straelen / Lower Rhine, Germany Climate Guide",
    "cat": "climate",
    "url": "climate/straelen-lower-rhine-germany-horticulture-guide.html",
    "icon": "🌍",
    "desc": "Precision CEA engineering and climate guide for commercial greenhouses in Straelen / Lower Rhine, Germany (51.4°N).",
    "tags": "climate straelen lower rhine germany horticulture guide html straelen lower rhine germany climate guide precision cea engineering and climate guide for commercial greenhouses in straelen low"
  },
  {
    "title": "Adelaide Plains (Virginia), South Australia",
    "cat": "climate",
    "url": "climate/virginia-adelaide-plains-australia-guide.html",
    "icon": "🌍",
    "desc": "Precision CEA engineering and climate guide for commercial greenhouses in Adelaide Plains (Virginia), South Australia (34.7°S).",
    "tags": "climate virginia adelaide plains australia guide html adelaide plains virginia south australia precision cea engineering and climate guide for commercial greenhouses in adelaide plains virgi"
  },
  {
    "title": "Westland, Netherlands Climate Guide",
    "cat": "climate",
    "url": "climate/westland-netherlands-greenhouse-climate-guide.html",
    "icon": "🌍",
    "desc": "Precision CEA engineering and climate guide for commercial greenhouses in Westland, Netherlands (52.0°N).",
    "tags": "climate westland netherlands greenhouse climate guide html westland netherlands climate guide precision cea engineering and climate guide for commercial greenhouses in westland netherlands 5"
  },
  {
    "title": "Indoor Cannabis (Cannabis sativa) CEA Steering",
    "cat": "crop",
    "url": "crops/commercial-cannabis-microclimate-vpd-photobiology-guide.html",
    "icon": "🌱",
    "desc": "Precision CEA engineering guide for Commercial Greenhouse &amp; Indoor Cannabis (Cannabis sativa).",
    "tags": "crops commercial cannabis microclimate vpd photobiology guide html indoor cannabis cannabis sativa cea steering precision cea engineering guide for commercial greenhouse amp indoor cannabis "
  },
  {
    "title": "Strawberry (Fragaria × ananassa) CEA Steering Guide",
    "cat": "crop",
    "url": "crops/commercial-strawberry-greenhouse-climate-dli-guide.html",
    "icon": "🌱",
    "desc": "Precision CEA engineering guide for Commercial Greenhouse Strawberry (Fragaria × ananassa).",
    "tags": "crops commercial strawberry greenhouse climate dli guide html strawberry fragaria ananassa cea steering guide precision cea engineering guide for commercial greenhouse strawberry fragaria an"
  },
  {
    "title": "Cucumber (Cucumis sativus) CEA Steering Guide",
    "cat": "crop",
    "url": "crops/greenhouse-cucumber-high-humidity-transpiration-guide.html",
    "icon": "🌱",
    "desc": "Precision CEA engineering guide for Commercial Greenhouse Cucumber (Cucumis sativus).",
    "tags": "crops greenhouse cucumber high humidity transpiration guide html cucumber cucumis sativus cea steering guide precision cea engineering guide for commercial greenhouse cucumber cucumis sativu"
  },
  {
    "title": "Cut Rose (Rosa hybrida) CEA Steering Guide",
    "cat": "crop",
    "url": "crops/greenhouse-cut-flower-rose-microclimate-guide.html",
    "icon": "🌱",
    "desc": "Precision CEA engineering guide for Commercial Greenhouse Cut Rose (Rosa hybrida).",
    "tags": "crops greenhouse cut flower rose microclimate guide html cut rose rosa hybrida cea steering guide precision cea engineering guide for commercial greenhouse cut rose rosa hybrida"
  },
  {
    "title": "Eggplant / Aubergine (Solanum melongena) CEA",
    "cat": "crop",
    "url": "crops/greenhouse-eggplant-aubergine-microclimate-guide.html",
    "icon": "🌱",
    "desc": "Precision CEA engineering guide for Commercial Greenhouse Eggplant / Aubergine (Solanum melongena).",
    "tags": "crops greenhouse eggplant aubergine microclimate guide html eggplant aubergine solanum melongena cea precision cea engineering guide for commercial greenhouse eggplant aubergine solanum melo"
  },
  {
    "title": "Phalaenopsis Orchid (CAM) Microclimate, VPD",
    "cat": "crop",
    "url": "crops/greenhouse-phalaenopsis-orchid-climate-spike-induction-guide.html",
    "icon": "🌱",
    "desc": "Precision CEA engineering guide for Phalaenopsis Orchid Microclimate &amp; Spike Induction Guide.",
    "tags": "crops greenhouse phalaenopsis orchid climate spike induction guide html phalaenopsis orchid cam microclimate vpd precision cea engineering guide for phalaenopsis orchid microclimate amp spik"
  },
  {
    "title": "Sweet Pepper (Capsicum annuum) CEA Steering Guide",
    "cat": "crop",
    "url": "crops/greenhouse-sweet-pepper-climate-blossom-end-rot-guide.html",
    "icon": "🌱",
    "desc": "Precision CEA engineering guide for Commercial Greenhouse Sweet Pepper (Capsicum annuum).",
    "tags": "crops greenhouse sweet pepper climate blossom end rot guide html sweet pepper capsicum annuum cea steering guide precision cea engineering guide for commercial greenhouse sweet pepper capsic"
  },
  {
    "title": "Tomato (Solanum lycopersicum) CEA Steering Guide",
    "cat": "crop",
    "url": "crops/greenhouse-tomato-microclimate-vpd-steering-guide.html",
    "icon": "🌱",
    "desc": "Precision CEA engineering guide for Commercial Greenhouse Tomato (Solanum lycopersicum).",
    "tags": "crops greenhouse tomato microclimate vpd steering guide html tomato solanum lycopersicum cea steering guide precision cea engineering guide for commercial greenhouse tomato solanum lycopersi"
  },
  {
    "title": "Hydroponic Greenhouse Sweet Basil &amp; Culinary Herbs",
    "cat": "crop",
    "url": "crops/hydroponic-basil-culinary-herbs-climate-guide.html",
    "icon": "🌱",
    "desc": "Precision CEA engineering guide for Hydroponic Greenhouse Sweet Basil &amp; Culinary Herbs (Ocimum basilicum).",
    "tags": "crops hydroponic basil culinary herbs climate guide html hydroponic greenhouse sweet basil amp culinary herbs precision cea engineering guide for hydroponic greenhouse sweet basil amp culina"
  },
  {
    "title": "Crop Precision Steering Atlas: 10 Greenhouse Crops",
    "cat": "crop",
    "url": "crops/index.html",
    "icon": "🌱",
    "desc": "Biophysical crop steering blueprints for 10 major commercial greenhouse and vertical farm crops: Tomato, Strawberry, Cucumber, Sweet Pepper, Lettuce, Rose.",
    "tags": "crops index html crop precision steering atlas 10 greenhouse crops biophysical crop steering blueprints for 10 major commercial greenhouse and vertical farm crops tomato strawberry cucumber "
  },
  {
    "title": "Controlled Environment Leafy Greens &amp; Lettuce",
    "cat": "crop",
    "url": "crops/vertical-farm-lettuce-leafy-greens-tipburn-prevention-guide.html",
    "icon": "🌱",
    "desc": "Precision CEA engineering guide for Controlled Environment Leafy Greens &amp; Lettuce (Lactuca sativa).",
    "tags": "crops vertical farm lettuce leafy greens tipburn prevention guide html controlled environment leafy greens amp lettuce precision cea engineering guide for controlled environment leafy greens"
  },
  {
    "title": "The CEA Biophysics &amp; Greenhouse Engineering",
    "cat": "article",
    "url": "handbooks/index.html",
    "icon": "📖",
    "desc": "Open-access six-part Controlled Environment Agriculture compendium indexing 78 volumes (214 EN/DE/JA editions), 42 live biophysical calculators, and 192.",
    "tags": "handbooks index html the cea biophysics amp greenhouse engineering open access six part controlled environment agriculture compendium indexing 78 volumes 214 en de ja editions 42 live biophy"
  },
  {
    "title": "AgriMaster",
    "cat": "part",
    "url": "parts/index.html",
    "icon": "⚙️",
    "desc": "Industrial parametric search engine for commercial greenhouse components, fertigation valves, LED toplights, climate sensors, and Dutch bucket supplies.",
    "tags": "parts index html agrimaster industrial parametric search engine for commercial greenhouse components fertigation valves led toplights climate sensors and dutch bucket supplies"
  },
  {
    "title": "Vacuum Systems Engineering &amp; Semiconductor",
    "cat": "part",
    "url": "parts/vacuum-systems.html",
    "icon": "⚙️",
    "desc": "Industrial vacuum engineering catalog &amp; mechatronics specification suite. Featuring thermal evaporators (DEV), magnetron sputtering systems (DSP), hermetic.",
    "tags": "parts vacuum systems html vacuum systems engineering amp semiconductor industrial vacuum engineering catalog amp mechatronics specification suite featuring thermal evaporators dev magnetron "
  },
  {
    "title": "Deutscher Meisterfunk: Podcast für moderne",
    "cat": "article",
    "url": "podcasts/index.html",
    "icon": "🎙️",
    "desc": "Der deutsche Lernpodcast für Gewächshaustechnik, Nachrichten, Wissenschaft und die Gärtnermeister-Karriere. Gesprochen in langsamem, deutlichem Deutsch (A2/B1).",
    "tags": "podcasts index html deutscher meisterfunk podcast für moderne der deutsche lernpodcast für gewächshaustechnik nachrichten wissenschaft und die gärtnermeister karriere gesprochen in langsamem"
  },
  {
    "title": "About Smart Farm Engineering Lab",
    "cat": "sim",
    "url": "smartfarm/about.html",
    "icon": "🧪",
    "desc": "Learn about Smart Farm Engineering Lab&#x27;s mission to provide free, science-backed precision calculators for greenhouse growers, designers, and agricultural.",
    "tags": "smartfarm about html about smart farm engineering lab learn about smart farm engineering lab x27 s mission to provide free science backed precision calculators for greenhouse growers designe"
  },
  {
    "title": "Greenhouse CO2 Enrichment &amp; Cylinder Sizing",
    "cat": "sim",
    "url": "smartfarm/co2_calculator.html",
    "icon": "🧪",
    "desc": "Calculate greenhouse CO2 injection rates, target ppm enrichment, cylinder/tank consumption rates, and hourly enrichment costs for commercial growers.",
    "tags": "smartfarm co2 calculator html greenhouse co2 enrichment amp cylinder sizing calculate greenhouse co2 injection rates target ppm enrichment cylinder tank consumption rates and hourly enrichme"
  },
  {
    "title": "Contact & Inquiry",
    "cat": "sim",
    "url": "smartfarm/contact.html",
    "icon": "🧪",
    "desc": "Submit inquiries, feature requests, or partnership proposals for Smart Farm Engineering Lab's free greenhouse calculators and AgTech precision tools.",
    "tags": "smartfarm contact html contact inquiry submit inquiries feature requests or partnership proposals for smart farm engineering lab s free greenhouse calculators and agtech precision tools"
  },
  {
    "title": "Crop Disease &amp; Pest Diagnosis Tool",
    "cat": "sim",
    "url": "smartfarm/diagnosis.html",
    "icon": "🧪",
    "desc": "Free AI-powered crop disease and pest diagnosis for tomato, strawberry, blueberry, melon, and pepper.",
    "tags": "smartfarm diagnosis html crop disease amp pest diagnosis tool free ai powered crop disease and pest diagnosis for tomato strawberry blueberry melon and pepper"
  },
  {
    "title": "Daily Light Integral (DLI) &amp; LED Electricity ROI",
    "cat": "sim",
    "url": "smartfarm/dli_calculator.html",
    "icon": "🧪",
    "desc": "Calculate Daily Light Integral (DLI) targets, supplemental LED PPFD requirements, photoperiod hours, and daily/monthly electricity ROI costs for commercial.",
    "tags": "smartfarm dli calculator html daily light integral dli amp led electricity roi calculate daily light integral dli targets supplemental led ppfd requirements photoperiod hours and daily month"
  },
  {
    "title": "Fertigation Stock Tank Calculator",
    "cat": "sim",
    "url": "smartfarm/fertigation.html",
    "icon": "🧪",
    "desc": "Calculate precise raw fertilizer compounding weights and acid neutralization dosages for greenhouse stock tank fertigation.",
    "tags": "smartfarm fertigation html fertigation stock tank calculator calculate precise raw fertilizer compounding weights and acid neutralization dosages for greenhouse stock tank fertigation"
  },
  {
    "title": "GreenPocket: Home Gardening &amp; Smart Hydroponics",
    "cat": "sim",
    "url": "smartfarm/greenpocket.html",
    "icon": "🧪",
    "desc": "Curated selection of home indoor farming kits, grow LEDs, and nutrient sensors for urban gardeners.",
    "tags": "smartfarm greenpocket html greenpocket home gardening amp smart hydroponics curated selection of home indoor farming kits grow leds and nutrient sensors for urban gardeners"
  },
  {
    "title": "Greenhouse Heat Loss Calculator",
    "cat": "sim",
    "url": "smartfarm/heat_loss.html",
    "icon": "🧪",
    "desc": "Calculate maximum greenhouse heating load in kW and BTU/h using ASABE EP406 Q=UAΔT heat transfer formulas, wind infiltration modifiers, regional climate.",
    "tags": "smartfarm heat loss html greenhouse heat loss calculator calculate maximum greenhouse heating load in kw and btu h using asabe ep406 q ua t heat transfer formulas wind infiltration modifiers"
  },
  {
    "title": "Smart Farm Engineering Lab",
    "cat": "sim",
    "url": "smartfarm/index.html",
    "icon": "🧪",
    "desc": "Free online precision engineering tools for greenhouse growers: VPD calculator, fertigation solver, heat loss estimator, mixing valve sizer, crop diagnosis.",
    "tags": "smartfarm index html smart farm engineering lab free online precision engineering tools for greenhouse growers vpd calculator fertigation solver heat loss estimator mixing valve sizer crop d"
  },
  {
    "title": "3D Commercial Greenhouse Digital Twin &amp; Physics",
    "cat": "sim",
    "url": "smartfarm/korean_greenhouse_3d.html",
    "icon": "🧪",
    "desc": "Interactive 3D digital twin for multi-span arch poly and Venlo glass greenhouses.",
    "tags": "smartfarm korean greenhouse 3d html 3d commercial greenhouse digital twin amp physics interactive 3d digital twin for multi span arch poly and venlo glass greenhouses"
  },
  {
    "title": "Optimization of Vapor Pressure Deficit (VPD)",
    "cat": "sim",
    "url": "smartfarm/library_vpd_optimization_tomato.html",
    "icon": "🧪",
    "desc": "Leaf-to-air Vapor Pressure Deficit (VPD) governs stomatal transpiration, xylem calcium mass-flow, Blossom-End Rot prevention, and greenhouse tomato yield.",
    "tags": "smartfarm library vpd optimization tomato html optimization of vapor pressure deficit vpd leaf to air vapor pressure deficit vpd governs stomatal transpiration xylem calcium mass flow blosso"
  },
  {
    "title": "Greenhouse Supplemental Lighting Calculator",
    "cat": "sim",
    "url": "smartfarm/lighting_efficacy.html",
    "icon": "🧪",
    "desc": "Calculate greenhouse supplemental PPFD, daily DLI contribution, electrical power demand, and financial payback ROI comparing 1000W HPS with high-efficacy LED.",
    "tags": "smartfarm lighting efficacy html greenhouse supplemental lighting calculator calculate greenhouse supplemental ppfd daily dli contribution electrical power demand and financial payback roi c"
  },
  {
    "title": "Global Agricultural Market Index",
    "cat": "sim",
    "url": "smartfarm/market.html",
    "icon": "🧪",
    "desc": "Real-time tracking of global wholesale prices for agricultural commodities including tomatoes, cucumbers, peppers, and natural gas.",
    "tags": "smartfarm market html global agricultural market index real time tracking of global wholesale prices for agricultural commodities including tomatoes cucumbers peppers and natural gas"
  },
  {
    "title": "Greenhouse 3-Way Mixing Valve Kv Calculator",
    "cat": "sim",
    "url": "smartfarm/mixing_valve.html",
    "icon": "🧪",
    "desc": "Calculate the correct Kv coefficient, DN pipe diameter, and flow rates for greenhouse heating 3-way mixing valves.",
    "tags": "smartfarm mixing valve html greenhouse 3 way mixing valve kv calculator calculate the correct kv coefficient dn pipe diameter and flow rates for greenhouse heating 3 way mixing valves"
  },
  {
    "title": "Boiler vs Heat Pump ROI Simulator",
    "cat": "sim",
    "url": "smartfarm/roi_simulator.html",
    "icon": "🧪",
    "desc": "Compare annual heating costs between conventional boilers (gas, oil, LPG) and heat pumps.",
    "tags": "smartfarm roi simulator html boiler vs heat pump roi simulator compare annual heating costs between conventional boilers gas oil lpg and heat pumps"
  },
  {
    "title": "Smartfarm WFC Bed &amp; Hydronic Layout Planner",
    "cat": "sim",
    "url": "smartfarm/smartfarm_layout_wfc.html",
    "icon": "🧪",
    "desc": "Autonomous Wave Function Collapse (WFC) and A* pathfinding algorithm for smart farm greenhouse design.",
    "tags": "smartfarm smartfarm layout wfc html smartfarm wfc bed amp hydronic layout planner autonomous wave function collapse wfc and a pathfinding algorithm for smart farm greenhouse design"
  },
  {
    "title": "Plant Transpiration Calculator",
    "cat": "sim",
    "url": "smartfarm/transpiration.html",
    "icon": "🧪",
    "desc": "Calculate real-time crop transpiration rates using the biophysical Penman-Monteith equation.",
    "tags": "smartfarm transpiration html plant transpiration calculator calculate real time crop transpiration rates using the biophysical penman monteith equation"
  },
  {
    "title": "Vertical Farming DLI Calculator",
    "cat": "sim",
    "url": "smartfarm/vertical_dli.html",
    "icon": "🧪",
    "desc": "Calculate Daily Light Integral (DLI), LED PPFD requirements, photoperiod optimization, and thermal heat dissipation for vertical farming and indoor growing.",
    "tags": "smartfarm vertical dli html vertical farming dli calculator calculate daily light integral dli led ppfd requirements photoperiod optimization and thermal heat dissipation for vertical farmin"
  },
  {
    "title": "Leaf VPD Calculator",
    "cat": "sim",
    "url": "smartfarm/vpd.html",
    "icon": "🧪",
    "desc": "Calculate leaf-to-air Vapor Pressure Deficit (VPD) in real-time using the Tetens equation.",
    "tags": "smartfarm vpd html leaf vpd calculator calculate leaf to air vapor pressure deficit vpd in real time using the tetens equation"
  },
  {
    "title": "OpenCEA Pro: Commercial Controlled Environment Agriculture Suite",
    "cat": "tool",
    "url": "suite/index.html",
    "icon": "🚀",
    "desc": "100% Free open-access OpenCEA engineering suite with 42 commercial CEA greenhouse physics calculators, Python CLI tools, and rule-based field diagnostic triage.",
    "tags": "suite index html opencea pro commercial controlled environment agriculture suite 100 free open access opencea engineering suite with 42 commercial cea greenhouse physics calculators python c"
  },
  {
    "title": "AgriQuant Commercial CEA Energy &amp; Commodity",
    "cat": "tool",
    "url": "tools/agriquant-greenhouse-energy-commodity-terminal.html",
    "icon": "🛠️",
    "desc": "Open-source financial and energy quant terminal for commercial high-tech greenhouses.",
    "tags": "tools agriquant greenhouse energy commodity terminal html agriquant commercial cea energy amp commodity open source financial and energy quant terminal for commercial high tech greenhouses"
  },
  {
    "title": "AgriVision: In-Browser AI Computer Vision Crop",
    "cat": "tool",
    "url": "tools/agrivision-ai-crop-disease-analyzer.html",
    "icon": "🛠️",
    "desc": "Client-side AI computer vision analyzer for greenhouse leaf pathology. Real-time webcam or image upload, spectral chlorosis segmentation, bounding box lesion.",
    "tags": "tools agrivision ai crop disease analyzer html agrivision in browser ai computer vision crop client side ai computer vision analyzer for greenhouse leaf pathology real time webcam or image u"
  },
  {
    "title": "Aquifer Thermal Energy Storage (ATES) &amp; Heat Pump",
    "cat": "tool",
    "url": "tools/ates-aquifer-thermal-energy-storage-heat-pump-simulator.html",
    "icon": "🛠️",
    "desc": "Industrial CEA Aquifer Thermal Energy Storage (ATES) doublet well and heat pump simulator.",
    "tags": "tools ates aquifer thermal energy storage heat pump simulator html aquifer thermal energy storage ates amp heat pump industrial cea aquifer thermal energy storage ates doublet well and heat "
  },
  {
    "title": "CHP Flue Gas SCR Denitrification &amp; Urea Dosing",
    "cat": "tool",
    "url": "tools/chp-flue-gas-scr-urea-dosing-calculator.html",
    "icon": "🛠️",
    "desc": "Industrial Selective Catalytic Reduction (SCR) calculator for natural gas CHP engines.",
    "tags": "tools chp flue gas scr urea dosing calculator html chp flue gas scr denitrification amp urea dosing industrial selective catalytic reduction scr calculator for natural gas chp engines"
  },
  {
    "title": "Closed-Loop Hydroponic Drainage [Tool]",
    "cat": "tool",
    "url": "tools/closed-loop-nutrient-recirculation-ion-balance-simulator.html",
    "icon": "🛠️",
    "desc": "Commercial greenhouse closed-loop hydroponics drainage reuse simulator. Models multi-cycle Na/Cl accumulation, Davies ionic activity coefficients, and German.",
    "tags": "tools closed loop nutrient recirculation ion balance simulator html closed loop hydroponic drainage tool commercial greenhouse closed loop hydroponics drainage reuse simulator models multi c"
  },
  {
    "title": "Closed-Loop RO Desalination &amp; Energy Recovery",
    "cat": "tool",
    "url": "tools/closed-loop-reverse-osmosis-desalination-energy-optimizer.html",
    "icon": "🛠️",
    "desc": "Industrial engineering calculator for greenhouse reverse osmosis (RO) membrane flux (LMH), specific energy consumption (kWh/m3), sodium Na+ rejection.",
    "tags": "tools closed loop reverse osmosis desalination energy optimizer html closed loop ro desalination amp energy recovery industrial engineering calculator for greenhouse reverse osmosis ro membr"
  },
  {
    "title": "Biochemical Farquhar (FvCB) Leaf Photosynthesis",
    "cat": "tool",
    "url": "tools/co2-enrichment-leaf-photosynthesis-farquhar-calculator.html",
    "icon": "🛠️",
    "desc": "Industrial plant physiology calculator for Farquhar-von Caemmerer-Berry (FvCB) C3 leaf photosynthesis, Rubisco kinetics (Vcmax), electron transport (J).",
    "tags": "tools co2 enrichment leaf photosynthesis farquhar calculator html biochemical farquhar fvcb leaf photosynthesis industrial plant physiology calculator for farquhar von caemmerer berry fvcb c"
  },
  {
    "title": "CEA Feasibility &amp; Grant Dossier Generator",
    "cat": "tool",
    "url": "tools/commercial-feasibility-grant-dossier-generator.html",
    "icon": "🛠️",
    "desc": "Institutional agricultural feasibility modeler and non-dilutive grant dossier generator across 50 US states.",
    "tags": "tools commercial feasibility grant dossier generator html cea feasibility amp grant dossier generator institutional agricultural feasibility modeler and non dilutive grant dossier generator "
  },
  {
    "title": "Crop Steering Matrix (Generative vs Vegetative)",
    "cat": "tool",
    "url": "tools/crop-steering-generative-vegetative-matrix.html",
    "icon": "🛠️",
    "desc": "Industrial crop steering optimizer for high-wire greenhouse tomatoes, peppers, and cannabis.",
    "tags": "tools crop steering generative vegetative matrix html crop steering matrix generative vs vegetative industrial crop steering optimizer for high wire greenhouse tomatoes peppers and cannabis"
  },
  {
    "title": "Xylem Calcium Flux &amp; Blossom-End Rot (BER) Risk",
    "cat": "tool",
    "url": "tools/crop-transpiration-calcium-blossom-end-rot-risk-model.html",
    "icon": "🛠️",
    "desc": "Industrial plant physiology calculator for xylem calcium transport kinetics, transpiration pull, and Blossom-End Rot (BER) risk forecasting in commercial.",
    "tags": "tools crop transpiration calcium blossom end rot risk model html xylem calcium flux amp blossom end rot ber risk industrial plant physiology calculator for xylem calcium transport kinetics t"
  },
  {
    "title": "Crop Yield &amp; Biomass Accumulation DLI Forecaster",
    "cat": "tool",
    "url": "tools/crop-yield-biomass-dli-forecaster.html",
    "icon": "🛠️",
    "desc": "Predictive photosynthetic dry matter accumulation, Light Use Efficiency (LUE), and weekly commercial crop harvest yields based on cumulative Daily Light.",
    "tags": "tools crop yield biomass dli forecaster html crop yield amp biomass accumulation dli forecaster predictive photosynthetic dry matter accumulation light use efficiency lue and weekly commerci"
  },
  {
    "title": "Greenhouse Digital Twin Microclimate Simulator",
    "cat": "tool",
    "url": "tools/digital-twin-greenhouse-simulator.html",
    "icon": "🛠️",
    "desc": "Industrial-grade interactive Venlo greenhouse digital twin simulator. Model real-time solar radiation, VPD, crop transpiration, thermal screens.",
    "tags": "tools digital twin greenhouse simulator html greenhouse digital twin microclimate simulator industrial grade interactive venlo greenhouse digital twin simulator model real time solar radiati"
  },
  {
    "title": "DLI &amp; LED Spectrum Photomorphogenesis Calculator",
    "cat": "tool",
    "url": "tools/dli-spectrum-photomorphogenesis-calculator.html",
    "icon": "🛠️",
    "desc": "Industrial-grade Daily Light Integral (DLI) & Far-Red (730nm) Emerson Enhancement Effect spectral calculator for commercial greenhouse horticulture.",
    "tags": "tools dli spectrum photomorphogenesis calculator html dli amp led spectrum photomorphogenesis calculator industrial grade daily light integral dli far red 730nm emerson enhancement effect sp"
  },
  {
    "title": "EU Greenhouse Energy Audit",
    "cat": "tool",
    "url": "tools/eu-greenhouse-energy-hofnachfolge-roi-simulator.html",
    "icon": "🇩🇪",
    "desc": "Interactive European glasshouse energy modernization (DIN V 18599, EN 13031-1, BLE 40% CAPEX grant, BEHG CO2 tax savings) and German farm succession.",
    "tags": "tools eu greenhouse energy hofnachfolge roi simulator html eu greenhouse energy audit interactive european glasshouse energy modernization din v 18599 en 13031 1 ble 40 capex grant behg co2 "
  },
  {
    "title": "Greenhouse Hourly Penman-Monteith",
    "cat": "tool",
    "url": "tools/evapotranspiration-penman-monteith-calculator.html",
    "icon": "🛠️",
    "desc": "Industrial FAO-56 Penman-Monteith hourly crop evapotranspiration (ETc), canopy resistance (rc), and aerodynamic resistance (ra) calculator for commercial.",
    "tags": "tools evapotranspiration penman monteith calculator html greenhouse hourly penman monteith industrial fao 56 penman monteith hourly crop evapotranspiration etc canopy resistance rc and aerod"
  },
  {
    "title": "High-Pressure Fogging &amp; Evaporative Cooling",
    "cat": "tool",
    "url": "tools/fogging-nozzle-droplet-evaporative-cooling-engine.html",
    "icon": "🛠️",
    "desc": "Industrial 70 bar high-pressure fogging calculator. Compute Sauter Mean Diameter (D32 &lt; 10µm), flash evaporation rates, adiabatic temperature drop, and leaf.",
    "tags": "tools fogging nozzle droplet evaporative cooling engine html high pressure fogging amp evaporative cooling industrial 70 bar high pressure fogging calculator compute sauter mean diameter d32"
  },
  {
    "title": "Global Agri-Subsidy &amp; Grant Navigator",
    "cat": "tool",
    "url": "tools/global-agri-subsidy-grant-navigator.html",
    "icon": "🛠️",
    "desc": "Official California (CDFA SWEEP/HSP/AMMP/FPIP/PHP/OTPP, CARB FARMER, CEC), USDA, European (BLE/GAP), and South Korean agricultural subsidy intelligence.",
    "tags": "tools global agri subsidy grant navigator html global agri subsidy amp grant navigator official california cdfa sweep hsp ammp fpip php otpp carb farmer cec usda european ble gap and south k"
  },
  {
    "title": "3D WebGL Venlo Greenhouse Digital Twin &amp; Real-Time",
    "cat": "tool",
    "url": "tools/greenhouse-3d-digital-twin-simulator.html",
    "icon": "🛠️",
    "desc": "Interactive 3D WebGL Venlo glasshouse digital twin. Real-time solar trajectory shadow mapping, dynamic thermal screen deployment, roof vent airflow dynamics.",
    "tags": "tools greenhouse 3d digital twin simulator html 3d webgl venlo greenhouse digital twin amp real time interactive 3d webgl venlo glasshouse digital twin real time solar trajectory shadow mapp"
  },
  {
    "title": "Autonomous Climate Computer AI &amp; Model Predictive",
    "cat": "tool",
    "url": "tools/greenhouse-autonomous-ai-climate-controller.html",
    "icon": "🛠️",
    "desc": "Reinforcement learning and Model Predictive Control (MPC) simulator for autonomous greenhouse climate computers, optimizing 24h temperature trajectories.",
    "tags": "tools greenhouse autonomous ai climate controller html autonomous climate computer ai amp model predictive reinforcement learning and model predictive control mpc simulator for autonomous gr"
  },
  {
    "title": "Greenhouse Biological Pest Control (IPM)",
    "cat": "tool",
    "url": "tools/greenhouse-biological-pest-control-ipm-calculator.html",
    "icon": "🛠️",
    "desc": "Industrial Integrated Pest Management (IPM) bio-control calculator for commercial greenhouses.",
    "tags": "tools greenhouse biological pest control ipm calculator html greenhouse biological pest control ipm industrial integrated pest management ipm bio control calculator for commercial greenhouse"
  },
  {
    "title": "Greenhouse Biomass CHP &amp; Waste Heat ROI Simulator",
    "cat": "tool",
    "url": "tools/greenhouse-biomass-chp-energy-roi-calculator.html",
    "icon": "🛠️",
    "desc": "Interactive precision engineering calculator for greenhouse biomass-fired CHP systems: model wood-chip fuel costs, fossil natural gas replacement, SCR CO2.",
    "tags": "tools greenhouse biomass chp energy roi calculator html greenhouse biomass chp amp waste heat roi simulator interactive precision engineering calculator for greenhouse biomass fired chp syst"
  },
  {
    "title": "10-Year CapEx, OpEx, IRR &amp; NPV Investment Engine",
    "cat": "tool",
    "url": "tools/greenhouse-capex-opex-10year-roi-calculator.html",
    "icon": "🛠️",
    "desc": "Industrial financial engineering calculator for high-tech commercial glasshouse investments: CapEx breakdown, 10-year OpEx cash flows, Internal Rate.",
    "tags": "tools greenhouse capex opex 10year roi calculator html 10 year capex opex irr amp npv investment engine industrial financial engineering calculator for high tech commercial glasshouse invest"
  },
  {
    "title": "Greenhouse CO2 Enrichment &amp; Economics Optimizer",
    "cat": "tool",
    "url": "tools/greenhouse-co2-enrichment-optimizer.html",
    "icon": "🛠️",
    "desc": "Industrial CO2 dosing kinetics and economics optimizer. Calculate pure liquid vs flue gas dosing costs, ventilation purge losses, and net crop yield gains.",
    "tags": "tools greenhouse co2 enrichment optimizer html greenhouse co2 enrichment amp economics optimizer industrial co2 dosing kinetics and economics optimizer calculate pure liquid vs flue gas dosi"
  },
  {
    "title": "EPEX SPOT Dynamic Tariff, Power-to-Heat",
    "cat": "tool",
    "url": "tools/greenhouse-energy-tariff-bess-p2h-arbitrage-calculator.html",
    "icon": "🛠️",
    "desc": "Commercial greenhouse EPEX SPOT negative electricity price, 20 kV Power-to-Heat electrode boiler, industrial heat pump, LFP-BESS, and stratified thermal.",
    "tags": "tools greenhouse energy tariff bess p2h arbitrage calculator html epex spot dynamic tariff power to heat commercial greenhouse epex spot negative electricity price 20 kv power to heat electr"
  },
  {
    "title": "Greenhouse Heating Load, Thermal Screen &amp; Green",
    "cat": "tool",
    "url": "tools/greenhouse-heating-load-thermal-screen-calculator.html",
    "icon": "🛠️",
    "desc": "Commercial engineering calculator for greenhouse peak heating demand, DIN V 18599 thermal screen savings, hydronic pipe rail sizing, and geothermal/biomass.",
    "tags": "tools greenhouse heating load thermal screen calculator html greenhouse heating load thermal screen amp green commercial engineering calculator for greenhouse peak heating demand din v 18599"
  },
  {
    "title": "Horticultural LED Thermal Heat-Sink &amp; Junction",
    "cat": "tool",
    "url": "tools/greenhouse-lighting-led-thermal-cfd-optimizer.html",
    "icon": "🛠️",
    "desc": "Industrial engineering calculator for horticultural LED fixture thermal dissipation, junction temperature (Tj), photon efficacy derating, and canopy.",
    "tags": "tools greenhouse lighting led thermal cfd optimizer html horticultural led thermal heat sink amp junction industrial engineering calculator for horticultural led fixture thermal dissipation "
  },
  {
    "title": "Greenhouse HAF Air Circulation &amp; CFD Air Velocity",
    "cat": "tool",
    "url": "tools/greenhouse-microclimate-cfd-air-velocity-optimizer.html",
    "icon": "🛠️",
    "desc": "Industrial CFD calculator for horizontal air flow (HAF) fan spacing, jet throw distance, Bernoulli air entrainment, and microclimate boundary layer.",
    "tags": "tools greenhouse microclimate cfd air velocity optimizer html greenhouse haf air circulation amp cfd air velocity industrial cfd calculator for horizontal air flow haf fan spacing jet throw "
  },
  {
    "title": "Smart Greenhouse Edge IoT &amp; MQTT Telemetry Fleet",
    "cat": "tool",
    "url": "tools/greenhouse-mqtt-edge-iot-fleet-simulator.html",
    "icon": "🛠️",
    "desc": "Industrial IoT simulator streaming real-time MQTT telemetry across 100 virtual greenhouse microclimate, slab TDR, and PAR sensor nodes with edge anomaly.",
    "tags": "tools greenhouse mqtt edge iot fleet simulator html smart greenhouse edge iot amp mqtt telemetry fleet industrial iot simulator streaming real time mqtt telemetry across 100 virtual greenhou"
  },
  {
    "title": "Greenhouse Natural Ventilation &amp; Buoyancy-Driven",
    "cat": "tool",
    "url": "tools/greenhouse-natural-ventilation-buoyancy-airflow-calculator.html",
    "icon": "🛠️",
    "desc": "Calculate natural ventilation rates, buoyancy-driven (stack effect) and wind-driven airflow through greenhouse vents using ASABE EP406.4 and De Jong &amp; Bot.",
    "tags": "tools greenhouse natural ventilation buoyancy airflow calculator html greenhouse natural ventilation amp buoyancy driven calculate natural ventilation rates buoyancy driven stack effect and "
  },
  {
    "title": "Greenhouse Structural Wind, Snow &amp; Crop Load",
    "cat": "tool",
    "url": "tools/greenhouse-structural-wind-snow-load-nen3859-calculator.html",
    "icon": "🛠️",
    "desc": "Industrial structural engineering calculator for Venlo greenhouse wind pressure (qw), snow load (qs), trellised crop wire weight, and column moment according.",
    "tags": "tools greenhouse structural wind snow load nen3859 calculator html greenhouse structural wind snow amp crop load industrial structural engineering calculator for venlo greenhouse wind pressu"
  },
  {
    "title": "Hydroponic Chemical Speciation &amp; Mineral",
    "cat": "tool",
    "url": "tools/hydroponic-chemical-speciation-precipitation-index.html",
    "icon": "🛠️",
    "desc": "Industrial chemical speciation calculator for hydroponic nutrient solutions: Debye-Hückel ionic strength, ion activity coefficients, and Saturation Index.",
    "tags": "tools hydroponic chemical speciation precipitation index html hydroponic chemical speciation amp mineral industrial chemical speciation calculator for hydroponic nutrient solutions debye hüc"
  },
  {
    "title": "Hydroponic Nutrient Formulation &amp; Ion Balance",
    "cat": "tool",
    "url": "tools/hydroponic-nutrient-solution-calculator.html",
    "icon": "🛠️",
    "desc": "Industrial-grade commercial hydroponic nutrient solution calculator. Optimize Hoagland, Sonneveld, and Steiner ionic ratios (NO3, K, Ca, Mg, P).",
    "tags": "tools hydroponic nutrient solution calculator html hydroponic nutrient formulation amp ion balance industrial grade commercial hydroponic nutrient solution calculator optimize hoagland sonne"
  },
  {
    "title": "Greenhouse &amp; Controlled Environment Engineering",
    "cat": "tool",
    "url": "tools/index.html",
    "icon": "🛠️",
    "desc": "A comprehensive suite of 42 industrial-grade commercial greenhouse engineering calculators, 3D WebGL digital twin simulators, 150-grant global agri-subsidy.",
    "tags": "tools index html greenhouse amp controlled environment engineering a comprehensive suite of 42 industrial grade commercial greenhouse engineering calculators 3d webgl digital twin simulators"
  },
  {
    "title": "Greenhouse Nutrient Uptake Concentration Factor",
    "cat": "tool",
    "url": "tools/nutrient-uptake-concentration-factor-analyzer.html",
    "icon": "🛠️",
    "desc": "Model nutrient uptake concentration factors in recirculating and drain-to-waste hydroponic systems.",
    "tags": "tools nutrient uptake concentration factor analyzer html greenhouse nutrient uptake concentration factor model nutrient uptake concentration factors in recirculating and drain to waste hydro"
  },
  {
    "title": "OpenCEA Developer Hub &amp; Interactive REST API / MCP",
    "cat": "tool",
    "url": "tools/opencea-python-micro-framework-playground.html",
    "icon": "🛠️",
    "desc": "Open-access developer documentation, interactive REST API playground, and open-source MCP server for greenhouse physics, VPD, DLI, evapotranspiration.",
    "tags": "tools opencea python micro framework playground html opencea developer hub amp interactive rest api mcp open access developer documentation interactive rest api playground and open source mc"
  },
  {
    "title": "Canopy Light Extinction (Beer-Lambert &amp; LAI)",
    "cat": "tool",
    "url": "tools/par-far-red-canopy-extinction-beer-lambert-calculator.html",
    "icon": "🛠️",
    "desc": "Industrial plant physiology calculator for multi-layer canopy light extinction (Beer-Lambert Law), Leaf Area Index (LAI), and diffuse vs direct photon.",
    "tags": "tools par far red canopy extinction beer lambert calculator html canopy light extinction beer lambert amp lai industrial plant physiology calculator for multi layer canopy light extinction b"
  },
  {
    "title": "Psychrometric Mollier Diagram &amp; Greenhouse",
    "cat": "tool",
    "url": "tools/psychrometric-mollier-greenhouse-dehumidifier.html",
    "icon": "🛠️",
    "desc": "Industrial psychrometric air state and greenhouse dehumidification energy optimizer. Compare mechanical heat pumps vs ridge vent purging.",
    "tags": "tools psychrometric mollier greenhouse dehumidifier html psychrometric mollier diagram amp greenhouse industrial psychrometric air state and greenhouse dehumidification energy optimizer comp"
  },
  {
    "title": "Rockwool Slab TDR Moisture &amp; Drain EC Balancing",
    "cat": "tool",
    "url": "tools/rockwool-substrate-tdr-moisture-drain-optimizer.html",
    "icon": "🛠️",
    "desc": "Industrial substrate water content (VWC %), dry-down kinetics, and drainage EC balancing calculator for commercial rockwool slab hydroponics.",
    "tags": "tools rockwool substrate tdr moisture drain optimizer html rockwool slab tdr moisture amp drain ec balancing industrial substrate water content vwc dry down kinetics and drainage ec balancin"
  },
  {
    "title": "Semi-Closed Greenhouse ATU &amp; Mollier h-x",
    "cat": "tool",
    "url": "tools/semi-closed-greenhouse-atu-mollier-simulator.html",
    "icon": "🛠️",
    "desc": "Interactive 3D Semi-Closed Greenhouse Air Treatment Unit (ATU) &amp; Mollier h-x psychrometric simulator.",
    "tags": "tools semi closed greenhouse atu mollier simulator html semi closed greenhouse atu amp mollier h x interactive 3d semi closed greenhouse air treatment unit atu amp mollier h x psychrometric "
  },
  {
    "title": "Substrate Matric Potential",
    "cat": "tool",
    "url": "tools/soil-matrix-water-potential-matric-suction-calculator.html",
    "icon": "🛠️",
    "desc": "Industrial agricultural physics calculator for substrate matric water potential (Psi_m), pF retention curves, van Genuchten model, and field capacity vs.",
    "tags": "tools soil matrix water potential matric suction calculator html substrate matric potential industrial agricultural physics calculator for substrate matric water potential psi m pf retention"
  },
  {
    "title": "Hot Water Buffer Tank Thermal Storage",
    "cat": "tool",
    "url": "tools/solar-thermal-buffer-tank-stratification-calculator.html",
    "icon": "🛠️",
    "desc": "Industrial engineering calculator for greenhouse hot-water buffer tank thermal storage (MWh), thermocline stratification stability, and night peak heating.",
    "tags": "tools solar thermal buffer tank stratification calculator html hot water buffer tank thermal storage industrial engineering calculator for greenhouse hot water buffer tank thermal storage mw"
  },
  {
    "title": "Closed-Loop UV-C Disinfection &amp; Pathogen [Tool]",
    "cat": "tool",
    "url": "tools/uvc-drainage-pathogen-disinfection-calculator.html",
    "icon": "🛠️",
    "desc": "Industrial UV-C radiation dose (mJ/cm2), UVT% water transmissivity, and Chick-Watson log-reduction kinetics for ToBRFV, Pythium, and Fusarium in hydroponic.",
    "tags": "tools uvc drainage pathogen disinfection calculator html closed loop uv c disinfection amp pathogen tool industrial uv c radiation dose mj cm2 uvt water transmissivity and chick watson log r"
  },
  {
    "title": "VenloCAD 3D - Industrial Parametric Greenhouse CAD",
    "cat": "tool",
    "url": "tools/venlocad-3d.html",
    "icon": "🛠️",
    "desc": "Industrial 3D parametric CAD and structural engineering engine for Venlo greenhouses.",
    "tags": "tools venlocad 3d html venlocad 3d industrial parametric greenhouse cad industrial 3d parametric cad and structural engineering engine for venlo greenhouses"
  },
  {
    "title": "Photomorphogenic Regulation of Anthocyanin",
    "cat": "wiki",
    "url": "wiki/anthocyanin_led_spectral_kinetics.html",
    "icon": "🧬",
    "desc": "Photomorphogenic regulation of Chalcone Synthase (CHS) and DFR gene expression via blue-to-red LED spectral ratios for anthocyanin induction.",
    "tags": "wiki anthocyanin led spectral kinetics html photomorphogenic regulation of anthocyanin photomorphogenic regulation of chalcone synthase chs and dfr gene expression via blue to red led spectr"
  },
  {
    "title": "Arugula / Rocket (Eruca vesicaria)",
    "cat": "wiki",
    "url": "wiki/arugula.html",
    "icon": "🧬",
    "desc": "Precision CEA engineering guide for hydroponic arugula (Eruca vesicaria): DLI photoperiod steering, sulfur-glucosinolate kinetics, and NFT EC control.",
    "tags": "wiki arugula html arugula rocket eruca vesicaria precision cea engineering guide for hydroponic arugula eruca vesicaria dli photoperiod steering sulfur glucosinolate kinetics and nft ec cont"
  },
  {
    "title": "Sweet Basil (Ocimum basilicum L.)",
    "cat": "wiki",
    "url": "wiki/basil.html",
    "icon": "🧬",
    "desc": "Hydroponic sweet basil (Ocimum basilicum) CEA engineering guide: LED spectrum steering for eugenol/linalool oils and Ca tip-burn prevention.",
    "tags": "wiki basil html sweet basil ocimum basilicum l hydroponic sweet basil ocimum basilicum cea engineering guide led spectrum steering for eugenol linalool oils and ca tip burn prevention"
  },
  {
    "title": "Xylem-Mediated Calcium Translocation Kinetics",
    "cat": "wiki",
    "url": "wiki/calcium_channel_xylem_transport.html",
    "icon": "🧬",
    "desc": "Xylem-mediated calcium translocation kinetics, mechanosensitive Ca2+ channels, and nocturnal root-pressure guttation steering in Solanaceae.",
    "tags": "wiki calcium channel xylem transport html xylem mediated calcium translocation kinetics xylem mediated calcium translocation kinetics mechanosensitive ca2 channels and nocturnal root pressur"
  },
  {
    "title": "Care Farming",
    "cat": "wiki",
    "url": "wiki/care_farming.html",
    "icon": "🧬",
    "desc": "Therapeutic Care Farming &amp; Barrier-Free CEA Engineering: clinical horticultural therapy, ergonomic glasshouse design, and sensory steering.",
    "tags": "wiki care farming html care farming therapeutic care farming amp barrier free cea engineering clinical horticultural therapy ergonomic glasshouse design and sensory steering"
  },
  {
    "title": "Pulse-Amplitude-Modulation (PAM) Fluorometry",
    "cat": "wiki",
    "url": "wiki/chlorophyll_fluorescence_pam_stress_kinetics.html",
    "icon": "🧬",
    "desc": "Pulse-Amplitude-Modulation (PAM) fluorometry modeling of PSII quantum yield (Fv/Fm) and NPQ relaxation kinetics during LED spectrum ramping.",
    "tags": "wiki chlorophyll fluorescence pam stress kinetics html pulse amplitude modulation pam fluorometry pulse amplitude modulation pam fluorometry modeling of psii quantum yield fv fm and npq rela"
  },
  {
    "title": "Canopy CO2 Enrichment Dynamics (1200 ppm)",
    "cat": "wiki",
    "url": "wiki/co2_injection_canopy_assimilation_kinetics.html",
    "icon": "🧬",
    "desc": "Canopy CO2 enrichment dynamics (1200 ppm), Rubisco carboxylation velocity (Vcmax), and photorespiration suppression under high PPFD regimes.",
    "tags": "wiki co2 injection canopy assimilation kinetics html canopy co2 enrichment dynamics 1200 ppm canopy co2 enrichment dynamics 1200 ppm rubisco carboxylation velocity vcmax and photorespiration"
  },
  {
    "title": "Cucumber (Cucumis sativus)",
    "cat": "wiki",
    "url": "wiki/cucumber.html",
    "icon": "🧬",
    "desc": "High-wire greenhouse cucumber (Cucumis sativus) CEA engineering guide: high-LAI transpiration modeling, VPD steering, and K-dominant fertigation.",
    "tags": "wiki cucumber html cucumber cucumis sativus high wire greenhouse cucumber cucumis sativus cea engineering guide high lai transpiration modeling vpd steering and k dominant fertigation"
  },
  {
    "title": "Thermodynamic Optimization of Daily Light",
    "cat": "wiki",
    "url": "wiki/dli_photomorphogenesis_steering.html",
    "icon": "🧬",
    "desc": "Thermodynamic optimization of Daily Light Integral (DLI) and Phytochrome Photostationary State (Pfr/Ptotal) in LED vertical farming canopies.",
    "tags": "wiki dli photomorphogenesis steering html thermodynamic optimization of daily light thermodynamic optimization of daily light integral dli and phytochrome photostationary state pfr ptotal in"
  },
  {
    "title": "Far-Red (730nm) Photon Fraction Steering",
    "cat": "wiki",
    "url": "wiki/far_red_shade_avoidance_yield_kinetics.html",
    "icon": "🧬",
    "desc": "End-of-day Far-Red (730 nm) phytochrome photo-equilibrium steering for 35% faster Leaf Area Index (LAI) closure without stem lodging.",
    "tags": "wiki far red shade avoidance yield kinetics html far red 730nm photon fraction steering end of day far red 730 nm phytochrome photo equilibrium steering for 35 faster leaf area index lai clo"
  },
  {
    "title": "Root Zone Temperature (RZT) Dynamics",
    "cat": "wiki",
    "url": "wiki/hydroponic_root_zone_temperature_respiration.html",
    "icon": "🧬",
    "desc": "Hydroponic Root Zone Temperature (RZT 18°C) chilling, dissolved oxygen saturation, mitochondrial ATP yield, and Pythium root rot suppression.",
    "tags": "wiki hydroponic root zone temperature respiration html root zone temperature rzt dynamics hydroponic root zone temperature rzt 18 c chilling dissolved oxygen saturation mitochondrial atp yie"
  },
  {
    "title": "400-1000nm Hyperspectral Leaf Reflectance",
    "cat": "wiki",
    "url": "wiki/hyperspectral_leaf_reflectance_nutrient_stress.html",
    "icon": "🧬",
    "desc": "400-1000 nm hyperspectral leaf reflectance and SVM machine learning classification for pre-symptomatic Fe vs. N chlorosis detection in CEA.",
    "tags": "wiki hyperspectral leaf reflectance nutrient stress html 400 1000nm hyperspectral leaf reflectance 400 1000 nm hyperspectral leaf reflectance and svm machine learning classification for pre "
  },
  {
    "title": "AgriAtlas CEA Engineering Encyclopedia",
    "cat": "wiki",
    "url": "wiki/index.html",
    "icon": "🧬",
    "desc": "AgriAtlas CEA Engineering Encyclopedia: quantitative crop steering, psychrometric VPD control, hydroponic fertigation, and plant physiology research.",
    "tags": "wiki index html agriatlas cea engineering encyclopedia agriatlas cea engineering encyclopedia quantitative crop steering psychrometric vpd control hydroponic fertigation and plant physiology"
  },
  {
    "title": "Real-Time Closed-Loop Machine Learning Ionic",
    "cat": "wiki",
    "url": "wiki/ion_selective_electrode_fertigation_ml.html",
    "icon": "🧬",
    "desc": "Closed-loop LSTM neural network and solid-state Ion-Selective Electrode (ISE) array for zero-discharge recirculating hydroponic fertigation.",
    "tags": "wiki ion selective electrode fertigation ml html real time closed loop machine learning ionic closed loop lstm neural network and solid state ion selective electrode ise array for zero disch"
  },
  {
    "title": "Curly Kale (Brassica oleracea var. sabellica)",
    "cat": "wiki",
    "url": "wiki/kale.html",
    "icon": "🧬",
    "desc": "CEA engineering guide for hydroponic curly kale: cold-stress DIF steering, glucosinolate and anthocyanin biosynthesis, and vertical farm LED spectrum.",
    "tags": "wiki kale html curly kale brassica oleracea var sabellica cea engineering guide for hydroponic curly kale cold stress dif steering glucosinolate and anthocyanin biosynthesis and vertical far"
  },
  {
    "title": "Glucosinolate Accumulation Kinetics",
    "cat": "wiki",
    "url": "wiki/kale_glucosinolate_cold_stress.html",
    "icon": "🧬",
    "desc": "Cold-night DIF (+8°C) and sulfate fertigation kinetics driving myrosinase (EC 3.2.1.147), glucoraphanin, and anthocyanin synthesis in kale.",
    "tags": "wiki kale glucosinolate cold stress html glucosinolate accumulation kinetics cold night dif 8 c and sulfate fertigation kinetics driving myrosinase ec 3 2 1 147 glucoraphanin and anthocyanin"
  },
  {
    "title": "Stoichiometric &amp; Kinetic Modeling of Rubisco",
    "cat": "wiki",
    "url": "wiki/kegg_carbon_rubisco_kinetics.html",
    "icon": "🧬",
    "desc": "Farquhar-von Caemmerer-Berry (FVCB) modeling of Rubisco carboxylation (Vcmax, Jmax) and KEGG carbon fixation under 1000 ppm CO2 enrichment.",
    "tags": "wiki kegg carbon rubisco kinetics html stoichiometric amp kinetic modeling of rubisco farquhar von caemmerer berry fvcb modeling of rubisco carboxylation vcmax jmax and kegg carbon fixation "
  },
  {
    "title": "KEGG Carotenoid Biosynthetic Pathway Flux",
    "cat": "wiki",
    "url": "wiki/kegg_carotenoid_lutein_photoprotection.html",
    "icon": "🧬",
    "desc": "KEGG carotenoid pathway (sly00906) flux and lycopene epsilon-cyclase up-regulation for lutein xanthophyll photoprotection under UV-A + high PPFD.",
    "tags": "wiki kegg carotenoid lutein photoprotection html kegg carotenoid biosynthetic pathway flux kegg carotenoid pathway sly00906 flux and lycopene epsilon cyclase up regulation for lutein xanthop"
  },
  {
    "title": "Metabolic Flux Analysis of Flavonoid",
    "cat": "wiki",
    "url": "wiki/kegg_flavonoid_secondary_metabolism.html",
    "icon": "🧬",
    "desc": "Metabolic flux analysis of the KEGG flavonoid biosynthesis pathway (sly00941) and flavonol synthase kinetics under thermal-osmotic steering.",
    "tags": "wiki kegg flavonoid secondary metabolism html metabolic flux analysis of flavonoid metabolic flux analysis of the kegg flavonoid biosynthesis pathway sly00941 and flavonol synthase kinetics "
  },
  {
    "title": "Lettuce (Lactuca sativa)",
    "cat": "wiki",
    "url": "wiki/lettuce.html",
    "icon": "🧬",
    "desc": "Hydroponic and vertical farm lettuce (Lactuca sativa) CEA engineering guide: DLI optimization, CFD airflow tip-burn mitigation, and NFT control.",
    "tags": "wiki lettuce html lettuce lactuca sativa hydroponic and vertical farm lettuce lactuca sativa cea engineering guide dli optimization cfd airflow tip burn mitigation and nft control"
  },
  {
    "title": "Navier-Stokes Fluid Dynamics Modeling of Leaf",
    "cat": "wiki",
    "url": "wiki/micro_airflow_boundary_layer_fluid_dynamics.html",
    "icon": "🧬",
    "desc": "3D Navier-Stokes fluid dynamics modeling of leaf boundary layer thickness (0.6 mm) and transpirational Ca2+ flux under 0.35 m/s vertical airflow.",
    "tags": "wiki micro airflow boundary layer fluid dynamics html navier stokes fluid dynamics modeling of leaf 3d navier stokes fluid dynamics modeling of leaf boundary layer thickness 0 6 mm and trans"
  },
  {
    "title": "Metagenomic Characterization of Rhizosphere",
    "cat": "wiki",
    "url": "wiki/microbial_rhizosphere_metagenomics.html",
    "icon": "🧬",
    "desc": "16S rRNA metagenomic characterization of PGPR pyoverdine siderophore iron chelation and Pythium suppression in organic coir hydroponics.",
    "tags": "wiki microbial rhizosphere metagenomics html metagenomic characterization of rhizosphere 16s rrna metagenomic characterization of pgpr pyoverdine siderophore iron chelation and pythium suppr"
  },
  {
    "title": "Pulsed Pre-Harvest UV-B (310nm) Irradiation",
    "cat": "wiki",
    "url": "wiki/microgreens_sulforaphane_enhancement_lighting.html",
    "icon": "🧬",
    "desc": "Pulsed pre-harvest UV-B (310 nm) elicitation up-regulating CYP79F1 and MYB28 for a 310% expansion of sulforaphane in Brassica microgreens.",
    "tags": "wiki microgreens sulforaphane enhancement lighting html pulsed pre harvest uv b 310nm irradiation pulsed pre harvest uv b 310 nm elicitation up regulating cyp79f1 and myb28 for a 310 expansi"
  },
  {
    "title": "Phosphate Transporter Gene Expression",
    "cat": "wiki",
    "url": "wiki/mycorrhizal_phosphate_transporter_kinetics.html",
    "icon": "🧬",
    "desc": "Arbuscular mycorrhizal symbiosis and Pht1 phosphate transporter gene expression kinetics under low-phosphorus (0.35 mM) organic hydroponics.",
    "tags": "wiki mycorrhizal phosphate transporter kinetics html phosphate transporter gene expression arbuscular mycorrhizal symbiosis and pht1 phosphate transporter gene expression kinetics under low "
  },
  {
    "title": "Circadian Clock Gating of Plastidic Nitrate",
    "cat": "wiki",
    "url": "wiki/nitrate_reductase_circadian_rhythm.html",
    "icon": "🧬",
    "desc": "Circadian clock (CCA1/LHY) gating of plastidic Nitrate Reductase (EC 1.7.1.1) phosphorylation and vacuolar nitrate purging under 16h photoperiods.",
    "tags": "wiki nitrate reductase circadian rhythm html circadian clock gating of plastidic nitrate circadian clock cca1 lhy gating of plastidic nitrate reductase ec 1 7 1 1 phosphorylation and vacuola"
  },
  {
    "title": "Osmotic Steering &amp; Translocational Sucrose",
    "cat": "wiki",
    "url": "wiki/osmotic_brix_salt_stress_kinetics.html",
    "icon": "🧬",
    "desc": "Osmotic root-zone EC steering, Sucrose Synthase (EC 2.4.1.13) activation, and phloem sugar unloading kinetics for high-Brix CEA fruit crops.",
    "tags": "wiki osmotic brix salt stress kinetics html osmotic steering amp translocational sucrose osmotic root zone ec steering sucrose synthase ec 2 4 1 13 activation and phloem sugar unloading kine"
  },
  {
    "title": "Oxalate Biosynthesis and Ascorbate Recycling",
    "cat": "wiki",
    "url": "wiki/oxalate_biosynthesis_ascorbate_recycling.html",
    "icon": "🧬",
    "desc": "Metabolic flux control of L-galactono-1,4-lactone dehydrogenase and oxalate reduction in Spinacia oleracea via 25% blue LED spectral steering.",
    "tags": "wiki oxalate biosynthesis ascorbate recycling html oxalate biosynthesis and ascorbate recycling metabolic flux control of l galactono 1 4 lactone dehydrogenase and oxalate reduction in spina"
  },
  {
    "title": "Paprika (Capsicum annuum)",
    "cat": "wiki",
    "url": "wiki/paprika.html",
    "icon": "🧬",
    "desc": "High-wire sweet pepper / paprika (Capsicum annuum) CEA engineering guide: cyclic fruit-set steering, ADT/DIF control, and Ca/K fertigation.",
    "tags": "wiki paprika html paprika capsicum annuum high wire sweet pepper paprika capsicum annuum cea engineering guide cyclic fruit set steering adt dif control and ca k fertigation"
  },
  {
    "title": "Bioenergetic Modeling of Photorespiratory",
    "cat": "wiki",
    "url": "wiki/photorespiratory_nitrogen_kinetics.html",
    "icon": "🧬",
    "desc": "Bioenergetic model coupling VPD stomatal closure, mesophyll CO2 limitation, and GS-GOGAT photorespiratory nitrogen flux in CEA Solanaceae.",
    "tags": "wiki photorespiratory nitrogen kinetics html bioenergetic modeling of photorespiratory bioenergetic model coupling vpd stomatal closure mesophyll co2 limitation and gs gogat photorespiratory"
  },
  {
    "title": "Acoustic Wave Resonance (1-5 kHz) Inducing",
    "cat": "wiki",
    "url": "wiki/plant_acoustic_frequency_stomatal_kinetics.html",
    "icon": "🧬",
    "desc": "Acoustic wave mechanosensory resonance (3.2 kHz at 80 dB) driving guard cell K+ influx, stomatal aperture expansion, and foliar Ca2+ uptake.",
    "tags": "wiki plant acoustic frequency stomatal kinetics html acoustic wave resonance 1 5 khz inducing acoustic wave mechanosensory resonance 3 2 khz at 80 db driving guard cell k influx stomatal ape"
  },
  {
    "title": "Lead-Free Perovskite Quantum Dot",
    "cat": "wiki",
    "url": "wiki/quantum_dot_wavelength_shifting_films.html",
    "icon": "🧬",
    "desc": "Lead-free Cs3Bi2Br9 perovskite quantum dot greenhouse films shifting 500-560 nm green solar photons to 660 nm red for +18.4% biomass yield.",
    "tags": "wiki quantum dot wavelength shifting films html lead free perovskite quantum dot lead free cs3bi2br9 perovskite quantum dot greenhouse films shifting 500 560 nm green solar photons to 660 nm"
  },
  {
    "title": "Scientific Research Library",
    "cat": "wiki",
    "url": "wiki/research.html",
    "icon": "🧬",
    "desc": "Chronological Index of PhD-Level CEA Plant Physiology, Bioenergetics, and Climate Steering Research Papers by Inwoovation Lab.",
    "tags": "wiki research html scientific research library chronological index of phd level cea plant physiology bioenergetics and climate steering research papers by inwoovation lab"
  },
  {
    "title": "Rhizosphere Proton (H+) Exudation and Cation",
    "cat": "wiki",
    "url": "wiki/rhizosphere_ph_cation_exchange_kinetics.html",
    "icon": "🧬",
    "desc": "Root plasma membrane H+-ATPase proton flux, substrate Cation Exchange Capacity (CEC), and autonomous pH stabilization via NO3-/NH4+ dosing.",
    "tags": "wiki rhizosphere ph cation exchange kinetics html rhizosphere proton h exudation and cation root plasma membrane h atpase proton flux substrate cation exchange capacity cec and autonomous ph"
  },
  {
    "title": "Droplet Size Distribution (30-80 μm)",
    "cat": "wiki",
    "url": "wiki/root_zone_hypoxia_aeroponic_droplet_physics.html",
    "icon": "🧬",
    "desc": "Ultrasonic aeroponic droplet size distribution (40-60 um) optimization for 5-10 um root liquid film thickness and maximal DO respiration.",
    "tags": "wiki root zone hypoxia aeroponic droplet physics html droplet size distribution 30 80 m ultrasonic aeroponic droplet size distribution 40 60 um optimization for 5 10 um root liquid film thic"
  },
  {
    "title": "Plastidic Mitochondrial Coupling &amp; Root-Zone",
    "cat": "wiki",
    "url": "wiki/rootzone_dissolved_oxygen_respiration.html",
    "icon": "🧬",
    "desc": "Hydroponic root-zone dissolved oxygen (DO &gt; 9 mg/L) nanobubble dynamics, mitochondrial ATP synthase coupling, and active nitrate symport.",
    "tags": "wiki rootzone dissolved oxygen respiration html plastidic mitochondrial coupling amp root zone hydroponic root zone dissolved oxygen do gt 9 mg l nanobubble dynamics mitochondrial atp syntha"
  },
  {
    "title": "Elicitation Kinetics of Phenolic Antioxidants",
    "cat": "wiki",
    "url": "wiki/secondary_metabolite_elicitation_uvb.html",
    "icon": "🧬",
    "desc": "UVR8 photoreceptor activation and Phenylalanine Ammonia-Lyase (PAL, EC 4.3.1.24) elicitation kinetics under pulsed UV-B greenhouse lighting.",
    "tags": "wiki secondary metabolite elicitation uvb html elicitation kinetics of phenolic antioxidants uvr8 photoreceptor activation and phenylalanine ammonia lyase pal ec 4 3 1 24 elicitation kinetic"
  },
  {
    "title": "Spinach (Spinacia oleracea)",
    "cat": "wiki",
    "url": "wiki/spinach.html",
    "icon": "🧬",
    "desc": "CEA engineering guide for hydroponic spinach (Spinacia oleracea): root-zone DO chilling, Pythium suppression, oxalate reduction, and nitrate steering.",
    "tags": "wiki spinach html spinach spinacia oleracea cea engineering guide for hydroponic spinach spinacia oleracea root zone do chilling pythium suppression oxalate reduction and nitrate steering"
  },
  {
    "title": "Plastidic Nitrate Reductase (NR) Activation",
    "cat": "wiki",
    "url": "wiki/statal_nitrate_accumulation_light_spectrum.html",
    "icon": "🧬",
    "desc": "Pre-harvest end-of-day blue LED activation of plastidic Nitrate Reductase (EC 1.7.1.1) reducing petiole nitrate 41.5% in hydroponic spinach.",
    "tags": "wiki statal nitrate accumulation light spectrum html plastidic nitrate reductase nr activation pre harvest end of day blue led activation of plastidic nitrate reductase ec 1 7 1 1 reducing p"
  },
  {
    "title": "Strawberry (Fragaria × ananassa)",
    "cat": "wiki",
    "url": "wiki/strawberry.html",
    "icon": "🧬",
    "desc": "Greenhouse strawberry (Fragaria x ananassa) CEA engineering guide: chill-unit steering, Botrytis VPD control, and low-salinity fertigation.",
    "tags": "wiki strawberry html strawberry fragaria ananassa greenhouse strawberry fragaria x ananassa cea engineering guide chill unit steering botrytis vpd control and low salinity fertigation"
  },
  {
    "title": "Swiss Chard (Beta vulgaris subsp. vulgaris)",
    "cat": "wiki",
    "url": "wiki/swiss_chard.html",
    "icon": "🧬",
    "desc": "CEA engineering guide for hydroponic Swiss chard (Beta vulgaris): betalain pigment spectrum steering, halophytic Na+/K+ salinity control, and VPD management.",
    "tags": "wiki swiss chard html swiss chard beta vulgaris subsp vulgaris cea engineering guide for hydroponic swiss chard beta vulgaris betalain pigment spectrum steering halophytic na k salinity cont"
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
    "title": "Boundary Layer Resistance (rb)",
    "cat": "wiki",
    "url": "wiki/transpiration_boundary_layer_dynamics.html",
    "icon": "🧬",
    "desc": "3D CFD modeling of leaf boundary layer resistance (rb) and micro-vectored vertical airflow (0.35 m/s) for tip-burn elimination in vertical farms.",
    "tags": "wiki transpiration boundary layer dynamics html boundary layer resistance rb 3d cfd modeling of leaf boundary layer resistance rb and micro vectored vertical airflow 0 35 m s for tip burn el"
  },
  {
    "title": "Micro-Climatological Telemetry Coupling",
    "cat": "wiki",
    "url": "wiki/usda_elasticity_market_index_model.html",
    "icon": "🧬",
    "desc": "Econometric coupling of NASA POWER solar irradiance telemetry with USDA MARS wholesale price elasticity for 14-day CEA harvest steering.",
    "tags": "wiki usda elasticity market index model html micro climatological telemetry coupling econometric coupling of nasa power solar irradiance telemetry with usda mars wholesale price elasticity f"
  },
  {
    "title": "Aquaporin Expression Dynamics and Root",
    "cat": "wiki",
    "url": "wiki/vapour_pressure_deficit_aquaporin_gating.html",
    "icon": "🧬",
    "desc": "PIP1/PIP2 aquaporin phosphorylation gating and root hydraulic conductivity (Lpr) stabilization under high-pressure greenhouse fogging impulses.",
    "tags": "wiki vapour pressure deficit aquaporin gating html aquaporin expression dynamics and root pip1 pip2 aquaporin phosphorylation gating and root hydraulic conductivity lpr stabilization under h"
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
          <input type="text" id="inwoo-palette-input" placeholder="Search all 392 tools, simulators, wiki, crops, climate hubs & EN/DE/JA articles..." autocomplete="off" />
          <span class="inwoo-palette-esc-badge" onclick="window.InwooPalette.close()">ESC</span>
        </div>
        <div class="inwoo-palette-tabs">
          <button class="inwoo-pal-tab active" data-cat="all">✨ All (392)</button>
          <button class="inwoo-pal-tab" data-cat="tool">🛠️ Tools (49)</button>
          <button class="inwoo-pal-tab" data-cat="article">📚 Articles (220)</button>
          <button class="inwoo-pal-tab" data-cat="wiki">🧬 Wiki (44)</button>
          <button class="inwoo-pal-tab" data-cat="climate">🌍 Climate (41)</button>
          <button class="inwoo-pal-tab" data-cat="sim">🧪 Simulators (19)</button>
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
          <div style="color: #64748b; font-size: 0.75rem;">Inwoovation Universal Spotlight (392 Indexed Pages)</div>
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

  function initWorkspacePersistenceUX() {
    if (typeof window === 'undefined' || !document.body) return;
    const path = window.location.pathname || '/';
    const RECENT_KEY = 'inw_recent_tools_v1';

    function safeGet(key) {
      try { return window.localStorage.getItem(key); } catch (e) { return null; }
    }
    function safeSet(key, val) {
      try { window.localStorage.setItem(key, val); } catch (e) {}
    }
    function safeRemove(key) {
      try { window.localStorage.removeItem(key); } catch (e) {}
    }

    // A. Homepage Returning-Visitor Workspace Resume Bar
    const recentBar = document.getElementById('inw-recent-workspace-bar');
    const recentList = document.getElementById('inw-recent-workspace-list');
    const clearRecentBtn = document.getElementById('inw-clear-recent-btn');
    if (recentBar && recentList) {
      try {
        const items = JSON.parse(safeGet(RECENT_KEY) || '[]');
        if (Array.isArray(items) && items.length > 0) {
          recentList.innerHTML = items.slice(0, 5).map(it => {
            const safeUrl = (it.path || '/tools/').replace(/"/g, '&quot;');
            const safeTitle = String(it.title || 'Simulator').replace(/</g, '&lt;').slice(0, 42);
            return `<a href="${safeUrl}" class="inw-recent-pill">⚡ ${safeTitle}</a>`;
          }).join('');
          recentBar.style.display = 'flex';
        }
      } catch (e) {}
      if (clearRecentBtn) {
        clearRecentBtn.addEventListener('click', function() {
          safeRemove(RECENT_KEY);
          recentBar.style.display = 'none';
        });
      }
      return;
    }

    // B. Tool Pages (/tools/*.html excluding /tools/ and /tools/index.html)
    const isToolPage = path.includes('/tools/') && !path.endsWith('/tools/') && !path.endsWith('/tools/index.html');
    if (!isToolPage) return;

    // Record tool visit in recent list
    try {
      const cleanTitle = (document.title || path).split('|')[0].trim();
      let recent = JSON.parse(safeGet(RECENT_KEY) || '[]');
      if (!Array.isArray(recent)) recent = [];
      recent = recent.filter(item => item && item.path !== path);
      recent.unshift({ path: path, title: cleanTitle, ts: Date.now() });
      safeSet(RECENT_KEY, JSON.stringify(recent.slice(0, 6)));
    } catch (e) {}

    // Collect persistable controls with explicit IDs
    const IGNORED_IDS = new Set(['inw-palette-input', 'home-quick-finder', 'rfqName', 'rfqCompany', 'rfqEmail', 'rfqLocation']);
    function getPersistableControls() {
      return Array.from(document.querySelectorAll('input[type="range"], input[type="number"], select')).filter(el => {
        if (!el.id || IGNORED_IDS.has(el.id)) return false;
        if (el.closest('#inwoo-command-palette-modal, #rfqModal, #dossierModal')) return false;
        return true;
      });
    }

    const controls = getPersistableControls();
    if (controls.length < 2) return;

    const CFG_KEY = 'inw_tool_cfg_' + path;

    function snapshotConfig() {
      const out = {};
      getPersistableControls().forEach(el => {
        out[el.id] = el.value;
      });
      return out;
    }

    function applyConfig(cfgObj) {
      if (!cfgObj || typeof cfgObj !== 'object') return false;
      let changed = false;
      Object.keys(cfgObj).forEach(id => {
        const el = document.getElementById(id);
        if (!el) return;
        const val = String(cfgObj[id]);
        if (el.value !== val) {
          el.value = val;
          el.dispatchEvent(new Event('input', { bubbles: true }));
          el.dispatchEvent(new Event('change', { bubbles: true }));
          changed = true;
        }
      });
      return changed;
    }

    // Mount Workspace Utility Pill Bar cleanly (skip fixed fullscreen canvas VenloCAD header)
    if (!document.getElementById('inw-workspace-bar') && !path.includes('venlocad-3d.html')) {
      const bar = document.createElement('div');
      bar.id = 'inw-workspace-bar';
      bar.className = 'inw-workspace-bar';
      bar.innerHTML = `
        <span class="inw-ws-status" id="inw-ws-status">💾 Workspace Ready (Auto-Saves Locally)</span>
        <div class="inw-ws-actions">
          <button type="button" class="inw-ws-pill inw-ws-pill-share" id="inw-ws-share-btn">🔗 Share Setup Link</button>
          <button type="button" class="inw-ws-pill" id="inw-ws-reset-btn">↺ Reset Defaults</button>
        </div>
      `;
      const simHeader = document.querySelector('.sim-header, .tool-header, .tool-hero');
      const bodyHeader = document.querySelector('body > header');
      const simContainer = document.querySelector('.sim-container, .app-container, .api-hub-container, .nav-container');
      if (simHeader && simHeader.parentNode) {
        simHeader.insertAdjacentElement('afterend', bar);
      } else if (bodyHeader && bodyHeader.parentNode) {
        bodyHeader.insertAdjacentElement('afterend', bar);
      } else if (simContainer) {
        simContainer.insertAdjacentElement('afterbegin', bar);
      }
    }

    // Restore saved or shared setup after tool scripts bind listeners
    function restoreSavedOrShared() {
      let restoredSource = null;
      try {
        const sp = new URLSearchParams(window.location.search);
        const rawCfg = sp.get('inw_cfg');
        if (rawCfg) {
          const parsed = JSON.parse(decodeURIComponent(rawCfg));
          if (applyConfig(parsed)) restoredSource = '🔗 Loaded Shared Setup from URL';
        } else {
          const savedRaw = safeGet(CFG_KEY);
          if (savedRaw) {
            const parsed = JSON.parse(savedRaw);
            if (applyConfig(parsed)) restoredSource = '💾 Restored Last Saved Setup';
          }
        }
      } catch (e) {}
      const statusEl = document.getElementById('inw-ws-status');
      if (statusEl && restoredSource) statusEl.textContent = restoredSource;
    }

    if (document.readyState === 'complete') {
      setTimeout(restoreSavedOrShared, 80);
    } else {
      window.addEventListener('load', () => setTimeout(restoreSavedOrShared, 80));
    }

    // Auto-save edits with 250ms debounce
    let saveTimer = null;
    document.addEventListener('input', onControlChange, true);
    document.addEventListener('change', onControlChange, true);
    function onControlChange(ev) {
      const t = ev.target;
      if (!t || !t.id || IGNORED_IDS.has(t.id)) return;
      if (!t.matches('input[type="range"], input[type="number"], select')) return;
      clearTimeout(saveTimer);
      saveTimer = setTimeout(() => {
        safeSet(CFG_KEY, JSON.stringify(snapshotConfig()));
        const statusEl = document.getElementById('inw-ws-status');
        if (statusEl) {
          const now = new Date();
          const hhmm = String(now.getHours()).padStart(2, '0') + ':' + String(now.getMinutes()).padStart(2, '0');
          statusEl.textContent = `✅ Auto-Saved Locally (${hhmm})`;
        }
      }, 250);
    }

    const shareBtn = document.getElementById('inw-ws-share-btn');
    if (shareBtn) {
      shareBtn.addEventListener('click', function() {
        try {
          const cfg = snapshotConfig();
          const url = new URL(window.location.href);
          url.searchParams.set('inw_cfg', JSON.stringify(cfg));
          const finalUrl = url.toString();
          safeSet(CFG_KEY, JSON.stringify(cfg));
          if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(finalUrl).then(() => {
              const orig = shareBtn.textContent;
              shareBtn.textContent = '✅ Setup URL Copied!';
              setTimeout(() => { shareBtn.textContent = orig; }, 2200);
            }).catch(() => {
              window.history.replaceState(null, '', finalUrl);
              shareBtn.textContent = '✅ URL Updated in Address Bar';
              setTimeout(() => { shareBtn.textContent = '🔗 Share Setup Link'; }, 2400);
            });
          } else {
            window.history.replaceState(null, '', finalUrl);
            shareBtn.textContent = '✅ URL Updated in Address Bar';
            setTimeout(() => { shareBtn.textContent = '🔗 Share Setup Link'; }, 2400);
          }
        } catch (e) {}
      });
    }

    const resetBtn = document.getElementById('inw-ws-reset-btn');
    if (resetBtn) {
      resetBtn.addEventListener('click', function() {
        safeRemove(CFG_KEY);
        const url = new URL(window.location.href);
        url.searchParams.delete('inw_cfg');
        window.location.href = url.toString();
      });
    }
  }

  function initGdprConsentBanner() {
    if (document.getElementById('inw-gdpr-consent-bar')) return;
    if (navigator.webdriver || /HeadlessChrome|PhantomJS|Lighthouse|PTST/i.test(navigator.userAgent || '')) return;
    let saved = null;
    try {
      saved = window.localStorage ? window.localStorage.getItem(CONSENT_STORAGE_KEY) : null;
    } catch (_err) {
      saved = null;
    }
    if (saved === 'granted' || saved === 'essential') return;
    // Defer if Google Funding Choices certified TCF v2.2 modal is active on page
    if (window.googlefc && typeof window.googlefc.callbackQueue !== 'undefined') return;

    const docLang = ((document.documentElement && document.documentElement.lang) || '').toLowerCase();
    const pathLower = (window.location.pathname || '').toLowerCase();
    let copy = {
      msg: 'We use cookies & Google Consent Mode v2 for anonymous analytics and sustainable open-access CEA tools. ',
      linkLabel: 'Privacy Policy',
      essential: 'Essential Only',
      accept: 'Accept All'
    };
    if (docLang.startsWith('de') || pathLower.indexOf('/de/') !== -1 || pathLower.indexOf('meister.html') !== -1) {
      copy = {
        msg: 'Wir nutzen Cookies & Google Consent Mode v2 für anonyme Analysen und den kostenfreien Betrieb unserer Gartenbau-Rechner. ',
        linkLabel: 'Datenschutzerklärung',
        essential: 'Nur Essenzielle',
        accept: 'Alle akzeptieren'
      };
    } else if (docLang.startsWith('ja') || pathLower.indexOf('/ja/') !== -1) {
      copy = {
        msg: '当ラボは匿名アクセス解析および無料施設園芸シミュレーター運営のため Cookie と Google Consent Mode v2 を使用します。 ',
        linkLabel: 'プライバシーポリシー',
        essential: '必須のみ',
        accept: 'すべて同意'
      };
    }

    const bar = document.createElement('div');
    bar.id = 'inw-gdpr-consent-bar';
    bar.setAttribute('role', 'region');
    bar.setAttribute('aria-label', 'Cookie & Privacy Consent');
    bar.style.boxSizing = 'border-box';
    bar.innerHTML =
      '<div style="flex:1; min-width:220px;">' +
        copy.msg +
        '<a href="/privacy-policy.html">' + copy.linkLabel + '</a>' +
      '</div>' +
      '<div class="inw-gdpr-actions">' +
        '<button type="button" class="inw-gdpr-btn-essential" id="inw-gdpr-reject-btn">' + copy.essential + '</button>' +
        '<button type="button" class="inw-gdpr-btn-accept" id="inw-gdpr-accept-btn">' + copy.accept + '</button>' +
      '</div>';

    function applyChoice(choice) {
      const granted = choice === 'granted';
      const stateVal = granted ? 'granted' : 'denied';
      try {
        if (window.localStorage) window.localStorage.setItem(CONSENT_STORAGE_KEY, choice);
      } catch (_storeErr) {
        // Ignore storage quota errors
      }
      const fn = typeof window.gtag === 'function' ? window.gtag : function() { (window.dataLayer = window.dataLayer || []).push(arguments); };
      fn('consent', 'update', {
        ad_storage: stateVal,
        ad_user_data: stateVal,
        ad_personalization: stateVal,
        analytics_storage: stateVal
      });
      if (bar && bar.parentNode) bar.parentNode.removeChild(bar);
    }

    document.body.appendChild(bar);
    const acceptBtn = document.getElementById('inw-gdpr-accept-btn');
    const rejectBtn = document.getElementById('inw-gdpr-reject-btn');
    if (acceptBtn) acceptBtn.addEventListener('click', function() { applyChoice('granted'); });
    if (rejectBtn) rejectBtn.addEventListener('click', function() { applyChoice('essential'); });
  }

  function bootAll() {
    initPaletteModal();
    initReaderConvenienceUX();
    initWorkspacePersistenceUX();
    initGdprConsentBanner();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bootAll);
  } else {
    bootAll();
  }
})();
