import { useCallback, useEffect, useRef, useState } from 'react';
import { languageLabels, veraBirthdayTranslations, type VeraLanguage } from '../../i18n/veraBirthday';
import BloomingFlower from './BloomingFlower';
import FloatingPetals from './FloatingPetals';
import LanguageSelector from './LanguageSelector';
import StoryText from './StoryText';
import SunReveal from './SunReveal';

const START_TRACK = '/audio/songforStart.mp3';
const SUN_TRACK = '/audio/songforSun.mp3';
const SUN_TRACK_PROGRESS = 0.999;

export default function VeraStoryClient() {
  const rootRef = useRef<HTMLElement | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const cursorRef = useRef<HTMLDivElement | null>(null);
  const currentTrackRef = useRef(START_TRACK);
  const [language, setLanguage] = useState<VeraLanguage>('es');
  const [sceneIndex, setSceneIndex] = useState(0);
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const [musicNeedsGesture, setMusicNeedsGesture] = useState(false);
  const [currentTrack, setCurrentTrack] = useState(START_TRACK);
  const scenes = veraBirthdayTranslations[language].scenes;

  const updateScene = useCallback((progress: number) => {
    const nextScene = Math.min(scenes.length - 1, Math.floor(progress * scenes.length));
    setSceneIndex((current) => (current === nextScene ? current : nextScene));
  }, [scenes.length]);

  const switchTrack = useCallback((nextTrack: string) => {
    const audio = audioRef.current;
    if (!audio || currentTrackRef.current === nextTrack) return;

    const wasMuted = audio.muted;
    const shouldKeepPlaying = !audio.paused;
    currentTrackRef.current = nextTrack;
    setCurrentTrack(nextTrack);
    audio.src = nextTrack;
    audio.currentTime = 0;
    audio.muted = wasMuted;
    audio.load();

    if (shouldKeepPlaying) {
      void audio.play().then(() => {
        setIsMusicPlaying(true);
        setMusicNeedsGesture(audio.muted);
      }).catch(() => {
        setIsMusicPlaying(false);
        setMusicNeedsGesture(true);
      });
    }
  }, []);

  const playMusic = useCallback(async () => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.volume = 0.42;
    audio.muted = false;

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

    if (!audio.paused && audio.muted) {
      audio.muted = false;
      setIsMusicPlaying(true);
      setMusicNeedsGesture(false);
      return;
    }

    if (audio.paused) {
      audio.muted = false;
      void playMusic();
      return;
    }

    audio.pause();
    setIsMusicPlaying(false);
    setMusicNeedsGesture(false);
  }, [playMusic]);

  const playNextTrack = useCallback(() => {
    const audio = audioRef.current;
    if (audio) {
      audio.muted = false;
    }
    switchTrack(currentTrackRef.current === START_TRACK ? SUN_TRACK : START_TRACK);
    window.setTimeout(() => {
      void playMusic();
    }, 0);
  }, [playMusic, switchTrack]);

  useEffect(() => {
    void playMusic();

    const unlockMusic = () => {
      const audio = audioRef.current;
      if (audio) {
        audio.muted = false;
      }
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
    const cursor = cursorRef.current;
    if (!cursor || window.matchMedia('(pointer: coarse)').matches) return;

    let animationFrame = 0;
    let targetX = window.innerWidth * 0.72;
    let targetY = window.innerHeight * 0.42;
    let currentX = targetX;
    let currentY = targetY;

    const moveCursor = (event: PointerEvent) => {
      targetX = event.clientX;
      targetY = event.clientY;
      cursor.classList.add('is-visible');
    };

    const renderCursor = () => {
      currentX += (targetX - currentX) * 0.22;
      currentY += (targetY - currentY) * 0.22;
      cursor.style.transform = `translate3d(${currentX}px, ${currentY}px, 0)`;
      animationFrame = requestAnimationFrame(renderCursor);
    };

    window.addEventListener('pointermove', moveCursor, { passive: true });
    renderCursor();

    return () => {
      window.removeEventListener('pointermove', moveCursor);
      cancelAnimationFrame(animationFrame);
    };
  }, []);

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
      const poemItems = gsap.utils.toArray<HTMLElement>('.poem-reveal');
      const papyrusWindow = root.querySelector<HTMLElement>('.papyrus-window');
      const papyrusScroll = root.querySelector<HTMLElement>('.papyrus-scroll');
      const introFlower = root.querySelector<HTMLElement>('.papyrus-intro-flower');

      gsap.set(root, {
        '--bloom': reduceMotion ? 1 : 0,
        '--sun': reduceMotion ? 1 : 0,
        '--garden': reduceMotion ? 1 : 0,
      });

      gsap.set(poemItems, {
        opacity: reduceMotion ? 1 : 0,
        y: reduceMotion ? 0 : 24,
        filter: reduceMotion ? 'blur(0px)' : 'blur(12px)',
      });

      const updatePoemItems = (progress: number) => {
        const total = Math.max(1, poemItems.length - 1);
        const papyrusTravel = papyrusWindow && papyrusScroll
          ? Math.max(0, papyrusScroll.scrollHeight - papyrusWindow.clientHeight)
          : 0;

        if (papyrusScroll) {
          gsap.set(papyrusScroll, {
            y: -papyrusTravel * progress,
          });
        }

        if (introFlower) {
          const flowerExit = gsap.utils.clamp(0, 1, (progress - 0.08) / 0.18);

          gsap.set(introFlower, {
            opacity: 1 - flowerExit,
            y: 0,
            scale: 1,
            filter: `blur(${(flowerExit * 7).toFixed(2)}px) drop-shadow(0 10px 14px rgb(70 34 115 / 0.18)) saturate(1.08)`,
          });
        }

        const windowRect = papyrusWindow?.getBoundingClientRect();
        const readableTop = windowRect ? windowRect.top + windowRect.height * 0.16 : 0;
        const readableBottom = windowRect ? windowRect.bottom - windowRect.height * 0.12 : 0;
        const readableHeight = windowRect ? Math.max(1, readableBottom - readableTop) : 1;

        poemItems.forEach((item, index) => {
          const isFinalScene = item.closest('.is-birthday') !== null;
          const itemRect = item.getBoundingClientRect();
          const entry = windowRect
            ? gsap.utils.clamp(0, 1, (readableBottom - itemRect.top) / (readableHeight * 0.34))
            : gsap.utils.clamp(0, 1, (progress - (0.3 + index / total * 0.58)) / 0.1);
          const exit = windowRect && !isFinalScene
            ? gsap.utils.clamp(0, 1, (readableTop - itemRect.bottom) / (readableHeight * 0.22))
            : 0;
          const reveal = entry;
          const opacity = reveal * (1 - exit);
          const y = (1 - reveal) * 24 + exit * -16;
          const blur = (1 - reveal) * 12 + exit * 8;

          gsap.set(item, {
            opacity,
            y,
            filter: `blur(${blur.toFixed(2)}px)`,
          });
        });
      };

      if (reduceMotion) {
        updateScene(1);
        return;
      }

      updatePoemItems(0);

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
            updatePoemItems(self.progress);
            if (self.progress >= SUN_TRACK_PROGRESS) {
              switchTrack(SUN_TRACK);
            }
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

      requestAnimationFrame(() => {
        ScrollTrigger.refresh();
        const progress = timeline.scrollTrigger?.progress ?? 0;
        root.style.setProperty('--scroll-progress', progress.toFixed(4));
        updateScene(progress);
        updatePoemItems(progress);
      });
      }, root);

      cleanup = () => context.revert();
    });

    return () => {
      isMounted = false;
      cleanup?.();
    };
  }, [language, switchTrack, updateScene]);

  return (
    <main className="vera-story" ref={rootRef}>
      <audio
        ref={audioRef}
        autoPlay
        loop
        playsInline
        preload="auto"
        onPause={() => setIsMusicPlaying(false)}
        onPlay={() => {
          setIsMusicPlaying(true);
          setMusicNeedsGesture(Boolean(audioRef.current?.muted));
        }}
        src={START_TRACK}
      />
      <div className="music-controls">
        <button
          className="music-toggle"
          type="button"
          aria-pressed={isMusicPlaying}
          aria-label={isMusicPlaying ? 'Pausar musica de fondo' : 'Reproducir musica de fondo'}
          onPointerDown={(event) => event.stopPropagation()}
          onClick={toggleMusic}
        >
          <span className="music-toggle-icon" aria-hidden="true">{isMusicPlaying ? '||' : '♪'}</span>
          <span>{isMusicPlaying ? (currentTrack === SUN_TRACK ? 'Sol' : 'Musica') : musicNeedsGesture ? 'Tocar' : 'Play'}</span>
        </button>
        <button
          className="music-next"
          type="button"
          aria-label="Cambiar cancion"
          onPointerDown={(event) => event.stopPropagation()}
          onClick={playNextTrack}
        >
          Siguiente
        </button>
      </div>
      <div className="vera-cursor" ref={cursorRef} aria-hidden="true">
        <span className="cursor-ear cursor-ear-left" />
        <span className="cursor-ear cursor-ear-right" />
        <span className="cursor-head">
          <span className="cursor-eye cursor-eye-left" />
          <span className="cursor-eye cursor-eye-right" />
          <span className="cursor-smile" />
        </span>
        <span className="cursor-robe" />
        <span className="cursor-arm cursor-arm-left" />
        <span className="cursor-arm cursor-arm-right" />
      </div>
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
