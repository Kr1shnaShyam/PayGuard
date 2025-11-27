import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import API from "../lib/api";
import toast from "react-hot-toast";

type Tx = { _id: string; orderId?: string; amount?: number; status?: string; items?: any[]; history?: any[] };

async function fetchTx(id?: string): Promise<Tx | null> {
  if (!id) return null;
  const r = await API.get(`/tx/${id}`);
  return r.data.transaction || null;
}

export default function TxDetail() {
  const { id } = useParams();
  const qc = useQueryClient();
  const nav = useNavigate();

  const { data: tx, isLoading, isError, refetch } = useQuery<Tx | null, Error>({
    queryKey: ["tx", id],
    queryFn: () => fetchTx(id),
    enabled: !!id,
  });

  const confirmMutation = useMutation({
    mutationFn: (txId: string) => API.post(`/tx/${txId}/confirm`),
    onSuccess: () => { toast.success("Confirmed"); qc.invalidateQueries({ queryKey: ["tx", id] }); refetch(); },
    onError: (err: any) => toast.error(err?.response?.data?.message || "Confirm failed")
  });

  function confirmDelivery() { if (!id) return; confirmMutation.mutate(id); }

  if (isLoading) return <div className="container-max px-4 py-8">Loading...</div>;
  if (isError) return <div className="container-max px-4 py-8 text-red-400">Failed to load</div>;
  if (!tx) return <div className="container-max px-4 py-8 text-neutral-400">Transaction not found</div>;

  return (
    <main className="container-max px-4 py-8">
      <div className="bg-neutral-800 p-6 rounded-xl border border-neutral-700">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-semibold">{tx.orderId || tx._id}</h1>
            <div className="text-sm text-neutral-400">Status: <span className="font-medium">{tx.status}</span></div>
          </div>
          <div className="text-right">
            <div className="text-sm text-neutral-400">Amount</div>
            <div className="text-lg font-semibold">₹{(tx.amount||0).toFixed(2)}</div>
          </div>
        </div>

        <section className="mt-6">
          <h3 className="text-lg font-medium mb-2">Items</h3>
          <div className="space-y-2">
            {(tx.items || []).map((it, idx) => (
              <div key={idx} className="p-3 bg-neutral-900 border border-neutral-700 rounded flex justify-between">
                <div>
                  <div className="text-sm text-neutral-400">{it.sku}</div>
                  <div className="font-medium">{it.name}</div>
                </div>
                <div className="text-right">
                  <div className="text-sm">Qty: {it.qty}</div>
                  <div className="font-medium">₹{(it.unitPrice||0).toFixed(2)}</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-6">
          <h3 className="text-lg font-medium mb-2">Timeline</h3>
          <div className="space-y-2">
            {(tx.history||[]).map((h, i) => (
              <div key={i} className="p-2 bg-neutral-900 border border-neutral-700 rounded">
                <div className="text-sm text-neutral-400">{new Date(h.ts).toLocaleString()}</div>
                <div className="font-medium">{h.status}</div>
                {h.by && <div className="text-xs text-neutral-400">by {h.by}</div>}
              </div>
            ))}
          </div>
        </section>

        <div className="mt-6 flex gap-3">
          <button onClick={() => nav(-1)} className="px-4 py-2 border rounded">Back</button>
          <button onClick={confirmDelivery} disabled={tx.status !== "SHIPPED"} className="px-4 py-2 bg-emerald-600 text-white rounded">Confirm Delivery</button>
        </div>
      </div>
    </main>
  );
}
