import React from "react";
import { Spinner } from "react-bootstrap";

const BMSpinner = () => {
  return (
    <div className="loader-wrapper">
      <Spinner animation="border" variant="primary" />
    </div>
  );
};

export default BMSpinner;
