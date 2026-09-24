export interface LandfillSite {
  id: string;
  name: string;
  lat: number;
  lng: number;
  type: 'landfill' | 'station' | 'receptor';
  status: string;
  ch4Emission?: string;
  distanceKm?: number;
  populationAtRisk?: number;
  description: string;
}

export interface ModelMetric {
  model: string;
  task: 'Regression' | 'Classification';
  target: string;
  r2Score?: number;
  rmse?: number;
  mae?: number;
  accuracy?: number;
  precision?: number;
  recall?: number;
  f1Score?: number;
  rocAuc?: number;
  isBest?: boolean;
}

export interface PlumeObservation {
  datetime: string;
  landfillSite: string;
  ch4EmissionKgHr: number;
  windSpeed: number;
  windDirection: number;
  instrument: string;
  gas: string;
}

export interface DiurnalDataPoint {
  hour: number;
  nh3Mean: number;
  coMean: number;
  pm25Mean: number;
  benzeneMean: number;
}

export interface ShapFeature {
  name: string;
  importance: number;
  category: 'meteorology' | 'landfill_plume' | 'lag' | 'temporal';
  description: string;
}

// Data constants extracted from Python pipeline
export const LANDFILL_SITES: LandfillSite[] = [
  {
    id: 'ghazipur',
    name: 'Ghazipur Landfill (Primary Focus)',
    lat: 28.6238,
    lng: 77.3284,
    type: 'landfill',
    status: 'Active Super-Emitter',
    ch4Emission: '3,843.5 kg/hr (Peak 38,000+ kg/hr)',
    description: 'Over 65m tall landfill generating massive anaerobic CH4, NH3, and CO emissions directly east of Anand Vihar.',
  },
  {
    id: 'bhalswa',
    name: 'Bhalswa Landfill',
    lat: 28.7422,
    lng: 77.1556,
    type: 'landfill',
    status: 'Active Super-Emitter',
    ch4Emission: '2,855.3 kg/hr',
    description: 'North Delhi solid waste facility with frequent subsurface methane combustion plumes.',
  },
  {
    id: 'okhla',
    name: 'Okhla Landfill',
    lat: 28.5113,
    lng: 77.2848,
    type: 'landfill',
    status: 'Active Super-Emitter',
    ch4Emission: '1,940.2 kg/hr',
    description: 'South Delhi dump yard surrounded by industrial and dense residential sectors.',
  },
  {
    id: 'bandhwari',
    name: 'Bandhwari Landfill',
    lat: 28.4024,
    lng: 77.1644,
    type: 'landfill',
    status: 'Moderate Emitter',
    ch4Emission: '890.0 kg/hr',
    description: 'Gurugram-Faridabad border solid waste landfill.',
  },
  {
    id: 'anand_vihar_station',
    name: 'DPCC Anand Vihar Monitoring Hub',
    lat: 28.6469,
    lng: 77.3160,
    type: 'station',
    status: 'Continuous Ground Station',
    description: 'DPCC continuous ambient station located 2.8km directly downwind of Ghazipur along the 100°-160° corridor.',
  }
];

export interface EmergencyHospital {
  id: string;
  name: string;
  type: string;
  distanceKm: number;
  location: string;
  emergencyContact: string;
  oxygenCapacity: string;
  respiratoryICUBeds: number;
  status: 'Open 24x7' | 'High Surge Capacity';
  specialties: string[];
}

export interface SafeEscapeZone {
  id: string;
  name: string;
  lat: number;
  lng: number;
  bearing: number;
  distanceKm: number;
  exposureReductionPercent: number;
  greenCoverRating: '5-Star Forest Buffer' | 'Riverbank Wind Corridor' | 'Urban Green Park';
  recommendedRoute: string;
  cleanAirIndex: string;
}

