const SELECTOR = '.rise';

let observer: IntersectionObserver | null = null;

function reducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function ensureObserver() {
  if (observer || reducedMotion()) return;
  observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-in');
      observer?.unobserve(entry.target);
    });
  }, { threshold: 0.18, rootMargin: '0px 0px -8% 0px' });
}

export function observeRises(root: ParentNode = document) {
  const nodes = root.querySelectorAll<HTMLElement>(`${SELECTOR}:not(.is-in)`);
  if (reducedMotion()) {
    nodes.forEach((node) => node.classList.add('is-in'));
    return;
  }
  ensureObserver();
  const view = window.innerHeight * 0.92;
  nodes.forEach((node) => {
    if (node.getBoundingClientRect().top < view) node.classList.add('is-in');
    else observer?.observe(node);
  });
  document.documentElement.classList.add('rise');
}
