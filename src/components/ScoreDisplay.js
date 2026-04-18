import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS } from '../theme/colors';

export default function ScoreDisplay({ score, highScore, color = COLORS.neonGreen }) {
  return (
    <View style={styles.container}>
      <Text style={[styles.text, { color }]}>SCORE: {String(score).padStart(6, '0')}</Text>
      <Text style={[styles.best, { color: COLORS.gray }]}>BEST: {String(highScore).padStart(6, '0')}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    gap: 4,
  },
  text: {
    fontFamily: 'PressStart2P',
    fontSize: 11,
  },
  best: {
    fontFamily: 'PressStart2P',
    fontSize: 9,
  },
});
