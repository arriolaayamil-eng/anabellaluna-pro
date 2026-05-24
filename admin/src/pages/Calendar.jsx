import React, { useState } from 'react';

import { scheduleData } from '../data/dummy';
import { Header } from '../components';
import { Calendar } from '../components/ui/calendar';

const fmt = (iso) => new Date(iso).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
const sameDay = (a, b) => a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();

const Scheduler = () => {
  const [selected, setSelected] = useState(new Date(2021, 0, 10));

  const events = scheduleData.filter((e) => sameDay(new Date(e.StartTime), selected));

  return (
    <div className="min-h-screen px-6 lg:px-8 pt-4 pb-6 bg-gray-50 dark:bg-main-dark-bg">
      <Header category="App" title="Calendar" />
      <div className="flex flex-wrap gap-6">
        <div className="bg-white dark:bg-secondary-dark-bg rounded-xl shadow-sm p-4 self-start">
          <Calendar
            mode="single"
            selected={selected}
            onSelect={(d) => d && setSelected(d)}
          />
        </div>

        <div className="flex-1 min-w-[280px]">
          <h3 className="font-semibold text-base mb-3 dark:text-gray-200">
            {selected.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </h3>
          {events.length === 0 ? (
            <p className="text-sm text-gray-400">No events for this day.</p>
          ) : (
            <div className="flex flex-col gap-3">
              {events.map((ev) => (
                <div
                  key={ev.Id}
                  className="bg-white dark:bg-secondary-dark-bg rounded-xl shadow-sm p-4 border-l-4"
                  style={{ borderLeftColor: ev.CategoryColor }}
                >
                  <p className="font-semibold text-sm dark:text-gray-100">{ev.Subject}</p>
                  {ev.Location && (
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{ev.Location}</p>
                  )}
                  <p className="text-xs text-gray-400 mt-1">
                    {fmt(ev.StartTime)} — {fmt(ev.EndTime)}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Scheduler;
