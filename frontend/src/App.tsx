// import { Routes, Route, Navigate } from "react-router-dom";
// import BuyerCreate from "./pages/BuyerCreate";
// import SellerDashboard from "./pages/SellerDashboard";
// import TxDetail from "./pages/TxDetail";
// import Header from "./components/Header";

// export default function App() {
//   return (
//     <div className="min-h-screen bg-neutral-900">
//       <Header />
//       <Routes>
//         <Route path="/" element={<Navigate to="/buyer/create" replace />} />
//         <Route path="/buyer/create" element={<BuyerCreate />} />
//         <Route path="/seller/dashboard" element={<SellerDashboard />} />
//         <Route path="/tx/:id" element={<TxDetail />} />
//       </Routes>
//     </div>
//   );
// }

import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import BuyerCreate from "./pages/BuyerCreate";
import SellerDashboard from "./pages/SellerDashboard";
import TxDetail from "./pages/TxDetail";
import Header from "./components/Header";

export default function App() {
  return (
    <div className="min-h-screen bg-neutral-900">
      <Header />
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/buyer/create" element={<BuyerCreate />} />
        <Route path="/seller/dashboard" element={<SellerDashboard />} />
        <Route path="/tx/:id" element={<TxDetail />} />
        <Route path="*" element={<div className="p-8">Page not found</div>} />
      </Routes>
    </div>
  );
}


