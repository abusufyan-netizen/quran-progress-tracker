import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { getDayOfYear, format } from "date-fns";

export function VerseOfTheDay() {
  const [verse, setVerse] = useState<{ arabic: string; english: string; reference: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchVotd = async () => {
      try {
        const today = new Date();
        const isoDate = format(today, "yyyy-MM-dd");
        const cacheKey = `quran-tracker:v1:votd:${isoDate}`;
        
        const cached = localStorage.getItem(cacheKey);
        if (cached) {
          setVerse(JSON.parse(cached));
          setLoading(false);
          return;
        }

        const ayahNum = (getDayOfYear(today) % 6236) + 1;
        const url = `https://api.alquran.cloud/v1/ayah/${ayahNum}/editions/quran-uthmani,en.asad`;
        
        const res = await fetch(url);
        if (!res.ok) throw new Error("Failed to fetch");
        const data = await res.json();
        
        const arabic = data.data[0].text;
        const english = data.data[1].text;
        const reference = `${data.data[0].surah.englishName} ${data.data[0].surah.number}:${data.data[0].numberInSurah}`;
        
        const verseData = { arabic, english, reference };
        localStorage.setItem(cacheKey, JSON.stringify(verseData));
        setVerse(verseData);
      } catch (err) {
        console.error(err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchVotd();
  }, []);

  if (error) {
    return (
      <Card className="bg-accent/5 border-accent/20">
        <CardContent className="p-6 text-center text-muted-foreground">
          Verse of the Day will return tomorrow, inshaAllah.
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-accent/5 border-accent/20">
      <CardContent className="p-6 space-y-4">
        <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Verse of the Day</h3>
        {loading || !verse ? (
          <div className="space-y-3">
            <Skeleton className="h-8 w-3/4 ml-auto" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
          </div>
        ) : (
          <div className="space-y-4">
            <p className="font-arabic text-2xl text-right leading-loose text-foreground" dir="rtl">
              {verse.arabic}
            </p>
            <p className="text-muted-foreground italic">
              "{verse.english}"
            </p>
            <p className="text-sm font-medium text-primary">
              — {verse.reference}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}