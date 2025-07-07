"use client"

import { DailyOptimizationTab } from "@/components/daily-optimization-tab"
import { BusOptimizationProvider } from "@/context/bus-optimization-context"

export default function BusTypePage() {
  return (
    <BusOptimizationProvider>
      <div className="container mx-auto py-6">
        <h1 className="text-2xl font-bold mb-6">Otobüs Tipi Optimizasyonu</h1>
        <DailyOptimizationTab />
      </div>
    </BusOptimizationProvider>
  )
}
