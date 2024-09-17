import { colors } from "@nextui-org/react";
import type { Config } from "tailwindcss";
const { nextui } = require("@nextui-org/react");

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        dark: "#131313",
        "dark-gray": "#1B1B1B",
        "light-gray": "#888888",
        gray: "#484848",
        green: "#00DA6C",
        cream: "#EBEBEB",
        "midnight-green": "#1B281F",
        blue: "#B2C6F4",
        "light-green": "#B2F4D3",
        purple: "#9945FF",
      },
      fontFamily: {
        proximaSoft: ["ProximaSoft"],
        proximaSoftBold: ["ProximaSoftBold"],
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      keyframes: {
        fadeInSlideUp: {
          "0%": { transform: "translateY(20%)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        pulseStrong: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.3" },
        },
      },
      animation: {
        fadeInSlideUp: "fadeInSlideUp 0.7s",
        pulseStrong: "pulseStrong 1.5s infinite",
      },
    },
  },
  plugins: [
    nextui({
      theme: "dark",
    }),
  ],
};
export default config;
