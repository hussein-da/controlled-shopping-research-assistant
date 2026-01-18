import { useState, useEffect, useCallback } from 'react';
import { AppState, WorkflowState, mockProductCards, mockSources, finalGuideMarkdown } from '@shared/schema';
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

export default function ShoppingResearch() {
  const [appState, setAppState] = useState<AppState>('start');
  const [workflowState, setWorkflowState] = useState<WorkflowState>({
    userPrompt: '',
    answers: {},
    currentProductIndex: 0,
    productRatings: {},
  });
  const [inputValue, setInputValue] = useState('Ich möchte Kaffee kaufen. Bitte starte eine Shopping-Recherche.');
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
    }
  }, []);

  const handleSendMessage = useCallback(() => {
    if (inputValue.trim() && !isInputDisabled && shoppingModeSelected) {
      setWorkflowState(prev => ({ ...prev, userPrompt: inputValue }));
      setIsInputDisabled(true);
      setAppState('loading');
      setStartTime(Date.now());
      
      setTimeout(() => {
        setAppState('starting');
      }, 800);
      
      setTimeout(() => {
        setAppState('budget');
        setPreviousSelection(undefined);
      }, 2500);
    }
  }, [inputValue, isInputDisabled, shoppingModeSelected]);

  const handleBudgetSelect = useCallback((value: string) => {
    setWorkflowState(prev => ({ ...prev, answers: { ...prev.answers, budget: value } }));
    setPreviousSelection(value);
    setAppState('aroma');
  }, []);

  const handleAromaSelect = useCallback((value: string) => {
    setWorkflowState(prev => ({ ...prev, answers: { ...prev.answers, aroma: value } }));
    setPreviousSelection(value);
    setAppState('properties');
  }, []);

  const handlePropertiesSelect = useCallback((value: string) => {
    setWorkflowState(prev => ({
      ...prev,
      answers: {
        ...prev.answers,
        properties: [...(prev.answers.properties || []), value]
      }
    }));
    setPreviousSelection(value);
    setAppState('review_gate');
  }, []);

  const handleSkip = useCallback(() => {
    setPreviousSelection(undefined);
    if (appState === 'budget') {
      setAppState('aroma');
    } else if (appState === 'aroma') {
      setAppState('properties');
    } else if (appState === 'properties') {
      setAppState('review_gate');
    }
  }, [appState]);

  const handlePreviewAndRate = useCallback(() => {
    setProductStatus('Searching for options');
    setAppState('product_cards');
  }, []);

  const handleSkipAll = useCallback(() => {
    setProductStatus('');
    setAppState('transition');
  }, []);

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

      setWorkflowState(prev => ({
        ...prev,
        productRatings: { ...prev.productRatings, [currentId]: rating },
        currentProductIndex: prev.currentProductIndex + 1,
      }));
    }
  }, [workflowState.currentProductIndex]);

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
    setAppState('final_guide');
  }, [startTime]);

  useEffect(() => {
    if (workflowState.currentProductIndex >= mockProductCards.length && appState === 'product_cards') {
      setAppState('transition');
    }
  }, [workflowState.currentProductIndex, appState]);

  const likedCount = Object.values(workflowState.productRatings).filter(r => r === 'interested').length;
  const notInterestedCount = Object.values(workflowState.productRatings).filter(r => r === 'not_interested').length;
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

        {(appState === 'budget' || appState === 'aroma' || appState === 'properties') && (
          <GatheringRequirements
            state={appState}
            onSelect={
              appState === 'budget' ? handleBudgetSelect :
              appState === 'aroma' ? handleAromaSelect :
              handlePropertiesSelect
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
            tags={['Kaffee', 'Fairtrade/Bio', 'Vollautomat', 'Bis 10 €']}
            onViewProducts={() => setShowAllProductsModal(true)}
            onViewSources={() => setShowSourcesPanel(true)}
          />
        )}
      </div>
    );
  };

  return (
    <div className="flex h-screen bg-white" data-testid="shopping-research-container">
      <Sidebar />
      
      <div className="flex-1 flex flex-col min-w-0">
        <Topbar />
        
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
          showPlusMenu={!shoppingModeSelected && !isInputDisabled}
          onModeSelect={handleModeSelect}
        />
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
