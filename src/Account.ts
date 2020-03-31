import Model from './Model'
import Transfer from './Transfer'
import type { CreateTransferParams } from './Transfer/ICreateTransferParams'
import type { ITransferHistory } from './Transfer/ITransferData'
import type { IAccountData, IProfileField } from './Account/IAccountData'
import API from './utils/API'

export default class Account extends Model<Account> implements IAccountData {
  public id: string
  public status: string
  public type: string
  public country: string
  public createdAt: number
  public depositAddresses: { ETH: string; BTC: string }
  public totalBalances: { BTC: number; ETH: number }
  public availableBalances: { BTC: number; ETH: number }
  public profileFields: Array<IProfileField>

  public static async fetch(id?: string, api = new API()): Promise<Account> {
    let accountUrl = 'accounts'
    if (!!id)
      accountUrl += `/${id}`

    const data = await api.get(accountUrl)

    return new Account(data, api)
  }

  public async createTransfer(params: CreateTransferParams): Promise<Transfer> {
    const transfer = await Transfer.create(params, this.api)

    return transfer
  }

  public async getTransfers(): Promise<Array<Transfer>> {
    const { data } = await this.api.get<ITransferHistory>('transfers')
    return data.map((transferData) => new Transfer(transferData, this.api))
  }
}