export interface CreateTransferParams {
  source: string
  sourceCurrency: string
  sourceAmount?: string
  destination: string
  destinationCurrency: string
  destinationAmount?: string
  message?: string
  notifyUrl?: string
  autoConfirm?: boolean
  customId?: string
  amountIncludesFees?: boolean
  preview?: boolean
  muteMessages?: boolean
}
