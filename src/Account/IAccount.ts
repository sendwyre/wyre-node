import type { IPaymentMethod } from '../PaymentMethod/IPaymentMethod'

export interface IAccount extends IAccountResponse {
  paymentMethods: Array<IPaymentMethod>
}
export interface IAccountResponse {
  id: string
  status: string
  type: string
  country: string
  createdAt: number
  depositAddresses: {
    ETH: string
    BTC: string
  }
  totalBalances: {
    BTC: number
    ETH: number
  }
  availableBalances: {
    BTC: number
    ETH: number
  }
  profileFields: Array<IProfileField>
}

export interface IProfileField {
  fieldId: IProfileFieldId
  fieldType: IProfileFieldType
  value: string | object | IProfileFieldValueAddress | Array<IProfileFieldValueDocument> | null
  note: string | null
  status: IProfileFieldStatus
}
type IProfileFieldId = 'individualCellphoneNumber' | 'individualEmail' | 'individualLegalName' | 'individualDateOfBirth' | 'individualSsn' | 'individualResidenceAddress' | 'individualGovernmentId' | 'individualSourceOfFunds'
type IProfileFieldType = 'CELLPHONE' | 'EMAIL' | 'STRING' | 'DATE' | 'ADDRESS' | 'DOCUMENT' | 'PAYMENT_METHOD'
type IProfileFieldValueAddress = {
  street1: string
  street2?: string
  city: string
  state: string
  postalCode: string
  country: string | 'US'
}
// TODO: unknown values
type IProfileFieldValueDocument = {

}
type IProfileFieldStatus = 'OPEN' | 'PENDING' | 'NULL'

export interface ICreateAccountParams {
  type: string
  country: string
  profileFields: Array<IProfileField>
  referrerAccountId?: string
  subaccount?: boolean
  disableEmail?: boolean
}
