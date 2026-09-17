import {  Globe2, Menu, MessageCircle, Scale, X, Landmark, ShieldCheck, Home, FileText, ChevronDown, Check, UserCircle } from "lucide-react";
import { Link, NavLink } from "react-router";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useLanguageStore, type Language } from "../../store/language.store";
import { useAuthStore } from "../../features/auth/auth.store";
import { fileUrl } from "../../lib/api";

const navItems = [
  { key: "home", path: "/", icon: Home },
  { key: "services", path: "/services", icon: Scale },
  { key: "ai", path: "/ai-sahayak", icon: MessageCircle },
  { key: "schemes", path: "/schemes", icon: Landmark },
  { key: "complaints", path: "/complaints", icon: ShieldCheck },
  { key: "documents", path: "/documents", icon: FileText },
  { key: "offices", path: "/offices", icon: Landmark },
] as const;
 
export default function Header() {
  const { t, i18n } = useTranslation();
  const { language, setLanguage } = useLanguageStore();
  const { token, user } = useAuthStore();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [languageOpen, setLanguageOpen] = useState(false);
  const languageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleOutside = (event: MouseEvent) => {
      if (languageRef.current && !languageRef.current.contains(event.target as Node)) {
        setLanguageOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, []);

  const changeLanguage = async (lang: Language) => {
    await i18n.changeLanguage(lang);
    setLanguage(lang);
    document.documentElement.lang = lang;
    setLanguageOpen(false);
    setMobileOpen(false);
  };

  return (
    <>
      <div className="gls-stat-bar">
        <div className="gls-shell gls-stat-inner">
          <span className="gls-approved">{t("header.statApproved")}</span>
          <span className="gls-stat-copy">{t("header.statCopy")}</span>
          <span className="gls-stat-spacer" />
          <span>🔊 {t("header.listen")}</span>
          <span>A−</span><span>A</span><span>A+</span>
          <span className="gls-hotline">{t("header.legalHelp")} <b>15100</b></span>
          <span className="gls-hotline">{t("header.cyberFraud")} <b>1930</b></span>
        </div>
      </div>

      <header className="gls-header">
        <div className="gls-shell gls-nav-shell">
          <Link to="/" className="gls-brand" onClick={() => setMobileOpen(false)}>
            <img src="/gram-legal-logo-reference.png" alt="Gram-Legal Sahayak" />
          </Link>

          <nav className="gls-main-nav" aria-label="Main navigation">
            {navItems.map(({ key, path, icon: Icon }) => (
              <NavLink
                key={path}
                to={path}
                end={path === "/"}
                className={({ isActive }) => `gls-nav-item ${isActive ? "is-active" : ""}`}
              >
                <Icon size={19} strokeWidth={2} />
                <span>{t(`nav.${key}`)}</span>
              </NavLink>
            ))}
          </nav>

          <div className="gls-actions">
            <div className="gls-lang-wrap" ref={languageRef}>
              <button
                type="button"
                className={`gls-lang-trigger ${languageOpen ? "open" : ""}`}
                aria-label={t("header.language")}
                aria-expanded={languageOpen}
                onClick={() => setLanguageOpen(v => !v)}
              >
                <Globe2 size={18} />
                <span>{language === "mr" ? "मराठी" : language === "hi" ? "हिंदी" : "EN"}</span>
                <ChevronDown size={15} />
              </button>
              {languageOpen && (
                <div className="gls-lang-dropdown" role="menu">
                  {(["mr", "hi", "en"] as Language[]).map((lang) => (
                    <button
                      type="button"
                      key={lang}
                      className={language === lang ? "selected" : ""}
                      onClick={() => changeLanguage(lang)}
                      role="menuitem"
                    >
                      <span>{lang === "mr" ? "मराठी" : lang === "hi" ? "हिंदी" : "English"}</span>
                      {language === lang && <Check size={16} />}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <Link className="gls-help" to={token ? "/profile" : "/login"}>{token && user?.profileImage ? <img className="gls-header-avatar" src={fileUrl(user.profileImage)} alt="Profile" /> : <UserCircle size={19} />} <span>{token ? t("header.profile", "Profile") : t("header.help")}</span></Link>
            <Link className="gls-mobile-profile" to={token ? "/profile" : "/login"} aria-label={token ? t("header.profile", "Profile") : t("auth.login", "Login")}>
              {token && user?.profileImage ? <img src={fileUrl(user.profileImage)} alt="Profile" /> : <UserCircle size={22}/>}
            </Link>
            <button className="gls-menu" type="button" aria-label={t("header.menu")} onClick={() => setMobileOpen(v => !v)}>
              {mobileOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {mobileOpen && (
          <div className="gls-mobile-panel">
            <div className="gls-shell gls-mobile-links">
              {navItems.map(({ key, path, icon: Icon }) => (
                <NavLink key={path} to={path} end={path === "/"} onClick={() => setMobileOpen(false)} className="gls-mobile-link">
                  <Icon size={20} />
                  <span>{t(`nav.${key}`)}</span>
                </NavLink>
              ))}
              <NavLink to={token ? "/profile" : "/login"} onClick={() => setMobileOpen(false)} className="gls-mobile-link">
                {token && user?.profileImage ? <img className="gls-mobile-avatar" src={fileUrl(user.profileImage)} alt="Profile" /> : <UserCircle size={20}/>}
                <span>{token ? t("header.profile", "Profile") : t("auth.login", "Login")}</span>
              </NavLink>
            </div>
          </div>
        )}
      </header>
    </>
  );
}
