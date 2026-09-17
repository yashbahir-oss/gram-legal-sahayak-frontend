import { ArrowRight, Bot, Building2, FileText, Gavel, Landmark, ShieldCheck, Users, WalletCards, ChevronRight } from "lucide-react";
import { Link } from "react-router";
import { useTranslation } from "react-i18next";

const services = [
  { key: "property", icon: Building2, tone: "blue", path: "/services/property" },
  { key: "legal", icon: Gavel, tone: "green", path: "/services/inheritance" },
  { key: "financial", icon: WalletCards, tone: "purple", path: "/cyber-fraud" },
  { key: "schemes", icon: Landmark, tone: "orange", path: "/schemes" },
  { key: "documents", icon: FileText, tone: "sky", path: "/documents" },
  { key: "citizen", icon: Users, tone: "pink", path: "/complaints" },
] as const;

const common = [
  ["land", "/services/property", "⌂"],
  ["mutation", "/services/property", "▣"],
  ["certificates", "/documents", "▤"],
  ["grievance", "/complaints", "♙"],
  ["schemes", "/schemes", "▥"],
] as const;

export default function HomePage() {
  const { t } = useTranslation();
  return (
    <div className="gls-home">
      <section className="gls-hero">
        <div className="gls-hero-art" style={{backgroundImage:'url("/gram-legal-hero.jpg")',backgroundSize:"cover",backgroundPosition:"center",backgroundRepeat:"no-repeat"}} />
        <div className="gls-hero-shade" />
        <div className="gls-shell gls-hero-content">
          <div className="gls-script gls-script-left">{t("homeReference.scriptLeft")}<br/><b>{t("homeReference.scriptLeftBold")}</b></div>
          <div className="gls-script gls-script-right">{t("homeReference.scriptRight")}<br/><b>{t("homeReference.scriptRightBold")}</b></div>
          <div className="gls-hero-center">
            <h1><span>GRAM-</span><em>LEGAL</em><span> SAHAYAK</span></h1>
            <div className="gls-hero-subtitle">{t("homeReference.heroSubtitle")}</div>
            <div className="gls-hero-tag">“{t("homeReference.heroTag")}”</div>
            <Link to="/ai-sahayak" className="gls-ai-banner">
              <span className="gls-ai-round"><Bot size={31}/></span>
              <span className="gls-ai-copy"><b>{t("homeReference.askAi")}</b><small>{t("homeReference.askAiDesc")}</small></span>
              <span className="gls-ai-go"><ArrowRight size={27}/></span>
            </Link>
          </div>
          <div className="gls-aware-box">{t("homeReference.awareCitizen")}<br/><b>{t("homeReference.safeCommunity")}</b><br/>{t("homeReference.prosperousIndia")}</div>
        </div>
      </section>

      <section className="gls-shell gls-home-quickbar">
        <Link to="/services/property"><Building2 size={18}/><span><b>{t("homeReference.quickProperty")}</b><small>{t("homeReference.quickPropertySub")}</small></span><ArrowRight size={15}/></Link>
        <button type="button" onClick={()=>document.querySelector<HTMLElement>(".gls-lang-trigger")?.click()}><Landmark size={18}/><span><b>{t("homeReference.quickLanguage")}</b><small>{t("homeReference.quickLanguageSub")}</small></span><ArrowRight size={15}/></button>
        <Link to="/documents"><FileText size={18}/><span><b>{t("homeReference.quickDocuments")}</b><small>{t("homeReference.quickDocumentsSub")}</small></span><ArrowRight size={15}/></Link>
      </section>

      <main className="gls-shell gls-content">
        <section className="gls-services-grid">
          {services.map(({ key, icon: Icon, tone, path }) => (
            <Link to={path} key={key} className={`gls-service-card ${tone}`}>
              <div className="gls-service-icon"><Icon size={31} /></div>
              <h2>{t(`homeReference.services.${key}.title`)}</h2>
              <p className="gls-service-mr">{t(`homeReference.services.${key}.mr`)}</p>
              <p>{t(`homeReference.services.${key}.desc`)}</p>
              <span className="gls-explore">{t("homeReference.explore")} <ArrowRight size={16}/></span>
            </Link>
          ))}
        </section>

        <section className="gls-three-grid">
          <div className="gls-common-card">
            <div className="gls-card-heading">
              <div><h2>{t("homeReference.common.title")}</h2><p>{t("homeReference.common.desc")}</p></div>
              <Link to="/services" className="gls-small-arrow"><ArrowRight size={20}/></Link>
            </div>
            <div className="gls-common-row">
              {common.map(([key, path, icon]) => (
                <Link to={path} key={key}>
                  <span className="gls-common-icon">{icon}</span>
                  <b>{t(`homeReference.common.items.${key}.title`)}</b>
                  <small>{t(`homeReference.common.items.${key}.sub`)}</small>
                  <ArrowRight size={13}/>
                </Link>
              ))}
            </div>
          </div>

          <div className="gls-awareness">
            <img src="/gram-legal-awareness-banner.jpg" alt="" />
            <div>“{t("homeReference.awareness.line1")}<br/><b>{t("homeReference.awareness.line2")}</b>”</div>
          </div>

          <div className="gls-why-card">
            <div className="gls-why-shield"><ShieldCheck size={24}/></div>
            <div>
              <h2>{t("homeReference.why.title")}</h2>
              {(["trusted", "simple", "multilingual", "verified", "community"] as const).map(key => <p key={key}><ShieldCheck size={14}/>{t(`homeReference.why.${key}`)}</p>)}
            </div>
          </div>
        </section>

        <section className="gls-values">
          {(["accessible", "inclusive", "transparent", "empowered"] as const).map((key, i) => {
            const paths=["/offices","/complaints","/documents","/schemes"];
            return <Link to={paths[i]} key={key}><span>{["♿", "👥", "▣", "☼"][i]}</span><p><b>{t(`homeReference.values.${key}.title`)}</b><small>{t(`homeReference.values.${key}.sub`)}</small></p></Link>;
          })}
          <Link className="gls-scan" to="/services"><span>▦</span><p><b>{t("homeReference.scan.title")}</b><small>{t("homeReference.scan.sub")}</small></p></Link>
          <Link className="gls-together" to="/schemes"><span>🌱</span><p><b>{t("homeReference.together.title")}</b><small>{t("homeReference.together.sub")}</small></p></Link>
        </section>

        <section className="gls-mobile-ai">
          <div><Bot size={22}/><span><b>{t("nav.ai")}</b><small>{t("homeReference.mobileAi")}</small></span></div>
          <Link to="/ai-sahayak">{t("homeReference.ask")} <ChevronRight size={19}/></Link>
        </section>
      </main>

      <div className="gls-mobile-bottom">
        <Link to="/"><span>⌂</span></Link>
        <Link to="/services"><span>⚖</span></Link>
        <Link to="/ai-sahayak" className="main"><Bot size={22}/></Link>
        <Link to="/schemes"><Landmark size={20}/></Link>
        <Link to="/complaints"><Users size={20}/></Link>
      </div>
    </div>
  );
}
