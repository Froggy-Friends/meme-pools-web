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
        tablet: "768px",
        laptop: "1024px",
        desktop: "1280px",
      },
      colors: {
        dark: "#161616",
        gray: "#484848",
        primary: "#63aff5",
        cream: "#EBEBEB",
        blue: "#B2C6F4",
        yellow: "#F4F4B2",
        rose: "#F4B9B2",
        red: "#e63946",
        solana: "#9945FF",
        based: "#0052FF",
        green: "#63f58b",
        gold: "#FFD700",
        bronze: "#CD7F32",
        "light-gray": "#888888",
        "light-primary": "#85c3f8",
        "dark-gray": "#1B1B1B",
        "dark-primary": "#2f5a8c",
        "light-green": "#c2f5d0",
      },
      fontFamily: {
        allumiBold: ["AllumiBold"],
        proximaNova: ["ProximaNova"],
        proximaNovaBold: ["ProximaNovaBold"],
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
        primaryPulse: {
          "0%, 100%": {
            backgroundColor: "#131313",
          },
          "50%": {
            backgroundColor: "#2f5a8c",
          },
        },
        pulseScale: {
          "0%, 100%": { transform: "scale(0.95)" },
          "50%": { transform: "scale(1.1)" },
        },
        enter: {
          "0%": { transform: "scale(0.9)", opacity: "0" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
        leave: {
          "0%": { transform: "scale(1)", opacity: "1" },
          "100%": { transform: "scale(0.9)", opacity: "0" },
        },
      },
      animation: {
        fadeInSlideUp: "fadeInSlideUp 0.7s",
        pulseStrong: "pulseStrong 1.5s infinite",
        primaryPulse: "primaryPulse 1s ease-in-out",
        pulseScale: "pulseScale 1s infinite",
        enter: "enter 300ms ease-out",
        leave: "leave 300ms ease-in forwards",
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
