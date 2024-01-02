import React, { useEffect, useState } from "react";
import { db } from "../utils/firebaseConfig"
import { Link, useParams } from 'react-router-dom';
import { doc, updateDoc, getDoc, arrayUnion } from "firebase/firestore";

import { useAuthState } from '../hooks/useAuthState';


function VenuePage() {
    const { otherId } = useParams();  // get the param from the url
    const [otherData, setOtherData] = useState(null);
    const { user } = useAuthState();  // Get info for currently logged in user
    const [bandDetails, setBandDetails] = useState([]);
    const [loading, setLoading] = useState(true);
  
    useEffect(() => {
      const fetchOtherData = async () => {
        try {
          const docRef = doc(db, 'users', otherId.slice(1));
          const docSnap = await getDoc(docRef);
  
          console.log("docSnap = ", docSnap);
          console.log("otherId = ", otherId);
  
          if (docSnap.exists()) {
            setOtherData(docSnap.data());
          } else {
            console.log("No such user!");
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      };
  
      fetchOtherData();
    }, [otherId, db]);
  
    useEffect(() => {
      setLoading(true);
      const fetchBandDetails = async () => {
        const bands = [];
        for (const id of otherData.visited) {
          const bandRef = doc(db, 'users', id);
          try {
            const bandDoc = await getDoc(bandRef);
            if (bandDoc.exists()) {
              bands.push({ id: id, name: bandDoc.data().name, profileImage: bandDoc.data().profileImage });
            } else {
              console.log('No such band!');
            }
          } catch (error) {
            console.error('Error fetching band data:', error);
          }
        }
        setBandDetails(bands);
        setLoading(false);
      };
    
      if (otherData && otherData.visited) {
        fetchBandDetails();
      }
    }, [otherData, db]);
  
    const addToVisited = async () => {
      if (!user) {
        console.error("No user logged in");
        return;
      }
      const otherRef = doc(db, 'users', otherId.slice(1)); // Ensure the ID is correctly formatted
      try {
        await updateDoc(otherRef, {
          visited: arrayUnion(user.uid)
        });
        console.log("User ID added to visited");
      } catch (error) {
        console.error("Error updating visited array", error);
      }
    }
  
    if (!otherData || loading) {
      return <div className="content-container">Loading...</div>;
    }
  
    console.log('visited: ', otherData.visited);
  
    return (
      <div>
        <div className="content-container">
          <h1>{"Venue: " + otherData.name}</h1>
          <p>{"Venue's email: " + otherData.email}</p>
          <p>Bands that have played here:</p>
          <div className="cards-container">
            {bandDetails.map((band, index) => (
              <div key={index} className="band-card">
                <Link to={`/bands/:${band.id}`} className="band-link">
                  <div className="band-info">
                    <span className="band-name">{band.name}</span>
                    {band.profileImage && 
                      <img src={band.profileImage} alt={`${band.name}`} className="profilesmall" />
                    }
                  </div>
                </Link>
              </div>
            ))}
          </div>
          <button onClick={addToVisited} style={{ marginLeft: '10px' }}>Our Band Has Played Here!</button>
          {/* You can conditionally display band or venue-specific information based on userData.accountType */}
        </div>
      </div>
    );
  }

  export default VenuePage;