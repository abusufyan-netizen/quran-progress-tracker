import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as SonnerToaster } from "sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AppShell } from "@/components/layout/AppShell";
import NotFound from "@/pages/not-found";

import Dashboard from "@/pages/Dashboard";
import Surahs from "@/pages/Surahs";
import SurahDetail from "@/pages/SurahDetail";
import Log from "@/pages/Log";
import Goal from "@/pages/Goal";
import Badges from "@/pages/Badges";
import About from "@/pages/About";

const queryClient = new QueryClient();

function Router() {
  return (
    <Switch>
      <Route path="/" component={Dashboard} />
      <Route path="/surahs" component={Surahs} />
      <Route path="/surahs/:number" component={SurahDetail} />
      <Route path="/log" component={Log} />
      <Route path="/goal" component={Goal} />
      <Route path="/badges" component={Badges} />
      <Route path="/about" component={About} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <AppShell>
            <Router />
          </AppShell>
        </WouterRouter>
        <Toaster />
        <SonnerToaster richColors position="top-center" />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;