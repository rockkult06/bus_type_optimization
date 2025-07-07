"use client"

import React, { createContext, useContext, useState, type ReactNode } from "react"
import type {
  RouteData,
  BusParameters,
  ScheduleParameters,
  ScheduleResult,
  KPIData,
  DailyRouteData,
  DailyOptimizationResult,
  BusOptimizationContextType
} from '../types'

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
  const [optimizationResults, setOptimizationResults] = useState<DailyOptimizationResult[]>([])
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
