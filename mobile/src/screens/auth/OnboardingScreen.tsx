import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Button, Card } from '@components/common';
import { COLORS } from '@config/constants';
import type { RootStackParamList } from '@types/index';

type OnboardingScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Onboarding'>;

interface Props {
  navigation: OnboardingScreenNavigationProp;
}

// Sample deepfake challenge data
const SAMPLE_CHALLENGES = [
  {
    id: '1',
    type: 'video',
    thumbnail: '🎥',
    question: 'Is this video real or fake?',
    isReal: false,
    explanation: 'Notice the unnatural eye movements and lighting inconsistencies around the face.',
  },
  {
    id: '2',
    type: 'image',
    thumbnail: '🖼️',
    question: 'Is this image real or AI-generated?',
    isReal: true,
    explanation: 'This is a real photo. The lighting, shadows, and details are all consistent.',
  },
  {
    id: '3',
    type: 'audio',
    thumbnail: '🎵',
    question: 'Is this voice real or cloned?',
    isReal: false,
    explanation: 'This is a voice clone. Listen for the robotic quality and unnatural pauses.',
  },
];

const OnboardingScreen: React.FC<Props> = ({ navigation }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [score, setScore] = useState(0);

  const currentChallenge = SAMPLE_CHALLENGES[currentIndex];
  const isLastChallenge = currentIndex === SAMPLE_CHALLENGES.length - 1;

  const handleAnswer = (answer: boolean) => {
    if (answer === currentChallenge.isReal) {
      setScore(score + 1);
    }
    setShowAnswer(true);
  };

  const handleNext = () => {
    if (isLastChallenge) {
      // Complete onboarding
      navigation.navigate('Signup');
    } else {
      setCurrentIndex(currentIndex + 1);
      setShowAnswer(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Can You Spot the Deepfake?</Text>
          <Text style={styles.subtitle}>
            Complete this quick test to unlock 3 free scans
          </Text>
          <View style={styles.progress}>
            {SAMPLE_CHALLENGES.map((_, index) => (
              <View
                key={index}
                style={[
                  styles.progressDot,
                  index === currentIndex && styles.progressDotActive,
                  index < currentIndex && styles.progressDotCompleted,
                ]}
              />
            ))}
          </View>
        </View>

        {/* Challenge Card */}
        <Card style={styles.challengeCard}>
          <Text style={styles.thumbnail}>{currentChallenge.thumbnail}</Text>
          <Text style={styles.question}>{currentChallenge.question}</Text>

          {!showAnswer ? (
            <View style={styles.answerButtons}>
              <TouchableOpacity
                style={[styles.answerButton, styles.realButton]}
                onPress={() => handleAnswer(true)}
              >
                <Text style={styles.answerButtonText}>✓ Real</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.answerButton, styles.fakeButton]}
                onPress={() => handleAnswer(false)}
              >
                <Text style={styles.answerButtonText}>✗ Fake</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.answerSection}>
              <View
                style={[
                  styles.resultBadge,
                  currentChallenge.isReal ? styles.realBadge : styles.fakeBadge,
                ]}
              >
                <Text style={styles.resultText}>
                  {currentChallenge.isReal ? '✓ REAL' : '✗ FAKE'}
                </Text>
              </View>
              <Text style={styles.explanation}>{currentChallenge.explanation}</Text>
            </View>
          )}
        </Card>

        {/* Score */}
        <Text style={styles.score}>
          Score: {score} / {SAMPLE_CHALLENGES.length}
        </Text>

        {/* Navigation */}
        {showAnswer && (
          <Button
            title={isLastChallenge ? 'Complete & Get Started' : 'Next Challenge'}
            onPress={handleNext}
            fullWidth
            size="large"
          />
        )}

        <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
          <Text style={styles.skipText}>Skip Tutorial</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingVertical: 20,
  },
  header: {
    marginBottom: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.textSecondary,
    marginBottom: 24,
  },
  progress: {
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'center',
  },
  progressDot: {
    width: 40,
    height: 4,
    backgroundColor: COLORS.border,
    borderRadius: 2,
  },
  progressDotActive: {
    backgroundColor: COLORS.primary,
  },
  progressDotCompleted: {
    backgroundColor: COLORS.success,
  },
  challengeCard: {
    alignItems: 'center',
    padding: 32,
    marginBottom: 24,
  },
  thumbnail: {
    fontSize: 80,
    marginBottom: 24,
  },
  question: {
    fontSize: 20,
    fontWeight: '600',
    color: COLORS.text,
    textAlign: 'center',
    marginBottom: 32,
  },
  answerButtons: {
    flexDirection: 'row',
    gap: 16,
    width: '100%',
  },
  answerButton: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  realButton: {
    backgroundColor: COLORS.success,
  },
  fakeButton: {
    backgroundColor: COLORS.error,
  },
  answerButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text,
  },
  answerSection: {
    width: '100%',
    alignItems: 'center',
  },
  resultBadge: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 24,
    marginBottom: 16,
  },
  realBadge: {
    backgroundColor: COLORS.success,
  },
  fakeBadge: {
    backgroundColor: COLORS.error,
  },
  resultText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  explanation: {
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
  score: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    textAlign: 'center',
    marginBottom: 24,
  },
  skipText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginTop: 16,
  },
});

export default OnboardingScreen;
