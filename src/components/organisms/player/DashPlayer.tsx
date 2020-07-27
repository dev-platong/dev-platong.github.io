import React from 'react';
import 'dashjs';
import { IPlayerProps } from './IPlayerProps';

export const DashPlayer: React.FC<IPlayerProps> = function dashPlayer({ src }) {
  return <video id="video" data-dashjs-player src={src} controls></video>;
};
