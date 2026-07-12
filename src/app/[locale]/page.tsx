import { getTranslations, setRequestLocale } from "next-intl/server";
import IntroProvider from "@/components/intro/IntroProvider";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import MusicControl from "@/components/MusicControl";
import HeroSection from "@/components/HeroSection";
import InvitationMessage from "@/components/InvitationMessage";
import WeddingCountdown from "@/components/WeddingCountdown";
import EventDetails from "@/components/EventDetails";
import WeddingTimeline from "@/components/WeddingTimeline";
import VenueSection from "@/components/VenueSection";
import CalendarActions from "@/components/CalendarActions";
import ClosingSection from "@/components/ClosingSection";
import { coupleNames, weddingConfig } from "@/config/wedding";
import { eventTimes } from "@/lib/calendar";
import { formatGregorianDate, weddingStartISO } from "@/lib/dates";

export default async function InvitationPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: raw } = await params;
  const locale = raw === "en" ? ("en" as const) : ("ar" as const);
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: "calendar" });
  const { end } = eventTimes();
  const venue = weddingConfig.venue;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Event",
    name: t("eventTitle", { couple: coupleNames(locale) }),
    startDate: weddingStartISO(),
    endDate: end.toISOString(),
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    eventStatus: "https://schema.org/EventScheduled",
    location: {
      "@type": "Place",
      name: locale === "ar" ? venue.nameAr : venue.nameEn,
      address:
        locale === "ar"
          ? `${venue.addressAr}، ${venue.cityAr}`
          : `${venue.addressEn}, ${venue.cityEn}`,
    },
    image: ["/og/social-card.jpg"],
    inLanguage: locale,
  };

  return (
    <IntroProvider>
      <LanguageSwitcher />
      <MusicControl />
      <main tabIndex={-1} className="outline-none">
        <HeroSection dateLine={formatGregorianDate(locale)} />
        <InvitationMessage />
        <WeddingCountdown />
        <EventDetails />
        <WeddingTimeline />
        <VenueSection />
        <CalendarActions />
        <ClosingSection />
      </main>
      <footer className="bg-olive-deep px-6 py-8 text-center">
        <p className="text-[11px] uppercase tracking-[0.35em] text-ivory/75">
          {weddingConfig.initials.en}
        </p>
      </footer>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </IntroProvider>
  );
}
