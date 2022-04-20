Title: ExoPlayerにおけるLiveOffsetとは何か
Date: 2023-2-25
LastModified: 2023-4-11
Category: Android, ExoPlayer
Authors: dev-platong

# Overview

Live edgeとは何か

# 詳細

LiveOffsetは、 `TARGET DURATION` の3倍になる。

これはRFC8216（HLSのspec）で規定されている。SEE: [HLS spec 4.4.3.8](https://datatracker.ietf.org/doc/html/draft-pantos-hls-rfc8216bis-09#:~:text=Its%20absence%20implies%20a%20value%20of%20three%0A%20%20%20%20%20%20times%20the%20Target%20Duration.)

HLSのTarget Durationは[セグメントの最大長（ただし、小数点以下は四捨五入）になる](https://gnzo.com/labo/archives/646#:~:text=The%20EXT-X-TARGETDURATION,%E9%81%A9%E7%94%A8%E3%81%95%E3%82%8C%E3%81%BE%E3%81%99%E3%80%82)ため、セグメントX個分というわけではなく、最低でもセグメント3つ分ということになる。

- EXT-X-START：EXT-X-STARTタグは、プレイリストの再生を開始する優先ポイントを示します。デフォルトでは、クライアントは再生セッションを開始するときにこの時点で再生を開始する必要があります。このタグはオプションです。

`durations - startOffsetUs` 

もし、ない場合 `partHoldBackUs` （サーバーサイドのレコメンド） The server-recommended live offset in microseconds in low-latency mode, or {@link C#TIME_UNSET} if none defined.  

## holdBackUsが存在する場合 & part target durationがある場合

The server-recommended live offset in microseconds in low-latency mode, or {@link * C#TIME_UNSET} if none defined.

低遅延モードを持ってる。

## holdBackUs

The server-recommended live offset in microseconds, or {@link C#TIME_UNSET} if none defined.

## RFCに基づく決定

 Fallback, see RFC 8216, Section 4.4.3.8.
