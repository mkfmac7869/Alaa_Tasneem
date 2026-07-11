import { getTranslations, setRequestLocale } from "next-intl/server";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import WeddingMonogram from "@/components/WeddingMonogram";
import { weddingConfig } from "@/config/wedding";

/** Elegant one-field gate, only reachable when an invite code is set. */
export default async function EnterPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ error?: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const code = weddingConfig.privacy.inviteCode;
  const homePath = locale === "en" ? "/en" : "/";
  if (!code) redirect(homePath);

  const t = await getTranslations({ locale, namespace: "enter" });
  const { error } = await searchParams;

  async function submit(formData: FormData) {
    "use server";
    const attempt = String(formData.get("code") ?? "").trim();
    const expected = weddingConfig.privacy.inviteCode;
    const home = locale === "en" ? "/en" : "/";
    if (expected && attempt === expected) {
      (await cookies()).set("at-invite", attempt, {
        maxAge: 60 * 60 * 24 * 180,
        path: "/",
        sameSite: "lax",
      });
      redirect(home);
    }
    redirect(`${locale === "en" ? "/en" : ""}/enter?error=1`);
  }

  return (
    <main className="texture-paper flex min-h-svh flex-col items-center justify-center bg-ivory px-6 text-center">
      <WeddingMonogram
        className="w-20 text-olive-deep"
        title={weddingConfig.initials.en}
      />
      <h1 className="mt-8 font-display text-2xl text-ink">{t("title")}</h1>
      <p className="mt-3 text-sm text-ink-soft">{t("prompt")}</p>

      <form action={submit} className="mt-8 flex w-full max-w-xs flex-col gap-4">
        <input
          type="text"
          name="code"
          required
          autoComplete="off"
          aria-label={t("placeholder")}
          placeholder={t("placeholder")}
          className="min-h-12 rounded-full border border-ink/25 bg-transparent px-6 text-center text-ink outline-none transition-colors focus:border-olive"
        />
        <button
          type="submit"
          className="min-h-12 rounded-full bg-olive-deep px-6 text-sm text-ivory transition-colors hover:bg-olive"
        >
          {t("submit")}
        </button>
      </form>

      {error && (
        <p className="mt-5 text-sm text-olive-deep">{t("error")}</p>
      )}
    </main>
  );
}
