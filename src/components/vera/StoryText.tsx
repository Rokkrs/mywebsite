import type { VeraScene } from '../../i18n/veraBirthday';

type Props = {
  scenes: VeraScene[];
  activeIndex: number;
};

export default function StoryText({ scenes, activeIndex }: Props) {
  return (
    <section className="story-text" aria-label="Birthday story">
      <div className="papyrus-window">
        <div className="papyrus-scroll">
          <img
            className="papyrus-intro-flower"
            src="/vera/papyrus-flower.png"
            alt=""
            aria-hidden="true"
            loading="eager"
          />
          {scenes.map((scene, index) => (
            <article
              className={`papyrus-scene${index === 0 ? ' is-intro' : ''}${index === activeIndex ? ' is-active' : ''}${scene.title ? ' is-birthday' : ''}`}
              key={`${index}-${scene.title}`}
            >
              {scene.title ? (
                <h2 className="poem-reveal">
                  {scene.title.split('\n').map((line) => (
                    <span key={line}>{line}</span>
                  ))}
                </h2>
              ) : null}
              {scene.title ? (
                <img
                  className="papyrus-flower papyrus-flower-end poem-reveal"
                  src="/vera/papyrus-flower.png"
                  alt=""
                  aria-hidden="true"
                  loading="eager"
                />
              ) : null}
              <div className="story-body">
                {scene.body.map((line, lineIndex) => (
                  <p className={`${line ? 'poem-line poem-reveal' : 'poem-space'}`} key={`${line}-${lineIndex}`}>
                    {line || '\u00A0'}
                  </p>
                ))}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
