import Account from './Account'
import Api from './utils/Api'
import type { IApiConfig } from './utils/API/IApiConfig'
import type { ICreateAccountParams } from './Account/IAccount'
import type { IRates, IRatesPriced } from './wyre/IRates'

export default class WyreClient {
  public readonly api: Api

  constructor(config: IApiConfig) {
    this.api = new Api(config)
  }

  public async createAccount(params: ICreateAccountParams): Promise<Account> {
    return Account.create(this.api, params)
  }

  public async fetchAccount(id: string, masquerade = false): Promise<Account> {
    const api = masquerade ? this.api.masqueradeAs(id) : this.api
    return Account.fetch(api, id)
  }

  public async fetchRates(): Promise<IRates>
  public async fetchRates(as: 'DIVISOR'): Promise<IRates>
  public async fetchRates(as: 'MULTIPLIER'): Promise<IRates>
  public async fetchRates(as: 'PRICED'): Promise<IRatesPriced>
  public async fetchRates(as?: string): Promise<object> {
    return this.api.get('rates', { as })
  }
}
