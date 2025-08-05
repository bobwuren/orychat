"use client";

import React from "react";

export default function Footer() {
  return (
    <footer className="w-full mt-12 border-t border-border/10 py-6 text-center text-xs text-muted-foreground/80">
      <div className="max-w-5xl mx-auto px-4">
        <p>&copy; {new Date().getFullYear()} ACAN | Développé avec soin</p>
      </div>
    </footer>
  );
}