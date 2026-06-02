import { useEffect, useMemo } from "react";
import { Link, useParams, useLocation } from "wouter";
import { surahs } from "@/data/surahs";
import { useTrackerStore } from "@/hooks/useTrackerStore";
import { useDocumentMeta } from "@/hooks/useDocumentMeta";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, ChevronRight, ArrowLeft, BookOpen, MapPin, Hash, Layers, CheckCircle2, Circle } from "lucide-react";

const SITE_ORIGIN = "https://quran-progress-tracker--qtracker.replit.app";

export default function SurahDetail() {
  const params = useParams<{ number: string }>();
  const [, setLocation] = useLocation();
  const num = Number(params.number);
  const surah = surahs.find((s) => s.number === num);

  const { pagesReadSet, completedSurahsManual, toggleSurah } = useTrackerStore();

  const meta = useMemo(() => {
    if (!surah) {
      return {
        title: "Surah not found",
        description: "The Surah you're looking for doesn't exist. Browse all 114 Surahs of the Quran.",
        canonicalPath: "/surahs",
      };
    }
    return {
      title: `Surah ${surah.nameTransliteration} (${surah.nameEnglish}) — ${surah.nameArabic}`,
      description: `Surah ${surah.nameTransliteration} (${surah.nameEnglish}) is the ${ordinal(surah.number)} chapter of the Quran. ${surah.revelationType} surah with ${surah.totalAyahs} ayahs, beginning in Juz ${surah.juz} on page ${surah.startPage} of the standard Mushaf. Track your reading progress for this Surah.`,
      canonicalPath: `/surahs/${surah.number}`,
    };
  }, [surah]);

  useDocumentMeta(meta);

  useEffect(() => {
    if (!surah) return;
    const id = "ld-surah-article";
    let el = document.getElementById(id) as HTMLScriptElement | null;
    if (!el) {
      el = document.createElement("script");
      el.id = id;
      el.type = "application/ld+json";
      document.head.appendChild(el);
    }
    el.textContent = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "Article",
      headline: `Surah ${surah.nameTransliteration} (${surah.nameEnglish})`,
      alternativeHeadline: surah.nameArabic,
      description: meta.description,
      url: `${SITE_ORIGIN}/surahs/${surah.number}`,
      inLanguage: "en",
      about: {
        "@type": "Book",
        name: "The Holy Quran",
        alternateName: "القرآن الكريم",
      },
      isPartOf: {
        "@type": "WebSite",
        name: "Mushaf — Quran Progress Tracker",
        url: SITE_ORIGIN,
      },
    });
    return () => {
      const existing = document.getElementById(id);
      if (existing) existing.remove();
    };
  }, [surah, meta.description]);

  if (!surah) {
    return (
      <div className="max-w-2xl mx-auto py-12 text-center space-y-4">
        <h1 className="text-3xl font-bold">Surah not found</h1>
        <p className="text-muted-foreground">There is no Surah numbered {params.number}. The Quran has 114 Surahs (1–114).</p>
        <Link href="/surahs">
          <Button>Browse all Surahs</Button>
        </Link>
      </div>
    );
  }

  const prev = surahs.find((s) => s.number === surah.number - 1);
  const next = surahs.find((s) => s.number === surah.number + 1);

  const pageRange = Array.from({ length: surah.endPage - surah.startPage + 1 }, (_, i) => surah.startPage + i);
  const pagesReadInThisSurah = pageRange.filter((p) => pagesReadSet.has(p)).length;
  const totalPagesInSurah = pageRange.length;
  const pagePercent = Math.round((pagesReadInThisSurah / totalPagesInSurah) * 100);
  const isManuallyComplete = completedSurahsManual.includes(surah.number);
  const isComplete = isManuallyComplete || pagesReadInThisSurah === totalPagesInSurah;

  return (
    <div className="max-w-3xl mx-auto space-y-8 py-4">
      <Link href="/surahs">
        <Button variant="ghost" size="sm" className="gap-2 -ml-2">
          <ArrowLeft className="h-4 w-4" /> All Surahs
        </Button>
      </Link>

      <header className="space-y-4">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs text-muted-foreground uppercase tracking-wider font-medium">
              <span>Surah {surah.number} of 114</span>
              <span>·</span>
              <span>{surah.revelationType}</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight">{surah.nameTransliteration}</h1>
            <p className="text-xl text-muted-foreground">{surah.nameEnglish}</p>
          </div>
          <div className="text-right">
            <p className="font-amiri text-5xl text-primary leading-none" dir="rtl" style={{ fontFamily: "Amiri, serif" }}>
              {surah.nameArabic}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <Badge variant="secondary" className="gap-1.5"><Hash className="h-3 w-3" /> {surah.totalAyahs} ayahs</Badge>
          <Badge variant="secondary" className="gap-1.5"><Layers className="h-3 w-3" /> Juz {surah.juz}</Badge>
          <Badge variant="secondary" className="gap-1.5"><BookOpen className="h-3 w-3" /> Pages {surah.startPage}–{surah.endPage}</Badge>
          <Badge variant="secondary" className="gap-1.5"><MapPin className="h-3 w-3" /> {surah.revelationType}</Badge>
        </div>
      </header>

      <Card className="border-border/60">
        <CardContent className="p-6 space-y-4">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div>
              <h2 className="font-semibold">Your progress on this Surah</h2>
              <p className="text-sm text-muted-foreground mt-0.5">
                {pagesReadInThisSurah} of {totalPagesInSurah} pages read · {pagePercent}%
              </p>
            </div>
            <Button
              onClick={() => toggleSurah(surah.number)}
              variant={isManuallyComplete ? "outline" : "default"}
              className={isManuallyComplete ? "" : "bg-primary hover:bg-primary/90"}
            >
              {isComplete ? (
                <><CheckCircle2 className="mr-2 h-4 w-4" /> {isManuallyComplete ? "Marked complete" : "Complete"}</>
              ) : (
                <><Circle className="mr-2 h-4 w-4" /> Mark complete</>
              )}
            </Button>
          </div>
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-primary transition-all"
              style={{ width: `${pagePercent}%` }}
            />
          </div>
        </CardContent>
      </Card>

      <section className="space-y-3">
        <h2 className="text-2xl font-bold tracking-tight">About this Surah</h2>
        <Card className="border-border/60">
          <CardContent className="p-6 space-y-3 text-sm leading-relaxed text-muted-foreground">
            <p>
              <strong className="text-foreground">Surah {surah.nameTransliteration}</strong>{" "}
              ({surah.nameArabic}, "{surah.nameEnglish}") is the {ordinal(surah.number)} chapter
              of the Holy Quran. It is a {surah.revelationType.toLowerCase()} surah, meaning it
              was revealed {surah.revelationType === "Meccan" ? "in Mecca, before the Hijrah." : "in Medina, after the Hijrah."}
            </p>
            <p>
              It contains <strong className="text-foreground">{surah.totalAyahs} ayahs</strong>{" "}
              and begins in <strong className="text-foreground">Juz {surah.juz}</strong>,{" "}
              spanning {totalPagesInSurah === 1 ? "page" : "pages"}{" "}
              <strong className="text-foreground">{surah.startPage}{totalPagesInSurah > 1 ? `–${surah.endPage}` : ""}</strong>{" "}
              of the standard Madinah Mushaf (604-page edition).
            </p>
            <p>
              Use Mushaf to log your reading of this Surah by page, or simply mark it complete when you finish.
              Your progress contributes to your overall Quran completion percentage and unlocks milestone badges.
            </p>
          </CardContent>
        </Card>
      </section>

      <nav className="flex items-center justify-between gap-3 pt-4">
        <div>
          {prev && (
            <Button
              variant="outline"
              onClick={() => setLocation(`/surahs/${prev.number}`)}
              className="gap-2"
            >
              <ChevronLeft className="h-4 w-4" />
              <span className="hidden sm:inline">{prev.nameTransliteration}</span>
              <span className="sm:hidden">Previous</span>
            </Button>
          )}
        </div>
        <div>
          {next && (
            <Button
              variant="outline"
              onClick={() => setLocation(`/surahs/${next.number}`)}
              className="gap-2"
            >
              <span className="hidden sm:inline">{next.nameTransliteration}</span>
              <span className="sm:hidden">Next</span>
              <ChevronRight className="h-4 w-4" />
            </Button>
          )}
        </div>
      </nav>
    </div>
  );
}

function ordinal(n: number): string {
  const s = ["th", "st", "nd", "rd"];
  const v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
}
