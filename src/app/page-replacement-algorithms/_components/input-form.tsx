import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface InputFormProps {
  onRun: (referenceString: string, frameSize: number) => void;
  defaultFrameSize: number;
}

const InputForm: React.FC<InputFormProps> = ({ onRun, defaultFrameSize }) => {
  const [inputString, setInputString] = useState("");
  const [inputFrameSize, setInputFrameSize] = useState(defaultFrameSize);

  const handleRun = () => {
    onRun(inputString, inputFrameSize);
  };

  return (
    <div className="flex flex-col gap-4">
      <Label>
        Page Reference String (comma-separated):
      </Label>
      <Input
        type="text"
        value={inputString}
        onChange={(e) => setInputString(e.target.value)}
      />
      <Label>
        Frame Size:
      </Label>
      <Input
        type="number"
        value={inputFrameSize}
        onChange={(e) => setInputFrameSize(Number(e.target.value))}
      />
      <Button onClick={handleRun}>
        Run FIFO
      </Button>
    </div>
  );
};

export default InputForm;
