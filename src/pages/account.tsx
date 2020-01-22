import React from 'react'
import { navigate } from 'gatsby'
import StripeCheckout from 'react-stripe-checkout'

import Layout from '../components/layout'
import SEO from '../components/seo'
import Header from '../components/header'
import Loader from '../components/loader'
import Banner from '../components/banner'

import useUser from '../hooks/useUser'

import { User } from '../types'

import './pricing.css'
import './org.css'

const API_ROOT = process.env.GATSBY_API_ROOT
const STRIPE_PUBLIC_KEY = process.env.GATSBY_STRIPE_PUBLIC_KEY

const Checkout = ({
  user,
  ctaLabel,
  panelLabel,
  coupon,
  enterprise,
  duration,
  update,
  primary,
  setBanner,
  setUser,
}: {
  user: User
  ctaLabel: string
  panelLabel?: string
  coupon?: string
  enterprise: boolean
  duration: string
  update?: boolean
  primary?: boolean
  setBanner: (arg: { message: string; error?: boolean }) => void
  setUser: (arg: User) => void
}) => {
  return (
    <StripeCheckout
      stripeKey={STRIPE_PUBLIC_KEY}
      locale="auto"
      name="Kactus"
      zipCode
      panelLabel={panelLabel || ctaLabel || 'Subscribe'}
      billingAddress
      token={(token, args) => {
        const body: { [key: string]: any } = {
          token: token.id,
          email: token.email,
          githubId: user.githubId,
          githubToken: user.token,
          enterprise: enterprise,
          duration: duration,
          metadata: args,
        }
        if (coupon) {
          body.coupon = coupon
        }

        if (update) {
          fetch(`${API_ROOT}/user/update-card-details`, {
            body: JSON.stringify(body),
            mode: 'cors',
            method: 'PUT',
          })
            .then(res => {
              if (!res.ok) {
                return res.json().then(function(parsed) {
                  throw new Error(parsed.message)
                })
              }
            })
            .then(() => setBanner({ message: 'Card details updated!' }))
            .catch(err => setBanner({ message: err.message, error: true }))
        } else {
          fetch(`${API_ROOT}/user/unlock`, {
            body: JSON.stringify(body),
            mode: 'cors',
            method: 'POST',
          })
            .then(res => {
              if (!res.ok) {
                return res.json().then(parsed => {
                  throw new Error(parsed.message)
                })
              }
              return res.json()
            })
            .then(res => {
              if (!res.ok && res.paymentIntentSecret) {
                const stripe = Stripe(STRIPE_PUBLIC_KEY)
                return stripe
                  .handleCardPayment(res.paymentIntentSecret)
                  .then(stripeRes => {
                    if (stripeRes.error) {
                      throw stripeRes.error
                    }

                    res.org.validEnterprise = body.enterprise
                    res.org.valid = !body.enterprise

                    return res.org
                  })
              }
              return res.org
            })
            .then(() => {
              setUser({
                ...user,
                validEnterprise: enterprise,
                valid: !enterprise,
              })
            })
            .catch(err => setBanner({ message: err.message, error: true }))
        }
      }}
    >
      <button className={primary ? 'cta primary' : 'cta'}>{ctaLabel}</button>
    </StripeCheckout>
  )
}

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
