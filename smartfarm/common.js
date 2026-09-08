window.DIAGNOSIS_COLLECTOR_URL = "YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL";

    // Pesticide Database
    const pesticideDB = [
        {
                        nameEn: "Imidacloprid",
                        typeEn: "Insecticide (Neonicotinoid)",
            toxicity: "high",
            reiDays: 14,
                        descEn: "Highly systemic and toxic to bees. Long residual activity. Move hives out before spraying and wait at least 14 days before re-entry."
        },
        {
                        nameEn: "Thiamethoxam",
                        typeEn: "Insecticide (Neonicotinoid)",
            toxicity: "high",
            reiDays: 14,
                        descEn: "Highly toxic with strong systemic activity. Remains in nectar and pollen. Do not release bees for at least 14 days after application."
        },
        {
                        nameEn: "Clothianidin",
                        typeEn: "Insecticide (Neonicotinoid)",
            toxicity: "high",
            reiDays: 21,
                        descEn: "Extremely toxic to pollinators with long-lasting residual toxicity. Wait at least 21 days before re-entering bee colonies."
        },
        {
                        nameEn: "Acetamiprid",
                        typeEn: "Insecticide (Neonicotinoid)",
            toxicity: "medium",
            reiDays: 3,
                        descEn: "Lower toxicity compared to other neonicotinoids. Highly toxic when wet. Keep hives closed/removed for at least 3 days."
        },
        {
                        nameEn: "Spinosad",
                        typeEn: "Insecticide (Naturalyte)",
            toxicity: "high",
            reiDays: 3,
                        descEn: "Highly toxic when wet, relatively safe once dried. Apply at dusk when bees are not foraging, keep hives closed for 3 days."
        },
        {
                        nameEn: "Chlorantraniliprole",
                        typeEn: "Insecticide (Diamide)",
            toxicity: "low",
            reiDays: 1,
                        descEn: "Highly selective and safe for bees. Once the spray residues have fully dried (1 day), hives can be safely re-opened."
        },
        {
                        nameEn: "Flubendiamide",
                        typeEn: "Insecticide (Diamide)",
            toxicity: "low",
            reiDays: 1,
                        descEn: "Targeted lepidopteran control with low toxicity to non-target pollinators. Keep closed for 1 day until fully dry."
        },
        {
                        nameEn: "Bifenthrin",
                        typeEn: "Insecticide (Pyrethroid)",
            toxicity: "high",
            reiDays: 7,
                        descEn: "Broad-spectrum contact insecticide. Highly toxic to bees on contact. Do not release bees for at least 7 days post-treatment."
        },
        {
                        nameEn: "Deltamethrin",
                        typeEn: "Insecticide (Pyrethroid)",
            toxicity: "high",
            reiDays: 5,
                        descEn: "High contact toxicity and repellent effects. Keep hives securely closed and sheltered for 5 days post-spray."
        },
        {
                        nameEn: "Sulfoxaflor",
                        typeEn: "Insecticide (Sulfoximine)",
            toxicity: "high",
            reiDays: 7,
                        descEn: "Systemic aphicide with high toxicity. Residual risks persist even after drying. Restrict bee release for at least 7 days."
        },
        {
                        nameEn: "Boscalid",
                        typeEn: "Fungicide (SDHI)",
            toxicity: "low",
            reiDays: 0,
                        descEn: "Bee-safe fungicide. Hives can be opened immediately once the spray liquid dries completely."
        },
        {
                        nameEn: "Tebuconazole",
                        typeEn: "Fungicide (Triazole)",
            toxicity: "medium",
            reiDays: 1,
                        descEn: "Fungicide with suspected sublethal effects on larvae behavior. Best to keep hives closed for 1 day."
        },
        {
                        nameEn: "Azoxystrobin",
                        typeEn: "Fungicide (Strobilurin)",
            toxicity: "low",
            reiDays: 0,
                        descEn: "Broad-spectrum fungicide with minimal toxicity. Re-open hives immediately after the spray film dries."
        },
        {
                        nameEn: "Difenoconazole",
                        typeEn: "Fungicide (Triazole)",
            toxicity: "low",
            reiDays: 1,
                        descEn: "Low toxicity, but spray wetness can cause physical issues. Shelter hives for 1 day post-application."
        }
    ];

    // Symptoms-Based Diagnosis Database
    const diagnosisDB = {
        tomato: {
            leaf: [
                {
                    id: "tom_l1",
                                        symptomEn: "White powdery spots on the underside of leaves",
                                        diseaseEn: "Powdery Mildew",
                                        remedyEn: "Enhance ventilation and avoid high relative humidity. Spray bee-safe fungicides such as Boscalid or Azoxystrobin.",
                    suggestedChemical: "Boscalid"
                },
                {
                    id: "tom_l2",
                                        symptomEn: "Yellowing leaves curling upward with stunted growth",
                                        diseaseEn: "Tomato Yellow Leaf Curl Virus (TYLCV)",
                                        remedyEn: "Suppress the vector whiteflies. Spray Acetamiprid and deploy yellow sticky traps.",
                    suggestedChemical: "Acetamiprid"
                }
            ],
            fruit: [
                {
                    id: "tom_f1",
                                        symptomEn: "Sunken, black leathery spots at the bottom of the fruit",
                                        diseaseEn: "Blossom End Rot (Physiological)",
                                        remedyEn: "This is calcium deficiency, not a disease. Foliar spray 0.3% Calcium Chloride and stabilize watering intervals (check VPD).",
                    suggestedChemical: null
                }
            ]
        },
        strawberry: {
            fruit: [
                {
                    id: "str_f1",
                                        symptomEn: "Gray fuzzy mold covering fruits and blossoms",
                                        diseaseEn: "Gray Mold (Botrytis cinerea)",
                                        remedyEn: "Remove infected fruits immediately. Keep air dry and spray Difenoconazole fungicide.",
                    suggestedChemical: "Difenoconazole"
                }
            ],
            leaf: [
                {
                    id: "str_l1",
                                        symptomEn: "Fine spider webs and yellow spots on leaf undersides",
                                        diseaseEn: "Two-Spotted Spider Mite",
                                        remedyEn: "Thrives in hot, dry conditions. Spray Spinosad at night or release predatory mites.",
                    suggestedChemical: "Spinosad"
                }
            ]
        },
        blueberry: {
            fruit: [
                {
                    id: "blu_f1",
                                        symptomEn: "Soft berries with spreading concentric brown decay spots",
                                        diseaseEn: "Anthracnose Fruit Rot",
                                        remedyEn: "Spores spread fast in humid monsoons. Apply safe fungicides like Boscalid or Azoxystrobin.",
                    suggestedChemical: "Boscalid"
                }
            ],
            leaf: [
                {
                    id: "blu_l1",
                                        symptomEn: "New leaves distorting and chlorotic yellowing between veins",
                                        diseaseEn: "Iron Chlorosis (Acid Deficit)",
                                        remedyEn: "Caused by high rootzone pH (>5.0) blocking iron intake. Adjust irrigation pH to 4.5-4.8 and feed chelated iron.",
                    suggestedChemical: null
                }
            ]
        },
        melon: {
            leaf: [
                {
                    id: "mel_l1",
                                        symptomEn: "Angular light-green spots on leaves, turning yellow/brown",
                                        diseaseEn: "Downy Mildew",
                                        remedyEn: "Thrives in cold humidity. Improve drainage and spray Azoxystrobin fungicide.",
                    suggestedChemical: "Azoxystrobin"
                }
            ]
        },
        pepper: {
            leaf: [
                {
                    id: "pep_l1",
                                        symptomEn: "Young leaf margins drying out and flower buds dropping",
                                        diseaseEn: "Thrips / TSWV Virus",
                                        remedyEn: "Thrips vector must be controlled. Spray Spinosad or other thrip insecticides.",
                    suggestedChemical: "Spinosad"
                }
            ]
        }
    };

    // Vertical Crops presets
    const verticalCrops = {
        greens: { name: "Leafy Greens", dli: 16.0, photoperiod: 18.0 },
        strawberry: { name: "Strawberries", dli: 22.0, photoperiod: 16.0 },
        herbs: { name: "Medicinal Herbs", dli: 12.0, photoperiod: 12.0 }
    };

    const i18n = {
    ko: {
        headerTitle: "Smart Farm Engineering Lab",
            headerDesc: "High-precision online simulation & modeling suite designed for modern greenhouse designers, growers, and agricultural engineers.",
            tabVpdDeskt: "Vapor Pressure Deficit (VPD)",
            tabVpdMobil: "VPD",
            tabValveDeskt: "Heating Mixing Valve",
            tabValveMobil: "Mixing Valve",
            tabFertDeskt: "Stock Tank Fertigation",
            tabFertMobil: "Fertigation",
            tabHeatLossDeskt: "Greenhouse Heat Loss",
            tabHeatLossMobil: "Heat Loss",
            tabRoiDeskt: "Boiler vs Heat Pump ROI",
            tabRoiMobil: "Heating ROI",
            tabTranspirationDeskt: "Plant Transpiration (PM)",
            tabTranspirationMobil: "Transpiration (PM)",
            tabPollinatorDeskt: "🐝 Crop Diagnosis & Bees",
            tabPollinatorMobil: "🐝 Pest/Bees",
            tabVerticalDeskt: "🌱 Vertical Farming DLI",
            tabVerticalMobil: "🌱 Vertical DLI",
            vpdTitle: "Environmental Data",
            stageSeedling: "Seedling/Clone",
            stageVeg: "Vegetative",
            stageFlower: "Flower/Fruit",
            lblAirTemp: "Air Temperature",
            lblRhAir: "Relative Humidity",
            lblOffsetLeaf: "Leaf Temp Offset (vs. Air)",
            resVpdHeader: "Leaf-to-Air VPD",
            tipTitle: "Horticulture Tip",
            valveTitle: "Hydraulic Profile",
            lblHeatPower: "Heat Demand / Heat Load",
            lblValveDt: "Design Temp Drop (ΔT)",
            lblValveDp: "Target Valve Pressure Drop (ΔPv)",
            resValveHeader: "Required Valve Coefficient",
            fertTitle: "Stock Tank Parameter",
            lblFertTarget: "Target Element Concentration",
            lblFertVol: "Stock Tank Volume",
            lblFertRatio: "Dilution Injection Ratio (1:X)",
            lblFertPurity: "Element Purity in Fertilizer",
            resFertHeader: "Fertilizer Mass Required",
            fertSafetyTitle: "Stock Tank Safety Rule",
            fertSafetyDesc: "Calcium Nitrate and Phosphate/Sulfate-based fertilizers must be separated into tank A and B to prevent chemical precipitation and clogging.",
            vpdTipSeedling: "During propagation and seedling stage, a lower VPD (0.4-0.8 kPa) prevents soft cells from dehydrating before roots fully develop.",
            vpdTipVeg: "Vegetative stage demands a moderate VPD (0.8-1.1 kPa) to ensure ideal stomatal conductance and healthy cell expansion.",
            vpdTipFlower: "In flowering or fruiting stages, high VPD (1.1-1.5 kPa) pulls calcium and other structural minerals efficiently into the blooms to prevent bud rot.",
            vpdExplanationLow: "Below optimal range ({minOpt}-{maxOpt} kPa). Evaporation is stagnant. Plants are at high risk of calcium deficiency (tipburn) and fungal outbreaks.",
            vpdExplanationOpt: "Perfect climate envelope for your stage ({minOpt}-{maxOpt} kPa). Photosynthetic assimilation rate is maximized.",
            vpdExplanationHigh: "Above optimal range ({minOpt}-{maxOpt} kPa). High evaporation rate. Stomata will close to prevent dehydration, stunting photosynthesis.",
            valveStatusPill: "Ready for Sizing",
            valveExplanation: "For a flow rate of <strong>{flowRate} m³/h</strong>, a mixing valve with Kv <strong>{kv}</strong> is required.",
            pipeRecommendationTitle: "DN Size & Pipe Recommendation",
            pipeRecommendationDesc: "Based on water flow, a <strong>{dn}</strong> pipe is recommended to keep water velocity within the safe 0.5 to 1.0 m/s range. To maintain control authority (with 25% authority margin), it is highly recommended to select a standard commercial valve with <strong>Kvs {kvsMargin}</strong>.",
            fertStatusPill: "Ready to Dissolve",
            fertExplanation: "Dissolve exactly <strong>{mass} kg</strong> of fertilizer into the {tankVolume}L stock tank. When your injector draws at a 1:{dilution} ratio, the irrigation emitter delivers a precise {targetPpm} ppm of the target nutrient.",
            disclaimer: "<strong>Disclaimer:</strong> The simulations provided by this tool are for educational and informational purposes only. Inwoovation is not liable for any crop damage, equipment failure, or financial loss resulting from the use of these simulators. Always double-check simulation results and consult certified professionals before applying changes to commercial greenhouses.",
            
            // Heat Loss
            heatLossTitle: "Structure & Climate Data",
            lblEstAreaNew: "Cover Surface Area (A)",
            lblUValue: "Heat Transfer Coeff (U-value)",
            lblTempIn: "Target Indoor Temp (Ti)",
            lblTempOut: "Design Outdoor Temp (To)",
            lblWindSpeed: "Outdoor Wind Speed",
            resHeatLossHeader: "Required Heating Capacity",
            heatLossExplanation: "At outdoor <strong>{tempOut}°C</strong> and indoor <strong>{tempIn}°C</strong>, with a wind speed modifier of <strong>{fWind}</strong>, the total greenhouse heat loss is <strong>{heatLoss} kW</strong> ({btuVal} BTU/h).",
            heatLossStatusPill: "Heat Loss Calculated",
            lblHeatLossPreset: "Cover Material U-Value Preset",
            
            // ROI
            roiTitle: "Energy Price & Equipment Specs",
            lblAnnualDemand: "Annual Heating Demand",
            lblBoilerType: "Existing Boiler Fuel Type",
            lblBoilerFuelPrice: "Existing Fuel Price",
            lblBoilerEff: "Boiler Efficiency",
            lblHpCop: "Heat Pump Average COP",
            lblHpElecPrice: "Agricultural Electricity Price",
            lblHpCapex: "Additional HP Investment (CapEx)",
            resRoiHeader: "Annual Savings & Payback",
            roiExplanation: "For an annual heating demand of <strong>{demand} kWh</strong>, the heat pump saves approximately <strong>{savings}</strong> per year compared to the boiler. The payback period is around <strong>{payback} years</strong>.",
            roiStatusPill: "ROI Analysis Complete",
            lblCurrency: "Base Currency Setting",
            
            // Transpiration
            transTitle: "Microclimate & Canopy Data",
            lblTransTemp: "Greenhouse Temp",
            lblTransRh: "Greenhouse RH",
            lblTransRad: "Greenhouse Solar Rad (Rg)",
            lblTransLai: "Leaf Area Index (LAI)",
            lblTransCrop: "Cultivated Crop Type",
            lblTransWind: "Greenhouse Wind Speed (u)",
            resTransHeader: "Hourly Transpiration Rate (ET)",
            transExplanation: "At {temp}°C, {rh}% RH, and {rad} W/m² internal radiation, the crop transpiration rate is approx <strong>{et} L/m²·hr</strong> (mm/hr). The predicted daily water loss (10-hr light sum) is <strong>{etDay} L/m²·day</strong>.",
            transStatusPill: "Transpiration Calculated",
            promoTitle: "🚀 Optimize Your Greenhouse Operations Further",
            promoDesc: "Download our professional 'Smart Farm Operator OS' Notion Template & Engineering Excel Packages containing sensor calibration schedules, fertigation formulas, and crop logs.",
            btnPromoMain: "Get Notion OS ($19.99)",
            btnPromoSub: "Get Excel Package ($29.00)",

            // Pollinators & Diagnosis (EN)
            tabDiagnosis: "Pest & Disease Diagnosis",
            tabPesticide: "Pesticide REI Diagnosis",
            tabDensity: "Optimal Density Math",
            tabActivity: "Foraging Simulator",
            lblDiagInputTitle: "Symptom Scouting Variables",
            lblSelectCrop: "Select Crop",
            lblSelectPart: "Affected Plant Part",
            lblSelectSymptom: "Scouted Symptom details",
            lblDiagResultTitle: "Diagnostic & Remedial Report",
            lblDiagDisease: "Suspected Disease/Pest",
            lblDiagRemedy: "Remedial Agronomic Guide",
            lblDiagChemical: "Recommended Active Ingredient",
            btnGoToRei: "👉 Calculate Bee Re-entry Interval (REI) for this Chemical",
            btnPdfReport: "📄 PDF 진단 리포트 다운로드 (이메일 없음)",
            msgDiagNoSearch: "Select a crop, part, and symptoms to view real-time diagnosis.",
            msgDiagNoSymptom: "No symptoms registered for the selected plant part. Try selecting another plant part.",
            lblSelectPlaceholder: "-- Select Option --",
            partLeaf: "Leaves",
            partFruit: "Fruits",
            partStemRoot: "Stems/Roots",
            lblPestInputTitle: "Pesticide Database Search",
            lblPestSearch: "Enter Active Ingredient (e.g., Imidacloprid, Boscalid)",
            lblPestResultTitle: "Bee Safety Diagnosis Result",
            lblPestTox: "Bee Toxicity Level",
            lblPestRei: "Safe Re-entry Interval",
            lblPestAction: "SOP Hive Action Guidelines",
            msgPestNoSearch: "Search for a chemical ingredient above to retrieve security protocols.",
            msgPestNotFound: "Ingredient not found in local database. Please refer to toxicity warnings on the product packaging.",
            reiUnit: "Days",
            txtHigh: "Highly Toxic (Red Warning)",
            txtMedium: "Moderately Toxic (Yellow Warning)",
            txtLow: "Relatively Bee-Safe (Green)",
            lblDensityInputTitle: "Greenhouse Metrics",
            lblCropType: "Target Crop Category",
            lblArea: "Crop Area (㎡)",
            lblSeason: "Deployment Season",
            lblDensityResultTitle: "Recommended Stocking",
            lblRequiredHives: "Recommended Hive Count",
            lblExpectedLifespan: "Expected Hive Lifespan",
            lblDensityDesc: "Placement Guidelines",
            optTomato: "Tomatoes (Buzz Pollination Required)",
            optStrawberry: "Strawberries (Deformity Prevention, Check Over-visitation)",
            optMelon: "Melons/Watermelons (Pollen rich, requires sugar syrup)",
            optBlueberry: "Blueberries (Bell-shaped bloom expert)",
            optPepper: "Peppers / Paprikas (Self-pollinating boost)",
            optSpringAutumn: "Spring / Autumn (Standard Temp)",
            optSummer: "Summer (Heat mitigation required)",
            optWinter: "Winter (Insulation required)",
            densityCalculationText: "For a growing area of <strong>{area} m²</strong> (approx. <strong>{pyeong} pyeong</strong>), the optimal amount for <strong>{crop}</strong> is <strong>{hives} colonies</strong>.<br><span style='font-size: 0.8rem; color: var(--text-gray);'>* Based on standard commercial hive units with approx. 100-120 workers.</span>",
            densityGuidelineTomato: "Tomato blossoms are nectar-less and rely on buzz pollination. Inspect blossoms for brown 'bite marks' left by bumblebees to gauge pollination rate.",
            densityGuidelineStrawberry: "Strawberries are prone to seed deformation if flowers are over-visited and physically damaged. Restrict bee exits to half-days if bite marks are excessive.",
            densityGuidelineMelon: "Melons have rich pollen but short flowering cycles. Rapid deployment is crucial. Keep checking sugar solution levels inside the hives.",
            densityGuidelineBlueberry: "Blueberry bells are too deep for standard honeybees. Long-tongue bumblebees are far more efficient. Introduce hives at 5% bloom.",
            densityGuidelinePepper: "Paprikas are mostly self-pollinating, but bumblebee visitation increases fruit sizing, wall thickness, and decreases blossom drops.",
            lblActInputTitle: "Temperature Simulator",
            lblMaxTemp: "Forecasted Max Greenhouse Temp (℃)",
            lblMinTemp: "Forecasted Min Greenhouse Temp (℃)",
            lblActResultTitle: "Estimated Foraging Score",
            lblActStatus: "Foraging Activity Level",
            lblActGuide: "Microclimate Control Guide",
            actScoreText: "The estimated bumblebee activity index for today is <strong>{score} / 100 points</strong>.",
            actStatusOpt: "Active Foraging",
            actStatusRestricted: "Foraging Restricted",
            actStatusDanger: "Inactive / Severe Heat Stress",
            actGuideOpt: "Greenhouse temperature is in the sweet spot (15-25°C). Bees will actively forage. Keep pathways clear and ensure direct sunlight does not heat the hive structure.",
            actGuideCold: "Minimum temperature is low, which freezes early morning foraging. Wrap hives in insulation wraps (e.g., styrofoam), and pull thermal screens to maintain above 10°C.",
            actGuideHot: "Greenhouse temperature exceeds 30°C. Bumblebees are extremely sensitive to heat. They will prioritize fanning the hive with water rather than pollinating. Deploy shading screens and fogging.",

            // Vertical Farming (EN)
            lblLightTitle: "Photosynthetic Photon Flux & DLI Optimizer",
            lblCropSelect: "Target Plant Profile",
            optGreens: "Leafy Greens (Target DLI: 16 mol)",
            optStrawberryVert: "Strawberries (Target DLI: 22 mol)",
            optHerbs: "Medicinal Herbs & Basil (Target DLI: 12 mol)",
            optCustom: "Custom (User-Defined DLI)",
            lblTargetDli: "Target DLI (mol/m²/day)",
            lblMeasuredPpfd: "Measured PPFD (μmol/m²/s)",
            lblSliderRed: "Deep Red (660 nm)",
            lblSliderBlue: "Deep Blue (450 nm)",
            lblSliderGreen: "Green/White (550 nm)",
            lblSliderFar: "Far-Red (730 nm)",
            lblDliOutputTitle: "Calculated DLI Output",
            lblOptPhotoperiodTitle: "Optimal Photoperiod",
            lblSpectralEnergyTitle: "Spectral Energy Distribution",
            lblThColor: "Color Band",
            lblThPct: "Percentage (%)",
            lblThFlux: "Estimated Flux (PPFD)",
            lblTblRed: "● Red (660nm)",
            lblTblBlue: "● Blue (450nm)",
            lblTblGreen: "● Green (550nm)",
            lblTblFar: "● Far-Red (730nm)",
            dliUnit: "mol/m²/d",
            hoursUnit: "Hours",
            ppfdTooLow: "<span style='color: var(--danger); font-weight: 600;'>PPFD TOO LOW!</span> Photoperiod maximized to 24 hours. Increase LED intensity or lower mounting height.",
            lightHoursDesc: "Daily run-time required to reach target crop DLI thresholds.",
            lblThermalTitle: "LED Module Thermal & Operational Cost Modeler",
            lblLedPowerLabel: "LED Bar Power P_elec (W)",
            lblLedBarsLabel: "Quantity of LED Bars (N)",
            lblOptEfficiencyLabel: "Optical Efficiency (η_opt)",
            lblHeatsinkAreaLabel: "Heatsink Surface Area per bar (cm²)",
            lblConvectiveHLabel: "Heat Transfer Coeff (h, W/m²K)",
            lblElecRateLabel: "Electricity Rate",
            lblThermalTjTitle: "LED Junction Temperature (T_j)",
            lblThermalCostTitle: "Monthly Racking OPEX",
            lblThermalChartTitle: "Energy Cost Split by Operating Photoperiod",
            tjTooHigh: "<span style='color: var(--danger); font-weight:600;'>⚠️ TJ TOO HIGH!</span> Accelerated lumen decay. Improve heatsink area.",
            tjDesc: "Junction point safety: thermal degradation boundary safe (< 85°C).",
            monthlyUnit: "/ Month",
            opexDesc: "Operational lighting energy expenditure forecast."
    },
    en: {
        headerTitle: "Smart Farm Engineering Lab",
            headerDesc: "High-precision online simulation & modeling suite designed for modern greenhouse designers, growers, and agricultural engineers.",
            tabVpdDeskt: "Vapor Pressure Deficit (VPD)",
            tabVpdMobil: "VPD",
            tabValveDeskt: "Heating Mixing Valve",
            tabValveMobil: "Mixing Valve",
            tabFertDeskt: "Stock Tank Fertigation",
            tabFertMobil: "Fertigation",
            tabHeatLossDeskt: "Greenhouse Heat Loss",
            tabHeatLossMobil: "Heat Loss",
            tabRoiDeskt: "Boiler vs Heat Pump ROI",
            tabRoiMobil: "Heating ROI",
            tabTranspirationDeskt: "Plant Transpiration (PM)",
            tabTranspirationMobil: "Transpiration (PM)",
            tabPollinatorDeskt: "🐝 Crop Diagnosis & Bees",
            tabPollinatorMobil: "🐝 Pest/Bees",
            tabVerticalDeskt: "🌱 Vertical Farming DLI",
            tabVerticalMobil: "🌱 Vertical DLI",
            vpdTitle: "Environmental Data",
            stageSeedling: "Seedling/Clone",
            stageVeg: "Vegetative",
            stageFlower: "Flower/Fruit",
            lblAirTemp: "Air Temperature",
            lblRhAir: "Relative Humidity",
            lblOffsetLeaf: "Leaf Temp Offset (vs. Air)",
            resVpdHeader: "Leaf-to-Air VPD",
            tipTitle: "Horticulture Tip",
            valveTitle: "Hydraulic Profile",
            lblHeatPower: "Heat Demand / Heat Load",
            lblValveDt: "Design Temp Drop (ΔT)",
            lblValveDp: "Target Valve Pressure Drop (ΔPv)",
            resValveHeader: "Required Valve Coefficient",
            fertTitle: "Stock Tank Parameter",
            lblFertTarget: "Target Element Concentration",
            lblFertVol: "Stock Tank Volume",
            lblFertRatio: "Dilution Injection Ratio (1:X)",
            lblFertPurity: "Element Purity in Fertilizer",
            resFertHeader: "Fertilizer Mass Required",
            fertSafetyTitle: "Stock Tank Safety Rule",
            fertSafetyDesc: "Calcium Nitrate and Phosphate/Sulfate-based fertilizers must be separated into tank A and B to prevent chemical precipitation and clogging.",
            vpdTipSeedling: "During propagation and seedling stage, a lower VPD (0.4-0.8 kPa) prevents soft cells from dehydrating before roots fully develop.",
            vpdTipVeg: "Vegetative stage demands a moderate VPD (0.8-1.1 kPa) to ensure ideal stomatal conductance and healthy cell expansion.",
            vpdTipFlower: "In flowering or fruiting stages, high VPD (1.1-1.5 kPa) pulls calcium and other structural minerals efficiently into the blooms to prevent bud rot.",
            vpdExplanationLow: "Below optimal range ({minOpt}-{maxOpt} kPa). Evaporation is stagnant. Plants are at high risk of calcium deficiency (tipburn) and fungal outbreaks.",
            vpdExplanationOpt: "Perfect climate envelope for your stage ({minOpt}-{maxOpt} kPa). Photosynthetic assimilation rate is maximized.",
            vpdExplanationHigh: "Above optimal range ({minOpt}-{maxOpt} kPa). High evaporation rate. Stomata will close to prevent dehydration, stunting photosynthesis.",
            valveStatusPill: "Ready for Sizing",
            valveExplanation: "For a flow rate of <strong>{flowRate} m³/h</strong>, a mixing valve with Kv <strong>{kv}</strong> is required.",
            pipeRecommendationTitle: "DN Size & Pipe Recommendation",
            pipeRecommendationDesc: "Based on water flow, a <strong>{dn}</strong> pipe is recommended to keep water velocity within the safe 0.5 to 1.0 m/s range. To maintain control authority (with 25% authority margin), it is highly recommended to select a standard commercial valve with <strong>Kvs {kvsMargin}</strong>.",
            fertStatusPill: "Ready to Dissolve",
            fertExplanation: "Dissolve exactly <strong>{mass} kg</strong> of fertilizer into the {tankVolume}L stock tank. When your injector draws at a 1:{dilution} ratio, the irrigation emitter delivers a precise {targetPpm} ppm of the target nutrient.",
            disclaimer: "<strong>Disclaimer:</strong> The simulations provided by this tool are for educational and informational purposes only. Inwoovation is not liable for any crop damage, equipment failure, or financial loss resulting from the use of these simulators. Always double-check simulation results and consult certified professionals before applying changes to commercial greenhouses.",
            
            // Heat Loss
            heatLossTitle: "Structure & Climate Data",
            lblEstAreaNew: "Cover Surface Area (A)",
            lblUValue: "Heat Transfer Coeff (U-value)",
            lblTempIn: "Target Indoor Temp (Ti)",
            lblTempOut: "Design Outdoor Temp (To)",
            lblWindSpeed: "Outdoor Wind Speed",
            resHeatLossHeader: "Required Heating Capacity",
            heatLossExplanation: "At outdoor <strong>{tempOut}°C</strong> and indoor <strong>{tempIn}°C</strong>, with a wind speed modifier of <strong>{fWind}</strong>, the total greenhouse heat loss is <strong>{heatLoss} kW</strong> ({btuVal} BTU/h).",
            heatLossStatusPill: "Heat Loss Calculated",
            lblHeatLossPreset: "Cover Material U-Value Preset",
            
            // ROI
            roiTitle: "Energy Price & Equipment Specs",
            lblAnnualDemand: "Annual Heating Demand",
            lblBoilerType: "Existing Boiler Fuel Type",
            lblBoilerFuelPrice: "Existing Fuel Price",
            lblBoilerEff: "Boiler Efficiency",
            lblHpCop: "Heat Pump Average COP",
            lblHpElecPrice: "Agricultural Electricity Price",
            lblHpCapex: "Additional HP Investment (CapEx)",
            resRoiHeader: "Annual Savings & Payback",
            roiExplanation: "For an annual heating demand of <strong>{demand} kWh</strong>, the heat pump saves approximately <strong>{savings}</strong> per year compared to the boiler. The payback period is around <strong>{payback} years</strong>.",
            roiStatusPill: "ROI Analysis Complete",
            lblCurrency: "Base Currency Setting",
            
            // Transpiration
            transTitle: "Microclimate & Canopy Data",
            lblTransTemp: "Greenhouse Temp",
            lblTransRh: "Greenhouse RH",
            lblTransRad: "Greenhouse Solar Rad (Rg)",
            lblTransLai: "Leaf Area Index (LAI)",
            lblTransCrop: "Cultivated Crop Type",
            lblTransWind: "Greenhouse Wind Speed (u)",
            resTransHeader: "Hourly Transpiration Rate (ET)",
            transExplanation: "At {temp}°C, {rh}% RH, and {rad} W/m² internal radiation, the crop transpiration rate is approx <strong>{et} L/m²·hr</strong> (mm/hr). The predicted daily water loss (10-hr light sum) is <strong>{etDay} L/m²·day</strong>.",
            transStatusPill: "Transpiration Calculated",
            promoTitle: "🚀 Optimize Your Greenhouse Operations Further",
            promoDesc: "Download our professional 'Smart Farm Operator OS' Notion Template & Engineering Excel Packages containing sensor calibration schedules, fertigation formulas, and crop logs.",
            btnPromoMain: "Get Notion OS ($19.99)",
            btnPromoSub: "Get Excel Package ($29.00)",

            // Pollinators & Diagnosis (EN)
            tabDiagnosis: "Pest & Disease Diagnosis",
            tabPesticide: "Pesticide REI Diagnosis",
            tabDensity: "Optimal Density Math",
            tabActivity: "Foraging Simulator",
            lblDiagInputTitle: "Symptom Scouting Variables",
            lblSelectCrop: "Select Crop",
            lblSelectPart: "Affected Plant Part",
            lblSelectSymptom: "Scouted Symptom details",
            lblDiagResultTitle: "Diagnostic & Remedial Report",
            lblDiagDisease: "Suspected Disease/Pest",
            lblDiagRemedy: "Remedial Agronomic Guide",
            lblDiagChemical: "Recommended Active Ingredient",
            btnGoToRei: "👉 Calculate Bee Re-entry Interval (REI) for this Chemical",
            btnPdfReport: "📄 Download PDF Diagnosis Report (No Email)",
            msgDiagNoSearch: "Select a crop, part, and symptoms to view real-time diagnosis.",
            msgDiagNoSymptom: "No symptoms registered for the selected plant part. Try selecting another plant part.",
            lblSelectPlaceholder: "-- Select Option --",
            partLeaf: "Leaves",
            partFruit: "Fruits",
            partStemRoot: "Stems/Roots",
            lblPestInputTitle: "Pesticide Database Search",
            lblPestSearch: "Enter Active Ingredient (e.g., Imidacloprid, Boscalid)",
            lblPestResultTitle: "Bee Safety Diagnosis Result",
            lblPestTox: "Bee Toxicity Level",
            lblPestRei: "Safe Re-entry Interval",
            lblPestAction: "SOP Hive Action Guidelines",
            msgPestNoSearch: "Search for a chemical ingredient above to retrieve security protocols.",
            msgPestNotFound: "Ingredient not found in local database. Please refer to toxicity warnings on the product packaging.",
            reiUnit: "Days",
            txtHigh: "Highly Toxic (Red Warning)",
            txtMedium: "Moderately Toxic (Yellow Warning)",
            txtLow: "Relatively Bee-Safe (Green)",
            lblDensityInputTitle: "Greenhouse Metrics",
            lblCropType: "Target Crop Category",
            lblArea: "Crop Area (㎡)",
            lblSeason: "Deployment Season",
            lblDensityResultTitle: "Recommended Stocking",
            lblRequiredHives: "Recommended Hive Count",
            lblExpectedLifespan: "Expected Hive Lifespan",
            lblDensityDesc: "Placement Guidelines",
            optTomato: "Tomatoes (Buzz Pollination Required)",
            optStrawberry: "Strawberries (Deformity Prevention, Check Over-visitation)",
            optMelon: "Melons/Watermelons (Pollen rich, requires sugar syrup)",
            optBlueberry: "Blueberries (Bell-shaped bloom expert)",
            optPepper: "Peppers / Paprikas (Self-pollinating boost)",
            optSpringAutumn: "Spring / Autumn (Standard Temp)",
            optSummer: "Summer (Heat mitigation required)",
            optWinter: "Winter (Insulation required)",
            densityCalculationText: "For a growing area of <strong>{area} m²</strong> (approx. <strong>{pyeong} pyeong</strong>), the optimal amount for <strong>{crop}</strong> is <strong>{hives} colonies</strong>.<br><span style='font-size: 0.8rem; color: var(--text-gray);'>* Based on standard commercial hive units with approx. 100-120 workers.</span>",
            densityGuidelineTomato: "Tomato blossoms are nectar-less and rely on buzz pollination. Inspect blossoms for brown 'bite marks' left by bumblebees to gauge pollination rate.",
            densityGuidelineStrawberry: "Strawberries are prone to seed deformation if flowers are over-visited and physically damaged. Restrict bee exits to half-days if bite marks are excessive.",
            densityGuidelineMelon: "Melons have rich pollen but short flowering cycles. Rapid deployment is crucial. Keep checking sugar solution levels inside the hives.",
            densityGuidelineBlueberry: "Blueberry bells are too deep for standard honeybees. Long-tongue bumblebees are far more efficient. Introduce hives at 5% bloom.",
            densityGuidelinePepper: "Paprikas are mostly self-pollinating, but bumblebee visitation increases fruit sizing, wall thickness, and decreases blossom drops.",
            lblActInputTitle: "Temperature Simulator",
            lblMaxTemp: "Forecasted Max Greenhouse Temp (℃)",
            lblMinTemp: "Forecasted Min Greenhouse Temp (℃)",
            lblActResultTitle: "Estimated Foraging Score",
            lblActStatus: "Foraging Activity Level",
            lblActGuide: "Microclimate Control Guide",
            actScoreText: "The estimated bumblebee activity index for today is <strong>{score} / 100 points</strong>.",
            actStatusOpt: "Active Foraging",
            actStatusRestricted: "Foraging Restricted",
            actStatusDanger: "Inactive / Severe Heat Stress",
            actGuideOpt: "Greenhouse temperature is in the sweet spot (15-25°C). Bees will actively forage. Keep pathways clear and ensure direct sunlight does not heat the hive structure.",
            actGuideCold: "Minimum temperature is low, which freezes early morning foraging. Wrap hives in insulation wraps (e.g., styrofoam), and pull thermal screens to maintain above 10°C.",
            actGuideHot: "Greenhouse temperature exceeds 30°C. Bumblebees are extremely sensitive to heat. They will prioritize fanning the hive with water rather than pollinating. Deploy shading screens and fogging.",

            // Vertical Farming (EN)
            lblLightTitle: "Photosynthetic Photon Flux & DLI Optimizer",
            lblCropSelect: "Target Plant Profile",
            optGreens: "Leafy Greens (Target DLI: 16 mol)",
            optStrawberryVert: "Strawberries (Target DLI: 22 mol)",
            optHerbs: "Medicinal Herbs & Basil (Target DLI: 12 mol)",
            optCustom: "Custom (User-Defined DLI)",
            lblTargetDli: "Target DLI (mol/m²/day)",
            lblMeasuredPpfd: "Measured PPFD (μmol/m²/s)",
            lblSliderRed: "Deep Red (660 nm)",
            lblSliderBlue: "Deep Blue (450 nm)",
            lblSliderGreen: "Green/White (550 nm)",
            lblSliderFar: "Far-Red (730 nm)",
            lblDliOutputTitle: "Calculated DLI Output",
            lblOptPhotoperiodTitle: "Optimal Photoperiod",
            lblSpectralEnergyTitle: "Spectral Energy Distribution",
            lblThColor: "Color Band",
            lblThPct: "Percentage (%)",
            lblThFlux: "Estimated Flux (PPFD)",
            lblTblRed: "● Red (660nm)",
            lblTblBlue: "● Blue (450nm)",
            lblTblGreen: "● Green (550nm)",
            lblTblFar: "● Far-Red (730nm)",
            dliUnit: "mol/m²/d",
            hoursUnit: "Hours",
            ppfdTooLow: "<span style='color: var(--danger); font-weight: 600;'>PPFD TOO LOW!</span> Photoperiod maximized to 24 hours. Increase LED intensity or lower mounting height.",
            lightHoursDesc: "Daily run-time required to reach target crop DLI thresholds.",
            lblThermalTitle: "LED Module Thermal & Operational Cost Modeler",
            lblLedPowerLabel: "LED Bar Power P_elec (W)",
            lblLedBarsLabel: "Quantity of LED Bars (N)",
            lblOptEfficiencyLabel: "Optical Efficiency (η_opt)",
            lblHeatsinkAreaLabel: "Heatsink Surface Area per bar (cm²)",
            lblConvectiveHLabel: "Heat Transfer Coeff (h, W/m²K)",
            lblElecRateLabel: "Electricity Rate",
            lblThermalTjTitle: "LED Junction Temperature (T_j)",
            lblThermalCostTitle: "Monthly Racking OPEX",
            lblThermalChartTitle: "Energy Cost Split by Operating Photoperiod",
            tjTooHigh: "<span style='color: var(--danger); font-weight:600;'>⚠️ TJ TOO HIGH!</span> Accelerated lumen decay. Improve heatsink area.",
            tjDesc: "Junction point safety: thermal degradation boundary safe (< 85°C).",
            monthlyUnit: "/ Month",
            opexDesc: "Operational lighting energy expenditure forecast."
    }
};;

    let currentLang = 'en';
    let currentUnit = localStorage.getItem('smartfarm_unit') || 'metric';
    let currentCategory = 'all';
    let isBetaMode = false;

    // Real-time search and category filtering engine
    function filterCategory(category) {
        const dashboardSec = document.getElementById('section-dashboard');
        
        // If we're on a sub-page (no dashboard section), redirect to index.html with category
        if (!dashboardSec) {
            const prefix = window.location.protocol.startsWith('http') ? '/' : 'index.html';
            window.location.href = prefix + '?cat=' + category;
            return;
        }
        
        // If dashboard exists but isn't active, switch to it
        if (!dashboardSec.classList.contains('active')) {
            switchTab('dashboard');
        }

        currentCategory = category;
        document.querySelectorAll('.category-chips .chip').forEach(chip => {
            chip.classList.remove('active');
        });
        
        if (category === 'all') document.getElementById('chip-all').classList.add('active');
        else if (category === 'climate') document.getElementById('chip-climate').classList.add('active');
        else if (category === 'facility') document.getElementById('chip-facility').classList.add('active');
        else if (category === 'fertigation') document.getElementById('chip-fertigation').classList.add('active');
        else if (category === 'beta') document.getElementById('chip-beta').classList.add('active');
        
        applyFilters();
    }

    function filterSimulators() {
        applyFilters();
    }

    let currentDropdownIndex = -1;

    function applyFilters() {
        const query = document.getElementById('sim-search').value.toLowerCase().trim();
        const tabButtons = document.querySelectorAll('.tabs .tab-btn');
        const dashboardCards = document.querySelectorAll('.dashboard-card');
        
        let dropdownResults = [];

        tabButtons.forEach(btn => {
            if (btn.id === 'btn-tab-dashboard') return; // Dashboard home button is always visible
            const btnCategory = btn.getAttribute('data-category');
            const btnKeywords = btn.getAttribute('data-keywords') ? btn.getAttribute('data-keywords').toLowerCase() : '';
            const btnText = btn.textContent.toLowerCase();
            
            const matchesCategory = (currentCategory === 'all' || btnCategory === currentCategory);
            const matchesQuery = (query === '' || btnKeywords.includes(query) || btnText.includes(query));
            
            const isBetaTab = btn.classList.contains('beta-only-tab');
            const allowedBeta = !isBetaTab || isBetaMode;
            
            if (matchesCategory && matchesQuery && allowedBeta) {
                btn.classList.remove('hide');
                if (query !== '') {
                    dropdownResults.push({
                        text: btn.querySelector('.desktop-text') ? btn.querySelector('.desktop-text').textContent.trim() : btn.textContent.trim(),
                        href: btn.getAttribute('href')
                    });
                }
            } else {
                btn.classList.add('hide');
            }
        });

        // Dashboard cards filtering with smooth animation
        dashboardCards.forEach(card => {
            const cardCategory = card.getAttribute('data-category');
            const cardKeywords = card.getAttribute('data-keywords') ? card.getAttribute('data-keywords').toLowerCase() : '';
            const cardText = card.textContent.toLowerCase();
            
            const matchesCategory = (currentCategory === 'all' || cardCategory === currentCategory);
            const matchesQuery = (query === '' || cardKeywords.includes(query) || cardText.includes(query));
            
            const isBetaCard = card.classList.contains('beta-only-tab');
            const allowedBeta = !isBetaCard || isBetaMode;
            
            if (matchesCategory && matchesQuery && allowedBeta) {
                card.style.display = 'flex';
                card.style.animation = 'fadeInCard 0.3s ease forwards';
            } else {
                card.style.display = 'none';
            }
        });
        
        updateSearchDropdown(query, dropdownResults);
    }

    function updateSearchDropdown(query, results) {
        let dropdown = document.getElementById('search-dropdown');
        if (!dropdown) {
            const searchWrapper = document.querySelector('.search-box-wrapper');
            if (searchWrapper) {
                dropdown = document.createElement('div');
                dropdown.id = 'search-dropdown';
                dropdown.className = 'search-dropdown';
                searchWrapper.appendChild(dropdown);
            } else {
                return;
            }
        }

        if (query === '') {
            dropdown.classList.remove('active');
            return;
        }

        dropdown.innerHTML = '';
        currentDropdownIndex = -1;

        if (results.length === 0) {
            const emptyItem = document.createElement('div');
            emptyItem.className = 'search-dropdown-empty';
            emptyItem.textContent = 'No simulators found matching your query.';
            dropdown.appendChild(emptyItem);
        } else {
            results.forEach((item, index) => {
                const a = document.createElement('a');
                a.className = 'search-dropdown-item';
                a.href = item.href;
                a.textContent = item.text;
                a.setAttribute('data-index', index);
                
                a.addEventListener('mouseenter', () => {
                    currentDropdownIndex = index;
                    updateDropdownHighlight();
                });

                dropdown.appendChild(a);
            });
        }
        dropdown.classList.add('active');
    }

    function updateDropdownHighlight() {
        const items = document.querySelectorAll('.search-dropdown-item');
        items.forEach((item, index) => {
            if (index === currentDropdownIndex) {
                item.classList.add('focused');
            } else {
                item.classList.remove('focused');
            }
        });
    }

    function checkBetaMode() {
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.get('mode') === 'beta' || urlParams.get('dev') === 'true') {
            isBetaMode = true;
            document.querySelectorAll('.beta-only-tab').forEach(tab => {
                tab.style.display = 'inline-block';
            });
            const betaChip = document.getElementById('chip-beta');
            if (betaChip) betaChip.style.display = 'inline-block';
        }
    }

    document.addEventListener('DOMContentLoaded', () => {
        // Setup Market Index tab to link directly to market.html instead of inline script
        const btnTabMarket = document.getElementById('btn-tab-market');
        if (btnTabMarket) {
            btnTabMarket.setAttribute('href', 'market.html');
            btnTabMarket.removeAttribute('onclick');
        }

        // Dynamic link rewriter: rewrite index.html links to "/" on HTTP/HTTPS protocol
        if (window.location.protocol.startsWith('http')) {
            document.querySelectorAll('a[href]').forEach(a => {
                let href = a.getAttribute('href');
                if (!href || href.startsWith('http') || href.startsWith('//') || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:')) return;
                
                if (href === 'index.html') {
                    a.setAttribute('href', '/');
                } else if (href.startsWith('index.html?')) {
                    a.setAttribute('href', href.replace('index.html', '/'));
                } else if (href.endsWith('.html')) {
                    a.setAttribute('href', href.slice(0, -5));
                } else if (href.includes('.html?')) {
                    a.setAttribute('href', href.replace('.html?', '?'));
                }
            });
        }
        checkBetaMode();
        
        // Automatically scroll active tab into view in the horizontal scrolling container
        setTimeout(() => {
            const tabsContainer = document.querySelector('.tabs-container');
            const activeTab = document.querySelector('.tab-btn.active');
            if (tabsContainer && activeTab) {
                const containerRect = tabsContainer.getBoundingClientRect();
                const tabRect = activeTab.getBoundingClientRect();
                const scrollOffset = (tabRect.left - containerRect.left) - (containerRect.width / 2) + (tabRect.width / 2);
                tabsContainer.scrollLeft += scrollOffset;
            }
        }, 50);

        // Map vertical mouse wheel scroll to horizontal scrolling for desktop users with standard mice
        const scrollableTabs = document.querySelector('.tabs-container');
        if (scrollableTabs) {
            scrollableTabs.addEventListener('wheel', (evt) => {
                if (scrollableTabs.scrollWidth > scrollableTabs.clientWidth) {
                    evt.preventDefault();
                    scrollableTabs.scrollLeft += evt.deltaY;
                }
            }, { passive: false });
        }
        
        // Handle URL parameters for tab and category switching
        const urlParams = new URLSearchParams(window.location.search);
        const tabParam = urlParams.get('tab');
        const catParam = urlParams.get('cat');
        if (tabParam) {
            setTimeout(() => switchTab(tabParam), 100);
        }
        if (catParam) {
            setTimeout(() => filterCategory(catParam), 150);
        }
        
        // Dynamically add Reset buttons to all input panels
        document.querySelectorAll('.panel-title').forEach(titleEl => {
            const panel = titleEl.parentElement;
            if (!panel) return;
            
            const inputs = panel.querySelectorAll('input:not([readonly]):not([type="hidden"]):not([id="sim-search"]), select');
            if (inputs.length === 0) return;
            
            if (titleEl.querySelector('.panel-reset-btn')) return;

            const resetBtn = document.createElement('button');
            resetBtn.className = 'panel-reset-btn';
            resetBtn.innerHTML = '↻ Reset';
            resetBtn.title = 'Reset all inputs to default values';
            
            resetBtn.addEventListener('click', () => {
                inputs.forEach(input => {
                    if (input.type === 'checkbox' || input.type === 'radio') {
                        input.checked = input.defaultChecked;
                    } else if (input.tagName === 'SELECT') {
                        const defaultOption = Array.from(input.options).find(opt => opt.defaultSelected);
                        if (defaultOption) {
                            defaultOption.selected = true;
                        } else {
                            input.selectedIndex = 0;
                        }
                    } else {
                        input.value = input.defaultValue;
                    }
                    input.dispatchEvent(new Event('input', { bubbles: true }));
                    input.dispatchEvent(new Event('change', { bubbles: true }));
                });
            });
            
            titleEl.appendChild(resetBtn);
        });
        
        // Add click outside listener for dropdown
        document.addEventListener('click', (e) => {
            const dropdown = document.getElementById('search-dropdown');
            if (dropdown && dropdown.classList.contains('active')) {
                if (!e.target.closest('.search-box-wrapper')) {
                    dropdown.classList.remove('active');
                }
            }
        });

        // Search input clear button logic
        const searchWrapper = document.querySelector('.search-box-wrapper');
        const searchInput = document.getElementById('sim-search');
        
        if (searchWrapper && searchInput) {
            const clearBtn = document.createElement('span');
            clearBtn.className = 'search-clear-btn';
            clearBtn.innerHTML = '✖';
            searchWrapper.appendChild(clearBtn);
            
            searchInput.addEventListener('input', () => {
                if (searchInput.value.length > 0) {
                    clearBtn.style.display = 'block';
                } else {
                    clearBtn.style.display = 'none';
                }
            });
            
            clearBtn.addEventListener('click', () => {
                searchInput.value = '';
                filterSimulators();
                clearBtn.style.display = 'none';
                searchInput.focus();
            });
        }

        // Add keyboard navigation for search input
        if (searchInput) {
            searchInput.addEventListener('keydown', (e) => {
                const dropdown = document.getElementById('search-dropdown');
                if (!dropdown || !dropdown.classList.contains('active')) return;
                
                const items = dropdown.querySelectorAll('.search-dropdown-item');
                if (items.length === 0) return;

                if (e.key === 'ArrowDown') {
                    e.preventDefault();
                    currentDropdownIndex = (currentDropdownIndex + 1) % items.length;
                    updateDropdownHighlight();
                } else if (e.key === 'ArrowUp') {
                    e.preventDefault();
                    currentDropdownIndex = (currentDropdownIndex - 1 + items.length) % items.length;
                    updateDropdownHighlight();
                } else if (e.key === 'Enter') {
                    if (currentDropdownIndex >= 0 && currentDropdownIndex < items.length) {
                        e.preventDefault();
                        window.location.href = items[currentDropdownIndex].href;
                    }
                } else if (e.key === 'Escape') {
                    dropdown.classList.remove('active');
                    searchInput.blur();
                }
            });
            
            // Re-open on focus if it has value
            searchInput.addEventListener('focus', () => {
                if (searchInput.value.trim() !== '') {
                    filterSimulators();
                }
            });
        }
    });

    

    // ==========================================
    // REGIONAL UNITS SYSTEM & PYEONG CONVERSIONS
    // ==========================================
    
    function changeUnit(unit) {
        if (unit !== 'metric' && unit !== 'imperial') unit = 'metric';
        currentUnit = unit;
        localStorage.setItem('smartfarm_unit', unit);
        
        document.querySelectorAll('#unit-switch .lang-btn').forEach(btn => btn.classList.remove('active'));
        const activeUnitBtn = document.getElementById(`unit-${unit}`);
        if (activeUnitBtn) activeUnitBtn.classList.add('active');
        
        if (typeof updateUnitUI === 'function') updateUnitUI();
    }

    function updatePyeongHelpers() {
        if (currentLang !== 'ko') {
            document.querySelectorAll('.pyeong-helper').forEach(el => el.style.display = 'none');
            return;
        }
        const targets = [
            { inputId: 'est-area', helperId: 'est-area-pyeong' },
            { inputId: 'hl-area', helperId: 'hl-area-pyeong' },
            { inputId: 'area', helperId: 'area-pyeong' }
        ];
        targets.forEach(item => {
            const input = document.getElementById(item.inputId);
            const helper = document.getElementById(item.helperId);
            if (!input || !helper) return;
            const val = parseFloat(input.value);
            if (!isNaN(val) && val > 0) {
                const pyeong = Math.round(val / 3.30578 * 10) / 10;
                helper.innerHTML = `(approx. <strong>${pyeong.toLocaleString()}</strong> pyeong)`;
                helper.style.display = 'block';
            } else {
                helper.style.display = 'none';
            }
        });
    }

    function updateUnitUI() {
        const isImperial = (currentUnit === 'imperial');
        
        const safeSuffix = (id, text) => {
            const el = document.getElementById(id);
            if (el) el.innerText = text;
        };

        // Update input suffixes in DOM
        safeSuffix('est-area-suffix', isImperial ? 'sq ft' : 'm²');
        safeSuffix('hl-area-suffix', isImperial ? 'sq ft' : 'm²');
        safeSuffix('area-suffix', isImperial ? 'sq ft' : ('m²'));
        safeSuffix('hl-uvalue-suffix', isImperial ? 'BTU/h·ft²·°F' : 'W/m²·K');
        safeSuffix('hl-temp-in-suffix', isImperial ? '°F' : '°C');
        safeSuffix('hl-temp-out-suffix', isImperial ? '°F' : '°C');
        safeSuffix('hl-wind-suffix', isImperial ? 'mph' : 'm/s');
        safeSuffix('dt-suffix', isImperial ? '°F' : '°C');
        safeSuffix('fert-vol-suffix', isImperial ? 'gal' : 'Liters');
        safeSuffix('tr-temp-suffix', isImperial ? '°F' : '°C');
        safeSuffix('tr-wind-suffix', isImperial ? 'mph' : 'm/s');
        
        // Update labels for VPD temperature unit switcher automatically
        if (isImperial) {
            if (typeof switchTempUnit === 'function') {
                try { switchTempUnit('F'); } catch(e) {}
            }
        } else {
            if (typeof switchTempUnit === 'function') {
                try { switchTempUnit('C'); } catch(e) {}
            }
        }

        // Convert default input values if they are still standard metric/imperial defaults
        const conversions = [
            { id: 'est-area', toImp: val => Math.round(val * 10.7639), toMet: val => Math.round(val / 10.7639) },
            { id: 'hl-area', toImp: val => Math.round(val * 10.7639), toMet: val => Math.round(val / 10.7639) },
            { id: 'area', toImp: val => Math.round(val * 10.7639), toMet: val => Math.round(val / 10.7639) },
            { id: 'hl-uvalue', toImp: val => parseFloat((val * 0.17611).toFixed(2)), toMet: val => parseFloat((val / 0.17611).toFixed(2)) },
            { id: 'hl-temp-in', toImp: val => Math.round(val * 1.8 + 32), toMet: val => Math.round((val - 32) / 1.8) },
            { id: 'hl-temp-out', toImp: val => Math.round(val * 1.8 + 32), toMet: val => Math.round((val - 32) / 1.8) },
            { id: 'hl-wind', toImp: val => parseFloat((val * 2.23694).toFixed(1)), toMet: val => parseFloat((val / 2.23694).toFixed(1)) },
            { id: 'valve-dt', toImp: val => parseFloat((val * 1.8).toFixed(1)), toMet: val => parseFloat((val / 1.8).toFixed(1)) },
            { id: 'fert-vol', toImp: val => Math.round(val / 3.78541), toMet: val => Math.round(val * 3.78541) },
            { id: 'tr-temp', toImp: val => Math.round(val * 1.8 + 32), toMet: val => Math.round((val - 32) / 1.8) },
            { id: 'tr-wind', toImp: val => parseFloat((val * 2.23694).toFixed(1)), toMet: val => parseFloat((val / 2.23694).toFixed(1)) }
        ];

        conversions.forEach(item => {
            const el = document.getElementById(item.id);
            if (!el) return;
            const val = parseFloat(el.value);
            if (isNaN(val)) return;
            
            const lastUnit = el.dataset.lastUnit || 'metric';
            if (lastUnit !== currentUnit) {
                if (isImperial) {
                    el.value = item.toImp(val);
                } else {
                    el.value = item.toMet(val);
                }
                el.dataset.lastUnit = currentUnit;
            }
        });
        
        // Re-run calculations conditionally based on element presence
        if (document.getElementById('section-valve')) {
            try { if (typeof runEstimatorEngine === 'function') runEstimatorEngine(); } catch(e) {}
        }
        if (document.getElementById('section-heat-loss')) {
            try { if (typeof calculateHeatLossEngine === 'function') calculateHeatLossEngine(); } catch(e) {}
        }
        if (document.getElementById('section-roi')) {
            try { if (typeof calculateRoiEngine === 'function') calculateRoiEngine(); } catch(e) {}
        }
        if (document.getElementById('section-transpiration')) {
            try { if (typeof calculateTranspirationEngine === 'function') calculateTranspirationEngine(); } catch(e) {}
        }
        if (document.getElementById('section-pollinator')) {
            try { if (typeof calculateDensity === 'function') calculateDensity(); } catch(e) {}
        }
        if (document.getElementById('section-fert')) {
            try { if (typeof calculateFertEngine === 'function') calculateFertEngine(); } catch(e) {}
        }
    }
    
    function resetToHome() {
        const searchInput = document.getElementById('sim-search');
        if (searchInput) searchInput.value = '';
        filterCategory('all');
        switchTab('dashboard');
    }
    
    function switchTab(target) {
        const targetPages = {
            'dashboard': 'index.html',
            'vpd': 'vpd.html',
            'valve': 'mixing_valve.html',
            'fert': 'fertigation.html',
            'heat-loss': 'heat_loss.html',
            'roi': 'roi_simulator.html',
            'transpiration': 'transpiration.html',
            'pollinator': 'diagnosis.html',
            'vertical': 'vertical_dli.html',
            'gear': 'greenpocket.html',
            'market': 'market.html'
        };

        const targetSec = document.getElementById(`section-${target}`);
        if (!targetSec && targetPages[target]) {
            // Target section is not on this page, redirect to the page
            let dest = targetPages[target];
            if (window.location.protocol.startsWith('http')) {
                if (dest === 'index.html') {
                    dest = '/';
                } else if (dest.startsWith('index.html?')) {
                    dest = dest.replace('index.html', '/');
                } else if (dest.endsWith('.html')) {
                    dest = dest.slice(0, -5);
                }
            }
            window.location.href = dest;
            return;
        }

        document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
        document.querySelectorAll('.calc-wrapper').forEach(card => card.classList.remove('active'));
        
        const targetBtn = document.getElementById(`btn-tab-${target}`);
        if (targetBtn) targetBtn.classList.add('active');
        if (targetSec) targetSec.classList.add('active');
        
        // Dynamically update URL without reload for local tab switches (SPA style)
        if (window.history && window.history.replaceState && window.location.protocol.startsWith('http')) {
            let newUrl = window.location.pathname;
            if (target === 'market') {
                newUrl += '?tab=market';
            } else if (window.location.search) {
                const params = new URLSearchParams(window.location.search);
                params.delete('tab');
                const searchStr = params.toString();
                if (searchStr) newUrl += '?' + searchStr;
            }
            window.history.replaceState({ tab: target }, '', newUrl);
        }
        
        // Smooth scroll to top when changing tabs
        window.scrollTo({ top: 0, behavior: 'smooth' });
        
        // Google Analytics 4 Custom Event for Tab Switches
        if (typeof gtag === 'function') {
            gtag('event', 'simulator_tab_switch', {
                'tab_name': target
            });
        }
        
        if (target === 'vpd') {
            if (typeof calculateVpdEngine === 'function') calculateVpdEngine();
        } else if (target === 'valve') {
            if (typeof calculateValveEngine === 'function') calculateValveEngine();
        } else if (target === 'fert') {
            if (typeof calculateFertEngine === 'function') calculateFertEngine();
            if (typeof runAcidEngine === 'function') runAcidEngine();
        } else if (target === 'heat-loss') {
            if (typeof calculateHeatLossEngine === 'function') calculateHeatLossEngine();
        } else if (target === 'roi') {
            if (typeof calculateRoiEngine === 'function') calculateRoiEngine();
        } else if (target === 'transpiration') {
            if (typeof calculateTranspirationEngine === 'function') calculateTranspirationEngine();
        } else if (target === 'pollinator') {
            if (typeof calculateDensity === 'function') calculateDensity();
            if (typeof simulateActivity === 'function') simulateActivity();
        } else if (target === 'vertical') {
            if (typeof calculateLight === 'function') calculateLight();
            if (typeof calculateThermal === 'function') calculateThermal();
        }
    }
    
    function toggleAccordion(id) {
        const acc = document.getElementById(id);
        acc.classList.toggle('open');
    }
    let currentTempUnit = 'C';
    let currentVpdStage = 'seedling';
    let currentPowerUnit = 'kW';
    let currentPressUnit = 'kPa';
    function applyVpdPreset() {
        const preset = document.getElementById('vpd-preset').value;
        const offsetEl = document.getElementById('offset-leaf');
        if (preset === 'custom') {
            offsetEl.disabled = false;
        } else {
            offsetEl.disabled = true;
            if (preset === 'led') {
                offsetEl.value = currentTempUnit === 'F' ? "1.8" : "1.0";
            } else if (preset === 'hps') {
                offsetEl.value = currentTempUnit === 'F' ? "-3.6" : "-2.0";
            } else if (preset === 'sunlight') {
                offsetEl.value = currentTempUnit === 'F' ? "-2.7" : "-1.5";
            } else if (preset === 'night') {
                offsetEl.value = "0.0";
            }
        }
        calculateVpdEngine();
    }
    function switchTempUnit(unit) {
        if (currentTempUnit === unit) return;
        currentTempUnit = unit;
        const cBtn = document.getElementById('temp-unit-c');
        const fBtn = document.getElementById('temp-unit-f');
        const tempValEl = document.getElementById('temp-air');
        const offsetValEl = document.getElementById('offset-leaf');
        const tempSuffix = document.getElementById('temp-air-unit');
        const offsetSuffix = document.getElementById('offset-leaf-unit');
        let tempVal = parseFloat(tempValEl.value);
        let offsetVal = parseFloat(offsetValEl.value);
        if (unit === 'F') {
            cBtn.classList.remove('active');
            fBtn.classList.add('active');
            tempValEl.value = (tempVal * 1.8 + 32).toFixed(1);
            offsetValEl.value = (offsetVal * 1.8).toFixed(1);
            tempSuffix.innerText = '°F';
            offsetSuffix.innerText = '°F';
        } else {
            cBtn.classList.add('active');
            fBtn.classList.remove('active');
            tempValEl.value = ((tempVal - 32) / 1.8).toFixed(1);
            offsetValEl.value = (offsetVal / 1.8).toFixed(1);
            tempSuffix.innerText = '°C';
            offsetSuffix.innerText = '°C';
        }
        applyVpdPreset();
    }
    function setVpdStage(stage) {
        currentVpdStage = stage;
        document.querySelectorAll('#section-vpd .segmented-control button').forEach(btn => btn.classList.remove('active'));
        document.getElementById(`stage-${stage}`).classList.add('active');
        calculateVpdEngine();
    }
    function calculateVpdEngine() {
        let T_air = parseFloat(document.getElementById('temp-air').value);
        let RH = parseFloat(document.getElementById('rh-air').value);
        let dT = parseFloat(document.getElementById('offset-leaf').value);
        if (isNaN(T_air) || isNaN(RH) || isNaN(dT)) return;
        if (currentTempUnit === 'F') {
            T_air = (T_air - 32) / 1.8;
            dT = dT / 1.8;
        }
        const T_leaf = T_air + dT;
        const VPsat_air = 0.61078 * Math.exp((17.27 * T_air) / (T_air + 237.3));
        const VPsat_leaf = 0.61078 * Math.exp((17.27 * T_leaf) / (T_leaf + 237.3));
        const VPact_air = VPsat_air * (RH / 100);
        let vpd = VPsat_leaf - VPact_air;
        if (vpd < 0) vpd = 0;
        document.getElementById('vpd-value').innerText = vpd.toFixed(2) + " kPa";
        let percent = vpd / 2.0;
        if (percent > 1.0) percent = 1.0;
        const angle = -90 + (percent * 180);
        document.getElementById('gauge-hand').style.transform = `translateX(-50%) rotate(${angle}deg)`;
        const fillOffset = 283 - (percent * 283);
        document.getElementById('gauge-fill-arc').style.strokeDashoffset = fillOffset;
        const statusPill = document.getElementById('vpd-status-pill');
        const descEl = document.getElementById('vpd-explanation');
        const tipEl = document.getElementById('vpd-tip');
        let minOpt = 0.8;
        let maxOpt = 1.2;
        if (currentVpdStage === 'seedling') {
            minOpt = 0.4;
            maxOpt = 0.8;
            tipEl.innerText = i18n[currentLang].vpdTipSeedling;
        } else if (currentVpdStage === 'veg') {
            minOpt = 0.8;
            maxOpt = 1.1;
            tipEl.innerText = i18n[currentLang].vpdTipVeg;
        } else if (currentVpdStage === 'flower') {
            minOpt = 1.1;
            maxOpt = 1.5;
            tipEl.innerText = i18n[currentLang].vpdTipFlower;
        }
        
        const actionsCard = document.getElementById('vpd-actions-card');
        const actionsList = document.getElementById('vpd-actions-list');
        
        if (vpd < minOpt) {
            statusPill.innerText = "Too Humid (Low VPD)";
            statusPill.className = "status-pill danger";
            descEl.innerText = i18n[currentLang].vpdExplanationLow.replace('{minOpt}', minOpt).replace('{maxOpt}', maxOpt);
            
            actionsCard.style.borderLeft = "4px solid var(--danger)";
            actionsList.innerHTML = `<li>⚠️ <strong>Ventilation</strong>: Run circulation fans and crack vents to expel moist air.</li>
                 <li>⚠️ <strong>Heating</strong>: Slightly raise pipe temp to warm the air and lower relative humidity.</li>
                 <li>⚠️ <strong>Thermal Screen Gap</strong>: Open screens slightly to mix with drier upper air.</li>`;
        } else if (vpd >= minOpt && vpd <= maxOpt) {
            statusPill.innerText = "Optimal VPD";
            statusPill.className = "status-pill optimal";
            descEl.innerText = i18n[currentLang].vpdExplanationOpt.replace('{minOpt}', minOpt).replace('{maxOpt}', maxOpt);
            
            actionsCard.style.borderLeft = "4px solid var(--success)";
            actionsList.innerHTML = `<li>✅ <strong>Optimal Climate</strong>: CO₂ assimilation, transpiration, and calcium flow are at peak performance.</li>
                 <li>✅ <strong>Standard Irrigation</strong>: Maintain standard watering intervals based on cumulative light sum.</li>`;
        } else {
            statusPill.innerText = "Too Dry (High VPD)";
            statusPill.className = "status-pill warning";
            descEl.innerText = i18n[currentLang].vpdExplanationHigh.replace('{minOpt}', minOpt).replace('{maxOpt}', maxOpt);
            
            actionsCard.style.borderLeft = "4px solid var(--warning)";
            actionsList.innerHTML = `<li>⚠️ <strong>Fogging/Misting</strong>: Run high-pressure mist systems to immediately supply humidity.</li>
                 <li>⚠️ <strong>Deploy Shading</strong>: Cover with screens to decrease solar load, leaf temp, and transpiration pressure.</li>
                 <li>⚠️ <strong>Reduce Vents</strong>: Keep vents slightly closed to prevent dry outdoor air swap.</li>`;
        }

        // Dew Point Calculation (Magnus-Tetens)
        const alpha = Math.log(RH / 100) + (17.625 * T_air) / (243.04 + T_air);
        const T_dp = (243.04 * alpha) / (17.625 - alpha);
        let displayT_dp = T_dp;
        if (currentTempUnit === 'F') {
            displayT_dp = T_dp * 1.8 + 32;
        }
        const dewPointValEl = document.getElementById('vpd-dewpoint-value');
        const dewPointStatusEl = document.getElementById('vpd-dewpoint-status');
        if (dewPointValEl && dewPointStatusEl) {
            dewPointValEl.innerText = `Dew Point: ${displayT_dp.toFixed(1)}°${currentTempUnit}`;
            
            // Condensation alarm: Leaf temperature vs Dew Point
            const T_leaf_actual = T_air + dT; // in Celsius
            const diff = T_leaf_actual - T_dp;
            if (diff <= 1.0) {
                dewPointStatusEl.innerHTML = `<span style="color: var(--danger); font-weight: 700;">🚨 CONDENSATION RISK!</span> Leaf temp is only ${diff.toFixed(1)}°C above dew point. Increase air temp, lower humidity, or run air circulation fans.`;
                document.getElementById('vpd-dewpoint-card').style.borderLeft = "4px solid var(--danger)";
            } else if (diff <= 3.0) {
                dewPointStatusEl.innerHTML = `<span style="color: var(--warning); font-weight: 600;">⚠️ High Condensation Risk</span> Leaf temp is ${diff.toFixed(1)}°C above dew point. Watch for cold air drafts and dead zones.`;
                document.getElementById('vpd-dewpoint-card').style.borderLeft = "4px solid var(--warning)";
            } else {
                dewPointStatusEl.innerHTML = `<span style="color: var(--success); font-weight: 600;">✅ Stable (No Dew)</span> Leaf temp is ${diff.toFixed(1)}°C above dew point. Condensation is unlikely.`;
                document.getElementById('vpd-dewpoint-card').style.borderLeft = "4px solid var(--success)";
            }
        }

        // Generate matrix table
        if (typeof generateVpdMatrix === 'function') generateVpdMatrix();
    }
    function generateVpdMatrix() {
        const matrixTarget = document.getElementById('vpd-matrix-target');
        if (!matrixTarget) return;

        // Collect inputs to account for offsets and active ranges
        let dT = parseFloat(document.getElementById('offset-leaf').value);
        if (isNaN(dT)) dT = 0.0;
        if (currentTempUnit === 'F') {
            dT = dT / 1.8;
        }

        // Get limits based on active stage
        let minOpt = 0.8;
        let maxOpt = 1.2;
        if (currentVpdStage === 'seedling') {
            minOpt = 0.4;
            maxOpt = 0.8;
        } else if (currentVpdStage === 'veg') {
            minOpt = 0.8;
            maxOpt = 1.1;
        } else if (currentVpdStage === 'flower') {
            minOpt = 1.1;
            maxOpt = 1.5;
        }

        // Set up temperature ranges
        let tempRange = [];
        if (currentTempUnit === 'F') {
            // 60°F to 92°F, steps of 4°F
            for (let t = 60; t <= 92; t += 4) {
                tempRange.push(t);
            }
        } else {
            // 16°C to 34°C, steps of 2°C
            for (let t = 16; t <= 34; t += 2) {
                tempRange.push(t);
            }
        }

        // Relative humidity columns
        const rhRange = [50, 55, 60, 65, 70, 75, 80, 85, 90, 95];

        let html = `<table class="vpd-matrix-table">`;
        
        // Header
        html += `<thead><tr><th>Temp \\ RH</th>`;
        rhRange.forEach(rh => {
            html += `<th>${rh}%</th>`;
        });
        html += `</tr></thead><tbody>`;

        // Rows
        tempRange.forEach(tDisp => {
            // Convert to Celsius for Tetens calculation
            let tAirC = tDisp;
            if (currentTempUnit === 'F') {
                tAirC = (tDisp - 32) / 1.8;
            }
            
            const tLeafC = tAirC + dT;

            // Calculate Saturation Vapor Pressure for leaf
            const VPsat_leaf = 0.61078 * Math.exp((17.27 * tLeafC) / (tLeafC + 237.3));
            // Calculate Saturation Vapor Pressure for air
            const VPsat_air = 0.61078 * Math.exp((17.27 * tAirC) / (tAirC + 237.3));

            html += `<tr><th>${tDisp}°${currentTempUnit}</th>`;
            
            rhRange.forEach(rh => {
                const VPact_air = VPsat_air * (rh / 100);
                let cellVpd = VPsat_leaf - VPact_air;
                if (cellVpd < 0) cellVpd = 0;

                // Color coding logic
                let colorClass = '';
                if (cellVpd < minOpt) {
                    colorClass = 'vpd-cell-too-low'; // Too humid
                } else if (cellVpd >= minOpt && cellVpd <= maxOpt) {
                    colorClass = 'vpd-cell-optimal'; // Optimal
                } else if (cellVpd > maxOpt && cellVpd <= maxOpt + 0.3) {
                    colorClass = 'vpd-cell-warning'; // Too dry
                } else {
                    colorClass = 'vpd-cell-danger'; // Extreme dry
                }

                html += `<td class="${colorClass}">${cellVpd.toFixed(2)}</td>`;
            });
            html += `</tr>`;
        });

        html += `</tbody></table>`;
        matrixTarget.innerHTML = html;
    }

    function runEstimatorEngine() {
        const area = parseFloat(document.getElementById('est-area').value);
        let U_val = document.getElementById('est-cover').value;
        let U = 5.5;
        const customWrapper = document.getElementById('est-cover-custom-wrapper');
        if (U_val === 'custom') {
            if (customWrapper) customWrapper.style.display = '';
            U = parseFloat(document.getElementById('est-cover-custom').value) || 5.5;
        } else {
            if (customWrapper) customWrapper.style.display = 'none';
            U = parseFloat(U_val) || 5.5;
        }
        const tempIn = parseFloat(document.getElementById('est-temp-in').value);
        const tempOut = parseFloat(document.getElementById('est-temp-out').value);
        if (isNaN(area) || isNaN(U) || isNaN(tempIn) || isNaN(tempOut)) return;
        const deltaT = tempIn - tempOut;
        if (deltaT <= 0) {
            document.getElementById('est-result-value').innerText = "0 kW";
            return;
        }
        let qEstKw;
        if (currentUnit === 'imperial') {
            const U_imp = U * 0.17611;
            const qEstBtu = 1.4 * area * U_imp * deltaT * 1.25;
            qEstKw = qEstBtu / 3412.14;
        } else {
            qEstKw = (1.4 * area * U * deltaT * 1.25) / 1000;
        }
        document.getElementById('est-result-value').innerText = qEstKw.toFixed(0) + " kW";

        const actionsCard = document.getElementById('hl-actions-card');
        const actionsList = document.getElementById('hl-actions-list');
        if (actionsCard && actionsList) {
            let advise = `Your greenhouse is losing <strong>${qEstKw.toFixed(1)} kW</strong> of heat. `;
            if (U > 5.0) {
                advise += `Because your cladding's U-value is high (${U}), heat is hemorrhaging. Installing a double thermal screen could cut this energy demand by 40%. `;
            } else {
                advise += `Your cladding provides excellent insulation. `;
            }
            if (deltaT > 25) {
                advise += `The massive temperature difference of ${deltaT}°C puts extreme stress on your boiler. Ensure you have a backup heating source ready for winter nights.`;
            }
            actionsList.innerHTML = advise;
        }

    }
    function applyEstimatedLoad() {
        const resultVal = parseFloat(document.getElementById('est-result-value').innerText);
        const heatPowerEl = document.getElementById('heat-power');
        if (currentPowerUnit === 'BTU') {
            heatPowerEl.value = (resultVal * 3412.14).toFixed(0);
        } else {
            heatPowerEl.value = resultVal.toFixed(0);
        }
        calculateValveEngine();
        heatPowerEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
        heatPowerEl.focus();
        heatPowerEl.style.borderColor = 'var(--cyan)';
        setTimeout(() => {
            heatPowerEl.style.borderColor = '';
        }, 1500);
    }
    function runAcidEngine() {
        const rawHco3 = parseFloat(document.getElementById('acid-raw').value);
        const targetHco3 = parseFloat(document.getElementById('acid-target').value);
        const acidType = document.getElementById('acid-select').value;
        const tankVol = parseFloat(document.getElementById('fert-vol').value);
        const dilution = parseFloat(document.getElementById('fert-ratio').value);
        
        if (isNaN(rawHco3) || isNaN(targetHco3) || isNaN(tankVol) || isNaN(dilution)) return;
        
        const deltaHco3 = rawHco3 - targetHco3;
        const resultValEl = document.getElementById('acid-result-value');
        const expEl = document.getElementById('acid-explanation');

        if (deltaHco3 <= 0) {
            resultValEl.innerText = currentUnit === 'imperial' ? "0.0 fl oz" : "0.0 mL";
            expEl.innerText = "No bicarbonate to neutralize. Water pH buffer is stable.";
            return;
        }
        
        const meqL = deltaHco3 / 61.017;
        let acidMolarity = 13.0; // Nitric Acid 60%
        if (acidType === 'phosphoric') {
            acidMolarity = 14.6; // Phosphoric Acid 85%
        }
        
        const tankVol_L = currentUnit === 'imperial' ? tankVol * 3.78541 : tankVol;
        const totalMeq = meqL * tankVol_L * dilution;
        const acidVolMl = totalMeq / acidMolarity;
        
        if (currentUnit === 'imperial') {
            const flOz = acidVolMl / 29.5735;
            if (flOz >= 128) {
                resultValEl.innerText = (flOz / 128).toFixed(2) + " gal";
            } else {
                resultValEl.innerText = flOz.toFixed(1) + " fl oz";
            }
        } else {
            if (acidVolMl >= 1000) {
                resultValEl.innerText = (acidVolMl / 1000).toFixed(2) + " L";
            } else {
                resultValEl.innerText = acidVolMl.toFixed(0) + " mL";
            }
        }
        
        const acidName = acidType === 'nitric' ? "60% Nitric Acid" : "85% Phosphoric Acid";
        const volStr = currentUnit === 'imperial' ? 
            (acidVolMl / 29.5735 >= 128 ? (acidVolMl / 29.5735 / 128).toFixed(2) + " gal" : (acidVolMl / 29.5735).toFixed(1) + " fl oz") :
            (acidVolMl >= 1000 ? (acidVolMl/1000).toFixed(2) + " L" : acidVolMl.toFixed(0) + " mL");
        
        expEl.innerHTML = `To neutralize raw bicarbonate from <strong>${rawHco3} ppm</strong> to <strong>${targetHco3} ppm</strong>, we need to neutralize <strong>${meqL.toFixed(2)} meq/L</strong> of HCO₃⁻.<br>Add <strong>${volStr}</strong> of <strong>${acidName}</strong> to the ${tankVol}${currentUnit === 'imperial' ? ' gal' : 'L'} stock tank.<br><small style="color: var(--danger); font-weight: 600;">⚠️ CAUTION: Always add acid to water, never water to acid! Add slowly while stirring.</small>`;
    }
    function switchPowerUnit(unit) {
        if (currentPowerUnit === unit) return;
        currentPowerUnit = unit;
        const kwBtn = document.getElementById('power-unit-kw');
        const btuBtn = document.getElementById('power-unit-btu');
        const powerInput = document.getElementById('heat-power');
        const powerSuffix = document.getElementById('power-suffix');
        let val = parseFloat(powerInput.value);
        if (unit === 'BTU') {
            kwBtn.classList.remove('active');
            btuBtn.classList.add('active');
            powerInput.value = (val * 3412.14).toFixed(0);
            powerSuffix.innerText = 'BTU/h';
        } else {
            kwBtn.classList.add('active');
            btuBtn.classList.remove('active');
            powerInput.value = (val / 3412.14).toFixed(0);
            powerSuffix.innerText = 'kW';
        }
        calculateValveEngine();
    }
    function switchPressUnit(unit) {
        if (currentPressUnit === unit) return;
        currentPressUnit = unit;
        const kpaBtn = document.getElementById('press-unit-kpa');
        const barBtn = document.getElementById('press-unit-bar');
        const pressInput = document.getElementById('valve-dp');
        const pressSuffix = document.getElementById('press-suffix');
        let val = parseFloat(pressInput.value);
        if (unit === 'bar') {
            kpaBtn.classList.remove('active');
            barBtn.classList.add('active');
            pressInput.value = (val / 100).toFixed(3);
            pressSuffix.innerText = 'bar';
        } else {
            kpaBtn.classList.add('active');
            barBtn.classList.remove('active');
            pressInput.value = (val * 100).toFixed(1);
            pressSuffix.innerText = 'kPa';
        }
        calculateValveEngine();
    }
    function calculateValveEngine() {
        let Q = parseFloat(document.getElementById('heat-power').value);
        let dT = parseFloat(document.getElementById('valve-dt').value);
        let dPv = parseFloat(document.getElementById('valve-dp').value);
        if (isNaN(Q) || isNaN(dT) || isNaN(dPv) || dT <= 0 || dPv <= 0) {
            const actionsList = document.getElementById('valve-actions-list');
            if (actionsList) actionsList.innerHTML = "Please enter valid system inputs (Temperature Drop and Valve Pressure Drop must be greater than 0).";
            return;
        }
        if (currentPowerUnit === 'BTU') {
            Q = Q / 3412.14;
        }
        let dPv_bar = dPv;
        if (currentPressUnit === 'kPa') {
            dPv_bar = dPv / 100;
        }
        
        let actualDtC = dT;
        if (currentUnit === 'imperial') {
            actualDtC = dT / 1.8;
        }
        
        const flowRate = (Q * 0.86) / actualDtC;
        const kv = flowRate / Math.sqrt(dPv_bar);
        document.getElementById('valve-value').innerText = kv.toFixed(2);
        const statusPill = document.getElementById('valve-status-pill');
        statusPill.innerText = i18n[currentLang].valveStatusPill;
        const pipeCard = document.getElementById('pipe-suggestion-card');
        let dn = 'DN15 (1/2")';
        if (flowRate <= 1.0) {
            dn = 'DN15 (1/2")';
        } else if (flowRate > 1.0 && flowRate <= 2.2) {
            dn = 'DN20 (3/4")';
        } else if (flowRate > 2.2 && flowRate <= 3.5) {
            dn = 'DN25 (1")';
        } else if (flowRate > 3.5 && flowRate <= 6.5) {
            dn = 'DN32 (1-1/4")';
        } else if (flowRate > 6.5 && flowRate <= 10.0) {
            dn = 'DN40 (1-1/2")';
        } else {
            dn = 'DN50 (2")';
        }
        const expEl = document.getElementById('valve-explanation');
        expEl.innerHTML = i18n[currentLang].valveExplanation
            .replace('{flowRate}', flowRate.toFixed(2))
            .replace('{kv}', kv.toFixed(2));
            
        // Calculate closest standard commercial Kvs (providing control authority margin)
        const stdKvs = [0.63, 1.0, 1.6, 2.5, 4.0, 6.3, 10.0, 16.0, 25.0, 40.0, 63.0, 100.0];
        let recommendedKvs = stdKvs[stdKvs.length - 1];
        const targetKvs = kv * 1.25;
        for (let i = 0; i < stdKvs.length; i++) {
            if (stdKvs[i] >= targetKvs) {
                recommendedKvs = stdKvs[i];
                break;
            }
        }
        
        pipeCard.innerHTML = `
            <h4>${i18n[currentLang].pipeRecommendationTitle}</h4>
            <p>${i18n[currentLang].pipeRecommendationDesc
                .replace('{dn}', dn)
                .replace('{kv}', kv.toFixed(2))
                .replace('{kvsMargin}', recommendedKvs.toFixed(1))}</p>
        `;

        const actionsCard = document.getElementById('valve-actions-card');
        const actionsList = document.getElementById('valve-actions-list');
        if (actionsCard && actionsList) {
            let advise = `To maintain proper control authority over the <strong>${Q.toFixed(1)} kW</strong> heat load, you need a valve Kv of <strong>${kv.toFixed(2)}</strong>. `;
            if (kv > 15) {
                advise += `This requires a relatively large mixing valve. Consider splitting the heating circuit into two separate loops to reduce the load on a single pump and valve.`;
            } else {
                advise += `A standard threaded brass mixing valve will suffice for this flow rate. Ensure your pump head can overcome the ${dPv.toFixed(1)} ${currentPressUnit} pressure drop across the valve.`;
            }
            actionsList.innerHTML = advise;
        }
    }
    const fertDb = {
        custom: { purity: 15.5, tank: 'none' },
        calcium_nitrate: { purity: 15.5, tank: 'A' },
        potassium_nitrate: { purity: 13.0, tank: 'AB' },
        mkp: { purity: 22.7, tank: 'B' },
        potassium_sulfate: { purity: 41.5, tank: 'B' },
        magnesium_sulfate: { purity: 9.8, tank: 'B' },
        ammonium_sulfate: { purity: 21.0, tank: 'B' }
    };
    function applyFertPreset() {
        const presetKey = document.getElementById('fert-preset').value;
        const purityEl = document.getElementById('fert-purity');
        const badgeEl = document.getElementById('fert-tank-badge');
        if (presetKey === 'custom') {
            purityEl.disabled = false;
            badgeEl.style.display = 'none';
        } else {
            purityEl.disabled = true;
            purityEl.value = fertDb[presetKey].purity;
            const tank = fertDb[presetKey].tank;
            badgeEl.style.display = 'inline-flex';
            badgeEl.className = 'tank-badge';
            if (tank === 'A') {
                badgeEl.className = 'tank-badge tank-a';
                badgeEl.innerText = 'Tank A';
            } else if (tank === 'B') {
                badgeEl.className = 'tank-badge tank-b';
                badgeEl.innerText = 'Tank B';
            } else if (tank === 'AB') {
                badgeEl.className = 'tank-badge tank-ab';
                badgeEl.innerText = 'Tank A/B';
            }
        }
        calculateFertEngine();
    }
    function calculateFertEngine() {
        const targetPpm = parseFloat(document.getElementById('fert-target').value);
        const tankVolume = parseFloat(document.getElementById('fert-vol').value);
        const dilution = parseFloat(document.getElementById('fert-ratio').value);
        const purity = parseFloat(document.getElementById('fert-purity').value);
        if (isNaN(targetPpm) || isNaN(tankVolume) || isNaN(dilution) || isNaN(purity) || purity <= 0) {
            const actionsList = document.getElementById('fert-actions-list');
            if (actionsList) actionsList.innerHTML = "Please enter valid stock tank parameters (Purity must be greater than 0%).";
            return;
        }

        const tankVolume_L = currentUnit === 'imperial' ? tankVolume * 3.78541 : tankVolume;
        const mass_kg = (targetPpm * tankVolume_L * dilution) / (purity * 10000);
        
        let displayMass = mass_kg;
        let massUnit = 'kg';
        if (currentUnit === 'imperial') {
            displayMass = mass_kg * 2.20462;
            massUnit = 'lb';
        }

        document.getElementById('fert-value').innerText = displayMass.toFixed(1) + " " + massUnit;

        const statusPill = document.getElementById('fert-status-pill');
        statusPill.innerText = i18n[currentLang].fertStatusPill;

        const expEl = document.getElementById('fert-explanation');
        let exp = i18n[currentLang].fertExplanation
            .replace('{mass}', displayMass.toFixed(1))
            .replace('{tankVolume}', tankVolume)
            .replace('{dilution}', dilution)
            .replace('{targetPpm}', targetPpm);
        
        if (currentUnit === 'imperial') {
            exp = exp.replace(' kg', ' lb').replace('L ', ' gal ');
        }
        expEl.innerHTML = exp;
            

        const actionsCard = document.getElementById('fert-actions-card');
        const actionsList = document.getElementById('fert-actions-list');
        if (actionsCard && actionsList) {
            let advise = `To achieve your target of <strong>${targetPpm} ppm</strong>, you must accurately weigh ${displayMass.toFixed(1)} ${massUnit} of the raw salt. `;
            if (targetPpm < 100) {
                advise += `Since the target concentration is relatively low, ensure this is for a vegetative stage or micro-nutrient. `;
            } else if (targetPpm > 300) {
                advise += `This is a highly concentrated dose. Ensure you have sufficient run-off in your substrate to prevent EC buildup and root burn. `;
            }
            if (purity < 80) {
                advise += `Your fertilizer has a low purity (${purity}%). Be prepared for insoluble fillers settling at the bottom of Tank A/B. Agitation is required.`;
            } else {
                advise += `With a high purity of ${purity}%, solubility should be excellent.`;
            }
            actionsList.innerHTML = advise;
        }
        
        runAcidEngine();

    }

    const hlPresetDb = {
        custom: 5.5,
        single_poly: 6.0,
        double_poly: 3.5,
        glass: 5.5,
        double_glass: 3.0,
        pc_8: 3.3,
        pc_16: 2.3
    };

    function applyHlPreset() {
        const presetKey = document.getElementById('hl-preset').value;
        const uvalueEl = document.getElementById('hl-uvalue');
        if (presetKey === 'custom') {
            uvalueEl.disabled = false;
        } else {
            uvalueEl.disabled = true;
            let val = hlPresetDb[presetKey];
            if (currentUnit === 'imperial') {
                val = parseFloat((val * 0.17611).toFixed(2));
            }
            uvalueEl.value = val;
        }
        calculateHeatLossEngine();
    }

    function calculateHeatLossEngine() {
        const A = parseFloat(document.getElementById('hl-area').value);
        const U = parseFloat(document.getElementById('hl-uvalue').value);
        const tempIn = parseFloat(document.getElementById('hl-temp-in').value);
        const tempOut = parseFloat(document.getElementById('hl-temp-out').value);
        const wind = parseFloat(document.getElementById('hl-wind').value);

        if (isNaN(A) || isNaN(U) || isNaN(tempIn) || isNaN(tempOut) || isNaN(wind)) return;

        const deltaT = tempIn - tempOut;
        if (deltaT <= 0) {
            document.getElementById('hl-value').innerText = currentUnit === 'imperial' ? "0.0 BTU/h" : "0.0 kW";
            document.getElementById('hl-explanation').innerText = "Outdoor temperature is higher than or equal to indoor. Heating not required.";
            document.getElementById('hl-status-pill').className = "status-pill optimal";
            document.getElementById('hl-status-pill').innerText = "No Heat Needed";
            updatePyeongHelpers();
            const actionsList = document.getElementById('hl-actions-list');
            if (actionsList) actionsList.innerHTML = "No heating load detected. Outdoor temperature is higher than or equal to target indoor temperature.";
            return;
        }

        // Wind friction multiplier (simplified ASHRAE/standard engineering approach)
        const windSpeedMs = currentUnit === 'imperial' ? wind / 2.23694 : wind;
        
        if (windSpeedMs >= 25.0) {
            document.getElementById('hl-value').innerText = "N/A";
            document.getElementById('hl-explanation').innerHTML = "<strong style='color:var(--danger);'>🚨 Warning: Extreme Wind Speed</strong><br>At >25m/s, structural failure (e.g., torn plastic, collapsed frame) is the primary concern before heat loss. Heating calculation is invalid.";
            document.getElementById('hl-status-pill').className = "status-pill danger";
            document.getElementById('hl-status-pill').innerText = "Calculation Blocked";
            updatePyeongHelpers();
            const actionsList = document.getElementById('hl-actions-list');
            if (actionsList) actionsList.innerHTML = "Calculation blocked due to extreme wind speed (>25m/s). Focus on structural reinforcement rather than heating.";
            return;
        }

        let fWind = 1.0;
        if (windSpeedMs > 10.0) fWind = 1.40;
        else if (windSpeedMs > 5.0) fWind = 1.25;
        else if (windSpeedMs > 2.0) fWind = 1.12;

        let qLossKw, qLossBtu;
        if (currentUnit === 'imperial') {
            qLossBtu = U * A * deltaT * fWind;
            qLossKw = qLossBtu / 3412.14;
        } else {
            qLossKw = (U * A * deltaT * fWind) / 1000;
            qLossBtu = qLossKw * 3412.14;
        }

        if (currentUnit === 'imperial') {
            document.getElementById('hl-value').innerText = Math.round(qLossBtu).toLocaleString() + " BTU/h";
        } else {
            document.getElementById('hl-value').innerText = qLossKw.toFixed(1) + " kW";
        }

        const statusPill = document.getElementById('hl-status-pill');
        if (qLossKw < 50) {
            statusPill.className = "status-pill optimal";
            statusPill.innerText = "Low Heat Demand";
        } else if (qLossKw >= 50 && qLossKw < 200) {
            statusPill.className = "status-pill warning";
            statusPill.innerText = "Medium Heat Demand";
        } else {
            statusPill.className = "status-pill danger";
            statusPill.innerText = "High Heat Demand";
        }

        const expEl = document.getElementById('hl-explanation');
        let exp = i18n[currentLang].heatLossExplanation
            .replace('{tempOut}', tempOut)
            .replace('{tempIn}', tempIn)
            .replace('{fWind}', fWind.toFixed(2))
            .replace('{heatLoss}', qLossKw.toFixed(1))
            .replace('{btuVal}', qLossBtu.toFixed(0));
            
        if (currentUnit === 'imperial') {
            exp = exp.replace('°C', '°F').replace('°C', '°F');
            exp = exp.replace(/<strong>(.*?) kW<\/strong> \((.*?) BTU\/h\)/, '<strong>$2 BTU/h</strong> ($1 kW)');
        }
        expEl.innerHTML = exp;
        updatePyeongHelpers();

        const actionsCard = document.getElementById('hl-actions-card');
        const actionsList = document.getElementById('hl-actions-list');
        if (actionsCard && actionsList) {
            let advise = `Your greenhouse is losing <strong>${qLossKw.toFixed(1)} kW</strong> of heat. `;
            if (U > 5.0) {
                advise += `Because your cladding's U-value is high (${U}), heat is hemorrhaging. Installing a double thermal screen could cut this energy demand by 40%. `;
            } else {
                advise += `Your cladding provides excellent insulation. `;
            }
            if (deltaT > 25) {
                advise += `The massive temperature difference of ${deltaT.toFixed(1)}°C puts extreme stress on your boiler. Ensure you have a backup heating source ready for winter nights.`;
            }
            actionsList.innerHTML = advise;
        }
    }

    let currentRoiCurrency = 'KRW';
    
    function switchRoiCurrency(currency) {
        if (currentRoiCurrency === currency) return;
        currentRoiCurrency = currency;
        
        const krwBtn = document.getElementById('roi-curr-krw');
        const eurBtn = document.getElementById('roi-curr-eur');
        const usdBtn = document.getElementById('roi-curr-usd');
        const boilerPriceSuffix = document.getElementById('roi-boiler-price-unit');
        const elecPriceSuffix = document.getElementById('roi-hp-price-unit');
        const capexSuffix = document.getElementById('roi-capex-unit');
        
        const capexInput = document.getElementById('roi-capex');
        const boilerPriceInput = document.getElementById('roi-boiler-price');
        const hpPriceInput = document.getElementById('roi-hp-price');

        // Toggle active button styling
        [krwBtn, eurBtn, usdBtn].forEach(btn => {
            if (btn) btn.classList.remove('active');
        });
        if (currency === 'KRW') krwBtn.classList.add('active');
        else if (currency === 'EUR') eurBtn.classList.add('active');
        else if (currency === 'USD') usdBtn.classList.add('active');

        if (currency === 'EUR') {
            boilerPriceSuffix.innerText = 'EUR/kWh';
            elecPriceSuffix.innerText = 'EUR/kWh';
            capexSuffix.innerText = 'EUR';
            
            capexInput.value = "10000";
            hpPriceInput.value = "0.15";
            
            onBoilerTypeChange();
        } else if (currency === 'USD') {
            boilerPriceSuffix.innerText = 'USD/kWh';
            elecPriceSuffix.innerText = 'USD/kWh';
            capexSuffix.innerText = 'USD';
            
            capexInput.value = "12000";
            hpPriceInput.value = "0.12";
            
            onBoilerTypeChange();
        } else {
            boilerPriceSuffix.innerText = '₩/m³';
            elecPriceSuffix.innerText = '₩/kWh';
            capexSuffix.innerText = '₩';
            
            capexInput.value = "15000000";
            hpPriceInput.value = "80";
            
            onBoilerTypeChange();
        }
        calculateRoiEngine();
    }

    function onBoilerTypeChange() {
        const type = document.getElementById('roi-boiler-type').value;
        const priceSuffix = document.getElementById('roi-boiler-price-unit');
        const priceInput = document.getElementById('roi-boiler-price');

        if (currentRoiCurrency === 'EUR') {
            priceSuffix.innerText = 'EUR/kWh';
            if (type === 'gas') priceInput.value = "0.08";
            else if (type === 'oil') priceInput.value = "0.12";
            else if (type === 'lpg') priceInput.value = "0.15";
        } else if (currentRoiCurrency === 'USD') {
            priceSuffix.innerText = 'USD/kWh';
            if (type === 'gas') priceInput.value = "0.09";
            else if (type === 'oil') priceInput.value = "0.13";
            else if (type === 'lpg') priceInput.value = "0.16";
        } else {
            if (type === 'gas') {
                priceSuffix.innerText = '₩/m³';
                priceInput.value = "1000";
            } else if (type === 'oil') {
                priceSuffix.innerText = '₩/L';
                priceInput.value = "1300";
            } else if (type === 'lpg') {
                priceSuffix.innerText = '₩/kg';
                priceInput.value = "2000";
            }
        }
        calculateRoiEngine();
    }

    function calculateRoiEngine() {
        const demand = parseFloat(document.getElementById('roi-demand').value);
        const boilerType = document.getElementById('roi-boiler-type').value;
        const boilerPrice = parseFloat(document.getElementById('roi-boiler-price').value);
        const boilerEff = parseFloat(document.getElementById('roi-boiler-eff').value) / 100;
        const hpCop = parseFloat(document.getElementById('roi-hp-cop').value);
        const hpPrice = parseFloat(document.getElementById('roi-hp-price').value);
        const capex = parseFloat(document.getElementById('roi-capex').value);

        if (isNaN(demand) || isNaN(boilerPrice) || isNaN(boilerEff) || isNaN(hpCop) || isNaN(hpPrice) || isNaN(capex) || boilerEff <= 0 || hpCop <= 0) return;

        let boilerCost = 0;
        if (currentRoiCurrency === 'EUR' || currentRoiCurrency === 'USD') {
            boilerCost = (demand / boilerEff) * boilerPrice;
        } else {
            let energyPerUnit = 10.5; // Gas
            if (boilerType === 'oil') energyPerUnit = 10.0;
            else if (boilerType === 'lpg') energyPerUnit = 12.8;

            const unitsNeeded = demand / (energyPerUnit * boilerEff);
            boilerCost = unitsNeeded * boilerPrice;
        }

        const elecNeeded = demand / hpCop;
        const hpCost = elecNeeded * hpPrice;

        const annualSavings = boilerCost - hpCost;
        let paybackPeriod = 0;
        if (annualSavings > 0) {
            paybackPeriod = capex / annualSavings;
        }

        const valueEl = document.getElementById('roi-value');
        const statusPill = document.getElementById('roi-status-pill');
        const expEl = document.getElementById('roi-explanation');

        if (annualSavings <= 0) {
            valueEl.innerText = "N/A";
            statusPill.className = "status-pill danger";
            statusPill.innerText = "No ROI";
            expEl.innerHTML = `Under current tariff specs, Heat Pump operating cost exceeds the existing boiler. No savings generated.`;
            const actionsList = document.getElementById('roi-actions-list');
            if (actionsList) {
                actionsList.innerHTML = "No financial benefit under current settings. Heat pump electricity cost exceeds boiler fuel cost.";
            }
            return;
        }

        valueEl.innerText = paybackPeriod.toFixed(1) + (" Yrs");

        if (paybackPeriod <= 3.0) {
            statusPill.className = "status-pill optimal";
            statusPill.innerText = "Highly Viable";
        } else if (paybackPeriod > 3.0 && paybackPeriod <= 7.0) {
            statusPill.className = "status-pill warning";
            statusPill.innerText = "Moderately Viable";
        } else {
            statusPill.className = "status-pill danger";
            statusPill.innerText = "Long Payback";
        }

        let formattedSavings = "";
        if (currentRoiCurrency === 'EUR') {
            formattedSavings = "€" + annualSavings.toLocaleString(undefined, { maximumFractionDigits: 0 });
        } else if (currentRoiCurrency === 'USD') {
            formattedSavings = "$" + annualSavings.toLocaleString(undefined, { maximumFractionDigits: 0 });
        } else {
            formattedSavings = "₩" + annualSavings.toLocaleString(undefined, { maximumFractionDigits: 0 });
        }

        expEl.innerHTML = i18n[currentLang].roiExplanation
            .replace('{demand}', demand.toLocaleString())
            .replace('{savings}', formattedSavings)
            .replace('{payback}', paybackPeriod.toFixed(1));

        const actionsCard = document.getElementById('roi-actions-card');
        const actionsList = document.getElementById('roi-actions-list');
        if (actionsCard && actionsList) {
            if (annualSavings <= 0) {
                actionsList.innerHTML = `No financial benefit under current settings. Heat pump electricity cost exceeds boiler fuel cost.`;
            } else {
                let advise = `Upgrading to a heat pump will save you <strong>${formattedSavings}</strong> annually. `;
                if (paybackPeriod < 3) {
                    advise += `With a payback period of just ${paybackPeriod.toFixed(1)} years, this is a highly lucrative investment. It is strongly recommended to proceed with the CapEx upgrade.`;
                } else if (paybackPeriod > 7) {
                    advise += `A payback period of ${paybackPeriod.toFixed(1)} years is quite long. This might not be economically viable unless government agricultural subsidies or carbon credits are applied to the CapEx.`;
                } else {
                    advise += `The payback period of ${paybackPeriod.toFixed(1)} years is typical for agricultural infrastructure. Factor this into your 5-year depreciation schedule.`;
                }
                actionsList.innerHTML = advise;
            }
        }
    }

    const cropRsDb = {
        tomato: 100,
        pepper: 120,
        cucumber: 80,
        strawberry: 150,
        custom: 100
    };

    function applyTrCropPreset() {
        const crop = document.getElementById('tr-crop').value;
        const rsGroup = document.getElementById('grp-tr-rs');
        const rsInput = document.getElementById('tr-rs');
        
        if (crop === 'custom') {
            rsGroup.style.display = 'block';
        } else {
            rsGroup.style.display = 'none';
            rsInput.value = cropRsDb[crop];
        }
        calculateTranspirationEngine();
    }

    function calculateTranspirationEngine() {
        const T = parseFloat(document.getElementById('tr-temp').value);
        const RH = parseFloat(document.getElementById('tr-rh').value);
        const Rg = parseFloat(document.getElementById('tr-rad').value);
        const LAI = parseFloat(document.getElementById('tr-lai').value);
        const rs = parseFloat(document.getElementById('tr-rs').value);
        const u = parseFloat(document.getElementById('tr-wind').value);

        if (isNaN(T) || isNaN(RH) || isNaN(Rg) || isNaN(LAI) || isNaN(rs) || isNaN(u) || u <= 0 || LAI <= 0) {
            const actionsList = document.getElementById('trans-actions-list');
            if (actionsList) actionsList.innerHTML = "Please enter valid environmental inputs (Wind speed and Leaf Area Index must be greater than 0).";
            return;
        }

        const T_c = currentUnit === 'imperial' ? (T - 32) / 1.8 : T;
        const u_ms = currentUnit === 'imperial' ? u / 2.23694 : u;

        const es = 0.61078 * Math.exp((17.27 * T_c) / (T_c + 237.3));
        const Delta = (4098 * es) / Math.pow(T_c + 237.3, 2);
        const gamma = 0.066;
        const ea = es * (RH / 100);
        const VPD = es - ea;
        const Rn = Rg * 0.60;
        const ra = 250 / Math.max(0.05, u_ms);
        const rc = rs / (0.5 * LAI); 
        const lambda = 2.45; 
        const rho_a = 1.2;
        const Cp = 1.013;

        const numerator = (Delta * Rn) + ((rho_a * Cp * VPD * 1000) / ra);
        const denominator = Delta + (gamma * (1 + (rc / ra)));
        
        let LE = numerator / denominator;
        if (LE < 0) LE = 0;

        const etHr = (LE * 3600) / (lambda * 1000000); 
        const etDay = etHr * 10; 

        let displayEt = etHr;
        let displayEtDay = etDay;
        let etUnit = 'L/m²·h';
        if (currentUnit === 'imperial') {
            displayEt = etHr * 24.5424;
            displayEtDay = etDay * 24.5424;
            etUnit = 'gal/1000 ft²·h';
        }

        document.getElementById('trans-value').innerText = displayEt.toFixed(currentUnit === 'imperial' ? 2 : 3) + " " + etUnit;

        const statusPill = document.getElementById('trans-status-pill');
        if (etHr > 0.25) {
            statusPill.className = "status-pill optimal";
            statusPill.innerText = "High Transpiration";
        } else if (etHr > 0.05 && etHr <= 0.25) {
            statusPill.className = "status-pill optimal";
            statusPill.innerText = "Normal Transpiration";
        } else {
            statusPill.className = "status-pill danger";
            statusPill.innerText = "Stagnant Transpiration";
        }

        const expEl = document.getElementById('trans-explanation');
        let exp = i18n[currentLang].transExplanation
            .replace('{temp}', T.toFixed(1))
            .replace('{rh}', RH)
            .replace('{rad}', Rg)
            .replace('{et}', displayEt.toFixed(currentUnit === 'imperial' ? 2 : 3))
            .replace('{etDay}', displayEtDay.toFixed(currentUnit === 'imperial' ? 1 : 2));
            
        if (currentUnit === 'imperial') {
            exp = exp.replace('°C', '°F');
            exp = exp.replace(' L/m²·hr', ' gal/1000 ft²·h')
                     .replace(' mm/hr', '')
                     .replace(' L/m²·day', ' gal/1000 ft²·day');
        }
        expEl.innerHTML = exp;

        const actionsCard = document.getElementById('trans-actions-card');
        const actionsList = document.getElementById('trans-actions-list');
        if (actionsCard && actionsList) {
            let advise = `The crop is transpiring at <strong>${displayEt.toFixed(2)} ${etUnit}</strong>. `;
            if (etHr > 0.5) {
                advise += `This is a very high evaporation rate driven by strong radiation. <strong>Increase irrigation frequency immediately</strong> to prevent wilting. `;
            } else if (etHr < 0.1) {
                advise += `Transpiration is sluggish. The roots are not pulling water or calcium. Consider raising the greenhouse temperature or lowering humidity to stimulate water movement. `;
            } else {
                advise += `Transpiration is moderate and healthy. Maintain your current irrigation shot volumes. `;
            }
            actionsList.innerHTML = advise;
        }
    }

    // ==========================================
    // INTEGRATED TABS LOGIC
    // ==========================================

    // Subtab switching
    function switchPollinatorTab(subId) {
        document.querySelectorAll('#section-pollinator .segmented-control .segment-btn').forEach(btn => btn.classList.remove('active'));
        document.querySelectorAll('#section-pollinator .tab-content').forEach(content => content.classList.remove('active'));

        document.getElementById(`btn-subtab-${subId}`).classList.add('active');
        document.getElementById(`subtab-${subId}`).classList.add('active');
        
        if (subId === 'density') {
            calculateDensity();
        } else if (subId === 'activity') {
            simulateActivity();
        } else if (subId === 'pesticide') {
            updatePesticideUI();
        } else if (subId === 'diagnosis') {
            updateDiagnosisUI();
        }
    }

    function switchVerticalTab(subId) {
        document.querySelectorAll('#section-vertical .segmented-control .segment-btn').forEach(btn => btn.classList.remove('active'));
        document.querySelectorAll('#section-vertical .tab-content').forEach(content => content.classList.remove('active'));

        document.getElementById(`btn-subtab-${subId}`).classList.add('active');
        document.getElementById(`subtab-${subId}`).classList.add('active');
        
        if (subId === 'light') {
            calculateLight();
        } else if (subId === 'thermal') {
            calculateThermal();
        }
    }

    // Pollinator Safety - Autocomplete
    function setupAutocomplete() {
        const searchInput = document.getElementById('pest-search');
        const autocompleteList = document.getElementById('autocomplete-list');
        if (!searchInput || !autocompleteList) return;
        
        searchInput.addEventListener('input', () => {
            const query = searchInput.value.trim().toLowerCase();
            autocompleteList.innerHTML = '';
            if (!query) {
                autocompleteList.style.display = 'none';
                return;
            }

            const matches = pesticideDB.filter(p => 
                p.nameEn.toLowerCase().includes(query)
            );

            if (matches.length > 0) {
                matches.forEach(item => {
                    const li = document.createElement('div');
                    li.className = 'autocomplete-item';
                    li.innerText = item.nameEn;
                    li.addEventListener('click', () => {
                        searchInput.value = item.nameEn;
                        autocompleteList.style.display = 'none';
                        selectPesticide(item);
                    });
                    autocompleteList.appendChild(li);
                });
                autocompleteList.style.display = 'block';
            } else {
                autocompleteList.style.display = 'none';
            }
        });

        document.addEventListener('click', (e) => {
            if (!e.target.closest('.search-container')) {
                autocompleteList.style.display = 'none';
            }
        });
    }

    let selectedPesticideData = null;

    function selectPesticide(item) {
        selectedPesticideData = item;
        localStorage.setItem('pollinator_selected_pest', item.nameEn);
        updatePesticideUI();
    }

    function updatePesticideUI() {
        const resultDiv = document.getElementById('pest-result-content');
        if (!resultDiv) return;
        
        if (!selectedPesticideData) {
            resultDiv.innerHTML = `<p style="color: var(--text-gray); font-style: italic;">${i18n[currentLang].msgPestNoSearch}</p>`;
            return;
        }

        const item = selectedPesticideData;
        const name = item.nameEn;
        const type = item.typeEn;
        const desc = item.descEn;
        
        let toxText = "";
        let pillClass = "";
        if (item.toxicity === 'high') {
            toxText = i18n[currentLang].txtHigh;
            pillClass = "danger";
        } else if (item.toxicity === 'medium') {
            toxText = i18n[currentLang].txtMedium;
            pillClass = "warning";
        } else {
            toxText = i18n[currentLang].txtLow;
            pillClass = "optimal"; // using native optimal green class
        }

        resultDiv.innerHTML = `
            <div style="display: flex; flex-direction: column; gap: 1rem; text-align: left;">
                <div>
                    <h3 style="font-size: 1.3rem; color: var(--text-light);">${name}</h3>
                    <span style="font-size: 0.85rem; color: var(--text-gray);">${type}</span>
                </div>
                
                <div>
                    <span class="result-header">${i18n[currentLang].lblPestTox}</span>
                    <div style="margin-top: 0.3rem;">
                        <span class="status-pill ${pillClass}">${toxText}</span>
                    </div>
                </div>

                <div>
                    <span class="result-header">${i18n[currentLang].lblPestRei}</span>
                    <div style="font-size: 2.2rem; font-weight: 800; color: var(--text-light); margin-top: 0.2rem;">
                        ${item.reiDays} <span style="font-size: 1.1rem; font-weight: 600; color: var(--text-gray);">${i18n[currentLang].reiUnit}</span>
                    </div>
                </div>

                <div class="info-card" style="border-left: 4px solid ${item.toxicity === 'high' ? 'var(--danger)' : item.toxicity === 'medium' ? 'var(--warning)' : 'var(--success)'}; text-align: left;">
                    <h4>📋 ${i18n[currentLang].lblPestAction}</h4>
                    <p>${desc}</p>
                </div>
            </div>
        `;
    }

    // Pollinator Safety - Diagnosis
    function updatePartOptions() {
        const selectCrop = document.getElementById('diag-crop');
        const selectPart = document.getElementById('diag-part');
        const selectSymptom = document.getElementById('diag-symptom');
        if (!selectCrop || !selectPart || !selectSymptom) return;
        
        const crop = selectCrop.value;
        selectPart.innerHTML = `<option value="">${i18n[currentLang].lblSelectPlaceholder}</option>`;
        selectSymptom.innerHTML = `<option value="">${i18n[currentLang].lblSelectPlaceholder}</option>`;
        selectSymptom.disabled = true;
        
        if (!crop || !diagnosisDB[crop]) {
            selectPart.disabled = true;
            updateDiagnosisUI();
            return;
        }

        selectPart.disabled = false;
        const parts = Object.keys(diagnosisDB[crop]);
        parts.forEach(part => {
            const option = document.createElement('option');
            option.value = part;
            if (part === 'leaf') option.innerText = i18n[currentLang].partLeaf;
            else if (part === 'fruit') option.innerText = i18n[currentLang].partFruit;
            else option.innerText = i18n[currentLang].partStemRoot;
            selectPart.appendChild(option);
        });

        updateDiagnosisUI();
    }

    function updateSymptomOptions() {
        const selectCrop = document.getElementById('diag-crop');
        const selectPart = document.getElementById('diag-part');
        const selectSymptom = document.getElementById('diag-symptom');
        if (!selectCrop || !selectPart || !selectSymptom) return;
        
        const crop = selectCrop.value;
        const part = selectPart.value;
        
        selectSymptom.innerHTML = `<option value="">${i18n[currentLang].lblSelectPlaceholder}</option>`;
        
        if (!crop || !part || !diagnosisDB[crop][part]) {
            selectSymptom.disabled = true;
            updateDiagnosisUI();
            return;
        }

        selectSymptom.disabled = false;
        const symptoms = diagnosisDB[crop][part];
        symptoms.forEach(sym => {
            const option = document.createElement('option');
            option.value = sym.id;
            option.innerText = sym.symptomEn;
            selectSymptom.appendChild(option);
        });

        updateDiagnosisUI();
    }

    let activeDiagnosisData = null;

    function performDiagnosis() {
        const selectCrop = document.getElementById('diag-crop');
        const selectPart = document.getElementById('diag-part');
        const selectSymptom = document.getElementById('diag-symptom');
        if (!selectCrop || !selectPart || !selectSymptom) return;
        
        const crop = selectCrop.value;
        const part = selectPart.value;
        const symptomId = selectSymptom.value;

        localStorage.setItem('diag_crop', crop);
        localStorage.setItem('diag_part', part);
        localStorage.setItem('diag_symptom', symptomId);

        if (!crop || !part || !symptomId) {
            activeDiagnosisData = null;
            updateDiagnosisUI();
            return;
        }

        const symptomsList = diagnosisDB[crop][part];
        const match = symptomsList.find(s => s.id === symptomId);
        activeDiagnosisData = match || null;
        updateDiagnosisUI();
    }

    function updateDiagnosisUI() {
        const content = document.getElementById('diag-result-content');
        if (!content) return;
        
        if (!activeDiagnosisData) {
            content.innerHTML = `<p style="color: var(--text-gray); font-style: italic;">${i18n[currentLang].msgDiagNoSearch}</p>`;
            return;
        }

        const d = activeDiagnosisData;
        const diseaseName = d.diseaseEn;
        const remedyText = d.remedyEn;

        // Lookup multilingual names in pesticide database (pesticideDB)
        let chemicalNameToShow = null;
        if (d.suggestedChemical) {
            const chemObj = pesticideDB.find(c => c.nameEn.toLowerCase() === d.suggestedChemical.toLowerCase());
            if (chemObj) {
                chemicalNameToShow = chemObj.nameEn;
            } else {
                chemicalNameToShow = d.suggestedChemical; // Fallback
            }
        }

        let chemicalSectionHtml = "";
        if (chemicalNameToShow) {
            chemicalSectionHtml = `
                <div>
                    <span class="result-header">${i18n[currentLang].lblDiagChemical}</span>
                    <div style="font-size: 1.15rem; font-weight: 700; color: var(--primary); margin-top: 0.3rem;">
                        💊 ${chemicalNameToShow}
                    </div>
                    <button class="estimator-btn" style="margin-top: 0.8rem; font-size: 0.85rem; padding: 0.5rem 1rem; width: auto;" onclick="jumpToReiSimulator('${d.suggestedChemical}')">
                        ${i18n[currentLang].btnGoToRei}
                    </button>
                </div>
            `;
        } else {
            const naText = 'N/A (Physical control or non-toxic treatment)';
            chemicalSectionHtml = `
                <div>
                    <span class="result-header">${i18n[currentLang].lblDiagChemical}</span>
                    <div style="font-size: 0.95rem; color: var(--text-gray); font-style: italic; margin-top: 0.3rem;">
                        ${naText}
                    </div>
                </div>
            `;
        }

        content.innerHTML = `
            <div style="display: flex; flex-direction: column; gap: 1.5rem; text-align: left;">
                <div>
                    <span class="result-header">${i18n[currentLang].lblDiagDisease}</span>
                    <h3 style="font-size: 1.4rem; color: var(--warning); margin-top: 0.2rem;">${diseaseName}</h3>
                </div>

                <div class="info-card" style="border-left: 4px solid var(--warning); text-align: left;">
                    <h4>📋 ${i18n[currentLang].lblDiagRemedy}</h4>
                    <p>${remedyText}</p>
                </div>

                ${chemicalSectionHtml}

                <div style="margin-top: 1rem;">
                    <button class="estimator-btn" id="btn-diag-pdf" style="width: 100%; display: flex; align-items: center; justify-content: center; gap: 0.5rem; padding: 0.8rem 1.5rem; font-size: 1rem;" onclick="downloadDiagnosisPDF()">
                        📄 ${i18n[currentLang].btnPdfReport || "Download PDF Diagnosis Report (No Email)"}
                    </button>
                </div>
            </div>
        `;
    }

    function sendDiagnosisToSheet(actionType) {
        if (!activeDiagnosisData) return;
        
        const configUrl = window.DIAGNOSIS_COLLECTOR_URL || "";
        if (!configUrl || configUrl === "YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL") {
            console.log("Data collection skipped: Web App URL not configured.");
            return;
        }

        const selectCrop = document.getElementById('diag-crop');
        const selectPart = document.getElementById('diag-part');
        const selectSymptom = document.getElementById('diag-symptom');
        
        const crop = selectCrop ? selectCrop.value : "";
        const part = selectPart ? selectPart.value : "";
        const symptomId = selectSymptom ? selectSymptom.value : "";

        const payload = {
            timestamp: new Date().toISOString(),
            lang: currentLang,
            crop: crop,
            part: part,
            symptomId: symptomId,
            symptomText: activeDiagnosisData.symptomEn || "",
            disease: activeDiagnosisData.diseaseEn || "",
            remedy: activeDiagnosisData.remedyEn || "",
            chemical: activeDiagnosisData.suggestedChemical || "N/A",
            actionType: actionType || "Scout"
        };

        fetch(configUrl, {
            method: 'POST',
            mode: 'no-cors',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        })
        .then(() => {
            console.log("Diagnosis data logged successfully. Action: " + actionType);
        })
        .catch(err => {
            console.error("Error logging diagnosis data:", err);
        });
    }

    window.downloadDiagnosisPDF = function() {
        if (!activeDiagnosisData) return;

        // Log download action to Google Sheet
        sendDiagnosisToSheet('PDF Download');

        // Log GA4 custom event for conversion tracking
        if (typeof gtag === 'function') {
            gtag('event', 'pdf_report_download', {
                event_category: 'diagnosis',
                event_label: activeDiagnosisData.diseaseEn || 'unknown',
                value: 1
            });
        }

        const d = activeDiagnosisData;
        
        const selectCrop = document.getElementById('diag-crop');
        const cropName = selectCrop ? selectCrop.options[selectCrop.selectedIndex].text : "";
        const selectPart = document.getElementById('diag-part');
        const partName = selectPart ? selectPart.options[selectPart.selectedIndex].text : "";
        const selectSymptom = document.getElementById('diag-symptom');
        const symptomName = selectSymptom ? selectSymptom.options[selectSymptom.selectedIndex].text : d.symptomEn;
        
        const diseaseName = d.diseaseEn;
        const remedyText = d.remedyEn;
        
        let chemicalName = "N/A";
        let toxicityText = "N/A (Non-chemical / physical control suggested)";
        let safeGuideline = "N/A";
        let reiDaysText = "N/A";

        if (d.suggestedChemical) {
            chemicalName = d.suggestedChemical;
            const chemObj = pesticideDB.find(c => c.nameEn.toLowerCase() === d.suggestedChemical.toLowerCase());
            if (chemObj) {
                chemicalName = chemObj.nameEn;
                reiDaysText = chemObj.reiDays + " Days";
                safeGuideline = chemObj.descEn;
                
                if (chemObj.toxicity === 'high') {
                    toxicityText = "🔴 Highly Toxic (Danger to Bees)";
                } else if (chemObj.toxicity === 'medium') {
                    toxicityText = "🟡 Moderately Toxic (Warning)";
                } else {
                    toxicityText = "🟢 Relatively Bee-Safe (Green)";
                }
            }
        }

        const now = new Date();
        const formattedDate = now.getFullYear() + "-" + 
            String(now.getMonth() + 1).padStart(2, '0') + "-" + 
            String(now.getDate()).padStart(2, '0') + " " + 
            String(now.getHours()).padStart(2, '0') + ":" + 
            String(now.getMinutes()).padStart(2, '0') + ":" + 
            String(now.getSeconds()).padStart(2, '0');

        const labels = currentLang === 'ko' ? {
            title: "스마트팜 정밀 작물 자가진단 리포트",
            subtitle: "Smart Farm Precision Diagnosis & Treatment Report",
            metaTitle: "1. 예찰 및 진단 메타데이터 (Metadata)",
            time: "진단 일시",
            crop: "대상 작물 / 부위",
            symptom: "관찰된 이상 증상",
            resultTitle: "2. 진단 결과 및 분석 (Diagnosis)",
            disease: "의심되는 병해충/생리장해",
            remedyTitle: "3. 처방 및 조치 방안 (Remedy)",
            chemicalTitle: "4. 추천 농약 성분 및 꿀벌 안전 가이드 (Chemical Safety)",
            chemical: "추천 방제 성분",
            toxicity: "꿀벌 독성 등급",
            rei: "안전 재진입 대기기간 (REI)",
            guideline: "SOP 대응 및 살포 가이드라인",
            footer: "본 리포트는 Inwoovation 스마트팜 엔지니어링 랩(smartfarm.inwoovation.com)에서 실시간으로 발행되었습니다.",
            verified: "자가진단 무결성 인증됨"
        } : {
            title: "Smart Farm Precision Diagnosis Report",
            subtitle: "Horticultural Health & Pest Treatment Guidelines",
            metaTitle: "1. Scouting & Diagnostic Metadata",
            time: "Scouting Timestamp",
            crop: "Target Crop / Part",
            symptom: "Scouted Symptom Details",
            resultTitle: "2. Diagnostic Diagnosis Results",
            disease: "Suspected Disease / Pest / Deficit",
            remedyTitle: "3. Recommended Agronomic Remedies",
            chemicalTitle: "4. Chemical Treatment & Bee Safety Guidelines",
            chemical: "Active Ingredient",
            toxicity: "Bee Toxicity Level",
            rei: "Re-entry Interval (REI)",
            guideline: "SOP Hive Action Guidelines",
            footer: "Issued in real-time by Inwoovation Smart Farm Lab (smartfarm.inwoovation.com).",
            verified: "Self-Diagnosis Verified"
        };

        const printHtml = `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="utf-8">
                <title>${labels.title}</title>
                <style>
                    body {
                        font-family: 'Outfit', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
                        color: #111827;
                        line-height: 1.6;
                        margin: 0;
                        padding: 40px;
                        background-color: #ffffff;
                    }
                    .report-container {
                        max-width: 800px;
                        margin: 0 auto;
                        border: 1px solid #e5e7eb;
                        padding: 40px;
                        border-radius: 8px;
                        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
                    }
                    header {
                        border-bottom: 2px solid #10b981;
                        padding-bottom: 20px;
                        margin-bottom: 30px;
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                    }
                    .header-title h1 {
                        margin: 0;
                        font-size: 24px;
                        color: #064e3b;
                        font-weight: 800;
                    }
                    .header-title p {
                        margin: 5px 0 0 0;
                        font-size: 14px;
                        color: #6b7280;
                    }
                    .badge-verified {
                        background-color: #d1fae5;
                        color: #065f46;
                        font-size: 12px;
                        font-weight: 700;
                        padding: 6px 12px;
                        border-radius: 50px;
                        border: 1px solid #a7f3d0;
                        text-transform: uppercase;
                        letter-spacing: 0.05em;
                    }
                    h2 {
                        font-size: 16px;
                        color: #064e3b;
                        border-bottom: 1px solid #e5e7eb;
                        padding-bottom: 8px;
                        margin-top: 30px;
                        margin-bottom: 15px;
                        font-weight: 700;
                    }
                    .grid-meta {
                        display: grid;
                        grid-template-columns: 180px 1fr;
                        gap: 10px;
                        margin-bottom: 20px;
                        background-color: #f9fafb;
                        padding: 15px;
                        border-radius: 6px;
                        border: 1px solid #f3f4f6;
                    }
                    .grid-meta .label {
                        font-weight: 600;
                        color: #4b5563;
                        font-size: 14px;
                    }
                    .grid-meta .value {
                        color: #111827;
                        font-size: 14px;
                    }
                    .info-card {
                        background-color: #fffbeb;
                        border-left: 4px solid #f59e0b;
                        padding: 15px;
                        margin-bottom: 20px;
                        border-radius: 0 6px 6px 0;
                    }
                    .info-card p {
                        margin: 0;
                        font-size: 14px;
                        color: #78350f;
                    }
                    .chem-table {
                        width: 100%;
                        border-collapse: collapse;
                        margin-top: 10px;
                    }
                    .chem-table th, .chem-table td {
                        border: 1px solid #e5e7eb;
                        padding: 12px;
                        text-align: left;
                        font-size: 14px;
                    }
                    .chem-table th {
                        background-color: #f3f4f6;
                        color: #374151;
                        font-weight: 600;
                    }
                    footer {
                        margin-top: 50px;
                        border-top: 1px solid #e5e7eb;
                        padding-top: 15px;
                        text-align: center;
                        font-size: 12px;
                        color: #9ca3af;
                    }
                    @media print {
                        body {
                            padding: 0;
                        }
                        .report-container {
                            border: none;
                            box-shadow: none;
                            padding: 0;
                        }
                    }
                </style>
            </head>
            <body>
                <div class="report-container">
                    <header>
                        <div class="header-title">
                            <h1>${labels.title}</h1>
                            <p>${labels.subtitle}</p>
                        </div>
                        <div class="badge-verified">✓ ${labels.verified}</div>
                    </header>

                    <h2>${labels.metaTitle}</h2>
                    <div class="grid-meta">
                        <div class="label">${labels.time}</div>
                        <div class="value">${formattedDate}</div>
                        
                        <div class="label">${labels.crop}</div>
                        <div class="value">${cropName} / ${partName}</div>
                        
                        <div class="label">${labels.symptom}</div>
                        <div class="value">${symptomName}</div>
                    </div>

                    <h2>${labels.resultTitle}</h2>
                    <div class="info-card">
                        <div style="font-weight: 700; font-size: 16px; color: #b45309; margin-bottom: 5px;">${labels.disease}: ${diseaseName}</div>
                    </div>

                    <h2>${labels.remedyTitle}</h2>
                    <div style="font-size: 14px; background-color: #f0fdf4; border-left: 4px solid #10b981; padding: 15px; border-radius: 0 6px 6px 0; color: #065f46; margin-bottom: 20px;">
                        ${remedyText}
                    </div>

                    <h2>${labels.chemicalTitle}</h2>
                    <table class="chem-table">
                        <tr>
                            <th style="width: 30%;">${labels.chemical}</th>
                            <td style="font-weight: 600; color: #064e3b;">${chemicalName}</td>
                        </tr>
                        <tr>
                            <th>${labels.toxicity}</th>
                            <td>${toxicityText}</td>
                        </tr>
                        <tr>
                            <th>${labels.rei}</th>
                            <td style="font-weight: 600; color: #b45309;">${reiDaysText}</td>
                        </tr>
                        <tr>
                            <th>${labels.guideline}</th>
                            <td style="font-size: 13px; color: #4b5563;">${safeGuideline}</td>
                        </tr>
                    </table>

                    <footer>
                        <p>${labels.footer}</p>
                    </footer>
                </div>
                <script>
                    window.onload = function() {
                        window.print();
                    }
                </script>
            </body>
            </html>
        `;

        const printWindow = window.open('', '_blank');
        if (printWindow) {
            printWindow.document.open();
            printWindow.document.write(printHtml);
            printWindow.document.close();
        } else {
            alert("Please allow popups to download/print the PDF report.");
        }
    };

    function jumpToReiSimulator(chemicalName) {
        switchPollinatorTab('pesticide');
        document.getElementById('pest-search').value = chemicalName;
        
        const item = pesticideDB.find(p => p.nameEn.toLowerCase() === chemicalName.toLowerCase());
        if (item) {
            selectPesticide(item);
        } else {
            const event = new Event('input');
            document.getElementById('pest-search').dispatchEvent(event);
        }
        
        document.getElementById('pest-search').focus();
    }

    // Pollinator Safety - Density Math
    function calculateDensity() {
        const cropType = document.getElementById('crop-type').value;
        const area = parseFloat(document.getElementById('area').value) || 0;
        const season = document.getElementById('season').value;

        localStorage.setItem('pollinator_area', area);
        localStorage.setItem('pollinator_crop', cropType);
        localStorage.setItem('pollinator_season', season);

        let baseHivesPer1000Pyung = 9; 
        
        const cropWeights = {
            tomato: 1.0,
            strawberry: 0.75,
            melon: 1.2,
            blueberry: 0.9,
            pepper: 0.7
        };
        
        const seasonAdjustments = {
            spring_autumn: 1.0,
            summer: 0.8,
            winter: 1.25
        };

        const cropWeight = cropWeights[cropType] || 1.0;
        const seasonAdj = seasonAdjustments[season] || 1.0;

        const area_m2 = currentUnit === 'imperial' ? area / 10.7639 : area;
        let hivesCount = (area_m2 / 3300) * baseHivesPer1000Pyung * cropWeight * seasonAdj;
        hivesCount = Math.max(area_m2 > 0 ? 1 : 0, Math.round(hivesCount * 10) / 10);

        let lifespanText = "";
        if (season === 'summer') {
            lifespanText = "4 - 6 Weeks (Shortened by heat)";
        } else if (season === 'winter') {
            lifespanText = "8 - 10 Weeks (Extended cold life)";
        } else {
            lifespanText = "8 - 12 Weeks (Standard lifespan)";
        }

        const cropLabel = document.getElementById('crop-type').options[document.getElementById('crop-type').selectedIndex].text;
        const pyeong = Math.round(area_m2 * 0.3025);
        
        let formattedMath = i18n[currentLang].densityCalculationText
            .replace('{area}', area.toLocaleString())
            .replace('{pyeong}', pyeong)
            .replace('{crop}', cropLabel)
            .replace('{hives}', hivesCount);
            
        if (currentUnit === 'imperial') {
            formattedMath = formattedMath.replace(/ m²<\/strong> \(approx\. <strong>.*?<\/strong> pyeong\)/, ' sq ft</strong>');
        }

        document.getElementById('hives-value').innerText = hivesCount + (" Hives");
        document.getElementById('lifespan-value').innerText = lifespanText;

        let guideKey = "densityGuidelineTomato";
        if (cropType === 'strawberry') guideKey = "densityGuidelineStrawberry";
        else if (cropType === 'melon') guideKey = "densityGuidelineMelon";
        else if (cropType === 'blueberry') guideKey = "densityGuidelineBlueberry";
        else if (cropType === 'pepper') guideKey = "densityGuidelinePepper";

        document.getElementById('density-guide-text').innerHTML = formattedMath + "<br><br>" + i18n[currentLang][guideKey];
        updatePyeongHelpers();
    }

    // Pollinator Safety - Activity Simulator
    function simulateActivity() {
        const maxTemp = parseFloat(document.getElementById('max-temp').value) || 0;
        const minTemp = parseFloat(document.getElementById('min-temp').value) || 0;

        localStorage.setItem('pollinator_max_temp', maxTemp);
        localStorage.setItem('pollinator_min_temp', minTemp);

        const avgTemp = (maxTemp + minTemp) / 2;
        let score = 100;

        if (avgTemp >= 15 && avgTemp <= 25) {
            score = 100;
        } else if (avgTemp > 25) {
            const diff = avgTemp - 25;
            score = Math.max(0, 100 - (diff * 9));
        } else {
            const diff = 15 - avgTemp;
            score = Math.max(0, 100 - (diff * 10));
        }

        score = Math.round(score);

        let statusText = "";
        let pillClass = "";
        let guideText = "";

        if (score >= 80) {
            statusText = i18n[currentLang].actStatusOpt;
            pillClass = "optimal";
            guideText = i18n[currentLang].actGuideOpt;
        } else if (score >= 40) {
            statusText = i18n[currentLang].actStatusRestricted;
            pillClass = "warning";
            guideText = avgTemp < 15 ? i18n[currentLang].actGuideCold : i18n[currentLang].actGuideHot;
        } else {
            statusText = i18n[currentLang].actStatusDanger;
            pillClass = "danger";
            guideText = avgTemp < 15 ? i18n[currentLang].actGuideCold : i18n[currentLang].actGuideHot;
        }

        document.getElementById('activity-score-large').innerText = `${score}%`;
        document.getElementById('activity-score-desc').innerHTML = i18n[currentLang].actScoreText.replace('{score}', score);
        
        const statusPill = document.getElementById('activity-status-pill');
        statusPill.className = `status-pill ${pillClass}`;
        statusPill.innerText = statusText;
        
        document.getElementById('activity-guide-text').innerText = guideText;
    }

    // Vertical Farming - Crop preset applier
    function applyCropPreset() {
        const cropType = document.getElementById('crop-select').value;
        if (cropType !== 'custom') {
            const preset = verticalCrops[cropType];
            document.getElementById('target-dli').value = preset.dli.toFixed(1);
        }
    }

    // Vertical Farming - Spectrum display normalizer
    function updateSpectrum() {
        const r = parseFloat(document.getElementById('slide-red').value) || 0;
        const b = parseFloat(document.getElementById('slide-blue').value) || 0;
        const g = parseFloat(document.getElementById('slide-green').value) || 0;
        const f = parseFloat(document.getElementById('slide-far').value) || 0;

        const total = r + b + g + f || 1;
        
        const pctR = (r / total) * 100;
        const pctB = (b / total) * 100;
        const pctG = (g / total) * 100;
        const pctF = (f / total) * 100;

        document.getElementById('slide-red-val').innerText = pctR.toFixed(0) + '%';
        document.getElementById('slide-blue-val').innerText = pctB.toFixed(0) + '%';
        document.getElementById('slide-green-val').innerText = pctG.toFixed(0) + '%';
        document.getElementById('slide-far-val').innerText = pctF.toFixed(0) + '%';
    }

    // Vertical Farming - Light calculations
    function calculateLight() {
        const targetDli = parseFloat(document.getElementById('target-dli').value) || 16;
        const ppfd = parseFloat(document.getElementById('measured-ppfd').value) || 250;

        const r = parseFloat(document.getElementById('slide-red').value) || 0;
        const b = parseFloat(document.getElementById('slide-blue').value) || 0;
        const g = parseFloat(document.getElementById('slide-green').value) || 0;
        const f = parseFloat(document.getElementById('slide-far').value) || 0;
        const total = r + b + g + f || 1;

        const pctR = r / total;
        const pctB = b / total;
        const pctG = g / total;
        const pctF = f / total;

        // DLI = PPFD * Hours * 0.0036
        let optHours = targetDli / (ppfd * 0.0036);
        optHours = Math.max(1, Math.min(24, optHours));

        const actualDli = ppfd * optHours * 0.0036;

        document.getElementById('light-dli-val').innerHTML = `${actualDli.toFixed(1)} <span style="font-size: 1.1rem; font-weight: 600; color: var(--text-gray);">${i18n[currentLang].dliUnit}</span>`;
        document.getElementById('light-hours-val').innerHTML = `${optHours.toFixed(1)} <span style="font-size: 1.1rem; font-weight: 600; color: var(--text-gray);">${i18n[currentLang].hoursUnit}</span>`;

        if (optHours >= 24 && actualDli < targetDli) {
            document.getElementById('light-hours-desc').innerHTML = i18n[currentLang].ppfdTooLow;
        } else {
            document.getElementById('light-hours-desc').innerText = i18n[currentLang].lightHoursDesc;
        }

        document.getElementById('seg-red').style.width = (pctR * 100) + '%';
        document.getElementById('seg-blue').style.width = (pctB * 100) + '%';
        document.getElementById('seg-green').style.width = (pctG * 100) + '%';
        document.getElementById('seg-far').style.width = (pctF * 100) + '%';

        document.getElementById('pct-red-txt').innerText = (pctR * 100).toFixed(1) + '%';
        document.getElementById('pct-blue-txt').innerText = (pctB * 100).toFixed(1) + '%';
        document.getElementById('pct-green-txt').innerText = (pctG * 100).toFixed(1) + '%';
        document.getElementById('pct-far-txt').innerText = (pctF * 100).toFixed(1) + '%';

        document.getElementById('flux-red-txt').innerHTML = (ppfd * pctR).toFixed(1) + ' <span style="font-size:0.75rem;">μmol</span>';
        document.getElementById('flux-blue-txt').innerHTML = (ppfd * pctB).toFixed(1) + ' <span style="font-size:0.75rem;">μmol</span>';
        document.getElementById('flux-green-txt').innerHTML = (ppfd * pctG).toFixed(1) + ' <span style="font-size:0.75rem;">μmol</span>';
        document.getElementById('flux-far-txt').innerHTML = (ppfd * pctF).toFixed(1) + ' <span style="font-size:0.75rem;">μmol</span>';
        
        calculateThermal();
    }

    // Vertical Farming - LED Thermal & OPEX Modeler
    let thermalChart = null;

    function calculateThermal() {
        const pElec = parseFloat(document.getElementById('led-power').value) || 45;
        const nBars = parseFloat(document.getElementById('led-bars').value) || 120;
        const effOpt = parseFloat(document.getElementById('opt-efficiency').value) || 0.40;
        const aSink = parseFloat(document.getElementById('heatsink-area').value) || 2500;
        const hCoeff = parseFloat(document.getElementById('convective-h').value) || 10.0;
        const rate = parseFloat(document.getElementById('elec-rate').value) || 0.25;

        // DLI run-hours
        const targetDli = parseFloat(document.getElementById('target-dli').value) || 16;
        const ppfd = parseFloat(document.getElementById('measured-ppfd').value) || 250;
        let optHours = targetDli / (ppfd * 0.0036);
        optHours = Math.max(1, Math.min(24, optHours));

        // Thermal dissipation
        const pDiss = pElec * (1 - effOpt);

        // R_heatsink = 10000 / (hCoeff * aSink)
        const rHeatsink = 10000 / (hCoeff * aSink);
        const rInternal = 1.5; 
        const rTotal = rInternal + rHeatsink;

        const tAmb = 22.0; 
        const tJunction = tAmb + pDiss * rTotal;

        // OPEX
        const dailyKWh = (pElec * nBars * optHours) / 1000;
        const monthlyCost = dailyKWh * 30.4 * rate;
        
        // Handle KRW currency factor vs EUR
        const displayCost = monthlyCost;
        const currencySymbol = '€';
        const unitText = ' / Month';

        document.getElementById('thermal-tj-val').innerHTML = `${tJunction.toFixed(1)} <span style="font-size: 1.5rem; font-weight: 600; color: var(--text-gray);">°C</span>`;
        document.getElementById('thermal-cost-val').innerHTML = `${currencySymbol}${Math.round(displayCost).toLocaleString()} <span style="font-size: 1.5rem; font-weight: 600; color: var(--text-gray);">${unitText}</span>`;

        const tjDesc = document.getElementById('tj-desc');
        if (tJunction > 85) {
            tjDesc.innerHTML = i18n[currentLang].tjTooHigh;
        } else {
            tjDesc.innerText = i18n[currentLang].tjDesc;
        }

        // Draw Chart.js
        const hoursSplit = [8, 12, 16, 20];
        const costSplit = hoursSplit.map(hrs => {
            const rawCost = ((pElec * nBars * hrs) / 1000) * 30.4 * rate;
            return rawCost;
        });

        if (typeof Chart !== 'undefined') {
            if (thermalChart) {
                thermalChart.data.datasets[0].label = 'Monthly Energy Cost (€)';
                thermalChart.data.datasets[0].data = costSplit;
                thermalChart.data.labels = hoursSplit.map(hrs => `${hrs} Hours/Day`);
                thermalChart.update();
            } else {
                const ctx = document.getElementById('thermalChart').getContext('2d');
                thermalChart = new Chart(ctx, {
                    type: 'bar',
                    data: {
                        labels: hoursSplit.map(hrs => `${hrs} Hours/Day`),
                        datasets: [{
                            label: 'Monthly Energy Cost (€)',
                            data: costSplit,
                            backgroundColor: 'rgba(139, 92, 246, 0.75)', // Purple bars for premium feel
                            borderColor: 'rgba(139, 92, 246, 1)',
                            borderWidth: 1.5,
                            borderRadius: 6
                        }]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                            legend: { display: false }
                        },
                        scales: {
                            x: { ticks: { color: '#475569' }, grid: { color: 'rgba(15,23,42,0.05)' } },
                            y: { ticks: { color: '#475569' }, grid: { color: 'rgba(15,23,42,0.05)' } }
                        }
                    }
                });
            }
        } else {
            // Fallback rendering in case chart fails to load
            const wrapper = document.getElementById('thermal-chart-wrapper');
            const maxVal = Math.max(...costSplit);
            let html = '<div style="display: flex; flex-direction: column; gap: 0.8rem; padding: 1rem 0;">';
            for (let i = 0; i < hoursSplit.length; i++) {
                const pct = (costSplit[i] / maxVal) * 100;
                html += `
                    <div style="display: flex; flex-direction: column; gap: 0.2rem;">
                        <div style="display: flex; justify-content: space-between; font-size: 0.85rem; font-weight: 600; color: var(--text-gray);">
                            <span>${hoursSplit[i]}${' Hours/Day'}</span>
                            <span>${currencySymbol}${Math.round(costSplit[i]).toLocaleString()}</span>
                        </div>
                        <div style="width: 100%; height: 8px; background: rgba(15,23,42,0.05); border-radius: 4px; overflow: hidden;">
                            <div style="width: ${pct}%; height: 100%; background: var(--primary); border-radius: 4px;"></div>
                        </div>
                    </div>
                `;
            }
            html += '</div>';
            wrapper.innerHTML = html;
        }
    }

    // ==========================================
    // END OF INTEGRATED TABS LOGIC
    // ==========================================

    function handleFeedbackClick(event) {
        const btn = document.getElementById('btn-feedback');
        const href = btn.getAttribute('href');
        
        // Google Analytics 4 Custom Event for Feedback Link Clicks
        if (typeof gtag === 'function') {
            gtag('event', 'feedback_link_click', {
                'link_url': href
            });
        }

        if (href === '#' || href.includes('your-google-form-link')) {
            event.preventDefault();
            alert("Feedback Google Form link is not configured yet.\nPlease create your Google Form according to 'google_apps_script_guide.md' and replace the href in 'index.html' (line 1281) with your own Form link!");
        }
    }

    


    
    // INIT with URL parameters support
    document.addEventListener('DOMContentLoaded', () => {
        const urlParams = new URLSearchParams(window.location.search);
        
        // Load farm profile first to populate values before initial calculations
        if (typeof loadFarmProfile === 'function') loadFarmProfile();
        currentLang = 'en';

        // Restore Saved Preferences (with defensive guards)
        const restorePreference = (id, key) => {
            const el = document.getElementById(id);
            if (el) {
                const val = localStorage.getItem(key);
                if (val !== null) el.value = val;
            }
        };

        restorePreference('area', 'pollinator_area');
        restorePreference('crop-type', 'pollinator_crop');
        restorePreference('season', 'pollinator_season');
        restorePreference('max-temp', 'pollinator_max_temp');
        restorePreference('min-temp', 'pollinator_min_temp');

        const savedDiagCrop = localStorage.getItem('diag_crop');
        const selectCrop = document.getElementById('diag-crop');
        if (savedDiagCrop && selectCrop) {
            selectCrop.value = savedDiagCrop;
            if (typeof updatePartOptions === 'function') updatePartOptions();
            
            const savedDiagPart = localStorage.getItem('diag_part');
            const selectPart = document.getElementById('diag-part');
            if (savedDiagPart && selectPart) {
                selectPart.value = savedDiagPart;
                if (typeof updateSymptomOptions === 'function') updateSymptomOptions();
                
                const savedDiagSymptom = localStorage.getItem('diag_symptom');
                const selectSymptom = document.getElementById('diag-symptom');
                if (savedDiagSymptom && selectSymptom) {
                    selectSymptom.value = savedDiagSymptom;
                    if (typeof performDiagnosis === 'function') performDiagnosis();
                }
            }
        }

        const savedPest = localStorage.getItem('pollinator_selected_pest');
        if (savedPest) {
            if (typeof pesticideDB !== 'undefined') {
                const pestItem = pesticideDB.find(p => p.nameEn.toLowerCase() === savedPest.toLowerCase());
                if (pestItem) {
                    selectedPesticideData = pestItem;
                    const searchInput = document.getElementById('pest-search');
                    if (searchInput) {
                        searchInput.value = pestItem.nameEn;
                    }
                }
            }
        }

        // Set up pollinator safety & crop diagnosis listeners
        const searchInput = document.getElementById('pest-search');
        if (searchInput) {
            if (typeof setupAutocomplete === 'function') setupAutocomplete();
        }
        
        const diagCrop = document.getElementById('diag-crop');
        const diagPart = document.getElementById('diag-part');
        const diagSymptom = document.getElementById('diag-symptom');
        if (diagCrop && typeof updatePartOptions === 'function') diagCrop.addEventListener('change', updatePartOptions);
        if (diagPart && typeof updateSymptomOptions === 'function') diagPart.addEventListener('change', updateSymptomOptions);
        if (diagSymptom && typeof performDiagnosis === 'function') diagSymptom.addEventListener('change', () => {
            performDiagnosis();
            if (typeof sendDiagnosisToSheet === 'function') sendDiagnosisToSheet('Scout');
        });

        // Autofill inputs from farm profile before initial calculations run
        if (typeof autofillInputsFromProfile === 'function') autofillInputsFromProfile();

        // Run initial calculations for whichever sections are present on this page
        if (document.getElementById('section-vpd')) {
            if (typeof calculateVpdEngine === 'function') calculateVpdEngine();
        }
        if (document.getElementById('section-valve')) {
            if (typeof calculateValveEngine === 'function') calculateValveEngine();
        }
        if (document.getElementById('section-fert')) {
            if (typeof calculateFertEngine === 'function') calculateFertEngine();
            if (typeof runAcidEngine === 'function') runAcidEngine();
        }
        if (document.getElementById('section-heat-loss')) {
            if (typeof calculateHeatLossEngine === 'function') calculateHeatLossEngine();
        }
        if (document.getElementById('section-roi')) {
            if (typeof calculateRoiEngine === 'function') calculateRoiEngine();
        }
        if (document.getElementById('section-transpiration')) {
            if (typeof calculateTranspirationEngine === 'function') calculateTranspirationEngine();
        }
        if (document.getElementById('section-pollinator')) {
            if (typeof calculateDensity === 'function') calculateDensity();
            if (typeof simulateActivity === 'function') simulateActivity();
        }
        if (document.getElementById('section-vertical')) {
            if (typeof calculateLight === 'function') calculateLight();
            if (typeof calculateThermal === 'function') calculateThermal();
        }

        // Set active tab based on query param or present section
        const currentSection = 
            document.getElementById('section-vpd') ? 'vpd' :
            document.getElementById('section-valve') ? 'valve' :
            document.getElementById('section-fert') ? 'fert' :
            document.getElementById('section-heat-loss') ? 'heat-loss' :
            document.getElementById('section-roi') ? 'roi' :
            document.getElementById('section-transpiration') ? 'transpiration' :
            document.getElementById('section-pollinator') ? 'pollinator' :
            document.getElementById('section-vertical') ? 'vertical' :
            document.getElementById('section-market') ? 'market' : 'dashboard';

        const tabParam = urlParams.get('tab');
        if (tabParam && ['vpd', 'valve', 'fert', 'heat-loss', 'roi', 'transpiration', 'pollinator', 'vertical', 'market'].includes(tabParam)) {
            switchTab(tabParam);
        } else {
            // Only switch to dashboard if we actually have the dashboard section on this page,
            // which prevents redirect loops on info pages (about, contact, terms, privacy, greenpocket)
            if (currentSection !== 'dashboard' || document.getElementById('section-dashboard')) {
                switchTab(currentSection);
            }
        }

        // Connect feedback button
        const btnFeedback = document.getElementById('btn-feedback');
        if (btnFeedback) {
            btnFeedback.addEventListener('click', handleFeedbackClick);
        }
    });


    // ==========================================
    // FARM PROFILE MANAGEMENT LOGIC (GDPR Compliant)
    // ==========================================

    window.toggleFarmProfileDrawer = function() {
        const drawer = document.getElementById('farm-profile-drawer');
        if (drawer) {
            drawer.style.display = drawer.style.display === 'none' ? 'flex' : 'none';
        }
    };

    window.onProfileBoilerChange = function() {
        const boilerType = document.getElementById('prof-boiler').value;
        const suffix = document.getElementById('prof-boiler-price-suffix');
        const priceInput = document.getElementById('prof-boiler-price');
        if (suffix && priceInput) {
            if (boilerType === 'gas') {
                suffix.innerText = '₩/m³';
                if (priceInput.value === '1400' || priceInput.value === '1000') priceInput.value = '1000';
            } else {
                suffix.innerText = '₩/L';
                if (priceInput.value === '1000' || priceInput.value === '1400') priceInput.value = '1400';
            }
        }
    };

    window.onProfileCladdingChange = function() {
        const val = document.getElementById('prof-cladding').value;
        const wrapper = document.getElementById('prof-cladding-custom-wrapper');
        if (wrapper) {
            wrapper.style.display = (val === 'custom') ? 'block' : 'none';
        }
    };

    window.saveFarmProfile = function() {
        let claddingVal = document.getElementById('prof-cladding').value;
        let finalCladding = 5.5;
        if (claddingVal === 'custom') {
            finalCladding = parseFloat(document.getElementById('prof-cladding-custom').value) || 2.5;
        } else {
            finalCladding = parseFloat(claddingVal) || 5.5;
        }

        const profile = {
            area: parseFloat(document.getElementById('prof-area').value) || 1500,
            cladding: finalCladding,
            crop: document.getElementById('prof-crop').value || 'tomato',
            tank: parseFloat(document.getElementById('prof-tank').value) || 1000,
            injector: parseFloat(document.getElementById('prof-injector').value) || 100,
            boiler: document.getElementById('prof-boiler').value || 'gas',
            boilerPrice: parseFloat(document.getElementById('prof-boiler-price').value) || 1000,
            elecRate: parseFloat(document.getElementById('prof-elec-rate').value) || 80
        };

        localStorage.setItem('farmProfile', JSON.stringify(profile));
        
        // Trigger autofill on the active page
        window.autofillInputsFromProfile();
        
        // Re-calculate the active page simulator
        window.recalculateActiveSimulator();

        alert("Profile saved locally! All simulators have been updated with your farm specs.");
        window.toggleFarmProfileDrawer();
    };

    window.loadFarmProfile = function() {
        const data = localStorage.getItem('farmProfile');
        if (!data) return;

        try {
            const profile = JSON.parse(data);
            
            const setVal = (id, val) => {
                const el = document.getElementById(id);
                if (el) el.value = val;
            };

            setVal('prof-area', profile.area);
            
            const claddingSelect = document.getElementById('prof-cladding');
            let found = false;
            for (let i = 0; i < claddingSelect.options.length; i++) {
                if (parseFloat(claddingSelect.options[i].value) === profile.cladding) {
                    found = true;
                    setVal('prof-cladding', claddingSelect.options[i].value);
                    break;
                }
            }
            if (!found) {
                setVal('prof-cladding', 'custom');
                setVal('prof-cladding-custom', profile.cladding);
            }
            window.onProfileCladdingChange();

            setVal('prof-crop', profile.crop);
            setVal('prof-tank', profile.tank);
            setVal('prof-injector', profile.injector);
            setVal('prof-boiler', profile.boiler);
            
            // Trigger boiler suffix change
            window.onProfileBoilerChange();
            
            setVal('prof-boiler-price', profile.boilerPrice);
            setVal('prof-elec-rate', profile.elecRate);
        } catch (e) {
            console.error("Error parsing farm profile: ", e);
        }
    };

    window.autofillInputsFromProfile = function() {
        const data = localStorage.getItem('farmProfile');
        if (!data) return;

        try {
            const profile = JSON.parse(data);

            const fillInput = (id, val) => {
                const el = document.getElementById(id);
                if (el) {
                    el.value = val;
                    // Trigger input event to let JS controllers know the value changed
                    el.dispatchEvent(new Event('input'));
                }
            };

            // 1. VPD Page
            if (document.getElementById('section-vpd')) {
                // If crop is strawberry/herbs/etc., set crop stage/defaults
                if (profile.crop === 'strawberry') {
                    const btn = document.getElementById('stage-flower');
                    if (btn) btn.click();
                } else if (profile.crop === 'herbs') {
                    const btn = document.getElementById('stage-seedling');
                    if (btn) btn.click();
                }
            }

            // 2. Mixing Valve Page
            if (document.getElementById('section-valve')) {
                fillInput('est-area', profile.area);
                const selectCover = document.getElementById('est-cover');
                if (selectCover) {
                    let found = false;
                    for (let i = 0; i < selectCover.options.length; i++) {
                        if (parseFloat(selectCover.options[i].value) === profile.cladding) {
                            found = true;
                            break;
                        }
                    }
                    if (found) {
                        selectCover.value = profile.cladding;
                    } else {
                        selectCover.value = 'custom';
                        fillInput('est-cover-custom', profile.cladding);
                    }
                    selectCover.dispatchEvent(new Event('change'));
                }
            }

            // 3. Fertigation Page
            if (document.getElementById('section-fert')) {
                fillInput('fert-vol', profile.tank);
                fillInput('fert-ratio', profile.injector);
            }

            // 4. Heat Loss Page
            if (document.getElementById('section-heat-loss')) {
                fillInput('hl-area', profile.area);
                fillInput('hl-uvalue', profile.cladding);
                const selectPreset = document.getElementById('hl-preset');
                if (selectPreset) {
                    let found = false;
                    for (let i = 0; i < selectPreset.options.length; i++) {
                        if (parseFloat(selectPreset.options[i].value) === profile.cladding) {
                            found = true;
                            break;
                        }
                    }
                    if (found) {
                        selectPreset.value = profile.cladding;
                    } else {
                        selectPreset.value = 'custom';
                    }
                }
            }

            // 5. ROI Page
            if (document.getElementById('section-roi')) {
                const demand = Math.round(profile.area * 100);
                fillInput('roi-demand', demand);
                
                const selectBoiler = document.getElementById('roi-boiler-type');
                if (selectBoiler) {
                    selectBoiler.value = profile.boiler;
                    selectBoiler.dispatchEvent(new Event('change'));
                }
                
                fillInput('roi-boiler-price', profile.boilerPrice);
                fillInput('roi-hp-price', profile.elecRate);
            }

            // 6. Transpiration Page
            if (document.getElementById('section-transpiration')) {
                const selectCrop = document.getElementById('tr-crop');
                if (selectCrop) {
                    let optionExists = false;
                    for (let i = 0; i < selectCrop.options.length; i++) {
                        if (selectCrop.options[i].value === profile.crop) {
                            optionExists = true;
                            break;
                        }
                    }
                    if (optionExists) {
                        selectCrop.value = profile.crop;
                    } else {
                        selectCrop.selectedIndex = 0;
                    }
                    selectCrop.dispatchEvent(new Event('change'));
                }
            }

            // 7. Vertical Farming Page
            if (document.getElementById('section-vertical')) {
                fillInput('led-bars', Math.round(profile.area / 10)); // estimation
                fillInput('elec-rate', (profile.elecRate / 1300).toFixed(2));
                
                const selectCrop = document.getElementById('crop-select');
                if (selectCrop) {
                    let optionExists = false;
                    for (let i = 0; i < selectCrop.options.length; i++) {
                        if (selectCrop.options[i].value === profile.crop) {
                            optionExists = true;
                            break;
                        }
                    }
                    if (optionExists) {
                        selectCrop.value = profile.crop;
                    } else {
                        selectCrop.selectedIndex = 0;
                    }
                    selectCrop.dispatchEvent(new Event('change'));
                }
            }

            // 8. Crop Diagnosis & Pollinator Page
            if (document.getElementById('section-pollinator')) {
                const selectDiagCrop = document.getElementById('diag-crop');
                if (selectDiagCrop) {
                    selectDiagCrop.value = profile.crop;
                    selectDiagCrop.dispatchEvent(new Event('change'));
                }
                
                const selectCropType = document.getElementById('crop-type');
                if (selectCropType) {
                    selectCropType.value = profile.crop;
                    selectCropType.dispatchEvent(new Event('change'));
                }

                fillInput('area', profile.area);
            }
        } catch (e) {
            console.error("Error autofilling inputs: ", e);
        }
    };

    window.recalculateActiveSimulator = function() {
        if (document.getElementById('section-vpd') && typeof calculateVpdEngine === 'function') calculateVpdEngine();
        if (document.getElementById('section-valve') && typeof calculateValveEngine === 'function') calculateValveEngine();
        if (document.getElementById('section-fert')) {
            if (typeof calculateFertEngine === 'function') calculateFertEngine();
            if (typeof runAcidEngine === 'function') runAcidEngine();
        }
        if (document.getElementById('section-heat-loss') && typeof calculateHeatLossEngine === 'function') calculateHeatLossEngine();
        if (document.getElementById('section-roi') && typeof calculateRoiEngine === 'function') calculateRoiEngine();
        if (document.getElementById('section-transpiration') && typeof calculateTranspirationEngine === 'function') calculateTranspirationEngine();
        if (document.getElementById('section-vertical')) {
            if (typeof calculateLight === 'function') calculateLight();
            if (typeof calculateThermal === 'function') calculateThermal();
        }
    };

    window.exportFarmProfile = function() {
        const data = localStorage.getItem('farmProfile');
        if (!data) {
            alert("No farm profile saved yet. Please fill and save the profile first.");
            return;
        }
        const blob = new Blob([data], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'my-farm-profile.json';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    window.triggerProfileImport = function() {
        const fileInput = document.getElementById('prof-import-file');
        if (fileInput) fileInput.click();
    };

    window.importFarmProfile = function(event) {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = function(e) {
            try {
                const profile = JSON.parse(e.target.result);
                
                if (!profile.area || !profile.crop) {
                    alert("Invalid profile file format.");
                    return;
                }

                localStorage.setItem('farmProfile', JSON.stringify(profile));
                window.loadFarmProfile();
                window.autofillInputsFromProfile();
                window.recalculateActiveSimulator();
                
                alert("Profile successfully imported! All simulators have been updated.");
                window.toggleFarmProfileDrawer();
            } catch (err) {
                alert("Failed to parse JSON file: " + err.message);
            }
        };
        reader.readAsText(file);
    };

    // Amazon Associates Affiliate Module (Store ID: inwoovation20-20)
    window.AMAZON_ASSOCIATES_TAG = "inwoovation20-20";

    window.renderAmazonEquipmentCards = function(targetContainerId, pageType) {
        const container = document.getElementById(targetContainerId);
        if (!container) return;

        const amazonProducts = {
            vpd: [
                {
                    name: "Klein Tools IR1 Infrared Thermometer (-4 to 752°F)",
                    desc: "Essential precision IR temperature gun to measure exact leaf temperature offset for accurate VPD calculations.",
                    link: "https://www.amazon.com/dp/B07V77G39C?tag=" + window.AMAZON_ASSOCIATES_TAG,
                    badge: "Top Seller"
                },
                {
                    name: "Apera Instruments AI208 pH & EC Pocket Tester Kit",
                    desc: "High-precision dual meter for irrigation water, EC, and leaf sap pH monitoring.",
                    link: "https://www.amazon.com/dp/B01ENFOIQE?tag=" + window.AMAZON_ASSOCIATES_TAG,
                    badge: "High Precision"
                },
                {
                    name: "Inkbird Digital Humidity Controller (IHC-200)",
                    desc: "Dual-relay humidification & dehumidification controller for precise VPD target automation.",
                    link: "https://www.amazon.com/dp/B01J1E5LWM?tag=" + window.AMAZON_ASSOCIATES_TAG,
                    badge: "Automation"
                }
            ],
            fertigation: [
                {
                    name: "Bluelab PENPH pH Pen for Water",
                    desc: "Industry-standard waterproof pH pen with temperature compensation for stock tank mixing.",
                    link: "https://www.amazon.com/dp/B005POOJHG?tag=" + window.AMAZON_ASSOCIATES_TAG,
                    badge: "Grower Favorite"
                },
                {
                    name: "Apera Instruments AI311 Premium EC Conductivity Pen",
                    desc: "Pro-grade EC/TDS tester for precise fertilizer concentration checks.",
                    link: "https://www.amazon.com/dp/B01ENFOHN8?tag=" + window.AMAZON_ASSOCIATES_TAG,
                    badge: "High Precision"
                }
            ],
            vertical: [
                {
                    name: "Spider Farmer SF1000D LED Grow Light (Full Spectrum)",
                    desc: "High-efficiency Samsung LM301B LED board for optimal vertical farming DLI photoperiods.",
                    link: "https://www.amazon.com/dp/B084L1Y754?tag=" + window.AMAZON_ASSOCIATES_TAG,
                    badge: "High Efficiency"
                },
                {
                    name: "Photobio Quantum PAR Meter for Plant Lighting",
                    desc: "Accurate PPFD μmol/m²/s measurement tool for commercial horticulture.",
                    link: "https://www.amazon.com/dp/B07RZMZB5W?tag=" + window.AMAZON_ASSOCIATES_TAG,
                    badge: "Commercial Grade"
                }
            ],
            heat_loss: [
                {
                    name: "BTMETER BT-100 Digital Anemometer Wind Speed Meter",
                    desc: "Handheld wind velocity tester for outdoor greenhouse heat loss infiltration modeling.",
                    link: "https://www.amazon.com/dp/B01J141XNO?tag=" + window.AMAZON_ASSOCIATES_TAG,
                    badge: "Field Tool"
                },
                {
                    name: "FLIR ONE Gen 3 Thermal Imaging Camera for Smartphones",
                    desc: "Instantly detect greenhouse curtain leaks, draft gaps, and insulation cold spots.",
                    link: "https://www.amazon.com/dp/B0728C7KNC?tag=" + window.AMAZON_ASSOCIATES_TAG,
                    badge: "Diagnostic Tools"
                }
            ]
        };

        const products = amazonProducts[pageType] || amazonProducts['vpd'];
        
        let html = '<div class="amazon-affiliate-section" style="margin-top: 2rem; padding: 1.5rem; background: var(--bg-card); border: 1px solid var(--border-card); border-radius: 16px; text-align: left;">';
        html += '<div style="display:flex; justify-content:space-between; align-items:center; margin-bottom: 1rem; flex-wrap:wrap; gap:0.5rem;">';
        html += '<h3 style="font-size: 1.1rem; font-weight: 700; color: var(--text-light); margin:0;">🛒 Recommended Precision Tools & Equipment (Amazon)</h3>';
        html += '<span style="font-size: 0.72rem; color: var(--text-gray); opacity: 0.8;">Affiliate Link Disclosure: Purchases support free tool hosting.</span>';
        html += '</div>';
        html += '<div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 1rem;">';
        
        products.forEach(p => {
            html += `<div class="amazon-card" style="background: rgba(15, 23, 42, 0.03); border: 1px solid var(--border-card); border-radius: 12px; padding: 1rem; display: flex; flex-direction: column; justify-content: space-between;">
                <div>
                    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.4rem;">
                        <span style="font-size:0.68rem; background: rgba(234, 179, 8, 0.15); color: #eab308; padding: 0.2rem 0.5rem; border-radius: 6px; font-weight:700;">${p.badge}</span>
                    </div>
                    <h4 style="font-size: 0.92rem; font-weight: 700; margin: 0 0 0.4rem 0; color: var(--text-light); line-height: 1.3;">${p.name}</h4>
                    <p style="font-size: 0.78rem; color: var(--text-gray); margin: 0 0 0.8rem 0; line-height: 1.4;">${p.desc}</p>
                </div>
                <a href="${p.link}" target="_blank" rel="noopener sponsored" style="display: inline-flex; align-items: center; justify-content: center; gap: 0.4rem; background: linear-gradient(135deg, #ff9900 0%, #ffac31 100%); color: #111; font-weight: 700; font-size: 0.82rem; padding: 0.5rem 0.8rem; border-radius: 8px; text-decoration: none; transition: transform 0.2s;">
                    View on Amazon ↗
                </a>
            </div>`;
        });
        
        html += '</div></div>';
        container.innerHTML = html;
    };

    // ==========================================
    // 💡 Step 4 Retention: LocalStorage & 1-Click Share
    // ==========================================
    function initLocalStoragePersistence() {
        try {
            const inputs = document.querySelectorAll('.form-panel input[id], .form-panel select[id]');
            inputs.forEach(input => {
                const storageKey = 'sf_sav_' + input.id;
                const savedVal = localStorage.getItem(storageKey);
                if (savedVal !== null && savedVal !== undefined && savedVal !== "") {
                    input.value = savedVal;
                }
                const saveHandler = function() {
                    try { localStorage.setItem(storageKey, input.value); } catch(e) {}
                };
                input.addEventListener('input', saveHandler);
                input.addEventListener('change', saveHandler);
            });
        } catch(e) {
            console.warn("LocalStorage Persistence Init Warning:", e);
        }
    }

    window.copyResultSummary = function() {
        let title = document.title || "Smart Farm Calculation Result";
        let mainValEl = document.querySelector('.result-panel .big-number');
        let statusPillEl = document.querySelector('.result-panel .status-pill');
        let descEl = document.querySelector('.result-panel .result-desc');

        let mainVal = mainValEl ? mainValEl.textContent.trim() : "N/A";
        let statusPill = statusPillEl ? statusPillEl.textContent.trim() : "";
        let desc = descEl ? descEl.textContent.trim() : "";

        let currentUrl = window.location.href;
        let summaryText = `[🌱 Smart Farm Lab] ${title}\n• Result: ${mainVal} (${statusPill})\n• Note: ${desc}\n• Link: ${currentUrl}`;

        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(summaryText).then(() => {
                showToast("📋 Result Summary Copied to Clipboard! (결과 요약 복사됨)");
            }).catch(() => {
                fallbackCopyText(summaryText);
            });
        } else {
            fallbackCopyText(summaryText);
        }
    };

    function fallbackCopyText(text) {
        let textArea = document.createElement("textarea");
        textArea.value = text;
        document.body.appendChild(textArea);
        textArea.select();
        try {
            document.execCommand('copy');
            showToast("📋 Result Summary Copied to Clipboard! (결과 요약 복사됨)");
        } catch (err) {
            alert("Copy failed. Text:\n" + text);
        }
        document.body.removeChild(textArea);
    }

    function showToast(msg) {
        let existing = document.getElementById('sf-toast-msg');
        if (existing) existing.remove();

        let toast = document.createElement('div');
        toast.id = 'sf-toast-msg';
        toast.textContent = msg;
        toast.style.cssText = 'position:fixed; bottom:20px; right:20px; z-index:9999; background:linear-gradient(135deg, #10b981, #059669); color:#fff; font-weight:700; padding:12px 20px; border-radius:10px; box-shadow:0 10px 25px rgba(0,0,0,0.3); font-size:0.9rem; transition:all 0.3s ease;';
        document.body.appendChild(toast);

        setTimeout(() => {
            toast.style.opacity = '0';
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }

    document.addEventListener("DOMContentLoaded", function() {
        initLocalStoragePersistence();

        // Inject 1-Click Copy Result Button into Result Panels if not present
        const resultPanels = document.querySelectorAll('.result-panel');
        resultPanels.forEach(panel => {
            if (!panel.querySelector('.btn-copy-result')) {
                let copyBtn = document.createElement('button');
                copyBtn.className = 'btn-copy-result';
                copyBtn.type = 'button';
                copyBtn.innerHTML = '📋 Copy Result Summary (결과 요약 복사)';
                copyBtn.style.cssText = 'margin-top:1rem; width:100%; padding:0.6rem 1rem; background:rgba(16, 185, 129, 0.12); border:1px solid rgba(16, 185, 129, 0.4); color:var(--primary); font-weight:700; border-radius:10px; cursor:pointer; font-size:0.85rem; transition:all 0.2s;';
                copyBtn.onmouseover = () => { copyBtn.style.background = 'rgba(16, 185, 129, 0.25)'; };
                copyBtn.onmouseout = () => { copyBtn.style.background = 'rgba(16, 185, 129, 0.12)'; };
                copyBtn.onclick = window.copyResultSummary;
                panel.appendChild(copyBtn);
            }
        });
    });




