"use client"
import useDiskStore from "@/stores/disk-scheduling-store";
import DiskForm from "./_components/disk-form";
import DiskStatistics from "./_components/disk-statistics";
import Graph from "./_components/graph";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const DiskSchedulingPage = () => {
  const currentPosition = useDiskStore((state) => state.currentPosition);
  const setRequests = useDiskStore((state) => state.setRequests);
  const setCurrentPosition = useDiskStore((state) => state.setCurrentPosition);
  const calculate = useDiskStore((state) => state.calculate);
  const requests = useDiskStore((state) => state.requests);
  const algorithm = useDiskStore((state) => state.algorithm);
  const setAlgorithm = useDiskStore((state) => state.setAlgorithm);

  const handleRun = (requests: string, currentPosition: number) => {
    setRequests(requests);
    setCurrentPosition(currentPosition);
    calculate();
  }

  const hasResults = !isNaN(requests[0]);
  
  return (
    <div className="w-full max-w-2xl mx-auto p-8 space-y-8">
      <Select
        onValueChange={(value: "FCFS" | "C-SCAN" | "C-LOOK") => {
          setAlgorithm(value);
        }}
      >
        <SelectTrigger className="w-[200px]">
          <SelectValue placeholder="Select an algorithm" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Disk Scheduling Algorithms</SelectLabel>
            <SelectItem value="FCFS">FCFS</SelectItem>
            <SelectItem value="C-SCAN">C-SCAN</SelectItem>
            <SelectItem value="C-LOOK">C-LOOK</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
      <h1 className="text-3xl font-bold text-center">{algorithm} Disk Scheduling Algorithm</h1>
      <DiskForm
        onRun={handleRun}
        defaultCurrentPosition={currentPosition}
      />


      {hasResults && (
        <>
          <DiskStatistics />
          <Graph />
        </>
      )}

      {!hasResults && (
        <div className="text-center text-lg text-gray-500">
          <p>No results to display yet.</p>
        </div>
      )}
    </div>
  )
}

export default DiskSchedulingPage;