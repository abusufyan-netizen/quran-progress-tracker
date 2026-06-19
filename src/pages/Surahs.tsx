import { useState } from "react";
import { useTrackerStore } from "@/hooks/useTrackerStore";
import { useDocumentMeta } from "@/hooks/useDocumentMeta";
import { surahs } from "@/data/surahs";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { motion, AnimatePresence } from "framer-motion";
import { Search } from "lucide-react";
import { Link } from "wouter";

export default function Surahs() {
  useDocumentMeta({
    title: "All 114 Surahs",
    description: "Browse and track every Surah of the Quran. Mark Surahs complete, view Arabic names, ayah counts, and your reading progress for each one.",
    canonicalPath: "/surahs",
  });
  const { pagesReadSet, completedSurahsManual, toggleSurah } = useTrackerStore();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [juzFilter, setJuzFilter] = useState("All");

  const isSurahCompleted = (surah: typeof surahs[0]) => {
    if (completedSurahsManual.includes(surah.number)) return true;
    for (let i = surah.startPage; i <= surah.endPage; i++) {
      if (!pagesReadSet.has(i)) return false;
    }
    return true;
  };

  const getSurahProgress = (surah: typeof surahs[0]) => {
    if (completedSurahsManual.includes(surah.number)) return 100;
    let read = 0;
    const total = surah.endPage - surah.startPage + 1;
    for (let i = surah.startPage; i <= surah.endPage; i++) {
      if (pagesReadSet.has(i)) read++;
    }
    return (read / total) * 100;
  };

  const filteredSurahs = surahs.filter(surah => {
    const matchesSearch = surah.nameTransliteration.toLowerCase().includes(search.toLowerCase()) || 
                          surah.nameEnglish.toLowerCase().includes(search.toLowerCase()) ||
                          surah.number.toString() === search;
    const completed = isSurahCompleted(surah);
    
    let matchesFilter = true;
    if (filter === "Meccan") matchesFilter = surah.revelationType === "Meccan";
    if (filter === "Medinan") matchesFilter = surah.revelationType === "Medinan";
    if (filter === "Completed") matchesFilter = completed;
    if (filter === "Incomplete") matchesFilter = !completed;

    let matchesJuz = true;
    if (juzFilter !== "All") matchesJuz = surah.juz.toString() === juzFilter;

    return matchesSearch && matchesFilter && matchesJuz;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h1 className="text-3xl font-bold tracking-tight">The 114 Surahs</h1>
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search..." 
              className="pl-9" 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="w-full sm:w-36">
              <SelectValue placeholder="Filter" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All</SelectItem>
              <SelectItem value="Meccan">Meccan</SelectItem>
              <SelectItem value="Medinan">Medinan</SelectItem>
              <SelectItem value="Completed">Completed</SelectItem>
              <SelectItem value="Incomplete">Incomplete</SelectItem>
            </SelectContent>
          </Select>
          <Select value={juzFilter} onValueChange={setJuzFilter}>
            <SelectTrigger className="w-full sm:w-32">
              <SelectValue placeholder="Juz" />
            </SelectTrigger>
            <SelectContent className="max-h-[300px]">
              <SelectItem value="All">All Juz</SelectItem>
              {Array.from({ length: 30 }, (_, i) => i + 1).map(num => (
                <SelectItem key={num} value={num.toString()}>Juz {num}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-20">
        <AnimatePresence>
          {filteredSurahs.map((surah, index) => {
            const completed = isSurahCompleted(surah);
            const progress = getSurahProgress(surah);
            
            return (
              <motion.div 
                layout
                initial={{ opacity: 0, y: 12, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ 
                  duration: 0.3,
                  ease: [0.23, 1, 0.32, 1],
                  delay: index < 12 ? index * 0.04 : 0 
                }}
                key={surah.number}
              >
                <Card className={`overflow-hidden transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 hover:border-primary/40 cursor-pointer ${completed ? 'border-primary/30 bg-primary/5' : ''}`}>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-4">
                      <div onClick={(e) => e.stopPropagation()}>
                        <Checkbox 
                          checked={completed}
                          onCheckedChange={() => toggleSurah(surah.number)}
                          className="h-6 w-6 rounded-full border-2 transition-transform data-[state=checked]:scale-110"
                          aria-label={`Mark Surah ${surah.nameTransliteration} complete`}
                        />
                      </div>
                      <Link href={`/surahs/${surah.number}`} className="flex-1 flex justify-between items-center">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-accent/20 text-accent flex items-center justify-center font-bold text-sm">
                            {surah.number}
                          </div>
                          <div>
                            <h3 className="font-bold text-lg leading-tight">{surah.nameTransliteration}</h3>
                            <p className="text-sm text-muted-foreground">{surah.nameEnglish}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <h3 className="font-arabic text-2xl leading-none" dir="rtl">{surah.nameArabic}</h3>
                        </div>
                      </Link>
                    </div>
                    
                    <Link href={`/surahs/${surah.number}`} className="block">
                      <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground font-medium mb-2">
                        <span className="px-2 py-1 bg-secondary rounded-md">{surah.revelationType}</span>
                        <span>{surah.totalAyahs} Ayahs</span>
                        <span>p. {surah.startPage} - {surah.endPage}</span>
                      </div>
                      
                      <Progress value={progress} className="h-1.5" />
                    </Link>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}