"use client"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { CPU_SCHEDULING_ALGORITHMS } from "@/constants/cpu-scheduling-algorithms";
import useProcessStore from '@/stores/process-store';

const SelectAlgorithm = () => {
  return (
    <Select onValueChange={(value) => {
      const setSelectedAlgorithm = useProcessStore.getState().setSelectedAlgorithm;
      setSelectedAlgorithm(value);
    }}>
      <SelectTrigger className="w-[200px]">
        <SelectValue placeholder="Select an algorithm" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>CPU Scheduling Algorithms</SelectLabel>
          {CPU_SCHEDULING_ALGORITHMS.map((algorithm, idx) => (
            <SelectItem key={idx} value={algorithm.name}>{algorithm.name}</SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}

export default SelectAlgorithm;