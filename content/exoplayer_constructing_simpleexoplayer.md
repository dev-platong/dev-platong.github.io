Title: SimpleExoPlayerの生成時
Date: 2023-2-27
LastModified: 2023-2-28
Category: Android, ExoPlayer
Authors: dev-platong

## Constructing時に関連するクラス・プロパティ

- PriorityTaskManager： その名の通り優先的にタスクを実行するクラス
- AudioAttributes： 全てのAPIでサポートできる android.media.AudioAttributes の強化版
- VideoScalingMode： クロップかfitするためのスケールしかない。デフォルトはfit。MediaCodecベースの Renderer が利用可能で、SurfaceViewが出力に指定されている時に利用できる。
- VideoChangeFrameRateStrategy：後述
- skipSilenceEnabled：無音の音声ストリームをスキップするか、デフォルトはfalse
- detachSurfaceTimeoutMs： プレイヤーからSurfaceがデタッチされるタイムアウト秒数（ms）。
- ComponentListener： 一般的な説明は後述。SimpleExoPlayerは、AnalyticsCollectorと、個別に登録したlisntersに処理を委譲するだけだが、例外もいくつかあるため都度覗くこと。
- FrameMetadataListener：ビデオフレームに紐付くメタデータのリッスンと、カメラモーションのリッスン。
- renderes：RendererFactoryから生成します。
- volume：デフォルトで1です。
- currentCues：空のリスト
- throwsWhenUsingWrongThread：デフォルトでtrueです。再生スレッド以外からプレイヤーが触れられた時に例外をスローします。
- AudioBecomingNoisyManager：後述
- AudioFocusManager：　Audio Focusが何のことか分からないので[いずれ調べます。](https://github.com/dev-platong/dev-platong.github.io/issues/12)
- StreamVolumeManager： android.media.AudioManagerのラップクラスです。音声ストリームのボリュームを扱います。
- WakeLockManager：[androidのWakeLock](https://developer.android.com/training/scheduling/wakelock?hl=ja)を扱います。
- WifiLockManager：[androidのWifiLock](https://developer.android.com/reference/android/net/wifi/WifiManager.WifiLock)を扱います。
- DeviceInfo：再生しているデバイスの情報を持ちます。といってもローカルかリモートか（キャスト）とminVolumeとmaxVolumeくらいです。（命名変更が求められるところ）
- videoSize：VideoSize.UNKNOWNで生成されます。

その後は、rendererにメッセージをセットして終わりです。

[SimpleExoPlayer.java#L430](https://github.com/google/ExoPlayer/blob/r2.16.1/library/core/src/main/java/com/google/android/exoplayer2/SimpleExoPlayer.java#L430)

### VideoChangeFrameRateStrategy

MediaCodecベースのRendererが利用可能な場合に利用できる。  
アプリケーションは、 Surfaceの `CHANGE_FRAME_RATE_ALWAYS` を `C#VIDEO_CHANGE_FRAME_RATE_STRATEGY_OFF` にセットした上で、ExoPlayerが `Surface#setFrameRate` を操作して実現する。

### ComponentListener

ExoPlayerでは、各クラスでprivate finalで実装されているリスナーです。

### AudioBecomingNoisyManager

デフォルトではBuilderの `handleAudioBecomingNoisy` が `false` のため、機能しません。

[ExoPlayer.java#L422](https://github.com/google/ExoPlayer/blob/r2.16.1/library/core/src/main/java/com/google/android/exoplayer2/ExoPlayer.java#L422)

この機能を `true` にする場合には、`AUDIO_BECOMING_NOIDY` の検出時に `playWhenReady` が `false` になります。

[SimpleExoPlayer.java#L2032-L2037](https://github.com/google/ExoPlayer/blob/r2.16.1/library/core/src/main/java/com/google/android/exoplayer2/SimpleExoPlayer.java#L2032-L2037)

## まとめ

ExoPlayerImplやExoPlayerImplInternalで具体的な処理を行うため、SimpleExoではより付加価値的なクラス生成を行なっている。  
明日は[ExoPlayer.setMediaItem()を追います。](./exoplayer_set_media_item.md)