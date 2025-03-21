import type { JSONValue } from '../types';
import { WorkerClient } from '../worker';
export declare class RecoveryService {
    private client;
    constructor(client: WorkerClient);
    hasPendingRecoveries(): Promise<boolean>;
    waitForAllRecoveries(): Promise<void>;
    subscribeToRecoveryProgress(onSuccess: (progress: {
        module_id: number;
        progress: JSONValue;
    }) => void, onError: (error: string) => void): import("../types").CancelFunction;
}
//# sourceMappingURL=RecoveryService.d.ts.map