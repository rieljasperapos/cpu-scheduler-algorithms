"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import useProcessStore from "@/stores/process-store";
import { Process } from "@/types/process-types";
import { useEffect, useState } from "react";

const AddProcessDialog = () => {
  const [numberOfProcesses, setNumberOfProcesses] = useState(0);
  const [processes, setProcesses] = useState<Process[]>([]);

  const handleNumberOfProcessesChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNumberOfProcesses(Number(event.target.value));
  }

  const handleProcessChange = (index: number, field: "arrivalTime" | "burstTime", value: string) => {
    setProcesses((prevProcesses) => {
      const updatedProcesses = [...prevProcesses];
      updatedProcesses[index][field] = Number(value);
      return updatedProcesses;
    });
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Add Process</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Processes</DialogTitle>
          <DialogDescription>
            Specify the number of processes and their respective arrival and
            burst times.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-6">
          <div className="space-y-4">
            {/* Number of processes */}
            <Label htmlFor="numberOfProcesses">No. of processes</Label>
            <Input
              id="numberOfProcesses"
              type="number"
              value={numberOfProcesses}
              onChange={handleNumberOfProcessesChange}
            />
          </div>
          <hr />
          {/* Render arrival time and burst time inputs for each process */}
          {Array.from({ length: Number(numberOfProcesses) }).map((_, index) => (
            <div key={index} className="flex gap-4 items-center">
              <p className="text-sm">P{index + 1}</p>
              <div className="space-y-2">
                <Label htmlFor={`arrivalTime-${index}`}>Arrival Time</Label>
                <Input
                  id={`arrivalTime-${index}`}
                  type="number"
                  value={processes[index]?.arrivalTime}
                  onChange={(e) =>
                    handleProcessChange(
                      index,
                      "arrivalTime",
                      e.target.value
                    )
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor={`burstTime-${index}`}>Burst Time</Label>
                <Input
                  id={`burstTime-${index}`}
                  type="number"
                  value={processes[index]?.burstTime}
                  onChange={(e) =>
                    handleProcessChange(
                      index,
                      "burstTime",
                      e.target.value
                    )
                  }
                />
              </div>
            </div>
          ))}
          {numberOfProcesses === 0 ? (
            ""
          ) : (
            <DialogClose asChild>
              <Button>Submit</Button>
            </DialogClose>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddProcessDialog;
