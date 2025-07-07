"use client";

import React, { type ChangeEvent } from "react";
import { useBusOptimization } from "@/context/bus-optimization-context";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Alert, AlertDescription } from "./ui/alert";
import * as XLSX from "xlsx";
import { DailyRouteData, HourlyDemand } from "@/types";
import { OptimizeButton } from "./optimize-button";

export function DataUpload() {
  const { setDailyRoutes } = useBusOptimization();
  const [error, setError] = React.useState<string | null>(null);

  const handleFileUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data);
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json(worksheet);

      // Excel verilerini DailyRouteData formatına dönüştür
      const routeMap = new Map<string, DailyRouteData>();

      jsonData.forEach((row: any) => {
        const routeNo = row["Hat No"];
        const hour = parseInt(row["Saat"]);
        const direction = row["Yön"];
        const passengers = parseInt(row["Yolcu Sayısı"]);
        const travelTime = parseInt(row["Parkur Süresi"]);

        if (!routeMap.has(routeNo)) {
          routeMap.set(routeNo, {
            routeNo,
            routeName: row["Hat Adı"] || `Hat ${routeNo}`,
            distanceAtoB: parseFloat(row["A-B Mesafe"] || "0"),
            distanceBtoA: parseFloat(row["B-A Mesafe"] || "0"),
            hourlyDemands: Array(24).fill(null).map((_, i) => ({
              hour: i,
              passengersAtoB: 0,
              passengersBtoA: 0,
              travelTimeAtoB: 0,
              travelTimeBtoA: 0
            }))
          });
        }

        const route = routeMap.get(routeNo)!;
        const hourlyDemand = route.hourlyDemands[hour];

        if (direction === "A-B") {
          hourlyDemand.passengersAtoB = passengers;
          hourlyDemand.travelTimeAtoB = travelTime;
        } else {
          hourlyDemand.passengersBtoA = passengers;
          hourlyDemand.travelTimeBtoA = travelTime;
        }
      });

      setDailyRoutes(Array.from(routeMap.values()));
      setError(null);
    } catch (err) {
      setError("Veri yükleme hatası: " + (err as Error).message);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Veri Yükleme</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <Input
              type="file"
              accept=".xlsx,.xls"
              onChange={handleFileUpload}
              className="w-full"
            />
            <p className="text-sm text-muted-foreground mt-2">
              Excel dosyası formatı: Hat No, Hat Adı, Saat (0-23), Yön (A-B/B-A),
              Yolcu Sayısı, Parkur Süresi (dk), A-B Mesafe, B-A Mesafe
            </p>
          </div>
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          <OptimizeButton />
        </div>
      </CardContent>
    </Card>
  );
} 