export type Priority = {
  id?: number
  identifier: string
  label: string
}

type ActivityNotification = {
  id?: number
  notifyBefore: number
  notifyBeforeUnit: "hour" | "minute" | "second"
  expired: boolean
}

type ActivityEntityLink = {
  id?: number
  activityId?: number | null
  entityId: string
  entityName: string
}

type ActivityAssignee = {
  id?: number
  activityId: number | null
  assigneeName?: string | null
  assigneeEmail?: string | null
}

export interface Activity {
  id: number
  name: string
  description?: string | null
  status: string
  priority: Priority
  startDate: string
  endDate?: string | null
  autoNotify: boolean
  activityNotification?: ActivityNotification
  activityEntityLinks?: ActivityEntityLink[]
  activityAssignees?: ActivityAssignee[]
}