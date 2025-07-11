import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useGlobalClickHandler } from "@/hooks/use-global-audio-manager";
import { MobileAudioUnlock } from "@/components/mobile-audio-unlock";
import DreamChat from "@/pages/dream-chat";
import DreamAnalysis from "@/pages/dream-analysis";
import VisionBoard from "@/pages/vision-board";
import FitbitCallback from "@/pages/fitbit-callback";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={DreamChat} />
      <Route path="/analysis" component={DreamAnalysis} />
      <Route path="/vision-board" component={VisionBoard} />
      <Route path="/fitbit-callback" component={FitbitCallback} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  useGlobalClickHandler();
  
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <MobileAudioUnlock />
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
