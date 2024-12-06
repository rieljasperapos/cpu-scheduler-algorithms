"use client";

import React from "react";
import { usePageReplacementStore } from "@/stores/page-replacement-store";
import InputForm from "./_components/input-form";
import ResultTable from "./_components/results-table";
import Statistics from "./_components/statistics";

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
    algorithm
  } = usePageReplacementStore();

  const handleRun = (inputString: string, inputFrameSize: number) => {
    setReferenceString(inputString);
    setFrameSize(inputFrameSize);
    processReferenceString();
  };

  const hasResults = !isNaN(referenceString[0]) && frames.length > 0;

  console.log(frames)
  console.log(referenceString);
  console.log(frameSize);

  return (
    <div className="mx-auto p-8 space-y-8">
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
