import { useRef, useState } from "react";
import { Camera, FileText, LogOut, MessageSquare, Save,  ShieldCheck } from "lucide-react";
import { Link, useNavigate } from "react-router";
import { useTranslation } from "react-i18next";
import { authApi, fileUrl, uploadProfileImage } from "../../lib/api";
import { useAuthStore } from "./auth.store";

export default function ProfilePage() {
  const { t } = useTranslation();
  const nav = useNavigate();
  const { token, user, setAuth, logout } = useAuthStore();
  const [name, setName] = useState(user?.name || "");
  const [mobile, setMobile] = useState(user?.mobile || "");
  const [email, setEmail] = useState(user?.email || "");
  const [saving, setSaving] = useState(false);
  const [otpBusy, setOtpBusy] = useState(false);
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [devOtp, setDevOtp] = useState("");
  const [msg, setMsg] = useState("");
  const ref = useRef<HTMLInputElement>(null);

  if (!token || !user) { nav("/login", { replace: true }); return null; }

  const contactChanged = mobile.trim() !== (user.mobile || "") || email.trim().toLowerCase() !== (user.email || "").toLowerCase();

  const upload = async (file: File) => {
    try {
      const r = await uploadProfileImage(token, file);
      setAuth(token, r.user);
      setMsg(t("profile.imageSaved"));
    } catch (e) { setMsg(e instanceof Error ? e.message : "Error"); }
  };

  const sendOtp = async () => {
    if (!user.mobile && !user.email) { setMsg("A verified mobile/email is required."); return; }
    setOtpBusy(true); setMsg("");
    try {
      const r = await authApi.requestLoginOtp(user.mobile || user.email || "");
      setOtpSent(true); setDevOtp(r.devOtp || "");
      setMsg(t("auth.otpSent", "OTP sent. Enter it to confirm contact changes."));
    } catch (e) { setMsg(e instanceof Error ? e.message : "Unable to send OTP"); }
    finally { setOtpBusy(false); }
  };

  const save = async () => {
    if (contactChanged && !otp) {
      setMsg(t("auth.otpRequired", "OTP is required when changing mobile number or email."));
      return;
    }
    setSaving(true); setMsg("");
    try {
      const r = await authApi.update(token, { name, mobile, email, ...(contactChanged ? { otp } : {}) });
      setAuth(token, r.user); setOtp(""); setOtpSent(false); setDevOtp("");
      setMsg(t("profile.saved"));
    } catch (e) { setMsg(e instanceof Error ? e.message : "Error"); }
    finally { setSaving(false); }
  };

  return <main className="gls-profile-page">
    <div className="gls-shell gls-profile-card">
      <div className="gls-profile-top">
        <div className="gls-profile-avatar">
          {user.profileImage ? <img src={fileUrl(user.profileImage)} alt="Profile" /> : <img src="/login-tree.png" alt="Default profile" />}
          <button type="button" onClick={() => ref.current?.click()} aria-label={t("auth.chooseImage")}><Camera size={15}/></button>
          <input ref={ref} hidden type="file" accept="image/jpeg,image/png,image/webp" onChange={e => { const f=e.target.files?.[0]; if(f) void upload(f); }}/>
        </div>
        <div><h1>{t("profile.title")}</h1><p>{t("profile.welcome")}, {user.name}</p><span className="gls-role">{user.role}</span></div>
      </div>

      <div className="gls-profile-form">
        <label>{t("auth.name")}<input value={name} onChange={e=>setName(e.target.value)}/></label>
        <label>{t("auth.mobile")}<input value={mobile} onChange={e=>setMobile(e.target.value)}/></label>
        <label>{t("auth.email")}<input value={email} onChange={e=>setEmail(e.target.value)}/></label>

        {contactChanged && <div className="gls-otp-panel">
          <div><ShieldCheck size={18}/><span>{t("auth.otpRequired","OTP verification required for contact changes.")}</span></div>
          <button type="button" onClick={() => void sendOtp()} disabled={otpBusy} className="gls-secondary-btn">
            {otpBusy ? t("auth.pleaseWait") : t("auth.sendOtp")}
          </button>
          {otpSent && <label>{t("auth.otp")}<input value={otp} onChange={e=>setOtp(e.target.value)} inputMode="numeric" maxLength={6} placeholder="6 digit OTP"/></label>}
          {devOtp && <small>Development OTP: <b>{devOtp}</b></small>}
        </div>}

        <button onClick={() => void save()} disabled={saving} className="gls-primary-btn">
          <Save size={16}/>{saving?t("auth.pleaseWait"):t("profile.save")}
        </button>
        {msg&&<p className="gls-login-notice">{msg}</p>}
      </div>

      <div className="gls-profile-links">
        <Link to="/complaints"><MessageSquare size={18}/>{t("nav.complaints")}</Link>
        <Link to="/documents"><FileText size={18}/>{t("nav.documents")}</Link>
        <button onClick={async()=>{try{await authApi.logout()}catch{} logout();nav("/")}}><LogOut size={18}/>{t("profile.logout")}</button>
      </div>
    </div>
  </main>;
}