export const RECEPTOR_NEIGHBORHOODS = [
  { name: 'Ghazipur Village Residential Area', lat: 28.6250, lng: 77.3320, distanceKm: 0.6, type: 'High Density Residential', population: 45000, bearing: 72 },
  { name: 'Kaushambi Residential Hub (Ghaziabad)', lat: 28.6380, lng: 77.3240, distanceKm: 1.7, type: 'Residential High-Rise', population: 60000, bearing: 345 },
  { name: 'Kalyanpuri / Khichripur Colony', lat: 28.6180, lng: 77.3100, distanceKm: 2.1, type: 'Densely Populated Colony', population: 85000, bearing: 250 },
  { name: 'Patparganj Industrial Area & Max Hospital', lat: 28.6290, lng: 77.3050, distanceKm: 2.5, type: 'Healthcare & Commercial', population: 35000, bearing: 283 },
  { name: 'Anand Vihar ISBT & Railway Station', lat: 28.6469, lng: 77.3160, distanceKm: 2.8, type: 'Transit Hub & Schools', population: 120000, bearing: 335 },
  { name: 'Mayur Vihar Phase 3 Safe Pocket', lat: 28.6050, lng: 77.3380, distanceKm: 3.4, type: 'Upwind Residential Buffer', population: 50000, bearing: 160 },
];

export const EMERGENCY_HOSPITALS: EmergencyHospital[] = [
  {
    id: 'max_patparganj',
    name: 'Max Super Speciality Hospital, Patparganj',
    type: 'Tertiary Care Super Speciality',
    distanceKm: 2.4,
    location: '108A, I.P. Extension, Patparganj, Delhi',
    emergencyContact: '+91-11-43033333',
    oxygenCapacity: 'Liquid Medical O2 (10,000 L Tank)',
    respiratoryICUBeds: 42,
    status: 'Open 24x7',
    specialties: ['Toxic Inhalation ICU', 'Advanced Pulmonology', 'Hyperbaric Oxygen']
  },
  {
    id: 'lbs_hospital',
    name: 'Lal Bahadur Shastri Hospital (Govt. of Delhi)',
    type: 'Government Emergency Hospital',
    distanceKm: 1.8,
    location: 'Khichripur, Kalyanpuri, Delhi',
    emergencyContact: '+91-11-22774145',
    oxygenCapacity: 'Dedicated PSA Oxygen Plant (500 LPM)',
    respiratoryICUBeds: 28,
    status: 'High Surge Capacity',
    specialties: ['Acute Bronchospasm Ward', 'Free Emergency Triage', 'Ambulance SOS']
  },
  {
    id: 'hedgewar_hospital',
    name: 'Dr. Hedgewar Arogya Sansthan',
    type: 'Multi-Speciality Government Hospital',
    distanceKm: 3.1,
    location: 'CBD Ground, Karkardooma, Delhi',
    emergencyContact: '+91-11-22308900',
    oxygenCapacity: 'Centralized O2 Grid & High-Flow Nasal Cannula',
    respiratoryICUBeds: 35,
    status: 'Open 24x7',
    specialties: ['Pediatric Asthma Emergency', 'CO Poisoning Antidote', 'Burn & Trauma']
  },
  {
    id: 'yashoda_kaushambi',
    name: 'Yashoda Super Speciality Hospital',
    type: 'Private Multi-Speciality Hub',
    distanceKm: 2.2,
    location: 'Sector 4, Kaushambi, Ghaziabad',
    emergencyContact: '+91-120-4188000',
    oxygenCapacity: 'Dual Cryogenic Oxygen Backup',
    respiratoryICUBeds: 30,
    status: 'Open 24x7',
    specialties: ['Critical Care Pulmonology', 'Toxicology & Poison Center', 'Mobile ICU Unit']
  }
];

export const SAFE_ESCAPE_ZONES: SafeEscapeZone[] = [
  {
    id: 'sanjay_lake',
    name: 'Sanjay Lake & Green Eco-Park Buffer',
    lat: 28.6110,
    lng: 77.3030,
    bearing: 215,
    distanceKm: 2.9,
    exposureReductionPercent: 88,
    greenCoverRating: '5-Star Forest Buffer',
    recommendedRoute: 'Take NH-24 Bypass towards Mayur Vihar Phase-2 / Lake Promenade',
    cleanAirIndex: 'AQI 65 (Clean Air Island)'
  },
  {
    id: 'mayur_vihar_p3',
    name: 'Mayur Vihar Phase-3 Southern High-Ridge Pocket',
    lat: 28.6050,
    lng: 77.3380,
    bearing: 165,
    distanceKm: 3.4,
    exposureReductionPercent: 82,
    greenCoverRating: 'Urban Green Park',
    recommendedRoute: 'Southbound along Gazipur Drain Road towards Kondli Canal Buffer',
    cleanAirIndex: 'AQI 74 (Upwind Shield)'
  },
  {
    id: 'akshardham_riverbank',
    name: 'Akshardham Yamuna Riverbank Green Corridor',
    lat: 28.6120,
    lng: 77.2770,
    bearing: 245,
    distanceKm: 4.8,
    exposureReductionPercent: 94,
    greenCoverRating: 'Riverbank Wind Corridor',
    recommendedRoute: 'Direct West via Noida Link Road / Delhi-Meerut Expressway',
    cleanAirIndex: 'AQI 52 (Optimal Fresh Air Flow)'
  },
  {
    id: 'surajmal_vihar',
    name: 'Surajmal Vihar / Vivek Vihar District Park Zone',
    lat: 28.6570,
    lng: 77.3020,
    bearing: 310,
    distanceKm: 4.1,
    exposureReductionPercent: 78,
    greenCoverRating: 'Urban Green Park',
    recommendedRoute: 'Northwest via Master Plan Road towards Shahdara Green Belt',
    cleanAirIndex: 'AQI 85 (Protected Crosswind Zone)'
  }
];

