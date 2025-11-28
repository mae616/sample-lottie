# TASK-LIST: 季節アニメーション背景切り替えアプリ

**作成日**: 2025-01-27
**RDD参照**: `doc/rdd.md`
**ステータス**: 未着手

---

## 概要

lottie-react を使用した季節（春・夏・秋・冬）のアニメーション背景を切り替えるサンプルアプリの実装タスクリスト。

**MVP範囲**: 4つの季節ボタンと、選択された季節のLottieアニメーション背景を画面いっぱいに表示する機能

---

## Sprint 1: 環境構築・依存関係セットアップ

- **目的**: lottie-react を使える状態にし、アニメーションファイルを配置する
- **スコープ**: 依存関係のインストール、Lottieファイル配置、型定義確認
- **RDD参照**: doc/rdd.md §技術スタック, §制約

### タスク一覧

- [ ] **TASK-1.1**: lottie-react パッケージのインストール（想定: 15min）
  - ファイル: `package.json`
  - 検証ゲート:
    ```bash
    pnpm add lottie-react
    pnpm lint && pnpm build
    ```
  - 参照: doc/rdd.md §技術スタック, https://www.npmjs.com/package/lottie-react
  - 依存: なし
  - 決定理由: RDDで指定されたlottie-reactライブラリ（MIT License, ⭐1.4k+, 直近更新あり）

- [ ] **TASK-1.2**: Lottieアニメーションファイルの配置（想定: 15min）
  - ファイル: `public/lottie/spring.json`, `public/lottie/summer.json`, `public/lottie/autumn.json`, `public/lottie/winter.json`
  - 検証ゲート:
    ```bash
    ls -la public/lottie/
    # 4つのJSONファイルが存在すること
    ```
  - 参照: doc/rdd.md §制約（命名規則・配置場所）
  - 依存: なし
  - 決定理由: RDDで指定された配置場所と命名規則に従う
  - **選定済み**: 下記「注意事項」セクションの表を参照（Lottie Simple License、商用利用可）

- [ ] **TASK-1.3**: type-checkの実施（想定: 5min）
  - ファイル: なし（確認のみ）
  - 検証ゲート:
    ```bash
    pnpm build
    ```
  - 参照: doc/rdd.md §技術スタック
  - 依存: TASK-1.1
  - 決定理由: TypeScript環境での型整合性確認

---

## Sprint 2: 基本コンポーネント実装

- **目的**: 季節切り替えの基本UIとLottie表示を実装する
- **スコープ**: SeasonSelectorコンポーネント、LottieBackgroundコンポーネント、季節状態管理
- **RDD参照**: doc/rdd.md §機能要件, §デザイン方針

### タスク一覧

- [ ] **TASK-2.1**: 季節の型定義を作成（想定: 10min）
  - ファイル: `src/types/season.ts`
  - 検証ゲート:
    ```bash
    pnpm lint && pnpm build
    ```
  - 参照: doc/rdd.md §機能要件（4つの季節）
  - 依存: なし
  - 決定理由: TypeScriptの型安全性を活かし、季節を列挙型で定義

- [ ] **TASK-2.2**: LottieBackgroundコンポーネントの実装（想定: 30min）
  - ファイル: `src/components/LottieBackground.tsx`
  - 検証ゲート:
    ```bash
    pnpm lint && pnpm build
    ```
  - 参照: doc/rdd.md §機能要件（画面いっぱいに表示、ループ再生）, §非機能要件（エラーハンドリング）
  - 依存: TASK-1.1, TASK-1.2, TASK-2.1
  - 決定理由: Lottieアニメーション表示を単一責任で管理するコンポーネント

- [ ] **TASK-2.3**: SeasonSelectorコンポーネントの実装（想定: 20min）
  - ファイル: `src/components/SeasonSelector.tsx`
  - 検証ゲート:
    ```bash
    pnpm lint && pnpm build
    ```
  - 参照: doc/rdd.md §機能要件（4つのボタン）, §デザイン方針（横並び配置）
  - 依存: TASK-2.1
  - 決定理由: 季節選択UIを単一責任で管理するコンポーネント

- [ ] **TASK-2.4**: App.tsxの書き換え（想定: 20min）
  - ファイル: `src/App.tsx`, `src/App.css`
  - 検証ゲート:
    ```bash
    pnpm lint && pnpm build
    pnpm dev  # 手動確認: ボタンクリックで背景が切り替わること
    ```
  - 参照: doc/rdd.md §機能要件（季節状態の管理）, §ユースケース
  - 依存: TASK-2.2, TASK-2.3
  - 決定理由: 既存テンプレートを置き換え、季節状態をuseStateで管理

---

## Sprint 3: スタイリング・仕上げ

- **目的**: UIの見た目を整え、完了条件を満たす
- **スコープ**: CSSスタイリング、アクティブ状態表示、最終検証
- **RDD参照**: doc/rdd.md §デザイン方針, §機能要件（DoD）

### タスク一覧

