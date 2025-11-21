export interface PlantPart {
  id: string;
  title: string;
  shortDescription: string;
  fullDescription: string;
  technicalDetails: string[];
  color: string;
}

export const PLANT_DATA: Record<string, PlantPart> = {
  'feedstock': {
    id: 'feedstock',
    title: 'Feedstock Reception',
    shortDescription: 'Where organic waste enters the system.',
    fullDescription: 'The process begins here. Organic materials such as agricultural waste, manure, energy crops (like maize), or food waste are collected and stored. They are pre-treated to remove contaminants and macerated to increase surface area for bacteria.',
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
    fullDescription: 'Solid feedstock is loaded into a hopper which feeds the digester at a steady, controlled rate. Liquid feedstocks are pumped. A consistent feed rate is crucial for maintaining stable biological conditions inside the tank.',
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
    fullDescription: 'This large, airtight tank is heated (usually to 38-42°C for mesophilic digestion). In the absence of oxygen, anaerobic bacteria break down the organic matter. This biological process releases biogas (methane and CO2).',
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
    fullDescription: 'Biogas produced in the digester bubbles up and is captured in the flexible roof (double membrane gas holder). It acts as a buffer to ensure a constant supply of gas to the engine, even if production fluctuates slightly.',
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
    fullDescription: 'The biogas is scrubbed (dried and cleaned) and fed into a combustion engine. This engine drives a generator to produce electricity. The heat from the engine is captured and used to heat the digester, with excess available for local heating networks.',
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
    fullDescription: 'After digestion, the leftover material (digestate) is pumped to a separator. It mechanically separates the solid fibers from the liquid nutrient-rich fertilizer.',
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
    fullDescription: 'The liquid digestate is stored in large lagoons or tanks until the spreading season. It is a valuable, low-odor fertilizer that replaces fossil-fuel derived chemical fertilizers.',
    technicalDetails: [
      'Capacity: 6 months storage typically required',
      'Application: Dribble bar / Trailing shoe',
      'Benefit: Closed nutrient loop'
    ],
    color: '#78716c' // stone-500
  }
};

export interface Feedstock {
  id: string;
  name: string;
  description: string;
  yieldFactor: number;
  methaneContent: string;
  color: string; // Hex for SVG visualization
  themeClass: string; // Tailwind color theme prefix (e.g., 'amber')
  impacts: Record<string, string>;
}

export const FEEDSTOCKS: Record<string, Feedstock> = {
  'manure': {
    id: 'manure',
    name: 'Cow Manure',
    description: 'Farm slurry & manure',
    yieldFactor: 0.8,
    methaneContent: '55%',
    color: '#5D4037', // Dark Brown
    themeClass: 'amber',
    impacts: {
      'feedstock': 'Pumped as liquid slurry or loaded as solid muck. Requires less maceration than crops.',
      'digester': 'Provides excellent buffering bacteria stability, though gas yield per volume is lower.',
      'separator': 'Produces fiber suitable for cattle bedding.',
      'storage': 'Digestate has reduced odor compared to raw manure and nutrients are more plant-available.'
    }
  },
  'crops': {
    id: 'crops',
    name: 'Energy Crops',
    description: 'Maize & Grass Silage',
    yieldFactor: 1.6,
    methaneContent: '52%',
    color: '#a3e635', // Bright Green
    themeClass: 'lime',
    impacts: {
      'feedstock': 'Stored in silage clamps. Requires intensive maceration to break down fibers.',
      'digester': 'High gas yield requires careful monitoring of pH to prevent acidosis.',
      'separator': 'Fibrous digestate makes excellent soil conditioner.',
      'storage': 'High nutrient value requires precise spreading planning.'
    }
  },
  'food_waste': {
    id: 'food_waste',
    name: 'Food Waste',
    description: 'Commercial food scraps',
    yieldFactor: 1.4,
    methaneContent: '58%',
    color: '#d97706', // Orange/Brown mix
    themeClass: 'orange',
    impacts: {
      'feedstock': 'Requires de-packaging and a pasteurization step (70°C for 1hr) to kill pathogens.',
      'digester': 'Rapid degradation rates. Can be volatile; requires consistent feeding.',
      'gas-holder': 'High methane content boosts energy value.',
      'storage': 'Stringent regulations on spreading due to animal by-product rules.'
    }
  }
};