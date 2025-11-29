# 季節アニメーション背景切り替えサンプルアプリ

ボタンクリックで季節（春・夏・秋・冬）のLottieアニメーション背景を切り替えるシンプルなサンプルアプリです。

## 📋 プロジェクト概要

このプロジェクトは、`lottie-react` を使用したアニメーション実装のサンプルとして、季節ごとの背景を切り替える機能を実装しています。開発者が `lottie-react` の基本的な使い方と、状態管理による動的なアニメーション切り替えを理解できることを目的としています。

**一言まとめ:** ボタンクリックで季節のアニメーション背景が切り替わるシンプルなデモアプリ

## ✨ 機能

- 4つの季節ボタン（春・夏・秋・冬）による背景切り替え
- 選択された季節のLottieアニメーション背景を画面いっぱいに表示
- アニメーションのループ再生
- ボタンのアクティブ状態の視覚的フィードバック（選択中の季節をハイライト）

## 🛠️ 技術スタック

- **言語/ランタイム**: TypeScript 5.9.3, Node.js
- **フレームワーク**: React 19.2.0, Vite 7.2.4
- **ライブラリ**: lottie-react 2.4.1
- **パッケージマネージャー**: pnpm
- **デプロイ**: GitHub Pages対応（ベースパス `/sample-lottie/` 設定済み）

## 📦 セットアップ

### 1. 依存関係のインストール

```bash
pnpm install
```

### 2. Lottieアニメーションファイルの配置

1. `public/lottie/` ディレクトリを作成します

```bash
mkdir -p public/lottie
```

2. 以下の命名規則で4つのアニメーションファイル（JSON形式）を配置します：
   - `public/lottie/spring.json` - 春のアニメーション
   - `public/lottie/summer.json` - 夏のアニメーション
   - `public/lottie/autumn.json` - 秋のアニメーション
   - `public/lottie/winter.json` - 冬のアニメーション

**アニメーションファイルの取得方法**:
- [LottieFiles](https://lottiefiles.com/) 等の無料リソースから取得
- 商用利用可能なライセンスのものを選択してください

## 🚀 使い方

### 開発サーバーの起動

```bash
pnpm dev
```

ブラウザで `http://localhost:5173` を開きます。

### ビルド

```bash
pnpm build
```

### プレビュー

```bash
pnpm preview
```

### GitHub Pagesへのデプロイ

このプロジェクトはGitHub Pages対応済みです。`vite.config.ts`でベースパス `/sample-lottie/` が設定されています。

デプロイ手順：
1. ビルドを実行: `pnpm build`
2. `dist/` ディレクトリをGitHub Pagesにデプロイ
3. リポジトリのSettings > Pagesでソースを設定

## 📁 ディレクトリ構造

```
.
├── public/
│   └── lottie/          # Lottieアニメーションファイルの配置場所
│       ├── spring.json
│       ├── summer.json
│       ├── autumn.json
│       └── winter.json
├── src/
│   ├── components/      # Reactコンポーネント
│   │   ├── LottieBackground.tsx  # Lottieアニメーション背景コンポーネント
│   │   └── SeasonSelector.tsx    # 季節選択ボタンコンポーネント
│   ├── types/           # TypeScript型定義
│   │   └── season.ts    # 季節型とユーティリティ定数
│   ├── App.tsx          # メインコンポーネント（状態管理）
│   ├── App.css          # アプリケーションスタイル
│   ├── main.tsx         # エントリーポイント
│   └── index.css        # グローバルスタイル
├── doc/
│   └── rdd.md           # 要件定義書
├── package.json
├── vite.config.ts       # Vite設定（GitHub Pages用ベースパス設定済み）
└── README.md
```

## 🎨 UI構成

```
[春] [夏] [秋] [冬]  ← ボタン群（画面上部、横並び）
┌─────────────────┐
│                 │
│  Lottie背景      │  ← 選択された季節のアニメーション
│  アニメーション  │     （画面いっぱいに表示）
│                 │
└─────────────────┘
```

- **初期状態**: デフォルトで「春」のアニメーションが表示されます
- **ボタン配置**: 画面上部に横並びで配置（「春」「夏」「秋」「冬」の順）
- **背景表示**: Lottieアニメーション背景は画面いっぱい（width: 100%, height: 100%）に表示されます

## 📝 開発メモ

### 実装済み機能

- [x] 4つの季節ボタンの表示（`SeasonSelector`コンポーネント）
- [x] ボタンクリックによる季節状態の管理（React state）
- [x] 選択された季節に対応するLottieアニメーション背景の表示（`LottieBackground`コンポーネント）
- [x] アニメーションのループ再生
- [x] ボタンのアクティブ状態の視覚的フィードバック（`.season-selector__button--active`クラス）
- [x] エラーハンドリング（アニメーションファイル読み込み失敗時の代替表示）
- [x] ローディング状態の表示
- [x] GitHub Pages対応（ベースパス動的設定）

### コンポーネント構成

- **`App.tsx`**: アプリケーションのルートコンポーネント。季節状態を管理し、`LottieBackground`と`SeasonSelector`を統合
- **`LottieBackground.tsx`**: 指定された季節のLottieアニメーションを画面全体の背景として表示。非同期読み込み、エラーハンドリング、ローディング状態を実装
- **`SeasonSelector.tsx`**: 4つの季節ボタンを横並びで表示。アクティブ状態の視覚的フィードバックを提供
- **`season.ts`**: 季節型定義とユーティリティ定数（`Season`型、`SEASONS`配列、`SEASON_LABELS`マップ、`getSeasonLottiePath()`関数）

### エラーハンドリング

- アニメーションファイルの読み込み失敗時は、コンソールにエラーを出力し、代替表示（テキストメッセージ）を表示します
- `AbortController`を使用してコンポーネントのアンマウント時にリクエストをキャンセルします
- ブラウザ非対応時は、lottie-react のフォールバック機能に依存します

## 📚 参照

- [lottie-react 公式ドキュメント](https://github.com/LottieFiles/lottie-react)
- [Lottie 公式サイト](https://lottiefiles.com/)
- [lottie-react npm](https://www.npmjs.com/package/lottie-react)
- [要件定義書 (RDD)](./doc/rdd.md)
- [Vite 公式ドキュメント](https://vite.dev/)
- [React 公式ドキュメント](https://react.dev/)

## 📄 ライセンス

- lottie-react: MIT ライセンス
- 使用するLottieアニメーションファイルのライセンスに注意（商用利用可能なものを選択してください）
