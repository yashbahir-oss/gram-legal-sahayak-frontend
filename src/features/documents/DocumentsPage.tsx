import { Download, FileText, Search, Upload, HelpCircle, ArrowRight, CheckCircle2, Eye } from "lucide-react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { contentApi, fileUrl } from "../../lib/api";

export default function DocumentsPage(){
  const {t}=useTranslation();
  const [q,setQ]=useState("");
  const [draft,setDraft]=useState("");
  const [docs,setDocs]=useState<any[]>([]);
  const [busy,setBusy]=useState(true);
  const [error,setError]=useState("");

  const load=async(query="")=>{
    setBusy(true); setError("");
    try{ const r=await contentApi.documents(query); setDocs(r.documents||[]); }
    catch(e){ setDocs([]); setError(e instanceof Error?e.message:t("common.error","Unable to load documents. Please try again.")); }
    finally{setBusy(false)}
  };
  useEffect(()=>{void load();},[]);
  const search=()=>{const next=draft.trim();setQ(next);void load(next);};
  const preset=(text:string)=>{setDraft(text);setQ(text.trim());void load(text.trim());};

  return <main className="gls-app-page gls-modern-page">
    <section className="gls-page-hero gls-page-hero-docs" style={{backgroundImage:'linear-gradient(90deg,rgba(255,255,255,.94),rgba(255,255,255,.16)),url("/documents-hero-reference.jpg")',backgroundSize:"cover",backgroundPosition:"center",backgroundRepeat:"no-repeat"}}>
      <div className="gls-shell gls-page-hero-inner"><div><div className="gls-breadcrumb">{t("nav.home")} <span>›</span> {t("page.documents.crumb")}</div><h1>{t("page.documents.title")}</h1><p>{t("page.documents.desc")}</p><div className="gls-feature-pills gls-feature-actions"><button type="button" onClick={()=>document.getElementById("documents-list")?.scrollIntoView({behavior:"smooth"})}><span>⇩</span>{t("page.documents.download")}</button><button type="button" onClick={()=>preset(t("page.documents.apply"))}><span>▣</span>{t("page.documents.apply")}</button><button type="button" onClick={()=>preset(t("page.documents.check"))}><span>✓</span>{t("page.documents.check")}</button><button type="button" onClick={()=>preset(t("page.documents.info"))}><span>ⓘ</span>{t("page.documents.info")}</button></div></div></div>
    </section>
    <section className="gls-shell gls-page-body" id="documents-list">
      <form className="gls-searchbar gls-large-search gls-document-search" onSubmit={e=>{e.preventDefault();search();}}>
        <Search size={19}/><input value={draft} onChange={e=>setDraft(e.target.value)} placeholder={t("page.documents.search")} aria-label={t("page.documents.search")}/><button type="submit" disabled={busy}>{busy?t("auth.pleaseWait"):t("page.documents.searchButton",t("page.documents.search"))}</button>
      </form>
      <div className="gls-doc-toolbar"><div><span>{q?t("page.documents.searchResults","Search results"):t("page.documents.all")}</span> <b>{busy?"…":docs.length}</b></div><em>{busy?t("auth.pleaseWait"):t("page.documents.count")}</em></div>
      {error&&<div className="gls-error-state" role="alert">{error}<button type="button" onClick={()=>void load(q)}>{t("common.retry","Retry")}</button></div>}
      <div className="gls-doc-layout"><div>
        {busy?<div className="gls-loading-state">{t("auth.pleaseWait")}</div>:<div className="gls-doc-reference-grid">{docs.map((d,i)=><article className="gls-doc-card" key={d._id||i}><div className="gls-doc-icon"><FileText size={24}/></div><div className="gls-doc-copy"><h3>{d.title}</h3><small>{d.category||t("page.documents.pdf")} {d.fileName?`• ${d.fileName}`:""}</small>{d.description&&<p>{d.description}</p>}<div className="gls-doc-actions">{d.fileUrl&&<><a href={fileUrl(d.fileUrl)} target="_blank" rel="noreferrer" className="gls-doc-action"><Eye size={14}/>{t("page.documents.view")}</a><a href={fileUrl(d.fileUrl)} download={d.fileName||undefined} className="gls-primary-btn gls-doc-download">{t("page.documents.download")} <Download size={14}/></a></>}</div></div></article>)}</div>}
        {!busy&&!error&&docs.length===0&&<div className="gls-form-card gls-empty-filter">{q?t("common.noResults"):t("page.documents.noDocuments")}</div>}
      </div><aside className="gls-side-card"><h3><HelpCircle size={19}/>{t("page.documents.quick")}</h3>{["q1","q2","q3","q4"].map(k=><button type="button" className="gls-tip gls-tip-button" key={k} onClick={()=>preset(t(`page.documents.${k}`))}><span>?</span>{t(`page.documents.${k}`)}</button>)}<img className="gls-doc-photo" src="/gram-legal-awareness-banner.jpg" alt=""/><div className="gls-upload-box"><Upload size={20}/><b>{t("page.documents.apply")}</b><small>{t("page.documents.check")}</small></div></aside></div><div className="gls-help-banner"><div className="gls-banner-icon"><CheckCircle2 size={24}/></div><div><b>{t("page.documents.info")}</b><small>{t("page.documents.check")}</small></div><ArrowRight size={17}/></div>
    </section>
  </main>
}
