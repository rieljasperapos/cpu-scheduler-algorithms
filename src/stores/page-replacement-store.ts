import { create } from "zustand";

interface PageReplacementState {
  referenceString: number[];
  frameSize: number;
  frames: (number | null)[][];
  hits: number;
  faults: number;
  hitFaultHistory: string[];
  errorMessage: string | null;
  algorithm: string;
  setReferenceString: (input: string) => void;
  setFrameSize: (size: number) => void;
  setAlgorithm: (algorithm: string) => void;
  processReferenceString: () => void;
}

export const usePageReplacementStore = create<PageReplacementState>((set, get) => ({
  referenceString: [],
  frameSize: 3,
  frames: [],
  hits: 0,
  faults: 0,
  hitFaultHistory: [],
  errorMessage: null,
  algorithm: "FIFO", // Default algorithm is FIFO
  setReferenceString: (input) => {
    const numbers = input.split(",").map((num) => parseInt(num, 10));
    set({ referenceString: numbers, errorMessage: null });
  },
  setFrameSize: (size) => {
    set({ frameSize: size, frames: Array(size).fill([]) });
  },
  setAlgorithm: (algorithm) => {
    set({ algorithm });
  },
  processReferenceString: () => {
    const { referenceString, frameSize, algorithm } = get();

    if (referenceString.length === 0) {
      set({
        errorMessage: "No reference string to process. Please provide a valid page reference string.",
      });
      return; // Exit early if no reference string
    }

    const frames: (number | null)[][] = Array.from({ length: frameSize }, () =>
      Array(referenceString.length).fill(null)
    );
    let hits = 0;
    let faults = 0;
    const hitFaultHistory: string[] = [];

    if (algorithm === "FIFO") {
      processFifo(referenceString, frames, hitFaultHistory, set, hits, faults);
    } else if (algorithm === "LRU") {
      processLru(referenceString, frames, hitFaultHistory, set, hits, faults);
    } else if (algorithm === "Optimal") {
      processOptimal(referenceString, frames, hitFaultHistory, set, hits, faults);
    }
  },
}));

const processFifo = (
  referenceString: number[],
  frames: (number | null)[][],
  hitFaultHistory: string[],
  set: any,
  hits: number,
  faults: number
) => {
  const fifoQueue: number[] = []; // FIFO index tracking
  referenceString.forEach((page, step) => {
    const currentFrames = frames.map((frame) => frame[step - 1] ?? null);
    if (currentFrames.includes(page)) {
      hits++;
      hitFaultHistory.push("H");
    } else {
      faults++;
      hitFaultHistory.push("F");
      if (fifoQueue.length < frames.length) {
        const emptyIndex = currentFrames.indexOf(null);
        currentFrames[emptyIndex] = page;
        fifoQueue.push(emptyIndex);
      } else {
        const replaceIndex = fifoQueue.shift()!;
        currentFrames[replaceIndex] = page;
        fifoQueue.push(replaceIndex);
      }
    }

    frames.forEach((frame, index) => {
      frame[step] = currentFrames[index] ?? null;
    });
  });
  set({ frames, hits, faults, hitFaultHistory, errorMessage: null });
};

const processLru = (
  referenceString: number[],
  frames: (number | null)[][],
  hitFaultHistory: string[],
  set: any,
  hits: number,
  faults: number
) => {
  const accessOrder: number[] = []; // To track the order of access for LRU
  referenceString.forEach((page, step) => {
    const currentFrames = frames.map((frame) => frame[step - 1] ?? null);

    if (currentFrames.includes(page)) {
      hits++;
      hitFaultHistory.push("H");
      // Move the accessed page to the front of the access history (recently used)
      const index = accessOrder.indexOf(page);
      if (index > -1) {
        accessOrder.splice(index, 1); // Remove the page
      }
      accessOrder.unshift(page); // Add the page at the front
    } else {
      faults++;
      hitFaultHistory.push("F");
      if (accessOrder.length < frames.length) {
        currentFrames[accessOrder.length] = page;
        accessOrder.unshift(page); // Add the new page as most recently used
      } else {
        const lruPage = accessOrder.pop()!;
        const replaceIndex = currentFrames.indexOf(lruPage);
        currentFrames[replaceIndex] = page;
        accessOrder.unshift(page); // Add the new page as most recently used
      }
    }

    frames.forEach((frame, index) => {
      frame[step] = currentFrames[index] ?? null;
    });
  });

  set({ frames, hits, faults, hitFaultHistory, errorMessage: null });
};

// Process Optimal Page Replacement
const processOptimal = (
  referenceString: number[],
  frames: (number | null)[][],
  hitFaultHistory: string[],
  set: any,
  hits: number,
  faults: number
) => {
  const frameSize = frames.length;
  let futureUses: number[];

  referenceString.forEach((page, step) => {
    // Current state of frames, with previous pages placed in them
    const currentFrames = frames.map((frame) => frame[step - 1] ?? null);

    // Check if the page is already in the frames (hit)
    if (currentFrames.includes(page)) {
      hits++;
      hitFaultHistory.push("H");
    } else {
      // It's a page fault, so we need to load the page into one of the frames
      faults++;
      hitFaultHistory.push("F");

      // Find an empty frame or replace a page based on the Optimal algorithm
      if (currentFrames.includes(null)) {
        // If there is an empty frame, place the page in the first available slot
        const emptyIndex = currentFrames.indexOf(null);
        currentFrames[emptyIndex] = page;
      } else {
        // If all frames are filled, find the page that will not be used for the longest period
        futureUses = currentFrames.map((frame) => {
          const futureIndex = referenceString.slice(step + 1).indexOf(frame!);
          return futureIndex === -1 ? Number.MAX_SAFE_INTEGER : futureIndex;
        });

        // Find the index of the page that will not be used for the longest time in the future
        const indexToReplace = futureUses.indexOf(Math.max(...futureUses));
        currentFrames[indexToReplace] = page;
      }
    }

    // Update frames with the current state after this page reference
    frames.forEach((frame, index) => {
      frame[step] = currentFrames[index] ?? null;
    });
  });

  set({ frames, hits, faults, hitFaultHistory, errorMessage: null });
};


