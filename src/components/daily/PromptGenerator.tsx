import { useState } from 'react';
import { PROMPT_GOALS, buildPrompt, type PromptGoalId } from '../../lib/prompts';

export function PromptGenerator() {
  const [goal, setGoal] = useState<PromptGoalId>('phishing');
  const [context, setContext] = useState('');
  const [copied, setCopied] = useState(false);
  const prompt = buildPrompt(goal, context);

  async function copy() {
    try {
      await navigator.clipboard.writeText(prompt);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  }

  return (
    <div className="prompt-tool">
      <label htmlFor="prompt-goal">Goal</label>
      <select id="prompt-goal" value={goal} onChange={(event) => setGoal(event.target.value as PromptGoalId)}>
        {PROMPT_GOALS.map((item) => (
          <option key={item.id} value={item.id}>{item.label}</option>
        ))}
      </select>
      <label htmlFor="prompt-context">Context</label>
      <textarea
        id="prompt-context"
        value={context}
        maxLength={4000}
        placeholder="Describe the system, message, or situation. Leave out passwords and live codes."
        onChange={(event) => {
          setContext(event.target.value);
          setCopied(false);
        }}
      />
      <div className="prompt-output" aria-live="polite">
        <pre>{prompt}</pre>
      </div>
      <button type="button" className="check-go" onClick={() => void copy()}>
        {copied ? 'Copied' : 'Copy prompt'}
      </button>
    </div>
  );
}
