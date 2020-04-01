import Model from './Model';
import Transfer from './Transfer';
import PaymentMethod from './PaymentMethod';
import Api from './utils/Api';
import type { IAccount, IAccountResponse, ICreateAccountParams, IProfileField } from './Account/IAccount';
import type { ICreateTransferParams } from './Transfer/ITransfer';
export default class Account extends Model<Account> implements IAccount {
    id: string;
    status: 'OPEN' | 'PENDING' | 'APPROVED';
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
    paymentMethods: Array<PaymentMethod>;
    static create(api: Api, params: ICreateAccountParams): Promise<Account>;
    static fetch(api: Api, id: string): Promise<Account>;
    protected static postFetch(data: IAccountResponse, api: Api): Promise<Account>;
    save(): Promise<void>;
    fetchPaymentMethods(): Promise<Array<PaymentMethod>>;
    createTransfer(params: ICreateTransferParams): Promise<Transfer>;
    fetchTransfers(): Promise<Array<Transfer>>;
}
//# sourceMappingURL=Account.d.ts.map