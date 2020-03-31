import API from './utils/API'

export default class Model<T> {
  protected readonly api: API
  private data: object = {}

  constructor(data: object, api: API) {
    this.set(data)
    this.api = api

    const proxy = new Proxy<Model<T>>(this, {
      set(target: Model<T>, key: string | number | symbol, value: any): any {
        key in target.data
          ? target.data[key] = value
          : target[key] = value
      },
      get(target: Model<T>, key: string | number | symbol): any {
        return key in target.data
          ? target.data[key]
          : target[key]
      }
    })

    return proxy
  }

  protected set(data: object) {
    for (const [ key, value ] of Object.entries(data)) {
      this.data[key] = value
    }
  }
}