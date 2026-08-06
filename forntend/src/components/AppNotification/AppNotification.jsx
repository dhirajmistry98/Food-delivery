import React from "react";
import "./AppNotification.css";

const AppNotification = ({ notification, onClose }) => {
  if (!notification) {
    return null;
  }

  return (
    <div className={`app-notification app-notification-${notification.type}`}>
      <p>{notification.message}</p>
      <button type="button" onClick={onClose} aria-label="Close notification">
        x
      </button>
    </div>
  );
};

export default AppNotification;
