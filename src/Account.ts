import Model from './Model'
import Transfer from './Transfer'
import PaymentMethod from './PaymentMethod'
import Api from './utils/Api'
import type { IAccount, IProfileField } from './Account/IAccount'
import type { ICreateTransferParams, ITransferHistoryResponse } from './Transfer/ITransfer'

export default class Account extends Model<Account> implements IAccount {
  public id: string
  public status: string
  public type: string
  public country: string
  public createdAt: number
  public depositAddresses: { ETH: string; BTC: string }
  public totalBalances: { BTC: number; ETH: number }
  public availableBalances: { BTC: number; ETH: number }
  public profileFields: Array<IProfileField>
  public paymentMethods: Array<PaymentMethod>

  public static async fetch(id: string, api: Api): Promise<Account> {
    api.requireAuthed()

    const data = await api.get(`accounts/${id}`)
    const account = new Account(data, api)
    account.paymentMethods = await PaymentMethod.fetchAll(api)

    return account
  }

  public async createTransfer(params: ICreateTransferParams): Promise<Transfer> {
    const transfer = await Transfer.create(params, this.api)

    return transfer
  }

  public async getTransfers(): Promise<Array<Transfer>> {
    const { data } = await this.api.get<ITransferHistoryResponse>('transfers')
    return data.map((transferData) => new Transfer(transferData, this.api))
  }
}