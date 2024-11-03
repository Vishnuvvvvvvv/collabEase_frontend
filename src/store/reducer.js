import Actions from "./actions";

const initState = {
    localVideoRef: null,
    remoteVideoRefs: [],
    messages: [],
    summary:"",
};

const reducer = (state = initState, action) => {
  switch (action.type) {
    case Actions.SET_LOCAL_VIDEO_REF:
        return { ...state, localVideoRef: action.payload };

    case Actions.SET_REMOTE_VIDEO_REF:
      // return { ...state, remoteVideoRefs: [...state.remoteVideoRefs, {stream: action.payload.stream, id:action.payload.connUserSocketId}] };
      const newRemoteVideoRef = { stream: action.payload.stream, id: action.payload.connUserSocketId };
      return {
        ...state,
        remoteVideoRefs: [...state.remoteVideoRefs, newRemoteVideoRef]
      };
      case Actions.REMOVE_REMOTE_VIDEO_REF:
            // return {
            //   ...state,
            //   remoteVideoRefs: state.remoteVideoRefs.filter(ref => ref.id !== action.payload)
            // };
            const removedSocketId = action.payload;
            const updatedRemoteVideoRefs = state.remoteVideoRefs.map(ref => {
              if (ref.id === removedSocketId) {
                // Copy other properties into a new object and return it
                return { ...ref ,stream:null,id:0};
              }
              return ref;
            });
          
            // Filter out the removed item
            return {
                ...state,
                remoteVideoRefs: updatedRemoteVideoRefs
              };
        case Actions.SET_MESSAGES:
        return {
            ...state,
            messages: action.messages,
        };

        case Actions.SET_SUMMARY:
        return {
          ...state,
          summary: action.summary,
        };
    default:
      return state;
  }
};

export default reducer;
