import PaymentMethod from '../PaymentMethod';
export interface ITransfer {
    id: string;
    sourceAmount: number;
    sourceCurrency: string;
    destAmount: number;
    destCurrency: string;
    status: string;
    message: string;
    customId: string;
    exchangeRate: number;
    createdAt: number;
    fees: ITransferFees;
    totalFees: number;
    completedAt: number;
    cancelledAt: number;
    failureReason: string;
    expiresAt: number;
    reversingSubStatus: string;
    reversalReason: string;
    pendingSubStatus: string;
    dest: string;
    blockchainTx: string;
    statusHistories: Array<ITransferStatusHistory>;
    owner: string;
    source: string;
}
export interface ITransferFees {
    [assetTicker: string]: number;
}
export interface ITransferStatusHistory {
    id: string;
    transferId: string;
    createdAt: number;
    type: string;
    statusOrder: number;
    statusDetail: string;
    state: string;
    failedState: boolean;
}
export interface ICreateTransferParams {
    source: string | PaymentMethod;
    sourceCurrency: string;
    sourceAmount?: string;
    destination: string | PaymentMethod;
    destinationCurrency: string;
    destinationAmount?: string;
    message?: string;
    notifyUrl?: string;
    autoConfirm?: boolean;
    customId?: string;
    amountIncludesFees?: boolean;
    preview?: boolean;
    muteMessages?: boolean;
}
export interface ITransferHistoryResponse {
    data: Array<ITransfer>;
    position: number;
    recordsTotal: number;
    recordsFiltered: number;
}
//# sourceMappingURL=ITransfer.d.ts.map