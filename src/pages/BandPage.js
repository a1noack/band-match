import React, { useEffect, useState } from "react";
import { useParams } from 'react-router-dom';
import { doc, getDoc } from "firebase/firestore";

import { db } from "../utils/firebaseConfig"


function BandPage() {
    const { otherId } = useParams();  // get the param from the url
    const [otherData, setOtherData] = useState(null);
  
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
  
    if (!otherData) {
      return <div>Loading...</div>;
    }
  
    console.log('visited: ', otherData.visited);
  
    return (
      <div>
        <div className="content-container">
          <h1>{"Band's Name: " + otherData.name}</h1>
          <p>{"Band's email: " + otherData.email}</p>
        </div>
      </div>
    );
  }

  export default BandPage;