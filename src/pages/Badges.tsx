import { useTrackerStore } from "@/hooks/useTrackerStore";
import { useDocumentMeta } from "@/hooks/useDocumentMeta";
import { badges } from "@/data/badges";
import { BadgeCard } from "@/components/BadgeCard";
import { Progress } from "@/components/ui/progress";

export default function Badges() {
  useDocumentMeta({
    title: "Milestone Badges",
    description: "Unlock milestone badges as you complete Surahs, finish Juz, build streaks, and progress toward khatm of the Quran.",
    canonicalPath: "/badges",
  });
  const { unlockedBadges, totalPagesRead, completedSurahs, completedJuz, longestStreak } = useTrackerStore();

  const unlockedCount = unlockedBadges.length;
  const totalCount = badges.length;
  const progressPercent = Math.round((unlockedCount / totalCount) * 100);

  const getProgressText = (badgeId: string) => {
    switch (badgeId) {
      case "first-page":
        return `${Math.min(1, totalPagesRead)} / 1 pages`;
      case "100-pages":
        return `${Math.min(100, totalPagesRead)} / 100 pages`;
      case "halfway":
        return `${Math.min(302, totalPagesRead)} / 302 pages`;
      case "khatm":
        return `${Math.min(604, totalPagesRead)} / 604 pages`;
      case "10-surahs":
        return `${Math.min(10, completedSurahs.length)} / 10 Surahs`;
      case "30-surahs":
        return `${Math.min(30, completedSurahs.length)} / 30 Surahs`;
      case "all-surahs":
        return `${Math.min(114, completedSurahs.length)} / 114 Surahs`;
      case "1-juz":
        return `${Math.min(1, completedJuz.length)} / 1 Juz`;
      case "10-juz":
        return `${Math.min(10, completedJuz.length)} / 10 Juz`;
      case "all-juz":
        return `${Math.min(30, completedJuz.length)} / 30 Juz`;
      case "7-day-streak":
        return `${Math.min(7, longestStreak)} / 7 days`;
      case "30-day-streak":
        return `${Math.min(30, longestStreak)} / 30 days`;
      case "100-day-streak":
        return `${Math.min(100, longestStreak)} / 100 days`;
      default:
        return "";
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="text-center space-y-4 py-8">
        <h1 className="text-3xl font-bold tracking-tight">Achievements</h1>
        <p className="text-muted-foreground max-w-md mx-auto">
          Unlock badges as you progress through your reading journey.
        </p>
        
        <div className="max-w-xs mx-auto pt-4">
          <div className="flex justify-between text-sm font-medium mb-2">
            <span>{unlockedCount} Unlocked</span>
            <span>{totalCount} Total</span>
          </div>
          <Progress value={progressPercent} className="h-2" />
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 pb-20">
        {badges.map(badge => (
          <BadgeCard 
            key={badge.id} 
            badge={badge} 
            unlocked={unlockedBadges.includes(badge.id)} 
            progressText={getProgressText(badge.id)}
          />
        ))}
      </div>
    </div>
  );
}