import React, { useState } from "react";
// import { createUserWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { uploadToFirebase } from "../utils/firebaseUtils";

import { doc, setDoc } from "firebase/firestore";
import BMAddressInput from "../shared/BMAddressInput";
import BMAlert from "../shared/BMAlert";
import BMButton from "../shared/BMButton";
import BMCol from "../shared/BMCol";
import BMContainer from "../shared/BMContainer";
import BMInput from "../shared/BMInput";
import BMRow from "../shared/BMRow";
import { ACCEPTED_IMAGE_TYPES } from "../utils/constant";
import { db } from "../utils/firebaseConfig";
import { validateImageType } from "../utils/javascript";
import {
  DESCRIPTION_REQUIRED,
  IMAGE_REQUIRED,
  LOCATION_REQUIRED,
  NAME_REQUIRED,
} from "../utils/messages";

// import SearchBar from "./SearchBar";

function AddVenue() {
  // const [email, setEmail] = useState("");
  // const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [geometry, setGeometry] = useState(null);
  const [error, setError] = useState(null);
  const [imageURL, setImageURL] = useState(null);
  const [err, setErr] = useState({});
  const navigate = useNavigate();

  const handleFileChange = async (e) => {
    console.log("File changed");
    const selectedFile = e.target.files[0];

    if (!selectedFile) {
      setErr((err) => ({ ...err, image: IMAGE_REQUIRED }));
      setImageURL("");

      return;
    }

    const isValidFile = validateImageType(selectedFile);
    setErr((err) => ({ ...err, image: isValidFile ? "" : IMAGE_REQUIRED }));

    if (!isValidFile) return;

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
      console.error("Error updating user profile image", error);
    }
  };
  console.log(err);
  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      if (!name || !geometry || !description || !imageURL) {
        setErr((err) => ({
          ...err,
          name: name ? "" : NAME_REQUIRED,
          description: description ? "" : DESCRIPTION_REQUIRED,
          image: imageURL ? "" : IMAGE_REQUIRED,
          location: geometry ? "" : LOCATION_REQUIRED,
        }));
        return;
      }

      await setDoc(doc(db, "venues", name), {
        name: name,
        description: description,
        location: location,
        geometry: [geometry.lat(), geometry.lng()],
        images: [imageURL],
        visited: [],
      });

      navigate("/feed");
    } catch (error) {
      setError(error);
      console.error("Error creating user", error.message);
      navigate("/");
    }
  };

  return (
    <div className="py-sm-5 py-4">
      <BMContainer>
        <BMRow className="justify-content-center">
          <BMCol xl={5} lg={7} md={9}>
            <div className="card">
              <h2 className="mb-4 fw-bold">Add a venue</h2>
              {error && (
                <BMAlert variant="danger">
                  Invalid information. Please try again.
                </BMAlert>
              )}
              <form onSubmit={handleSubmit}>
                <BMInput
                  label="Name of venue"
                  id="name"
                  type="text"
                  placeholder=""
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    setErr((err) => ({
                      ...err,
                      name: e.target.value ? "" : NAME_REQUIRED,
                    }));
                  }}
                  errorMessage={err.name}
                />
                <BMInput
                  label="Images of venue"
                  type="file"
                  onChange={handleFileChange}
                  errorMessage={err.image}
                  accept={ACCEPTED_IMAGE_TYPES}
                />
                <BMAddressInput
                  onPlaceSelected={(e) => {
                    setLocation(e.formatted_address);
                    setGeometry(e.geometry.location);
                    setErr((err) => ({ ...err, location: "" }));
                  }}
                  label="Location"
                  errorMessage={err.location}
                />

                <BMInput
                  label="Short description of venue"
                  id="description"
                  type="text"
                  placeholder=""
                  value={description}
                  onChange={(e) => {
                    setDescription(e.target.value);
                    setErr((err) => ({
                      ...err,
                      description: e.target.value ? "" : DESCRIPTION_REQUIRED,
                    }));
                  }}
                  errorMessage={err.description}
                  as="textarea"
                  rows={3}
                />
                <BMButton type="submit" variant="primary" className="w-100">
                  Submit
                </BMButton>
              </form>
            </div>
          </BMCol>
        </BMRow>
      </BMContainer>
    </div>
  );
}

export default AddVenue;
