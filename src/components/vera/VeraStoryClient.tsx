import { useCallback, useEffect, useRef, useState } from 'react';
import { languageLabels, veraBirthdayTranslations, type VeraLanguage } from '../../i18n/veraBirthday';
import BloomingFlower from './BloomingFlower';
import FloatingPetals from './FloatingPetals';
import LanguageSelector from './LanguageSelector';
import StoryText from './StoryText';
import SunReveal from './SunReveal';

export default function VeraStoryClient() {
  const rootRef = useRef<HTMLElement | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [language, setLanguage] = useState<VeraLanguage>('es');
  const [sceneIndex, setSceneIndex] = useState(0);
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const [musicNeedsGesture, setMusicNeedsGesture] = useState(false);
  const scenes = veraBirthdayTranslations[language].scenes;

  const updateScene = useCallback((progress: number) => {
    const nextScene = Math.min(scenes.length - 1, Math.floor(progress * scenes.length));
    setSceneIndex((current) => (current === nextScene ? current : nextScene));
  }, [scenes.length]);

  const playMusic = useCallback(async () => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.volume = 0.42;

    try {
      await audio.play();
      setIsMusicPlaying(true);
      setMusicNeedsGesture(false);
    } catch {
      setIsMusicPlaying(false);
      setMusicNeedsGesture(true);
    }
  }, []);

  const toggleMusic = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (audio.paused) {
      void playMusic();
      return;
    }

    audio.pause();
    setIsMusicPlaying(false);
    setMusicNeedsGesture(false);
  }, [playMusic]);

  useEffect(() => {
    void playMusic();

    const unlockMusic = () => {
      void playMusic();
    };

    window.addEventListener('pointerdown', unlockMusic, { once: true });
    window.addEventListener('keydown', unlockMusic, { once: true });
    window.addEventListener('scroll', unlockMusic, { once: true, passive: true });

    return () => {
      window.removeEventListener('pointerdown', unlockMusic);
      window.removeEventListener('keydown', unlockMusic);
      window.removeEventListener('scroll', unlockMusic);
    };
  }, [playMusic]);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    let cleanup: (() => void) | undefined;
    let isMounted = true;
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    Promise.all([
      import('gsap'),
      import('gsap/ScrollTrigger'),
    ]).then(([gsapModule, scrollTriggerModule]) => {
      if (!isMounted) return;

      const gsap = gsapModule.default;
      const ScrollTrigger = scrollTriggerModule.ScrollTrigger;
      gsap.registerPlugin(ScrollTrigger);

      const context = gsap.context(() => {
      const floaters = gsap.utils.toArray<HTMLElement>('.floating-petal');

      gsap.set(root, {
        '--bloom': reduceMotion ? 1 : 0,
        '--sun': reduceMotion ? 1 : 0,
        '--garden': reduceMotion ? 1 : 0,
      });

      if (reduceMotion) {
        updateScene(1);
        return;
      }

      const timeline = gsap.timeline({
        defaults: { ease: 'power2.out' },
        scrollTrigger: {
          trigger: root,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 0.8,
          onUpdate: (self) => {
            root.style.setProperty('--scroll-progress', self.progress.toFixed(4));
            updateScene(self.progress);
          },
        },
      });

      timeline
        .to(root, { '--bloom': 0.18, duration: 0.2 }, 0)
        .to(root, { '--bloom': 0.42, '--garden': 0.18, duration: 0.25 }, 0.2)
        .to(root, { '--bloom': 0.68, '--garden': 0.34, duration: 0.2 }, 0.45)
        .to(root, { '--bloom': 0.88, duration: 0.15 }, 0.65)
        .to(root, { '--bloom': 1, '--sun': 1, '--garden': 1, duration: 0.2 }, 0.8);

      timeline.to(floaters, {
        opacity: 0.8,
        x: (index) => Number(floaters[index].dataset.x ?? 0),
        y: (index) => Number(floaters[index].dataset.y ?? -120),
        rotate: (index) => Number(floaters[index].dataset.r ?? 120),
        stagger: 0.01,
        duration: 0.9,
      }, 0.35);
      }, root);

      cleanup = () => context.revert();
    });

    return () => {
      isMounted = false;
      cleanup?.();
    };
  }, [updateScene]);

  return (
    <main className="vera-story" ref={rootRef}>
      <audio
        ref={audioRef}
        loop
        preload="auto"
        onPause={() => setIsMusicPlaying(false)}
        onPlay={() => {
          setIsMusicPlaying(true);
          setMusicNeedsGesture(false);
        }}
      >
        <source src="/audio/vera-voyager.wav" type="audio/wav" />
      </audio>
      <button
        className="music-toggle"
        type="button"
        aria-pressed={isMusicPlaying}
        aria-label={isMusicPlaying ? 'Pausar musica de fondo' : 'Reproducir musica de fondo'}
        onClick={toggleMusic}
      >
        <span className="music-toggle-icon" aria-hidden="true">{isMusicPlaying ? '||' : '♪'}</span>
        <span>{isMusicPlaying ? 'Musica' : musicNeedsGesture ? 'Tocar' : 'Play'}</span>
      </button>
      <LanguageSelector
        labels={languageLabels}
        language={language}
        onChange={(nextLanguage) => {
          setLanguage(nextLanguage);
          setSceneIndex(0);
        }}
      />
      <section className="story-stage">
        <div className="cold-sky" aria-hidden="true">
          <span className="cloud cloud-a" />
          <span className="cloud cloud-b" />
          <span className="cloud cloud-c" />
          <span className="cloud cloud-d" />
          <span className="cold-mist cold-mist-a" />
          <span className="cold-mist cold-mist-b" />
        </div>
        <div className="story-layout">
          <StoryText key={language} scenes={scenes} activeIndex={sceneIndex} />
          <div className="flower-side">
            <SunReveal />
            <FloatingPetals />
            <BloomingFlower />
          </div>
        </div>
      </section>
      <div className="scroll-space" aria-hidden="true" />
    </main>
  );
}
