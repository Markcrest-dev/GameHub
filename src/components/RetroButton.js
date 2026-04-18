import React, { useRef } from 'react';
import { Pressable, Text, StyleSheet, Animated } from 'react-native';
import { COLORS } from '../theme/colors';

export default function RetroButton({ label, onPress, color = COLORS.neonGreen, style, textStyle, small = false }) {
  const scale = useRef(new Animated.Value(1)).current;

  const onPressIn = () => {
    Animated.spring(scale, { toValue: 0.93, useNativeDriver: true, speed: 50 }).start();
  };
  const onPressOut = () => {
    Animated.spring(scale, { toValue: 1, useNativeDriver: true, speed: 50 }).start();
  };

  return (
    <Animated.View style={[{ transform: [{ scale }] }, style]}>
      <Pressable
        onPress={onPress}
        onPressIn={onPressIn}
        onPressOut={onPressOut}
        style={[
          styles.button,
          small && styles.small,
          { borderColor: color },
        ]}
      >
        <Text style={[styles.label, small && styles.smallLabel, { color }, textStyle]}>
          {label}
        </Text>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  button: {
    borderWidth: 2,
    paddingVertical: 14,
    paddingHorizontal: 28,
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.7)',
  },
  small: {
    paddingVertical: 9,
    paddingHorizontal: 16,
  },
  label: {
    fontFamily: 'PressStart2P',
    fontSize: 11,
    letterSpacing: 1,
  },
  smallLabel: {
    fontSize: 9,
  },
});
