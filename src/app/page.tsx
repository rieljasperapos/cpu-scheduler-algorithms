"use client";

import SparklesText from "@/components/sparkles-text";
import { MonitorCog } from "lucide-react";
import Meteors from "@/components/meteors";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="flex flex-col gap-8 items-center justify-center flex-1 bg-dark-gray">
      <Meteors number={30} />
      <div className="flex items-center gap-5">
        <MonitorCog className="h-36 w-36 text-steel-blue" />
        <SparklesText
          text="OS Scheduling Algorithms"
          colors={{ first: "#1C1C1E", second: "#4682B4" }}
        />
      </div>
      <div className="flex gap-4">
        <Link href="/cpu-scheduling">
          <Button className="bg-[#1C1C1E] text-[#D9D9D9] hover:bg-[#4682B4]" size="lg">
            CPU Scheduling
          </Button>
        </Link>
        <Link href="/page-replacement-algorithms">
          <Button className="bg-[#2F4F4F] text-[#D9D9D9] hover:bg-[#4682B4]" size="lg">
            Page Replacement
          </Button>
        </Link>
        <Link href="/disk-scheduling">
          <Button className="bg-[#2E2E2E] text-[#D9D9D9] hover:bg-[#4682B4]"size="lg">
            Disk Scheduling
          </Button>
        </Link>
      </div>
    </div>
  );
}
