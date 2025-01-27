"use client";

import { useEffect, useState } from "react";

// Function to generate a vibrant hex color
function generateVibrantColor() {
  const vibrantValue = () => Math.floor(Math.random() * 128) + 128; // Ensure bright colors
  const r = vibrantValue();
  const g = vibrantValue();
  const b = vibrantValue();
  return `rgb(${r}, ${g}, ${b})`;
}

export default function ColorBar() {
  const [gradient, setGradient] = useState(""); // Initialize empty gradient

  useEffect(() => {
    // Function to update the gradient
    const updateGradient = () => {
      const color1 = generateVibrantColor();
      const color2 = generateVibrantColor();
      setGradient(`linear-gradient(90deg, ${color1}, ${color2})`);
    };

    // Update gradient on the client side after hydration
    updateGradient();

    // Change the gradient dynamically every second
    const interval = setInterval(updateGradient, 1000);

    return () => clearInterval(interval); // Cleanup interval on unmount
  }, []); // Only run on mount

  return (
    <div
      style={{
        height: "5px",
        width: "100%",
        background: gradient,
        transition: "background 0.8s ease-in-out",
      }}
    />
  );
}
