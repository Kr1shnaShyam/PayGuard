import React, { useMemo, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import API from "../lib/api";
import toast, { Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

type Item = { sku: string; name: string; qty: number; unitPrice: number };

export default function BuyerCreate() {
  const navigate = useNavigate();
  const qc = useQueryClient();

  const [sellerId, setSellerId] = useState("");
  const [items, setItems] = useState<Item[]>([{ sku: "SKU-001", name: "Sample Item", qty: 1, unitPrice: 199 }]);
  const [processing, setProcessing] = useState(false);

  const subtotal = useMemo(() => items.reduce((s, it) => s + (it.qty || 0) * (it.unitPrice || 0), 0), [items]);

  const createTx = useMutation({
    mutationFn: (payload: { sellerId: string; items: Item[] }) => API.post("/tx/create", payload),
    onMutate: () => setProcessing(true),
    onError: (err: any) => { setProcessing(false); toast.error(err?.response?.data?.message || "Failed"); },
    onSuccess: (res: any, vars) => {
      setProcessing(false);
      toast.success("Transaction created");
      qc.invalidateQueries({ queryKey: ["sellerTxs", vars.sellerId] });
      const tx = res?.data?.transaction;
      if (tx?._id) navigate(`/tx/${tx._id}`);
      else navigate("/seller/dashboard");
    }
  });

  function updateItem(i: number, p: Partial<Item>) { setItems(prev => prev.map((it, idx) => idx === i ? { ...it, ...p } : it)); }
  function addItem() { setItems(prev => [...prev, { sku: `SKU-${prev.length+1}`, name: "", qty: 1, unitPrice: 0 }]); }
  function removeItem(i: number) { if (items.length > 1) setItems(prev => prev.filter((_, idx) => idx !== i)); }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!sellerId.trim()) return toast.error("Seller ID required");
    await createTx.mutateAsync({ sellerId: sellerId.trim(), items });
  }

  return (
    <div className="container-max px-4 py-8">
      <Toaster />
      <div className="bg-neutral-800 p-6 rounded-xl border border-neutral-700">
        <h1 className="text-2xl font-semibold mb-4">Create Transaction</h1>
        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="text-sm text-neutral-300 block mb-1">Seller ID</label>
            <input className="w-full px-3 py-2 bg-neutral-900 border border-neutral-700 rounded text-neutral-100"
              value={sellerId} onChange={e => setSellerId(e.target.value)} placeholder="paste seller id" />
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-sm font-medium">Items</h3>
              <button type="button" onClick={addItem} className="text-sm bg-emerald-600 px-3 py-1 rounded text-white">+ Add item</button>
            </div>

            <div className="space-y-3">
              {items.map((it, idx) => (
                <div key={idx} className="grid grid-cols-12 gap-3 items-center bg-neutral-900 border border-neutral-700 rounded p-3">
                  <input className="col-span-2 p-2 bg-transparent outline-none" value={it.sku} onChange={e => updateItem(idx, { sku: e.target.value })}/>
                  <input className="col-span-6 p-2 bg-transparent outline-none" value={it.name} onChange={e => updateItem(idx, { name: e.target.value })}/>
                  <input type="number" className="col-span-1 p-2 bg-transparent outline-none" min={1} value={it.qty} onChange={e => updateItem(idx, { qty: Math.max(1, Number(e.target.value) || 1) })}/>
                  <input type="number" className="col-span-2 p-2 bg-transparent outline-none" min={0} value={it.unitPrice} onChange={e => updateItem(idx, { unitPrice: Number(e.target.value) || 0 })}/>
                  <div className="col-span-1 text-right">
                    <button type="button" onClick={() => removeItem(idx)} className="px-2 py-1 bg-red-600 rounded text-white" disabled={items.length === 1}>Remove</button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-between items-center">
            <div className="text-sm text-neutral-400">You will be charged: <span className="font-semibold">₹{subtotal.toFixed(2)}</span></div>
            <div className="flex gap-3">
              <button type="button" onClick={() => { setSellerId(""); setItems([{ sku: "SKU-001", name: "", qty: 1, unitPrice: 0 }]); }} className="px-4 py-2 border rounded">Reset</button>
              <button type="submit" className="px-5 py-2 rounded text-white bg-indigo-600 hover:bg-indigo-700">{processing ? "Processing..." : "Create & Hold Funds"}</button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}



// // C:\Users\krish\payguard\frontend-vite\src\pages\BuyerCreate.tsx
// import { useMemo, useState } from "react";
// import { useMutation, useQueryClient } from "@tanstack/react-query";
// import API, { setAuthToken } from "../lib/api";
// import { getToken } from "../lib/auth";
// import toast, { Toaster } from "react-hot-toast";
// import { useNavigate } from "react-router-dom";
// import type { AxiosResponse, AxiosError } from "axios";

// type Item = { sku: string; name: string; qty: number; unitPrice: number };
// type CreateVars = { sellerId: string; items: Item[] };

// export default function BuyerCreate() {
//   const navigate = useNavigate();
//   const queryClient = useQueryClient();

//   // set token on load if present
//   const token = getToken();
//   if (token) setAuthToken(token);

//   // component state
//   const [sellerId, setSellerId] = useState("");
//   const [items, setItems] = useState<Item[]>([
//     { sku: "SKU-001", name: "Sample item", qty: 1, unitPrice: 199 },
//   ]);
//   const [processing, setProcessing] = useState(false);

//   // subtotal memo
//   const subtotal = useMemo(
//     () => items.reduce((s, it) => s + (it.qty || 0) * (it.unitPrice || 0), 0),
//     [items]
//   );

//   // helpers
//   function updateItem(i: number, p: Partial<Item>) {
//     setItems((prev) => prev.map((it, idx) => (idx === i ? { ...it, ...p } : it)));
//   }
//   function addItem() {
//     setItems((prev) => [
//       ...prev,
//       { sku: `SKU-${(prev.length + 1).toString().padStart(3, "0")}`, name: "", qty: 1, unitPrice: 0 },
//     ]);
//   }
//   function removeItem(i: number) {
//     if (items.length > 1) setItems((prev) => prev.filter((_, idx) => idx !== i));
//   }

//   // mutation function (must return Promise<AxiosResponse>)
//   const createMutationFn = (payload: CreateVars): Promise<AxiosResponse<any>> =>
//     API.post("/tx/create", payload);

//   // mutation with improved typing and v5 object-style options
//   const createTx = useMutation<AxiosResponse<any>, AxiosError, CreateVars>({
//     mutationFn: createMutationFn,
//     onMutate: () => setProcessing(true),
//     onError: (err) => {
//       setProcessing(false);
//       // AxiosError -> err.response?.data?.message might exist
//       const errMsg =
//         (err as AxiosError<{ message?: string }>)?.response?.data?.message ||
//         (err as any)?.message ||
//         "Failed to create transaction";
//       toast.error(errMsg);
//     },
//     onSuccess: (res, variables) => {
//       setProcessing(false);
//       toast.success("Transaction created");
//       // invalidate the specific seller's listing (if you're using that key format)
//       if (variables?.sellerId) {
//         queryClient.invalidateQueries({ queryKey: ["sellerTxs", variables.sellerId] });
//       } else {
//         queryClient.invalidateQueries({ queryKey: ["sellerTxs"] });
//       }

//       const tx = res?.data?.transaction;
//       if (tx?._id) navigate(`/tx/${tx._id}`);
//       else navigate("/seller/dashboard");
//     },
//     onSettled: () => {
//       // ensure processing cleared no matter what
//       setProcessing(false);
//     },
//   });

//   // validation
//   const validate = () => {
//     if (!sellerId.trim()) return "Seller ID required";
//     if (!items.length) return "Add at least one item";
//     for (let i = 0; i < items.length; i++) {
//       const it = items[i];
//       if (!it.name.trim()) return `Item ${i + 1} name required`;
//       if (it.qty <= 0) return `Item ${i + 1} qty > 0`;
//       if (it.unitPrice < 0) return `Item ${i + 1} price must be >= 0`;
//     }
//     return null;
//   };

//   // submit uses mutateAsync for clearer async flow
//   async function submit(e: React.FormEvent) {
//     e.preventDefault();
//     const v = validate();
//     if (v) return toast.error(v);

//     try {
//       await createTx.mutateAsync({ sellerId: sellerId.trim(), items });
//       // success flow handled in onSuccess
//     } catch (err) {
//       // onError already handles toast; optionally handle extra logic here
//       console.error("Create tx error:", err);
//     }
//   }

//   return (
//     <div className="container mx-auto px-4 py-8">
//       <Toaster />
//       <div className="bg-neutral-800 p-6 rounded-xl border border-neutral-700 shadow">
//         <header className="flex justify-between items-start mb-6">
//           <div>
//             <h1 className="text-2xl font-semibold">Create Transaction (Buyer)</h1>
//             <p className="text-sm text-neutral-400">
//               Create an escrowed transaction — funds will be held until completion.
//             </p>
//           </div>
//           <div className="text-right">
//             <div className="text-xs text-neutral-400">Subtotal</div>
//             <div className="text-lg font-semibold">₹{subtotal.toFixed(2)}</div>
//           </div>
//         </header>

//         <form onSubmit={submit} className="space-y-4">
//           <div>
//             <label className="text-sm text-neutral-300 block mb-1">Seller ID</label>
//             <input
//               disabled={processing}
//               value={sellerId}
//               onChange={(e) => setSellerId(e.target.value)}
//               className="w-full rounded p-3 bg-neutral-900 border border-neutral-700 focus:ring-2 focus:ring-indigo-500"
//               placeholder="Paste seller ObjectId"
//             />
//           </div>

//           <div>
//             <div className="flex justify-between items-center mb-2">
//               <h2 className="text-sm font-medium">Items</h2>
//               <button
//                 type="button"
//                 onClick={addItem}
//                 className="text-sm bg-emerald-600 px-3 py-1 rounded text-white"
//                 disabled={processing}
//               >
//                 + Add item
//               </button>
//             </div>

//             <div className="space-y-3">
//               {items.map((it, idx) => (
//                 <div
//                   key={idx}
//                   className="grid grid-cols-12 gap-3 items-center bg-neutral-900 border border-neutral-700 rounded p-3"
//                 >
//                   <input
//                     className="col-span-2 p-2 bg-transparent outline-none"
//                     value={it.sku}
//                     onChange={(e) => updateItem(idx, { sku: e.target.value })}
//                     placeholder="SKU"
//                     disabled={processing}
//                   />
//                   <input
//                     className="col-span-6 p-2 bg-transparent outline-none"
//                     value={it.name}
//                     onChange={(e) => updateItem(idx, { name: e.target.value })}
//                     placeholder="Item name"
//                     disabled={processing}
//                   />
//                   <input
//                     type="number"
//                     className="col-span-1 p-2 bg-transparent outline-none"
//                     min={1}
//                     value={it.qty}
//                     onChange={(e) =>
//                       updateItem(idx, { qty: Math.max(1, Number(e.target.value) || 1) })
//                     }
//                     disabled={processing}
//                   />
//                   <input
//                     type="number"
//                     className="col-span-2 p-2 bg-transparent outline-none"
//                     min={0}
//                     value={it.unitPrice}
//                     onChange={(e) =>
//                       updateItem(idx, { unitPrice: Math.max(0, Number(e.target.value) || 0) })
//                     }
//                     disabled={processing}
//                   />
//                   <div className="col-span-1 text-right">
//                     <button
//                       type="button"
//                       onClick={() => removeItem(idx)}
//                       className="px-2 py-1 bg-red-600 rounded text-white disabled:opacity-50"
//                       disabled={processing || items.length === 1}
//                     >
//                       Remove
//                     </button>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>

//           <div className="flex justify-between items-center">
//             <div className="text-sm text-neutral-400">
//               You will be charged: <span className="font-semibold">₹{subtotal.toFixed(2)}</span>
//             </div>
//             <div className="flex gap-3">
//               <button
//                 type="button"
//                 onClick={() => {
//                   setSellerId("");
//                   setItems([{ sku: "SKU-001", name: "", qty: 1, unitPrice: 0 }]);
//                 }}
//                 className="px-4 py-2 border rounded text-sm"
//                 disabled={processing}
//               >
//                 Reset
//               </button>

//               <button
//                 type="submit"
//                 disabled={processing}
//                 className={`px-5 py-2 rounded text-white ${
//                   processing ? "bg-indigo-400" : "bg-indigo-600 hover:bg-indigo-700"
//                 }`}
//               >
//                 {processing ? "Processing..." : "Create & Hold Funds"}
//               </button>
//             </div>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// }
