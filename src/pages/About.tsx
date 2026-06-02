import { useEffect } from "react";
import { Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Book, Flame, Target, Award, CalendarDays, Sparkles, Shield, Lock, HelpCircle } from "lucide-react";
import { useDocumentMeta } from "@/hooks/useDocumentMeta";

const FAQS = [
  {
    q: "Is Mushaf free to use?",
    a: "Yes. Mushaf is completely free, with no ads, no subscriptions, and no account required. The full app is available the moment you open it.",
  },
  {
    q: "Where is my reading data stored?",
    a: "Everything is stored locally in your browser using localStorage. Your reading log, streaks, goals, and badges never leave your device. There is no server, no database, and no account.",
  },
  {
    q: "How do I track my Quran reading?",
    a: "Use Quick Add or the Log page to record what you read — by page range, by Surah, or by Juz. Mushaf maintains a deduplicated set of pages you've ever read so your progress and streaks update instantly.",
  },
  {
    q: "How is my reading streak calculated?",
    a: "A streak counts each consecutive day on which you logged at least one page of reading. Your current streak resets if you miss a day. Mushaf also tracks your longest streak ever.",
  },
  {
    q: "How does the completion goal work?",
    a: "Pick any future date and Mushaf calculates exactly how many pages per day you need to read to finish all 604 pages of the Quran by that date, given how much you've already read.",
  },
  {
    q: "How many Surahs and pages are in the Quran?",
    a: "The standard Madinah Mushaf has 604 pages, divided into 114 Surahs (chapters) and 30 Juz (parts). Mushaf uses these standard counts throughout the app.",
  },
  {
    q: "Does Mushaf work offline?",
    a: "Yes — once the app has loaded, the core tracking features work without an internet connection. The only network request is to the public alquran.cloud API to fetch the Verse of the Day.",
  },
  {
    q: "Can I install Mushaf on my phone?",
    a: "Yes. Mushaf is a Progressive Web App. On iPhone or Android, open the site in your browser and choose 'Add to Home Screen' to install it like a native app.",
  },
  {
    q: "What badges can I unlock?",
    a: "Badges celebrate milestones like completing your first Surah, finishing a Juz, building a 7-day or 30-day streak, reading 100 or 300 pages, and ultimately completing the entire Quran (khatm).",
  },
  {
    q: "Can I export or back up my data?",
    a: "Right now data lives in your browser. Clearing browser storage will reset your progress, so we recommend not clearing site data for Mushaf. Built-in import/export is on the roadmap.",
  },
];

