import { useTrackerStore } from "@/hooks/useTrackerStore";
import { useDocumentMeta } from "@/hooks/useDocumentMeta";
import { ProgressRing } from "@/components/ProgressRing";
import { StatCard } from "@/components/StatCard";
import { ReadingHeatmap } from "@/components/ReadingHeatmap";
import { VerseOfTheDay } from "@/components/VerseOfTheDay";
import { BadgeCard } from "@/components/BadgeCard";
import { Flame, BookOpen, Calendar, Target, Plus } from "lucide-react";
import { badges } from "@/data/badges";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "wouter";
import { motion, Variants } from "framer-motion";

export default function Dashboard() {
  useDocumentMeta({
    title: "Mushaf — Quran Progress Tracker",
    description: "Your personal dashboard for tracking Quran reading progress, daily streaks, completion goals, and milestone badges.",
    canonicalPath: "/",
  });
  const { totalPagesRead, progressPercent, todayPagesRead, currentStreak, longestStreak, unlockedBadges, heatmap, goal } = useTrackerStore();

  const recentBadges = badges
    .filter(b => unlockedBadges.includes(b.id))
    .slice(-3)
    .reverse();

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 12, scale: 0.98 },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: { duration: 0.4, ease: [0.23, 1, 0.32, 1] } 
    }
  };

  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      variants={{
        visible: {
          transition: { staggerChildren: 0.08 }
        }
      }}
      className="space-y-6 md:space-y-8"
    >
      
      {/* Hero Row */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="flex flex-col items-center justify-center p-6 bg-gradient-to-br from-primary/5 to-background border-primary/10">
          <ProgressRing value={progressPercent} size={160} />
          <p className="mt-4 text-sm font-medium text-muted-foreground">{totalPagesRead} / 604 pages read</p>
        </Card>
        <div className="md:col-span-2 grid grid-cols-2 gap-4">
          <StatCard title="Current Streak" value={currentStreak} subtitle="days" icon={Flame} />
          <StatCard title="Longest Streak" value={longestStreak} subtitle="days" icon={Target} />
          <StatCard title="Read Today" value={todayPagesRead} subtitle="pages" icon={Calendar} />
          <StatCard title="Total Read" value={totalPagesRead} subtitle="pages" icon={BookOpen} />
        </div>
      </motion.div>

      {goal && (
        <motion.div variants={itemVariants}>
          <Card className="bg-accent/10 border-accent/20 transition-all duration-300 hover:bg-accent/15">
            <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Daily Target</p>
              <p className="text-2xl font-bold">{goal.dailyPagesTarget} <span className="text-sm font-normal text-muted-foreground">pages/day</span></p>
            </div>
            <div className="px-3 py-1 bg-green-500/20 text-green-700 dark:text-green-400 rounded-full text-sm font-medium">
              On Track
            </div>
          </CardContent>
          </Card>
        </motion.div>
      )}

      {totalPagesRead === 0 && (
        <motion.div variants={itemVariants}>
          <Card className="border-dashed bg-muted/50 transition-all duration-300 hover:bg-muted/70">
            <CardContent className="flex flex-col items-center justify-center py-12 text-center space-y-4">
            <BookOpen className="h-12 w-12 text-muted-foreground opacity-50" />
            <div>
              <h3 className="text-lg font-semibold">Begin your journey</h3>
              <p className="text-sm text-muted-foreground max-w-sm mx-auto mt-1">
                Log your first pages to start tracking your progress through the Quran.
              </p>
            </div>
            <Link href="/log">
              <Button className="mt-4">
                <Plus className="mr-2 h-4 w-4" /> Log Reading
              </Button>
            </Link>
          </CardContent>
          </Card>
        </motion.div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <motion.div variants={itemVariants} className="space-y-6">
          <Card className="transition-all duration-300 hover:shadow-md">
            <CardContent className="p-4 md:p-6">
              <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-4">Reading Activity</h3>
              <ReadingHeatmap data={heatmap} />
            </CardContent>
          </Card>
          <VerseOfTheDay />
        </motion.div>
        
        <motion.div variants={itemVariants} className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Recent Achievements</h3>
            <Link href="/badges" className="text-sm text-primary hover:underline">View all</Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {recentBadges.length > 0 ? (
              recentBadges.map(badge => (
                <BadgeCard key={badge.id} badge={badge} unlocked={true} />
              ))
            ) : (
              <div className="col-span-full py-8 text-center text-sm text-muted-foreground border rounded-xl border-dashed">
                Read to unlock badges
              </div>
            )}
          </div>
        </motion.div>
      </div>

    </motion.div>
  );
}