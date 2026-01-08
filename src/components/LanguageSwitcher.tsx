import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui';
import { Languages } from 'lucide-react';

export const LanguageSwitcher = () => {
    const { i18n } = useTranslation();

    const toggleLanguage = () => {
        const newLang = i18n.language === 'es' ? 'en' : 'es';
        i18n.changeLanguage(newLang);
    };

    return (
        <Button
            variant="ghost"
            size="icon"
            onClick={toggleLanguage}
            className="text-slate-600 hover:text-slate-900"
            title={i18n.language === 'es' ? 'Switch to English' : 'Cambiar a Español'}
        >
            <Languages className="h-5 w-5" />
            <span className="ml-2 text-sm font-medium">
                {i18n.language.toUpperCase()}
            </span>
        </Button>
    );
};
