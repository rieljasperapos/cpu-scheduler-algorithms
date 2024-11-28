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
    calculate: (processes: Process[]) => {
      // Deep copy processes to avoid modifying the original array
      const remainingProcesses = [...processes].sort((a, b) => a.arrivalTime - b.arrivalTime);
    
      let currentTime = 0;
      let totalTurnaroundTime = 0;
      let totalWaitingTime = 0;
    
      const completedProcesses: Process[] = [];
    
      while (remainingProcesses.length > 0) {
        // Get processes that have arrived by the current time
        const readyQueue = remainingProcesses.filter(
          (process) => process.arrivalTime <= currentTime
        );
    
        if (readyQueue.length === 0) {
          // If no process is ready, fast forward time to the next process arrival
          currentTime = remainingProcesses[0].arrivalTime;
          continue;
        }
    
        // Sort the ready queue by burst time
        readyQueue.sort((a, b) => a.burstTime - b.burstTime);
    
        // Pick the shortest job from the ready queue
        const currentProcess = readyQueue[0];
    
        // Remove the selected process from the remaining processes list
        const indexToRemove = remainingProcesses.indexOf(currentProcess);
        remainingProcesses.splice(indexToRemove, 1);
    
        // Calculate metrics for the current process
        if (currentTime < currentProcess.arrivalTime) {
          currentTime = currentProcess.arrivalTime;
        }
    
        currentProcess.completionTime = currentTime + currentProcess.burstTime;
        currentProcess.turnaroundTime = currentProcess.completionTime - currentProcess.arrivalTime;
        currentProcess.waitingTime = currentProcess.turnaroundTime - currentProcess.burstTime;
    
        totalTurnaroundTime += currentProcess.turnaroundTime;
        totalWaitingTime += currentProcess.waitingTime;
    
        // Update current time to the completion time of the current process
        currentTime = currentProcess.completionTime;
    
        // Add the completed process to the results
        completedProcesses.push(currentProcess);
      }
    
      const averageTurnaroundTime = totalTurnaroundTime / completedProcesses.length;
      const averageWaitingTime = totalWaitingTime / completedProcesses.length;
    
      return {
        processes: completedProcesses,
        averageTurnaroundTime,
        averageWaitingTime,
      };
    },    
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