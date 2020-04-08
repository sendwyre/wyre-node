import Api from './utils/Api';
import Data from './Model/Data';
export default abstract class Model<T, TData extends object> {
    readonly api: Api;
    readonly data: Data;
    constructor(data: TData, api: Api);
    set(data: object): void;
    set(key: PropertyKey, value: any): void;
    get<T>(key: PropertyKey): T;
}
//# sourceMappingURL=Model.d.ts.map