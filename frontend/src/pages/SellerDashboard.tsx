import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import API from "../lib/api";
import toast from "react-hot-toast";

type Tx = { _id: string; orderId?: string; amount?: number; status?: string; history?: any[] };

async function fetchSellerTxs(sellerId?: string): Promise<Tx[]> {
  if (!sellerId) return [];
  const r = await API.get(`/tx?sellerId=${sellerId}`);
  return r.data.transactions || [];
}

export default function SellerDashboard() {
  const qc = useQueryClient();

  // Read sellerId from JWT token (backend uses "id" in token payload)
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
  let sellerId = "";
  if (token) {
    try {
      sellerId = JSON.parse(atob(token.split(".")[1])).id;
    } catch {}
  }

  const { data: txs = [], isLoading, isError, refetch } = useQuery<Tx[], Error>({
    queryKey: ["sellerTxs", sellerId],
    queryFn: () => fetchSellerTxs(sellerId),
    enabled: !!sellerId,
    staleTime: 1000 * 30,
  });

  const shipMutation = useMutation({
    mutationFn: (id: string) => API.post(`/tx/${id}/ship`),
    onSuccess: () => {
      toast.success("Marked shipped");
      qc.invalidateQueries({ queryKey: ["sellerTxs", sellerId] });
    },
    onError: (err: any) => toast.error(err?.response?.data?.message || "Ship failed"),
  });

  function markShipped(id: string) {
    shipMutation.mutate(id);
  }

  return (
    <main className="container-max px-4 py-8">
      <div className="bg-neutral-800 p-6 rounded-xl border border-neutral-700">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold">Seller Dashboard</h1>
          <button
            onClick={() => refetch()}
            className="px-3 py-1 bg-indigo-600 text-white rounded"
          >
            Refresh
          </button>
        </div>

        {isLoading && <div className="text-neutral-400">Loading...</div>}
        {isError && <div className="text-red-400">Failed to load</div>}
        {txs.length === 0 && !isLoading && (
          <div className="text-neutral-400">No transactions</div>
        )}

        <div className="space-y-4">
          {txs.map((tx) => (
            <div
              key={tx._id}
              className="p-4 bg-neutral-900 border border-neutral-700 rounded flex justify-between items-center"
            >
              <div>
                <div className="text-sm text-neutral-400">Order</div>
                <div className="font-medium">{tx.orderId}</div>
                <div className="text-sm text-neutral-400 mt-1">
                  ₹{(tx.amount || 0).toFixed(2)}
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="text-sm">
                  Status: <span className="font-medium">{tx.status}</span>
                </div>
                <button
                  disabled={tx.status === "SHIPPED"}
                  onClick={() => markShipped(tx._id)}
                  className="px-3 py-1 rounded bg-emerald-600 text-white"
                >
                  Mark Shipped
                </button>
                <a href={`/tx/${tx._id}`} className="text-indigo-300">
                  View
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
