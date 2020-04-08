export default class Data {
  public readonly initValues: object
  public readonly updatedValues: object

  constructor(data: object) {
    this.initValues = data
    this.updatedValues = data
  }

  public get isChanged(): boolean {
    const initValues = JSON.stringify(this.initValues)
    const updatedValues = JSON.stringify(this.updatedValues)
    return initValues !== updatedValues
  }

  public set(key: PropertyKey | object, value?: any): void {
    if (typeof key === 'object') {
      for (const [ k, v ] of Object.entries(key)) {
        this.updatedValues[k] = v
      }
    } else {
      this.updatedValues[key] = value
    }
  }

  public get<T>(key: PropertyKey): T {
    return this.updatedValues[key]
  }
}