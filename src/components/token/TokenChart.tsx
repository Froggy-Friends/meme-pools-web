"use client";

import { useEffect, useRef, useState } from "react";
import { createChart, ColorType, IChartApi, ISeriesApi, CandlestickData } from "lightweight-charts";
import { Address } from "viem";

interface TokenChartProps {
  tokenAddress: Address;
}

export default function TokenChart({ tokenAddress }: TokenChartProps) {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const [data, setData] = useState<CandlestickData[]>([]);
  const chartRef = useRef<IChartApi | null>(null);
  const seriesRef = useRef<ISeriesApi<"Candlestick"> | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`http://localhost:3001/tradingview/history?symbol=${tokenAddress}&resolution=5`);
        const result = await response.json();
        if (result.s === "ok") {
          const chartData: CandlestickData[] = result.t.map((time: number, index: number) => ({
            time: time,
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
  }, [tokenAddress]);

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
        grid: {
          vertLines: { color: "#2B2B43" },
          horzLines: { color: "#2B2B43" },
        },
        timeScale: {
          timeVisible: true,
          secondsVisible: false,
        },
      });

      chartRef.current = chart;

      const candlestickSeries = chart.addCandlestickSeries({
        upColor: "#26a69a",
        downColor: "#ef5350",
        borderVisible: false,
        wickUpColor: "#26a69a",
        wickDownColor: "#ef5350",
        priceFormat: {
          type: "price",
          precision: 8,
          minMove: 0.00000001,
        },
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
