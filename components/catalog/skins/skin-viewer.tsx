"use client";

import {
  useEffect,
  useRef,
} from "react";

import {
  createSkinViewer,
} from "@/lib/skins/viewer";

interface SkinViewerProps {
  skinUrl: string;
}

export function SkinViewer({
  skinUrl,
}: SkinViewerProps) {
  const canvasRef =
    useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current) {
      return;
    }

    const viewer =
      createSkinViewer(
        canvasRef.current,
        skinUrl,
      );

    return () => {
      viewer.dispose();
    };
  }, [skinUrl]);

  return (
    <canvas
      ref={canvasRef}
      className="
        h-full
        w-full
        rounded-2xl
      "
    />
  );
}