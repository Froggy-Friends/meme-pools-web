"use client";

import Image from "next/image";
import placeholderLogo from "../../public/pepe-placeholder.png";
import { motion } from "framer-motion";

export default function TokenDisplayCard() {
  return (
    <motion.div
      className="flex gap-x-3 w-[31%] pb-10"
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: -10, opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Image src={placeholderLogo} alt="token-image" height={100} width={100} />

      <div className="flex flex-col">
        <p>Created by...</p>
        <p>market cap...</p>
        <p>replies...</p>
        <p>Name (Ticker): description...</p>
      </div>
    </motion.div>
  );
}
