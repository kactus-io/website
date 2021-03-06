import React from 'react'

import Layout from '../components/layout'
import SEO from '../components/seo'
import Header from '../components/header'

import './pricing.css'

const Pricing = () => (
  <Layout>
    <SEO />
    <Header current="pricing" />
    <div className="container text-center hero">
      <h1>Plans for all workflows</h1>
      <p>
        Kactus is free-to-use for public repositories and open source projects
        on GitHub. Upgrade to work together across unlimited private
        repositories.
      </p>
    </div>
    <div className="container text-center">
      <div className="features">
        <div className="plan">
          <h2>Basic</h2>
          <h3>Free</h3>
          <h4>forever</h4>
          <ul>
            <li>Unlimited public repositories</li>
            <li>
              No locked-in commitment: you can always generate the sketch files
              to switch back
            </li>
          </ul>
        </div>
        <div className="plan">
          <h2>Premium</h2>
          <h3>$4.99</h3>
          <h4>per user per month</h4>
          <ul>
            <li>Unlimited public repositories</li>
            <li>
              No locked-in commitment: you can always generate the sketch files
              to switch back
            </li>
            <li>
              <strong>Unlimited private repositories</strong>
            </li>
          </ul>
        </div>
        <div className="plan">
          <h2>Enterprise</h2>
          <h3>$11.99</h3>
          <h4>per user per month</h4>
          <ul>
            <li>Unlimited public repositories</li>
            <li>
              No locked-in commitment: you can always generate the sketch files
              to switch back
            </li>
            <li>
              <strong>Unlimited private repositories</strong>
            </li>
            <li>
              <strong>
                Support single sign-on and on-premises deployment (via Github
                Enterprise)
              </strong>
            </li>
            <li>
              <strong>
                Support any git server (BitBucket, Gitlab, self-hosted, etc.)
              </strong>
            </li>
          </ul>
        </div>
      </div>
      <hr />
      <div className="org">
        <h3>
          Need to buy licenses for multiple people in your team? Create an
          organisation to handle all of this in an simple way.
        </h3>
        <a className="cta primary" href="/org/">
          Create or access your organisation
        </a>
      </div>
    </div>
    <hr />
    <div className="container">
      <h2 className="text-center">Frequently Asked Questions</h2>
      <div className="question">
        <h3>
          Do I need a premium GitHub plan to use the Kactus premium plans?
        </h3>
        <p>
          No, GitHub recently made private repository free so you do not need a
          pro GitHub account for the premium Kactus plan. You can find more
          information
          <a href="https://github.com/pricing" target="_blank">
            here
          </a>
          .
        </p>
      </div>
      <div className="question">
        <h3>Why are you charging money for private use?</h3>
        <p>
          We are independent developers and we'd like to support ourselves and
          the project long term. Commercial support, additional features, bug
          fixes and feature priority are provided with the Premium/Enterprise
          license, as well as ensuring the project stays alive.
        </p>
      </div>
      <div className="question">
        <h3>How is this different than other version control systems?</h3>
        <p>
          Most version control systems for design don't let you work on the same
          file in parallel, or they force you to manually merge changes. Kactus
          reveals the underlying representation of your design and leverages a
          battle-tested system (git) to bring you true version control for your
          designs.
        </p>
      </div>
    </div>
    <hr />
    <div className="text-center">
      <a
        className="cta"
        href="https://github.com/kactus-io/kactus/releases/latest/download/Kactus-macos.zip"
        id="download-url"
      >
        Download Kactus now
      </a>
    </div>
    <hr />
  </Layout>
)

export default Pricing
