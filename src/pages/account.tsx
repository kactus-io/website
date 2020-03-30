import React from 'react'
import { navigate } from 'gatsby'

import Layout from '../components/layout'
import SEO from '../components/seo'
import Header from '../components/header'
import Loader from '../components/loader'
import Banner from '../components/banner'
import { Checkout, CHECKOUT_TARGET } from '../components/org/checkout'

import useUser from '../hooks/useUser'

import { User } from '../types'

import './pricing.css'
import './org.css'

const API_ROOT = process.env.GATSBY_API_ROOT

const Unlock = ({
  user,
  setBanner,
  setUser,
}: {
  user: User
  setBanner: (arg: { message: string; error?: boolean }) => void
  setUser: (arg: User) => void
}) => {
  const [selected, setSelected] = React.useState<'premium' | 'enterprise'>(
    'enterprise'
  )
  const [duration, setDuration] = React.useState<'year' | 'month'>('month')

  return (
    <div className="centered-section">
      <h3>Or subscribe individually</h3>
      <div className="features">
        <div
          className={selected === 'premium' ? 'plan selected' : 'plan'}
          onClick={() => setSelected('premium')}
        >
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
        <div
          className={selected === 'enterprise' ? 'plan selected' : 'plan'}
          onClick={() => setSelected('enterprise')}
        >
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
              <strong>Support single sign-on and on-premises deployment</strong>
            </li>
            <li>
              <strong>
                Support any git server (BitBucket, Gitlab, self-hosted, etc.)
              </strong>
            </li>
          </ul>
        </div>
      </div>
      <div className="billing-duration-wrapper">
        <p>
          <label htmlFor="monthly-billing">
            <input
              type="radio"
              value="month"
              id="monthly-billing"
              name="duration-billing"
              checked={duration === 'month'}
              onChange={e =>
                setDuration(
                  e.currentTarget.value === 'month' ? 'month' : 'year'
                )
              }
            />
            Monthly billing
            <span className="billing-quote">
              {selected === 'enterprise' ? '$11.99 / month' : '$4.99 / month'}
            </span>
          </label>
        </p>
        <p>
          <label htmlFor="yearly-billing">
            <input
              type="radio"
              value="year"
              id="yearly-billing"
              name="duration-billing"
              checked={duration === 'year'}
              onChange={e =>
                setDuration(
                  e.currentTarget.value === 'month' ? 'month' : 'year'
                )
              }
            />
            Yearly billing
            <span id="yearly-billing-quote" className="billing-quote">
              {selected === 'enterprise'
                ? '$119.90 / year (2 months free)'
                : '$49.90 / year (2 months free)'}
            </span>
          </label>
        </p>
      </div>
      <Checkout
        setUser={setUser}
        setBanner={setBanner}
        primary
        enterprise={selected === 'enterprise'}
        duration={duration}
        user={user}
        ctaLabel={'Subscribe'}
        checkoutTarget={CHECKOUT_TARGET.USER}
      />
    </div>
  )
}

const Index = ({ location }: { location: Location }) => {
  const [user, loading, setUser] = useUser(location)
  const [banner, setBanner] = React.useState<{
    message: string
    error?: boolean
  } | null>(null)

  React.useEffect(() => {
    if (!user && !loading) {
      navigate('/login')
    }
  }, [loading])

  return (
    <Layout>
      <SEO />
      <Header />
      {loading ? (
        <Loader />
      ) : !user ? null : (
        <>
          <button
            className="cta logout"
            onClick={() => {
              localStorage.clear()
              setUser(null)
            }}
          >
            Logout
          </button>
          {(user.valid && !user.validFromOrg) ||
          (user.validEnterprise && !user.validEnterpriseFromOrg) ? (
            <div className="centered-section">
              <h2>
                You are currently subscribed to the{' '}
                {user.validEnterprise ? 'Enterprise' : 'Premium'} plan.
              </h2>
              <Checkout
                setUser={setUser}
                setBanner={setBanner}
                user={user}
                ctaLabel="Update Card details"
                update
                duration="don't care"
                enterprise={true}
                checkoutTarget={CHECKOUT_TARGET.USER}
              />

              <div>
                <br />
                <button
                  className="cta error"
                  onClick={() =>
                    fetch(`${API_ROOT}/unsubscribe`, {
                      body: JSON.stringify({
                        githubId: user.githubId,
                        token: user.token,
                      }),
                      mode: 'cors',
                      method: 'DELETE',
                    })
                      .then(res => {
                        if (!res.ok) {
                          return res.json().then(parsed => {
                            throw new Error(parsed.message)
                          })
                        }
                        return res.json()
                      })
                      .then(() => {
                        setUser({
                          ...user,
                          validEnterprise: false,
                          valid: false,
                        })
                      })
                      .catch(err =>
                        setBanner({ message: err.message, error: true })
                      )
                  }
                >
                  Unsubscribe
                </button>
              </div>
            </div>
          ) : null}
          {user.orgs && user.orgs.length ? (
            <div className="centered-section">
              <button className="cta" onClick={() => navigate('/org')}>
                Manage your organisations
              </button>
            </div>
          ) : (
            <div className="centered-section">
              <button className="cta" onClick={() => navigate('/org')}>
                Create an organisation
              </button>
            </div>
          )}
          {!user.valid && !user.validEnterprise ? (
            <Unlock setUser={setUser} setBanner={setBanner} user={user} />
          ) : null}
        </>
      )}

      {banner ? <Banner {...banner} onClose={() => setBanner(null)} /> : null}

      <hr />
      <script src="https://js.stripe.com/v3/"></script>
    </Layout>
  )
}

export default Index
