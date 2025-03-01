import React, { useState, useContext } from "react";
import SendMessageButton from "../../assets/sidebar/SendMessage.png";
import * as webRTCHandler from "../../utils/webRTCHandler";
import userContext from "../userContext";

const NewMessage = () => {
  const [message, setMessage] = useState("");
  const {
    roomId,
    isRoomHost,
    setIsRoomHost,
    identity,
    setIdentity,
    setRoomId,
    participants,
    setParticipants,
    socketId,
    setSocketId,
  } = useContext(userContext);
  const handleTextChange = (event) => {
    setMessage(event.target.value);
  };

  const handleKeyPressed = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();

      // send message to other users
      sendMessage();
    }
  };

  const sendMessage = () => {
    if (message.length > 0) {
      console.log("Sended meassage successfully");
      webRTCHandler.sendMessageUsingDataChannel(message, identity);
      setMessage("");
    }
  };

  return (
    <div className="new_message_container">
      <input
        className="new_message_input"
        value={message}
        onChange={handleTextChange}
        placeholder="Type your message ..."
        type="text"
        onKeyDown={handleKeyPressed}
      />
      <img
        className="new_message_button"
        src={SendMessageButton}
        onClick={sendMessage}
      />
    </div>
  );
};

export default NewMessage;
