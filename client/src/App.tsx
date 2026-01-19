import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { StudyProvider } from "@/lib/study-context";

import StudyStart from "@/pages/study-start";
import Consent from "@/pages/consent";
import PreSurvey from "@/pages/pre-survey";
import Task from "@/pages/task";
import ShoppingResearch from "@/pages/shopping-research";
import PostSurvey from "@/pages/post-survey";
import Debrief from "@/pages/debrief";
import Admin from "@/pages/admin";

function Router() {
  return (
    <Switch>
      <Route path="/" component={StudyStart} />
      <Route path="/start" component={StudyStart} />
      <Route path="/consent" component={Consent} />
      <Route path="/pre-survey" component={PreSurvey} />
      <Route path="/task" component={Task} />
      <Route path="/assistant" component={ShoppingResearch} />
      <Route path="/post-survey" component={PostSurvey} />
      <Route path="/debrief" component={Debrief} />
      <Route path="/admin" component={Admin} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <StudyProvider>
          <Toaster />
          <Router />
        </StudyProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
