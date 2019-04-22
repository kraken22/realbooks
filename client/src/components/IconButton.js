import React from "react";
import "./IconButton.css";
import "./ripple.css";

const IconButton = ({ icon, color, ...props }) => (
  <button {...props} style={{ backgroundColor: color }} className="icon-button">
    <i className="material-icons">{icon}</i>
  </button>
);

export default IconButton;
