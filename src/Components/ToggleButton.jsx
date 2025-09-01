import React, { useState } from "react";

export default function ToggleButton() {
  const [isOn, setIsOn] = useState(false); // state to track toggle

  const handleToggle = () => {
    setIsOn(!isOn); // flip state
  };

  return (
    <button
      onClick={handleToggle}
      style={{
        padding: "10px 20px",
        border: "none",
        borderRadius: "20px",
        cursor: "pointer",
        background: isOn ? "green" : "gray",
        color: "white",
      }}
    >
      {isOn ? "ON" : "OFF"}
    </button>
  );
}
