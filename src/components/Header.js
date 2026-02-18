import React, { useState } from "react";
import { checkConnection, retrievePublicKey, getBalance, sendXLM } from "./Freighter";

const Header = () => {
  const [connected, setConnected] = useState(false);
  const [publicKey, setPublicKey] = useState("");
  const [balance, setBalance] = useState("0");
  const [destination, setDestination] = useState("");
  const [amount, setAmount] = useState("");
  const [txResult, setTxResult] = useState("");
  const [txHash, setTxHash] = useState("");
  const [loading, setLoading] = useState(false);

  const connectWallet = async () => {
    try {
      const allowed = await checkConnection();
      if (!allowed) return alert("Please allow Freighter access.");
      const key = await retrievePublicKey();
      const bal = await getBalance();
      setPublicKey(key);
      setBalance(Number(bal).toFixed(2));
      setConnected(true);
    } catch (e) {
      alert("Failed to connect: " + e.message);
    }
  };

  const disconnectWallet = () => {
    setConnected(false);
    setPublicKey("");
    setBalance("0");
    setDestination("");
    setAmount("");
    setTxResult("");
    setTxHash("");
  };

  const handleSend = async () => {
    if (!destination || !amount) {
      alert("Please enter destination and amount.");
      return;
    }
    try {
      setLoading(true);
      setTxResult("Sending...");
      setTxHash("");
      const res = await sendXLM(destination, amount);
      setTxResult("Transaction Successful!");
      setTxHash(res.hash);
      const bal = await getBalance();
      setBalance(Number(bal).toFixed(2));
    } catch (e) {
      setTxResult("Transaction Failed: " + e.message);
    } finally {
      setLoading(false);
    }
  };

  const shortKey = publicKey ? publicKey.slice(0, 6) + "..." + publicKey.slice(-6) : "";

  if (!connected) {
    return (
      <div style={{ minHeight: "100vh", background: "linear-gradient(135deg, #0f0c29, #302b63, #24243e)", fontFamily: "Segoe UI, sans-serif", color: "#fff", display: "flex", flexDirection: "column" }}>
        <nav style={{ padding: "16px 32px", background: "rgba(255,255,255,0.05)", borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
          <h1 style={{ margin: 0, fontSize: "24px", color: "#a78bfa" }}>🌟 Stellar Pay</h1>
        </nav>
        <div style={{ flex: 1, display: "flex", justifyContent: "center", alignItems: "center", padding: "20px" }}>
          <div style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "24px", padding: "40px", width: "100%", maxWidth: "480px", textAlign: "center" }}>
            <h2 style={{ fontSize: "28px", marginBottom: "8px" }}>Welcome to Stellar Pay</h2>
            <p style={{ color: "rgba(255,255,255,0.5)", marginBottom: "32px" }}>Send XLM instantly on the Stellar Testnet</p>
            <button onClick={connectWallet} style={{ width: "100%", padding: "16px", background: "linear-gradient(135deg, #7c3aed, #a78bfa)", border: "none", borderRadius: "12px", color: "#fff", fontSize: "16px", fontWeight: "bold", cursor: "pointer" }}>
              🔗 Connect Freighter Wallet
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(135deg, #0f0c29, #302b63, #24243e)", fontFamily: "Segoe UI, sans-serif", color: "#fff", display: "flex", flexDirection: "column" }}>
      <nav style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 32px", background: "rgba(255,255,255,0.05)", borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
        <h1 style={{ margin: 0, fontSize: "24px", color: "#a78bfa" }}>🌟 Stellar Pay</h1>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <span style={{ background: "rgba(167,139,250,0.15)", border: "1px solid #a78bfa", borderRadius: "20px", padding: "6px 14px", fontSize: "13px", color: "#a78bfa" }}>
            {"🔑 " + shortKey}
          </span>
          <span style={{ background: "rgba(52,211,153,0.15)", border: "1px solid #34d399", borderRadius: "20px", padding: "6px 14px", fontSize: "13px", color: "#34d399" }}>
            {"💰 " + balance + " XLM"}
          </span>
          <button onClick={disconnectWallet} style={{ background: "rgba(239,68,68,0.15)", border: "1px solid #ef4444", borderRadius: "20px", padding: "6px 14px", fontSize: "13px", color: "#ef4444", cursor: "pointer" }}>
            Disconnect
          </button>
        </div>
      </nav>

      <div style={{ flex: 1, display: "flex", justifyContent: "center", alignItems: "center", padding: "20px" }}>
        <div style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "24px", padding: "40px", width: "100%", maxWidth: "480px" }}>
          <h2 style={{ fontSize: "28px", marginBottom: "16px", textAlign: "center" }}>Send XLM</h2>

          <div style={{ background: "rgba(52,211,153,0.1)", border: "1px solid rgba(52,211,153,0.3)", borderRadius: "12px", padding: "16px", textAlign: "center", marginBottom: "24px" }}>
            <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "13px", margin: "0 0 4px 0" }}>Available Balance</p>
            <p style={{ color: "#34d399", fontSize: "32px", fontWeight: "bold", margin: "0" }}>{balance} XLM</p>
          </div>

          <p style={{ color: "rgba(255,255,255,0.7)", fontSize: "14px", margin: "0 0 8px 0" }}>Destination Address</p>
          <input
            type="text"
            placeholder="G... (Stellar address)"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            style={{ width: "100%", padding: "14px", background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: "10px", color: "#fff", fontSize: "15px", outline: "none", boxSizing: "border-box", marginBottom: "16px" }}
          />

          <p style={{ color: "rgba(255,255,255,0.7)", fontSize: "14px", margin: "0 0 8px 0" }}>Amount (XLM)</p>
          <input
            type="number"
            placeholder="e.g. 10"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            min="0"
            style={{ width: "100%", padding: "14px", background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: "10px", color: "#fff", fontSize: "15px", outline: "none", boxSizing: "border-box", marginBottom: "16px" }}
          />

          <button
            onClick={handleSend}
            disabled={loading}
            style={{ width: "100%", padding: "16px", background: loading ? "rgba(124,58,237,0.4)" : "linear-gradient(135deg, #7c3aed, #a78bfa)", border: "none", borderRadius: "12px", color: "#fff", fontSize: "16px", fontWeight: "bold", cursor: loading ? "not-allowed" : "pointer" }}
          >
            {loading ? "Processing..." : "🚀 Send XLM"}
          </button>

          {txResult !== "" && (
            <div style={{ marginTop: "20px", borderRadius: "12px", padding: "16px", background: txResult.includes("Successful") ? "rgba(52,211,153,0.1)" : txResult.includes("Failed") ? "rgba(239,68,68,0.1)" : "rgba(167,139,250,0.1)", border: txResult.includes("Successful") ? "1px solid rgba(52,211,153,0.4)" : txResult.includes("Failed") ? "1px solid rgba(239,68,68,0.4)" : "1px solid rgba(167,139,250,0.4)" }}>
              <p style={{ margin: "0 0 8px 0", fontWeight: "bold", fontSize: "15px" }}>{txResult}</p>
              {txHash !== "" && (
                <div>
                  <p style={{ margin: "0 0 4px 0", color: "rgba(255,255,255,0.5)", fontSize: "12px" }}>Transaction Hash:</p>
                  <a href={"https://stellar.expert/explorer/testnet/tx/" + txHash} target="_blank" rel="noreferrer" style={{ color: "#a78bfa", fontSize: "13px", wordBreak: "break-all", textDecoration: "none" }}>
                    {txHash}
                  </a>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Header;