import React from 'react'
import { Link } from 'gatsby'

import Layout from '../components/layout'
import SEO from '../components/seo'
import Header from '../components/header'

const NotFoundPage = () => (
  <Layout>
    <SEO />
    <Header />
    <div className="container text-center hero">
      <h1>404 - That's desert in here</h1>
      <br />
      <Link className="cta primary" to="/">
        Go back somewhere safe
      </Link>
    </div>
  </Layout>
)

export default NotFoundPage
