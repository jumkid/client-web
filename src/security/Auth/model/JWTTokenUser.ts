export interface JWTTokenUser {
    exp?: number
    iat?: number
    jti?: string
    iss?: string
    aud?: string
    sub: string
    typ: 'Bearer'
    azp: string
    session_state: string
    acr: number
    realm_access: {
        roles: string[]
    }
    scope: string
    sid: string
    avatarId: string
    email_verified: boolean
    name: string
    preferred_username: string
    given_name: string
    family_name: string
    email: string
}