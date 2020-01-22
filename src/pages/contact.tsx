import React from 'react'

import Layout from '../components/layout'
import SEO from '../components/seo'
import Header from '../components/header'

import './contact.css'

const Contact = () => (
  <Layout>
    <SEO />
    <Header />
    <div className="container text-center hero">
      <h1>Contact</h1>
      <div>
        <ul>
          <li>
            If you found a bug or thought of a nice way to improve Kactus, head
            over GitHub, that's where we keep track of what is happening:{' '}
            <a href="https://github.com/kactus-io/kactus" target="_blank">
              https://github.com/kactus-io/kactus
            </a>
            . Check if someone already had the same bug/idea or open a new
            issue.
          </li>
          <li>
            If you found a vulnerability in the project, please write privately
            to{' '}
            <a href="mailto:mathieu@kactus.io" target="_blank">
              mathieu@kactus.io
            </a>
            . Thanks!
          </li>
          <li>
            If you just want to chat, my DM are open:{' '}
            <a href="https://twitter.com/mathieudutour" target="_blank">
              @mathieudutour
            </a>{' '}
            :)
          </li>
        </ul>
      </div>
    </div>
    <hr />
  </Layout>
)

export default Contact
