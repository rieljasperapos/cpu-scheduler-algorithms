import React from "react";

interface StatisticsProps {
  hits: number;
  faults: number;
  referenceStringLength: number;
}

const Statistics: React.FC<StatisticsProps> = ({
  hits,
  faults,
  referenceStringLength,
}) => {
  const hitRatio = ((hits / referenceStringLength) * 100).toFixed(2);
  const faultRatio = ((faults / referenceStringLength) * 100).toFixed(2);

  return (
    <div>
      <p className="font-semibold mb-2">Page Hits: {hits}</p>
      <p className="font-semibold mb-2">Page Faults: {faults}</p>
      <p className="font-semibold mb-2">Hit Ratio: {hitRatio}%</p>
      <p className="font-semibold mb-2">Fault Ratio: {faultRatio}%</p>
    </div>
  );
};

export default Statistics;
