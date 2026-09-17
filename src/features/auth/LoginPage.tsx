import { useEffect, useRef, useState } from "react";
import type { FormEvent } from "react";
import { ArrowLeft, Eye, EyeOff, KeyRound, LockKeyhole, Mail, Phone, Upload, User, UserPlus } from "lucide-react";
import { useNavigate } from "react-router";
import { useTranslation } from "react-i18next";
import { authApi } from "../../lib/api";
import { useAuthStore } from "./auth.store";

type Mode = "login" | "signup" | "forgot";
type LoginMethod = "password" | "otp";

export default function LoginPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { token, setAuth } = useAuthStore();

  const [mode, setMode] = useState<Mode>("login");
  const [method, setMethod] = useState<LoginMethod>("password");
  const [otpStep, setOtpStep] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [devOtp, setDevOtp] = useState("");
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");

  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [email, setEmail] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [image, setImage] = useState<File | null>(null);

  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (token) navigate("/profile", { replace: true });
  }, [token, navigate]);

  const resetMessages = () => {
    setError("");
    setNotice("");
    setDevOtp("");
  };

  const switchMode = (next: Mode) => {
    setMode(next);
    setOtpStep(false);
    setCode("");
    resetMessages();
    setShowPassword(false);
    setShowNewPassword(false);
  };

  const validateSignup = () => {
    if (!name || !mobile || !email || !age || !gender || !signupPassword || !confirmPassword) {
      throw new Error(t("auth.required"));
    }
    const numericAge = Number(age);
    if (!Number.isInteger(numericAge) || numericAge < 18 || numericAge > 120) {
      throw new Error(t("auth.ageInvalid"));
    }
    if (signupPassword !== confirmPassword) throw new Error(t("auth.passwordMismatch"));
    if (!image) throw new Error(t("auth.profileRequired"));
  };

  async function submit(e: FormEvent) {
    e.preventDefault();
    resetMessages();
    setBusy(true);

    try {
      if (mode === "signup") {
        validateSignup();

        if (!otpStep) {
          const fd = new FormData();
          fd.append("name", name);
          fd.append("mobile", mobile);
          fd.append("email", email);
          fd.append("age", age);
          fd.append("gender", gender);
          fd.append("password", signupPassword);
          fd.append("image", image!);

          const r = await authApi.requestSignupOtp(fd);
          setOtpStep(true);
          setNotice(r.message);
          setDevOtp(r.devOtp || "");
        } else {
          const r = await authApi.verifySignupOtp(mobile, code);
          setAuth(r.token, r.user);
          navigate("/profile", { replace: true });
        }
      } else if (mode === "forgot") {
        if (!identifier) throw new Error(t("auth.required"));

        if (!otpStep) {
          const r = await authApi.requestPasswordReset(identifier);
          setOtpStep(true);
          setNotice(r.message || t("auth.resetSent"));
          setDevOtp(r.devOtp || "");
        } else {
          if (!code || !newPassword || !confirmNewPassword) throw new Error(t("auth.required"));
          if (newPassword !== confirmNewPassword) throw new Error(t("auth.passwordMismatch"));

          await authApi.resetPassword(identifier, code, newPassword);
          setNotice(t("auth.resetSuccess"));
          setMode("login");
          setOtpStep(false);
          setPassword("");
          setNewPassword("");
          setConfirmNewPassword("");
          setCode("");
          setDevOtp("");
        }
      } else if (method === "password") {
        if (!identifier || !password) throw new Error(t("auth.required"));
        const r = await authApi.login(identifier, password);
        setAuth(r.token, r.user);
        navigate("/profile", { replace: true });
      } else if (!otpStep) {
        if (!identifier) throw new Error(t("auth.required"));
        const r = await authApi.requestLoginOtp(identifier);
        setOtpStep(true);
        setNotice(r.message);
        setDevOtp(r.devOtp || "");
      } else {
        const r = await authApi.verifyLoginOtp(identifier, code);
        setAuth(r.token, r.user);
        navigate("/profile", { replace: true });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="gls-login-page">
      <div className="gls-login-reference-bg" aria-hidden="true" />
      <div className="gls-login-reference-overlay">
        <div className="gls-login-reference-card">
          <div className="gls-login-reference-brand" aria-hidden="true">
            <div className="gls-login-tree">
              <img src="/login-tree.png" alt="" />
            </div>
          </div>

          {mode === "forgot" ? (
            <div className="gls-login-form-area">
              <button type="button" className="gls-login-back" onClick={() => switchMode("login")}>
                <ArrowLeft size={17} /> {t("auth.backToLogin")}
              </button>

              <form onSubmit={submit}>
                <label>
                  {t("auth.mobileEmail")}
                  <div className="gls-reference-input">
                    <Phone size={19} />
                    <input
                      value={identifier}
                      onChange={(e) => setIdentifier(e.target.value)}
                      placeholder={t("auth.mobileEmailPlaceholder")}
                      autoComplete="username"
                    />
                  </div>
                </label>

                {otpStep && (
                  <>
                    <label>
                      {t("auth.otp")}
                      <div className="gls-reference-input">
                        <KeyRound size={19} />
                        <input value={code} onChange={(e) => setCode(e.target.value)} inputMode="numeric" maxLength={6} placeholder="6 digit OTP" />
                      </div>
                    </label>
                    <label>
                      {t("auth.newPassword")}
                      <div className="gls-reference-input">
                        <LockKeyhole size={19} />
                        <input
                          type={showNewPassword ? "text" : "password"}
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          placeholder={t("auth.passwordPlaceholder")}
                          autoComplete="new-password"
                        />
                        <button type="button" onClick={() => setShowNewPassword((v) => !v)} aria-label="Toggle password">
                          {showNewPassword ? <EyeOff size={19} /> : <Eye size={19} />}
                        </button>
                      </div>
                    </label>
                    <label>
                      {t("auth.confirmPassword")}
                      <div className="gls-reference-input">
                        <LockKeyhole size={19} />
                        <input
                          type={showNewPassword ? "text" : "password"}
                          value={confirmNewPassword}
                          onChange={(e) => setConfirmNewPassword(e.target.value)}
                          placeholder={t("auth.confirmPasswordPlaceholder")}
                          autoComplete="new-password"
                        />
                      </div>
                    </label>
                  </>
                )}

                {error && <div className="gls-login-error">{error}</div>}
                {notice && <div className="gls-login-notice">{notice}{devOtp && <b> OTP: {devOtp}</b>}</div>}

                <button className="gls-reference-primary" disabled={busy}>
                  {busy ? t("auth.pleaseWait") : otpStep ? t("auth.verifyReset") : t("auth.sendResetOtp")}
                </button>
              </form>
            </div>
          ) : mode === "signup" ? (
            <div className="gls-login-form-area">
              <div className="gls-reference-mode-title">
                <UserPlus size={18} /> {t("auth.signupIntro")}
              </div>

              <form onSubmit={submit}>
                <label>
                  {t("auth.name")}
                  <div className="gls-reference-input">
                    <User size={19} />
                    <input value={name} onChange={(e) => setName(e.target.value)} placeholder={t("auth.namePlaceholder")} />
                  </div>
                </label>

                <div className="gls-reference-two-col">
                  <label>
                    {t("auth.mobile")}
                    <div className="gls-reference-input">
                      <Phone size={19} />
                      <input value={mobile} onChange={(e) => setMobile(e.target.value)} placeholder="10 digit mobile" inputMode="numeric" />
                    </div>
                  </label>
                  <label>
                    {t("auth.age")}
                    <div className="gls-reference-input">
                      <User size={19} />
                      <input type="number" min={18} max={120} value={age} onChange={(e) => setAge(e.target.value)} placeholder={t("auth.agePlaceholder")} />
                    </div>
                  </label>
                </div>

                <div className="gls-reference-two-col">
                  <label>
                    {t("auth.email")}
                    <div className="gls-reference-input">
                      <Mail size={19} />
                      <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="name@example.com" />
                    </div>
                  </label>
                  <label>
                    {t("auth.gender")}
                    <div className="gls-reference-input gls-reference-select">
                      <User size={19} />
                      <select value={gender} onChange={(e) => setGender(e.target.value)}>
                        <option value="">{t("auth.genderSelect")}</option>
                        <option value="male">{t("auth.male")}</option>
                        <option value="female">{t("auth.female")}</option>
                        <option value="other">{t("auth.other")}</option>
                      </select>
                    </div>
                  </label>
                </div>

                <label>
                  {t("auth.password")}
                  <div className="gls-reference-input">
                    <LockKeyhole size={19} />
                    <input type={showPassword ? "text" : "password"} value={signupPassword} onChange={(e) => setSignupPassword(e.target.value)} placeholder={t("auth.passwordPlaceholder")} autoComplete="new-password" />
                    <button type="button" onClick={() => setShowPassword((v) => !v)} aria-label="Toggle password">
                      {showPassword ? <EyeOff size={19} /> : <Eye size={19} />}
                    </button>
                  </div>
                </label>

                <label>
                  {t("auth.confirmPassword")}
                  <div className="gls-reference-input">
                    <LockKeyhole size={19} />
                    <input type={showPassword ? "text" : "password"} value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder={t("auth.confirmPasswordPlaceholder")} autoComplete="new-password" />
                  </div>
                </label>

                <label>
                  {t("auth.profileImage")}
                  <div className="gls-file-input gls-reference-file">
                    <Upload size={19} />
                    <span>{image ? image.name : t("auth.chooseImage")}</span>
                    <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp" onChange={(e) => setImage(e.target.files?.[0] || null)} />
                  </div>
                </label>

                {otpStep && (
                  <label>
                    {t("auth.otp")}
                    <div className="gls-reference-input">
                      <KeyRound size={19} />
                      <input value={code} onChange={(e) => setCode(e.target.value)} inputMode="numeric" maxLength={6} placeholder="6 digit OTP" />
                    </div>
                  </label>
                )}

                {error && <div className="gls-login-error">{error}</div>}
                {notice && <div className="gls-login-notice">{notice}{devOtp && <b> OTP: {devOtp}</b>}</div>}

                <button className="gls-reference-primary" disabled={busy}>
                  {busy ? t("auth.pleaseWait") : otpStep ? t("auth.verifySignup") : t("auth.signup")}
                </button>
              </form>

              <div className="gls-reference-switch">
                {t("auth.loginIntro")}{" "}
                <button type="button" onClick={() => switchMode("login")}>{t("auth.login")}</button>
              </div>
            </div>
          ) : (
            <div className="gls-login-form-area">
              <form onSubmit={submit}>
                <label>
                  {t("auth.mobileEmail")}
                  <div className="gls-reference-input gls-mobile-reference-input">
                    <span className="gls-country-code">+91</span>
                    <input value={identifier} onChange={(e) => setIdentifier(e.target.value)} placeholder="98765 43210" autoComplete="username" />
                  </div>
                </label>

                {method === "password" ? (
                  <label>
                    {t("auth.password")}
                    <div className="gls-reference-input">
                      <LockKeyhole size={19} />
                      <input type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} placeholder={t("auth.passwordPlaceholder")} autoComplete="current-password" />
                      <button type="button" onClick={() => setShowPassword((v) => !v)} aria-label="Toggle password">
                        {showPassword ? <EyeOff size={19} /> : <Eye size={19} />}
                      </button>
                    </div>
                  </label>
                ) : otpStep ? (
                  <label>
                    {t("auth.otp")}
                    <div className="gls-reference-input">
                      <KeyRound size={19} />
                      <input value={code} onChange={(e) => setCode(e.target.value)} inputMode="numeric" maxLength={6} placeholder="6 digit OTP" />
                    </div>
                  </label>
                ) : null}

                {error && <div className="gls-login-error">{error}</div>}
                {notice && <div className="gls-login-notice">{notice}{devOtp && <b> OTP: {devOtp}</b>}</div>}

                <button className="gls-reference-primary" disabled={busy}>
                  {busy ? t("auth.pleaseWait") : method === "otp" ? (otpStep ? t("auth.verifyOtp") : t("auth.sendOtp")) : t("auth.login")}
                </button>
              </form>

              <button type="button" className="gls-reference-otp" onClick={() => { setMethod("otp"); setOtpStep(false); resetMessages(); }}>
                {t("auth.otpLoginReference")}
              </button>

              <button type="button" className="gls-reference-forgot" onClick={() => switchMode("forgot")}>
                {t("auth.forgotPassword")}
              </button>

              <div className="gls-reference-signup">
                <span>{t("auth.noAccount", "Don't have account?")}</span>
                <button type="button" onClick={() => switchMode("signup")}>{t("auth.signup")}</button>
              </div>
            </div>
          )}
        </div>

      </div>
    </main>
  );
}
