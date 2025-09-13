import React from 'react'
import "../Settings.css";
function ToggleButton({isOn , onToggle}) {
  return (
    <div>
      <div className="toggle-container">
        <label className='switch'>
          <input type="checkbox" checked={isOn} onChange={onToggle}/>
        <span className='slider round'/>
        </label>
      </div>
    </div>
  )
}

export default ToggleButton
