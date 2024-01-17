import React from "react";
import { Form } from "react-bootstrap";

const BMInput = ({
  type,
  placeholder,
  value,
  label,
  onChange,
  rows,
  as,
  errorMessage,
  accept,
}) => {
  return (
    <Form.Group className="mb-3 form-group">
      <Form.Label>{label}</Form.Label>
      <Form.Control
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        as={as}
        rows={rows}
        accept={accept}
      />
      <p className="text-danger">{errorMessage}</p>
    </Form.Group>
  );
};

export default BMInput;
