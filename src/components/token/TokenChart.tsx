"use client";

// import { useEffect, useRef, useState } from "react";
// import { createChart, ColorType, IChartApi, ISeriesApi, CandlestickData } from "lightweight-charts";
// import { Address } from "viem";
// import { frogFunApi } from "@/config/env";
// import { useQuery, useQueryClient } from "@tanstack/react-query";
// import { Channel } from "@/models/channel";
// import Pusher from "pusher-js";

// interface TokenChartProps {
//   tokenAddress: Address;
//   tokenId: string;
// }

// export default function TokenChart({ tokenAddress, tokenId }: TokenChartProps) {
//   const queryClient = useQueryClient();
//   const chartContainerRef = useRef<HTMLDivElement>(null);
//   const [data, setData] = useState<CandlestickData[]>([]);
//   const chartRef = useRef<IChartApi | null>(null);
//   const seriesRef = useRef<ISeriesApi<"Candlestick"> | null>(null);
//   const [visibleLogicalRange, setVisibleLogicalRange] = useState<{ from: number; to: number } | null>(null);

//   const fetchChartData = async () => {
//     const response = await fetch(`${frogFunApi}/trade/history?symbol=${tokenAddress}&resolution=5`);
//     const result = await response.json();
//     if (result.s !== "ok") throw new Error("Failed to fetch chart data");
//     return result.t.map((time: number, index: number) => ({
//       time: time,
//       open: result.o[index],
//       high: result.h[index],
//       low: result.l[index],
//       close: result.c[index],
//     }));
//   };

//   const { isLoading, error } = useQuery({
//     queryKey: ["chartData", tokenAddress],
//     queryFn: async () => {
//       const data = await fetchChartData();
//       setData(data);
//     },
//   });

//   useEffect(() => {
//     if (!process.env.NEXT_PUBLIC_PUSHER_CLUSTER || !process.env.NEXT_PUBLIC_PUSHER_KEY) {
//       throw new Error("Missing pusher env variables");
//     }

//     const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY, {
//       cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER,
//     });

//     const buyChannel = pusher.subscribe(Channel.Buy);
//     const sellChannel = pusher.subscribe(Channel.Sell);

//     const handleTrade = () => {
//       queryClient.invalidateQueries({ queryKey: ["chartData", tokenAddress] });
//     };

//     buyChannel.bind(tokenId, handleTrade);
//     sellChannel.bind(tokenId, handleTrade);

//     return () => {
//       buyChannel.unbind(tokenId, handleTrade);
//       sellChannel.unbind(tokenId, handleTrade);
//       pusher.unsubscribe(Channel.Buy);
//       pusher.unsubscribe(Channel.Sell);
//     };
//   }, [tokenId, queryClient, tokenAddress]);

//   useEffect(() => {
//     if (chartContainerRef.current && data.length > 0) {
//       const handleResize = () => {
//         chart.applyOptions({ width: chartContainerRef.current!.clientWidth });
//       };

//       const chart = createChart(chartContainerRef.current, {
//         width: chartContainerRef.current.clientWidth,
//         height: 410,
//         layout: {
//           background: { type: ColorType.Solid, color: "#1b1b1b" },
//           textColor: "white",
//         },
//         grid: {
//           vertLines: { color: "#2B2B43" },
//           horzLines: { color: "#2B2B43" },
//         },
//         timeScale: {
//           timeVisible: true,
//           secondsVisible: false,
//         },
//       });

//       chartRef.current = chart;

//       const candlestickSeries = chart.addCandlestickSeries({
//         upColor: "#26a69a",
//         downColor: "#ef5350",
//         borderVisible: false,
//         wickUpColor: "#26a69a",
//         wickDownColor: "#ef5350",
//         priceFormat: {
//           type: "price",
//           precision: 8,
//           minMove: 0.00000001,
//         },
//       });

//       seriesRef.current = candlestickSeries;

//       candlestickSeries.setData(data);

//       // Set initial visible range to zoom out (adjust from/to as needed)
//       chart.timeScale().setVisibleLogicalRange({ from: data.length - 100, to: data.length });

//       // Save the visible range when user interacts with the chart
//       chart.timeScale().subscribeVisibleLogicalRangeChange(range => {
//         if (range) {
//           setVisibleLogicalRange({ from: range.from, to: range.to });
//         }
//       });

//       window.addEventListener("resize", handleResize);

//       return () => {
//         window.removeEventListener("resize", handleResize);
//         chart.remove();
//       };
//     }
//   }, [data]);

//   // Effect to update data without changing focus
//   useEffect(() => {
//     if (seriesRef.current && chartRef.current && data.length > 0) {
//       seriesRef.current.setData(data);

//       // Restore the previous visible range if it exists
//       if (visibleLogicalRange) {
//         chartRef.current.timeScale().setVisibleLogicalRange(visibleLogicalRange);
//       }
//     }
//   }, [data, visibleLogicalRange]);

//   return <div ref={chartContainerRef} style={{ width: "100%", height: "390px" }} />;
// }

import Head from "next/head";
import dynamic from "next/dynamic";
import { useState } from "react";
import Script from "next/script";

import { ChartingLibraryWidgetOptions, ResolutionString } from "../../../public/static/charting_library";
import { Token } from "@prisma/client";

const TVChartContainer = dynamic(() => import("./TvChartContainer").then(mod => mod.TVChartContainer), {
  ssr: false,
});

type TokenChartProps = {
  token: Token;
};

export default function TokenChart({ token }: TokenChartProps) {
  const [isScriptReady, setIsScriptReady] = useState(false);

  const defaultWidgetProps: Partial<ChartingLibraryWidgetOptions> = {
    symbol: token.tokenAddress,
    interval: "5" as ResolutionString,
    library_path: "/static/charting_library/",
    locale: "en",
    charts_storage_api_version: "1.0",
    client_id: "0",
    user_id: "0",
    fullscreen: false,
    autosize: true,
    timeframe: { from: (token.createdAt.getTime() + 60000) / 1000, to: Date.now() / 1000 },
  };

  return (
    <>
      <Head>
        <title>TradingView Charting Library and Next.js</title>
      </Head>
      <Script
        src="/static/datafeeds/udf/dist/bundle.js"
        strategy="lazyOnload"
        onReady={() => {
          setIsScriptReady(true);
        }}
      />
      {isScriptReady && <TVChartContainer {...defaultWidgetProps} />}
    </>
  );
}
