# TASK-LIST: GitHub Pages デプロイ

**作成日**: 2025-01-30
**RDD参照**: `doc/rdd.md`
**対象機能**: GitHub Pagesへの静的サイトデプロイ

---

## 変更要求（ADR-lite）⚠️ 承認待ち

### Context（背景）
RDDの非機能要件には「ローカル開発環境での動作確認ができれば十分」と記載されており、デプロイに関する要件は含まれていない。しかし、サンプルアプリの学習・検証目的を考慮すると、GitHub Pagesでの公開により他の開発者がアクセスしやすくなる利点がある。

### Decision（決定案）
GitHub Pagesへのデプロイ機能を追加する。以下の方針で実装：
- **GitHub Actions**によるCI/CDパイプライン構築
- Viteの`base`オプション設定（リポジトリ名に対応）
- `gh-pages`ブランチへの自動デプロイ

### Consequences（影響）
**メリット**:
- サンプルアプリを公開URLで共有可能
- 開発者が実際の動作を確認しやすい
- CI/CDの学習サンプルとしても活用可能

**デメリット**:
- RDDの「サンプルアプリのため、運用要件なし」という前提からの逸脱
- GitHub Actionsの設定が追加される（保守対象増加）

### Alternatives（代替案）
1. **手動デプロイ**: `pnpm build`後に手動でホスティング（却下理由: 再現性が低い）
2. **Vercel/Netlify**: 他のホスティングサービス（却下理由: GitHub Pagesがシンプルで無料）
3. **デプロイしない**: 現状維持（却下理由: ユーザーの要望に応えられない）

### 承認ステータス
- [x] ユーザー承認済み（2025-01-30）

---

## 前提条件

- Sprint 1〜3が完了済み（アプリケーション実装完了）
- GitHubリポジトリ: `mae616/sample-lottie`
- GitHub Pagesの設定が可能な権限を持っている

---

## Sprint 1: GitHub Pages デプロイ設定

**目的**: GitHub Pagesへの自動デプロイ環境を構築する
**スコープ**: Vite設定変更、GitHub Actions設定、デプロイ検証
**RDD参照**: doc/rdd.md §技術スタック（Vite 7.2.4）

### タスク一覧

#### TASK-1.1: Vite設定の更新（base オプション追加）

**目的/DoD**: GitHub Pages用にビルド出力のベースパスを設定する

**技術スタック(固定)**: Vite 7.2.4

**現状分析**:
- 現在の`vite.config.ts`には`base`オプションが設定されていない
- GitHub Pagesではリポジトリ名がサブパスになる（`/sample-lottie/`）

**実装ブループリント**:
```typescript
// vite.config.ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // GitHub Pages用: リポジトリ名をベースパスに設定
  base: '/sample-lottie/',
})
```

**検証ゲート**:
```bash
pnpm lint --fix
pnpm build
# distディレクトリのindex.htmlでアセットパスが/sample-lottie/で始まることを確認
```

**参照**:
- Vite公式ドキュメント: https://vite.dev/guide/static-deploy.html#github-pages
- 既存ファイル: `vite.config.ts`

**依存**: 変更要求の承認

**決定理由**: GitHub Pagesではリポジトリがサブディレクトリにデプロイされるため、base設定が必須

---

#### TASK-1.2: Lottieファイルパスの確認

**目的/DoD**: base変更後もLottieファイルが正しく読み込まれることを確認する

**技術スタック(固定)**: TypeScript 5.9.3, Vite 7.2.4

**現状分析**:
- `src/types/season.ts`で`/lottie/spring.json`等の絶対パスを使用
- Viteの`base`設定により、publicディレクトリのファイルは自動的にベースパスが適用される

**確認ポイント**:
```typescript
// src/types/season.ts（現状）
export const SEASON_LOTTIE_PATHS: Record<Season, string> = {
  spring: '/lottie/spring.json',  // Viteが自動的に/sample-lottie/lottie/spring.jsonに変換
  // ...
}
```

**検証ゲート**:
```bash
pnpm build
pnpm preview
# ブラウザでhttp://localhost:4173/sample-lottie/にアクセスし、アニメーションが表示されることを確認
```

**参照**:
- 既存ファイル: `src/types/season.ts`
- Vite公式: Public Directory（https://vite.dev/guide/assets.html#the-public-directory）

**依存**: TASK-1.1

**決定理由**: fetchで取得するpublicファイルはbaseが自動適用されないため、手動確認が必要

---

#### TASK-1.3: GitHub Actions ワークフロー作成

**目的/DoD**: mainブランチへのpush時にGitHub Pagesへ自動デプロイする

