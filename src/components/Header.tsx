import React from "react";
import { ButtonGroup, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function Header() {
  const navigate = useNavigate();

  return (
    <div style={{ display: "flex", justifyContent: "space-between", padding: "20px", alignItems: "center" }}>
      <h1>Speech Assessment Service</h1>
      <ButtonGroup variant="contained">
        <Button onClick={() => navigate("/")}>Upload Recordings</Button>
        <Button onClick={() => navigate("/reports")}>View Reports</Button>
      </ButtonGroup>
    </div>
  );
}
