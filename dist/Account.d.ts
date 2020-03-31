import Model from './Model';
import Transfer from './Transfer';
import Api from './utils/Api';
import type { IAccount, IProfileField } from './Account/IAccount';
import type { ICreateTransferParams } from './Transfer/ITransfer';
export default class Account extends Model<Account> implements IAccount {
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
    static fetch(id: string, api: Api): Promise<Account>;
    createTransfer(params: ICreateTransferParams): Promise<Transfer>;
    getTransfers(): Promise<Array<Transfer>>;
}
//# sourceMappingURL=Account.d.ts.map