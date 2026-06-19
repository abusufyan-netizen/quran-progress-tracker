import { useMemo } from "react";
import { format, subDays, startOfWeek, addDays } from "date-fns";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface HeatmapProps {
  data: { date: string; pages: number }[];
}

export function ReadingHeatmap({ data }: HeatmapProps) {
  // Map date string to pages read
  const dataMap = useMemo(() => {
    return new Map(data.map((d) => [d.date, d.pages]));
  }, [data]);

  // Generate last 90 days grid
  const grid = useMemo(() => {
    const today = new Date();
    // We want 13 columns ending in current week
    const end = today;
    const start = subDays(today, 89);
    const startGrid = startOfWeek(start); // Sunday of the 90-days-ago week

    const weeks: Date[][] = [];
    let current = startGrid;
    while (current <= end) {
      const week: Date[] = [];
      for (let i = 0; i < 7; i++) {
        week.push(current);
        current = addDays(current, 1);
      }
      weeks.push(week);
    }
    return weeks;
  }, []);

  const getColorClass = (pages: number) => {
    if (pages === 0) return "bg-secondary";
    if (pages <= 5) return "bg-[#34d399]/40"; // light emerald approx
    if (pages <= 15) return "bg-[#059669]/70"; // mid emerald approx
    return "bg-primary"; // deep emerald
  };

  const todayStr = format(new Date(), "yyyy-MM-dd");

  return (
    <div className="w-full overflow-x-auto pb-2">
      <div className="min-w-fit">
        <div className="flex gap-1.5">
          {grid.map((week, wIndex) => (
            <div key={wIndex} className="flex flex-col gap-1.5">
              {week.map((day, dIndex) => {
                const dateStr = format(day, "yyyy-MM-dd");
                const pages = dataMap.get(dateStr) || 0;
                const isTodayStr = dateStr === todayStr;
                const outOfRange = day > new Date() || day < subDays(new Date(), 90);

                if (outOfRange) {
                  return <div key={dIndex} className="w-3 h-3 rounded-sm opacity-0" />;
                }

                return (
                  <TooltipProvider key={dIndex} delayDuration={100}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div
                          className={`w-3 h-3 rounded-sm transition-all duration-300 hover:ring-2 hover:ring-accent hover:ring-offset-1 hover:ring-offset-background ${getColorClass(pages)} ${isTodayStr ? 'ring-1 ring-accent ring-offset-1 ring-offset-background' : ''}`}
                        />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="text-xs">
                          <span className="font-semibold">{format(day, "MMM d, yyyy")}</span>
                          <br />
                          {pages} {pages === 1 ? 'page' : 'pages'} read
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}