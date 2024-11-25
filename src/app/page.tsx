"use client"
import ProcessTable from "@/components/process-table";
import useProcessStore from "@/stores/process-store";
import GanttChart from "@/components/gantt-chart";

export default function Home() {
  const showGanttChart = useProcessStore((state) => state.showGanttChart);

  return (
    <div className="w-full max-w-2xl">
      <ProcessTable />
      {showGanttChart && <GanttChart />}
    </div>
  );
}
