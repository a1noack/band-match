import React, { useEffect, useState } from "react";
import { Link } from 'react-router-dom';

import { useAuthState } from '../hooks/useAuthState';
import { fetchDocuments } from '../utils/firebaseUtils';

function Feed() {
    const { user, loading, userType } = useAuthState();  // Get info for currently logged in user
    const [documents, setDocuments] = useState([]);
    
    // Get all of the documents for all users
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

    // If we are still loading the user's information, show loading screen 
    if (loading) {
        return <div className="content-container">Loading...</div>;
    // If a user is not logged in, don't show users
    } else if (user === null) {
        return <div className="content-container">Not logged in.</div>;
    // Display all other user's data
    } else {
        return (
        <div>
            <div className="content-container">
            <h1>
                {"Venues In My Area"}
            </h1>
            {documents.filter(doc => doc.entity_type !== userType).map(doc => (
                <Link to={`/venues/:${doc.id}`} key={doc.id} className="card custom-link">
                {/* The entire card is now a link */}
                <div>
                    {doc.entity_name}
                </div>
                </Link>
            ))}
            </div>
        </div>
        );
    }
}

export default Feed;