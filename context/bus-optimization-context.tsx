"use client"

import React, { createContext, useContext, useState, type ReactNode } from "react"
import type {
  RouteData,
  BusParameters,
  OptimizationResult,
  ScheduleParameters,
  ScheduleResult,
  KPIData,
  DailyRouteData,
  HourlyDemand,
  DailyOptimizationResult
} from '../types'

// RouteData tipini güncelle - her iki yön için ayrı uzunluk ve parkur süresi ekle
export type RouteData = {
  routeNo: string
  routeName: string
  routeLengthAtoB: number // A'dan B'ye hat uzunluğu
  routeLengthBtoA: number // B'den A'ya hat uzunluğu
  travelTimeAtoB: number // A'dan B'ye parkur süresi (dakika)
  travelTimeBtoA: number // B'den A'ya parkur süresi (dakika)
  peakPassengersAtoB: number // A'dan B'ye yolcu sayısı
  peakPassengersBtoA: number // B'den A'ya yolcu sayısı
}

// BusParameters tipine maxInterlining ekleyelim
export type BusParameters = {
  smallBusCapacity: number
  smallBusOperatingCost: number
  smallBusCO2Emission: number
  mediumBusCapacity: number
  mediumBusOperatingCost: number
  mediumBusCO2Emission: number
  largeBusCapacity: number
  largeBusOperatingCost: number
  largeBusCO2Emission: number
  operationalHours: number
}

// Schedule optimization types
// ScheduleParameters tipini güncelle - artık parkur sürelerini içermeyecek
export type ScheduleParameters = {
  timeRange: {
    start: string
    end: string
  }
}

// ScheduleResult tipini güncelle - hat bazlı çizelgeleri ekle
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

// OptimizationResult tipini güncelle
export type OptimizationResult = {
  routeNo: string
  routeName: string
  routeLength: number
  minibus: number
  solo: number
  articulated: number
  fuelCost: number
  maintenanceCost: number
  depreciationCost: number
  driverCost: number
  totalCost: number
  carbonEmission: number // Carbon emission for this route
  capacityUtilization: number
  peakPassengersAtoB: number // A'dan B'ye yolcu sayısı
  peakPassengersBtoA: number // B'den A'ya yolcu sayısı
}

// Schedule optimization types
export type ScheduleEntry = {
  routeNo: string
  departureTime: string
  arrivalTime: string
  busType: "minibus" | "solo" | "articulated"
  busNumber: string
  direction: "AtoB" | "BtoA"
}

// Update the KPIData type to include carbon emission metrics
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
  totalCarbonEmission: number // Total carbon emission
  carbonPerPassenger: number // Carbon emission per passenger
  carbonSaved: number // Carbon emission saved by using public transport
}

interface BusOptimizationContextType {
  routes: RouteData[]
  dailyRoutes: DailyRouteData[]
  busParameters: BusParameters
  optimizationResults: OptimizationResult[]
  scheduleParameters: ScheduleParameters
  scheduleResults: ScheduleResult | null
  kpis: KPIData | null
  setRoutes: (routes: RouteData[]) => void
  setDailyRoutes: (routes: DailyRouteData[]) => void
  setBusParameters: (params: BusParameters) => void
  setOptimizationResults: (results: OptimizationResult[]) => void
  setScheduleParameters: (params: ScheduleParameters) => void
  setScheduleResults: (results: ScheduleResult | null) => void
  setKpis: (kpis: KPIData | null) => void
  isOptimizing: boolean
  setIsOptimizing: (isOptimizing: boolean) => void
  activeStep: string
  setActiveStep: (step: string) => void
}

const defaultParameters: BusParameters = {
  smallBusCapacity: 25,
  smallBusOperatingCost: 0.8,
  smallBusCO2Emission: 0.7,
  mediumBusCapacity: 90,
  mediumBusOperatingCost: 1.0,
  mediumBusCO2Emission: 1.0,
  largeBusCapacity: 150,
  largeBusOperatingCost: 1.3,
  largeBusCO2Emission: 1.4,
  operationalHours: 18,
}

const defaultScheduleParameters: ScheduleParameters = {
  timeRange: {
    start: "06:00",
    end: "23:00",
  },
}

const BusOptimizationContext = createContext<BusOptimizationContextType | undefined>(undefined)

export function useBusOptimization() {
  const context = useContext(BusOptimizationContext)
  if (!context) {
    throw new Error("useBusOptimization must be used within a BusOptimizationProvider")
  }
  return context
}

export function BusOptimizationProvider({ children }: { children: ReactNode }) {
  const [routes, setRoutes] = useState<RouteData[]>([])
  const [dailyRoutes, setDailyRoutes] = useState<DailyRouteData[]>([])
  const [busParameters, setBusParameters] = useState<BusParameters>(defaultParameters)
  const [optimizationResults, setOptimizationResults] = useState<OptimizationResult[]>([])
  const [scheduleParameters, setScheduleParameters] = useState<ScheduleParameters>(defaultScheduleParameters)
  const [scheduleResults, setScheduleResults] = useState<ScheduleResult | null>(null)
  const [kpis, setKpis] = useState<KPIData | null>(null)
  const [isOptimizing, setIsOptimizing] = useState(false)
  const [activeStep, setActiveStep] = useState("busType")

  return (
    <BusOptimizationContext.Provider
      value={{
        routes,
        dailyRoutes,
        busParameters,
        optimizationResults,
        scheduleParameters,
        scheduleResults,
        kpis,
        setRoutes,
        setDailyRoutes,
        setBusParameters,
        setOptimizationResults,
        setScheduleParameters,
        setScheduleResults,
        setKpis,
        isOptimizing,
        setIsOptimizing,
        activeStep,
        setActiveStep,
      }}
    >
      {children}
    </BusOptimizationContext.Provider>
  )
}
