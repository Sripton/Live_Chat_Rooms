import React from "react";
import { Box } from "@mui/material";
import Navbar from "./components/Navbar";
import { Outlet } from "react-router-dom";

export default function App() {
  return (
    <>
      <Navbar />
      <Box sx={{ pt: "64px" }}>
        <Outlet />
      </Box>
    </>
  );
}
