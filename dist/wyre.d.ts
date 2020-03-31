import Authed from './Authed';
import Account from './Account';
import type { Config } from './Authed';
export default class WyreClient extends Authed {
    private readonly api;
    constructor(config: Config);
    fetchAccount(id?: string, masquerade?: boolean): Promise<Account>;
}
//# sourceMappingURL=wyre.d.ts.map