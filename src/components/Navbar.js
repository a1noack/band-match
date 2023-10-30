import { useState, useEffect } from 'react'
import { NavLink } from 'react-router-dom'
import { auth } from "../firebase"
import './Navbar.css'
import 'font-awesome/css/font-awesome.min.css';
import personImage from '../person.png';

const Navbar = () => {
  const [showNavbar, setShowNavbar] = useState(false)
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

  const handleShowNavbar = () => {
    setShowNavbar(!showNavbar)
  }

  const handleLogout = () => {
    auth.signOut()
      .then(() => {
        console.log("User logged out");
      })
      .catch(error => {
        console.error("Error logging out:", error);
      });
  };

  return (
    <nav className="navbar">
      <div className="container">
        <div className={`nav-elements  ${showNavbar && 'active'}`}>
          <ul>
            <li>
              <NavLink to="/feed">Feed</NavLink>
            </li>
            <li>
              <NavLink to="/">Create Account</NavLink>
            </li>
            <li>
              <NavLink to="/signin">Log In</NavLink>
            </li>
          </ul>
        </div>
        <div style={{ marginLeft: 'auto' }}>  {/* This pushes the subsequent content to the right */}
          {user ? (
            <>
              <button onClick={handleLogout}>Log Out</button>
              <img src={personImage} alt="My Image" className='profile'/>
            </>
          ) : null}
        </div>
      </div>
    </nav>
  )
}

export default Navbar