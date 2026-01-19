import { useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import { useStudy } from '@/lib/study-context';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Loader2 } from 'lucide-react';
import { GUIDE_TEXT, NORMALIZED_TARGET } from '@shared/schema';
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

  const tags = [NORMALIZED_TARGET.amount, NORMALIZED_TARGET.budget, NORMALIZED_TARGET.attributes, NORMALIZED_TARGET.grind];

  return (
    <div className="min-h-screen bg-[#212121]" data-testid="guide-page">
      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="mb-4 text-sm text-gray-400">
          Schritt 6 von 9
        </div>

        <div className="flex flex-wrap gap-2 mb-6">
          {tags.map((tag, idx) => (
            <Badge key={idx} variant="secondary" className="text-xs bg-gray-700 text-gray-200 hover:bg-gray-600">
              {tag}
            </Badge>
          ))}
        </div>

        <div className="prose prose-invert max-w-none mb-8" data-testid="guide-content">
          <ReactMarkdown
            components={{
              table: ({ children }) => (
                <div className="overflow-x-auto my-4 -mx-4 px-4">
                  <table className="min-w-full border-collapse text-sm">
                    {children}
                  </table>
                </div>
              ),
              thead: ({ children }) => (
                <thead className="bg-gray-800">
                  {children}
                </thead>
              ),
              th: ({ children }) => (
                <th className="border border-gray-700 px-3 py-2 text-left font-medium text-gray-200 whitespace-nowrap">
                  {children}
                </th>
              ),
              td: ({ children }) => (
                <td className="border border-gray-700 px-3 py-2 text-gray-300">
                  {children}
                </td>
              ),
              h1: ({ children }) => (
                <h1 className="text-2xl font-bold mb-4 text-white">{children}</h1>
              ),
              h2: ({ children }) => (
                <h2 className="text-xl font-semibold mt-6 mb-3 text-gray-100">{children}</h2>
              ),
              h3: ({ children }) => (
                <h3 className="text-lg font-medium mt-4 mb-2 text-gray-200">{children}</h3>
              ),
              p: ({ children }) => (
                <p className="mb-3 text-gray-300 leading-relaxed">{children}</p>
              ),
              ul: ({ children }) => (
                <ul className="list-disc pl-5 mb-3 space-y-1">{children}</ul>
              ),
              li: ({ children }) => (
                <li className="text-gray-300">{children}</li>
              ),
              strong: ({ children }) => (
                <strong className="font-semibold text-white">{children}</strong>
              ),
              hr: () => (
                <hr className="my-6 border-gray-700" />
              ),
              a: ({ children, href }) => (
                <a href={href} className="text-blue-400 hover:text-blue-300 underline" target="_blank" rel="noopener noreferrer">
                  {children}
                </a>
              ),
            }}
          >
            {GUIDE_TEXT}
          </ReactMarkdown>
        </div>

        <div className="sticky bottom-0 bg-[#212121] py-4 border-t border-gray-700">
          <Button
            size="lg"
            onClick={handleContinue}
            className="w-full bg-white text-gray-900 hover:bg-gray-100"
            data-testid="guide-continue-button"
          >
            Weiter
          </Button>
        </div>
      </div>
    </div>
  );
}
