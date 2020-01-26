import React from 'react';
import { isVideoElement } from '../../../isVideoElement';

interface Props {
  src: string;
}

export const Player = React.memo(function oPlayer(props: Props) {
  React.useEffect(() => {
    console.log('Hi');
    setInterval(() => {
      console.log('Hi Bonny');
      const video = document.getElementById('video');
      if (!video) {
        throw Error('この瞬間はnull');
      }
      if (isVideoElement(video)) {
        console.log(video.seekable.start(0), video.seekable.end(0));
        console.log(video.buffered.start(0), video.buffered.end(0));
        console.log(video.played.start(0), video.played.end(0));
        console.log(video.currentTime);
      } else {
        throw Error('Tag is not a kind of video.');
      }
    }, 1000);
  });
  return <video id="video" src={props.src} controls></video>;
});
