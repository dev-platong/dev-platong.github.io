Title: ExoPlayerのBufferクラス
Date: 2023-3-9
LastModified: 2023-3-10
Category: ExoPlayer
Authors: dev-platong

# Overview

SampleStreamに渡されるDecoderInputBufferを掘っていく途中で基底となるBuffer抽象クラスを見ます。

# 責務

バッファとフラグの基底クラス。

## フラグの6種類

- KEY_FRAME：バッファが同期サンプルを持っていることを示す。
- END_OF_STREAM：EOSのシグナルとなるからのバッファであることを示す。
- HAS_SUPPLEMENTAL_DATA：バッファが補完的なデータを持っていることを示す。
- LAST_SAMPLE：ストリームの最後のメディアサンプルであることを知られているものを含んでいることを示す。
- ENCRYPTED：バッファが一部または全て暗号化されている。
- DECODE_ONLY：レンダリングされないものを示す。

[C.java#L480-L510](https://github.com/google/ExoPlayer/blob/r2.17.0/library%2Fcommon%2Fsrc%2Fmain%2Fjava%2Fcom%2Fgoogle%2Fandroid%2Fexoplayer2%2FC.java#L480-L510)

[Buffer.java](https://github.com/google/ExoPlayer/blob/r2.17.0/library/decoder/src/main/java/com/google/android/exoplayer2/decoder/Buffer.java)

## 振る舞い

Bufferクラスでは主にフラグの扱いを定義している。  
持っているフラグから、 `isDecodeOnly` かなどを判定しているだけ。  
フラグはset/add/clearできる。

# まとめ

フラグについての振る舞いしか定義されていない。フラグは6つある。