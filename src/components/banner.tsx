import React from 'react'

import './banner.css'

const Banner = ({
  message,
  error,
  onClose,
}: {
  message: string
  error?: boolean
  onClose: () => void
}) => {
  if (error) {
    return (
      <div id="error-banner">
        <div id="error-content">{message || 'There was an error...'}</div>
        <div id="close-error-banner" onClick={onClose}>
          x
        </div>
      </div>
    )
  }

  return (
    <div id="success-banner">
      <div id="success-content">{message || 'Success!'}</div>
      <div id="close-success-banner" onClick={onClose}>
        x
      </div>
    </div>
  )
}

export default Banner
