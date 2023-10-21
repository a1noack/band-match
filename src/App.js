import React, { useEffect, useState } from "react";
import { auth, db, admin } from "./firebase"
import { getAuth } from 'firebase/auth';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { BrowserRouter as Router, Route, Routes, useNavigate } from 'react-router-dom';
import { doc, setDoc, getDocs, collection } from "firebase/firestore";
import Navbar from './components/Navbar';

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

  const querySnapshot = getDocs(collection(db, "users"));
  const userList = document.getElementById("userList"); // Assuming you have a <ul> element with id "userList" in your HTML

  querySnapshot.forEach((doc) => {
    // const userData = doc.data();
  
    // // Create a new list item for each user
    // const listItem = document.createElement("li");
    // listItem.textContent = `Name: ${userData.name}, Email: ${userData.email}`;
    
    // // Append the list item to the user list
    // userList.appendChild(listItem);
  });

  // querySnapshot.forEach((doc) => {
  //   // doc.data() is never undefined for query doc snapshots
  //   console.log(doc.id, " => ", doc.data());
  // });

  // If a user is not logged in, don't show users
  if (!user) {
    return (
      <div>
        <div>
          <Navbar />
        </div>
        <div className="content-container">
          <h1>Not logged in</h1>
        </div>
      </div>);
  }

  // If a user is logged in, show users
  return (
      <div>
        <div>
          <Navbar />
        </div>
        <ul id="userList">
          {/* {querySnapshot.forEach((doc) => {
            // doc.data() is never undefined for query doc snapshots
            console.log(doc.id, " => ", doc.data());
            <li>{doc.id}</li>
          })} */}
        </ul>
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
      <div>
        <Navbar />
      </div>
      <div className="content-container">
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
    </div>
  );
}

function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  // const [accountType, setAccountType] = useState("");
  const [accountType, setAccountType] = useState('band'); // Default value

  const handleRadioChange = (e) => {
    setAccountType(e.target.value);
  };

  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault()
    try {
      // Create a new user
      const { user } = await createUserWithEmailAndPassword(auth, email, password)
      navigate("/feed");

      // Add the user's info to the database
      await setDoc(doc(db, "users", user.uid), {
        name: name,
        email: email,
        accountType: accountType,
        location: location
      });
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
      <div>
        <Navbar />
      </div>
      <div className="content-container">
        <h2 className={"App-header"}>Create an Account</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Name of band or venue</label>
            <input
                id="name"
                type="text"
                placeholder=""
                value={name}
                onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label>Email address</label>
            <input
                type="text"
                placeholder=""
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input
                type="text"
                placeholder=""
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <label>Account type</label>
          <div className="radio-group">
            <input 
                type="radio" 
                id="band" 
                name="band_or_venue" 
                value="band"
                checked={accountType === 'band'}
                onChange={handleRadioChange}
                 />
            <label for="band">Band</label>
            <input 
                type="radio" 
                id="venue" 
                name="band_or_venue" 
                value="venue"
                checked={accountType === 'venue'}
                onChange={handleRadioChange}
                 />
            <label for="venue">Venue</label>
          </div>
          <div className="form-group">
            <label>Location</label>
            <input
                type="text"
                placeholder=""
                value={location}
                onChange={(e) => setLocation(e.target.value)}
            />
          </div>
          <button type="submit">Submit</button>
          <div className="form-group">
            <p>Already have an account?</p> 
          </div>
          <button onClick={redirectToLogin}>Log in</button>
        </form>
      </div>
      </div>
      
  );
}

export { Feed, App };
