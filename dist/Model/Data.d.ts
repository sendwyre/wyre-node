export default class Data {
    readonly initValues: object;
    readonly updatedValues: object;
    constructor(data: object);
    get isChanged(): boolean;
    set(key: PropertyKey | object, value?: any): void;
    get<T>(key: PropertyKey): T;
}
//# sourceMappingURL=Data.d.ts.map