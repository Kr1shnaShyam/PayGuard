// frontend-vite/src/pages/SellerDashboard.tsx
import { useEffect, useState } from "react";
import API from "../lib/api";
import { getToken } from "../lib/auth";
import { Link } from "react-router-dom";

function parseJwt(token: string | null) {
  if (!token) return null;
  try {
    const payload = token.split(".")[1];
    return JSON.parse(atob(payload));
  } catch {
    return null;
  }
}

export default function SellerDashboard() {
  const [txs, setTxs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = getToken();
    const decoded: any = parseJwt(token);
    const sellerId = decoded?.id;

    async function fetchTxs() {
      try {
        // If your backend supports query param sellerId
        const res = await API.get(`/tx?sellerId=${sellerId}`);
        setTxs(res.data.transactions || []);
      } catch (err: any) {
        console.error(err);
        alert(err?.response?.data?.message || "Failed to load transactions");
      } finally {
        setLoading(false);
      }
    }

    fetchTxs();
  }, []);

  async function markShipped(id: string) {
    try {
      await API.post(`/tx/${id}/ship`);
      setTxs(prev => prev.map(t => (t._id === id ? { ...t, status: "SHIPPED" } : t)));
    } catch (err: any) {
      console.error(err);
      alert(err?.response?.data?.message || "Ship failed");
    }
  }

  if (loading) return <div style={{ padding: 20 }}>Loading...</div>;

  return (
    <main style={{ padding: 20 }}>
      <h1>Seller Dashboard</h1>
      {txs.length === 0 && <p>No transactions found.</p>}
      {txs.map(tx => (
        <div key={tx._id} style={{ padding: 12, border: "1px solid #ddd", marginBottom: 12 }}>
          <div><strong>Order:</strong> {tx.orderId}</div>
          <div><strong>Amount:</strong> {tx.amount}</div>
          <div><strong>Status:</strong> {tx.status}</div>
          <div style={{ marginTop: 10 }}>
            <button onClick={() => markShipped(tx._id)}>Mark Shipped</button>
            <Link to={`/tx/${tx._id}`} style={{ marginLeft: 12 }}>View</Link>
          </div>
        </div>
      ))}
    </main>
  );
}