export const SATELLITE_PLUMES: PlumeObservation[] = [
  { datetime: '2022-09-01 03:46:52', landfillSite: 'Ghazipur', ch4EmissionKgHr: 3843.48, windSpeed: 1.80, windDirection: 288.8, instrument: 'NASA EMIT', gas: 'CH4' },
  { datetime: '2022-09-01 03:46:52', landfillSite: 'Bhalswa', ch4EmissionKgHr: 2855.29, windSpeed: 1.76, windDirection: 280.3, instrument: 'NASA EMIT', gas: 'CH4' },
  { datetime: '2022-11-29 06:17:07', landfillSite: 'Okhla', ch4EmissionKgHr: 1940.15, windSpeed: 1.39, windDirection: 341.9, instrument: 'ESA EnMAP', gas: 'CH4' },
  { datetime: '2022-11-29 06:17:07', landfillSite: 'Ghazipur', ch4EmissionKgHr: 3120.40, windSpeed: 1.35, windDirection: 334.4, instrument: 'ESA EnMAP', gas: 'CH4' },
  { datetime: '2023-03-09 06:09:08', landfillSite: 'Bhalswa', ch4EmissionKgHr: 2382.86, windSpeed: 2.23, windDirection: 343.3, instrument: 'ESA EnMAP', gas: 'CH4' },
  { datetime: '2023-04-24 06:02:59', landfillSite: 'Ghazipur', ch4EmissionKgHr: 4125.60, windSpeed: 3.61, windDirection: 136.5, instrument: 'ESA EnMAP', gas: 'CH4' },
  { datetime: '2023-10-26 05:31:30', landfillSite: 'Ghazipur', ch4EmissionKgHr: 3670.10, windSpeed: 2.15, windDirection: 316.2, instrument: 'NASA EMIT', gas: 'CH4' },
  { datetime: '2023-10-26 05:31:30', landfillSite: 'Bhalswa', ch4EmissionKgHr: 2990.80, windSpeed: 2.10, windDirection: 316.8, instrument: 'NASA EMIT', gas: 'CH4' },
  { datetime: '2023-10-26 05:31:30', landfillSite: 'Okhla', ch4EmissionKgHr: 1850.50, windSpeed: 2.05, windDirection: 317.4, instrument: 'NASA EMIT', gas: 'CH4' },
  { datetime: '2023-10-30 03:55:45', landfillSite: 'Ghazipur', ch4EmissionKgHr: 3450.00, windSpeed: 1.65, windDirection: 126.5, instrument: 'NASA EMIT', gas: 'CH4' },
  { datetime: '2023-12-26 05:22:36', landfillSite: 'Ghazipur', ch4EmissionKgHr: 4890.20, windSpeed: 1.40, windDirection: 295.2, instrument: 'NASA EMIT', gas: 'CH4' },
];

