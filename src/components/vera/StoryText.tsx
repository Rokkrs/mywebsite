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
          {scenes.map((scene, index) => (
            <article
              className={`papyrus-scene${index === activeIndex ? ' is-active' : ''}${index === 5 ? ' is-birthday' : ''}`}
              key={scene.title}
            >
              <span className="story-index">{index + 1}</span>
              <h2>{scene.title}</h2>
              <div className="story-body">
                {scene.body.map((line) => (
                  <p key={line}>{line}</p>
                ))}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
