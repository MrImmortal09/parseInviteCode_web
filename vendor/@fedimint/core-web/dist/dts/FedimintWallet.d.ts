import { BalanceService, MintService, LightningService, FederationService, RecoveryService } from './services';
import { type LogLevel } from './utils/logger';
export declare class FedimintWallet {
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
//# sourceMappingURL=FedimintWallet.d.ts.map