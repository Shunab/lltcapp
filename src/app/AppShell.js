"use client";

import BottomNav from "./BottomNav";

export default function AppShell({ children }) {
  return (
    <div className="flex h-dvh flex-col overflow-hidden bg-background text-text">
      {/* Scrollable content between top safe area and bottom nav */}
      <main className="flex-1 overflow-y-auto overflow-x-hidden pt-[env(safe-area-inset-top)] pb-[calc(5rem+env(safe-area-inset-bottom))]">
        <div className="mx-auto max-w-md min-w-0">{children}</div>
      </main>

      {/* Bottom navigation (fixed at bottom) */}
      <BottomNav />
    </div>
  );
}

