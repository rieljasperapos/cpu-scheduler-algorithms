"use client";
import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/dropdown-menu";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/sheet";
import { Menu, Cpu, Layers } from "lucide-react";
import Link from "next/link";

const SelectAlgorithm = () => {
  const { setTheme } = useTheme();

  return (
    <div className="flex gap-8 items-center justify-between">
      <div className="flex items-center gap-4">
      <Sheet>
        <SheetTrigger asChild>
          <Menu className="hover:text-blue-300 cursor-pointer" />
        </SheetTrigger>
        <SheetContent side="left">
          <SheetHeader className="mb-4">
            <SheetTitle>Select an Algorithm</SheetTitle>
            <SheetDescription>
              Select the algorithm you would like to use.
            </SheetDescription>
          </SheetHeader>
          <hr></hr>
          <div className="mt-4 flex flex-col gap-4">
            <SheetClose asChild>
              <Link
                href="/cpu-scheduling"
                className="hover:text-orange-500 flex items-center gap-2"
              >
                <Cpu className="h-4" />
                CPU Scheduling
              </Link>
            </SheetClose>
            <SheetClose asChild>
              <Link
                href="/page-replacement-algorithms"
                className="hover:text-orange-500 flex items-center gap-2"
              >
                <Layers className="h-4" />
                Page Replacement
              </Link>
            </SheetClose>
            <SheetClose asChild>
              <Link
                href="/disk-scheduling"
                className="hover:text-orange-500 flex items-center gap-2"
              >
                <Layers className="h-4" />
                Disk Scheduling
              </Link>
            </SheetClose>
          </div>
        </SheetContent>
      </Sheet>
      <Link href="/">
        <h1 className="text-lg font-medium hover:text-blue-300">Operating Systems</h1>
      </Link>
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="icon">
            <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => setTheme("light")}>
            Light
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setTheme("dark")}>
            Dark
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setTheme("system")}>
            System
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default SelectAlgorithm;
