import React from 'react'
import { Link } from 'gatsby'

const Header = ({
  current,
}: {
  current?: 'home' | 'pricing' | 'release-notes' | 'help'
}) => (
  <header className="container text-center">
    <Link to="/">
      <img
        src="https://avatars0.githubusercontent.com/u/22014617?v=3&u=89e1d1c468b5abb12e2c8a1233bb08f3d3222db9&s=96"
        alt="Kactus"
        width="96px"
        height="96px"
      />
    </Link>
    <ul className="nav">
      <li>
        <Link to="/" className={current === 'home' ? 'current' : ''}>
          Overview
        </Link>
      </li>
      <li>
        <Link to="/pricing/" className={current === 'pricing' ? 'current' : ''}>
          Pricing
        </Link>
      </li>
      <li>
        <Link
          to="/release-notes/"
          className={current === 'release-notes' ? 'current' : ''}
        >
          Release Notes
        </Link>
      </li>
      <li>
        <Link to="/help/" className={current === 'help' ? 'current' : ''}>
          Help
        </Link>
      </li>
    </ul>
  </header>
)

export default Header
