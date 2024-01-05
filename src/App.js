import React from "react";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import './styles/App.css';
import Feed from './pages/Feed';
import Profile from './pages/Profile';
import VenuePage from './pages/VenuePage';
import BandPage from "./pages/BandPage";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import AddVenue from "./pages/AddVenue";


function App() {
  return (
    <Router>
      <Navbar/>
      <Routes>
        <Route path={"/"} element={<SignUp/>} />
        <Route path={"/signin"} element={<SignIn/>} />
        <Route path={"/feed"} element={<Feed/>} />
        <Route path={"/addvenue"} element={<AddVenue/>} />
        <Route path={"/profile"} element={<Profile/>} />
        <Route path={"/venues/:venueName"} element={<VenuePage />} />
        <Route path={"/bands/:otherId"} element={<BandPage />} />
      </Routes>
    </Router>
  );
}

export { App };
