export interface APIResponse<T> {
  status: number
  data: T | null
}

export interface APIResponseWithHeaders<T> {
  status: number
  headers: any
  data: T | null
}

export interface APIPagingResponse<T> {
  success: boolean
  msg: string | null
  total: number
  size: number
  page: number
  data: [T]
}

export interface AuthResponse {
  isSuccess: boolean
  status: number
  data: any | null
}

export interface CommonResponse {
  success: boolean
  errorCode: string
  msg: string
  data: object | []
}

export interface ContentMetadata {
  uuid: string
  filename: string
  mimeType: string
  title: string
  activated: boolean
  module: string
  accessScope: 'public' | 'private'
  tags: string[]
  children: ChildContentMetadata[]
}

export interface ChildContentMetadata {
  uuid: string
  mimeType: string
  activated: boolean
  module: string
}
