import React from 'react'
import StripeCheckout from 'react-stripe-checkout'

import { Org, User } from '../../types'

const API_ROOT = process.env.GATSBY_API_ROOT
const STRIPE_PUBLIC_KEY = process.env.GATSBY_STRIPE_PUBLIC_KEY

export enum CHECKOUT_TARGET {
  USER,
  ORG,
}

export const Checkout = ({
  user,
  ctaLabel,
  panelLabel,
  org,
  enterprise,
  duration,
  update,
  primary,
  setBanner,
  setUser,
  checkoutTarget,
}: {
  user: User
  ctaLabel: string
  panelLabel?: string
  org?: Org
  enterprise: boolean
  duration: string
  update?: boolean
  primary?: boolean
  setBanner: (arg: { message: string; error?: boolean }) => void
  setUser: (arg: User) => void
  checkoutTarget?: CHECKOUT_TARGET
}) => {
  const coupon =
    typeof window !== 'undefined'
      ? decodeURIComponent(
          (window.location.search.split('coupon=')[1] || '').split('&')[0]
        ) || undefined
      : undefined
  return (
    <StripeCheckout
      stripeKey={STRIPE_PUBLIC_KEY}
      locale="auto"
      name="Kactus"
      zipCode
      panelLabel={panelLabel || ctaLabel || 'Create'}
      billingAddress
      token={async (token, args?: any) => {
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

        try {
          if (update) {
            const res = await fetch(
              `${API_ROOT}/${
                checkoutTarget === CHECKOUT_TARGET.USER ? 'user' : 'orgs'
              }/update-card-details`,
              {
                body: JSON.stringify(body),
                mode: 'cors',
                method: 'PUT',
              }
            )

            if (!res.ok) {
              const parsed = await res.json()
              throw new Error(parsed.message)
            }

            setBanner({ message: 'Card details updated!' })
          } else {
            const res = await fetch(
              `${API_ROOT}/${
                checkoutTarget === CHECKOUT_TARGET.USER ? 'user' : 'orgs'
              }/unlock`,
              {
                body: JSON.stringify(body),
                mode: 'cors',
                method: 'POST',
              }
            )

            const data = await res.json()
            if (!res.ok) {
              throw new Error(data.message)
            }

            let newOrg = data.org
            if (!data.ok && data.paymentIntentSecret) {
              const stripe = Stripe(STRIPE_PUBLIC_KEY)
              const stripeRes = await stripe.handleCardPayment(
                data.paymentIntentSecret
              )

              if (stripeRes.error) {
                throw stripeRes.error
              }

              newOrg.validEnterprise = body.enterprise
              newOrg.valid = !body.enterprise
            }

            if (checkoutTarget === CHECKOUT_TARGET.USER) {
              setUser({
                ...user,
                validEnterprise: enterprise,
                valid: !enterprise,
              })
            } else {
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
            }
          }
        } catch (err) {
          setBanner({ message: err.message, error: true })
        }
      }}
    >
      <button className={primary ? 'cta primary' : 'cta'}>{ctaLabel}</button>
    </StripeCheckout>
  )
}
