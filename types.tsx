// RouteData tipini güncelle
export interface RouteData extends Omit<DailyRouteData, 'hourlyDemands'> {
  routeNo: string
  routeName: string
  routeLengthAtoB: number
  routeLengthBtoA: number
  travelTimeAtoB: number
  travelTimeBtoA: number
  peakPassengersAtoB: number
  peakPassengersBtoA: number
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
    }
  >
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
