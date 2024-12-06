"use client";
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
import { usePageReplacementStore } from "@/stores/page-replacement-store";
import useProcessStore from "@/stores/process-store";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/sheet";
import { Menu, Cpu, Layers } from "lucide-react";
import Link from "next/link";

const SelectAlgorithm = () => {
  return (
    <div className="flex gap-8">
      <Sheet>
        <SheetTrigger>
          <Menu />
        </SheetTrigger>
        <SheetContent side="left">
          <SheetHeader className="mb-4">
            <SheetTitle>Select an Algorithm</SheetTitle>
            <SheetDescription>
              Select the algorithm you would like to use.
            </SheetDescription>
          </SheetHeader>
          <hr></hr>
          <div className="mt-4 flex flex-col gap-4">
            <SheetClose asChild>
              <Link href="/" className="hover:text-orange-500 flex items-center gap-2">
                <Cpu className="h-4" />
                CPU Scheduling
              </Link>
            </SheetClose>
            <SheetClose asChild>
              <Link
                href="/page-replacement-algorithms"
                className="hover:text-orange-500 flex items-center gap-2"
              >
                <Layers className="h-4" />
                Page Replacement
              </Link>
            </SheetClose>
          </div>
        </SheetContent>
      </Sheet>
      <Select
        onValueChange={(value) => {
          // Check if the selected algorithm is a CPU scheduling algorithm or a Page Replacement algorithm
          if (
            CPU_SCHEDULING_ALGORITHMS.some(
              (algorithm) => algorithm.name === value
            )
          ) {
            // Update the CPU Scheduling algorithm store
            const setSelectedCpuAlgorithm =
              useProcessStore.getState().setSelectedAlgorithm;
            setSelectedCpuAlgorithm(value);
          } else {
            // Update the Page Replacement algorithm store
            const setSelectedPageReplacementAlgorithm =
              usePageReplacementStore.getState().setAlgorithm;
            setSelectedPageReplacementAlgorithm(value);
          }
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
          <SelectGroup>
            <SelectLabel>Page Replacement Algorithms</SelectLabel>
            <SelectItem value="FIFO">FIFO</SelectItem>
            <SelectItem value="LRU">LRU</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
};

export default SelectAlgorithm;
