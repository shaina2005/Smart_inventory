import React from 'react'
import splashscreenvideo from '../assets/StockWise.mp4'

function Splashscreen() {
  return (
    <div className="splash-screen">
      <video
        autoPlay
        muted
        loop
        playsInline
        className="splash-video"
      >
        <source src={splashscreenvideo} type="video/mp4" />
      </video>
    </div>
  )
}

export default Splashscreen
