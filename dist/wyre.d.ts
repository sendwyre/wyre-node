import Account from './Account';
import type { IApiConfig } from './utils/API/IApiConfig';
import type { ICreateAccountParams } from './Account/IAccount';
export default class WyreClient {
    private readonly api;
    constructor(config: IApiConfig);
    createAccount(params: ICreateAccountParams): Promise<Account>;
    fetchAccount(id: string, masquerade?: boolean): Promise<Account>;
}
//# sourceMappingURL=wyre.d.ts.map