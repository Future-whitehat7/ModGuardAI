import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Image } from 'react-native';
import { Button, Card } from '@components/common';
import { useChallengeStore } from '@store/challengeStore';
import { COLORS } from '@config/constants';

const ChallengesScreen: React.FC = () => {
  const {
    challenges,
    currentChallengeIndex,
    loadDailyChallenge,
    submitAnswer,
    nextChallenge,
    lastResult,
    isLoading,
  } = useChallengeStore();

  const [startTime, setStartTime] = useState(Date.now());

  useEffect(() => {
    loadDailyChallenge();
  }, []);

  const currentChallenge = challenges[currentChallengeIndex];

  const handleAnswer = async (isReal: boolean) => {
    if (!currentChallenge) return;

    const timeSpent = Math.floor((Date.now() - startTime) / 1000);
    const result = await submitAnswer({
      challengeId: currentChallenge.id,
      userAnswer: isReal,
      confidence: 80,
      timeSpent,
    });

    if (result) {
      // Show result briefly, then move to next
      setTimeout(() => {
        nextChallenge();
        setStartTime(Date.now());
      }, 3000);
    }
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.center}>
          <Text style={styles.loadingText}>Loading challenges...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!currentChallenge) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.center}>
          <Text style={styles.completedText}>🎉 All challenges completed!</Text>
          <Button title="Reload" onPress={loadDailyChallenge} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Daily Challenge</Text>
          <Text style={styles.progress}>
            {currentChallengeIndex + 1} / {challenges.length}
          </Text>
        </View>

        {/* Challenge Card */}
        <Card style={styles.challengeCard}>
          <View style={styles.mediaContainer}>
            <Text style={styles.mediaPlaceholder}>
              {currentChallenge.mediaType === 'video' ? '🎥' :
               currentChallenge.mediaType === 'image' ? '🖼️' : '🎵'}
            </Text>
          </View>

          {!lastResult ? (
            <View style={styles.answerSection}>
              <Text style={styles.question}>Is this {currentChallenge.mediaType} real or fake?</Text>
              <View style={styles.answerButtons}>
                <TouchableOpacity
                  style={[styles.answerButton, styles.realButton]}
                  onPress={() => handleAnswer(true)}
                >
                  <Text style={styles.answerText}>✓ Real</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.answerButton, styles.fakeButton]}
                  onPress={() => handleAnswer(false)}
                >
                  <Text style={styles.answerText}>✗ Fake</Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <View style={styles.resultSection}>
              <View style={[
                styles.resultBadge,
                lastResult.correct ? styles.correctBadge : styles.incorrectBadge
              ]}>
                <Text style={styles.resultText}>
                  {lastResult.correct ? '✓ Correct!' : '✗ Incorrect'}
                </Text>
              </View>
              <Text style={styles.explanation}>{lastResult.explanation}</Text>
              <View style={styles.rewards}>
                <Text style={styles.rewardText}>ELO: {lastResult.eloChange >= 0 ? '+' : ''}{lastResult.eloChange}</Text>
                <Text style={styles.rewardText}>XP: +{lastResult.xpGained}</Text>
              </View>
            </View>
          )}
        </Card>
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
    padding: 20,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: COLORS.text,
  },
  completedText: {
    fontSize: 20,
    color: COLORS.text,
    marginBottom: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  progress: {
    fontSize: 16,
    color: COLORS.textSecondary,
  },
  challengeCard: {
    flex: 1,
  },
  mediaContainer: {
    aspectRatio: 16 / 9,
    backgroundColor: COLORS.border,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  mediaPlaceholder: {
    fontSize: 80,
  },
  answerSection: {
    alignItems: 'center',
  },
  question: {
    fontSize: 20,
    fontWeight: '600',
    color: COLORS.text,
    textAlign: 'center',
    marginBottom: 24,
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
  answerText: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text,
  },
  resultSection: {
    alignItems: 'center',
  },
  resultBadge: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 24,
    marginBottom: 16,
  },
  correctBadge: {
    backgroundColor: COLORS.success,
  },
  incorrectBadge: {
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
    marginBottom: 16,
  },
  rewards: {
    flexDirection: 'row',
    gap: 16,
  },
  rewardText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.primary,
  },
});

export default ChallengesScreen;
