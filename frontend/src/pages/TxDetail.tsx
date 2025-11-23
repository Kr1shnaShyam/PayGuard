import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../lib/api";
import Timeline from "../components/Timeline";

export default function TxDetail() {
  const { id } = useParams();
  const [tx, setTx] = useState<any>(null);

  useEffect(() => {
    if (!id) return;
    API.get(`/tx/${id}`).then(r => setTx(r.data.transaction)).catch(e => {
      console.error(e);
      alert("Failed to load tx");
    });
  }, [id]);

  async function confirmDelivery() {
    if (!id) return;
    try {
      const res = await API.post(`/tx/${id}/confirm`);
      setTx(res.data.transaction);
      alert("Confirmed");
    } catch (err:any) {
      console.error(err);
      alert(err?.response?.data?.message || "Confirm failed");
    }
  }

  if (!tx) return <div style={{ padding: 20 }}>Loading...</div>;

  return (
    <main style={{ padding: 20 }}>
      <h1>Transaction {tx.orderId}</h1>
      <div>Amount: {tx.amount}</div>
      <div>Status: {tx.status}</div>
      <div style={{ marginTop: 20 }}>
        <button onClick={confirmDelivery} disabled={tx.status !== "SHIPPED"}>Confirm Delivery (Buyer)</button>
      </div>
      <h3 style={{ marginTop: 20 }}>Timeline</h3>
      <Timeline history={tx.history || []} />
    </main>
  );
}

// import { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";
// import API from "../lib/api";

// export default function TxDetail() {
//   const { id } = useParams();
//   const [tx, setTx] = useState<any>(null);
//   useEffect(() => {
//     if (!id) return;
//     API.get(`/tx/${id}`).then(r => setTx(r.data.transaction)).catch(console.error);
//   }, [id]);

//   async function confirmDelivery() {
//     if (!id) return;
//     try {
//       const r = await API.post(`/tx/${id}/confirm`);
//       setTx(r.data.transaction);
//       alert("Confirmed and funds released");
//     } catch (err: any) {
//       alert(err?.response?.data?.message || "Confirm failed");
//     }
//   }

//   if (!tx) return <div className="container mx-auto px-4 py-8">Loading...</div>;
//   return (
//     <main className="container mx-auto px-4 py-8">
//       <div className="bg-neutral-800 p-6 rounded-xl border border-neutral-700">
//         <h1 className="text-2xl font-semibold">Transaction {tx.orderId}</h1>
//         <div className="mt-4 text-neutral-200">Amount: ₹{tx.amount}</div>
//         <div className="mt-2">Status: <span className="font-medium">{tx.status}</span></div>

//         <div className="mt-6">
//           <button onClick={confirmDelivery} className="px-4 py-2 rounded bg-emerald-600 text-white" disabled={tx.status !== "SHIPPED"}>Confirm Delivery</button>
//         </div>

//         <div className="mt-6">
//           <h3 className="text-lg font-medium">Timeline</h3>
//           <div className="mt-3 space-y-2">
//             {(tx.history || []).map((h: any, i: number) => (
//               <div key={i} className="p-3 bg-neutral-900 border border-neutral-700 rounded">
//                 <div className="text-sm text-neutral-400">{new Date(h.ts).toLocaleString()}</div>
//                 <div className="font-medium">{h.status}</div>
//                 <div className="text-xs text-neutral-500">By: {h.by}</div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>
//     </main>
//   );
// }
