import { doc, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import logo from "../assets/bandmatch.png"; // Import the logo image
import defaultProfileImage from "../assets/defaultProfileImage.png";
import { useAuthState } from "../hooks/useAuthState";
import { useUserData } from "../hooks/useUserData";
import { auth, db } from "../utils/firebaseConfig";
import "./Navbar.css";

const Navbar = () => {
  const [showNavbar, setShowNavbar] = useState(false);
  const { user } = useAuthState(); // Get info for currently logged in user
  const userData = useUserData(user?.uid);
  const [profileImage, setProfileImage] = useState(null);

  // Listener that checks if a user is logged in
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        const userRef = doc(db, "users", user.uid);
        try {
          const userDoc = await getDoc(userRef);
          if (userDoc.exists()) {
            const tmp = userDoc.data().profileImage;
            console.log("tmp = ", tmp);
            if (tmp === null) {
              setProfileImage(defaultProfileImage);
            } else {
              setProfileImage(tmp);
            }
            console.log("User profile photo found!");
            console.log("profileImage = ", profileImage);
          } else {
            console.log("User profile photo not found");
          }
        } catch (error) {
          console.error("Error fetching user document:", error);
        }
      } else {
        setProfileImage(null); // Make sure that
      }
    });

    // Cleanup the subscription
    return () => unsubscribe();
  }, [db]);

  return (
    <nav className="navbar">
      <div className="container">
        <div className={`nav-elements  ${showNavbar && "active"}`}>
          {user && (
            <>
              <NavLink className="link" to="/feed">
                <div className="navbar-centered">
                  <img
                    src={logo}
                    alt="BandMatch Logo"
                    className="navbar-logo"
                  />
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
        <div>
          {/* This pushes the subsequent content to the right */}
          {user ? (
            <div className="profile">
              {profileImage && (
                <Link to="/profile">
                  <img src={profileImage} alt="Default Profile" />
                  <span>{userData?.name}</span>
                </Link>
              )}
            </div>
          ) : null}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
