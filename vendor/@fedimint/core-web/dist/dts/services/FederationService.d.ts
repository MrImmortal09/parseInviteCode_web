import type { JSONValue } from '../types';
import { WorkerClient } from '../worker';
export declare class FederationService {
    private client;
    constructor(client: WorkerClient);
    getConfig(): Promise<JSONValue>;
    getFederationId(): Promise<string>;
    getInviteCode(peer?: number): Promise<string | null>;
    listOperations(): Promise<JSONValue[]>;
}
//# sourceMappingURL=FederationService.d.ts.map