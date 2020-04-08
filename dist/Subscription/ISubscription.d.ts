export interface ISubscription {
    id: string;
    subscribed: string;
    notifyTarget: string;
    createdAt: number;
    failure: any;
    failCount: number;
}
export interface ISubscriptionsResponse {
    data: Array<ISubscription>;
    recordsTotal: number;
    position: number;
}
//# sourceMappingURL=ISubscription.d.ts.map