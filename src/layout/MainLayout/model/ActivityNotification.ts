export default interface ActivityNotification {
  id: number,
  userId: string,
  entityId: string,
  entityModule: string,
  title: string,
  unread: boolean
}