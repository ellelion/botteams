"use client";

import { AccentPicker } from "@/components/theme/AccentPicker";
import { ThemeToggle } from "@/components/theme/ThemeToggle";

export function ThemeControls() {
  return (
    <div className="theme-controls" role="group" aria-label="Appearance controls">
      <AccentPicker />
      <ThemeToggle />
    </div>
  );
}
