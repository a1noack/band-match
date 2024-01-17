import React from "react";

const Icon = ({ className, onClick }) => {
  return (
    <div className="profile-icon" onClick={onClick}>
      <label htmlFor="profileEdit">
        <i class={`fa ${className}`}></i>
      </label>
    </div>
  );
};

export default Icon;
