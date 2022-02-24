Title: ExoPlayerが生成される時、具体的にはどんなクラスが生成されるのか
Date: 2023-2-23
Category: Android, ExoPlayer
Authors: dev-platong

## 概要

ExoPlayerでの再生問題におけるトラブルシューティング迅速化のため、再生に関わるクラスを把握する。  
今回はDefault実装での ExoPlayer の生成時にどのようなクラスがインスタンス化され、それ以降に処理を委譲するために保持されているのか調査する。

## 環境

| ソフトウェア | バージョン |
| - | - |
| ExoPlayer | [r2.16.1](https://github.com/google/ExoPlayer/releases/tag/r2.16.1) | 

検証には `ExoPlayer.demo` モジュールを利用する。

## 基礎知識

ExoPlayerではコンポーネントと呼ばれる一定の責務を持った塊がinterfaceとして存在し、各コンポーネントがDefault実装を持っているという構成を持っている。  
コンポーネントはインジェクトをサポートするので、サブコンポーネントにおける振る舞いをコンストラクタ経由でカスタムクラスを注入することで変更することができる。

[ExoPlayer.java#L102-L112](https://github.com/google/ExoPlayer/blob/r2.16.1/library/core/src/main/java/com/google/android/exoplayer2/ExoPlayer.java#L102-L112)

基本的にはよほど要件が複雑でない限りは、ライブラリが提供するDefault実装を使うことになるので、今回もDefault実装を使っていく。

## ExoPlayerの生成

ExoPlayerインターフェース の実装である、 SimpleExoPlayerクラス が ExoPlayerインターフェースのbuilder から生成される。

[ExoPlayer.java#L967](https://github.com/google/ExoPlayer/blob/r2.16.1/library/core/src/main/java/com/google/android/exoplayer2/ExoPlayer.java#L967)

この時、 SimpleExoPlayerクラス では ExoPlayerImplクラスを生成し、playerフィールドに保持する。

[SimpleExoPlayer.java#L479](https://github.com/google/ExoPlayer/blob/r2.16.1/library/core/src/main/java/com/google/android/exoplayer2/SimpleExoPlayer.java#L479)

### ExoPlayerImplインスタンスの生成時

Renderer・TrackSelector・MediaSourceFactory・LoadControl・BandwidthMeter・AnalyticsCollector・LivePlaybackSpeedControl・Clock・Playerなどが与えられる。  
各クラスの概要は以下にまとめるが、それぞれの詳細は追って記事にしていく。

[ExoPlayerImpl.java#L154](https://github.com/google/ExoPlayer/blob/r2.16.1/library/core/src/main/java/com/google/android/exoplayer2/ExoPlayerImpl.java#L154)

| クラス名 | 役割の概略 |
| - | - |
| Renderer | SampleStreamコンポーネントからメディアを読み込む |
| TrackSelector | Rendererコンポーネントによって消費されるトラックを選択する |
| MediaSourceFactory | MediaItemクラスからMediaSourceを生成する |
| LoadControl | バッファリングをコントロールする |
| BandwidthMeter | 現在利用可能な帯域幅を推測する | 
| AnalyticsCollector | AnalyticsListenerコンポーネントにイベントを収集し送る |
| LivePlaybackSpeedControl | 着実にターゲットライブオフセットを維持するために速度をコントロールする |
| Clock | System Clockの抽象化と、HandlerWrapperコンポーネントの生成 |
| Player | あるならばラップして使うためのPlayer |

コンストラクタではdummyとなる値を生成し、最後に ExoPlayerInternalインスタンスを生成する。

[ExoPlayerImpl.java#L250](https://github.com/google/ExoPlayer/blob/r2.16.1/library/core/src/main/java/com/google/android/exoplayer2/ExoPlayerImpl.java#L250)

ExoPlayerImplからExoPlayerImplInternalに渡される引数は、SimpleExoPlayerからExoPlayerImplに渡されるものとほとんど変わらない。  
このことからExoPlayerImplInternalは、ExoPlayerImplが内部的に保持するインスタンスの操作を担っていそうだということが推測できる。


## まとめ

- ExoPlayer.Builder -> SimpleExoPlayer -> ExoPlayerImpl -> ExoPlayerInternal と生成される。
- SimpleExoPlayerのコンストラクタの時点で生成し、引数としてコンストラクタに渡されたクラスの実際の操作をExoPlayerImplInternalが責務として持つ。

明日は[ExoPlayerImplInternalの生成時の振る舞いを掘り下げていく。](./exoplayer_detail_of_exoplayerimplinternal.md)