import React from "react";
import { Alert } from "react-bootstrap";

const BMAlert = ({ children, ...props }) => {
  return <Alert {...props}>{children}</Alert>;
};

export default BMAlert;
