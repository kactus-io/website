import React from 'react'
import { navigate } from 'gatsby'

import Layout from '../components/layout'
import SEO from '../components/seo'
import Header from '../components/header'
import Loader from '../components/loader'
import Banner from '../components/banner'

import useUser from '../hooks/useUser'

import './pricing.css'
import './org.css'

const API_ROOT = process.env.GATSBY_API_ROOT
const GITHUB_CLIENT = process.env.GATSBY_GITHUB_CLIENT

const SignUp = ({ fromOrg }: { fromOrg: boolean }) => {
  return (
    <div className="centered-section">
      {fromOrg ? (
        <div>
          <p>
            An organization allows you to centralize the licenses for the
            designers in your team.
          </p>
          <p>
            Both you and the people in your team need to be Kactus users before
            creating an organization.
          </p>
        </div>
      ) : null}
      <a
        className="cta primary"
        href={`https://github.com/login/oauth/authorize?client_id=${GITHUB_CLIENT}`}
      >
        Sign up with Github
      </a>
      <a
        className="cta"
        href="https://github.com/kactus-io/kactus/releases/latest/download/Kactus-macos.zip"
      >
        Download Kactus for macOS
      </a>
    </div>
  )
}

const Login = ({ location }: { location: Location }) => {
  const [user, loading, setUser, setRawUser] = useUser(location)
  const [loadingAuthentication, setLoadingAuthentication] = React.useState(
    false
  )
  const [banner, setBanner] = React.useState<{
    message: string
    error?: boolean
  } | null>(null)

  const query = location.search
    ? location.search
        .slice(1)
        .split('&')
        .reduce<{ org?: string; code?: string; state?: string }>((prev, x) => {
          const parts = x.split('=')
          prev[parts[0]] = decodeURIComponent(parts[1])
          return prev
        }, {})
    : {}

  React.useEffect(() => {
    if (user) {
      const signupFromOrg = localStorage.signupFromOrg
      delete localStorage.signupFromOrg
      navigate(signupFromOrg ? '/org' : '/account')
      return
    }
    if (!loading && !user && query.code) {
      setLoadingAuthentication(true)
      fetch(
        `${API_ROOT}/oauth/github/authenticate?code=${query.code}&state=${query.state}`
      )
        .then(res => {
          if (!res.ok) {
            return res.json().then(function(parsed) {
              throw new Error(parsed.message)
            })
          }
          return res.json()
        })
        .then(res => {
          setRawUser(JSON.stringify(res.user), res.token, query)
          setLoadingAuthentication(false)
        })
        .catch(err => {
          setBanner({ message: err.message, error: true })
          setLoadingAuthentication(false)
        })
    }
  }, [loading, loadingAuthentication])

  return (
    <Layout>
      <SEO />
      <Header />
      {loading || loadingAuthentication ? (
        <Loader />
      ) : !user ? (
        <SignUp fromOrg={localStorage.signupFromOrg} />
      ) : null}

      {banner ? <Banner {...banner} onClose={() => setBanner(null)} /> : null}

      <hr />
    </Layout>
  )
}

export default Login
