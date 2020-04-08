import Api from './utils/Api';
import Model from './Model';
import type { ISubscription } from './Subscription/ISubscription';
export default class Subscription extends Model<Subscription, ISubscription> implements ISubscription {
    id: string;
    subscribed: string;
    notifyTarget: string;
    createdAt: number;
    failure: any;
    failCount: number;
    static create(api: Api, srn: string, target: string): Promise<Subscription>;
    static fetchAll(api: Api): Promise<Array<Subscription>>;
    delete(): Promise<void>;
}
//# sourceMappingURL=Subscription.d.ts.map