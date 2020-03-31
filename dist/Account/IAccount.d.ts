import type { IPaymentMethod } from '../PaymentMethod/IPaymentMethod';
export interface IAccount {
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
    paymentMethods: Array<IPaymentMethod>;
}
export interface IProfileField {
    fieldId: string;
    fieldType: string;
    value: string | object | null;
    note: string | null;
    status: string;
}
//# sourceMappingURL=IAccount.d.ts.map