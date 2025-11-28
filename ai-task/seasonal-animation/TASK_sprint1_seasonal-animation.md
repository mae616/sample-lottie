# TASK: Sprint 1 - 環境構築・依存関係セットアップ

**作成日**: 2025-01-28
**RDD参照**: `doc/rdd.md` §技術スタック, §制約
**スプリント目的**: lottie-react を使える状態にし、アニメーションファイルを配置する

---

## TASK-1.1: lottie-react パッケージのインストール

### 目的/DoD
- lottie-react パッケージが `package.json` に追加されている
- `pnpm install` が正常に完了する
- `pnpm lint && pnpm build` がエラーなく通る

### RDD参照
- `doc/rdd.md` §技術スタック: lottie-react（Lottie アニメーションを React で扱うためのデファクトスタンダードライブラリ）
- `doc/rdd.md` §制約: lottie-react ライブラリ（npm経由）

### 技術スタック（固定）
- **パッケージ**: `lottie-react` v2.4.1（MIT License）
- **依存**: `lottie-web`（内部依存）
- **Peer Dependencies**: React >=16.8.0, React-DOM >=16.8.0（既存プロジェクトで満たしている）

### 重要コンテキスト

#### 公式ドキュメント
- npm: https://www.npmjs.com/package/lottie-react
- 公式Doc: https://lottiereact.com/
- GitHub: https://github.com/Gamote/lottie-react

#### ライブラリ評価（採用条件の確認）
| 項目 | 状態 | 備考 |
|------|------|------|
| GitHub ⭐ | 1.4k+ | 採用条件（⭐1k+）を満たす |
| 直近6ヶ月更新 | ✅ | 2024年に更新あり、v3開発中 |
| ライセンス | MIT | 健全 |
| 週間DL数 | 200k+ | デファクトスタンダード |

#### 基本使用例
```tsx
import Lottie from "lottie-react";
import animationData from "./animation.json";

/**
 * Lottieアニメーションを表示するコンポーネント
 * @param animationData - Lottie JSONデータ
 * @param loop - ループ再生するか（デフォルト: true）
 */
const Example = () => {
  return <Lottie animationData={animationData} loop={true} />;
};
```

### 実装ブループリント

```bash
# 1. lottie-react をインストール
pnpm add lottie-react

# 2. 検証: package.json に追加されたことを確認
cat package.json | grep lottie-react

# 3. 型定義確認（lottie-reactは組み込み型定義あり）
# @types/lottie-react は不要
```

### 検証ゲート

```bash
# 依存関係のインストール
pnpm add lottie-react

# Lint実行
pnpm lint

# ビルド実行（型チェック含む）
pnpm build
```

### エラーハンドリング/ロールバック

- **インストール失敗時**: `pnpm store prune && pnpm install` で再試行
- **型エラー発生時**: TypeScriptバージョンの互換性確認（現在: ~5.9.3で問題なし）
- **ロールバック**: `git checkout package.json pnpm-lock.yaml && pnpm install`

### 決定理由
RDDで指定されたlottie-reactライブラリを採用。MIT License、GitHub ⭐1.4k+、直近更新あり、週間DL 200k+でデファクトスタンダードの条件を満たす。

---

## TASK-1.2: Lottieアニメーションファイルの配置

### 目的/DoD
- `public/lottie/` ディレクトリが作成されている
- 4つの季節アニメーションファイルが配置されている
  - `public/lottie/spring.json`
  - `public/lottie/summer.json`
  - `public/lottie/autumn.json`
  - `public/lottie/winter.json`
- 各ファイルが有効なLottie JSONであること

### RDD参照
- `doc/rdd.md` §制約:
  - 配置場所: `public/lottie/` ディレクトリ
  - 命名規則: `spring.json`, `summer.json`, `autumn.json`, `winter.json`
  - 取得方法: LottieFiles 等の無料リソースから取得（商用利用可能なライセンスのものを選択）

### 技術スタック（固定）
- **ファイル形式**: Lottie JSON（.json）
- **ライセンス**: Lottie Simple License（商用利用可）
- **取得元**: LottieFiles

### 重要コンテキスト

#### 選定済みアニメーションファイル（TASK-LISTより）

| 季節 | ファイル名 | アニメーション | URL | 選定理由 |
|------|-----------|---------------|-----|----------|
| 春 | `spring.json` | Sakura Fall | https://lottiefiles.com/free-animation/sakura-fall-XXiyvafWbf | 桜の花びらが舞う、日本の春を象徴 |
| 夏 | `summer.json` | Happy SUN | https://lottiefiles.com/free-animation/happy-sun-gRGQ96oFlm | 明るい太陽、背景向きのシンプルさ |
| 秋 | `autumn.json` | Autumn Fall | https://lottiefiles.com/free-animation/autumn-fall-HJWHqoNhA2 | 落ち葉が舞う、秋を象徴 |
| 冬 | `winter.json` | Snowflakes | https://lottiefiles.com/free-animation/snowflakes-MNJ7iP63h0 | 雪の結晶、DL数1.1Kで人気 |

