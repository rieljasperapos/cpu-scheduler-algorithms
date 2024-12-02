"use client";

import React from "react";
import useProcessStore from "@/stores/process-store";

const GanttChart = () => {
  const results = useProcessStore((state) => state.results);

  if (!results) {
    return <p>No data available. Please calculate SRTF first.</p>;
  }

  const { ganttChart, averageTurnaroundTime, averageWaitingTime } = results;

  return (
    <div className="mt-4 space-y-4">
      <h2 className="text-xl font-semibold">Gantt Chart</h2>
      <div className="flex items-center gap-2 mt-2 overflow-x-auto">
        {ganttChart.map((segment, idx) => (
          <div
            key={idx}
            className="flex flex-col"
            style={{
              flexGrow: segment.endTime - segment.startTime, // Width proportional to execution time
              flexShrink: 1,
              flexBasis: "50px",
            }}
          >
            <div className="flex flex-col items-center justify-center border border-slate-500 rounded p-2">
              <p>P{segment.processId}</p>
              <p>{segment.endTime}</p>
            </div>
            <div className="flex justify-between">
              <p>{segment.startTime}</p>
              {idx === ganttChart.length - 1 && <p>{segment.endTime}</p>}
            </div>
          </div>
        ))}
      </div>
      <p>Average Turnaround Time: {averageTurnaroundTime}</p>
      <p>Average Waiting Time: {averageWaitingTime}</p>
    </div>
  );
};

export default GanttChart;
