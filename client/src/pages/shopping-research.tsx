import { useState, useEffect, useCallback } from 'react';
import { useLocation } from 'wouter';
import { AppState, WorkflowState, mockProductCards, mockSources, finalGuideMarkdown } from '@shared/schema';
import { useStudy } from '@/lib/study-context';
import { Sidebar } from '@/components/shopping/sidebar';
import { Topbar } from '@/components/shopping/topbar';
import { ChatInput } from '@/components/shopping/chat-input';
import { StartScreen } from '@/components/shopping/start-screen';
import { UserMessage } from '@/components/shopping/user-message';
import { GatheringRequirements } from '@/components/shopping/gathering-requirements';
import { ReviewGate } from '@/components/shopping/review-gate';
import { ProductCardView } from '@/components/shopping/product-card-view';
import { FinalGuide } from '@/components/shopping/final-guide';
import { TransitionScreen } from '@/components/shopping/transition-screen';
import { AllProductsModal } from '@/components/shopping/all-products-modal';
import { SourcesPanel } from '@/components/shopping/sources-panel';
import { LoadingDots, StatusDisplay } from '@/components/shopping/status-display';

const TIMER_DURATION = 20000;
const PRODUCT_TIMER_DURATION = 15000;
const STUDY_PROMPT = 'Ich möchte Kaffee kaufen. Bitte starte eine Shopping-Recherche.';

