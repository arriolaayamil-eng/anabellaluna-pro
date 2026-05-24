import React, { useState } from 'react';
import { Header } from '../components';

const ColorPicker = () => {
  const [palette, setPalette] = useState('#6366f1');
  const [picker, setPicker] = useState('#22d3ee');

  return (
    <div className="min-h-screen px-6 lg:px-8 pt-4 pb-6 bg-gray-50 dark:bg-main-dark-bg">
      <Header category="App" title="Color Picker" />
      <div className="text-center">
        <div
          id="preview"
          className="mx-auto mb-6 h-16 w-48 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm transition-colors duration-200"
          style={{ backgroundColor: palette }}
        />
        <div className="flex justify-center items-center gap-20 flex-wrap">
          <div className="flex flex-col items-center gap-3">
            <p className="text-2xl font-semibold">Inline Palette</p>
            <input
              type="color"
              id="inline-palette"
              value={palette}
              onChange={(e) => {
                setPalette(e.target.value);
                document.getElementById('preview').style.backgroundColor = e.target.value;
              }}
              className="h-12 w-24 cursor-pointer rounded-lg border border-gray-300 dark:border-gray-600 p-1 bg-white dark:bg-gray-800"
            />
            <span className="text-sm text-gray-500 font-mono">{palette}</span>
          </div>
          <div className="flex flex-col items-center gap-3">
            <p className="text-2xl font-semibold">Inline Picker</p>
            <input
              type="color"
              id="inline-picker"
              value={picker}
              onChange={(e) => setPicker(e.target.value)}
              className="h-12 w-24 cursor-pointer rounded-lg border border-gray-300 dark:border-gray-600 p-1 bg-white dark:bg-gray-800"
            />
            <span className="text-sm text-gray-500 font-mono">{picker}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ColorPicker;
