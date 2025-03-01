import React, { useContext } from "react";
import TranscriptImg from "../../assets/sidebar/Transcript.png";
import "./SideBar.css";
import userContext from "../userContext";

function Transcript() {
  const { setIsMenuOpen, isMenuOpen } = useContext(userContext);

  const transcriptHandler = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <img
      className="transcript"
      src={TranscriptImg}
      onClick={transcriptHandler}
      style={{ width: "80%", height: "12%" }}
    />
  );
}

export default Transcript;
