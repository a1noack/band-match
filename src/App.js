import React, { useState } from "react";
import { auth, db } from "./firebase"
import { createUserWithEmailAndPassword } from "firebase/auth";
import { BrowserRouter as Router, Route, Routes, useNavigate } from 'react-router-dom';

import './App.css';

function App() {
  return (
    <Router>
      <div>
      <Routes>
        <Route path={"/"} element={<Signup/>} />
        <Route path={"/start"} element={<Start/>} />
      </Routes>
      </div>
    </Router>
  );
}

function Start() {
  return (
    <div>
      <h2>Account Successfully Created!!</h2>
    </div>
  );
}

function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [accountType, setAccountType] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault()
    try {
      const { user } = await createUserWithEmailAndPassword(auth, email, password)
      navigate("/start");
      // await db.collection("users").doc(user.uid).set({
      //   name,
      //   location,
      //   accountType
      // })
    } catch (error) {
      console.error("Error creating user", error.message)
      navigate("/");
    }
  };

  return (
    <div>
      <h2 className={"App-header"}>Create an Account</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <input
              id="name"
              type="text"
              placeholder="Name of band or venue"
              value={name}
              onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div>
          <input
              type="text"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div>
          <input
              type="text"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div>
          <input
              type="text"
              placeholder="Venue or band"
              value={accountType}
              onChange={(e) => setAccountType(e.target.value)}
          />
        </div>
        <div>
          <input
              type="text"
              placeholder="Location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
          />
        </div>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}

export { Signup, App };
