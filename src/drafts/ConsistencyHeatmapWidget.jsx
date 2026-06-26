import React, { useMemo } from 'react';

/**
 * ConsistencyHeatmapWidget
 * Quran Tracker Utility
 * A GitHub-style contribution graph to visualize daily reading consistency.
 */
export default function ConsistencyHeatmapWidget({ readHistory = [] }) {
  // Generate the last 90 days
  const days = useMemo(() => {
    const arr = [];
    const today = new Date();
    for (let i = 89; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      
      // Check if user read on this date (requires readHistory to be an array of date strings)
      const hasRead = readHistory.includes(dateStr);
      arr.push({ date: dateStr, hasRead });
    }
    return arr;
  }, [readHistory]);

  return (
    <div className="w-full max-w-3xl mx-auto p-6 bg-white dark:bg-gray-900 rounded-xl" style={{ boxShadow: 'var(--shadow2)', transition: 'all 0.3s var(--ease-out)' }}>
      <div className="mb-4 flex justify-between items-end">
        <div>
          <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">Consistency Heatmap</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">Track your daily Quran reading habits over the last 90 days.</p>
        </div>
        <div className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">
          {readHistory.length} Days Read
        </div>
      </div>

      <div className="flex gap-1 overflow-x-auto pb-2">
        {days.map((day, idx) => (
          <div 
            key={day.date}
            title={`${day.date}: ${day.hasRead ? 'Read' : 'No activity'}`}
            className={`w-4 h-4 rounded-sm flex-shrink-0 cursor-pointer ${
              day.hasRead 
                ? 'bg-emerald-500 dark:bg-emerald-400' 
                : 'bg-gray-100 dark:bg-gray-800'
            }`}
            style={{ 
              transition: 'background-color 0.2s var(--ease-in-out), transform 0.1s var(--ease-spring)',
            }}
            onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.2)'}
            onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
          />
        ))}
      </div>

      <div className="mt-4 flex items-center justify-end gap-2 text-xs text-gray-500 dark:text-gray-400">
        <span>Less</span>
        <div className="w-3 h-3 rounded-sm bg-gray-100 dark:bg-gray-800" />
        <div className="w-3 h-3 rounded-sm bg-emerald-500 dark:bg-emerald-400" />
        <span>More</span>
      </div>
    </div>
  );
}
