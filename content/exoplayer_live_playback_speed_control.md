Title: Low Latency時に快適な再生：LivePlaybackSpeedControlの挙動を追う
Date: 2023-2-25
LastModified: 2023-4-11
Category: Android, ExoPlayer
Authors: dev-platong

# Overview

低遅延ストリームまたは使用を明示した場合の通常LIVEストリームにおいて、再生オフセットを移動させながら
現在の解像度での再生を維持する遅延管理機構について扱います。

## 2023/4/11追記

ExoPlayer r2.17.0においてGoogleの意思決定により、r2.13.0から有効だった低遅延ではないLiveストリームでの本クラスの遅延管理はデフォルトで非有効となりました。 SEE: https://github.com/google/ExoPlayer/issues/9329

再度本機能を低遅延ストリームではないLiveストリームで有効にするためには、 `MediaItem` のビルド時に `LiveConfiguration` を設定する必要があります。

方法は https://exoplayer.dev/live-streaming.html#configuring-live-playback-parameters を参照ください。

## Live再生時にMediaに設定される LiveConfigurationクラス

オフセットと再生速度のmin/maxが設定できます。オフセットに関してはターゲットも設定できます。

## LivePlaybackSpeedControlインターフェース

ターゲットオフセットは、 `LivePlaybackSpeedControl` から上書きできる。

[LivePlaybackSpeedControl.java#L41](https://github.com/google/ExoPlayer/blob/release-v2/library/core/src/main/java/com/google/android/exoplayer2/LivePlaybackSpeedControl.java#L41)

ユーザーインタラクションではないリバッファリングの検知も行う。

[LivePlaybackSpeedControl.java#L50](https://github.com/google/ExoPlayer/blob/release-v2/library/core/src/main/java/com/google/android/exoplayer2/LivePlaybackSpeedControl.java#L50)

現在のオフセット位置とバッファ位置を渡すことで、調整のための速度を返すメソッドがある。

[LivePlaybackSpeedControl.java#L60](https://github.com/google/ExoPlayer/blob/release-v2/library/core/src/main/java/com/google/android/exoplayer2/LivePlaybackSpeedControl.java#L60)

現在のターゲットオフセットは外部からも取得可能（隠蔽したい意図はないらしい、内部的に変更されることがあるのか？）

[LivePlaybackSpeedControl.java#L66](https://github.com/google/ExoPlayer/blob/release-v2/library/core/src/main/java/com/google/android/exoplayer2/LivePlaybackSpeedControl.java#L66)

## DefaultLivePlaybackSpeedControl

速度のコントロールメカニズムは比例制御を利用する。 `1.0 + 比例制御定数 * （ 現在のライブオフセット秒数 - ターゲットライブオフセット秒数 ）` で表される。

比例制御定数はデフォルトで `0.1`。

リバッファリングが起きた時、

`Builder#setTargetLiveOffsetIncrementOnRebufferMs(long targetLiveOffsetIncrementOnRebufferMs)` の分だけ、target offsetが増加し、ネットワークケイパビリティが縮小する。

状況が改善すると、

`Builder#setMinPossibleLiveOffsetSmoothingFactor(float minPossibleLiveOffsetSmoothingFactor)` の分だけ、target offsetが縮小する。注意するのは秒数をしているするのではなく、ファクターであると。

[DefaultLivePlaybackSpeedControl.java#L31](https://github.com/google/ExoPlayer/blob/release-v2/library/core/src/main/java/com/google/android/exoplayer2/DefaultLivePlaybackSpeedControl.java#L31)

デフォルトの速度はMin 0.97 / Max 1.03 倍で設定されている。  
速度アップデートの感覚はデフォルトで1秒おき。

リバッファリングが起きた時に、ライブオフセットの秒数はデフォルトで0.5秒増える。

##　まとめ

- LivePlaybackSpeedControlでは、ターゲットオフセットに狙って速度を変更する。
- ターゲットオフセットは内部の振る舞いにより変更される。
- DefaultLivePlaybackSpeedControlでは比例制御が行われる。

明日はより詳細に[アルゴリズムを追います。](./exoplayer_detail_of_liveplaybackspeedcontrol.md)