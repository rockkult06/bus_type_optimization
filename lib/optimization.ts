import type { RouteData, BusParameters, OptimizationResult, KPIData } from "@/types"

// Main optimization function
export function runOptimization(
  routes: RouteData[],
  parameters: BusParameters,
): { results: OptimizationResult[]; kpis: KPIData; isFeasible: boolean } {
  // Initialize results array
  const results: OptimizationResult[] = []
  let isFeasible = true

  // Track total fleet usage
  let totalSmallBusUsed = 0
  let totalMediumBusUsed = 0
  let totalLargeBusUsed = 0

  // Optimize each route
  for (const route of routes) {
    const result = optimizeRoute(route, parameters)

    // Update total fleet usage
    totalSmallBusUsed += result.minibus
    totalMediumBusUsed += result.solo
    totalLargeBusUsed += result.articulated

    results.push(result)
  }

  // Check if we have enough buses in the fleet
  if (
    totalSmallBusUsed > parameters.smallBusCapacity ||
    totalMediumBusUsed > parameters.mediumBusCapacity ||
    totalLargeBusUsed > parameters.largeBusCapacity
  ) {
    isFeasible = false
  }

  // Calculate KPIs
  const kpis = calculateKPIs(results, routes, parameters)

  return { results, kpis, isFeasible }
}

