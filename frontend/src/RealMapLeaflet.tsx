import React, { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { CITIES, CITY_MAP, City, RouteLeg } from "./routeData";
import { LocateFixed, Layers } from "lucide-react";

interface RealMapLeafletProps {
  originCity: City;
  destCity: City;
  routePath: string[] | null;
  safeLegs: RouteLeg[];
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
}

export const RealMapLeaflet: React.FC<RealMapLeafletProps> = ({
  originCity,
  destCity,
  routePath,
  userGps,
  isNavigating,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const routeLayerGroupRef = useRef<L.LayerGroup | null>(null);
  const gpsMarkerRef = useRef<L.Marker | null>(null);
  const gpsAccuracyCircleRef = useRef<L.Circle | null>(null);

  const [tileTheme, setTileTheme] = useState<"dark" | "osm" | "satellite">("dark");
  const tileLayerRef = useRef<L.TileLayer | null>(null);

  // Initialize Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    // Center on Northeast India (Guwahati / Brahmaputra basin)
    const map = L.map(mapContainerRef.current, {
      center: [26.1445, 92.5],
      zoom: 7,
      zoomControl: false,
      attributionControl: true,
    });

    L.control.zoom({ position: "topright" }).addTo(map);

    // Initial tile layer (CartoDB Dark Matter for sleek cyber look)
    const darkTiles = L.tileLayer(
      "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
      {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
        subdomains: "abcd",
        maxZoom: 19,
      }
    ).addTo(map);

    tileLayerRef.current = darkTiles;
    mapInstanceRef.current = map;
    routeLayerGroupRef.current = L.layerGroup().addTo(map);

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Handle tile theme switching
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    if (tileLayerRef.current) {
      map.removeLayer(tileLayerRef.current);
    }

    let url = "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png";
    let attr = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>';

    if (tileTheme === "osm") {
      url = "https://tile.openstreetmap.org/{z}/{x}/{y}.png";
      attr = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';
    } else if (tileTheme === "satellite") {
      url = "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}";
      attr = "Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community";
    }

    tileLayerRef.current = L.tileLayer(url, {
      attribution: attr,
      maxZoom: 19,
    }).addTo(map);
  }, [tileTheme]);

  // Render Real Road Network & Active Route Polylines
  useEffect(() => {
    const map = mapInstanceRef.current;
    const group = routeLayerGroupRef.current;
    if (!map || !group) return;

    group.clearLayers();

    // 1. Plot all 111 real city/hub nodes on real geographic coordinates
    CITIES.forEach((c) => {
      const isOrigin = c.id === originCity.id;
      const isDest = c.id === destCity.id;
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

      circle.bindTooltip(
        `<div style="font-family: monospace; font-size: 11px; font-weight: bold; color: #f8fafc;">
          ${c.name} (${c.state})<br/>
          <span style="font-size: 9px; color: #94a3b8;">${c.lat.toFixed(4)}°N, ${c.lon.toFixed(4)}°E</span>
        </div>`,
        { permanent: false, direction: "top", className: "rs-leaflet-tooltip" }
      );

      group.addLayer(circle);
    });

    // 2. Plot real route polyline connecting nodes with geodetic coordinates
    if (routePath && routePath.length >= 2) {
      const latLngs: [number, number][] = [];
      routePath.forEach((id) => {
        const city = CITY_MAP[id];
        if (city) latLngs.push([city.lat, city.lon]);
      });

      if (latLngs.length >= 2) {
        // Outer glow
        const glowLine = L.polyline(latLngs, {
          color: "#10b981",
          weight: 7,
          opacity: 0.35,
          lineCap: "round",
          lineJoin: "round",
        });
        group.addLayer(glowLine);

        // Core Route Polyline
        const mainLine = L.polyline(latLngs, {
          color: "#34d399",
          weight: 4,
          opacity: 0.95,
          lineCap: "round",
          lineJoin: "round",
        });
        group.addLayer(mainLine);

        // Fit map bounds to route if not currently locked into live driver tracking
        if (!isNavigating) {
          map.fitBounds(mainLine.getBounds(), { padding: [40, 40] });
        }
      }
    }
  }, [originCity, destCity, routePath, isNavigating]);

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

    // Custom pulse icon for Real GPS Vehicle
    const vehicleIcon = L.divIcon({
      className: "rs-real-gps-icon",
      html: `
        <div style="position: relative; width: 36px; height: 36px; display: flex; align-items: center; justify-content: center;">
          <div style="position: absolute; width: 36px; height: 36px; border-radius: 50%; border: 2px solid #38bdf8; background: rgba(56, 189, 248, 0.2); animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>
          <div style="position: relative; width: 18px; height: 18px; border-radius: 50%; background: #0284c7; border: 3px solid #ffffff; box-shadow: 0 0 10px #38bdf8; display: flex; align-items: center; justify-content: center;">
            <div style="width: 5px; height: 5px; border-radius: 50%; background: #ffffff;"></div>
          </div>
        </div>
      `,
      iconSize: [36, 36],
      iconAnchor: [18, 18],
    });

    if (!gpsMarkerRef.current) {
      const marker = L.marker([lat, lon], { icon: vehicleIcon }).addTo(map);
      marker.bindPopup(
        `<div style="font-family: monospace; font-size: 11px; padding: 4px;">
          <strong style="color: #38bdf8;">📍 REAL GPS VEHICLE FIX</strong><br/>
          <span>${placeName}</span><br/>
          <span style="color: #94a3b8;">${lat.toFixed(5)}°N, ${lon.toFixed(5)}°E</span><br/>
          <span style="color: #10b981; font-weight: bold;">Speed: ${speedKmh} km/h</span>
        </div>`
      );
      gpsMarkerRef.current = marker;
    } else {
      gpsMarkerRef.current.setLatLng([lat, lon]);
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
      map.setView([lat, lon], Math.max(12, map.getZoom()), { animate: true });
    }
  }, [userGps, isNavigating]);

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

  return (
    <div className="relative w-full h-full flex flex-col min-h-0 select-none">
      {/* Real Map Layer Controls */}
      <div className="absolute top-3 left-3 z-[400] flex items-center gap-1.5 bg-slate-950/85 backdrop-blur-md border border-border p-1.5 rounded-xl shadow-xl">
        <span className="text-[10px] uppercase font-mono text-muted-foreground px-1.5 font-bold flex items-center gap-1">
          <Layers className="size-3 text-signal" /> Layer:
        </span>
        <button
          type="button"
          onClick={() => setTileTheme("dark")}
          className={`px-2 py-1 rounded-lg text-xs font-mono font-bold transition-colors cursor-pointer ${
            tileTheme === "dark"
              ? "bg-signal text-signal-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          Dark Street
        </button>
        <button
          type="button"
          onClick={() => setTileTheme("osm")}
          className={`px-2 py-1 rounded-lg text-xs font-mono font-bold transition-colors cursor-pointer ${
            tileTheme === "osm"
              ? "bg-signal text-signal-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          OSM Standard
        </button>
        <button
          type="button"
          onClick={() => setTileTheme("satellite")}
          className={`px-2 py-1 rounded-lg text-xs font-mono font-bold transition-colors cursor-pointer ${
            tileTheme === "satellite"
              ? "bg-signal text-signal-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          Satellite
        </button>
      </div>

      {/* Recenter / Focus GPS Control */}
      <div className="absolute top-3 right-12 z-[400] flex items-center gap-2">
        <button
          type="button"
          onClick={handleRecenterOnGps}
          className="inline-flex items-center gap-1.5 bg-slate-950/85 hover:bg-slate-900 text-foreground border border-border px-2.5 py-1.5 rounded-xl shadow-xl text-xs font-bold cursor-pointer transition-colors backdrop-blur-md"
          title="Recenter Map on Real Location"
        >
          <LocateFixed className="size-3.5 text-signal" />
          <span>Snap to GPS</span>
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