#### ダウンロード手順
1. 上記URLにアクセス
2. "Download" → "Lottie JSON" を選択
3. ダウンロードしたファイルを指定のファイル名にリネーム
4. `public/lottie/` に配置

#### 代替候補（差し替え可能）
- 春: [Cherry Blossom](https://lottiefiles.com/free-animation/cherry-blossom-CgLg3fvsV5)
- 夏: [Summer Vibes](https://lottiefiles.com/free-animation/summer-vibes-o6BVQ71FEX)
- 秋: [Leaves Falling](https://lottiefiles.com/free-animation/leaves-falling-PeCv6JNmtl)
- 冬: [Snow Fall](https://lottiefiles.com/free-animation/snow-fall-4W3xu04YDa)

### 実装ブループリント

```bash
# 1. ディレクトリ作成
mkdir -p public/lottie

# 2. アニメーションファイルをダウンロード・配置
# （手動でLottieFilesからダウンロードし、リネームして配置）

# 3. ファイル存在確認
ls -la public/lottie/
# 期待出力:
# spring.json
# summer.json
# autumn.json
# winter.json

# 4. JSON形式の検証（オプション）
for f in public/lottie/*.json; do
  python3 -m json.tool "$f" > /dev/null && echo "$f: valid" || echo "$f: invalid"
done
```

### 検証ゲート

```bash
# ディレクトリとファイルの存在確認
ls -la public/lottie/

# 期待される出力:
# spring.json
# summer.json
# autumn.json
# winter.json
# （4つのJSONファイルが存在すること）

# ファイルサイズ確認（0バイトでないこと）
du -h public/lottie/*.json
```

### エラーハンドリング/ロールバック

- **ダウンロード失敗時**: 代替候補のURLを使用
- **JSON形式エラー時**: LottieFilesで再ダウンロード、またはLottie Editorで検証
- **ロールバック**: `rm -rf public/lottie/`

### 難所検証方針

アニメーションファイルが正しく読み込めるか確認するため、TASK-1.1完了後に最小サンプルで検証可能。

```tsx
// samples/sample_lottie_load.tsx（一時利用・削除可）
import Lottie from "lottie-react";
// publicフォルダからの読み込みテスト用
// 実際は fetch または import で読み込み

/**
 * Lottieファイル読み込みの最小検証サンプル
 * 目的: アニメーションファイルが正しく配置・読み込みできるか確認
 * 実行: pnpm dev で起動後、このコンポーネントを表示
 * 期待結果: アニメーションが表示される
 * 解決後は削除可
 */
```

### サンプル運用
- 配置: `src/samples/sample_lottie_load.tsx`（Reactコンポーネントとして実行可能）
- 命名規則: `sample_{short-purpose}.tsx`
- ビルド/テスト除外: 本番ビルドからは除外（必要に応じて）
- 削除: 検証完了後、同PRで削除

### 決定理由
RDDで指定された配置場所（`public/lottie/`）と命名規則に従う。Lottie Simple Licenseで商用利用可能なアニメーションを選定済み。

---

## TASK-1.3: 環境検証（型チェック・ビルド確認）

### 目的/DoD
- `pnpm build` がエラーなく完了する
- TypeScript の型チェックがパスする
- lottie-react の型定義が正しく認識される

### RDD参照
- `doc/rdd.md` §技術スタック: TypeScript 5.9.3

### 技術スタック（固定）
- TypeScript ~5.9.3
- Vite 7.2.4
- React 19.2.0

### 重要コンテキスト

#### 現在のプロジェクト構成
```
/workspace
├── package.json          # 依存関係管理
├── tsconfig.json         # TypeScript設定（ルート）
├── tsconfig.app.json     # アプリ用TypeScript設定
├── tsconfig.node.json    # Node.js用TypeScript設定
├── vite.config.ts        # Vite設定
├── src/
│   ├── main.tsx          # エントリーポイント
│   ├── App.tsx           # メインコンポーネント
│   ├── App.css
│   └── index.css
└── public/
    ├── vite.svg
    └── lottie/           # TASK-1.2で作成
        ├── spring.json
        ├── summer.json
        ├── autumn.json
        └── winter.json
```

#### lottie-react の型定義
- lottie-react v2.4.1 は TypeScript 型定義を内包
- `@types/lottie-react` は不要

### 実装ブループリント

```bash
# 1. ビルド実行（tsc + vite build）
pnpm build

# 2. 型チェックのみ実行（オプション）
pnpm exec tsc --noEmit

# 3. エラーがあれば対処
# - 型エラー: 該当箇所を修正
# - 依存エラー: pnpm install を再実行
```

### 検証ゲート

```bash
# ビルド実行（型チェック含む）
pnpm build

# 期待される結果:
# - tsc -b が成功（TypeScriptコンパイル）
# - vite build が成功（バンドル作成）
# - dist/ ディレクトリが生成される
```

### エラーハンドリング/ロールバック

- **型エラー発生時**: エラーメッセージを確認し、該当箇所を修正
- **依存解決エラー**: `rm -rf node_modules pnpm-lock.yaml && pnpm install`
- **ロールバック**: TASK-1.1の状態に戻す

### 依存関係
- TASK-1.1: lottie-react パッケージのインストール（必須）

### 決定理由
TypeScript環境での型整合性確認。lottie-react は型定義を内包しているため、追加の型定義パッケージは不要。

---

## 品質チェックリスト

- [x] RDD/Architecture/Design 準拠
- [x] 重複回避が明記されている（新規セットアップのため重複なし）
- [x] 参照URL・コードスニペットが実在
  - https://www.npmjs.com/package/lottie-react
  - https://lottiereact.com/
  - https://lottiefiles.com/
- [x] 検証ゲートが実行可能
- [x] 実装パス（擬似コード/手順）が明確
- [x] エラーハンドリング/ロールバック記述
- [x] 変更要求なし（RDD準拠）
- [x] 最小サンプル検証の計画がある（TASK-1.2）
- [x] サンプル運用が明記されている

---

## 自己評価

**成功自信度: 9/10**

**理由**:
- lottie-react は成熟したライブラリで、インストールは straightforward
- 型定義も内包されており、TypeScriptとの統合に問題なし
- Lottieアニメーションファイルも選定済み（ライセンス確認済み）
- -1点の理由: アニメーションファイルのサイズ・表示品質は実際に確認が必要

---

## 次の一手（Sprint 1 完了後）

1. **Sprint 2 に進む**: 季節の型定義を作成（TASK-2.1）
2. **動作確認**: dev serverを起動し、lottie-reactの基本動作を確認
3. **最小サンプル作成**（必要時）: Lottieファイル読み込みの検証

---

## 実行履歴

### 2025-11-29 実行記録

#### TASK-1.1: lottie-react パッケージのインストール
- **ステータス**: ✅ 完了
- **実行内容**: `pnpm add lottie-react` でインストール
- **結果**: lottie-react v2.4.1 が正常にインストールされた
- **検証**: `pnpm lint` パス

#### TASK-1.2: Lottieアニメーションファイルの配置
- **ステータス**: ✅ 完了
- **実行内容**:
  - `public/lottie/` ディレクトリを作成
  - 4つの季節アニメーションファイルを配置（ユーザーが手動ダウンロード）
- **配置ファイル**:
  - `spring.json` (132KB) - 桜の花びらが舞うアニメーション
  - `summer.json` (40KB) - 太陽のアニメーション
  - `autumn.json` (152KB) - 落ち葉のアニメーション
  - `winter.json` (768KB) - 雪の結晶のアニメーション
- **検証**: 全ファイルが有効なJSON形式であることを確認

#### TASK-1.3: 環境検証（型チェック・ビルド確認）
- **ステータス**: ✅ 完了
- **実行内容**: `pnpm build` でビルド実行
- **結果**:
  - TypeScript コンパイル成功
  - Vite ビルド成功（dist/ 生成）
  - 32モジュール変換、1.30秒で完了

---

# TASK結果: Sprint 1 - 環境構築・依存関係セットアップ

- **実行スプリント**: Sprint 1
- **RDD整合**: OK（根拠: doc/rdd.md §技術スタック, §制約）
- **変更要求**: 無
- **検証結果**: lint/build すべてPASS
- **差分要約**:
  - lottie-react v2.4.1 を依存関係に追加
  - public/lottie/ に4つの季節アニメーションファイルを配置
  - ビルド・型チェック正常動作を確認
- **次の一手**:
  1. Sprint 2 に進む（TASK-2.1: 季節の型定義作成）
  2. dev serverを起動してlottie-reactの基本動作を確認
  3. 必要に応じて最小サンプルでLottie読み込み検証

## 品質チェックリスト（Sprint 1）

- [x] RDD準拠（スタック/制約に一致）
- [x] 重複コードを作らず既存パターンを再利用（新規セットアップのため該当なし）
- [x] 検証ゲート（lint/build）がPASS
- [x] 技術的負債が記録され、次スプリントに回されている（なし）
- [x] 完了報告に差分要約と次の一手を記載
- [x] タスクファイルに進捗状況と完了報告が追記されている

## 自己評価（実行後）

**成功自信度: 10/10**

**理由**:
- 全てのタスクが計画通りに完了
- lottie-react のインストールとビルドが問題なく成功
- アニメーションファイルも全て有効なJSON形式で配置完了
- RDD準拠を維持
