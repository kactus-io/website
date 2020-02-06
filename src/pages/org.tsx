import React from 'react'
import { navigate } from 'gatsby'

import Layout from '../components/layout'
import SEO from '../components/seo'
import Header from '../components/header'
import Loader from '../components/loader'
import Banner from '../components/banner'
import LogoutButton from '../components/logout-button'

import { ChooseOrg, CreateOrUnlockOrg, ManageOrg } from '../components/org'

import useUser from '../hooks/useUser'

import './pricing.css'
import './org.css'

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
