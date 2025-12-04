

export interface PlantPart {
  id: string;
  title: string;
  shortDescription: string;
  fullDescription: string;
  
  // Educational Content Fields
  whatItDoes: string; // Detailed process description
  equipmentTypes: string[];
  performance: string[];
  commonIssues: string[];
  optimisation: string[];
  regulations: string[];

  technicalDetails: string[];
  color: string;
}

export const PLANT_DATA: Record<string, PlantPart> = {
  'feedstock': {
    id: 'feedstock',
    title: 'Feedstock Reception',
    shortDescription: 'Where organic waste enters the system.',
    fullDescription: 'The process begins here. Organic materials such as agricultural waste, manure, energy crops, or food waste are collected, inspected, and pre-treated.',
    whatItDoes: 'The reception area acts as the gateway to the plant. Its primary role is to accept raw materials, verify their quality/weight, and prepare them for digestion. This often involves maceration (chopping) to increase surface area and removing contaminants like stones or plastic which could damage pumps.',
    equipmentTypes: [
      'Weighbridge for tonnage tracking',
      'Silage Clamps (concrete bunkers)',
      'Reception Tanks (underground)',
      'Macerators / Hammer Mills',
      'De-packaging units (for food waste)',
      'Stone Traps'
    ],
    performance: [
      'Particle size < 12mm is ideal for bacterial access',
      'Freshness of feedstock affects gas potential',
      'Homogeneity of mix prevents shock loading'
    ],
    commonIssues: [
      'Contamination (plastic/metals) causing blockages',
      'Odor complaints from reception building',
      'Leachate runoff from silage clamps',
      'Grit accumulation in tanks'
    ],
    optimisation: [
      'Minimize storage time to prevent pre-fermentation losses',
      'Blend feedstocks for optimal C:N ratio (25:1)',
      'Use air extraction with carbon filters for odor control'
    ],
    regulations: [
      'Animal By-Products (ABP) regulations (Clean/Dirty zones)',
      'Odor Management Plan compliance',
      'Duty of Care waste transfer notes',
      'Planning conditions regarding vehicle movements'
    ],
    technicalDetails: [
      'Input types: Slurry, Maize, Food Waste',
      'Pre-treatment: Maceration/Chopping',
      'Storage: Silage clamps or reception tanks'
    ],
    color: '#84cc16' // lime-500
  },
  'feeder': {
    id: 'feeder',
    title: 'Feeding System',
    shortDescription: 'Automated transfer of inputs to the digester.',
    fullDescription: 'Solid feedstock is loaded into a hopper which feeds the digester at a steady, controlled rate via screw conveyors or pumps.',
    whatItDoes: 'The feeding module serves as the interface between raw storage and the biological process. It doses specific amounts of material into the digester at set intervals. This consistency is crucial—"little and often"—to maintain a stable environment for the bacteria without causing acid spikes.',
    equipmentTypes: [
      'Solids Hopper with walking floor',
      'Vertical/Horizontal Screw Augers',
      'Macerating Pumps',
      'Liquid feed pumps (rotary lobe)',
      'Load cells (weighing sensors)'
    ],
    performance: [
      'Dosing accuracy (+/- 1%)',
      'Energy consumption per tonne fed',
      'Reliability / Uptime'
    ],
    commonIssues: [
      'Bridging (material getting stuck in hopper)',
      'Foreign object damage to screws',
      'Wear on auger flights reducing efficiency',
      'Blockages in pipework'
    ],
    optimisation: [
      'Feed every 30-60 mins rather than once a day',
      'Automated integration with gas production levels',
      'Regular wear part replacement schedule'
    ],
    regulations: [
      'Machinery Directive (PUWER) - Guarding',
      'Confined space regulations (during maintenance)',
      'ATEX rating if near gas zones'
    ],
    technicalDetails: [
      'Mechanism: Screw conveyor / Pump',
      'Automation: Load cells control weight',
      'Frequency: Hourly feeding cycles'
    ],
    color: '#eab308' // yellow-500
  },
  'digester': {
    id: 'digester',
    title: 'Primary Digester',
    shortDescription: 'The heart of the plant where fermentation occurs.',
    fullDescription: 'This large, airtight, heated tank is where anaerobic bacteria break down organic matter to release biogas (methane and CO2).',
    whatItDoes: 'Inside the digester, a four-stage biological process occurs: Hydrolysis, Acidogenesis, Acetogenesis, and Methanogenesis. Complex organic polymers are broken down into simple sugars, then acids, and finally methane. The tank must be heated (typically 38-42°C) and mixed to ensure bacteria encounter food and to prevent crust formation.',
    equipmentTypes: [
      'CSTR (Continuous Stirred-Tank Reactor)',
      'Glass-fused-to-steel or Concrete tanks',
      'Submersible / Paddle Mixers',
      'Heating coils (internal) or Heat exchangers (external)',
      'Temperature & Level sensors'
    ],
    performance: [
      'Biogas Yield (m³/tonne VS)',
      'Retention Time (30-60 days typically)',
      'Organic Loading Rate (kg VS/m³/day)',
      'FOS/TAC Ratio (Indicator of stability)'
    ],
    commonIssues: [
      'Acidosis (pH drop killing methanogens)',
      'Foaming (caused by proteins or instability)',
      'Grit/Sand build-up reducing volume',
      'Mixer failure leading to crusting'
    ],
    optimisation: [
      'Keep temperature stable (+/- 0.5°C)',
      'Trace element dosing (Cobalt, Nickel, Selenium)',
      'Optimize mixing cycles to save energy',
      'Recirculate digestate to seed new material'
    ],
    regulations: [
      'DSEAR (Explosive Atmospheres)',
      'Pressure Systems Safety Regulations (PSSR)',
      'Environmental Permit conditions'
    ],
    technicalDetails: [
      'Temperature: 38°C - 42°C (Mesophilic)',
      'Retention Time: 30-60 days',
      'Agitation: Paddle or submersible mixers'
    ],
    color: '#10b981' // emerald-500
  },
  'gas-holder': {
    id: 'gas-holder',
    title: 'Biogas Storage',
    shortDescription: 'Flexible double-membrane dome for gas storage.',
    fullDescription: 'Captures and stores the produced biogas, acting as a buffer to ensure a constant supply to the CHP engine.',
    whatItDoes: 'The gas holder typically sits on top of the digester (though can be separate). It consists of an inner gas bag and an outer weather protection membrane. An air blower maintains pressure between them to hold the shape against wind/snow. It buffers short-term fluctuations in gas production.',
    equipmentTypes: [
      'Double-membrane roof',
      'Steel gas storage tanks',
      'External gas bags',
      'Pressure Relief Valves (PRV)',
      'Gas flare (emergency burn-off)'
    ],
    performance: [
      'Storage capacity (hours of engine run-time)',
      'Leak tightness',
      'Pressure handling (typically 5-15 mbar)'
    ],
    commonIssues: [
      'UV degradation of membranes',
      'Over-pressure venting (loss of revenue)',
      'Condensate blocking gas lines',
      'Air ingress (creating explosive mixture)'
    ],
    optimisation: [
      'Active pressure control to minimize flaring',
      'Regular leak detection surveys (methane is a potent GHG)',
      'Desulphurization (adding air/iron sponge)'
    ],
    regulations: [
      'DSEAR Zoning (Zone 0/1/2)',
      'Lightning protection requirements',
      'Flare operation logging (Environmental Agency)'
    ],
    technicalDetails: [
      'Composition: ~55% CH4, ~45% CO2',
      'Pressure: ~5-15 mbar',
      'Safety: Pressure relief valves installed'
    ],
    color: '#06b6d4' // cyan-500
  },
  'chp': {
    id: 'chp',
    title: 'CHP Unit',
    shortDescription: 'Combined Heat and Power generator.',
    fullDescription: 'Converts cleaned biogas into electricity for the grid and heat for the plant processes.',
    whatItDoes: 'The CHP is a modified internal combustion engine connected to a generator. It burns methane to produce electricity. The "Combined Heat" part refers to capturing thermal energy from the engine jacket and exhaust to heat water. This hot water heats the digesters, making the plant self-sufficient.',
    equipmentTypes: [
      'Reciprocating Gas Engines (Jenbacher, MAN)',
      'Gas Turbines (larger scale)',
      'Active Carbon Filters (gas cleaning)',
      'Gas dehumidifiers / Chillers'
    ],
    performance: [
      'Electrical Efficiency (~38-42%)',
      'Total Efficiency (>85% with heat use)',
      'Availability (>8000 hours/year target)'
    ],
    commonIssues: [
      'H2S damage (acid corrosion) to internals',
      'Siloxanes (from soaps) forming glass on pistons',
      'Spark plug wear',
      'Grid connection trips (G99 faults)'
    ],
    optimisation: [
      'Gas scrubbing to remove H2S and moisture',
      'Oil analysis to predict engine health',
      'Participating in grid balancing services',
      'Exporting excess heat to neighbors'
    ],
    regulations: [
      'Medium Combustion Plant Directive (MCPD) - NOx/SOx limits',
      'Grid Code Compliance (G99)',
      'Noise pollution regulations'
    ],
    technicalDetails: [
      'Efficiency: ~40% Electric, ~45% Thermal',
      'Output: Electricity to Grid',
      'By-product: Hot water'
    ],
    color: '#f97316' // orange-500
  },
  'separator': {
    id: 'separator',
    title: 'Separator',
    shortDescription: 'Separates remaining material into solid and liquid.',
    fullDescription: 'Mechanically separates digestate into solid fibers (soil conditioner) and liquid liquor (bio-fertilizer).',
    whatItDoes: 'After digestion is complete, the material is pumped here. The separator squeezes the liquid out of the solids. The solid fraction is rich in organic matter and phosphorus (P), making it stackable and easy to transport. The liquid contains most of the nitrogen (N) and potassium (K).',
    equipmentTypes: [
      'Screw Press (most common)',
      'Decanter Centrifuge',
      'Belt Press',
      'Vibrating Screen'
    ],
    performance: [
      'Dry Solids % of cake (target >25%)',
      'Capture rate of P (in solids) vs N (in liquid)',
      'Throughput (m³/hour)'
    ],
    commonIssues: [
      'Screen blinding (clogging)',
      'Wear on screw flights from grit',
      'Overflow due to blockage',
      'Poor separation due to thin digestate'
    ],
    optimisation: [
      'Adjusting back-pressure weights/springs',
      'Using polymers to flocculate (if permitted)',
      'Regular cleaning of screens'
    ],
    regulations: [
      'End of Waste criteria (if selling solids)',
      'Pollution prevention (bunding required)',
      'Bio-aerosol monitoring if near housing'
    ],
    technicalDetails: [
      'Type: Screw press',
      'Solids: Used as bedding or soil conditioner',
      'Liquids: High-N liquid bio-fertilizer'
    ],
    color: '#a8a29e' // stone-400
  },
  'storage': {
    id: 'storage',
    title: 'Digestate Storage',
    shortDescription: 'Storage for bio-fertilizer.',
    fullDescription: 'Large lagoons or tanks that hold the liquid bio-fertilizer until it can be spread on land.',
    whatItDoes: 'Storage acts as a buffer between continuous production and seasonal demand for fertilizer. Farmers cannot spread in winter (run-off risk) or just before harvest. Thus, plants typically need 6 months of storage capacity. The digestate continues to mature here, stabilizing further.',
    equipmentTypes: [
      'Earth-banked Lagoons (lined)',
      'Concrete Circular Tanks',
      'Flexible Bladder Tanks',
      'Floating Covers / Tensioned Roofs'
    ],
    performance: [
      'Total capacity vs required spreading window',
      'Mixing ability (to prevent sedimentation)',
      'Ammonia retention'
    ],
    commonIssues: [
      'Crust formation (too thick to mix)',
      'Sediment build-up reducing capacity',
      'Rainwater dilution (if uncovered)',
      'Ammonia emissions (odor/nutrient loss)'
    ],
    optimisation: [
      'Covering stores (reduces rain ingress & ammonia loss)',
      'Separating rainwater from yard run-off',
      'Using dribble bars for spreading to reduce odor'
    ],
    regulations: [
      'SSAFO Regulations (Silage, Slurry and Agricultural Fuel Oil)',
      'NVZ (Nitrate Vulnerable Zones) closed periods',
      'Farming Rules for Water'
    ],
    technicalDetails: [
      'Capacity: 6 months storage typically required',
      'Application: Dribble bar / Trailing shoe',
      'Benefit: Closed nutrient loop'
    ],
    color: '#78716c' // stone-500
  }
};

