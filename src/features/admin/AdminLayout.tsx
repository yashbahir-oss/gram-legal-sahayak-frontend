import { useEffect, useRef, useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router";
import { Bell, ChevronDown, Globe2, LayoutDashboard, Menu, MessageSquareWarning, Users, FileText, Building2, Landmark, Bot, BarChart3, Settings, Search, X, LogOut, ShieldCheck } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useAuthStore } from "../auth/auth.store";
import { useLanguageStore, type Language } from "../../store/language.store";
import { adminApi } from "../../lib/api";
import { fileUrl } from "../../lib/api";

const links = [
  ["dashboard","/admin/dashboard",LayoutDashboard],
  ["complaints","/admin/complaints",MessageSquareWarning],
  ["users","/admin/users",Users],
  ["documents","/admin/documents",FileText],
  ["offices","/admin/offices",Building2],
  ["schemes","/admin/schemes",Landmark],
  ["ai","/admin/ai",Bot],
  ["analytics","/admin/analytics",BarChart3],
  ["settings","/admin/settings",Settings],
] as const;

export default function AdminLayout(){
  const { t, i18n } = useTranslation();
  const nav = useNavigate();
  const { token, user, logout } = useAuthStore();
  const { language, setLanguage } = useLanguageStore();
  const [open,setOpen]=useState(false);
  const [langOpen,setLangOpen]=useState(false);
  const [profileOpen,setProfileOpen]=useState(false);
  const [search,setSearch]=useState("");
  const [noticeCount,setNoticeCount]=useState(0);
  const langRef=useRef<HTMLDivElement>(null);

  useEffect(()=>{
    if(!token || user?.role!=="admin"){ nav("/login",{replace:true}); return; }
    adminApi.stats().then(s=>setNoticeCount(s.complaintsByStatus.pending)).catch(()=>setNoticeCount(0));
  },[token,user?.role,nav]);

  useEffect(()=>{
    const fn=(e:MouseEvent)=>{ if(langRef.current && !langRef.current.contains(e.target as Node)) setLangOpen(false); };
    document.addEventListener("mousedown",fn); return()=>document.removeEventListener("mousedown",fn);
  },[]);

  const changeLanguage=async(lang:Language)=>{
    await i18n.changeLanguage(lang); setLanguage(lang); document.documentElement.lang=lang; setLangOpen(false);
  };
  const logoutAdmin=async()=>{ try{ await import("../../lib/api").then(m=>m.authApi.logout()); }catch{} logout(); nav("/login",{replace:true}); };

  if(!token || user?.role!=="admin") return null;
  return <div className="gls-admin-app">
    <aside className={`gls-admin-sidebar-v2 ${open?"is-open":""}`}>
      <div className="gls-admin-brand-v2">
        <div className="gls-admin-logo-v2"><ShieldCheck size={25}/></div>
        <div><b>Gram Legal</b><small>Sahayak</small><em>Admin Panel</em></div>
        <button className="gls-admin-close" onClick={()=>setOpen(false)}><X size={19}/></button>
      </div>
      <nav>
        {links.map(([key,path,Icon])=><NavLink key={path} to={path} onClick={()=>setOpen(false)} className={({isActive})=>`gls-admin-nav-v2 ${isActive?"active":""}`}><Icon size={18}/><span>{t(`admin.nav.${key}`)}</span>{key==="complaints"&&noticeCount>0?<b>{noticeCount}</b>:null}</NavLink>)}
      </nav>
      <div className="gls-admin-side-profile">
        {user.profileImage?<img src={fileUrl(user.profileImage)} alt="" />:<div><Users size={18}/></div>}
        <span><b>{user.name}</b><small>{user.email}</small></span>
        <button onClick={()=>setProfileOpen(v=>!v)}><ChevronDown size={16}/></button>
      </div>
      {profileOpen&&<div className="gls-admin-side-menu"><NavLink to="/admin/settings">{t("admin.profile.settings")}</NavLink><button onClick={logoutAdmin}><LogOut size={15}/>{t("admin.profile.logout")}</button></div>}
    </aside>
    {open&&<button className="gls-admin-backdrop" aria-label="close" onClick={()=>setOpen(false)}/>}
    <section className="gls-admin-content-v2">
      <header className="gls-admin-header-v2">
        <button className="gls-admin-menu-btn" onClick={()=>setOpen(true)}><Menu size={22}/></button>
        <div className="gls-admin-search"><Search size={17}/><input value={search} onChange={e=>setSearch(e.target.value)} placeholder={t("admin.header.search")}/></div>
        <div className="gls-admin-header-actions">
          <div className="gls-admin-language" ref={langRef}>
            <button onClick={()=>setLangOpen(v=>!v)}><Globe2 size={18}/><span>{language==="mr"?"मराठी":language==="hi"?"हिन्दी":"English"}</span><ChevronDown size={14}/></button>
            {langOpen&&<div className="gls-admin-language-menu">{(["mr","en","hi"] as Language[]).map(l=><button key={l} className={language===l?"selected":""} onClick={()=>changeLanguage(l)}>{l==="mr"?"मराठी":l==="hi"?"हिन्दी":"English"}</button>)}</div>}
          </div>
          <button className="gls-admin-bell" title={t("admin.header.notifications")} onClick={()=>nav("/admin/complaints")}><Bell size={19}/>{noticeCount>0&&<b>{noticeCount}</b>}</button>
          <div className="gls-admin-head-profile" onClick={()=>nav("/admin/settings")}>
            {user.profileImage?<img src={fileUrl(user.profileImage)} alt="" />:<div><Users size={17}/></div>}
            <span><b>{user.name}</b><small>Administrator</small></span>
            <ChevronDown size={15}/>
          </div>
        </div>
      </header>
      <main className="gls-admin-page-content"><Outlet /></main>
    </section>
  </div>;
}
