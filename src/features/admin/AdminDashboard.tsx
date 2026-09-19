import { useEffect, useMemo, useState } from "react";
import { AlertCircle, Building2, CheckCircle2, FileText, RefreshCw, Users, ArrowUpRight } from "lucide-react";
import { useTranslation } from "react-i18next";
import { adminApi, type AdminStats } from "../../lib/api";
import { Link } from "react-router";

export default function AdminDashboard(){
 const {t}=useTranslation();
 const [stats,setStats]=useState<AdminStats|null>(null); const [trend,setTrend]=useState<{date:string,count:number}[]>([]); const [loading,setLoading]=useState(true);
 const load=async()=>{setLoading(true);try{const [s,tr]=await Promise.all([adminApi.stats(),adminApi.complaintsTrend(14)]);setStats(s);setTrend(tr.trend)}finally{setLoading(false)}};
 useEffect(()=>{void load()},[]);
 const max=Math.max(1,...trend.map(x=>x.count));
 const points=useMemo(()=>trend.map((x,i)=>`${(i/Math.max(1,trend.length-1))*100},${100-(x.count/max)*82}`).join(" "),[trend,max]);
 const cards=stats?[{label:t("admin.stats.complaints"),value:stats.totalComplaints,icon:AlertCircle,cls:"blue",to:"/admin/complaints"},{label:t("admin.stats.users"),value:stats.totalUsers,icon:Users,cls:"green",to:"/admin/users"},{label:t("admin.stats.offices"),value:stats.totalOffices,icon:Building2,cls:"orange",to:"/admin/offices"},{label:t("admin.stats.documents"),value:stats.totalDocuments,icon:FileText,cls:"purple",to:"/admin/documents"}]:[];
 return <div>
   <div className="gls-admin-welcome"><div><p>{t("admin.dashboard.eyebrow")}</p><h1>{t("admin.dashboard.title")}</h1><span>{t("admin.dashboard.subtitle")}</span></div><button onClick={()=>void load()} disabled={loading} className="gls-admin-refresh"><RefreshCw size={16} className={loading?"spin":""}/>{t("admin.common.refresh")}</button></div>
   <div className="gls-admin-stat-grid">{cards.map(c=>{const I=c.icon;return <Link to={c.to} key={c.label} className={`gls-admin-stat-card ${c.cls}`}><span><I size={21}/></span><div><small>{c.label}</small><strong>{loading?"…":c.value}</strong></div><ArrowUpRight size={16}/></Link>})}</div>
   <div className="gls-admin-dashboard-grid">
    <section className="gls-admin-card-v2"><div className="gls-admin-card-head"><div><h2>{t("admin.dashboard.complaintFlow")}</h2><p>{t("admin.dashboard.realData")}</p></div></div><div className="gls-admin-chart"><svg viewBox="0 0 100 100" preserveAspectRatio="none"><polyline points={points||"0,100 100,100"} fill="none" stroke="currentColor" strokeWidth="2.4" vectorEffect="non-scaling-stroke"/></svg><div className="gls-admin-chart-labels">{trend.filter((_,i)=>i%3===0).map(x=><span key={x.date}>{x.date.slice(5)}</span>)}</div></div></section>
    <section className="gls-admin-card-v2"><div className="gls-admin-card-head"><h2>{t("admin.dashboard.status")}</h2></div><div className="gls-admin-status-grid">{stats&&Object.entries(stats.complaintsByStatus).map(([k,v])=><div key={k}><i className={`status-dot ${k}`}></i><span>{t(`admin.status.${k}`)}</span><b>{v}</b></div>)}</div><div className="gls-admin-total-circle"><strong>{stats?.totalComplaints??0}</strong><span>{t("admin.stats.complaints")}</span></div></section>
   </div>
   <div className="gls-admin-dashboard-grid bottom">
    <section className="gls-admin-card-v2"><div className="gls-admin-card-head"><div><h2>{t("admin.dashboard.recent")}</h2><p>{t("admin.dashboard.latest")}</p></div><Link to="/admin/complaints">{t("admin.common.viewAll")}</Link></div><div className="gls-admin-recent">{stats?.recentComplaints?.length?stats.recentComplaints.map(c=><Link to="/admin/complaints" key={c._id}><span className="complaint-avatar">{String(c.subject||"?").slice(0,1)}</span><div><b>{c.subject}</b><small>{c.complaintId} · {c.user?.name||"—"}</small></div><em>{c.status}</em></Link>):<div className="gls-admin-empty-v2">{t("admin.common.noComplaints")}</div>}</div></section>
    <section className="gls-admin-card-v2"><div className="gls-admin-card-head"><h2>{t("admin.dashboard.quickActions")}</h2></div><div className="gls-admin-quick"><Link to="/admin/complaints"><AlertCircle size={18}/>{t("admin.quick.complaints")}</Link><Link to="/admin/users"><Users size={18}/>{t("admin.quick.users")}</Link><Link to="/admin/documents"><FileText size={18}/>{t("admin.quick.documents")}</Link><Link to="/admin/offices"><Building2 size={18}/>{t("admin.quick.offices")}</Link></div><div className="gls-admin-system"><CheckCircle2 size={17}/><span>{t("admin.dashboard.systemLive")}</span></div></section>
   </div>
 </div>
}
