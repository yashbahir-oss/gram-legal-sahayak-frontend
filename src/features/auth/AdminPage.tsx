import { useEffect, useState } from "react";
import { ShieldCheck } from "lucide-react";
import { useNavigate } from "react-router";
import { complaintApi } from "../../lib/api";
import { useAuthStore } from "./auth.store";
export default function AdminPage(){const nav=useNavigate();const {token,user}=useAuthStore();const [items,setItems]=useState<any[]>([]);useEffect(()=>{if(!token||user?.role!=="admin"){nav("/login",{replace:true});return;}complaintApi.adminAll(token).then(r=>setItems(r.complaints)).catch(()=>setItems([]));},[token,user,nav]);if(!token||user?.role!=="admin")return null;return <main className="gls-profile-page"><div className="gls-shell gls-admin-card"><h1><ShieldCheck size={24}/> Admin Dashboard</h1><p>Complaints: {items.length}</p>{items.map(c=><article key={c._id}><b>{c.complaintId}</b><span>{c.subject}</span><small>{c.status}</small></article>)}</div></main>}
