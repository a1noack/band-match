import React from "react";
import { Col } from "react-bootstrap";

const BMCol = ({ children, ...props }) => {
  return <Col {...props}>{children}</Col>;
};

export default BMCol;
