import React, { useState, useEffect } from "react";
import userContext from "../../Components/userContext";
import { useContext } from "react";
import { useLocation } from "react-router-dom";
import JoinRoomInputs from "./JoinRoomInputs";

import { useNavigate } from "react-router-dom";
import "./JoinRoom.css";
import store from "../../store/store";
import { setUsername } from "../../store/actions";

function JoinRoomPage() {
  const {
    isRoomHost,
    setIsRoomHost,
    identity,
    setIdentity,
    roomId,
    setRoomId,
    participants,
    setParticipants,
    socketId,
    setSocketId,
  } = useContext(userContext);
  const search = useLocation().search;

  useEffect(() => {
    const isRoomHostt = new URLSearchParams(search).get("host");
    if (isRoomHostt) {
      setIsRoomHost(true);
    }
    console.log("is host", isRoomHost);
  }, [isRoomHost]);

  const [roomIdValue, setRoomIdValue] = useState("");
  const [nameValue, setNameValue] = useState("");

  const handleJoinRoom = async () => {
    store.dispatch(setUsername(nameValue));
    setIdentity(nameValue);

    if (isRoomHost) {
      createRoom();
    } else {
      joinRoom();
    }
  };
  let navigate = useNavigate();
  const joinRoom = () => {
    setRoomId(roomIdValue);
    navigate("/room");
  };

  const createRoom = () => {
    navigate("/room");
  };

  return (
    <div className="secondpage_container">
      <div className="connecting_buttons_container2">
        <div>
          {isRoomHost ? (
            <h2 className="heading_second_page">Host a meeting</h2>
          ) : (
            <h2 className="heading_second_page"> Join meeting</h2>
          )}
        </div>
        <JoinRoomInputs
          roomIdValue={roomIdValue}
          setRoomIdValue={setRoomIdValue}
          nameValue={nameValue}
          setNameValue={setNameValue}
          isRoomHost={isRoomHost}
        />
        <button className="btn_second_page" onClick={handleJoinRoom}>
          {isRoomHost ? "Host" : "Join"}
        </button>
      </div>
    </div>
  );
}

export default JoinRoomPage;
