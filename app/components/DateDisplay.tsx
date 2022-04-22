import format from 'date-fns/format';
import { useRouter } from 'next/router';
import { es, it } from 'date-fns/locale';

const localeMap: Record<string, Locale> = { es, it, pseudo: es };

export const CurrentDate = (props: {
    date: Date;
}): JSX.Element => {
    const { locale } = useRouter();

    const dateFnsLocale = locale ? localeMap[locale] : undefined;
    return (
        <>
            {format(props.date, 'MM/dd/yyyy', { locale: dateFnsLocale })}
        </>
    );
};
