import React from 'react'

import './loader.css'

const Loader = () => {
  return (
    <div id="loading">
      <div className="spinner">
        <div className="double-bounce1"></div>
        <div className="double-bounce2"></div>
      </div>
    </div>
  )
}

export default Loader
