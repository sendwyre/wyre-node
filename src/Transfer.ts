import Model from './Model'
import Api from './utils/Api'
import type { ITransferStatusHistory, ITransfer, ITransferFees, ICreateTransferParams } from './Transfer/ITransfer'

export default class Transfer extends Model<Transfer, ITransfer> implements ITransfer {
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
  public statusHistories: Array<ITransferStatusHistory>
  public totalFees: number

  public static verifyCreateParams(params: ICreateTransferParams) {
    if (params.sourceAmount && params.destinationAmount)
      throw new Error('Cannot have both source and destination amounts defined.')
  }

  public static async create(params: ICreateTransferParams, api: Api): Promise<Transfer> {
    api.requireAuthed()

    this.verifyCreateParams(params)

    const data = await api.post<ITransfer>('transfers', params)

    return new Transfer(data, api)
  }

  public async confirm() {
    const data = await this.api.post<ITransfer>(`transfers/${this.id}/confirm`)
    this.set(data)
  }
}
