"use client"

import React from "react"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft, Search, Bus, Filter, ZoomIn, ZoomOut, RefreshCw, ChevronDown } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import * as Tooltip from "@radix-ui/react-tooltip"

interface RouteData {
  routeNo: string
  routeName: string
  routeLengthAtoB?: number
  routeLengthBtoA?: number
  travelTimeAtoB?: number
  travelTimeBtoA?: number
}

// TimelineBlock component
interface TimelineBlockProps {
  routeNo: string
  startTime: string
  endTime: string
  direction: string
  duration: number
  color: string
  routeName: string
  style: React.CSSProperties
  routeLength?: number
  busId: string
}

// Update the TimelineBlock component to have more modern styling with better directional indicators
const TimelineBlock: React.FC<TimelineBlockProps> = ({
  routeNo,
  startTime,
  endTime,
  direction,
  duration,
  color,
  routeName,
  style,
  routeLength = 0,
  busId,
}) => {
  // Create gradient for better visual appeal
  const gradientColor = `linear-gradient(to right, ${color}cc, ${color}cc)` // 80% opacity (cc)

  // Determine the shape based on direction
  const isGoingDirection = direction === "A->B"

  // Create clip path for directional shape - make it more subtle at higher zoom levels
  const clipPath = isGoingDirection
    ? "polygon(0% 0%, 97% 0%, 100% 50%, 97% 100%, 0% 100%, 3% 50%)"
    : "polygon(3% 0%, 100% 0%, 100% 100%, 3% 100%, 0% 50%)"

  return (
    <Tooltip.Provider>
      <Tooltip.Root>
        <Tooltip.Trigger asChild>
          <div
            className="absolute h-10 shadow-md flex items-center justify-center text-white text-xs font-medium overflow-hidden whitespace-nowrap transition-all duration-200 hover:shadow-lg"
            style={{
              ...style,
              background: gradientColor,
              boxShadow: "0px 4px 10px rgba(0,0,0,0.2), 0 0 0 1px rgba(255,255,255,0.2), 0 0 8px rgba(255,255,255,0.2)",
              clipPath: clipPath,
              borderRadius: "12px",
              // Ensure text doesn't overflow
              textOverflow: "ellipsis",
              minWidth: "40px", // Ensure blocks have a minimum width
              transition: "all 0.5s ease", // Increased from 0.2s to 0.5s for smoother transition
              border: "1.5px solid rgba(255,255,255,0.25)", // Daha kalın ve belirgin kenar
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = `linear-gradient(to right, ${color}, ${color})` // 100% opacity
              e.currentTarget.style.boxShadow = "0px 4px 20px rgba(0,0,0,0.3), 0 0 0 2px rgba(255,255,255,0.4), 0 0 16px rgba(255,255,255,0.3)" // Daha güçlü glow efekti
              e.currentTarget.style.border = "2px solid rgba(255,255,255,0.5)" // Daha kalın ve parlak kenar
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = gradientColor // Back to 80% opacity
              e.currentTarget.style.boxShadow = "0px 4px 10px rgba(0,0,0,0.2), 0 0 0 1px rgba(255,255,255,0.2), 0 0 8px rgba(255,255,255,0.2)"
              e.currentTarget.style.border = "1.5px solid rgba(255,255,255,0.25)"
            }}
          >
            {/* Direction Indicator Arrow - Enhanced */}
            {isGoingDirection && (
              <div className="absolute right-1 h-full flex items-center justify-center opacity-80">
                <div className="w-0 h-0 border-y-[6px] border-y-transparent border-l-[6px] border-l-white"></div>
              </div>
            )}
            {!isGoingDirection && (
              <div className="absolute left-1 h-full flex items-center justify-center opacity-80">
                <div className="w-0 h-0 border-y-[6px] border-y-transparent border-r-[6px] border-r-white"></div>
              </div>
            )}

            <span className="px-3 font-medium truncate text-sm">{routeNo}</span>
          </div>
        </Tooltip.Trigger>
        <Tooltip.Content
          side="top"
          className="bg-white text-gray-800 border border-gray-200 shadow-md rounded-lg p-3 z-50 max-w-[250px]"
        >
          <div className="space-y-1.5">
            <p className="font-semibold text-sm flex items-center">
              <span className="h-3 w-3 rounded-full mr-2" style={{ backgroundColor: color }}></span>
              Hat {routeNo} {routeName && `- ${routeName}`}
            </p>
            <p className="text-xs text-gray-600">Yön: {direction === "A->B" ? "A → B (Gidiş)" : "B → A (Dönüş)"}</p>
            <p className="text-xs text-gray-600">Kalkış Saati: {startTime}</p>
            <p className="text-xs text-gray-600">Tahmini Varış: {endTime}</p>
            <p className="text-xs text-gray-600">Süre: {duration} dakika</p>
            {routeLength > 0 && <p className="text-xs text-gray-600">Mesafe: {routeLength.toFixed(1)} km</p>}
            {/* Otobüsün çalıştığı hat sayısını göster */}
            <p className="text-xs text-gray-600 mt-1 pt-1 border-t border-gray-200">
              Otobüs: {busId}
            </p>
          </div>
        </Tooltip.Content>
      </Tooltip.Root>
    </Tooltip.Provider>
  )
}

