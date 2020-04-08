import Api from './utils/Api'
import Data from './Model/Data'

export default abstract class Model<T, TData extends object> {
  public readonly api: Api
  public readonly data: Data

  constructor(data: TData, api: Api) {
    this.api = api
    this.data = new Data(data)

    const proxy = new Proxy(this, new ModelProxyHandler())

    return proxy
  }

  public set(data: object): void
  public set(key: PropertyKey, value: any): void
  public set(key: PropertyKey | object, value?: any): void {
    this.data.set(key, value)
  }

  public get<T>(key: PropertyKey): T {
    return this.data.get(key)
  }
}

class ModelProxyHandler<T extends Model<T, TData>, TData extends object> implements ProxyHandler<T> {
  public getOwnPropertyDescriptor(target: T, p: PropertyKey): PropertyDescriptor | undefined {
    return { enumerable: true, configurable: true }
  }

  public set(target: T, key: PropertyKey, value: any): boolean {
    key in target.data.updatedValues
      ? target.set(key, value)
      : target[key] = value

    return true
  }

  public get(target: T, key: PropertyKey): any {
    return key in target.data.updatedValues
      ? target.get(key)
      : target[key]
  }
}