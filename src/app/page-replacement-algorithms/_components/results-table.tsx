import React from "react";

interface ResultTableProps {
  referenceString: number[];
  frames: (number | null)[][];
  hitFaultHistory: string[];
  frameSize: number;
}

const ResultTable: React.FC<ResultTableProps> = ({
  referenceString,
  frames,
  hitFaultHistory,
  frameSize,
}) => {
  return (
    <table className="w-full border-collapse mb-8">
      <thead>
        <tr className="bg-slate-200">
          <th className="py-2 px-4 border border-gray-300">Pages</th>
          {referenceString.map((page, index) => (
            <th key={index} className="py-2 px-4 border border-gray-300">
              {page}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {Array.from({ length: frameSize }).map((_, frameIndex) => (
          <tr key={frameIndex} className="text-center">
            <td className="py-2 px-4 border border-gray-300">F{frameIndex + 1}</td>
            {referenceString.map((_, step) => (
              <td
                key={step}
                className="py-2 px-4 border border-gray-300"
              >
                {frames[frameIndex]?.[step] !== undefined
                  ? frames[frameIndex][step]
                  : ""}
              </td>
            ))}
          </tr>
        ))}
        <tr>
          <td className="py-2 px-4 border border-gray-300">H/F</td>
          {hitFaultHistory.map((hf, index) => (
            <td
              key={index}
              className={`py-2 px-4 border border-gray-300 ${
                hf === "H" ? "bg-yellow-200" : "bg-pink-200"
              }`}
            >
              {hf}
            </td>
          ))}
        </tr>
      </tbody>
    </table>
  );
};

export default ResultTable;
