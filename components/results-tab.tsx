"use client"

import React, { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowUpDown, ArrowUp, ArrowDown, Download, ArrowLeft } from "lucide-react"
import { useBusOptimization } from "@/context/bus-optimization-context"
import { DailyOptimizationResult, RouteData, ScheduleResult, BusParameters } from "@/types"

export default function ResultsTab() {
  const { optimizationResults, kpis, busParameters, routes, scheduleResults, setActiveStep } = useBusOptimization()

  const goBack = () => {
    setActiveStep("planner")
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Sonuçlar</h2>
          <p className="text-muted-foreground">
            Optimizasyon sonuçlarını görüntüleyin ve analiz edin
          </p>
        </div>
        <Button onClick={goBack} variant="outline">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Geri Dön
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Optimizasyon Sonuçları</CardTitle>
          <CardDescription>
            Günlük optimizasyon sonuçları burada görüntülenecek
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-muted-foreground">
              Sonuçlar tablosu güncelleniyor...
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
