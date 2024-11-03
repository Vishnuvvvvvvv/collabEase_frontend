import React, { useState ,useContext, useEffect} from 'react';
import "./ParticipantsSection.css";
import AttendeeList from './AttendeeList';
import userContext from './userContext';
import ChatLabel from './ChatSection/ChatLabel';
import Messages from './ChatSection/Messages';
import NewMessage from './ChatSection/NewMessage';
import "./ChatSection/chat.css"
function ParticipantsSection({setTranscription, startRecording ,
  stopRecording ,
  togglePauseResume ,
  recordingBlob ,
  isRecording ,
  isPaused,setIsPreparingTranscript,transcription}) {


  const [activeSection, setActiveSection] = useState('attendeeList');
  
 
  const { roomId,isRoomHost, setIsRoomHost, identity, setIdentity,setRoomId, participants, setParticipants, socketId, setSocketId } = useContext(userContext);
  useEffect(()=>{
    console.log("current room in group",roomId)

  },[roomId])

  
    const handleSectionClick = (section) => {
    setActiveSection(section);
  };

  return (
    <div className='ParticipantsSection'>
      <div className="participants-section-head">
        <div id='Phead' className={`section${activeSection === 'groupChat' ? 'active' : ''}`} onClick={() => handleSectionClick('groupChat')}>
          Group Chat
        </div>
        <div id = 'Phead2' className={`section${activeSection === 'attendeeList' ? 'active' : ''}`} onClick={() => handleSectionClick('attendeeList')}>
          Attendee List
        </div>
      </div>
      <div className="participants-body">
        {activeSection === 'groupChat' && (
          <>
            {/* Display content for Group Chat section */}
            {/* `Room${roomId}` */}
            <div className="chat_section_container">
            {/* <ChatLabel/> */}
            <Messages />
            <NewMessage /> 
            </div>
          </>
        )}
        {activeSection === 'attendeeList' && (
          <AttendeeList setTranscription={setTranscription}
           startRecording = {startRecording}
          stopRecording ={stopRecording}
          togglePauseResume ={togglePauseResume}
          recordingBlob ={recordingBlob}
          isRecording = {isRecording}
          isPaused ={ isPaused}
          participants={participants}
          roomId={roomId}
          setIsPreparingTranscript = {setIsPreparingTranscript} transcription={transcription}/>
        )}
      </div>
    </div>
  );
}

export default ParticipantsSection;
