export const PROMPT_GOALS = [
  {
    id: 'phishing',
    label: 'Phishing triage',
    instruction: 'You are helping someone triage a suspected phishing message. Classify the message, name the concrete signals in the text they supplied, and list what to do next. Do not click links or open attachments for them.',
  },
  {
    id: 'incident',
    label: 'Incident response plan',
    instruction: 'Draft an incident-response plan for the situation they describe. Cover detection, containment, communication, recovery, and what evidence to preserve. Mark every step that needs a fact they did not provide.',
  },
  {
    id: 'policy',
    label: 'Security policy draft',
    instruction: 'Draft a short security policy for the team and system they describe. Use plain language, state who is responsible, and separate required controls from suggestions.',
  },
  {
    id: 'threat',
    label: 'Threat modeling',
    instruction: 'Threat-model the system they describe. List assets, likely adversaries, abuse paths, and mitigations. Tie each threat to a detail they actually gave.',
  },
  {
    id: 'access',
    label: 'Password and 2FA audit',
    instruction: 'Review the account and login setup they describe. Recommend password, passkey, and two-factor changes in priority order. Do not ask them to paste live passwords or one-time codes.',
  },
  {
    id: 'deepfake',
    label: 'Deepfake check',
    instruction: 'Help them assess whether a clip, image, or voice note may be synthetic. List questions to check, what the supplied context does and does not prove, and when to ask the real person on a known channel.',
  },
] as const;

export type PromptGoalId = (typeof PROMPT_GOALS)[number]['id'];

export function buildPrompt(goalId: PromptGoalId, context: string): string {
  const goal = PROMPT_GOALS.find((item) => item.id === goalId) ?? PROMPT_GOALS[0];
  const supplied = context.trim();
  return [
    goal.instruction,
    '',
    'Context from the person asking:',
    supplied || '(No extra context was provided. Ask for the missing facts instead of inventing them.)',
    '',
    'Rules: Use only this context and well-known public practice. Do not invent incidents, logs, quotes, or statistics. Say what is unknown. End with the next three actions.',
  ].join('\n');
}
