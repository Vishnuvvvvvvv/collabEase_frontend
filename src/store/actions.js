const Actions = {
  SET_LOCAL_VIDEO_REF: "SET_LOCAL_VIDEO_REF",
  SET_REMOTE_VIDEO_REF: "SET_REMOTE_VIDEO_REF",
  REMOVE_REMOTE_VIDEO_REF: "REMOVE_REMOTE_VIDEO_REF",
  SET_MESSAGES: "SET_MESSAGES",
  SET_SUMMARY: "SET_SUMMARY",
  SET_USERNAME: "SET_USERNAME",
};

export const setLocalVideoRef = (stream) => ({
  type: Actions.SET_LOCAL_VIDEO_REF,
  payload: stream,
});

export const setRemoteVideoRef = (stream, connUserSocketId) => ({
  type: Actions.SET_REMOTE_VIDEO_REF,
  payload: { stream, connUserSocketId },
});
export const removeRemoteVideoRef = (socketId) => ({
  type: Actions.REMOVE_REMOTE_VIDEO_REF,
  payload: socketId,
});

export const setMessages = (messages) => {
  return {
    type: Actions.SET_MESSAGES,
    messages,
  };
};

//new
export const setSummary = (summary) => {
  return {
    type: Actions.SET_SUMMARY,
    summary,
  };
};

export const setUsername = (username) => ({
  type: Actions.SET_USERNAME,
  username,
});

export default Actions;
