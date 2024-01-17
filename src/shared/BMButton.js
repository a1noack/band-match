import React from "react";
import { Button } from "react-bootstrap";

const BMButton = ({ children, ...props }) => {
  return <Button {...props}>{children}</Button>;
};

export default BMButton;
