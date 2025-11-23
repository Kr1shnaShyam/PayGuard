export default function Timeline({ history }: { history: any[] }) {
  return (
    <div>
      {history.map((h, idx) => (
        <div key={idx} style={{ padding: 8, borderBottom: "1px solid #222" }}>
          <div style={{ fontWeight: 600 }}>{h.status}</div>
          <div style={{ fontSize: 12, color: "#aaa" }}>{new Date(h.ts).toLocaleString()}</div>
        </div>
      ))}
    </div>
  );
}
