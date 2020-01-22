import React from 'react'

import Layout from './layout'
import SEO from './seo'
import Header from './header'

import './mdx-page.css'

export default (props: { children: React.ReactNode }) => {
  return (
    <Layout>
      <SEO />
      <Header current="help" />
      <div className="container hero" id="container">
        {props.children}
        <hr />
        <div
          style={{ textAlign: 'center', color: '#24292e', marginBottom: 20 }}
        >
          Noticed a typo? Though of any way to improved those docs? Please help
          us{' '}
          <a
            href="https://github.com/kactus-io/website"
            style={{ color: '#24292e' }}
            target="_blank"
          >
            here
          </a>{' '}
          <svg
            height="20"
            className="fill-gray"
            aria-label="love"
            viewBox="0 0 12 16"
            version="1.1"
            width="15"
            role="img"
            style={{ position: 'relative', top: 5 }}
          >
            <path
              fillRule="evenodd"
              d="M11.2 3c-.52-.63-1.25-.95-2.2-1-.97 0-1.69.42-2.2 1-.51.58-.78.92-.8 1-.02-.08-.28-.42-.8-1-.52-.58-1.17-1-2.2-1-.95.05-1.69.38-2.2 1-.52.61-.78 1.28-.8 2 0 .52.09 1.52.67 2.67C1.25 8.82 3.01 10.61 6 13c2.98-2.39 4.77-4.17 5.34-5.33C11.91 6.51 12 5.5 12 5c-.02-.72-.28-1.39-.8-2.02V3z"
            ></path>
          </svg>
        </div>
      </div>
    </Layout>
  )
}
