import React, { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from 'react-router-dom';
import { doc, setDoc } from "firebase/firestore";

import { auth, db } from "../utils/firebaseConfig"


function SignUp() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const [location, setLocation] = useState("");
    const [accountType, setAccountType] = useState('band');
    const [error, setError] = useState(null);
  
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
          location: location,
          profileImage: null,
          visited: []
        });
      } catch (error) {
        setError(error);
        console.error("Error creating user", error.message)
        navigate("/");
      }
    };
  
    const redirectToLogin = () => {
      navigate("/signin");
    }
  
    return (
      <div>
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
                  type="password"
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
          {
            error &&
              <div style={{ backgroundColor: '#ffe6e6', border: '1px solid red', padding: '10px', borderRadius: '4px', marginTop: '10px' }}>
              <span style={{ color: 'red' }}>Invalid information. Please try again.</span>
            </div>
          }
        </div>
        </div>
        
    );
  }

  export default SignUp;