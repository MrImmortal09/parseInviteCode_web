import { WorkerClient } from '../worker';
/**
 * Balance Service
 *
 * The Balance Service provides methods to interact with the balance of a Fedimint wallet.
 */
export declare class BalanceService {
    private client;
    constructor(client: WorkerClient);
    /** https://web.fedimint.org/core/FedimintWallet/BalanceService/getBalance */
    getBalance(): Promise<number>;
    /** https://web.fedimint.org/core/FedimintWallet/BalanceService/subscribeBalance */
    subscribeBalance(onSuccess?: (balanceMsats: number) => void, onError?: (error: string) => void): import("..").CancelFunction;
}
//# sourceMappingURL=BalanceService.d.ts.map