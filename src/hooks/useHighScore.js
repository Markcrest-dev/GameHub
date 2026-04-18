import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export function useHighScore(gameName) {
  const [highScore, setHighScore] = useState(0);
  const key = `@gamehub_hs_${gameName}`;

  useEffect(() => {
    AsyncStorage.getItem(key).then((val) => {
      if (val !== null) setHighScore(parseInt(val, 10));
    }).catch(() => {});
  }, [key]);

  const saveHighScore = useCallback(async (score) => {
    if (score > highScore) {
      setHighScore(score);
      try {
        await AsyncStorage.setItem(key, String(score));
      } catch {}
    }
  }, [highScore, key]);

  return [highScore, saveHighScore];
}