export const REGRESSION_METRICS: ModelMetric[] = [
  // 1. Ammonia (NH3)
  { model: 'Ridge Regression (Baseline)', task: 'Regression', target: 'NH3 (1h ahead)', r2Score: 0.8400, rmse: 11.022, mae: 6.206, isBest: true },
  { model: 'XGBoost Regressor', task: 'Regression', target: 'NH3 (1h ahead)', r2Score: 0.8154, rmse: 11.839, mae: 6.591 },
  { model: 'LightGBM Regressor', task: 'Regression', target: 'NH3 (1h ahead)', r2Score: 0.8114, rmse: 11.966, mae: 6.565 },

  // 2. Carbon Monoxide (CO)
  { model: 'LightGBM Regressor', task: 'Regression', target: 'CO (1h ahead)', r2Score: 0.8411, rmse: 0.655, mae: 0.296, isBest: true },
  { model: 'XGBoost Regressor', task: 'Regression', target: 'CO (1h ahead)', r2Score: 0.8343, rmse: 0.669, mae: 0.299 },
  { model: 'Ridge Regression (Baseline)', task: 'Regression', target: 'CO (1h ahead)', r2Score: 0.8012, rmse: 0.732, mae: 0.324 },

  // 3. Fine Particulate Matter (PM2.5)
  { model: 'LightGBM Regressor', task: 'Regression', target: 'PM2.5 (1h ahead)', r2Score: 0.9293, rmse: 36.079, mae: 23.028, isBest: true },
  { model: 'Ridge Regression (Baseline)', task: 'Regression', target: 'PM2.5 (1h ahead)', r2Score: 0.9277, rmse: 36.489, mae: 23.522 },
  { model: 'XGBoost Regressor', task: 'Regression', target: 'PM2.5 (1h ahead)', r2Score: 0.9266, rmse: 36.762, mae: 23.263 },

  // 4. Coarse Particulates (PM10)
  { model: 'LightGBM Regressor', task: 'Regression', target: 'PM10 (1h ahead)', r2Score: 0.8608, rmse: 79.408, mae: 54.271, isBest: true },
  { model: 'XGBoost Regressor', task: 'Regression', target: 'PM10 (1h ahead)', r2Score: 0.8570, rmse: 80.469, mae: 54.686 },
  { model: 'Ridge Regression (Baseline)', task: 'Regression', target: 'PM10 (1h ahead)', r2Score: 0.8540, rmse: 81.313, mae: 56.008 },

  // 5. Nitrogen Dioxide (NO2)
  { model: 'LightGBM Regressor', task: 'Regression', target: 'NO2 (1h ahead)', r2Score: 0.8140, rmse: 20.047, mae: 14.035, isBest: true },
  { model: 'XGBoost Regressor', task: 'Regression', target: 'NO2 (1h ahead)', r2Score: 0.8045, rmse: 20.553, mae: 14.194 },
  { model: 'Ridge Regression (Baseline)', task: 'Regression', target: 'NO2 (1h ahead)', r2Score: 0.7822, rmse: 21.692, mae: 14.976 },

  // 6. Benzene (Carcinogenic Landfill VOC)
  { model: 'Ridge Regression (Baseline)', task: 'Regression', target: 'Benzene (1h ahead)', r2Score: 0.9002, rmse: 1.206, mae: 0.715, isBest: true },
  { model: 'LightGBM Regressor', task: 'Regression', target: 'Benzene (1h ahead)', r2Score: 0.8924, rmse: 1.252, mae: 0.688 },
  { model: 'XGBoost Regressor', task: 'Regression', target: 'Benzene (1h ahead)', r2Score: 0.8388, rmse: 1.533, mae: 0.707 },

  // 7. Toluene (Landfill Solvent & Smear Gas)
  { model: 'Ridge Regression (Baseline)', task: 'Regression', target: 'Toluene (1h ahead)', r2Score: 0.8531, rmse: 13.979, mae: 8.459, isBest: true },
  { model: 'LightGBM Regressor', task: 'Regression', target: 'Toluene (1h ahead)', r2Score: 0.8481, rmse: 14.217, mae: 8.429 },
  { model: 'XGBoost Regressor', task: 'Regression', target: 'Toluene (1h ahead)', r2Score: 0.8397, rmse: 14.602, mae: 8.369 },

  // 8. Sulfur Dioxide (SO2)
  { model: 'Ridge Regression (Baseline)', task: 'Regression', target: 'SO2 (1h ahead)', r2Score: 0.6879, rmse: 11.565, mae: 6.126, isBest: true },
  { model: 'LightGBM Regressor', task: 'Regression', target: 'SO2 (1h ahead)', r2Score: 0.5479, rmse: 13.921, mae: 7.741 },

  // 9. Ground-Level Ozone (O3)
  { model: 'Ridge Regression (Baseline)', task: 'Regression', target: 'Ozone (1h ahead)', r2Score: 0.5068, rmse: 8.730, mae: 5.048, isBest: true },
  { model: 'XGBoost Regressor', task: 'Regression', target: 'Ozone (1h ahead)', r2Score: 0.3644, rmse: 9.910, mae: 5.968 },
];

