import Model from './Model'
import Api from './utils/Api'
import type {
  ITransferStatusHistory,
  ITransfer,
  ITransferFees,
  ICreateTransferParams,
  ITransferHistoryResponse
} from './Transfer/ITransfer'
import PaymentMethod from './PaymentMethod'

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

  public static async create(api: Api, params: ICreateTransferParams): Promise<Transfer> {
    api.requireAuthed()

    this.verifyCreateParams(params)

    // NOTE: Need to attach the suffix `:ach` if source is a LOCAL_TRANSFER
    if (params.source instanceof PaymentMethod && params.source.linkType === 'LOCAL_TRANSFER') {
      params.source = `${params.source.srn}:ach`
    } else if (typeof params.source === 'string' && /paymentmethod:/.test(params.source)) {
      const paymentMethods = await PaymentMethod.fetchAll(api)
      const isACH = paymentMethods.some((method) => method.srn === params.source && method.linkType === 'LOCAL_TRANSFER')
      params.source += ':ach'
    }

    const data = await api.post<ITransfer>('transfers', params)

    return new Transfer(data, api)
  }

  public static async fetchAll(api: Api): Promise<Array<Transfer>> {
    api.requireAuthed()

    const transfers: Array<Transfer> = []
    let offset = 0
    let length = 20
    let hasMore = true
    do {
      const { data, recordsTotal, position} = await api.get<ITransferHistoryResponse>('transfers', { offset, length })
      const mappedTransfers = data.map((transferData) => new Transfer(transferData, api))
      transfers.push(...mappedTransfers)

      hasMore = Math.ceil(recordsTotal / length) - 1 !== position
      if (hasMore) offset += length
    } while (hasMore)

    return transfers
  }

  public static async fetch(api: Api, id: string): Promise<Transfer> {
    api.requireAuthed()

    const data = await api.get<ITransfer>(`transfers/${id}`)
    return new Transfer(data, api)
  }

  public async confirm() {
    const data = await this.api.post<ITransfer>(`transfers/${this.id}/confirm`)
    this.set(data)
  }
}
