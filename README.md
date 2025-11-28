# 季節アニメーション背景切り替えサンプルアプリ

ボタンクリックで季節（春・夏・秋・冬）のLottieアニメーション背景を切り替えるシンプルなサンプルアプリです。

## 📋 プロジェクト概要

このプロジェクトは、`lottie-react` を使用したアニメーション実装のサンプルとして、季節ごとの背景を切り替える機能を実装しています。開発者が `lottie-react` の基本的な使い方と、状態管理による動的なアニメーション切り替えを理解できることを目的としています。

## ✨ 機能

- 4つの季節ボタン（春・夏・秋・冬）による背景切り替え
- 選択された季節のLottieアニメーション背景を画面いっぱいに表示
- アニメーションのループ再生
- ボタンのアクティブ状態の視覚的フィードバック（選択中の季節をハイライト）

## 🛠️ 技術スタック

- **言語/ランタイム**: TypeScript 5.9.3, Node.js
- **フレームワーク**: React 19.2.0, Vite 7.2.4
- **ライブラリ**: lottie-react
- **パッケージマネージャー**: npm（またはpnpm）

## 📦 セットアップ

### 1. 依存関係のインストール

```bash
npm install
```

または

```bash
pnpm install
```

### 2. lottie-react のインストール

```bash
npm install lottie-react
```

または

```bash
pnpm add lottie-react
```

### 3. Lottieアニメーションファイルの配置

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
npm run dev
```

または

```bash
pnpm dev
```

ブラウザで `http://localhost:5173` を開きます。

### ビルド

```bash
npm run build
```

または

```bash
pnpm build
```

### プレビュー

```bash
npm run preview
```

または

```bash
pnpm preview
```

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
│   ├── App.tsx          # メインコンポーネント
│   ├── App.css
│   ├── main.tsx         # エントリーポイント
│   └── index.css
├── doc/
│   └── rdd.md           # 要件定義書
├── package.json
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

- [ ] 4つの季節ボタンの表示
- [ ] ボタンクリックによる季節状態の管理（React state）
- [ ] 選択された季節に対応するLottieアニメーション背景の表示
- [ ] アニメーションのループ再生
- [ ] ボタンのアクティブ状態の視覚的フィードバック

### エラーハンドリング

- アニメーションファイルの読み込み失敗時は、コンソールにエラーを出力し、代替表示（テキストメッセージ）を表示します
- ブラウザ非対応時は、lottie-react のフォールバック機能に依存します

## 📚 参照

- [lottie-react 公式ドキュメント](https://github.com/LottieFiles/lottie-react)
- [Lottie 公式サイト](https://lottiefiles.com/)
- [lottie-react npm](https://www.npmjs.com/package/lottie-react)
- [要件定義書 (RDD)](./doc/rdd.md)

## 📄 ライセンス

- lottie-react: MIT ライセンス
- 使用するLottieアニメーションファイルのライセンスに注意（商用利用可能なものを選択してください）
