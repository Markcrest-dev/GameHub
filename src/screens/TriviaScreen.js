import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import * as Haptics from 'expo-haptics';
import { getRandomQuestions, calcScore } from '../games/trivia';
import { useHighScore } from '../hooks/useHighScore';
import GameHeader from '../components/GameHeader';
import GameOverModal from '../components/GameOverModal';
import RetroButton from '../components/RetroButton';
import { COLORS } from '../theme/colors';

const TOTAL_QUESTIONS = 10;
const TIME_PER_Q = 15;
const BASE_POINTS = 100;

export default function TriviaScreen({ navigation }) {
  const [questions] = useState(() => getRandomQuestions(TOTAL_QUESTIONS));
  const [qIndex, setQIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState(null);
  const [timeLeft, setTimeLeft] = useState(TIME_PER_Q);
  const [started, setStarted] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [highScore, saveHighScore] = useHighScore('trivia');
  const timerRef = useRef(null);
  const timerAnim = useRef(new Animated.Value(1)).current;
  const feedbackAnim = useRef(new Animated.Value(0)).current;

  const q = questions[qIndex];

  const stopTimer = () => { if (timerRef.current) clearInterval(timerRef.current); };

  const startTimer = () => {
    stopTimer();
    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          stopTimer();
          handleAnswer(-1);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  useEffect(() => {
    if (started) {
      setTimeLeft(TIME_PER_Q);
      Animated.timing(timerAnim, { toValue: 1, duration: 0, useNativeDriver: false }).start(() => {
        Animated.timing(timerAnim, { toValue: 0, duration: TIME_PER_Q * 1000, useNativeDriver: false }).start();
      });
      startTimer();
    }
    return stopTimer;
  }, [qIndex, started]);

  useEffect(() => stopTimer, []);

  const handleAnswer = (index) => {
    if (selected !== null) return;
    stopTimer();
    setSelected(index);

    const isCorrect = index === q.answer;
    if (isCorrect) {
      const gained = calcScore(BASE_POINTS, timeLeft, TIME_PER_Q);
      setScore(prev => prev + gained);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } else {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    }

    Animated.sequence([
      Animated.timing(feedbackAnim, { toValue: 1, duration: 150, useNativeDriver: true }),
      Animated.delay(900),
      Animated.timing(feedbackAnim, { toValue: 0, duration: 200, useNativeDriver: true }),
    ]).start(() => {
      const nextIdx = qIndex + 1;
      if (nextIdx >= TOTAL_QUESTIONS) {
        saveHighScore(score + (isCorrect ? calcScore(BASE_POINTS, timeLeft, TIME_PER_Q) : 0));
        setTimeout(() => setShowModal(true), 200);
      } else {
        setQIndex(nextIdx);
        setSelected(null);
      }
    });
  };

  const handleRestart = () => {
    setShowModal(false);
    navigation.goBack();
  };

  const timerWidth = timerAnim.interpolate({ inputRange: [0, 1], outputRange: ['0%', '100%'] });
  const timerColor = timerAnim.interpolate({ inputRange: [0, 0.3, 1], outputRange: [COLORS.neonRed, COLORS.neonYellow, COLORS.neonGreen] });

  return (
    <View style={styles.container}>
      <GameHeader title="TRIVIA" onBack={() => { stopTimer(); navigation.goBack(); }} color={COLORS.neonOrange} />

      <View style={styles.topBar}>
        <Text style={styles.qCount}>{qIndex + 1} / {TOTAL_QUESTIONS}</Text>
        <Text style={[styles.scoreVal, { color: COLORS.neonOrange }]}>{String(score).padStart(5, '0')}</Text>
        <Text style={[styles.timerNum, { color: timeLeft <= 5 ? COLORS.neonRed : COLORS.neonGreen }]}>{timeLeft}s</Text>
      </View>

      <View style={styles.timerBar}>
        <Animated.View style={[styles.timerFill, { width: timerWidth, backgroundColor: timerColor }]} />
      </View>

      {!started ? (
        <View style={styles.startArea}>
          <Text style={styles.startTitle}>TRIVIA QUIZ</Text>
          <Text style={styles.startSub}>{TOTAL_QUESTIONS} QUESTIONS</Text>
          <Text style={styles.startSub}>15 SECONDS EACH</Text>
          <RetroButton label="START QUIZ" onPress={() => setStarted(true)} color={COLORS.neonOrange} style={{ marginTop: 24 }} />
        </View>
      ) : (
        <View style={styles.questionArea}>
          <View style={styles.categoryBadge}>
            <Text style={styles.categoryText}>{q.category.toUpperCase()}</Text>
          </View>
          <Text style={styles.question}>{q.q}</Text>
          <View style={styles.options}>
            {q.options.map((opt, i) => {
              let btnColor = COLORS.neonOrange;
              if (selected !== null) {
                if (i === q.answer) btnColor = COLORS.neonGreen;
                else if (i === selected) btnColor = COLORS.neonRed;
                else btnColor = COLORS.gray;
              }
              return (
                <TouchableOpacity
                  key={i}
                  style={[styles.option, { borderColor: btnColor }]}
                  onPress={() => handleAnswer(i)}
                  disabled={selected !== null}
                >
                  <Text style={[styles.optionLetter, { color: btnColor }]}>{String.fromCharCode(65 + i)}</Text>
                  <Text style={[styles.optionText, { color: btnColor }]}>{opt}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      )}

      <GameOverModal
        visible={showModal}
        score={score}
        highScore={highScore}
        isNewHigh={score > 0 && score >= highScore}
        onPlayAgain={handleRestart}
        onHome={() => navigation.goBack()}
        title="QUIZ DONE!"
        color={COLORS.neonOrange}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  topBar: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 10, alignItems: 'center' },
  qCount: { fontFamily: 'PressStart2P', fontSize: 8, color: COLORS.gray },
  scoreVal: { fontFamily: 'PressStart2P', fontSize: 14 },
  timerNum: { fontFamily: 'PressStart2P', fontSize: 12 },
  timerBar: { height: 6, backgroundColor: COLORS.surface, marginHorizontal: 16, marginBottom: 4, borderRadius: 3, overflow: 'hidden' },
  timerFill: { height: '100%', borderRadius: 3 },
  startArea: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 16 },
  startTitle: { fontFamily: 'PressStart2P', fontSize: 24, color: COLORS.neonOrange },
  startSub: { fontFamily: 'PressStart2P', fontSize: 10, color: COLORS.gray },
  questionArea: { flex: 1, padding: 16, gap: 16 },
  categoryBadge: { backgroundColor: COLORS.neonOrange + '22', borderWidth: 1, borderColor: COLORS.neonOrange, paddingHorizontal: 12, paddingVertical: 4, alignSelf: 'flex-start' },
  categoryText: { fontFamily: 'PressStart2P', fontSize: 7, color: COLORS.neonOrange },
  question: { fontFamily: 'PressStart2P', fontSize: 11, color: COLORS.white, lineHeight: 20 },
  options: { gap: 10 },
  option: { flexDirection: 'row', borderWidth: 1.5, padding: 12, alignItems: 'center', gap: 12, backgroundColor: COLORS.surface },
  optionLetter: { fontFamily: 'PressStart2P', fontSize: 10, minWidth: 20 },
  optionText: { fontFamily: 'PressStart2P', fontSize: 9, flex: 1, lineHeight: 16 },
});
