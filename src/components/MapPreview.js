import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";
import React from "react";

const Map = ({ geometry }) => {
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_API_KEY,
    libraries: ["geometry", "drawing"],
  });

  const mapContainerStyle = {
    width: "100%",
    height: "400px",
  };

  const center = {
    lat: geometry[0],
    lng: geometry[1],
  };

  const markerPosition = {
    lat: geometry[0],
    lng: geometry[1],
  };

  return (
    isLoaded && (
      <GoogleMap mapContainerStyle={mapContainerStyle} center={center} zoom={8}>
        <Marker position={markerPosition} />
      </GoogleMap>
    )
  );
};

export default Map;
