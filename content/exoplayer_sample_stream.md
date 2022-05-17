Title: ExoPlayerのSampleStreamインターフェース
Date: 2023-3-7
LastModified: 2023-3-10
Category: ExoPlayer
Authors: dev-platong

# 概要

Rendererインターフェースによる動画データの描画の挙動を追っていく過程です。  
Rendererがデータを読み込んでいるSampleStreamについて触れます。

## SampleStreamインターフェースの責務

フォーマット情報が紐づいたメディアサンプルのストリームを表現します。

## 空間

sourceパッケージです（`com.google.android.exoplayer2.source`）。

## 4つのメソッド

### boolean isReady()

読み込み可能なデータが利用できるかを返します。  
EOSは常にreadyであることに注意します。

### void maybeThrowError() throws IOException

読み込み時にデータが阻害された場合エラーを吐きます。

### @ReadDataResult int readData(FormatHolder formatHolder, DecoderInputBuffer buffer, @ReadFlags int readFlags)

#### @ReadDataResult

`RESULT_NOTHING_READ` または `RESULT_FORMAT_READ`・ `RESULT_BUFFER_READ`が帰ります。  
何も読めなかったか、フォーマットかバッファーかです。

#### FormatHolderファイナルクラス

FormatクラスとDrmSessionクラスを保持します。

##### Formatファイナルクラス

[記事](./exoplayer_format.md)をご覧ください。

#### DecoderInputBuffer

[記事](./exoplayer_decoder_input_buffer.md)をご覧ください。

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