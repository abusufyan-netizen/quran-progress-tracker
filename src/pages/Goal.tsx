import { useState } from "react";
import { useTrackerStore } from "@/hooks/useTrackerStore";
import { useDocumentMeta } from "@/hooks/useDocumentMeta";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon, Target, X } from "lucide-react";
import { format, differenceInDays } from "date-fns";
import { cn } from "@/lib/utils";
import { QURAN_PAGES } from "@/lib/constants";
import { toast } from "sonner";

export default function Goal() {
  useDocumentMeta({
    title: "Completion Goal",
    description: "Set a target completion date for the Quran and see exactly how many pages per day you need to read to stay on track.",
    canonicalPath: "/goal",
  });
  const { state, setGoal, clearGoal, totalPagesRead } = useTrackerStore();
  const { goal } = state;
  
  const [date, setDate] = useState<Date | undefined>(goal?.targetDate ? new Date(goal.targetDate) : undefined);
  const [dailyTarget, setDailyTarget] = useState<string>(goal?.dailyPagesTarget?.toString() || "");

  const handleSaveGoal = () => {
    if (!date) {
      toast.error("Select a target date");
      return;
    }
    const pages = parseInt(dailyTarget);
    setGoal({
      targetDate: format(date, "yyyy-MM-dd"),
      dailyPagesTarget: isNaN(pages) ? null : pages,
    });
    toast.success("Goal updated");
  };

  const handleClearGoal = () => {
    clearGoal();
    setDate(undefined);
    setDailyTarget("");
    toast.success("Goal cleared");
  };

  const pagesRemaining = QURAN_PAGES - totalPagesRead;
  let neededPace = 0;
  let statusStr = "";
  let statusColor = "";
  
  if (date) {
    const daysLeft = Math.max(1, differenceInDays(date, new Date()));
    neededPace = Math.ceil(pagesRemaining / daysLeft);
    if (goal?.dailyPagesTarget) {
      if (neededPace > goal.dailyPagesTarget) {
        statusStr = "Behind";
        statusColor = "bg-amber-500/20 text-amber-700 dark:text-amber-400";
      } else if (neededPace < goal.dailyPagesTarget) {
        statusStr = "Ahead";
        statusColor = "bg-accent/20 text-accent-foreground";
      } else {
        statusStr = "On Track";
        statusColor = "bg-green-500/20 text-green-700 dark:text-green-400";
      }
    }
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500 max-w-2xl mx-auto">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Set a Goal</h1>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Completion Date</CardTitle>
            <CardDescription>When do you want to finish the Quran?</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex flex-col space-y-2">
              <Label>Target Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !date && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    disabled={(date) => date < new Date()}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            {date && (
              <div className="p-4 bg-muted/50 rounded-lg space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Pages Remaining:</span>
                  <span className="font-medium">{pagesRemaining}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Days Remaining:</span>
                  <span className="font-medium">{Math.max(1, differenceInDays(date, new Date()))}</span>
                </div>
                <div className="flex justify-between items-center pt-2 border-t border-border/50">
                  <span className="font-medium">Required Pace:</span>
                  <span className="text-xl font-bold text-primary">{neededPace} <span className="text-sm font-normal text-muted-foreground">pages/day</span></span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Daily Target</CardTitle>
            <CardDescription>How many pages do you aim to read each day?</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Pages per day</Label>
              <Input 
                type="number" 
                min="1" 
                placeholder="e.g. 5"
                value={dailyTarget}
                onChange={(e) => setDailyTarget(e.target.value)}
              />
            </div>
            
            {statusStr && (
              <div className="flex items-center gap-2 mt-2">
                <span className="text-sm text-muted-foreground">Status:</span>
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColor}`}>
                  {statusStr}
                </span>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="flex gap-4">
          <Button onClick={handleSaveGoal} className="flex-1">
            <Target className="mr-2 h-4 w-4" /> Save Goal
          </Button>
          {goal && (
            <Button variant="outline" onClick={handleClearGoal} className="text-destructive hover:text-destructive">
              <X className="mr-2 h-4 w-4" /> Clear Goal
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}