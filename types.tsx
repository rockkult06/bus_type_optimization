// RouteData tipini güncelle
export interface RouteData {
  routeNo: string
  routeName: string
  routeLengthAtoB: number // A'dan B'ye hat uzunluğu
  routeLengthBtoA: number // B'den A'ya hat uzunluğu
  travelTimeAtoB: number // A'dan B'ye parkur süresi (dakika)
  travelTimeBtoA: number // B'den A'ya parkur süresi (dakika)
  peakPassengersAtoB: number // A'dan B'ye yolcu sayısı
  peakPassengersBtoA: number // B'den A'ya yolcu sayısı
}

// BusParameters tipini güncelleyelim
export interface BusParameters {
  smallBusCapacity: number;
  smallBusOperatingCost: number;
  smallBusCO2Emission: number;
  mediumBusCapacity: number;
  mediumBusOperatingCost: number;
  mediumBusCO2Emission: number;
  largeBusCapacity: number;
  largeBusOperatingCost: number;
  largeBusCO2Emission: number;
  operationalHours: number;
}

// ScheduleResult tipini güncelle
export type ScheduleResult = {
  frequencyAB: number
  frequencyBA: number
  tripsAB: number
  tripsBA: number
  totalBuses: number
  scheduleAB: Array<{ time: string; busId: string; busType?: string; routeNo?: string }>
  scheduleBA: Array<{ time: string; busId: string; busType?: string; routeNo?: string }>
  busUtilization: Record<string, { trips: number; busType?: string }>
  routeSchedules?: Record<
    string,
    {
      scheduleAB: Array<{ time: string; busId: string; busType?: string }>
      scheduleBA: Array<{ time: string; busId: string; busType?: string }>
      routeInfo?: {
        routeLengthAtoB: number
        routeLengthBtoA: number
        travelTimeAtoB: number
        travelTimeBtoA: number
        peakPassengersAtoB: number
        peakPassengersBtoA: number
      }
    }
  >
  optimalInterlining?: number // Optimal interlining değerini ekledik
}

export type KPIData = {
  totalPassengers: number
  totalDistance: number
  optimizationTime: number
  totalFuelCost: number
  totalMaintenanceCost: number
  totalDepreciationCost: number
  totalDriverCost: number
  totalCost: number
  costPerKm: number
  costPerPassenger: number
  totalCarbonEmission: number
  carbonPerPassenger: number
  carbonSaved: number
}

// OptimizationResult tipini güncelle
export type OptimizationResult = {
  routeNo: string
  routeName: string
  routeLengthAtoB: number
  routeLengthBtoA: number
  minibus: number
  solo: number
  articulated: number
  fuelCost: number
  maintenanceCost: number
  depreciationCost: number
  driverCost: number
  totalCost: number
  carbonEmission: number
  capacityUtilization: number
  peakPassengersAtoB: number
  peakPassengersBtoA: number
}

// ScheduleParameters tipini güncelle
export type ScheduleParameters = {
  timeRange: {
    start: string
    end: string
  }
}

// Saatlik talep verisi
export interface HourlyDemand {
  hour: number;
  passengersAtoB: number;
  passengersBtoA: number;
  travelTimeAtoB: number;
  travelTimeBtoA: number;
}

// Günlük rota verisi
export interface DailyRouteData {
  routeNo: string;
  routeName: string;
  distanceAtoB: number;
  distanceBtoA: number;
  hourlyDemands: HourlyDemand[];
}

// Saatlik optimizasyon sonucu
export interface HourlyOptimization {
  hour: number;
  selectedBusType: "small" | "medium" | "large";
  requiredBuses: number;
  totalCost: number;
  co2Emission: number;
  capacityUtilization: number;
}

// Günlük optimizasyon sonucu
export interface DailyOptimizationResult {
  routeNo: string;
  routeName: string;
  hourlyOptimizations: HourlyOptimization[];
  totalDailyCost: number;
  totalDailyCO2: number;
  averageCapacityUtilization: number;
}

// Context tipi
export interface BusOptimizationContextType {
  routes: RouteData[]
  dailyRoutes: DailyRouteData[]
  busParameters: BusParameters
  optimizationResults: DailyOptimizationResult[]
  scheduleParameters: ScheduleParameters
  scheduleResults: ScheduleResult | null
  kpis: KPIData | null
  setRoutes: (routes: RouteData[]) => void
  setDailyRoutes: (routes: DailyRouteData[]) => void
  setBusParameters: (params: BusParameters) => void
  setOptimizationResults: (results: DailyOptimizationResult[]) => void
  setScheduleParameters: (params: ScheduleParameters) => void
  setScheduleResults: (results: ScheduleResult | null) => void
  setKpis: (kpis: KPIData | null) => void
  isOptimizing: boolean
  setIsOptimizing: (isOptimizing: boolean) => void
  activeStep: string
  setActiveStep: (step: string) => void
}
