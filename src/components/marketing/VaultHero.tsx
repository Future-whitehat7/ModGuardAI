import { lazy, Suspense, useEffect, useState } from 'react';
import { MonolithFallback } from './MonolithFallback';
import { VaultBoundary } from './VaultBoundary';

const VaultCanvas = lazy(() => import('./VaultCanvas').then((module) => ({ default: module.VaultCanvas })));

function webglAvailable() {
  try {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl2') || canvas.getContext('webgl');
    return Boolean(gl);
  } catch {
    return false;
  }
}

export function VaultHero() {
  const [reduced, setReduced] = useState(false);
  const [failed, setFailed] = useState(false);
  const [webgl] = useState(webglAvailable);

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const apply = () => setReduced(media.matches);
    apply();
    media.addEventListener('change', apply);
    return () => media.removeEventListener('change', apply);
  }, []);

  return (
    <div className="vault-stage">
      {reduced || failed || !webgl ? (
        <MonolithFallback />
      ) : (
        <VaultBoundary fallback={<MonolithFallback />}>
          <Suspense fallback={<MonolithFallback />}>
            <VaultCanvas onFail={() => setFailed(true)} />
          </Suspense>
        </VaultBoundary>
      )}
    </div>
  );
}
