import {
  ArrowRight,
  CheckCircle2,
  FileCheck2,
  FileText,
  MessageCircle,
  PenLine,
  ShieldCheck,
} from "lucide-react";
import { useState } from "react";
import { Link } from "react-router";
import { useTranslation } from "react-i18next";

import Badge from "../../components/ui/Badge";
import Button, { LinkButton } from "../../components/ui/Button";
import Card from "../../components/ui/Card";
import SectionHeading from "../../components/common/SectionHeading";
import StatusBadge from "../../components/common/StatusBadge";

const problemKeys = [
  "rental",
  "sale",
  "loan",
  "service",
] as const;

const documentKeys = [
  "identityProof",
  "propertyDetails",
  "paymentDetails",
  "previousAgreement",
] as const;

const stepKeys = [
  "understand",
  "verify",
  "review",
  "sign",
] as const;

export default function AgreementsPage() {
  const { t } = useTranslation();

  const [selectedProblem, setSelectedProblem] =
    useState<string | null>(null);

  return (
    <main className="min-h-screen bg-[#F8FAF7]">

      {/* HERO */}
      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
          <div className="max-w-3xl">
            <Badge
              variant="green"
              icon={<FileCheck2 size={17} />}
            >
              {t("agreementsPage.badge")}
            </Badge>

            <h1 className="mt-5 text-4xl font-bold tracking-tight text-[#12345B] sm:text-5xl">
              {t("agreementsPage.title")}
            </h1>

            <p className="mt-4 text-base leading-8 text-slate-600 sm:text-lg">
              {t("agreementsPage.description")}
            </p>
          </div>
        </div>
      </section>

      {/* PROBLEM SELECTOR */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow={t("agreementsPage.problem.eyebrow")}
          title={t("agreementsPage.problem.title")}
          description={t("agreementsPage.problem.description")}
        />

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {problemKeys.map((key) => {
            const isSelected = selectedProblem === key;

            return (
              <button
                key={key}
                type="button"
                onClick={() => setSelectedProblem(key)}
                className="text-left"
              >
                <Card
                  className={[
                    "h-full transition-all duration-200",
                    isSelected
                      ? "border-[#168A52] bg-[#F1F9F4] ring-2 ring-[#168A52]/15"
                      : "hover:border-[#168A52]/40",
                  ].join(" ")}
                >
                  <div
                    className={[
                      "flex h-11 w-11 items-center justify-center rounded-xl",
                      isSelected
                        ? "bg-[#168A52] text-white"
                        : "bg-[#EAF6EF] text-[#168A52]",
                    ].join(" ")}
                  >
                    {isSelected ? (
                      <CheckCircle2 size={21} />
                    ) : (
                      <PenLine size={21} />
                    )}
                  </div>

                  <h3 className="mt-4 font-bold text-[#12345B]">
                    {t(
                      `agreementsPage.problem.items.${key}.title`,
                    )}
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-slate-500">
                    {t(
                      `agreementsPage.problem.items.${key}.description`,
                    )}
                  </p>
                </Card>
              </button>
            );
          })}
        </div>

        {selectedProblem && (
          <Card className="mt-6 border-[#168A52]/20 bg-[#F1F9F4]">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <StatusBadge
                  label={t("agreementsPage.problem.selected")}
                  variant="success"
                />

                <p className="mt-2 font-semibold text-[#12345B]">
                  {t(
                    `agreementsPage.problem.items.${selectedProblem}.title`,
                  )}
                </p>
              </div>

              <LinkButton
  to="/ai-sahayak"
  variant="secondary"
  rightIcon={<ArrowRight size={16} />}
>
  {t("agreementsPage.problem.askAI")}
</LinkButton>
            </div>
          </Card>
        )}
      </section>

      {/* DOCUMENTS */}
      <section className="border-y border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow={t("agreementsPage.documents.eyebrow")}
            title={t("agreementsPage.documents.title")}
            description={t("agreementsPage.documents.description")}
          />

          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {documentKeys.map((key) => (
              <Card key={key} hover>
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-100 text-[#12345B]">
                  <FileText size={21} />
                </div>

                <h3 className="mt-4 font-semibold text-[#12345B]">
                  {t(
                    `agreementsPage.documents.items.${key}.title`,
                  )}
                </h3>

                <p className="mt-2 text-sm leading-6 text-slate-500">
                  {t(
                    `agreementsPage.documents.items.${key}.description`,
                  )}
                </p>
              </Card>
            ))}
          </div>

          <div className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 p-5">
            <div className="flex gap-3">
              <ShieldCheck
                size={20}
                className="mt-0.5 shrink-0 text-amber-700"
              />

              <p className="text-sm leading-6 text-amber-800">
                {t("agreementsPage.documents.note")}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* PROCESS */}
      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow={t("agreementsPage.steps.eyebrow")}
          title={t("agreementsPage.steps.title")}
          description={t("agreementsPage.steps.description")}
        />

        <div className="mt-10 grid gap-8 md:grid-cols-4">
          {stepKeys.map((key, index) => (
            <div key={key}>
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#EAF6EF] font-bold text-[#168A52]">
                {String(index + 1).padStart(2, "0")}
              </div>

              <h3 className="mt-5 font-bold text-[#12345B]">
                {t(
                  `agreementsPage.steps.items.${key}.title`,
                )}
              </h3>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                {t(
                  `agreementsPage.steps.items.${key}.description`,
                )}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* DOCUMENT ANALYSIS */}
      <section className="border-y border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <Card className="bg-[#F8FAF7]">
            <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
              <div className="flex gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#12345B] text-white">
                  <FileCheck2 size={22} />
                </div>

                <div>
                  <h2 className="text-xl font-bold text-[#12345B]">
                    {t("agreementsPage.analysis.title")}
                  </h2>

                  <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
                    {t("agreementsPage.analysis.description")}
                  </p>
                </div>
              </div>

              <Link to="/documents">
                <Button
                  variant="outline"
                  rightIcon={<ArrowRight size={16} />}
                >
                  {t("agreementsPage.analysis.action")}
                </Button>
              </Link>
            </div>
          </Card>
        </div>
      </section>

      {/* AI CTA */}
      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-[#12345B] px-6 py-12 text-center sm:px-12">
          <div className="mx-auto max-w-2xl">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 text-white">
              <MessageCircle size={26} />
            </div>

            <h2 className="mt-6 text-3xl font-bold text-white">
              {t("agreementsPage.cta.title")}
            </h2>

            <p className="mt-4 leading-7 text-white/70">
              {t("agreementsPage.cta.description")}
            </p>

            <Link to="/ai-sahayak">
              <Button
                variant="outline"
                size="lg"
                rightIcon={<ArrowRight size={17} />}
                className="mt-8 border-white bg-white text-[#12345B] hover:bg-slate-100"
              >
                {t("agreementsPage.cta.action")}
              </Button>
            </Link>
          </div>
        </div>
      </section>

    </main>
  );
}