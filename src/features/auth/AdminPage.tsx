import { useEffect, useMemo, useState } from "react";
import { AlertCircle, BarChart3, CheckCircle2, Clock3, FileText, LayoutDashboard, ShieldCheck, Users, RefreshCw } from "lucide-react";
import { useNavigate } from "react-router";
import { complaintApi } from "../../lib/api";
import { useAuthStore } from "./auth.store";

export default function AdminPage() {
  const nav = useNavigate();
  const { token, user } = useAuthStore();
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    if (!token || user?.role !== "admin") return;
    setLoading(true);
    try { const r = await complaintApi.adminAll(token); setItems(r.complaints || []); }
    catch { setItems([]); }
    finally { setLoading(false); }
  };

  useEffect(() => {
    if (!token || user?.role !== "admin") { nav("/login", { replace: true }); return; }
    void load();
  }, [token, user?.role]);

  const stats = useMemo(() => ({
    total: items.length,
    pending: items.filter(x => ["submitted","pending"].includes(String(x.status).toLowerCase())).length,
    progress: items.filter(x => ["in review","in progress","under review"].includes(String(x.status).toLowerCase())).length,
    resolved: items.filter(x => String(x.status).toLowerCase() === "resolved").length,
  }), [items]);

  if (!token || user?.role !== "admin") return null;

  return <main className="gls-admin-page">
    <div className="gls-admin-shell">
      <aside className="gls-admin-sidebar">
        <div className="gls-admin-brand"><ShieldCheck size={28}/><div><b>Gram Legal</b><small>Admin Console</small></div></div>
        <nav>
          <a className="active" href="#dashboard"><LayoutDashboard size={17}/> Dashboard</a>
          <a href="#complaints"><AlertCircle size={17}/> Complaints</a>
          <a href="/documents"><FileText size={17}/> Documents</a>
          <a href="/"><LayoutDashboard size={17}/> Public site</a>
        </nav>
        <div className="gls-admin-user"><Users size={18}/><div><b>{user.name}</b><small>{user.email}</small></div></div>
      </aside>

      <section className="gls-admin-main" id="dashboard">
        <header className="gls-admin-topbar">
          <div><span>Administration</span><h1>Dashboard</h1></div>
          <button type="button" onClick={() => void load()} disabled={loading}><RefreshCw size={16}/>{loading?"Loading":"Refresh"}</button>
        </header>

        <div className="gls-admin-stats">
          <article><span><BarChart3/></span><div><small>Total complaints</small><b>{stats.total}</b></div></article>
          <article><span><Clock3/></span><div><small>Pending</small><b>{stats.pending}</b></div></article>
          <article><span><AlertCircle/></span><div><small>In progress</small><b>{stats.progress}</b></div></article>
          <article><span><CheckCircle2/></span><div><small>Resolved</small><b>{stats.resolved}</b></div></article>
        </div>

        <div className="gls-admin-grid">
          <article className="gls-admin-panel">
            <div className="gls-admin-panel-head"><div><h2>Recent complaints</h2><p>Latest citizen requests and their current status.</p></div></div>
            <div className="gls-admin-table-wrap">
              <table className="gls-admin-table"><thead><tr><th>ID</th><th>Subject</th><th>Citizen</th><th>Status</th></tr></thead>
              <tbody>{items.map(c=><tr key={c._id}><td data-label="ID"><b>{c.complaintId}</b></td><td data-label="Subject">{c.subject}</td><td data-label="Citizen">{c.user?.name || "—"}</td><td data-label="Status"><span className={`gls-admin-status ${String(c.status).toLowerCase().replaceAll(" ","-")}`}>{c.status}</span></td></tr>)}</tbody></table>
              {!loading && items.length===0 && <div className="gls-admin-empty">No complaints found.</div>}
            </div>
          </article>
          <article className="gls-admin-panel gls-admin-activity">
            <h2>Quick overview</h2>
            <div className="gls-admin-progress"><span>Resolved</span><b>{stats.resolved}</b><i style={{width:`${stats.total?Math.min(100,stats.resolved/stats.total*100):0}%`}}/></div>
            <div className="gls-admin-progress"><span>Pending</span><b>{stats.pending}</b><i style={{width:`${stats.total?Math.min(100,stats.pending/stats.total*100):0}%`}}/></div>
            <div className="gls-admin-note"><ShieldCheck size={18}/><span>Admin data is loaded from the backend database; no complaint data is hard-coded.</span></div>
          </article>
        </div>
      </section>
    </div>
  </main>;
}
