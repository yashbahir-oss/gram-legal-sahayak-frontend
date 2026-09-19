import { Building2, MapPin, Phone, Clock3, Search, Navigation, Landmark, Wheat, ShieldCheck, Users } from "lucide-react";
import {  useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { contentApi } from "../../lib/api";
import type { LucideIcon } from "lucide-react";

const icons: LucideIcon[] = [Building2, Landmark, Wheat, ShieldCheck, Users, Landmark];

type Office = {
  _id?: string;
  name: string;
  district?: string;
  taluka?: string;
  subDistrict?: string;
  address?: string;
  phone?: string;
  timing?: string;
  latitude?: number;
  longitude?: number;
  mapsUrl?: string;
};

export default function OfficesPage() {
  const { t } = useTranslation();

  const [searchText, setSearchText] = useState("");
  const [offices, setOffices] = useState<Office[]>([]);
  const [busy, setBusy] = useState(false);
  const [loadError, setLoadError] = useState("");
  const searchInputRef = useRef<HTMLInputElement | null>(null);

  const search = async () => {
    const query = searchText.trim();

    if (!query) {
      setOffices([]);
      setLoadError("");
      return;
    }

    setBusy(true);
    setLoadError("");

    try {
      const r = await contentApi.offices(query);
      setOffices(r.offices || []);
    } catch (e) {
      setOffices([]);
      setLoadError(
        e instanceof Error
          ? e.message
          : t("common.error", "Unable to load offices.")
      );
    } finally {
      setBusy(false);
    }
  };

  const handleSearchKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Enter") {
      e.preventDefault();
      void search();
    }
  };

  const mapOffice = offices[0];

  const mapQuery =
    mapOffice?.latitude !== undefined &&
    mapOffice?.longitude !== undefined
      ? `${mapOffice.latitude},${mapOffice.longitude}`
      : `${mapOffice?.name || ""} ${mapOffice?.address || ""}`;

  const embed = mapOffice
    ? `https://www.google.com/maps?q=${encodeURIComponent(mapQuery)}&z=13&output=embed`
    : "";

  const openMap = mapOffice?.mapsUrl ||
    `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(mapQuery)}`;

  return (
    <main className="gls-app-page gls-modern-page">
      <section
        className="gls-page-hero gls-page-hero-offices"
        style={{
          backgroundImage:
            'linear-gradient(90deg,rgba(255,255,255,.94),rgba(255,255,255,.16)),url("/offices-hero-reference.jpg")',
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        <div className="gls-shell gls-page-hero-inner">
          <div>
            <div className="gls-breadcrumb">
              {t("nav.home")} <span>›</span> {t("page.offices.crumb")}
            </div>

            <h1>{t("page.offices.title")}</h1>

            <p>{t("page.offices.desc")}</p>

            <div className="gls-feature-pills gls-feature-actions">
              <button
                type="button"
                onClick={() =>
                  document
                    .getElementById("office-list")
                    ?.scrollIntoView({ behavior: "smooth" })
                }
              >
                <span>⌖</span>
                {t("page.offices.pillSearch")}
              </button>

              <button
                type="button"
                onClick={() =>
                  document
                    .getElementById("office-map")
                    ?.scrollIntoView({ behavior: "smooth" })
                }
              >
                <span>⌖</span>
                {t("page.offices.pillMap")}
              </button>

              <button
                type="button"
                onClick={() => {
                  searchInputRef.current?.focus();
                }}
              >
                <span>⚒</span>
                {t("page.offices.pillServices")}
              </button>

              <button
                type="button"
                onClick={() => {
                  setSearchText("");
                  setOffices([]);
                  setLoadError("");
                  searchInputRef.current?.focus();
                }}
              >
                <span>◷</span>
                {t("page.offices.pillTime")}
              </button>
            </div>
          </div>
        </div>
      </section>

      <section
        className="gls-shell gls-page-body"
        id="office-list"
      >
        <div className="gls-office-search">
          <input
            ref={searchInputRef}
            type="search"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            onKeyDown={handleSearchKeyDown}
            placeholder="Search office, district, taluka..."
            aria-label="Search office, district, taluka"
            autoComplete="off"
          />

          <button
            type="button"
            onClick={search}
            className="gls-primary-btn"
            disabled={busy || !searchText.trim()}
          >
            <Search size={17} />
            {busy
              ? t("auth.pleaseWait")
              : t("page.offices.search")}
          </button>
        </div>

        <div className="gls-office-layout">
          <div>
            {loadError && (
              <div
                className="gls-error-state"
                role="alert"
              >
                {loadError}

                <button
                  type="button"
                  onClick={search}
                >
                  {t("common.retry", "Retry")}
                </button>
              </div>
            )}

            <div className="gls-section-heading">
              <h2>{t("page.offices.popular")}</h2>
              <span>{offices.length}</span>
            </div>

            <div className="gls-office-reference-grid">
              {offices.map((o, i) => {
                const Icon =
                  icons[i % icons.length];

                const destination =
                  o.latitude !== undefined &&
                  o.longitude !== undefined
                    ? `${o.latitude},${o.longitude}`
                    : `${o.name} ${o.address || ""}`;

                const maps =
                  o.mapsUrl ||
                  `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(destination)}`;

                const locality =
                  o.subDistrict ||
                  o.taluka ||
                  o.district ||
                  "";

                return (
                  <article
                    className="gls-office-card"
                    key={
                      o._id ||
                      `${o.name}-${i}`
                    }
                  >
                    <div className="gls-round-icon">
                      <Icon size={24} />
                    </div>

                    <div>
                      <h3>{o.name}</h3>

                      <small>
                        <MapPin size={12} />
                        {o.address ||
                          locality}
                      </small>

                      <small>
                        <Clock3 size={12} />
                        {o.timing ||
                          t(
                            "page.offices.timing"
                          )}
                      </small>

                      <div className="gls-office-actions">
                        {o.phone ? (
                          <a
                            href={`tel:${o.phone}`}
                          >
                            <Phone size={13} />
                            {t(
                              "page.offices.call"
                            )}
                          </a>
                        ) : (
                          <span>
                            <Phone size={13} />
                            {t(
                              "page.offices.call"
                            )}
                          </span>
                        )}

                        <a
                          href={maps}
                          target="_blank"
                          rel="noreferrer"
                        >
                          <Navigation size={13} />
                          {t(
                            "page.offices.map"
                          )}
                        </a>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>

            {!busy &&
              offices.length === 0 && (
                <div
                  className="gls-form-card"
                  style={{ marginTop: 12 }}
                >
                  {searchText.trim()
                    ? t(
                        "page.offices.noOffices"
                      )
                    : "Search by office name, district or taluka to find government offices."}
                </div>
              )}
          </div>

          <aside
            className="gls-side-card"
            id="office-map"
          >
            <h3>
              <MapPin size={19} />
              {t("page.offices.near")}
            </h3>

            {mapOffice ? (
              <>
                <div className="gls-map-frame">
                  <iframe
                    title={t(
                      "page.offices.near"
                    )}
                    src={embed}
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                </div>

                <a
                  className="gls-map-open"
                  href={openMap}
                  target="_blank"
                  rel="noreferrer"
                >
                  <Navigation size={15} />
                  {t(
                    "page.offices.openMap"
                  )}{" "}
                  / Directions
                </a>
              </>
            ) : (
              <div className="gls-map-empty">
                {t("page.offices.noOffices")}
              </div>
            )}

            <div className="gls-side-mini">
              <Phone size={18} />

              <span>
                {t("page.offices.help")}
                <br />
                <small>
                  {t(
                    "page.offices.helpline"
                  )}
                </small>
              </span>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}