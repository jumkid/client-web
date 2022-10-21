export interface APIResponse {
  status: number
  data: any | null
}

export interface AuthResponse {
  isSuccess: true | false
  data: any | null
}
