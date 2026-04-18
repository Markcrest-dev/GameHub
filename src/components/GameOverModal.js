import React from 'react';
import { Modal, View, Text, StyleSheet } from 'react-native';
import RetroButton from './RetroButton';
import { COLORS } from '../theme/colors';

export default function GameOverModal({ visible, score, highScore, isNewHigh, onPlayAgain, onHome, title = 'GAME OVER', color = COLORS.neonGreen }) {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={[styles.modal, { borderColor: color }]}>
          <Text style={[styles.title, { color: COLORS.neonRed }]}>{title}</Text>

          {isNewHigh && (
            <Text style={[styles.newHigh, { color: COLORS.neonYellow }]}>★ NEW BEST! ★</Text>
          )}

          <View style={styles.scores}>
            <Text style={[styles.scoreLabel, { color }]}>SCORE</Text>
            <Text style={[styles.scoreValue, { color }]}>{String(score).padStart(6, '0')}</Text>
            <Text style={[styles.bestLabel, { color: COLORS.gray }]}>BEST</Text>
            <Text style={[styles.bestValue, { color: COLORS.gray }]}>{String(highScore).padStart(6, '0')}</Text>
          </View>

          <View style={styles.buttons}>
            <RetroButton label="PLAY AGAIN" onPress={onPlayAgain} color={color} />
            <RetroButton label="HOME" onPress={onHome} color={COLORS.gray} style={styles.homeBtn} />
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.88)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modal: {
    backgroundColor: COLORS.surface,
    borderWidth: 2,
    paddingVertical: 30,
    paddingHorizontal: 28,
    alignItems: 'center',
    width: '80%',
    gap: 16,
  },
  title: {
    fontFamily: 'PressStart2P',
    fontSize: 20,
    textAlign: 'center',
  },
  newHigh: {
    fontFamily: 'PressStart2P',
    fontSize: 10,
    textAlign: 'center',
  },
  scores: {
    alignItems: 'center',
    gap: 6,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: COLORS.border,
    width: '100%',
  },
  scoreLabel: {
    fontFamily: 'PressStart2P',
    fontSize: 9,
    opacity: 0.7,
  },
  scoreValue: {
    fontFamily: 'PressStart2P',
    fontSize: 20,
  },
  bestLabel: {
    fontFamily: 'PressStart2P',
    fontSize: 9,
    marginTop: 8,
  },
  bestValue: {
    fontFamily: 'PressStart2P',
    fontSize: 14,
  },
  buttons: {
    width: '100%',
    gap: 10,
  },
  homeBtn: {
    marginTop: 4,
  },
});
