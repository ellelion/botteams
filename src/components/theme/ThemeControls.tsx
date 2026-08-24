"use client";

import { AccentPicker } from "@/components/theme/AccentPicker";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { en } from "@/lib/messages/en";

export function ThemeControls() {
  return (
    <div className="theme-controls" role="group" aria-label={en.theme.appearance}>
      <AccentPicker />
      <ThemeToggle />
    </div>
  );
}
