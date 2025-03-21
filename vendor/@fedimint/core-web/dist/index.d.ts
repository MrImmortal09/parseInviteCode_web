type Alias<T> = T & {};
type Resolve<T> = T & unknown;
type Seconds = Alias<number>;
type Nanos = Alias<number>;
type Duration = {
    nanos: Nanos;
    secs: Seconds;
};
type MSats = Alias<number>;
type Sats = Alias<number>;
type JSONValue = string | number | boolean | null | {
    [key: string]: JSONValue;
} | JSONValue[];
type JSONObject = Record<string, JSONValue>;
type Result<T, U = string> = {
    success: true;
    data?: T;
} | {
    success: false;
    error: U;
};
//# sourceMappingURL=utils.d.ts.map

declare const MODULE_KINDS: readonly ["", "ln", "mint"];
type ModuleKind = (typeof MODULE_KINDS)[number];
type GatewayInfo = {
    gateway_id: string;
    api: string;
    node_pub_key: string;
    federation_index: number;
    route_hints: RouteHint[];
    fees: FeeToAmount;
};
type LightningGateway = {
    info: GatewayInfo;
    vetted: boolean;
    ttl: Duration;
};
type RouteHint = {};
type FeeToAmount = {};
type OutgoingLightningPayment = {
    payment_type: PayType;
    contract_id: string;
    fee: MSats;
};
type PayType = {
    lightning: string;
} | {
    internal: string;
};
type LnPayState = 'created' | 'canceled' | {
    funded: {
        block_height: number;
    };
} | {
    waiting_for_refund: {
        error_reason: string;
    };
} | 'awaiting_change' | {
    success: {
        preimage: string;
    };
} | {
    refunded: {
        gateway_error: string;
    };
} | {
    unexpected_error: {
        error_message: string;
    };
};
type LnReceiveState = 'created' | {
    waiting_for_payment: {
        invoice: string;
        timeout: number;
    };
} | {
    canceled: {
        reason: string;
    };
} | 'funded' | 'awaiting_funds' | 'claimed';
type CreateBolt11Response = {
    operation_id: string;
    invoice: string;
};
type StreamError = {
    error: string;
    data: never;
    end: never;
};
type StreamSuccess<T extends JSONValue> = {
    data: T;
    error: never;
    end: never;
};
type StreamEnd = {
    end: string;
    data: never;
    error: never;
};
type StreamResult<T extends JSONValue> = StreamSuccess<T> | StreamError | StreamEnd;
type CancelFunction = () => void;
type ReissueExternalNotesState = 'Created' | 'Issuing' | 'Done';
type MintSpendNotesResponse = Array<string>;
type SpendNotesState = 'Created' | 'UserCanceledProcessing' | 'UserCanceledSuccess' | 'UserCanceledFailure' | 'Success' | 'Refunded';
//# sourceMappingURL=wallet.d.ts.map

declare const WorkerMessageTypes: readonly ["init", "initialized", "rpc", "log", "open", "join", "error", "unsubscribe", "cleanup", "parse"];
type WorkerMessageType = (typeof WorkerMessageTypes)[number];

declare class WorkerClient {
    private worker;
    private requestCounter;
    private requestCallbacks;
    private initPromise;
    constructor();
    initialize(): Promise<boolean>;
    private handleWorkerLogs;
    private handleWorkerError;
    private handleWorkerMessage;
    sendSingleMessage<Response extends JSONValue = JSONValue, Payload extends JSONValue = JSONValue>(type: WorkerMessageType, payload?: Payload): Promise<Response>;
    /**
     * @summary Initiates an RPC stream with the specified module and method.
     *
     * @description
     * This function sets up an RPC stream by sending a request to a worker and
     * handling responses asynchronously. It ensures that unsubscription is handled
     * correctly, even if the unsubscribe function is called before the subscription
     * is fully established, by deferring the unsubscription attempt using `setTimeout`.
     *
     * The function operates in a non-blocking manner, leveraging Promises to manage
     * asynchronous operations and callbacks to handle responses.
     *
     *
     * @template Response - The expected type of the successful response.
     * @template Body - The type of the request body.
     * @param module - The module kind to interact with.
     * @param method - The method name to invoke on the module.
     * @param body - The request payload.
     * @param onSuccess - Callback invoked with the response data on success.
     * @param onError - Callback invoked with error information if an error occurs.
     * @param onEnd - Optional callback invoked when the stream ends.
     * @returns A function that can be called to cancel the subscription.
     *
     */
    rpcStream<Response extends JSONValue = JSONValue, Body extends JSONValue = JSONValue>(module: ModuleKind, method: string, body: Body, onSuccess: (res: Response) => void, onError: (res: StreamError['error']) => void, onEnd?: () => void): CancelFunction;
    private _rpcStreamInner;
    rpcSingle<Response extends JSONValue = JSONValue, Error extends string = string>(module: ModuleKind, method: string, body: JSONValue): Promise<Response>;
    cleanup(): Promise<void>;
    _getRequestCounter(): number;
    _getRequestCallbackMap(): Map<number, (value: any) => void>;
}

