import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useTrackerStore } from "@/hooks/useTrackerStore";
import { surahs } from "@/data/surahs";
import { juzList } from "@/data/juz";
import { toast } from "sonner";
import { QURAN_PAGES } from "@/lib/constants";

export function QuickAddDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const { addLog } = useTrackerStore();
  const [date, setDate] = useState<Date>(new Date());
  
  // Pages State
  const [fromPage, setFromPage] = useState("");
  const [toPage, setToPage] = useState("");
  
  // Surah State
  const [surahId, setSurahId] = useState("");
  
  // Juz State
  const [juzId, setJuzId] = useState("");

  const handleAddPages = () => {
    const from = parseInt(fromPage);
    const to = parseInt(toPage);
    
    if (isNaN(from) || isNaN(to) || from < 1 || to > QURAN_PAGES || from > to) {
      toast.error("Invalid page range", { description: `Please enter valid pages between 1 and ${QURAN_PAGES}.` });
      return;
    }

    const pagesCount = to - from + 1;
    addLog({
      mode: "pages",
      date: format(date, "yyyy-MM-dd"),
      fromPage: from,
      toPage: to,
      pagesRead: pagesCount,
    });
    
    toast.success(`Logged ${pagesCount} pages`);
    resetAndClose();
  };

  const handleAddSurah = () => {
    const surah = surahs.find(s => s.number.toString() === surahId);
    if (!surah) {
      toast.error("Please select a Surah");
      return;
    }

    const pagesCount = surah.endPage - surah.startPage + 1;
    addLog({
      mode: "surah",
      date: format(date, "yyyy-MM-dd"),
      fromPage: surah.startPage,
      toPage: surah.endPage,
      pagesRead: pagesCount,
      surahNumber: surah.number,
    });

    toast.success(`Logged Surah ${surah.nameEnglish} (${pagesCount} pages)`);
    resetAndClose();
  };

  const handleAddJuz = () => {
    const juz = juzList.find(j => j.number.toString() === juzId);
    if (!juz) {
      toast.error("Please select a Juz");
      return;
    }

    const pagesCount = juz.endPage - juz.startPage + 1;
    addLog({
      mode: "juz",
      date: format(date, "yyyy-MM-dd"),
      fromPage: juz.startPage,
      toPage: juz.endPage,
      pagesRead: pagesCount,
      juzNumber: juz.number,
    });

    toast.success(`Logged Juz ${juz.number} (${pagesCount} pages)`);
    resetAndClose();
  };

  const resetAndClose = () => {
    setFromPage("");
    setToPage("");
    setSurahId("");
    setJuzId("");
    setDate(new Date());
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Log Reading</DialogTitle>
          <DialogDescription>Record your Quran reading progress.</DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="flex flex-col space-y-2">
            <Label>Date</Label>
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
                  onSelect={(d) => d && setDate(d)}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          <Tabs defaultValue="pages" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="pages">Pages</TabsTrigger>
              <TabsTrigger value="surah">Surah</TabsTrigger>
              <TabsTrigger value="juz">Juz</TabsTrigger>
            </TabsList>
            
            <TabsContent value="pages" className="space-y-4 pt-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="from">From Page</Label>
                  <Input 
                    id="from" 
                    type="number" 
                    min="1" 
                    max={QURAN_PAGES} 
                    placeholder="1"
                    value={fromPage}
                    onChange={(e) => setFromPage(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="to">To Page</Label>
                  <Input 
                    id="to" 
                    type="number" 
                    min="1" 
                    max={QURAN_PAGES} 
                    placeholder="604"
                    value={toPage}
                    onChange={(e) => setToPage(e.target.value)}
                  />
                </div>
              </div>
              <Button className="w-full" onClick={handleAddPages}>Log Pages</Button>
            </TabsContent>

            <TabsContent value="surah" className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label>Select Surah</Label>
                <Select value={surahId} onValueChange={setSurahId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a Surah" />
                  </SelectTrigger>
                  <SelectContent className="max-h-[300px]">
                    {surahs.map((surah) => (
                      <SelectItem key={surah.number} value={surah.number.toString()}>
                        {surah.number}. {surah.nameTransliteration} (p.{surah.startPage}-{surah.endPage})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button className="w-full" onClick={handleAddSurah} disabled={!surahId}>Log Surah</Button>
            </TabsContent>

            <TabsContent value="juz" className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label>Select Juz</Label>
                <Select value={juzId} onValueChange={setJuzId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a Juz" />
                  </SelectTrigger>
                  <SelectContent className="max-h-[300px]">
                    {juzList.map((juz) => (
                      <SelectItem key={juz.number} value={juz.number.toString()}>
                        Juz {juz.number}: {juz.name} (p.{juz.startPage}-{juz.endPage})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button className="w-full" onClick={handleAddJuz} disabled={!juzId}>Log Juz</Button>
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
}