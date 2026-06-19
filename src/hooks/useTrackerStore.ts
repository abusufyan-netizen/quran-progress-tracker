import { useMemo } from "react";
import { useLocalStorage } from "./useLocalStorage";
import { format, differenceInDays, isToday, parseISO, subDays } from "date-fns";
import { surahs } from "../data/surahs";
import { juzList } from "../data/juz";
import { badges } from "../data/badges";

export interface ReadingLog {
  id: string;
  mode: "pages" | "surah" | "juz";
  date: string; // ISO date YYYY-MM-DD
  fromPage: number;
  toPage: number;
  pagesRead: number;
  surahNumber?: number;
  juzNumber?: number;
  createdAt: string;
}

export interface Goal {
  targetDate: string; // ISO
  dailyPagesTarget: number | null;
}

interface TrackerState {
  logs: ReadingLog[];
  completedSurahsManual: number[];
  goal: Goal | null;
}

const initialState: TrackerState = {
  logs: [],
  completedSurahsManual: [],
  goal: null,
};

export function useTrackerStore() {
  const [state, setState] = useLocalStorage<TrackerState>("quran-tracker:state:v1", initialState);

  const addLog = (entry: Omit<ReadingLog, "id" | "createdAt">) => {
    const newLog: ReadingLog = {
      ...entry,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    };
    setState((prev) => ({
      ...prev,
      logs: [...prev.logs, newLog],
    }));
  };

  const deleteLog = (id: string) => {
    setState((prev) => ({
      ...prev,
      logs: prev.logs.filter((log) => log.id !== id),
    }));
  };

  const toggleSurah = (surahNumber: number) => {
    setState((prev) => {
      const isManual = prev.completedSurahsManual.includes(surahNumber);
      const surah = surahs.find((s) => s.number === surahNumber);
      if (!surah) return prev;

      if (isManual) {
        // Toggle OFF: remove from manual AND remove any logs matching this surah
        return {
          ...prev,
          completedSurahsManual: prev.completedSurahsManual.filter((n) => n !== surahNumber),
          logs: prev.logs.filter((log) => !(log.mode === "surah" && log.surahNumber === surahNumber)),
        };
      } else {
        // Toggle ON: add to manual AND add log
        const newLog: ReadingLog = {
          id: crypto.randomUUID(),
          mode: "surah",
          surahNumber: surah.number,
          fromPage: surah.startPage,
          toPage: surah.endPage,
          pagesRead: surah.endPage - surah.startPage + 1,
          date: format(new Date(), "yyyy-MM-dd"),
          createdAt: new Date().toISOString(),
        };
        return {
          ...prev,
          completedSurahsManual: [...prev.completedSurahsManual, surahNumber],
          logs: [...prev.logs, newLog],
        };
      }
    });
  };

  const setGoal = (goal: Goal) => {
    setState((prev) => ({ ...prev, goal }));
  };

  const clearGoal = () => {
    setState((prev) => ({ ...prev, goal: null }));
  };

  // Computed
  const computed = useMemo(() => {
    const logs = state.logs;
    const pagesReadSet = new Set<number>();

    logs.forEach((log) => {
      for (let i = log.fromPage; i <= log.toPage; i++) {
        pagesReadSet.add(i);
      }
    });

    const totalPagesRead = pagesReadSet.size;
    const progressPercent = Math.min(100, Math.round((totalPagesRead / 604) * 100));

    const completedSurahs = surahs.filter((s) => {
      if (state.completedSurahsManual.includes(s.number)) return true;
      let allCovered = true;
      for (let i = s.startPage; i <= s.endPage; i++) {
        if (!pagesReadSet.has(i)) {
          allCovered = false;
          break;
        }
      }
      return allCovered;
    });

    const completedJuz = juzList.filter((j) => {
      let allCovered = true;
      for (let i = j.startPage; i <= j.endPage; i++) {
        if (!pagesReadSet.has(i)) {
          allCovered = false;
          break;
        }
      }
      return allCovered;
    });

    const todayStr = format(new Date(), "yyyy-MM-dd");
    const todayPagesRead = logs
      .filter((l) => l.date === todayStr)
      .reduce((sum, l) => sum + l.pagesRead, 0);

    // Streak calculation
    const datesWithLogs = [...new Set(logs.map((l) => l.date))].sort((a, b) => b.localeCompare(a));
    let currentStreak = 0;
    let longestStreak = 0;
    let tempStreak = 0;
    let prevDate: Date | null = null;

    // A simpler streak approach for all historical dates:
    const allDatesDesc = [...datesWithLogs];
    
    // Compute current
    if (allDatesDesc.length > 0) {
      const latestDate = parseISO(allDatesDesc[0]);
      if (isToday(latestDate) || differenceInDays(new Date(), latestDate) === 1) {
        currentStreak = 1;
        for (let i = 1; i < allDatesDesc.length; i++) {
          const d1 = parseISO(allDatesDesc[i - 1]);
          const d2 = parseISO(allDatesDesc[i]);
          if (differenceInDays(d1, d2) === 1) {
            currentStreak++;
          } else {
            break;
          }
        }
      }
    }

    // Compute longest
    if (allDatesDesc.length > 0) {
      tempStreak = 1;
      longestStreak = 1;
      for (let i = 1; i < allDatesDesc.length; i++) {
        const d1 = parseISO(allDatesDesc[i - 1]);
        const d2 = parseISO(allDatesDesc[i]);
        if (differenceInDays(d1, d2) === 1) {
          tempStreak++;
          if (tempStreak > longestStreak) longestStreak = tempStreak;
        } else {
          tempStreak = 1;
        }
      }
    }

    // Heatmap (last 90 days)
    const heatmap: { date: string; pages: number }[] = [];
    const today = new Date();
    const pagesPerDate = logs.reduce((acc, log) => {
      acc[log.date] = (acc[log.date] || 0) + log.pagesRead;
      return acc;
    }, {} as Record<string, number>);

    for (let i = 89; i >= 0; i--) {
      const d = subDays(today, i);
      const dStr = format(d, "yyyy-MM-dd");
      heatmap.push({ date: dStr, pages: pagesPerDate[dStr] || 0 });
    }

    // Badges
    const unlockedBadges: string[] = [];
    if (totalPagesRead > 0) unlockedBadges.push("first-page");
    if (totalPagesRead >= 100) unlockedBadges.push("100-pages");
    if (pagesReadSet.has(302)) unlockedBadges.push("halfway");
    if (totalPagesRead >= 604) unlockedBadges.push("khatm");
    
    if (completedSurahs.length >= 10) unlockedBadges.push("10-surahs");
    if (completedSurahs.length >= 30) unlockedBadges.push("30-surahs");
    if (completedSurahs.length >= 114) unlockedBadges.push("all-surahs");
    
    if (completedJuz.length >= 1) unlockedBadges.push("1-juz");
    if (completedJuz.length >= 10) unlockedBadges.push("10-juz");
    if (completedJuz.length >= 30) unlockedBadges.push("all-juz");

    if (longestStreak >= 7) unlockedBadges.push("7-day-streak");
    if (longestStreak >= 30) unlockedBadges.push("30-day-streak");
    if (longestStreak >= 100) unlockedBadges.push("100-day-streak");

    return {
      pagesReadSet,
      totalPagesRead,
      progressPercent,
      completedSurahs,
      completedJuz,
      todayPagesRead,
      currentStreak,
      longestStreak,
      unlockedBadges,
      heatmap,
    };
  }, [state.logs, state.completedSurahsManual]);

  return {
    state,
    logs: state.logs,
    completedSurahsManual: state.completedSurahsManual,
    goal: state.goal,
    addLog,
    deleteLog,
    toggleSurah,
    setGoal,
    clearGoal,
    ...computed,
  };
}