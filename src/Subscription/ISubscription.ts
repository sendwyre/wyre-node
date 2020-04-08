export interface ISubscription {
  id: string
  subscribed: string
  notifyTarget: string
  createdAt: number
  // TODO: unknown type
  failure: any
  failCount: number
}

export interface ISubscriptionsResponse {
  data: Array<ISubscription>
  recordsTotal: number
  position: number
}