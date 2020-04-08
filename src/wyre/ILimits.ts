export interface ILimits {
  ACCOUNT?: ILimitsTime
  ACH?: ILimitsTime
  DEBIT_CARD?: ILimitsTime
}

interface ILimitsTime {
  24?: ILimitValues
  168?: ILimitValues
  720?: ILimitValues
  1440?: ILimitValues
}

interface ILimitValues {
  in: number
  out: number
  availIn: number
  availOut: number
}