import { create } from 'zustand';
import { verificationService } from '@api/services';
import type { VerificationJob } from '@types/index';

interface ScanState {
  currentJob: VerificationJob | null;
  recentScans: VerificationJob[];
  isUploading: boolean;
  uploadProgress: number;
  isProcessing: boolean;
  error: string | null;

  // Actions
  uploadMedia: (file: { uri: string; name: string; type: string }) => Promise<boolean>;
  checkStatus: (jobId: string) => Promise<void>;
  clearCurrentJob: () => void;
  loadRecentScans: () => void;
}

export const useScanStore = create<ScanState>((set, get) => ({
  currentJob: null,
  recentScans: [],
  isUploading: false,
  uploadProgress: 0,
  isProcessing: false,
  error: null,

  uploadMedia: async (file: { uri: string; name: string; type: string }) => {
    set({ isUploading: true, uploadProgress: 0, error: null });

    try {
      const response = await verificationService.uploadMedia(file, (progress) => {
        set({ uploadProgress: progress });
      });

      if (response.success && response.data) {
        set({
          currentJob: response.data,
          isUploading: false,
          isProcessing: true,
        });

        // Start polling for results
        get().checkStatus(response.data.id);

        return true;
      } else {
        set({
          error: response.error || 'Upload failed',
          isUploading: false,
        });
        return false;
      }
    } catch (error: any) {
      set({
        error: error.message || 'Upload failed',
        isUploading: false,
      });
      return false;
    }
  },

  checkStatus: async (jobId: string) => {
    try {
      const response = await verificationService.getVerificationStatus(jobId);

      if (response.success && response.data) {
        const job = response.data;
        set({ currentJob: job });

        // If still processing, poll again
        if (job.status === 'processing' || job.status === 'pending') {
          setTimeout(() => {
            get().checkStatus(jobId);
          }, 2000); // Poll every 2 seconds
        } else {
          set({ isProcessing: false });

          // Add to recent scans if completed
          if (job.status === 'completed') {
            const recentScans = get().recentScans;
            set({
              recentScans: [job, ...recentScans].slice(0, 10), // Keep last 10
            });
          }
        }
      }
    } catch (error: any) {
      set({
        error: error.message || 'Failed to check status',
        isProcessing: false,
      });
    }
  },

  clearCurrentJob: () => {
    set({
      currentJob: null,
      isProcessing: false,
      uploadProgress: 0,
      error: null,
    });
  },

  loadRecentScans: () => {
    // Load from local storage or API
    // For now, just use state
    // Could implement AsyncStorage persistence here
  },
}));
