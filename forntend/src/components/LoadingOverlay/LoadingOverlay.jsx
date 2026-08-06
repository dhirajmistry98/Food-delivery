import React from "react";
import "./LoadingOverlay.css";

const LoadingOverlay = ({ active, message }) => {
  if (!active) {
    return null;
  }

  return (
    <div className="loading-overlay">
      <div className="loading-overlay-card">
        <div className="loading-overlay-spinner"></div>
        <p>{message || "Loading..."}</p>
      </div>
    </div>
  );
};

export default LoadingOverlay;
