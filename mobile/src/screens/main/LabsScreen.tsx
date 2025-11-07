import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native';
import { Button, Card, Input } from '@components/common';
import { useLabsStore } from '@store/labsStore';
import { COLORS } from '@config/constants';

const LabsScreen: React.FC = () => {
  const { tasks, currentTask, earnings, loadTasks, selectTask, submitLabel, loadEarnings, isLoading } =
    useLabsStore();

  const [label, setLabel] = useState<boolean | null>(null);
  const [reasoning, setReasoning] = useState('');
  const [startTime, setStartTime] = useState(Date.now());

  useEffect(() => {
    loadTasks();
    loadEarnings();
  }, []);

  const handleSelectTask = (task: any) => {
    selectTask(task);
    setLabel(null);
    setReasoning('');
    setStartTime(Date.now());
  };

  const handleSubmit = async () => {
    if (!currentTask || label === null) return;

    const timeSpent = Math.floor((Date.now() - startTime) / 1000);
    const success = await submitLabel({
      taskId: currentTask.id,
      label,
      confidence: 80,
      reasoning,
      timeSpent,
    });

    if (success) {
      setLabel(null);
      setReasoning('');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>ModGuard Labs</Text>
        <Text style={styles.subtitle}>Label media and earn money</Text>

        {/* Earnings Dashboard */}
        <Card style={styles.earningsCard}>
          <View style={styles.earningsGrid}>
            <View style={styles.earningsStat}>
              <Text style={styles.earningsValue}>
                ${earnings?.totalEarnings.toFixed(2) || '0.00'}
              </Text>
              <Text style={styles.earningsLabel}>Total Earned</Text>
            </View>
            <View style={styles.earningsStat}>
              <Text style={styles.earningsValue}>
                ${earnings?.availableBalance.toFixed(2) || '0.00'}
              </Text>
              <Text style={styles.earningsLabel}>Available</Text>
            </View>
          </View>
          <View style={styles.statsRow}>
            <Text style={styles.statText}>Labels: {earnings?.labelsSubmitted || 0}</Text>
            <Text style={styles.statText}>Accuracy: {earnings?.accuracyScore || 0}%</Text>
          </View>
          <Button
            title="Request Payout ($10 min)"
            onPress={() => {}}
            disabled={(earnings?.availableBalance || 0) < 10}
            fullWidth
            size="small"
          />
        </Card>

        {/* Current Task or Task List */}
        {!currentTask ? (
          <View>
            <Text style={styles.sectionTitle}>Available Tasks</Text>
            {tasks.map((task) => (
              <Card key={task.id} style={styles.taskCard} onPress={() => handleSelectTask(task)}>
                <View style={styles.taskHeader}>
                  <Text style={styles.taskType}>
                    {task.mediaType === 'video' ? '🎥' :
                     task.mediaType === 'image' ? '🖼️' : '🎵'}
                  </Text>
                  <View style={styles.taskInfo}>
                    <Text style={styles.taskReward}>${task.reward.toFixed(2)}</Text>
                    {task.duration && (
                      <Text style={styles.taskDuration}>{task.duration}s</Text>
                    )}
                  </View>
                </View>
              </Card>
            ))}
          </View>
        ) : (
          <View>
            <Text style={styles.sectionTitle}>Current Task</Text>
            <Card style={styles.labelingCard}>
              <View style={styles.mediaPreview}>
                <Text style={styles.mediaIcon}>
                  {currentTask.mediaType === 'video' ? '🎥' :
                   currentTask.mediaType === 'image' ? '🖼️' : '🎵'}
                </Text>
              </View>

              <Text style={styles.labelQuestion}>Is this {currentTask.mediaType} real or fake?</Text>

              <View style={styles.labelButtons}>
                <TouchableOpacity
                  style={[
                    styles.labelButton,
                    styles.realButton,
                    label === true && styles.selectedButton,
                  ]}
                  onPress={() => setLabel(true)}
                >
                  <Text style={styles.labelButtonText}>Real</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.labelButton,
                    styles.fakeButton,
                    label === false && styles.selectedButton,
                  ]}
                  onPress={() => setLabel(false)}
                >
                  <Text style={styles.labelButtonText}>Fake</Text>
                </TouchableOpacity>
              </View>

              <Input
                label="Why do you think this? (Optional)"
                placeholder="Explain your reasoning..."
                value={reasoning}
                onChangeText={setReasoning}
                multiline
                numberOfLines={3}
              />

              <View style={styles.submitRow}>
                <Text style={styles.rewardText}>Reward: ${currentTask.reward.toFixed(2)}</Text>
                <Button
                  title="Submit"
                  onPress={handleSubmit}
                  disabled={label === null}
                  loading={isLoading}
                />
              </View>
            </Card>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    padding: 20,
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
  earningsCard: {
    marginBottom: 24,
  },
  earningsGrid: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  earningsStat: {
    flex: 1,
    alignItems: 'center',
  },
  earningsValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: COLORS.success,
    marginBottom: 4,
  },
  earningsLabel: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
  },
  statText: {
    fontSize: 14,
    color: COLORS.text,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 16,
  },
  taskCard: {
    marginBottom: 12,
    padding: 16,
  },
  taskHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  taskType: {
    fontSize: 32,
  },
  taskInfo: {
    alignItems: 'flex-end',
  },
  taskReward: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.success,
  },
  taskDuration: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  labelingCard: {
    padding: 24,
  },
  mediaPreview: {
    aspectRatio: 16 / 9,
    backgroundColor: COLORS.border,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  mediaIcon: {
    fontSize: 60,
  },
  labelQuestion: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text,
    textAlign: 'center',
    marginBottom: 16,
  },
  labelButtons: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  labelButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  realButton: {
    backgroundColor: COLORS.success + '40',
  },
  fakeButton: {
    backgroundColor: COLORS.error + '40',
  },
  selectedButton: {
    borderColor: COLORS.primary,
  },
  labelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
  },
  submitRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 16,
  },
  rewardText: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.success,
  },
});

export default LabsScreen;
