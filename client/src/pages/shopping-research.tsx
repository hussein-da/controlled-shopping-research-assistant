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

const TIMER_DURATION = 4000;
const PRODUCT_TIMER_DURATION = 5000;

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

  const handleSendMessage = useCallback(() => {
    if (inputValue.trim() && !isInputDisabled) {
      setWorkflowState(prev => ({ ...prev, userPrompt: inputValue }));
      setIsInputDisabled(true);
      setAppState('prompt_sent');
      setTimeout(() => setAppState('budget'), 800);
    }
  }, [inputValue, isInputDisabled]);

  const handleBudgetSelect = useCallback((value: string) => {
    setWorkflowState(prev => ({ ...prev, answers: { ...prev.answers, budget: value } }));
    setAppState('aroma');
  }, []);

  const handleAromaSelect = useCallback((value: string) => {
    setWorkflowState(prev => ({ ...prev, answers: { ...prev.answers, aroma: value } }));
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
    setAppState('review_gate');
  }, []);

  const handleSkip = useCallback(() => {
    if (appState === 'budget') {
      setAppState('aroma');
    } else if (appState === 'aroma') {
      setAppState('properties');
    } else if (appState === 'properties') {
      setAppState('review_gate');
    }
  }, [appState]);

  const handlePreviewAndRate = useCallback(() => {
    setAppState('product_cards');
  }, []);

  const handleSkipAll = useCallback(() => {
    setAppState('product_cards');
  }, []);

  const handleProductRating = useCallback((rating: 'interested' | 'not_interested') => {
    const currentId = mockProductCards[workflowState.currentProductIndex]?.id;
    if (currentId) {
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

  return (
    <div className="flex h-screen bg-white" data-testid="shopping-research-container">
      <Sidebar />
      
      <div className="flex-1 flex flex-col min-w-0">
        <Topbar />
        
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-3xl mx-auto px-6 py-8 min-h-full flex flex-col">
            {appState === 'start' && (
              <StartScreen />
            )}

            {appState !== 'start' && (
              <div className="space-y-8">
                <UserMessage message={workflowState.userPrompt} />

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
                  />
                )}

                {appState === 'review_gate' && (
                  <ReviewGate
                    onPreviewAndRate={handlePreviewAndRate}
                    onSkipAll={handleSkipAll}
                    timerDuration={TIMER_DURATION + 1000}
                  />
                )}

                {appState === 'product_cards' && workflowState.currentProductIndex < mockProductCards.length && (
                  <ProductCardView
                    product={mockProductCards[workflowState.currentProductIndex]}
                    onNotInterested={() => handleProductRating('not_interested')}
                    onMoreLikeThis={() => handleProductRating('interested')}
                    onTimeout={handleNextProduct}
                    timerDuration={PRODUCT_TIMER_DURATION}
                  />
                )}

                {appState === 'final_guide' && (
                  <FinalGuide markdown={finalGuideMarkdown} />
                )}
              </div>
            )}
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
