import { buildObjectAPISearchParams, buildSort, customDateFieldFormat } from '../../common/utility';
import { getFetch } from '../../common/services/liferay/baseFetch';
import { Liferay } from '../../common/services/liferay/Liferay';

const HEART_RATE_API_PATH='o/c/stepses/';
const USER_ID_FIELD = 'r_steps_userId';
const READING_DATE_FIELD = 'readingDate';

const stepsApi = (startDate, endDate = undefined, maxEntries = 7) => {
    startDate = startDate !== undefined && startDate instanceof Date ? startDate : new Date();
    endDate = endDate !== undefined && endDate instanceof Date ? endDate : new Date(new Date().setDate(new Date().getDate() + 7));

    const startDateString = customDateFieldFormat(startDate);
    const endDateString = customDateFieldFormat(endDate);

    const userId = Liferay.ThemeDisplay.getUserId();

    const filter = `${USER_ID_FIELD} eq '${userId}' and ${READING_DATE_FIELD} ge ${startDateString} and ${READING_DATE_FIELD} le ${endDateString}`;

    const sort = buildSort(READING_DATE_FIELD, false);
    console.log(sort);
    const searchParams = buildObjectAPISearchParams(filter, 1, maxEntries, sort);

    return getFetch(HEART_RATE_API_PATH, searchParams);
}

export default stepsApi;