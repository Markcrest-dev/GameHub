import React, { useState, useEffect, useRef, useCallback } from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import * as Haptics from 'expo-haptics';
import {
  createBoard, randomPiece, canPlace, placePiece,
  clearLines, getScore, getDisplayBoard, BOARD_W, BOARD_H,
} from '../games/tetris';
import { useHighScore } from '../hooks/useHighScore';
import GameHeader from '../components/GameHeader';
import GameOverModal from '../components/GameOverModal';
import RetroButton from '../components/RetroButton';
import { COLORS } from '../theme/colors';

const { width } = Dimensions.get('window');
const CELL = Math.floor((width - 32) / BOARD_W);

function createGameState() {
  const board = createBoard();
  const piece = randomPiece();
  const next = randomPiece();
  return { board, piece, next, score: 0, level: 0, lines: 0, over: false };
}

export default function TetrisScreen({ navigation }) {
  const [gs, setGs] = useState(createGameState());
  const [started, setStarted] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [highScore, saveHighScore] = useHighScore('tetris');

  const gsRef = useRef(gs);
  const intervalRef = useRef(null);
  gsRef.current = gs;

  const getSpeed = (level) => Math.max(100, 800 - level * 70);

  const stopLoop = () => {
    if (intervalRef.current) { clearInterval(intervalRef.current); intervalRef.current = null; }
  };

  const step = useCallback(() => {
    const { board, piece, next, score, level, lines } = gsRef.current;
    if (canPlace(board, piece, 0, 1)) {
      setGs(prev => ({ ...prev, piece: { ...prev.piece, y: prev.piece.y + 1 } }));
    } else {
      const newBoard = placePiece(board, piece);
      const { board: cleared, linesCleared } = clearLines(newBoard);
      const addScore = getScore(linesCleared, level);
      const newLines = lines + linesCleared;
      const newLevel = Math.floor(newLines / 10);
      const newPiece = next;
      const newNext = randomPiece();
      if (!canPlace(cleared, newPiece, 0, 0)) {
        const finalScore = score + addScore;
        saveHighScore(finalScore);
        setGs(prev => ({ ...prev, over: true, score: finalScore }));
        stopLoop();
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        setTimeout(() => setShowModal(true), 300);
        return;
      }
      if (linesCleared > 0) Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      const newGs = { board: cleared, piece: newPiece, next: newNext, score: score + addScore, level: newLevel, lines: newLines, over: false };
      setGs(newGs);
      if (newLevel > level) {
        stopLoop();
        intervalRef.current = setInterval(step, getSpeed(newLevel));
      }
    }
  }, []);

  const startLoop = useCallback((level = 0) => {
    stopLoop();
    intervalRef.current = setInterval(step, getSpeed(level));
  }, [step]);

  useEffect(() => stopLoop, []);

  const handleStart = () => {
    const newGs = createGameState();
    setGs(newGs);
    setShowModal(false);
    setStarted(true);
    startLoop(0);
  };

  const move = (dx) => {
    setGs(prev => {
      if (!canPlace(prev.board, prev.piece, dx, 0)) return prev;
      return { ...prev, piece: { ...prev.piece, x: prev.piece.x + dx } };
    });
  };

  const rotate = () => {
    setGs(prev => {
      if (!canPlace(prev.board, prev.piece, 0, 0, 1)) return prev;
      return { ...prev, piece: { ...prev.piece, rotation: (prev.piece.rotation + 1) % 4 } };
    });
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const drop = () => {
    setGs(prev => {
      let dy = 0;
      while (canPlace(prev.board, prev.piece, 0, dy + 1)) dy++;
      return { ...prev, piece: { ...prev.piece, y: prev.piece.y + dy } };
    });
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
  };

  const display = getDisplayBoard(gs.board, gs.over ? null : gs.piece);

  return (
    <View style={styles.container}>
      <GameHeader title="TETRIS" onBack={() => { stopLoop(); navigation.goBack(); }} color={COLORS.neonCyan} />

      <View style={styles.scoreRow}>
        <View style={styles.scoreBlock}>
          <Text style={styles.scoreLabel}>SCORE</Text>
          <Text style={[styles.scoreVal, { color: COLORS.neonCyan }]}>{String(gs.score).padStart(6, '0')}</Text>
        </View>
        <View style={styles.scoreBlock}>
          <Text style={styles.scoreLabel}>LEVEL</Text>
          <Text style={[styles.scoreVal, { color: COLORS.neonPink }]}>{gs.level}</Text>
        </View>
        <View style={styles.scoreBlock}>
          <Text style={styles.scoreLabel}>LINES</Text>
          <Text style={[styles.scoreVal, { color: COLORS.neonYellow }]}>{gs.lines}</Text>
        </View>
      </View>

      <View style={styles.mainArea}>
        <View style={[styles.board, { borderColor: COLORS.neonCyan }]}>
          {display.map((row, r) => (
            <View key={r} style={styles.row}>
              {row.map((cell, c) => (
                <View key={c} style={[styles.cell, cell ? { backgroundColor: cell, borderColor: cell + '88' } : {}]} />
              ))}
            </View>
          ))}
        </View>
      </View>

      {!started && !showModal && (
        <View style={styles.overlay}>
          <RetroButton label="START GAME" onPress={handleStart} color={COLORS.neonCyan} />
        </View>
      )}

      <View style={styles.controls}>
        <View style={styles.controlRow}>
          <TouchableOpacity style={styles.ctrlBtn} onPress={() => move(-1)}>
            <Text style={styles.ctrlText}>◀</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.ctrlBtn} onPress={rotate}>
            <Text style={styles.ctrlText}>↻</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.ctrlBtn} onPress={() => move(1)}>
            <Text style={styles.ctrlText}>▶</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={[styles.ctrlBtn, styles.dropBtn]} onPress={drop}>
          <Text style={styles.ctrlText}>▼ DROP</Text>
        </TouchableOpacity>
      </View>

      <GameOverModal
        visible={showModal}
        score={gs.score}
        highScore={highScore}
        isNewHigh={gs.score > 0 && gs.score >= highScore}
        onPlayAgain={handleStart}
        onHome={() => navigation.goBack()}
        color={COLORS.neonCyan}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  scoreRow: { flexDirection: 'row', justifyContent: 'space-around', paddingVertical: 8 },
  scoreBlock: { alignItems: 'center' },
  scoreLabel: { fontFamily: 'PressStart2P', fontSize: 7, color: COLORS.gray },
  scoreVal: { fontFamily: 'PressStart2P', fontSize: 12 },
  mainArea: { alignItems: 'center' },
  board: { borderWidth: 1 },
  row: { flexDirection: 'row' },
  cell: { width: CELL, height: CELL, borderWidth: 0.5, borderColor: '#1a1a1a', backgroundColor: '#0a0a0a' },
  overlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.75)' },
  controls: { alignItems: 'center', paddingTop: 12, gap: 8 },
  controlRow: { flexDirection: 'row', gap: 16 },
  ctrlBtn: { backgroundColor: COLORS.surface, borderWidth: 1, borderColor: COLORS.neonCyan, paddingHorizontal: 20, paddingVertical: 12, minWidth: 64, alignItems: 'center' },
  dropBtn: { minWidth: 140 },
  ctrlText: { fontFamily: 'PressStart2P', fontSize: 12, color: COLORS.neonCyan },
});
