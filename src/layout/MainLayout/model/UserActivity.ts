export default interface UserActivity {
  id: number,
  userId: string,
  entityId: string,
  entityModule: string,
  title: string,
  unread: boolean
}