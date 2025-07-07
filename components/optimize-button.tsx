"use client";

import React from "react";
import { Button } from "./ui/button";
import { useBusOptimization } from "@/context/bus-optimization-context";
import { optimizeDaily } from "@/lib/daily-optimization";

export function OptimizeButton() {
  const { dailyRoutes, busParameters, setOptimizationResults } = useBusOptimization();
  const [isOptimizing, setIsOptimizing] = React.useState(false);

  const handleOptimize = async () => {
    if (!dailyRoutes.length) {
      alert("Lütfen önce veri yükleyin.");
      return;
    }

    setIsOptimizing(true);
    try {
      // Optimizasyon işlemini başlat
      const results = optimizeDaily(dailyRoutes, busParameters);
      setOptimizationResults(results);
    } catch (error) {
      alert("Optimizasyon sırasında bir hata oluştu: " + (error as Error).message);
    } finally {
      setIsOptimizing(false);
    }
  };

  return (
    <Button
      onClick={handleOptimize}
      disabled={isOptimizing || !dailyRoutes.length}
      className="w-full"
    >
      {isOptimizing ? "Optimizasyon Yapılıyor..." : "Optimizasyonu Başlat"}
    </Button>
  );
} 