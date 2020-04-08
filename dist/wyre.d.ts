import Account from './Account';
import Api from './utils/Api';
import type { IApiConfig } from './utils/API/IApiConfig';
import type { ICreateAccountParams } from './Account/IAccount';
export default class WyreClient {
    readonly api: Api;
    constructor(config: IApiConfig);
    createAccount(params: ICreateAccountParams): Promise<Account>;
    fetchAccount(id: string, masquerade?: boolean): Promise<Account>;
    fetchRates(): Promise<{
        [symbolPair: string]: number;
    }>;
    fetchRates(as: 'DIVISOR'): Promise<{
        [symbolPair: string]: number;
    }>;
    fetchRates(as: 'MULTIPLIER'): Promise<{
        [symbolPair: string]: number;
    }>;
    fetchRates(as: 'PRICED'): Promise<{
        [symbolPair: string]: {
            [symbol: string]: number;
        };
    }>;
}
//# sourceMappingURL=wyre.d.ts.map