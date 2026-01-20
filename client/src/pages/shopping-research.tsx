import { useState, useEffect, useCallback } from 'react';
import { useLocation } from 'wouter';
import { 
  AppState, 
  WorkflowState, 
  WorkflowAnswers,
  RATING_PRODUCTS, 
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

const TIMER_DURATION = 10000;
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
        setAppState('r1_amount');
        setPreviousSelection(undefined);
      }, 3500);
    }
  }, [isInputDisabled, shoppingModeSelected, inputValue, logEvent]);

  const computeDeviationFlags = (answers: WorkflowAnswers): DeviationFlags => {
    return {
      r1_deviated: !answers.r1_amount?.includes(NORMALIZED_TARGET.amount),
      r2_deviated: !answers.r2_budget?.includes(NORMALIZED_TARGET.budget),
      r3_deviated: !answers.r3_attributes?.includes(NORMALIZED_TARGET.attributes),
      r4_deviated: !answers.r4_grind?.includes(NORMALIZED_TARGET.grind),
    };
  };

  const handleR1AmountSelect = useCallback((values: string[], customInput?: string) => {
    const newAnswers = { ...workflowState.answers, r1_amount: values };
    setWorkflowState(prev => ({ ...prev, answers: newAnswers }));
    setPreviousSelection(values.join(', '));
    
    const requirementAnswers: RequirementAnswers = {
      r1_amount: values,
      r2_budget: newAnswers.r2_budget || [],
      r3_attributes: newAnswers.r3_attributes || [],
      r4_grind: newAnswers.r4_grind || [],
      r1_other: customInput,
    };
    const deviations = computeDeviationFlags(newAnswers);
    updateRequirements(requirementAnswers, deviations);
    logEvent('requirement_answered', { 
      question: 'r1_amount', 
      answer: values, 
      raw_value: values.join(', '),
      normalized_value: NORMALIZED_TARGET.amount,
      deviation: deviations.r1_deviated,
      custom_input: customInput
    });
    setAppState('r2_budget');
  }, [workflowState.answers, updateRequirements, logEvent]);

  const handleR2BudgetSelect = useCallback((values: string[], customInput?: string) => {
    const newAnswers = { ...workflowState.answers, r2_budget: values };
    setWorkflowState(prev => ({ ...prev, answers: newAnswers }));
    setPreviousSelection(values.join(', '));
    
    const requirementAnswers: RequirementAnswers = {
      r1_amount: newAnswers.r1_amount || [],
      r2_budget: values,
      r3_attributes: newAnswers.r3_attributes || [],
      r4_grind: newAnswers.r4_grind || [],
      r2_other: customInput,
    };
    const deviations = computeDeviationFlags(newAnswers);
    updateRequirements(requirementAnswers, deviations);
    logEvent('requirement_answered', { 
      question: 'r2_budget', 
      answer: values,
      raw_value: values.join(', '),
      normalized_value: NORMALIZED_TARGET.budget,
      deviation: deviations.r2_deviated,
      custom_input: customInput
    });
    setAppState('r3_attributes');
  }, [workflowState.answers, updateRequirements, logEvent]);

  const handleR3AttributesSelect = useCallback((values: string[], customInput?: string) => {
    const newAnswers = { ...workflowState.answers, r3_attributes: values };
    setWorkflowState(prev => ({ ...prev, answers: newAnswers }));
    setPreviousSelection(values.join(', '));
    
    const requirementAnswers: RequirementAnswers = {
      r1_amount: newAnswers.r1_amount || [],
      r2_budget: newAnswers.r2_budget || [],
      r3_attributes: values,
      r4_grind: newAnswers.r4_grind || [],
      r3_other: customInput,
    };
    const deviations = computeDeviationFlags(newAnswers);
    updateRequirements(requirementAnswers, deviations);
    logEvent('requirement_answered', { 
      question: 'r3_attributes', 
      answer: values,
      raw_value: values.join(', '),
      normalized_value: NORMALIZED_TARGET.attributes,
      deviation: deviations.r3_deviated,
      custom_input: customInput
    });
    setAppState('r4_grind');
  }, [workflowState.answers, updateRequirements, logEvent]);

  const handleR4GrindSelect = useCallback((values: string[], customInput?: string) => {
    const newAnswers = { ...workflowState.answers, r4_grind: values };
    setWorkflowState(prev => ({ ...prev, answers: newAnswers }));
    setPreviousSelection(values.join(', '));
    
    const requirementAnswers: RequirementAnswers = {
      r1_amount: newAnswers.r1_amount || [],
      r2_budget: newAnswers.r2_budget || [],
      r3_attributes: newAnswers.r3_attributes || [],
      r4_grind: values,
      r4_other: customInput,
    };
    const deviations = computeDeviationFlags(newAnswers);
    updateRequirements(requirementAnswers, deviations);
    logEvent('requirement_answered', { 
      question: 'r4_grind', 
      answer: values,
      raw_value: values.join(', '),
      normalized_value: NORMALIZED_TARGET.grind,
      deviation: deviations.r4_deviated,
      custom_input: customInput
    });
    setAppState('review_gate');
  }, [workflowState.answers, updateRequirements, logEvent]);

  const handleSkip = useCallback(() => {
    setPreviousSelection(undefined);
    logEvent('requirement_skipped', { question: appState });
    if (appState === 'r1_amount') {
      setAppState('r2_budget');
    } else if (appState === 'r2_budget') {
      setAppState('r3_attributes');
    } else if (appState === 'r3_attributes') {
      setAppState('r4_grind');
    } else if (appState === 'r4_grind') {
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
    const currentProduct = RATING_PRODUCTS[workflowState.currentProductIndex];
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
      logEvent('product_feedback', { 
        productId: currentId, 
        action, 
        reason,
        productName: currentProduct.name
      });
      
      setWorkflowState(prev => ({
        ...prev,
        productRatings: { ...prev.productRatings, [currentId]: rating },
        currentProductIndex: prev.currentProductIndex + 1,
      }));
    }
  }, [workflowState.currentProductIndex, submitRating, logEvent]);

  const handleNextProduct = useCallback(() => {
    if (workflowState.currentProductIndex < RATING_PRODUCTS.length - 1) {
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
    if (workflowState.currentProductIndex >= RATING_PRODUCTS.length && appState === 'product_cards') {
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

        {(appState === 'r1_amount' || appState === 'r2_budget' || appState === 'r3_attributes' || appState === 'r4_grind') && (
          <GatheringRequirements
            state={appState}
            onSelect={
              appState === 'r1_amount' ? handleR1AmountSelect :
              appState === 'r2_budget' ? handleR2BudgetSelect :
              appState === 'r3_attributes' ? handleR3AttributesSelect :
              handleR4GrindSelect
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

        {appState === 'product_cards' && workflowState.currentProductIndex < RATING_PRODUCTS.length && (
          <ProductCardView
            product={RATING_PRODUCTS[workflowState.currentProductIndex]}
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
            productsViewed={productsViewed || 5}
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
