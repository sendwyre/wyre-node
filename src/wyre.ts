import Account from './Account'
import Api from './utils/Api'
import type { IApiConfig } from './utils/API/IApiConfig'

export default class WyreClient {
  private readonly api: Api

  constructor(config: IApiConfig) {
    this.api = new Api(config)
  }

  public async fetchAccount(id: string, masquerade = false): Promise<Account> {
    let api = this.api
    if (masquerade) {
      if (!this.api.isAuthed)
        throw new Error('Cannot masquerade with no authorization.')

      const newConfig = Object.assign({}, this.api.config)
      newConfig.auth.masqueradeTarget = id

      api = new Api(newConfig)
    }

    return Account.fetch(id, api)
  }
}
