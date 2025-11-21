
export interface PlantPart {
  id: string;
  title: string;
  shortDescription: string;
  fullDescription: string;
  expandedContent: string;
  technicalDetails: string[];
  color: string;
}

export const PLANT_DATA: Record<string, PlantPart> = {
  'feedstock': {
    id: 'feedstock',
    title: 'Feedstock Reception',
    shortDescription: 'Where organic waste enters the system.',
    fullDescription: 'The process begins here. Organic materials such as agricultural waste, manure, energy crops (like maize), or food waste are collected and stored. They are pre-treated to remove contaminants and macerated to increase surface area for bacteria.',
    expandedContent: 'The reception area is the critical control point (CCP) for the plant. Incoming vehicles are weighed on a weighbridge to track tonnage. Loads are visually inspected and often tested for dry matter content. Strict biosecurity measures are in place to prevent the spread of disease, especially when handling animal by-products (ABP). Liquid feedstocks are discharged via sealed couplings into underground reception tanks, while solids are tipped into bays. Odor control systems, such as carbon filters or air extraction, are often installed here to minimize environmental impact.',
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
    expandedContent: 'The feeding module serves as the interface between raw storage and the biological process. It typically consists of a large hopper with moving floor slats or walking floors that push material towards mixing screws. These screws macerate the feedstock, chopping it into smaller particles to increase the surface area available for enzymatic attack by bacteria. The system is automated to feed small amounts frequently (e.g., every hour) rather than large slug loads, preventing shock loading which could destabilize the digester biology.',
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
    expandedContent: 'Inside the primary digester, a complex four-stage biological process takes place: Hydrolysis (breaking down complex polymers), Acidogenesis (fermenting into volatile fatty acids), Acetogenesis (converting to acetic acid), and finally Methanogenesis (archaea producing methane). The tank is insulated and heated, typically using hot water coils circulated from the CHP unit. Agitators (mixers) run periodically to prevent the formation of a floating crust and to keep solids in suspension, ensuring the bacteria have constant access to nutrients.',
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
    expandedContent: 'The double-membrane gas holder consists of an inner membrane that contains the gas and an outer weather-protection membrane. An air blower maintains pressure in the space between the two membranes to keep the dome rigid against wind and snow loads. The gas storage acts as a buffer, typically holding 4-12 hours of gas production. This allows the CHP engine to run at a constant output even if gas production from the biology fluctuates slightly over short periods. Pressure relief valves prevent over-pressurization.',
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
    expandedContent: 'The Combined Heat and Power (CHP) unit is a modified internal combustion engine designed to run on biogas. Before combustion, the gas is often dehumidified and passed through activated carbon filters to remove hydrogen sulfide (H2S) and siloxanes, which can damage the engine. The engine drives a generator synchronized to the national grid frequency. Thermal energy is recovered from the engine jacket water and exhaust gases via heat exchangers, achieving total plant efficiencies of over 85%.',
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
    expandedContent: 'Separation is crucial for nutrient management. The screw press applies mechanical pressure to the digestate against a screen. The solid fraction, rich in phosphorus and organic matter, is stackable and can be transported easily. The liquid fraction contains most of the nitrogen (ammonium) and potassium. This separation allows farmers to apply specific nutrients where needed—using the liquid for rapid crop uptake during growing season and the solids for soil structure improvement in the autumn.',
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
    expandedContent: 'Digestate storage capacity is dictated by legal spreading windows (e.g., restrictions during winter months in Nitrate Vulnerable Zones). Lagoons are often covered with floating covers or tensioned roofs to prevent rainwater ingress (which dilutes the fertilizer) and to minimize ammonia emissions. The final product is a sanitized, pH-neutral bio-fertilizer that has a lower biological oxygen demand (BOD) than raw slurry, making it safer for watercourses if applied correctly.',
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
  yieldFactor: number;
  methaneContent: string;
  color: string; // Hex for SVG visualization
  themeClass: string; // Keep for reference
  styles: FeedstockStyles; // Explicit classes for Tailwind
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
    styles: {
      dotColor: 'bg-amber-500',
      iconBg: 'bg-amber-100',
      iconText: 'text-amber-600',
      alertBg: 'bg-amber-50',
      alertBorder: 'border-amber-500',
      alertTitle: 'text-amber-800',
      alertText: 'text-amber-900'
    },
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
    styles: {
      dotColor: 'bg-lime-500',
      iconBg: 'bg-lime-100',
      iconText: 'text-lime-600',
      alertBg: 'bg-lime-50',
      alertBorder: 'border-lime-500',
      alertTitle: 'text-lime-800',
      alertText: 'text-lime-900'
    },
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
    styles: {
      dotColor: 'bg-orange-500',
      iconBg: 'bg-orange-100',
      iconText: 'text-orange-600',
      alertBg: 'bg-orange-50',
      alertBorder: 'border-orange-500',
      alertTitle: 'text-orange-800',
      alertText: 'text-orange-900'
    },
    impacts: {
      'feedstock': 'Requires de-packaging and a pasteurization step (70°C for 1hr) to kill pathogens.',
      'digester': 'Rapid degradation rates. Can be volatile; requires consistent feeding.',
      'gas-holder': 'High methane content boosts energy value.',
      'storage': 'Stringent regulations on spreading due to animal by-product rules.'
    }
  }
};
