import { signInWithEmailAndPassword } from "firebase/auth";
import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import authImage from "../assets/auth-image.jpeg";
import BMAlert from "../shared/BMAlert";
import BMButton from "../shared/BMButton";
import BMCol from "../shared/BMCol";
import BMContainer from "../shared/BMContainer";
import BMInput from "../shared/BMInput";
import BMRow from "../shared/BMRow";
import { auth } from "../utils/firebaseConfig";
import { emailValidation, passwordCheck } from "../utils/regex";
import { INVALID_EMAIL, INVALID_PASSWORD } from "../utils/messages";

function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [err, setErr] = useState({});
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      if (!email || !password) {
        setErr((err) => ({
          ...err,
          email: emailValidation(email) ? "" : INVALID_EMAIL,
          password: passwordCheck(password) ? "" : INVALID_PASSWORD,
        }));
        return;
      }

      const { user } = await signInWithEmailAndPassword(auth, email, password);
      navigate("/feed");
    } catch (err) {
      setError(err.message);
      console.error("Error logging in!", err.message);
    }
  };

  return (
    // TODO: forward errors to the user eg. "Invalid email/password combination"
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
                <h2 className="mb-4 fw-bold">Log in</h2>
                {error && (
                  <BMAlert variant="danger">
                    Invalid email/password combination
                  </BMAlert>
                )}
                <form onSubmit={handleSubmit}>
                  <BMInput
                    label="Email address"
                    type="text"
                    placeholder="Email address" // TODO: Switch to same format as signup
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
                    value={password} // TODO: Make it so that this is hidden
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
                  <BMButton
                    type="submit"
                    variant="primary"
                    className="w-100 mb-3 mt-2"
                  >
                    Submit
                  </BMButton>
                  <p>
                    Don't have an account?{" "}
                    <NavLink to="/">Register Now</NavLink>
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

export default SignIn;
