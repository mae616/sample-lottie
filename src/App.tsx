/**
 * アプリケーションのルートコンポーネント
 *
 * 季節の状態を管理し、選択された季節に応じた
 * Lottieアニメーション背景を表示する
 *
 * @module App
 */

import { useState } from 'react';
import { LottieBackground } from './components/LottieBackground';
import { SeasonSelector } from './components/SeasonSelector';
import type { Season } from './types/season';
import { DEFAULT_SEASON } from './types/season';
import './App.css';

/**
 * アプリケーションのルートコンポーネント
 *
 * 季節の状態を管理し、選択された季節に応じた
 * Lottieアニメーション背景を表示する
 *
 * RDD §機能要件:
 * - ボタンクリックによる季節状態の管理（React state）
 *
 * RDD §ユースケース:
 * - アプリを開く → 初期状態（春）のアニメーション背景が表示される
 * - ユーザーが任意の季節ボタンをクリック → 選択された季節のアニメーション背景に切り替わる
 *
 * @returns アプリケーションルート
 */
function App() {
  // 現在の季節状態（RDD §ユースケース: 初期状態はデフォルトの春）
  const [currentSeason, setCurrentSeason] = useState<Season>(DEFAULT_SEASON);

  /**
   * 季節変更ハンドラ
   *
   * SeasonSelectorからの選択を受け取り、状態を更新する
   * RDD §ユースケース: ボタンクリックで背景を切り替え
   *
   * @param season - 選択された季節
   */
  const handleSeasonChange = (season: Season) => {
    setCurrentSeason(season);
  };

  return (
    <div className="app">
      {/* Lottieアニメーション背景 */}
      <LottieBackground season={currentSeason} />

      {/* 季節選択ボタン群（RDD §デザイン方針: 画面上部に横並びで配置） */}
      <header className="app__header">
        <SeasonSelector
          currentSeason={currentSeason}
          onSeasonChange={handleSeasonChange}
        />
      </header>
    </div>
  );
}

export default App;
