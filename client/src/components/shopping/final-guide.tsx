import { ScrollArea } from '@/components/ui/scroll-area';

interface FinalGuideProps {
  markdown: string;
}

function parseMarkdown(text: string) {
  const lines = text.split('\n');
  const elements: JSX.Element[] = [];
  let inTable = false;
  let tableRows: string[][] = [];
  let tableHeader: string[] = [];
  let inList = false;
  let listItems: string[] = [];
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
        <h1 key={`h1-${i}`} className="text-3xl font-bold text-gray-900 mb-6">
          {trimmed.slice(2)}
        </h1>
      );
    } else if (trimmed.startsWith('## ')) {
      flushList();
      elements.push(
        <h2 key={`h2-${i}`} className="text-2xl font-semibold text-gray-900 mt-8 mb-4">
          {trimmed.slice(3)}
        </h2>
      );
    } else if (trimmed.startsWith('### ')) {
      flushList();
      elements.push(
        <h3 key={`h3-${i}`} className="text-xl font-medium text-gray-900 mt-6 mb-3">
          {trimmed.slice(4)}
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

export function FinalGuide({ markdown }: FinalGuideProps) {
  const content = parseMarkdown(markdown);

  return (
    <div 
      className="animate-in fade-in duration-500"
      data-testid="final-guide"
    >
      <div className="prose prose-gray max-w-none">
        {content}
      </div>
    </div>
  );
}
