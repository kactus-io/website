import React from 'react'

import { User } from '../../types'

export const ChooseOrg = ({
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
