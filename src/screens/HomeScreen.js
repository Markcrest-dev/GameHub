import React, { useEffect, useRef } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  StyleSheet, Animated, Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, GAME_COLORS } from '../theme/colors';

const { width } = Dimensions.get('window');

const GAMES = [
  { id: 'Snake',      label: 'SNAKE',       icon: '🐍', screen: 'Snake',      desc: 'Classic snake action' },
  { id: 'Tetris',     label: 'TETRIS',      icon: '🧱', screen: 'Tetris',     desc: 'Stack & clear lines' },
  { id: 'Game2048',   label: '2048',        icon: '🔢', screen: 'Game2048',   desc: 'Merge to 2048' },
  { id: 'TicTacToe',  label: 'TIC TAC TOE',icon: '⭕', screen: 'TicTacToe',  desc: 'Unbeatable AI' },
  { id: 'Trivia',     label: 'TRIVIA',      icon: '❓', screen: 'Trivia',     desc: 'Test your knowledge' },
  { id: 'Memory',     label: 'MEMORY',      icon: '🃏', screen: 'Memory',     desc: 'Flip & match pairs' },
];

function GameCard({ game, color, index, onPress }) {
  const scale = useRef(new Animated.Value(1)).current;
  const slideIn = useRef(new Animated.Value(60)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(slideIn, { toValue: 0, duration: 350, delay: index * 80, useNativeDriver: true }),
      Animated.timing(opacity, { toValue: 1, duration: 350, delay: index * 80, useNativeDriver: true }),
    ]).start();
  }, []);

  const onPressIn = () => Animated.spring(scale, { toValue: 0.95, useNativeDriver: true }).start();
  const onPressOut = () => Animated.spring(scale, { toValue: 1, useNativeDriver: true }).start();

  return (
    <Animated.View style={{ transform: [{ scale }, { translateY: slideIn }], opacity, width: (width - 48) / 2 }}>
      <TouchableOpacity
        onPress={onPress}
        onPressIn={onPressIn}
        onPressOut={onPressOut}
        activeOpacity={1}
      >
        <LinearGradient
          colors={['#111111', '#0a0a0a']}
          style={[styles.card, { borderColor: color }]}
        >
          <Text style={styles.cardIcon}>{game.icon}</Text>
          <Text style={[styles.cardLabel, { color }]}>{game.label}</Text>
          <Text style={styles.cardDesc}>{game.desc}</Text>
          <View style={[styles.cardAccent, { backgroundColor: color }]} />
        </LinearGradient>
      </TouchableOpacity>
    </Animated.View>
  );
}

export default function HomeScreen({ navigation }) {
  const titleAnim = useRef(new Animated.Value(0)).current;
  const scanAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(titleAnim, { toValue: 1, duration: 800, useNativeDriver: true }).start();
    Animated.loop(
      Animated.timing(scanAnim, { toValue: 1, duration: 3000, useNativeDriver: true })
    ).start();
  }, []);

  const scanTranslate = scanAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [-20, 700],
  });

  return (
    <View style={styles.container}>
      <Animated.View
        pointerEvents="none"
        style={[styles.scanline, { transform: [{ translateY: scanTranslate }] }]}
      />

      <Animated.View style={{ opacity: titleAnim, transform: [{ translateY: titleAnim.interpolate({ inputRange: [0,1], outputRange: [-30, 0] }) }] }}>
        <Text style={styles.titleTop}>GAME</Text>
        <Text style={styles.titleBottom}>HUB</Text>
        <Text style={styles.subtitle}>— RETRO COLLECTION —</Text>
      </Animated.View>

      <ScrollView
        contentContainerStyle={styles.grid}
        showsVerticalScrollIndicator={false}
      >
        {GAMES.map((game, i) => (
          <GameCard
            key={game.id}
            game={game}
            color={GAME_COLORS[i % GAME_COLORS.length]}
            index={i}
            onPress={() => navigation.navigate(game.screen)}
          />
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    paddingTop: 50,
  },
  scanline: {
    position: 'absolute',
    left: 0, right: 0,
    height: 2,
    backgroundColor: 'rgba(0,255,65,0.06)',
    zIndex: 999,
  },
  titleTop: {
    fontFamily: 'PressStart2P',
    fontSize: 32,
    color: COLORS.neonGreen,
    textAlign: 'center',
    textShadowColor: COLORS.neonGreen,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 12,
  },
  titleBottom: {
    fontFamily: 'PressStart2P',
    fontSize: 32,
    color: COLORS.neonCyan,
    textAlign: 'center',
    textShadowColor: COLORS.neonCyan,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 12,
    marginTop: -4,
  },
  subtitle: {
    fontFamily: 'PressStart2P',
    fontSize: 7,
    color: COLORS.gray,
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 20,
    letterSpacing: 2,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 16,
    gap: 16,
    paddingBottom: 30,
    justifyContent: 'space-between',
  },
  card: {
    borderWidth: 1,
    padding: 16,
    alignItems: 'center',
    gap: 6,
    overflow: 'hidden',
  },
  cardIcon: {
    fontSize: 32,
  },
  cardLabel: {
    fontFamily: 'PressStart2P',
    fontSize: 8,
    textAlign: 'center',
  },
  cardDesc: {
    fontFamily: 'PressStart2P',
    fontSize: 6,
    color: COLORS.gray,
    textAlign: 'center',
  },
  cardAccent: {
    position: 'absolute',
    bottom: 0, left: 0, right: 0,
    height: 2,
    opacity: 0.6,
  },
});