export interface FeedstockStyles {
  dotColor: string;
  iconBg: string;
  iconText: string;
  alertBg: string;
  alertBorder: string;
  alertTitle: string;
  alertText: string;
}

export interface Feedstock {
  id: string;
  name: string;
  description: string;
  
  // Math Engine Constants
  biogasYield10DM: number; // m3/tonne at 10% Dry Matter
  methaneBasePercent: number; // Base % before modifiers
  
  // Library Attributes
  dmRange: string;
  contaminationNotes: string;
  storageNotes: string;
  preTreatmentNotes: string;
  nitrogenPotential: 'Low' | 'Medium' | 'High' | 'Very High';
  operationalNotes: string;

  color: string;
  themeClass: string;
  styles: FeedstockStyles;
  
  // Display Helpers
  expectedGasYield: string;
  methaneContent: string;
  contaminationRisk: string;
  requiredPreTreatment: string;
  digestateCharacteristics: string;
  revenueRoutes: string;
  impacts: Record<string, string>;
}

export const FEEDSTOCKS: Record<string, Feedstock> = {
  'manure': {
    id: 'manure',
    name: 'Cow Manure',
    description: 'Farm yard manure with straw.',
    biogasYield10DM: 180,
    methaneBasePercent: 54,
    dmRange: '20% - 25%',
    contaminationNotes: 'Stones from yard cleaning.',
    storageNotes: 'Concrete pads/clamps.',
    preTreatmentNotes: 'Maceration essential for straw.',
    nitrogenPotential: 'Medium',
    operationalNotes: 'Stable baseload. Low energy density.',
    color: '#78350f',
    themeClass: 'amber',
    styles: {
      dotColor: 'bg-amber-700',
      iconBg: 'bg-amber-100',
      iconText: 'text-amber-700',
      alertBg: 'bg-amber-50',
      alertBorder: 'border-amber-700',
      alertTitle: 'text-amber-900',
      alertText: 'text-amber-800'
    },
    expectedGasYield: '25 - 40 m³/tonne',
    methaneContent: '54%',
    contaminationRisk: 'Low (Stones)',
    requiredPreTreatment: 'Maceration',
    digestateCharacteristics: 'High fiber, Standard NPK',
    revenueRoutes: 'Cost savings (Fertilizer)',
    impacts: {
      'feedstock': 'Solid manure requires a robust hopper and macerators to chop straw bedding.',
      'digester': 'Provides excellent buffering capacity and bacterial stability, though gas yield per volume is low.',
      'separator': 'Produces excellent fiber suitable for re-use as cattle bedding.',
      'storage': 'Digestate has significantly reduced odor compared to raw manure.'
    }
  },
  'slurry': {
    id: 'slurry',
    name: 'Dairy Slurry',
    description: 'Liquid farm waste.',
    biogasYield10DM: 160,
    methaneBasePercent: 52,
    dmRange: '4% - 8%',
    contaminationNotes: 'Low risk. Grit accumulation possible.',
    storageNotes: 'Reception pits/tanks.',
    preTreatmentNotes: 'Screening for stones.',
    nitrogenPotential: 'Low',
    operationalNotes: 'Very high volume, low yield per tonne.',
    color: '#57534e',
    themeClass: 'stone',
    styles: {
      dotColor: 'bg-stone-600',
      iconBg: 'bg-stone-100',
      iconText: 'text-stone-700',
      alertBg: 'bg-stone-50',
      alertBorder: 'border-stone-500',
      alertTitle: 'text-stone-800',
      alertText: 'text-stone-700'
    },
    expectedGasYield: '15 - 25 m³/tonne',
    methaneContent: '52%',
    contaminationRisk: 'Low',
    requiredPreTreatment: 'Screening (Stones)',
    digestateCharacteristics: 'Low Dry Solids, Liquid Fertilizer',
    revenueRoutes: 'Cost savings',
    impacts: {
      'feedstock': 'Pumped directly into reception tanks. Easiest material to handle but high volume.',
      'feeder': 'Uses rotary lobe pumps rather than screw conveyors.',
      'digester': 'High water content means large tank volumes are needed for sufficient retention time.',
      'storage': 'Requires large liquid storage capacity due to high volumes processed.'
    }
  },
  'crops': {
    id: 'crops',
    name: 'Maize Silage',
    description: 'High energy crop.',
    biogasYield10DM: 200,
    methaneBasePercent: 58,
    dmRange: '30% - 35%',
    contaminationNotes: 'Very low.',
    storageNotes: 'Silage clamps. Must be airtight.',
    preTreatmentNotes: 'Precision chopping during harvest.',
    nitrogenPotential: 'Medium',
    operationalNotes: 'High cost input. Consistent quality.',
    color: '#a3e635',
    themeClass: 'lime',
    styles: {
      dotColor: 'bg-lime-500',
      iconBg: 'bg-lime-100',
      iconText: 'text-lime-600',
      alertBg: 'bg-lime-50',
      alertBorder: 'border-lime-500',
      alertTitle: 'text-lime-800',
      alertText: 'text-lime-900'
    },
    expectedGasYield: '200 - 220 m³/tonne',
    methaneContent: '58%',
    contaminationRisk: 'Very Low',
    requiredPreTreatment: 'Precision Chopping',
    digestateCharacteristics: 'Balanced Nutrient Profile',
    revenueRoutes: 'Energy Sales (Crop is a cost)',
    impacts: {
      'feedstock': 'Stored in clamps. Must be kept airtight to prevent aerobic spoilage before digestion.',
      'digester': 'High energy density. Can cause acidification if fed too fast. Requires robust mixing.',
      'separator': 'Produces bulky fibrous solid fraction.',
      'chp': 'High gas yield generates maximum revenue per tonne processed.'
    }
  },
  'food_waste': {
    id: 'food_waste',
    name: 'Food Waste',
    description: 'Commercial/Household scraps.',
    biogasYield10DM: 220,
    methaneBasePercent: 60,
    dmRange: '15% - 25%',
    contaminationNotes: 'High (Plastic, Cutlery, Glass).',
    storageNotes: 'Enclosed reception hall (Odor control).',
    preTreatmentNotes: 'De-packaging & Pasteurisation (ABP).',
    nitrogenPotential: 'High',
    operationalNotes: 'High yield but prone to instability/foaming.',
    color: '#f97316',
    themeClass: 'orange',
    styles: {
      dotColor: 'bg-orange-500',
      iconBg: 'bg-orange-100',
      iconText: 'text-orange-600',
      alertBg: 'bg-orange-50',
      alertBorder: 'border-orange-500',
      alertTitle: 'text-orange-900',
      alertText: 'text-orange-800'
    },
    expectedGasYield: '160 - 180 m³/tonne',
    methaneContent: '60%',
    contaminationRisk: 'High (Plastics/Metals)',
    requiredPreTreatment: 'De-packaging & Pasteurization',
    digestateCharacteristics: 'High Nitrogen, Regulated',
    revenueRoutes: 'Gate Fees + Energy',
    impacts: {
      'feedstock': 'Requires intense pre-treatment: removal of packaging and heating to 70°C for 1 hour (Pasteurization).',
      'digester': 'Very rapid breakdown. Can be volatile. Needs careful monitoring of FOS/TAC ratio.',
      'gas-holder': 'Produces high quality gas with good methane content.',
      'storage': 'Strict veterinary controls on where digestate can be spread (no grazing land).'
    }
  },
  'rye': {
    id: 'rye',
    name: 'Wholecrop Rye',
    description: 'Cereal crop silage.',
    biogasYield10DM: 195,
    methaneBasePercent: 55,
    dmRange: '30% - 40%',
    contaminationNotes: 'Low.',
    storageNotes: 'Silage clamps.',
    preTreatmentNotes: 'Chopping.',
    nitrogenPotential: 'Medium',
    operationalNotes: 'Alternative to maize. Good for rotation.',
    color: '#d4d4d8', // zinc-300
    themeClass: 'zinc',
    styles: {
      dotColor: 'bg-zinc-400',
      iconBg: 'bg-zinc-100',
      iconText: 'text-zinc-600',
      alertBg: 'bg-zinc-50',
      alertBorder: 'border-zinc-400',
      alertTitle: 'text-zinc-800',
      alertText: 'text-zinc-700'
    },
    expectedGasYield: '170 - 190 m³/tonne',
    methaneContent: '55%',
    contaminationRisk: 'Low',
    requiredPreTreatment: 'Chopping',
    digestateCharacteristics: 'Good fiber',
    revenueRoutes: 'Energy Sales',
    impacts: {
      'feedstock': 'Harvested earlier than maize. Fits well into crop rotation.',
      'digester': 'Slightly slower breakdown than maize due to straw content.',
    }
  },
  'chicken': {
    id: 'chicken',
    name: 'Chicken Manure',
    description: 'Poultry litter.',
    biogasYield10DM: 170,
    methaneBasePercent: 52,
    dmRange: '40% - 60%',
    contaminationNotes: 'Grit/Bedding.',
    storageNotes: 'Covered storage (Ammonia loss).',
    preTreatmentNotes: 'Dilution often required.',
    nitrogenPotential: 'Very High',
    operationalNotes: 'Ammonia inhibition risk. Limit to <20% of mix.',
    color: '#fcd34d', // amber-300
    themeClass: 'yellow',
    styles: {
      dotColor: 'bg-yellow-400',
      iconBg: 'bg-yellow-100',
      iconText: 'text-yellow-600',
      alertBg: 'bg-yellow-50',
      alertBorder: 'border-yellow-400',
      alertTitle: 'text-yellow-900',
      alertText: 'text-yellow-800'
    },
    expectedGasYield: '90 - 120 m³/tonne',
    methaneContent: '52%',
    contaminationRisk: 'Medium (Grit)',
    requiredPreTreatment: 'Dilution',
    digestateCharacteristics: 'Very High Nitrogen',
    revenueRoutes: 'Cost savings',
    impacts: {
      'digester': 'CAUTION: High ammonia levels can become toxic to bacteria. Monitor pH closely.',
      'storage': 'Digestate is extremely potent fertilizer.'
    }
  },
  'fruit_veg': {
    id: 'fruit_veg',
    name: 'Fruit & Veg',
    description: 'Processing residues.',
    biogasYield10DM: 210,
    methaneBasePercent: 54,
    dmRange: '10% - 15%',
    contaminationNotes: 'Stones/Soil.',
    storageNotes: 'Rapid spoilage. Use quickly.',
    preTreatmentNotes: 'Maceration.',
    nitrogenPotential: 'Low',
    operationalNotes: 'Acidic sugar rush. Buffer capacity needed.',
    color: '#ef4444', // red-500
    themeClass: 'red',
    styles: {
      dotColor: 'bg-red-500',
      iconBg: 'bg-red-100',
      iconText: 'text-red-600',
      alertBg: 'bg-red-50',
      alertBorder: 'border-red-500',
      alertTitle: 'text-red-900',
      alertText: 'text-red-800'
    },
    expectedGasYield: '40 - 60 m³/tonne',
    methaneContent: '54%',
    contaminationRisk: 'Medium',
    requiredPreTreatment: 'Stone removal',
    digestateCharacteristics: 'Low nutrient value',
    revenueRoutes: 'Gate fee',
    impacts: {
      'digester': 'Sugars degrade instantly to acid. Risk of acidosis if not buffered with manure.'
    }
  },
  'brewery': {
    id: 'brewery',
    name: 'Brewery Grain',
    description: 'Spent malt/hops.',
    biogasYield10DM: 210,
    methaneBasePercent: 56,
    dmRange: '20% - 25%',
    contaminationNotes: 'Low.',
    storageNotes: 'Silos or clamps.',
    preTreatmentNotes: 'None.',
    nitrogenPotential: 'High',
    operationalNotes: 'Consistent baseload.',
    color: '#d97706',
    themeClass: 'amber',
    styles: {
      dotColor: 'bg-amber-500',
      iconBg: 'bg-amber-100',
      iconText: 'text-amber-700',
      alertBg: 'bg-amber-50',
      alertBorder: 'border-amber-500',
      alertTitle: 'text-amber-900',
      alertText: 'text-amber-800'
    },
    expectedGasYield: '110 - 130 m³/tonne',
    methaneContent: '56%',
    contaminationRisk: 'Low',
    requiredPreTreatment: 'Mixing/Dilution',
    digestateCharacteristics: 'High Protein/Nitrogen',
    revenueRoutes: 'Gate Fee / Low Cost Feedstock',
    impacts: {
      'feedstock': 'Often arrives warm. Prone to very rapid spoilage if not fed immediately.',
      'digester': 'Excellent gas producer but high protein content can lead to ammonia inhibition if not balanced.',
      'chp': 'Consistent gas production curve ideal for baseload power.',
      'storage': 'Resulting digestate is potent fertilizer.'
    }
  },
  'commercial': {
    id: 'commercial',
    name: 'Mixed Commercial',
    description: 'Restaurant/Supermarket waste.',
    biogasYield10DM: 190,
    methaneBasePercent: 55,
    dmRange: '20% - 30%',
    contaminationNotes: 'Very High (Plastic).',
    storageNotes: 'Enclosed reception.',
    preTreatmentNotes: 'De-packaging.',
    nitrogenPotential: 'Medium',
    operationalNotes: 'Variable quality. Robust tech needed.',
    color: '#a8a29e',
    themeClass: 'stone',
    styles: {
      dotColor: 'bg-stone-400',
      iconBg: 'bg-stone-100',
      iconText: 'text-stone-600',
      alertBg: 'bg-stone-100',
      alertBorder: 'border-stone-400',
      alertTitle: 'text-stone-800',
      alertText: 'text-stone-700'
    },
    expectedGasYield: '140 - 180 m³/tonne',
    methaneContent: '55%',
    contaminationRisk: 'Very High',
    requiredPreTreatment: 'Separation/Hammer Mill',
    digestateCharacteristics: 'Variable Quality',
    revenueRoutes: 'High Gate Fees',
    impacts: {
      'feedstock': 'Critical Control Point: Removing contaminants (forks, plastic) is essential to protect machinery.',
      'feeder': 'Requires robust macerating pumps to handle diverse particle sizes.',
      'digester': 'Variable input quality requires sophisticated biological monitoring.',
      'separator': 'High probability of rejecting plastics in the separation phase.'
    }
  }
};

