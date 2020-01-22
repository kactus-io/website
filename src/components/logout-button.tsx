import React from 'react'
import { User } from '../types'

import './logout-button.css'

const LogoutButton = ({ setUser }: { setUser: (arg: User | null) => void }) => {
  return (
    <button className="cta logout" onClick={() => setUser(null)}>
      Logout
    </button>
  )
}

export default LogoutButton
