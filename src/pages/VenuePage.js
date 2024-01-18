import { arrayUnion, doc, getDoc, updateDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { db } from "../utils/firebaseConfig";

import { SwiperSlide } from "swiper/react";
import noImage from "../assets/no-image.jpg";
import Icon from "../components/venues/Icon";
import { useAuthState } from "../hooks/useAuthState";
import BMButton from "../shared/BMButton";
import BMCol from "../shared/BMCol";
import BMContainer from "../shared/BMContainer";
import BMInput from "../shared/BMInput";
import BMRow from "../shared/BMRow";
import BMSlider from "../shared/BMSlider";
import BMSpinner from "../shared/BMSpinner";
import noVenueDetailsFound from "../assets/no-venue-found.png";

function VenuePage() {
  const { venueName } = useParams(); // get the param from the url (must match what's in App.js)
  const [otherData, setOtherData] = useState(null);
  const { user } = useAuthState(); // Get info for currently logged in user
  const [bandDetails, setBandDetails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updateDescriptionData, setUpdateDescriptionData] = useState("");
  const [editing, setEditing] = useState(false);
  const [detailsLoading, setDetailsLoading] = useState(false);

  useEffect(() => {
    const fetchOtherData = async () => {
      try {
        setDetailsLoading(true);
        console.log("venuename", venueName);
        const docRef = doc(db, "venues", venueName.slice(1)); // Remove the leading colon from the name
        const docSnap = await getDoc(docRef);

        console.log("docSnap = ", docSnap);
        console.log("venueName = ", venueName);

        if (docSnap.exists()) {
          setOtherData(docSnap.data());
          setUpdateDescriptionData(docSnap.data().description);
        } else {
          console.log("No such user!");
        }
        setDetailsLoading(false);
      } catch (error) {
        setDetailsLoading(false);
        console.error("Error fetching user data:", error);
      }
    };
    fetchOtherData();
  }, [venueName, db]);

  useEffect(() => {
    const fetchBandDetails = async () => {
      const bands = [];
      for (const id of otherData.visited) {
        const bandRef = doc(db, "users", id);
        try {
          const bandDoc = await getDoc(bandRef);
          if (bandDoc.exists()) {
            bands.push({
              id: id,
              name: bandDoc.data().name,
              profileImage: bandDoc.data().profileImage,
              email: bandDoc.data().email,
            });
          } else {
            console.log("No such band!");
          }
        } catch (error) {
          console.error("Error fetching band data:", error);
        }
      }
      setBandDetails(bands);
      setLoading(false);
    };

    if (otherData && otherData.visited) {
      setLoading(true);
      fetchBandDetails();
    } else setLoading(false);
  }, [otherData, db]);

  const addToVisited = async () => {
    if (!user) {
      console.error("No user logged in");
      return;
    }
    const otherRef = doc(db, "venues", venueName.slice(1)); // Remove the leading colon from the name
    try {
      await updateDoc(otherRef, {
        visited: arrayUnion(user.uid),
      });
      console.log("User ID added to visited");
    } catch (error) {
      console.error("Error updating visited array", error);
    }
  };

  const updateDescription = async () => {
    if (!user) {
      console.error("No user logged in");
      return;
    }
    const otherRef = doc(db, "venues", otherData.name);
    // Remove the leading colon from the name
    try {
      await updateDoc(otherRef, {
        description: updateDescriptionData,
      });
      setOtherData((data) => ({
        ...data,
        description: updateDescriptionData,
      }));
      setUpdateDescriptionData("");
      setEditing(false);
    } catch (error) {
      console.error("Error updating visited array", error);
    }
  };

  if (detailsLoading || loading) {
    return (
      <BMContainer>
        <BMSpinner />
      </BMContainer>
    );
  }

  if (!detailsLoading && !otherData)
    return (
      <BMContainer>
        <BMRow>
          <BMCol xs={12}>
            <div className="no-value-found">
              <img src={noVenueDetailsFound} alt="No venue details found" />
            </div>
          </BMCol>
        </BMRow>
      </BMContainer>
    );

  return (
    <div className="py-md-5 py-4">
      <BMContainer>
        <BMRow className="align-items-center flex-row-reverse">
          <BMCol lg={5}>
            <div className="venue-detail">
              <h2 className="mb-2">{otherData.name}</h2>
              <p className="location">
                <i className="fa fa-map-marker me-2"></i>
                {otherData.location}
              </p>

              <div>
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <b>Description</b>
                  {!editing ? (
                    <Icon
                      className="fa-pencil"
                      onClick={() => {
                        setEditing(true);
                        setUpdateDescriptionData(otherData.description);
                      }}
                    />
                  ) : (
                    <div className="d-flex">
                      <Icon
                        wrapperClass="me-2"
                        className="fa-check"
                        onClick={updateDescription}
                      />
                      <Icon
                        className="fa-close"
                        onClick={() => {
                          setEditing(false);
                          setUpdateDescriptionData("");
                        }}
                      />
                    </div>
                  )}
                </div>
                {!editing ? (
                  <p>{otherData.description}</p>
                ) : (
                  <BMInput
                    value={updateDescriptionData}
                    onChange={(e) => setUpdateDescriptionData(e.target.value)}
                    as="textarea"
                    rows={3}
                  />
                )}
              </div>
            </div>
          </BMCol>
          <BMCol lg={7}>
            <div className="venue-detail-img">
              <img src={otherData?.images?.[0] || noImage} alt="venue-img" />
              <BMButton
                variant="primary"
                className="btn-band-list mt-3 mt-sm-0"
                onClick={addToVisited}
              >
                Our Band Has Played Here!
              </BMButton>
            </div>
          </BMCol>
        </BMRow>

        <BMRow>
          <BMCol xs={12}>
            <div className="band-play-wrapper">
              <h2>Band Played List</h2>
            </div>
            {bandDetails.length > 0 ? (
              <div className="band-play-list">
                <BMSlider
                  spaceBetween={10}
                  slidesPerView={1}
                  navigation
                  breakpoints={{
                    0: {
                      slidesPerView: 1,
                    },
                    500: {
                      slidesPerView: 2,
                    },
                    992: {
                      slidesPerView: 3,
                    },
                    1024: {
                      slidesPerView: 4,
                    },
                  }}
                >
                  {bandDetails.map((band, index) => (
                    <SwiperSlide key={index}>
                      <div className="band-card">
                        <div className="band-info">
                          {band.profileImage ? (
                            <img
                              src={band?.profileImage}
                              alt={`${band.name}`}
                              className="profilesmall"
                            />
                          ) : (
                            <i className="fa fa-user"></i>
                          )}
                          <div className="band-user-info">
                            <span className="band-name">{band.name}</span>
                            <span className="band-email">{band.email}</span>
                          </div>
                        </div>
                      </div>
                    </SwiperSlide>
                  ))}
                </BMSlider>
              </div>
            ) : (
              <p className="no-data text-center">No List Available</p>
            )}
          </BMCol>
        </BMRow>
      </BMContainer>
    </div>
  );
}

export default VenuePage;