export const METRIC_EXPLANATIONS: Record<string, { title: string; description: string; whyItMatters: string; optimalRange: string }> = {
  gas: {
    title: "Biogas Production Rate",
    description: "The volume of raw biogas generated by the bacteria every hour.",
    whyItMatters: "Directly correlates to revenue. Consistent production indicates a stable biological process. Sudden drops often signal biological upset like Acidosis.",
    optimalRange: "Dependent on plant size (400-600 m³/h typical for 1MW)"
  },
  power: {
    title: "Electrical Power Output",
    description: "Real-time electricity generation fed into the national grid.",
    whyItMatters: "The main revenue stream. Engines run most efficiently at full load (100%). Running at partial load increases wear and reduces efficiency.",
    optimalRange: "95% - 100% of rated capacity"
  },
  thermal: {
    title: "Thermal Heat Output",
    description: "Heat energy captured from the engine's exhaust and cooling jacket.",
    whyItMatters: "Critical for keeping the digester warm (38-42°C). Excess heat can be used to dry woodchip, heat nearby houses, or pasteurize food waste.",
    optimalRange: "1.1x to 1.5x of Electrical Output"
  },
  methane: {
    title: "Methane (CH₄) Concentration",
    description: "The percentage of the gas volume that is combustible methane.",
    whyItMatters: "Quality over quantity. Engines need >50% CH₄ to run. Higher values mean more energy per m³ of gas. Low methane often means the bacteria are 'starving'.",
    optimalRange: "52% - 58%"
  },
  retention: {
    title: "Hydraulic Retention Time (HRT)",
    description: "The average time feed material spends inside the digester tank.",
    whyItMatters: "Bacteria need time to eat. If HRT is too short, material leaves undigested (gas loss). If too long, tank volume is being wasted.",
    optimalRange: "30 - 60 Days (depending on feedstock)"
  },
  feedRate: {
    title: "Daily Feed Rate",
    description: "The tonnage of fresh material added to the system every 24 hours.",
    whyItMatters: "Stability is key. 'Little and often' feeding prevents acid spikes. Overfeeding causes 'indigestion' (acidosis); underfeeding causes starvation.",
    optimalRange: "Consistent with biological capacity"
  },
  carbon: {
    title: "Carbon Savings",
    description: "Estimated tonnes of CO2 saved annually by replacing fossil fuel electricity.",
    whyItMatters: "Key driver for sustainability goals and environmental permits.",
    optimalRange: "Higher is better"
  },
  liquid: {
    title: "Liquid Digestate",
    description: "Daily volume of liquid bio-fertilizer produced.",
    whyItMatters: "Must be stored (typically 6 months capacity required) and spread on land.",
    optimalRange: "Manageable within storage limits"
  },
  fibre: {
    title: "Fibre Digestate",
    description: "Daily tonnage of solid soil conditioner produced.",
    whyItMatters: "Can be used for bedding or sold as high-quality compost.",
    optimalRange: "Dependent on markets"
  }
};

