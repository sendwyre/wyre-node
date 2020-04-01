export interface IPaymentMethod {
  id: string
  owner: string
  createdAt: number
  name: string
  defaultCurrency: string
  status: string | null
  statusMessage: string
  // TODO: unknown type
  waitingPrompts: Array<any>
  linkType: string
  beneficiaryType: string
  supportsDeposit: boolean
  nameOnMethod: string | null
  last4Digits: string
  // TODO: unknown type
  brand: null
  expirationDisplay: string
  countryCode: string
  nickname: string | null
  rejectionMessage: string | null
  disabled: boolean
  supportsPayment: boolean
  chargeableCurrencies: Array<string>,
  depositableCurrencies: Array<string>,
  srn: string

  // TODO: unknown types
  chargeFeeSchedule: null
  depositFeeSchedule: null
  minCharge: null
  maxCharge: null
  minDeposit: null
  maxDeposit: null
  documents: Array<any>
  blockchains: object
  liquidationBalances: object
}

export interface IPaymentMethodsResponse {
  data: Array<IPaymentMethod>
  recordsTotal: number
  position: number
}