import React from "react";
import Exit from "../../assets/sidebar/Exit.png";

const LeaveRoomButton = () => {
  const handleRoomDisconnection = () => {
    const siteUrl = window.location.origin;
    window.location.href = siteUrl;
  };

  return (
    <img
      src={Exit}
      onClick={handleRoomDisconnection}
      className="video_button_end"
    />
  );
};

export default LeaveRoomButton;
