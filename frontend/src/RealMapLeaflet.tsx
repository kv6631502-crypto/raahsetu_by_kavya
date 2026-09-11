import React, { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { CITIES, CITY_MAP, City, RouteLeg } from "./routeData";
import { LocateFixed } from "lucide-react";
import { SupportedLanguage, TRANSLATIONS, getCityName, getStateName } from "./translations";

interface RealMapLeafletProps {
  originCity?: City | null;
  destCity?: City | null;
  routePath: string[] | null;
  safeLegs: RouteLeg[];
  backendRouteGeometry?: [number, number][]; // [[lon, lat], ...] from backend Risk-A*
  fastestRouteGeometry?: [number, number][]; // [[lon, lat], ...] from backend Fastest
  routeSource?: "backend" | "local";
  userGps: {
    lat: number;
    lon: number;
    accuracy?: number;
    speedKmh: number;
    heading: number;
    placeName: string;
  } | null;
  isNavigating: boolean;
  isBigScreen: boolean;
  mapMode?: "osm" | "satellite";
  onMapModeChange?: (mode: "osm" | "satellite") => void;
  lang?: SupportedLanguage;
}

export const RealMapLeaflet: React.FC<RealMapLeafletProps> = ({
  originCity,
  destCity,
  routePath,
  safeLegs: _safeLegs,
  backendRouteGeometry,
  fastestRouteGeometry,
  routeSource = "local",
  userGps,
  isNavigating,
  mapMode: externalMapMode,
  onMapModeChange,
  lang = "en",
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const routeLayerGroupRef = useRef<L.LayerGroup | null>(null);
  const gpsMarkerRef = useRef<L.Marker | null>(null);
  const gpsAccuracyCircleRef = useRef<L.Circle | null>(null);
  const [internalMapMode, setInternalMapMode] = useState<"osm" | "satellite">("osm");
  const mapMode = externalMapMode !== undefined ? externalMapMode : internalMapMode;

  const handleToggleMode = (mode: "osm" | "satellite") => {
    setInternalMapMode(mode);
    if (onMapModeChange) onMapModeChange(mode);
  };
  const currentTileLayerRef = useRef<L.TileLayer | null>(null);

  // Initialize Leaflet Map with OpenStreetMap as the sole basemap
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    // Remove stale Leaflet container ID if remounting in fast transitions
    if ((mapContainerRef.current as any)._leaflet_id) {
      delete (mapContainerRef.current as any)._leaflet_id;
    }

    // Center on Northeast India (Guwahati / Brahmaputra basin)
    const map = L.map(mapContainerRef.current, {
      center: [26.1445, 92.5],
      zoom: 7,
      zoomControl: false,
      attributionControl: true,
    });

    L.control.zoom({ position: "topright" }).addTo(map);

    // Initialize default OpenStreetMap tile layer
    const initialTileLayer = L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 19,
    }).addTo(map);
    currentTileLayerRef.current = initialTileLayer;

    // Active route and pins layer group
    routeLayerGroupRef.current = L.layerGroup().addTo(map);
    mapInstanceRef.current = map;

    // Invalidate size after unroll transition to prevent grey/missing tiles
    const resizeTimer = setTimeout(() => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.invalidateSize();
      }
    }, 250);

    return () => {
      clearTimeout(resizeTimer);
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Switch between OpenStreetMap and High-Resolution Satellite View
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    if (currentTileLayerRef.current) {
      map.removeLayer(currentTileLayerRef.current);
    }

    if (mapMode === "satellite") {
      // High-Resolution Satellite View (Esri World Imagery - 100% Free, Zero Watermark, Global Satellite Coverage)
      currentTileLayerRef.current = L.tileLayer(
        "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
        {
          attribution:
            'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community',
          maxZoom: 19,
        }
      ).addTo(map);
    } else {
      // Official OpenStreetMap Standard
      currentTileLayerRef.current = L.tileLayer(
        "https://tile.openstreetmap.org/{z}/{x}/{y}.png",
        {
          attribution:
            '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
          maxZoom: 19,
        }
      ).addTo(map);
    }
    map.invalidateSize();
  }, [mapMode]);

  // Render Real Road Network & Active Route Polylines
  useEffect(() => {
    const map = mapInstanceRef.current;
    const group = routeLayerGroupRef.current;
    if (!map || !group) return;

    group.clearLayers();

    // 1. Plot all 111 real city/hub nodes on real geographic coordinates
    CITIES.forEach((c) => {
      const isOrigin = originCity ? c.id === originCity.id : false;
      const isDest = destCity ? c.id === destCity.id : false;
      const isOnRoute = routePath ? routePath.includes(c.id) : false;

      const markerColor = isOrigin
        ? "#10b981"
        : isDest
        ? "#ef4444"
        : isOnRoute
        ? "#38bdf8"
        : "#64748b";

      const circle = L.circleMarker([c.lat, c.lon], {
        radius: isOrigin || isDest ? 8 : isOnRoute ? 6 : 3.5,
        fillColor: markerColor,
        color: "#0f172a",
        weight: 2,
        opacity: 1,
        fillOpacity: isOrigin || isDest ? 1 : isOnRoute ? 0.9 : 0.45,
      });

      const cityName = getCityName(c.id, lang, c.name);
      const stateName = getStateName(c.state, lang);

      circle.bindTooltip(
        `<div style="font-family: monospace; font-size: 11px; font-weight: bold; color: #f8fafc;">
          ${cityName} (${stateName})<br/>
          <span style="font-size: 9px; color: #94a3b8;">${c.lat.toFixed(4)}°N, ${c.lon.toFixed(4)}°E</span>
        </div>`,
        { permanent: false, direction: "top", className: "rs-leaflet-tooltip" }
      );

      group.addLayer(circle);
    });

    // 2. Plot real route polyline connecting nodes with geodetic coordinates
    const hasBackendRisk = backendRouteGeometry && backendRouteGeometry.length >= 2;
    const hasBackendFastest = fastestRouteGeometry && fastestRouteGeometry.length >= 2;

    if (hasBackendRisk || (routePath && routePath.length >= 2)) {
      let riskLatLngs: [number, number][] = [];
      if (hasBackendRisk) {
        riskLatLngs = backendRouteGeometry!.map(([lon, lat]) => [lat, lon]);
      } else if (routePath && routePath.length >= 2) {
        routePath.forEach((id) => {
          const city = CITY_MAP[id];
          if (city) riskLatLngs.push([city.lat, city.lon]);
        });
      }

      // If backend fastest route is available, render it in amber for direct dual comparison
      if (hasBackendFastest) {
        const fastestLatLngs: [number, number][] = fastestRouteGeometry!.map(([lon, lat]) => [lat, lon]);
        if (fastestLatLngs.length >= 2) {
          const fastestLine = L.polyline(fastestLatLngs, {
            color: "#f59e0b",
            weight: 3.5,
            dashArray: "6, 8",
            opacity: 0.85,
            lineCap: "round",
            lineJoin: "round",
          });
          fastestLine.bindTooltip(
            `<div style="font-family: monospace; font-size: 11px; font-weight: bold; color: #f59e0b;">
              ⏱ Fastest Baseline Route (Higher Risk)
            </div>`,
            { sticky: true, className: "rs-leaflet-tooltip" }
          );
          group.addLayer(fastestLine);
        }
      }

      if (riskLatLngs.length >= 2) {
        // Outer glow
        const glowLine = L.polyline(riskLatLngs, {
          color: "#059669",
          weight: 8,
          opacity: 0.35,
          lineCap: "round",
          lineJoin: "round",
        });
        group.addLayer(glowLine);

        // Core Risk-A* Route Polyline
        const mainLine = L.polyline(riskLatLngs, {
          color: "#10b981",
          weight: 4.5,
          opacity: 0.95,
          lineCap: "round",
          lineJoin: "round",
        });
        mainLine.bindTooltip(
          `<div style="font-family: monospace; font-size: 11px; font-weight: bold; color: #10b981;">
            🛡 ${routeSource === "backend" ? "Risk-A* Engine: Admissible Safe Corridor" : "Safe Transit Route"}
          </div>`,
          { sticky: true, className: "rs-leaflet-tooltip" }
        );
        group.addLayer(mainLine);

        // Fit map bounds to route if not currently locked into live driver tracking
        if (!isNavigating) {
          map.fitBounds(mainLine.getBounds(), { padding: [40, 40] });
        }
      }
    }
  }, [originCity, destCity, routePath, backendRouteGeometry, fastestRouteGeometry, routeSource, isNavigating, lang]);

  // Update Real GPS Hardware Marker
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    if (!userGps) {
      if (gpsMarkerRef.current) {
        map.removeLayer(gpsMarkerRef.current);
        gpsMarkerRef.current = null;
      }
      if (gpsAccuracyCircleRef.current) {
        map.removeLayer(gpsAccuracyCircleRef.current);
        gpsAccuracyCircleRef.current = null;
      }
      return;
    }

    const { lat, lon, accuracy, speedKmh, placeName } = userGps;

    // Calibrated Heading & Navigation Pointer Chevron Icon
    const headingDeg = userGps.heading || 0;
    const vehicleIcon = L.divIcon({
      className: "rs-real-gps-icon",
      html: `
        <div style="position: relative; width: 44px; height: 44px; display: flex; align-items: center; justify-content: center;">
          <div style="position: absolute; width: 44px; height: 44px; border-radius: 50%; border: 2px solid #38bdf8; background: rgba(56, 189, 248, 0.25); animation: ping 2s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>
          <div style="position: relative; width: 28px; height: 28px; border-radius: 50%; background: #0284c7; border: 3px solid #ffffff; box-shadow: 0 0 14px rgba(56, 189, 248, 0.9); display: flex; align-items: center; justify-content: center; transform: rotate(${headingDeg}deg); transition: transform 0.35s ease;">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="#ffffff" stroke="#ffffff" stroke-width="1.5">
              <polygon points="12 2 19 21 12 17 5 21 12 2"></polygon>
            </svg>
          </div>
        </div>
      `,
      iconSize: [44, 44],
      iconAnchor: [22, 22],
    });

    const t = TRANSLATIONS[lang];
    if (!gpsMarkerRef.current) {
      const marker = L.marker([lat, lon], { icon: vehicleIcon, zIndexOffset: 1000 }).addTo(map);
      marker.bindPopup(
        `<div style="font-family: monospace; font-size: 11px; padding: 4px;">
          <strong style="color: #38bdf8;">📍 ${t.calibratedGpsTelemetry}</strong><br/>
          <span>${placeName}</span><br/>
          <span style="color: #94a3b8;">${lat.toFixed(5)}°N, ${lon.toFixed(5)}°E</span><br/>
          <span style="color: #10b981; font-weight: bold;">${t.speed}: ${speedKmh} km/h · ${t.headingLabel}: ${headingDeg}°</span>
        </div>`
      );
      gpsMarkerRef.current = marker;
    } else {
      gpsMarkerRef.current.setIcon(vehicleIcon);
      gpsMarkerRef.current.setLatLng([lat, lon]);
      gpsMarkerRef.current.setPopupContent(
        `<div style="font-family: monospace; font-size: 11px; padding: 4px;">
          <strong style="color: #38bdf8;">📍 ${t.calibratedGpsTelemetry}</strong><br/>
          <span>${placeName}</span><br/>
          <span style="color: #94a3b8;">${lat.toFixed(5)}°N, ${lon.toFixed(5)}°E</span><br/>
          <span style="color: #10b981; font-weight: bold;">${t.speed}: ${speedKmh} km/h · ${t.headingLabel}: ${headingDeg}°</span>
        </div>`
      );
    }

    // Accuracy Circle
    if (accuracy && accuracy > 0 && accuracy < 2000) {
      if (!gpsAccuracyCircleRef.current) {
        gpsAccuracyCircleRef.current = L.circle([lat, lon], {
          radius: accuracy,
          color: "#38bdf8",
          weight: 1,
          opacity: 0.5,
          fillColor: "#38bdf8",
          fillOpacity: 0.1,
        }).addTo(map);
      } else {
        gpsAccuracyCircleRef.current.setLatLng([lat, lon]);
        gpsAccuracyCircleRef.current.setRadius(accuracy);
      }
    }

    // When navigating, center view on real GPS position
    if (isNavigating) {
      // Smoothly pan with vehicle without resetting zoom
      map.panTo([lat, lon], { animate: true, duration: 0.4 });
    }
  }, [userGps, isNavigating, lang]);

  // Recenter button helper
  const handleRecenterOnGps = () => {
    const map = mapInstanceRef.current;
    if (!map) return;
    if (userGps) {
      map.setView([userGps.lat, userGps.lon], 14, { animate: true });
    } else if (originCity) {
      map.setView([originCity.lat, originCity.lon], 11, { animate: true });
    }
  };

  const t = TRANSLATIONS[lang || "en"];

  return (
    <div className="relative w-full h-full flex flex-col min-h-0 select-none">
      {/* Prominent Basemap Switcher on the Map Canvas (Positioned at bottom-4 left-4 to never be blocked by HUD) */}
      <div className="absolute bottom-4 left-4 z-[400] flex items-center p-1 rounded-2xl bg-slate-950/90 border-2 border-slate-700 shadow-2xl backdrop-blur-md text-xs font-mono">
        <button
          type="button"
          onClick={() => handleToggleMode("osm")}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl font-black transition-all cursor-pointer ${
            mapMode === "osm"
              ? "bg-signal text-signal-foreground shadow-md"
              : "text-muted-foreground hover:text-white"
          }`}
          title={t.roadNetwork}
        >
          <span>🗺️ {t.roadNetwork}</span>
        </button>

        <button
          type="button"
          onClick={() => handleToggleMode("satellite")}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl font-black transition-all cursor-pointer ${
            mapMode === "satellite"
              ? "bg-amber-500 text-slate-950 shadow-md"
              : "text-muted-foreground hover:text-white"
          }`}
          title={t.satelliteView}
        >
          <span>🛰️ {t.satelliteView}</span>
        </button>
      </div>

      {/* Recenter / Focus GPS Control */}
      <div className="absolute top-3 right-12 z-[400] flex items-center gap-2">
        <button
          type="button"
          onClick={handleRecenterOnGps}
          className="inline-flex items-center gap-1.5 bg-slate-950/85 hover:bg-slate-900 text-foreground border border-border px-2.5 py-1.5 rounded-xl shadow-xl text-xs font-bold cursor-pointer transition-colors backdrop-blur-md"
          title={t.snapOriginLiveGps || "Snap to GPS"}
        >
          <LocateFixed className="size-3.5 text-signal" />
          <span>{t.snapOriginLiveGps || "Snap to GPS"}</span>
        </button>
      </div>

      {/* Real Leaflet Map Container */}
      <div
        ref={mapContainerRef}
        className="w-full h-full flex-1 rounded-xl overflow-hidden cursor-grab active:cursor-grabbing"
      />
    </div>
  );
};
