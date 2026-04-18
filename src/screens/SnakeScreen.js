import React, { useState, useEffect, useRef, useCallback } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { GestureDetector, Gesture } from 'react-native-gesture-handler';
import * as Haptics from 'expo-haptics';
import { createInitialState, tick, GRID_SIZE, OPPOSITE } from '../games/snake';
import { useHighScore } from '../hooks/useHighScore';
import GameHeader from '../components/GameHeader';
import GameOverModal from '../components/GameOverModal';
import RetroButton from '../components/RetroButton';
import { COLORS } from '../theme/colors';

const { width } = Dimensions.get('window');
const CELL = Math.floor((width - 32) / GRID_SIZE);

export default function SnakeScreen({ navigation }) {
  const [state, setState] = useState(createInitialState());
  const [started, setStarted] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [highScore, saveHighScore] = useHighScore('snake');

  const stateRef = useRef(state);
  const intervalRef = useRef(null);

  stateRef.current = state;

  const stopLoop = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  const startLoop = useCallback((speed) => {
    stopLoop();
    intervalRef.current = setInterval(() => {
      const next = tick(stateRef.current);
      setState(next);
      if (next.gameOver) {
        stopLoop();
        saveHighScore(next.score);
        setTimeout(() => setShowModal(true), 300);
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      }
    }, speed);
  }, []);

  useEffect(() => {
    if (started && !state.gameOver) {
      startLoop(state.speed);
    }
    return stopLoop;
  }, [state.speed, started]);

  useEffect(() => stopLoop, []);

  const changeDirection = useCallback((newDir) => {
    setState(prev => {
      if (newDir === OPPOSITE[prev.direction]) return prev;
      return { ...prev, direction: newDir };
    });
  }, []);

  const pan = Gesture.Pan()
    .minDistance(20)
    .onEnd((e) => {
      const { translationX: dx, translationY: dy } = e;
      if (Math.abs(dx) > Math.abs(dy)) {
        changeDirection(dx > 0 ? 'RIGHT' : 'LEFT');
      } else {
        changeDirection(dy > 0 ? 'DOWN' : 'UP');
      }
    })
    .runOnJS(true);

  const handleStart = () => {
    const s = createInitialState();
    setState(s);
    setShowModal(false);
    setStarted(true);
    startLoop(s.speed);
  };

  const { snake, food, score } = state;

  return (
    <View style={styles.container}>
      <GameHeader title="SNAKE" onBack={() => { stopLoop(); navigation.goBack(); }} color={COLORS.neonGreen} />

      <View style={styles.scoreRow}>
        <Text style={styles.scoreLabel}>SCORE</Text>
        <Text style={styles.scoreVal}>{String(score).padStart(6, '0')}</Text>
        <Text style={styles.scoreLabel}>BEST</Text>
        <Text style={[styles.scoreVal, { color: COLORS.gray }]}>{String(highScore).padStart(6, '0')}</Text>
      </View>

      <GestureDetector gesture={pan}>
        <View style={styles.board}>
          {Array(GRID_SIZE).fill(null).map((_, r) => (
            <View key={r} style={styles.row}>
              {Array(GRID_SIZE).fill(null).map((_, c) => {
                const isHead = snake[0].x === c && snake[0].y === r;
                const isBody = !isHead && snake.some(s => s.x === c && s.y === r);
                const isFood = food.x === c && food.y === r;
                return (
                  <View
                    key={c}
                    style={[
                      styles.cell,
                      isHead && styles.head,
                      isBody && styles.body,
                      isFood && styles.food,
                    ]}
                  />
                );
              })}
            </View>
          ))}
        </View>
      </GestureDetector>

      {!started && !showModal && (
        <View style={styles.startOverlay}>
          <RetroButton label="START GAME" onPress={handleStart} color={COLORS.neonGreen} />
        </View>
      )}

      <View style={styles.dpad}>
        <RetroButton label="▲" onPress={() => changeDirection('UP')} color={COLORS.neonGreen} style={styles.dpadBtn} />
        <View style={styles.dpadRow}>
          <RetroButton label="◀" onPress={() => changeDirection('LEFT')} color={COLORS.neonGreen} style={styles.dpadBtn} />
          <View style={styles.dpadCenter} />
          <RetroButton label="▶" onPress={() => changeDirection('RIGHT')} color={COLORS.neonGreen} style={styles.dpadBtn} />
        </View>
        <RetroButton label="▼" onPress={() => changeDirection('DOWN')} color={COLORS.neonGreen} style={styles.dpadBtn} />
      </View>

      <GameOverModal
        visible={showModal}
        score={score}
        highScore={highScore}
        isNewHigh={score > 0 && score >= highScore}
        onPlayAgain={handleStart}
        onHome={() => { navigation.goBack(); }}
        color={COLORS.neonGreen}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  scoreRow: { flexDirection: 'row', justifyContent: 'center', gap: 20, paddingVertical: 10, alignItems: 'center' },
  scoreLabel: { fontFamily: 'PressStart2P', fontSize: 8, color: COLORS.gray },
  scoreVal: { fontFamily: 'PressStart2P', fontSize: 14, color: COLORS.neonGreen },
  board: {
    alignSelf: 'center',
    borderWidth: 1,
    borderColor: COLORS.neonGreen,
  },
  row: { flexDirection: 'row' },
  cell: { width: CELL, height: CELL, borderWidth: 0.5, borderColor: '#111' },
  head: { backgroundColor: COLORS.neonGreen },
  body: { backgroundColor: '#004411' },
  food: { backgroundColor: COLORS.neonRed, borderRadius: CELL / 2 },
  startOverlay: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.7)',
  },
  dpad: { alignItems: 'center', marginTop: 16, gap: 4 },
  dpadRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  dpadBtn: { width: 56, height: 44 },
  dpadCenter: { width: 56 },
});
