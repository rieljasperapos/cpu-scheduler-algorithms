import { create } from "zustand";
import { Process, ProcessResult, Algorithms } from "@/types/process-types";
import { CPU_SCHEDULING_ALGORITHMS } from "@/constants/cpu-scheduling-algorithms";

interface ProcessState {
  numberOfProcesses: string;
  buttonText: string;
  isEditing: boolean;
  processes: Process[];
  results: ProcessResult | null;
  showGanttChart: boolean;
  selectedAlgorithm: Algorithms;
  timeQuantum: number;
  setTimeQuantum: (value: number) => void;
  setSelectedAlgorithm: (algorithm: string) => void;
  setNumberOfProcesses: (count: string) => void;
  updateProcess: (index: number, field: "arrivalTime" | "burstTime", value: string) => void;
  toggleEditProcess: () => void;
  calculate: () => void;
  resetResults: () => void;
}

const useProcessStore = create<ProcessState>((set, get) => ({
  numberOfProcesses: "0",
  buttonText: "Edit Process",
  isEditing: false,
  processes: [],
  results: null,
  showGanttChart: false,
  selectedAlgorithm: CPU_SCHEDULING_ALGORITHMS[0],
  timeQuantum: 0,
  setTimeQuantum: (value) => set(() => ({ timeQuantum: value })),
  setSelectedAlgorithm: (algorithmName) =>
    set((state) => ({
      selectedAlgorithm:
        CPU_SCHEDULING_ALGORITHMS.find((algo) => algo.name === algorithmName) ||
        state.selectedAlgorithm,
    })),
  setNumberOfProcesses: (count) =>
    set(() => ({
      numberOfProcesses: count,
      processes: Array.from({ length: Number(count) }, (_, index) => ({
        processId: index + 1,
        arrivalTime: 0,
        burstTime: 0,
      })),
      results: null,
    })),
  updateProcess: (index, field, value) =>
    set((state) => {
      const updatedProcesses = [...state.processes];
      updatedProcesses[index][field] = Number(value);
      return { processes: updatedProcesses };
    }),
  toggleEditProcess: () =>
    set((state) => ({
      isEditing: !state.isEditing,
      buttonText: state.buttonText === "Edit Process" ? "Done" : "Edit Process",
    })),
  calculate: () => {
    const { processes, selectedAlgorithm, timeQuantum } = get();
    console.log("Processes:", processes);
    console.log("Selected Algorithm:", selectedAlgorithm);
    console.log("Time Quantum:", timeQuantum);

    if (processes.length === 0) {
      console.warn("No processes available for calculation.");
      return;
    }

    const calculationLogic = selectedAlgorithm.calculate;

    if (!calculationLogic) {
      console.error(`Calculation logic is not defined for algorithm: ${selectedAlgorithm.name}`);
      return;
    }

    if (selectedAlgorithm.name === "Round Robin") {
      if (timeQuantum == 0) {
        console.error("Time Quantum is required for Round Robin.");
        return;
      }
      const results = calculationLogic(processes, timeQuantum);
      console.log("Results:", results);
      set({ results, showGanttChart: true });
    } else {
      const results = calculationLogic(processes);
      console.log("Results:", results);
      set({ results, showGanttChart: true });
    }
  },
  resetResults: () =>
    set(() => ({
      results: null,
      showGanttChart: false,
    })),
}));

export default useProcessStore;