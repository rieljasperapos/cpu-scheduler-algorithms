import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function ny(...inputs: ClassValue[]) {
   return twMerge(clsx(inputs))
}

export function slugify(text: string) {
  if (text === "First Come First Serve") {
    return ""
  } else {
    return text.toString().toLowerCase().replace(/\s+/g, '-');
  }
}
