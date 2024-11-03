import React from 'react'

function LoadingContent({content , image ,lottieC}) {
  return (<>

  { image==""? <div className='loading-image' >{ lottieC }</div>:  <img className='loading-image' src={image} alt="" />}
    <p className='loading-text'>{ content}</p>
   
    </>)
}

export default LoadingContent