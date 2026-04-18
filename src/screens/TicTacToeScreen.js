import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import * as Haptics from 'expo-haptics';
import { createBoard, checkWinner, isDraw, getBestMove } from '../games/tictactoe';
import GameHeader from '../components/GameHeader';
import RetroButton from '../components/RetroButton';
import { COLORS } from '../theme/colors';

function Cell({ value, index, onPress, winLine, isWinCell }) {
  const scale = useRef(new Animated.Value(value ? 0.5 : 1)).current;

  useEffect(() => {
    if (value) {
      Animated.spring(scale, { toValue: 1, friction: 5, useNativeDriver: true }).start();
    }
  }, [value]);

  const color = value === 'X' ? COLORS.neonCyan : COLORS.neonPink;

  return (
    <TouchableOpacity onPress={onPress} style={[styles.cell, isWinCell && { backgroundColor: COLORS.dimGreen }]}>
      <Animated.Text style={[styles.cellText, { color, transform: [{ scale }] }]}>
        {value || ''}
      </Animated.Text>
    </TouchableOpacity>
  );
}

export default function TicTacToeScreen({ navigation }) {
  const [board, setBoard] = useState(createBoard());
  const [xIsNext, setXIsNext] = useState(true);
  const [vsAI, setVsAI] = useState(true);
  const [status, setStatus] = useState('');
  const [winResult, setWinResult] = useState(null);
  const [scores, setScores] = useState({ X: 0, O: 0, draw: 0 });
  const aiTimer = useRef(null);

  const getStatusText = (b, nextX, wr) => {
    if (wr) return wr.winner === 'X' ? 'PLAYER X WINS!' : (vsAI ? 'AI WINS!' : 'PLAYER O WINS!');
    if (isDraw(b)) return "IT'S A DRAW!";
    return nextX ? 'PLAYER X TURN' : (vsAI ? 'AI THINKING...' : 'PLAYER O TURN');
  };

  const endGame = (b, wr) => {
    if (wr) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      setScores(prev => ({ ...prev, [wr.winner]: prev[wr.winner] + 1 }));
    } else if (isDraw(b)) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
      setScores(prev => ({ ...prev, draw: prev.draw + 1 }));
    }
  };

  const handlePress = (index) => {
    if (board[index] || winResult || isDraw(board)) return;
    if (vsAI && !xIsNext) return;

    const newBoard = [...board];
    newBoard[index] = xIsNext ? 'X' : 'O';
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    const wr = checkWinner(newBoard);
    setBoard(newBoard);
    setWinResult(wr);
    const nextX = !xIsNext;
    setXIsNext(nextX);
    setStatus(getStatusText(newBoard, nextX, wr));

    if (wr || isDraw(newBoard)) {
      endGame(newBoard, wr);
      return;
    }

    if (vsAI && nextX === false) {
      aiTimer.current = setTimeout(() => {
        const aiBoard = [...newBoard];
        const aiMove = getBestMove(aiBoard);
        if (aiMove === -1) return;
        aiBoard[aiMove] = 'O';
        const aiWr = checkWinner(aiBoard);
        setBoard(aiBoard);
        setWinResult(aiWr);
        setXIsNext(true);
        setStatus(getStatusText(aiBoard, true, aiWr));
        if (aiWr || isDraw(aiBoard)) endGame(aiBoard, aiWr);
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }, 400);
    }
  };

  useEffect(() => () => { if (aiTimer.current) clearTimeout(aiTimer.current); }, []);

  const reset = () => {
    if (aiTimer.current) clearTimeout(aiTimer.current);
    const b = createBoard();
    setBoard(b);
    setXIsNext(true);
    setWinResult(null);
    setStatus('PLAYER X TURN');
  };

  const toggleMode = () => {
    setVsAI(prev => !prev);
    reset();
  };

  useEffect(() => { setStatus('PLAYER X TURN'); }, [vsAI]);

  return (
    <View style={styles.container}>
      <GameHeader title="TIC TAC TOE" onBack={() => navigation.goBack()} color={COLORS.neonPink} />

      <View style={styles.modeRow}>
        <RetroButton
          label={vsAI ? 'VS AI' : '2 PLAYER'}
          onPress={toggleMode}
          color={COLORS.neonPink}
        />
      </View>

      <View style={styles.scoreBoard}>
        <View style={styles.scoreItem}>
          <Text style={[styles.playerLabel, { color: COLORS.neonCyan }]}>X</Text>
          <Text style={[styles.playerScore, { color: COLORS.neonCyan }]}>{scores.X}</Text>
        </View>
        <View style={styles.scoreItem}>
          <Text style={styles.playerLabel}>DRAW</Text>
          <Text style={styles.playerScore}>{scores.draw}</Text>
        </View>
        <View style={styles.scoreItem}>
          <Text style={[styles.playerLabel, { color: COLORS.neonPink }]}>O</Text>
          <Text style={[styles.playerScore, { color: COLORS.neonPink }]}>{scores.O}</Text>
        </View>
      </View>

      <Text style={styles.status}>{status || 'PLAYER X TURN'}</Text>

      <View style={styles.grid}>
        {board.map((val, i) => (
          <Cell
            key={i}
            value={val}
            index={i}
            onPress={() => handlePress(i)}
            isWinCell={winResult?.line?.includes(i)}
          />
        ))}
      </View>

      {(winResult || isDraw(board)) && (
        <View style={styles.resetRow}>
          <RetroButton label="PLAY AGAIN" onPress={reset} color={COLORS.neonPink} />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background, alignItems: 'center' },
  modeRow: { paddingVertical: 12 },
  scoreBoard: { flexDirection: 'row', gap: 40, marginBottom: 8 },
  scoreItem: { alignItems: 'center', gap: 4 },
  playerLabel: { fontFamily: 'PressStart2P', fontSize: 10, color: COLORS.gray },
  playerScore: { fontFamily: 'PressStart2P', fontSize: 22, color: COLORS.gray },
  status: { fontFamily: 'PressStart2P', fontSize: 9, color: COLORS.neonYellow, marginBottom: 20, textAlign: 'center', paddingHorizontal: 20 },
  grid: { width: 300, height: 300, flexDirection: 'row', flexWrap: 'wrap' },
  cell: {
    width: 100, height: 100,
    borderWidth: 1.5, borderColor: COLORS.border,
    alignItems: 'center', justifyContent: 'center',
    backgroundColor: COLORS.surface,
  },
  cellText: { fontFamily: 'PressStart2P', fontSize: 36 },
  resetRow: { marginTop: 24 },
});
