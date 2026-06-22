'use client';

import React, { useRef, useState, useEffect } from 'react';
import { 
  Bold, Italic, Underline, List, ListOrdered, Code, Eye 
} from '@/components/common/Icons';

interface RichTextEditorProps {
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  minHeight?: string;
}

export default function RichTextEditor({
  value,
  onChange,
  placeholder = '',
  minHeight = '220px'
}: RichTextEditorProps) {
  const [isHtmlMode, setIsHtmlMode] = useState(false);
  const editorRef = useRef<HTMLDivElement>(null);

  // Sync value to contentEditable div initially or on external change,
  // but avoid infinite loops during typing
  useEffect(() => {
    if (editorRef.current && !isHtmlMode) {
      if (editorRef.current.innerHTML !== value) {
        editorRef.current.innerHTML = value || '';
      }
    }
  }, [value, isHtmlMode]);

  const execCommand = (command: string, arg: string = '') => {
    document.execCommand(command, false, arg);
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  return (
    <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-[#0f0f1b]/50 overflow-hidden mt-1.5 transition-colors">
      <div className="flex items-center justify-between px-3 py-2 border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-[#1a1a2e] transition-colors gap-2 flex-wrap">
        
        {/* Formatting Toolbar */}
        <div className="flex items-center gap-1">
          {!isHtmlMode ? (
            <>
              <button
                type="button"
                onClick={() => execCommand('bold')}
                className="p-1.5 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-[#2c2c4d] hover:text-[#e94560] dark:hover:text-[#e94560] transition-colors cursor-pointer"
                title="Bold"
              >
                <Bold className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => execCommand('italic')}
                className="p-1.5 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-[#2c2c4d] hover:text-[#e94560] dark:hover:text-[#e94560] transition-colors cursor-pointer"
                title="Italic"
              >
                <Italic className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => execCommand('underline')}
                className="p-1.5 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-[#2c2c4d] hover:text-[#e94560] dark:hover:text-[#e94560] transition-colors cursor-pointer"
                title="Underline"
              >
                <Underline className="h-4 w-4" />
              </button>
              
              <div className="w-px h-5 bg-gray-200 dark:bg-gray-700 mx-1" />
              
              <button
                type="button"
                onClick={() => execCommand('formatBlock', '<h2>')}
                className="px-2 py-1 rounded-lg text-xs font-bold text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-[#2c2c4d] hover:text-[#e94560] dark:hover:text-[#e94560] transition-colors cursor-pointer"
                title="Heading 2"
              >
                H2
              </button>
              <button
                type="button"
                onClick={() => execCommand('formatBlock', '<h3>')}
                className="px-2 py-1 rounded-lg text-xs font-bold text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-[#2c2c4d] hover:text-[#e94560] dark:hover:text-[#e94560] transition-colors cursor-pointer"
                title="Heading 3"
              >
                H3
              </button>
              <button
                type="button"
                onClick={() => execCommand('formatBlock', '<p>')}
                className="px-2 py-1 rounded-lg text-[10px] font-semibold text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-[#2c2c4d] hover:text-[#e94560] dark:hover:text-[#e94560] transition-colors cursor-pointer"
                title="Normal Paragraph"
              >
                Normal
              </button>
              
              <div className="w-px h-5 bg-gray-200 dark:bg-gray-700 mx-1" />
              
              <button
                type="button"
                onClick={() => execCommand('insertUnorderedList')}
                className="p-1.5 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-[#2c2c4d] hover:text-[#e94560] dark:hover:text-[#e94560] transition-colors cursor-pointer"
                title="Bullet List"
              >
                <List className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => execCommand('insertOrderedList')}
                className="p-1.5 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-[#2c2c4d] hover:text-[#e94560] dark:hover:text-[#e94560] transition-colors cursor-pointer"
                title="Numbered List"
              >
                <ListOrdered className="h-4 w-4" />
              </button>
              
              <div className="w-px h-5 bg-gray-200 dark:bg-gray-700 mx-1" />
              
              <button
                type="button"
                onClick={() => execCommand('removeFormat')}
                className="px-2 py-1 rounded-lg text-xs font-semibold text-gray-400 hover:bg-gray-200 dark:hover:bg-[#2c2c4d] hover:text-red-500 dark:hover:text-red-500 transition-colors cursor-pointer"
                title="Clear Formatting"
              >
                Clear Format
              </button>
            </>
          ) : (
            <span className="text-xs font-bold text-gray-400 dark:text-gray-500 px-2 py-1">HTML Code View</span>
          )}
        </div>

        {/* Mode Toggle Button */}
        <button
          type="button"
          onClick={() => setIsHtmlMode(!isHtmlMode)}
          className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white dark:bg-[#16162a] border border-gray-200 dark:border-gray-800 text-xs font-bold text-gray-700 dark:text-gray-350 hover:bg-gray-100 dark:hover:bg-[#2c2c4d] hover:text-[#e94560] dark:hover:text-[#e94560] transition-colors cursor-pointer shadow-sm active:scale-95"
        >
          {isHtmlMode ? (
            <>
              <Eye className="h-3.5 w-3.5" />
              <span>Visual Editor</span>
            </>
          ) : (
            <>
              <Code className="h-3.5 w-3.5" />
              <span>HTML View</span>
            </>
          )}
        </button>
      </div>

      {/* Editor Content Area */}
      <div className="bg-white dark:bg-[#16162a]">
        {isHtmlMode ? (
          <textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            rows={10}
            style={{ minHeight }}
            className="w-full bg-white dark:bg-[#16162a] px-4 py-3 text-sm font-mono text-gray-800 dark:text-gray-100 focus:outline-none transition-all resize-y border-0"
            placeholder={placeholder || "Write raw HTML here..."}
          />
        ) : (
          <div
            ref={editorRef}
            contentEditable
            onInput={(e) => onChange(e.currentTarget.innerHTML)}
            onBlur={(e) => onChange(e.currentTarget.innerHTML)}
            style={{ minHeight, outline: 'none' }}
            className="w-full bg-white dark:bg-[#16162a] px-4 py-3 text-sm font-medium focus:outline-none transition-all overflow-y-auto prose dark:prose-invert max-w-none border-0"
          />
        )}
      </div>
    </div>
  );
}
