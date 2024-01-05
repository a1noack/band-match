import React, { useEffect, useState } from "react";
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

import { useAuthState } from '../hooks/useAuthState';
import { fetchVenueNames } from '../utils/firebaseUtils';

function Feed() {
    const { user, loading, userType } = useAuthState();  // Get info for currently logged in user
    const [documents, setDocuments] = useState([]);
    const navigate = useNavigate();

    const redirectToVenueAdd = () => {
        navigate("/addvenue");
    }
    
    // Get all of the documents for all users
    useEffect(() => {
        const getAndSetDocuments = async () => {
            try {
            const docs = await fetchVenueNames();
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
            {documents.map(doc => (
                <Link to={`/venues/:${doc.venue_name}`} key={doc.venue_name} className="card custom-link">
                {/* The entire card is now a link */}
                <div>
                    {doc.venue_name}
                </div>
                </Link>
            ))}
            <div>Don't see a venue that should be listed?</div>
            <button onClick={redirectToVenueAdd}>Add a venue</button>
            </div>
        </div>
        );
    }
}

export default Feed;