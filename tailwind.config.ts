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
      screens: {
        mobile: "430px",
        laptop: "1024px",
        desktop: "1440px",
      },
      colors: {
        dark: "#131313",
        gray: "#484848",
        green: "#00DA6C",
        cream: "#EBEBEB",
        blue: "#B2C6F4",
        yellow: "#F4F4B2",
        rose: "#F4B9B2",
        red: "#DA0033",
        solana: "#9945FF",
        based: "#0052FF",
        "light-gray": "#888888",
        "light-green": "#B2F4D3",
        "dark-gray": "#1B1B1B",
        "dark-green": "#003018",
        "dark-red": "#600000",
        "midnight-green": "#1B281F",
        "midnight-red": "#3D0C0C",
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
        greenPulse: {
          "0%, 100%": {
            backgroundColor: "#131313",
          },
          "50%": {
            backgroundColor: "#003018",
          },
        },
      },
      animation: {
        fadeInSlideUp: "fadeInSlideUp 0.7s",
        pulseStrong: "pulseStrong 1.5s infinite",
        greenPulse: "greenPulse 1s ease-in-out",
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