// Calculate estimated end time based on duration
const calculateEndTime = (startTime: string, durationMinutes: number): string => {
  const [hours, minutes] = startTime.split(":").map(Number)
  const totalMinutes = hours * 60 + minutes + durationMinutes

  const newHours = Math.floor(totalMinutes / 60) % 24
  const newMinutes = totalMinutes % 60

  return `${String(newHours).padStart(2, "0")}:${String(newMinutes).padStart(2, "0")}`
}

// Update the props interface to ensure routes is properly typed with a default value
interface BusScheduleTimelineProps {
  scheduleResults: any
  routes?: any[]
}

// In the component definition, add a default value for routes
const BusScheduleTimeline: React.FC<BusScheduleTimelineProps> = ({
  scheduleResults,
  routes = [], // Add default empty array
}) => {
  // Convert time string to minutes for comparison
  const timeToMinutes = (time: string): number => {
    const [hours, minutes] = time.split(":").map(Number)
    return hours * 60 + minutes
  }

  // Check if time is within the filter range
  const isTimeInRange = (time: string, startTime: string, endTime: string): boolean => {
    const timeMinutes = timeToMinutes(time)
    const startMinutes = timeToMinutes(startTime)
    const endMinutes = timeToMinutes(endTime)

    return timeMinutes >= startMinutes && timeMinutes <= endMinutes
  }
  // State for timeline controls
  const [zoomLevel, setZoomLevel] = React.useState<number>(1)
  const [scrollPosition, setScrollPosition] = React.useState<number>(0)
  const [filterRoute, setFilterRoute] = React.useState<string>("")
  const [filterBusId, setFilterBusId] = React.useState<string>("")
  const [filterDirection, setFilterDirection] = React.useState<string>("all")
  const [filterTimeRange, setFilterTimeRange] = React.useState<{ start: string; end: string }>({
    start: "05:00",
    end: "23:00",
  })
  const [showFilters, setShowFilters] = React.useState<boolean>(false)

  // Prepare the data for visualization - extract bus IDs, process trips data
  // Inside the BusScheduleTimeline component, update the busIds useMemo to include bus type
  const busIds = React.useMemo(() => {
    if (!scheduleResults || !scheduleResults.busUtilization) return []

    const ids = Object.keys(scheduleResults.busUtilization).map((id) => {
      const busType = scheduleResults.busUtilization[id].busType
      // Add bus type letter
      const typeLabel = busType === "minibus" ? "M" : busType === "solo" ? "S" : "K"
      return { id, typeLabel }
    })

    // Apply bus ID filter
    if (filterBusId) {
      return ids.filter((item) => item.id.toLowerCase().includes(filterBusId.toLowerCase()))
    }

    return ids.sort((a, b) => a.id.localeCompare(b.id))
  }, [scheduleResults, filterBusId])

  // Apply direction filter to processed data
  const processedData = React.useMemo(() => {
    const data: Record<string, any[]> = {}

    if (!scheduleResults) return data

    // Process A->B schedules
    if (scheduleResults.scheduleAB && (filterDirection === "all" || filterDirection === "ab")) {
      scheduleResults.scheduleAB.forEach((trip: any) => {
        if (!trip.busId) return

        // Apply route filter
        if (filterRoute && trip.routeNo !== filterRoute) return

        // Apply time range filter
        if (!isTimeInRange(trip.time, filterTimeRange.start, filterTimeRange.end)) return

        if (!data[trip.busId]) {
          data[trip.busId] = []
        }

        // Add null check for routes
        const route = routes && routes.length > 0 ? routes.find((r) => r.routeNo === trip.routeNo) : undefined
        const duration = route?.travelTimeAtoB || 30 // Default to 30 min if not found
        const routeLength = route?.routeLengthAtoB || 0

        data[trip.busId].push({
          startTime: trip.time,
          endTime: calculateEndTime(trip.time, duration),
          duration: duration,
          direction: "A->B",
          routeNo: trip.routeNo || "Unknown",
          routeName: route?.routeName || "",
          routeLength: routeLength,
          busId: trip.busId,
        })
      })
    }

    // Process B->A schedules
    if (scheduleResults.scheduleBA && (filterDirection === "all" || filterDirection === "ba")) {
      scheduleResults.scheduleBA.forEach((trip: any) => {
        if (!trip.busId) return

        // Apply route filter
        if (filterRoute && trip.routeNo !== filterRoute) return

        // Apply time range filter
        if (!isTimeInRange(trip.time, filterTimeRange.start, filterTimeRange.end)) return

        if (!data[trip.busId]) {
          data[trip.busId] = []
        }

        // Add null check for routes
        const route = routes && routes.length > 0 ? routes.find((r) => r.routeNo === trip.routeNo) : undefined
        const duration = route?.travelTimeBtoA || 30 // Default to 30 min if not found
        const routeLength = route?.routeLengthBtoA || 0

        // Hesaplanan bitiş zamanı
        const calculatedEndTime = calculateEndTime(trip.time, duration)

        data[trip.busId].push({
          startTime: trip.time,
          endTime: calculatedEndTime,
          duration: duration,
          direction: "B->A",
          routeNo: trip.routeNo || "Unknown",
          routeName: route?.routeName || "",
          routeLength: routeLength,
          busId: trip.busId,
        })
      })
    }

    return data
  }, [scheduleResults, routes, filterRoute, filterDirection, filterTimeRange, isTimeInRange])

  // Generate route colors with better color contrast
  // Update the route colors to use more pastel tones
  const routeColors = React.useMemo(() => {
    const colors: Record<string, string> = {}

    // Get unique route numbers
    const uniqueRouteNos = new Set<string>()
    if (scheduleResults?.scheduleAB) {
      scheduleResults.scheduleAB.forEach((trip: any) => {
        if (trip.routeNo) uniqueRouteNos.add(trip.routeNo)
      })
    }
    if (scheduleResults?.scheduleBA) {
      scheduleResults.scheduleBA.forEach((trip: any) => {
        if (trip.routeNo) uniqueRouteNos.add(trip.routeNo)
      })
    }

    // Improved pastel color palette
    const colorPalette = [
      "#93c5fd", // blue-300
      "#86efac", // green-300
      "#fdba74", // orange-300
      "#c4b5fd", // violet-300
      "#f9a8d4", // pink-300
      "#fda4af", // rose-300
      "#a5f3fc", // cyan-300
      "#fcd34d", // amber-300
      "#a5b4fc", // indigo-300
      "#5eead4", // teal-300
      "#d8b4fe", // purple-300
      "#bef264", // lime-300
    ]

    // Assign colors to routes
    ;[...uniqueRouteNos].forEach((routeNo, index) => {
      colors[routeNo] = colorPalette[index % colorPalette.length]
    })

    return colors
  }, [scheduleResults])

  // Get unique route numbers for filtering
  const uniqueRouteNumbers = React.useMemo(() => {
    const routeNumbers = new Set<string>()

    if (scheduleResults?.scheduleAB) {
      scheduleResults.scheduleAB.forEach((trip: any) => {
        if (trip.routeNo) routeNumbers.add(trip.routeNo)
      })
    }

    if (scheduleResults?.scheduleBA) {
      scheduleResults.scheduleBA.forEach((trip: any) => {
        if (trip.routeNo) routeNumbers.add(trip.routeNo)
      })
    }

    return Array.from(routeNumbers).sort()
  }, [scheduleResults])

  // Generate time labels (every hour from 05:00 to 02:00)
  const timeLabels = React.useMemo(() => {
    // Adjust time interval based on zoom level - more granular at higher zoom levels
    const interval = zoomLevel <= 1 ? 60 : zoomLevel <= 2 ? 30 : zoomLevel <= 3 ? 15 : 10 // minutes
    const totalHours = 21 // 5:00 to 2:00 is 21 hours
    const labels = []

    for (let i = 0; i < totalHours * (60 / interval); i++) {
      const totalMinutes = 5 * 60 + i * interval // Start from 5:00 AM
      const hour = Math.floor(totalMinutes / 60) % 24
      const minute = totalMinutes % 60

      const time = `${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`
      labels.push(time)
    }

    return labels
  }, [zoomLevel])

  // If no data yet, show loading or empty state
  if (!scheduleResults || busIds.length === 0) {
    return (
      <div className="rounded-lg bg-gray-100 dark:bg-gray-800 p-8 text-center text-muted-foreground">
        <div className="flex flex-col items-center justify-center">
          <Bus className="h-10 w-10 mb-3 text-gray-400 dark:text-gray-600" />
          <p className="text-base">Görselleştirilecek çizelge verisi bulunamadı.</p>
          <p className="text-sm mt-1 text-gray-500 dark:text-gray-400">
            Önce sefer çizelgesi optimizasyonu çalıştırılmalıdır.
          </p>
        </div>
      </div>
    )
  }

  // Function to calculate the position and width of a timeline block
  const calculateBlockPosition = (startTime: string, duration: number) => {
    const [startHour, startMinute] = startTime.split(":").map(Number)
    const totalStartMinutes = startHour * 60 + startMinute - 5 * 60 // Minutes since 5:00 AM

    // Calculate position as percentage of total timeline width
    const startPosition = (totalStartMinutes / (21 * 60)) * 100 // 21 hours from 5 AM to 2 AM

    // Calculate width as percentage of total timeline width
    // Ensure width is proportional to duration
    const width = (duration / (21 * 60)) * 100

    return { startPosition, width }
  }

  // Handle zoom level change
  const handleZoomChange = (newZoom: number) => {
    setZoomLevel(newZoom)
  }

  // Reset all filters
  const resetFilters = () => {
    setFilterRoute("")
    setFilterBusId("")
    setFilterDirection("all")
    setFilterTimeRange({ start: "05:00", end: "23:00" })
    setZoomLevel(1)
  }

  // RouteLegend component, add safety checks
  const RouteLegend: React.FC<{
    routeColors: Record<string, string>
    routes: any[]
  }> = ({ routeColors, routes = [] }) => {
    return (
      <div className="mt-4 flex flex-wrap gap-2">
        {Object.entries(routeColors).map(([routeNo, color]) => {
          // Add null check for routes
          const route = routes && routes.length > 0 ? routes.find((r) => r.routeNo === routeNo) : undefined
          return (
            <div
              key={routeNo}
              className="flex items-center rounded-md px-2 py-1 text-xs text-white shadow-sm"
              style={{ backgroundColor: color }}
            >
              <span className="font-medium">Hat {routeNo}</span>
              {route?.routeName && <span className="ml-1 opacity-80 hidden md:inline">- {route.routeName}</span>}
            </div>
          )
        })}
      </div>
    )
  }

  return (
    <Tooltip.Provider>
      <div className="space-y-4">
        {/* Filter Controls */}
        <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" className="text-xs" onClick={() => setShowFilters(!showFilters)}>
              <Filter className="h-3 w-3 mr-1" />
              {showFilters ? "Filtreleri Gizle" : "Filtreleri Göster"}
            </Button>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={() => handleZoomChange(Math.max(0.5, zoomLevel - 0.5))}
                disabled={zoomLevel <= 0.5}
              >
                <ZoomOut className="h-4 w-4" />
              </Button>
              <Slider
                value={[zoomLevel]}
                min={0.5}
                max={4}
                step={0.5}
                className="w-24"
                onValueChange={(value) => handleZoomChange(value[0])}
              />
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={() => handleZoomChange(Math.min(4, zoomLevel + 0.5))}
                disabled={zoomLevel >= 4}
              >
                <ZoomIn className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="text-xs" onClick={resetFilters}>
              <RefreshCw className="h-3 w-3 mr-1" />
              Sıfırla
            </Button>

            <Button
              variant="outline"
              size="sm"
              className="text-xs"
              onClick={() => {
                const container = document.getElementById("schedule-timeline-container")
                if (container) {
                  container.scrollLeft = 0
                }
              }}
            >
              <ArrowLeft className="h-3 w-3 mr-1" />
              Başa Dön
            </Button>
          </div>
        </div>

        {/* Expanded Filters Panel */}
        {showFilters && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg mb-4 animate-fadeIn">
            <div>
              <Label htmlFor="route-filter" className="text-xs font-medium mb-1.5 block">
                Hat Numarası
              </Label>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="w-full justify-between">
                    {filterRoute || "Tüm Hatlar"}
                    <ChevronDown className="h-4 w-4 ml-2 opacity-50" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-48">
                  <DropdownMenuItem onClick={() => setFilterRoute("")}>Tüm Hatlar</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  {uniqueRouteNumbers.map((routeNo) => (
                    <DropdownMenuItem key={routeNo} onClick={() => setFilterRoute(routeNo)}>
                      Hat {routeNo}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <div>
              <Label htmlFor="bus-filter" className="text-xs font-medium mb-1.5 block">
                Otobüs ID
              </Label>
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
                <Input
                  id="bus-filter"
                  value={filterBusId}
                  onChange={(e) => setFilterBusId(e.target.value)}
                  placeholder="Otobüs ara..."
                  className="pl-9"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="direction-filter" className="text-xs font-medium mb-1.5 block">
                Yön
              </Label>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="w-full justify-between">
                    {filterDirection === "all"
                      ? "Tüm Yönler"
                      : filterDirection === "ab"
                        ? "A → B (Gidiş)"
                        : "B → A (Dönüş)"}
                    <ChevronDown className="h-4 w-4 ml-2 opacity-50" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={() => setFilterDirection("all")}>Tüm Yönler</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setFilterDirection("ab")}>A → B (Gidiş)</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setFilterDirection("ba")}>B → A (Dönüş)</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <div>
              <Label className="text-xs font-medium mb-1.5 block">Zaman Aralığı</Label>
              <div className="flex items-center space-x-2">
                <Input
                  type="time"
                  value={filterTimeRange.start}
                  onChange={(e) => setFilterTimeRange({ ...filterTimeRange, start: e.target.value })}
                  className="w-full"
                />
                <span className="text-gray-500">-</span>
                <Input
                  type="time"
                  value={filterTimeRange.end}
                  onChange={(e) => setFilterTimeRange({ ...filterTimeRange, end: e.target.value })}
                  className="w-full"
                />
              </div>
            </div>
          </div>
        )}

        {/* Timeline */}
        {/* Update the timeline container styling for a more modern look */}
        <div id="schedule-timeline-container" className="w-full overflow-x-auto">
          <div
            className="min-w-[1000px] relative bg-gray-800 rounded-xl text-white overflow-hidden border border-gray-700 shadow-xl"
            style={{
              width: `${100 * Math.max(1, zoomLevel)}%`,
              // Add a transform-origin to ensure zooming happens from the left
              transformOrigin: "left center",
              position: "relative", // Ensure proper stacking context
            }}
          >
            {/* Timeline header with time labels */}
            <div className="flex border-b border-gray-700 sticky top-0 z-20 bg-gray-800">
              {/* Bus ID column - z-index değerini artırıp, left:0 pozisyonunu kesin olarak belirtelim */}
              <div className="w-20 min-w-20 flex items-center justify-center p-2 font-medium text-sm border-r border-gray-700 sticky left-0 z-50 bg-gray-800 shadow-md">
                ID - Tip
              </div>

              {/* Time columns */}
              <div className="flex-1 flex">
                {timeLabels.map((label, index) => (
                  <div
                    key={index}
                    className="flex-1 text-center py-2 text-xs text-gray-300 border-r border-gray-700/50 last:border-r-0"
                  >
                    {label}
                  </div>
                ))}
              </div>
            </div>

            {/* Bus rows */}
            <div className="relative max-h-[560px] overflow-y-auto">
              {/* Vertical time grid lines - improved styling with better visibility */}
              <div className="absolute inset-0 flex pointer-events-none">
                {timeLabels.map((_, index) => (
                  <div key={index} className="flex-1 border-r border-gray-600/40 last:border-r-0 h-full" />
                ))}
              </div>

              {/* Bus rows with timeline blocks */}
              {busIds.map((busItem, rowIndex) => (
                <div
                  key={busItem.id}
                  className={`flex h-14 relative hover:bg-gray-700/30 transition-colors ${
                    rowIndex < busIds.length - 1 ? "border-b border-gray-700/50" : ""
                  }`}
                >
                  {/* Bus ID with Type - z-index değerini artırıp, left:0 pozisyonunu kesin olarak belirtelim */}
                  <div className="w-20 min-w-20 flex items-center justify-center p-2 font-medium text-sm border-r border-gray-700 sticky left-0 z-40 bg-gray-800 shadow-md">
                    <div className="px-2 py-1.5 rounded-full bg-gray-700/70 flex items-center border border-gray-600">
                      <span>{busItem.id.split("-")[1]}</span>
                      <span className="ml-1.5 text-xs px-1.5 py-0.5 rounded-full bg-gray-600/70 border border-gray-500">{busItem.typeLabel}</span>
                    </div>
                  </div>

                  {/* Timeline area */}
                  <div className="flex-1 relative">
                    {/* Render timeline blocks for this bus */}
                    {processedData[busItem.id]?.map((trip, index) => {
                      const { startPosition, width } = calculateBlockPosition(trip.startTime, trip.duration)

                      // Ensure minimum width for visibility but keep proportional to duration
                      const displayWidth = Math.max(width, 3)

                      return (
                        <TimelineBlock
                          key={`${busItem.id}-${index}`}
                          routeNo={trip.routeNo}
                          startTime={trip.startTime}
                          endTime={trip.endTime}
                          direction={trip.direction}
                          duration={trip.duration}
                          color={routeColors[trip.routeNo] || "#374151"}
                          routeName={trip.routeName}
                          routeLength={trip.routeLength}
                          style={{
                            left: `${startPosition}%`,
                            width: `${displayWidth}%`,
                            top: "8px",
                          }}
                          busId={trip.busId}
                        />
                      )
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Route legend */}
        <RouteLegend routeColors={routeColors} routes={routes} />
      </div>
    </Tooltip.Provider>
  )
}

export default BusScheduleTimeline
