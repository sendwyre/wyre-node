import Model from './Model';
import type { IPaymentMethod } from './PaymentMethod/IPaymentMethod';
import Api from './utils/Api';
export default class PaymentMethod extends Model<PaymentMethod> implements IPaymentMethod {
    beneficiaryType: string;
    blockchains: object;
    brand: null;
    chargeFeeSchedule: null;
    chargeableCurrencies: Array<string>;
    countryCode: string;
    createdAt: number;
    defaultCurrency: string;
    depositFeeSchedule: null;
    depositableCurrencies: Array<string>;
    disabled: boolean;
    documents: Array<any>;
    expirationDisplay: string;
    id: string;
    last4Digits: string;
    linkType: string;
    liquidationBalances: object;
    maxCharge: null;
    maxDeposit: null;
    minCharge: null;
    minDeposit: null;
    name: string;
    nameOnMethod: string | null;
    nickname: string | null;
    owner: string;
    rejectionMessage: string | null;
    srn: string;
    status: string | null;
    statusMessage: string;
    supportsDeposit: boolean;
    supportsPayment: boolean;
    waitingPrompts: Array<any>;
    static fetchAll(api: Api): Promise<Array<PaymentMethod>>;
}
//# sourceMappingURL=PaymentMethod.d.ts.map