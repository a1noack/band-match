import React, { useEffect, useState } from "react";
import { auth, db } from "./firebase"
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { BrowserRouter as Router, Route, Routes, useNavigate } from 'react-router-dom';
import { doc, setDoc, getDocs, collection, updateDoc, getDoc } from "firebase/firestore";
// import { useUserProfile } from ".GetUserHook.js"
import Navbar from './components/Navbar';
import './App.css';
import { getStorage, ref, getDownloadURL, uploadBytesResumable } from "firebase/storage";

const fetchDocuments = async () => {
  const querySnapshot = await getDocs(collection(db, "users"));

  const documents = querySnapshot.docs.map((doc) => ({
    id: doc.id,
    entity_name: doc.data().name,
    entity_email: doc.data().email,
    entity_type: doc.data().accountType,
  }));
  console.log(documents);
  return documents;
}

function App() {
  return (
    <Router>
      <div>
      <Routes>
        <Route path={"/"} element={<Signup/>} />
        <Route path={"/signin"} element={<Signin/>} />
        <Route path={"/feed"} element={<Feed/>} />
        <Route path={"/profile"} element={<Profile/>} />
      </Routes>
      </div>
    </Router>
  );
}

function Profile() {
  const [user, setUser] = useState(null);
  const [name, setName] = useState(null);
  const [profileImage, setProfileImage] = useState(null);
  const storage = getStorage();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (firebaseUser) => {
      setUser(firebaseUser);
      if (firebaseUser) {
        const userRef = doc(db, 'users', firebaseUser.uid);
        try {
          const userDoc = await getDoc(userRef);
          if (userDoc.exists()) {
            setProfileImage(userDoc.data().profileImage);
            setName(userDoc.data().name);
          } else {
            console.log('User document not found');
          }
        } catch (error) {
          console.error('Error fetching user document:', error);
        }
      }
    });

    return () => unsubscribe();
  }, [db]);  // Every time the database is updated, rerun this function.

  // Make sure to define this function before it is used
  const uploadToFirebase = async (fileToUpload) => {
    console.log("Uploading to Firebase");
    if (!fileToUpload) return;

    // Generate a unique file name or path here
    const fileRef = ref(storage, `images/${fileToUpload.name}`);

    try {
      // uploadBytesResumable returns an upload task
      const uploadTask = uploadBytesResumable(fileRef, fileToUpload);

      // Use a promise to handle completion
      return new Promise((resolve, reject) => {
        uploadTask.on(
          'state_changed',
          (snapshot) => {
            // Handle progress
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log('Upload is ' + progress + '% done');
          },
          (error) => {
            // Handle unsuccessful uploads
            console.error('Error during upload', error);
            reject(error);
          },
          () => {
            // Handle successful uploads on complete
            getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
              console.log('File available at', downloadURL);
              resolve(downloadURL);
            });
          }
        );
      });
    } catch (error) {
      console.error('Error uploading file', error);
      return null;
    }
  };

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

  if (user === null) {
    return (
      <div>
        <div>
          <Navbar />
        </div>
        <div className="content-container">
          <h1>Not logged in</h1>
        </div>
      </div>);
  }
  else {
    return (
      <div>
        <div>
          <Navbar />
        </div>
        <div className="content-container">
          {profileImage && <img src={profileImage} alt="Profile" className="profilelarge"/>}
          <></>
          <p><input type="file" onChange={handleFileChange} /></p>
          <p>Name: {name}</p>
          <p>Email: {user.email}</p>
        </div>
      </div>
    );
  }
}

function Feed() {
  const [user, setUser] = useState(null);
  const [userType, setUserType] = useState(null); // TODO: Use this to determine what to show on the feed
  const [documents, setDocuments] = useState([]);

  // Listener that checks if a user is logged in
  useEffect(() => {
    // console.log("Auth state changed:", user);
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

  useEffect(() => {
    const getAndSetDocuments = async () => {
        try {
          const docs = await fetchDocuments();
          setDocuments(docs);
        } catch (error) {
            console.error("Error fetching documents:", error);
        }
    };
    getAndSetDocuments();
  }, [userType !== null]);

  //If a user is not logged in, don't show users
  if (user === null) {
    return (
      <div>
        <div>
          <Navbar />
        </div>
        <div className="content-container">
          <h1>Not logged in</h1>
        </div>
      </div>);
  }
  else {
    return (
      <div>
        <div>
          <Navbar />
        </div>
        <div className="content-container">
          {documents.map(doc => (
            <div key={doc.id} className="card">
                {doc.entity_name}
            </div>
          ))}
        </div>
      </div>
    );
  }
}

function Signin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault()
    try {
      const { user } = await signInWithEmailAndPassword(auth, email, password)
      navigate("/feed");
    } catch (err) {
      setError(err.message);
      console.error("Error logging in!", err.message)
    }
  };

  const redirectToSignup = () => {
    navigate("/");
  }
  
  return (
    // TODO: forward errors to the user eg. "Invalid email/password combination"
    <div>
      <div>
        <Navbar />
      </div>
      <div className="content-container">
        <h2 className={"App-header"}>Log in</h2>
        <form onSubmit={handleSubmit}>
          <div>  
            <input
                type="text"
                placeholder="Email address"  // TODO: Switch to same format as signup
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <input
                type="text"
                placeholder="Password"
                value={password}  // TODO: Make it so that this is hidden
                onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button type="submit">Submit</button>
        </form>
        {error && 
          <div style={{ backgroundColor: '#ffe6e6', border: '1px solid red', padding: '10px', borderRadius: '4px', marginTop: '10px' }}>
            <span style={{ color: 'red' }}>Invalid email/password combination
            </span>
            <button onClick={redirectToSignup} style={{ marginLeft: '10px' }}>Create account</button>
          </div>
        }
      </div>
    </div>
  );
}

function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [accountType, setAccountType] = useState('band');

  const handleRadioChange = (e) => {
    setAccountType(e.target.value);
  };

  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault()
    try {
      // Create a new user
      const { user } = await createUserWithEmailAndPassword(auth, email, password)
      navigate("/feed");

      // Add the user's info to the database
      await setDoc(doc(db, "users", user.uid), {
        name: name,
        email: email,
        accountType: accountType,
        location: location,
        profileImage: null,
      });
    } catch (error) {
      console.error("Error creating user", error.message)
      navigate("/");
    }
  };

  const redirectToLogin = () => {
    navigate("/signin");
  }

  return (
    <div>
      <div>
        <Navbar />
      </div>
      <div className="content-container">
        <h2 className={"App-header"}>Create an Account</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Name of band or venue</label>
            <input
                id="name"
                type="text"
                placeholder=""
                value={name}
                onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label>Email address</label>
            <input
                type="text"
                placeholder=""
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input
                type="text"
                placeholder=""
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <label>Account type</label>
          <div className="radio-group">
            <input 
                type="radio" 
                id="band" 
                name="band_or_venue" 
                value="band"
                checked={accountType === 'band'}
                onChange={handleRadioChange}
                 />
            <label for="band">Band</label>
            <input 
                type="radio" 
                id="venue" 
                name="band_or_venue" 
                value="venue"
                checked={accountType === 'venue'}
                onChange={handleRadioChange}
                 />
            <label for="venue">Venue</label>
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
          <div className="form-group">
            <p>Already have an account?</p> 
          </div>
          <button onClick={redirectToLogin}>Log in</button>
        </form>
      </div>
      </div>
      
  );
}

export { Feed, App };
