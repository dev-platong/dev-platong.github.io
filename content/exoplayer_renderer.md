Title: ExoPlayerのRendererインターフェース
Date: 2022-3-9
LastModified: 2022-3-10
Category: ExoPlayer
Authors: dev-platong

# Overview

満を辞してRendererを読みます。

## 責務

SampleStreamクラスからメディアをレンダリングします。  
内部的には ExoPlayer によってレンダラーのライフサイクルは管理されます。  
レンダラーは可能なトラック変更と全ての再生状態のような様々なステートに移行します。

## WakeUpLisener

いくつかのレンダラーは `render()` メソッドが呼ばれるべき時を通知します。  
これはプレイヤーが次にウェイクアップするまでスリープすることを可能にします（タイトループの中で `render()` メソッドを呼ぶ代わりです）。  
割り込みベースのスケジューリングの目的は、電力消費を抑えることにあります。

- void onSleep(long wakeupDeadlineMs)
- void onWakeup()

[Renderer.java#L59-L78](https://github.com/google/ExoPlayer/blob/r2.17.0/library%2Fcore%2Fsrc%2Fmain%2Fjava%2Fcom%2Fgoogle%2Fandroid%2Fexoplayer2%2FRenderer.java#L59-L78)

## MessageType

レンダラーに渡すことができるメッセージのタイプを示します。アプリケーション定義の値を `MSG_CUSTOM_BASE` を使って持てることに注意。

- VIDEO_OUTPUT

    `ExoPlayer.createMesssage()` を通じてビデオレンダラに渡されるメッセージ。  
payloadはSurfaceであることが通常だが、いくつのビデオレンダラーは他の `VideoDecoderOutputBufferRenderer` などにも出力できる。

- VOLUME

    `ExoPlayer.createMesssage()` を通じてオーディオレンダラに渡されるメッセージ。  
payloadは0~1のFloat。


- AUDIO_ATTRIBUTES

    `ExoPlayer.createMesssage()` を通じてオーディオレンダラに渡されるメッセージ。    
payloadはオーディオトラックに設定されることになる `AudioAttributes` クラスのインスタンスであるべき。 何も設定されなければ、一般的なメディア再生に向いているデフォルトが使われる。  
再生中の設定がオーディオトラックを再生成することで短いオーディオギャップを生む可能性があります。

- SCALING_MODE

    `ExoPlayer.createMesssage()` を通じてMediaCodecベースのビデオレンダラに渡されるメッセージ。payloadは `C.VideoScalingMode` の1つである必要があります。  
Scalingモードは `android.view.SurfaceView` によってターゲットレンダラーが所有されている時のみ利用可能です。

- CHANGE_FRAME_RATE_STRATEGY

    `ExoPlayer.createMesssage()` を通じてビデオレンダラに渡されるメッセージ。  
payloadは`C.VideoChangeFrameRateStrategy` の1つである必要があります。

- AUX_EFFECT_INFO

    `ExoPlayer.createMesssage()` を通じてオーディオレンダラに渡されるメッセージ。    
補助オーディオエフェクトを意味する `AuxEffectInfo` がpayloadになるべきです。

- VIDEO_FRAME_METADATA_LISTEN

    `ExoPlayer.createMesssage()` を通じてビデオレンダラに渡されるメッセージ。  
`VideoFrameMetadataListener` インスタンスがpayloadであるべき。

- CAMERA_MOTION_LISTENER

    `ExoPlayer.createMesssage()` を通じてカメラモーションレンダラに渡されるメッセージ。  
`CameraMotionListener` がpayloadであるべき。

- SKIP_SILENCE_ENABLED

    `ExoPlayer.createMesssage()` を通じてオーディオレンダラに渡されるメッセージ。    
無音をスキップするか否かをpayloadに渡します。

- AUDIO_SESSION_ID

    `ExoPlayer.createMesssage()` を通じてビデオレンダラとオーディオレンダラに渡されるメッセージ。  
payloadはオーディオセッションIDを表すintで、下のオーディオトラックにアタッチされるもので、ビデオレンダラがトンネリングをサポートするなれば、オーディオセッションIDを利用します。

- WAKEUP_LISTENER

    `ExoPlayer.createMesssage()` を通じて `Renderer` インターフェースに渡されるメッセージ。  
レンダラーが他のコンポーネントのウェイクアップが可能なことを知らせます。

[Renderer.java#L80-L204](https://github.com/google/ExoPlayer/blob/r2.17.0/library%2Fcore%2Fsrc%2Fmain%2Fjava%2Fcom%2Fgoogle%2Fandroid%2Fexoplayer2%2FRenderer.java#L80-L204)

## State

<img src="https://exoplayer.dev/doc/reference/com/google/android/exoplayer2/doc-files/renderer-states.svg"/>

- DISABLED

    レンダラーが利用不可。メディアデコーダなどのレンダリングに必要なものを得ていません。もしかしたら継続的に利用可能なものを持っているかもしれません。  
    `reset()` を呼ぶことで強制的にそういった保持しているリソースを強制解放できます。

- ENABLED

    レンダラーが利用可能だが始まってはいません。このステートは、初めのビデオフレームのような現在のポジションのメディアをレンダリングしているかもしれません。  
    ですがポジションが先に進むことはありません。メディアデコーダなどのレンダリングに必要なリソースを保持していると考えるのが一般的なこのステートへの考え方です。

- STARTED

    レンダラーが始まっています。 `renderer()` メソッドを飛ぶことでメディアのレンダーが始まります。

[Renderer.java#L206-L231](https://github.com/google/ExoPlayer/blob/r2.17.0/library%2Fcore%2Fsrc%2Fmain%2Fjava%2Fcom%2Fgoogle%2Fandroid%2Fexoplayer2%2FRenderer.java#L206-L231)

## getter

- `String getName()`：ロギングやデバッグの目的のもので、レンダラーの名前を返します。レンダラーのクラスネームであることが一般的です。
- `@C.TrackType int getTrackType()`：レンダラーがハンドリングしているトラックタイプを返します。
- `RendererCapabilities getCapabilities()`
- `int getState()`
- `MediaClock getMediaClock()`

    もしレンダラーが自身の再生ポジションを越える場合にこのメソッドが対応するMediaClockを返します。もし MediaClockが帰ったならばプレイヤーはそのMediaClockを使います。  
    プレイヤーはこのメソッドから返された最低一つのレンダラーを持っているかもしれません。

- `@Nullable SampleStream getStream()`：もしレンダラーがdisabledならばnullが帰ります。
- `long getReadingPositionUs()`：rendererが読み込んだサンプルの時間を返します。 `STATE_ENABLED` または `STATE_STARTED` の時に呼ばれます。
- `boolean isCurrentStreamFinal()`
- `boolean hasReadStreamToEnd()`

    このメソッドは `STATE_ENABLED` または `STATE_STARTED` の時に呼ばれます。

- `boolean isEnded()`

## メソッド

- `void init(int index, PlayerId playerId)`

    プレイヤーが再生に使おうとしているレンダラーが初期化されます。indexはプレイヤーの中のレンダラーインデックスでPlayerIdはプレイヤーのIDです。

- `void enable(RendererConfiguration configuration, Format[] formats, SampleStream stream, long positonUs, boolean joining, boolean mayRendererStartOfStream, long startPositionUs, long offsetUs)`

    レンダラーに指定した SampleStreamを消費することを可能にします。このメソッドはレンダラーが `STATE_DISABLED` の時に呼ばれる可能性があります。
    - format：利用可能なフォーマット
    - positionUs：プレイヤーの現在のポジション
    - joining：レンダラーを再生中のものに合流するかどうか
    - mayRendererStartOfStream：レンダラーが `STATE_STARTED` 出なくてもレンダラーがストリームを開始することを許可するかどうか
    - startPositionUs：レンダラーの中の時間でのストリームの開始ポジション
    - offsetUs： SampleStreamから読み込まれたバッファのタイムスタンプにレンダリング前に追加されるオフセットを指定します。

- `void start()`

    レンダラーを開始します。`render()` を呼ぶことががレンダリングを開始することを意味しています。 `STATE_ENABLED` の場合に呼ばれます。

- `void replaceStream(Format[] formats, SampleStream stream, long startPositionUs, long offsetUs)`

    SampleStreamを交換します。 `STATE_ENABLED` と `STATE_STARTED` の場合に呼ばれます。

- `void setCurrentStreamFinal()`

- `void maybeThrowStreamError() throws IOException`

- `void resetPosition(long positionUs)`

    PositionDiscontinuityが発生したことをレンダラーに知らせます。レンダラーのサンプルストリームはキーフレームから再生をすることを保証します。  
    `STATE_ENABLED` と `STATE_STARTED` の場合に呼ばれます。

- `default void setPlaybackSpeed(float currentPlaybackSpeed, float targetPlaybackSpeed)`

    targetPlaybackSpeedは currentPlaybackSpeedとは異なります。

- `void render(long positionUs, long elapsedRealtimeUs) throws ExoPlaybackException`

    SampleStreamをインクリメンタルにレンダリングします。  
    レンダラーが{@link #STATE_ENABLED}の状態であれば、このメソッドを呼び出すたびにンダラーを起動したときに SampleStream をレンダリングできるようにするための作業を行います。もし レンダラーが STATE_STARTED の状態であれば、このメソッドを呼び出すと 指定されたメディアポジションに同期してSampleStreamを表示します。

    The renderer may also render the very start of the media at the current position (e.g. the
    first frame of a video stream) while still in the {@link #STATE_ENABLED} state, unless it's the
    initial start of the media after calling {@link #enable(RendererConfiguration, Format[],
    SampleStream, long, boolean, boolean, long, long)} with {@code mayRenderStartOfStream} set to
    {@code false}. （あまりにも長くて翻訳がだるい、DEEPLもダメだし。）

    このメソッドはすぐに返されるべきです。
    `STATE_ENABLED` と `STATE_STARTED` の場合に呼ばれます。

- `boolean isReady()`

    If the renderer is in the {@link #STATE_STARTED} state then returning true indicates that
    the renderer has everything that it needs to continue playback. Returning false indicates that
    the player should pause until the renderer is ready.
   
    If the renderer is in the {@link #STATE_ENABLED} state then returning true indicates that
    the renderer is ready for playback to be started. Returning false indicates that it is not.

   `STATE_ENABLED` と `STATE_STARTED` の場合に呼ばれます。

- `void stop()`

    `STATE_ENABLED`へ移行します
    `STATE_STARTED` の場合に呼ばれます。

- `void disabled()`

   `STATE_ENABLED` の場合に呼ばれます。

- `reset()`

    `STATE_DISABLED`の場合に呼ばれます。

# まとめ

render()メソッドの実実装と、getMediaClock()の実際の振る舞いが気になった。  
例えば音ズレの問題は `getMediaClock()` が正しく振る舞えば起きないような気がする。

長すぎて後半だるかった。