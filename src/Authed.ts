export interface Auth {
  secretKey: string
  apiKey: string
  masqueradeTarget?: string
}

export interface Config {
  auth?: Auth
  apiVersion?: string
  format?: string
  qs?: { [key: string]: string },
  options?: {
    headers?: { [key: string]: string }
  }
}

export default class Authed {
  protected readonly config: Config

  constructor(config?: Config) {
    const defaultConfig: Config = {
      qs: {},
      options: {
        headers: {}
      }
    }

    this.config = Object.assign({}, defaultConfig, config)
  }

  public get isAuthed(): boolean {
    return !!this.config.auth && !!this.config.auth.secretKey && !!this.config.auth.apiKey
  }
}