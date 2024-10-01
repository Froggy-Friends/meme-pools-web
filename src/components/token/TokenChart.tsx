"use client";

import { Token } from "@prisma/client";
import { Address } from "viem";
import { useEffect, useRef, useState } from "react";
import { createChart, ColorType, IChartApi, ISeriesApi, CandlestickData } from "lightweight-charts";

interface ChartData {
  time: string;
  open: number;
  high: number;
  low: number;
  close: number;
}

declare global {
  interface Window {
    TradingView: any;
  }
}

type TokenChartProps = {
  token: Token;
};

export default function TokenChart({ token }: TokenChartProps) {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const [data, setData] = useState<ChartData[]>([]);
  const chartRef = useRef<IChartApi | null>(null);
  const seriesRef = useRef<ISeriesApi<"Candlestick"> | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `http://localhost:3001/tradingview/history?symbol=${token.tokenAddress}&from=1625097600&to=1625443200&resolution=D`
        );
        const result = await response.json();
        if (result.s === "ok") {
          const chartData: ChartData[] = result.t.map((time: number, index: number) => ({
            time: new Date(time * 1000).toISOString().split("T")[0],
            open: result.o[index],
            high: result.h[index],
            low: result.l[index],
            close: result.c[index],
          }));
          setData(chartData);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [token.tokenAddress]);

  useEffect(() => {
    if (chartContainerRef.current && data.length > 0) {
      const handleResize = () => {
        chart.applyOptions({ width: chartContainerRef.current!.clientWidth });
      };

      const chart = createChart(chartContainerRef.current, {
        width: chartContainerRef.current.clientWidth,
        height: 420,
        layout: {
          background: { type: ColorType.Solid, color: "#1b1b1b" },
          textColor: "white",
        },
      });

      chartRef.current = chart;

      const candlestickSeries = chart.addCandlestickSeries({
        upColor: "#26a69a",
        downColor: "#ef5350",
        borderVisible: false,
        wickUpColor: "#26a69a",
        wickDownColor: "#ef5350",
      });

      seriesRef.current = candlestickSeries;

      candlestickSeries.setData(data);

      window.addEventListener("resize", handleResize);

      return () => {
        window.removeEventListener("resize", handleResize);
        chart.remove();
      };
    }
  }, [data]);

  return <div ref={chartContainerRef} style={{ width: "100%", height: "420px" }} />;
}
