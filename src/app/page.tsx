"use client";

import SparklesText from "@/components/sparkles-text";
import PulsatingButton from "@/components/pulsating-button";
import { MonitorCog } from "lucide-react";
import Meteors from "@/components/meteors";

export default function Home() {
  return (
    <div className="flex flex-col gap-8 items-center justify-center flex-1 bg-dark-gray">
      <Meteors number={30} />
      <div className="flex items-center gap-5">
        <MonitorCog className="h-36 w-36 text-steel-blue" />
        <SparklesText
          text="OS Scheduler Algorithms"
          colors={{ first: "#1C1C1E", second: "#4682B4" }}
        />
      </div>
      <div className="flex gap-4">
        <PulsatingButton
          text="CPU Scheduling"
          pulseColor="30, 144, 255" 
          backgroundColor="#1C1C1E" 
          textColor="#D9D9D9" 
          animationDuration="1.5s"
          buttonWidth="200px"
          buttonHeight="50px"
        />
        <PulsatingButton
          text="Page Replacement"
          pulseColor="105, 105, 105" 
          backgroundColor="#2F4F4F" 
          textColor="#D9D9D9" 
          animationDuration="1.5s"
          buttonWidth="200px"
          buttonHeight="50px"
        />
        <PulsatingButton
          text="Disk Scheduling"
          pulseColor="34, 139, 34" 
          backgroundColor="#2E2E2E" 
          textColor="#D9D9D9" 
          animationDuration="1.5s"
          buttonWidth="200px"
          buttonHeight="50px"
        />
      </div>
    </div>
  );
}
