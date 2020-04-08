import Api from './utils/Api'
import Model from './Model'
import type { ISubscription, ISubscriptionsResponse } from './Subscription/ISubscription'

export default class Subscription extends Model<Subscription, ISubscription> implements ISubscription {
  public id: string
  public subscribed: string
  public notifyTarget: string
  public createdAt: number
  public failure: any
  public failCount: number

  public static async create(api: Api, srn: string, target: string): Promise<Subscription> {
    api.requireAuthed()

    const params = {
      subscribeTo: srn,
      notifyTarget: target
    }
    const data = await api.post<ISubscription>('subscriptions', params)
    return new Subscription(data, api)
  }

  public static async fetchAll(api: Api): Promise<Array<Subscription>> {
    api.requireAuthed()

    const subscriptions: Array<Subscription> = []
    let offset = 0
    let length = 20
    let hasMore = true
    do {
      const { data, recordsTotal, position} = await api.get<ISubscriptionsResponse>('subscriptions', { offset, length })
      const subs = data.map((subData) => new Subscription(subData, api))
      subscriptions.push(...subs)

      hasMore = Math.ceil(recordsTotal / length) - 1 !== position
      if (hasMore) offset += length
    } while (hasMore)

    return subscriptions
  }

  public async delete() {
    await this.api.delete(`subscriptions/${this.id}`)
  }
}