export interface ChoiceTask {
  id: string;
  title: string;
  sample: string;
  choices: [string, string];
  answer: string;
  why: string;
}

export interface WriteTask {
  id: string;
  title: string;
  prompt: string;
  min: number;
}

export const labelTask: ChoiceTask = {
  id: 'label-sms',
  title: 'Label one sample text',
  sample: 'CHASE ALERT: Your account is locked. Verify now: http://chase-secure-verify.example/login',
  choices: ['Scam', 'Not a scam'],
  answer: 'Scam',
  why: 'The example impersonates a bank and pushes a lookalike link.',
};

export const flagTask: ChoiceTask = {
  id: 'flag-post',
  title: 'Flag one fake post',
  sample: 'Send 0.1 ETH to this wallet and I will send 1 ETH back today. Spots are almost gone.',
  choices: ['Scam bait', 'Ordinary post'],
  answer: 'Scam bait',
  why: 'The example asks for crypto first and invents urgency.',
};

export const promptTask: WriteTask = {
  id: 'safety-prompt',
  title: 'Write one safety prompt',
  prompt: 'Write one instruction an assistant should follow before it tells someone a message is safe.',
  min: 40,
};

export function choiceIsRight(task: ChoiceTask, choice: string) {
  return choice === task.answer;
}

export function promptIsReady(text: string) {
  return text.trim().length >= promptTask.min;
}
