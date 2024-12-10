"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/card";
import useDiskStore from "@/stores/disk-scheduling-store";

const DiskStatistics = () => {
  const totalHeadMovement = useDiskStore((state) => state.totalHeadMovement);
  const totalSeekTime = useDiskStore((state) => state.totalSeekTime);
  const totalHeadMovementExpression = useDiskStore(
    (state) => state.totalHeadMovementExpression
  );
  const algorithm = useDiskStore((state) => state.algorithm);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Disk Scheduling Results</CardTitle>
        <CardDescription>Algorithm: {algorithm}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-4">
          <p>
            <strong>Total Head Movement:</strong> {totalHeadMovement}
          </p>
          <p>
            <strong>Total Seek Time:</strong> {totalSeekTime} ms
          </p>
          <p>
            <strong>Head Movement Details:</strong>{" "}
            <code>{totalHeadMovementExpression}</code>
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default DiskStatistics;
