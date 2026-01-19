import { useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import { useStudy } from '@/lib/study-context';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Loader2 } from 'lucide-react';
import { GUIDE_TEXT_A, GUIDE_TEXT_B, NORMALIZED_TARGET } from '@shared/schema';
import ReactMarkdown from 'react-markdown';

export default function Guide() {
  const [, setLocation] = useLocation();
  const { session, logEvent, updateGuideTimestamps } = useStudy();
  const [startTime] = useState(Date.now());

  useEffect(() => {
    if (session) {
      logEvent('guide_view_start');
    }
  }, [session, logEvent]);

  const handleContinue = async () => {
    const readSeconds = Math.floor((Date.now() - startTime) / 1000);
    await updateGuideTimestamps(startTime, Date.now(), readSeconds);
    logEvent('guide_continue', { readSeconds });
    setLocation('/choice');
  };

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
      </div>
    );
  }

  const guideText = session.condition === 'A_OPENAI_GUIDE' ? GUIDE_TEXT_A : GUIDE_TEXT_B;
  const tags = ["250 g", NORMALIZED_TARGET.budget, NORMALIZED_TARGET.attributes, NORMALIZED_TARGET.grind, NORMALIZED_TARGET.usage, NORMALIZED_TARGET.roast];

  return (
    <div className="min-h-screen bg-white" data-testid="guide-page">
      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="mb-4 text-sm text-gray-500">
          Schritt 6 von 9
        </div>

        <div className="flex flex-wrap gap-2 mb-6">
          {tags.map((tag, idx) => (
            <Badge key={idx} variant="secondary" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>

        <div className="prose prose-gray max-w-none mb-8" data-testid="guide-content">
          <ReactMarkdown
            components={{
              table: ({ children }) => (
                <div className="overflow-x-auto my-4">
                  <table className="min-w-full border-collapse border border-gray-200 text-sm">
                    {children}
                  </table>
                </div>
              ),
              th: ({ children }) => (
                <th className="border border-gray-200 px-3 py-2 bg-gray-50 text-left font-medium">
                  {children}
                </th>
              ),
              td: ({ children }) => (
                <td className="border border-gray-200 px-3 py-2">
                  {children}
                </td>
              ),
              h1: ({ children }) => (
                <h1 className="text-2xl font-bold mb-4 text-gray-900">{children}</h1>
              ),
              h2: ({ children }) => (
                <h2 className="text-xl font-semibold mt-6 mb-3 text-gray-800">{children}</h2>
              ),
              h3: ({ children }) => (
                <h3 className="text-lg font-medium mt-4 mb-2 text-gray-700">{children}</h3>
              ),
              p: ({ children }) => (
                <p className="mb-3 text-gray-600 leading-relaxed">{children}</p>
              ),
              ul: ({ children }) => (
                <ul className="list-disc pl-5 mb-3 space-y-1">{children}</ul>
              ),
              li: ({ children }) => (
                <li className="text-gray-600">{children}</li>
              ),
              strong: ({ children }) => (
                <strong className="font-semibold text-gray-900">{children}</strong>
              ),
              hr: () => (
                <hr className="my-6 border-gray-200" />
              ),
            }}
          >
            {guideText}
          </ReactMarkdown>
        </div>

        <div className="sticky bottom-0 bg-white py-4 border-t">
          <Button
            size="lg"
            onClick={handleContinue}
            className="w-full"
            data-testid="guide-continue-button"
          >
            Weiter
          </Button>
        </div>
      </div>
    </div>
  );
}
