"use client";

import Image from "next/image";
import placeholderImage from "../../../public/pepe-placeholder.png";
import { AdvancedRealTimeChart } from "react-ts-tradingview-widgets";

export default function TokenChart() {
  return (
    <section>
      <div className="flex justify-between items-center mb-2">
        <div className="flex gap-x-2">
          <p>Token name...</p>
          <p>Ticker...</p>
          <p>Marketcap...</p>
          <p>CA: 2fQn8ScNrMdn5xar7LBA12a....</p>
        </div>

        <div className="flex gap-x-2">
          <p>Created by</p>
          <Image
            src={placeholderImage}
            alt="creator-logo"
            height={20}
            width={20}
          />
          <p>
            <a>CREATOR</a>
          </p>
        </div>
      </div>

      <AdvancedRealTimeChart
        theme="dark"
        width="100%"
        height="600px"
      ></AdvancedRealTimeChart>
    </section>
  );
}
