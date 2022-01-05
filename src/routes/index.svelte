<script lang="ts">
	import setup from '../scripts/player';
    import {PlaylistType, selectPlaylist} from "../scripts/playlist"
    const playlist = selectPlaylist(PlaylistType.DASH)
	setup(playlist.urlString);
</script>

<svelte:head>
	<title>dev-platong.github.io</title>
</svelte:head>

<video id="shaka_player" controls />
<p>{playlist.urlString}</p>