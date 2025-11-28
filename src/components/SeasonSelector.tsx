/**
 * 季節選択コンポーネント
 *
 * 4つの季節ボタンを横並びで表示し、
 * ユーザーの選択を親コンポーネントに通知する
 *
 * @module components/SeasonSelector
 */

import React from 'react';
import type { Season } from '../types/season';
import { SEASONS, SEASON_LABELS } from '../types/season';

/**
 * SeasonSelectorコンポーネントのProps
 */
interface SeasonSelectorProps {
  /** 現在選択されている季節 */
  currentSeason: Season;
  /** 季節変更時のコールバック */
  onSeasonChange: (season: Season) => void;
}

/**
 * 季節選択コンポーネント
 *
 * 4つの季節ボタンを横並びで表示し、
 * ユーザーの選択を親コンポーネントに通知する
 *
 * RDD §機能要件:
 * - 4つの季節ボタン（春・夏・秋・冬）の表示
 * - ボタンのアクティブ状態の視覚的フィードバック
 *
 * RDD §デザイン方針:
 * - ボタンは画面上部に横並びで配置
 * - 「春」「夏」「秋」「冬」の順
 *
 * @param props.currentSeason - 現在選択中の季節
 * @param props.onSeasonChange - 季節変更時のコールバック関数
 * @returns 季節選択ボタン群
 */
export const SeasonSelector: React.FC<SeasonSelectorProps> = ({
  currentSeason,
  onSeasonChange,
}) => {
  return (
    <nav className="season-selector" aria-label="季節選択">
      {SEASONS.map((season) => (
        <button
          key={season}
          type="button"
          className={`season-selector__button ${
            currentSeason === season ? 'season-selector__button--active' : ''
          }`}
          onClick={() => onSeasonChange(season)}
          aria-pressed={currentSeason === season}
        >
          {SEASON_LABELS[season]}
        </button>
      ))}
    </nav>
  );
};
