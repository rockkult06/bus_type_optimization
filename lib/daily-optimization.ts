import { DailyRouteData, BusParameters, DailyOptimizationResult, HourlyOptimization } from '../types';

interface BusType {
  capacity: number;
  operatingCost: number;
  co2Emission: number;
}

export function optimizeDaily(
  routes: DailyRouteData[],
  busParameters: BusParameters
): DailyOptimizationResult[] {
  return routes.map((route) => {
    const hourlyOptimizations: HourlyOptimization[] = route.hourlyDemands.map((demand) => {
      // Her saat için optimizasyon yap
      const maxPassengers = Math.max(demand.passengersAtoB, demand.passengersBtoA);
      const maxTravelTime = Math.max(demand.travelTimeAtoB, demand.travelTimeBtoA);

      // Kullanılabilir otobüs tiplerini filtrele
      const availableBusTypes: BusType[] = [
        {
          capacity: busParameters.smallBusCapacity,
          operatingCost: busParameters.smallBusOperatingCost,
          co2Emission: busParameters.smallBusCO2Emission
        },
        {
          capacity: busParameters.mediumBusCapacity,
          operatingCost: busParameters.mediumBusOperatingCost,
          co2Emission: busParameters.mediumBusCO2Emission
        },
        {
          capacity: busParameters.largeBusCapacity,
          operatingCost: busParameters.largeBusOperatingCost,
          co2Emission: busParameters.largeBusCO2Emission
        }
      ].filter(bus => bus.capacity >= maxPassengers);

      if (availableBusTypes.length === 0) {
        throw new Error(`Saat ${demand.hour} için yeterli kapasitede otobüs bulunamadı.`);
      }

      // En düşük maliyetli otobüs tipini seç
      const selectedBus = availableBusTypes.reduce((prev, curr) => {
        const prevTotalCost = prev.operatingCost * maxTravelTime;
        const currTotalCost = curr.operatingCost * maxTravelTime;
        return prevTotalCost <= currTotalCost ? prev : curr;
      });

      // Gerekli otobüs sayısını hesapla
      const requiredBuses = Math.ceil(
        (maxTravelTime * 2) / (busParameters.operationalHours * 60)
      );

      // Saatlik optimizasyon sonuçlarını hesapla
      return {
        hour: demand.hour,
        selectedBusType: selectedBus.capacity === busParameters.smallBusCapacity ? "small" :
                        selectedBus.capacity === busParameters.mediumBusCapacity ? "medium" : "large",
        requiredBuses,
        totalCost: selectedBus.operatingCost * maxTravelTime * requiredBuses,
        co2Emission: selectedBus.co2Emission * (route.distanceAtoB + route.distanceBtoA) * requiredBuses,
        capacityUtilization: (maxPassengers / selectedBus.capacity) * 100
      };
    });

    // Günlük toplam değerleri hesapla
    const totalCost = hourlyOptimizations.reduce((sum, opt) => sum + opt.totalCost, 0);
    const totalCO2 = hourlyOptimizations.reduce((sum, opt) => sum + opt.co2Emission, 0);
    const avgCapacityUtil = hourlyOptimizations.reduce((sum, opt) => sum + opt.capacityUtilization, 0) / hourlyOptimizations.length;

    return {
      routeNo: route.routeNo,
      routeName: route.routeName,
      hourlyOptimizations,
      totalDailyCost: totalCost,
      totalDailyCO2: totalCO2,
      averageCapacityUtilization: avgCapacityUtil
    };
  });
} 