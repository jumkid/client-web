export interface APIResponse {
  status: number
  data: any | null
}

export interface APIPagingResponse {
  success: true | false
  msg: string | null
  total: number
  size: number
  page: number
  data: []
}

export interface AuthResponse {
  isSuccess: true | false
  status: number
  data: any | null
}
