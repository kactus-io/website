import React from 'react'
import { navigate } from 'gatsby'
import StripeCheckout from 'react-stripe-checkout'

import Layout from '../components/layout'
import SEO from '../components/seo'
import Header from '../components/header'
import Loader from '../components/loader'
import Banner from '../components/banner'
import LogoutButton from '../components/logout-button'

import useUser from '../hooks/useUser'

import { Org, User } from '../types'

import './pricing.css'
import './org.css'

const API_ROOT = process.env.GATSBY_API_ROOT
const STRIPE_PUBLIC_KEY = process.env.GATSBY_STRIPE_PUBLIC_KEY

const ChooseOrg = ({
  user,
  setUser,
}: {
  user: User
  setUser: (arg: User) => void
}) => {
  return (
    <div className="centered-section">
      <em>You are part of multiple organizations.</em>
      <ul>
        {user.orgs.map(x => (
          <li
            key={x.id}
            onClick={() => {
              setUser({
                ...user,
                currentOrg: x,
              })
            }}
          >
            {x.id} - {x.members.length} members
          </li>
        ))}
      </ul>
    </div>
  )
}

const Checkout = ({
  user,
  ctaLabel,
  panelLabel,
  org,
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
  org?: Org
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
      panelLabel={panelLabel || ctaLabel || 'Create'}
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
        if (org) {
          body.orgId = org.id
        }
        if (coupon) {
          body.coupon = coupon
        }

        if (update) {
          fetch(`${API_ROOT}/orgs/update-card-details`, {
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
          fetch(`${API_ROOT}/orgs/unlock`, {
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
            .then(newOrg => {
              setUser({
                ...user,
                validEnterprise: body.enterprise,
                valid: !body.enterprise,
                orgs: org
                  ? (user.orgs || []).map(org =>
                      org.id === newOrg.id ? newOrg : org
                    )
                  : (user.orgs || []).concat(newOrg),
                currentOrg: newOrg,
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

const CreateOrUnlockOrg = ({
  user,
  org,
  setBanner,
  setUser,
}: {
  user: User
  org?: Org
  setBanner: (arg: { message: string; error?: boolean }) => void
  setUser: (arg: User) => void
}) => {
  const [selected, setSelected] = React.useState<'premium' | 'enterprise'>(
    'enterprise'
  )
  const [duration, setDuration] = React.useState<'year' | 'month'>('month')

  return (
    <div id="create-org" className="centered-section">
      {!org ? (
        <div>
          <p>
            <em>You do not have any organization yet.</em>
          </p>
          <p>
            An organization allows you to centralize the licenses for the
            designers in your team.
          </p>
        </div>
      ) : null}
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
        ctaLabel={org ? 'Unlock Organization' : 'Create an Organization'}
        org={org}
      />
    </div>
  )
}

const Member = ({
  memberId,
  user,
  isAdmin,
  orgId,
  setBanner,
  setUser,
}: {
  memberId: string
  user: User
  isAdmin: boolean
  orgId: string
  setBanner: (arg: { message: string; error?: boolean }) => void
  setUser: (arg: User) => void
}) => {
  const [member, setMember] = React.useState<null | {
    login: string
    avatar_url: string
  }>(null)
  const [loading, setLoading] = React.useState(false)

  const canDeleteUser = isAdmin && user.githubId !== memberId

  const deleteUser = React.useCallback(() => {
    setLoading(true)
    const body = {
      memberId,
      githubId: user.githubId,
      githubToken: user.token,
      orgId,
    }
    fetch(`${API_ROOT}/orgs/member`, {
      body: JSON.stringify(body),
      mode: 'cors',
      method: 'DELETE',
    })
      .then(res => {
        if (!res.ok) {
          return res.json().then(function(parsed) {
            throw new Error(parsed.message)
          })
        }
      })
      .then(() => {
        setUser({
          ...user,
          orgs: (user.orgs || []).map(org => {
            if (org.id === orgId) {
              org.members = (org.members || []).filter(x => memberId !== x)
              return org
            }
            return org
          }),
          currentOrg: {
            ...user.currentOrg,
            members: (user.currentOrg.members || []).filter(
              x => memberId !== x
            ),
          },
        })
      })
      .catch(err => {
        setBanner({ message: err.message, error: true })
        setLoading(false)
      })
  }, [memberId])

  React.useEffect(() => {
    let isUnmounted = false
    fetch(`https://api.github.com/user/${memberId}`, {
      headers: {
        Authorization: 'Token ' + localStorage.token,
        Accept: 'application/vnd.github.v3+json',
      },
    })
      .then(res => {
        if (res.status !== 200) {
          return res.json().then(parsed => {
            throw new Error(parsed)
          })
        }
        return res.json()
      })
      .then(res => {
        if (!isUnmounted) setMember(res)
      })
      .catch(err => setBanner({ message: err.message, error: true }))
    return () => {
      isUnmounted = true
    }
  }, [memberId])

  return (
    <tr>
      <td>
        <div className="avatar">
          {member && !loading ? <img src={member.avatar_url} /> : null}
        </div>
      </td>
      <td>{member && !loading ? member.login : 'Loading...'}</td>
      <td>
        {member && !loading && canDeleteUser ? (
          <button className="remove-member cta" onClick={deleteUser}>
            Remove
          </button>
        ) : null}
      </td>
    </tr>
  )
}

const ManageOrg = ({
  user,
  org,
  setBanner,
  setUser,
}: {
  user: User
  org: Org
  setBanner: (arg: { message: string; error?: boolean }) => void
  setUser: (arg: User) => void
}) => {
  const [unlocking, setUnlocking] = React.useState(false)
  const [loading, setLoading] = React.useState(false)
  const [memberUsername, setMemberUsername] = React.useState('')

  const locked = !org.valid && !org.validEnterprise
  const isUserAdmin = isAdmin(user, org)

  const addMember = React.useCallback(() => {
    setLoading(true)
    const body = {
      memberUsername: memberUsername.trim().replace(/^@/g, ''),
      githubId: user.githubId,
      githubToken: user.token,
      orgId: org.id,
    }
    fetch(`${API_ROOT}/orgs/member`, {
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
        setUser({
          ...user,
          orgs: (user.orgs || []).map(x => {
            if (org.id === x.id) {
              x.members = (x.members || []).concat(res.memberId)
              return x
            }
            return x
          }),
          currentOrg: {
            ...user.currentOrg,
            members: (user.currentOrg.members || []).concat(res.memberId),
          },
        })
        setMemberUsername('')
      })
      .catch(err => {
        setBanner({ message: err.message, error: true })
        setLoading(false)
      })
  }, [memberUsername, user, org])

  if (unlocking) {
    return (
      <CreateOrUnlockOrg
        org={org}
        user={user}
        setBanner={setBanner}
        setUser={setUser}
      />
    )
  }

  return (
    <div id="manage-org" style={{ position: 'relative' }}>
      <h1>Manage your organization</h1>
      {locked ? (
        <div>
          <p>Looks like the subscription is not valid anymore.</p>
          <button className="cta primary" onClick={() => setUnlocking(true)}>
            Renew subscription
          </button>
        </div>
      ) : (
        <div>
          <Checkout
            setUser={setUser}
            setBanner={setBanner}
            user={user}
            org={org}
            ctaLabel="Update Card details"
            update
            duration="don't care"
            enterprise={true}
          />
          <fieldset>
            <label htmlFor="github-username">
              Add a member to your organization
            </label>
            <input
              type="text"
              id="github-username"
              placeholder="GitHub username"
              value={memberUsername}
              onChange={e => setMemberUsername(e.currentTarget.value)}
            />
            {loading ? (
              'Adding...'
            ) : (
              <button className="cta" id="onAddMember" onClick={addMember}>
                Add to organization
              </button>
            )}
          </fieldset>
        </div>
      )}

      <table>
        <tbody id="org-member">
          {org.members.map(memberId => (
            <Member
              setUser={setUser}
              setBanner={setBanner}
              key={memberId}
              memberId={memberId}
              orgId={org.id}
              user={user}
              isAdmin={isUserAdmin}
            />
          ))}
        </tbody>
      </table>
    </div>
  )
}

function isAdmin(user: User, org: Org) {
  return org.admins.indexOf(user.githubId) !== -1
}

const Index = ({ location }: { location: Location }) => {
  const [user, loading, setUser] = useUser(location)
  const [banner, setBanner] = React.useState<{
    message: string
    error?: boolean
  } | null>(null)

  React.useEffect(() => {
    if (!user && !loading) {
      localStorage.signupFromOrg = 'true'
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
          <LogoutButton setUser={setUser} />
          {user.currentOrg ? (
            <ManageOrg
              setUser={setUser}
              user={user}
              org={user.currentOrg}
              setBanner={setBanner}
            />
          ) : user.orgs && user.orgs.length ? (
            <ChooseOrg user={user} setUser={setUser} />
          ) : (
            <CreateOrUnlockOrg
              setUser={setUser}
              user={user}
              setBanner={setBanner}
            />
          )}
        </>
      )}

      {banner ? <Banner {...banner} onClose={() => setBanner(null)} /> : null}

      <hr />
      <script src="https://js.stripe.com/v3/"></script>
    </Layout>
  )
}

export default Index
