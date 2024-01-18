import React from "react";
import { Form } from "react-bootstrap";
import GooglePlacesAutocomplete from "react-google-autocomplete";

const BMAddressInput = ({ onPlaceSelected, label, errorMessage }) => {
  return (
    <>
      <Form.Group className="mb-3 form-group">
        <Form.Label>{label}</Form.Label>
        <GooglePlacesAutocomplete
          options={{ types: ["geocode"] }}
          apiKey={process.env.REACT_APP_GOOGLE_API_KEY}
          onPlaceSelected={onPlaceSelected}
          placeholder="Enter your address"
          className="form-control"
        />
        <p className="text-danger">{errorMessage}</p>
      </Form.Group>
    </>
  );
};

export default BMAddressInput;