// OptimizationResult tipini güncelle - routeLength alanını kaldır ve her iki yön için ayrı uzunluk ekle
function optimizeRoute(route: RouteData, parameters: BusParameters): OptimizationResult {
  const { routeNo, routeName, routeLengthAtoB, routeLengthBtoA, peakPassengersAtoB, peakPassengersBtoA } = route

  // Ortalama hat uzunluğunu hesapla
  const avgRouteLength = (routeLengthAtoB + routeLengthBtoA) / 2

  // Her iki yöndeki toplam yolcu sayısını hesapla
  const totalPassengers = peakPassengersAtoB + peakPassengersBtoA

  // Her yön için ayrı ayrı minimum otobüs sayılarını hesapla
  const minSmallBusesAtoB = Math.ceil(peakPassengersAtoB / parameters.smallBusCapacity)
  const minMediumBusesAtoB = Math.ceil(peakPassengersAtoB / parameters.mediumBusCapacity)
  const minLargeBusesAtoB = Math.ceil(peakPassengersAtoB / parameters.largeBusCapacity)

  const minSmallBusesBtoA = Math.ceil(peakPassengersBtoA / parameters.smallBusCapacity)
  const minMediumBusesBtoA = Math.ceil(peakPassengersBtoA / parameters.mediumBusCapacity)
  const minLargeBusesBtoA = Math.ceil(peakPassengersBtoA / parameters.largeBusCapacity)

  // Her iki yön için toplam minimum otobüs sayılarını hesapla
  const minSmallBuses = Math.max(minSmallBusesAtoB, minSmallBusesBtoA)
  const minMediumBuses = Math.max(minMediumBusesAtoB, minMediumBusesBtoA)
  const minLargeBuses = Math.max(minLargeBusesAtoB, minLargeBusesBtoA)

  // Calculate costs for different bus types
  const smallBusOperatingCost = parameters.smallBusOperatingCost
  const mediumBusOperatingCost = parameters.mediumBusOperatingCost
  const largeBusOperatingCost = parameters.largeBusOperatingCost

  // Initialize variables to track the best solution
  let bestCost = Number.POSITIVE_INFINITY
  let bestSmallBus = 0
  let bestMediumBus = 0
  let bestLargeBus = 0
  let bestCapacityUtilization = 0

  // Try different combinations of bus types
  for (let s = 0; s <= minSmallBuses; s++) {
    for (let m = 0; m <= minMediumBuses; m++) {
      for (let l = 0; l <= minLargeBuses; l++) {
        // Calculate total capacity
        const totalCapacity =
          s * parameters.smallBusCapacity + m * parameters.mediumBusCapacity + l * parameters.largeBusCapacity

        // Her iki yön için kapasite kontrolü yap
        if (totalCapacity < peakPassengersAtoB || totalCapacity < peakPassengersBtoA) continue

        // Calculate capacity utilization (her iki yönün ortalaması)
        const capacityUtilizationAtoB = peakPassengersAtoB / totalCapacity
        const capacityUtilizationBtoA = peakPassengersBtoA / totalCapacity
        const capacityUtilization = (capacityUtilizationAtoB + capacityUtilizationBtoA) / 2

        // Calculate total cost - her iki yöndeki hat uzunluklarını kullan
        const totalFuelCost =
          s * parameters.smallBusOperatingCost * routeLengthAtoB +
          m * parameters.mediumBusOperatingCost * routeLengthAtoB +
          l * parameters.largeBusOperatingCost * routeLengthAtoB +
          s * parameters.smallBusOperatingCost * routeLengthBtoA +
          m * parameters.mediumBusOperatingCost * routeLengthBtoA +
          l * parameters.largeBusOperatingCost * routeLengthBtoA

        const totalMaintenanceCost =
          s * parameters.smallBusOperatingCost * routeLengthAtoB +
          m * parameters.mediumBusOperatingCost * routeLengthAtoB +
          l * parameters.largeBusOperatingCost * routeLengthAtoB +
          s * parameters.smallBusOperatingCost * routeLengthBtoA +
          m * parameters.mediumBusOperatingCost * routeLengthBtoA +
          l * parameters.largeBusOperatingCost * routeLengthBtoA

        const totalDepreciationCost =
          s * parameters.smallBusOperatingCost * routeLengthAtoB +
          m * parameters.mediumBusOperatingCost * routeLengthAtoB +
          l * parameters.largeBusOperatingCost * routeLengthAtoB +
          s * parameters.smallBusOperatingCost * routeLengthBtoA +
          m * parameters.mediumBusOperatingCost * routeLengthBtoA +
          l * parameters.largeBusOperatingCost * routeLengthBtoA

        const totalDriverCost = (s + m + l) * parameters.operationalHours * (routeLengthAtoB + routeLengthBtoA)

        const totalCost = totalFuelCost + totalMaintenanceCost + totalDepreciationCost + totalDriverCost

        // Calculate carbon emission - her iki yöndeki hat uzunluklarını kullan
        const totalCarbonEmission =
          s * parameters.smallBusCO2Emission * routeLengthAtoB +
          m * parameters.mediumBusCO2Emission * routeLengthAtoB +
          l * parameters.largeBusCO2Emission * routeLengthAtoB +
          s * parameters.smallBusCO2Emission * routeLengthBtoA +
          m * parameters.mediumBusCO2Emission * routeLengthBtoA +
          l * parameters.largeBusCO2Emission * routeLengthBtoA

        // Update best solution if this is better
        if (totalCost < bestCost) {
          bestCost = totalCost
          bestSmallBus = s
          bestMediumBus = m
          bestLargeBus = l
          bestCapacityUtilization = capacityUtilization
        }
      }
    }
  }

  // Calculate detailed costs for the best solution - her iki yöndeki hat uzunluklarını kullan
  const fuelCost =
    bestSmallBus * parameters.smallBusOperatingCost * (routeLengthAtoB + routeLengthBtoA) +
    bestMediumBus * parameters.mediumBusOperatingCost * (routeLengthAtoB + routeLengthBtoA) +
    bestLargeBus * parameters.largeBusOperatingCost * (routeLengthAtoB + routeLengthBtoA)

  const maintenanceCost =
    bestSmallBus * parameters.smallBusOperatingCost * (routeLengthAtoB + routeLengthBtoA) +
    bestMediumBus * parameters.mediumBusOperatingCost * (routeLengthAtoB + routeLengthBtoA) +
    bestLargeBus * parameters.largeBusOperatingCost * (routeLengthAtoB + routeLengthBtoA)

  const depreciationCost =
    bestSmallBus * parameters.smallBusOperatingCost * (routeLengthAtoB + routeLengthBtoA) +
    bestMediumBus * parameters.mediumBusOperatingCost * (routeLengthAtoB + routeLengthBtoA) +
    bestLargeBus * parameters.largeBusOperatingCost * (routeLengthAtoB + routeLengthBtoA)

  const driverCost =
    (bestSmallBus + bestMediumBus + bestLargeBus) * parameters.operationalHours * (routeLengthAtoB + routeLengthBtoA)

  const carbonEmission =
    bestSmallBus * parameters.smallBusCO2Emission * (routeLengthAtoB + routeLengthBtoA) +
    bestMediumBus * parameters.mediumBusCO2Emission * (routeLengthAtoB + routeLengthBtoA) +
    bestLargeBus * parameters.largeBusCO2Emission * (routeLengthAtoB + routeLengthBtoA)

  // Return the optimization result
  return {
    routeNo,
    routeName,
    routeLengthAtoB,
    routeLengthBtoA,
    minibus: bestSmallBus,
    solo: bestMediumBus,
    articulated: bestLargeBus,
    fuelCost,
    maintenanceCost,
    depreciationCost,
    driverCost,
    totalCost: fuelCost + maintenanceCost + depreciationCost + driverCost,
    carbonEmission,
    capacityUtilization: bestCapacityUtilization,
    peakPassengersAtoB,
    peakPassengersBtoA,
  }
}

