Title: ExoPlayerのLoaderファイナルクラス
Date: 2023-3-10
LastModified: 2023-3-10
Category: Android, ExoPlayer
Authors: dev-platong

# Overview

HlsSampleStreamWrapperを見ていたら、出てきたので軽めに触れる。

## 責務

Loadableインターフェースを持つもののバックグラウンドでの管理。

## 基底

LoaderErrorThrower：条件によって例外をスローするか判断する `maybeThrowError()`を持つ。

## 空間

`upstream` 空間

# 定義クラス・例外・インターフェース

## 例外：UnexpectedLoaderException

IOExceptionの拡張。特別な機能は持たない。

# インターフェース：Loadable

## 責務

Loaderによってloadされるオブジェクト

`cancelLoad()` メソッドと `load()` メソッドを持つ。

## インターフェース；Callback(T extends Loadable)

- `void onLoadCompleted(T loadable, long elapsedRealtimeMs, long loadDurationMs)`
- `void onLoadCancled(T loadable, long elapsedRealtimeMs, long loadDurationMs, boolean released)`
- `LoadErrorAction onLoadError(T loadable, long elapsedRealtimeMs, long loadDurationMs, IOException error, int errorCount)`