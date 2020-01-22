import React from 'react'
import styled from '@emotion/styled'

const Footer = () => (
  <footer className="container">
    <svg
      height="20"
      className="fill-gray"
      aria-label="code"
      viewBox="0 0 14 16"
      width="17"
      role="img"
    >
      <path
        fillRule="evenodd"
        d="M9.5 3L8 4.5 11.5 8 8 11.5 9.5 13 14 8 9.5 3zm-5 0L0 8l4.5 5L6 11.5 2.5 8 6 4.5 4.5 3z"
      ></path>
    </svg>{' '}
    with{' '}
    <svg
      height="20"
      className="fill-gray"
      aria-label="love"
      viewBox="0 0 12 16"
      version="1.1"
      width="15"
      role="img"
    >
      <path
        fillRule="evenodd"
        d="M11.2 3c-.52-.63-1.25-.95-2.2-1-.97 0-1.69.42-2.2 1-.51.58-.78.92-.8 1-.02-.08-.28-.42-.8-1-.52-.58-1.17-1-2.2-1-.95.05-1.69.38-2.2 1-.52.61-.78 1.28-.8 2 0 .52.09 1.52.67 2.67C1.25 8.82 3.01 10.61 6 13c2.98-2.39 4.77-4.17 5.34-5.33C11.91 6.51 12 5.5 12 5c-.02-.72-.28-1.39-.8-2.02V3z"
      ></path>
    </svg>{' '}
    by <a href="https://github.com/mathieudutour">Mathieu</a> and{' '}
    <a href="https://github.com/kactus-io/kactus/graphs/contributors">
      friends
    </a>
  </footer>
)

export default Footer
