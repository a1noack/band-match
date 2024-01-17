import React from "react";
import { Row } from "react-bootstrap";

const BMRow = ({ children, ...props }) => {
  return <Row {...props}>{children}</Row>;
};

export default BMRow;