// calculateKPIs fonksiyonunu güncelle - NaN değerlerini önlemek için
function calculateKPIs(results: OptimizationResult[], routes: RouteData[], parameters: BusParameters): KPIData {
  // Calculate total passengers (her iki yön için)
  const totalPassengers = routes.reduce((sum, route) => sum + route.peakPassengersAtoB + route.peakPassengersBtoA, 0)

  // Calculate total distance - her iki yöndeki hat uzunluklarını kullan
  let totalDistance = 0

  results.forEach((result) => {
    const route = routes.find((r) => r.routeNo === result.routeNo)
    if (route) {
      // Her iki yöndeki toplam mesafe
      const routeDistance = route.routeLengthAtoB + route.routeLengthBtoA
      // Her otobüs tipi için sefer sayısı
      const totalTrips = result.minibus + result.solo + result.articulated
      // Bu hat için toplam mesafe
      totalDistance += routeDistance * totalTrips
    }
  })

  // Calculate total costs
  const totalFuelCost = results.reduce((sum, result) => sum + result.fuelCost, 0)
  const totalMaintenanceCost = results.reduce((sum, result) => sum + result.maintenanceCost, 0)
  const totalDepreciationCost = results.reduce((sum, result) => sum + result.depreciationCost, 0)
  const totalDriverCost = results.reduce((sum, result) => sum + result.driverCost, 0)
  const totalCost = totalFuelCost + totalMaintenanceCost + totalDepreciationCost + totalDriverCost

  // Calculate cost per km and per passenger
  const costPerKm = totalDistance > 0 ? totalCost / totalDistance : 0
  const costPerPassenger = totalPassengers > 0 ? totalCost / totalPassengers : 0

  // Calculate carbon emission metrics
  const totalCarbonEmission = results.reduce((sum, result) => sum + result.carbonEmission, 0)
  const carbonPerPassenger = totalPassengers > 0 ? totalCarbonEmission / totalPassengers : 0

  // Estimate carbon saved by using public transport
  // Assuming average car emission is 0.2 kg/km per passenger
  const carEmissionPerPassenger = 0.2
  const carbonSaved = totalPassengers * totalDistance * (carEmissionPerPassenger - carbonPerPassenger)

  return {
    totalPassengers,
    totalDistance,
    optimizationTime: 0, // This will be set by the caller
    totalFuelCost,
    totalMaintenanceCost,
    totalDepreciationCost,
    totalDriverCost,
    totalCost,
    costPerKm,
    costPerPassenger,
    totalCarbonEmission,
    carbonPerPassenger,
    carbonSaved,
  }
}
