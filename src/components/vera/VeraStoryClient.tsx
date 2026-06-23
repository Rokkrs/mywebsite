import { useCallback, useEffect, useRef, useState, type CSSProperties } from 'react';
import { languageLabels, veraBirthdayTranslations, type VeraLanguage } from '../../i18n/veraBirthday';
import BloomingFlower from './BloomingFlower';
import FloatingPetals from './FloatingPetals';
import LanguageSelector from './LanguageSelector';
import StoryText from './StoryText';
import SunReveal from './SunReveal';

const START_TRACK = '/audio/songforStart.mp3';
const SUN_TRACK = '/audio/vera-sun-happy-piano.mp3';
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
  const [isIntroVisible, setIsIntroVisible] = useState(true);
  const [isIntroLeaving, setIsIntroLeaving] = useState(false);
  const [introStep, setIntroStep] = useState<'play' | 'ready'>('play');
  const [isRussianHintVisible, setIsRussianHintVisible] = useState(false);
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
    if (!audio) return false;

    audio.volume = 0.42;
    audio.muted = false;

    try {
      await audio.play();
      setIsMusicPlaying(true);
      setMusicNeedsGesture(false);
      return true;
    } catch {
      setIsMusicPlaying(false);
      setMusicNeedsGesture(true);
      return false;
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

  const startExperience = useCallback(async () => {
    const didPlay = await playMusic();
    if (!didPlay) return;

    setIntroStep('ready');
  }, [playMusic]);

  const revealExperience = useCallback(() => {
    setIsIntroLeaving(true);
    window.setTimeout(() => {
      setIsIntroVisible(false);
    }, 2400);
  }, []);

  useEffect(() => {
    if (!isIntroVisible) return;

    const scrollY = window.scrollY;
    const previousBodyPosition = document.body.style.position;
    const previousBodyTop = document.body.style.top;
    const previousBodyWidth = document.body.style.width;
    const previousBodyOverflow = document.body.style.overflow;
    const previousHtmlOverflow = document.documentElement.style.overflow;

    document.body.style.position = 'fixed';
    document.body.style.top = `-${scrollY}px`;
    document.body.style.width = '100%';
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';

    const preventScroll = (event: Event) => event.preventDefault();
    window.addEventListener('wheel', preventScroll, { passive: false });
    window.addEventListener('touchmove', preventScroll, { passive: false });

    return () => {
      window.removeEventListener('wheel', preventScroll);
      window.removeEventListener('touchmove', preventScroll);
      document.body.style.position = previousBodyPosition;
      document.body.style.top = previousBodyTop;
      document.body.style.width = previousBodyWidth;
      document.body.style.overflow = previousBodyOverflow;
      document.documentElement.style.overflow = previousHtmlOverflow;
      window.scrollTo(0, scrollY);
    };
  }, [isIntroVisible]);

  useEffect(() => {
    if (isIntroVisible) return;

    setIsRussianHintVisible(true);
    const timeout = window.setTimeout(() => {
      setIsRussianHintVisible(false);
    }, 5000);

    return () => window.clearTimeout(timeout);
  }, [isIntroVisible]);

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
          const flowerExit = gsap.utils.clamp(0, 1, (progress - 0.1) / 0.26);

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
            ? gsap.utils.clamp(0, 1, (readableBottom - itemRect.top) / (readableHeight * 0.48))
            : gsap.utils.clamp(0, 1, (progress - (0.3 + index / total * 0.58)) / 0.1);
          const exit = windowRect && !isFinalScene
            ? gsap.utils.clamp(0, 1, (readableTop - itemRect.bottom) / (readableHeight * 0.34))
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
          scrub: 1.8,
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
        .to(root, { '--bloom': 0.18, duration: 0.28 }, 0)
        .to(root, { '--bloom': 0.42, '--garden': 0.18, duration: 0.34 }, 0.24)
        .to(root, { '--bloom': 0.68, '--garden': 0.34, duration: 0.3 }, 0.5)
        .to(root, { '--bloom': 0.88, duration: 0.24 }, 0.72)
        .to(root, { '--bloom': 1, '--sun': 1, '--garden': 1, duration: 0.28 }, 0.92);

      timeline.to(floaters, {
        opacity: 0.8,
        x: (index) => Number(floaters[index].dataset.x ?? 0),
        y: (index) => Number(floaters[index].dataset.y ?? -120),
        rotate: (index) => Number(floaters[index].dataset.r ?? 120),
        stagger: 0.01,
        duration: 1.25,
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
    <main className={`vera-story${isIntroVisible ? ' has-intro' : ''}`} ref={rootRef}>
      <audio
        ref={audioRef}
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
      {isIntroVisible ? (
        <div
          className={`story-intro is-${introStep}${isIntroLeaving ? ' is-leaving' : ''}`}
          aria-label="Iniciar experiencia"
        >
          <div className="intro-stardust" aria-hidden="true">
            {Array.from({ length: 28 }, (_, index) => (
              <span key={index} style={{ '--star-index': index } as CSSProperties} />
            ))}
          </div>
          <button
            className="intro-play"
            type="button"
            onClick={introStep === 'play' ? startExperience : revealExperience}
          >
            <span className="intro-play-glow" aria-hidden="true" />
            <span className="intro-play-text">{introStep === 'play' ? 'PLAY' : 'ДА'}</span>
          </button>
          <p>
            {introStep === 'play'
              ? 'Нажми Play и открой свой подарок'
              : 'Приготовься, устройся поудобнее, настрой громкость... а теперь :D'}
          </p>
        </div>
      ) : null}
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
        highlightRussian={isRussianHintVisible}
        onChange={(nextLanguage) => {
          setLanguage(nextLanguage);
          setSceneIndex(0);
          setIsRussianHintVisible(false);
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
