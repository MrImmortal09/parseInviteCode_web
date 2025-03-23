"use client"
import { useState, useEffect } from 'react';
import { FedimintWallet} from '@fedimint/core-web';

export default function FedimintPage() {
  const [wallet, setWallet] = useState<FedimintWallet | null>(null);
  const [inviteCode, setInviteCode] = useState<string>('');
  const [invoiceData, setInvoiceData] = useState<any>(null);
  // Add new state for BOLT11 invoice
  const [bolt11Input, setBolt11Input] = useState<string>('');
  const [parsedInvoice, setParsedInvoice] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {

    const initWallet = async () => {
      try {
        const newWallet = new FedimintWallet(); 
        await newWallet.open();
        setWallet(newWallet);
        console.log("Wallet initialized successfully");
      } catch (err: unknown) {
        const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
        setError(`Failed to initialize wallet: ${errorMessage}`);
        console.error("Wallet initialization error:", err);
      }
    };

    initWallet();

    return () => {
      if (wallet) {
        console.log("Cleaning up wallet resources");
      }
    };
  }, []);

  const handleParseInvite = async () => {
    if (!wallet) {
      setError("Wallet not initialized yet");
      return;
    }

    if (!inviteCode.trim()) {
      setError("Please enter an invite code");
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      const parseResult = await wallet.parseInviteCode(inviteCode);
      console.log("Parsed invite data:", parseResult);
      setInvoiceData(parseResult);
      setLoading(false);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      console.log("Invite code parsing error:", err);
      setError(`Failed to parse invite code: ${errorMessage}`);
      setLoading(false);
      console.error("Invite code parsing error:", err);
    }
  };

  // Add handler for parsing BOLT11 invoices
  const handleParseBolt11 = async () => {
    if (!wallet) {
      setError("Wallet not initialized yet");
      return;
    }

    if (!bolt11Input.trim()) {
      setError("Please enter a BOLT11 invoice");
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      const parseResult = await wallet.lightning.parseBolt11Invoice(bolt11Input);
      console.log("Parsed invoice data:", parseResult);
      setParsedInvoice(parseResult);
      setLoading(false);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      console.log("Invoice parsing error:", err);
      setError(`Failed to parse BOLT11 invoice: ${errorMessage}`);
      setLoading(false);
      console.error("Invoice parsing error:", err);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Fedimint Wallet Demo</h1>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {wallet ? (
        <div className="mb-4 p-3 bg-green-100 border border-green-400 rounded">
          Wallet Status: Initialized and Ready
        </div>
      ) : (
        <div className="mb-4 p-3 bg-yellow-100 border border-yellow-400 rounded">
          Wallet Status: Initializing...
        </div>
      )}

      <div className="mb-6">
        <label htmlFor="inviteCode" className="block text-sm font-medium text-gray-700 mb-2">
          Enter Fedimint Invite Code
        </label>
        <input
          type="text"
          id="inviteCode"
          value={inviteCode}
          onChange={(e) => setInviteCode(e.target.value)}
          placeholder="fed11q..."
          className="w-full p-2 border border-gray-300 rounded mb-3"
        />
        <button 
          onClick={handleParseInvite}
          disabled={!wallet || loading}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:bg-gray-400"
        >
          {loading ? "Processing..." : "Parse Invite Code"}
        </button>
      </div>

      {invoiceData && (
        <div className="mt-4">
          <h2 className="text-xl font-semibold mb-2">Invite Code Data:</h2>
          <pre className="bg-gray-100 p-4 rounded overflow-auto">
            {JSON.stringify(invoiceData, null, 2)}
          </pre>
        </div>
      )}

      {/* Add BOLT11 invoice parsing section */}
      <div className="mb-6 mt-8 pt-6 border-t border-gray-200">
        <h2 className="text-xl font-semibold mb-4">Parse BOLT11 Lightning Invoice</h2>
        <label htmlFor="bolt11Invoice" className="block text-sm font-medium text-gray-700 mb-2">
          Enter BOLT11 Invoice
        </label>
        <input
          type="text"
          id="bolt11Invoice"
          value={bolt11Input}
          onChange={(e) => setBolt11Input(e.target.value)}
          placeholder="lnbc..."
          className="w-full p-2 border border-gray-300 rounded mb-3"
        />
        <button 
          onClick={handleParseBolt11}
          disabled={!wallet || loading}
          className="bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded disabled:bg-gray-400"
        >
          {loading ? "Processing..." : "Parse BOLT11 Invoice"}
        </button>
      </div>

      {parsedInvoice && (
        <div className="mt-4">
          <h2 className="text-xl font-semibold mb-2">Parsed Invoice Data:</h2>
          <pre className="bg-gray-100 p-4 rounded overflow-auto">
            {JSON.stringify(parsedInvoice, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}