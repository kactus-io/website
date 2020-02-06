import React from 'react'
import StripeCheckout from 'react-stripe-checkout'

import { Org, User } from '../../types'

const API_ROOT = process.env.GATSBY_API_ROOT
const STRIPE_PUBLIC_KEY = process.env.GATSBY_STRIPE_PUBLIC_KEY

export const Checkout = ({
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
