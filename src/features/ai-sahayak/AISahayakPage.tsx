import { useState } from "react";
import { Bot, FileText, MessageCircle, Send, ShieldCheck, Sparkles, ArrowRight, Scale } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router";
import { aiApi } from "../../lib/api";
import { useAuthStore } from "../auth/auth.store";

export default function AISahayakPage() {
  const { t } = useTranslation();
  const [msg,setMsg]=useState(""); const [answer,setAnswer]=useState(""); const [busy,setBusy]=useState(false); const {token}=useAuthStore();
  const questions=["q1","q2","q3","q4"];
  const ask=async(text=msg)=>{if(!text.trim())return;if(!token){setAnswer(t("page.ai.loginRequired"));return;}setBusy(true);try{const r=await aiApi.ask(token,text.trim());setAnswer(r.answer);setMsg("");}catch(e){setAnswer(e instanceof Error?e.message:t("page.ai.error"));}finally{setBusy(false)}};
  const quick=(key:string)=>{const text=t(`page.ai.${key}`);setMsg(text);void ask(text)};
  return <main className="gls-app-page gls-modern-page">
    <section className="gls-page-hero gls-page-hero-ai" style={{backgroundImage:'linear-gradient(90deg,rgba(255,255,255,.95) 0%,rgba(255,255,255,.80) 42%,rgba(255,255,255,.12) 82%),url("/ai-hero-reference.jpg")',backgroundSize:"cover",backgroundPosition:"center",backgroundRepeat:"no-repeat"}}>
      <div className="gls-shell gls-page-hero-inner"><div><div className="gls-breadcrumb">{t("nav.home")} <span>›</span> {t("page.ai.crumb")}</div><div className="gls-page-title-row"><div className="gls-page-icon"><Bot size={29}/></div><div><h1>{t("page.ai.title")}</h1><p>{t("page.ai.desc")}</p></div></div>
      <div className="gls-feature-pills gls-feature-actions">{[["pill247","q1"],["pillSimple","q2"],["pillDocs","q3"],["pillGuide","q4"]].map(([label,q])=><button type="button" key={label} onClick={()=>quick(q)}><span>✓</span>{t(`page.ai.${label}`)}</button>)}</div></div></div>
    </section>
    <section className="gls-shell gls-page-body"><div className="gls-reference-heading"><div><span>{t("page.ai.suggested")}</span><h2>{t("page.ai.title")}</h2><p>{t("page.ai.desc")}</p></div><div className="gls-live-chip">● {t("page.ai.online")}</div></div>
      <div className="gls-ai-reference-layout"><div className="gls-chat-card"><div className="gls-chat-head"><div className="gls-avatar"><Bot size={21}/></div><div><b>{t("page.ai.title")}</b><small>● {t("page.ai.online")}</small></div></div><div className="gls-chat-body"><div className="gls-bubble">{answer||t("page.ai.desc")}</div><div className="gls-section-label"><Sparkles size={15}/>{t("page.ai.suggested")}</div><div className="gls-question-grid">{questions.map(k=><button type="button" key={k} onClick={()=>quick(k)}>{t(`page.ai.${k}`)}<span>→</span></button>)}</div></div><div className="gls-chat-input"><input value={msg} onChange={e=>setMsg(e.target.value)} placeholder={t("page.ai.search")} onKeyDown={e=>{if(e.key==="Enter")void ask()}}/><button type="button" onClick={()=>void ask()} disabled={busy||!msg.trim()} aria-label={t("page.ai.search")}><Send size={18}/></button></div></div>
      <aside className="gls-side-card"><h3><ShieldCheck size={19}/>{t("page.ai.tips")}</h3>{["tip1","tip2","tip3"].map(k=><button type="button" className="gls-tip gls-tip-button" key={k} onClick={()=>quick(k)}><span>✓</span>{t(`page.ai.${k}`)}</button>)}<Link className="gls-side-mini gls-side-link" to="/documents"><FileText size={18}/><span>{t("page.ai.sideLegal")}<br/><small>{t("page.ai.sideLegalSub")}</small></span><ArrowRight size={15}/></Link><button type="button" className="gls-side-mini gls-side-link" onClick={()=>document.querySelector<HTMLInputElement>(".gls-chat-input input")?.focus()}><MessageCircle size={18}/><span>{t("page.ai.sideAsk")}<br/><small>{t("page.ai.sideAskSub")}</small></span><ArrowRight size={15}/></button></aside></div>
      <div className="gls-info-strip"><Scale size={24}/><div><b>{t("page.ai.noteTitle",t("page.ai.title"))}</b><small>{t("page.ai.note")}</small></div><Link to="/services"><ArrowRight size={17}/></Link></div>
    </section>
  </main>;
}
