import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, Dimensions, Animated } from 'react-native';
import { GestureDetector, Gesture } from 'react-native-gesture-handler';
import * as Haptics from 'expo-haptics';
import { createGrid, move, hasWon, isGameOver, tileColor, tileFontColor, SIZE } from '../games/game2048';
import { useHighScore } from '../hooks/useHighScore';
import GameHeader from '../components/GameHeader';
import GameOverModal from '../components/GameOverModal';
import RetroButton from '../components/RetroButton';
import { COLORS } from '../theme/colors';

const { width } = Dimensions.get('window');
const BOARD = width - 32;
const GAP = 6;
const CELL = (BOARD - GAP * (SIZE + 1)) / SIZE;

export default function Game2048Screen({ navigation }) {
  const [grid, setGrid] = useState(createGrid());
  const [score, setScore] = useState(0);
  const [won, setWon] = useState(false);
  const [over, setOver] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [highScore, saveHighScore] = useHighScore('2048');
  const scoreAnimRef = useRef(new Animated.Value(1)).current;

  const animateScore = () => {
    Animated.sequence([
      Animated.timing(scoreAnimRef, { toValue: 1.3, duration: 100, useNativeDriver: true }),
      Animated.timing(scoreAnimRef, { toValue: 1, duration: 100, useNativeDriver: true }),
    ]).start();
  };

  const handleMove = (direction) => {
    if (over || showModal) return;
    const result = move(grid, direction);
    if (!result.moved) return;
    setGrid(result.grid);
    setScore(prev => {
      const newScore = prev + result.score;
      if (result.score > 0) animateScore();
      saveHighScore(newScore);
      return newScore;
    });
    if (result.score > 0) Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (hasWon(result.grid) && !won) {
      setWon(true);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
    if (isGameOver(result.grid)) {
      setOver(true);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      setTimeout(() => setShowModal(true), 400);
    }
  };

  const pan = Gesture.Pan()
    .minDistance(30)
    .onEnd((e) => {
      const { translationX: dx, translationY: dy } = e;
      if (Math.abs(dx) > Math.abs(dy)) {
        handleMove(dx > 0 ? 'right' : 'left');
      } else {
        handleMove(dy > 0 ? 'down' : 'up');
      }
    })
    .runOnJS(true);

  const handleRestart = () => {
    setGrid(createGrid());
    setScore(0);
    setWon(false);
    setOver(false);
    setShowModal(false);
  };

  return (
    <View style={styles.container}>
      <GameHeader title="2048" onBack={() => navigation.goBack()} color={COLORS.neonYellow} />

      <View style={styles.topBar}>
        <Animated.View style={{ transform: [{ scale: scoreAnimRef }] }}>
          <Text style={styles.scoreLabel}>SCORE</Text>
          <Text style={[styles.scoreVal, { color: COLORS.neonYellow }]}>{String(score).padStart(6, '0')}</Text>
        </Animated.View>
        <View>
          <Text style={styles.scoreLabel}>BEST</Text>
          <Text style={[styles.scoreVal, { color: COLORS.gray }]}>{String(highScore).padStart(6, '0')}</Text>
        </View>
        <RetroButton label="NEW" onPress={handleRestart} color={COLORS.neonYellow} style={styles.newBtn} />
      </View>

      {won && !showModal && (
        <View style={styles.wonBanner}>
          <Text style={styles.wonText}>★ YOU REACHED 2048! ★</Text>
        </View>
      )}

      <GestureDetector gesture={pan}>
        <View style={styles.board}>
          {grid.map((row, r) =>
            row.map((val, c) => (
              <View
                key={`${r}-${c}`}
                style={[
                  styles.tile,
                  {
                    backgroundColor: val ? tileColor(val) : COLORS.surface,
                    borderColor: val ? tileColor(val) + '88' : COLORS.border,
                    left: GAP + c * (CELL + GAP),
                    top: GAP + r * (CELL + GAP),
                    width: CELL,
                    height: CELL,
                  },
                ]}
              >
                {val > 0 && (
                  <Text style={[
                    styles.tileText,
                    { color: tileFontColor(val), fontSize: val >= 1024 ? 14 : val >= 128 ? 16 : 20 },
                  ]}>
                    {val}
                  </Text>
                )}
              </View>
            ))
          )}
        </View>
      </GestureDetector>

      <Text style={styles.hint}>SWIPE TO MOVE TILES</Text>

      <GameOverModal
        visible={showModal}
        score={score}
        highScore={highScore}
        isNewHigh={score > 0 && score >= highScore}
        onPlayAgain={handleRestart}
        onHome={() => navigation.goBack()}
        color={COLORS.neonYellow}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  topBar: { flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', paddingVertical: 12, paddingHorizontal: 16 },
  scoreLabel: { fontFamily: 'PressStart2P', fontSize: 7, color: COLORS.gray, textAlign: 'center' },
  scoreVal: { fontFamily: 'PressStart2P', fontSize: 14, textAlign: 'center' },
  newBtn: { paddingHorizontal: 10, paddingVertical: 8 },
  wonBanner: { backgroundColor: COLORS.neonYellow + '22', borderTopWidth: 1, borderBottomWidth: 1, borderColor: COLORS.neonYellow, paddingVertical: 8 },
  wonText: { fontFamily: 'PressStart2P', fontSize: 9, color: COLORS.neonYellow, textAlign: 'center' },
  board: {
    alignSelf: 'center',
    width: BOARD,
    height: BOARD,
    backgroundColor: '#111',
    borderWidth: 1,
    borderColor: COLORS.neonYellow,
    position: 'relative',
  },
  tile: {
    position: 'absolute',
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tileText: {
    fontFamily: 'PressStart2P',
    fontWeight: 'bold',
  },
  hint: { fontFamily: 'PressStart2P', fontSize: 7, color: COLORS.gray, textAlign: 'center', marginTop: 16 },
});
