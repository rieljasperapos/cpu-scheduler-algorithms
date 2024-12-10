"use client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useState } from "react";

const DiskForm = ({
  onRun,
  defaultCurrentPosition,
  // defaultTrackSize,
}: {
  onRun: (requests: string, currentPosition: number) => void;
  defaultCurrentPosition: number;
}) => {
  const [inputString, setInputString] = useState("");
  const [inputCurrentPosition, setInputCurrentPosition] = useState(defaultCurrentPosition);
  // const [inputTrackSize, setInputTrackSize] = useState(defaultTrackSize);

  const handleRun = () => {
    onRun(inputString, inputCurrentPosition);
  }

  return (
    <div className="flex flex-col gap-4">
      <div>
        <Label htmlFor="head-count">Current Position</Label>
        <Input
          id="head-count"
          type="number"
          value={inputCurrentPosition}
          onChange={(e) => setInputCurrentPosition(Number(e.target.value))}
          placeholder="Enter starting head position"
        />
      </div>
      {/* <div>
        <Label htmlFor="head-count">Track Size</Label>
        <Input
          id="track-size"
          type="number"
          value={inputTrackSize}
          onChange={(e) => setInputTrackSize(Number(e.target.value))}
          placeholder="Enter starting head position"
        />
      </div> */}
      <div>
        <Label htmlFor="requests">Order of Requests (comma-separated)</Label>
        <Input
          id="requests"
          type="text"
          value={inputString}
          onChange={(e) => setInputString(e.target.value)}
          placeholder="e.g., 46,56,276,48,236"
        />
      </div>
      {/* <div>
        <Label htmlFor="alpha">Alpha (starting position)</Label>
        <Input
          id="alpha"
          type="number"
          value={alpha}
          onChange={(e) => setAlpha(parseInt(e.target.value))}
          placeholder="Enter alpha value"
        />
      </div> */}
      <Button onClick={handleRun} className="mt-4">
        Submit
      </Button>
    </div>
  );
};

export default DiskForm;
