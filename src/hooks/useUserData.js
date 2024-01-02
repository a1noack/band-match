import { useState, useEffect } from 'react';
import { db } from '../utils/firebaseConfig'; // Adjust import path as necessary
import { doc, getDoc } from "firebase/firestore";

export const useUserData = (userId) => {
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    if (!userId) return;

    const fetchUserData = async () => {
      const userRef = doc(db, 'users', userId);
      try {
        const userDoc = await getDoc(userRef);
        if (userDoc.exists()) {
          setUserData(userDoc.data());
        } else {
          console.log('User document not found');
        }
      } catch (error) {
        console.error('Error fetching user document:', error);
      }
    };

    fetchUserData();
  }, [userId]);

  return userData;
};