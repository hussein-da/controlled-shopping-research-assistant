import { useEffect } from "react";
import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { StudyProvider } from "@/lib/study-context";
import { AdminLink } from "@/components/admin-link";

import StudyStart from "@/pages/study-start";
import Consent from "@/pages/consent";
import PreSurvey from "@/pages/pre-survey";
import Task from "@/pages/task";
import ShoppingResearch from "@/pages/shopping-research";
import Guide from "@/pages/guide";
import Choice from "@/pages/choice";
import PostSurvey from "@/pages/post-survey";
import Debrief from "@/pages/debrief";
import Admin from "@/pages/admin";

function ScrollToTop() {
  const [location] = useLocation();
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);
  
  return null;
}

function Router() {
  return (
    <>
      <ScrollToTop />
      <Switch>
        <Route path="/" component={StudyStart} />
        <Route path="/start" component={StudyStart} />
        <Route path="/consent" component={Consent} />
        <Route path="/pre" component={PreSurvey} />
        <Route path="/task" component={Task} />
        <Route path="/assistant" component={ShoppingResearch} />
        <Route path="/guide" component={Guide} />
        <Route path="/choice" component={Choice} />
        <Route path="/post" component={PostSurvey} />
        <Route path="/debrief" component={Debrief} />
        <Route path="/admin" component={Admin} />
      </Switch>
    </>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <StudyProvider>
          <Toaster />
          <Router />
          <AdminLink />
        </StudyProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
