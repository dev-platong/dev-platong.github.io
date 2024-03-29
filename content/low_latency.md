Title: ExoPlayerにおける低遅延再生の再生位置調整
Date: 2022-5-15
LastModified: 2022-5-17
Category: ExoPlayer
Authors: dev-platong

# Overview

ExoPlayerにおける低遅延サポートについて、再生位置調整機能だけが低遅延に特有であると仮定してその詳細をまとめます。
`DefaultLivePlaybackSpeedControl` が最も関係する実クラスで、バッファの状態を考慮し、過去の計算結果を考慮する緩やかな変化を再生速度とライブオフセットに加える設計になっています。

# 前提

## 使用バージョン

r2.17.1

## 前提知識

- [MediaItem.LiveConfiguration](https://exoplayer.dev/doc/reference/com/google/android/exoplayer2/MediaItem.LiveConfiguration.html)に設定できるパラメータ

    オフセットと再生速度でMin/Maxを設定できます。オフセットのみターゲットオフセットも設定します。

- [exoplayer.devのLiveStreamingのdocs](https://github.com/google/ExoPlayer/blob/r2.17.1/docs/live-streaming.md)

    Playerを構成する際にビルダーに共通のライブ再生に関する位置調整のパラメータを設定するか、MediaItem毎に設定するかという2つの手段があります。

- [LiveOffsetとは何か]({filename}./liveoffset.md)

# 再生位置調整機能

ExoPlayerではインターフェースがまず提供されていて、そのデフォルト実装があるというコードベース全体の慣習があります。

再生位置調整機能に該当するのは、 `LivePlaybackSpeedControl` インターフェースと `DefaultLivePlaybackSpeedControl` クラスになります。

再生位置調整機能は、低遅延ストリームで通常で有効です。低遅延ではないライブストリームでは明治的に再生速度のMAX/MINを指定することで有効になります。 SEE: [r2.17.0 release note](https://github.com/google/ExoPlayer/releases/tag/r2.17.0#:~:text=Disable%20automatic%20speed%20adjustment%20for%20live%20streams%20that%20neither%20have%20low%2Dlatency%20features%20nor%20a%20user%20request%20setting%20the%20speed)

注意： r2.13.0~2.16.1 では低遅延ではないライブストリームでも再生位置調整機能がデフォルトで有効でした。 SEE：https://github.com/google/ExoPlayer/issues/9329

## 有効化

### 低遅延の場合

メディアプレイリストに `#EXT-X-SERVER-CONTROL` タグがあり、`PART-HOLD-BACK` または `HOLD-BACK` が設定されていることを確認してください。  

```java
boolean disableSpeedAdjustment =
  mediaItem.liveConfiguration.minPlaybackSpeed == C.RATE_UNSET
    && mediaItem.liveConfiguration.maxPlaybackSpeed == C.RATE_UNSET
    && playlist.serverControl.holdBackUs == C.TIME_UNSET
    && playlist.serverControl.partHoldBackUs == C.TIME_UNSET;
```

[HlsMediaSource.java#L569-L573](https://github.com/google/ExoPlayer/blob/r2.17.1//library/hls/src/main/java/com/google/android/exoplayer2/source/hls/HlsMediaSource.java#L569-L573)

また、 `#EXT-X-PROGRAM-DATE-TIME` が設定されていることも確認してください。

```java
    return window.isLive() && window.isDynamic && window.windowStartTimeMs != C.TIME_UNSET;
```

[ExoPlayerImplInternal.java#L1125](https://github.com/google/ExoPlayer/blob/r2.17.1/library/core/src/main/java/com/google/android/exoplayer2/ExoPlayerImplInternal.java#L1125)

例：Apple LL-hls stream

```
#EXTM3U
# Following the example above, this Playlist is a response to: GET https://example.com/2M/waitForMSN.php?_HLS_msn=273&_HLS_part=3 &_HLS_skip=YES
#EXT-X-TARGETDURATION:4
#EXT-X-VERSION:9
#EXT-X-SERVER-CONTROL:CAN-BLOCK-RELOAD=YES,PART-HOLD-BACK=1.0,CAN-SKIP-UNTIL=12.0
#EXT-X-PART-INF:PART-TARGET=0.33334
#EXT-X-MEDIA-SEQUENCE:266
#EXT-X-SKIP:SKIPPED-SEGMENTS=3
#EXTINF:4.00008,
fileSequence269.mp4
#EXTINF:4.00008,
fileSequence270.mp4
#EXT-X-PART:DURATION=0.33334,URI="filePart271.0.mp4"
#EXT-X-PART:DURATION=0.33334,URI="filePart271.1.mp4"
#EXT-X-PART:DURATION=0.33334,URI="filePart271.2.mp4"
#EXT-X-PART:DURATION=0.33334,URI="filePart271.3.mp4"
#EXT-X-PART:DURATION=0.33334,URI="filePart271.4.mp4",INDEPENDENT=YES
#EXT-X-PART:DURATION=0.33334,URI="filePart271.5.mp4"
#EXT-X-PART:DURATION=0.33334,URI="filePart271.6.mp4"
#EXT-X-PART:DURATION=0.33334,URI="filePart271.7.mp4"
#EXT-X-PART:DURATION=0.33334,URI="filePart271.8.mp4",INDEPENDENT=YES
#EXT-X-PART:DURATION=0.33334,URI="filePart271.9.mp4"
#EXT-X-PART:DURATION=0.33334,URI="filePart271.10.mp4"
#EXT-X-PART:DURATION=0.33334,URI="filePart271.11.mp4"
#EXTINF:4.00008,
fileSequence271.mp4
#EXT-X-PROGRAM-DATE-TIME:2019-02-14T02:14:00.106Z
#EXT-X-PART:DURATION=0.33334,URI="filePart272.a.mp4"
#EXT-X-PART:DURATION=0.33334,URI="filePart272.b.mp4"
#EXT-X-PART:DURATION=0.33334,URI="filePart272.c.mp4"
#EXT-X-PART:DURATION=0.33334,URI="filePart272.d.mp4"
#EXT-X-PART:DURATION=0.33334,URI="filePart272.e.mp4"
#EXT-X-PART:DURATION=0.33334,URI="filePart272.f.mp4",INDEPENDENT=YES
#EXT-X-PART:DURATION=0.33334,URI="filePart272.g.mp4"
#EXT-X-PART:DURATION=0.33334,URI="filePart272.h.mp4"
#EXT-X-PART:DURATION=0.33334,URI="filePart272.i.mp4"
#EXT-X-PART:DURATION=0.33334,URI="filePart272.j.mp4"
#EXT-X-PART:DURATION=0.33334,URI="filePart272.k.mp4"
#EXT-X-PART:DURATION=0.33334,URI="filePart272.l.mp4"
#EXTINF:4.00008,
fileSequence272.mp4
#EXT-X-PART:DURATION=0.33334,URI="filePart273.0.mp4",INDEPENDENT=YES
#EXT-X-PART:DURATION=0.33334,URI="filePart273.1.mp4"
#EXT-X-PART:DURATION=0.33334,URI="filePart273.2.mp4"
#EXT-X-PART:DURATION=0.33334,URI="filePart273.3.mp4"
#EXT-X-PRELOAD-HINT:TYPE=PART,URI="filePart273.4.mp4"

#EXT-X-RENDITION-REPORT:URI="../1M/waitForMSN.php",LAST-MSN=273,LAST-PART=3
#EXT-X-RENDITION-REPORT:URI="../4M/waitForMSN.php",LAST-MSN=273,LAST-PART=3
```

[2022年5月17日18:52 enabling_low-latency_http_live_streaming_hls](https://developer.apple.com/documentation/http_live_streaming/enabling_low-latency_http_live_streaming_hls)

### 低遅延ではない場合

1. MediaItemに `maxSpeed` と `minSpeed` を設定してください

        MediaItem mediaItem =
          new MediaItem.Builder()
            .setUri(mediaUri)
            .setLiveConfiguration(
          new MediaItem.LiveConfiguration.Builder()
            .setMaxPlaybackSpeed(1.02f)
            .build())
            .build();
          player.setMediaItem(mediaItem);

[live-streaming.md#L106-L114](https://github.com/google/ExoPlayer/blame/r2.17.1/docs/live-streaming.md#L106-L114)

2. MediaPlaylistに `#EXT-X-PROGRAM-DATE` タグが存在することを確認してください

       private boolean shouldUseLivePlaybackSpeedControl(
         Timeline timeline, MediaPeriodId mediaPeriodId) {
         if (mediaPeriodId.isAd() || timeline.isEmpty()) {
           return false;
         }
         int windowIndex = timeline.getPeriodByUid(mediaPeriodId.periodUid, period).windowIndex;
         timeline.getWindow(windowIndex, window);
         return window.isLive() && window.isDynamic && window.windowStartTimeMs != C.TIME_UNSET;
       }

[ExoPlayerImplInternal.java#L1118-L1126](https://github.com/google/ExoPlayer/blob/r2.17.1/library/core/src/main/java/com/google/android/exoplayer2/ExoPlayerImplInternal.java#L1118-L1126)

## LivePlaybackSpeedControl インターフェース

5つのメソッドがあります。

### void setLiveConfiguration(LiveConfiguration liveConfiguration)

`MediaItem` から渡ってくる `LiveConfiguration` のセッター。

```java
  /**
   * Sets the live configuration defined by the media.
   *
   * @param liveConfiguration The {@link LiveConfiguration} as defined by the media.
   */
  void setLiveConfiguration(LiveConfiguration liveConfiguration);
```

[LivePlaybackSpeedControl.java#L26-L31](https://github.com/google/ExoPlayer/blob/r2.17.1/library/core/src/main/java/com/google/android/exoplayer2/LivePlaybackSpeedControl.java#L26-L31)

### void setTargetLiveOffsetOverrideUs(long liveOffsetUs)

`LiveConfiguration` 経由で targetLiveOffset が設定されている場合に targetLiveOffsetをオーバーライドするメソッドです。

```java
/**
   * Sets the target live offset in microseconds that overrides the live offset {@link
   * #setLiveConfiguration configured} by the media. Passing {@code C.TIME_UNSET} deletes a previous
   * override.
   *
   * <p>If no target live offset is configured by {@link #setLiveConfiguration}, this override has
   * no effect.
   */
  void setTargetLiveOffsetOverrideUs(long liveOffsetUs);
```
[LivePlaybackSpeedControl.java#L33-L41](https://github.com/google/ExoPlayer/blob/r2.17.1/library/core/src/main/java/com/google/android/exoplayer2/LivePlaybackSpeedControl.java#L33-L41)

###  void notifyRebuffer()

ユーザーインタラクションではなくバッファの不足によるリバッファリングを通知します。ただし、最初のバッファリングとシークによるバッファリング時にはこのメソッドは呼び出されません。

```java
  /**
   * Notifies the live playback speed control that a rebuffer occurred.
   *
   * <p>A rebuffer is defined to be caused by buffer depletion rather than a user action. Hence this
   * method is not called during initial buffering or when buffering as a result of a seek
   * operation.
   */
  void notifyRebuffer();
```

[LivePlaybackSpeedControl.java#L43-L50](https://github.com/google/ExoPlayer/blob/r2.17.1/library/core/src/main/java/com/google/android/exoplayer2/LivePlaybackSpeedControl.java#L43-L50)

### float getAdjustedPlaybackSpeed(long liveOffsetUs, long bufferedDurationUs)

現在のオフセット位置とバッファ位置を渡すことで、調整済み速度を返します。

```
  /**
   * Returns the adjusted playback speed in order get closer towards the {@link
   * #getTargetLiveOffsetUs() target live offset}.
   *
   * @param liveOffsetUs The current live offset, in microseconds.
   * @param bufferedDurationUs The duration of media that's currently buffered, in microseconds.
   * @return The adjusted factor by which playback should be sped up.
   */
  float getAdjustedPlaybackSpeed(long liveOffsetUs, long bufferedDurationUs);
```

[LivePlaybackSpeedControl.java#L52-L60](https://github.com/google/ExoPlayer/blob/r2.17.1/library/core/src/main/java/com/google/android/exoplayer2/LivePlaybackSpeedControl.java#L52-L60)

### long getTargetLiveOffsetUs()

現在のターゲットオフセットを返します。この値は初めにMediaItemから渡された値ではなく、調整を続けて変動した値になります。

```java
  /**
   * Returns the current target live offset, in microseconds, or {@link C#TIME_UNSET} if no target
   * live offset is defined for the current media.
   */
  long getTargetLiveOffsetUs();
```

[LivePlaybackSpeedControl.java#L62-L66](https://github.com/google/ExoPlayer/blob/r2.17.1/library/core/src/main/java/com/google/android/exoplayer2/LivePlaybackSpeedControl.java#L62-L66)

## DefaultLivePlaybackSpeedControl クラス

以下の解説は全てデフォルト値を使用する場合です。
先にprivateメソッドを解説し、それを利用する `LivePlaybackSpeedControl` インターフェースの振る舞いを追います。

### 初期値

- fallbackMinPlaybackSpeed：0.97
- fallbackMaxPlaybackSpeed: 1.03
- minUpdateIntervalMs：1_000
- smoothedMinPossibleLiveOffsetUs：`C.TIME_UNSET`
- smoothedMinPossibleLiveOffsetDeviationUs：`C.TIME_UNSET`

### targetLiveOffsetを必要ならばリセットする

内部の振る舞いです（privateメソッド）。

idealTargetOffsetの値を更新します。  
優先順位は、`mediaConfigurationTargetLiveOffsetUs < targetLiveOffsetOverrideUs` となります。

以前と同じ `idealTargetOffset` の値で上書きはせず、アーリーリターンします。

このことから、 MediaItem経由のLiveConfigurationのtargetOffsetではなく、`targetLiveOffsetOverrideUs`が途中で設定された場合などに実際の更新処理が実行されることが推測できます。

更新処理は以下の通りです。以前の値を考慮する計算になっているため、targetLiveOffsetの計算に利用される「以前のデータ」をクリアし、内部の状態を1度目の計算に適する形に戻します。

```java
idealTargetLiveOffsetUs = idealOffsetUs;
currentTargetLiveOffsetUs = idealOffsetUs;
smoothedMinPossibleLiveOffsetUs = C.TIME_UNSET;
smoothedMinPossibleLiveOffsetDeviationUs = C.TIME_UNSET;
lastPlaybackSpeedUpdateMs = C.TIME_UNSET;
```

[DefaultLivePlaybackSpeedControl.java#L385-L389](https://github.com/google/ExoPlayer/blob/r2.17.1/library/core/src/main/java/com/google/android/exoplayer2/DefaultLivePlaybackSpeedControl.java#L385-L389)

`LivePlaybackSpeedControl` インターフェースで定義される `setLiveConfiguration` か `setTargetLiveOffsetOverrideUs` で使用されます。

### 線形平滑化（smooth)

値を急激ではなく滑らかに変更するための著名なアルゴリズムです。変化前の値と変化後の値を割合で足し合わせます（金魚の水槽の水を全ては変えず半分だけ変えるみたいなことです）。

この時の足し合わせる割合は `smoothingFactor` です。本クラスでは、LiveOffsetを最小にする場合、つまり最も攻めたLiveOffsetを計算する場合に利用され、デフォルト値は `0.999f` です。SEE: [DefaultLivePlaybackSpeedControl.java#L80-L84](https://github.com/google/ExoPlayer/blob/r2.17.1/library/core/src/main/java/com/google/android/exoplayer2/DefaultLivePlaybackSpeedControl.java#L80-L84)

このため、`変化後の値:前` を `1:999` の割合で足し合わせます。ほとんど変化しないということです。

```java
private static long smooth(long smoothedValue, long newValue, float smoothingFactor) {
    return (long) (smoothingFactor * smoothedValue + (1f - smoothingFactor) * newValue);
  }
```

[DefaultLivePlaybackSpeedControl.java#L447-L449](https://github.com/google/ExoPlayer/blob/r2.17.1/library/core/src/main/java/com/google/android/exoplayer2/DefaultLivePlaybackSpeedControl.java#L447-L449)

### smoothedMinPossibleLiveOffsetUs （以前の値を考慮した最も攻めたLiveOffset） の更新

前提：`smoothedMinPossibleLiveOffsetUs`の初期値は `C.TIME_UNSET` です。

1. バッファを使い切る最も攻めた `minPossibleLiveOffsetUs` を計算します。  

        long minPossibleLiveOffsetUs = liveOffsetUs - bufferedDurationUs;

2. 1回目の計算であれば `minPossibleLiveOffsetUs` を採用してアーリーリターンします。

    この時、`smoothedMinPossibleLiveOffsetDeviationUs` は 0に設定します。

        if (smoothedMinPossibleLiveOffsetUs == C.TIME_UNSET) {
          smoothedMinPossibleLiveOffsetUs = minPossibleLiveOffsetUs;
          smoothedMinPossibleLiveOffsetDeviationUs = 0;
        } else {

3. N回目（N>=2）以降の計算の場合、N-1回目に計算した `smoothedMinPossibleLiveOffsetUs` と `minPossibleLiveOffsetUs` を用いて平滑化を行います。その値と `minPossibleLiveOffsetUs` のうち安全のためにより長いLiveOffsetを `smoothedMinPossibleLiveOffsetUs` とします。

    この時、`smoothedMinPossibleLiveOffsetUs`は1秒以上前の計算結果である一方で、`minPossibleLiveOffsetUs` はバッファを考慮した今回の値であることに注意してください。

        // Use the maximum here to ensure we keep track of the upper bound of what is safely possible,
        // not the average.
        smoothedMinPossibleLiveOffsetUs =
          max(
            minPossibleLiveOffsetUs,
            smooth(
              smoothedMinPossibleLiveOffsetUs,
              minPossibleLiveOffsetUs,
              minPossibleLiveOffsetSmoothingFactor));

4. `smoothedMinPossibleLiveOffsetDeviationUs` を計算します。

        long minPossibleLiveOffsetDeviationUs =
          abs(minPossibleLiveOffsetUs - smoothedMinPossibleLiveOffsetUs);
          smoothedMinPossibleLiveOffsetDeviationUs =
            smooth(
              smoothedMinPossibleLiveOffsetDeviationUs,
              minPossibleLiveOffsetDeviationUs,
              minPossibleLiveOffsetSmoothingFactor);

[DefaultLivePlaybackSpeedControl.java#L392-L415](https://github.com/google/ExoPlayer/blob/r2.17.1/library/core/src/main/java/com/google/android/exoplayer2/DefaultLivePlaybackSpeedControl.java#L392-L415)

### targetLiveOffsetの調整

1. 安全そうなsafeOffsetを計算します。

    推測：前回とのliveOffsetの変化差分が3倍以上になるケースはほとんどないということを意味しているのだと思います。このケースに対応できないのは、3GネットワークからWi-fiに接続先が切り替わり、ネットワークの速度が劇的に改善する場合などです。

        // Stay in a safe distance (3 standard deviations = >99%) to the minimum possible live offset.
        long safeOffsetUs =
          smoothedMinPossibleLiveOffsetUs + 3 * smoothedMinPossibleLiveOffsetDeviationUs;

2. currentTargetOffsetがsafeOffsetより長いかを判断して処理を分岐させます。

        if (currentTargetLiveOffsetUs > safeOffsetUs) {

3. （safeOffsetよりcurrentTargetLiveOffsetが大きい場合）度を超えて安全なのでcurrentTargetLifeOffsetを縮小します。

    maxDecrementUsの計算方法については、すみませんいまいちよくわかりません。

    おそらく、 `minUpdateIntervalUs` を掛けているのは、値が大きくなると更新頻度が落ちるので、それを考慮して一回あたりの影響を上げるためだと思います。

        // There is room for decreasing the target offset towards the ideal or safe offset (whichever
        // is larger). We want to limit the decrease so that the playback speed delta we achieve is
        // the same as the maximum delta when slowing down towards the target.
        long minUpdateIntervalUs = Util.msToUs(minUpdateIntervalMs);
        long decrementToOffsetCurrentSpeedUs =
          (long) ((adjustedPlaybackSpeed - 1f) * minUpdateIntervalUs);
        long decrementToIncreaseSpeedUs = (long) ((maxPlaybackSpeed - 1f) * minUpdateIntervalUs);
        long maxDecrementUs = decrementToOffsetCurrentSpeedUs + decrementToIncreaseSpeedUs;
        currentTargetLiveOffsetUs =
          max(safeOffsetUs, idealTargetLiveOffsetUs, currentTargetLiveOffsetUs - maxDecrementUs);

4. （safeOffsetよりcurrentTargetLiveOffsetが小さい場合）速度を落とした時に目指すべきtargetOffsetを計算します。

    考察：調整済み速度が1倍を下回る場合、目指すべきオフセットは `liveOffset` （本メソッドの引数に渡されているOffset）です。 `proportionalControlFactor` で割る理由は、速度変化が `proportionalControlFactor` に影響を受けて現在の状況が減らされて反映されるため、それを元に戻すためだと推察されます。

        // We'd like to reach a stable condition where the current live offset stays just below the
        // safe offset. But don't increase the target offset to more than what would allow us to slow
        // down gradually from the current offset.
        long offsetWhenSlowingDownNowUs = liveOffsetUs - (long) (max(0f, adjustedPlaybackSpeed - 1f) / proportionalControlFactor);

5. `currentTargetLiveOffset` と `safeOffset` の間に先ほど計算した `offsetWhenSlowingDownNowUs` があるならばそれを採用します。

        currentTargetLiveOffsetUs = Util.constrainValue(offsetWhenSlowingDownNowUs, currentTargetLiveOffsetUs, safeOffsetUs);

[DefaultLivePlaybackSpeedControl.java#L417-L445](https://github.com/google/ExoPlayer/blob/r2.17.1/library/core/src/main/java/com/google/android/exoplayer2/DefaultLivePlaybackSpeedControl.java#L417-L445)

### 速度調整

liveOffsetとバッファの長さを渡す必要があります。

1. `MediaItem.LiveConfiguration`に値が指定されていなければアーリーリターンします。

        if (mediaConfigurationTargetLiveOffsetUs == C.TIME_UNSET) {
          return 1f;
        }

2. 最も攻めた平滑済みLiveOffsetを更新します。

        updateSmoothedMinPossibleLiveOffsetUs(liveOffsetUs, bufferedDurationUs);

3. 2回目の呼び出しで前回の更新から `minUpdateIntervalMs` 以下の秒数しか経過していなければアーリーリターンします。

        if (lastPlaybackSpeedUpdateMs != C.TIME_UNSET
            && SystemClock.elapsedRealtime() - lastPlaybackSpeedUpdateMs < minUpdateIntervalMs) {
          return adjustedPlaybackSpeed;
        }

4. targetLiveOffsetを更新します。

        lastPlaybackSpeedUpdateMs = SystemClock.elapsedRealtime();

        adjustTargetLiveOffsetUs(liveOffsetUs);

5. オフセット誤差を取り、誤差に比例定数を掛けた値を1に足して、調整後の値とします。

        long liveOffsetErrorUs = liveOffsetUs - currentTargetLiveOffsetUs;
        if (Math.abs(liveOffsetErrorUs) < maxLiveOffsetErrorUsForUnitSpeed) {
          adjustedPlaybackSpeed = 1f;
        } else {
          float calculatedSpeed = 1f + proportionalControlFactor * liveOffsetErrorUs;
          adjustedPlaybackSpeed =
              Util.constrainValue(calculatedSpeed, minPlaybackSpeed, maxPlaybackSpeed);
        }
        return adjustedPlaybackSpeed;

[DefaultLivePlaybackSpeedControl.java#L338-L361](https://github.com/google/ExoPlayer/blob/r2.17.1/library/core/src/main/java/com/google/android/exoplayer2/DefaultLivePlaybackSpeedControl.java#L338-L361)


### notifyRebufferのコール時（ある条件のリバッファリングが起きた時）

currentTargetLiveOffsetが500ms増え、`lastPlaybackSpeedUpdateMs` がアンセットされます。

```java
  @Override
  public void notifyRebuffer() {
    if (currentTargetLiveOffsetUs == C.TIME_UNSET) {
      return;
    }
    currentTargetLiveOffsetUs += targetLiveOffsetRebufferDeltaUs;
    if (maxTargetLiveOffsetUs != C.TIME_UNSET
        && currentTargetLiveOffsetUs > maxTargetLiveOffsetUs) {
      currentTargetLiveOffsetUs = maxTargetLiveOffsetUs;
    }
    lastPlaybackSpeedUpdateMs = C.TIME_UNSET;
  }
```

[DefaultLivePlaybackSpeedControl.java#L324-L335](https://github.com/google/ExoPlayer/blob/r2.17.1/library/core/src/main/java/com/google/android/exoplayer2/DefaultLivePlaybackSpeedControl.java#L324-L335)