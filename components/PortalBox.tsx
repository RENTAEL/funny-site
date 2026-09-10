"use client";
import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
export default function PortalBox(props: { children: React.ReactNode }) {
  const [m, setM] = useState(false);
  useEffect(() => { setM(true); }, []);
  if (!m) return null;
  return createPortal(props.children, document.body);
}
