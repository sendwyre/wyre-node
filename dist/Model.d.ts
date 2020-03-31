import Api from './utils/Api';
export default abstract class Model<T> {
    readonly api: Api;
    data: object;
    constructor(data: object, api: Api);
    set(data: object): void;
    set(key: PropertyKey, value: any): void;
}
//# sourceMappingURL=Model.d.ts.map