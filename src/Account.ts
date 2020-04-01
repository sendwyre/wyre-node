import Model from './Model'
import Transfer from './Transfer'
import PaymentMethod from './PaymentMethod'
import Api from './utils/Api'
import type { IAccount, IAccountResponse, ICreateAccountParams, IProfileField } from './Account/IAccount'
import type { ICreateTransferParams, ITransferHistoryResponse } from './Transfer/ITransfer'

export default class Account extends Model<Account> implements IAccount {
  public id: string
  public status: 'OPEN' | 'PENDING' | 'APPROVED'
  public type: string
  public country: string
  public createdAt: number
  public depositAddresses: { ETH: string; BTC: string }
  public totalBalances: { BTC: number; ETH: number }
  public availableBalances: { BTC: number; ETH: number }
  public profileFields: Array<IProfileField>
  public paymentMethods: Array<PaymentMethod>

  public static async create(api: Api, params: ICreateAccountParams): Promise<Account> {
    api.requireAuthed()

    const data = await api.post<IAccountResponse>('accounts', params)
    if (params.subaccount)
      api = api.masqueradeAs(data.id)
    return this.postFetch(data, api)
  }

  public static async fetch(api: Api, id: string): Promise<Account> {
    api.requireAuthed()

    const data = await api.get<IAccountResponse>(`accounts/${id}`)
    return this.postFetch(data, api)
  }
  protected static async postFetch(data: IAccountResponse, api: Api): Promise<Account> {
    const account = new Account(data, api)
    await account.fetchPaymentMethods()
    return account
  }

  public async save(): Promise<void> {
    if (!this.data.isChanged) return

    await this.api.post(`accounts/${this.id}`, this.data.updatedValues)
  }

  public async fetchPaymentMethods(): Promise<Array<PaymentMethod>> {
    const paymentMethods = await PaymentMethod.fetchAll(this.api)
    this.paymentMethods = paymentMethods
    return paymentMethods
  }

  public async createTransfer(params: ICreateTransferParams): Promise<Transfer> {
    const transfer = await Transfer.create(params, this.api)

    return transfer
  }

  public async fetchTransfers(): Promise<Array<Transfer>> {
    const { data } = await this.api.get<ITransferHistoryResponse>('transfers')
    return data.map((transferData) => new Transfer(transferData, this.api))
  }
}