export const CLASSIFICATION_METRICS: ModelMetric[] = [
  { model: 'Random Forest Classifier', task: 'Classification', target: 'Toxic Episode Alert', accuracy: 0.9997, precision: 0.9990, recall: 1.0000, f1Score: 0.9995, rocAuc: 1.0000, isBest: true },
  { model: 'XGBoost Classifier', task: 'Classification', target: 'Toxic Episode Alert', accuracy: 0.9989, precision: 0.9966, recall: 0.9995, f1Score: 0.9981, rocAuc: 1.0000 },
  { model: 'LightGBM Classifier', task: 'Classification', target: 'Toxic Episode Alert', accuracy: 0.9981, precision: 0.9976, recall: 0.9961, f1Score: 0.9968, rocAuc: 1.0000 },
  { model: 'Logistic Regression', task: 'Classification', target: 'Toxic Episode Alert', accuracy: 0.8584, precision: 0.6988, recall: 0.9115, f1Score: 0.7911, rocAuc: 0.9657 },
];

export const DIURNAL_TRENDS: DiurnalDataPoint[] = [
  { hour: 0, nh3Mean: 68.4, coMean: 2.85, pm25Mean: 210.5, benzeneMean: 6.2 },
  { hour: 2, nh3Mean: 74.2, coMean: 3.12, pm25Mean: 235.0, benzeneMean: 6.8 },
  { hour: 4, nh3Mean: 79.8, coMean: 3.45, pm25Mean: 258.4, benzeneMean: 7.4 },
  { hour: 6, nh3Mean: 76.5, coMean: 3.20, pm25Mean: 242.0, benzeneMean: 6.9 },
  { hour: 8, nh3Mean: 62.1, coMean: 2.55, pm25Mean: 195.2, benzeneMean: 5.4 },
  { hour: 10, nh3Mean: 48.3, coMean: 1.85, pm25Mean: 145.0, benzeneMean: 3.8 },
  { hour: 12, nh3Mean: 36.5, coMean: 1.30, pm25Mean: 110.8, benzeneMean: 2.6 },
  { hour: 14, nh3Mean: 32.1, coMean: 1.15, pm25Mean: 95.4, benzeneMean: 2.1 },
  { hour: 16, nh3Mean: 35.8, coMean: 1.25, pm25Mean: 105.0, benzeneMean: 2.5 },
  { hour: 18, nh3Mean: 49.6, coMean: 1.95, pm25Mean: 152.3, benzeneMean: 4.2 },
  { hour: 20, nh3Mean: 58.7, coMean: 2.40, pm25Mean: 182.0, benzeneMean: 5.1 },
  { hour: 22, nh3Mean: 64.9, coMean: 2.70, pm25Mean: 201.5, benzeneMean: 5.9 },
];

export const SHAP_FEATURE_IMPORTANCE: ShapFeature[] = [
  { name: 'nh3_lag_1 (Recent 15-min NH3)', importance: 0.428, category: 'lag', description: 'Immediate toxic gas concentration memory.' },
  { name: 'ghazipur_plume_alignment (130° Azimuth)', importance: 0.185, category: 'landfill_plume', description: 'Direct geometric alignment between wind vector and Ghazipur dump yard.' },
  { name: 'landfill_dispersion_index', importance: 0.142, category: 'landfill_plume', description: 'Combined alignment and low wind speed attenuation.' },
  { name: 'temp (Ambient Temperature)', importance: 0.089, category: 'meteorology', description: 'Night-time cold surface air trapping pollutants.' },
  { name: 'wind_speed (WS)', importance: 0.065, category: 'meteorology', description: 'Atmospheric cleansing and boundary layer ventilation.' },
  { name: 'hour_cos / hour_sin (Cyclic Time)', importance: 0.045, category: 'temporal', description: 'Diurnal boundary layer expansion and collapse cycle.' },
  { name: 'humidity (RH)', importance: 0.026, category: 'meteorology', description: 'Aerosol hygroscopic growth and moisture condensation.' },
  { name: 'solar_radiation (SR)', importance: 0.020, category: 'meteorology', description: 'Solar photochemical mixing and convective thermals.' },
];
