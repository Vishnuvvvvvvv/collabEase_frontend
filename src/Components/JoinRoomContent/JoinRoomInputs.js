import React from 'react'

function JoinRoomInputs({roomIdValue, setRoomIdValue, nameValue, setNameValue, isRoomHost }) {
    const Input = ({ placeholder, value, changeHandler }) => {
        return (
          <input
            value={value}
            onChange={changeHandler}
            className="join_room_input"
            placeholder={placeholder}
          />
        );
      };

      const handleRoomIdValueChange = (event) => {
        setRoomIdValue(event.target.value);
      };
    
      const handleNameValueChange = (event) => {
        setNameValue(event.target.value);
      };

      

    return (
        <div className="join_room_inputs_container">
      {!isRoomHost && (
       <input 
       value={roomIdValue}
       onChange={handleRoomIdValueChange}
       className="join_room_input"
       placeholder="Enter Room ID"
     />

        
      )}
      <input
        value={nameValue}
        onChange={handleNameValueChange}
        className="join_room_input"
        placeholder="Enter Name"
      />
    </div>
  )
}

export default JoinRoomInputs