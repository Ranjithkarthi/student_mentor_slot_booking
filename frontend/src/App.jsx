import React from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import Home from "./components/Home/Home.jsx";
import PaymentPage from "./components/PaymentPage/PaymentPage.jsx";
import './App.css'

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/payment" element={<PaymentPage />} />
      </Routes>
    </Router>
  );
};

export default App;
