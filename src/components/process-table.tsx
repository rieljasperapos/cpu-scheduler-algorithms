"use client";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import useProcessStore from "@/stores/process-store";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import AddProcesses from "./add-processes";

const ProcessTable = () => {
  const processes = useProcessStore((state) => state.processes);
  const isEditing = useProcessStore((state) => state.isEditing);
  const updateProcess = useProcessStore((state) => state.updateProcess);
  const calculate = useProcessStore((state) => state.calculate);
  const selectedAlgorithm = useProcessStore((state) => state.selectedAlgorithm);
  const requiresTimeQuantum = selectedAlgorithm.requiresTimeQuantum;

  return (
    <div className="flex flex-col gap-12">
      <div className="flex items-center justify-between gap-8">
        <Button onClick={useProcessStore.getState().toggleEditProcess}>
          {isEditing ? "Done" : "Edit Process"}
        </Button>
        <AddProcesses />
        {requiresTimeQuantum && (
          <div className="flex items-center gap-4">
            <Label>Time Quanta</Label>
            <Input
              type="number"
              defaultValue={useProcessStore.getState().timeQuantum}
              onChange={(e) =>
                useProcessStore
                  .getState()
                  .setTimeQuantum(Number(e.target.value))
              }
            />
          </div>
        )}
      </div>
      <Table>
        <TableCaption>CPU Scheduling Algorithms</TableCaption>
        <TableHeader>
          <TableRow>
            {selectedAlgorithm.header.map((header, index) => (
              <TableHead key={index}>{header}</TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {processes.map((process, index) => (
            <TableRow key={index}>
              <TableCell>P{index + 1}</TableCell>
              <TableCell>
                {isEditing ? (
                  <Input
                    type="number"
                    defaultValue={process.arrivalTime}
                    onChange={(e) =>
                      updateProcess(index, "arrivalTime", e.target.value)
                    }
                  />
                ) : (
                  <p>{process.arrivalTime}</p>
                )}
              </TableCell>
              <TableCell>
                {isEditing ? (
                  <Input
                    type="number"
                    defaultValue={process.burstTime}
                    onChange={(e) =>
                      updateProcess(index, "burstTime", e.target.value)
                    }
                  />
                ) : (
                  <p>{process.burstTime}</p>
                )}
              </TableCell>
              <TableCell>
                {isEditing &&
                (selectedAlgorithm.name ===
                  "Priority Scheduling (Non-Preemptive)" ||
                  selectedAlgorithm.name ===
                    "Priority Scheduling (Preemptive)") ? (
                  <Input
                    type="number"
                    defaultValue={process.priority}
                    onChange={(e) =>
                      updateProcess(index, "priority", e.target.value)
                    }
                  />
                ) : selectedAlgorithm.name ===
                    "Priority Scheduling (Non-Preemptive)" ||
                  selectedAlgorithm.name ===
                    "Priority Scheduling (Preemptive)" ? (
                  <p>{process.priority}</p>
                ) : null}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Button onClick={calculate}>Calculate {selectedAlgorithm.name}</Button>
    </div>
  );
};

export default ProcessTable;
