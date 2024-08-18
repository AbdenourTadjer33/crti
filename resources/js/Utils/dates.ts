import { format, parseISO } from 'date-fns';
import { fr } from 'date-fns/locale';

const formatUTCDateToLocal = (utcDate: string) => {
    // Parse the UTC date string to a Date object
    const date = parseISO(utcDate);

    // Format the date to the local time, using the 'fr' locale
    return format(date, 'Pp', { locale: fr }); // 'Pp' is a predefined format (short date + time)
};

const formatToDate = () => {
    
}

export { formatUTCDateToLocal }