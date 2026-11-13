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
  const ECOSYSTEM_INDEX = [
  {
    "title": "Biophysical Foundations of Vapor Pressure Deficit (VPD) Thermodynamics in CEA Greenhouses",
    "cat": "article",
    "url": "articles/article-01-vpd-master-class.html",
    "icon": "📚",
    "desc": "Mastering VPD (kPa) computation over relative humidity (RH%) to eliminate crop stress, balance stomatal conductance, and drive transpirational xylem flow.",
    "tags": "articles article 01 vpd master class html biophysical foundations of vapor pressure deficit vpd thermodynamics in cea greenhouses mastering vpd kpa computation over relative humidity rh to e"
  },
  {
    "title": "Daily Light Integral (DLI) & Photonic Efficacy Engineering in Vertical Plant Factories",
    "cat": "article",
    "url": "articles/article-02-dli-vertical-farming.html",
    "icon": "📚",
    "desc": "Calculated PPFD (µmol/m²/s) and DLI (mol/m²/day) formulations for indoor LED vertical farming to maximize dry biomass yield per kWh of electricity.",
    "tags": "articles article 02 dli vertical farming html daily light integral dli photonic efficacy engineering in vertical plant factories calculated ppfd mol m s and dli mol m day formulations for in"
  },
  {
    "title": "Greenhouse Bumblebee Protection & Restricted-Entry Intervals (REI) in Precision CEA",
    "cat": "article",
    "url": "articles/article-03-pollinator-safety-rei.html",
    "icon": "📚",
    "desc": "Biological pollinator stewardship in commercial greenhouses: protecting Bombus terrestris from pesticide residue toxicity, REI mathematical models, and automate",
    "tags": "articles article 03 pollinator safety rei html greenhouse bumblebee protection restricted entry intervals rei in precision cea biological pollinator stewardship in commercial greenhouses pro"
  },
  {
    "title": "Greenhouse Envelope Peak Heat Loss Coefficients (U-Values) & Thermodynamic Thermal Screen Modeling",
    "cat": "article",
    "url": "articles/article-04-greenhouse-heating-loss.html",
    "icon": "📚",
    "desc": "Engineering greenhouse heating loads using Q = U·A·ΔT heat transfer dynamics, cover glazing U-values, wind infiltration friction, and multilayer.",
    "tags": "articles article 04 greenhouse heating loss html greenhouse envelope peak heat loss coefficients u values thermodynamic thermal screen modeling engineering greenhouse heating loads using q u"
  },
  {
    "title": "Hourly Penman-Monteith Evapotranspiration (ET0) Modeling & Stomatal Resistance Kinetics",
    "cat": "article",
    "url": "articles/article-05-penman-monteith-transpiration.html",
    "icon": "📚",
    "desc": "Mathematical implementation of the FAO-56 Penman-Monteith equation for commercial greenhouse irrigation steering, canopy energy balance, and solar.",
    "tags": "articles article 05 penman monteith transpiration html hourly penman monteith evapotranspiration et0 modeling stomatal resistance kinetics mathematical implementation of the fao 56 penman mo"
  },
  {
    "title": "Molar Stoichiometry & Sonneveld/Steiner Ion Balancing (meq/L) in Closed-Loop Hydroponics",
    "cat": "article",
    "url": "articles/article-06-hydroponic-nutrient-formulation.html",
    "icon": "📚",
    "desc": "Precision closed-loop hydroponic nutrient balancing: milliequivalent calculations, Steiner cation-anion stoichiometry, salt solubility products, and automated c",
    "tags": "articles article 06 hydroponic nutrient formulation html molar stoichiometry sonneveld steiner ion balancing meq l in closed loop hydroponics precision closed loop hydroponic nutrient balanc"
  },
  {
    "title": "Photomorphogenesis & PAR Spectral Quality: Red/Blue Ratios and Emerson Enhancement Effect",
    "cat": "article",
    "url": "articles/article-07-indoor-plant-lighting-spectrum.html",
    "icon": "📚",
    "desc": "Photobiological plant responses across McCree action spectra, phytochrome photoequilibria (Pfr/Pr), far-red Emerson enhancement, and spectral tailoring.",
    "tags": "articles article 07 indoor plant lighting spectrum html photomorphogenesis par spectral quality red blue ratios and emerson enhancement effect photobiological plant responses across mccree a"
  },
  {
    "title": "Horticultural Physics & Environmental Physiology of Monstera deliciosa: Hydroponics & VPD Optimization",
    "cat": "article",
    "url": "articles/article-08-monstera-deliciosa-care-guide.html",
    "icon": "📚",
    "desc": "Commercial tropical foliage engineering: hydroponic cultivation of Monstera deliciosa, leaf marginal necrosis prevention via VPD steering, and automated climate",
    "tags": "articles article 08 monstera deliciosa care guide html horticultural physics environmental physiology of monstera deliciosa hydroponics vpd optimization commercial tropical foliage engineeri"
  },
  {
    "title": "Stomatal Conductance Dynamics & Farquhar-von Caemmerer-Berry (FvCB) Photosynthesis Coupling",
    "cat": "article",
    "url": "articles/article-09-stomata-conductance-photosynthesis.html",
    "icon": "📚",
    "desc": "Coupled Farquhar-von Caemmerer-Berry photosynthesis and Ball-Berry stomatal conductance models under elevated CO2 enrichment and light-saturated.",
    "tags": "articles article 09 stomata conductance photosynthesis html stomatal conductance dynamics farquhar von caemmerer berry fvcb photosynthesis coupling coupled farquhar von caemmerer berry photo"
  },
  {
    "title": "Commercial Vertical Farming HVAC Sizing: Dehumidification Latent Loads & Microclimate Fluid Dynamics",
    "cat": "article",
    "url": "articles/article-10-vertical-farm-hvac-design.html",
    "icon": "📚",
    "desc": "HVAC and psychrometric dehumidification engineering for commercial indoor vertical farms: calculating sensible vs latent cooling loads, airflow.",
    "tags": "articles article 10 vertical farm hvac design html commercial vertical farming hvac sizing dehumidification latent loads microclimate fluid dynamics hvac and psychrometric dehumidification e"
  },
  {
    "title": "High-Wire Strawberry Greenhouse Microclimate: Flower Bud Differentiation & Diurnal Temperature Integration",
    "cat": "article",
    "url": "articles/article-11-strawberry-greenhouse-climate.html",
    "icon": "📚",
    "desc": "Precision microclimate management for day-neutral and short-day greenhouse strawberries: chilling hour accumulation, flower bud initiation, and diurnal.",
    "tags": "articles article 11 strawberry greenhouse climate html high wire strawberry greenhouse microclimate flower bud differentiation diurnal temperature integration precision microclimate manageme"
  },
  {
    "title": "Xylem Calcium Partitioning & Transpirational Prevention of Blossom-End Rot (BER) in Greenhouse Tomatoes",
    "cat": "article",
    "url": "articles/article-12-tomato-blossom-end-rot-calcium.html",
    "icon": "📚",
    "desc": "Apoplastic calcium transport mechanics, xylem-to-phloem immobility, root hydraulic pressure, and nighttime VPD steering to prevent Blossom-End Rot.",
    "tags": "articles article 12 tomato blossom end rot calcium html xylem calcium partitioning transpirational prevention of blossom end rot ber in greenhouse tomatoes apoplastic calcium transport mecha"
  },
  {
    "title": "Precision Agricultural Sensor Calibration: NDIR CO2, TDR Soil Moisture, EC & pH Electrochemistry",
    "cat": "article",
    "url": "articles/article-13-smartfarm-sensor-calibration.html",
    "icon": "📚",
    "desc": "Engineering calibration protocols for CEA instrumentation: NDIR dual-beam optical drift, two-point pH/EC Nernstian slope correction, and dielectric.",
    "tags": "articles article 13 smartfarm sensor calibration html precision agricultural sensor calibration ndir co2 tdr soil moisture ec ph electrochemistry engineering calibration protocols for cea in"
  },
  {
    "title": "Dual Horticultural Education & Vocational Engineering in Germany: Gärtner Ausbildung to Meister",
    "cat": "article",
    "url": "articles/article-14-ausbildung-horticulture-germany.html",
    "icon": "📚",
    "desc": "Comprehensive structural guide to Germany&#x27;s dual vocational education system (Duale Ausbildung) in commercial production horticulture (Gartenbau).",
    "tags": "articles article 14 ausbildung horticulture germany html dual horticultural education vocational engineering in germany gärtner ausbildung to meister comprehensive structural guide to german"
  },
  {
    "title": "Biophilic Architecture & Indoor Environmental Physics in Commercial Living Spaces",
    "cat": "article",
    "url": "articles/article-15-plant-interior-biophilic-design.html",
    "icon": "📚",
    "desc": "Architectural integration of living vegetation in high-performance buildings: daylight factor modeling, sub-irrigation hydraulics, particulate matter.",
    "tags": "articles article 15 plant interior biophilic design html biophilic architecture indoor environmental physics in commercial living spaces architectural integration of living vegetation in hig"
  },
  {
    "title": "German Master Grower (Gärtnermeister) Greenhouse Climate Steering Strategy for Solanaceae",
    "cat": "article",
    "url": "articles/article-16-german-meister-greenhouse-climate.html",
    "icon": "📚",
    "desc": "Advanced European greenhouse climate steering: 24-hour temperature integration (RTI), pre-night temperature drops (DIP), and 3-way mixing valve heating.",
    "tags": "articles article 16 german meister greenhouse climate html german master grower gärtnermeister greenhouse climate steering strategy for solanaceae advanced european greenhouse climate steeri"
  },
  {
    "title": "Biophysical Soil Physics: Air Porosity, Water Retention Curves & Root Zone Aeration",
    "cat": "article",
    "url": "articles/article-17-indoor-plant-soil-aeration-porosity.html",
    "icon": "📚",
    "desc": "Engineering potting media physics: Total Porosity, Container Capacity (CC), and Air-Filled Porosity (AFP) to eliminate root hypoxia in containerized.",
    "tags": "articles article 17 indoor plant soil aeration porosity html biophysical soil physics air porosity water retention curves root zone aeration engineering potting media physics total porosity "
  },
  {
    "title": "Closed-Loop Hydroponic Drain Water Disinfection: UV-C, Ozone, Heat & Ultrafiltration",
    "cat": "article",
    "url": "articles/article-18-recirculating-nutrient-sterilization.html",
    "icon": "📚",
    "desc": "Engineering recirculating hydroponic drain water disinfection: UV-C irradiance dosage (mJ/cm2), ozone oxidation redox potential (ORP), and automated climate con",
    "tags": "articles article 18 recirculating nutrient sterilization html closed loop hydroponic drain water disinfection uv c ozone heat ultrafiltration engineering recirculating hydroponic drain water"
  },
  {
    "title": "Photon Use Efficiency (PUE) & Electric Power to Fresh Biomass Kinetics in Vertical Farming",
    "cat": "article",
    "url": "articles/article-19-vertical-farm-biomass-conversion-efficiency.html",
    "icon": "📚",
    "desc": "Quantifying photon use efficiency (g/mol) and energy yield (g/kWh) in indoor plant factories with artificial lighting (PFAL) across leafy greens.",
    "tags": "articles article 19 vertical farm biomass conversion efficiency html photon use efficiency pue electric power to fresh biomass kinetics in vertical farming quantifying photon use efficiency "
  },
  {
    "title": "Leaf Temperature Infrared Thermometry & Crop Water Stress Index (CWSI) Sensing",
    "cat": "article",
    "url": "articles/article-20-leaf-temperature-infrared-thermometry.html",
    "icon": "📚",
    "desc": "Physics of infrared canopy radiometry: Stefan-Boltzmann law, leaf-to-air temperature differential (ΔT), and Crop Water Stress Index (CWSI) for commercial high-t",
    "tags": "articles article 20 leaf temperature infrared thermometry html leaf temperature infrared thermometry crop water stress index cwsi sensing physics of infrared canopy radiometry stefan boltzma"
  },
  {
    "title": "Chlorophyll a Fluorescence Kinetics (Fv/Fm & OJIP) & Pre-Symptomatic Stress Metrology",
    "cat": "article",
    "url": "articles/article-21-chlorophyll-a-fluorescence-fvfm-stress.html",
    "icon": "📚",
    "desc": "Photosystem II maximum quantum yield (Fv/Fm), OJIP induction curves, and non-photochemical quenching (NPQ) for real-time non-destructive plant stress.",
    "tags": "articles article 21 chlorophyll a fluorescence fvfm stress html chlorophyll a fluorescence kinetics fv fm ojip pre symptomatic stress metrology photosystem ii maximum quantum yield fv fm oji"
  },
  {
    "title": "HPS vs. LED Supplemental Lighting Physics: Photon Efficacy, Far-Red Kinetics & Greenhouse Heat Balance",
    "cat": "article",
    "url": "articles/article-22-hps-vs-led-supplemental-lighting.html",
    "icon": "📚",
    "desc": "Comparative biophysics of High-Pressure Sodium (HPS) and LED supplemental fixtures: PAR photon efficacy (µmol/J), Far-Red Emerson enhancement, and automated cli",
    "tags": "articles article 22 hps vs led supplemental lighting html hps vs led supplemental lighting physics photon efficacy far red kinetics greenhouse heat balance comparative biophysics of high pre"
  },
  {
    "title": "Closed-Loop DWC & Micro-Dosing Automation: Dissolved Oxygen, Ion-Selective ORP Metrology & PID Fertigation",
    "cat": "article",
    "url": "articles/article-23-closed-loop-dwc-automation.html",
    "icon": "📚",
    "desc": "Engineering recirculating Deep Water Culture (DWC) systems: Henry&#x27;s Law dissolved oxygen (DO) dynamics, ion-selective electrode (ISE) feedback.",
    "tags": "articles article 23 closed loop dwc automation html closed loop dwc micro dosing automation dissolved oxygen ion selective orp metrology pid fertigation engineering recirculating deep water "
  },
  {
    "title": "Optimizing Far-Red (730nm) & Deep-Red (660nm) LED Ratios for Maximum Photosynthetic Quantum Yield",
    "cat": "article",
    "url": "articles/article-24-far-red-deep-red-led-spectrum-optimization.html",
    "icon": "📚",
    "desc": "A comprehensive engineering masterclass on the Emerson Enhancement Effect, Photosystem I/II excitation balance, and Far-Red (730nm) spectrum.",
    "tags": "articles article 24 far red deep red led spectrum optimization html optimizing far red 730nm deep red 660nm led ratios for maximum photosynthetic quantum yield a comprehensive engineering ma"
  },
  {
    "title": "Closed-Loop Nutrient Recirculation & Nanobubble Dissolved Oxygen Kinetics",
    "cat": "article",
    "url": "articles/article-25-closed-loop-hydroponic-nanobubble-oxygenation.html",
    "icon": "📚",
    "desc": "Engineering analysis of closed-loop hydroponic recirculation, rhizosphere dissolved oxygen (DO &gt; 8.5 mg/L), and Pythium root-rot suppression in commercial co",
    "tags": "articles article 25 closed loop hydroponic nanobubble oxygenation html closed loop nutrient recirculation nanobubble dissolved oxygen kinetics engineering analysis of closed loop hydroponic "
  },
  {
    "title": "Greenhouse Heating Load Modeling & Thermal Screen Dynamics (DIN V 18599)",
    "cat": "article",
    "url": "articles/article-26-greenhouse-heating-load-din-v-18599.html",
    "icon": "📚",
    "desc": "Comprehensive engineering analysis of peak heat transmission, thermal screen radiative resistance, and pipe rail hydraulics in commercial Venlo.",
    "tags": "articles article 26 greenhouse heating load din v 18599 html greenhouse heating load modeling thermal screen dynamics din v 18599 comprehensive engineering analysis of peak heat transmission"
  },
  {
    "title": "Predictive Crop Biomass Accumulation & Light Use Efficiency (LUE)",
    "cat": "article",
    "url": "articles/article-27-crop-yield-biomass-light-use-efficiency.html",
    "icon": "📚",
    "desc": "Commercial greenhouse yield forecasting based on cumulative DLI, Light Use Efficiency (LUE = 2.8 - 3.4 g/mol), and Harvest Index (HI) modeling.",
    "tags": "articles article 27 crop yield biomass light use efficiency html predictive crop biomass accumulation light use efficiency lue commercial greenhouse yield forecasting based on cumulative dli"
  },
  {
    "title": "Greenhouse CO2 Enrichment Kinetics & Economic ROI Thresholds",
    "cat": "article",
    "url": "articles/article-28-greenhouse-co2-enrichment-economics.html",
    "icon": "📚",
    "desc": "Industrial analysis of pure liquid CO2 vs CHP flue gas dosing, ventilation exchange losses, and net economic ROI thresholds in commercial horticulture.",
    "tags": "articles article 28 greenhouse co2 enrichment economics html greenhouse co2 enrichment kinetics economic roi thresholds industrial analysis of pure liquid co2 vs chp flue gas dosing ventilat"
  },
  {
    "title": "Hourly Penman-Monteith Evapotranspiration Modeling in Greenhouses",
    "cat": "article",
    "url": "articles/article-29-hourly-penman-monteith-evapotranspiration.html",
    "icon": "📚",
    "desc": "Engineering analysis of hourly crop evapotranspiration (ETc), stomatal resistance (rs), aerodynamic boundary layer resistance (ra), and precision.",
    "tags": "articles article 29 hourly penman monteith evapotranspiration html hourly penman monteith evapotranspiration modeling in greenhouses engineering analysis of hourly crop evapotranspiration et"
  },
  {
    "title": "Rockwool Slab Hydrodynamics & TDR Moisture Sensor Calibration",
    "cat": "article",
    "url": "articles/article-30-rockwool-slab-tdr-moisture-drain-ec.html",
    "icon": "📚",
    "desc": "Engineering analysis of volumetric water content (VWC %), overnight dry-down kinetics, and drainage EC balancing in commercial rockwool hydroponics.",
    "tags": "articles article 30 rockwool slab tdr moisture drain ec html rockwool slab hydrodynamics tdr moisture sensor calibration engineering analysis of volumetric water content vwc overnight dry do"
  },
  {
    "title": "High-Pressure (70 bar) Fogging Physics & Sauter Droplet Dynamics",
    "cat": "article",
    "url": "articles/article-31-high-pressure-fogging-droplet-physics.html",
    "icon": "📚",
    "desc": "Industrial engineering analysis of 70 bar high-pressure fogging, Sauter Mean Diameter (D32 &lt; 10µm), flash evaporative cooling, and VPD.",
    "tags": "articles article 31 high pressure fogging droplet physics html high pressure 70 bar fogging physics sauter droplet dynamics industrial engineering analysis of 70 bar high pressure fogging sa"
  },
  {
    "title": "Horticultural LED Fixture Thermal Management & Junction Temperature (Tj)",
    "cat": "article",
    "url": "articles/article-32-horticultural-led-thermal-junction-temperature.html",
    "icon": "📚",
    "desc": "Engineering analysis of LED diode junction temperature (Tj), thermal resistance (Rth), spectral photon efficacy derating, and canopy convective heat.",
    "tags": "articles article 32 horticultural led thermal junction temperature html horticultural led fixture thermal management junction temperature tj engineering analysis of led diode junction temper"
  },
  {
    "title": "Precision Crop Steering Dynamics (Generative vs Vegetative)",
    "cat": "article",
    "url": "articles/article-33-precision-crop-steering-dif-vpd-drydown.html",
    "icon": "📚",
    "desc": "Industrial crop steering masterclass: Balancing vegetative stem growth vs generative flowering using 24h DIF, diurnal VPD differentials, and slab.",
    "tags": "articles article 33 precision crop steering dif vpd drydown html precision crop steering dynamics generative vs vegetative industrial crop steering masterclass balancing vegetative stem grow"
  },
  {
    "title": "Closed-Loop UV-C Disinfection & Pathogen Inactivation Kinetics",
    "cat": "article",
    "url": "articles/article-34-closed-loop-uvc-drain-disinfection.html",
    "icon": "📚",
    "desc": "Engineering analysis of UV-C radiation dose (250 mJ/cm2), UVT% transmission correction, and viral/fungal log-reduction in recirculating greenhouse.",
    "tags": "articles article 34 closed loop uvc drain disinfection html closed loop uv c disinfection pathogen inactivation kinetics engineering analysis of uv c radiation dose 250 mj cm2 uvt transmissi"
  },
  {
    "title": "Computational Fluid Dynamics (CFD) of Greenhouse HAF Circulation Fans",
    "cat": "article",
    "url": "articles/article-35-greenhouse-haf-fan-cfd-modeling.html",
    "icon": "📚",
    "desc": "Industrial CFD modeling of Horizontal Air Flow (HAF) fan spacing, jet velocity decay, Bernoulli air entrainment, and canopy boundary layer.",
    "tags": "articles article 35 greenhouse haf fan cfd modeling html computational fluid dynamics cfd of greenhouse haf circulation fans industrial cfd modeling of horizontal air flow haf fan spacing je"
  },
  {
    "title": "Combined Heat & Power (CHP) Flue Gas SCR Denitrification",
    "cat": "article",
    "url": "articles/article-36-chp-flue-gas-scr-denitrification.html",
    "icon": "📚",
    "desc": "Industrial engineering analysis of gas engine Selective Catalytic Reduction (SCR), stoichiometric urea injection, NOx &lt; 5 ppm elimination, and automated clim",
    "tags": "articles article 36 chp flue gas scr denitrification html combined heat power chp flue gas scr denitrification industrial engineering analysis of gas engine selective catalytic reduction scr"
  },
  {
    "title": "Hot Water Buffer Tank Stratification & Thermal Storage Sizing",
    "cat": "article",
    "url": "articles/article-37-thermal-buffer-tank-stratification-sizing.html",
    "icon": "📚",
    "desc": "Industrial engineering analysis of greenhouse hot-water thermal buffer tanks, thermocline Richardson number stability, and night peak heating discharge.",
    "tags": "articles article 37 thermal buffer tank stratification sizing html hot water buffer tank stratification thermal storage sizing industrial engineering analysis of greenhouse hot water thermal"
  },
  {
    "title": "Xylem Calcium Transport & Blossom-End Rot (BER) Prevention",
    "cat": "article",
    "url": "articles/article-38-xylem-calcium-flux-blossom-end-rot.html",
    "icon": "📚",
    "desc": "Plant physiology analysis of xylem transpirational calcium flux, distal fruit cell membrane stability, and Blossom-End Rot (BER) prevention via VPD and precisio",
    "tags": "articles article 38 xylem calcium flux blossom end rot html xylem calcium transport blossom end rot ber prevention plant physiology analysis of xylem transpirational calcium flux distal frui"
  },
  {
    "title": "Closed-Loop RO Desalination & Sodium (Na+) Rejection",
    "cat": "article",
    "url": "articles/article-39-closed-loop-ro-desalination-energy.html",
    "icon": "📚",
    "desc": "Industrial engineering analysis of greenhouse reverse osmosis (RO) membrane flux (LMH), sodium (Na+) rejection (99.2%), energy recovery devices (PX).",
    "tags": "articles article 39 closed loop ro desalination energy html closed loop ro desalination sodium na rejection industrial engineering analysis of greenhouse reverse osmosis ro membrane flux lmh"
  },
  {
    "title": "Canopy Light Extinction (Beer-Lambert) & Diffuse Glass Physics",
    "cat": "article",
    "url": "articles/article-40-beer-lambert-canopy-light-extinction.html",
    "icon": "📚",
    "desc": "Industrial plant physiology analysis of Beer-Lambert light extinction, canopy extinction coefficient (k), Leaf Area Index (LAI), and diffuse glass.",
    "tags": "articles article 40 beer lambert canopy light extinction html canopy light extinction beer lambert diffuse glass physics industrial plant physiology analysis of beer lambert light extinction"
  },
  {
    "title": "Biochemical Farquhar (FvCB) Photosynthesis & CO2 Assimilation",
    "cat": "article",
    "url": "articles/article-41-farquhar-photosynthesis-fvcb-co2.html",
    "icon": "📚",
    "desc": "Industrial plant physiology analysis of the Farquhar-von Caemmerer-Berry (FvCB) model, Rubisco kinetics (Vcmax), electron transport (Jmax), and CO2.",
    "tags": "articles article 41 farquhar photosynthesis fvcb co2 html biochemical farquhar fvcb photosynthesis co2 assimilation industrial plant physiology analysis of the farquhar von caemmerer berry f"
  },
  {
    "title": "Substrate Matric Potential (Ψm), pF Curves & van Genuchten Physics",
    "cat": "article",
    "url": "articles/article-42-substrate-matric-potential-pf-curves.html",
    "icon": "📚",
    "desc": "Industrial agricultural physics analysis of substrate matric suction potential (Psi_m), pF retention curves, van Genuchten hydraulic models, and plant.",
    "tags": "articles article 42 substrate matric potential pf curves html substrate matric potential m pf curves van genuchten physics industrial agricultural physics analysis of substrate matric suctio"
  },
  {
    "title": "Greenhouse Structural Standards (EN 13031-1 & NEN 3859)",
    "cat": "article",
    "url": "articles/article-43-greenhouse-structural-standards-en13031.html",
    "icon": "📚",
    "desc": "Civil engineering analysis of commercial Venlo greenhouse structural design according to EN 13031-1 and NEN 3859, wind suction (qw), snow drift, and automated c",
    "tags": "articles article 43 greenhouse structural standards en13031 html greenhouse structural standards en 13031 1 nen 3859 civil engineering analysis of commercial venlo greenhouse structural desi"
  },
  {
    "title": "Meister-Deutsch: Open-Source Horticultural German SRS Engine",
    "cat": "article",
    "url": "articles/article-44-meister-deutsch-open-source-srs-engine.html",
    "icon": "📚",
    "desc": "Open-source Spaced Repetition System (SRS) for German Meisterprüfung horticulture, Web Speech API pronunciation synthesis, and botanical taxonomy.",
    "tags": "articles article 44 meister deutsch open source srs engine html meister deutsch open source horticultural german srs engine open source spaced repetition system srs for german meisterprüfung"
  },
  {
    "title": "AgriQuant: Open-Source Greenhouse Energy & Commodity Quant Analytics",
    "cat": "article",
    "url": "articles/article-45-agriquant-energy-commodity-quant-terminal.html",
    "icon": "📚",
    "desc": "Open-source financial engineering and energy analytics terminal for commercial greenhouses. Simulates Dutch TTF natural gas spark spreads, electricity.",
    "tags": "articles article 45 agriquant energy commodity quant terminal html agriquant open source greenhouse energy commodity quant analytics open source financial engineering and energy analytics te"
  },
  {
    "title": "OpenCEA: Open-Source Python Micro-Framework for Greenhouse Physics",
    "cat": "article",
    "url": "articles/article-46-opencea-python-micro-framework-release.html",
    "icon": "📚",
    "desc": "Release of OpenCEA, an open-source Python micro-framework for commercial greenhouse physics, crop photobiology, substrate hydrodynamics, and climate.",
    "tags": "articles article 46 opencea python micro framework release html opencea open source python micro framework for greenhouse physics release of opencea an open source python micro framework for"
  },
  {
    "title": "Computer Vision & Multispectral Disease Diagnostics in Protected Cropping",
    "cat": "article",
    "url": "articles/article-47-computer-vision-crop-disease-diagnostics.html",
    "icon": "📚",
    "desc": "Computer vision edge algorithms for early detection of Botrytis cinerea, iron chlorosis, and foliar necrotic lesions in commercial high-wire greenhouses.",
    "tags": "articles article 47 computer vision crop disease diagnostics html computer vision multispectral disease diagnostics in protected cropping computer vision edge algorithms for early detection "
  },
  {
    "title": "Commercial Greenhouse 10-Year CapEx, OpEx & IRR Investment Modeling",
    "cat": "article",
    "url": "articles/article-48-greenhouse-capex-opex-irr-npv-financial-model.html",
    "icon": "📚",
    "desc": "Bankable financial feasibility analysis for high-tech commercial Venlo glasshouse projects: Turnkey CapEx (180-320/m²), Discounted Cash Flows.",
    "tags": "articles article 48 greenhouse capex opex irr npv financial model html commercial greenhouse 10 year capex opex irr investment modeling bankable financial feasibility analysis for high tech "
  },
  {
    "title": "Hydroponic Chemical Speciation, Debye-Hückel & Saturation Indices",
    "cat": "article",
    "url": "articles/article-49-hydroponic-chemical-speciation-debye-huckel.html",
    "icon": "📚",
    "desc": "Chemical thermodynamics of closed-loop hydroponic nutrient solutions: Debye-Hückel ionic strength, ion activity coefficients, and Saturation Index (SI).",
    "tags": "articles article 49 hydroponic chemical speciation debye huckel html hydroponic chemical speciation debye hückel saturation indices chemical thermodynamics of closed loop hydroponic nutrient"
  },
  {
    "title": "Smart Greenhouse Edge IoT & MQTT Fleet Telemetry Architecture",
    "cat": "article",
    "url": "articles/article-50-smart-greenhouse-mqtt-edge-iot-fleet.html",
    "icon": "📚",
    "desc": "Industrial IoT architecture for commercial protected cropping: LoRaWAN, MQTT broker topologies, JSON schema telemetry, and edge anomaly detection.",
    "tags": "articles article 50 smart greenhouse mqtt edge iot fleet html smart greenhouse edge iot mqtt fleet telemetry architecture industrial iot architecture for commercial protected cropping lorawa"
  },
  {
    "title": "Autonomous Greenhouse AI: Reinforcement Learning & Model Predictive Control",
    "cat": "article",
    "url": "articles/article-51-autonomous-greenhouse-ai-mpc-reinforcement-learning.html",
    "icon": "📚",
    "desc": "Autonomous climate computer optimization using Reinforcement Learning and Model Predictive Control (MPC). Optimizes 24h temperature trajectories and precision e",
    "tags": "articles article 51 autonomous greenhouse ai mpc reinforcement learning html autonomous greenhouse ai reinforcement learning model predictive control autonomous climate computer optimization"
  },
  {
    "title": "Aquifer Thermal Energy Storage (ATES) & Industrial Heat Pumps in Venlo Greenhouses",
    "cat": "article",
    "url": "articles/article-52-aquifer-thermal-energy-storage-ates-heat-pump.html",
    "icon": "📚",
    "desc": "Thermodynamic modeling of Aquifer Thermal Energy Storage (ATES / WKO) doublet systems, seasonal heat recovery efficiency, and high-temperature.",
    "tags": "articles article 52 aquifer thermal energy storage ates heat pump html aquifer thermal energy storage ates industrial heat pumps in venlo greenhouses thermodynamic modeling of aquifer therma"
  },
  {
    "title": "Biomass CHP Flue Gas SCR Cleaning & Biogenic CO2 Direct Enrichment in Venlo Glasshouses",
    "cat": "article",
    "url": "articles/article-53-biomass-chp-scr-co2-recovery-horticulture.html",
    "icon": "📚",
    "desc": "Engineering thermodynamics of biomass combined heat and power (CHP), Selective Catalytic Reduction (SCR) DeNOx, ethylene scrubbers, and safe biogenic.",
    "tags": "articles article 53 biomass chp scr co2 recovery horticulture html biomass chp flue gas scr cleaning biogenic co2 direct enrichment in venlo glasshouses engineering thermodynamics of biomass"
  },
  {
    "title": "AI-Driven Model Predictive Control (MPC) in Commercial Venlo Greenhouses: Real-Time Energy-Yield Optimization",
    "cat": "article",
    "url": "articles/article-54-ai-model-predictive-control-mpc-venlo-greenhouse.html",
    "icon": "📚",
    "desc": "Engineering mathematical formulation of Model Predictive Control (MPC), transient thermodynamic microclimate modeling, dynamic assimilation lighting.",
    "tags": "articles article 54 ai model predictive control mpc venlo greenhouse html ai driven model predictive control mpc in commercial venlo greenhouses real time energy yield optimization engineeri"
  },
  {
    "title": "Nutrient Uptake Concentration Factor (UCF) in Recirculating Hydroponics: Ion Dynamics & Leaching Fractions",
    "cat": "article",
    "url": "articles/article-55-nutrient-uptake-concentration-factor-recirculating-hydroponics.html",
    "icon": "📚",
    "desc": "Engineering mass balance formulation of nutrient uptake concentration factors (UCF), ion accumulation kinetics, sodium salinity limits, and optimal.",
    "tags": "articles article 55 nutrient uptake concentration factor recirculating hydroponics html nutrient uptake concentration factor ucf in recirculating hydroponics ion dynamics leaching fractions "
  },
  {
    "title": "Far-Red Photobiology (ePAR 400–750 nm) & Phytochrome Photostationary State (PSS) in Greenhouse Horticulture",
    "cat": "article",
    "url": "articles/article-56-far-red-photobiology-epar-phytochrome-photostationary-state.html",
    "icon": "📚",
    "desc": "Engineering biophysics of far-red photon efficacy, ePAR extended photosynthetic range (400-750 nm), phytochrome photostationary state (PSS), and automated clima",
    "tags": "articles article 56 far red photobiology epar phytochrome photostationary state html far red photobiology epar 400 750 nm phytochrome photostationary state pss in greenhouse horticulture eng"
  },
  {
    "title": "The 8% Out-of-Pocket Playbook: Stacking USDA REAP, CDFA SWEEP, and IOU Utility Rebates for California CEA Greenhouses",
    "cat": "article",
    "url": "articles/article-57-california-cea-greenhouse-electrification-rebate-grant-stacking.html",
    "icon": "📚",
    "desc": "Engineering and grant stacking playbook for California commercial greenhouses, nurseries, and vertical farms to achieve up to 92% non-dilutive capital.",
    "tags": "articles article 57 california cea greenhouse electrification rebate grant stacking html the 8 out of pocket playbook stacking usda reap cdfa sweep and iou utility rebates for california cea"
  },
  {
    "title": "Dynamic CO2 Enrichment Kinetics & RuBisCO Carboxylation Thermodynamics in High-Wire Venlo Greenhouses",
    "cat": "article",
    "url": "articles/article-58-dynamic-co2-enrichment-kinetics-rubisco-carboxylation-venlo.html",
    "icon": "📚",
    "desc": "Engineering biophysics and microeconomic modeling of dynamic CO2 enrichment, RuBisCO carboxylation kinetics (Farquhar FvCB model), stomatal conductance.",
    "tags": "articles article 58 dynamic co2 enrichment kinetics rubisco carboxylation venlo html dynamic co2 enrichment kinetics rubisco carboxylation thermodynamics in high wire venlo greenhouses engin"
  },
  {
    "title": "EPEX Spot Negative Day-Ahead Arbitrage, Hybrid BESS Sizing & Power-to-Heat Thermal Buffering in Venlo Greenhouses",
    "cat": "article",
    "url": "articles/article-59-epex-spot-negative-pricing-bess-power-to-heat-greenhouse.html",
    "icon": "📚",
    "desc": "Engineering thermodynamics and quantitative energy arbitrage: electrode boilers, heat pump integration, atmospheric thermocline buffer tanks, and BESS.",
    "tags": "articles article 59 epex spot negative pricing bess power to heat greenhouse html epex spot negative day ahead arbitrage hybrid bess sizing power to heat thermal buffering in venlo greenhous"
  },
  {
    "title": "Real-Time Ion-Selective Electrode (ISE) Arrays, Nicolsky-Eisenman Potentiometry & Closed-Loop Autonomous Nutrient Dosing in Commercial High-Wire Hydroponics",
    "cat": "article",
    "url": "articles/article-60-potentiometric-ion-selective-electrode-ise-closed-loop-hydroponics.html",
    "icon": "📚",
    "desc": "Engineering principles of real-time multi-ion sensing (NO3-, K+, Ca2+, Mg2+, H2PO4-), Nicolsky-Eisenman interference correction, Davies activity.",
    "tags": "articles article 60 potentiometric ion selective electrode ise closed loop hydroponics html real time ion selective electrode ise arrays nicolsky eisenman potentiometry closed loop autonomou"
  },
  {
    "title": "Dynamic Thermal Screen Gap Control, Evaporative Transpiration Latent Heat & Psychrometric Energy Optimization in Semi-Closed Venlo Greenhouses",
    "cat": "article",
    "url": "articles/article-61-thermal-screen-gap-transpiration-latent-heat-greenhouse-energy.html",
    "icon": "📚",
    "desc": "Thermodynamic modeling of thermal screen gaps, Rayleigh-Bénard cold downdraft convection, crop latent heat transpiration, and active psychrometric.",
    "tags": "articles article 61 thermal screen gap transpiration latent heat greenhouse energy html dynamic thermal screen gap control evaporative transpiration latent heat psychrometric energy optimiza"
  },
  {
    "title": "2026-2027 US 50-State Agricultural Grant &amp; Subsidy Playbook: Non-Dilutive Capital for Smart Farms &amp; CEA Growers",
    "cat": "article",
    "url": "articles/article-62-us-50-state-agricultural-grant-playbook.html",
    "icon": "📚",
    "desc": "Comprehensive 50-state commercial agricultural subsidy and grant playbook. How US farmers, CEA greenhouse operators, and agribusinesses secure up to 90% CAPEX r",
    "tags": "articles article 62 us 50 state agricultural grant playbook html 2026 2027 us 50 state agricultural grant amp subsidy playbook non dilutive capital for smart farms amp cea growers comprehens"
  },
  {
    "title": "Precision Irrigation &amp; Water Grants in Florida &amp; Texas: FDACS BMP Cost-Share and TWDB Funding Guide",
    "cat": "article",
    "url": "articles/article-63-florida-texas-agricultural-water-irrigation-grants.html",
    "icon": "📚",
    "desc": "Technical guide for Florida and Texas commercial agricultural producers to secure up to 87.5% cost-share for precision micro-irrigation, subsurface.",
    "tags": "articles article 63 florida texas agricultural water irrigation grants html precision irrigation amp water grants in florida amp texas fdacs bmp cost share and twdb funding guide technical g"
  },
  {
    "title": "Midwest &amp; Corn Belt Soil Health Grants: Iowa WQI, Ohio H2Ohio, and Minnesota AGRI Programs",
    "cat": "article",
    "url": "articles/article-64-midwest-corn-belt-water-quality-soil-health-subsidies.html",
    "icon": "📚",
    "desc": "Technical guide for Midwest row-crop producers and livestock operators to access 75% to 100% grant funding for edge-of-field bioreactors, saturated.",
    "tags": "articles article 64 midwest corn belt water quality soil health subsidies html midwest amp corn belt soil health grants iowa wqi ohio h2ohio and minnesota agri programs technical guide for m"
  },
  {
    "title": "Greenhouse Energy Efficiency &amp; Thermal Screen Grants: Oregon ETO, Washington WSDA, and NYSERDA Guide",
    "cat": "article",
    "url": "articles/article-65-pnw-northeast-cea-greenhouse-energy-grants.html",
    "icon": "📚",
    "desc": "Technical guide for commercial greenhouse and CEA nursery growers in Oregon, Washington, New York, and Massachusetts to capture up to 85% grant funding.",
    "tags": "articles article 65 pnw northeast cea greenhouse energy grants html greenhouse energy efficiency amp thermal screen grants oregon eto washington wsda and nyserda guide technical guide for co"
  },
  {
    "title": "California SWEEP vs. Texas TWDB Agricultural Water Grants: Precision Irrigation &amp; Cost-Share Architecture",
    "cat": "article",
    "url": "articles/article-66-california-sweep-vs-texas-twdb-agricultural-water-grants.html",
    "icon": "📚",
    "desc": "Technical comparison of California CDFA SWEEP ($200,000 cap) and Texas TWDB Agricultural Water Conservation Grants ($500,000 cap). Detailed engineering.",
    "tags": "articles article 66 california sweep vs texas twdb agricultural water grants html california sweep vs texas twdb agricultural water grants precision irrigation amp cost share architecture te"
  },
  {
    "title": "Deep Geothermal Heating &amp; Industrial Heat Pumps in Venlo Greenhouses: German Meister Engineering (VDI 4640 / DIN EN 13031) vs. US DOE &amp; USDA REAP Grants",
    "cat": "article",
    "url": "articles/article-67-geothermal-district-heating-industrial-heat-pumps-greenhouse.html",
    "icon": "📚",
    "desc": "Technical engineering guide to deep geothermal doublets, industrial heat pumps (R717/R1233zd(E)), VDI 4640 / DIN EN 13031 standards, root-zone.",
    "tags": "articles article 67 geothermal district heating industrial heat pumps greenhouse html deep geothermal heating amp industrial heat pumps in venlo greenhouses german meister engineering vdi 46"
  },
  {
    "title": "Direct Air Capture (DAC) &amp; Solid-Amine CO₂ Desorption in Decarbonized Greenhouses: Solving the Carbon Deficit via Heat Pump Integration &amp; 45Q Grants",
    "cat": "article",
    "url": "articles/article-68-direct-air-capture-solid-amine-co2-greenhouse-heat-pumps.html",
    "icon": "📚",
    "desc": "Technical guide to solid-amine TVSA Direct Air Capture (DAC) integrated with heat pump low-grade thermal waste heat (65°C–80°C) for fossil-free Venlo.",
    "tags": "articles article 68 direct air capture solid amine co2 greenhouse heat pumps html direct air capture dac amp solid amine co desorption in decarbonized greenhouses solving the carbon deficit "
  },
  {
    "title": "Biomass-Fired CHP District Energy Integration in Venlo Greenhouses: Flue Gas SCR & Municipal Heat Coupling (Vol. 69)",
    "cat": "article",
    "url": "articles/article-69-biomass-chp-flue-gas-scr-district-heating-greenhouse.html",
    "icon": "📚",
    "desc": "Technical whitepaper on biomass-fired combined heat and power (CHP) in high-wire Venlo greenhouses: fluidized bed combustion, catalytic SCR DeNOx for commercial",
    "tags": "articles article 69 biomass chp flue gas scr district heating greenhouse html biomass fired chp district energy integration in venlo greenhouses flue gas scr municipal heat coupling vol 69 t"
  },
  {
    "title": "Nanobubble Oxy-Fertigation & Cavitation Physics in Venlo Hydroponics: DO Supersaturation & Pythium Inactivation (Vol. 70)",
    "cat": "article",
    "url": "articles/article-70-nanobubble-dissolved-oxygen-pythium-suppression-rockwool.html",
    "icon": "📚",
    "desc": "Technical whitepaper on nanobubble oxy-fertigation in high-wire Venlo greenhouses: Young-Laplace internal bubble pressure, zeta potential stability.",
    "tags": "articles article 70 nanobubble dissolved oxygen pythium suppression rockwool html nanobubble oxy fertigation cavitation physics in venlo hydroponics do supersaturation pythium inactivation v"
  },
  {
    "title": "Horizontal Air Flow (HAF) Dynamics & Boundary Layer Decoupling in Venlo Greenhouses (Vol. 71)",
    "cat": "article",
    "url": "articles/article-71-haf-fan-microclimate-boundary-layer-dynamics.html",
    "icon": "📚",
    "desc": "Technical whitepaper on horizontal air flow (HAF) aerodynamics in commercial Venlo greenhouses: microclimate stratification elimination, boundary layer.",
    "tags": "articles article 71 haf fan microclimate boundary layer dynamics html horizontal air flow haf dynamics boundary layer decoupling in venlo greenhouses vol 71 technical whitepaper on horizonta"
  },
  {
    "title": "Thermodynamic Optimization of Semi-Closed Venlo Greenhouses: High-Pressure Fogging, Active Mechanical Dehumidification, and Latent Heat Recovery (Vol. 72)",
    "cat": "article",
    "url": "articles/article-72-semi-closed-greenhouse-mollier-psychrometrics-latent-heat.html",
    "icon": "📚",
    "desc": "Technical engineering monograph on semi-closed Venlo greenhouse thermodynamics: positive-pressure air distribution ducts, Mollier h-x psychrometric.",
    "tags": "articles article 72 semi closed greenhouse mollier psychrometrics latent heat html thermodynamic optimization of semi closed venlo greenhouses high pressure fogging active mechanical dehumid"
  },
  {
    "title": "Closed-Loop Hydroponic Drainage Recirculation: Davies Chemical Speciation, Multi-Cycle Ballast Ion (Na+/Cl-) Accumulation Kinetics, and German DüV Zero-Discharge Economics (Vol. 73)",
    "cat": "article",
    "url": "articles/article-73-closed-loop-nutrient-recirculation-davies-ion-balance.html",
    "icon": "📚",
    "desc": "Technical engineering monograph on closed-loop hydroponic drainage recirculation: Davies ionic activity speciation, multi-cycle sodium and chloride.",
    "tags": "articles article 73 closed loop nutrient recirculation davies ion balance html closed loop hydroponic drainage recirculation davies chemical speciation multi cycle ballast ion na cl accumula"
  },
  {
    "title": "Semi-Closed Greenhouse Corridor Air Treatment Units (ATU): Positive-Pressure Insect Exclusion (+20~25 Pa), Mollier Enthalpy Balancing, and 1-Click VenloCAD 3D Integration (Vol. 74)",
    "cat": "article",
    "url": "articles/article-74-semi-closed-greenhouse-atu-mollier-venlocad-integration.html",
    "icon": "📚",
    "desc": "Technical engineering monograph on semi-closed greenhouse corridor Air Treatment Units (ATU): positive-pressure insect exclusion (+20~25 Pa), Mollier.",
    "tags": "articles article 74 semi closed greenhouse atu mollier venlocad integration html semi closed greenhouse corridor air treatment units atu positive pressure insect exclusion 20 25 pa mollier e"
  },
  {
    "title": "Aquifer Thermal Energy Storage (ATES) & Industrial Heat Pump Integration in Commercial Greenhouses: Doublet Well Hydraulics, Seasonal Thermal Recovery (η_th ≥ 82%), VDI 4640 Sizing, and Decarbonization Economics (Vol. 75)",
    "cat": "article",
    "url": "articles/article-75-ates-aquifer-thermal-energy-storage-heat-pumps-greenhouse.html",
    "icon": "📚",
    "desc": "Technical engineering monograph on Aquifer Thermal Energy Storage (ATES) and industrial heat pump integration in commercial CEA greenhouses.",
    "tags": "articles article 75 ates aquifer thermal energy storage heat pumps greenhouse html aquifer thermal energy storage ates industrial heat pump integration in commercial greenhouses doublet well"
  },
  {
    "title": "High-Tech Venlo Greenhouse Climate Engineering &amp; Biocontrol Cybernetics in Knoblauchsland: AR Diffuse Glass Optics, VPD Microclimate Control (0.60–0.85 kPa), Low-Temp Hydronics, and OECD Tomato Postharvest Standards (Vol. 76)",
    "cat": "article",
    "url": "articles/article-76-knoblauchsland-greenhouse-climate-vpd-biocontrol-oecd.html",
    "icon": "📚",
    "desc": "Technical engineering monograph on modern CEA greenhouse management in Nuremberg Knoblauchsland: AR diffuse glass (96% transmission, 25% haze), VPD.",
    "tags": "articles article 76 knoblauchsland greenhouse climate vpd biocontrol oecd html high tech venlo greenhouse climate engineering amp biocontrol cybernetics in knoblauchsland ar diffuse glass op"
  },
  {
    "title": "High-Tech Greenhouse Postharvest Intralogistics &amp; Cold Chain Engineering: Automated Guided Vehicles (AGV/FTS), Forced-Air Precooling Thermodynamics, Chilling Injury Prevention, and IFS Food 8 / UNECE Quality Compliance (Vol. 77)",
    "cat": "article",
    "url": "articles/article-77-greenhouse-postharvest-intralogistics-cold-chain-quality.html",
    "icon": "📚",
    "desc": "Technical monograph on modern CEA postharvest engineering: AGV/FTS fleet intralogistics, forced-air precooling thermodynamics (12–15°C), chilling.",
    "tags": "articles article 77 greenhouse postharvest intralogistics cold chain quality html high tech greenhouse postharvest intralogistics amp cold chain engineering automated guided vehicles agv fts"
  },
  {
    "title": "EU Commercial Greenhouse Energy Auditing (DIN V 18599 / EN 13031-1), German Federal BLE 40% Decarbonization Grants, BEHG/ETS-2 Carbon Pricing, and 10-Year Hofnachfolge Equity Succession Engineering (Vol. 78)",
    "cat": "article",
    "url": "articles/article-78-eu-greenhouse-energy-audit-din-18599-ble-grant-hofnachfolge.html",
    "icon": "📚",
    "desc": "Technical engineering and agri-finance monograph on EU commercial greenhouse energy auditing (DIN V 18599 / EN 13031-1), German Federal BLE 40% decarbonization ",
    "tags": "articles article 78 eu greenhouse energy audit din 18599 ble grant hofnachfolge html eu commercial greenhouse energy auditing din v 18599 en 13031 1 german federal ble 40 decarbonization gra"
  },
  {
    "title": "VPD-Meisterklasse im Gewächshaus: Dampfdruckdefizit & Spaltöffnungs-Transpiration",
    "cat": "article",
    "url": "articles/de/article-01-vpd-meisterklasse.html",
    "icon": "🇩🇪",
    "desc": "Physikalische Berechnung des Dampfdruckdefizits (VPD), Blatt-zu-Luft-Transpirationsdynamik und Vermeidung von Blütenendfäule im modernen Unterglasgartenbau.",
    "tags": "articles de article 01 vpd meisterklasse html vpd meisterklasse im gewächshaus dampfdruckdefizit spaltöffnungs transpiration physikalische berechnung des dampfdruckdefizits vpd blatt zu luft"
  },
  {
    "title": "Tägliches Lichtintegral (DLI) & LED-Belichtung berechnen: PPFD-Formel, Photobiologie & ROI",
    "cat": "article",
    "url": "articles/de/article-02-dli-tageslichtintegral-vertikale-landwirtschaft-led-roi.html",
    "icon": "🇩🇪",
    "desc": "Praxisleitfaden und Berechnung für das tägliche Lichtintegral (DLI in mol/m²/d) aus PPFD (µmol/m²/s), McCree-Aktionsspektrum, Far-Red-Steuerung und LED-Stromkos",
    "tags": "articles de article 02 dli tageslichtintegral vertikale landwirtschaft led roi html tägliches lichtintegral dli led belichtung berechnen ppfd formel photobiologie roi praxisleitfaden und ber"
  },
  {
    "title": "Hummelbestäubung (Bombus terrestris), Nützlingseinsatz & Wartezeiten (REI / Bienenschutz B1–B4) im Gewächshaus",
    "cat": "article",
    "url": "articles/de/article-03-hummelbestaeubung-nuetzlinge-wartezeit-pflanzenschutz-gewaechshaus.html",
    "icon": "🇩🇪",
    "desc": "Leitfaden für den integrierten Pflanzenschutz (IPM) im Gewächshaus: Hummelbestäubung (Bombus terrestris), Mikroklima-Grenzen, Bienenschutzklassen B1–B4, Wiederb",
    "tags": "articles de article 03 hummelbestaeubung nuetzlinge wartezeit pflanzenschutz gewaechshaus html hummelbestäubung bombus terrestris nützlingseinsatz wartezeiten rei bienenschutz b1 b4 im gewäc"
  },
  {
    "title": "Wärmedurchgangskoeffizienten (U'-Werte), Kittlose Verglasung &amp; Mehrlagenschirm-Thermodynamik im Venlo-Gewächshaus",
    "cat": "article",
    "url": "articles/de/article-04-gewaechshaus-waermeverlust-u-wert-energieschirme.html",
    "icon": "🇩🇪",
    "desc": "Bauphysikalische Berechnung von Spitzenheizlasten (Q = U'·A·ΔT), kittloser Verglasung, Kamineffekt, Mehrlagenschirmen (Luxous 1147 FR) und Latentwärmerückgewinn",
    "tags": "articles de article 04 gewaechshaus waermeverlust u wert energieschirme html wärmedurchgangskoeffizienten u werte kittlose verglasung amp mehrlagenschirm thermodynamik im venlo gewächshaus b"
  },
  {
    "title": "Stündliche Penman-Monteith-Evapotranspiration (ET₀), Strahlungssummen-Bewässerung &amp; Autonome Klimacomputer (RAM CC600 / Priva Operator)",
    "cat": "article",
    "url": "articles/de/article-05-penman-monteith-transpiration-automatisierung-ram-priva.html",
    "icon": "🇩🇪",
    "desc": "Biophysikalische Modellierung der FAO-56 Penman-Monteith-Transpiration (ET₀), Strahlungssummen-Tropfbewässerung und dezentrale Klimacomputer-Fernsteuerung (RAM ",
    "tags": "articles de article 05 penman monteith transpiration automatisierung ram priva html stündliche penman monteith evapotranspiration et strahlungssummen bewässerung amp autonome klimacomputer r"
  },
  {
    "title": "Molare Stöchiometrie, Sonneveld/Steiner-Ionenbilanz (mmol/L &amp; meq/L) &amp; Geschlossene A/B-Fertigation im Unterglasgartenbau",
    "cat": "article",
    "url": "articles/de/article-06-naehrloesungsberechnung-stammbehaelter-ab-ec-duengung.html",
    "icon": "🇩🇪",
    "desc": "Molare Nährlösungsberechnung (mmol/L &amp; meq/L) nach Sonneveld und Steiner, Kationen-Anionen-Äquivalenz, A/B-Stammlösungsbehälter (Gipsfällungsschutz) und ges",
    "tags": "articles de article 06 naehrloesungsberechnung stammbehaelter ab ec duengung html molare stöchiometrie sonneveld steiner ionenbilanz mmol l amp meq l amp geschlossene a b fertigation im unte"
  },
  {
    "title": "Photomorphogenese, PAR/ePAR-Spektralqualität (DIN 5031-10) &amp; Emerson-Effekt in der LED-Gewächshausbelichtung",
    "cat": "article",
    "url": "articles/de/article-07-belichtungsspektrum-par-epar-photomorphogenese-led-gartenbau.html",
    "icon": "🇩🇪",
    "desc": "Photobiologische Steuerung im Unterglasgartenbau und Vertical Farming nach DIN 5031-10: McCree-Quantenspektrum, Phytochrom-Photogleichgewicht (PSS = Pfr/Ptotal)",
    "tags": "articles de article 07 belichtungsspektrum par epar photomorphogenese led gartenbau html photomorphogenese par epar spektralqualität din 5031 10 amp emerson effekt in der led gewächshausbeli"
  },
  {
    "title": "Vol. 08: Monstera deliciosa im Erwerbsgartenbau — Epiphyten-Substratphysik (Luftkapazität ≥ 25 %), Fenestrations-Photobiologie & DLI/VPD-Steuerung",
    "cat": "article",
    "url": "articles/de/article-08-monstera-deliciosa-kulturfuehrung-epiphyten-substrat-vpd.html",
    "icon": "🇩🇪",
    "desc": "Ingenieur-Monographie zur Kulturführung von Monstera deliciosa (Araceae): Hemiepiphytische Wurzelphysiologie, luftführende Substratporosität (ε_a ≥ 25 %), progr",
    "tags": "articles de article 08 monstera deliciosa kulturfuehrung epiphyten substrat vpd html vol 08 monstera deliciosa im erwerbsgartenbau epiphyten substratphysik luftkapazität 25 fenestrations pho"
  },
  {
    "title": "Stomatäre Leitfähigkeit (Ball-Berry), FvCB-Photosynthesekinetik &amp; CO2-Assimilationssteuerung im Gewächshaus",
    "cat": "article",
    "url": "articles/de/article-09-stomata-leitfaehigkeit-co2-assimilation-gaswechsel-kinetik.html",
    "icon": "🇩🇪",
    "desc": "Pflanzenbiophysikalische Modellierung der stomatären Leitfähigkeit (gs) nach Ball-Berry-Leuning, Farquhar-von-Caemmerer-Berry (FvCB) A-Ci-Assimilationskurven un",
    "tags": "articles de article 09 stomata leitfaehigkeit co2 assimilation gaswechsel kinetik html stomatäre leitfähigkeit ball berry fvcb photosynthesekinetik amp co2 assimilationssteuerung im gewächsh"
  },
  {
    "title": "HLK-Dimensionierung und psychrometrische Entfeuchtung in der vertikalen Landwirtschaft (Vertical Farming): Sensible vs. latente Kühllast &amp; CFD-Strömung",
    "cat": "article",
    "url": "articles/de/article-10-vertikale-landwirtschaft-hlk-entfeuchtung-psychrometrie.html",
    "icon": "🇩🇪",
    "desc": "Ingenieurleitfaden (DE Vol. 10) zur HLK-Auslegung für kommerzielle Indoor Vertical Farms: Berechnung sensibler und latenter Kühllasten (SHR), Mollier-h-x-Psychr",
    "tags": "articles de article 10 vertikale landwirtschaft hlk entfeuchtung psychrometrie html hlk dimensionierung und psychrometrische entfeuchtung in der vertikalen landwirtschaft vertical farming se"
  },
  {
    "title": "Unterglas-Erdbeeranbau auf Stellagen: Blütenknospendifferenzierung, Kältesummen-Steuerung &amp; Tag-Nacht-Temperaturdifferenz (DIF)",
    "cat": "article",
    "url": "articles/de/article-11-erdbeeranbau-unterglas-blueteninduktion-dif-klimafuehrung.html",
    "icon": "🇩🇪",
    "desc": "Ingenieurleitfaden (DE Vol. 11) für den kommerziellen Erdbeeranbau im Venlo-Gewächshaus: Kurztag-Blüteninduktion, Kältesummen, Stickstoff-Restriktion (&lt; 3 me",
    "tags": "articles de article 11 erdbeeranbau unterglas blueteninduktion dif klimafuehrung html unterglas erdbeeranbau auf stellagen blütenknospendifferenzierung kältesummen steuerung amp tag nacht te"
  },
  {
    "title": "Blütenendfäule (BER) bei Gewächshaustomaten: Apoplastischer Xylem-Kalziumtransport, Kationen-Antagonismus &amp; Nächtliche Wurzeldruck-Steuerung",
    "cat": "article",
    "url": "articles/de/article-12-tomate-bluetenendfaeule-kalziumtransport-xylem-vpd.html",
    "icon": "🇩🇪",
    "desc": "Ingenieurleitfaden (DE Vol. 12) zur Vermeidung der Blütenendfäule (Blossom-End Rot, BER) im Tomaten- und Paprikaanbau unter Glas: Apoplastische Ca2+-Xylempartit",
    "tags": "articles de article 12 tomate bluetenendfaeule kalziumtransport xylem vpd html blütenendfäule ber bei gewächshaustomaten apoplastischer xylem kalziumtransport kationen antagonismus amp nächt"
  },
  {
    "title": "Präzisions-Sensorkalibrierung im Smart-Greenhouse: Nernst-Gleichung (pH/EC), TDR/FDR-Substratfeuchte &amp; NDIR-CO2-Driftkompensation",
    "cat": "article",
    "url": "articles/de/article-13-sensorkalibrierung-messunsicherheit-pt100-ndir-fd-smartfarm.html",
    "icon": "🇩🇪",
    "desc": "Ingenieurleitfaden zur Sensorkalibrierung im Unterglasgartenbau: Zweipunkt-Kalibrierung nach der Nernst-Gleichung (pH 7,00/4,01), Temperaturkompensation der ele",
    "tags": "articles de article 13 sensorkalibrierung messunsicherheit pt100 ndir fd smartfarm html präzisions sensorkalibrierung im smart greenhouse nernst gleichung ph ec tdr fdr substratfeuchte amp n"
  },
  {
    "title": "Vertical Farming HVAC & Entfeuchtung berechnen: Latente Transpirationslast, Mollier-h-x & Wärmerückgewinnung",
    "cat": "article",
    "url": "articles/de/article-14-vertical-farming-hvac-entfeuchtung-kondensation-waermerueckgewinnung.html",
    "icon": "🇩🇪",
    "desc": "Ingenieurleitfaden zur HVAC- und Entfeuchtungsauslegung im Vertical Farming und Indoor-Gartenbau: Latente Dampfmassenbilanz, Sensible-Heat-Ratio (SHR), Mollier-",
    "tags": "articles de article 14 vertical farming hvac entfeuchtung kondensation waermerueckgewinnung html vertical farming hvac entfeuchtung berechnen latente transpirationslast mollier h x wärmerück"
  },
  {
    "title": "Vol. 15: Innenraumbegrünung & Biophiles Design — Lichtkompensationspunkt (LCP), Lux-PPFD-Konversion, Living-Wall-Hydraulik & VOC-Phytoremediation",
    "cat": "article",
    "url": "articles/de/article-15-innenraumbegruenung-biophiles-design-lichtkompensationspunkt-voc.html",
    "icon": "🇩🇪",
    "desc": "Ingenieur-Monographie zur professionellen Innenraumbegrünung nach FLL-Richtlinien: Lichtkompensationspunkt (LCP), spektrale Lux-zu-PPFD-Umrechnung, Hydrokultur-",
    "tags": "articles de article 15 innenraumbegruenung biophiles design lichtkompensationspunkt voc html vol 15 innenraumbegrünung biophiles design lichtkompensationspunkt lcp lux ppfd konversion living"
  },
  {
    "title": "Vol. 16: Gärtnermeister-Klimasteuerung im Venlo-Gewächshaus — Mollier-h-x-Diagramm, Taupunktabstand & Heizrohr-Regelung",
    "cat": "article",
    "url": "articles/de/article-16-gaertnermeister-gewaechshaus-klimasteuerung-taupunkt-heizrohr.html",
    "icon": "🇩🇪",
    "desc": "Ingenieur-Monographie zur deutschen Gärtnermeister-Klimasteuerung nach KTBL und DIN EN 13031-1: Mollier-h-x-Psychrometrie, Taupunktabstand ΔT_Tau, Mindest-Rohrt",
    "tags": "articles de article 16 gaertnermeister gewaechshaus klimasteuerung taupunkt heizrohr html vol 16 gärtnermeister klimasteuerung im venlo gewächshaus mollier h x diagramm taupunktabstand heizr"
  },
  {
    "title": "Vol. 17: Biophysikalische Substratphysik im Erwerbsgartenbau — Luftkapazität (AFP), pF-Wasserretentionskurven & Wurzelzonen-Sauerstoffdiffusion",
    "cat": "article",
    "url": "articles/de/article-17-substratphysik-luftkapazitaet-wasserretention-wurzelbelueftung.html",
    "icon": "🇩🇪",
    "desc": "Ingenieur-Monographie zur Substratphysik im Topf- und Containerbau: Gesamtporenvolumen (GPV), Luftkapazität bei pF 1,0, Stauwasserzone (Perched Water Table), Va",
    "tags": "articles de article 17 substratphysik luftkapazitaet wasserretention wurzelbelueftung html vol 17 biophysikalische substratphysik im erwerbsgartenbau luftkapazität afp pf wasserretentionskur"
  },
  {
    "title": "Vol. 18: Rezirkulierende Nährlösungsentkeimung im geschlossenen Gewächshaus — UV-C-Dosis (254 nm), Ozon-Redoxpotential, Thermodesinfektion & Fe-Chelat-Photolyse",
    "cat": "article",
    "url": "articles/de/article-18-rezirkulierende-naehrloesungsentkeimung-uv-c-ozon-ultrafiltration-chelat.html",
    "icon": "🇩🇪",
    "desc": "Ingenieur-Monographie zur Dränwasser-Entkeimung im geschlossenen Hydroponik-Kreislauf nach WHG/DüV: Beer-Lambert-Transmission (T10), UV-C-Inaktivierungskinetik ",
    "tags": "articles de article 18 rezirkulierende naehrloesungsentkeimung uv c ozon ultrafiltration chelat html vol 18 rezirkulierende nährlösungsentkeimung im geschlossenen gewächshaus uv c dosis 254 "
  },
  {
    "title": "Vol. 19: Vertikale Landwirtschaft (PFAL) & Biomasse-Konversionseffizienz — Lichtnutzungseffizienz (LUE/PUE), Ernteindex (HI) & Strom-zu-Biomasse-Kinetik",
    "cat": "article",
    "url": "articles/de/article-19-vertikale-landwirtschaft-biomasse-konversionseffizienz-lue-ernteindex.html",
    "icon": "🇩🇪",
    "desc": "Ingenieur-Monographie zur Photonen- und Energiekonversion in der Vertikalen Landwirtschaft (Vertical Farming): Lichtnutzungseffizienz LUE (g/mol), LED-Effizienz",
    "tags": "articles de article 19 vertikale landwirtschaft biomasse konversionseffizienz lue ernteindex html vol 19 vertikale landwirtschaft pfal biomasse konversionseffizienz lichtnutzungseffizienz lu"
  },
  {
    "title": "Vol. 20: Blatttemperatur-Infrarot-Thermometrie, Emissionsgrad (ε = 0,98), Blatt-Energiebilanz & Crop Water Stress Index (CWSI)",
    "cat": "article",
    "url": "articles/de/article-20-blatttemperatur-infrarot-thermometrie-emissionsgrad-energiebilanz.html",
    "icon": "🇩🇪",
    "desc": "Ingenieur-Monographie zur radiometrischen Blatttemperaturmessung im Gewächshaus: Stefan-Boltzmann-Gesetz, kutikulärer Emissionsgrad (0,98), Blatt-Energiebilanz,",
    "tags": "articles de article 20 blatttemperatur infrarot thermometrie emissionsgrad energiebilanz html vol 20 blatttemperatur infrarot thermometrie emissionsgrad 0 98 blatt energiebilanz crop water s"
  },
  {
    "title": "Vol. 21: Chlorophyll-a-Fluoreszenzkinetik (Fv/Fm &amp; OJIP), PAM-Fluorometrie &amp; präsymptomatische Pflanzenstress-Metrologie",
    "cat": "article",
    "url": "articles/de/article-21-chlorophyllfluoreszenz-fvfm-quantenausbeute-pflanzenstress-pam.html",
    "icon": "🇩🇪",
    "desc": "Ingenieur-Monographie zur zerstörungsfreien Echtzeit-Diagnose im Unterglasgartenbau: Kautsky-Effekt, maximale PSII-Quantenausbeute (Fv/Fm), effektive Quantenaus",
    "tags": "articles de article 21 chlorophyllfluoreszenz fvfm quantenausbeute pflanzenstress pam html vol 21 chlorophyll a fluoreszenzkinetik fv fm amp ojip pam fluorometrie amp präsymptomatische pflan"
  },
  {
    "title": "Vol. 22: HPS- vs. LED-Assimilationsbelichtung im Venlo-Gewächshaus — Photonenausbeute (µmol/J), Dunkelrot-Emerson-Effekt, Strahlungswärmebilanz &amp; Wirtschaftlichkeit",
    "cat": "article",
    "url": "articles/de/article-22-hps-vs-led-assimilation-belichtung-strahlungsheizung-wirtschaftlichkeit.html",
    "icon": "🇩🇪",
    "desc": "Ingenieur-Monographie zum Systemvergleich von 1000-W-Natriumdampf-Hochdrucklampen (SON-T/HPS) und Voll- bzw. Hybrid-LED-Belichtung: Elektrische Photonenausbeute",
    "tags": "articles de article 22 hps vs led assimilation belichtung strahlungsheizung wirtschaftlichkeit html vol 22 hps vs led assimilationsbelichtung im venlo gewächshaus photonenausbeute mol j dunk"
  },
  {
    "title": "Vol. 23: Geschlossene Tiefwasserkultur (DWC) &amp; Mikrodosierungs-Automatisierung — Henry-Sauerstoffsättigung (DO), Venturi-Nano-Begasung, ORP &amp; Mehrkanal-PID-Fertigation",
    "cat": "article",
    "url": "articles/de/article-23-geschlossene-tiefwasserkultur-dwc-sauerstoffsaettigung-venturi-automatisierung.html",
    "icon": "🇩🇪",
    "desc": "Ingenieur-Monographie für rezirkulierende Tiefwasserkultur (DWC / Floating Raft) und NFT-Systeme: Gelöstsauerstoff-Kinetik nach dem Henry-Gesetz, Q10-Wurzelatmu",
    "tags": "articles de article 23 geschlossene tiefwasserkultur dwc sauerstoffsaettigung venturi automatisierung html vol 23 geschlossene tiefwasserkultur dwc amp mikrodosierungs automatisierung henry "
  },
  {
    "title": "Optimierung des Dunkelrot (730nm) & Hellrot (660nm) LED-Spektrums",
    "cat": "article",
    "url": "articles/de/article-24-far-red-deep-red-spektrum-optimierung.html",
    "icon": "🇩🇪",
    "desc": "Wissenschaftliche Analyse des Emerson-Effekts, des Photosystem-Gleichgewichts und der Dunkelrot-Zusatzbelichtung im erwerbsmäßigen Gewächshausanbau.",
    "tags": "articles de article 24 far red deep red spektrum optimierung html optimierung des dunkelrot 730nm hellrot 660nm led spektrums wissenschaftliche analyse des emerson effekts des photosystem gl"
  },
  {
    "title": "Geschlossene Nährlösungs-Kreisläufe & Nanoblasen-Sauerstoffbegasung",
    "cat": "article",
    "url": "articles/de/article-25-geschlossene-hydrokultur-nanoblasen-sauerstoff.html",
    "icon": "🇩🇪",
    "desc": "Ingenieurwissenschaftliche Analyse geschlossener Hydrokultursysteme, Rhizosphären-Sauerstoffgehalt (DO &gt; 8,5 mg/L) und Pythium-Prävention im geschlossenen Ge",
    "tags": "articles de article 25 geschlossene hydrokultur nanoblasen sauerstoff html geschlossene nährlösungs kreisläufe nanoblasen sauerstoffbegasung ingenieurwissenschaftliche analyse geschlossener "
  },
  {
    "title": "Gewächshaus-Heizlastberechnung & Energieschirme (DIN V 18599)",
    "cat": "article",
    "url": "articles/de/article-26-gewaechshaus-heizlast-din-v-18599.html",
    "icon": "🇩🇪",
    "desc": "Ingenieurwissenschaftliche Berechnung von Spitzenheizlasten, Rohrheizungs-Hydraulik und Energieschirmeinsparungen nach DIN V 18599.",
    "tags": "articles de article 26 gewaechshaus heizlast din v 18599 html gewächshaus heizlastberechnung energieschirme din v 18599 ingenieurwissenschaftliche berechnung von spitzenheizlasten rohrheizun"
  },
  {
    "title": "Biomasseakkumulation & Lichtnutzungseffizienz (LUE)",
    "cat": "article",
    "url": "articles/de/article-27-pflanzenertrag-biomasse-lichtnutzungseffizienz.html",
    "icon": "🇩🇪",
    "desc": "Ertragsprognosen im erwerbsmäßigen Gewächshausanbau basierend auf dem kumulierten DLI und der Lichtnutzungseffizienz (LUE = 2,8 - 3,4 g/mol).",
    "tags": "articles de article 27 pflanzenertrag biomasse lichtnutzungseffizienz html biomasseakkumulation lichtnutzungseffizienz lue ertragsprognosen im erwerbsmäßigen gewächshausanbau basierend auf d"
  },
  {
    "title": "CO2-Begasungskinetik & Wirtschaftlichkeitsgrenzen im Gewächshaus",
    "cat": "article",
    "url": "articles/de/article-28-gewaechshaus-co2-duengung-oekonomie.html",
    "icon": "🇩🇪",
    "desc": "Analyse der CO2-Düngung, Lüftungsverlust-Dynamik und ökonomischen ROI-Schwellenwerte im geschützten Erwerbsanbau.",
    "tags": "articles de article 28 gewaechshaus co2 duengung oekonomie html co2 begasungskinetik wirtschaftlichkeitsgrenzen im gewächshaus analyse der co2 düngung lüftungsverlust dynamik und ökonomische"
  },
  {
    "title": "Stundengenaue Penman-Monteith Evapotranspiration",
    "cat": "article",
    "url": "articles/de/article-29-stundengenaue-penman-monteith-evapotranspiration.html",
    "icon": "🇩🇪",
    "desc": "Ingenieurwissenschaftliche Modellierung der stündlichen Evapotranspiration (ETc), des Spaltöffnungswiderstands (rs) und der Präzisionsbewässerung im Unterglasan",
    "tags": "articles de article 29 stundengenaue penman monteith evapotranspiration html stundengenaue penman monteith evapotranspiration ingenieurwissenschaftliche modellierung der stündlichen evapotra"
  },
  {
    "title": "Steinwolle-Hydrodynamik & TDR-Feuchtesensoren",
    "cat": "article",
    "url": "articles/de/article-30-steinwolle-tdr-feuchte-drain-ec.html",
    "icon": "🇩🇪",
    "desc": "Ingenieuranalyse von volumetrischem Wassergehalt (VWC %), Nachtabtrocknung und Drainage-EC-Steuerung im Steinwolleanbau.",
    "tags": "articles de article 30 steinwolle tdr feuchte drain ec html steinwolle hydrodynamik tdr feuchtesensoren ingenieuranalyse von volumetrischem wassergehalt vwc nachtabtrocknung und drainage ec "
  },
  {
    "title": "Hochdruck-Nebeltechnik (70 bar) & Tropfenphysik",
    "cat": "article",
    "url": "articles/de/article-31-hochdruck-nebel-tropfenphysik.html",
    "icon": "🇩🇪",
    "desc": "Ingenieuranalyse der 70-bar-Hochdruckvernebelung, Sauter-Durchmesser (D32 &lt; 10µm), adiabaten Verdunstungskühlung und VPD-Stabilisierung im Gewächshaus.",
    "tags": "articles de article 31 hochdruck nebel tropfenphysik html hochdruck nebeltechnik 70 bar tropfenphysik ingenieuranalyse der 70 bar hochdruckvernebelung sauter durchmesser d32 lt 10 m adiabate"
  },
  {
    "title": "LED-Wärmemanagement & Sperrschichttemperatur (Tj)",
    "cat": "article",
    "url": "articles/de/article-32-led-waermemanagement-sperrschichttemperatur.html",
    "icon": "🇩🇪",
    "desc": "Ingenieurwissenschaftliche Berechnung von LED-Kühlkörpern, Sperrschichttemperaturen (Tj), thermischer Effizienzdegradation und Konvektionswärme im Gewächshaus.",
    "tags": "articles de article 32 led waermemanagement sperrschichttemperatur html led wärmemanagement sperrschichttemperatur tj ingenieurwissenschaftliche berechnung von led kühlkörpern sperrschichtte"
  },
  {
    "title": "Präzisions-Pflanzensteuerung (Generativ vs Vegetativ)",
    "cat": "article",
    "url": "articles/de/article-33-praezisions-pflanzensteuerung-dif-vpd.html",
    "icon": "🇩🇪",
    "desc": "Gartenbauliche Pflanzensteuerung (Crop Steering): Steuerung des vegetativen Wachstums und Fruchtansatzes über Temperatur-DIF, VPD und Substratabtrocknung.",
    "tags": "articles de article 33 praezisions pflanzensteuerung dif vpd html präzisions pflanzensteuerung generativ vs vegetativ gartenbauliche pflanzensteuerung crop steering steuerung des vegetativen"
  },
  {
    "title": "UV-C Entkeimung in geschlossenen Hydrokultursystemen",
    "cat": "article",
    "url": "articles/de/article-34-uvc-entkeimung-geschlossene-hydrokultur.html",
    "icon": "🇩🇪",
    "desc": "Ingenieurwissenschaftliche Berechnung von UV-C-Strahlungsdosen (250 mJ/cm2), UVT%-Transmission und 5-Log-Pathogeninaktivierung (ToBRFV, Pythium) in commercial C",
    "tags": "articles de article 34 uvc entkeimung geschlossene hydrokultur html uv c entkeimung in geschlossenen hydrokultursystemen ingenieurwissenschaftliche berechnung von uv c strahlungsdosen 250 mj"
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
    "title": "BHKW-Rauchgasreinigung & SCR-Katalysator",
    "cat": "article",
    "url": "articles/de/article-36-bhkw-rauchgas-scr-entstickung.html",
    "icon": "🇩🇪",
    "desc": "Ingenieurwissenschaftliche Auslegung von SCR-Entstickungsanlagen, Harnstoffdosierung (AdBlue) und Reingas-CO2-Düngung im Gewächshaus.",
    "tags": "articles de article 36 bhkw rauchgas scr entstickung html bhkw rauchgasreinigung scr katalysator ingenieurwissenschaftliche auslegung von scr entstickungsanlagen harnstoffdosierung adblue un"
  },
  {
    "title": "Wärmepufferspeicher-Schichtung & MWh-Auslegung",
    "cat": "article",
    "url": "articles/de/article-37-waermepufferspeicher-schichtung-auslegung.html",
    "icon": "🇩🇪",
    "desc": "Ingenieurwissenschaftliche Berechnung von Heißwasser-Wärmepufferspeichern, Thermokline-Richardson-Zahl und nächtlicher Entladedauer im Erwerbsgartenbau.",
    "tags": "articles de article 37 waermepufferspeicher schichtung auslegung html wärmepufferspeicher schichtung mwh auslegung ingenieurwissenschaftliche berechnung von heißwasser wärmepufferspeichern t"
  },
  {
    "title": "Xylem-Kalziumtransport & Blütenendfäule",
    "cat": "article",
    "url": "articles/de/article-38-xylem-kalzium-bluetenendfaeule.html",
    "icon": "🇩🇪",
    "desc": "Pflanzenphysiologische Analyse des Xylem-Transpirationsstroms, Kalziumverteilung in der Frucht und Vorbeugung von Blütenendfäule (BER) im Unterglasanbau.",
    "tags": "articles de article 38 xylem kalzium bluetenendfaeule html xylem kalziumtransport blütenendfäule pflanzenphysiologische analyse des xylem transpirationsstroms kalziumverteilung in der frucht"
  },
  {
    "title": "Umkehrosmose-Entsalzung im geschlossenen Anbau",
    "cat": "article",
    "url": "articles/de/article-39-umkehrosmose-entsalzung-energieeffizienz.html",
    "icon": "🇩🇪",
    "desc": "Ingenieurwissenschaftliche Berechnung von Niederdruck-Umkehrosmose (RO), Natriumrückhaltung (99,2%), Energierückgewinnung (PX) und geschlossener Kreislaufführun",
    "tags": "articles de article 39 umkehrosmose entsalzung energieeffizienz html umkehrosmose entsalzung im geschlossenen anbau ingenieurwissenschaftliche berechnung von niederdruck umkehrosmose ro natr"
  },
  {
    "title": "Lichtextinktion (Beer-Lambert) & Diffusglas",
    "cat": "article",
    "url": "articles/de/article-40-beer-lambert-lichtextinktion-diffusglas.html",
    "icon": "🇩🇪",
    "desc": "Pflanzenphysiologische Berechnung der Lichtextinktion im Pflanzenbestand (Beer-Lambertsches Gesetz), Blattflächenindex (LAI) und Ertragssteigerung.",
    "tags": "articles de article 40 beer lambert lichtextinktion diffusglas html lichtextinktion beer lambert diffusglas pflanzenphysiologische berechnung der lichtextinktion im pflanzenbestand beer lamb"
  },
  {
    "title": "Farquhar (FvCB) Photosynthesemodell & CO2-Begasung",
    "cat": "article",
    "url": "articles/de/article-41-farquhar-fvcb-photosynthese-co2.html",
    "icon": "🇩🇪",
    "desc": "Biochemische Modellierung der C3-Photosynthese nach Farquhar, von Caemmerer und Berry (FvCB), Rubisco-Carboxylierungsrate (Vcmax) und Elektronentransport.",
    "tags": "articles de article 41 farquhar fvcb photosynthese co2 html farquhar fvcb photosynthesemodell co2 begasung biochemische modellierung der c3 photosynthese nach farquhar von caemmerer und berr"
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
    "title": "Gewächshaus-Tragwerksplanung (DIN EN 13031-1 & NEN 3859)",
    "cat": "article",
    "url": "articles/de/article-43-gewaechshaus-tragwerksplanung-din-en-13031.html",
    "icon": "🇩🇪",
    "desc": "Bauingenieurtechnische Bemessung von Venlo-Gewächshäusern nach DIN EN 13031-1, Windlasten (qw), Schneelasten, Kulturpflanzenlasten und Fundamentbemessung.",
    "tags": "articles de article 43 gewaechshaus tragwerksplanung din en 13031 html gewächshaus tragwerksplanung din en 13031 1 nen 3859 bauingenieurtechnische bemessung von venlo gewächshäusern nach din"
  },
  {
    "title": "Meister-Deutsch: Open-Source SRS-Lernsystem",
    "cat": "article",
    "url": "articles/de/article-44-meister-deutsch-open-source-srs-lernsystem.html",
    "icon": "🇩🇪",
    "desc": "Open-Source Spaced Repetition System (SRS) für die deutsche Gärtnermeisterprüfung mit Web Speech API Sprachausgabe und farbenblindengerechter Benutzeroberfläche",
    "tags": "articles de article 44 meister deutsch open source srs lernsystem html meister deutsch open source srs lernsystem open source spaced repetition system srs für die deutsche gärtnermeisterprüf"
  },
  {
    "title": "AgriQuant: Energie- & Rohstoff-Quant-Terminal",
    "cat": "article",
    "url": "articles/de/article-45-agriquant-energie-rohstoff-quant-terminal.html",
    "icon": "🇩🇪",
    "desc": "Open-Source Finanz- und Energie-Quant-Terminal für den Erwerbsgartenbau. Berechnung von TTF-Erdgas-Spark-Spreads, Strombörsen-Arbitrage und CO2-Wirtschaftlichke",
    "tags": "articles de article 45 agriquant energie rohstoff quant terminal html agriquant energie rohstoff quant terminal open source finanz und energie quant terminal für den erwerbsgartenbau berechn"
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
    "title": "Computer Vision & Schadbilddiagnose im Gartenbau",
    "cat": "article",
    "url": "articles/de/article-47-computer-vision-pflanzenkrankheiten-diagnostik.html",
    "icon": "🇩🇪",
    "desc": "Einsatz von Computer Vision und HSV-Farbraumsegmentierung zur Früherkennung von Botrytis cinerea und Nährstoffmangel im modernen Erwerbsgartenbau.",
    "tags": "articles de article 47 computer vision pflanzenkrankheiten diagnostik html computer vision schadbilddiagnose im gartenbau einsatz von computer vision und hsv farbraumsegmentierung zur früher"
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
    "title": "Hydrokultur: Chemische Speziation & Debye-Hückel",
    "cat": "article",
    "url": "articles/de/article-49-hydrokultur-chemische-speziation-debye-hueckel.html",
    "icon": "🇩🇪",
    "desc": "Chemische Thermodynamik geschlossener Nährlösungs-Kreisläufe: Debye-Hückel-Aktivitätskoeffizienten und Sättigungsindex (SI) zur Verhinderung von Düsenverstopfun",
    "tags": "articles de article 49 hydrokultur chemische speziation debye hueckel html hydrokultur chemische speziation debye hückel chemische thermodynamik geschlossener nährlösungs kreisläufe debye hü"
  },
  {
    "title": "Smart Greenhouse: MQTT & Edge-IoT-Sensornetzwerke",
    "cat": "article",
    "url": "articles/de/article-50-smart-gewaechshaus-mqtt-edge-iot-flotte.html",
    "icon": "🇩🇪",
    "desc": "Industrielle IoT-Architektur für den modernen Erwerbsgartenbau: MQTT-Broker-Topologien, JSON-Telemetrie und echtzeitfähige Edge-Anomalieerkennung über 100 Senso",
    "tags": "articles de article 50 smart gewaechshaus mqtt edge iot flotte html smart greenhouse mqtt edge iot sensornetzwerke industrielle iot architektur für den modernen erwerbsgartenbau mqtt broker "
  },
  {
    "title": "Autonome Gewächshäuser: KI & Modellprädiktive Regelung (MPC)",
    "cat": "article",
    "url": "articles/de/article-51-autonome-gewaechshaeuser-ki-mpc-reinforcement-learning.html",
    "icon": "🇩🇪",
    "desc": "Moderne Klimacomputer-Regelung im Unterglasanbau: Modellprädiktive Regelung (MPC) und Reinforcement Learning zur Senkung des Heizenergiebedarfs um 22,4%.",
    "tags": "articles de article 51 autonome gewaechshaeuser ki mpc reinforcement learning html autonome gewächshäuser ki modellprädiktive regelung mpc moderne klimacomputer regelung im unterglasanbau mo"
  },
  {
    "title": "Aquifer-Wärmespeicher (ATES) & Industrielle Wärmepumpen im Venlo-Gewächshaus",
    "cat": "article",
    "url": "articles/de/article-52-aquifer-waermespeicher-ates-waermepumpen.html",
    "icon": "🇩🇪",
    "desc": "Thermodynamische Modellierung von Aquifer-Wärmespeichern (ATES / WKO), saisonaler Wärmerückgewinnung und industrieller Wärmepumpen-COP für fossilfreie Gewächshä",
    "tags": "articles de article 52 aquifer waermespeicher ates waermepumpen html aquifer wärmespeicher ates industrielle wärmepumpen im venlo gewächshaus thermodynamische modellierung von aquifer wärmes"
  },
  {
    "title": "Biomasse-BHKW Rauchgas-SCR-Reinigung & Biogene CO2-Düngung im Venlo-Gewächshaus",
    "cat": "article",
    "url": "articles/de/article-53-biomasse-bhkw-scr-co2-rueckgewinnung-gartenbau.html",
    "icon": "🇩🇪",
    "desc": "Thermodynamische Modellierung von Biomasse-Heizkraftwerken, selektiver katalytischer Reduktion (SCR), Ethylen-Katalysatoren und phytotoxizitätsfreier CO2-Begasu",
    "tags": "articles de article 53 biomasse bhkw scr co2 rueckgewinnung gartenbau html biomasse bhkw rauchgas scr reinigung biogene co2 düngung im venlo gewächshaus thermodynamische modellierung von bio"
  },
  {
    "title": "KI-basierte Modellprädiktive Regelung (MPC) im Venlo-Gewächshaus: Echtzeit-Energie- und Ertragsoptimierung",
    "cat": "article",
    "url": "articles/de/article-54-ki-modellpraediktive-regelung-mpc-venlo-gewaechshaus.html",
    "icon": "🇩🇪",
    "desc": "Mathematische Zustandsraum-Modellierung der Gewächshaus-Thermodynamik, nichtlineare MPC-Kostenfunktions-Optimierung, Spotmarkt-Integration und autonome Klimareg",
    "tags": "articles de article 54 ki modellpraediktive regelung mpc venlo gewaechshaus html ki basierte modellprädiktive regelung mpc im venlo gewächshaus echtzeit energie und ertragsoptimierung mathem"
  },
  {
    "title": "Nährstoff-Aufnahmekonzentrationsfaktor (UCF) in der geschlossenen Hydrokultur",
    "cat": "article",
    "url": "articles/de/article-55-naehrstoff-aufnahmekonzentrationsfaktor-geschlossene-hydrokultur.html",
    "icon": "🇩🇪",
    "desc": "Ingenieurwissenschaftliche Modellierung des Nährstoff-Aufnahmekonzentrationsfaktors (UCF), Ionenakkumulationskinetik, Natrium-Grenzwerte und Entleerungsinterval",
    "tags": "articles de article 55 naehrstoff aufnahmekonzentrationsfaktor geschlossene hydrokultur html nährstoff aufnahmekonzentrationsfaktor ucf in der geschlossenen hydrokultur ingenieurwissenschaft"
  },
  {
    "title": "Dunkelrot-Photobiologie (ePAR 400–750 nm) & Phytochrom-Photostationärer Zustand (PSS) im Unterglasanbau",
    "cat": "article",
    "url": "articles/de/article-56-dunkelrot-photobiologie-epar-phytochrom-photostationaerer-zustand.html",
    "icon": "🇩🇪",
    "desc": "Ingenieurwissenschaftliche Photobiologie von Dunkelrot-Photonen (Far-Red), ePAR (400-750 nm), Phytochrom-Gleichgewicht (PSS) und End-of-Day-Steuerung.",
    "tags": "articles de article 56 dunkelrot photobiologie epar phytochrom photostationaerer zustand html dunkelrot photobiologie epar 400 750 nm phytochrom photostationärer zustand pss im unterglasanba"
  },
  {
    "title": "Gewächshaus-Energieeffizienz, BLE & KfW-Förderprogramme & DIN EN 13031-1 Standards (2026/2027)",
    "cat": "article",
    "url": "articles/de/article-57-gewaechshaus-energieeffizienz-foerderung-ble-kfw-din13031.html",
    "icon": "🇩🇪",
    "desc": "Umfassender B2B-Leitfaden zur Energiewende im deutschen Gartenbau: BLE-Bundesprogramm Energieeffizienz, BAFA/KfW-Modul 4, DIN EN 13031-1 in commercial CEA syste",
    "tags": "articles de article 57 gewaechshaus energieeffizienz foerderung ble kfw din13031 html gewächshaus energieeffizienz ble kfw förderprogramme din en 13031 1 standards 2026 2027 umfassender b2b "
  },
  {
    "title": "Vol. 58: Dynamische CO₂-Begasungskinetik &amp; RuBisCO-Carboxylierungsthermodynamik im Hochdraht-Venlo-Gewächshaus (Farquhar-FvCB-Modell)",
    "cat": "article",
    "url": "articles/de/article-58-dynamic-co2-enrichment-kinetics-rubisco-carboxylation-venlo.html",
    "icon": "🇩🇪",
    "desc": "Ingenieur-Monographie zur dynamischen CO₂-Anreicherung im Venlo-Gewächshaus: Biochemische Farquhar-von-Caemmerer-Berry-(FvCB)-Kinetik der RuBisCO, Unterdrückung",
    "tags": "articles de article 58 dynamic co2 enrichment kinetics rubisco carboxylation venlo html vol 58 dynamische co begasungskinetik amp rubisco carboxylierungsthermodynamik im hochdraht venlo gewä"
  },
  {
    "title": "EPEX SPOT Negativstrompreis-Arbitrage, Power-to-Heat-Elektrokessel, Schichtenspeicher & Hybrid-BESS im Venlo-Gewächshaus",
    "cat": "article",
    "url": "articles/de/article-59-epex-spot-negativstrompreise-bess-power-to-heat-elektrokessel-venlo.html",
    "icon": "🇩🇪",
    "desc": "Ingenieurwissenschaftliche Analyse zu EPEX SPOT Negativstrompreisen (§ 51 EEG), 20-kV-Elektrokesseln, Richardson-Schichtenspeichern (Ri > 5,0) und LFP-BESS im V",
    "tags": "articles de article 59 epex spot negativstrompreise bess power to heat elektrokessel venlo html epex spot negativstrompreis arbitrage power to heat elektrokessel schichtenspeicher hybrid bes"
  },
  {
    "title": "Potentiometrische Ionenselektive Elektroden (ISE), Nikolsky-Eisenman-Selektivität & Geschlossene Hydroponik im Venlo-Gewächshaus",
    "cat": "article",
    "url": "articles/de/article-60-potentiometrische-ionenselektive-elektroden-ise-geschlossene-hydroponik.html",
    "icon": "🇩🇪",
    "desc": "Ingenieurwissenschaftliche Analyse potentiometrischer ionenselektiver Elektroden (ISE: NO3-, K+, Ca2+, Na+, Cl-), Nernst-Gleichung, Nikolsky-Eisenman-Korrektur,",
    "tags": "articles de article 60 potentiometrische ionenselektive elektroden ise geschlossene hydroponik html potentiometrische ionenselektive elektroden ise nikolsky eisenman selektivität geschlossen"
  },
  {
    "title": "Thermodynamik der Energieschirm-Spaltöffnung, Latente Transpirationswärme, Kaltluftabfall & Botrytis-Prävention im Venlo-Gewächshaus",
    "cat": "article",
    "url": "articles/de/article-61-energieschirm-spaltoeffnung-transpiration-latente-waerme-kaltluftabfall.html",
    "icon": "🇩🇪",
    "desc": "Ingenieurwissenschaftliche Analyse zu Schirmspalt (Kierstand), gekoppeltem sensiblem und latentem Wärmetransport durch poröse Gewebe, Rayleigh-/Archimedes-Kaltl",
    "tags": "articles de article 61 energieschirm spaltoeffnung transpiration latente waerme kaltluftabfall html thermodynamik der energieschirm spaltöffnung latente transpirationswärme kaltluftabfall bo"
  },
  {
    "title": "Agrar- &amp; Gewächshausförderung in allen 50 US-Bundesstaaten (2026–2027): USDA REAP, NRCS EQIP &amp; Nicht-Verwässernde Kapitalarchitektur im Systemvergleich mit Deutschland",
    "cat": "article",
    "url": "articles/de/article-62-us-50-bundesstaaten-agrarfoerderung-eqip-reap-cea-leitfaden.html",
    "icon": "🇩🇪",
    "desc": "Ingenieur- und finanzwirtschaftlicher Leitfaden zur nicht-verwässernden Agrar- und CEA-Investitionsförderung in allen 50 US-Bundesstaaten (USDA REAP, NRCS EQIP ",
    "tags": "articles de article 62 us 50 bundesstaaten agrarfoerderung eqip reap cea leitfaden html agrar amp gewächshausförderung in allen 50 us bundesstaaten 2026 2027 usda reap nrcs eqip amp nicht ve"
  },
  {
    "title": "Präzisionsbewässerung, Wassermanagement & Agrarsubventionen: FDACS BMP und TWDB im Vergleich zur EU-WRRL",
    "cat": "article",
    "url": "articles/de/article-63-praezisionsbewaesserung-wassermanagement-agrarsubventionen-florida-texas-vergleich.html",
    "icon": "🇩🇪",
    "desc": "Ingenieurhandbuch zu Bodenmatrixpotenzial-Telemetrie, Penman-Monteith-Bewässerungssteuerung, US-Wasserförderprogrammen (FDACS BMP 75-87,5 %, TWDB) sowie dem deu",
    "tags": "articles de article 63 praezisionsbewaesserung wassermanagement agrarsubventionen florida texas vergleich html präzisionsbewässerung wassermanagement agrarsubventionen fdacs bmp und twdb im "
  },
  {
    "title": "Tiefengeothermie, Fernwärme & industrielle Großwärmepumpen (NH₃/R290) im Venlo-Gewächshaus",
    "cat": "article",
    "url": "articles/de/article-67-tiefengeothermie-fernwaerme-grosswaermepumpen-gewaechshaus-dekarbonisierung.html",
    "icon": "🇩🇪",
    "desc": "Ingenieurhandbuch zur Integration hydrothermaler Tiefengeothermie, BEW-Wärmenetze und industrieller NH3/R290-Großwärmepumpen nach DIN V 18599 & VDI 4640 im Erwe",
    "tags": "articles de article 67 tiefengeothermie fernwaerme grosswaermepumpen gewaechshaus dekarbonisierung html tiefengeothermie fernwärme industrielle großwärmepumpen nh r290 im venlo gewächshaus i"
  },
  {
    "title": "CEA &amp; Greenhouse Engineering Articles Library (EN / DE / JA)",
    "cat": "article",
    "url": "articles/index.html",
    "icon": "📚",
    "desc": "Multilingual library of 142 horticultural engineering articles on VPD psychrometrics, DIN V 18599 heating loads, FvCB CO2 kinetics, and MPC control.",
    "tags": "articles index html cea amp greenhouse engineering articles library en de ja multilingual library of 142 horticultural engineering articles on vpd psychrometrics din v 18599 heating loads fv"
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
    "title": "施設園芸の熱貫流率 (U'値)・多層保温カーテン・隙間換気熱損失・潜熱回収ヒートポンプ設計 (DIN V 18599)",
    "cat": "article",
    "url": "articles/ja/article-04-greenhouse-heat-loss-u-value-thermal-screen-design.html",
    "icon": "🇯🇵",
    "desc": "フェンロー型連棟温室および大型園芸施設におけるピーク暖房負荷計算式 (Q = U'·A·ΔT)、パテ無しガラスの煙突効果、多層保温カーテン (Luxous 1147 FR) の放射・対流抑制、および潜熱回収ヒートポンプ・蓄熱槽の設計指針。",
    "tags": "articles ja article 04 greenhouse heat loss u value thermal screen design html 施設園芸の熱貫流率 u 値 多層保温カ テン 隙間換気熱損失 潜熱回収ヒ トポンプ設計 din v 18599 フェンロ 型連棟温室および大型園芸施設におけるピ ク暖房負荷計算式 q u a t パテ無しガラスの煙突効果 "
  },
  {
    "title": "FAO-56 Penman-Monteith 蒸散モデル・気孔コンダクタンス・飽差 (VPD) 統合環境制御と日射比例灌水設計",
    "cat": "article",
    "url": "articles/ja/article-05-penman-monteith-transpiration-vpd-environmental-control.html",
    "icon": "🇯🇵",
    "desc": "施設園芸におけるFAO-56 Penman-Monteith蒸発散方程式 (ET₀)・Stanghellini温室群落モデル、空気力学的境界層抵抗 (r_a) と気孔抵抗 (r_s)、飽差 (VPD) 制御、および積算日射比例灌水トリガーの設計。",
    "tags": "articles ja article 05 penman monteith transpiration vpd environmental control html fao 56 penman monteith 蒸散モデル 気孔コンダクタンス 飽差 vpd 統合環境制御と日射比例灌水設計 施設園芸におけるfao 56 penman monteith蒸発散方程式 et stan"
  },
  {
    "title": "Vol. 06: 閉鎖型養液栽培におけるモル化学量論・Sonneveld/Steiner イオン当量収支 (meq/L) と A/B 原液タンク・EC/pH 制御工学",
    "cat": "article",
    "url": "articles/ja/article-06-hydroponic-nutrient-formulation-ab-stock-tank-ec-ph-jp.html",
    "icon": "🇯🇵",
    "desc": "施設園芸および植物工場の閉鎖型循環式養液栽培におけるイオン当量設計 (mmol/L・meq/L)：Sonneveld・Steiner・山崎処方の比較、陽イオン・陰イオン電気的中性条件、A/B原液タンクの溶解度積 (Ksp・石膏沈殿防止)、NO₃⁻/NH₄⁺比による根圏pH自律緩衝、および排液循環ブレンド制御。",
    "tags": "articles ja article 06 hydroponic nutrient formulation ab stock tank ec ph jp html vol 06 閉鎖型養液栽培におけるモル化学量論 sonneveld steiner イオン当量収支 meq l と a b 原液タンク ec ph 制御工学 施設園芸および植物工場の閉鎖型循環式養液栽培におけるイ"
  },
  {
    "title": "Vol. 07: 植物工場・施設園芸のLED光質制御と光形態形成：McCree作用スペクトル・拡張光合成有効放射 (ePAR 400–750 nm)・フィトクロム光平衡 (PSS) とエマーソン相乗効果",
    "cat": "article",
    "url": "articles/ja/article-07-horticultural-lighting-spectrum-par-epar-photomorphogenesis-jp.html",
    "icon": "🇯🇵",
    "desc": "植物工場 (PFAL) および施設園芸補光における光生物学・半導体照明工学：McCree・稲田の相対量子収率曲線、ePAR (400–750 nm)、フィトクロム光平衡 (PSS = Pfr/Ptotal)、クリプトクロム気孔開口、730 nm 遠赤色光によるエマーソン効果、および高効率LED (PPE ≥ 3.6 µ",
    "tags": "articles ja article 07 horticultural lighting spectrum par epar photomorphogenesis jp html vol 07 植物工場 施設園芸のled光質制御と光形態形成 mccree作用スペクトル 拡張光合成有効放射 epar 400 750 nm フィトクロム光平衡 pss とエマ ソン相乗効果 植物工"
  },
  {
    "title": "Vol. 09: 気孔コンダクタンス (gs) と光合成ガス交換動力学：Ball-Berry-Leuning (BBL) モデル・葉面境界層抵抗 (rb)・飽差 (VPD) ストレス応答と C3 群落統合環境制御",
    "cat": "article",
    "url": "articles/ja/article-09-stomata-conductance-photosynthesis-jp.html",
    "icon": "🇯🇵",
    "desc": "施設園芸および太陽光利用型植物工場における気孔コンダクタンス (gs) と光合成ガス交換動力学の統合モデル。Farquhar-von Caemmerer-Berry (FvCB) 生化学モデルと Ball-Berry-Leuning (BBL) / Medlyn 気孔モデルの連成解法、葉面境界層抵抗 (rb)、飽差 (",
    "tags": "articles ja article 09 stomata conductance photosynthesis jp html vol 09 気孔コンダクタンス gs と光合成ガス交換動力学 ball berry leuning bbl モデル 葉面境界層抵抗 rb 飽差 vpd ストレス応答と c3 群落統合環境制御 施設園芸および太陽光利用型植物工場における気孔コンダク"
  },
  {
    "title": "Vol. 10: 完全人工光型植物工場 (PFAL) の空調・潜熱除湿熱力学設計：湿り空気線図 (Psychrometrics)・顕熱比 (SHR)・再熱除湿サイクル・COP最適化と多段栽培棚CFD気流均一化",
    "cat": "article",
    "url": "articles/ja/article-10-vertical-farm-hvac-design-jp.html",
    "icon": "🇯🇵",
    "desc": "完全人工光型植物工場 (PFAL) および垂直農業における空調・潜熱除湿の熱力学設計モノグラフ。湿り空気線図 (Psychrometrics)、低顕熱比 (SHR = Qs / Qtot = 0.32–0.45)、蒸散潜熱負荷、ホットガス再熱除湿サイクル、システムCOP最適化、および多段栽培棚のチップバーンを根絶するC",
    "tags": "articles ja article 10 vertical farm hvac design jp html vol 10 完全人工光型植物工場 pfal の空調 潜熱除湿熱力学設計 湿り空気線図 psychrometrics 顕熱比 shr 再熱除湿サイクル cop最適化と多段栽培棚cfd気流均一化 完全人工光型植物工場 pfal および垂直農業における空調 潜熱除湿の熱"
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
    "title": "スマート温室の精密センサ校正工学：ネルンスト式 (pH/EC)・TDR/FDR培地誘電率・NDIR式CO₂ドリフト補償",
    "cat": "article",
    "url": "articles/ja/article-13-smartfarm-sensor-calibration-nernst-tdr-ndir-jp.html",
    "icon": "🇯🇵",
    "desc": "施設園芸・養液栽培におけるガラス電極pHセンサ（ネルンスト勾配と非対称電位）、温度補償EC（25℃基準換算）、TDR/FDR培地体積含水率（Topp式）、および二重波長NDIR式CO₂センサの校正・不確かさ解析。",
    "tags": "articles ja article 13 smartfarm sensor calibration nernst tdr ndir jp html スマ ト温室の精密センサ校正工学 ネルンスト式 ph ec tdr fdr培地誘電率 ndir式co ドリフト補償 施設園芸 養液栽培におけるガラス電極phセンサ ネルンスト勾配と非対称電位 温度補償ec 25 基準換算 tdr"
  },
  {
    "title": "遠赤色光（730nm）と深赤色光（660nm）の最適LEDスペクトル比率",
    "cat": "article",
    "url": "articles/ja/article-24-far-red-deep-red-led-spectrum-optimization-jp.html",
    "icon": "🇯🇵",
    "desc": "商業用施設園芸におけるエマーソン効果、光化学系I・IIの励起バランス、および遠赤色光（730nm）補光最適化に関する専門技術解説。",
    "tags": "articles ja article 24 far red deep red led spectrum optimization jp html 遠赤色光 730nm と深赤色光 660nm の最適ledスペクトル比率 商業用施設園芸におけるエマ ソン効果 光化学系i iiの励起バランス および遠赤色光 730nm 補光最適化に関する専門技術解説"
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
    "desc": "商業用水耕栽培におけるロックウールスラブの体積含水率（VWC %）、夜間ドライダウン動態、および排液ECバランシングの解析。",
    "tags": "articles ja article 30 rockwool slab tdr moisture drain ec jp html ロックウ ル培地の水力学とtdr水分センサ 較正 商業用水耕栽培におけるロックウ ルスラブの体積含水率 vwc 夜間ドライダウン動態 および排液ecバランシングの解析"
  },
  {
    "title": "高圧細霧冷房（70 bar）の液滴物理学とザウター平均粒径",
    "cat": "article",
    "url": "articles/ja/article-31-high-pressure-fogging-droplet-physics-jp.html",
    "icon": "🇯🇵",
    "desc": "商業用温室における70 bar高圧フォグ、ザウター平均粒径（D32 &lt; 10µm）、断熱蒸発冷却、およびVPD安定化の工学的解析。",
    "tags": "articles ja article 31 high pressure fogging droplet physics jp html 高圧細霧冷房 70 bar の液滴物理学とザウタ 平均粒径 商業用温室における70 bar高圧フォグ ザウタ 平均粒径 d32 lt 10 m 断熱蒸発冷却 およびvpd安定化の工学的解析"
  },
  {
    "title": "園芸用LEDの熱管理とジャンクション温度（Tj）解析",
    "cat": "article",
    "url": "articles/ja/article-32-horticultural-led-thermal-junction-temperature-jp.html",
    "icon": "🇯🇵",
    "desc": "商業用温室における園芸用LED器具の放熱設計、ジャンクション温度（Tj）、熱抵抗（Rth）、および発光量子効率の熱劣化メカニズム。",
    "tags": "articles ja article 32 horticultural led thermal junction temperature jp html 園芸用ledの熱管理とジャンクション温度 tj 解析 商業用温室における園芸用led器具の放熱設計 ジャンクション温度 tj 熱抵抗 rth および発光量子効率の熱劣化メカニズム"
  },
  {
    "title": "精密クロップステアリング動態（栄養生長 vs 生殖生長）",
    "cat": "article",
    "url": "articles/ja/article-33-precision-crop-steering-dif-vpd-drydown-jp.html",
    "icon": "🇯🇵",
    "desc": "商業用施設園芸におけるクロップステアリング技術：昼夜温差（DIF）、飽差（VPD）、および培地ドライダウンによる着花・着果最適化。",
    "tags": "articles ja article 33 precision crop steering dif vpd drydown jp html 精密クロップステアリング動態 栄養生長 vs 生殖生長 商業用施設園芸におけるクロップステアリング技術 昼夜温差 dif 飽差 vpd および培地ドライダウンによる着花 着果最適化"
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
    "desc": "商業用温室における水平循環扇（HAF）の配置間隔、噴流到達距離、ベルヌーイ誘引効果、および群落内微気象均一化のCFD解析。",
    "tags": "articles ja article 35 greenhouse haf fan cfd modeling jp html 温室循環扇 haf の数値流体力学 cfd 気流モデリング 商業用温室における水平循環扇 haf の配置間隔 噴流到達距離 ベルヌ イ誘引効果 および群落内微気象均一化のcfd解析"
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
    "desc": "植物生理学解析：木部蒸散流によるカルシウム分配機構、果頂部細胞壁の安定化、および昼夜VPD制御による尻腐れ病の完全予防技術。",
    "tags": "articles ja article 38 xylem calcium flux blossom end rot jp html 木部導管カルシウム輸送動態と尻腐れ病 ber 予防 植物生理学解析 木部蒸散流によるカルシウム分配機構 果頂部細胞壁の安定化 および昼夜vpd制御による尻腐れ病の完全予防技術"
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
    "desc": "大規模商業温室の自律環境制御。深層強化学習とモデル予測制御（MPC）を融合し、24時間の外気象予測に基づき暖房エネルギーを22.4%削減。",
    "tags": "articles ja article 51 autonomous greenhouse ai mpc reinforcement learning jp html 自律型温室ai 強化学習 モデル予測制御 mpc 最適化 大規模商業温室の自律環境制御 深層強化学習とモデル予測制御 mpc を融合し 24時間の外気象予測に基づき暖房エネルギ を22 4 削減"
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
    "title": "Greenhouse Heat Pump vs Natural Gas Boiler Heating Cost Benchmark",
    "cat": "part",
    "url": "benchmarks/greenhouse-heat-pump-vs-gas-boiler-heating-cost.html",
    "icon": "⚙️",
    "desc": "Economic & carbon lifecycle comparison between Industrial Air/Water Heat Pumps (COP 3.8) and Condensing Natural Gas Boilers (95% efficiency). Spark spread and h",
    "tags": "benchmarks greenhouse heat pump vs gas boiler heating cost html greenhouse heat pump vs natural gas boiler heating cost benchmark economic carbon lifecycle comparison between industrial air "
  },
  {
    "title": "Greenhouse LED Toplighting vs HPS 5-Year Energy & ROI Benchmark",
    "cat": "part",
    "url": "benchmarks/greenhouse-led-vs-hps-lighting-efficiency-roi.html",
    "icon": "⚙️",
    "desc": "Comprehensive technical comparison between Horticultural LED fixtures (3.5 µmol/J) and High-Pressure Sodium (1.8 µmol/J) lamps. 5-year electricity OPEX and ther",
    "tags": "benchmarks greenhouse led vs hps lighting efficiency roi html greenhouse led toplighting vs hps 5 year energy roi benchmark comprehensive technical comparison between horticultural led fixtu"
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
    "title": "Rockwool vs Cocopeat Hydroponic Substrate Agronomic & Cost Benchmark",
    "cat": "part",
    "url": "benchmarks/rockwool-vs-cocopeat-hydroponic-substrate-comparison.html",
    "icon": "⚙️",
    "desc": "Agronomic comparison between Grodan Rockwool stone wool slabs and Cocopeat (coir) substrate. Water retention curves, cation exchange capacity (CEC), steerabilit",
    "tags": "benchmarks rockwool vs cocopeat hydroponic substrate comparison html rockwool vs cocopeat hydroponic substrate agronomic cost benchmark agronomic comparison between grodan rockwool stone woo"
  },
  {
    "title": "Toyohashi, Aichi Prefecture, Japan Greenhouse Microclimate & CEA Engineering Almanac",
    "cat": "climate",
    "url": "climate/aichi-toyohashi-japan-protected-agriculture-guide.html",
    "icon": "🌍",
    "desc": "Precision CEA engineering and climate guide for commercial greenhouses in Toyohashi, Aichi Prefecture, Japan (34.8°N). Solar DLI analysis (40-48 summer / 14-19 ",
    "tags": "climate aichi toyohashi japan protected agriculture guide html toyohashi aichi prefecture japan greenhouse microclimate cea engineering almanac precision cea engineering and climate guide fo"
  },
  {
    "title": "Al Ain, Abu Dhabi, United Arab Emirates Greenhouse Microclimate & CEA Engineering Almanac",
    "cat": "climate",
    "url": "climate/al-ain-abu-dhabi-uae-desert-greenhouse-guide.html",
    "icon": "🌍",
    "desc": "Precision CEA engineering and climate guide for commercial greenhouses in Al Ain, Abu Dhabi, United Arab Emirates (24.2°N). Solar DLI analysis (58-68 summer / 2",
    "tags": "climate al ain abu dhabi uae desert greenhouse guide html al ain abu dhabi united arab emirates greenhouse microclimate cea engineering almanac precision cea engineering and climate guide fo"
  },
  {
    "title": "Almería, Spain Greenhouse Microclimate & CEA Engineering Almanac",
    "cat": "climate",
    "url": "climate/almeria-spain-parral-greenhouse-climate-guide.html",
    "icon": "🌍",
    "desc": "Comprehensive CEA microclimate engineering guide for commercial Parral greenhouses in Almería, Spain (36.8°N). Solar DLI analysis (50-58 summer / 18-22 winter m",
    "tags": "climate almeria spain parral greenhouse climate guide html almer a spain greenhouse microclimate cea engineering almanac comprehensive cea microclimate engineering guide for commercial parra"
  },
  {
    "title": "Antalya (Aksu & Kumluca), Turkey Greenhouse Microclimate & CEA Engineering Almanac",
    "cat": "climate",
    "url": "climate/antalya-turkey-mediterranean-greenhouse-guide.html",
    "icon": "🌍",
    "desc": "Precision CEA engineering and climate guide for commercial greenhouses in Antalya (Aksu & Kumluca), Turkey (36.9°N). Solar DLI analysis (50-58 summer / 16-22 wi",
    "tags": "climate antalya turkey mediterranean greenhouse guide html antalya aksu kumluca turkey greenhouse microclimate cea engineering almanac precision cea engineering and climate guide for commerc"
  },
  {
    "title": "Morehead (Appalachian Basin), Kentucky, USA Greenhouse Microclimate & CEA Engineering Almanac",
    "cat": "climate",
    "url": "climate/appharvest-morehead-kentucky-cea-guide.html",
    "icon": "🌍",
    "desc": "Precision CEA engineering and climate guide for commercial greenhouses in Morehead (Appalachian Basin), Kentucky, USA (38.2°N). Solar DLI analysis (38-46 summer",
    "tags": "climate appharvest morehead kentucky cea guide html morehead appalachian basin kentucky usa greenhouse microclimate cea engineering almanac precision cea engineering and climate guide for co"
  },
  {
    "title": "Arava Valley / Ein Yahav, Israel Greenhouse Microclimate & CEA Engineering Almanac",
    "cat": "climate",
    "url": "climate/arava-valley-israel-desert-fertigation-guide.html",
    "icon": "🌍",
    "desc": "Precision CEA engineering and climate guide for commercial greenhouses in Arava Valley / Ein Yahav, Israel (30.5°N). Solar DLI analysis (58-68 summer / 24-30 wi",
    "tags": "climate arava valley israel desert fertigation guide html arava valley ein yahav israel greenhouse microclimate cea engineering almanac precision cea engineering and climate guide for commer"
  },
  {
    "title": "Bleiswijk, Netherlands Greenhouse Microclimate & CEA Engineering Almanac",
    "cat": "climate",
    "url": "climate/bleiswijk-netherlands-cea-research-cluster.html",
    "icon": "🌍",
    "desc": "Precision CEA engineering and climate guide for commercial greenhouses in Bleiswijk, Netherlands (52.0°N). Solar DLI analysis (34-40 summer / 6-9 winter mol/m²/",
    "tags": "climate bleiswijk netherlands cea research cluster html bleiswijk netherlands greenhouse microclimate cea engineering almanac precision cea engineering and climate guide for commercial green"
  },
  {
    "title": "Bogotá Savanna, Colombia Greenhouse Microclimate & CEA Engineering Almanac",
    "cat": "climate",
    "url": "climate/bogota-savanna-colombia-cut-flower-guide.html",
    "icon": "🌍",
    "desc": "Precision CEA engineering and climate guide for commercial greenhouses in Bogotá Savanna, Colombia (4.7°N). Solar DLI analysis (30-36 (12h constant) summer / 30",
    "tags": "climate bogota savanna colombia cut flower guide html bogot savanna colombia greenhouse microclimate cea engineering almanac precision cea engineering and climate guide for commercial greenh"
  },
  {
    "title": "Brittany (Finistère), France Greenhouse Microclimate & CEA Engineering Almanac",
    "cat": "climate",
    "url": "climate/brittany-finistere-france-tomato-cluster-guide.html",
    "icon": "🌍",
    "desc": "Precision CEA engineering and climate guide for commercial greenhouses in Brittany (Finistère), France (48.4°N). Solar DLI analysis (32-38 summer / 7-11 winter ",
    "tags": "climate brittany finistere france tomato cluster guide html brittany finist re france greenhouse microclimate cea engineering almanac precision cea engineering and climate guide for commerci"
  },
  {
    "title": "Buyeo (Geum River Basin), South Korea Greenhouse Microclimate & CEA Engineering Almanac",
    "cat": "climate",
    "url": "climate/buyeo-chungnam-korea-tomato-cluster-guide.html",
    "icon": "🌍",
    "desc": "Precision CEA engineering and climate guide for commercial greenhouses in Buyeo (Geum River Basin), South Korea (36.2°N). Solar DLI analysis (36-44 summer / 12-",
    "tags": "climate buyeo chungnam korea tomato cluster guide html buyeo geum river basin south korea greenhouse microclimate cea engineering almanac precision cea engineering and climate guide for comm"
  },
  {
    "title": "Cameron Highlands, Pahang, Malaysia Greenhouse Microclimate & CEA Engineering Almanac",
    "cat": "climate",
    "url": "climate/cameron-highlands-malaysia-tropical-highland-guide.html",
    "icon": "🌍",
    "desc": "Precision CEA engineering and climate guide for commercial greenhouses in Cameron Highlands, Pahang, Malaysia (4.5°N). Solar DLI analysis (28-34 summer / 28-34 ",
    "tags": "climate cameron highlands malaysia tropical highland guide html cameron highlands pahang malaysia greenhouse microclimate cea engineering almanac precision cea engineering and climate guide "
  },
  {
    "title": "Cayambe, Pichincha, Ecuador Greenhouse Microclimate & CEA Engineering Almanac",
    "cat": "climate",
    "url": "climate/cayambe-pichincha-ecuador-hyper-radiation-guide.html",
    "icon": "🌍",
    "desc": "Precision CEA engineering and climate guide for commercial greenhouses in Cayambe, Pichincha, Ecuador (0.0°N). Solar DLI analysis (35-42 (Extreme UV Index) summ",
    "tags": "climate cayambe pichincha ecuador hyper radiation guide html cayambe pichincha ecuador greenhouse microclimate cea engineering almanac precision cea engineering and climate guide for commerc"
  },
  {
    "title": "Culiacán (Sinaloa Valley), Mexico Greenhouse Microclimate & CEA Engineering Almanac",
    "cat": "climate",
    "url": "climate/culiacan-sinaloa-mexico-winter-vegetable-guide.html",
    "icon": "🌍",
    "desc": "Precision CEA engineering and climate guide for commercial greenhouses in Culiacán (Sinaloa Valley), Mexico (24.8°N). Solar DLI analysis (50-58 summer / 22-28 w",
    "tags": "climate culiacan sinaloa mexico winter vegetable guide html culiac n sinaloa valley mexico greenhouse microclimate cea engineering almanac precision cea engineering and climate guide for com"
  },
  {
    "title": "Đà Lạt, Central Highlands, Vietnam Greenhouse Microclimate & CEA Engineering Almanac",
    "cat": "climate",
    "url": "climate/dalat-vietnam-central-highlands-horticulture-guide.html",
    "icon": "🌍",
    "desc": "Precision CEA engineering and climate guide for commercial greenhouses in Đà Lạt, Central Highlands, Vietnam (11.9°N). Solar DLI analysis (32-38 summer / 30-36 ",
    "tags": "climate dalat vietnam central highlands horticulture guide html l t central highlands vietnam greenhouse microclimate cea engineering almanac precision cea engineering and climate guide for "
  },
  {
    "title": "Delta / Fraser Valley, BC, Canada Greenhouse Microclimate & CEA Engineering Almanac",
    "cat": "climate",
    "url": "climate/delta-fraser-valley-bc-canada-greenhouse-guide.html",
    "icon": "🌍",
    "desc": "Precision CEA engineering and climate guide for commercial greenhouses in Delta / Fraser Valley, BC, Canada (49.1°N). Solar DLI analysis (36-44 summer / 6-11 wi",
    "tags": "climate delta fraser valley bc canada greenhouse guide html delta fraser valley bc canada greenhouse microclimate cea engineering almanac precision cea engineering and climate guide for comm"
  },
  {
    "title": "Gimje Smart Farm Valley, South Korea Greenhouse Microclimate & CEA Engineering Almanac",
    "cat": "climate",
    "url": "climate/gimje-smart-farm-innovation-valley-korea-guide.html",
    "icon": "🌍",
    "desc": "Precision CEA engineering and climate guide for commercial greenhouses in Gimje Smart Farm Valley, South Korea (35.8°N). Solar DLI analysis (38-46 summer / 12-1",
    "tags": "climate gimje smart farm innovation valley korea guide html gimje smart farm valley south korea greenhouse microclimate cea engineering almanac precision cea engineering and climate guide fo"
  },
  {
    "title": "Guyra (New England Plateau), NSW, Australia Greenhouse Microclimate & CEA Engineering Almanac",
    "cat": "climate",
    "url": "climate/guyra-new-south-wales-australia-highland-tomato-guide.html",
    "icon": "🌍",
    "desc": "Precision CEA engineering and climate guide for commercial greenhouses in Guyra (New England Plateau), NSW, Australia (30.2°S). Solar DLI analysis (46-54 summer",
    "tags": "climate guyra new south wales australia highland tomato guide html guyra new england plateau nsw australia greenhouse microclimate cea engineering almanac precision cea engineering and clima"
  },
  {
    "title": "Ierapetra, Crete, Greece Greenhouse Microclimate & CEA Engineering Almanac",
    "cat": "climate",
    "url": "climate/ierapetra-crete-greece-solar-greenhouse-guide.html",
    "icon": "🌍",
    "desc": "Precision CEA engineering and climate guide for commercial greenhouses in Ierapetra, Crete, Greece (35.0°N). Solar DLI analysis (54-62 summer / 20-25 winter mol",
    "tags": "climate ierapetra crete greece solar greenhouse guide html ierapetra crete greece greenhouse microclimate cea engineering almanac precision cea engineering and climate guide for commercial g"
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
    "title": "Kochi (Tosa Bay), Japan Greenhouse Microclimate & CEA Engineering Almanac",
    "cat": "climate",
    "url": "climate/kochi-japan-warm-climate-horticulture-guide.html",
    "icon": "🌍",
    "desc": "Precision CEA engineering and climate guide for commercial greenhouses in Kochi (Tosa Bay), Japan (33.6°N). Solar DLI analysis (42-50 summer / 16-22 winter mol/",
    "tags": "climate kochi japan warm climate horticulture guide html kochi tosa bay japan greenhouse microclimate cea engineering almanac precision cea engineering and climate guide for commercial green"
  },
  {
    "title": "Kunming (Spring City), Yunnan, China Greenhouse Microclimate & CEA Engineering Almanac",
    "cat": "climate",
    "url": "climate/kunming-yunnan-china-asian-flower-capital-guide.html",
    "icon": "🌍",
    "desc": "Precision CEA engineering and climate guide for commercial greenhouses in Kunming (Spring City), Yunnan, China (25.0°N). Solar DLI analysis (38-46 summer / 22-2",
    "tags": "climate kunming yunnan china asian flower capital guide html kunming spring city yunnan china greenhouse microclimate cea engineering almanac precision cea engineering and climate guide for "
  },
  {
    "title": "Lake Naivasha (Rift Valley), Kenya Greenhouse Microclimate & CEA Engineering Almanac",
    "cat": "climate",
    "url": "climate/lake-naivasha-kenya-geothermal-floriculture-guide.html",
    "icon": "🌍",
    "desc": "Precision CEA engineering and climate guide for commercial greenhouses in Lake Naivasha (Rift Valley), Kenya (0.7°S). Solar DLI analysis (38-44 (12h Day) summer",
    "tags": "climate lake naivasha kenya geothermal floriculture guide html lake naivasha rift valley kenya greenhouse microclimate cea engineering almanac precision cea engineering and climate guide for"
  },
  {
    "title": "Leamington / Kingsville, Ontario, Canada Greenhouse Microclimate & CEA Engineering Almanac",
    "cat": "climate",
    "url": "climate/leamington-ontario-canada-greenhouse-guide.html",
    "icon": "🌍",
    "desc": "Precision CEA engineering and climate guide for commercial greenhouses in Leamington / Kingsville, Ontario, Canada (42.0°N). Solar DLI analysis (40-48 summer / ",
    "tags": "climate leamington ontario canada greenhouse guide html leamington kingsville ontario canada greenhouse microclimate cea engineering almanac precision cea engineering and climate guide for c"
  },
  {
    "title": "Marana & Tucson, Arizona, USA Greenhouse Microclimate & CEA Engineering Almanac",
    "cat": "climate",
    "url": "climate/marana-tucson-arizona-hyper-solar-cea-guide.html",
    "icon": "🌍",
    "desc": "Precision CEA engineering and desert microclimate guide for commercial greenhouses in Marana and Tucson, Arizona, USA (32.4°N). Hyper-solar DLI analysis (52-60 ",
    "tags": "climate marana tucson arizona hyper solar cea guide html marana tucson arizona usa greenhouse microclimate cea engineering almanac precision cea engineering and desert microclimate guide for"
  },
  {
    "title": "Miryang, Gyeongnam, South Korea Greenhouse Microclimate & CEA Engineering Almanac",
    "cat": "climate",
    "url": "climate/miryang-gyeongnam-korea-strawberry-capital-guide.html",
    "icon": "🌍",
    "desc": "Precision CEA engineering and climate guide for commercial greenhouses in Miryang, Gyeongnam, South Korea (35.5°N). Solar DLI analysis (40-48 summer / 14-20 win",
    "tags": "climate miryang gyeongnam korea strawberry capital guide html miryang gyeongnam south korea greenhouse microclimate cea engineering almanac precision cea engineering and climate guide for co"
  },
  {
    "title": "Murcia (Campo de Cartagena), Spain Greenhouse Microclimate & CEA Engineering Almanac",
    "cat": "climate",
    "url": "climate/murcia-spain-precision-hydroponics-guide.html",
    "icon": "🌍",
    "desc": "Precision CEA engineering and climate guide for commercial greenhouses in Murcia (Campo de Cartagena), Spain (38.0°N). Solar DLI analysis (48-56 summer / 15-20 ",
    "tags": "climate murcia spain precision hydroponics guide html murcia campo de cartagena spain greenhouse microclimate cea engineering almanac precision cea engineering and climate guide for commerci"
  },
  {
    "title": "Naaldwijk (Westland East), Netherlands Greenhouse Microclimate & CEA Engineering Almanac",
    "cat": "climate",
    "url": "climate/naaldwijk-netherlands-floriculture-hub-guide.html",
    "icon": "🌍",
    "desc": "Precision CEA engineering and climate guide for commercial greenhouses in Naaldwijk (Westland East), Netherlands (52.0°N). Solar DLI analysis (35-41 summer / 6-",
    "tags": "climate naaldwijk netherlands floriculture hub guide html naaldwijk westland east netherlands greenhouse microclimate cea engineering almanac precision cea engineering and climate guide for "
  },
  {
    "title": "Nonsan, Chungnam, South Korea Greenhouse Microclimate & CEA Engineering Almanac",
    "cat": "climate",
    "url": "climate/nonsan-chungnam-korea-smart-berry-guide.html",
    "icon": "🌍",
    "desc": "Precision CEA engineering and climate guide for commercial greenhouses in Nonsan, Chungnam, South Korea (36.2°N). Solar DLI analysis (36-44 summer / 12-17 winte",
    "tags": "climate nonsan chungnam korea smart berry guide html nonsan chungnam south korea greenhouse microclimate cea engineering almanac precision cea engineering and climate guide for commercial gr"
  },
  {
    "title": "Nürnberg / Knoblauchsland, Bavaria Greenhouse Microclimate & CEA Engineering Almanac",
    "cat": "climate",
    "url": "climate/nuernberg-knoblauchsland-bavaria-greenhouse-climate-guide.html",
    "icon": "🌍",
    "desc": "Precision CEA engineering and climate guide for commercial glasshouses in Nürnberg / Knoblauchsland, Bavaria (49.48°N). Solar DLI curves (38-45 summer / 7-10 wi",
    "tags": "climate nuernberg knoblauchsland bavaria greenhouse climate guide html nürnberg knoblauchsland bavaria greenhouse microclimate cea engineering almanac precision cea engineering and climate g"
  },
  {
    "title": "Pukekohe, Auckland Region, New Zealand Greenhouse Microclimate & CEA Engineering Almanac",
    "cat": "climate",
    "url": "climate/pukekohe-auckland-new-zealand-greenhouse-guide.html",
    "icon": "🌍",
    "desc": "Precision CEA engineering and climate guide for commercial greenhouses in Pukekohe, Auckland Region, New Zealand (37.2°S). Solar DLI analysis (44-52 summer / 10",
    "tags": "climate pukekohe auckland new zealand greenhouse guide html pukekohe auckland region new zealand greenhouse microclimate cea engineering almanac precision cea engineering and climate guide f"
  },
  {
    "title": "Querétaro (Agropark), Mexico Greenhouse Microclimate & CEA Engineering Almanac",
    "cat": "climate",
    "url": "climate/queretaro-agropark-mexico-high-altitude-guide.html",
    "icon": "🌍",
    "desc": "Precision CEA engineering and climate guide for commercial greenhouses in Querétaro (Agropark), Mexico (20.6°N). Solar DLI analysis (46-54 summer / 26-32 winter",
    "tags": "climate queretaro agropark mexico high altitude guide html quer taro agropark mexico greenhouse microclimate cea engineering almanac precision cea engineering and climate guide for commercia"
  },
  {
    "title": "Ragusa / Vittoria, Sicily, Italy Greenhouse Microclimate & CEA Engineering Almanac",
    "cat": "climate",
    "url": "climate/ragusa-sicily-italy-protected-cropping-guide.html",
    "icon": "🌍",
    "desc": "Precision CEA engineering and climate guide for commercial greenhouses in Ragusa / Vittoria, Sicily, Italy (36.9°N). Solar DLI analysis (52-60 summer / 18-24 wi",
    "tags": "climate ragusa sicily italy protected cropping guide html ragusa vittoria sicily italy greenhouse microclimate cea engineering almanac precision cea engineering and climate guide for commerc"
  },
  {
    "title": "Al-Kharj / Riyadh Oasis, Saudi Arabia Greenhouse Microclimate & CEA Engineering Almanac",
    "cat": "climate",
    "url": "climate/riyadh-al-kharj-saudi-arabia-desert-cea-guide.html",
    "icon": "🌍",
    "desc": "Precision CEA engineering and climate guide for commercial greenhouses in Al-Kharj / Riyadh Oasis, Saudi Arabia (24.7°N). Solar DLI analysis (60-70 summer / 25-",
    "tags": "climate riyadh al kharj saudi arabia desert cea guide html al kharj riyadh oasis saudi arabia greenhouse microclimate cea engineering almanac precision cea engineering and climate guide for "
  },
  {
    "title": "Salinas Valley, California, USA Greenhouse Microclimate & CEA Engineering Almanac",
    "cat": "climate",
    "url": "climate/salinas-valley-california-salad-bowl-guide.html",
    "icon": "🌍",
    "desc": "Precision CEA engineering and climate guide for commercial greenhouses in Salinas Valley, California, USA (36.7°N). Solar DLI analysis (42-50 summer / 16-22 win",
    "tags": "climate salinas valley california salad bowl guide html salinas valley california usa greenhouse microclimate cea engineering almanac precision cea engineering and climate guide for commerci"
  },
  {
    "title": "Santa Maria, California, USA Greenhouse Microclimate & CEA Engineering Almanac",
    "cat": "climate",
    "url": "climate/santa-maria-valley-california-berry-tunnel-guide.html",
    "icon": "🌍",
    "desc": "Precision CEA engineering and climate guide for commercial greenhouses in Santa Maria, California, USA (34.9°N). Solar DLI analysis (45-52 summer / 18-24 winter",
    "tags": "climate santa maria valley california berry tunnel guide html santa maria california usa greenhouse microclimate cea engineering almanac precision cea engineering and climate guide for comme"
  },
  {
    "title": "Shouguang, Shandong, China Greenhouse Microclimate & CEA Engineering Almanac",
    "cat": "climate",
    "url": "climate/shouguang-shandong-china-solar-greenhouse-guide.html",
    "icon": "🌍",
    "desc": "Precision CEA engineering and climate guide for commercial greenhouses in Shouguang, Shandong, China (36.9°N). Solar DLI analysis (42-50 summer / 14-20 winter m",
    "tags": "climate shouguang shandong china solar greenhouse guide html shouguang shandong china greenhouse microclimate cea engineering almanac precision cea engineering and climate guide for commerci"
  },
  {
    "title": "Souss-Massa Valley (Agadir), Morocco Greenhouse Microclimate & CEA Engineering Almanac",
    "cat": "climate",
    "url": "climate/souss-massa-agadir-morocco-export-greenhouse-guide.html",
    "icon": "🌍",
    "desc": "Precision CEA engineering and climate guide for commercial greenhouses in Souss-Massa Valley (Agadir), Morocco (30.4°N). Solar DLI analysis (50-58 summer / 20-2",
    "tags": "climate souss massa agadir morocco export greenhouse guide html souss massa valley agadir morocco greenhouse microclimate cea engineering almanac precision cea engineering and climate guide "
  },
  {
    "title": "Stellenbosch / Boland, Western Cape, South Africa Greenhouse Microclimate & CEA Engineering Almanac",
    "cat": "climate",
    "url": "climate/stellenbosch-western-cape-south-africa-guide.html",
    "icon": "🌍",
    "desc": "Precision CEA engineering and climate guide for commercial greenhouses in Stellenbosch / Boland, Western Cape, South Africa (33.9°S). Solar DLI analysis (48-56 ",
    "tags": "climate stellenbosch western cape south africa guide html stellenbosch boland western cape south africa greenhouse microclimate cea engineering almanac precision cea engineering and climate "
  },
  {
    "title": "Straelen / Lower Rhine, Germany Greenhouse Microclimate & CEA Engineering Almanac",
    "cat": "climate",
    "url": "climate/straelen-lower-rhine-germany-horticulture-guide.html",
    "icon": "🌍",
    "desc": "Precision CEA engineering and climate guide for commercial greenhouses in Straelen / Lower Rhine, Germany (51.4°N). Solar DLI analysis (36-42 summer / 5-9 winte",
    "tags": "climate straelen lower rhine germany horticulture guide html straelen lower rhine germany greenhouse microclimate cea engineering almanac precision cea engineering and climate guide for comm"
  },
  {
    "title": "Adelaide Plains (Virginia), South Australia Greenhouse Microclimate & CEA Engineering Almanac",
    "cat": "climate",
    "url": "climate/virginia-adelaide-plains-australia-guide.html",
    "icon": "🌍",
    "desc": "Precision CEA engineering and climate guide for commercial greenhouses in Adelaide Plains (Virginia), South Australia (34.7°S). Solar DLI analysis (52-62 summer",
    "tags": "climate virginia adelaide plains australia guide html adelaide plains virginia south australia greenhouse microclimate cea engineering almanac precision cea engineering and climate guide for"
  },
  {
    "title": "Westland, Netherlands Greenhouse Microclimate & CEA Engineering Almanac",
    "cat": "climate",
    "url": "climate/westland-netherlands-greenhouse-climate-guide.html",
    "icon": "🌍",
    "desc": "Precision CEA engineering and climate guide for commercial greenhouses in Westland, Netherlands (52.0°N). Solar DLI analysis (35-42 summer / 6-10 winter mol/m²/",
    "tags": "climate westland netherlands greenhouse climate guide html westland netherlands greenhouse microclimate cea engineering almanac precision cea engineering and climate guide for commercial gre"
  },
  {
    "title": "Commercial Greenhouse & Indoor Cannabis (Cannabis sativa) Microclimate, VPD & DLI Precision Steering Guide",
    "cat": "crop",
    "url": "crops/commercial-cannabis-microclimate-vpd-photobiology-guide.html",
    "icon": "🌱",
    "desc": "Precision CEA engineering guide for Commercial Greenhouse & Indoor Cannabis (Cannabis sativa). Optimal VPD bands (1.0 - 1.5 kPa), DLI targets (35 - 55 mol/m²/d)",
    "tags": "crops commercial cannabis microclimate vpd photobiology guide html commercial greenhouse indoor cannabis cannabis sativa microclimate vpd dli precision steering guide precision cea engineeri"
  },
  {
    "title": "Commercial Greenhouse Strawberry (Fragaria × ananassa) Microclimate, VPD & DLI Precision Steering Guide",
    "cat": "crop",
    "url": "crops/commercial-strawberry-greenhouse-climate-dli-guide.html",
    "icon": "🌱",
    "desc": "Precision CEA engineering guide for Commercial Greenhouse Strawberry (Fragaria × ananassa). Optimal VPD bands (0.7 - 1.1 kPa), DLI targets (16 - 24 mol/m²/d), d",
    "tags": "crops commercial strawberry greenhouse climate dli guide html commercial greenhouse strawberry fragaria ananassa microclimate vpd dli precision steering guide precision cea engineering guide"
  },
  {
    "title": "Commercial Greenhouse Cucumber (Cucumis sativus) Microclimate, VPD & DLI Precision Steering Guide",
    "cat": "crop",
    "url": "crops/greenhouse-cucumber-high-humidity-transpiration-guide.html",
    "icon": "🌱",
    "desc": "Precision CEA engineering guide for Commercial Greenhouse Cucumber (Cucumis sativus). Optimal VPD bands (0.6 - 1.0 kPa), DLI targets (20 - 30 mol/m²/d), day/nig",
    "tags": "crops greenhouse cucumber high humidity transpiration guide html commercial greenhouse cucumber cucumis sativus microclimate vpd dli precision steering guide precision cea engineering guide "
  },
  {
    "title": "Commercial Greenhouse Cut Rose (Rosa hybrida) Microclimate, VPD & DLI Precision Steering Guide",
    "cat": "crop",
    "url": "crops/greenhouse-cut-flower-rose-microclimate-guide.html",
    "icon": "🌱",
    "desc": "Precision CEA engineering guide for Commercial Greenhouse Cut Rose (Rosa hybrida). Optimal VPD bands (0.8 - 1.2 kPa), DLI targets (20 - 30 mol/m²/d), day/night ",
    "tags": "crops greenhouse cut flower rose microclimate guide html commercial greenhouse cut rose rosa hybrida microclimate vpd dli precision steering guide precision cea engineering guide for commerc"
  },
  {
    "title": "Commercial Greenhouse Eggplant / Aubergine (Solanum melongena) Microclimate, VPD & DLI Precision Steering Guide",
    "cat": "crop",
    "url": "crops/greenhouse-eggplant-aubergine-microclimate-guide.html",
    "icon": "🌱",
    "desc": "Precision CEA engineering guide for Commercial Greenhouse Eggplant / Aubergine (Solanum melongena). Optimal VPD bands (0.8 - 1.2 kPa), DLI targets (22 - 30 mol/",
    "tags": "crops greenhouse eggplant aubergine microclimate guide html commercial greenhouse eggplant aubergine solanum melongena microclimate vpd dli precision steering guide precision cea engineering"
  },
  {
    "title": "Commercial Phalaenopsis Orchid (CAM) Microclimate, VPD & Spike Induction Guide",
    "cat": "crop",
    "url": "crops/greenhouse-phalaenopsis-orchid-climate-spike-induction-guide.html",
    "icon": "🌱",
    "desc": "Precision CEA engineering guide for Phalaenopsis Orchid Microclimate & Spike Induction Guide. Optimal VPD bands (0.5 - 0.9 kPa), DLI targets (6 - 10 mol/m²/d), ",
    "tags": "crops greenhouse phalaenopsis orchid climate spike induction guide html commercial phalaenopsis orchid cam microclimate vpd spike induction guide precision cea engineering guide for phalaeno"
  },
  {
    "title": "Commercial Greenhouse Sweet Pepper (Capsicum annuum) Microclimate, VPD & DLI Precision Steering Guide",
    "cat": "crop",
    "url": "crops/greenhouse-sweet-pepper-climate-blossom-end-rot-guide.html",
    "icon": "🌱",
    "desc": "Precision CEA engineering guide for Commercial Greenhouse Sweet Pepper (Capsicum annuum). Optimal VPD bands (0.9 - 1.3 kPa), DLI targets (22 - 32 mol/m²/d), day",
    "tags": "crops greenhouse sweet pepper climate blossom end rot guide html commercial greenhouse sweet pepper capsicum annuum microclimate vpd dli precision steering guide precision cea engineering gu"
  },
  {
    "title": "Commercial Greenhouse Tomato (Solanum lycopersicum) Microclimate, VPD & DLI Precision Steering Guide",
    "cat": "crop",
    "url": "crops/greenhouse-tomato-microclimate-vpd-steering-guide.html",
    "icon": "🌱",
    "desc": "Precision CEA engineering guide for Commercial Greenhouse Tomato (Solanum lycopersicum). Optimal VPD bands (0.8 - 1.2 kPa), DLI targets (25 - 35 mol/m²/d), day/",
    "tags": "crops greenhouse tomato microclimate vpd steering guide html commercial greenhouse tomato solanum lycopersicum microclimate vpd dli precision steering guide precision cea engineering guide f"
  },
  {
    "title": "Hydroponic Greenhouse Sweet Basil & Culinary Herbs (Ocimum basilicum) Microclimate, VPD & DLI Precision Steering Guide",
    "cat": "crop",
    "url": "crops/hydroponic-basil-culinary-herbs-climate-guide.html",
    "icon": "🌱",
    "desc": "Precision CEA engineering guide for Hydroponic Greenhouse Sweet Basil & Culinary Herbs (Ocimum basilicum). Optimal VPD bands (0.7 - 1.1 kPa), DLI targets (16 - ",
    "tags": "crops hydroponic basil culinary herbs climate guide html hydroponic greenhouse sweet basil culinary herbs ocimum basilicum microclimate vpd dli precision steering guide precision cea enginee"
  },
  {
    "title": "Commercial Crop Precision Steering Atlas: 10 Greenhouse Crops",
    "cat": "crop",
    "url": "crops/index.html",
    "icon": "🌱",
    "desc": "Biophysical crop steering blueprints for 10 major commercial greenhouse and vertical farm crops: Tomato, Strawberry, Cucumber, Sweet Pepper, Lettuce, Rose, Phal",
    "tags": "crops index html commercial crop precision steering atlas 10 greenhouse crops biophysical crop steering blueprints for 10 major commercial greenhouse and vertical farm crops tomato strawberr"
  },
  {
    "title": "Controlled Environment Leafy Greens & Lettuce (Lactuca sativa) Microclimate, VPD & DLI Precision Steering Guide",
    "cat": "crop",
    "url": "crops/vertical-farm-lettuce-leafy-greens-tipburn-prevention-guide.html",
    "icon": "🌱",
    "desc": "Precision CEA engineering guide for Controlled Environment Leafy Greens & Lettuce (Lactuca sativa). Optimal VPD bands (0.8 - 1.1 kPa), DLI targets (14 - 18 mol/",
    "tags": "crops vertical farm lettuce leafy greens tipburn prevention guide html controlled environment leafy greens lettuce lactuca sativa microclimate vpd dli precision steering guide precision cea "
  },
  {
    "title": "Complete CEA Engineering Directory &amp; Index (365 Pages)",
    "cat": "part",
    "url": "directory.html",
    "icon": "⚙️",
    "desc": "Master HTML sitemap and engineering taxonomy indexing all 365 calculators, 150 global agricultural grants, EN/DE/JA monographs, crop guides, and climate hubs.",
    "tags": "directory html complete cea engineering directory amp index 365 pages master html sitemap and engineering taxonomy indexing all 365 calculators 150 global agricultural grants en de ja monogr"
  },
  {
    "title": "Precision CEA & Horticultural Engineering Articles (78 Volumes / 183 Multilingual Editions)",
    "cat": "article",
    "url": "guides.html",
    "icon": "📚",
    "desc": "78-volume (183 multilingual editions) open-access Controlled Environment Agriculture (CEA) archive — VPD physics, biomass CHP, photobiology, closed-loop fertiga",
    "tags": "guides html precision cea horticultural engineering articles 78 volumes 183 multilingual editions 78 volume 183 multilingual editions open access controlled environment agriculture cea archi"
  },
  {
    "title": "Inwoovation Lab",
    "cat": "tool",
    "url": "index.html",
    "icon": "🛠️",
    "desc": "Inwoovation Lab — Unified CEA engineering command center: 150 verified global agricultural grants across 8 countries (US, Germany, Japan, Netherlands, Korea, Fr",
    "tags": "index html inwoovation lab inwoovation lab unified cea engineering command center 150 verified global agricultural grants across 8 countries us germany japan netherlands korea fr"
  },
  {
    "title": "Deutscher Gartenbau-Meister &amp; KTBL-Standard Rechner",
    "cat": "tool",
    "url": "meister.html",
    "icon": "🇩🇪",
    "desc": "Offizielle deutsche Gartenbau-Normen (KTBL Datensammlung, DIN V 18599, DIN EN 13031-1, QS-GAP 2026, IFS Food v8, SVLFG VSG 4.2). Heizwärmebedarf, Deckungsbeitra",
    "tags": "meister html deutscher gartenbau meister amp ktbl standard rechner offizielle deutsche gartenbau normen ktbl datensammlung din v 18599 din en 13031 1 qs gap 2026 ifs food v8 svlfg vsg 4 2 he"
  },
  {
    "title": "AgriMaster",
    "cat": "part",
    "url": "parts/index.html",
    "icon": "⚙️",
    "desc": "Industrial parametric search engine for commercial greenhouse components, fertigation valves, LED toplights, climate sensors, and Dutch bucket supplies. Cross-r",
    "tags": "parts index html agrimaster industrial parametric search engine for commercial greenhouse components fertigation valves led toplights climate sensors and dutch bucket supplies cross r"
  },
  {
    "title": "Privacy Policy &amp; Data Protection Statement",
    "cat": "part",
    "url": "parts/privacy.html",
    "icon": "⚙️",
    "desc": "Comprehensive Privacy Policy for AgriMaster (Inwoovation Lab) Global CEA Parts & Vacuum Engineering Catalog. GDPR, CCPA/CPRA, Google AdSense DART cookie, and lo",
    "tags": "parts privacy html privacy policy amp data protection statement comprehensive privacy policy for agrimaster inwoovation lab global cea parts vacuum engineering catalog gdpr ccpa cpra google "
  },
  {
    "title": "Terms of Service &amp; Engineering Liability Notice",
    "cat": "part",
    "url": "parts/terms.html",
    "icon": "⚙️",
    "desc": "Terms of Service and Engineering Disclaimer for AgriMaster (Inwoovation Lab) Global CEA Parts, Fertigation Hardware, and Vacuum Systems Engineering Suite.",
    "tags": "parts terms html terms of service amp engineering liability notice terms of service and engineering disclaimer for agrimaster inwoovation lab global cea parts fertigation hardware and vacuum"
  },
  {
    "title": "Vacuum Systems Engineering & Semiconductor Equipment Catalog",
    "cat": "part",
    "url": "parts/vacuum-systems.html",
    "icon": "⚙️",
    "desc": "Industrial vacuum engineering catalog & mechatronics specification suite. Featuring thermal evaporators (DEV), magnetron sputtering systems (DSP), hermetic iner",
    "tags": "parts vacuum systems html vacuum systems engineering semiconductor equipment catalog industrial vacuum engineering catalog mechatronics specification suite featuring thermal evaporators dev "
  },
  {
    "title": "Deutscher Meisterfunk: Podcast für moderne Landwirtschaft &amp; Technik",
    "cat": "article",
    "url": "podcasts/index.html",
    "icon": "🎙️",
    "desc": "Der deutsche Lernpodcast für Gewächshaustechnik, Nachrichten, Wissenschaft und die Gärtnermeister-Karriere. Gesprochen in langsamem, deutlichem Deutsch (A2/B1).",
    "tags": "podcasts index html deutscher meisterfunk podcast für moderne landwirtschaft amp technik der deutsche lernpodcast für gewächshaustechnik nachrichten wissenschaft und die gärtnermeister karri"
  },
  {
    "title": "OpenCEA Biophysics Mastery Quiz & Free Certificate Engine",
    "cat": "tool",
    "url": "quiz.html",
    "icon": "🛠️",
    "desc": "Test your precision CEA horticultural biophysics knowledge. Solve 10 questions on VPD, DLI, DIN V 18599, and fertigation to earn a free verifiable Certificate o",
    "tags": "quiz html opencea biophysics mastery quiz free certificate engine test your precision cea horticultural biophysics knowledge solve 10 questions on vpd dli din v 18599 and fertigation to earn"
  },
  {
    "title": "About Smart Farm Engineering Lab",
    "cat": "sim",
    "url": "smartfarm/about.html",
    "icon": "🧪",
    "desc": "Learn about Smart Farm Engineering Lab's mission to provide free, science-backed precision calculators for greenhouse growers, designers, and agricultural engin",
    "tags": "smartfarm about html about smart farm engineering lab learn about smart farm engineering lab s mission to provide free science backed precision calculators for greenhouse growers designers a"
  },
  {
    "title": "Greenhouse CO2 Enrichment & Cylinder Sizing Calculator",
    "cat": "sim",
    "url": "smartfarm/co2_calculator.html",
    "icon": "🧪",
    "desc": "Calculate greenhouse CO2 injection rates, target ppm enrichment, cylinder/tank consumption rates, and hourly enrichment costs for commercial growers.",
    "tags": "smartfarm co2 calculator html greenhouse co2 enrichment cylinder sizing calculator calculate greenhouse co2 injection rates target ppm enrichment cylinder tank consumption rates and hourly e"
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
    "title": "Crop Disease & Pest Diagnosis Tool",
    "cat": "sim",
    "url": "smartfarm/diagnosis.html",
    "icon": "🧪",
    "desc": "Free AI-powered crop disease and pest diagnosis for tomato, strawberry, blueberry, melon, and pepper. Includes pesticide bee toxicity database with Safe Re-entr",
    "tags": "smartfarm diagnosis html crop disease pest diagnosis tool free ai powered crop disease and pest diagnosis for tomato strawberry blueberry melon and pepper includes pesticide bee toxicity dat"
  },
  {
    "title": "Daily Light Integral (DLI) & LED Electricity ROI Calculator",
    "cat": "sim",
    "url": "smartfarm/dli_calculator.html",
    "icon": "🧪",
    "desc": "Calculate Daily Light Integral (DLI) targets, supplemental LED PPFD requirements, photoperiod hours, and daily/monthly electricity ROI costs for commercial CEA ",
    "tags": "smartfarm dli calculator html daily light integral dli led electricity roi calculator calculate daily light integral dli targets supplemental led ppfd requirements photoperiod hours and dail"
  },
  {
    "title": "Fertigation Stock Tank Calculator",
    "cat": "sim",
    "url": "smartfarm/fertigation.html",
    "icon": "🧪",
    "desc": "Calculate precise raw fertilizer compounding weights and acid neutralization dosages for greenhouse stock tank fertigation. Supports multiple dilution ratios an",
    "tags": "smartfarm fertigation html fertigation stock tank calculator calculate precise raw fertilizer compounding weights and acid neutralization dosages for greenhouse stock tank fertigation suppor"
  },
  {
    "title": "GreenPocket: Home Gardening & Smart Hydroponics Curation Directory",
    "cat": "sim",
    "url": "smartfarm/greenpocket.html",
    "icon": "🧪",
    "desc": "Curated selection of home indoor farming kits, grow LEDs, and nutrient sensors for urban gardeners.",
    "tags": "smartfarm greenpocket html greenpocket home gardening smart hydroponics curation directory curated selection of home indoor farming kits grow leds and nutrient sensors for urban gardeners"
  },
  {
    "title": "Greenhouse Heat Loss Calculator",
    "cat": "sim",
    "url": "smartfarm/heat_loss.html",
    "icon": "🧪",
    "desc": "Calculate maximum greenhouse heating load in kW and BTU/h using ASABE EP406 Q=UAΔT heat transfer formulas, wind infiltration modifiers, regional climate presets",
    "tags": "smartfarm heat loss html greenhouse heat loss calculator calculate maximum greenhouse heating load in kw and btu h using asabe ep406 q ua t heat transfer formulas wind infiltration modifiers"
  },
  {
    "title": "Smart Farm Engineering Lab",
    "cat": "sim",
    "url": "smartfarm/index.html",
    "icon": "🧪",
    "desc": "Free online precision engineering tools for greenhouse growers: VPD calculator, fertigation solver, heat loss estimator, mixing valve sizer, crop diagnosis, and",
    "tags": "smartfarm index html smart farm engineering lab free online precision engineering tools for greenhouse growers vpd calculator fertigation solver heat loss estimator mixing valve sizer crop d"
  },
  {
    "title": "3D Commercial Greenhouse Digital Twin & Physics Microclimate Simulator",
    "cat": "sim",
    "url": "smartfarm/korean_greenhouse_3d.html",
    "icon": "🧪",
    "desc": "Interactive 3D digital twin for multi-span arch poly and Venlo glass greenhouses. Real-time solar azimuth, roll-up roof/side ventilation, thermal screens, high-",
    "tags": "smartfarm korean greenhouse 3d html 3d commercial greenhouse digital twin physics microclimate simulator interactive 3d digital twin for multi span arch poly and venlo glass greenhouses real"
  },
  {
    "title": "Optimization of Vapor Pressure Deficit (VPD) for Greenhouse Tomato Yield and Quality",
    "cat": "sim",
    "url": "smartfarm/library_vpd_optimization_tomato.html",
    "icon": "🧪",
    "desc": "Vapor pressure deficit (VPD) is a critical climate parameter that directly influences plant transpiration, nutrient uptake, and overall yield in contr...",
    "tags": "smartfarm library vpd optimization tomato html optimization of vapor pressure deficit vpd for greenhouse tomato yield and quality vapor pressure deficit vpd is a critical climate parameter t"
  },
  {
    "title": "Greenhouse Supplemental Lighting Calculator",
    "cat": "sim",
    "url": "smartfarm/lighting_efficacy.html",
    "icon": "🧪",
    "desc": "Calculate greenhouse supplemental PPFD, daily DLI contribution, electrical power demand, and financial payback ROI comparing 1000W HPS with high-efficacy LED to",
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
    "desc": "Calculate the correct Kv coefficient, DN pipe diameter, and flow rates for greenhouse heating 3-way mixing valves. Includes heat load estimator and engineering ",
    "tags": "smartfarm mixing valve html greenhouse 3 way mixing valve kv calculator calculate the correct kv coefficient dn pipe diameter and flow rates for greenhouse heating 3 way mixing valves includ"
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
    "title": "Boiler vs Heat Pump ROI Simulator",
    "cat": "sim",
    "url": "smartfarm/roi_simulator.html",
    "icon": "🧪",
    "desc": "Compare annual heating costs between conventional boilers (gas, oil, LPG) and heat pumps. Calculate payback period, energy savings, and return on investment for",
    "tags": "smartfarm roi simulator html boiler vs heat pump roi simulator compare annual heating costs between conventional boilers gas oil lpg and heat pumps calculate payback period energy savings an"
  },
  {
    "title": "Smartfarm WFC Bed & Hydronic Layout Planner",
    "cat": "sim",
    "url": "smartfarm/smartfarm_layout_wfc.html",
    "icon": "🧪",
    "desc": "Autonomous Wave Function Collapse (WFC) and A* pathfinding algorithm for smart farm greenhouse design. Automatically routes cultivation gutters, main supply/ret",
    "tags": "smartfarm smartfarm layout wfc html smartfarm wfc bed hydronic layout planner autonomous wave function collapse wfc and a pathfinding algorithm for smart farm greenhouse design automatically"
  },
  {
    "title": "Terms of Service",
    "cat": "sim",
    "url": "smartfarm/terms.html",
    "icon": "🧪",
    "desc": "Terms of service and usage disclaimers for Smart Farm Engineering Lab's free online greenhouse calculators and agricultural engineering simulation tools.",
    "tags": "smartfarm terms html terms of service terms of service and usage disclaimers for smart farm engineering lab s free online greenhouse calculators and agricultural engineering simulation tools"
  },
  {
    "title": "Plant Transpiration Calculator",
    "cat": "sim",
    "url": "smartfarm/transpiration.html",
    "icon": "🧪",
    "desc": "Calculate real-time crop transpiration rates using the biophysical Penman-Monteith equation. Supports tomato, pepper, cucumber, and strawberry stomatal resistan",
    "tags": "smartfarm transpiration html plant transpiration calculator calculate real time crop transpiration rates using the biophysical penman monteith equation supports tomato pepper cucumber and st"
  },
  {
    "title": "Vertical Farming DLI Calculator",
    "cat": "sim",
    "url": "smartfarm/vertical_dli.html",
    "icon": "🧪",
    "desc": "Calculate Daily Light Integral (DLI), LED PPFD requirements, photoperiod optimization, and thermal heat dissipation for vertical farming and indoor growing syst",
    "tags": "smartfarm vertical dli html vertical farming dli calculator calculate daily light integral dli led ppfd requirements photoperiod optimization and thermal heat dissipation for vertical farmin"
  },
  {
    "title": "Leaf VPD Calculator",
    "cat": "sim",
    "url": "smartfarm/vpd.html",
    "icon": "🧪",
    "desc": "Calculate leaf-to-air Vapor Pressure Deficit (VPD) in real-time using the Tetens equation. Optimize greenhouse climate for seedling, vegetative, and flowering s",
    "tags": "smartfarm vpd html leaf vpd calculator calculate leaf to air vapor pressure deficit vpd in real time using the tetens equation optimize greenhouse climate for seedling vegetative and floweri"
  },
  {
    "title": "Open-Access AgTech Engineering Repository &amp; Digital Assets",
    "cat": "tool",
    "url": "store.html",
    "icon": "🛠️",
    "desc": "100% Free, open-access institutional engineering assets: Python fertigation solvers, 50-State USDA grant playbooks, smart greenhouse BOM estimators, and Bavaria",
    "tags": "store html open access agtech engineering repository amp digital assets 100 free open access institutional engineering assets python fertigation solvers 50 state usda grant playbooks smart g"
  },
  {
    "title": "OpenCEA Pro: Commercial Controlled Environment Agriculture Suite",
    "cat": "tool",
    "url": "suite/index.html",
    "icon": "🛠️",
    "desc": "OpenCEA Pro is an always-updated commercial CEA biophysics suite with 24/7 AI Agronomist Co-Pilot and 33 specialized greenhouse engineering engines.",
    "tags": "suite index html opencea pro commercial controlled environment agriculture suite opencea pro is an always updated commercial cea biophysics suite with 24 7 ai agronomist co pilot and 33 spec"
  },
  {
    "title": "AgriQuant Commercial CEA Energy & Commodity Terminal",
    "cat": "tool",
    "url": "tools/agriquant-greenhouse-energy-commodity-terminal.html",
    "icon": "🛠️",
    "desc": "Open-source financial and energy quant terminal for commercial high-tech greenhouses. Simulates Dutch TTF natural gas prices, electricity spark spreads, and fer",
    "tags": "tools agriquant greenhouse energy commodity terminal html agriquant commercial cea energy commodity terminal open source financial and energy quant terminal for commercial high tech greenhou"
  },
  {
    "title": "AgriVision: In-Browser AI Computer Vision Crop Disease & Deficiency Analyzer",
    "cat": "tool",
    "url": "tools/agrivision-ai-crop-disease-analyzer.html",
    "icon": "🛠️",
    "desc": "Client-side AI computer vision analyzer for greenhouse leaf pathology. Real-time webcam or image upload, spectral chlorosis segmentation, bounding box lesion de",
    "tags": "tools agrivision ai crop disease analyzer html agrivision in browser ai computer vision crop disease deficiency analyzer client side ai computer vision analyzer for greenhouse leaf pathology"
  },
  {
    "title": "Aquifer Thermal Energy Storage (ATES) & Heat Pump Sizing Simulator",
    "cat": "tool",
    "url": "tools/ates-aquifer-thermal-energy-storage-heat-pump-simulator.html",
    "icon": "🛠️",
    "desc": "Industrial CEA Aquifer Thermal Energy Storage (ATES) doublet well and heat pump simulator. Models warm/cold well seasonal hydraulics, Darcy drawdown, COP (VDI 4",
    "tags": "tools ates aquifer thermal energy storage heat pump simulator html aquifer thermal energy storage ates heat pump sizing simulator industrial cea aquifer thermal energy storage ates doublet w"
  },
  {
    "title": "CHP Flue Gas SCR Denitrification & Urea Dosing Calculator",
    "cat": "tool",
    "url": "tools/chp-flue-gas-scr-urea-dosing-calculator.html",
    "icon": "🛠️",
    "desc": "Industrial Selective Catalytic Reduction (SCR) calculator for natural gas CHP engines. Compute stoichiometric urea dosing, NOx to N2 conversion, and pure CO2 ou",
    "tags": "tools chp flue gas scr urea dosing calculator html chp flue gas scr denitrification urea dosing calculator industrial selective catalytic reduction scr calculator for natural gas chp engines"
  },
  {
    "title": "Closed-Loop Hydroponic Drainage Recirculation & Ion Balance Simulator",
    "cat": "tool",
    "url": "tools/closed-loop-nutrient-recirculation-ion-balance-simulator.html",
    "icon": "🛠️",
    "desc": "Commercial greenhouse closed-loop hydroponics drainage reuse simulator. Models multi-cycle Na/Cl accumulation, Davies ionic activity coefficients, and German Dü",
    "tags": "tools closed loop nutrient recirculation ion balance simulator html closed loop hydroponic drainage recirculation ion balance simulator commercial greenhouse closed loop hydroponics drainage"
  },
  {
    "title": "Closed-Loop RO Desalination & Energy Recovery Optimizer",
    "cat": "tool",
    "url": "tools/closed-loop-reverse-osmosis-desalination-energy-optimizer.html",
    "icon": "🛠️",
    "desc": "Industrial engineering calculator for greenhouse reverse osmosis (RO) membrane flux (LMH), specific energy consumption (kWh/m3), sodium Na+ rejection, and conce",
    "tags": "tools closed loop reverse osmosis desalination energy optimizer html closed loop ro desalination energy recovery optimizer industrial engineering calculator for greenhouse reverse osmosis ro"
  },
  {
    "title": "Biochemical Farquhar (FvCB) Leaf Photosynthesis Calculator",
    "cat": "tool",
    "url": "tools/co2-enrichment-leaf-photosynthesis-farquhar-calculator.html",
    "icon": "🛠️",
    "desc": "Industrial plant physiology calculator for Farquhar-von Caemmerer-Berry (FvCB) C3 leaf photosynthesis, Rubisco kinetics (Vcmax), electron transport (J), and net",
    "tags": "tools co2 enrichment leaf photosynthesis farquhar calculator html biochemical farquhar fvcb leaf photosynthesis calculator industrial plant physiology calculator for farquhar von caemmerer b"
  },
  {
    "title": "Commercial CEA Feasibility & Grant Dossier Generator",
    "cat": "tool",
    "url": "tools/commercial-feasibility-grant-dossier-generator.html",
    "icon": "🛠️",
    "desc": "Institutional agricultural feasibility modeler and non-dilutive grant dossier generator across 50 US states. Computes CAPEX, OPEX, USDA REAP/EQIP stacking, 10-y",
    "tags": "tools commercial feasibility grant dossier generator html commercial cea feasibility grant dossier generator institutional agricultural feasibility modeler and non dilutive grant dossier gen"
  },
  {
    "title": "Commercial Crop Steering Matrix (Generative vs Vegetative)",
    "cat": "tool",
    "url": "tools/crop-steering-generative-vegetative-matrix.html",
    "icon": "🛠️",
    "desc": "Industrial crop steering optimizer for high-wire greenhouse tomatoes, peppers, and cannabis. Calculate 24h DIF, VPD differential, and irrigation dry-down balanc",
    "tags": "tools crop steering generative vegetative matrix html commercial crop steering matrix generative vs vegetative industrial crop steering optimizer for high wire greenhouse tomatoes peppers an"
  },
  {
    "title": "Xylem Calcium Flux & Blossom-End Rot (BER) Risk Engine",
    "cat": "tool",
    "url": "tools/crop-transpiration-calcium-blossom-end-rot-risk-model.html",
    "icon": "🛠️",
    "desc": "Industrial plant physiology calculator for xylem calcium transport kinetics, transpiration pull, and Blossom-End Rot (BER) risk forecasting in commercial greenh",
    "tags": "tools crop transpiration calcium blossom end rot risk model html xylem calcium flux blossom end rot ber risk engine industrial plant physiology calculator for xylem calcium transport kinetic"
  },
  {
    "title": "Crop Yield & Biomass Accumulation DLI Forecaster",
    "cat": "tool",
    "url": "tools/crop-yield-biomass-dli-forecaster.html",
    "icon": "🛠️",
    "desc": "Predictive photosynthetic dry matter accumulation, Light Use Efficiency (LUE), and weekly commercial crop harvest yields based on cumulative Daily Light Integra",
    "tags": "tools crop yield biomass dli forecaster html crop yield biomass accumulation dli forecaster predictive photosynthetic dry matter accumulation light use efficiency lue and weekly commercial c"
  },
  {
    "title": "Greenhouse Digital Twin Microclimate Simulator",
    "cat": "tool",
    "url": "tools/digital-twin-greenhouse-simulator.html",
    "icon": "🛠️",
    "desc": "Industrial-grade interactive Venlo greenhouse digital twin simulator. Model real-time solar radiation, VPD, crop transpiration, thermal screens, and automated P",
    "tags": "tools digital twin greenhouse simulator html greenhouse digital twin microclimate simulator industrial grade interactive venlo greenhouse digital twin simulator model real time solar radiati"
  },
  {
    "title": "Commercial Greenhouse DLI & LED Spectrum Photomorphogenesis Calculator",
    "cat": "tool",
    "url": "tools/dli-spectrum-photomorphogenesis-calculator.html",
    "icon": "🛠️",
    "desc": "Industrial-grade Daily Light Integral (DLI) & Far-Red (730nm) Emerson Enhancement Effect spectral calculator for commercial greenhouse horticulture.",
    "tags": "tools dli spectrum photomorphogenesis calculator html commercial greenhouse dli led spectrum photomorphogenesis calculator industrial grade daily light integral dli far red 730nm emerson enh"
  },
  {
    "title": "EU Greenhouse Energy Audit (DIN V 18599 / BLE Grant) & Farm Succession (Hofnachfolge) ROI Simulator",
    "cat": "tool",
    "url": "tools/eu-greenhouse-energy-hofnachfolge-roi-simulator.html",
    "icon": "🇩🇪",
    "desc": "Interactive European glasshouse energy modernization (DIN V 18599, EN 13031-1, BLE 40% CAPEX grant, BEHG CO2 tax savings) and German farm succession (Hofnachfol",
    "tags": "tools eu greenhouse energy hofnachfolge roi simulator html eu greenhouse energy audit din v 18599 ble grant farm succession hofnachfolge roi simulator interactive european glasshouse energy "
  },
  {
    "title": "Greenhouse Hourly Penman-Monteith Evapotranspiration (ETc) Calculator",
    "cat": "tool",
    "url": "tools/evapotranspiration-penman-monteith-calculator.html",
    "icon": "🛠️",
    "desc": "Industrial FAO-56 Penman-Monteith hourly crop evapotranspiration (ETc), canopy resistance (rc), and aerodynamic resistance (ra) calculator for commercial greenh",
    "tags": "tools evapotranspiration penman monteith calculator html greenhouse hourly penman monteith evapotranspiration etc calculator industrial fao 56 penman monteith hourly crop evapotranspiration "
  },
  {
    "title": "High-Pressure Fogging & Evaporative Cooling Droplet Engine",
    "cat": "tool",
    "url": "tools/fogging-nozzle-droplet-evaporative-cooling-engine.html",
    "icon": "🛠️",
    "desc": "Industrial 70 bar high-pressure fogging calculator. Compute Sauter Mean Diameter (D32 < 10µm), flash evaporation rates, adiabatic temperature drop, and leaf wet",
    "tags": "tools fogging nozzle droplet evaporative cooling engine html high pressure fogging evaporative cooling droplet engine industrial 70 bar high pressure fogging calculator compute sauter mean d"
  },
  {
    "title": "Global Agri-Subsidy & Grant Navigator",
    "cat": "tool",
    "url": "tools/global-agri-subsidy-grant-navigator.html",
    "icon": "🛠️",
    "desc": "Official California (CDFA SWEEP/HSP/AMMP/FPIP/PHP/OTPP, CARB FARMER, CEC), USDA, European (BLE/GAP), and South Korean agricultural subsidy intelligence. Explore",
    "tags": "tools global agri subsidy grant navigator html global agri subsidy grant navigator official california cdfa sweep hsp ammp fpip php otpp carb farmer cec usda european ble gap and south korea"
  },
  {
    "title": "3D WebGL Venlo Greenhouse Digital Twin & Real-Time Physics Simulator",
    "cat": "tool",
    "url": "tools/greenhouse-3d-digital-twin-simulator.html",
    "icon": "🛠️",
    "desc": "Interactive 3D WebGL Venlo glasshouse digital twin. Real-time solar trajectory shadow mapping, dynamic thermal screen deployment, roof vent airflow dynamics, an",
    "tags": "tools greenhouse 3d digital twin simulator html 3d webgl venlo greenhouse digital twin real time physics simulator interactive 3d webgl venlo glasshouse digital twin real time solar trajecto"
  },
  {
    "title": "Autonomous Climate Computer AI & Model Predictive Control (MPC) Simulator",
    "cat": "tool",
    "url": "tools/greenhouse-autonomous-ai-climate-controller.html",
    "icon": "🛠️",
    "desc": "Reinforcement learning and Model Predictive Control (MPC) simulator for autonomous greenhouse climate computers, optimizing 24h temperature trajectories and sav",
    "tags": "tools greenhouse autonomous ai climate controller html autonomous climate computer ai model predictive control mpc simulator reinforcement learning and model predictive control mpc simulator"
  },
  {
    "title": "Greenhouse Biological Pest Control (IPM) & Predator Release Calculator",
    "cat": "tool",
    "url": "tools/greenhouse-biological-pest-control-ipm-calculator.html",
    "icon": "🛠️",
    "desc": "Industrial Integrated Pest Management (IPM) bio-control calculator for commercial greenhouses. Calculate predatory mite (Phytoseiulus, Amblyseius) and parasitoi",
    "tags": "tools greenhouse biological pest control ipm calculator html greenhouse biological pest control ipm predator release calculator industrial integrated pest management ipm bio control calculat"
  },
  {
    "title": "Greenhouse Biomass CHP & Waste Heat ROI Simulator",
    "cat": "tool",
    "url": "tools/greenhouse-biomass-chp-energy-roi-calculator.html",
    "icon": "🛠️",
    "desc": "Interactive precision engineering calculator for greenhouse biomass-fired CHP systems: model wood-chip fuel costs, fossil natural gas replacement, SCR CO2 dosin",
    "tags": "tools greenhouse biomass chp energy roi calculator html greenhouse biomass chp waste heat roi simulator interactive precision engineering calculator for greenhouse biomass fired chp systems "
  },
  {
    "title": "Commercial Greenhouse 10-Year CapEx, OpEx, IRR & NPV Investment Engine",
    "cat": "tool",
    "url": "tools/greenhouse-capex-opex-10year-roi-calculator.html",
    "icon": "🛠️",
    "desc": "Industrial financial engineering calculator for high-tech commercial glasshouse investments: CapEx breakdown, 10-year OpEx cash flows, Internal Rate of Return (",
    "tags": "tools greenhouse capex opex 10year roi calculator html commercial greenhouse 10 year capex opex irr npv investment engine industrial financial engineering calculator for high tech commercial"
  },
  {
    "title": "Greenhouse CO2 Enrichment & Economics Optimizer",
    "cat": "tool",
    "url": "tools/greenhouse-co2-enrichment-optimizer.html",
    "icon": "🛠️",
    "desc": "Industrial CO2 dosing kinetics and economics optimizer. Calculate pure liquid vs flue gas dosing costs, ventilation purge losses, and net crop yield gains.",
    "tags": "tools greenhouse co2 enrichment optimizer html greenhouse co2 enrichment economics optimizer industrial co2 dosing kinetics and economics optimizer calculate pure liquid vs flue gas dosing c"
  },
  {
    "title": "EPEX SPOT Dynamic Tariff, Power-to-Heat (20 kV Boiler), Heat Pump &amp; BESS Arbitrage Simulator",
    "cat": "tool",
    "url": "tools/greenhouse-energy-tariff-bess-p2h-arbitrage-calculator.html",
    "icon": "🛠️",
    "desc": "Commercial greenhouse EPEX SPOT negative electricity price, 20 kV Power-to-Heat electrode boiler, industrial heat pump, LFP-BESS, and stratified thermal buffer ",
    "tags": "tools greenhouse energy tariff bess p2h arbitrage calculator html epex spot dynamic tariff power to heat 20 kv boiler heat pump amp bess arbitrage simulator commercial greenhouse epex spot n"
  },
  {
    "title": "Greenhouse Heating Load, Thermal Screen & Green Energy Transition Sizer (DIN V 18599)",
    "cat": "tool",
    "url": "tools/greenhouse-heating-load-thermal-screen-calculator.html",
    "icon": "🛠️",
    "desc": "Commercial engineering calculator for greenhouse peak heating demand, DIN V 18599 thermal screen savings, hydronic pipe rail sizing, and geothermal/biomass rene",
    "tags": "tools greenhouse heating load thermal screen calculator html greenhouse heating load thermal screen green energy transition sizer din v 18599 commercial engineering calculator for greenhouse"
  },
  {
    "title": "Horticultural LED Thermal Heat-Sink & Junction Temperature (Tj) Optimizer",
    "cat": "tool",
    "url": "tools/greenhouse-lighting-led-thermal-cfd-optimizer.html",
    "icon": "🛠️",
    "desc": "Industrial engineering calculator for horticultural LED fixture thermal dissipation, junction temperature (Tj), photon efficacy derating, and canopy convective ",
    "tags": "tools greenhouse lighting led thermal cfd optimizer html horticultural led thermal heat sink junction temperature tj optimizer industrial engineering calculator for horticultural led fixture"
  },
  {
    "title": "Greenhouse HAF Air Circulation & CFD Air Velocity Optimizer",
    "cat": "tool",
    "url": "tools/greenhouse-microclimate-cfd-air-velocity-optimizer.html",
    "icon": "🛠️",
    "desc": "Industrial CFD calculator for horizontal air flow (HAF) fan spacing, jet throw distance, Bernoulli air entrainment, and microclimate boundary layer destratifica",
    "tags": "tools greenhouse microclimate cfd air velocity optimizer html greenhouse haf air circulation cfd air velocity optimizer industrial cfd calculator for horizontal air flow haf fan spacing jet "
  },
  {
    "title": "Smart Greenhouse Edge IoT & MQTT Telemetry Fleet Simulator",
    "cat": "tool",
    "url": "tools/greenhouse-mqtt-edge-iot-fleet-simulator.html",
    "icon": "🛠️",
    "desc": "Industrial IoT simulator streaming real-time MQTT telemetry across 100 virtual greenhouse microclimate, slab TDR, and PAR sensor nodes with edge anomaly detecti",
    "tags": "tools greenhouse mqtt edge iot fleet simulator html smart greenhouse edge iot mqtt telemetry fleet simulator industrial iot simulator streaming real time mqtt telemetry across 100 virtual gr"
  },
  {
    "title": "Greenhouse Natural Ventilation & Buoyancy-Driven Airflow Calculator",
    "cat": "tool",
    "url": "tools/greenhouse-natural-ventilation-buoyancy-airflow-calculator.html",
    "icon": "🛠️",
    "desc": "Calculate natural ventilation rates, buoyancy-driven (stack effect) and wind-driven airflow through greenhouse vents using ASABE EP406.4 and De Jong & Bot therm",
    "tags": "tools greenhouse natural ventilation buoyancy airflow calculator html greenhouse natural ventilation buoyancy driven airflow calculator calculate natural ventilation rates buoyancy driven st"
  },
  {
    "title": "Greenhouse Structural Wind, Snow & Crop Load (EN 13031-1 / NEN 3859)",
    "cat": "tool",
    "url": "tools/greenhouse-structural-wind-snow-load-nen3859-calculator.html",
    "icon": "🛠️",
    "desc": "Industrial structural engineering calculator for Venlo greenhouse wind pressure (qw), snow load (qs), trellised crop wire weight, and column moment according to",
    "tags": "tools greenhouse structural wind snow load nen3859 calculator html greenhouse structural wind snow crop load en 13031 1 nen 3859 industrial structural engineering calculator for venlo greenh"
  },
  {
    "title": "Hydroponic Chemical Speciation & Mineral Precipitation Index (SI)",
    "cat": "tool",
    "url": "tools/hydroponic-chemical-speciation-precipitation-index.html",
    "icon": "🛠️",
    "desc": "Industrial chemical speciation calculator for hydroponic nutrient solutions: Debye-Hückel ionic strength, ion activity coefficients, and Saturation Index (SI) f",
    "tags": "tools hydroponic chemical speciation precipitation index html hydroponic chemical speciation mineral precipitation index si industrial chemical speciation calculator for hydroponic nutrient "
  },
  {
    "title": "Hydroponic Nutrient Formulation & Ion Balance Calculator",
    "cat": "tool",
    "url": "tools/hydroponic-nutrient-solution-calculator.html",
    "icon": "🛠️",
    "desc": "Industrial-grade commercial hydroponic nutrient solution calculator. Optimize Hoagland, Sonneveld, and Steiner ionic ratios (NO3, K, Ca, Mg, P) for greenhouse c",
    "tags": "tools hydroponic nutrient solution calculator html hydroponic nutrient formulation ion balance calculator industrial grade commercial hydroponic nutrient solution calculator optimize hoaglan"
  },
  {
    "title": "Greenhouse & Controlled Environment Engineering Tools Suite (42 Enterprise Tools)",
    "cat": "tool",
    "url": "tools/index.html",
    "icon": "🛠️",
    "desc": "A comprehensive suite of 42 industrial-grade commercial greenhouse engineering calculators, 3D WebGL digital twin simulators, 150-grant global agri-subsidy navi",
    "tags": "tools index html greenhouse controlled environment engineering tools suite 42 enterprise tools a comprehensive suite of 42 industrial grade commercial greenhouse engineering calculators 3d w"
  },
  {
    "title": "Greenhouse Nutrient Uptake Concentration Factor (UCF) & Drain-to-Waste Analyzer",
    "cat": "tool",
    "url": "tools/nutrient-uptake-concentration-factor-analyzer.html",
    "icon": "🛠️",
    "desc": "Model nutrient uptake concentration factors in recirculating and drain-to-waste hydroponic systems. Simulate EC drift, ion accumulation, and optimal drain fract",
    "tags": "tools nutrient uptake concentration factor analyzer html greenhouse nutrient uptake concentration factor ucf drain to waste analyzer model nutrient uptake concentration factors in recirculat"
  },
  {
    "title": "OpenCEA Developer Hub & Interactive REST API / MCP Playground",
    "cat": "tool",
    "url": "tools/opencea-python-micro-framework-playground.html",
    "icon": "🛠️",
    "desc": "Open-access developer documentation, interactive REST API playground, and open-source MCP server for greenhouse physics, VPD, DLI, evapotranspiration, and IPM b",
    "tags": "tools opencea python micro framework playground html opencea developer hub interactive rest api mcp playground open access developer documentation interactive rest api playground and open so"
  },
  {
    "title": "Canopy Light Extinction (Beer-Lambert & LAI) Calculator",
    "cat": "tool",
    "url": "tools/par-far-red-canopy-extinction-beer-lambert-calculator.html",
    "icon": "🛠️",
    "desc": "Industrial plant physiology calculator for multi-layer canopy light extinction (Beer-Lambert Law), Leaf Area Index (LAI), and diffuse vs direct photon penetrati",
    "tags": "tools par far red canopy extinction beer lambert calculator html canopy light extinction beer lambert lai calculator industrial plant physiology calculator for multi layer canopy light extin"
  },
  {
    "title": "Psychrometric Mollier Diagram & Greenhouse Dehumidification Optimizer",
    "cat": "tool",
    "url": "tools/psychrometric-mollier-greenhouse-dehumidifier.html",
    "icon": "🛠️",
    "desc": "Industrial psychrometric air state and greenhouse dehumidification energy optimizer. Compare mechanical heat pumps vs ridge vent purging.",
    "tags": "tools psychrometric mollier greenhouse dehumidifier html psychrometric mollier diagram greenhouse dehumidification optimizer industrial psychrometric air state and greenhouse dehumidificatio"
  },
  {
    "title": "Rockwool Slab TDR Moisture & Drain EC Balancing Optimizer",
    "cat": "tool",
    "url": "tools/rockwool-substrate-tdr-moisture-drain-optimizer.html",
    "icon": "🛠️",
    "desc": "Industrial substrate water content (VWC %), dry-down kinetics, and drainage EC balancing calculator for commercial rockwool slab hydroponics.",
    "tags": "tools rockwool substrate tdr moisture drain optimizer html rockwool slab tdr moisture drain ec balancing optimizer industrial substrate water content vwc dry down kinetics and drainage ec ba"
  },
  {
    "title": "Semi-Closed Greenhouse ATU & Mollier h-x Psychrometric 3D Simulator",
    "cat": "tool",
    "url": "tools/semi-closed-greenhouse-atu-mollier-simulator.html",
    "icon": "🛠️",
    "desc": "Interactive 3D Semi-Closed Greenhouse Air Treatment Unit (ATU) & Mollier h-x psychrometric simulator. Model Kubo Ultra-Clima & ModulAIR adiabatic fogging, under",
    "tags": "tools semi closed greenhouse atu mollier simulator html semi closed greenhouse atu mollier h x psychrometric 3d simulator interactive 3d semi closed greenhouse air treatment unit atu mollier"
  },
  {
    "title": "Substrate Matric Potential (pF Curve & van Genuchten) Calculator",
    "cat": "tool",
    "url": "tools/soil-matrix-water-potential-matric-suction-calculator.html",
    "icon": "🛠️",
    "desc": "Industrial agricultural physics calculator for substrate matric water potential (Psi_m), pF retention curves, van Genuchten model, and field capacity vs wilting",
    "tags": "tools soil matrix water potential matric suction calculator html substrate matric potential pf curve van genuchten calculator industrial agricultural physics calculator for substrate matric "
  },
  {
    "title": "Hot Water Buffer Tank Thermal Storage & Stratification Sizing",
    "cat": "tool",
    "url": "tools/solar-thermal-buffer-tank-stratification-calculator.html",
    "icon": "🛠️",
    "desc": "Industrial engineering calculator for greenhouse hot-water buffer tank thermal storage (MWh), thermocline stratification stability, and night peak heating disch",
    "tags": "tools solar thermal buffer tank stratification calculator html hot water buffer tank thermal storage stratification sizing industrial engineering calculator for greenhouse hot water buffer t"
  },
  {
    "title": "Closed-Loop UV-C Disinfection & Pathogen Log-Reduction Calculator",
    "cat": "tool",
    "url": "tools/uvc-drainage-pathogen-disinfection-calculator.html",
    "icon": "🛠️",
    "desc": "Industrial UV-C radiation dose (mJ/cm2), UVT% water transmissivity, and Chick-Watson log-reduction kinetics for ToBRFV, Pythium, and Fusarium in hydroponic drai",
    "tags": "tools uvc drainage pathogen disinfection calculator html closed loop uv c disinfection pathogen log reduction calculator industrial uv c radiation dose mj cm2 uvt water transmissivity and ch"
  },
  {
    "title": "VenloCAD 3D - Industrial Parametric Greenhouse CAD & Structural Engineering Engine",
    "cat": "tool",
    "url": "tools/venlocad-3d.html",
    "icon": "🛠️",
    "desc": "Industrial 3D parametric CAD and structural engineering engine for Venlo greenhouses. Features real-time WebGL frame generation, NEN 3859 / EN 13031-1 structura",
    "tags": "tools venlocad 3d html venlocad 3d industrial parametric greenhouse cad structural engineering engine industrial 3d parametric cad and structural engineering engine for venlo greenhouses fea"
  },
  {
    "title": "Greenhouse Cultivation & Facility Troubleshooting Wizard",
    "cat": "tool",
    "url": "troubleshoot.html",
    "icon": "🛠️",
    "desc": "Instant diagnostic wizard for commercial greenhouse and indoor farm issues. Identify root causes for tip burn, blossom-end rot, condensation, and heating spikes",
    "tags": "troubleshoot html greenhouse cultivation facility troubleshooting wizard instant diagnostic wizard for commercial greenhouse and indoor farm issues identify root causes for tip burn blossom "
  },
  {
    "title": "Photomorphogenic Regulation of Anthocyanin Biosynthetic Genes via Blue-to-Red Spectral Ratios",
    "cat": "wiki",
    "url": "wiki/anthocyanin_led_spectral_kinetics.html",
    "icon": "🧬",
    "desc": "Photomorphogenic regulation of Chalcone Synthase (CHS) and DFR gene expression via blue-to-red LED spectral ratios for anthocyanin induction.",
    "tags": "wiki anthocyanin led spectral kinetics html photomorphogenic regulation of anthocyanin biosynthetic genes via blue to red spectral ratios photomorphogenic regulation of chalcone synthase chs"
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
    "title": "Xylem-Mediated Calcium Translocation Kinetics and Root-Pressure Driven Guttation Steering",
    "cat": "wiki",
    "url": "wiki/calcium_channel_xylem_transport.html",
    "icon": "🧬",
    "desc": "Xylem-mediated calcium translocation kinetics, mechanosensitive Ca2+ channels, and nocturnal root-pressure guttation steering in Solanaceae.",
    "tags": "wiki calcium channel xylem transport html xylem mediated calcium translocation kinetics and root pressure driven guttation steering xylem mediated calcium translocation kinetics mechanosensi"
  },
  {
    "title": "Care Farming (치유농업)",
    "cat": "wiki",
    "url": "wiki/care_farming.html",
    "icon": "🧬",
    "desc": "Therapeutic Care Farming &amp; Barrier-Free CEA Engineering: clinical horticultural therapy, ergonomic glasshouse design, and sensory steering.",
    "tags": "wiki care farming html care farming therapeutic care farming amp barrier free cea engineering clinical horticultural therapy ergonomic glasshouse design and sensory steering"
  },
  {
    "title": "Pulse-Amplitude-Modulation (PAM) Fluorometry and Fv/Fm Quantum Yield Kinetics under Rapid Spectrum Transitions",
    "cat": "wiki",
    "url": "wiki/chlorophyll_fluorescence_pam_stress_kinetics.html",
    "icon": "🧬",
    "desc": "Pulse-Amplitude-Modulation (PAM) fluorometry modeling of PSII quantum yield (Fv/Fm) and NPQ relaxation kinetics during LED spectrum ramping.",
    "tags": "wiki chlorophyll fluorescence pam stress kinetics html pulse amplitude modulation pam fluorometry and fv fm quantum yield kinetics under rapid spectrum transitions pulse amplitude modulation"
  },
  {
    "title": "Canopy CO2 Enrichment Dynamics (1200 ppm) and Rubisco Carboxylation Kinetics under Variable PPFD Regimes",
    "cat": "wiki",
    "url": "wiki/co2_injection_canopy_assimilation_kinetics.html",
    "icon": "🧬",
    "desc": "Canopy CO2 enrichment dynamics (1200 ppm), Rubisco carboxylation velocity (Vcmax), and photorespiration suppression under high PPFD regimes.",
    "tags": "wiki co2 injection canopy assimilation kinetics html canopy co2 enrichment dynamics 1200 ppm and rubisco carboxylation kinetics under variable ppfd regimes canopy co2 enrichment dynamics 120"
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
    "title": "Thermodynamic Optimization of Daily Light Integral (DLI) and Phytochrome Photostationary State (PSS)",
    "cat": "wiki",
    "url": "wiki/dli_photomorphogenesis_steering.html",
    "icon": "🧬",
    "desc": "Thermodynamic optimization of Daily Light Integral (DLI) and Phytochrome Photostationary State (Pfr/Ptotal) in LED vertical farming canopies.",
    "tags": "wiki dli photomorphogenesis steering html thermodynamic optimization of daily light integral dli and phytochrome photostationary state pss thermodynamic optimization of daily light integral "
  },
  {
    "title": "Far-Red (730nm) Photon Fraction Steering for Rapid Leaf Area Index Expansion without Stem Lodging",
    "cat": "wiki",
    "url": "wiki/far_red_shade_avoidance_yield_kinetics.html",
    "icon": "🧬",
    "desc": "End-of-day Far-Red (730 nm) phytochrome photo-equilibrium steering for 35% faster Leaf Area Index (LAI) closure without stem lodging.",
    "tags": "wiki far red shade avoidance yield kinetics html far red 730nm photon fraction steering for rapid leaf area index expansion without stem lodging end of day far red 730 nm phytochrome photo e"
  },
  {
    "title": "Root Zone Temperature (RZT) Dynamics, Dissolved Oxygen (DO) Saturation, and ATP Yield in NFT Spinach Channels",
    "cat": "wiki",
    "url": "wiki/hydroponic_root_zone_temperature_respiration.html",
    "icon": "🧬",
    "desc": "Hydroponic Root Zone Temperature (RZT 18°C) chilling, dissolved oxygen saturation, mitochondrial ATP yield, and Pythium root rot suppression.",
    "tags": "wiki hydroponic root zone temperature respiration html root zone temperature rzt dynamics dissolved oxygen do saturation and atp yield in nft spinach channels hydroponic root zone temperatur"
  },
  {
    "title": "400-1000nm Hyperspectral Leaf Reflectance Modeling for Early Discrimination of Fe vs N Chlorosis",
    "cat": "wiki",
    "url": "wiki/hyperspectral_leaf_reflectance_nutrient_stress.html",
    "icon": "🧬",
    "desc": "400-1000 nm hyperspectral leaf reflectance and SVM machine learning classification for pre-symptomatic Fe vs. N chlorosis detection in CEA.",
    "tags": "wiki hyperspectral leaf reflectance nutrient stress html 400 1000nm hyperspectral leaf reflectance modeling for early discrimination of fe vs n chlorosis 400 1000 nm hyperspectral leaf refle"
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
    "title": "Real-Time Closed-Loop Machine Learning Ionic Activity Balancing in Recirculating Hydroponic Systems",
    "cat": "wiki",
    "url": "wiki/ion_selective_electrode_fertigation_ml.html",
    "icon": "🧬",
    "desc": "Closed-loop LSTM neural network and solid-state Ion-Selective Electrode (ISE) array for zero-discharge recirculating hydroponic fertigation.",
    "tags": "wiki ion selective electrode fertigation ml html real time closed loop machine learning ionic activity balancing in recirculating hydroponic systems closed loop lstm neural network and solid"
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
    "title": "Glucosinolate Accumulation Kinetics and Cold-Stress Induced Anthocyanin Biosynthesis in Brassica oleracea",
    "cat": "wiki",
    "url": "wiki/kale_glucosinolate_cold_stress.html",
    "icon": "🧬",
    "desc": "Cold-night DIF (+8°C) and sulfate fertigation kinetics driving myrosinase (EC 3.2.1.147), glucoraphanin, and anthocyanin synthesis in kale.",
    "tags": "wiki kale glucosinolate cold stress html glucosinolate accumulation kinetics and cold stress induced anthocyanin biosynthesis in brassica oleracea cold night dif 8 c and sulfate fertigation "
  },
  {
    "title": "Stoichiometric & Kinetic Modeling of Rubisco Carboxylation Efficiency under CO2 Enrichment",
    "cat": "wiki",
    "url": "wiki/kegg_carbon_rubisco_kinetics.html",
    "icon": "🧬",
    "desc": "Farquhar-von Caemmerer-Berry (FVCB) modeling of Rubisco carboxylation (Vcmax, Jmax) and KEGG carbon fixation under 1000 ppm CO2 enrichment.",
    "tags": "wiki kegg carbon rubisco kinetics html stoichiometric kinetic modeling of rubisco carboxylation efficiency under co2 enrichment farquhar von caemmerer berry fvcb modeling of rubisco carboxyl"
  },
  {
    "title": "KEGG Carotenoid Biosynthetic Pathway Flux and Lutein Xanthophyll Photoprotection under High PPFD Regimes",
    "cat": "wiki",
    "url": "wiki/kegg_carotenoid_lutein_photoprotection.html",
    "icon": "🧬",
    "desc": "KEGG carotenoid pathway (sly00906) flux and lycopene epsilon-cyclase up-regulation for lutein xanthophyll photoprotection under UV-A + high PPFD.",
    "tags": "wiki kegg carotenoid lutein photoprotection html kegg carotenoid biosynthetic pathway flux and lutein xanthophyll photoprotection under high ppfd regimes kegg carotenoid pathway sly00906 flu"
  },
  {
    "title": "Metabolic Flux Analysis of Flavonoid Biosynthesis (KEGG sly00941) under Osmotic and Thermal Stress",
    "cat": "wiki",
    "url": "wiki/kegg_flavonoid_secondary_metabolism.html",
    "icon": "🧬",
    "desc": "Metabolic flux analysis of the KEGG flavonoid biosynthesis pathway (sly00941) and flavonol synthase kinetics under thermal-osmotic steering.",
    "tags": "wiki kegg flavonoid secondary metabolism html metabolic flux analysis of flavonoid biosynthesis kegg sly00941 under osmotic and thermal stress metabolic flux analysis of the kegg flavonoid b"
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
    "title": "Navier-Stokes Fluid Dynamics Modeling of Leaf Boundary Layer Thermal Transport under Micro-Vectored Airflow",
    "cat": "wiki",
    "url": "wiki/micro_airflow_boundary_layer_fluid_dynamics.html",
    "icon": "🧬",
    "desc": "3D Navier-Stokes fluid dynamics modeling of leaf boundary layer thickness (0.6 mm) and transpirational Ca2+ flux under 0.35 m/s vertical airflow.",
    "tags": "wiki micro airflow boundary layer fluid dynamics html navier stokes fluid dynamics modeling of leaf boundary layer thermal transport under micro vectored airflow 3d navier stokes fluid dynam"
  },
  {
    "title": "Metagenomic Characterization of Rhizosphere PGPR Siderophore Production in Organic Substrates",
    "cat": "wiki",
    "url": "wiki/microbial_rhizosphere_metagenomics.html",
    "icon": "🧬",
    "desc": "16S rRNA metagenomic characterization of PGPR pyoverdine siderophore iron chelation and Pythium suppression in organic coir hydroponics.",
    "tags": "wiki microbial rhizosphere metagenomics html metagenomic characterization of rhizosphere pgpr siderophore production in organic substrates 16s rrna metagenomic characterization of pgpr pyove"
  },
  {
    "title": "Pulsed Pre-Harvest UV-B (310nm) Irradiation for 3-Fold Expansion of Sulforaphane Content in Broccoli Microgreens",
    "cat": "wiki",
    "url": "wiki/microgreens_sulforaphane_enhancement_lighting.html",
    "icon": "🧬",
    "desc": "Pulsed pre-harvest UV-B (310 nm) elicitation up-regulating CYP79F1 and MYB28 for a 310% expansion of sulforaphane in Brassica microgreens.",
    "tags": "wiki microgreens sulforaphane enhancement lighting html pulsed pre harvest uv b 310nm irradiation for 3 fold expansion of sulforaphane content in broccoli microgreens pulsed pre harvest uv b"
  },
  {
    "title": "Phosphate Transporter Gene Expression (Pht1 Family) and Arbuscular Mycorrhizal Symbiosis",
    "cat": "wiki",
    "url": "wiki/mycorrhizal_phosphate_transporter_kinetics.html",
    "icon": "🧬",
    "desc": "Arbuscular mycorrhizal symbiosis and Pht1 phosphate transporter gene expression kinetics under low-phosphorus (0.35 mM) organic hydroponics.",
    "tags": "wiki mycorrhizal phosphate transporter kinetics html phosphate transporter gene expression pht1 family and arbuscular mycorrhizal symbiosis arbuscular mycorrhizal symbiosis and pht1 phosphat"
  },
  {
    "title": "Circadian Clock Gating of Plastidic Nitrate Reductase (NR) Activity under Photoperiod Extension",
    "cat": "wiki",
    "url": "wiki/nitrate_reductase_circadian_rhythm.html",
    "icon": "🧬",
    "desc": "Circadian clock (CCA1/LHY) gating of plastidic Nitrate Reductase (EC 1.7.1.1) phosphorylation and vacuolar nitrate purging under 16h photoperiods.",
    "tags": "wiki nitrate reductase circadian rhythm html circadian clock gating of plastidic nitrate reductase nr activity under photoperiod extension circadian clock cca1 lhy gating of plastidic nitrat"
  },
  {
    "title": "Osmotic Steering & Translocational Sucrose Accumulation Kinetics via Root-Zone EC Modulation",
    "cat": "wiki",
    "url": "wiki/osmotic_brix_salt_stress_kinetics.html",
    "icon": "🧬",
    "desc": "Osmotic root-zone EC steering, Sucrose Synthase (EC 2.4.1.13) activation, and phloem sugar unloading kinetics for high-Brix CEA fruit crops.",
    "tags": "wiki osmotic brix salt stress kinetics html osmotic steering translocational sucrose accumulation kinetics via root zone ec modulation osmotic root zone ec steering sucrose synthase ec 2 4 1"
  },
  {
    "title": "Oxalate Biosynthesis and Ascorbate Recycling Kinetics under Dynamic LED Spectrum in Spinacia oleracea",
    "cat": "wiki",
    "url": "wiki/oxalate_biosynthesis_ascorbate_recycling.html",
    "icon": "🧬",
    "desc": "Metabolic flux control of L-galactono-1,4-lactone dehydrogenase and oxalate reduction in Spinacia oleracea via 25% blue LED spectral steering.",
    "tags": "wiki oxalate biosynthesis ascorbate recycling html oxalate biosynthesis and ascorbate recycling kinetics under dynamic led spectrum in spinacia oleracea metabolic flux control of l galactono"
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
    "title": "Bioenergetic Modeling of Photorespiratory Nitrogen Flux & Stomatal Conductance",
    "cat": "wiki",
    "url": "wiki/photorespiratory_nitrogen_kinetics.html",
    "icon": "🧬",
    "desc": "Bioenergetic model coupling VPD stomatal closure, mesophyll CO2 limitation, and GS-GOGAT photorespiratory nitrogen flux in CEA Solanaceae.",
    "tags": "wiki photorespiratory nitrogen kinetics html bioenergetic modeling of photorespiratory nitrogen flux stomatal conductance bioenergetic model coupling vpd stomatal closure mesophyll co2 limit"
  },
  {
    "title": "Acoustic Wave Resonance (1-5 kHz) Inducing Stomatal Pore Expansion for Enhanced Micro-Foliar Uptake",
    "cat": "wiki",
    "url": "wiki/plant_acoustic_frequency_stomatal_kinetics.html",
    "icon": "🧬",
    "desc": "Acoustic wave mechanosensory resonance (3.2 kHz at 80 dB) driving guard cell K+ influx, stomatal aperture expansion, and foliar Ca2+ uptake.",
    "tags": "wiki plant acoustic frequency stomatal kinetics html acoustic wave resonance 1 5 khz inducing stomatal pore expansion for enhanced micro foliar uptake acoustic wave mechanosensory resonance "
  },
  {
    "title": "Lead-Free Perovskite Quantum Dot Wavelength-Shifting Films for Solar Photonic Yield Optimization",
    "cat": "wiki",
    "url": "wiki/quantum_dot_wavelength_shifting_films.html",
    "icon": "🧬",
    "desc": "Lead-free Cs3Bi2Br9 perovskite quantum dot greenhouse films shifting 500-560 nm green solar photons to 660 nm red for +18.4% biomass yield.",
    "tags": "wiki quantum dot wavelength shifting films html lead free perovskite quantum dot wavelength shifting films for solar photonic yield optimization lead free cs3bi2br9 perovskite quantum dot gr"
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
    "title": "Rhizosphere Proton (H+) Exudation and Cation Exchange Capacity (CEC) Kinetics under NO3-/NH4+ Dosing",
    "cat": "wiki",
    "url": "wiki/rhizosphere_ph_cation_exchange_kinetics.html",
    "icon": "🧬",
    "desc": "Root plasma membrane H+-ATPase proton flux, substrate Cation Exchange Capacity (CEC), and autonomous pH stabilization via NO3-/NH4+ dosing.",
    "tags": "wiki rhizosphere ph cation exchange kinetics html rhizosphere proton h exudation and cation exchange capacity cec kinetics under no3 nh4 dosing root plasma membrane h atpase proton flux subs"
  },
  {
    "title": "Droplet Size Distribution (30-80 μm) Optimization in Aeroponic Misters for Maximum Dissolved Oxygen Absorption",
    "cat": "wiki",
    "url": "wiki/root_zone_hypoxia_aeroponic_droplet_physics.html",
    "icon": "🧬",
    "desc": "Ultrasonic aeroponic droplet size distribution (40-60 um) optimization for 5-10 um root liquid film thickness and maximal DO respiration.",
    "tags": "wiki root zone hypoxia aeroponic droplet physics html droplet size distribution 30 80 m optimization in aeroponic misters for maximum dissolved oxygen absorption ultrasonic aeroponic droplet"
  },
  {
    "title": "Plastidic Mitochondrial Coupling & Root-Zone Dissolved Oxygen (DO) Respiration Dynamics",
    "cat": "wiki",
    "url": "wiki/rootzone_dissolved_oxygen_respiration.html",
    "icon": "🧬",
    "desc": "Hydroponic root-zone dissolved oxygen (DO &gt; 9 mg/L) nanobubble dynamics, mitochondrial ATP synthase coupling, and active nitrate symport.",
    "tags": "wiki rootzone dissolved oxygen respiration html plastidic mitochondrial coupling root zone dissolved oxygen do respiration dynamics hydroponic root zone dissolved oxygen do gt 9 mg l nanobub"
  },
  {
    "title": "Elicitation Kinetics of Phenolic Antioxidants & Solanine Glycoalkaloids via UV-B Irradiance",
    "cat": "wiki",
    "url": "wiki/secondary_metabolite_elicitation_uvb.html",
    "icon": "🧬",
    "desc": "UVR8 photoreceptor activation and Phenylalanine Ammonia-Lyase (PAL, EC 4.3.1.24) elicitation kinetics under pulsed UV-B greenhouse lighting.",
    "tags": "wiki secondary metabolite elicitation uvb html elicitation kinetics of phenolic antioxidants solanine glycoalkaloids via uv b irradiance uvr8 photoreceptor activation and phenylalanine ammon"
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
    "title": "Plastidic Nitrate Reductase (NR) Activation vs Petiole Nitrate Storage under Spectral Light Steering",
    "cat": "wiki",
    "url": "wiki/statal_nitrate_accumulation_light_spectrum.html",
    "icon": "🧬",
    "desc": "Pre-harvest end-of-day blue LED activation of plastidic Nitrate Reductase (EC 1.7.1.1) reducing petiole nitrate 41.5% in hydroponic spinach.",
    "tags": "wiki statal nitrate accumulation light spectrum html plastidic nitrate reductase nr activation vs petiole nitrate storage under spectral light steering pre harvest end of day blue led activa"
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
    "title": "Boundary Layer Resistance (rb) & Micro-Vectored Canopy Air Speed Steering in Vertical Farms",
    "cat": "wiki",
    "url": "wiki/transpiration_boundary_layer_dynamics.html",
    "icon": "🧬",
    "desc": "3D CFD modeling of leaf boundary layer resistance (rb) and micro-vectored vertical airflow (0.35 m/s) for tip-burn elimination in vertical farms.",
    "tags": "wiki transpiration boundary layer dynamics html boundary layer resistance rb micro vectored canopy air speed steering in vertical farms 3d cfd modeling of leaf boundary layer resistance rb a"
  },
  {
    "title": "Micro-Climatological Telemetry Coupling with USDA Wholesale Agricultural Price Elasticity",
    "cat": "wiki",
    "url": "wiki/usda_elasticity_market_index_model.html",
    "icon": "🧬",
    "desc": "Econometric coupling of NASA POWER solar irradiance telemetry with USDA MARS wholesale price elasticity for 14-day CEA harvest steering.",
    "tags": "wiki usda elasticity market index model html micro climatological telemetry coupling with usda wholesale agricultural price elasticity econometric coupling of nasa power solar irradiance tel"
  },
  {
    "title": "Aquaporin Expression Dynamics and Root Hydraulic Conductivity (Lpr) under Micro-Climate VPD Impulse",
    "cat": "wiki",
    "url": "wiki/vapour_pressure_deficit_aquaporin_gating.html",
    "icon": "🧬",
    "desc": "PIP1/PIP2 aquaporin phosphorylation gating and root hydraulic conductivity (Lpr) stabilization under high-pressure greenhouse fogging impulses.",
    "tags": "wiki vapour pressure deficit aquaporin gating html aquaporin expression dynamics and root hydraulic conductivity lpr under micro climate vpd impulse pip1 pip2 aquaporin phosphorylation gatin"
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
          <input type="text" id="inwoo-palette-input" placeholder="Search all 361 tools, simulators, wiki, crops, climate hubs & EN/DE/JA articles..." autocomplete="off" />
          <span class="inwoo-palette-esc-badge" onclick="window.InwooPalette.close()">ESC</span>
        </div>
        <div class="inwoo-palette-tabs">
          <button class="inwoo-pal-tab active" data-cat="all">✨ All (361)</button>
          <button class="inwoo-pal-tab" data-cat="tool">🛠️ Tools (49)</button>
          <button class="inwoo-pal-tab" data-cat="article">📚 Articles (186)</button>
          <button class="inwoo-pal-tab" data-cat="wiki">🧬 Wiki (44)</button>
          <button class="inwoo-pal-tab" data-cat="climate">🌍 Climate (41)</button>
          <button class="inwoo-pal-tab" data-cat="sim">🧪 Simulators (21)</button>
          <button class="inwoo-pal-tab" data-cat="crop">🌱 Crops (11)</button>
          <button class="inwoo-pal-tab" data-cat="part">⚙️ Benchmarks & Parts (9)</button>
        </div>
        <div class="inwoo-palette-results" id="inwoo-palette-results"></div>
        <div class="inwoo-palette-footer">
          <div class="inwoo-pal-shortcuts">
            <span><kbd>↑</kbd><kbd>↓</kbd> Navigate</span>
            <span><kbd>↵</kbd> Open</span>
            <span><kbd>Esc</kbd> Close</span>
          </div>
          <div style="color: #64748b; font-size: 0.75rem;">Inwoovation Universal Spotlight (361 Indexed Pages)</div>
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

  function bootAll() {
    initPaletteModal();
    initReaderConvenienceUX();
    initWorkspacePersistenceUX();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bootAll);
  } else {
    bootAll();
  }
})();
