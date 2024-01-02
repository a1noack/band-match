import React, { useState } from "react";
import { auth } from "../utils/firebaseConfig"
import { signInWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from 'react-router-dom';


function SignIn() {
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
      // TODO: forward errors to the user eg. "Invalid email/password combination"
      <div>
        <div className="content-container">
          <h2 className={"App-header"}>Log in</h2>
          <form onSubmit={handleSubmit}>
            <div>  
              <input
                  type="text"
                  placeholder="Email address"  // TODO: Switch to same format as signup
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <input
                  type="password"
                  placeholder="Password"
                  value={password}  // TODO: Make it so that this is hidden
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

  export default SignIn;