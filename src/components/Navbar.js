import { useState, useEffect } from 'react'
import { NavLink } from 'react-router-dom'
import { auth } from "../firebase"
import './Navbar.css'
import 'font-awesome/css/font-awesome.min.css';

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
          {user ? <img src="../logo.svg" alt="My Image" className='profile'/>  : null}  {/* Show user icon if user is logged in */}
        </div>
      </div>
    </nav>
  )
}

export default Navbar