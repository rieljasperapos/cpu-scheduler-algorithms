"use client";
import React from "react";
import useProcessStore from "@/stores/process-store";

const GanttChart = () => {
  const results = useProcessStore((state) => state.results);

  if (!results) {
    return <p>No data available. Please calculate FCFS first.</p>;
  }

  const { processes } = results;

  return (
    <div className="mt-4 space-y-4">
      <h2 className="text-xl font-semibold">Gantt Chart</h2>
      <div className="flex items-center gap-2 mt-2 overflow-x-auto">
        {processes.map((process, idx) => (
          <div
            key={idx}
            className="flex flex-col"
            style={{
              flexGrow: process.burstTime, // Make width proportional to burst time
              flexShrink: 1, // Shrink if too wide
              flexBasis: "50px", // Minimum width
            }}
          >
            <div
              key={process.processId}
              className="flex flex-col items-center justify-center border border-slate-500 rounded p-2"
            >
              <p>P{process.processId}</p>
              <p>{process.completionTime}</p>
            </div>
            <div className="flex justify-between">
              <p>{(process.completionTime ?? 0) - process.burstTime}</p>
              {idx === processes.length - 1 && <p>{process.completionTime}</p>}
            </div>
          </div>
        ))}
      </div>
      <p>Average Turnaround Time: {results.averageTurnaroundTime}</p>
      <p>Average Waiting Time: {results.averageWaitingTime}</p>
    </div>
  );
};

export default GanttChart;
