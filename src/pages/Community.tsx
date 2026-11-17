import { useEffect, useState } from 'react';
import { readBoard, type CommunityBoard } from '../community/board';
import { emptyProgress, PROGRESS_KEY, readProgress, recordTask, type Progress } from '../community/progress';
import { CampusKit } from '../components/community/CampusKit';
import { CommunityForm } from '../components/community/CommunityForm';
import { FiveMinute } from '../components/community/FiveMinute';
import { Founding } from '../components/community/Founding';
import { Hackathons } from '../components/community/Hackathons';
import { Mission } from '../components/community/Mission';
import { PlayerPath } from '../components/community/PlayerPath';

const emptyBoard: CommunityBoard = { contributors: [], shipped: [], hackathons: [] };

export function Community() {
  const [board, setBoard] = useState<CommunityBoard>(emptyBoard);
  const [progress, setProgress] = useState<Progress>(emptyProgress);
  const [now] = useState(() => Date.now());
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    setProgress(readProgress(window.localStorage.getItem(PROGRESS_KEY)));
    const load = async () => {
      try {
        const response = await fetch('/community/board.json');
        if (!response.ok) return;
        setBoard(readBoard(await response.json()));
      } catch {
        setBoard(emptyBoard);
      }
    };
    void load();
  }, []);

  const onDone = (taskId: string, displayName: string) => {
    const today = new Date().toISOString().slice(0, 10);
    setProgress((current) => {
      const next = { ...recordTask(current, taskId, today), displayName: displayName || current.displayName };
      window.localStorage.setItem(PROGRESS_KEY, JSON.stringify(next));
      setAnimate(true);
      return next;
    });
  };

  return (
    <article className="page-wrap community-page mx-auto w-full max-w-6xl px-4 sm:px-6">
      <p className="eyebrow">Community</p>
      <h1 className="display section-display mt-4 text-ice">The ModGuard community.</h1>
      <p className="community-copy">A doorway task, a build, then a public name.</p>
      <PlayerPath progress={progress} animate={animate} />
      <Founding board={board} />
      <FiveMinute progress={progress} onDone={onDone} />
      <CommunityForm
        id="join"
        formName="community-join"
        title="I'm in"
        lede="We read every one and reply by email."
        fields={[
          { name: 'name', label: 'Name' },
          { name: 'email', label: 'Email', type: 'email' },
          { name: 'handle', label: 'Handle, if you want it public', required: false },
          { name: 'focus', label: 'What do you want to help build?', type: 'textarea' },
        ]}
      />
      <Hackathons board={board} now={now} />
      <Mission />
      <CampusKit />
    </article>
  );
}
