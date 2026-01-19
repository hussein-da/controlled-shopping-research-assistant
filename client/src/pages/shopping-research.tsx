import { useState, useEffect, useCallback } from 'react';
import { useLocation } from 'wouter';
import { 
  AppState, 
  WorkflowState, 
  WorkflowAnswers,
  products, 
  STUDY_PROMPT, 
  NORMALIZED_TARGET,
  ProductRating,
  DeviationFlags,
  RequirementAnswers
} from '@shared/schema';
import { useStudy } from '@/lib/study-context';
import { Sidebar } from '@/components/shopping/sidebar';
import { Topbar } from '@/components/shopping/topbar';
import { ChatInput } from '@/components/shopping/chat-input';
import { StartScreen } from '@/components/shopping/start-screen';
import { UserMessage } from '@/components/shopping/user-message';
import { GatheringRequirements } from '@/components/shopping/gathering-requirements';
import { ReviewGate } from '@/components/shopping/review-gate';
import { ProductCardView } from '@/components/shopping/product-card-view';
import { TransitionScreen } from '@/components/shopping/transition-screen';
import { LoadingDots, StatusDisplay } from '@/components/shopping/status-display';

const TIMER_DURATION = 20000;
const PRODUCT_TIMER_DURATION = 15000;

export default function ShoppingResearch() {
  const [, setLocation] = useLocation();
  const { session, updateRequirements, submitRating, logEvent } = useStudy();
  
  const [appState, setAppState] = useState<AppState>('start');
  const [workflowState, setWorkflowState] = useState<WorkflowState>({
    userPrompt: '',
    userTypedPrompt: '',
    answers: {},
    currentProductIndex: 0,
    productRatings: {},
  });
  const [inputValue, setInputValue] = useState(STUDY_PROMPT);
  const [isInputDisabled, setIsInputDisabled] = useState(false);
  const [previousSelection, setPreviousSelection] = useState<string | undefined>(undefined);
  const [productStatus, setProductStatus] = useState<string>('');
  const [shoppingModeSelected, setShoppingModeSelected] = useState(false);
  const [startTime, setStartTime] = useState<number>(0);

  const handleModeSelect = useCallback((mode: string) => {
    if (mode === 'shopping') {
      setShoppingModeSelected(true);
      logEvent('mode_selected', { mode: 'shopping' });
    }
  }, [logEvent]);

  const handleSendMessage = useCallback(() => {
    if (!isInputDisabled && shoppingModeSelected) {
      setWorkflowState(prev => ({ ...prev, userPrompt: STUDY_PROMPT, userTypedPrompt: inputValue }));
      setIsInputDisabled(true);
      setAppState('loading');
      setStartTime(Date.now());
      logEvent('message_sent', { prompt: STUDY_PROMPT });
      
      setTimeout(() => {
        setAppState('starting');
      }, 800);
      
      setTimeout(() => {
        setAppState('r1_budget');
        setPreviousSelection(undefined);
      }, 3500);
    }
  }, [isInputDisabled, shoppingModeSelected, inputValue, logEvent]);

  const computeDeviationFlags = (answers: WorkflowAnswers): DeviationFlags => {
    return {
      r1_deviated: !answers.r1_budget?.includes(NORMALIZED_TARGET.budget),
      r2_deviated: !answers.r2_roast?.includes(NORMALIZED_TARGET.roast),
      r3_deviated: !answers.r3_grind?.includes(NORMALIZED_TARGET.grind),
      r4_deviated: !answers.r4_attributes?.includes(NORMALIZED_TARGET.attributes),
    };
  };

  const handleR1BudgetSelect = useCallback((values: string[]) => {
    const newAnswers = { ...workflowState.answers, r1_budget: values };
    setWorkflowState(prev => ({ ...prev, answers: newAnswers }));
    setPreviousSelection(values.join(', '));
    
    const requirementAnswers: RequirementAnswers = {
      r1_budget: values,
      r2_roast: newAnswers.r2_roast || [],
      r3_grind: newAnswers.r3_grind || [],
      r4_attributes: newAnswers.r4_attributes || [],
    };
    const deviations = computeDeviationFlags(newAnswers);
    updateRequirements(requirementAnswers, deviations);
    logEvent('requirement_answered', { question: 'r1_budget', answer: values });
    setAppState('r2_roast');
  }, [workflowState.answers, updateRequirements, logEvent]);

  const handleR2RoastSelect = useCallback((values: string[]) => {
    const newAnswers = { ...workflowState.answers, r2_roast: values };
    setWorkflowState(prev => ({ ...prev, answers: newAnswers }));
    setPreviousSelection(values.join(', '));
    
    const requirementAnswers: RequirementAnswers = {
      r1_budget: newAnswers.r1_budget || [],
      r2_roast: values,
      r3_grind: newAnswers.r3_grind || [],
      r4_attributes: newAnswers.r4_attributes || [],
    };
    const deviations = computeDeviationFlags(newAnswers);
    updateRequirements(requirementAnswers, deviations);
    logEvent('requirement_answered', { question: 'r2_roast', answer: values });
    setAppState('r3_grind');
  }, [workflowState.answers, updateRequirements, logEvent]);

  const handleR3GrindSelect = useCallback((values: string[]) => {
    const newAnswers = { ...workflowState.answers, r3_grind: values };
    setWorkflowState(prev => ({ ...prev, answers: newAnswers }));
    setPreviousSelection(values.join(', '));
    
    const requirementAnswers: RequirementAnswers = {
      r1_budget: newAnswers.r1_budget || [],
      r2_roast: newAnswers.r2_roast || [],
      r3_grind: values,
      r4_attributes: newAnswers.r4_attributes || [],
    };
    const deviations = computeDeviationFlags(newAnswers);
    updateRequirements(requirementAnswers, deviations);
    logEvent('requirement_answered', { question: 'r3_grind', answer: values });
    setAppState('r4_attributes');
  }, [workflowState.answers, updateRequirements, logEvent]);

  const handleR4AttributesSelect = useCallback((values: string[]) => {
    const newAnswers = { ...workflowState.answers, r4_attributes: values };
    setWorkflowState(prev => ({ ...prev, answers: newAnswers }));
    setPreviousSelection(values.join(', '));
    
    const requirementAnswers: RequirementAnswers = {
      r1_budget: newAnswers.r1_budget || [],
      r2_roast: newAnswers.r2_roast || [],
      r3_grind: newAnswers.r3_grind || [],
      r4_attributes: values,
    };
    const deviations = computeDeviationFlags(newAnswers);
    updateRequirements(requirementAnswers, deviations);
    logEvent('requirement_answered', { question: 'r4_attributes', answer: values });
    setAppState('review_gate');
  }, [workflowState.answers, updateRequirements, logEvent]);

  const handleSkip = useCallback(() => {
    setPreviousSelection(undefined);
    logEvent('requirement_skipped', { question: appState });
    if (appState === 'r1_budget') {
      setAppState('r2_roast');
    } else if (appState === 'r2_roast') {
      setAppState('r3_grind');
    } else if (appState === 'r3_grind') {
      setAppState('r4_attributes');
    } else if (appState === 'r4_attributes') {
      setAppState('review_gate');
    }
  }, [appState, logEvent]);

  const handlePreviewAndRate = useCallback(() => {
    setProductStatus('Searching for options');
    logEvent('preview_and_rate_clicked');
    setAppState('product_cards');
  }, [logEvent]);

  const handleSkipAll = useCallback(() => {
    setProductStatus('');
    logEvent('skip_all_clicked');
    setAppState('transition');
  }, [logEvent]);

  const handleProductRating = useCallback((action: 'more_like_this' | 'not_interested', reason?: string) => {
    const currentProduct = products[workflowState.currentProductIndex];
    const currentId = currentProduct?.id;
    
    if (currentId) {
      if (action === 'more_like_this') {
        setProductStatus(`Finding more like ${currentProduct.name.split(' ').slice(0, 3).join(' ')}`);
      } else if (reason === 'price') {
        setProductStatus('Clarifying product pricing');
      } else {
        setProductStatus('Searching for alternatives');
      }

      const rating: ProductRating = {
        productId: currentId,
        action,
        reason,
        timestamp: Date.now(),
      };
      
      submitRating(rating);
      
      setWorkflowState(prev => ({
        ...prev,
        productRatings: { ...prev.productRatings, [currentId]: rating },
        currentProductIndex: prev.currentProductIndex + 1,
      }));
    }
  }, [workflowState.currentProductIndex, submitRating]);

  const handleNextProduct = useCallback(() => {
    if (workflowState.currentProductIndex < products.length - 1) {
      setWorkflowState(prev => ({
        ...prev,
        currentProductIndex: prev.currentProductIndex + 1,
      }));
    } else {
      setAppState('transition');
    }
  }, [workflowState.currentProductIndex]);

  const handleTransitionComplete = useCallback(() => {
    logEvent('transition_complete');
    setLocation('/guide');
  }, [logEvent, setLocation]);

  useEffect(() => {
    if (workflowState.currentProductIndex >= products.length && appState === 'product_cards') {
      setAppState('transition');
    }
  }, [workflowState.currentProductIndex, appState]);

  const productsViewed = workflowState.currentProductIndex;

  const renderContent = () => {
    if (appState === 'start') {
      return <StartScreen />;
    }

    return (
      <div className="space-y-8">
        <UserMessage message={workflowState.userPrompt} />

        {appState === 'loading' && (
          <LoadingDots />
        )}

        {appState === 'starting' && (
          <StatusDisplay status="Starting shopping research" showLoading={true} />
        )}

        {(appState === 'r1_budget' || appState === 'r2_roast' || appState === 'r3_grind' || appState === 'r4_attributes') && (
          <GatheringRequirements
            state={appState}
            onSelect={
              appState === 'r1_budget' ? handleR1BudgetSelect :
              appState === 'r2_roast' ? handleR2RoastSelect :
              appState === 'r3_grind' ? handleR3GrindSelect :
              handleR4AttributesSelect
            }
            onSkip={handleSkip}
            timerDuration={TIMER_DURATION}
            previousSelection={previousSelection}
          />
        )}

        {appState === 'review_gate' && (
          <ReviewGate
            onPreviewAndRate={handlePreviewAndRate}
            onSkipAll={handleSkipAll}
            timerDuration={TIMER_DURATION}
          />
        )}

        {appState === 'product_cards' && workflowState.currentProductIndex < products.length && (
          <ProductCardView
            product={products[workflowState.currentProductIndex]}
            onNotInterested={(reason) => handleProductRating('not_interested', reason)}
            onMoreLikeThis={() => handleProductRating('more_like_this')}
            onTimeout={handleNextProduct}
            timerDuration={PRODUCT_TIMER_DURATION}
            statusText={productStatus}
            isFirstProduct={workflowState.currentProductIndex === 0}
          />
        )}

        {appState === 'transition' && (
          <TransitionScreen
            onComplete={handleTransitionComplete}
            productsViewed={productsViewed || 10}
          />
        )}
      </div>
    );
  };

  const isStartState = appState === 'start';

  return (
    <div className="flex h-screen bg-white" data-testid="shopping-research-container">
      <Sidebar />
      
      <div className="flex-1 flex flex-col min-w-0">
        <Topbar />
        
        {isStartState ? (
          <main className="flex-1 flex flex-col items-center justify-center px-6">
            <h1 className="text-4xl font-normal text-gray-900 mb-8" data-testid="start-title">
              Was liegt heute an?
            </h1>
            <div className="w-full max-w-3xl">
              <ChatInput
                value={inputValue}
                onChange={setInputValue}
                onSend={handleSendMessage}
                disabled={isInputDisabled}
                placeholder="Ich möchte Kaffee kaufen..."
                showModeLabel={shoppingModeSelected}
                showPlusMenu={!shoppingModeSelected}
                onModeSelect={handleModeSelect}
              />
            </div>
          </main>
        ) : (
          <>
            <main className="flex-1 overflow-y-auto">
              <div className="max-w-3xl mx-auto px-6 py-8 min-h-full flex flex-col">
                {renderContent()}
              </div>
            </main>

            <ChatInput
              value={inputValue}
              onChange={setInputValue}
              onSend={handleSendMessage}
              disabled={isInputDisabled}
              placeholder={isInputDisabled ? "Stelle irgendeine Frage" : "Ich möchte Kaffee kaufen..."}
              showModeLabel={shoppingModeSelected || isInputDisabled}
              showPlusMenu={false}
              onModeSelect={handleModeSelect}
            />
          </>
        )}
      </div>
    </div>
  );
}
