"use client"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import useProcessStore from '@/stores/process-store';
import { Input } from './ui/input';
import { Button } from './ui/button';
import AddProcesses from './add-processes';

const ProcessTable = () => {
  const processes = useProcessStore((state) => state.processes);
  const isEditing = useProcessStore((state) => state.isEditing);
  const updateProcess = useProcessStore((state) => state.updateProcess);
  const calculate = useProcessStore((state) => state.calculate);
  const selectedAlgorithm = useProcessStore((state) => state.selectedAlgorithm);
  return (
    <div className='flex flex-col gap-6'>
      <div className="flex items-center justify-between gap-8">
        <Button onClick={useProcessStore.getState().toggleEditProcess}>
          {isEditing ? "Done" : "Edit Process"}
        </Button>
        <AddProcesses />
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
                    onChange={(e) => updateProcess(index, "arrivalTime", e.target.value)}
                  />
                ) : (
                  <p>{process.arrivalTime}</p>
                )}
              </TableCell>
              <TableCell>
                {isEditing ? (
                  <Input
                    type='number'
                    defaultValue={process.burstTime}
                    onChange={(e) => updateProcess(index, "burstTime", e.target.value)}
                  />
                ) : (
                  <p>{process.burstTime}</p>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div>
        <Button onClick={calculate}>Calculate {selectedAlgorithm.name}</Button>
      </div>
    </div>
  );
};

export default ProcessTable;