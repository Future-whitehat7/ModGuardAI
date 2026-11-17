import { useEffect, useState } from 'react';
import { readBoard, type CommunityBoard } from '../community/board';
import { emptyProgress, PROGRESS_KEY, readProgress, recordTask, type Progress } from '../community/progress';
import { CampusKit } from '../components/community/CampusKit';
import { FiveMinute } from '../components/community/FiveMinute';
import { Founding } from '../components/community/Founding';
import { Hackathons } from '../components/community/Hackathons';
import { Mission } from '../components/community/Mission';

const emptyBoard: CommunityBoard = { contributors: [], shipped: [], hackathons: [] };

export function Community() {
  const [board, setBoard] = useState<CommunityBoard>(emptyBoard);
  const [progress, setProgress] = useState<Progress>(emptyProgress);
  const [now] = useState(() => Date.now());

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
      return next;
    });
  };

  return (
    <article className="page-wrap community-page mx-auto w-full max-w-6xl px-4 sm:px-6">
      <p className="eyebrow">Community</p>
      <h1 className="display section-display mt-4 text-ice">Come build the check.</h1>
      <p className="community-copy">
        Early, public, and unpaid. Five parts. Each one says what is real and what is still empty.
      </p>
      <Founding board={board} progress={progress} />
      <Hackathons board={board} now={now} />
      <FiveMinute progress={progress} onDone={onDone} />
      <Mission />
      <CampusKit />
    </article>
  );
}
