import type { CancelFunction, JSONValue, ModuleKind, StreamError, WorkerMessageType } from '../types';
export declare class WorkerClient {
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
//# sourceMappingURL=WorkerClient.d.ts.map