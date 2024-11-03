import io from "socket.io-client";
import * as webRTCHandler from "./webRTCHandler";
const SERVER = "http://localhost:5002";

let socket = null;

export const connectWithSocketIOServer = (contextValues) => {
  socket = io(SERVER);
  console.log("connect with socket from react executed")
  const { isRoomHost, setIsRoomHost, identity, setIdentity, roomId, setRoomId, participants, setParticipants, socketId, setSocketId } = contextValues


  socket.on("connect", () => {
    console.log("successfully connected with socket io server");
    console.log(socket.id);
    setSocketId(socket.id)
  });

  //from server after creating a room we'll get rrom id back
  socket.on("room-id", (data) => {
    const { roomId } = data;
    setRoomId(roomId);
  });


  socket.on("room-update", (data) => {
    const { connectedUsers } = data;
    console.log("added participant")
   setParticipants(connectedUsers);
  });
//we got from server that a pper is asking to prepare for connection
//prepare a peer connecion with him
  socket.on("conn-prepare", (data) => {
    const { connUserSocketId } = data;
    console.log("emited meassage reached at conn-prepare 1")
    webRTCHandler.prepareNewPeerConnection(connUserSocketId, false);

    // inform the user which just join the room that we have prepared for incoming connection
    socket.emit("conn-init", { connUserSocketId: connUserSocketId });
    console.log("informing after preparing peer connection 3 ")
  });

  socket.on("conn-signal", (data) => {
    console.log("get conn-signal from ",data)
    webRTCHandler.handleSignalingData(data);
  });

  socket.on("conn-init", (data) => {
    console.log("inside conn-inti going to calll prepare new peer")
    const { connUserSocketId } = data;
    webRTCHandler.prepareNewPeerConnection(connUserSocketId, true);
    console.log("prepare new [eer connection called !")
  });

  socket.on("user-disconnected", (data) => {
    webRTCHandler.removePeerConnection(data);
  });

}





export const createNewRoom = (identity) => {
  // emit an event to server that we would like to create new room
  const data = {
    identity
   
  };

  socket.emit("create-new-room", data);//catched by the server ,cretae new room and send the roomId and candidates in the room

};

export const joinRoom = (identity, roomId) => {
  //emit an event to server that we would to join a room
  const data = {
    roomId,
    identity
   
  };

  socket.emit("join-room", data);
};



export const signalPeerData = (data) => {
  console.log("signaling peer data")
  socket.emit("conn-signal", data);
};