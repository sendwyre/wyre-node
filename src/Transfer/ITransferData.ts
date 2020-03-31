export interface ITransferHistory {
  data: Array<ITransferData>
  position: number
  recordsTotal: number
  recordsFiltered: number
}

export interface ITransferData {
  id: string
  sourceAmount: number
  sourceCurrency: string
  destAmount: number
  destCurrency: string
  status: string
  message: string
  customId: string
  exchangeRate: number
  createdAt: number
  fees: ITransferFees
  totalFees: number
  completedAt: number
  cancelledAt: number
  failureReason: string
  expiresAt: number
  reversingSubStatus: string
  reversalReason: string
  pendingSubStatus: string
  dest: string
  blockchainTx: string
  statusHistories: Array<IStatusHistory>
  owner: string
  source: string
}

export interface ITransferFees {
  [assetTicker: string]: number
}

export interface IStatusHistory {
  id: string
  transferId: string
  createdAt: number
  type: string
  statusOrder: number
  statusDetail: string
  state: string
  failedState: boolean
}
