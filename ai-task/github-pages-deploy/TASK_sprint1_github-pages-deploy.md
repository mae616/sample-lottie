# TASK: Sprint 1 - GitHub Pages デプロイ設定

**作成日**: 2025-01-30
**RDD参照**: `doc/rdd.md` §技術スタック（Vite 7.2.4）
**タスクリスト**: `ai-task/github-pages-deploy/TASK-LIST-github-pages-deploy.md`

---

## 変更要求（ADR-lite）✅ 承認済み

タスクリストファイルにて承認済み（2025-01-30）。
詳細は `TASK-LIST-github-pages-deploy.md` を参照。

---

## TASK-1.1: Vite設定の更新（base オプション追加）

### 目的/DoD
GitHub Pages用にビルド出力のベースパスを設定する。
`/sample-lottie/`をベースパスとして設定し、静的アセットが正しく読み込まれるようにする。

### RDD参照
- `doc/rdd.md` §技術スタック: Vite 7.2.4

### 技術スタック（固定）
- Vite 7.2.4

### 重要コンテキスト

**現状分析**:
```typescript
// vite.config.ts（現在）
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
})
```

**公式ドキュメント**:
- Vite Static Deploy Guide: https://vite.dev/guide/static-deploy.html#github-pages
- Base Public Path: https://vite.dev/config/shared-options.html#base

### 実装ブループリント

```typescript
// vite.config.ts（変更後）
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // GitHub Pages用: リポジトリ名をベースパスに設定
  // mae616.github.io/sample-lottie/ でホスティングされるため
  base: '/sample-lottie/',
})
```

### 検証ゲート

```bash
# 1. ビルド確認
pnpm build

# 2. distディレクトリのindex.htmlでアセットパスを確認
cat dist/index.html | grep -E 'src=|href='
# 期待値: /sample-lottie/ で始まるパス
```

### 決定理由
GitHub Pagesでは`https://<user>.github.io/<repo>/`形式でデプロイされるため、
ベースパスの設定が必須。Viteの`base`オプションで対応する。

---

## TASK-1.2: Lottieファイルパスの修正

### 目的/DoD
base変更後もLottieファイルが正しく読み込まれることを保証する。
`import.meta.env.BASE_URL`を使用してパスを動的に構築する。

### RDD参照
- `doc/rdd.md` §機能要件: Lottieアニメーション背景の表示
- `doc/rdd.md` §非機能要件: エラーハンドリング

### 技術スタック（固定）
- TypeScript 5.9.3
- Vite 7.2.4
- React 19.2.0

### 重要コンテキスト

**現状分析**:
```typescript
// src/types/season.ts（現在）
export const SEASON_LOTTIE_PATHS: Record<Season, string> = {
  spring: '/lottie/spring.json',  // 絶対パス → base変更で壊れる
  summer: '/lottie/summer.json',
  autumn: '/lottie/autumn.json',
  winter: '/lottie/winter.json',
} as const;
```

**問題点**:
- fetchで取得するpublicファイルには、Viteの`base`設定が自動適用されない
- 現在の絶対パス（`/lottie/spring.json`）はGitHub Pagesでは404になる

**公式ドキュメント**:
- Vite Public Directory: https://vite.dev/guide/assets.html#the-public-directory
- Vite import.meta.env: https://vite.dev/guide/env-and-mode.html#env-variables

### 実装ブループリント

**方法A: SEASON_LOTTIE_PATHSを関数化**（推奨）

```typescript
// src/types/season.ts（変更後）
/**
 * 季節ごとのLottieファイルパスを取得
 *
 * import.meta.env.BASE_URLを使用して
 * デプロイ環境に応じたパスを動的に構築
 */
export const getSeasonLottiePath = (season: Season): string => {
  // import.meta.env.BASE_URLは末尾スラッシュ付き（例: '/sample-lottie/'）
  return `${import.meta.env.BASE_URL}lottie/${season}.json`;
};

// 後方互換性のため定数も維持（ローカル開発用の参照として）
export const SEASON_LOTTIE_PATHS: Record<Season, string> = {
  spring: '/lottie/spring.json',
  summer: '/lottie/summer.json',
  autumn: '/lottie/autumn.json',
  winter: '/lottie/winter.json',
} as const;
```

**LottieBackground.tsxの修正**:
```typescript
// src/components/LottieBackground.tsx（変更箇所）
import { getSeasonLottiePath } from '../types/season';

// useEffect内の変更
const path = getSeasonLottiePath(season);
const response = await fetch(path, { signal: controller.signal });
```

### 検証ゲート

```bash
# 1. TypeScriptコンパイル確認
pnpm build

# 2. プレビューサーバーで動作確認
pnpm preview
# ブラウザで http://localhost:4173/sample-lottie/ にアクセス
# - 全季節のアニメーションが表示されることを確認
# - コンソールエラーがないことを確認

# 3. ネットワークタブでLottieファイルのリクエストパスを確認
# 期待値: /sample-lottie/lottie/spring.json 等
```

### 難所検証方針

previewサーバーでの動作確認が最小サンプル検証に相当。
問題発生時は`samples/`ディレクトリに検証コードを配置可能（解決後削除）。

### 決定理由
`import.meta.env.BASE_URL`はViteが自動的に設定する環境変数で、
`base`オプションの値が入る。これを使用することで、
ローカル開発（`/`）とGitHub Pages（`/sample-lottie/`）の両方で動作する。

---

## TASK-1.3: GitHub Actions ワークフロー作成

