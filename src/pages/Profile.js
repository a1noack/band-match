import { doc, updateDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../utils/firebaseConfig";

import defaultProfileImage from "../assets/defaultProfileImage.png";
import { useAuthState } from "../hooks/useAuthState";
import { useUserData } from "../hooks/useUserData";
import BMButton from "../shared/BMButton";
import { uploadToFirebase } from "../utils/firebaseUtils";
import BMContainer from "../shared/BMContainer";
import BMSpinner from "../shared/BMSpinner";

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
          profileImage: imageURL,
        });
      }
    } catch (error) {
      console.error("Error updating user profile image", error);
    }
  };

  const handleLogout = () => {
    auth
      .signOut()
      .then(() => {
        console.log("User logged out");
        navigate("/signin");
      })
      .catch((error) => {
        console.error("Error logging out:", error);
      });
  };

  if (loading) {
    return (
      <BMContainer>
        <BMSpinner />
      </BMContainer>
    );
  } else if (!user) {
    return (
      <div className="content-container">
        <h1>Not logged in</h1>
      </div>
    );
  } else {
    return (
      <>
        <div className="profile-bg" />
        <div className="profile-content">
          <div className="profile-content-box">
            <div
              className={`profile-img ${
                !userData?.profileImage ? "no-image" : ""
              }`}
            >
              <img
                src={
                  userData?.profileImage
                    ? userData?.profileImage
                    : defaultProfileImage
                }
                className="profilelarge"
                alt="Profile_image"
              />
              <div className="profile-icon">
                <label htmlFor="profileEdit">
                  <i class="fa fa-pencil"></i>
                </label>
                <input
                  type="file"
                  id="profileEdit"
                  onChange={handleFileChange}
                />
              </div>
            </div>
            <h3 className="mb-2">{userData?.name}</h3>
            <p>{user.email}</p>
            <BMButton variant="primary" onClick={handleLogout}>
              Log Out
            </BMButton>
          </div>
        </div>
      </>
    );
  }
}

export default Profile;
