import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";
import React from "react";

const Map = ({ centerPoint, markerPoints = [] }) => {
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_API_KEY,
    libraries: ["geometry", "drawing"],
  });

  const mapContainerStyle = {
    width: "100%",
  };

  const center = {
    lat: centerPoint?._lat,
    lng: centerPoint?._long,
  };

  const locations = markerPoints?.map((point, index) => ({
    id: index,
    lat: point?.geometry?._lat,
    lng: point?.geometry?._long,
    name: point?.name,
  }));

  return (
    isLoaded && (
      <GoogleMap mapContainerStyle={mapContainerStyle} center={center} zoom={8}>
        {locations.map((location) => (
          <Marker
            key={location.id}
            position={{ lat: location.lat, lng: location.lng }}
            title={location.name}
          />
        ))}
      </GoogleMap>
    )
  );
};

export default Map;
