interface UserCredential {
  type: string
  value: string
}

export interface UserProfile {
  email: string
  emailVerified: boolean
  requiredActions?: string[]
  username: string
  firstName: string
  lastName: string
  enabled: boolean
  credentials: UserCredential[]
  password: string
  confirmPassword: string
  phone: string
}
