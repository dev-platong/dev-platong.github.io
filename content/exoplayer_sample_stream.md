Title: ExoPlayerのSampleStreamインターフェース
Date: 2023-3-7
LastModified: 2023-3-7
Category: Android, ExoPlayer
Authors: dev-platong

# 概要

Rendererインターフェースによる動画データの描画を詰めるため、その読み込み元となるSampleStreamについて触れます。

# SampleStreamインターフェースの責務

フォーマット情報に紐づいたメディアサンプルのストリームを表現する。

## 4つのメソッド

### boolean isReady()

読み込み可能なデータが利用できるかを返します。  
終わったストリームは常にreadyであることに注意します。

### void maybeThrowError() throws IOException

読み込み時にデータが阻害された場合エラーを吐きます。

### @ReadDataResult int readData(FormatHolder formatHolder, DecoderInputBuffer buffer, @ReadFlags int readFlags)

#### ReadDataResult

`RESULT_NOTHING_READ` または `RESULT_FORMAT_READ`・ `RESULT_BUFFER_READ`が帰ります。  
何も読めなかったか、フォーマットかバッファーかです。

#### FormatHolder

FormatクラスとDrmSessionクラスを保持します。

##### Format

明日やります。

#### DecoderInputBuffer

明後日やります。

#### ReadFlags

- FLAG_PEEK：サンプルバッファが読み込まれる時、読み込みポジションは先に進むべきでは無いことを示します。
- FLAG_REQUIRE_FORMAT：次にバッファが読まれるときに、サンプルのフォーマットを代わりに読みます。
- FLAG_OMIT_SAMPLE_DATA： `{@link DecoderInputBuffer#data}, {@link DecoderInputBuffer#supplementalData} と {@link DecoderInputBuffer#cryptoInfo} `を呼ぶ必要がないことを伝えます。効率的なサンプルメタデータのピーキングや、サンプルバッファのスキップに利用されます。

### int skipData（long positionUs）

特定のポジション以前のキーフレームをスキップすることを試みます。または、`positionUs` が EOS(End of stream)を超えている場合、データをスキップします。

# まとめ

- 4つのメソッドがある。
- 読み込む・スキップする・準備可能・エラーをスローする。
- DocoderInputBufferとFormatHolderが関係する。

明日はFormatクラスについて扱います。