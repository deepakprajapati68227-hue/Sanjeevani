"use client";

import React from "react";
import { HistoricalDataPoint } from "@/lib/types";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ReferenceLine,
} from "recharts";

interface HistoricalTrendProps {
  data: HistoricalDataPoint[];
}

export default function HistoricalTrend({ data }: HistoricalTrendProps) {
  return (
    <div className="bg-white border border-[#E7EDF0] rounded-md p-3 text-xs shadow-sm">
      <div className="flex items-center justify-between mb-2">
        <span className="font-heading font-semibold text-[#17212B] text-xs">
          7-Day Risk Score Trajectory
        </span>
        <span className="text-[10px] text-[#C43D3D] font-mono font-medium">
          Critical Threshold: &ge;0.70
        </span>
      </div>

      <div className="h-[130px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 5, right: 10, left: -25, bottom: 0 }}>
            <XAxis
              dataKey="day"
              stroke="#7D8C98"
              fontSize={10}
              tickLine={false}
              axisLine={{ stroke: "#E7EDF0" }}
            />
            <YAxis
              domain={[0, 1]}
              stroke="#7D8C98"
              fontSize={10}
              tickLine={false}
              axisLine={{ stroke: "#E7EDF0" }}
              ticks={[0.2, 0.45, 0.7, 1.0]}
            />
            <Tooltip
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  const val = payload[0].value as number;
                  const item = payload[0].payload as HistoricalDataPoint;
                  return (
                    <div className="bg-white border border-[#E7EDF0] p-2 rounded shadow-md text-[11px] text-[#17212B]">
                      <div className="font-bold text-[#147D78]">{label}</div>
                      <div>
                        Risk Score: <span className="font-mono font-semibold">{val}</span>
                      </div>
                      <div className="text-[#7D8C98] text-[10px]">
                        Max Temp: {item.maxTemp}°C • Rain: {item.precipitation}mm
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />
            <ReferenceLine y={0.7} stroke="#C43D3D" strokeDasharray="3 3" />
            <ReferenceLine y={0.45} stroke="#B7791F" strokeDasharray="2 2" />
            <Area
              type="monotone"
              dataKey="score"
              stroke="#147D78"
              strokeWidth={2}
              fill="#EAF5F0"
              fillOpacity={0.6}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
