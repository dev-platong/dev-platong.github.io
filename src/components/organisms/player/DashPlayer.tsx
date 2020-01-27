import React from "react"
import "dashjs"
import { IPlayerProps } from "./IPlayerProps";

export const DashPlayer = function dashPlayer({ src }: IPlayerProps) {
  return <video id="video" data-dashjs-player src={src} controls></video>;
};
