import {
  AlertTriangle,
  ArrowRight,
  Banknote,
  CheckCircle2,
  ClipboardCheck,
  FileText,
  LockKeyhole,
  PhoneCall,
  ShieldAlert,
  Smartphone,
} from "lucide-react";
import { useTranslation } from "react-i18next";

import Badge from "../../components/ui/Badge";
import Button, {
  LinkButton,
} from "../../components/ui/Button";
import Card from "../../components/ui/Card";
import SectionHeading from "../../components/common/SectionHeading";

const steps = [
  {
    number: "01",
    icon: PhoneCall,
    title: "ताबडतोब 1930 वर कॉल करा",
    description:
      "सायबर फसवणूक झाल्याचे लक्षात येताच राष्ट्रीय सायबर हेल्पलाइनवर त्वरित संपर्क करा.",
  },
  {
    number: "02",
    icon: Banknote,
    title: "बँकेशी त्वरित संपर्क करा",
    description:
      "तुमच्या बँकेला किंवा संबंधित पेमेंट सेवेला व्यवहाराची माहिती देऊन पुढील नुकसान थांबवण्याचा प्रयत्न करा.",
  },
  {
    number: "03",
    icon: LockKeyhole,
    title: "खाती सुरक्षित करा",
    description:
      "UPI PIN, इंटरनेट बँकिंग किंवा इतर संवेदनशील माहिती धोक्यात असल्यास योग्य सुरक्षा उपाय करा.",
  },
  {
    number: "04",
    icon: FileText,
    title: "पुरावे जतन करा",
    description:
      "Transaction ID, screenshots, SMS, फोन नंबर, UPI ID आणि इतर संबंधित माहिती सुरक्षित ठेवा.",
  },
  {
    number: "05",
    icon: ClipboardCheck,
    title: "सायबर तक्रार नोंदवा",
    description:
      "घटनेची अधिकृत तक्रार नोंदवून complaint/reference number सुरक्षित ठेवा.",
  },
];

const evidenceItems = [
  {
    icon: Banknote,
    text: "Transaction ID / UTR number",
  },
  {
    icon: Smartphone,
    text: "फसवणूक करणारा फोन नंबर",
  },
  {
    icon: FileText,
    text: "SMS, email आणि chat screenshots",
  },
  {
    icon: ClipboardCheck,
    text: "UPI ID / bank account details",
  },
];

