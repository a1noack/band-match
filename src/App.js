import React, { useState } from "react";
import { auth, db } from "./firebase"
import { createUserWithEmailAndPassword } from "firebase/auth";
import { BrowserRouter as Router, Route, Routes, useNavigate } from 'react-router-dom';
import { collection } from "firebase/firestore";

import './App.css';

function App() {
  return (
    <Router>
      <div>
      <Routes>
        <Route path={"/"} element={<Signup/>} />
        <Route path={"/feed"} element={<Feed/>} />
      </Routes>
      </div>
    </Router>
  );
}

function Feed() {
  // const usersCollectionRef = collection(db, 'users');
  // console.log(usersCollectionRef);
  const [users, setUsers] = useState([
    { id: 'doc1Id', name: 'Alice', info: 'Frontend Developer', email: 'alice@example.com' },
    { id: 'doc2Id', name: 'Bob', info: 'Backend Developer', email: 'bob@example.com' },
    // ... Additional users
  ]);
  const allUsers = users.concat(users, users, users, users, users, users, users, users, users, users);
  return (
      <div>
        <h1>Suggested</h1>
        {allUsers.map((user) => (
            <div key={user.id}>
                <h2>{user.name}</h2>
                <p>{user.info}</p>
            </div>
        ))}
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
      navigate("/feed");
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

export { Feed, App };