declare class MintService {
    private client;
    constructor(client: WorkerClient);
    /** https://web.fedimint.org/core/FedimintWallet/MintService/redeemEcash */
    redeemEcash(notes: string): Promise<string>;
    reissueExternalNotes(oobNotes: string, extraMeta?: JSONObject): Promise<string>;
    subscribeReissueExternalNotes(operationId: string, onSuccess?: (state: ReissueExternalNotesState) => void, onError?: (error: string) => void): CancelFunction;
    /** https://web.fedimint.org/core/FedimintWallet/MintService/spendNotes */
    spendNotes(amountMsats: number, tryCancelAfter?: number | Duration, // defaults to 1 day
    includeInvite?: boolean, extraMeta?: JSONValue): Promise<{
        notes: string;
        operation_id: string;
    }>;
    /** https://web.fedimint.org/core/FedimintWallet/MintService/parseEcash */
    parseNotes(oobNotes: string): Promise<number>;
    tryCancelSpendNotes(operationId: string): Promise<void>;
    subscribeSpendNotes(operationId: string, onSuccess?: (state: SpendNotesState) => void, onError?: (error: string) => void): CancelFunction;
    awaitSpendOobRefund(operationId: string): Promise<JSONValue>;
}

/**
 * Balance Service
 *
 * The Balance Service provides methods to interact with the balance of a Fedimint wallet.
 */
declare class BalanceService {
    private client;
    constructor(client: WorkerClient);
    /** https://web.fedimint.org/core/FedimintWallet/BalanceService/getBalance */
    getBalance(): Promise<number>;
    /** https://web.fedimint.org/core/FedimintWallet/BalanceService/subscribeBalance */
    subscribeBalance(onSuccess?: (balanceMsats: number) => void, onError?: (error: string) => void): CancelFunction;
}

declare class LightningService {
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
    subscribeLnClaim(operationId: string, onSuccess?: (state: LnReceiveState) => void, onError?: (error: string) => void): CancelFunction;
    /** https://web.fedimint.org/core/FedimintWallet/LightningService/payInvoice#lightning-payinvoice-invoice-string */
    subscribeLnPay(operationId: string, onSuccess?: (state: LnPayState) => void, onError?: (error: string) => void): CancelFunction;
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
    subscribeLnReceive(operationId: string, onSuccess?: (state: LnReceiveState) => void, onError?: (error: string) => void): CancelFunction;
    /** https://web.fedimint.org/core/FedimintWallet/LightningService/createInvoice#lightning-createinvoice */
    waitForReceive(operationId: string, timeoutMs?: number): Promise<LnReceiveState>;
    getGateway(gatewayId?: string | null, forceInternal?: boolean): Promise<LightningGateway | null>;
    listGateways(): Promise<LightningGateway[]>;
    updateGatewayCache(): Promise<JSONValue>;
}

declare class RecoveryService {
    private client;
    constructor(client: WorkerClient);
    hasPendingRecoveries(): Promise<boolean>;
    waitForAllRecoveries(): Promise<void>;
    subscribeToRecoveryProgress(onSuccess: (progress: {
        module_id: number;
        progress: JSONValue;
    }) => void, onError: (error: string) => void): CancelFunction;
}

declare class FederationService {
    private client;
    constructor(client: WorkerClient);
    getConfig(): Promise<JSONValue>;
    getFederationId(): Promise<string>;
    getInviteCode(peer?: number): Promise<string | null>;
    listOperations(): Promise<JSONValue[]>;
}

declare const logLevels: readonly ["debug", "info", "warn", "error", "none"];
type LogLevel = (typeof logLevels)[number];

declare class FedimintWallet {
    private _client;
    balance: BalanceService;
    mint: MintService;
    lightning: LightningService;
    federation: FederationService;
    recovery: RecoveryService;
    private _openPromise;
    private _resolveOpen;
    private _isOpen;
    /**
     * Creates a new instance of FedimintWallet.
     *
     * This constructor initializes a FedimintWallet instance, which manages communication
     * with a Web Worker. The Web Worker is responsible for running WebAssembly code that
     * handles the core Fedimint Client operations.
     *
     * (default) When not in lazy mode, the constructor immediately initializes the
     * Web Worker and begins loading the WebAssembly module in the background. This
     * allows for faster subsequent operations but may increase initial load time.
     *
     * In lazy mode, the Web Worker and WebAssembly initialization are deferred until
     * the first operation that requires them, reducing initial overhead at the cost
     * of a slight delay on the first operation.
     *
     * @param {boolean} lazy - If true, delays Web Worker and WebAssembly initialization
     *                         until needed. Default is false.
     *
     * @example
     * // Create a wallet with immediate initialization
     * const wallet = new FedimintWallet();
     * wallet.open();
     *
     * // Create a wallet with lazy initialization
     * const lazyWallet = new FedimintWallet(true);
     * // Some time later...
     * lazyWallet.initialize();
     * lazyWallet.open();
     */
    constructor(lazy?: boolean);
    initialize(): Promise<void>;
    waitForOpen(): Promise<void>;
    open(clientName?: string): Promise<boolean>;
    joinFederation(inviteCode: string, clientName?: string): Promise<boolean>;
    parseInviteCode(inviteCode: string): Promise<{
        url: string;
        federation_id: string;
    }>;
    /**
     * This should ONLY be called when UNLOADING the wallet client.
     * After this call, the FedimintWallet instance should be discarded.
     */
    cleanup(): Promise<void>;
    isOpen(): boolean;
    /**
     * Sets the log level for the library.
     * @param level The desired log level ('DEBUG', 'INFO', 'WARN', 'ERROR', 'NONE').
     */
    setLogLevel(level: LogLevel): void;
}

export { type Alias, type CancelFunction, type CreateBolt11Response, type Duration, FedimintWallet, type FeeToAmount, type GatewayInfo, type JSONObject, type JSONValue, type LightningGateway, type LnPayState, type LnReceiveState, type MSats, type MintSpendNotesResponse, type ModuleKind, type OutgoingLightningPayment, type PayType, type ReissueExternalNotesState, type Resolve, type Result, type RouteHint, type Sats, type SpendNotesState, type StreamError, type StreamResult, type StreamSuccess, type WorkerMessageType };
