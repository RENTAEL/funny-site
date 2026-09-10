"use client";
import React from "react";
import PortalBox from "./PortalBox";
export default function Modal({ children, comic }: { children: React.ReactNode; comic: string }) {
  return (
    <PortalBox>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
        <div className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto">
          <div className={comic}>{children}</div>
        </div>
      </div>
    </PortalBox>
  );
}
