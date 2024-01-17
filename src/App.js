import "font-awesome/css/font-awesome.min.css";
import React from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import { useAuthState } from "./hooks/useAuthState";
import AddVenue from "./pages/AddVenue";
import Feed from "./pages/Feed";
import Profile from "./pages/Profile";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import VenuePage from "./pages/VenuePage";
import "./styles/App.scss";

function App() {
  const { user } = useAuthState();
  return (
    <Router>
      {user && <Navbar />}
      <Routes>
        <Route path={"/"} element={<SignUp />} />
        <Route path={"/signin"} element={<SignIn />} />
        <Route path={"/feed"} element={<Feed />} />
        <Route path={"/addvenue"} element={<AddVenue />} />
        <Route path={"/profile"} element={<Profile />} />
        <Route path={"/venues/:venueName"} element={<VenuePage />} />
      </Routes>
    </Router>
  );
}

export { App };
