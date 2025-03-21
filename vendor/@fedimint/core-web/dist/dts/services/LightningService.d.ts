import { WorkerClient } from '../worker';
import type { CreateBolt11Response, GatewayInfo, JSONObject, LightningGateway, LnPayState, LnReceiveState, OutgoingLightningPayment } from '../types';
export declare class LightningService {
    private client;
    constructor(client: WorkerClient);
    /** https://web.fedimint.org/core/FedimintWallet/LightningService/createInvoice#lightning-createinvoice */
    createInvoice(amountMsats: number, description: string, expiryTime?: number, // in seconds
    gatewayInfo?: GatewayInfo, extraMeta?: JSONObject): Promise<CreateBolt11Response>;
    parseInvoice(invoice: string): Promise<JSONObject>;
    createInvoiceTweaked(amountMsats: number, description: string, tweakKey: string, index: number, expiryTime?: number, // in seconds
    gatewayInfo?: GatewayInfo, extraMeta?: JSONObject): Promise<CreateBolt11Response>;
    scanReceivesForTweaks(tweakKey: string, indices: number[], extraMeta?: JSONObject): Promise<string[]>;
    private _getDefaultGatewayInfo;
    /** https://web.fedimint.org/core/FedimintWallet/LightningService/payInvoice#lightning-payinvoice-invoice-string */
    payInvoice(invoice: string, gatewayInfo?: GatewayInfo, extraMeta?: JSONObject): Promise<OutgoingLightningPayment>;
    /** https://web.fedimint.org/core/FedimintWallet/LightningService/payInvoice#lightning-payinvoicesync-invoice-string */
    payInvoiceSync(invoice: string, timeoutMs?: number, gatewayInfo?: GatewayInfo, extraMeta?: JSONObject): Promise<{
        success: false;
        error?: string;
    } | {
        success: true;
        data: {
            feeMsats: number;
            preimage: string;
        };
    }>;
    subscribeLnClaim(operationId: string, onSuccess?: (state: LnReceiveState) => void, onError?: (error: string) => void): import("../types").CancelFunction;
    /** https://web.fedimint.org/core/FedimintWallet/LightningService/payInvoice#lightning-payinvoice-invoice-string */
    subscribeLnPay(operationId: string, onSuccess?: (state: LnPayState) => void, onError?: (error: string) => void): import("../types").CancelFunction;
    /** https://web.fedimint.org/core/FedimintWallet/LightningService/payInvoice#lightning-payinvoice-invoice-string */
    waitForPay(operationId: string): Promise<{
        success: false;
        error?: string;
    } | {
        success: true;
        data: {
            preimage: string;
        };
    }>;
    /** https://web.fedimint.org/core/FedimintWallet/LightningService/createInvoice#lightning-createinvoice */
    subscribeLnReceive(operationId: string, onSuccess?: (state: LnReceiveState) => void, onError?: (error: string) => void): import("../types").CancelFunction;
    /** https://web.fedimint.org/core/FedimintWallet/LightningService/createInvoice#lightning-createinvoice */
    waitForReceive(operationId: string, timeoutMs?: number): Promise<LnReceiveState>;
    getGateway(gatewayId?: string | null, forceInternal?: boolean): Promise<LightningGateway | null>;
    listGateways(): Promise<LightningGateway[]>;
    updateGatewayCache(): Promise<import("../types").JSONValue>;
}
//# sourceMappingURL=LightningService.d.ts.map