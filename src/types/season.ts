/**
 * 季節関連の型定義とユーティリティ定数
 *
 * このモジュールは季節（春・夏・秋・冬）を型安全に扱うための
 * 型定義と関連する定数マップを提供する
 *
 * @module types/season
 */

/**
 * 季節を表すリテラル型
 *
 * 4つの季節（春・夏・秋・冬）を列挙する
 * RDD §機能要件に基づき、4つの季節を定義
 */
export type Season = 'spring' | 'summer' | 'autumn' | 'winter';

/**
 * 全ての季節を配列として保持
 *
 * UIでのボタン生成やバリデーションに使用する
 * as constでリテラル型を維持
 */
export const SEASONS: readonly Season[] = [
  'spring',
  'summer',
  'autumn',
  'winter',
] as const;

/**
 * 季節の表示名マップ
 *
 * ボタンラベル等で日本語表示に使用する
 * RDD §デザイン方針「春」「夏」「秋」「冬」の順に対応
 */
export const SEASON_LABELS: Record<Season, string> = {
  spring: '春',
  summer: '夏',
  autumn: '秋',
  winter: '冬',
} as const;

/**
 * 季節ごとのLottieファイルパスマップ
 *
 * publicディレクトリからの相対パス
 * RDD §制約に基づき、命名規則に従う
 */
export const SEASON_LOTTIE_PATHS: Record<Season, string> = {
  spring: '/lottie/spring.json',
  summer: '/lottie/summer.json',
  autumn: '/lottie/autumn.json',
  winter: '/lottie/winter.json',
} as const;

/**
 * デフォルトの季節（アプリ起動時の初期値）
 *
 * RDD §ユースケースに基づき、初期状態は「春」
 */
export const DEFAULT_SEASON: Season = 'spring';
