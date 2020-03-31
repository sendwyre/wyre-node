import Authed from './Authed'
import Account from './Account'
import API from './utils/API'
import type { Config } from './Authed'

export default class WyreClient extends Authed {
  private readonly api: API

  constructor(config: Config) {
    super(config)

    this.api = new API(config)
  }

  public async fetchAccount(id?: string, masquerade = false): Promise<Account> {
    let api = this.api
    if (!!id && masquerade) {
      if (!this.isAuthed)
        throw new Error('Cannot masquerade with no authorization.')

      const newConfig = Object.assign({}, this.config)
      newConfig.auth.masqueradeTarget = id

      api = new API(newConfig)
    }

    return Account.fetch(id, api)
  }
}
