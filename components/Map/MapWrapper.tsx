"use client";

import React from "react";
import dynamic from "next/dynamic";

const DynamicLeafletMap = dynamic(() => import("./LeafletMap"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full min-h-[500px] bg-navy flex flex-col items-center justify-center text-gray-400 gap-3">
      <div className="w-10 h-10 border-2 border-pink border-t-transparent rounded-full animate-spin"></div>
      <p className="font-mono text-xs text-gray-300">
        Initializing Spatial Cartography & Risk Tiles...
      </p>
    </div>
  ),
});

export default function MapWrapper() {
  return <DynamicLeafletMap />;
}
