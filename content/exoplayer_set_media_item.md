Title: ExoPlayerのsetMediaItemを読んだ時
Date: 2023-2-28
LastModified: 2023-3-7
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

## private ExoPlayerImplInternal.handleMediaSourceListInfoRefreshed(Timeline timeline, boolean isSourceRefresh)

[ExoPlayerImplInternal.java#L1793](https://github.com/google/ExoPlayer/blob/r2.16.1/library/core/src/main/java/com/google/android/exoplayer2/ExoPlayerImplInternal.java#L1793)

### `resolvePositionForPlaylistChange(Timeline timeline, PlaybackInfo playbackInfo, @Nullable SeekPosition pendingInitialSeekPosition, MediaPeriodQueue queue, @RepeatMode int repeatMode, boolean shuffleModeEnabled, Timeline.Window window, Timeline.Period period)` 

[ExoPlayerImplInternal.java#L2508](https://github.com/google/ExoPlayer/blob/r2.16.1/library/core/src/main/java/com/google/android/exoplayer2/ExoPlayerImplInternal.java#L2508)

#### SeekPosition

データクラスです（`private static final class` ）。  
 `Timeline`・`int windowIndex`・`long windowPositionUs` を持ちます。これにより **シークにはPeriodという概念が関係ない（windowとwindow内の位置が決まればいい）** ということがわかります。

[ExoPlayerImplInternal.java#L2922](https://github.com/google/ExoPlayer/blob/029a2b27cbdc27cf9d51d4a73ebeb503968849f6/library/core/src/main/java/com/google/android/exoplayer2/ExoPlayerImplInternal.java#L2922)

特徴的なのは、まず `Timeline` に関して。 位置の特定が必要な場合には、 `Timeline` ・ `Timeline.Window`・ `Timeline・Period` が渡されます。  
そして `Timeline` は empty の場合があることにも注意しなければなりません。SEE：[ExoPlayerImplInternal.java#L2517](https://github.com/google/ExoPlayer/blob/r2.16.1/library/core/src/main/java/com/google/android/exoplayer2/ExoPlayerImplInternal.java#L2517)

次に、 MediaPeriodIdとPeriodUidの扱いです。MediaPeriodIdは `old` なのに対し、 `PeriodUid` に関しては `new` として扱っています。

[ExoPlayerImplInternal.java#L2526-L2527](https://github.com/google/ExoPlayer/blob/r2.16.1/library/core/src/main/java/com/google/android/exoplayer2/ExoPlayerImplInternal.java#L2526-L2527)

次の `Timeline.Period` がプレースホルダーである場合についての言及です。

[ExoPlayerImplInternal.java#L2528](https://github.com/google/ExoPlayer/blob/r2.16.1/library/core/src/main/java/com/google/android/exoplayer2/ExoPlayerImplInternal.java#L2528)

`isUsingPlaceholderPeriod()` は `Timeline.Period.isPlaceholder` を使って確認します（この時 Timeline.isEmptyに関する検査はアーリーリターンをしているため不要です）。

[ExoPlayerImplInternal.java#L2682-L2687](https://github.com/google/ExoPlayer/blob/r2.16.1/library/core/src/main/java/com/google/android/exoplayer2/ExoPlayerImplInternal.java#L2682-L2687)

そして、 `oldContentPosition` を ad かどうかとプレースホルダーかどうかに留意しながら決定します。 `newContentPosition` は一時的に `oldContentPosition` と一致させます（のちに変更するわけです）。

[ExoPlayerImplInternal.java#L2529-L2533](https://github.com/google/ExoPlayer/blob/r2.16.1/library/core/src/main/java/com/google/android/exoplayer2/ExoPlayerImplInternal.java#L2529-L2533)

その後に、シークを考慮しながら以下の値を決定していきます。

```
int startAtDefaultPositionWindowIndex = C.INDEX_UNSET;
boolean forceBufferingState = false;
boolean endPlayback = false;
boolean setTargetLiveOffset = false;
```
[ExoPlayerImplInternal.java#L2534-L2537](https://github.com/google/ExoPlayer/blob/029a2b27cbdc27cf9d51d4a73ebeb503968849f6/library/core/src/main/java/com/google/android/exoplayer2/ExoPlayerImplInternal.java#L2534-L2537)

##### 一度目のペンディングされたシークかどうか

[ExoPlayerImplInternal.java#L2538](https://github.com/google/ExoPlayer/blob/029a2b27cbdc27cf9d51d4a73ebeb503968849f6/library/core/src/main/java/com/google/android/exoplayer2/ExoPlayerImplInternal.java#L2538)

###### resolveSeekPosition

[ExoPlayerImplInternal.java#L2796](https://github.com/google/ExoPlayer/blob/029a2b27cbdc27cf9d51d4a73ebeb503968849f6/library/core/src/main/java/com/google/android/exoplayer2/ExoPlayerImplInternal.java#L2796)

引数として、位置の特定に必要な `Timeline`・`Timeline.Window`・`Timeline.Period`と `SeekPosition`、後はパラメータ類です。（`boolean trySubsequentPeriods, @RepeatMode int repeatMode, boolean shuffleModeEnabled`）

中身は複雑なので深く触れませんが、 `Timeline.getPeriodPosition(window, period, seekPosition.windowIndex, seekPosition.windowPositionUs);` を読んでその値を返します。

`resolveSeekPosition()`が呼ばれ、結果がnullなら `endPlayback = true, startAtDefaultPositionWindowIndex = timeline.getFirstWindowIndex(shuffleModeEnabled);` となります。これはどうやらinitial seekに失敗した場合のようです。  

**かなり曖昧なので、明日も続きを書いていきます。**

### PositionUpdateForPlaylistChange

名前の通りのデータクラスです。  
`private final static class` なので、完全に `ExoPlayerImplInternal` のみで利用されます （ExoPlayerImplInternalの1つの特徴でこのクラスより下の階層のクラスがないためだと考えます）。

[ExoPlayerImplInternal.java#L2935](https://github.com/google/ExoPlayer/blob/r2.16.1/library/core/src/main/java/com/google/android/exoplayer2/ExoPlayerImplInternal.java#L2935)

## まとめ

やはりExoPlayerImplInternalのあるメソッドまで落ちてくる。 `resolveSeekPosition()` の続きからは https://github.com/dev-platong/dev-platong.github.io/issues/19。