export default function About() {
  useDocumentMeta({
    title: "About Mushaf",
    description: "Mushaf is a free, private, browser-based Quran reading tracker. Log reading by page, Surah, or Juz; build streaks; set completion goals; and unlock milestones — all stored locally on your device.",
    canonicalPath: "/about",
  });

  useEffect(() => {
    const id = "ld-faq-page";
    let el = document.getElementById(id) as HTMLScriptElement | null;
    if (!el) {
      el = document.createElement("script");
      el.id = id;
      el.type = "application/ld+json";
      document.head.appendChild(el);
    }
    el.textContent = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: FAQS.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: {
          "@type": "Answer",
          text: f.a,
        },
      })),
    });
    return () => {
      const existing = document.getElementById(id);
      if (existing) existing.remove();
    };
  }, []);

  const features = [
    { icon: Book, title: "Track every page, Surah, and Juz", body: "Log your reading by page numbers, by Surah, or by Juz. Mushaf keeps a running set of every page you've ever read so nothing double-counts." },
    { icon: Flame, title: "Daily streaks", body: "See your current and longest reading streaks at a glance. Consistency beats intensity — Mushaf is built to reward the habit." },
    { icon: Target, title: "Smart completion goals", body: "Pick a target date for completing the Quran and Mushaf calculates exactly how many pages per day you need to read to stay on track." },
    { icon: CalendarDays, title: "GitHub-style heatmap", body: "Visualize your year of reading. The heatmap turns months of effort into a single beautiful picture." },
    { icon: Award, title: "Milestone badges", body: "Unlock badges as you complete Surahs, finish Juz, build long streaks, and progress toward khatm." },
    { icon: Sparkles, title: "Verse of the Day", body: "A fresh ayah every day, delivered with translation, to gently invite you back to the Mushaf." },
  ];

  return (
    <div className="max-w-3xl mx-auto space-y-10 py-6">
      <header className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 text-accent text-xs font-medium uppercase tracking-wider">
          <Sparkles className="h-3.5 w-3.5" />
          About Mushaf
        </div>
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
          A quiet, private companion for your Quran journey.
        </h1>
        <p className="text-lg text-muted-foreground leading-relaxed">
          Mushaf is a free Quran progress tracker that helps Muslims read more consistently
          — by page, Surah, or Juz — with streaks, goals, milestones, and a daily verse.
          No account. No ads. Your data lives on your device.
        </p>
      </header>

      <section className="grid sm:grid-cols-2 gap-4">
        {features.map((f) => (
          <Card key={f.title} className="border-border/60">
            <CardContent className="p-5 space-y-2">
              <div className="flex items-center gap-2 text-primary">
                <f.icon className="h-5 w-5" />
                <h2 className="font-semibold">{f.title}</h2>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">{f.body}</p>
            </CardContent>
          </Card>
        ))}
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-bold tracking-tight">Privacy first</h2>
        <Card className="border-border/60">
          <CardContent className="p-6 space-y-3">
            <div className="flex items-start gap-3">
              <Lock className="h-5 w-5 text-primary mt-0.5 shrink-0" />
              <p className="text-sm text-muted-foreground leading-relaxed">
                Mushaf stores everything in your browser using <code className="text-xs px-1.5 py-0.5 rounded bg-muted">localStorage</code>.
                There is no server, no database, no account, and no tracking. Your reading log
                never leaves your device.
              </p>
            </div>
            <div className="flex items-start gap-3">
              <Shield className="h-5 w-5 text-primary mt-0.5 shrink-0" />
              <p className="text-sm text-muted-foreground leading-relaxed">
                The only network request is to the public alquran.cloud API for the Verse of the Day —
                no personal information is ever sent.
              </p>
            </div>
          </CardContent>
        </Card>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-bold tracking-tight">How it works</h2>
        <ol className="space-y-3 text-sm text-muted-foreground leading-relaxed list-decimal list-inside">
          <li><strong className="text-foreground">Log what you read</strong> — by page range, Surah, or Juz. Quick Add is two taps.</li>
          <li><strong className="text-foreground">Watch your progress build</strong> — total pages, percentage, completed Surahs and Juz, and streaks update instantly.</li>
          <li><strong className="text-foreground">Set a completion goal</strong> — Mushaf tells you the daily pace required to finish on time.</li>
          <li><strong className="text-foreground">Unlock milestones</strong> — badges celebrate your consistency along the way.</li>
        </ol>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-bold tracking-tight">By the numbers</h2>
        <div className="grid grid-cols-3 gap-3">
          <Card className="border-border/60"><CardContent className="p-5 text-center">
            <div className="text-3xl font-bold text-primary">604</div>
            <div className="text-xs text-muted-foreground uppercase tracking-wider mt-1">Pages</div>
          </CardContent></Card>
          <Card className="border-border/60"><CardContent className="p-5 text-center">
            <div className="text-3xl font-bold text-primary">114</div>
            <div className="text-xs text-muted-foreground uppercase tracking-wider mt-1">Surahs</div>
          </CardContent></Card>
          <Card className="border-border/60"><CardContent className="p-5 text-center">
            <div className="text-3xl font-bold text-primary">30</div>
            <div className="text-xs text-muted-foreground uppercase tracking-wider mt-1">Juz</div>
          </CardContent></Card>
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <HelpCircle className="h-6 w-6 text-primary" />
          <h2 className="text-2xl font-bold tracking-tight">Frequently asked questions</h2>
        </div>
        <Card className="border-border/60">
          <CardContent className="p-2 sm:p-4">
            <Accordion type="single" collapsible className="w-full">
              {FAQS.map((f, i) => (
                <AccordionItem key={i} value={`faq-${i}`} className="border-b last:border-b-0">
                  <AccordionTrigger className="text-left text-base font-semibold hover:no-underline px-2 sm:px-3">
                    {f.q}
                  </AccordionTrigger>
                  <AccordionContent className="text-sm text-muted-foreground leading-relaxed px-2 sm:px-3">
                    {f.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </CardContent>
        </Card>
      </section>

      <section className="text-center space-y-4 py-8">
        <h2 className="text-2xl font-bold tracking-tight">Start tracking today</h2>
        <p className="text-muted-foreground">It takes less than a minute to log your first page.</p>
        <div className="flex items-center justify-center gap-3">
          <Link href="/">
            <Button size="lg" className="bg-primary hover:bg-primary/90">Open Dashboard</Button>
          </Link>
          <Link href="/log">
            <Button size="lg" variant="outline">Log Reading</Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
