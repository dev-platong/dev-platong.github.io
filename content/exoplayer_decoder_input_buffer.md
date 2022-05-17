Title: ExoPlayerのDecoderInputBufferクラス
Date: 2023-3-9
LastModified: 2023-3-10
Category: ExoPlayer
Authors: dev-platong

# Overview

SampleStreamで `readData()` 時に渡される `DecoderInputBuffer` クラスについて調べる。

## 責務

デコーダへの入力を保持します。  

## 基底

[Buffer抽象クラス](./exoplayer_buffer.md)

## @BufferReplacementMode

既存のバッファのキャパシティが十分でない場合に`ensureSpaceForWrite` でどのように置換バッファを生成するかをコントロールします。

- BUFFER_REPLACEMENT_MODE_DISABLED
- BUFFER_REPLACEMENT_MODE_NORMAL： `ByteBuffer.allocate(int)`を用いたバッファ置換を許容します。
- BUFFER_REPLACEMENT_MODE_DIRECT： `ByteBuffer.allocateDirect(int)` を用いたバッファ置換を許容します。

## InsufficientCapacityExceptionファイナルクラス

`BUFFER_REPLACEMENT_MODE_DISABLED` または 十分なキャパシティを持っていない場合の DocoderInputBufferへの書き込み時にスローします。

## 保持するByteBuffer

dataフィールドにデータを持つことはもちろんですが、supplementalDataを持つ可能性もあります。  
バッファは補完データを持つ場合にはポジション0からそのリミットまでバッファが入力されます。

## その他関連クラス

- Format
- CryptInfo
- Nullable ByteBuffer