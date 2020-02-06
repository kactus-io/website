import React from 'react'
import ReactDom from 'react-dom'

import { Checkout } from './checkout'

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
  onUnsubscribe,
}: {
  user: User
  org: Org
  setBanner: (arg: { message: string; error?: boolean }) => void
  setUser: (arg: User) => void
  onUnsubscribe: () => void
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
            <Checkout
              setUser={setUser}
              setBanner={setBanner}
              user={user}
              org={org}
              ctaLabel="Update Card details"
              update
              duration="don't care"
              enterprise={true}
            />
            <button className="cta error" onClick={onUnsubscribe}>
              Cancel Subscription
            </button>
          </div>
        </Modal>
      ) : null}
    </>
  )
}
