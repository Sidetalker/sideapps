export type SiteBase = {
  id: string;
  name: string;
  jurisdiction: string;
  category: string;
  status: string;
  region: string;
  lastUpdated: string;
};

export type SiteSummary = SiteBase & {
  assetCount: number;
};

export type SiteAsset = {
  id: string;
  name: string;
  type: string;
  condition: 'Excellent' | 'Good' | 'Fair' | 'Needs Attention';
  owner: string;
  lastInspection: string;
  notes: string;
};

export type SiteDetail = SiteSummary & {
  description: string;
  assets: SiteAsset[];
};

const siteDetailsInternal: SiteDetail[] = [
  {
    id: 'riverfront-monitoring',
    name: 'Riverfront Monitoring Station',
    jurisdiction: 'City of Denver Utilities',
    category: 'Water Quality',
    status: 'Operational',
    region: 'Central',
    lastUpdated: '2024-03-18',
    description:
      'Continuous monitoring station measuring river nutrient levels, sediment load, and flow conditions for downtown corridors.',
    assetCount: 5,
    assets: [
      {
        id: 'sensor-array-a',
        name: 'Sensor Array A',
        type: 'Water Quality Sensor',
        condition: 'Good',
        owner: 'City of Denver Utilities',
        lastInspection: '2024-02-10',
        notes: 'Calibrated within tolerance. Next check in six months.',
      },
      {
        id: 'telemetry-node-01',
        name: 'Telemetry Node 01',
        type: 'Communications',
        condition: 'Excellent',
        owner: 'City of Denver Utilities',
        lastInspection: '2024-01-22',
        notes: 'Signal strength improved after antenna alignment.',
      },
      {
        id: 'solar-bank',
        name: 'Solar Power Bank',
        type: 'Power',
        condition: 'Good',
        owner: 'City of Denver Utilities',
        lastInspection: '2024-03-02',
        notes: 'Battery capacity at 86%.',
      },
      {
        id: 'camera-east',
        name: 'Camera (East Access)',
        type: 'Security',
        condition: 'Fair',
        owner: 'City of Denver Utilities',
        lastInspection: '2024-02-18',
        notes: 'Lens requires cleaning after spring runoff.',
      },
      {
        id: 'intake-gate',
        name: 'Intake Gate Sensor',
        type: 'Flow Monitoring',
        condition: 'Needs Attention',
        owner: 'City of Denver Utilities',
        lastInspection: '2024-03-12',
        notes: 'Intermittent signal detected during high flow events.',
      },
    ],
  },
  {
    id: 'south-reservoir',
    name: 'South Reservoir Operations',
    jurisdiction: 'Arapahoe Water District',
    category: 'Reservoir Management',
    status: 'Operational',
    region: 'South',
    lastUpdated: '2024-02-28',
    description:
      'Supervisory control center that coordinates treatment plants, pumping, and release schedules for the southern reservoir network.',
    assetCount: 6,
    assets: [
      {
        id: 'pump-station-4',
        name: 'Pump Station #4',
        type: 'Pumping',
        condition: 'Good',
        owner: 'Arapahoe Water District',
        lastInspection: '2024-02-04',
        notes: 'Impeller replaced last quarter; running smoothly.',
      },
      {
        id: 'chlorine-monitor',
        name: 'Chlorine Monitor',
        type: 'Water Quality Sensor',
        condition: 'Excellent',
        owner: 'Arapahoe Water District',
        lastInspection: '2024-03-01',
        notes: 'No anomalies recorded.',
      },
      {
        id: 'backup-generator',
        name: 'Backup Generator',
        type: 'Power',
        condition: 'Fair',
        owner: 'Arapahoe Water District',
        lastInspection: '2024-02-12',
        notes: 'Fuel hose scheduled for replacement in April.',
      },
      {
        id: 'control-room-console',
        name: 'Control Room Console',
        type: 'SCADA',
        condition: 'Good',
        owner: 'Arapahoe Water District',
        lastInspection: '2024-02-20',
        notes: 'Firmware update applied successfully.',
      },
      {
        id: 'spillway-gate',
        name: 'Spillway Gate Actuator',
        type: 'Mechanical',
        condition: 'Good',
        owner: 'Arapahoe Water District',
        lastInspection: '2024-03-05',
        notes: 'Actuator tested at 85% load.',
      },
      {
        id: 'south-field-camera',
        name: 'South Field Camera',
        type: 'Security',
        condition: 'Fair',
        owner: 'Arapahoe Water District',
        lastInspection: '2024-02-25',
        notes: 'Night vision partially obstructed by vegetation.',
      },
    ],
  },
  {
    id: 'high-plains-recharge',
    name: 'High Plains Recharge Basins',
    jurisdiction: 'Tri-County Groundwater Authority',
    category: 'Aquifer Recharge',
    status: 'Seasonal',
    region: 'East',
    lastUpdated: '2023-12-14',
    description:
      'Managed aquifer recharge project balancing surface flows with downstream municipal delivery commitments.',
    assetCount: 4,
    assets: [
      {
        id: 'gate-array',
        name: 'Recharge Gate Array',
        type: 'Mechanical',
        condition: 'Good',
        owner: 'Tri-County Groundwater Authority',
        lastInspection: '2023-11-30',
        notes: 'Seasonal lubrication completed.',
      },
      {
        id: 'flow-meter-02',
        name: 'Flow Meter 02',
        type: 'Flow Monitoring',
        condition: 'Excellent',
        owner: 'Tri-County Groundwater Authority',
        lastInspection: '2023-12-01',
        notes: 'Zero drift observed since installation.',
      },
      {
        id: 'monitoring-well',
        name: 'Monitoring Well 7B',
        type: 'Groundwater Sensor',
        condition: 'Fair',
        owner: 'Tri-County Groundwater Authority',
        lastInspection: '2023-10-18',
        notes: 'Telemetry to be upgraded before next recharge cycle.',
      },
      {
        id: 'north-camera',
        name: 'North Perimeter Camera',
        type: 'Security',
        condition: 'Needs Attention',
        owner: 'Tri-County Groundwater Authority',
        lastInspection: '2023-12-10',
        notes: 'Intermittent power loss traced to underground conduit.',
      },
    ],
  },
  {
    id: 'mountain-operations',
    name: 'Mountain Operations Hub',
    jurisdiction: 'Summit County Water & Sanitation',
    category: 'Snow Melt Management',
    status: 'Operational',
    region: 'West',
    lastUpdated: '2024-03-07',
    description:
      'Operations center coordinating snowmelt capture, reservoir balancing, and emergency response during runoff season.',
    assetCount: 5,
    assets: [
      {
        id: 'dispatch-console',
        name: 'Dispatch Console',
        type: 'SCADA',
        condition: 'Excellent',
        owner: 'Summit County Water & Sanitation',
        lastInspection: '2024-03-04',
        notes: 'Operator dashboards redesigned for upcoming runoff.',
      },
      {
        id: 'mountain-camera',
        name: 'North Ridge Camera',
        type: 'Security',
        condition: 'Good',
        owner: 'Summit County Water & Sanitation',
        lastInspection: '2024-02-26',
        notes: 'Heater functioning. Minor frost accumulation observed.',
      },
      {
        id: 'weather-station',
        name: 'Weather Station 5G',
        type: 'Weather Sensor',
        condition: 'Fair',
        owner: 'Summit County Water & Sanitation',
        lastInspection: '2024-02-17',
        notes: 'Wind vane replacement scheduled.',
      },
      {
        id: 'radio-tower',
        name: 'Radio Tower',
        type: 'Communications',
        condition: 'Good',
        owner: 'Summit County Water & Sanitation',
        lastInspection: '2024-03-01',
        notes: 'Redundant uplink added for emergency alerts.',
      },
      {
        id: 'backup-generator-west',
        name: 'Backup Generator (West Yard)',
        type: 'Power',
        condition: 'Good',
        owner: 'Summit County Water & Sanitation',
        lastInspection: '2024-02-28',
        notes: 'Load test at 75% capacity without issues.',
      },
    ],
  },
  {
    id: 'northern-interceptor',
    name: 'Northern Interceptor Upgrade',
    jurisdiction: 'Metro Wastewater District',
    category: 'Wastewater',
    status: 'Under Construction',
    region: 'North',
    lastUpdated: '2024-01-19',
    description:
      'Phased improvement project adding redundancy and increasing flow capacity for the northern interceptor corridor.',
    assetCount: 7,
    assets: [
      {
        id: 'microtunnel-drive',
        name: 'Microtunnel Drive Unit',
        type: 'Construction Equipment',
        condition: 'Excellent',
        owner: 'Metro Wastewater District',
        lastInspection: '2024-01-11',
        notes: 'Ready for next drive once permits finalized.',
      },
      {
        id: 'shaft-crane',
        name: 'Shaft Crane',
        type: 'Construction Equipment',
        condition: 'Good',
        owner: 'Metro Wastewater District',
        lastInspection: '2023-12-30',
        notes: 'Rigging refreshed, daily checklist in place.',
      },
      {
        id: 'bypass-pump',
        name: 'Temporary Bypass Pump',
        type: 'Pumping',
        condition: 'Fair',
        owner: 'Metro Wastewater District',
        lastInspection: '2024-01-08',
        notes: 'Monitoring bearings for early wear.',
      },
      {
        id: 'odor-control',
        name: 'Odor Control Skid',
        type: 'Treatment',
        condition: 'Good',
        owner: 'Metro Wastewater District',
        lastInspection: '2023-12-27',
        notes: 'Carbon media replaced; next change scheduled for June.',
      },
      {
        id: 'inspection-camera',
        name: 'Inspection Camera',
        type: 'Inspection',
        condition: 'Good',
        owner: 'Metro Wastewater District',
        lastInspection: '2023-12-18',
        notes: 'Firmware update pending for new analytics overlay.',
      },
      {
        id: 'trench-shield',
        name: 'Trench Shield #3',
        type: 'Safety',
        condition: 'Fair',
        owner: 'Metro Wastewater District',
        lastInspection: '2024-01-05',
        notes: 'Welding repair planned during February shutdown.',
      },
      {
        id: 'traffic-signal-kit',
        name: 'Traffic Signal Kit',
        type: 'Traffic Control',
        condition: 'Excellent',
        owner: 'Metro Wastewater District',
        lastInspection: '2024-01-15',
        notes: 'Ready for deployment on Segment C detours.',
      },
    ],
  },
];

export const siteDetails: SiteDetail[] = siteDetailsInternal;

export const siteSummaries: SiteSummary[] = siteDetailsInternal.map(({ assets, description, ...summary }) => {
  void description;
  return {
    ...summary,
    assetCount: assets.length,
  };
});

export function getSiteDetail(id: string): SiteDetail | undefined {
  return siteDetailsInternal.find((site) => site.id === id);
}

export function getStatusOptions(): string[] {
  return Array.from(new Set(siteSummaries.map((site) => site.status))).sort();
}

export function getRegionOptions(): string[] {
  return Array.from(new Set(siteSummaries.map((site) => site.region))).sort();
}

export function getCategoryOptions(): string[] {
  return Array.from(new Set(siteSummaries.map((site) => site.category))).sort();
}
