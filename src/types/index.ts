export type Org = {
  id: string
  admins: string[]
  members: string[]
  valid: boolean
  validEnterprise: boolean
  stripeId?: string
  prepaidFor?: number
}

export type User = {
  githubId: string
  validEnterprise: boolean
  validEnterpriseFromOrg: boolean
  validEnterpriseFromOrgAdmin: boolean
  valid: boolean
  validFromOrg: boolean
  validFromOrgAdmin: boolean
  token: string
  orgs?: Org[]
  currentOrg?: Org
}
