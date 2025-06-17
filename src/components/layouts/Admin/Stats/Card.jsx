import React from "react";
import "../../../../assets/stats-styles/card.css";

function Card({ label, data }) {
  const formattedData = data.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

  return (
    <div className="container infoCard">
      <span className="myLabel">{label}</span> <br />
      <span className="myData">{formattedData}</span>
    </div>
  );
}

export default Card;
