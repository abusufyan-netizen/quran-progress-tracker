import { useTrackerStore } from "@/hooks/useTrackerStore";
import { useDocumentMeta } from "@/hooks/useDocumentMeta";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { format, parseISO } from "date-fns";
import { Trash2, Book } from "lucide-react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { surahs } from "@/data/surahs";
import { Badge } from "@/components/ui/badge";

export default function Log() {
  useDocumentMeta({
    title: "Log Reading",
    description: "Log your Quran reading by page, Surah, or Juz. Review and manage your full reading history with timestamps.",
    canonicalPath: "/log",
  });
  const { state, deleteLog } = useTrackerStore();
  const { logs } = state;

  const sortedLogs = [...logs].sort((a, b) => {
    const dateCompare = b.date.localeCompare(a.date);
    if (dateCompare !== 0) return dateCompare;
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  const groupedLogs = sortedLogs.reduce((acc, log) => {
    if (!acc[log.date]) acc[log.date] = [];
    acc[log.date].push(log);
    return acc;
  }, {} as Record<string, typeof logs>);

  return (
    <div className="space-y-6 animate-in fade-in duration-500 max-w-3xl mx-auto">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Reading Log</h1>
      </div>

      {logs.length === 0 ? (
        <Card className="border-dashed bg-muted/50">
          <CardContent className="flex flex-col items-center justify-center py-12 text-center space-y-4">
            <Book className="h-12 w-12 text-muted-foreground opacity-50" />
            <h3 className="text-lg font-semibold">No entries yet</h3>
            <p className="text-sm text-muted-foreground max-w-sm">Your reading history will appear here once you log your first pages.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-8">
          {Object.entries(groupedLogs).map(([dateStr, dayLogs]) => (
            <div key={dateStr} className="space-y-4">
              <h3 className="text-xl font-bold border-b pb-2">
                {format(parseISO(dateStr), "MMM d, yyyy")}
              </h3>
              <div className="space-y-3">
                {dayLogs.map((log) => (
                  <Card key={log.id} className="overflow-hidden">
                    <CardContent className="p-4 flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <Badge variant="secondary" className="uppercase text-[10px] px-2 py-0.5 tracking-wider">
                          {log.mode}
                        </Badge>
                        <div>
                          <p className="font-semibold">
                            {log.mode === "surah" && log.surahNumber 
                              ? `Surah ${surahs.find(s => s.number === log.surahNumber)?.nameTransliteration}` 
                              : log.mode === "juz" && log.juzNumber
                                ? `Juz ${log.juzNumber}`
                                : `Pages ${log.fromPage} - ${log.toPage}`
                            }
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {log.pagesRead} {log.pagesRead === 1 ? 'page' : 'pages'} (p. {log.fromPage}-{log.toPage})
                          </p>
                        </div>
                      </div>
                      
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive hover:bg-destructive/10">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete entry?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This will remove this reading session and recalculate your progress. This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction className="bg-destructive hover:bg-destructive/90" onClick={() => deleteLog(log.id)}>
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}