**技術スタック(固定)**: GitHub Actions, pnpm

**実装ブループリント**:
```yaml
# .github/workflows/deploy.yml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

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

      - name: Build
        run: pnpm build

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

**検証ゲート**:
```bash
# ローカルでの構文チェック（actionlintがある場合）
# actionlint .github/workflows/deploy.yml

# または手動確認: YAMLの構文が正しいこと
```

**参照**:
- GitHub Actions公式: https://docs.github.com/en/actions
- Vite公式: GitHub Pagesデプロイ例

**依存**: TASK-1.1

**決定理由**: GitHub Actionsの公式アクション（actions/deploy-pages@v4）を使用することで、信頼性と保守性を確保

---

#### TASK-1.4: リポジトリのGitHub Pages設定

**目的/DoD**: GitHubリポジトリでGitHub Pagesを有効化する

**手順**:
1. GitHubリポジトリの「Settings」→「Pages」へ移動
2. 「Source」を「GitHub Actions」に設定
3. 保存

**検証ゲート**:
- GitHub Actionsワークフローが正常に実行される
- デプロイ完了後、`https://mae616.github.io/sample-lottie/`にアクセス可能

**依存**: TASK-1.3

**決定理由**: GitHub Actions経由でのデプロイには、リポジトリ設定でGitHub Pagesの有効化が必要

---

#### TASK-1.5: デプロイ後の動作確認

**目的/DoD**: 本番環境（GitHub Pages）でアプリが正常に動作することを確認する

**手動確認チェックリスト**:
- [ ] `https://mae616.github.io/sample-lottie/`にアクセス可能
- [ ] 4つの季節ボタンが表示される
- [ ] 各ボタンクリックで背景が切り替わる
- [ ] アニメーションがループ再生される
- [ ] Lottie背景が画面いっぱいに表示される
- [ ] コンソールエラーなし

**検証ゲート**:
```bash
# GitHub Actionsの実行結果を確認
gh run list --workflow=deploy.yml
```

**依存**: TASK-1.4

**決定理由**: ローカルとは異なる環境（HTTPS、サブパス）での動作確認が必須

---

## 注意事項

### Lottieファイルパスの問題について

Viteの`base`設定を変更した場合、`fetch`で取得するファイルパスに注意が必要：

1. **import文で読み込む場合**: Viteが自動的にパスを解決（推奨）
2. **fetch/public経由の場合**: `import.meta.env.BASE_URL`を使用してパスを構築

**現状**: `LottieBackground.tsx`では`fetch`で`/lottie/*.json`を取得しているため、以下の修正が必要になる可能性がある：

```typescript
// 修正案: import.meta.env.BASE_URLを使用
const path = `${import.meta.env.BASE_URL}lottie/${season}.json`;
```

この修正はTASK-1.2の検証結果に応じて実施する。

---

## 品質チェックリスト

- [x] RDD/Architecture/Design の整合性 → 変更要求(ADR-lite)で対応
- [x] 逸脱がある場合、**変更要求(ADR-lite)** を付与し承認待ちにしている
- [x] 検証ゲートが**自動実行可能**
- [x] 既存パターン参照（重複なし）
- [x] **決定理由が明記されている**
- [x] **最小サンプル検証方針が含まれる**（TASK-1.2でpreviewサーバーで検証）

---

## 自己評価

**成功自信度: 8/10**

**理由**:
- Vite + GitHub Pagesの組み合わせは確立されたパターン
- GitHub Actions v4系の安定したアクションを使用
- -2点の理由:
  1. Lottieファイルのfetchパス問題が発生する可能性（TASK-1.2で検証）
  2. RDD逸脱のため変更要求の承認が必要

---

## 進捗状況

### Sprint 1 TASKファイル生成（2025-01-30）

**生成ファイル**: `ai-task/github-pages-deploy/TASK_sprint1_github-pages-deploy.md`

**コードベース分析結果**:
- `vite.config.ts`: `base`オプション未設定（要修正）
- `src/types/season.ts`: Lottieパスが絶対パス（`/lottie/spring.json`）→ `import.meta.env.BASE_URL`使用に変更が必要
- `src/components/LottieBackground.tsx`: `fetch`でpublicからLottie取得 → パス構築方法の変更が必要
- `.github/workflows/`: 存在しない（新規作成が必要）

**TASKの詳細化**:
- TASK-1.2を「確認」から「修正」に変更（`import.meta.env.BASE_URL`使用に統一）
- 実装ブループリントに具体的なコード変更を追加
- 依存関係図を明記

**ステータス**: ✅ TASK生成完了、実装待ち
