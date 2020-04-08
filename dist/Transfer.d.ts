import Model from './Model';
import Api from './utils/Api';
import type { ITransferStatusHistory, ITransfer, ITransferFees, ICreateTransferParams } from './Transfer/ITransfer';
export default class Transfer extends Model<Transfer, ITransfer> implements ITransfer {
    blockchainTx: string;
    cancelledAt: number;
    completedAt: number;
    createdAt: number;
    customId: string;
    dest: string;
    destAmount: number;
    destCurrency: string;
    exchangeRate: number;
    expiresAt: number;
    failureReason: string;
    fees: ITransferFees;
    id: string;
    message: string;
    owner: string;
    pendingSubStatus: string;
    reversalReason: string;
    reversingSubStatus: string;
    source: string;
    sourceAmount: number;
    sourceCurrency: string;
    status: string;
    statusHistories: Array<ITransferStatusHistory>;
    totalFees: number;
    static verifyCreateParams(params: ICreateTransferParams): void;
    static create(api: Api, params: ICreateTransferParams): Promise<Transfer>;
    static fetchAll(api: Api): Promise<Array<Transfer>>;
    static fetch(api: Api, id: string): Promise<Transfer>;
    confirm(): Promise<void>;
}
//# sourceMappingURL=Transfer.d.ts.map