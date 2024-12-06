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
    
      // Create an array for the Gantt chart
      const ganttChart: { processId: number; startTime: number; endTime: number }[] = [];
    
      sortedProcesses.forEach((process) => {
        if (currentTime < process.arrivalTime) {
          currentTime = process.arrivalTime;
        }
    
        // Capture start and end times for the Gantt chart
        const startTime = currentTime;
        const endTime = currentTime + process.burstTime;
    
        // Set the process timings
        process.completionTime = endTime;
        process.turnaroundTime = process.completionTime - process.arrivalTime;
        process.waitingTime = process.turnaroundTime - process.burstTime;
    
        totalTurnaroundTime += process.turnaroundTime;
        totalWaitingTime += process.waitingTime;
    
        // Update current time
        currentTime = process.completionTime;
    
        // Add the process to the Gantt chart
        ganttChart.push({
          processId: process.processId,
          startTime: startTime,
          endTime: endTime,
        });
      });
    
      const averageTurnaroundTime = totalTurnaroundTime / sortedProcesses.length;
      const averageWaitingTime = totalWaitingTime / sortedProcesses.length;
    
      return {
        processes: sortedProcesses,
        averageTurnaroundTime,
        averageWaitingTime,
        ganttChart, // Include Gantt chart data
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
      const ganttChart: { processId: number; startTime: number; endTime: number }[] = [];
    
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
    
        const startTime = currentTime; // Store start time
        currentProcess.completionTime = currentTime + currentProcess.burstTime;
        currentProcess.turnaroundTime = currentProcess.completionTime - currentProcess.arrivalTime;
        currentProcess.waitingTime = currentProcess.turnaroundTime - currentProcess.burstTime;
    
        totalTurnaroundTime += currentProcess.turnaroundTime;
        totalWaitingTime += currentProcess.waitingTime;
    
        // Update current time to the completion time of the current process
        currentTime = currentProcess.completionTime;
    
        // Add the completed process to the results
        completedProcesses.push(currentProcess);
    
        // Add Gantt chart data
        ganttChart.push({
          processId: currentProcess.processId,
          startTime: startTime,
          endTime: currentProcess.completionTime,
        });
      }
    
      const averageTurnaroundTime = totalTurnaroundTime / completedProcesses.length;
      const averageWaitingTime = totalWaitingTime / completedProcesses.length;
    
      return {
        processes: completedProcesses,
        averageTurnaroundTime,
        averageWaitingTime,
        ganttChart, // Include Gantt chart data
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
    calculate: (processes: Process[]) => {
      const remainingProcesses = processes.map((process) => ({
        ...process,
        remainingTime: process.burstTime,
      }));
    
      const ganttChart: { processId: number; startTime: number; endTime: number }[] = [];
      let currentTime = 0;
      let totalTurnaroundTime = 0;
      let totalWaitingTime = 0;
    
      while (remainingProcesses.length > 0) {
        const readyQueue = remainingProcesses.filter(
          (process) => process.arrivalTime <= currentTime
        );
    
        if (readyQueue.length === 0) {
          currentTime = remainingProcesses[0].arrivalTime;
          continue;
        }
    
        readyQueue.sort((a, b) => a.remainingTime - b.remainingTime);
        const currentProcess = readyQueue[0];
    
        const startTime = currentTime;
        currentProcess.remainingTime -= 1;
        currentTime += 1;
    
        // Add this execution segment to the Gantt chart
        if (
          ganttChart.length > 0 &&
          ganttChart[ganttChart.length - 1].processId === currentProcess.processId
        ) {
          ganttChart[ganttChart.length - 1].endTime = currentTime;
        } else {
          ganttChart.push({
            processId: currentProcess.processId,
            startTime: startTime,
            endTime: currentTime,
          });
        }
    
        if (currentProcess.remainingTime === 0) {
          currentProcess.completionTime = currentTime;
          currentProcess.turnaroundTime =
            currentProcess.completionTime - currentProcess.arrivalTime;
          currentProcess.waitingTime =
            currentProcess.turnaroundTime - currentProcess.burstTime;
    
          totalTurnaroundTime += currentProcess.turnaroundTime;
          totalWaitingTime += currentProcess.waitingTime;
    
          const index = remainingProcesses.findIndex(
            (process) => process.processId === currentProcess.processId
          );
          if (index > -1) remainingProcesses.splice(index, 1);
        }
      }
    
      const averageTurnaroundTime = totalTurnaroundTime / processes.length;
      const averageWaitingTime = totalWaitingTime / processes.length;
    
      return {
        processes: processes.map((process) => ({
          processId: process.processId,
          arrivalTime: process.arrivalTime,
          burstTime: process.burstTime,
          completionTime: process.completionTime,
          turnaroundTime: process.turnaroundTime,
          waitingTime: process.waitingTime,
        })),
        averageTurnaroundTime,
        averageWaitingTime,
        ganttChart, // Include Gantt chart data
      };
    }
  },
];