import React from 'react';
import { View, Text, StyleSheet, StatusBar } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useFonts } from 'expo-font';
import { PressStart2P_400Regular } from '@expo-google-fonts/press-start-2p';
import HomeScreen from './src/screens/HomeScreen';
import SnakeScreen from './src/screens/SnakeScreen';
import TetrisScreen from './src/screens/TetrisScreen';
import Game2048Screen from './src/screens/Game2048Screen';
import TicTacToeScreen from './src/screens/TicTacToeScreen';
import TriviaScreen from './src/screens/TriviaScreen';
import MemoryCardScreen from './src/screens/MemoryCardScreen';
import { COLORS } from './src/theme/colors';

const Stack = createNativeStackNavigator();

export default function App() {
  const [fontsLoaded] = useFonts({ PressStart2P: PressStart2P_400Regular });

  if (!fontsLoaded) {
    return (
      <View style={styles.loading}>
        <Text style={styles.loadingText}>LOADING...</Text>
      </View>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.background} />
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{ headerShown: false, contentStyle: { backgroundColor: COLORS.background } }}
        >
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="Snake" component={SnakeScreen} />
          <Stack.Screen name="Tetris" component={TetrisScreen} />
          <Stack.Screen name="Game2048" component={Game2048Screen} />
          <Stack.Screen name="TicTacToe" component={TicTacToeScreen} />
          <Stack.Screen name="Trivia" component={TriviaScreen} />
          <Stack.Screen name="Memory" component={MemoryCardScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    backgroundColor: COLORS.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    color: COLORS.neonGreen,
    fontSize: 14,
    fontFamily: 'monospace',
    letterSpacing: 4,
  },
});
