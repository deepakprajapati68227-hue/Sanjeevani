"use client";

import React from "react";
import dynamic from "next/dynamic";

const DynamicLeafletMap = dynamic(() => import("./LeafletMap"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full min-h-[500px] bg-[#F4F7F8] flex flex-col items-center justify-center text-[#526575] gap-3">
      <div className="w-10 h-10 border-2 border-[#147D78] border-t-transparent rounded-full animate-spin"></div>
      <p className="font-mono text-xs text-[#526575]">
        Initializing Spatial Cartography &amp; Risk Tiles...
      </p>
    </div>
  ),
});

export default function MapWrapper() {
  return <DynamicLeafletMap />;
}
