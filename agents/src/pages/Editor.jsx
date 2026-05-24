import React from 'react';

import { Header } from '../components';
import { EditorData } from '../data/dummy';

const Editor = () => (
  <div className="min-h-screen px-6 lg:px-8 pt-4 pb-6 bg-gray-50 dark:bg-main-dark-bg">
    <Header category="App" title="Editor" />
    <div className="bg-white dark:bg-secondary-dark-bg rounded-xl shadow-sm p-6">
      <div className="mb-3 flex flex-wrap gap-1 border-b border-gray-200 dark:border-gray-700 pb-3">
        {['Bold', 'Italic', 'Underline', 'H1', 'H2', 'UL', 'OL'].map((cmd) => (
          <button
            key={cmd}
            type="button"
            onMouseDown={(e) => {
              e.preventDefault();
              const commandMap = { Bold: 'bold', Italic: 'italic', Underline: 'underline', H1: 'formatBlock', H2: 'formatBlock', UL: 'insertUnorderedList', OL: 'insertOrderedList' };
              const argMap = { H1: 'h1', H2: 'h2' };
              document.execCommand(commandMap[cmd], false, argMap[cmd]);
            }}
            className="px-2 py-1 text-xs font-medium border border-gray-300 dark:border-gray-600 rounded hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-gray-200"
          >
            {cmd}
          </button>
        ))}
      </div>
      <div
        contentEditable
        suppressContentEditableWarning
        className="min-h-96 outline-none prose prose-sm max-w-none dark:prose-invert focus:ring-1 focus:ring-blue-400 rounded p-2 dark:text-gray-200"
      >
        <EditorData />
      </div>
    </div>
  </div>
);

export default Editor;
