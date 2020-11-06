import React from 'react'
import ReactDom from 'react-dom'

import { Org, User } from '../../types'

import './settings.css'

const Modal = ({ children }: { children: React.ReactNode }) => {
  const domNode = React.useRef(document.createElement('div'))
  React.useEffect(() => {
    document.body.appendChild(domNode.current)

    return () => document.body.removeChild(domNode.current)
  }, [])

  return ReactDom.createPortal(children, domNode.current)
}

export const Settings = ({
  user,
  org,
  setBanner,
  setUser,
  onRedirectToStripeDashboard,
}: {
  user: User
  org: Org
  setBanner: (arg: { message: string; error?: boolean }) => void
  setUser: (arg: User) => void
  onRedirectToStripeDashboard: () => void
}) => {
  const buttonRef = React.useRef<HTMLButtonElement | null>(null)
  const [showingSettings, setShowingSettings] = React.useState(false)

  return (
    <>
      <button
        className="settings-trigger"
        ref={buttonRef}
        onClick={() => setShowingSettings(true)}
      >
        ⚙️
      </button>
      {showingSettings ? (
        <Modal>
          <div className="overlay" onClick={() => setShowingSettings(false)} />
          <div
            className="settings-wrapper"
            style={{
              top: buttonRef.current
                ? buttonRef.current.getClientRects()[0].bottom
                : 0,
              right: buttonRef.current
                ? document.body.clientWidth -
                  buttonRef.current.getClientRects()[0].right
                : 0,
            }}
          >
            <button className="cta" onClick={onRedirectToStripeDashboard}>
              Manage Subscription and Billing Details
            </button>
          </div>
        </Modal>
      ) : null}
    </>
  )
}