export default function CyberFraudPage() {
  const { t } = useTranslation();

  return (
    <main className="min-h-screen bg-[#F8FAF7]">
      {/* HERO */}
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
          <div className="max-w-4xl">
            <Badge
              variant="red"
              icon={<ShieldAlert size={17} />}
            >
              {t("cyberFraudPage.badge")}
            </Badge>

            <h1 className="mt-5 text-4xl font-bold tracking-tight text-[#12345B] sm:text-5xl lg:text-6xl">
              {t("cyberFraudPage.title")}
            </h1>

            <p className="mt-5 max-w-3xl text-base leading-8 text-slate-600 sm:text-lg">
              {t("cyberFraudPage.description")}
            </p>

            {/* EMERGENCY CTA */}
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button
                variant="danger"
                size="lg"
                leftIcon={<PhoneCall size={18} />}
              >
                {t("cyberFraudPage.actions.call1930")}
              </Button>

              <LinkButton
                to="/ai-sahayak"
                variant="outline"
                size="lg"
                rightIcon={<ArrowRight size={17} />}
              >
                {t("cyberFraudPage.actions.askAI")}
              </LinkButton>
            </div>
          </div>
        </div>
      </section>

      {/* EMERGENCY ALERT */}
      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-red-200 bg-red-50 p-5 sm:p-6">
          <div className="flex items-start gap-4">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-red-100 text-red-600">
              <AlertTriangle size={22} />
            </div>

            <div>
              <h2 className="font-bold text-red-900">
                {t("cyberFraudPage.emergency.title")}
              </h2>

              <p className="mt-2 text-sm leading-6 text-red-800">
                {t("cyberFraudPage.emergency.description")}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* QUICK ACTIONS */}
      <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow={t("cyberFraudPage.quick.eyebrow")}
          title={t("cyberFraudPage.quick.title")}
          description={t("cyberFraudPage.quick.description")}
        />

        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <Card hover className="h-full">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-50 text-red-600">
              <PhoneCall size={21} />
            </div>

            <h3 className="mt-5 text-lg font-bold text-[#12345B]">
              {t("cyberFraudPage.quick.call.title")}
            </h3>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              {t("cyberFraudPage.quick.call.description")}
            </p>
          </Card>

          <Card hover className="h-full">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#EAF6EF] text-[#168A52]">
              <Banknote size={21} />
            </div>

            <h3 className="mt-5 text-lg font-bold text-[#12345B]">
              {t("cyberFraudPage.quick.bank.title")}
            </h3>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              {t("cyberFraudPage.quick.bank.description")}
            </p>
          </Card>

          <Card hover className="h-full">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <ClipboardCheck size={21} />
            </div>

            <h3 className="mt-5 text-lg font-bold text-[#12345B]">
              {t("cyberFraudPage.quick.report.title")}
            </h3>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              {t("cyberFraudPage.quick.report.description")}
            </p>
          </Card>
        </div>
      </section>

      {/* STEP BY STEP */}
      <section className="border-y border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow={t("cyberFraudPage.steps.eyebrow")}
            title={t("cyberFraudPage.steps.title")}
            description={t("cyberFraudPage.steps.description")}
          />

          <div className="mt-10 grid gap-5 lg:grid-cols-5">
            {steps.map((step) => {
              const Icon = step.icon;

              return (
                <Card
                  key={step.number}
                  className="relative h-full"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-[#168A52]">
                      {step.number}
                    </span>

                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#EAF6EF] text-[#168A52]">
                      <Icon size={19} />
                    </div>
                  </div>

                  <h3 className="mt-5 text-base font-bold leading-6 text-[#12345B]">
                    {step.title}
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-slate-500">
                    {step.description}
                  </p>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* EVIDENCE CHECKLIST */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[1fr_0.9fr] lg:items-center">
          <div>
            <SectionHeading
              eyebrow={t("cyberFraudPage.evidence.eyebrow")}
              title={t("cyberFraudPage.evidence.title")}
              description={t(
                "cyberFraudPage.evidence.description",
              )}
            />

            <div className="mt-7 space-y-3">
              {evidenceItems.map((item) => {
                const Icon = item.icon;

                return (
                  <div
                    key={item.text}
                    className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-4"
                  >
                    <CheckCircle2
                      size={19}
                      className="shrink-0 text-[#168A52]"
                    />

                    <Icon
                      size={18}
                      className="shrink-0 text-slate-400"
                    />

                    <span className="text-sm font-medium text-slate-700">
                      {item.text}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          <Card className="border-[#12345B]/10 bg-[#12345B] text-white">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/10">
              <ShieldAlert size={22} />
            </div>

            <h3 className="mt-5 text-xl font-bold">
              {t("cyberFraudPage.reminder.title")}
            </h3>

            <p className="mt-3 text-sm leading-7 text-slate-200">
              {t("cyberFraudPage.reminder.description")}
            </p>

            <div className="mt-6 rounded-xl border border-white/10 bg-white/5 p-4">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-300">
                {t("cyberFraudPage.reminder.label")}
              </p>

              <p className="mt-2 text-2xl font-bold">
                1930
              </p>
            </div>
          </Card>
        </div>
      </section>

      {/* AI CTA */}
      <section className="border-t border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-14 text-center sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-[#12345B] sm:text-3xl">
            {t("cyberFraudPage.bottom.title")}
          </h2>

          <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-slate-500">
            {t("cyberFraudPage.bottom.description")}
          </p>

          <LinkButton
            to="/ai-sahayak"
            variant="secondary"
            size="lg"
            rightIcon={<ArrowRight size={17} />}
            className="mt-7"
          >
            {t("cyberFraudPage.bottom.action")}
          </LinkButton>
        </div>
      </section>

      {/* DISCLAIMER */}
      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5">
          <p className="text-sm leading-6 text-amber-800">
            {t("cyberFraudPage.disclaimer")}
          </p>
        </div>
      </section>
    </main>
  );
}