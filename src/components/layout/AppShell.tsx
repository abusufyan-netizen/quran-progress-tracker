import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Moon, Sun, Home, BookOpen, NotebookPen, Target, Award, Plus, Book } from "lucide-react";
import { QuickAddDialog } from "../QuickAddDialog";
import { Button } from "@/components/ui/button";

export function AppShell({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const [isDark, setIsDark] = useState(false);
  const [isQuickAddOpen, setIsQuickAddOpen] = useState(false);

  useEffect(() => {
    if (document.documentElement.classList.contains("dark")) {
      setIsDark(true);
    }
  }, []);

  const toggleDark = () => {
    const next = !isDark;
    setIsDark(next);
    if (next) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  const navItems = [
    { href: "/", label: "Dashboard", icon: Home },
    { href: "/surahs", label: "Surahs", icon: BookOpen },
    { href: "/log", label: "Log", icon: NotebookPen },
    { href: "/goal", label: "Goal", icon: Target },
    { href: "/badges", label: "Badges", icon: Award },
  ];

  return (
    <div className="min-h-[100dvh] flex flex-col bg-background text-foreground transition-colors duration-200 pb-20 md:pb-0">
      {/* Desktop Header */}
      <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex h-16 items-center px-4 max-w-6xl mx-auto w-full">
          <Link href="/" className="flex items-center gap-2 mr-8">
            <div className="bg-primary text-primary-foreground p-1.5 rounded-md">
              <Book className="h-5 w-5" />
            </div>
            <span className="font-bold text-lg tracking-tight">Mushaf</span>
          </Link>
          
          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1 flex-1">
            {navItems.map((item) => (
              <Link 
                key={item.href} 
                href={item.href}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors hover:bg-accent/10 ${location === item.href ? 'text-primary bg-accent/15' : 'text-muted-foreground'}`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2 ml-auto">
            <Button variant="ghost" size="icon" onClick={toggleDark} className="rounded-full">
              {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>
            <Button onClick={() => setIsQuickAddOpen(true)} className="hidden md:flex bg-primary hover:bg-primary/90">
              <Plus className="mr-2 h-4 w-4" /> Quick Add
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 w-full max-w-6xl mx-auto p-4 md:p-6 lg:p-8">
        {children}
      </main>

      {/* Footer */}
      <footer className="hidden md:block border-t bg-background/60">
        <div className="max-w-6xl mx-auto px-4 py-6 flex items-center justify-between text-xs text-muted-foreground">
          <p>Mushaf — a free, private Quran progress tracker.</p>
          <nav className="flex items-center gap-4">
            <Link href="/about" className="hover:text-foreground transition-colors">About</Link>
          </nav>
        </div>
      </footer>

      {/* Mobile Bottom Tab Bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 border-t bg-background flex items-center justify-around h-16 px-2 pb-safe">
        {navItems.map((item) => {
          const isActive = location === item.href;
          return (
            <Link 
              key={item.href} 
              href={item.href}
              className={`flex flex-col items-center justify-center w-full h-full space-y-1 ${isActive ? 'text-primary' : 'text-muted-foreground'}`}
            >
              <item.icon className={`h-5 w-5 ${isActive ? 'fill-primary/20' : ''}`} />
              <span className="text-[10px] font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Mobile Floating Action Button */}
      <button 
        onClick={() => setIsQuickAddOpen(true)}
        className="md:hidden fixed bottom-20 right-4 z-50 bg-accent text-accent-foreground rounded-full p-4 shadow-lg hover:bg-accent/90 transition-transform active:scale-95"
      >
        <Plus className="h-6 w-6" />
      </button>

      <QuickAddDialog open={isQuickAddOpen} onOpenChange={setIsQuickAddOpen} />
    </div>
  );
}