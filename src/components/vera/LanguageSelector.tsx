import type { VeraLanguage } from '../../i18n/veraBirthday';

type Props = {
  labels: Record<VeraLanguage, string>;
  language: VeraLanguage;
  onChange: (language: VeraLanguage) => void;
};

export default function LanguageSelector({ labels, language, onChange }: Props) {
  return (
    <div className="language-selector" aria-label="Language selector">
      {(Object.keys(labels) as VeraLanguage[]).map((item) => (
        <button
          key={item}
          type="button"
          aria-pressed={language === item}
          onClick={() => onChange(item)}
        >
          {labels[item]}
        </button>
      ))}
    </div>
  );
}
