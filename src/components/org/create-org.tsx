import React from 'react'

import { Checkout } from './checkout'

import { Org, User } from '../../types'

export const CreateOrUnlockOrg = ({
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
