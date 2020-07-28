import React from 'react';
import ReactDOM from 'react-dom';
import { Player } from './components/organisms/player/Player';

import './movies/tj01_puss_get_the_boot.mp4';

ReactDOM.render(
  // <Player src="tj01_puss_get_the_boot.mp4"></Player>,
  <Player src="https://dash.akamaized.net/envivio/EnvivioDash3/manifest.mpd"></Player>,
  document.getElementById('top-level__container')
);
