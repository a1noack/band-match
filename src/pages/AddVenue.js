import React, { useState } from "react";
// import { createUserWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from 'react-router-dom';
import { doc, setDoc } from "firebase/firestore";
import { uploadToFirebase } from '../utils/firebaseUtils';

import { auth, db } from "../utils/firebaseConfig"


function AddVenue() {
    // const [email, setEmail] = useState("");
    // const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [location, setLocation] = useState("");
    const [error, setError] = useState(null);
    const [imageURL, setImageURL] = useState(null);
  
    const navigate = useNavigate();

    const handleFileChange = async (e) => {
        console.log("File changed");
        const selectedFile = e.target.files[0];
        console.log("Selected file:", selectedFile);
    
        try {
          const imageURL = await uploadToFirebase(selectedFile); // Pass the file directly
          setImageURL(imageURL);
          console.log("Image URL:", imageURL);
        //   if (imageURL) {
        //     const userRef = doc(db, "users", user.uid);
        //     console.log("userRef:", userRef);
        //     await updateDoc(userRef, {
        //       profileImage: imageURL
        //     });
        //   }
        } catch (error) {
          console.error('Error updating user profile image', error);
        }
    };

    const handleSubmit = async (event) => {
      event.preventDefault()
      try {
        // Add the user's info to the database
        await setDoc(doc(db, "venues", name), {
          name: name,
          description: description,
          location: location,
          images: [imageURL],
          visited: []
        });

        navigate("/feed");
      } catch (error) {
        setError(error);
        console.error("Error creating user", error.message)
        navigate("/");
      }
    };
  
    return (
      <div>
        <div className="content-container">
          <h2 className={"App-header"}>Add a venue</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Name of venue</label>
              <input
                  id="name"
                  type="text"
                  placeholder=""
                  value={name}
                  onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>Short description of venue</label>
              <input
                  id="description"
                  type="text"
                  placeholder=""
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
              />
            </div>
            <div className="form-group">
                <label>Images of venue</label>
                <input 
                    type="file" onChange={handleFileChange} style={{ marginTop: '1px' }}
                />
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

  export default AddVenue;