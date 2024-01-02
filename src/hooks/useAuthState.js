import { useState, useEffect } from 'react';
import { db, auth } from '../utils/firebaseConfig'; // Adjust import path as necessary
import { doc, getDoc } from "firebase/firestore";

export const useAuthState = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [userType, setUserType] = useState(true);

    useEffect(() => {
        setLoading(true);
        const unsubscribe = auth.onAuthStateChanged(async user => {
        if (user) {
            setUser(user);
            const userRef = doc(db, 'users', user.uid);
            try {
            const userDoc = await getDoc(userRef);
            if (userDoc.exists()) {
                setUserType(userDoc.data().accountType);
            } else {
                console.log('User document not found');
            }
            } catch (error) {
            console.error('Error fetching user document:', error);
            }
        } else {
            setUser(null);
        }
        setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    return { user, loading, userType };
};