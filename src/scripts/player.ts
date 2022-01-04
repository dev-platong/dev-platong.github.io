import shaka from 'shaka-player';
import { browser } from '$app/env';

export default function setup(): void {
	if (!browser) return;

	shaka.polyfill.installAll();

	if (!shaka.Player.isBrowserSupported()) {
		alert('Sorry, this browser currelntly does not be supported.');
		return;
	}

	const videoElement = document.getElementById('shaka_player');
	if (videoElement === null) {
		throw Error('Fatal: HTMLVideoElement is Missing. Maybe you missed to specify id.');
	}
	if (!isHTMLVideoElement(videoElement)) {
		return;
	}
	const player = new shaka.Player(videoElement);
	player.addEventListener('error', onErrorEvent);
	loadThenPlay(player);
}

async function loadThenPlay(player: shaka.Player) {
	const manifestUrlString = 'https://storage.googleapis.com/shaka-demo-assets/angel-one/dash.mpd';
	try {
		await player.load(manifestUrlString);
	} catch (e) {
		onError(e);
	}
}

function onError(error: Error & { code: string }) {
	// Log the error.
	console.error('Error code', error.code, 'object', error);
}

function onErrorEvent(event) {
	// Extract the shaka.util.Error object from the event.
	onError(event.detail);
}

// TODO Split and refine

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function isHTMLVideoElement(d: any): d is HTMLVideoElement {
	if (!d) return false;
	return typeof d.src === 'string';
}
