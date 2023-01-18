import {
  buildObjectAPISearchParams,
  buildSort,
  customDateFieldFormat,
} from '../../common/utility';
import { getFetch } from '../../common/services/liferay/baseFetch';
import { Liferay } from '../../common/services/liferay/Liferay';

const HEART_RATE_API_PATH = 'o/c/bloodpressures/';
const USER_ID_FIELD = 'r_bloodPressure_userId';
const READING_DATE_FIELD = 'readingDate';

const bloodPressureApi = (startDate, endDate, maxEntries) => {
  console.debug(`Param startDate=${startDate}`);
  console.debug(`Param endDate=${endDate}`);
  console.debug(`Param maxEntries=${maxEntries}`);

  startDate = startDate && startDate instanceof Date ? startDate : new Date();
  endDate =
    endDate && endDate instanceof Date
      ? endDate
      : new Date(new Date().setDate(new Date().getDate() + 7));
  maxEntries = maxEntries && typeof maxEntries === 'number' ? maxEntries : 7;
  console.log(maxEntries);

  console.debug(`Using startDate=${startDate}`);
  console.debug(`Using endDate=${endDate}`);
  console.debug(`Using maxEntries=${maxEntries}`);

  const startDateString = customDateFieldFormat(startDate);
  const endDateString = customDateFieldFormat(endDate);

  const userId = Liferay.ThemeDisplay.getUserId();

  const filter = `${USER_ID_FIELD} eq '${userId}' and ${READING_DATE_FIELD} ge ${startDateString} and ${READING_DATE_FIELD} le ${endDateString}`;

  const sort = buildSort(READING_DATE_FIELD, false);
  const searchParams = buildObjectAPISearchParams(filter, 1, maxEntries, sort);

  return getFetch(HEART_RATE_API_PATH, searchParams);
};

export default bloodPressureApi;
