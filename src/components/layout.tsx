import React from 'react'

import Footer from './footer'
import './layout.css'

const Layout = ({ children }) => (
  <>
    <div>
      <main>{children}</main>
    </div>
    <Footer />
  </>
)

export default Layout
