"use client";

import { useState } from "react";
import TokenComments from "./TokenComments";
import TokenTrades from "./TokenTrades";

export default function CommentsAndTradesContainer() {
  const [toggleView, setToggleView] = useState("comments");

  return (
    <div className="flex flex-col">
      <div className="flex gap-x-2">
        <button
          onClick={() => setToggleView("comments")}
          className="bg-gray-950/90 rounded-lg p-2 text-white"
        >
          Comments
        </button>
        <button
          onClick={() => setToggleView("trades")}
          className="bg-gray-950/90 rounded-lg p-2 text-white"
        >
          Trades
        </button>
      </div>
      {toggleView === "comments" && <TokenComments />}
      {toggleView === "trades" && <TokenTrades />}
    </div>
  );
}
