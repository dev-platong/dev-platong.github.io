export enum PlaylistType {
	DASH
}

type Playlist = {
	urlString: string;
};

export function selectPlaylist(playlistType: PlaylistType): Playlist {
	if (playlistType === PlaylistType.DASH) {
		return {
			urlString: 'https://storage.googleapis.com/shaka-demo-assets/angel-one/dash.mpd'
		};
	}
}
