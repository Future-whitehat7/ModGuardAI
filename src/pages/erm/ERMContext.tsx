import React, { createContext, useContext, useMemo, useState, ReactNode, useCallback } from 'react';
import {
  AlertRecord,
  AlertStatus,
  ExecutiveProfile,
  LogEntry,
  PhoneContact,
  PlatformMetric,
  ScanMetric,
  UserRole,
  VoiceAgentConfig,
  VoiceCallRecord,
} from './types';
import { averageRiskScore, createId } from './utils';

interface ERMContextValue {
  role: UserRole;
  setRole: (role: UserRole) => void;
  profiles: ExecutiveProfile[];
  alerts: AlertRecord[];
  logs: LogEntry[];
  phoneContacts: PhoneContact[];
  voiceAgent: VoiceAgentConfig;
  callHistory: VoiceCallRecord[];
  scanMetrics: ScanMetric[];
  platformMetrics: PlatformMetric[];
  averageRisk: number;
  addProfile: (profile: Omit<ExecutiveProfile, 'id' | 'lastScan'>) => void;
  updateProfile: (profileId: string, updates: Partial<ExecutiveProfile>) => void;
  deleteProfile: (profileId: string) => void;
  startScan: (profileIds?: string[]) => void;
  updateAlertStatus: (alertId: string, status: AlertStatus, options?: { assignedTo?: string }) => void;
  markAlertFalsePositive: (alertId: string, reason: string) => void;
  logAction: (entry: Omit<LogEntry, 'id' | 'timestamp' | 'role'> & { role?: UserRole }) => void;
  addPhoneContact: (contact: Omit<PhoneContact, 'id' | 'createdAt'>) => void;
  deletePhoneContact: (contactId: string) => void;
  updateVoiceAgent: (config: VoiceAgentConfig) => void;
  recordTestCall: (contact: { label: string; phoneNumber: string }) => void;
}

const initialVoiceAgent: VoiceAgentConfig = {
  agentId: 'agent-prod-01',
  voiceId: 'elevenlabs-voice-emerald',
  systemPrompt:
    'You are the ModGuardAI emergency response voice assistant. Alert the executive security team when a deepfake threat is detected.',
};

const ERMContext = createContext<ERMContextValue | undefined>(undefined);

const sampleProfiles: ExecutiveProfile[] = [
  {
    id: createId(),
    fullName: 'Avery Chen',
    title: 'Chief Executive Officer',
    organization: 'ModGuardAI',
    priority: 'High',
    lastScan: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(),
    notes: 'Primary spokesperson. High exposure across video platforms.',
    photos: [],
    videos: [],
    voiceSamples: [],
  },
  {
    id: createId(),
    fullName: 'Jordan Malik',
    title: 'Chief Security Officer',
    organization: 'ModGuardAI',
    priority: 'Medium',
    lastScan: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(),
    notes: 'Oversees security operations and threat response.',
    photos: [],
    videos: [],
    voiceSamples: [],
  },
];

const sampleAlerts: AlertRecord[] = [
  {
    id: createId(),
    profileId: sampleProfiles[0].id,
    platform: 'TikTok',
    createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    riskScore: 86,
    status: 'Open',
    mediaType: 'video',
    detection: {
      summary: 'Suspected synthetic voice and facial blending detected.',
      confidence: 0.92,
      breakdown: [
        { label: 'Voice Cloning', score: 0.94 },
        { label: 'Face Morphing', score: 0.88 },
        { label: 'Metadata Integrity', score: 0.79 },
      ],
      anomalies: [
        {
          id: createId(),
          frame: 134,
          description: 'Mouth movements desynchronised with audio track.',
          severity: 'High',
        },
        {
          id: createId(),
          frame: 189,
          description: 'Skin tone variance inconsistent with lighting.',
          severity: 'Medium',
        },
      ],
    },
  },
  {
    id: createId(),
    profileId: sampleProfiles[1].id,
    platform: 'YouTube',
    createdAt: new Date(Date.now() - 1000 * 60 * 90).toISOString(),
    riskScore: 42,
    status: 'In Review',
    mediaType: 'video',
    detection: {
      summary: 'Potential AI generated background noise detected.',
      confidence: 0.64,
      breakdown: [
        { label: 'Voice Cloning', score: 0.41 },
        { label: 'Frame Consistency', score: 0.52 },
        { label: 'Acoustic Fingerprint', score: 0.58 },
      ],
      anomalies: [
        {
          id: createId(),
          frame: 45,
          description: 'Background flicker identified.',
          severity: 'Low',
        },
      ],
    },
  },
];

