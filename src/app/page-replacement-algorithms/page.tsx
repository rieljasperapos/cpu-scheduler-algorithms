"use client";

import React from "react";
import { usePageReplacementStore } from "@/stores/page-replacement-store";
import InputForm from "./_components/input-form";
import ResultTable from "./_components/results-table";
import Statistics from "./_components/statistics";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const FifoPageReplacement: React.FC = () => {
  const {
    referenceString,
    frameSize,
    frames,
    hits,
    faults,
    hitFaultHistory,
    setReferenceString,
    setFrameSize,
    processReferenceString,
    algorithm,
    setAlgorithm,
  } = usePageReplacementStore();

  const handleRun = (inputString: string, inputFrameSize: number) => {
    setReferenceString(inputString);
    setFrameSize(inputFrameSize);
    processReferenceString();
  };

  const hasResults = !isNaN(referenceString[0]) && frames.length > 0;

  return (
    <div className="mx-auto p-8 space-y-8">
      <Select
        onValueChange={(value) => {
          setAlgorithm(value);
        }}
      >
        <SelectTrigger className="w-[200px]">
          <SelectValue placeholder="Select an algorithm" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Page ReplacementAlgorithms</SelectLabel>
            <SelectItem value="FIFO">FIFO</SelectItem>
            <SelectItem value="LRU">LRU</SelectItem>
            <SelectItem value="Optimal">Optimal Page Replacement</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
      <h1 className="text-3xl font-bold text-center">{algorithm} Page Replacement Algorithm</h1>

      {/* Input Form */}
      <InputForm
        onRun={handleRun}
        defaultFrameSize={frameSize}
      />

      {/* Conditionally render the result table if there's a reference string and processed result */}
      {hasResults && (
        <>
          <ResultTable
            referenceString={referenceString}
            frames={frames}
            hitFaultHistory={hitFaultHistory}
            frameSize={frameSize}
          />

          <Statistics hits={hits} faults={faults} referenceStringLength={referenceString.length} />
        </>
      )}

      {/* Show a message if no results are available */}
      {!hasResults && referenceString.length > 0 && (
        <div className="text-center text-lg text-gray-500">
          <p>No results to display yet. Please run the FIFO algorithm.</p>
        </div>
      )}

      {/* Show message if no page reference string was input */}
      {referenceString.length === 0 && (
        <div className="text-center text-lg text-gray-500">
          <p>Please enter a page reference string to begin.</p>
        </div>
      )}
    </div>
  );
};

export default FifoPageReplacement;
