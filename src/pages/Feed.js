import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { useAuthState } from "../hooks/useAuthState";
import BMButton from "../shared/BMButton";
import BMCol from "../shared/BMCol";
import BMContainer from "../shared/BMContainer";
import BMRow from "../shared/BMRow";
import BMSpinner from "../shared/BMSpinner";
import { fetchVenueNames } from "../utils/firebaseUtils";

function Feed() {
  const { user, loading, userType } = useAuthState(); // Get info for currently logged in user
  const [documents, setDocuments] = useState([]);
  const navigate = useNavigate();

  const redirectToVenueAdd = () => {
    navigate("/addvenue");
  };

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
    return (
      <BMContainer>
        <BMSpinner />
      </BMContainer>
    );
    // If a user is not logged in, don't show users
  } else if (user === null) {
    return <div className="content-container">Not logged in.</div>;
    // Display all other user's data
  } else {
    return (
      <div className="py-sm-5 py-4">
        <BMContainer>
          <BMRow className="align-items-center mb-4">
            <BMCol sm={6}>
              <h2 className="mb-sm-0 mb-3">Venues In My Area</h2>
            </BMCol>
            <BMCol sm={6} className="text-sm-end">
              <BMButton variant="primary" onClick={redirectToVenueAdd}>
                Add a venue
              </BMButton>
            </BMCol>
          </BMRow>
          <BMRow>
            {documents.map((doc) => (
              <BMCol md={3} sm={6} xs={12} key={doc.venue_name}>
                <div className="venue-name">
                  <Link to={`/venues/:${doc.venue_name}`} className="">
                    <h6>{doc?.venue_name}</h6>
                    <p>
                      <i className="fa fa-map-marker"></i>
                      {doc?.venue_location}
                    </p>
                  </Link>
                </div>
              </BMCol>
            ))}
          </BMRow>
        </BMContainer>
      </div>
    );
  }
}

export default Feed;