const sampleLogs: LogEntry[] = [
  {
    id: createId(),
    timestamp: new Date(Date.now() - 1000 * 60 * 20).toISOString(),
    actor: 'Sofia Reyes',
    role: 'Analyst',
    action: 'Flagged deepfake risk',
    target: 'Alert #' + sampleAlerts[0].id.slice(-4),
    details: 'Escalated to executive security team for rapid takedown.',
    complianceTag: 'Chain-of-custody',
  },
  {
    id: createId(),
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(),
    actor: 'Mason Patel',
    role: 'Admin',
    action: 'Updated watchlist profile',
    target: sampleProfiles[1].fullName,
    details: 'Adjusted priority to Medium after quarterly review.',
    complianceTag: 'Watchlist management',
  },
];

const sampleMetrics: ScanMetric[] = Array.from({ length: 7 }).map((_, index) => {
  const date = new Date();
  date.setDate(date.getDate() - (6 - index));
  return {
    date: date.toISOString(),
    scans: Math.floor(Math.random() * 12) + 4,
    averageRisk: Math.round((Math.random() * 60 + 20) * 10) / 10,
  };
});

const samplePlatformMetrics: PlatformMetric[] = [
  { platform: 'TikTok', count: 12 },
  { platform: 'YouTube', count: 9 },
  { platform: 'Instagram', count: 6 },
  { platform: 'X', count: 4 },
  { platform: 'Reddit', count: 3 },
];

