import Model from './Model';
import API from './utils/API';
import type { IStatusHistory, ITransferData, ITransferFees } from './Transfer/ITransferData';
import type { CreateTransferParams } from './Transfer/ICreateTransferParams';
export default class Transfer extends Model<Transfer> implements ITransferData {
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
    statusHistories: Array<IStatusHistory>;
    totalFees: number;
    static verifyCreateParams(params: CreateTransferParams): void;
    static create(params: CreateTransferParams, api?: API): Promise<Transfer>;
    confirm(): Promise<void>;
}
//# sourceMappingURL=Transfer.d.ts.map