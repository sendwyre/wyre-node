import Model from './Model'
import Api from './utils/Api'
import type {
  IPaymentMethod,
  IPaymentMethodACHCreateParams, IPaymentMethodAttachBlockchainOptions, IPaymentMethodBlockchain,
  IPaymentMethodsResponse, IPaymentMethodWireCreateParams
} from './PaymentMethod/IPaymentMethod'

export default class PaymentMethod extends Model<PaymentMethod, IPaymentMethod> implements IPaymentMethod {
  public beneficiaryType: string
  public blockchains: object
  public brand: null
  public chargeFeeSchedule: null
  public chargeableCurrencies: Array<string>
  public countryCode: string
  public createdAt: number
  public defaultCurrency: string
  public depositFeeSchedule: null
  public depositableCurrencies: Array<string>
  public disabled: boolean
  public documents: Array<any>
  public expirationDisplay: string
  public id: string
  public last4Digits: string
  public linkType: 'INTERNATIONAL_TRANSFER' | 'LOCAL_TRANSFER'
  public liquidationBalances: object
  public maxCharge: null
  public maxDeposit: null
  public minCharge: null
  public minDeposit: null
  public name: string
  public nameOnMethod: string | null
  public nickname: string | null
  public owner: string
  public rejectionMessage: string | null
  public srn: string
  public status: 'PENDING' | 'AWAITING_FOLLOWUP' | 'ACTIVE' | 'REJECTED'
  public statusMessage: string
  public supportsDeposit: boolean
  public supportsPayment: boolean
  public waitingPrompts: Array<any>

  public static async createACH(api: Api, publicToken: string): Promise<PaymentMethod> {
    api.requireAuthed()

    const params: IPaymentMethodACHCreateParams = {
      publicToken,
      paymentMethodType: 'LOCAL_TRANSFER',
      country: 'US'
    }
    const data = await api.post<IPaymentMethod>('paymentMethods', params, { version: '2' })
    return new PaymentMethod(data, api)
  }

  public static async createWire(api: Api, params: IPaymentMethodWireCreateParams): Promise<PaymentMethod> {
    api.requireAuthed()

    params.paymentMethodType = 'INTERNATIONAL_TRANSFER'
    params.paymentType = 'LOCAL_BANK_WIRE'

    const data = await api.post<IPaymentMethod>('paymentMethods', params, { version: '2' })
    return new PaymentMethod(data, api)
  }

  public static async fetchAll(api: Api): Promise<Array<PaymentMethod>> {
    api.requireAuthed()

    const paymentMethods: Array<PaymentMethod> = []
    let offset = 0
    let length = 20
    let hasMore = true
    do {
      const { data, recordsTotal, position} = await api.get<IPaymentMethodsResponse>('paymentMethods', { offset, length }, { version: '2' })
      const methods = data.map((paymentData) => new PaymentMethod(paymentData, api))
      paymentMethods.push(...methods)

      hasMore = Math.ceil(recordsTotal / length) - 1 !== position
      if (hasMore) offset += length
    } while (hasMore)

    return paymentMethods
  }

  public static async fetch(api: Api, id: string): Promise<PaymentMethod> {
    api.requireAuthed()

    const data = await api.get<IPaymentMethod>(`paymentMethod/${id}`, null, { version: '2' })
    return new PaymentMethod(data, api)
  }

  public async attachBlockchain(blockchain: IPaymentMethodBlockchain | Array<IPaymentMethodBlockchain>, opts: IPaymentMethodAttachBlockchainOptions = {}) {
    const params = {
      ...opts,
      blockchain: Array.isArray(blockchain) ? blockchain.join(',') : blockchain
    }
    const data = await this.api.get<IPaymentMethod>(`paymentMethod/${this.id}/attach`, params, { version: '2' })
    this.set(data)
  }

  public async delete() {
    await this.api.delete(`paymentMethod/${this.id}`, null, { version: '2' })
  }
}