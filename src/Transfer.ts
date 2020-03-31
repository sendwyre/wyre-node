import Model from './Model'
import API from './utils/API'
import type { IStatusHistory, ITransferData, ITransferFees } from './Transfer/ITransferData'
import type { CreateTransferParams } from './Transfer/ICreateTransferParams'

export default class Transfer extends Model<Transfer> implements ITransferData {
  public blockchainTx: string
  public cancelledAt: number
  public completedAt: number
  public createdAt: number
  public customId: string
  public dest: string
  public destAmount: number
  public destCurrency: string
  public exchangeRate: number
  public expiresAt: number
  public failureReason: string
  public fees: ITransferFees
  public id: string
  public message: string
  public owner: string
  public pendingSubStatus: string
  public reversalReason: string
  public reversingSubStatus: string
  public source: string
  public sourceAmount: number
  public sourceCurrency: string
  public status: string
  public statusHistories: Array<IStatusHistory>
  public totalFees: number

  public static verifyCreateParams(params: CreateTransferParams) {
    if (params.sourceAmount && params.destinationAmount)
      throw new Error('Cannot have both source and destination amounts defined.')
  }

  public static async create(params: CreateTransferParams, api = new API()): Promise<Transfer> {
    this.verifyCreateParams(params)

    const data = await api.post<ITransferData>('transfers', params)

    return new Transfer(data, api)
  }

  public async confirm() {
    const data = await this.api.post<ITransferData>(`transfers/${this.id}/confirm`)
    this.set(data)
  }
}
