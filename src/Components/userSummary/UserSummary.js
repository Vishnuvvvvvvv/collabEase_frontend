import React from 'react'
import { connect } from "react-redux";
import Summary from '../Summary';
import LoadingContent from '../LoadingContent';
import loadImageIcon from "../../assets/Infinity@1.25x-1.0s-200px-200px.svg"
function UserSummary({summary}) {

    
  return (
    <div className='RightSection'>
    <div className="right-section-heading">
      <h2 className='right-sec-inner-head'>Summary</h2>
      </div>

      <div className="right-section-body">
      <div className="summary-content">
      <p className='transcription'> {summary ?<Summary btn={false}summary={summary}/>: <LoadingContent content= 'Summary Not Generated...' image={loadImageIcon} />  } </p>
     </div>
        </div>
    </div>
  )
}




const mapStoreStateToProps = (state) => {
    return {
      ...state,
    };
  };
  
  export default connect(mapStoreStateToProps)(UserSummary);
  