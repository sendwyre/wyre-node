import Api from './utils/Api'

export default abstract class Model<T> {
  public readonly api: Api
  public data: object = {}

  constructor(data: object, api: Api) {
    this.set(data)
    this.api = api

    const proxy = new Proxy(this, new ModelProxyHandler())

    return proxy
  }

  public set(data: object): void
  public set(key: PropertyKey, value: any): void
  public set(key: PropertyKey | object, value?: any): void {
    if (typeof key === 'object') {
      for (const [ k, v ] of Object.entries(key)) {
        this.data[k] = v
      }
    } else {
      this.data[key] = value
    }
  }
}

class ModelProxyHandler<T extends Model<T>> implements ProxyHandler<T> {
  public getOwnPropertyDescriptor(target: T, p: PropertyKey): PropertyDescriptor | undefined {
    return { enumerable: true, configurable: true }
  }

  public set(target: T, key: PropertyKey, value: any): boolean {
    key in target.data
      ? target.set(key, value)
      : target[key] = value

    return true
  }

  public get(target: T, key: PropertyKey): any {
    return key in target.data
      ? target.data[key]
      : target[key]
  }
}