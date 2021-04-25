import React from 'react'

import { Checkout } from './checkout'
import { CreateOrUnlockOrg } from './create-org'
import { Settings } from './settings'

import { Org, User } from '../../types'

const API_ROOT = process.env.GATSBY_API_ROOT

export function isAdmin(user: User, org: Org) {
  return org.admins.indexOf(user.githubId) !== -1
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

export const ManageOrg = ({
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

  const redirectToStripeDashboard = React.useCallback(() => {
    fetch(`${API_ROOT}/accessStripeDashboard`, {
      body: JSON.stringify({
        githubId: user.githubId,
        githubToken: user.token,
        orgId: org.id,
      }),
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
      .then(({ url }) => {
        window.location.href = url
      })
      .catch(err => setBanner({ message: err.message, error: true }))
  }, [user, org])

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
          {/* don't show settings for prepaid orgs */}
          {typeof org.prepaidFor !== 'undefined' ? null : (
            <Settings
              setUser={setUser}
              setBanner={setBanner}
              user={user}
              org={org}
              onRedirectToStripeDashboard={redirectToStripeDashboard}
            />
          )}

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
