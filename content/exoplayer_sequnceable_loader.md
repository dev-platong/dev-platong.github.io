Title: ExoPlayerのSequenceableLoaderインターフェース
Date: 2023-3-7
LastModified: 2023-3-11
Category: Android, ExoPlayer
Authors: dev-platong

# Overview

HlsSampleWrapperがimplementsしているので。

## 責務

他のローダーと同期的に進行可能なローダー。

## 基底

なし

## 空間

`source`

# インターフェース

## Callback<T extends SequencableLoader>

`void onContinueLoadingRequested(T source)`

`continueLoading(long)`を呼ぶことを期待するコールバック。再生スレッドから呼ばれる。 

## メソッド

`long getBufferedPositionUs()`・`long getNextLoadPositionUs()`はそのまま。

### `boolean continueLoading(long positionUs)`

継続的なローディングを試みます。`True`を返す場合には進行が得られたことを示し、 `getNextLoadPosition()` の値が呼び出し前と変わることを意味します。

### `boolean isLoading()`

### `void reevaluateBuffer(long positionUs)`

異なる品質に変わったならばリバッファリングします。