import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import SimpleDreamAnalyzer from "./components/simple-dream-analyzer";

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <SimpleDreamAnalyzer />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
