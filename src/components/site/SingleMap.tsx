"use client";

import dynamic from "next/dynamic";
import type { MapPoint } from "./PropertyMap";

const PropertyMap = dynamic(() => import("./PropertyMap"), {
  ssr: false,
  loading: () => <div className="h-[420px] w-full animate-pulse bg-stone" />,
});

export default function SingleMap({
  points,
  center,
  zoom = 14,
  height = 420,
}: {
  points: MapPoint[];
  center?: { lat: number; lng: number };
  zoom?: number;
  height?: number;
}) {
  return <PropertyMap points={points} center={center} zoom={zoom} height={height} />;
}
