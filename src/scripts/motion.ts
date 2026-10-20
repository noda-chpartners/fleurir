import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import 'lenis/dist/lenis.css';

gsap.registerPlugin(ScrollTrigger);
let pageScroller: Lenis | undefined;
export function pausePageScroll(paused: boolean) {
  if (paused) pageScroller?.stop();
  else pageScroller?.start();
}
const media = gsap.matchMedia();
media.add('(prefers-reduced-motion: no-preference)', () => {
  const lenis = new Lenis({ duration: 1.05, smoothWheel: true, syncTouch: false, anchors: { offset: -24 } });
  pageScroller = lenis;
  const tick = (time: number) => lenis.raf(time * 1000);
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add(tick);
  gsap.ticker.lagSmoothing(0);
  const intro = gsap.timeline({ defaults: { ease: 'power3.out' } });
  intro.from('.hero-line', { y: 32, opacity: 0, duration: .85, stagger: .13 })
    .from('.hero-eyebrow, .hero-description, .hero-link', { y: 14, opacity: 0, duration: .65, stagger: .08 }, .25)
    .from('.hero-picture', { scale: 1.035, duration: 1.3 }, 0)
    .from('.hero-wordmark', { y: 25, opacity: 0, duration: 1 }, .2);
  gsap.utils.toArray<HTMLElement>('[data-reveal]').forEach(element => {
    gsap.from(element, { y: 22, opacity: 0, duration: .75, ease: 'power2.out', scrollTrigger: { trigger: element, start: 'top 92%', once: true } });
  });
  gsap.from('[data-price-row]', { y: 14, opacity: 0, stagger: .12, duration: .65, scrollTrigger: { trigger: '.price-sheet', start: 'top 88%', once: true } });
  const desktop = gsap.matchMedia();
  desktop.add('(min-width: 769px)', () => {
    gsap.to('.hero-picture img', { y: 35, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });
    gsap.utils.toArray<HTMLElement>('[data-image-reveal]').forEach(element => {
      gsap.from(element, { clipPath: 'inset(7% 0 7% 0)', duration: 1.2, ease: 'power2.out', scrollTrigger: { trigger: element, start: 'top 85%', once: true } });
    });
  });
  const refresh = () => ScrollTrigger.refresh();
  document.fonts.ready.then(refresh);
  window.addEventListener('load', refresh, { once: true });
  return () => { desktop.revert(); lenis.destroy(); if (pageScroller === lenis) pageScroller = undefined; gsap.ticker.remove(tick); window.removeEventListener('load', refresh); };
});
