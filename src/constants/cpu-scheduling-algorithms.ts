import useProcessStore from "@/stores/process-store";
import { Process, ProcessResult } from "@/types/process-types";
export const CPU_SCHEDULING_ALGORITHMS = [
  {
    name: "First Come First Serve",
    description: "The first process to arrive is the first to serve.",
    header: ["Process ID", "Arrival Time", "Burst Time"],
    requiresTimeQuantum: false,
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
    requiresTimeQuantum: false,
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
    description: "Each process is served in turns with a fixed time quantum.",
    header: ["Process ID", "Arrival Time", "Burst Time"],
    requiresTimeQuantum: true,
    calculate: (processes: Process[], timeQuantum: number): ProcessResult => {
      console.log("Starting Round Robin calculation");
      console.log("Initial processes:", processes);
      console.log("Time Quantum:", timeQuantum);
  
      // Map to track remaining burst times
      const remainingTimes: { [processId: number]: number } = {};
      processes.forEach((process) => {
        remainingTimes[process.processId] = process.burstTime;
      });
  
      const ganttChart: {
        processId: number;
        startTime: number;
        endTime: number;
      }[] = [];
      let currentTime = 0;
      let totalTurnaroundTime = 0;
      let totalWaitingTime = 0;
  
      const completedProcesses: Process[] = [];
      const queue: Process[] = [];
      let index = 0; // Index to track arriving processes
  
      while (completedProcesses.length < processes.length) {
        // Add new arrivals to the queue
        while (
          index < processes.length &&
          processes[index].arrivalTime <= currentTime
        ) {
          console.log(
            `Process P${processes[index].processId} arrived at time ${processes[index].arrivalTime}`
          );
          queue.push(processes[index]);
          index++;
        }
  
        if (queue.length === 0) {
          // If no processes are ready, advance time to the next arrival or increment
          const nextArrival = processes[index]?.arrivalTime;
          currentTime = nextArrival !== undefined ? nextArrival : currentTime + 1;
          console.log(`No processes in queue, advancing time to ${currentTime}`);
          continue;
        }
  
        // Get the next process from the queue
        const currentProcess = queue.shift()!;
        console.log(
          `Processing P${currentProcess.processId} at time ${currentTime}`
        );
  
        const startTime = currentTime;
        // Execute the process for time quantum or remaining time
        const executionTime = Math.min(
          remainingTimes[currentProcess.processId],
          timeQuantum
        );
        remainingTimes[currentProcess.processId] -= executionTime;
        currentTime += executionTime;
  
        // Add Gantt chart data
        ganttChart.push({
          processId: currentProcess.processId,
          startTime: startTime,
          endTime: currentTime,
        });
        console.log(
          `P${currentProcess.processId} executed from ${startTime} to ${currentTime}`
        );
  
        // Add any new arrivals during execution
        while (
          index < processes.length &&
          processes[index].arrivalTime <= currentTime
        ) {
          console.log(
            `Process P${processes[index].processId} arrived at time ${processes[index].arrivalTime}`
          );
          queue.push(processes[index]);
          index++;
        }
  
        if (remainingTimes[currentProcess.processId] > 0) {
          // Process not finished, re-add to queue
          queue.push(currentProcess);
          console.log(
            `P${currentProcess.processId} not finished, remaining time: ${remainingTimes[currentProcess.processId]}`
          );
        } else {
          // Process completed
          currentProcess.completionTime = currentTime;
          currentProcess.turnaroundTime =
            currentProcess.completionTime - currentProcess.arrivalTime;
          currentProcess.waitingTime =
            currentProcess.turnaroundTime - currentProcess.burstTime;
  
          totalTurnaroundTime += currentProcess.turnaroundTime;
          totalWaitingTime += currentProcess.waitingTime;
  
          completedProcesses.push(currentProcess);
          console.log(
            `P${currentProcess.processId} completed at time ${currentTime}`
          );
        }
      }
  
      const averageTurnaroundTime = totalTurnaroundTime / processes.length;
      const averageWaitingTime = totalWaitingTime / processes.length;
  
      console.log("Round Robin calculation completed");
      console.log("Completed processes:", completedProcesses);
  
      return {
        processes: completedProcesses,
        averageTurnaroundTime,
        averageWaitingTime,
        ganttChart,
      };
    },
  },
  {
    name: "Shortest Remaining Time First",
    description: "The process with the shortest remaining burst time is served first.",
    header: ["Process ID", "Arrival Time", "Burst Time"],
    requiresTimeQuantum: false,
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
  {
    name: "Priority Scheduling (Non-Preemptive)",
    description: "Processes are scheduled based on static priority levels.",
    header: ["Process ID", "Arrival Time", "Burst Time"],
    requiresTimeQuantum: false,
    calculate: (processes: Process[]): ProcessResult => {
      console.log("Starting Priority Scheduling calculation");
      console.log("Initial processes:", processes);
  
      // Assign priority based on processId
      processes.forEach((process) => {
        process.priority = process.processId; // Priority equals processId
      });
  
      // Sort processes by arrival time
      const remainingProcesses = [...processes].sort(
        (a, b) => a.arrivalTime - b.arrivalTime
      );
  
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
          currentTime = remainingProcesses[0].arrivalTime;
          continue;
        }
  
        // Sort the ready queue by priority (lower number means higher priority)
        readyQueue.sort((a, b) => a.priority - b.priority);
  
        // Select the process with highest priority
        const currentProcess = readyQueue[0];
        const startTime = currentTime;
        currentTime += currentProcess.burstTime;
  
        currentProcess.completionTime = currentTime;
        currentProcess.turnaroundTime = currentProcess.completionTime - currentProcess.arrivalTime;
        currentProcess.waitingTime = currentProcess.turnaroundTime - currentProcess.burstTime;
  
        totalTurnaroundTime += currentProcess.turnaroundTime;
        totalWaitingTime += currentProcess.waitingTime;
  
        // Remove the process from the remaining processes
        const indexToRemove = remainingProcesses.findIndex(
          (p) => p.processId === currentProcess.processId
        );
        if (indexToRemove > -1) {
          remainingProcesses.splice(indexToRemove, 1);
        }
  
        completedProcesses.push(currentProcess);
  
        // Update Gantt chart
        ganttChart.push({
          processId: currentProcess.processId,
          startTime: startTime,
          endTime: currentTime,
        });
  
        console.log(
          `Process P${currentProcess.processId} completed at time ${currentTime}`
        );
      }
  
      const averageTurnaroundTime = totalTurnaroundTime / processes.length;
      const averageWaitingTime = totalWaitingTime / processes.length;
  
      console.log("Priority Scheduling calculation completed");
      console.log("Completed processes:", completedProcesses);
  
      return {
        processes: completedProcesses,
        averageTurnaroundTime,
        averageWaitingTime,
        ganttChart,
      };
    },
  },
  {
    name: "Priority Scheduling (Preemptive)",
    description:
      "Processes are scheduled based on dynamic priority levels, preempting if a higher priority process arrives.",
    header: ["Process ID", "Arrival Time", "Burst Time"],
    requiresTimeQuantum: false,
    calculate: (processes: Process[]): ProcessResult => {
      console.log("Starting Preemptive Priority Scheduling calculation");
      console.log("Initial processes:", processes);
  
      // Assign priorities based on processId (lower processId means higher priority)
      const priorities: { [processId: number]: number } = {};
      processes.forEach((process) => {
        priorities[process.processId] = process.processId; // Priority equals processId
      });
  
      // Deep copy processes and initialize remaining times
      const remainingProcesses = processes.map((process) => ({
        ...process,
        remainingTime: process.burstTime,
        isCompleted: false,
      }));
  
      const ganttChart: { processId: number; startTime: number; endTime: number }[] = [];
      let currentTime = 0;
      let totalTurnaroundTime = 0;
      let totalWaitingTime = 0;
      let lastProcessId: number | null = null;
  
      while (remainingProcesses.some((p) => !p.isCompleted)) {
        // Get processes that have arrived by current time and are not completed
        const readyQueue = remainingProcesses.filter(
          (process) => process.arrivalTime <= currentTime && !process.isCompleted
        );
  
        if (readyQueue.length === 0) {
          currentTime++;
          continue;
        }
  
        // Sort the ready queue by priority (lower number means higher priority)
        readyQueue.sort((a, b) => priorities[a.processId] - priorities[b.processId]);
  
        const currentProcess = readyQueue[0];
  
        // Execute the current process for 1 time unit
        if (lastProcessId !== currentProcess.processId) {
          // Record context switch in Gantt chart
          ganttChart.push({
            processId: currentProcess.processId,
            startTime: currentTime,
            endTime: currentTime + 1,
          });
        } else {
          // Extend the end time of the current process in Gantt chart
          ganttChart[ganttChart.length - 1].endTime += 1;
        }
  
        currentProcess.remainingTime -= 1;
        currentTime += 1;
        lastProcessId = currentProcess.processId;
  
        if (currentProcess.remainingTime === 0) {
          currentProcess.isCompleted = true;
          currentProcess.completionTime = currentTime;
          currentProcess.turnaroundTime =
            currentProcess.completionTime - currentProcess.arrivalTime;
          currentProcess.waitingTime =
            currentProcess.turnaroundTime - currentProcess.burstTime;
  
          totalTurnaroundTime += currentProcess.turnaroundTime;
          totalWaitingTime += currentProcess.waitingTime;
  
          console.log(`Process P${currentProcess.processId} completed at time ${currentTime}`);
        }
      }
  
      const averageTurnaroundTime = totalTurnaroundTime / processes.length;
      const averageWaitingTime = totalWaitingTime / processes.length;
  
      console.log("Preemptive Priority Scheduling calculation completed");
  
      return {
        processes: remainingProcesses.map((process) => ({
          processId: process.processId,
          arrivalTime: process.arrivalTime,
          burstTime: process.burstTime,
          completionTime: process.completionTime,
          turnaroundTime: process.turnaroundTime,
          waitingTime: process.waitingTime,
        })),
        averageTurnaroundTime,
        averageWaitingTime,
        ganttChart,
      };
    },
  },
];