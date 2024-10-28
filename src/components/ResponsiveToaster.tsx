"use client";

import { Toaster } from "react-hot-toast";
import { useEffect, useState } from "react";

const ResponsiveToaster = () => {
  const [position, setPosition] = useState<"top-right" | "top-center">("top-right");

  useEffect(() => {
    const handleResize = () => {
      setPosition(window.innerWidth < 768 ? "top-center" : "top-right");
    };

    handleResize(); // Set initial position
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <Toaster
      position={position}
      toastOptions={{
        success: {
          icon: null,
          style: {
            backgroundColor: "#63aff5",
            color: "#000",
          },
        },
        error: {
          style: {
            backgroundColor: "#e63946",
            color: "#000",
          },
          icon: null,
        },
      }}
    />
  );
};

export default ResponsiveToaster;
