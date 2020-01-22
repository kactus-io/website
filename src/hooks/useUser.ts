import React from 'react'
import { navigate } from 'gatsby'

import { User, Org } from '../types'

function isAdmin(user: User, org: Org) {
  return org.admins.indexOf(user.githubId) !== -1
}

function parseUser(
  userString: string,
  token: string,
  query: { org?: string }
): User | undefined {
  const user = {
    ...JSON.parse(userString),
    token: token,
  } as User

  if (user.orgs && user.orgs.length) {
    const orgs = user.orgs

    let org: Org
    if (query.org) {
      org = orgs.find(o => o.id === query.org)
    } else {
      const adminOrgs = orgs.filter(isAdmin.bind(this, user))
      if (adminOrgs.length === 1) {
        org = adminOrgs[0]
      } else if (orgs.length === 1) {
        org = orgs[0]
      }
    }

    user.currentOrg = org
  }
  return user
}

export default function useUser(
  location: Location
): [
  User | null,
  boolean,
  (arg: User | null) => void,
  (user: string, token: string, query: { org?: string }) => void
] {
  const [user, _setUser] = React.useState<User | null>(null)
  const [loading, setLoading] = React.useState(true)

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

  const setUser = (user: User | null) => {
    if (user) {
      localStorage.user = JSON.stringify({
        ...user,
        token: undefined,
        currentOrg: undefined,
      })
      localStorage.token = user.token
    } else {
      delete localStorage.user
      delete localStorage.token
      navigate('/login')
    }
    _setUser(user)
  }

  const setRawUser = (user: string, token: string, query: { org?: string }) => {
    const parsed = parseUser(user, token, query)
    setUser(parsed)
  }

  React.useEffect(() => {
    if (localStorage.user && localStorage.token) {
      const user = parseUser(localStorage.user, localStorage.token, query)
      setUser(user)
      setLoading(false)
    } else {
      setLoading(false)
    }
  }, [])

  return [user, loading, setUser, setRawUser]
}