- [ ] **TASK-3.1**: 全体レイアウトのCSS調整（想定: 20min）
  - ファイル: `src/App.css`, `src/index.css`
  - 検証ゲート:
    ```bash
    pnpm lint && pnpm build
    pnpm dev  # 手動確認: Lottie背景が画面いっぱいに表示されること
    ```
  - 参照: doc/rdd.md §デザイン方針（画面いっぱい表示）
  - 依存: TASK-2.4
  - 決定理由: RDDの「width: 100%, height: 100%」要件を満たす

- [ ] **TASK-3.2**: ボタンのアクティブ状態スタイリング（想定: 15min）
  - ファイル: `src/components/SeasonSelector.tsx`（または専用CSS）
  - 検証ゲート:
    ```bash
    pnpm lint && pnpm build
    pnpm dev  # 手動確認: 選択中の季節ボタンがハイライトされること
    ```
  - 参照: doc/rdd.md §機能要件（任意: アクティブ状態の視覚的フィードバック）
  - 依存: TASK-2.3
  - 決定理由: UXの向上（どの季節が選択されているか明確にする）

- [ ] **TASK-3.3**: エラーハンドリングの実装（想定: 15min）
  - ファイル: `src/components/LottieBackground.tsx`
  - 検証ゲート:
    ```bash
    pnpm lint && pnpm build
    # 手動確認: 存在しないJSONを指定した場合にフォールバック表示されること
    ```
  - 参照: doc/rdd.md §非機能要件（エラーハンドリング）, §機能要件（DoD）
  - 依存: TASK-2.2
  - 決定理由: アニメーションファイル読み込み失敗時のUX確保

- [ ] **TASK-3.4**: 最終検証・クリーンアップ（想定: 15min）
  - ファイル: 全体
  - 検証ゲート:
    ```bash
    pnpm lint && pnpm build
    pnpm dev
    # 手動確認チェックリスト:
    # - [ ] 4つの季節ボタンが表示される
    # - [ ] 各ボタンクリックで背景が切り替わる
    # - [ ] アニメーションがループ再生される
    # - [ ] Lottie背景が画面いっぱいに表示される
    # - [ ] コンソールエラーなし
    # - [ ] 切り替え時間 < 100ms（体感で即座）
    ```
  - 参照: doc/rdd.md §機能要件（DoD）
  - 依存: TASK-3.1, TASK-3.2, TASK-3.3
  - 決定理由: RDDのDoD（完了条件）を満たすことの確認

---

## 品質チェックリスト

- [x] RDD/Architecture/Design の整合性確認済み
- [x] 逸脱なし（lottie-reactはRDDで指定済み）
- [x] 検証ゲートが自動実行可能（lint, build, 手動確認）
- [x] 既存パターン参照（重複なし - 新規実装）
- [x] 決定理由が明記されている
- [x] 最小サンプル検証方針: Lottieファイルが読み込めない場合はTASK-1.2で最小サンプルJSONを作成して検証可能

---

## 注意事項・ユーザー確認事項

1. **Lottieアニメーションファイルの取得** (TASK-1.2) - **選定済み**
   - ライセンス: Lottie Simple License（商用利用可）
   - 取得元: [LottieFiles](https://lottiefiles.com/)

   | 季節 | ファイル名 | アニメーション | URL | 選定理由 |
   |------|-----------|---------------|-----|----------|
   | 春 | `spring.json` | Sakura Fall | https://lottiefiles.com/free-animation/sakura-fall-XXiyvafWbf | 桜の花びらが舞う、日本の春を象徴 |
   | 夏 | `summer.json` | Happy SUN | https://lottiefiles.com/free-animation/happy-sun-gRGQ96oFlm | 明るい太陽、背景向きのシンプルさ |
   | 秋 | `autumn.json` | Autumn Fall | https://lottiefiles.com/free-animation/autumn-fall-HJWHqoNhA2 | 落ち葉が舞う、秋を象徴 |
   | 冬 | `winter.json` | Snowflakes | https://lottiefiles.com/free-animation/snowflakes-MNJ7iP63h0 | 雪の結晶、DL数1.1Kで人気 |

   **代替候補**（差し替え可能）:
   - 春: [Cherry Blossom](https://lottiefiles.com/free-animation/cherry-blossom-CgLg3fvsV5)
   - 夏: [Summer Vibes](https://lottiefiles.com/free-animation/summer-vibes-o6BVQ71FEX) / [Beach](https://lottiefiles.com/free-animation/beach-ToabN8RkYT)
   - 秋: [Leaves Falling](https://lottiefiles.com/free-animation/leaves-falling-PeCv6JNmtl)
   - 冬: [Snow Fall](https://lottiefiles.com/free-animation/snow-fall-4W3xu04YDa)

   **差し替え方法**: `public/lottie/` 内のJSONファイルを同名で上書きするだけでOK（dev serverならHMRで即反映）

2. **テスト戦略**
   - RDDに基づき、手動テストで十分（Vitestは必要に応じて導入）

---

## 自己評価

**成功自信度: 9/10**

**理由**:
- RDDが明確で、技術スタックも確定している
- lottie-reactは成熟したライブラリで実装パターンが確立されている
- Lottieアニメーションファイルも選定済み（Lottie Simple License、商用利用可）
- -1点の理由: アニメーションファイルのサイズ・表示品質は実際に動かして確認が必要