export const ERMProvider = ({ children }: { children: ReactNode }) => {
  const [role, setRole] = useState<UserRole>('Admin');
  const [profiles, setProfiles] = useState<ExecutiveProfile[]>(sampleProfiles);
  const [alerts, setAlerts] = useState<AlertRecord[]>(sampleAlerts);
  const [logs, setLogs] = useState<LogEntry[]>(sampleLogs);
  const [phoneContacts, setPhoneContacts] = useState<PhoneContact[]>([
    {
      id: createId(),
      label: 'Security Operations Bridge',
      phoneNumber: '+15555551234',
      alertLevel: 'High',
      createdAt: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
    },
  ]);
  const [voiceAgent, setVoiceAgent] = useState<VoiceAgentConfig>(initialVoiceAgent);
  const [callHistory, setCallHistory] = useState<VoiceCallRecord[]>([
    {
      id: createId(),
      label: 'Test Call - SOC',
      phoneNumber: '+15555551234',
      status: 'Completed',
      timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
      transcriptUrl: '#',
    },
  ]);
  const [scanMetrics, setScanMetrics] = useState<ScanMetric[]>(sampleMetrics);
  const [platformMetrics, setPlatformMetrics] = useState<PlatformMetric[]>(samplePlatformMetrics);

  const addProfile = useCallback((profileInput: Omit<ExecutiveProfile, 'id' | 'lastScan'>) => {
    setProfiles((prev) => [
      {
        ...profileInput,
        id: createId(),
        lastScan: new Date().toISOString(),
      },
      ...prev,
    ]);
    setLogs((prev) => [
      {
        id: createId(),
        timestamp: new Date().toISOString(),
        actor: 'System',
        role,
        action: 'Created watchlist profile',
        target: profileInput.fullName,
        details: 'Profile added to executive risk monitor.',
        complianceTag: 'Watchlist management',
      },
      ...prev,
    ]);
  }, [role]);

  const updateProfile = useCallback((profileId: string, updates: Partial<ExecutiveProfile>) => {
    setProfiles((prev) =>
      prev.map((profile) => (profile.id === profileId ? { ...profile, ...updates } : profile)),
    );
    if (updates.fullName || updates.priority || updates.notes) {
      const updatedProfile = profiles.find((profile) => profile.id === profileId);
      setLogs((prev) => [
        {
          id: createId(),
          timestamp: new Date().toISOString(),
          actor: 'System',
          role,
          action: 'Updated watchlist profile',
          target: updatedProfile?.fullName ?? profileId,
          details: 'Profile information adjusted by administrator.',
          complianceTag: 'Watchlist management',
        },
        ...prev,
      ]);
    }
  }, [profiles, role]);

  const deleteProfile = useCallback((profileId: string) => {
    const profile = profiles.find((item) => item.id === profileId);
    setProfiles((prev) => prev.filter((item) => item.id !== profileId));
    setAlerts((prev) => prev.filter((alert) => alert.profileId !== profileId));
    if (profile) {
      setLogs((prev) => [
        {
          id: createId(),
          timestamp: new Date().toISOString(),
          actor: 'System',
          role,
          action: 'Removed watchlist profile',
          target: profile.fullName,
          details: 'Profile removed following governance approval.',
          complianceTag: 'Watchlist management',
        },
        ...prev,
      ]);
    }
  }, [profiles, role]);

  const startScan = useCallback((profileIds?: string[]) => {
    const targets = profileIds && profileIds.length ? profiles.filter((p) => profileIds.includes(p.id)) : profiles;
    const newAlerts: AlertRecord[] = targets.map((profile) => {
      const riskScore = Math.round(Math.random() * 70 + 20);
      return {
        id: createId(),
        profileId: profile.id,
        platform: ['TikTok', 'YouTube', 'Instagram', 'LinkedIn'][Math.floor(Math.random() * 4)],
        createdAt: new Date().toISOString(),
        riskScore,
        status: riskScore > 75 ? 'Open' : 'In Review',
        mediaType: 'video',
        detection: {
          summary: 'Automated deepfake sweep completed. Review anomalies before escalation.',
          confidence: Math.round((0.6 + Math.random() * 0.35) * 100) / 100,
          breakdown: [
            { label: 'Visual Manipulation', score: Math.random() },
            { label: 'Audio Integrity', score: Math.random() },
            { label: 'Metadata Integrity', score: Math.random() },
          ],
          anomalies: [
            {
              id: createId(),
              frame: Math.floor(Math.random() * 300),
              description: 'Temporal inconsistency detected against reference dataset.',
              severity: riskScore > 75 ? 'High' : 'Medium',
            },
          ],
        },
      };
    });

    if (newAlerts.length) {
      setAlerts((prev) => [...newAlerts, ...prev]);
      setLogs((prev) => [
        {
          id: createId(),
          timestamp: new Date().toISOString(),
          actor: 'Automated Scanner',
          role: 'Analyst',
          action: 'Completed sweep',
          target: `${newAlerts.length} profile(s)`,
          details: 'Synthetic media scan executed with simulated engine.',
          complianceTag: 'Scan evidence',
        },
        ...prev,
      ]);
      setScanMetrics((prev) => {
        const today = new Date().toISOString().split('T')[0];
        const existing = prev.find((metric) => metric.date.startsWith(today));
        if (existing) {
          return prev.map((metric) =>
            metric.date.startsWith(today)
              ? {
                  ...metric,
                  scans: metric.scans + newAlerts.length,
                  averageRisk: averageRiskScore([
                    metric.averageRisk,
                    ...newAlerts.map((alert) => alert.riskScore),
                  ]),
                }
              : metric,
          );
        }
        return [
          ...prev,
          {
            date: new Date().toISOString(),
            scans: newAlerts.length,
            averageRisk: averageRiskScore(newAlerts.map((alert) => alert.riskScore)),
          },
        ];
      });
    }
  }, [profiles]);

  const updateAlertStatus = useCallback(
    (alertId: string, status: AlertStatus, options?: { assignedTo?: string }) => {
      setAlerts((prev) =>
        prev.map((alert) =>
          alert.id === alertId
            ? {
                ...alert,
                status,
                assignedTo: options?.assignedTo ?? alert.assignedTo,
              }
            : alert,
        ),
      );
      const alert = alerts.find((item) => item.id === alertId);
      if (alert) {
        setLogs((prev) => [
          {
            id: createId(),
            timestamp: new Date().toISOString(),
            actor: 'System',
            role,
            action: `Alert status changed to ${status}`,
            target: `Alert #${alert.id.slice(-6)}`,
            details: options?.assignedTo
              ? `Assigned to ${options.assignedTo} and status updated.`
              : 'Status updated.',
            complianceTag: 'Alert handling',
          },
          ...prev,
        ]);
      }
    },
    [alerts, role],
  );

  const markAlertFalsePositive = useCallback(
    (alertId: string, reason: string) => {
      updateAlertStatus(alertId, 'False Positive');
      const alert = alerts.find((item) => item.id === alertId);
      if (alert) {
        setLogs((prev) => [
          {
            id: createId(),
            timestamp: new Date().toISOString(),
            actor: 'System',
            role,
            action: 'Marked alert false positive',
            target: `Alert #${alert.id.slice(-6)}`,
            details: reason,
            complianceTag: 'Quality assurance',
          },
          ...prev,
        ]);
      }
    },
    [alerts, role, updateAlertStatus],
  );

  const logAction = useCallback(
    (entry: Omit<LogEntry, 'id' | 'timestamp' | 'role'> & { role?: UserRole }) => {
      setLogs((prev) => [
        {
          id: createId(),
          timestamp: new Date().toISOString(),
          role: entry.role ?? role,
          ...entry,
        },
        ...prev,
      ]);
    },
    [role],
  );

  const addPhoneContact = useCallback((contact: Omit<PhoneContact, 'id' | 'createdAt'>) => {
    setPhoneContacts((prev) => [
      {
        ...contact,
        id: createId(),
        createdAt: new Date().toISOString(),
      },
      ...prev,
    ]);
  }, []);

  const deletePhoneContact = useCallback((contactId: string) => {
    setPhoneContacts((prev) => prev.filter((contact) => contact.id !== contactId));
  }, []);

  const updateVoiceAgent = useCallback((config: VoiceAgentConfig) => {
    setVoiceAgent(config);
  }, []);

  const recordTestCall = useCallback((contact: { label: string; phoneNumber: string }) => {
    setCallHistory((prev) => [
      {
        id: createId(),
        label: `Test Call - ${contact.label}`,
        phoneNumber: contact.phoneNumber,
        status: Math.random() > 0.1 ? 'Completed' : 'Failed',
        timestamp: new Date().toISOString(),
        transcriptUrl: '#',
      },
      ...prev,
    ]);
    setLogs((prev) => [
      {
        id: createId(),
        timestamp: new Date().toISOString(),
        actor: 'Voice Automation',
        role: 'Analyst',
        action: 'Voice alert test executed',
        target: contact.label,
        details: 'ElevenLabs placeholder call triggered for verification.',
        complianceTag: 'Voice alerting',
      },
      ...prev,
    ]);
  }, []);

  const averageRisk = useMemo(() => averageRiskScore(alerts.map((alert) => alert.riskScore)), [alerts]);

  const value = useMemo(
    () => ({
      role,
      setRole,
      profiles,
      alerts,
      logs,
      phoneContacts,
      voiceAgent,
      callHistory,
      scanMetrics,
      platformMetrics,
      averageRisk,
      addProfile,
      updateProfile,
      deleteProfile,
      startScan,
      updateAlertStatus,
      markAlertFalsePositive,
      logAction,
      addPhoneContact,
      deletePhoneContact,
      updateVoiceAgent,
      recordTestCall,
    }),
    [
      role,
      profiles,
      alerts,
      logs,
      phoneContacts,
      voiceAgent,
      callHistory,
      scanMetrics,
      platformMetrics,
      averageRisk,
      addProfile,
      updateProfile,
      deleteProfile,
      startScan,
      updateAlertStatus,
      markAlertFalsePositive,
      logAction,
      addPhoneContact,
      deletePhoneContact,
      updateVoiceAgent,
      recordTestCall,
    ],
  );

  return <ERMContext.Provider value={value}>{children}</ERMContext.Provider>;
};

export const useERM = () => {
  const context = useContext(ERMContext);
  if (!context) {
    throw new Error('useERM must be used within an ERMProvider');
  }
  return context;
};
