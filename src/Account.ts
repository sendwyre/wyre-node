import Model from './Model'
import Transfer from './Transfer'
import PaymentMethod from './PaymentMethod'
import Api from './utils/Api'
import type { IAccount, IAccountResponse, ICreateAccountParams, IProfileField } from './Account/IAccount'
import type { ICreateTransferParams } from './Transfer/ITransfer'
import type { ILimits } from './wyre/ILimits'

export default class Account extends Model<Account, IAccount> implements IAccount {
  public id: string
  public status: 'OPEN' | 'PENDING' | 'APPROVED'
  public type: 'INDIVIDUAL' | 'BUSINESS'
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
    const paymentMethods = await PaymentMethod.fetchAll(api)
    return new Account({ ...data, paymentMethods }, api)
  }

  public async save(): Promise<void> {
    if (!this.data.isChanged) return

    await this.api.post(`accounts/${this.id}`, this.data.updatedValues)
  }

  public async createTransfer(params: ICreateTransferParams): Promise<Transfer> {
    const transfer = await Transfer.create(this.api, params)

    return transfer
  }

  public async fetchTransfers(): Promise<Array<Transfer>> {
    return Transfer.fetchAll(this.api)
  }

  public async fetchLimits(): Promise<ILimits> {
    this.api.requireAuthed()

    return this.api.get('limits')
  }
}