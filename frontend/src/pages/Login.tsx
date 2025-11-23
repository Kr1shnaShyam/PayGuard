import React, { useState } from "react";
import API from "../lib/api";
import { saveToken } from "../lib/auth";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const nav = useNavigate();
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    try {
      const res = await API.post("/auth/login", { email, password });
      const token = res.data.token;
      if (!token) throw new Error("No token returned");
      saveToken(token);
      API.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      // redirect based on role
      const role = res.data.user?.role;
      if (role === "seller") nav("/seller/dashboard");
      else nav("/buyer/create");
    } catch (err: any) {
      console.error(err);
      alert(err?.response?.data?.message || err.message || "Login failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main style={{ padding: 20 }}>
      <h1>Login</h1>
      <form onSubmit={submit}>
        <div>
          <label>Email</label><br />
          <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="buyer1@local" />
        </div>
        <div style={{ marginTop: 8 }}>
          <label>Password</label><br />
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="pass123" />
        </div>
        <div style={{ marginTop: 12 }}>
          <button type="submit" disabled={busy}>{busy ? "Logging in..." : "Login"}</button>
        </div>
      </form>
      <p style={{ marginTop: 12, color: "#aaa" }}>
        Tip: use a user you created in Postman. Example: <code>buyer1@local / pass123</code>
      </p>
    </main>
  );
}

// import React, { useState } from "react";
// import API from "../lib/api";
// import { saveToken } from "../lib/auth";
// import { useNavigate } from "react-router-dom";

// export default function Login() {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const nav = useNavigate();
//   const [busy, setBusy] = useState(false);

//   async function submit(e: React.FormEvent) {
//     e.preventDefault();
//     setBusy(true);
//     try {
//       const res = await API.post("/auth/login", { email, password });
//       const token = res.data.token;
//       if (!token) throw new Error("No token returned");

//       saveToken(token);
//       API.defaults.headers.common["Authorization"] = `Bearer ${token}`;

//       const role = res.data.user?.role;
//       if (role === "seller") nav("/seller/dashboard");
//       else nav("/buyer/create");
//     } catch (err: any) {
//       alert(err?.response?.data?.message || "Login failed");
//       console.error(err);
//     } finally {
//       setBusy(false);
//     }
//   }

//   return (
//     <main className="min-h-screen flex items-center justify-center bg-neutral-900 text-neutral-100">
//       <div className="bg-neutral-800 p-8 rounded-xl shadow-xl w-full max-w-md border border-neutral-700">
//         <h1 className="text-2xl font-semibold mb-6 text-center">Login</h1>

//         <form onSubmit={submit} className="space-y-5">
//           {/* Email */}
//           <div>
//             <label className="block text-sm mb-1 text-neutral-300">Email</label>
//             <input
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               placeholder="buyer1@local"
//               className="w-full px-4 py-2 rounded bg-neutral-900 border border-neutral-700
//                          text-neutral-100 placeholder-neutral-500 focus:ring-2 focus:ring-indigo-500"
//             />
//           </div>

//           {/* Password */}
//           <div>
//             <label className="block text-sm mb-1 text-neutral-300">Password</label>
//             <input
//               type="password"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               placeholder="pass123"
//               className="w-full px-4 py-2 rounded bg-neutral-900 border border-neutral-700
//                          text-neutral-100 placeholder-neutral-500 focus:ring-2 focus:ring-indigo-500"
//             />
//           </div>

//           <button
//             type="submit"
//             disabled={busy}
//             className={`w-full py-2 rounded text-white text-center font-medium
//               ${busy ? "bg-indigo-400" : "bg-indigo-600 hover:bg-indigo-700"}`}
//           >
//             {busy ? "Logging in..." : "Login"}
//           </button>
//         </form>

//         <p className="text-neutral-400 text-sm mt-4 text-center">
//           Use your Postman account to login (e.g., buyer1@local / pass123)
//         </p>
//       </div>
//     </main>
//   );
// }
