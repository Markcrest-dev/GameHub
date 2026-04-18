import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { COLORS } from '../theme/colors';

export default function GameHeader({ title, onBack, color = COLORS.neonGreen }) {
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={onBack} style={styles.back} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
        <Text style={[styles.backArrow, { color }]}>{'< BACK'}</Text>
      </TouchableOpacity>
      <Text style={[styles.title, { color }]} numberOfLines={1}>{title}</Text>
      <View style={styles.spacer} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  back: {
    minWidth: 70,
  },
  backArrow: {
    fontFamily: 'PressStart2P',
    fontSize: 8,
  },
  title: {
    flex: 1,
    textAlign: 'center',
    fontFamily: 'PressStart2P',
    fontSize: 11,
  },
  spacer: {
    minWidth: 70,
  },
});
