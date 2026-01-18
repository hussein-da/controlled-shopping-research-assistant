import { useState, useEffect, useCallback } from 'react';
import { AppState, WorkflowState, mockProductCards, finalGuideMarkdown } from '@shared/schema';
import { Sidebar } from '@/components/shopping/sidebar';
import { Topbar } from '@/components/shopping/topbar';
import { ChatInput } from '@/components/shopping/chat-input';
import { StartScreen } from '@/components/shopping/start-screen';
import { UserMessage } from '@/components/shopping/user-message';
import { GatheringRequirements } from '@/components/shopping/gathering-requirements';
import { ReviewGate } from '@/components/shopping/review-gate';
import { ProductCardView } from '@/components/shopping/product-card-view';
import { FinalGuide } from '@/components/shopping/final-guide';
import { LoadingDots, StatusDisplay } from '@/components/shopping/status-display';

const TIMER_DURATION = 20000;
const PRODUCT_TIMER_DURATION = 15000;

type ExtendedAppState = AppState | 'loading' | 'starting';

export default function ShoppingResearch() {
  const [appState, setAppState] = useState<ExtendedAppState>('start');
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
  const [likedProduct, setLikedProduct] = useState<string | null>(null);

  const handleSendMessage = useCallback(() => {
    if (inputValue.trim() && !isInputDisabled) {
      setWorkflowState(prev => ({ ...prev, userPrompt: inputValue }));
      setIsInputDisabled(true);
      setAppState('loading');
      
      setTimeout(() => {
        setAppState('starting');
      }, 800);
      
      setTimeout(() => {
        setAppState('budget');
        setPreviousSelection(undefined);
      }, 2500);
    }
  }, [inputValue, isInputDisabled]);

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
    setAppState('product_cards');
  }, []);

  const handleProductRating = useCallback((rating: 'interested' | 'not_interested', reason?: string) => {
    const currentProduct = mockProductCards[workflowState.currentProductIndex];
    const currentId = currentProduct?.id;
    
    if (currentId) {
      if (rating === 'interested') {
        setLikedProduct(currentProduct.title);
        setProductStatus(`Finding more like ${currentProduct.title.split(' ').slice(0, 3).join(' ')}`);
      } else if (reason === 'Price') {
        setProductStatus('Finding a budget-friendly option');
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
      setAppState('final_guide');
    }
  }, [workflowState.currentProductIndex]);

  useEffect(() => {
    if (workflowState.currentProductIndex >= mockProductCards.length && appState === 'product_cards') {
      setAppState('final_guide');
    }
  }, [workflowState.currentProductIndex, appState]);

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

        {appState === 'final_guide' && (
          <FinalGuide markdown={finalGuideMarkdown} />
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
        />
      </div>
    </div>
  );
}