export default function ShoppingResearch() {
  const [, setLocation] = useLocation();
  const { session, updateRequirements, submitRating, logEvent, setFinalChoice } = useStudy();
  
  const [appState, setAppState] = useState<AppState>('start');
  const [workflowState, setWorkflowState] = useState<WorkflowState>({
    userPrompt: '',
    answers: {},
    currentProductIndex: 0,
    productRatings: {},
  });
  const [inputValue, setInputValue] = useState(STUDY_PROMPT);
  const [isInputDisabled, setIsInputDisabled] = useState(false);
  const [previousSelection, setPreviousSelection] = useState<string | undefined>(undefined);
  const [productStatus, setProductStatus] = useState<string>('');
  const [showAllProductsModal, setShowAllProductsModal] = useState(false);
  const [showSourcesPanel, setShowSourcesPanel] = useState(false);
  const [shoppingModeSelected, setShoppingModeSelected] = useState(false);
  const [startTime, setStartTime] = useState<number>(0);
  const [elapsedTime, setElapsedTime] = useState<string>('3m');

  const handleModeSelect = useCallback((mode: string) => {
    if (mode === 'shopping') {
      setShoppingModeSelected(true);
      logEvent('mode_selected', { mode: 'shopping' });
    }
  }, [logEvent]);

  const handleSendMessage = useCallback(() => {
    if (!isInputDisabled && shoppingModeSelected) {
      setWorkflowState(prev => ({ ...prev, userPrompt: STUDY_PROMPT }));
      setIsInputDisabled(true);
      setAppState('loading');
      setStartTime(Date.now());
      logEvent('message_sent', { prompt: STUDY_PROMPT });
      
      setTimeout(() => {
        setAppState('starting');
      }, 800);
      
      setTimeout(() => {
        setAppState('budget');
        setPreviousSelection(undefined);
      }, 3500);
    }
  }, [isInputDisabled, shoppingModeSelected, logEvent]);

  const handleBudgetSelect = useCallback((value: string) => {
    setWorkflowState(prev => ({ ...prev, answers: { ...prev.answers, budget: value } }));
    setPreviousSelection(value);
    updateRequirements({ ...workflowState.answers, budget: value });
    logEvent('requirement_answered', { question: 'budget', answer: value });
    setAppState('roestgrad');
  }, [workflowState.answers, updateRequirements, logEvent]);

  const handleRoestgradSelect = useCallback((value: string) => {
    setWorkflowState(prev => ({ ...prev, answers: { ...prev.answers, roestgrad: value } }));
    setPreviousSelection(value);
    updateRequirements({ ...workflowState.answers, roestgrad: value });
    logEvent('requirement_answered', { question: 'roestgrad', answer: value });
    setAppState('merkmal');
  }, [workflowState.answers, updateRequirements, logEvent]);

  const handleMerkmalSelect = useCallback((value: string) => {
    setWorkflowState(prev => ({ ...prev, answers: { ...prev.answers, merkmal: value } }));
    setPreviousSelection(value);
    updateRequirements({ ...workflowState.answers, merkmal: value });
    logEvent('requirement_answered', { question: 'merkmal', answer: value });
    setAppState('zubereitung');
  }, [workflowState.answers, updateRequirements, logEvent]);

  const handleZubereitungSelect = useCallback((value: string) => {
    setWorkflowState(prev => ({ ...prev, answers: { ...prev.answers, zubereitung: value } }));
    setPreviousSelection(value);
    updateRequirements({ ...workflowState.answers, zubereitung: value });
    logEvent('requirement_answered', { question: 'zubereitung', answer: value });
    setAppState('review_gate');
  }, [workflowState.answers, updateRequirements, logEvent]);

  const handleSkip = useCallback(() => {
    setPreviousSelection(undefined);
    logEvent('requirement_skipped', { question: appState });
    if (appState === 'budget') {
      setAppState('roestgrad');
    } else if (appState === 'roestgrad') {
      setAppState('merkmal');
    } else if (appState === 'merkmal') {
      setAppState('zubereitung');
    } else if (appState === 'zubereitung') {
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

  const handleProductRating = useCallback((rating: 'interested' | 'not_interested', reason?: string) => {
    const currentProduct = mockProductCards[workflowState.currentProductIndex];
    const currentId = currentProduct?.id;
    
    if (currentId) {
      if (rating === 'interested') {
        setProductStatus(`Finding more like ${currentProduct.title.split(' ').slice(0, 3).join(' ')}`);
      } else if (reason === 'Price') {
        setProductStatus('Clarifying product pricing');
      } else {
        setProductStatus('Searching for alternatives');
      }

      submitRating(currentId, rating, reason);
      
      setWorkflowState(prev => ({
        ...prev,
        productRatings: { ...prev.productRatings, [currentId]: rating },
        currentProductIndex: prev.currentProductIndex + 1,
      }));
    }
  }, [workflowState.currentProductIndex, submitRating]);

  const handleNextProduct = useCallback(() => {
    if (workflowState.currentProductIndex < mockProductCards.length - 1) {
      setWorkflowState(prev => ({
        ...prev,
        currentProductIndex: prev.currentProductIndex + 1,
      }));
    } else {
      setAppState('transition');
    }
  }, [workflowState.currentProductIndex]);

  const handleTransitionComplete = useCallback(() => {
    const elapsed = Math.floor((Date.now() - startTime) / 60000);
    setElapsedTime(`${Math.max(elapsed, 3)}m`);
    logEvent('transition_complete');
    setAppState('final_guide');
  }, [startTime, logEvent]);

  const handleProductChoice = useCallback((productId: string) => {
    setFinalChoice(productId);
    logEvent('final_choice_made', { productId });
    setLocation('/post');
  }, [setFinalChoice, logEvent, setLocation]);

  useEffect(() => {
    if (workflowState.currentProductIndex >= mockProductCards.length && appState === 'product_cards') {
      setAppState('transition');
    }
  }, [workflowState.currentProductIndex, appState]);

  const likedCount = Object.values(workflowState.productRatings).filter(r => r === 'interested').length;
  const notInterestedCount = Object.values(workflowState.productRatings).filter(r => r === 'not_interested').length;
  const productsViewed = workflowState.currentProductIndex;

  const generateTags = () => {
    const tags = ['Kaffee'];
    const { budget, roestgrad, merkmal, zubereitung } = workflowState.answers;
    if (merkmal) tags.push(merkmal);
    if (zubereitung) tags.push(zubereitung);
    if (budget) tags.push(budget);
    return tags;
  };

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

        {(appState === 'budget' || appState === 'roestgrad' || appState === 'merkmal' || appState === 'zubereitung') && (
          <GatheringRequirements
            state={appState}
            onSelect={
              appState === 'budget' ? handleBudgetSelect :
              appState === 'roestgrad' ? handleRoestgradSelect :
              appState === 'merkmal' ? handleMerkmalSelect :
              handleZubereitungSelect
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

        {appState === 'product_cards' && workflowState.currentProductIndex < mockProductCards.length && (
          <ProductCardView
            product={mockProductCards[workflowState.currentProductIndex]}
            onNotInterested={(reason) => handleProductRating('not_interested', reason)}
            onMoreLikeThis={() => handleProductRating('interested')}
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

        {appState === 'final_guide' && (
          <FinalGuide 
            markdown={finalGuideMarkdown}
            elapsedTime={elapsedTime}
            productsViewed={productsViewed || 13}
            likedCount={likedCount || 8}
            notInterestedCount={notInterestedCount || 2}
            tags={generateTags()}
            onViewProducts={() => setShowAllProductsModal(true)}
            onViewSources={() => setShowSourcesPanel(true)}
            onProductChoice={session ? handleProductChoice : undefined}
            condition={session?.condition || 'baseline'}
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

      {showAllProductsModal && (
        <AllProductsModal
          products={mockProductCards}
          ratings={workflowState.productRatings}
          onClose={() => setShowAllProductsModal(false)}
        />
      )}

      {showSourcesPanel && (
        <>
          <div 
            className="fixed inset-0 bg-black/20 z-40"
            onClick={() => setShowSourcesPanel(false)}
          />
          <SourcesPanel
            sources={mockSources}
            onClose={() => setShowSourcesPanel(false)}
          />
        </>
      )}
    </div>
  );
}
