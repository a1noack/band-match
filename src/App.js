import React, { useEffect, useState } from "react";
import { auth, db } from "./firebase"
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { BrowserRouter as Router, Route, Routes, useNavigate } from 'react-router-dom';
import { collection } from "firebase/firestore";

import './App.css';

function App() {
  return (
    <Router>
      <div>
      <Routes>
        <Route path={"/"} element={<Signup/>} />
        <Route path={"/signin"} element={<Signin/>} />
        <Route path={"/feed"} element={<Feed/>} />
      </Routes>
      </div>
    </Router>
  );
}

function Feed() {
  const [user, setUser] = useState(null);

  // Listener that checks if a user is logged in
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      if (user) {
        setUser(user);
      } else {
        setUser(null);
      }
    });

    // Cleanup the subscription
    return () => unsubscribe();
  }, []);

  const [allUsers, setUsers] = useState([
    { id: 'doc1Id', name: 'Alice', info: 'Frontend Developer', email: 'alice@example.com' },
    { id: 'doc2Id', name: 'Bob', info: 'Backend Developer', email: 'bob@example.com' },
    // ... Additional users
  ]);

  // If a user is not logged in, don't show users
  if (!user) {
    return (
      <div>
        <h1>Not logged in</h1>
      </div>);
  }

  // If a user is logged in, show users
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

function Signin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault()
    try {
      const { user } = await signInWithEmailAndPassword(auth, email, password)
      navigate("/feed");
    } catch (err) {
      setError(err.message);
      console.error("Error logging in!", err.message)
    }
  };

  const redirectToSignup = () => {
    navigate("/");
  }
  
  return (
    <div>
      <h2 className={"App-header"}>Log in</h2>
      <form onSubmit={handleSubmit}>
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
        <button type="submit">Submit</button>
      </form>
      {error && 
        <div style={{ backgroundColor: '#ffe6e6', border: '1px solid red', padding: '10px', borderRadius: '4px', marginTop: '10px' }}>
          <span style={{ color: 'red' }}>Invalid email/password combination
          </span>
          <button onClick={redirectToSignup} style={{ marginLeft: '10px' }}>Create account</button>
        </div>
      }
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

  const redirectToLogin = () => {
    navigate("/signin");
  }

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
        <div>
          <p>Already have an account?</p> 
        </div>
        <button onClick={redirectToLogin}>Log in</button>
      </form>
      
    </div>
  );
}

export { Feed, App };
