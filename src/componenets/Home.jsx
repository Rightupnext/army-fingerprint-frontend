import React from "react";
import { Link } from "react-router-dom";

export default function Home() {
  const boxStyle = {
    flex: 1,
    minWidth: 250,
    padding: 20,
    margin: 10,
    borderRadius: 8,
    border: "2px solid #b44",
    boxShadow: "0 2px 6px rgba(180, 68, 68, 0.3)",
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 24,
    color: "#b44",
    cursor: "pointer",
    userSelect: "none",
    textDecoration: "none", // remove underline for link
  };

  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "center",
        maxWidth: 900,
        margin: "auto",
        padding: 20,
        gap: 20,
      }}
    >
      <Link to="/add-user" style={boxStyle}>
        Add User
      </Link>
      <Link to="/existing-user" style={boxStyle}>
        Existing User
      </Link>
    </div>
  );
}
