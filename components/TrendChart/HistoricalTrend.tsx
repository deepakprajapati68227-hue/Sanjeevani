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
    <div className="bg-navy-card/80 border border-gray-700/60 rounded-card p-3 text-xs">
      <div className="flex items-center justify-between mb-2">
        <span className="font-heading font-semibold text-gray-200 text-xs">
          7-Day Risk Score Trajectory
        </span>
        <span className="text-[10px] text-gray-400 font-mono">
          High Threshold: &gt;0.70
        </span>
      </div>

      <div className="h-[130px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 5, right: 10, left: -25, bottom: 0 }}>
            <defs>
              <linearGradient id="riskGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#EC1E63" stopOpacity={0.6} />
                <stop offset="95%" stopColor="#EC1E63" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <XAxis
              dataKey="day"
              stroke="#6B7280"
              fontSize={10}
              tickLine={false}
              axisLine={{ stroke: "#374151" }}
            />
            <YAxis
              domain={[0, 1]}
              stroke="#6B7280"
              fontSize={10}
              tickLine={false}
              axisLine={{ stroke: "#374151" }}
              ticks={[0.2, 0.4, 0.7, 1.0]}
            />
            <Tooltip
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  const val = payload[0].value as number;
                  const item = payload[0].payload as HistoricalDataPoint;
                  return (
                    <div className="bg-navy border border-pink/40 p-2 rounded shadow-lg text-[11px] text-white">
                      <div className="font-bold text-pink">{label}</div>
                      <div>
                        Risk Score: <span className="font-mono font-semibold">{val}</span>
                      </div>
                      <div className="text-gray-400 text-[10px]">
                        Max Temp: {item.maxTemp}°C • Rain: {item.precipitation}mm
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />
            <ReferenceLine y={0.7} stroke="#D32F2F" strokeDasharray="3 3" />
            <Area
              type="monotone"
              dataKey="score"
              stroke="#EC1E63"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#riskGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
