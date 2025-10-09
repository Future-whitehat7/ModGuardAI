export type PriorityLevel = 'High' | 'Medium' | 'Low';
export type AlertStatus = 'Open' | 'In Review' | 'Resolved' | 'False Positive';
export type AlertLevel = 'High' | 'Medium';
export type UserRole = 'Admin' | 'Analyst' | 'Viewer';

export interface MediaReference {
  id: string;
  name: string;
  size: number;
  type: 'photo' | 'video' | 'voice';
}

export interface ExecutiveProfile {
  id: string;
  fullName: string;
  title: string;
  organization: string;
  priority: PriorityLevel;
  lastScan: string;
  notes: string;
  photos: MediaReference[];
  videos: MediaReference[];
  voiceSamples: MediaReference[];
}

export interface AlertAnomaly {
  id: string;
  frame: number;
  description: string;
  severity: 'Low' | 'Medium' | 'High';
}

export interface DetectionDetail {
  summary: string;
  confidence: number;
  breakdown: Array<{ label: string; score: number }>;
  anomalies: AlertAnomaly[];
}

export interface AlertRecord {
  id: string;
  profileId: string;
  platform: string;
  createdAt: string;
  riskScore: number;
  status: AlertStatus;
  assignedTo?: string;
  mediaType: 'video' | 'audio' | 'image';
  detection: DetectionDetail;
}

export interface LogEntry {
  id: string;
  timestamp: string;
  actor: string;
  role: UserRole;
  action: string;
  target: string;
  details: string;
  complianceTag: string;
}

export interface PhoneContact {
  id: string;
  label: string;
  phoneNumber: string;
  alertLevel: AlertLevel;
  createdAt: string;
}

export interface VoiceAgentConfig {
  agentId: string;
  voiceId: string;
  systemPrompt: string;
}

export interface VoiceCallRecord {
  id: string;
  contactId?: string;
  label: string;
  phoneNumber: string;
  status: 'Completed' | 'Failed' | 'Pending';
  timestamp: string;
  transcriptUrl?: string;
}

export interface ScanMetric {
  date: string;
  scans: number;
  averageRisk: number;
}

export interface PlatformMetric {
  platform: string;
  count: number;
}
