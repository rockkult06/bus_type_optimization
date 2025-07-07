"use client"

import { useState, useRef, type ChangeEvent } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Upload,
  Bus,
  BusFront,
  UserCog,
  Info,
  Leaf,
  Users,
  Fuel,
  Wrench,
  TrendingDown,
  ArrowRight,
  RouteIcon,
  AlertCircle,
} from "lucide-react"
import { useBusOptimization } from "@/context/bus-optimization-context"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Progress } from "@/components/ui/progress"

export default function ParametersTab() {
  const { routes, setRoutes, busParameters, setBusParameters, setActiveStep } = useBusOptimization()

  const fileInputRef = useRef<HTMLInputElement>(null)
  const [csvError, setCsvError] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [startButtonHover, setStartButtonHover] = useState(false)

  // CSV dosyası yükleme fonksiyonunu güncelle
  const handleFileUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setCsvError(null)
    setIsUploading(true)
    setUploadProgress(0)
    const reader = new FileReader()

    reader.onload = (event) => {
      try {
        const csvData = event.target?.result as string

        // Check for BOM (Byte Order Mark) and remove if present
        const cleanData = csvData.replace(/^\uFEFF/, "")

        // Split by newlines, handling both Windows and Unix line endings
        const lines = cleanData.split(/\r?\n/)

        // Check if we have data
        if (lines.length <= 1) {
          throw new Error("CSV dosyası boş veya geçersiz.")
        }

        // Parse the header to determine if we're using semicolons or commas
        const firstLine = lines[0]
        const separator = firstLine.includes(";") ? ";" : ","

        // Skip header row
        const parsedRoutes = lines
          .slice(1)
          .filter((line) => line.trim())
          .map((line) => {
            const values = line.split(separator).map((item) => item.trim())

            if (values.length < 8) {
              throw new Error("CSV formatı geçersiz. Tüm alanlar doldurulmalıdır.")
            }

            const [
              routeNo,
              routeName,
              routeLengthAtoB,
              routeLengthBtoA,
              travelTimeAtoB,
              travelTimeBtoA,
              peakPassengersAtoB,
              peakPassengersBtoA,
            ] = values

            if (
              !routeNo ||
              !routeName ||
              !routeLengthAtoB ||
              !routeLengthBtoA ||
              !travelTimeAtoB ||
              !travelTimeBtoA ||
              !peakPassengersAtoB ||
              !peakPassengersBtoA
            ) {
              throw new Error("CSV formatı geçersiz. Tüm alanlar doldurulmalıdır.")
            }

            return {
              routeNo,
              routeName,
              routeLengthAtoB: Number.parseFloat(routeLengthAtoB),
              routeLengthBtoA: Number.parseFloat(routeLengthBtoA),
              travelTimeAtoB: Number.parseInt(travelTimeAtoB),
              travelTimeBtoA: Number.parseInt(travelTimeBtoA),
              peakPassengersAtoB: Number.parseInt(peakPassengersAtoB),
              peakPassengersBtoA: Number.parseInt(peakPassengersBtoA),
            }
          })

        // Simulate a delay for the progress bar
        setTimeout(() => {
          setRoutes(parsedRoutes)
          setUploadProgress(100)
          setTimeout(() => {
            setIsUploading(false)
            setUploadProgress(0)
          }, 500)
        }, 1000)
      } catch (error) {
        setCsvError("CSV dosyası işlenirken bir hata oluştu. Lütfen formatı kontrol edin.")
        console.error(error)
        setIsUploading(false)
        setUploadProgress(0)
      }
    }

    // Use readAsText with UTF-8 encoding explicitly
    reader.readAsText(file, "UTF-8")
  }

  const handleParameterChange = (
    busType: "small" | "medium" | "large",
    field: "capacity" | "operatingCost" | "co2Emission",
    value: number,
  ) => {
    // Prevent NaN values
    if (isNaN(value)) {
      value = 0
    }

    setBusParameters({
      ...busParameters,
      [`${busType}Bus${field.charAt(0).toUpperCase() + field.slice(1)}`]: value,
    })
  }

  const handleOperationalHoursChange = (value: number) => {
    // Prevent NaN values
    if (isNaN(value)) {
      value = 0
    }

    setBusParameters({
      ...busParameters,
      operationalHours: value,
    })
  }

  const handleContinue = () => {
    if (routes.length === 0) {
      setCsvError("Lütfen önce CSV dosyası yükleyin.")
      return
    }

    // Move to the next step
    setActiveStep("busOptimization")
  }

  return (
    <TooltipProvider>
      <div className="space-y-5">
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Değiştirilebilir Parametreler</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Küçük Otobüs Card */}
            <div className="rounded-lg bg-gradient-to-br from-gray-400/40 via-teal-400/20 to-gray-400/40 p-[1px] shadow-lg">
              <div className="rounded-lg bg-white/95 dark:bg-black/95 backdrop-blur-md p-4 h-full">
                <div className="flex items-center gap-2 mb-3">
                  <div className="bg-teal-100 p-2 rounded-full">
                    <Bus className="h-5 w-5 text-teal-600" />
                  </div>
                  <h3 className="text-lg font-medium">Küçük Otobüs</h3>
                </div>

                <div className="space-y-3">
                  <div className="space-y-1.5">
                    <Label htmlFor="small-capacity" className="text-sm flex items-center gap-1">
                      <Users className="h-3.5 w-3.5 text-teal-600" />
                      Kapasite (Yolcu)
                    </Label>
                    <Input
                      id="small-capacity"
                      type="number"
                      value={isNaN(busParameters.smallBusCapacity) ? "" : busParameters.smallBusCapacity}
                      onChange={(e) => {
                        const value = e.target.value === "" ? 0 : Number.parseInt(e.target.value)
                        handleParameterChange("small", "capacity", value)
                      }}
                      className="bg-white/50 dark:bg-black/50 backdrop-blur-sm border-teal-200 h-9 text-base transition-all focus:ring-2 focus:ring-teal-500 focus:border-transparent hover:border-teal-400"
                      placeholder="25"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="small-operating" className="text-sm flex items-center gap-1">
                      <Fuel className="h-3.5 w-3.5 text-teal-600" />
                      İşletme Maliyeti (TL/km)
                    </Label>
                    <Input
                      id="small-operating"
                      type="number"
                      value={isNaN(busParameters.smallBusOperatingCost) ? "" : busParameters.smallBusOperatingCost}
                      onChange={(e) => {
                        const value = e.target.value === "" ? 0 : Number.parseFloat(e.target.value)
                        handleParameterChange("small", "operatingCost", value)
                      }}
                      className="bg-white/50 dark:bg-black/50 backdrop-blur-sm border-teal-200 h-9 text-base transition-all focus:ring-2 focus:ring-teal-500 focus:border-transparent hover:border-teal-400"
                      placeholder="0.8"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="small-carbon" className="text-sm flex items-center gap-1">
                      <Leaf className="h-3.5 w-3.5 text-green-600" />
                      CO2 Emisyonu (kg/km)
                    </Label>
                    <Input
                      id="small-carbon"
                      type="number"
                      step="0.01"
                      value={isNaN(busParameters.smallBusCO2Emission) ? "" : busParameters.smallBusCO2Emission}
                      onChange={(e) => {
                        const value = e.target.value === "" ? 0 : Number.parseFloat(e.target.value)
                        handleParameterChange("small", "co2Emission", value)
                      }}
                      className="bg-white/50 dark:bg-black/50 backdrop-blur-sm border-teal-200 h-9 text-base transition-all focus:ring-2 focus:ring-teal-500 focus:border-transparent hover:border-teal-400"
                      placeholder="0.7"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Orta Otobüs Card */}
            <div className="rounded-lg bg-gradient-to-br from-gray-400/40 via-blue-400/20 to-gray-400/40 p-[1px] shadow-lg">
              <div className="rounded-lg bg-white/95 dark:bg-black/95 backdrop-blur-md p-4 h-full">
                <div className="flex items-center gap-2 mb-3">
                  <div className="bg-blue-100 p-2 rounded-full">
                    <BusFront className="h-5 w-5 text-blue-600" />
                  </div>
                  <h3 className="text-lg font-medium">Orta Otobüs</h3>
                </div>

                <div className="space-y-3">
                  <div className="space-y-1.5">
                    <Label htmlFor="medium-capacity" className="text-sm flex items-center gap-1">
                      <Users className="h-3.5 w-3.5 text-blue-600" />
                      Kapasite (Yolcu)
                    </Label>
                    <Input
                      id="medium-capacity"
                      type="number"
                      value={isNaN(busParameters.mediumBusCapacity) ? "" : busParameters.mediumBusCapacity}
                      onChange={(e) => {
                        const value = e.target.value === "" ? 0 : Number.parseInt(e.target.value)
                        handleParameterChange("medium", "capacity", value)
                      }}
                      className="bg-white/50 dark:bg-black/50 backdrop-blur-sm border-blue-200 h-9 text-base transition-all focus:ring-2 focus:ring-blue-500 focus:border-transparent hover:border-blue-400"
                      placeholder="90"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="medium-operating" className="text-sm flex items-center gap-1">
                      <Fuel className="h-3.5 w-3.5 text-blue-600" />
                      İşletme Maliyeti (TL/km)
                    </Label>
                    <Input
                      id="medium-operating"
                      type="number"
                      value={isNaN(busParameters.mediumBusOperatingCost) ? "" : busParameters.mediumBusOperatingCost}
                      onChange={(e) => {
                        const value = e.target.value === "" ? 0 : Number.parseFloat(e.target.value)
                        handleParameterChange("medium", "operatingCost", value)
                      }}
                      className="bg-white/50 dark:bg-black/50 backdrop-blur-sm border-blue-200 h-9 text-base transition-all focus:ring-2 focus:ring-blue-500 focus:border-transparent hover:border-blue-400"
                      placeholder="1.0"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="medium-carbon" className="text-sm flex items-center gap-1">
                      <Leaf className="h-3.5 w-3.5 text-green-600" />
                      CO2 Emisyonu (kg/km)
                    </Label>
                    <Input
                      id="medium-carbon"
                      type="number"
                      step="0.01"
                      value={isNaN(busParameters.mediumBusCO2Emission) ? "" : busParameters.mediumBusCO2Emission}
                      onChange={(e) => {
                        const value = e.target.value === "" ? 0 : Number.parseFloat(e.target.value)
                        handleParameterChange("medium", "co2Emission", value)
                      }}
                      className="bg-white/50 dark:bg-black/50 backdrop-blur-sm border-blue-200 h-9 text-base transition-all focus:ring-2 focus:ring-blue-500 focus:border-transparent hover:border-blue-400"
                      placeholder="1.0"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Büyük Otobüs Card */}
            <div className="rounded-lg bg-gradient-to-br from-gray-400/40 via-purple-400/20 to-gray-400/40 p-[1px] shadow-lg">
              <div className="rounded-lg bg-white/95 dark:bg-black/95 backdrop-blur-md p-4 h-full">
                <div className="flex items-center gap-2 mb-3">
                  <div className="bg-purple-100 p-2 rounded-full">
                    <div className="flex items-center">
                      <Bus className="h-5 w-5 text-purple-600" />
                      <div className="ml-[-2px] w-1.5 h-4 bg-purple-600 rounded-sm"></div>
                      <Bus className="h-4 w-4 text-purple-600 ml-[-2px]" />
                    </div>
                  </div>
                  <h3 className="text-lg font-medium">Büyük Otobüs</h3>
                </div>

                <div className="space-y-3">
                  <div className="space-y-1.5">
                    <Label htmlFor="large-capacity" className="text-sm flex items-center gap-1">
                      <Users className="h-3.5 w-3.5 text-purple-600" />
                      Kapasite (Yolcu)
                    </Label>
                    <Input
                      id="large-capacity"
                      type="number"
                      value={isNaN(busParameters.largeBusCapacity) ? "" : busParameters.largeBusCapacity}
                      onChange={(e) => {
                        const value = e.target.value === "" ? 0 : Number.parseInt(e.target.value)
                        handleParameterChange("large", "capacity", value)
                      }}
                      className="bg-white/50 dark:bg-black/50 backdrop-blur-sm border-purple-200 h-9 text-base transition-all focus:ring-2 focus:ring-purple-500 focus:border-transparent hover:border-purple-400"
                      placeholder="150"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="large-operating" className="text-sm flex items-center gap-1">
                      <Fuel className="h-3.5 w-3.5 text-purple-600" />
                      İşletme Maliyeti (TL/km)
                    </Label>
                    <Input
                      id="large-operating"
                      type="number"
                      value={isNaN(busParameters.largeBusOperatingCost) ? "" : busParameters.largeBusOperatingCost}
                      onChange={(e) => {
                        const value = e.target.value === "" ? 0 : Number.parseFloat(e.target.value)
                        handleParameterChange("large", "operatingCost", value)
                      }}
                      className="bg-white/50 dark:bg-black/50 backdrop-blur-sm border-purple-200 h-9 text-base transition-all focus:ring-2 focus:ring-purple-500 focus:border-transparent hover:border-purple-400"
                      placeholder="1.3"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="large-carbon" className="text-sm flex items-center gap-1">
                      <Leaf className="h-3.5 w-3.5 text-green-600" />
                      CO2 Emisyonu (kg/km)
                    </Label>
                    <Input
                      id="large-carbon"
                      type="number"
                      step="0.01"
                      value={isNaN(busParameters.largeBusCO2Emission) ? "" : busParameters.largeBusCO2Emission}
                      onChange={(e) => {
                        const value = e.target.value === "" ? 0 : Number.parseFloat(e.target.value)
                        handleParameterChange("large", "co2Emission", value)
                      }}
                      className="bg-white/50 dark:bg-black/50 backdrop-blur-sm border-purple-200 h-9 text-base transition-all focus:ring-2 focus:ring-purple-500 focus:border-transparent hover:border-purple-400"
                      placeholder="1.4"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* İşletme Saatleri Card */}
          <div className="mt-4 flex justify-center">
            <div className="rounded-lg bg-gradient-to-br from-gray-400/40 via-amber-400/20 to-gray-400/40 p-[1px] shadow-lg max-w-md w-full">
              <div className="rounded-lg bg-white/95 dark:bg-black/95 backdrop-blur-md p-4">
                <div className="flex items-center gap-2 mb-3">
                  <div className="bg-amber-100 p-2 rounded-full">
                    <UserCog className="h-5 w-5 text-amber-600" />
                  </div>
                  <h3 className="text-lg font-medium">İşletme Saatleri</h3>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="operational-hours" className="text-sm flex items-center gap-1">
                    <UserCog className="h-3.5 w-3.5 text-amber-600" />
                    Günlük İşletme Saati
                  </Label>
                  <Input
                    id="operational-hours"
                    type="number"
                    value={isNaN(busParameters.operationalHours) ? "" : busParameters.operationalHours}
                    onChange={(e) => {
                      const value = e.target.value === "" ? 0 : Number.parseFloat(e.target.value)
                      handleOperationalHoursChange(value)
                    }}
                    className="bg-white/50 dark:bg-black/50 backdrop-blur-sm border-amber-200 h-9 text-base transition-all focus:ring-2 focus:ring-amber-500 focus:border-transparent hover:border-amber-400"
                    placeholder="18"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4 mt-5">
          <h2 className="text-xl font-semibold">Hat Verileri Yükleme</h2>

          <div className="flex flex-col gap-4">
            <div className="rounded-lg bg-gradient-to-br from-gray-400/20 via-blue-400/10 to-gray-400/20 p-[1px] shadow-md">
              <div className="rounded-lg bg-white/90 dark:bg-black/90 backdrop-blur-md p-4">
                <div className="flex flex-wrap items-center gap-4">
                  <div className="relative">
                    <input
                      type="file"
                      accept=".csv"
                      ref={fileInputRef}
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                    <Button
                      onClick={() => fileInputRef.current?.click()}
                      className="flex items-center gap-2 h-10 px-4 text-sm transition-all duration-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-md"
                      variant="outline"
                      disabled={isUploading}
                    >
                      <Upload size={16} />
                      CSV Dosyası Yükle
                    </Button>
                    {isUploading && (
                      <div className="absolute -bottom-2 left-0 w-full px-1">
                        <Progress value={uploadProgress} className="h-1.5 w-full" />
                      </div>
                    )}
                  </div>

                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="icon" className="rounded-full h-8 w-8">
                        <Info className="h-4 w-4 text-muted-foreground" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent className="max-w-sm p-3">
                      <p className="text-sm">CSV dosyası şu sütunları içermelidir:</p>
                      <ul className="list-disc pl-5 mt-1 space-y-0.5 text-sm">
                        <li>Hat No</li>
                        <li>Hat Adı</li>
                        <li>A→B Hat Uzunluğu (km)</li>
                        <li>B→A Hat Uzunluğu (km)</li>
                        <li>A→B Parkur Süresi (dk)</li>
                        <li>B→A Parkur Süresi (dk)</li>
                        <li>A→B Yolcu Sayısı</li>
                        <li>B→A Yolcu Sayısı</li>
                      </ul>
                      <p className="mt-1 text-sm">Dosya UTF-8 formatında olmalıdır.</p>
                    </TooltipContent>
                  </Tooltip>

                  <Button
                    onClick={handleContinue}
                    disabled={routes.length === 0}
                    className={`px-5 h-10 text-sm transition-all duration-300 shadow-md rounded-md ${
                      startButtonHover
                        ? "bg-gradient-to-r from-teal-600 via-blue-600 to-purple-600 scale-105 shadow-lg"
                        : "bg-gradient-to-r from-teal-500 via-blue-500 to-purple-500"
                    }`}
                    onMouseEnter={() => setStartButtonHover(true)}
                    onMouseLeave={() => setStartButtonHover(false)}
                  >
                    <ArrowRight className="mr-2 h-4 w-4" />
                    Devam Et
                  </Button>

                  <div className="w-full mt-1">
                    <p className="text-xs text-muted-foreground">
                      Hat No, Hat Adı, A→B/B→A Hat Uzunluğu (km), A→B/B→A Parkur Süresi (dk), A→B/B→A Yolcu Sayısı
                      bilgilerini içeren CSV dosyası yükleyin.
                    </p>
                    {isUploading && (
                      <p className="text-xs text-blue-600 dark:text-blue-400 mt-0.5 animate-pulse">
                        Dosya yükleniyor...
                      </p>
                    )}
                    {csvError && <p className="text-xs text-destructive mt-0.5">{csvError}</p>}
                  </div>
                </div>
              </div>
            </div>

            {routes.length > 0 && (
              <Card className="shadow-md overflow-hidden rounded-lg border border-gray-200 dark:border-gray-800">
                <CardHeader className="py-2 px-4 bg-gray-50 dark:bg-gray-900">
                  <CardTitle className="text-base">Yüklenen Hat Verileri</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="max-h-[200px] overflow-auto">
                    <Table>
                      <TableHeader className="sticky top-0 bg-background z-10">
                        <TableRow className="border-b border-gray-200 dark:border-gray-800">
                          <TableHead className="font-medium text-sm py-2">Hat No</TableHead>
                          <TableHead className="font-medium text-sm py-2">Hat Adı</TableHead>
                          <TableHead className="font-medium text-sm py-2">A→B Uzunluk (km)</TableHead>
                          <TableHead className="font-medium text-sm py-2">B→A Uzunluk (km)</TableHead>
                          <TableHead className="font-medium text-sm py-2">A→B Süre (dk)</TableHead>
                          <TableHead className="font-medium text-sm py-2">B→A Süre (dk)</TableHead>
                          <TableHead className="font-medium text-sm py-2">A→B Yolcu</TableHead>
                          <TableHead className="font-medium text-sm py-2">B→A Yolcu</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {routes.map((route, index) => (
                          <TableRow
                            key={index}
                            className="hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors border-b border-gray-100 dark:border-gray-800"
                          >
                            <TableCell className="font-medium py-1.5">{route.routeNo}</TableCell>
                            <TableCell className="py-1.5">{route.routeName}</TableCell>
                            <TableCell className="py-1.5">{route.routeLengthAtoB}</TableCell>
                            <TableCell className="py-1.5">{route.routeLengthBtoA}</TableCell>
                            <TableCell className="py-1.5">{route.travelTimeAtoB}</TableCell>
                            <TableCell className="py-1.5">{route.travelTimeBtoA}</TableCell>
                            <TableCell className="py-1.5">{route.peakPassengersAtoB}</TableCell>
                            <TableCell className="py-1.5">{route.peakPassengersBtoA}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        <div className="flex justify-center mt-5">
          <Button
            onClick={handleContinue}
            disabled={routes.length === 0}
            className={`px-6 py-2 text-base transition-all duration-300 shadow-md hover:shadow-lg rounded-md ${
              startButtonHover
                ? "bg-gradient-to-r from-teal-600 via-blue-600 to-purple-600 scale-105"
                : "bg-gradient-to-r from-teal-500 via-blue-500 to-purple-500"
            }`}
            onMouseEnter={() => setStartButtonHover(true)}
            onMouseLeave={() => setStartButtonHover(false)}
          >
            <ArrowRight className="mr-2 h-5 w-5" />
            Devam Et
          </Button>
        </div>
      </div>
    </TooltipProvider>
  )
}
