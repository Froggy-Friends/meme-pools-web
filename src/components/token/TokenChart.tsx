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
