import Api from './utils/Api';
import Data from './Model/Data';
export default abstract class Model<T> {
    readonly api: Api;
    readonly data: Data;
    constructor(data: object, api: Api);
    set(data: object): void;
    set(key: PropertyKey, value: any): void;
}
//# sourceMappingURL=Model.d.ts.map