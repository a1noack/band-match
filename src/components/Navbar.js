import { useState, useEffect } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { db, auth } from "../firebase";
import './Navbar.css';
import 'font-awesome/css/font-awesome.min.css';
import defaultProfileImage from '../defaultProfileImage.png';
import { getDoc, doc } from 'firebase/firestore';
import logo from '../bandmatch.png'; // Import the logo image


const Navbar = () => {
  const [showNavbar, setShowNavbar] = useState(false)
  const [user, setUser] = useState(null);
  const [profileImage, setProfileImage] = useState(null);


  // Listener that checks if a user is logged in
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async user => {
      if (user) {
        setUser(user);
        const userRef = doc(db, 'users', user.uid);
        try {
          const userDoc = await getDoc(userRef);
          if (userDoc.exists()) {
            const tmp = userDoc.data().profileImage;
            console.log('tmp = ', tmp);
            if (tmp === null) {
              setProfileImage(defaultProfileImage);
            }
            else {
              setProfileImage(tmp);
            }
            console.log('User profile photo found!');
            console.log('profileImage = ', profileImage)
          } else {
            console.log('User profile photo not found');
          }
        } catch (error) {
          console.error('Error fetching user document:', error);
        }
      } else {
        setUser(null);
      }
    });

    // Cleanup the subscription
    return () => unsubscribe();
  }, [db]);

  return (
    <nav className="navbar">
      <div className="container">
        <div className={`nav-elements  ${showNavbar && 'active'}`}>
            {user && (
              <>
                <NavLink className="link" to="/feed">
                <div className="navbar-centered">
                  <img src={logo} alt="BandMatch Logo" className='navbar-logo'/>
                  <h1>BandMatch</h1>
                </div>
                </NavLink>
              </>
            )}
            {!user && (
              <ul>
                <>
                  <li>
                    <NavLink to="/">Create Account</NavLink>
                  </li>
                  <li>
                    <NavLink to="/signin">Log In</NavLink>
                  </li>
                </>
              </ul>
            )}
        </div>
        <div style={{ marginLeft: 'auto' }}>  {/* This pushes the subsequent content to the right */}
          {user ? (
            <>
              {profileImage &&
                <Link to="/profile">
                  <img src={profileImage} alt="Default Profile" className='profile'/>
                </Link>             
              }
            </>
          ) : null}
        </div>
      </div>
    </nav>
  )
}

export default Navbar