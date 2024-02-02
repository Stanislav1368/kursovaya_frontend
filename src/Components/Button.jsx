import React from "react";
import PropTypes from "prop-types";
import "./Button.css";

const Button = ({ onClick, icon, text, textSize, iconSize }) => {
  return (
    <button onClick={onClick} className="custom-button">
      <span style={{ fontSize: textSize, marginRight: "5px" }}>{icon}</span>
      <span style={{ fontSize: textSize }}>{text}</span>
    </button>
  );
};

Button.propTypes = {
  onClick: PropTypes.func,
  icon: PropTypes.element,  
  text: PropTypes.string,
};

export default Button;
