import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, Dimensions } from 'react-native';
import * as Haptics from 'expo-haptics';
import { createCards, flipCard, checkMatch, isGameComplete, calcMemoryScore, DIFFICULTIES } from '../games/memorycard';
import { useHighScore } from '../hooks/useHighScore';
import GameHeader from '../components/GameHeader';
import GameOverModal from '../components/GameOverModal';
import RetroButton from '../components/RetroButton';
import { COLORS } from '../theme/colors';

const { width } = Dimensions.get('window');

function Card({ card, onPress, disabled, cellSize }) {
  const flipAnim = useRef(new Animated.Value(card.isFlipped || card.isMatched ? 1 : 0)).current;

  useEffect(() => {
    Animated.timing(flipAnim, {
      toValue: card.isFlipped || card.isMatched ? 1 : 0,
      duration: 250,
      useNativeDriver: true,
    }).start();
  }, [card.isFlipped, card.isMatched]);

  const frontInterp = flipAnim.interpolate({ inputRange: [0, 0.5, 1], outputRange: ['0deg', '90deg', '0deg'] });
  const backInterp = flipAnim.interpolate({ inputRange: [0, 0.5, 1], outputRange: ['90deg', '0deg', '90deg'] });
  const showFront = flipAnim.interpolate({ inputRange: [0, 0.5, 0.501, 1], outputRange: [1, 1, 0, 0] });
  const showBack = flipAnim.interpolate({ inputRange: [0, 0.5, 0.501, 1], outputRange: [0, 0, 1, 1] });

  const borderColor = card.isMatched ? COLORS.neonGreen : COLORS.neonPink;

  return (
    <TouchableOpacity onPress={onPress} disabled={disabled || card.isMatched} style={{ width: cellSize, height: cellSize, padding: 3 }}>
      <Animated.View style={[styles.cardFace, { width: '100%', height: '100%', borderColor: COLORS.border, opacity: showFront, transform: [{ rotateY: frontInterp }] }]}>
        <Text style={styles.cardBack}>?</Text>
      </Animated.View>
      <Animated.View style={[styles.cardFace, styles.cardFront, { width: '100%', height: '100%', borderColor, position: 'absolute', left: 3, top: 3, opacity: showBack, transform: [{ rotateY: backInterp }] }]}>
        <Text style={styles.cardEmoji}>{card.emoji}</Text>
      </Animated.View>
    </TouchableOpacity>
  );
}

export default function MemoryCardScreen({ navigation }) {
  const [difficulty, setDifficulty] = useState(null);
  const [cards, setCards] = useState([]);
  const [flipped, setFlipped] = useState([]);
  const [moves, setMoves] = useState(0);
  const [startTime, setStartTime] = useState(null);
  const [elapsed, setElapsed] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [finalScore, setFinalScore] = useState(0);
  const [highScore, saveHighScore] = useHighScore('memory');
  const lockRef = useRef(false);
  const timerRef = useRef(null);

  const startGame = (diff) => {
    setDifficulty(diff);
    setCards(createCards(diff));
    setFlipped([]);
    setMoves(0);
    setElapsed(0);
    setShowModal(false);
    lockRef.current = false;
    const t = Date.now();
    setStartTime(t);
    timerRef.current = setInterval(() => setElapsed(Math.floor((Date.now() - t) / 1000)), 500);
  };

  useEffect(() => () => { if (timerRef.current) clearInterval(timerRef.current); }, []);

  const handleCardPress = (id) => {
    if (lockRef.current) return;
    const card = cards.find(c => c.id === id);
    if (!card || card.isFlipped || card.isMatched) return;

    const newCards = flipCard(cards, id);
    const newFlipped = [...flipped, id];
    setCards(newCards);
    setFlipped(newFlipped);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    if (newFlipped.length === 2) {
      lockRef.current = true;
      setMoves(prev => prev + 1);
      setTimeout(() => {
        const { cards: resolved, matched } = checkMatch(newCards, newFlipped[0], newFlipped[1]);
        setCards(resolved);
        setFlipped([]);
        lockRef.current = false;
        if (matched) Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        if (isGameComplete(resolved)) {
          clearInterval(timerRef.current);
          const t = Math.floor((Date.now() - startTime) / 1000);
          const pairs = DIFFICULTIES[difficulty].pairs;
          const sc = calcMemoryScore(pairs, moves + 1, t);
          setFinalScore(sc);
          saveHighScore(sc);
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          setTimeout(() => setShowModal(true), 400);
        }
      }, 800);
    }
  };

  if (!difficulty) {
    return (
      <View style={styles.container}>
        <GameHeader title="MEMORY" onBack={() => navigation.goBack()} color={COLORS.neonCyan} />
        <View style={styles.selectArea}>
          <Text style={styles.selectTitle}>SELECT DIFFICULTY</Text>
          {Object.entries(DIFFICULTIES).map(([key, val]) => (
            <RetroButton key={key} label={val.label} onPress={() => startGame(key)} color={COLORS.neonCyan} style={styles.diffBtn} />
          ))}
        </View>
      </View>
    );
  }

  const { cols } = DIFFICULTIES[difficulty];
  const cellSize = Math.floor((width - 32) / cols);

  return (
    <View style={styles.container}>
      <GameHeader title="MEMORY" onBack={() => { clearInterval(timerRef.current); setDifficulty(null); }} color={COLORS.neonCyan} />

      <View style={styles.topBar}>
        <Text style={styles.stat}><Text style={styles.statLabel}>MOVES </Text>{moves}</Text>
        <Text style={styles.stat}><Text style={styles.statLabel}>TIME </Text>{elapsed}s</Text>
        <RetroButton label="RESET" onPress={() => startGame(difficulty)} color={COLORS.neonCyan} style={styles.resetBtn} />
      </View>

      <View style={[styles.grid, { width: cellSize * cols + 16, flexDirection: 'row', flexWrap: 'wrap', alignSelf: 'center' }]}>
        {cards.map(card => (
          <Card key={card.id} card={card} onPress={() => handleCardPress(card.id)} disabled={lockRef.current} cellSize={cellSize} />
        ))}
      </View>

      <GameOverModal
        visible={showModal}
        score={finalScore}
        highScore={highScore}
        isNewHigh={finalScore > 0 && finalScore >= highScore}
        onPlayAgain={() => startGame(difficulty)}
        onHome={() => { setDifficulty(null); setShowModal(false); }}
        title="CLEARED!"
        color={COLORS.neonCyan}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  selectArea: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 16 },
  selectTitle: { fontFamily: 'PressStart2P', fontSize: 14, color: COLORS.neonCyan, marginBottom: 16 },
  diffBtn: { width: 200 },
  topBar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 10 },
  stat: { fontFamily: 'PressStart2P', fontSize: 11, color: COLORS.neonCyan },
  statLabel: { color: COLORS.gray },
  resetBtn: { paddingHorizontal: 10, paddingVertical: 8 },
  grid: { padding: 8, marginTop: 8 },
  cardFace: { borderWidth: 1.5, alignItems: 'center', justifyContent: 'center', backgroundColor: COLORS.surface },
  cardFront: { backgroundColor: '#111833' },
  cardBack: { fontFamily: 'PressStart2P', fontSize: 18, color: COLORS.gray },
  cardEmoji: { fontSize: 28 },
});
