import React, { useEffect, useState } from "react";
import { auth, db, admin } from "./firebase"
import { getAuth } from 'firebase/auth';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { BrowserRouter as Router, Route, Routes, useNavigate } from 'react-router-dom';
import { doc, setDoc, getDoc, getDocs, collection } from "firebase/firestore";
import Navbar from './components/Navbar';
import './App.css';
import { getStorage, ref, uploadBytes } from "firebase/storage";

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
  const [file, setFile] = useState(null);
  const storage = getStorage();

  const handleFileChange = (e) => {
    console.log("File changed");
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    console.log("Selected file:", selectedFile);
    uploadToFirebase();
  };

  const uploadToFirebase = () => {
    console.log("Uploading to Firebase");
    if (!file) return;

    const fileRef = ref(storage, 'images/mountains.jpg');

    uploadBytes(fileRef, file).then((snapshot) => {
      console.log('Uploaded a blob or file!');
    });
  };

  // const userRef = firestore.collection('users').doc(user.uid);
  // userRef.update({
  //   profilePicture: downloadURL
  // });

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
          <h1>Profile</h1>
          <input type="file" onChange={handleFileChange} />
          <p>Name: {user.name}</p>
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
    // console.log("Auth state changed:", user);
    const getAndSetDocuments = async () => {
        try {
          const docs = await fetchDocuments();
          // const docRef = doc(db, "users", user.uid);
          // const docSnap = await getDoc(docRef);
          // console.log(docSnap.data());
          // for (const doc of docs) {
          //     if (doc.id === user.uid) {
          //         setUserType(doc.entity_type);
          //     }
          // }
          // console.log("User type:", userType);
          // const filteredDocuments = docs.filter(doc => doc.entity_type !== userType);
          // setDocuments(filteredDocuments);
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
  // const [accountType, setAccountType] = useState("");
  const [accountType, setAccountType] = useState('band'); // Default value

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
        location: location
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
