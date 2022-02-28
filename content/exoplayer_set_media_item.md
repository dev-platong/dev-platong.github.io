Title: ExoPlayerのsetMediaItemを読んだ時
Date: 2023-2-28
LastModified: 2023-2-28
Category: Android, ExoPlayer
Authors: dev-platong

## ExoPlayer.setMediaItemを呼びます。

`ExoPlayerImpl.setMediaSourcesInternal()` が呼ばれます。

[exoplayer2/ExoPlayerImpl.java#L1529](https://github.com/google/ExoPlayer/blob/r2.16.1/library/core/src/main/java/com/google/android/exoplayer2/ExoPlayerImpl.java#L1529)

仰々しいですが、やっていることは `internalPlayer.setMediaSources()` を呼び、 `updatePlaybackInfo()` を呼びます。

## ExoPlayerImplInternal.setMediaSources()

`MSG_SET_MEDIA_SOURCES` を Targetに送ります。そして自身の `setMediaItemsInternal()` を呼びます。

[ExoPlayerImplInternal.java#L522-L523](https://github.com/google/ExoPlayer/blob/r2.16.1/library/core/src/main/java/com/google/android/exoplayer2/ExoPlayerImplInternal.java#L522-L523)

[ExoPlayerImplInternal.java#L692](https://github.com/google/ExoPlayer/blob/029a2b27cbdc27cf9d51d4a73ebeb503968849f6/library/core/src/main/java/com/google/android/exoplayer2/ExoPlayerImplInternal.java#L692)

最終的に`handleMediaSourceListInfoRefreshed()`が呼ばれます。このメソッドは長すぎるので明日。

[ExoPlayerImplInternal.java#L1793](https://github.com/google/ExoPlayer/blob/029a2b27cbdc27cf9d51d4a73ebeb503968849f6/library/core/src/main/java/com/google/android/exoplayer2/ExoPlayerImplInternal.java#L1793)

## まとめ

やはりExoPlayerImplInternalのあるメソッドまで落ちてくる。明日は `handleMediaSourceListInfoRefreshed()` を詳解します。