import { WorkerClient } from '../worker';
import type { Duration, JSONObject, JSONValue, ReissueExternalNotesState, SpendNotesState } from '../types';
export declare class MintService {
    private client;
    constructor(client: WorkerClient);
    /** https://web.fedimint.org/core/FedimintWallet/MintService/redeemEcash */
    redeemEcash(notes: string): Promise<string>;
    reissueExternalNotes(oobNotes: string, extraMeta?: JSONObject): Promise<string>;
    subscribeReissueExternalNotes(operationId: string, onSuccess?: (state: ReissueExternalNotesState) => void, onError?: (error: string) => void): import("../types").CancelFunction;
    /** https://web.fedimint.org/core/FedimintWallet/MintService/spendNotes */
    spendNotes(amountMsats: number, tryCancelAfter?: number | Duration, // defaults to 1 day
    includeInvite?: boolean, extraMeta?: JSONValue): Promise<{
        notes: string;
        operation_id: string;
    }>;
    /** https://web.fedimint.org/core/FedimintWallet/MintService/parseEcash */
    parseNotes(oobNotes: string): Promise<number>;
    tryCancelSpendNotes(operationId: string): Promise<void>;
    subscribeSpendNotes(operationId: string, onSuccess?: (state: SpendNotesState) => void, onError?: (error: string) => void): import("../types").CancelFunction;
    awaitSpendOobRefund(operationId: string): Promise<JSONValue>;
}
//# sourceMappingURL=MintService.d.ts.map