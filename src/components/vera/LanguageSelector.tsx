import type { VeraLanguage } from '../../i18n/veraBirthday';

type Props = {
  labels: Record<VeraLanguage, string>;
  language: VeraLanguage;
  highlightRussian?: boolean;
  onChange: (language: VeraLanguage) => void;
};

export default function LanguageSelector({ labels, language, highlightRussian = false, onChange }: Props) {
  return (
    <div className={`language-selector${highlightRussian ? ' is-russian-hinting' : ''}`} aria-label="Language selector">
      {(Object.keys(labels) as VeraLanguage[]).map((item) => (
        <button
          key={item}
          type="button"
          data-language={item}
          aria-pressed={language === item}
          onClick={() => onChange(item)}
        >
          {labels[item]}
        </button>
      ))}
    </div>
  );
}
