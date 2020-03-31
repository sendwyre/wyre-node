import Model from './Model';
import Transfer from './Transfer';
import type { CreateTransferParams } from './Transfer/ICreateTransferParams';
import type { IAccountData, IProfileField } from './Account/IAccountData';
import API from './utils/API';
export default class Account extends Model<Account> implements IAccountData {
    id: string;
    status: string;
    type: string;
    country: string;
    createdAt: number;
    depositAddresses: {
        ETH: string;
        BTC: string;
    };
    totalBalances: {
        BTC: number;
        ETH: number;
    };
    availableBalances: {
        BTC: number;
        ETH: number;
    };
    profileFields: Array<IProfileField>;
    static fetch(id?: string, api?: API): Promise<Account>;
    createTransfer(params: CreateTransferParams): Promise<Transfer>;
    getTransfers(): Promise<Array<Transfer>>;
}
//# sourceMappingURL=Account.d.ts.map