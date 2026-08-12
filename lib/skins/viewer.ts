"use client";

import {
  SkinViewer,
  WalkingAnimation,
  IdleAnimation,
} from "skinview3d";

export function createSkinViewer(
  canvas: HTMLCanvasElement,
  skinUrl: string,
) {
  const viewer = new SkinViewer({
    canvas,
    width: 400,
    height: 500,
    skin: skinUrl,
  });

  viewer.autoRotate = true;

  viewer.autoRotateSpeed = 0.5;

  viewer.animation =
    new IdleAnimation();

  return viewer;
}