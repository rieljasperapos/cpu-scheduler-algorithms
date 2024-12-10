"use client"
import ProcessTable from "@/components/process-table";
import useProcessStore from "@/stores/process-store";
import GanttChart from "@/components/gantt-chart";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CPU_SCHEDULING_ALGORITHMS } from "@/constants/cpu-scheduling-algorithms";

export default function CPUSchedulingPage() {
  const showGanttChart = useProcessStore((state) => state.showGanttChart);
  const algorithm = useProcessStore((state) => state.selectedAlgorithm.name);
  const setSelectedAlgorithm = useProcessStore((state) => state.setSelectedAlgorithm);

  return (
    <div className="w-full max-w-2xl mx-auto p-8 space-y-8">
      <Select
        onValueChange={(value) => {
          setSelectedAlgorithm(value);
        }}
      >
        <SelectTrigger className="w-[200px]">
          <SelectValue placeholder="Select an algorithm" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>CPU Scheduling Algorithms</SelectLabel>
            {CPU_SCHEDULING_ALGORITHMS.map((algorithm, idx) => (
              <SelectItem key={idx} value={algorithm.name}>
                {algorithm.name}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
      <h1 className="text-3xl font-bold text-center">{algorithm} CPU Scheduling Algorithm</h1>
      <ProcessTable />
      {showGanttChart && <GanttChart />}
    </div>
  );
}
