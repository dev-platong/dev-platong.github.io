Title: ExoPlayerImplInternalの挙動を追う（生成まわり）
Date: 2023-2-24
Category: ExoPlayer
Authors: dev-platong

## ExoPlayerImplInternalの生成時

### LoadControl関連

LoadControl から 巻き戻し関連の値を取得する。

[ExoPlayerImplInternal.java#L248-L249](https://github.com/google/ExoPlayer/blob/r2.16.1/library/core/src/main/java/com/google/android/exoplayer2/ExoPlayerImplInternal.java#L248-L249)

### PlaybackInfo関連

ダミーのPlaybackInfoインスタンスと、それに基づく PlaybackInfoUpdateクラスを作る。

PlaybackInfoUpdateクラスは ExoPlayerImplInternal で定義されるクラス。  
保持されている PlaybackInfo の情報が外部に伝わっているとは限らない（pengingされている）。  
`void incrementPendingOperationAcks(int operationAcks)` が呼び出されるタイミングで pending が解除される。  
`incrementPendingOperationAcks` は ExoPlayerImpl と ExoPlayerImplInternal だけで使用される。

[ExoPlayerImplInternal.java#L251-L252](https://github.com/google/ExoPlayer/blob/r2.16.1/library/core/src/main/java/com/google/android/exoplayer2/ExoPlayerImplInternal.java#L251-L252)

### Renderer関連

Rendererの再生特性（DRMをサポートするか・トンネルモードをサポートするかなど）を配列で保持する。

[ExoPlayerImplInternal.java#L253-L257](https://github.com/google/ExoPlayer/blob/r2.16.1/library/core/src/main/java/com/google/android/exoplayer2/ExoPlayerImplInternal.java#L253-L257)

### PlayerMessage関連

#### PlayerMessageクラス

`package com.google.android.exoplayer2` にある、Playerに何か挙動を引き起こすためメッセージ。スレッドが死んでいる場合に実行を中止したり、pendingしたりできる点でCommandパターンに近い。

Senderインターフェースを実装するものから送出され、Targetインターフェースを持つものが受け取る。

[PlayerMessage.java](https://github.com/google/ExoPlayer/blob/r2.16.1/library/core/src/main/java/com/google/android/exoplayer2/PlayerMessage.java)

#### PendingMessageInfo

ExoPlayerImplInternal特有のクラス。PlayerMessageがどの位置で解決されたかを、`periodIndex`, `periodTimeUs`, `periodUid` で保持する。

[ExoPlayerImplInternal.java#L259](https://github.com/google/ExoPlayer/blob/r2.16.1/library/core/src/main/java/com/google/android/exoplayer2/ExoPlayerImplInternal.java#L259)

### Timeline関連

Timeline.WindowとTimeline.Periodをそれぞれフィールドに保持する。

もしTimelineに詳しくない場合はわかりやすい[com/google/android/exoplayer2/Timeline.html](https://exoplayer.dev/doc/reference/com/google/android/exoplayer2/Timeline.html)を参照のこと。

この時、

- Windowは 単一のwindow uidと空のmediaItem
- Periodは 広告再生ステートではない状態

で生成される。

[ExoPlayerImplInternal.java#L261-L262](https://github.com/google/ExoPlayer/blob/r2.16.1/library/core/src/main/java/com/google/android/exoplayer2/ExoPlayerImplInternal.java#L261-L262)

### TrackSelector関連

`init(InvalidationListener listener, BandwidthMeter bandwidthMeter)` が呼ばれるが、引数をフィールドに保持するだけのため、一般的なソフトウェアにおいてはコンストラクタのような内容である。しかしExoPlayerはサブコンポーネントの振る舞いをDIよって変更できる設計であるため、コンストラクタがその旨で利用される。そのためこちらは`init`となっているのではないかと推察できる。

`InvalidationListener` は、以前のトラック選択で選択され利用中の `Track` を失効させるための処理を担うハンドラのリスナー。

[ExoPlayerImplInternal.java#L263](https://github.com/google/ExoPlayer/blob/r2.16.1/library/core/src/main/java/com/google/android/exoplayer2/ExoPlayerImplInternal.java#L263)

### MediaPeriodQueueクラス

MediaPeriodを保持し、先頭のメディアが読まれるキュー。

[MediaPeriodQueue.java#L33-L37](https://github.com/google/ExoPlayer/blob/029a2b27cbdc27cf9d51d4a73ebeb503968849f6/library/core/src/main/java/com/google/android/exoplayer2/MediaPeriodQueue.java#L33-L37)

ExoPlayerImplInternalのコンストラクタで生成される。

[ExoPlayerImplInternal.java#L268](https://github.com/google/ExoPlayer/blob/r2.16.1/library/core/src/main/java/com/google/android/exoplayer2/ExoPlayerImplInternal.java#L268)


MediaPeriodQueueクラスのコンストラクタでPeriodとWindowを生成するが、これは ExoPlayerImplInternalのPeriod・Windowインスタンスとは別物であることに注意。

[MediaPeriodQueue.java#L90](https://github.com/google/ExoPlayer/blob/029a2b27cbdc27cf9d51d4a73ebeb503968849f6/library/core/src/main/java/com/google/android/exoplayer2/MediaPeriodQueue.java#L90)

### スレッド関連

新しい Thread, Looper, Handler が生成され保持される。

[ExoPlayerImplInternal.java#L271-L276](https://github.com/google/ExoPlayer/blob/r2.16.1/library/core/src/main/java/com/google/android/exoplayer2/ExoPlayerImplInternal.java#L271-L276)

## まとめ

一旦ここまでで ExoPlayerが生成された時の関連クラスは把握できた。

- 保持を目的とするPlaybackInfoUpdate・PlayerMessageInfo・MediaPeriodQueueの初期化を行う。
- Window/Periodを生成する。
- TrackSelectorを初期化する。
- RendererCapabilitiesの取得を行う。
- スレッドを生成する。