import React from "react";

const Notification = ({ header, open, status, children }) => {
  return (
    <div className={`alert alert-${status} ${open ? "open" : ""}`}>
      {children}
    </div>
  );
};

export default Notification;