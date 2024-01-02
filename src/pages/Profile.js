import { doc, updateDoc } from "firebase/firestore";
import { auth, db } from "../utils/firebaseConfig"
import { useNavigate } from 'react-router-dom';

import { useAuthState } from '../hooks/useAuthState';
import { useUserData } from '../hooks/useUserData';
import { uploadToFirebase } from '../utils/firebaseUtils';

function Profile() {
    const { user, loading } = useAuthState();
    const userData = useUserData(user?.uid);
    const navigate = useNavigate();
  
    const handleFileChange = async (e) => {
      console.log("File changed");
      const selectedFile = e.target.files[0];
      console.log("Selected file:", selectedFile);
  
      try {
        const imageURL = await uploadToFirebase(selectedFile); // Pass the file directly
        console.log("Image URL:", imageURL);
        if (user && imageURL) {
          const userRef = doc(db, "users", user.uid);
          console.log("userRef:", userRef);
          await updateDoc(userRef, {
            profileImage: imageURL
          });
        }
      } catch (error) {
        console.error('Error updating user profile image', error);
      }
    };
  
    const handleLogout = () => {
      auth.signOut()
        .then(() => {
          console.log("User logged out");
          navigate("/signin");
        })
        .catch(error => {
          console.error("Error logging out:", error);
        });
    };
                  
    if (loading) {
      return <div className="content-container">Loading...</div>;
    } else if (!user) {
      return (
        <div>
          <div className="content-container">
            <h1>Not logged in</h1>
          </div>
        </div>
      );
    } else {
      return (
        <div>
          <div className="content-container">
            <h1>My Profile</h1>
            <button onClick={handleLogout}>Log Out</button>
            {userData?.profileImage && <img src={userData.profileImage} alt="Profile Image" className="profilelarge" />}
            <p>Edit profile image: <input type="file" onChange={handleFileChange} style={{ marginTop: '1px' }}/></p>
            <p>My Name: {userData?.name}</p>
            <p>My Email: {user.email}</p>
          </div>
        </div>
      );
    }
  }
  
  export default Profile;