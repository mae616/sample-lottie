/**
 * Lottieアニメーション背景コンポーネント
 *
 * 指定された季節に対応するLottieアニメーションを
 * 画面全体の背景として表示する
 *
 * @module components/LottieBackground
 */

import type { FC } from 'react';
import { useEffect, useState } from 'react';
import Lottie from 'lottie-react';
import type { Season } from '../types/season';
import { SEASON_LOTTIE_PATHS } from '../types/season';

/**
 * LottieBackgroundコンポーネントのProps
 */
interface LottieBackgroundProps {
  /** 表示する季節 */
  season: Season;
}

/**
 * Lottieアニメーション背景コンポーネント
 *
 * 指定された季節に対応するLottieアニメーションを
 * 画面全体の背景として表示する
 *
 * RDD §機能要件:
 * - 選択された季節のLottieアニメーション背景を画面いっぱいに表示
 * - アニメーションのループ再生
 *
 * @param props.season - 表示する季節
 * @returns Lottie背景コンポーネント
 */
export const LottieBackground: FC<LottieBackgroundProps> = ({
  season,
}) => {
  // アニメーションデータの状態管理
  const [animationData, setAnimationData] = useState<unknown>(null);
  // ローディング状態（エラーハンドリング用）
  const [isLoading, setIsLoading] = useState(true);
  // エラー状態
  const [error, setError] = useState<string | null>(null);

  // 季節変更時にLottieファイルを取得
  useEffect(() => {
    /**
     * Lottieアニメーションファイルを非同期で読み込む
     *
     * Viteではpublic/内のファイルはfetchで取得する必要がある
     * import()はsrc/内のファイルに対して使用
     */
    const loadAnimation = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const path = SEASON_LOTTIE_PATHS[season];
        const response = await fetch(path);

        if (!response.ok) {
          throw new Error(`Failed to load animation: ${response.status}`);
        }

        const data: unknown = await response.json();
        setAnimationData(data);
      } catch (err) {
        // RDD §非機能要件: エラー時はコンソールに出力
        console.error('Lottieアニメーション読み込みエラー:', err);
        setError(
          err instanceof Error ? err.message : '読み込みに失敗しました'
        );
      } finally {
        setIsLoading(false);
      }
    };

    void loadAnimation();
  }, [season]);

  // エラー時の表示（RDD §非機能要件: ユーザーには簡易的なエラー表示）
  if (error) {
    return (
      <div className="lottie-background lottie-background--error">
        <p>アニメーションを読み込めませんでした</p>
      </div>
    );
  }

  // ローディング中
  if (isLoading || !animationData) {
    return <div className="lottie-background lottie-background--loading" />;
  }

  return (
    <div className="lottie-background">
      <Lottie
        animationData={animationData}
        loop={true}
        autoplay={true}
        style={{
          width: '100%',
          height: '100%',
        }}
      />
    </div>
  );
};
