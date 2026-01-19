import type { ReactNode } from 'react';
import { ChevronRight } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

interface FinalGuideProps {
  markdown: string;
  elapsedTime?: string;
  productsViewed?: number;
  likedCount?: number;
  notInterestedCount?: number;
  tags?: string[];
  onViewProducts?: () => void;
  onViewSources?: () => void;
  onProductChoice?: (productId: string) => void;
  condition?: 'baseline' | 'nudge';
}

function parseMarkdown(text: string) {
  const lines = text.split('\n');
  const elements: JSX.Element[] = [];
  let inTable = false;
  let tableRows: string[][] = [];
  let tableHeader: string[] = [];
  let inList = false;
  let listItems: ReactNode[] = [];
  let listType: 'ul' | 'ol' = 'ul';

  const flushList = () => {
    if (listItems.length > 0) {
      if (listType === 'ol') {
        elements.push(
          <ol key={`ol-${elements.length}`} className="list-decimal pl-6 mb-4 space-y-1">
            {listItems.map((item, i) => (
              <li key={i} className="text-gray-700">{item}</li>
            ))}
          </ol>
        );
      } else {
        elements.push(
          <ul key={`ul-${elements.length}`} className="list-disc pl-6 mb-4 space-y-1">
            {listItems.map((item, i) => (
              <li key={i} className="text-gray-700">{item}</li>
            ))}
          </ul>
        );
      }
      listItems = [];
      inList = false;
    }
  };

  const flushTable = () => {
    if (tableRows.length > 0) {
      elements.push(
        <div key={`table-${elements.length}`} className="overflow-x-auto mb-6">
          <table className="w-full text-sm border border-gray-200 rounded-lg overflow-hidden">
            <thead className="bg-gray-50">
              <tr>
                {tableHeader.map((cell, i) => (
                  <th key={i} className="px-4 py-3 text-left font-medium text-gray-700 border-b border-gray-200">
                    {cell}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {tableRows.map((row, rowIndex) => (
                <tr key={rowIndex} className={rowIndex % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  {row.map((cell, cellIndex) => (
                    <td key={cellIndex} className="px-4 py-3 text-gray-700 border-b border-gray-100">
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
      tableRows = [];
      tableHeader = [];
      inTable = false;
    }
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();

    if (trimmed.startsWith('|') && trimmed.endsWith('|')) {
      flushList();
      const cells = trimmed.slice(1, -1).split('|').map(c => c.trim());
      
      if (!inTable) {
        tableHeader = cells;
        inTable = true;
      } else if (cells.every(c => /^[-:]+$/.test(c))) {
        continue;
      } else {
        tableRows.push(cells);
      }
      continue;
    } else if (inTable) {
      flushTable();
    }

    if (trimmed.startsWith('# ')) {
      flushList();
      elements.push(
        <h1 key={`h1-${i}`} className="text-2xl font-semibold text-gray-900 mb-4">
          {trimmed.slice(2)}
        </h1>
      );
    } else if (trimmed.startsWith('## ')) {
      flushList();
      elements.push(
        <h2 key={`h2-${i}`} className="text-xl font-semibold text-gray-900 mt-8 mb-4">
          {trimmed.slice(3)}
        </h2>
      );
    } else if (trimmed.startsWith('### ')) {
      flushList();
      const headerText = trimmed.slice(4);
      const isNumbered = /^\d+\)/.test(headerText);
      elements.push(
        <h3 key={`h3-${i}`} className={`text-lg font-medium text-gray-900 mt-6 mb-3 ${isNumbered ? 'text-base' : ''}`}>
          {headerText}
        </h3>
      );
    } else if (trimmed.startsWith('---')) {
      flushList();
      elements.push(
        <hr key={`hr-${i}`} className="border-gray-200 my-6" />
      );
    } else if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
      if (!inList || listType !== 'ul') {
        flushList();
        inList = true;
        listType = 'ul';
      }
      listItems.push(formatInlineStyles(trimmed.slice(2)));
    } else if (/^\d+\.\s/.test(trimmed)) {
      if (!inList || listType !== 'ol') {
        flushList();
        inList = true;
        listType = 'ol';
      }
      listItems.push(formatInlineStyles(trimmed.replace(/^\d+\.\s/, '')));
    } else if (trimmed.startsWith('[') && trimmed.includes('](')) {
      flushList();
      const match = trimmed.match(/\[(.+?)\]\((.+?)\)/);
      if (match) {
        elements.push(
          <p key={`link-${i}`} className="text-blue-600 underline mb-2">
            <a href={match[2]} target="_blank" rel="noopener noreferrer">
              {match[1]}
            </a>
          </p>
        );
      }
    } else if (trimmed === '') {
      flushList();
    } else {
      flushList();
      elements.push(
        <p key={`p-${i}`} className="text-gray-700 leading-7 mb-4">
          {formatInlineStyles(trimmed)}
        </p>
      );
    }
  }

  flushList();
  flushTable();

  return elements;
}

function formatInlineStyles(text: string): React.ReactNode {
  const parts: React.ReactNode[] = [];
  let remaining = text;
  let key = 0;

  while (remaining.length > 0) {
    const boldMatch = remaining.match(/\*\*(.+?)\*\*/);
    const linkMatch = remaining.match(/\[(.+?)\]\((.+?)\)/);

    if (boldMatch && (!linkMatch || boldMatch.index! < linkMatch.index!)) {
      if (boldMatch.index! > 0) {
        parts.push(remaining.slice(0, boldMatch.index));
      }
      parts.push(<strong key={key++} className="font-semibold">{boldMatch[1]}</strong>);
      remaining = remaining.slice(boldMatch.index! + boldMatch[0].length);
    } else if (linkMatch) {
      if (linkMatch.index! > 0) {
        parts.push(remaining.slice(0, linkMatch.index));
      }
      parts.push(
        <a key={key++} href={linkMatch[2]} className="text-blue-600 underline" target="_blank" rel="noopener noreferrer">
          {linkMatch[1]}
        </a>
      );
      remaining = remaining.slice(linkMatch.index! + linkMatch[0].length);
    } else {
      parts.push(remaining);
      break;
    }
  }

  return parts.length === 1 && typeof parts[0] === 'string' ? parts[0] : <>{parts}</>;
}

export function FinalGuide({ 
  markdown, 
  elapsedTime = '3m',
  productsViewed = 13,
  likedCount = 8,
  notInterestedCount = 2,
  tags = [],
  onViewProducts,
  onViewSources,
  onProductChoice,
  condition = 'baseline'
}: FinalGuideProps) {
  const content = parseMarkdown(markdown);

  return (
    <div 
      className="animate-in fade-in duration-500"
      data-testid="final-guide"
    >
      <button 
        className="flex items-center gap-1 text-sm text-gray-500 mb-4 hover:text-gray-700 transition-colors"
        onClick={onViewProducts}
        data-testid="header-products-link"
      >
        <span>Shopped for {elapsedTime} · {productsViewed} products viewed</span>
        <ChevronRight className="w-4 h-4" />
      </button>

      {tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-6" data-testid="guide-tags">
          {tags.map((tag) => (
            <span 
              key={tag}
              className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      <div className="prose prose-gray max-w-none">
        {content}
      </div>

      <div className="mt-8 pt-6 border-t border-gray-200">
        <button
          onClick={onViewProducts}
          className="flex items-center gap-4 p-4 w-full border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors text-left"
          data-testid="view-products-button"
        >
          <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-amber-50 to-amber-100 flex items-center justify-center flex-shrink-0">
            <div className="w-8 h-10 bg-amber-200 rounded flex items-center justify-center">
              <span className="text-lg text-amber-600">C</span>
            </div>
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-1 font-medium text-gray-900">
              <span>View products</span>
              <ChevronRight className="w-4 h-4" />
            </div>
            <p className="text-sm text-gray-500">
              {likedCount} liked · {notInterestedCount} not interested
            </p>
          </div>
        </button>
      </div>

      <div className="mt-6 flex items-center justify-between">
        <div className="flex items-center gap-3 text-gray-400">
          <button className="hover:text-gray-600 transition-colors" title="Copy">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
          </button>
          <button className="hover:text-gray-600 transition-colors" title="Like">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
            </svg>
          </button>
          <button className="hover:text-gray-600 transition-colors" title="Dislike">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 14H5.236a2 2 0 01-1.789-2.894l3.5-7A2 2 0 018.736 3h4.018c.163 0 .326.02.485.06L17 4m-7 10v5a2 2 0 002 2h.095c.5 0 .905-.405.905-.905 0-.714.211-1.412.608-2.006L17 13V4m-7 10h2m5-10h2a2 2 0 012 2v6a2 2 0 01-2 2h-2.5" />
            </svg>
          </button>
          <button className="hover:text-gray-600 transition-colors" title="Share">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
            </svg>
          </button>
          <button className="hover:text-gray-600 transition-colors" title="Refresh">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
          <button className="hover:text-gray-600 transition-colors" title="More">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z" />
            </svg>
          </button>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex -space-x-1">
            <div className="w-5 h-5 rounded-full bg-red-500 flex items-center justify-center text-white text-xs">P</div>
            <div className="w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center text-white text-xs">B</div>
            <div className="w-5 h-5 rounded-full bg-yellow-500 flex items-center justify-center text-white text-xs">Y</div>
          </div>
          <button 
            onClick={onViewSources}
            className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
            data-testid="sources-link"
          >
            Quellen
          </button>
        </div>
      </div>
    </div>
  );
}
