import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";

import authImage from "../assets/auth-image.jpeg";
import BMAlert from "../shared/BMAlert";
import BMButton from "../shared/BMButton";
import BMCol from "../shared/BMCol";
import BMContainer from "../shared/BMContainer";
import BMInput from "../shared/BMInput";
import BMRow from "../shared/BMRow";
import { auth, db } from "../utils/firebaseConfig";
import BMAddressInput from "../shared/BMAddressInput";
import {
  INVALID_EMAIL,
  INVALID_PASSWORD,
  LOCATION_REQUIRED,
  NAME_REQUIRED,
} from "../utils/messages";
import { emailValidation, passwordCheck } from "../utils/regex";

function SignUp() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [geometry, setGeometry] = useState(null);
  const [error, setError] = useState(null);
  const [err, setErr] = useState({});

  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      if (
        !name ||
        !geometry ||
        !emailValidation(email) ||
        !passwordCheck(password)
      ) {
        setErr((err) => ({
          ...err,
          name: name ? "" : NAME_REQUIRED,
          location: geometry ? "" : LOCATION_REQUIRED,
          email: emailValidation(email) ? "" : INVALID_EMAIL,
          password: passwordCheck(password) ? "" : INVALID_PASSWORD,
        }));
        return;
      }

      // Create a new user
      const { user } = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      navigate("/feed");

      // Add the user's info to the database
      await setDoc(doc(db, "users", user.uid), {
        name: name,
        email: email,
        description: null,
        accountType: "band",
        location: location,
        geometry: [geometry.lat(), geometry.lng()],
        profileImage: null,
        visited: [],
      });
    } catch (error) {
      setError(error);
      console.error("Error creating user", error.message);
      navigate("/");
    }
  };

  return (
    <div className="auth-wrapper">
      <BMContainer fluid className="px-0">
        <BMRow className="g-0">
          <BMCol md={6} className="d-none d-md-block">
            <div className="auth-img">
              <img src={authImage} alt="authImage" />
            </div>
          </BMCol>
          <BMCol md={6}>
            <div className="auth-content">
              <div className="auth-content-inner">
                <h2 className="mb-4 fw-bold">Create an account</h2>
                {error && (
                  <BMAlert variant="danger">
                    Invalid information. Please try again.
                  </BMAlert>
                )}
                <form onSubmit={handleSubmit}>
                  <BMInput
                    label="Name of individual/group"
                    id="name"
                    type="text"
                    placeholder="Name of individual/group"
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
                    label="Email address"
                    type="text"
                    placeholder="Email address"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setErr((err) => ({
                        ...err,
                        email: emailValidation(e.target.value)
                          ? ""
                          : INVALID_EMAIL,
                      }));
                    }}
                    errorMessage={err.email}
                  />
                  <BMInput
                    label="Password"
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      setErr((err) => ({
                        ...err,
                        password: passwordCheck(e.target.value)
                          ? ""
                          : INVALID_PASSWORD,
                      }));
                    }}
                    errorMessage={err.password}
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

                  <BMButton
                    type="submit"
                    variant="primary"
                    className="w-100 mb-3 mt-2"
                  >
                    Submit
                  </BMButton>
                  <p>
                    Already have an account?{" "}
                    <NavLink to="/signin">Log in</NavLink>
                  </p>
                </form>
              </div>
            </div>
          </BMCol>
        </BMRow>
      </BMContainer>
    </div>
  );
}

export default SignUp;
