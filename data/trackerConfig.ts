export interface FixedLocation {
  id: string;
  name: string;
  codename?: string;
  category?: string;
  lat: number;
  lng: number;
  address: string;
  region: string;
  country: string;
  status: 'ONLINE' | 'STANDBY' | 'LOCKED' | 'TRACKING';
  signalStrength: number; // 0 - 100
  description: string;
  stats?: {
    elevation?: string;
    clearance?: string;
    personnel?: string;
    system?: string;
  };
}

export interface TrackerThemeConfig {
  mode: 'spidey' | 'tactical';
  titleLeft: string;
  titleRight: string;
  systemTag: string;
  showScanlines: boolean;
  enableSoundEffects: boolean;
}

/**
 * ── FIX YOUR LOCATION HERE ──
 * Modify this object to change your tracked location.
 * Only this location will be displayed on the tactical pixel map.
 */
export const PRIMARY_FIXED_LOCATION: FixedLocation = {
  id: 'target-primary',
  name: 'PRISM Degree & PG College',
  codename: 'SECTOR-PRISM-01',
  category: 'ACADEMIC FACILITY // HEADQUARTERS',
  lat: 17.730435,
  lng: 83.308419,
  address: '50-57-1/1, Rajendra Nagar, Seetamma Peta, Dwaraka Nagar, Visakhapatnam, Andhra Pradesh 530016',
  region: 'ANDHRA PRADESH / VISAKHAPATNAM',
  country: 'INDIA',
  status: 'LOCKED',
  signalStrength: 98,
  description:
    'Primary target facility identified. High concentration of legendary faculty signatures detected. Beacon broadcasting active tribute telemetry.',
  stats: {
    elevation: '18m ASL',
    clearance: 'OMEGA',
    personnel: '10 FACULTY DETECTED',
    system: 'ONLINE // TRACKING',
  },
};

export const TRACKER_THEME: TrackerThemeConfig = {
  mode: 'tactical',
  titleLeft: 'TEACHER',
  titleRight: 'TRACKER',
  systemTag: 'TEACHER TRACKING & RECON SYSTEM // V.4.2',
  showScanlines: true,
  enableSoundEffects: true,
};