export const SIMULATION_CONSTANTS = {
  DIGESTER_VOLUME: 1800, // Derived from 45tpd * 40days
  POWER_COEFF: 0.00267, // MW per m3/h
  THERMAL_COEFF: 0.00306, // MW per m3/h
  CARBON_COEFF: 0.35, // tCO2 per MWh
  OPERATING_HOURS: 8000,
  // Nutrient Factors per tonne of digestate
  N_FACTOR: 4.0, // kg/t
  P_FACTOR: 1.5, // kg/t
  K_FACTOR: 3.0, // kg/t
  NITROGEN_LIMIT: 250 // kg/ha/year
};

export const SCENARIO_TOOLTIPS = {
  feedstock: "Different materials have different 'energy densities'. Fats and sugars release gas quickly; fibrous materials take longer. Mixing them can stabilize the process.",
  feedRate: "The amount of 'food' given to the bacteria per day. Too much can overload them (acidosis); too little causes starvation. Higher feed rates reduce Retention Time.",
  dryMatter: "The % of solid material vs water. Higher DM means more energy per tonne but is harder to pump and mix. >12% typically requires specialist pumps.",
  temperature: "Mesophilic (38-42°C) is stable and robust. Thermophilic (50-55°C) is faster and kills more pathogens but is more sensitive to temperature shocks.",
  retention: "How long material stays in the tank. Bacteria need time to break down food. <30 days risks washing out bacteria and wasting gas potential."
};

export const DIGESTATE_TOOLTIPS = {
  nitrogen: "Total Nitrogen (N). Essential for plant growth. In digestate, much of this is readily available ammonium-N, making it a powerful fast-acting fertilizer.",
  phosphate: "Phosphate (P2O5). Key for root development. Digestate preserves the phosphorus from the feedstock, recycling it back to the soil.",
  potash: "Potash (K2O). Vital for crop health and water regulation. Liquid digestate is particularly rich in Potassium.",
  landbank: "The area of agricultural land required to spread the digestate legally. Based on the Nitrate Pollution Prevention Regulations (250kg N/ha/yr limit).",
  pas110: "Publicly Available Specification (PAS) 110. The industry standard for end-of-waste status. Certified digestate is a 'product', not 'waste', removing regulatory burdens."
};

export const SIMULATION_DEFAULTS = {
  feedRate: 45,
  dryMatter: 10,
  temperature: 'meso' as const,
  retentionLocked: false,
  activeMix: [
    { id: 'manure', percentage: 60 },
    { id: 'food_waste', percentage: 40 }
  ]
};
