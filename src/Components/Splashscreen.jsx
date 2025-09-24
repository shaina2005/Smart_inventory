import React from 'react'
import { useState } from 'react'
import splashscreenvideo from '../assets/StockWise.mp4'

function Splashscreen() {
  return (
     <div className="splash-screen">
      <video
        autoPlay
        muted
        loop
        className="splash-video"
      >
        <source src={splashscreenvideo} type="video/mp4" />
      </video>
    </div>
  )
}

export default Splashscreen

