"use client";

import React from "react";
import { useBusOptimization } from "@/context/bus-optimization-context";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { DataUpload } from "./data-upload";

export function DailyOptimizationTab() {
  const { optimizationResults } = useBusOptimization();

  if (!optimizationResults) {
    return <DataUpload />;
  }

  return (
    <div className="space-y-6">
      {/* KPI'lar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Toplam Günlük Maliyet</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {optimizationResults.reduce((sum, route) => sum + route.totalCost, 0).toFixed(2)} TL
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Toplam CO2 Emisyonu</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {optimizationResults.reduce((sum, route) => sum + route.carbonEmission, 0).toFixed(2)} kg
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Ortalama Kapasite Kullanımı</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {(optimizationResults.reduce((sum, route) => sum + route.capacityUtilization, 0) / optimizationResults.length).toFixed(1)}%
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Hat Özeti */}
      <Card>
        <CardHeader>
          <CardTitle>Hat Özeti</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Hat No</TableHead>
                <TableHead>Hat Adı</TableHead>
                <TableHead>Günlük Maliyet</TableHead>
                <TableHead>CO2 Emisyonu</TableHead>
                <TableHead>Kapasite Kullanımı</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {optimizationResults.map((route) => (
                <TableRow key={route.routeNo}>
                  <TableCell>{route.routeNo}</TableCell>
                  <TableCell>{route.routeName}</TableCell>
                  <TableCell>{route.totalCost.toFixed(2)} TL</TableCell>
                  <TableCell>{route.carbonEmission.toFixed(2)} kg</TableCell>
                  <TableCell>{route.capacityUtilization.toFixed(1)}%</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Saatlik Detaylar */}
      {optimizationResults.map((route) => (
        <Card key={route.routeNo}>
          <CardHeader>
            <CardTitle>
              Hat {route.routeNo} - {route.routeName} Saatlik Detaylar
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Hat Uzunluğu (A-B)</TableHead>
                  <TableHead>Hat Uzunluğu (B-A)</TableHead>
                  <TableHead>Küçük Otobüs</TableHead>
                  <TableHead>Orta Otobüs</TableHead>
                  <TableHead>Büyük Otobüs</TableHead>
                  <TableHead>Toplam Maliyet</TableHead>
                  <TableHead>CO2 Emisyonu</TableHead>
                  <TableHead>Kapasite Kullanımı</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell>{route.routeLengthAtoB.toFixed(1)} km</TableCell>
                  <TableCell>{route.routeLengthBtoA.toFixed(1)} km</TableCell>
                  <TableCell>{route.minibus}</TableCell>
                  <TableCell>{route.solo}</TableCell>
                  <TableCell>{route.articulated}</TableCell>
                  <TableCell>{route.totalCost.toFixed(2)} TL</TableCell>
                  <TableCell>{route.carbonEmission.toFixed(2)} kg</TableCell>
                  <TableCell>{route.capacityUtilization.toFixed(1)}%</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      ))}
    </div>
  );
} 