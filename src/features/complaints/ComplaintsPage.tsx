import { useEffect, useState } from "react";
import {
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  Clock3,
  FileText,
  LogIn,
  Search,
  ShieldCheck,
  ClipboardList,
} from "lucide-react";
import { Link } from "react-router";
import { useTranslation } from "react-i18next";
import { complaintApi } from "../../lib/api";
import { useAuthStore } from "../auth/auth.store";

export default function ComplaintsPage() {
  const { t } = useTranslation();
  const { token } = useAuthStore();
  const [listBusy, setListBusy] = useState(false);
  const [listError, setListError] = useState("");
  const [mode, setMode] = useState<"new" | "track">("new");
  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("General");
  const [trackId, setTrackId] = useState("");
  const [tracked, setTracked] = useState<any>(null);
  const [selectedComplaint, setSelectedComplaint] = useState<any>(null);
  const [mine, setMine] = useState<any[]>([]);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  //mine
  useEffect(() => {
    if (!token) {
      setMine([]);
      return;
    }
    setListBusy(true);
    setListError("");
    complaintApi
      .list(token)
      .then((r) => setMine(r.complaints || []))
      .catch((e) => {
        setMine([]);
        setListError(
          e instanceof Error
            ? e.message
            : t("common.error", "Unable to load complaints."),
        );
      })
      .finally(() => setListBusy(false));
  }, [token, t]);
  const create = async () => {
    if (!token) return;
    setBusy(true);
    setMessage("");
    try {
      const r = await complaintApi.create(token, {
        subject,
        description,
        category,
      });
      setMine((x) => [r.complaint, ...x]);
      setSubject("");
      setDescription("");
      setMessage(`${t("page.complaints.success")} ${r.complaint.complaintId}`);
    } catch (e) {
      setMessage(e instanceof Error ? e.message : "Error");
    } finally {
      setBusy(false);
    }
  };
  const track = async () => {
    setBusy(true);
    setMessage("");
    try {
      const r = await complaintApi.track(trackId.trim());
      setTracked(r.complaint);
    } catch (e) {
      setTracked(null);
      setMessage(e instanceof Error ? e.message : "Error");
    } finally {
      setBusy(false);
    }
  };
  return (
    <main className="gls-app-page gls-modern-page">
      <section
        className="gls-page-hero gls-page-hero-complaints"
        style={{
          backgroundImage:
            'linear-gradient(90deg,rgba(255,255,255,.94),rgba(255,255,255,.16)),url("/complaints-hero-reference.jpg")',
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        <div className="gls-shell gls-page-hero-inner">
          <div>
            <div className="gls-breadcrumb">
              {t("nav.home")} <span>›</span> {t("page.complaints.crumb")}
            </div>
            <h1>{t("page.complaints.title")}</h1>
            <p>{t("page.complaints.desc")}</p>
            <div className="gls-feature-pills gls-feature-actions">
              <button type="button" onClick={() => setMode("new")}>
                <span>▣</span>
                {t("page.complaints.pillOnline")}
              </button>
              <button type="button" onClick={() => setMode("track")}>
                <span>◷</span>
                {t("page.complaints.pillTrack")}
              </button>
              <button type="button" onClick={() => setMode("track")}>
                <span>✓</span>
                {t("page.complaints.pillResolve")}
              </button>
              <button type="button" onClick={() => setMode("new")}>
                <span>♢</span>
                {t("page.complaints.pillFast")}
              </button>
            </div>
          </div>
          <div className="gls-art-scene gls-art-woman">
            <ClipboardList size={51} />
            <b>{t("page.complaints.assistantLabel")}</b>
            <small>{t("page.complaints.assistantSub")}</small>
          </div>
        </div>
      </section>
      <section className="gls-shell gls-page-body">
        <div className="gls-toggle">
          <button
            className={mode === "new" ? "active" : ""}
            onClick={() => setMode("new")}
          >
            <FileText size={15} />
            {t("page.complaints.new")}
          </button>
          <button
            className={mode === "track" ? "active" : ""}
            onClick={() => setMode("track")}
          >
            <Search size={15} />
            {t("page.complaints.track")}
          </button>
        </div>
        {!token ? (
          <div
            className="gls-form-card"
            style={{ textAlign: "center", padding: "35px" }}
          >
            <LogIn size={35} color="#078b60" />
            <h2>{t("auth.login")}</h2>
            <p>{t("page.complaints.loginRequired")}</p>
            <Link className="gls-primary-btn" to="/login">
              {t("auth.login")} <ArrowRight size={16} />
            </Link>
          </div>
        ) : (
          <div className="gls-complaint-layout">
            <div className="gls-form-card">
              {mode === "new" ? (
                <>
                  <h2>
                    <FileText size={20} />
                    {t("page.complaints.new")}
                  </h2>
                  <label>
                    {t("page.complaints.type")}
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                    >
                      <option>General</option>
                      <option>Land & Property</option>
                      <option>Government Scheme</option>
                      <option>Documents</option>
                      <option>Cyber Fraud</option>
                    </select>
                  </label>
                  <label>
                    {t("page.complaints.subject")}
                    <input
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      placeholder={t("page.complaints.subjectExample")}
                    />
                  </label>
                  <label>
                    {t("page.complaints.details")}
                    <textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      rows={5}
                    />
                  </label>
                  {message && <div className="gls-login-notice">{message}</div>}
                  <button
                    disabled={busy || !subject || !description}
                    onClick={create}
                    className="gls-primary-btn"
                  >
                    {busy ? t("auth.pleaseWait") : t("page.complaints.submit")}{" "}
                    <ArrowRight size={16} />
                  </button>
                  <div className="gls-side-mini" style={{ marginTop: 14 }}>
                    <ShieldCheck size={18} />
                    <span>{t("page.complaints.help")}</span>
                  </div>
                </>
              ) : (
                <>
                  <h2>
                    <Search size={20} />
                    {t("page.complaints.track")}
                  </h2>
                  <label>
                    {t("page.complaints.number")}
                    <input
                      value={trackId}
                      onChange={(e) => setTrackId(e.target.value)}
                      placeholder={t("page.complaints.trackPlaceholder")}
                    />
                  </label>
                  {message && <div className="gls-login-error">{message}</div>}
                  <button
                    disabled={busy || !trackId}
                    onClick={track}
                    className="gls-primary-btn"
                  >
                    <Search size={17} />
                    {busy ? t("auth.pleaseWait") : t("page.complaints.search")}
                  </button>
                  {tracked && (
                    <div className="gls-status-box">
                      <Clock3 size={22} />
                      <div>
                        <b>
                          {tracked.complaintId} — {tracked.status}
                        </b>
                        <small>{tracked.subject}</small>
                        <small>
                          {tracked.notes || t("page.complaints.helpText")}
                        </small>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
            <aside className="gls-side-card">
              <h3>
                <AlertCircle size={19} />
                {t("page.complaints.recent")}
              </h3>
              {mine.slice(0, 5).map((c) => (
                <button
                  type="button"
                  className="gls-complaint-item"
                  key={c._id}
                  onClick={() => setSelectedComplaint(c)}
                  style={{
                    width: "100%",
                    textAlign: "left",
                    border: "0",
                    cursor: "pointer",
                    background: "transparent",
                  }}
                >
                  <CheckCircle2 size={18} />
                  <div>
                    <b>{c.complaintId}</b>
                    <small>{c.subject}</small>
                    <small>Status: {c.status}</small>
                  </div>
                </button>
              ))}
              {listBusy ? (
                <p>{t("auth.pleaseWait")}</p>
              ) : listError ? (
                <p className="gls-login-error">{listError}</p>
              ) : (
                mine.length === 0 && <p>{t("common.noResults")}</p>
              )}
            </aside>
          </div>
        )}
      </section>
      {selectedComplaint && (
  <div
    style={{
      position: "fixed",
      inset: 0,
      background: "rgba(0,0,0,.45)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "20px",
      zIndex: 1000,
    }}
    onClick={() => setSelectedComplaint(null)}
  >
    <div
      className="gls-form-card"
      style={{
        width: "100%",
        maxWidth: "650px",
        maxHeight: "90vh",
        overflowY: "auto",
      }}
      onClick={e => e.stopPropagation()}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "15px",
        }}
      >
        <h2>
          <FileText size={20}/>
          Complaint Details
        </h2>

        <button
          type="button"
          onClick={() => setSelectedComplaint(null)}
          className="gls-secondary-btn"
        >
          Close
        </button>
      </div>

      <div style={{ marginTop: "20px" }}>
        <p>
          <b>Complaint ID:</b>{" "}
          {selectedComplaint.complaintId}
        </p>

        <p>
          <b>Category:</b>{" "}
          {selectedComplaint.category || "General"}
        </p>

        <p>
          <b>Status:</b>{" "}
          {selectedComplaint.status || "Submitted"}
        </p>

        <p>
          <b>Subject:</b>{" "}
          {selectedComplaint.subject}
        </p>

        <p>
          <b>Description:</b>
        </p>

        <div className="gls-status-box">
          {selectedComplaint.description}
        </div>

        <p style={{ marginTop: "15px" }}>
          <b>Admin Reply / Notes:</b>
        </p>

        <div className="gls-status-box">
          {selectedComplaint.notes
            ? selectedComplaint.notes
            : "No reply or notes yet."}
        </div>

        {selectedComplaint.createdAt && (
          <small style={{ display: "block", marginTop: "15px" }}>
            Submitted:{" "}
            {new Date(
              selectedComplaint.createdAt
            ).toLocaleString()}
          </small>
        )}
      </div>
    </div>
  </div>
)}
    </main>
  );
}
