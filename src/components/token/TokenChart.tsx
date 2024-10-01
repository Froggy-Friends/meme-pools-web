"use client";

import { AdvancedRealTimeChart } from "react-ts-tradingview-widgets";

export default function TokenChart() {
  return (
    <section>
      <AdvancedRealTimeChart
        theme="dark"
        width="100%"
        height="600px"
        symbol="ETHUSD"
      ></AdvancedRealTimeChart>
    </section>
  );
}