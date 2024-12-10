"use client";

import { create } from "zustand";

// Types and Interfaces
interface HeadMovement {
  step: string;
  movement: number;
}

interface CalculationResult {
  totalHeadMovement: number;
  headMovements: HeadMovement[];
  totalSeekTime: number;
}

interface DiskState {
  requests: number[];
  trackSize: number;
  currentPosition: number;
  previousPosition: number;
  seekRate: number;
  totalHeadMovement: number;
  totalSeekTime: number;
  totalHeadMovementExpression: string; // For displaying detailed computation
  algorithm: "FCFS" | "C-SCAN" | "C-LOOK";
  alpha: number; // Starting position for algorithms
  headMovements: HeadMovement[]; // Data for graph/steps visualization
  setRequests: (input: string) => void;
  setCurrentPosition: (position: number) => void;
  setAlpha: (alpha: number) => void;
  setAlgorithm: (algorithm: "FCFS" | "C-SCAN" | "C-LOOK") => void;
  setTrackSize: (size: number) => void;
  calculate: () => void;
}

// Zustand Store
const useDiskStore = create<DiskState>((set, get) => ({
  // Initial state
  requests: [],
  trackSize: 200,
  currentPosition: 256,
  previousPosition: 68,
  seekRate: 5,
  totalHeadMovement: 0,
  totalSeekTime: 0,
  totalHeadMovementExpression: "",
  algorithm: "FCFS",
  alpha: 20,
  headMovements: [],

  // Setters
  setRequests: (input) => {
    const numbers = input.split(",").map((num) => parseInt(num, 10));
    set({ requests: numbers });
  },
  setCurrentPosition: (position) => set({ currentPosition: position }),
  setAlpha: (alpha) => set({ alpha }),
  setAlgorithm: (algorithm) => set({ algorithm }),
  setTrackSize: (size) => set({ trackSize: size }),

  // Calculate based on selected algorithm
  calculate: () => {
    const { algorithm, requests, currentPosition, trackSize, seekRate, alpha } = get();

    let result: CalculationResult;
    if (algorithm === "FCFS") {
      result = calculateFCFS(requests, currentPosition);
    } else if (algorithm === "C-SCAN") {
      result = calculateCScan(requests, currentPosition, trackSize, seekRate);
    } else if (algorithm === "C-LOOK") {
      result = calculateCLook(requests, currentPosition, seekRate);
    } else {
      console.error("Unsupported algorithm selected.");
      return;
    }

    set({
      totalHeadMovement: result.totalHeadMovement,
      totalSeekTime: result.totalSeekTime,
      totalHeadMovementExpression: result.headMovements
        .map((h) => `${h.step} (${h.movement})`)
        .join(" + "),
      headMovements: result.headMovements,
    });
  },
}));

// External Algorithm Functions
const calculateFCFS = (requests: number[], currentPosition: number): CalculationResult => {
  let totalHeadMovement = 0;
  const headMovements: HeadMovement[] = [];
  let prevPosition = currentPosition;

  requests.forEach((request) => {
    const movement = Math.abs(request - prevPosition);
    totalHeadMovement += movement;
    headMovements.push({ step: `${prevPosition} -> ${request}`, movement });
    prevPosition = request;
  });

  return {
    totalHeadMovement,
    headMovements,
    totalSeekTime: totalHeadMovement * 5, // Assuming seek rate is 5
  };
};

const calculateCScan = (
  requests: number[],
  currentPosition: number,
  trackSize: number,
  seekRate: number
): CalculationResult => {
  let totalHeadMovement = 0;
  const headMovements: HeadMovement[] = [];
  const sortedRequests = [...requests].sort((a, b) => a - b);
  const requestsAfterAlpha = sortedRequests.filter((r) => r >= currentPosition);
  const requestsBeforeAlpha = sortedRequests.filter((r) => r < currentPosition);

  // Process requests after current position
  if (requestsAfterAlpha.length) {
    let prevPosition = currentPosition;
    requestsAfterAlpha.forEach((request) => {
      const movement = Math.abs(request - prevPosition);
      totalHeadMovement += movement;
      headMovements.push({ step: `${prevPosition} -> ${request}`, movement });
      prevPosition = request;
    });

    // Jump to start (track 0)
    if (requestsBeforeAlpha.length) {
      const movementToTrackEnd = Math.abs(trackSize - 1 - requestsAfterAlpha.at(-1)!);
      const movementToTrackStart = Math.abs(trackSize - 1);
      totalHeadMovement += movementToTrackEnd + movementToTrackStart;

      headMovements.push(
        { step: `${requestsAfterAlpha.at(-1)} -> ${trackSize - 1}`, movement: movementToTrackEnd },
        { step: `${trackSize - 1} -> 0`, movement: movementToTrackStart }
      );

      // Process requests before alpha
      let prevPosition = 0;
      requestsBeforeAlpha.forEach((request) => {
        const movement = Math.abs(request - prevPosition);
        totalHeadMovement += movement;
        headMovements.push({ step: `${prevPosition} -> ${request}`, movement });
        prevPosition = request;
      });
    }
  }

  return {
    totalHeadMovement,
    headMovements,
    totalSeekTime: totalHeadMovement * seekRate,
  };
};

const calculateCLook = (
  requests: number[],
  currentPosition: number,
  seekRate: number
): CalculationResult => {
  let totalHeadMovement = 0;
  const headMovements: HeadMovement[] = [];
  const sortedRequests = [...requests].sort((a, b) => a - b);

  // Split requests into two groups: above and below the current position
  const requestsAfter = sortedRequests.filter((r) => r >= currentPosition);
  const requestsBefore = sortedRequests.filter((r) => r < currentPosition);

  let prevPosition = currentPosition;

  // Service requests greater than or equal to the current position
  requestsAfter.forEach((request) => {
    const movement = Math.abs(request - prevPosition);
    totalHeadMovement += movement;
    headMovements.push({ step: `${prevPosition} -> ${request}`, movement });
    prevPosition = request;
  });

  // Jump to the smallest request (count this jump as movement)
  if (requestsBefore.length) {
    const movementToSmallest = Math.abs(requestsAfter.at(-1)! - requestsBefore[0]);
    totalHeadMovement += movementToSmallest;
    headMovements.push({
      step: `${requestsAfter.at(-1)} -> ${requestsBefore[0]}`,
      movement: movementToSmallest,
    });

    // Service remaining requests
    prevPosition = requestsBefore[0];
    requestsBefore.slice(1).forEach((request) => {
      const movement = Math.abs(request - prevPosition);
      totalHeadMovement += movement;
      headMovements.push({ step: `${prevPosition} -> ${request}`, movement });
      prevPosition = request;
    });
  }

  return {
    totalHeadMovement,
    headMovements,
    totalSeekTime: totalHeadMovement * seekRate,
  };
};


export default useDiskStore;
