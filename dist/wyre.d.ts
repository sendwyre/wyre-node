import Account from './Account';
import Api from './utils/Api';
import type { IApiConfig } from './utils/API/IApiConfig';
import type { ICreateAccountParams } from './Account/IAccount';
import type { IRates, IRatesPriced } from './wyre/IRates';
export default class WyreClient {
    readonly api: Api;
    constructor(config: IApiConfig);
    createAccount(params: ICreateAccountParams): Promise<Account>;
    fetchAccount(): Promise<Account>;
    fetchAccount(id: string, masquerade?: boolean): Promise<Account>;
    fetchRates(): Promise<IRates>;
    fetchRates(as: 'DIVISOR'): Promise<IRates>;
    fetchRates(as: 'MULTIPLIER'): Promise<IRates>;
    fetchRates(as: 'PRICED'): Promise<IRatesPriced>;
}
//# sourceMappingURL=wyre.d.ts.map