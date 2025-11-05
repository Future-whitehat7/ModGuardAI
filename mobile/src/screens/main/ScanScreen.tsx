import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Button, Card } from '@components/common';
import { useScanStore } from '@store/scanStore';
import { COLORS } from '@config/constants';

const ScanScreen: React.FC = () => {
  const { uploadMedia, currentJob, isUploading, uploadProgress, isProcessing, clearCurrentJob } =
    useScanStore();

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: false,
      quality: 1,
    });

    if (!result.canceled && result.assets[0]) {
      const asset = result.assets[0];
      await uploadMedia({
        uri: asset.uri,
        name: asset.fileName || 'media.jpg',
        type: asset.type === 'video' ? 'video/mp4' : 'image/jpeg',
      });
    }
  };

  const takePhoto = async () => {
    const permission = await ImagePicker.requestCameraPermissionsAsync();
    if (!permission.granted) return;

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: false,
      quality: 1,
    });

    if (!result.canceled && result.assets[0]) {
      const asset = result.assets[0];
      await uploadMedia({
        uri: asset.uri,
        name: 'photo.jpg',
        type: 'image/jpeg',
      });
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Scan & Verify</Text>
        <Text style={styles.subtitle}>Upload any media to check for deepfakes</Text>

        {!currentJob ? (
          <View style={styles.uploadSection}>
            <Card style={styles.uploadCard}>
              <Text style={styles.uploadIcon}>📸</Text>
              <Text style={styles.uploadTitle}>Upload Media</Text>
              <Text style={styles.uploadDescription}>
                Select a photo, video, or audio file to analyze
              </Text>

              <View style={styles.uploadButtons}>
                <Button title="Take Photo" onPress={takePhoto} fullWidth />
                <Button title="Choose from Library" onPress={pickImage} variant="outline" fullWidth />
              </View>
            </Card>

            <View style={styles.featuresGrid}>
              <FeatureCard icon="🔍" title="Deep Analysis" description="AI-powered detection" />
              <FeatureCard icon="⚡" title="Fast Results" description="5-30 seconds" />
              <FeatureCard icon="🎯" title="High Accuracy" description="98%+ precision" />
              <FeatureCard icon="🔒" title="Secure" description="End-to-end encrypted" />
            </View>
          </View>
        ) : (
          <View style={styles.resultsSection}>
            {isUploading && (
              <Card style={styles.progressCard}>
                <Text style={styles.progressTitle}>Uploading...</Text>
                <View style={styles.progressBar}>
                  <View style={[styles.progressFill, { width: `${uploadProgress}%` }]} />
                </View>
                <Text style={styles.progressText}>{uploadProgress}%</Text>
              </Card>
            )}

            {isProcessing && (
              <Card style={styles.progressCard}>
                <Text style={styles.progressTitle}>Analyzing...</Text>
                <Text style={styles.progressSubtitle}>This may take a few moments</Text>
                <View style={styles.spinner}>
                  <Text style={styles.spinnerText}>⏳</Text>
                </View>
              </Card>
            )}

            {currentJob.status === 'completed' && currentJob.result && (
              <Card style={styles.resultCard}>
                <View
                  style={[
                    styles.verdictBadge,
                    currentJob.result.verdict === 'real' && styles.realBadge,
                    currentJob.result.verdict === 'fake' && styles.fakeBadge,
                    currentJob.result.verdict === 'inconclusive' && styles.inconclusiveBadge,
                  ]}
                >
                  <Text style={styles.verdictText}>
                    {currentJob.result.verdict.toUpperCase()}
                  </Text>
                </View>

                <Text style={styles.confidenceText}>
                  Confidence: {currentJob.result.confidence}%
                </Text>

                <Text style={styles.explanationTitle}>Analysis:</Text>
                <Text style={styles.explanationText}>{currentJob.result.explanation}</Text>

                {currentJob.result.cues.length > 0 && (
                  <View style={styles.cuesSection}>
                    <Text style={styles.cuesTitle}>Key Indicators:</Text>
                    {currentJob.result.cues.map((cue, index) => (
                      <Text key={index} style={styles.cueItem}>
                        • {cue.description}
                      </Text>
                    ))}
                  </View>
                )}

                <Button title="Scan Another" onPress={clearCurrentJob} fullWidth />
              </Card>
            )}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const FeatureCard: React.FC<{ icon: string; title: string; description: string }> = ({
  icon,
  title,
  description,
}) => (
  <Card style={styles.featureCard}>
    <Text style={styles.featureIcon}>{icon}</Text>
    <Text style={styles.featureTitle}>{title}</Text>
    <Text style={styles.featureDescription}>{description}</Text>
  </Card>
);

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
  uploadSection: {},
  uploadCard: {
    alignItems: 'center',
    padding: 32,
    marginBottom: 24,
  },
  uploadIcon: {
    fontSize: 60,
    marginBottom: 16,
  },
  uploadTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 8,
  },
  uploadDescription: {
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginBottom: 24,
  },
  uploadButtons: {
    width: '100%',
    gap: 12,
  },
  featuresGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  featureCard: {
    flex: 1,
    minWidth: '47%',
    alignItems: 'center',
    padding: 16,
  },
  featureIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  featureTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 4,
  },
  featureDescription: {
    fontSize: 12,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
  resultsSection: {},
  progressCard: {
    alignItems: 'center',
    padding: 32,
  },
  progressTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 8,
  },
  progressSubtitle: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginBottom: 16,
  },
  progressBar: {
    width: '100%',
    height: 8,
    backgroundColor: COLORS.border,
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: COLORS.primary,
  },
  progressText: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  spinner: {
    marginTop: 16,
  },
  spinnerText: {
    fontSize: 40,
  },
  resultCard: {
    alignItems: 'center',
    padding: 24,
  },
  verdictBadge: {
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 24,
    marginBottom: 16,
  },
  realBadge: {
    backgroundColor: COLORS.real,
  },
  fakeBadge: {
    backgroundColor: COLORS.fake,
  },
  inconclusiveBadge: {
    backgroundColor: COLORS.inconclusive,
  },
  verdictText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  confidenceText: {
    fontSize: 16,
    color: COLORS.textSecondary,
    marginBottom: 24,
  },
  explanationTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 8,
    alignSelf: 'flex-start',
  },
  explanationText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    lineHeight: 20,
    marginBottom: 16,
  },
  cuesSection: {
    width: '100%',
    marginBottom: 24,
  },
  cuesTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 8,
  },
  cueItem: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginBottom: 4,
  },
});

export default ScanScreen;
