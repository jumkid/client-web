export interface ValidationErrors {
    username?: string | undefined
    email?: string | undefined
    password?: string | undefined
    confirmPassword?: string | undefined
    acceptedTerms?: boolean  | undefined
    hasUpdate?: boolean
    avatar?: string
}