import Model from './Model'
import type { IPaymentMethod, IPaymentMethodsResponse } from './PaymentMethod/IPaymentMethod'
import Api from './utils/Api'

export default class PaymentMethod extends Model<PaymentMethod> implements IPaymentMethod {
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
  public linkType: string
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
  public status: string | null
  public statusMessage: string
  public supportsDeposit: boolean
  public supportsPayment: boolean
  public waitingPrompts: Array<any>

  public static async fetchAll(api: Api): Promise<Array<PaymentMethod>> {
    api.requireAuthed()

    const { data: paymentMethods } = await api.get<IPaymentMethodsResponse>('paymentMethods', null, {
      version: '2'
    })
    return paymentMethods.map((paymentData) => new PaymentMethod(paymentData, api))
  }
}