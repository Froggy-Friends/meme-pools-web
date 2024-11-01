"use client";

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
    container: "tv_chart_container",
    timeframe: { from: (token.createdAt.getTime() + 60000) / 1000, to: Date.now() / 1000 },
  };

  return (
    <div style={{ width: "100%", height: "100%", position: "relative" }}>
      <Head>
        <title>TradingView Charting Library and Next.js</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover" />
      </Head>
      <Script
        src="/static/datafeeds/udf/dist/bundle.js"
        strategy="lazyOnload"
        onReady={() => {
          setIsScriptReady(true);
        }}
      />
      {isScriptReady && <TVChartContainer {...defaultWidgetProps} />}
    </div>
  );
}
