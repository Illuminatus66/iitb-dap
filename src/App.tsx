import React from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomeScreen from "./pages/HomeScreen";
import ReportsScreen from "./pages/ReportsScreen";
import DetailsScreen from './pages/DetailsScreen';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomeScreen />} />
        <Route path="/reports" element={<ReportsScreen />} />
        <Route path="/details" element={<DetailsScreen />} />
      </Routes>
    </Router>
  );
}

export default App;
