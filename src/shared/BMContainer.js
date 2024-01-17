import React from "react";
import { Container } from "react-bootstrap";

const BMContainer = ({ children, ...props }) => {
  return <Container {...props}>{children}</Container>;
};

export default BMContainer;
