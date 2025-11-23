import { Link } from "react-router-dom";

export default function Header() {
  return (
    <header className="bg-neutral-800/60 border-b border-neutral-700">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold">PG</div>
          <div>
            <div className="text-base font-semibold">PayGuard</div>
            <div className="text-xs text-neutral-400">Escrow payments demo</div>
          </div>
        </Link>

        <nav className="flex items-center gap-4">
          <Link to="/buyer/create" className="text-sm text-neutral-200 hover:text-white">Create</Link>
          <Link to="/seller/dashboard" className="text-sm text-neutral-200 hover:text-white">Seller</Link>
        </nav>
      </div>
    </header>
  );
}
