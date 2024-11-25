"use client"
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import useProcessStore from "@/stores/process-store";

const AddProcesses = () => {
  const numberOfProcesses = useProcessStore((state) => state.numberOfProcesses);
  const setNumberOfProcesses = useProcessStore((state) => state.setNumberOfProcesses);
  return (
    <div className="flex items-center gap-4">
      <Label>Add Processes</Label>
      <Input
        type="number"
        defaultValue={numberOfProcesses}
        onChange={(e) => setNumberOfProcesses(e.target.value)}
      />
    </div>
  )
}

export default AddProcesses;