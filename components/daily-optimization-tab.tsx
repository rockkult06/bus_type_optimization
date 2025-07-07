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
              {optimizationResults.reduce((sum, route) => sum + route.totalDailyCost, 0).toFixed(2)} TL
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Toplam CO2 Emisyonu</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {optimizationResults.reduce((sum, route) => sum + route.totalDailyCO2, 0).toFixed(2)} kg
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Ortalama Kapasite Kullanımı</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {(optimizationResults.reduce((sum, route) => sum + route.averageCapacityUtilization, 0) / optimizationResults.length).toFixed(1)}%
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
                  <TableCell>{route.totalDailyCost.toFixed(2)} TL</TableCell>
                  <TableCell>{route.totalDailyCO2.toFixed(2)} kg</TableCell>
                  <TableCell>{route.averageCapacityUtilization.toFixed(1)}%</TableCell>
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
                  <TableHead>Saat</TableHead>
                  <TableHead>Otobüs Tipi</TableHead>
                  <TableHead>Gerekli Otobüs</TableHead>
                  <TableHead>Saatlik Maliyet</TableHead>
                  <TableHead>CO2 Emisyonu</TableHead>
                  <TableHead>Kapasite Kullanımı</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {route.hourlyOptimizations.map((hour) => (
                  <TableRow key={hour.hour}>
                    <TableCell>{hour.hour}:00</TableCell>
                    <TableCell>{hour.selectedBusType}</TableCell>
                    <TableCell>{hour.requiredBuses}</TableCell>
                    <TableCell>{hour.totalCost.toFixed(2)} TL</TableCell>
                    <TableCell>{hour.co2Emission.toFixed(2)} kg</TableCell>
                    <TableCell>{hour.capacityUtilization.toFixed(1)}%</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      ))}
    </div>
  );
} 