### 目的/DoD
mainブランチへのpush時にGitHub Pagesへ自動デプロイするCI/CDパイプラインを構築する。

### RDD参照
- `doc/rdd.md` §技術スタック: pnpm

### 技術スタック（固定）
- GitHub Actions
- pnpm 10
- Node.js 22

### 重要コンテキスト

**プロジェクト構成**:
- パッケージマネージャ: pnpm
- ビルドコマンド: `pnpm build`
- 出力ディレクトリ: `dist`

**公式ドキュメント**:
- GitHub Actions Deploy to Pages: https://docs.github.com/en/actions/deployment/security-hardening-your-deployments
- actions/deploy-pages: https://github.com/actions/deploy-pages
- pnpm/action-setup: https://github.com/pnpm/action-setup

### 実装ブループリント

```yaml
# .github/workflows/deploy.yml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]
  workflow_dispatch:  # 手動実行も可能に

# GitHub Pagesへのデプロイに必要な権限
permissions:
  contents: read
  pages: write
  id-token: write

# 同時実行制御（デプロイ競合防止）
concurrency:
  group: "pages"
  cancel-in-progress: true

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup pnpm
        uses: pnpm/action-setup@v4
        with:
          version: 10

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '22'
          cache: 'pnpm'

      - name: Install dependencies
        run: pnpm install --frozen-lockfile

      - name: Type check
        run: pnpm build
        # 注: pnpm buildはtsc -b && vite buildを実行

      - name: Setup Pages
        uses: actions/configure-pages@v4

      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: ./dist

  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    needs: build
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

### 検証ゲート

```bash
# 1. ディレクトリ構造確認
ls -la .github/workflows/deploy.yml

# 2. YAML構文確認（手動）
# インデントが正しいこと、キーワードのスペルミスがないこと

# 3. mainブランチへのpush後、GitHub Actionsの実行を確認
# gh run list --workflow=deploy.yml
```

### 決定理由
- GitHub Actionsの公式アクション（v4系）を使用し、信頼性を確保
- pnpm/action-setup@v4でpnpmを適切にセットアップ
- concurrencyでデプロイ競合を防止

---

## TASK-1.4: リポジトリのGitHub Pages設定（手動）

### 目的/DoD
GitHubリポジトリでGitHub Pagesを有効化し、GitHub Actionsからのデプロイを許可する。

### 手順

1. GitHubリポジトリ `mae616/sample-lottie` にアクセス
2. **Settings** タブをクリック
3. 左サイドバーの **Pages** をクリック
4. **Source** セクションで **GitHub Actions** を選択
5. **Save** をクリック

### 検証ゲート

- GitHub Actionsワークフローが正常に実行される
- デプロイ完了後、`https://mae616.github.io/sample-lottie/` にアクセス可能

### 決定理由
GitHub Actions経由でのデプロイには、リポジトリ設定でGitHub Pagesの有効化が必要。
「Source: GitHub Actions」を選択することで、deploy-pages アクションが動作する。

---

## TASK-1.5: デプロイ後の動作確認

### 目的/DoD
本番環境（GitHub Pages）でアプリが正常に動作することを確認する。

### 手動確認チェックリスト

- [ ] `https://mae616.github.io/sample-lottie/` にアクセス可能
- [ ] 4つの季節ボタン（春・夏・秋・冬）が表示される
- [ ] 各ボタンクリックで背景アニメーションが切り替わる
- [ ] アニメーションがループ再生される
- [ ] Lottie背景が画面いっぱいに表示される
- [ ] ブラウザのコンソールにエラーがない
- [ ] 各季節のLottieファイルが正しく読み込まれる（Network タブで確認）

### 検証ゲート

```bash
# GitHub Actionsの実行結果を確認
gh run list --workflow=deploy.yml

# 最新のデプロイURLを確認
gh run view --web
```

### 決定理由
ローカル開発環境とは異なる環境（HTTPS、サブパス）での動作確認が必須。
特にLottieファイルのパス解決が正しく行われているかを検証する。

---

## 依存関係

```
TASK-1.1 (Vite設定)
    ↓
TASK-1.2 (Lottieパス修正) ← TASK-1.1に依存
    ↓
TASK-1.3 (GitHub Actions) ← TASK-1.1に依存
    ↓
TASK-1.4 (リポジトリ設定) ← TASK-1.3に依存
    ↓
TASK-1.5 (動作確認) ← TASK-1.4に依存
```

---

## 品質チェックリスト

- [x] RDD/Architecture/Design 準拠 → 変更要求(ADR-lite)で承認済み
- [x] 重複回避が明記されている → 既存コードの最小変更
- [x] 参照URL・コードスニペットが**実在** → Vite/GitHub公式
- [x] 検証ゲートが**実行可能** → pnpm build, pnpm preview
- [x] 実装パス（擬似コード/手順）が明確
- [x] エラーハンドリング/ロールバック記述 → GitHub Actionsは自動ロールバック
- [x] 変更要求がある場合は**承認待ち**を明記 → 承認済み
- [x] 最小サンプル検証の計画がある → previewサーバーで検証
- [x] サンプル運用がTASKに明記されている → 問題発生時のみsamples/使用

---

## 自己評価

**成功自信度: 9/10**

**理由**:
- Vite + GitHub Pagesは確立されたデプロイパターン
- GitHub Actions v4系の安定したアクションを使用
- `import.meta.env.BASE_URL`による動的パス構築で環境差異を吸収
- -1点の理由: リポジトリ設定（TASK-1.4）は手動作業のため、権限問題が発生する可能性がある
