import { ArrowRight, FileText, Landmark, MessageCircle, ShieldCheck, Smartphone, Users, Search, Sprout, Heart, GraduationCap, BriefcaseBusiness, House, Building2 } from "lucide-react";
import { Link } from "react-router";
import { useTranslation } from "react-i18next";
import { useMemo, useState } from "react";
import type { LucideIcon } from "lucide-react";

type Category = "all" | "farmer" | "women" | "education" | "health" | "business" | "land" | "social" | "other";
const services = [
  { key: "property", icon: Landmark, path: "/services/property", tone: "green", categories: ["farmer","land"] as Category[] },
  { key: "inheritance", icon: Users, path: "/services/inheritance", tone: "pink", categories: ["women","social"] as Category[] },
  { key: "consumer", icon: ShieldCheck, path: "/services/consumer", tone: "blue", categories: ["health"] as Category[] },
  { key: "cyberFraud", icon: Smartphone, path: "/cyber-fraud", tone: "purple", categories: ["business","other"] as Category[] },
  { key: "agreements", icon: FileText, path: "/services/agreements", tone: "orange", categories: ["business"] as Category[] },
  { key: "schemes", icon: Sprout, path: "/schemes", tone: "sky", categories: ["farmer","education","social"] as Category[] },
  { key: "documents", icon: FileText, path: "/documents", tone: "rose", categories: ["education","social","other"] as Category[] },
  { key: "offices", icon: Building2, path: "/offices", tone: "teal", categories: ["land","other"] as Category[] },
] as const;
const sideItems: [Category,string,number,LucideIcon][] = [
  ["all", "all", 24, House], ["farmer", "farmer", 6, Sprout], ["women", "women", 5, Heart],
  ["education", "education", 4, GraduationCap], ["health", "health", 3, ShieldCheck], ["business", "business", 3, BriefcaseBusiness], ["land", "land", 2, Landmark], ["social", "social", 2, Users], ["other", "other", 1, FileText],
];

export default function ServicesPage() {
  const { t } = useTranslation();
  const [q, setQ] = useState("");
  const [category, setCategory] = useState<Category>("all");
  const labels = sideItems.map(([key]) => ({ key, label: t(`servicesPage.sidebar.${key}`) }));
  const filtered = useMemo(() => services.filter(item => {
    const title = t(`servicesPage.items.${item.key}.title`).toLowerCase();
    const desc = t(`servicesPage.items.${item.key}.description`).toLowerCase();
    const matchesCategory = category === "all" || item.categories.includes(category);
    return matchesCategory && (!q.trim() || `${title} ${desc}`.includes(q.toLowerCase().trim()));
  }), [q, category, t]);
  const selectCategory = (key: Category) => { setCategory(key); document.getElementById("service-list")?.scrollIntoView({ behavior: "smooth", block: "start" }); };
  return (
    <main className="gls-app-page gls-modern-page">
      <section className="gls-page-hero gls-services-hero gls-photo-hero" style={{backgroundImage:'linear-gradient(90deg,rgba(4,42,38,.88),rgba(4,42,38,.20)),url("/services-hero-reference.jpg")',backgroundSize:"cover",backgroundPosition:"center",backgroundRepeat:"no-repeat"}}>
        <div className="gls-photo-overlay" /><div className="gls-shell gls-services-hero-inner gls-photo-hero-content">
          <div className="gls-breadcrumb">{t("nav.home")} <span>›</span> {t("servicesPage.badge")}</div><h1>{t("servicesPage.title")}</h1><p>{t("servicesPage.description")}</p>
          <a href="#service-list" className="gls-hero-search-btn"><Search size={18}/>{t("servicesPage.searchButton")} <ArrowRight size={16}/></a>
        </div>
      </section>
      <section className="gls-shell gls-page-body gls-services-reference-body" id="service-list">
        <div className="gls-services-reference-layout">
          <aside className="gls-service-sidebar">
            <div className="gls-sidebar-title"><FileText size={19}/><b>{t("servicesPage.sidebarTitle")}</b></div>
            {sideItems.map(([key, , count, Icon]) => <button type="button" className={category===key?"active":""} key={key} onClick={()=>selectCategory(key)}><span className="gls-sidebar-icon"><Icon size={17}/></span><span>{t(`servicesPage.sidebar.${key}`)}</span><em>{count}</em></button>)}
            <div className="gls-sidebar-ai"><MessageCircle size={24}/><b>{t("servicesPage.sidebarAiTitle")}</b><p>{t("servicesPage.sidebarAiText")}</p><Link to="/ai-sahayak">{t("servicesPage.sidebarAiAction")} <ArrowRight size={15}/></Link></div>
          </aside>
          <div className="gls-services-main">
            <div className="gls-reference-heading gls-services-heading"><div><span>{t("servicesPage.list.eyebrow")}</span><h2>{t("servicesPage.list.title")}</h2><p>{t("servicesPage.list.description")}</p></div><Link to="/ai-sahayak" className="gls-outline-pill"><MessageCircle size={15}/> {t("servicesPage.cta.action")}</Link></div>
            <div className="gls-service-search-box"><Search size={19}/><input value={q} onChange={e=>setQ(e.target.value)} placeholder={t("servicesPage.searchPlaceholder")}/><button type="button" onClick={()=>setQ(q.trim())}>{t("servicesPage.searchButton")}</button></div>
            <div className="gls-category-pills">{labels.map(({key,label})=><button type="button" className={category===key?"active":""} key={key} onClick={()=>selectCategory(key)}>{label}</button>)}</div>
            <div className="gls-popular-row"><h2><span>☆</span>{t("servicesPage.popularTitle")}</h2><span>{filtered.length} {t("servicesPage.available")}</span></div>
            <div className="gls-service-reference-grid gls-service-reference-grid-4">{filtered.map(({key,icon:Icon,path,tone})=><Link to={path} className={`gls-reference-service-card ${tone}`} key={key}><div className="gls-reference-service-icon"><Icon size={24}/></div><h3>{t(`servicesPage.items.${key}.title`)}</h3><p>{t(`servicesPage.items.${key}.description`)}</p><span>{t("servicesPage.learnMore")} <ArrowRight size={15}/></span></Link>)}</div>
            {filtered.length===0 && <div className="gls-form-card gls-empty-filter">{t("common.noResults")}</div>}
            <div className="gls-help-banner"><div className="gls-banner-icon"><MessageCircle size={25}/></div><div><b>{t("servicesPage.cta.title")}</b><small>{t("servicesPage.cta.description")}</small></div><Link to="/ai-sahayak">{t("servicesPage.cta.action")} <ArrowRight size={17}/></Link></div>
          </div>
        </div>
      </section>
    </main>
  );
}
