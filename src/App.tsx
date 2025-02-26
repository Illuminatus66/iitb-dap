import React from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomeScreen from "./pages/HomeScreen";
import ReportsScreen from "./pages/ReportsScreen";
import DetailsScreen from './pages/DetailsScreen';
import { Provider } from 'react-redux';
import { store } from './reducers/store';

const App = () => {
  return (
    <Provider store={store}>
    <Router>
      <Routes>
        <Route path="/" element={<HomeScreen />} />
        <Route path="/reports" element={<ReportsScreen />} />
        <Route path="/details" element={<DetailsScreen />} />
      </Routes>
    </Router>
    </Provider>
  );
}

export default App;
