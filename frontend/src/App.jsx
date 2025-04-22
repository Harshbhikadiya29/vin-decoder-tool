import React from 'react';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./pages/Home.jsx";
import Login from "./pages/Login.jsx";
import NavBar from './theme/NavBar.jsx';
import { Container } from '@mantine/core';
import './App.css';

function App() {
  return (
    <Router>
      <NavBar />
      <Container fluid h={'100vh'} p={0} mt={60} mx={20}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </Container>
    </Router>
  );
}

export default App;
