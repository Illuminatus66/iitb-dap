import React from "react";
import { ButtonGroup, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function Header() {
  const navigate = useNavigate();

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        padding: "10px",
        alignItems: "center",
        borderBottom: "thick double",
        borderBottomWidth: 5,
        backgroundColor: "black",
      }}
    >
      <h1
        style={{
          border: "thick double",
          padding: 10,
          backgroundColor: "blanchedalmond",
        }}
      >
        Speech Assessment Service
      </h1>
      <ButtonGroup variant="contained">
        <Button
          onClick={() => navigate("/")}
          style={{ color: "black", backgroundColor: "blanchedalmond" }}
        >
          Upload Recordings
        </Button>
        <Button
          onClick={() => navigate("/reports")}
          style={{ color: "black", backgroundColor: "blanchedalmond" }}
        >
          View Reports
        </Button>
      </ButtonGroup>
    </div>
  );
}
