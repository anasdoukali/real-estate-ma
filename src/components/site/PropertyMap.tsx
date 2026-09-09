"use client";

import "leaflet/dist/leaflet.css";
import { useEffect, useRef } from "react";
import type { Map as LeafletMap, Marker } from "leaflet";
import { MARRAKECH_CENTER, compactPrice } from "@/lib/site";

export type MapPoint = {
  id: number;
  slug: string;
  title: string;
  price: string;
  currency: string;
  transactionType: string;
  propertyType: string;
  latitude: number | null;
  longitude: number | null;
  image: string | null;
  neighborhood: string | null;
  bedrooms: number | null;
  livingArea: number | null;
};

export default function PropertyMap({
  points,
  activeId,
  height = 680,
  zoom = 12,
  center,
  onSelect,
}: {
  points: MapPoint[];
  activeId?: number | null;
  height?: number;
  zoom?: number;
  center?: { lat: number; lng: number };
  onSelect?: (id: number) => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<LeafletMap | null>(null);
  const markersRef = useRef<Record<number, Marker>>({});

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const L = (await import("leaflet")).default;
      if (cancelled || !containerRef.current || mapRef.current) return;
      const map = L.map(containerRef.current, {
        center: [center?.lat ?? MARRAKECH_CENTER.lat, center?.lng ?? MARRAKECH_CENTER.lng],
        zoom,
        scrollWheelZoom: false,
        zoomControl: true,
        attributionControl: true,
      });
      L.tileLayer("https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png", {
        attribution: "© OpenStreetMap, © CARTO",
        maxZoom: 19,
      }).addTo(map);
      mapRef.current = map;
      renderMarkers(L, map);
    })();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    (async () => {
      const L = (await import("leaflet")).default;
      const map = mapRef.current;
      if (!map) return;
      Object.values(markersRef.current).forEach((m) => m.remove());
      markersRef.current = {};
      renderMarkers(L, map);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [points]);

  useEffect(() => {
    Object.entries(markersRef.current).forEach(([id, marker]) => {
      const el = marker.getElement();
      if (!el) return;
      const div = el.querySelector(".mk-marker");
      if (div) div.classList.toggle("active", Number(id) === activeId);
    });
    if (activeId && markersRef.current[activeId] && mapRef.current) {
      const m = markersRef.current[activeId];
      mapRef.current.panTo(m.getLatLng(), { animate: true });
    }
  }, [activeId]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function renderMarkers(L: any, map: LeafletMap) {
    const valid = points.filter((p) => p.latitude && p.longitude);
    valid.forEach((p) => {
      const icon = L.divIcon({
        className: "mk-marker-wrapper",
        html: `<div class="mk-marker">${compactPrice(p.price, p.currency)}${
          p.transactionType === "rent" ? "/m" : ""
        }</div>`,
        iconSize: [0, 0],
        iconAnchor: [30, 30],
      });
      const marker = L.marker([p.latitude as number, p.longitude as number], { icon }).addTo(map);
      marker.bindPopup(
        `<a href="/biens/${p.slug}" style="display:block;text-decoration:none;color:#161616">
          ${p.image ? `<img src="${p.image}" style="width:100%;height:140px;object-fit:cover" />` : ""}
          <div style="padding:12px 14px">
            <div style="font-size:14px;font-weight:600;line-height:1.3">${p.title}</div>
            <div style="font-size:12px;color:#77736d;margin-top:4px">${p.neighborhood ?? "Marrakech"}</div>
            <div style="font-size:15px;margin-top:8px;color:#a98b5b;font-weight:600">${compactPrice(
              p.price,
              p.currency,
            )}</div>
            <div style="font-size:11px;color:#77736d;margin-top:6px">${p.bedrooms ?? "-"} ch. · ${
              p.livingArea ?? "-"
            } m²</div>
          </div>
        </a>`,
      );
      marker.on("click", () => onSelect?.(p.id));
      markersRef.current[p.id] = marker;
    });
    if (valid.length > 1) {
      const bounds = L.latLngBounds(valid.map((p) => [p.latitude, p.longitude]));
      map.fitBounds(bounds, { padding: [60, 60], maxZoom: 14 });
    }
  }

  return <div ref={containerRef} style={{ height }} className="w-full" />;
}
