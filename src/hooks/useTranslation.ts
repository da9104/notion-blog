import { useLocale } from '@/contexts/LocaleProvider';
import { en } from '@/locales/en';
import { ko } from '@/locales/ko';

export function useTranslation() {
  const { locale, setLocale } = useLocale();
  return { t: locale === 'ko' ? ko : en, locale, setLocale };
}
