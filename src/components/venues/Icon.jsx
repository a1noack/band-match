import React from "react";

const Icon = ({ className, wrapperClass, onClick }) => {
  return (
    <div className={`profile-icon ${wrapperClass||""}`} onClick={onClick}>
      <label htmlFor="profileEdit">
        <i class={`fa ${className}`}></i>
      </label>
    </div>
  );
};

export default Icon;
