import * as React from 'react';

interface Props {
  src: string;
}

export const Player = React.memo(function oPlayer(props: Props) {
  return <video src={props.src} controls></video>;
});
