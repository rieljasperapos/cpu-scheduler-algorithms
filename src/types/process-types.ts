export interface Process {
  processId: number;
  arrivalTime: number;
  priority: number;
  burstTime: number;
  completionTime?: number;
  waitingTime?: number;
  turnaroundTime?: number;
};

export interface Algorithms {
  name: string;
  description: string;
  header: string[];
  calculate?: (processes: Process[], timeQuantum?: number) => ProcessResult;
  requiresTimeQuantum?: boolean; // Optional field for Round Robin
};

export type ProcessResult = {
  processes: Process[];
  averageTurnaroundTime: number;
  averageWaitingTime: number;
  ganttChart: { processId: number; startTime: number; endTime: number }[]; // Add this property
};