export async function startSmoothScroll() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const [{ default: Lenis }, gsapModule, scrollModule] = await Promise.all([
    import('lenis'),
    import('gsap'),
    import('gsap/ScrollTrigger'),
  ]);
  const gsap = gsapModule.default;
  gsap.registerPlugin(scrollModule.ScrollTrigger);
  const lenis = new Lenis({ lerp: 0.1 });
  lenis.on('scroll', scrollModule.ScrollTrigger.update);
  gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
  });
  gsap.ticker.lagSmoothing(0);
  document.documentElement.classList.add('motion-js');
  document.querySelectorAll<HTMLElement>('.reveal').forEach((element) => {
    gsap.from(element, {
      y: 28,
      autoAlpha: 0,
      duration: 0.9,
      ease: 'expo.out',
      scrollTrigger: { trigger: element, start: 'top 90%' },
    });
  });
}
