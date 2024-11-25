import { Process } from "@/types/process-types";

export const CPU_SCHEDULING_ALGORITHMS = [
  {
    name: "First Come First Serve",
    description: "The first process to arrive is the first to serve.",
    header: ["Process ID", "Arrival Time", "Burst Time"],
    calculate: (processes: Process[]) => {
      // FCFS Calculation Logic
      const sortedProcesses = [...processes].sort(
        (a, b) => a.arrivalTime - b.arrivalTime
      );

      let currentTime = 0;
      let totalTurnaroundTime = 0;
      let totalWaitingTime = 0;

      sortedProcesses.forEach((process) => {
        if (currentTime < process.arrivalTime) {
          currentTime = process.arrivalTime;
        }

        process.completionTime = currentTime + process.burstTime;
        process.turnaroundTime = process.completionTime - process.arrivalTime;
        process.waitingTime = process.turnaroundTime - process.burstTime;

        totalTurnaroundTime += process.turnaroundTime;
        totalWaitingTime += process.waitingTime;

        currentTime = process.completionTime;
      });

      const averageTurnaroundTime = totalTurnaroundTime / sortedProcesses.length;
      const averageWaitingTime = totalWaitingTime / sortedProcesses.length;

      return {
        processes: sortedProcesses,
        averageTurnaroundTime,
        averageWaitingTime,
      };
    },
  },
  {
    name: "Shortest Job First",
    description: "The process with the shortest burst time is served first.",
    header: ["Process ID", "Arrival Time", "Burst Time"],
  },
  {
    name: "Round Robin",
    description: "Each process is served in turns, starting with the first process.",
    header: ["Process ID", "Arrival Time", "Burst Time"],
  },
  {
    name: "Shortest Remaining Time First",
    description: "The process with the shortest remaining burst time is served first.",
    header: ["Process ID", "Arrival Time", "Burst Time"],
  },
];