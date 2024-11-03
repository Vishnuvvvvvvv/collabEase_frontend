import React from 'react'
import { useNavigate} from "react-router-dom";
import ConnectingButton from './ConnectingButton';
import  userContext from '../../Components/userContext';
import Lottie from "lottie-react"
import landingPAge from "../../assets/LAndingPAge1.json"
import "./IntroductionPage.css"
import donut from "../../assets/donut-chart.png";

function IntroductionPage() {

    let navigate = useNavigate();

    

  const pushToJoinRoomPage = () => {
    navigate("/join-room");
  };

  const pushToJoinRoomPageAsHost = () => {
    navigate("/join-room?host=true");
  };


  return (
    <div className='IntroductionPage'>
        <div className="connecting_buttons_container">
        <img className='logo2' src={donut} alt="Donut Logo" />
      <button className='join_room_button' onClick={pushToJoinRoomPage}>
        Join Meeting
       
      </button> 
      <br/>

      <button className='create_room_button'    onClick={pushToJoinRoomPageAsHost}
>
        Create Room
        
        </button> 

    </div>

    <Lottie style={{width: "100%", height: "100vh",}} animationData={landingPAge}/>
    </div>
  )
}

export default IntroductionPage