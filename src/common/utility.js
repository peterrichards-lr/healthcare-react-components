import { FILTER_PARAM, PAGE_PARAM, PAGE_SIZE_PARAM, SORT_ASCENDING, SORT_DESCENDING, SORT_PARAM } from './const';

const pad = (num, size) => {
    num = num.toString();
    while (num.length < size) num = '0' + num;
    return num;
}

// The filter sytax for custom fields within an Object, are simply dates and need to remove the time element
const customDateFieldFormat = (date) => {
    if (date !== undefined && date instanceof Date)
        return `${date.getFullYear()}-${pad(date.getMonth()+1,2)}-${pad(date.getDate(),2)}`
}

// The filter syntax for system date fime fields, such as dateCreated and dateModified, need the time element
const systemDateFieldFormat = (date) => {
    if (date !== undefined && date instanceof Date)
        return `${date.getFullYear()}-${pad(date.getMonth()+1,2)}-${pad(date.getDate(),2)}T${pad(date.getHours(), 2)}:${pad(date.getMinutes(), 2)}:${pad(date.getSeconds(), 2)}Z`
}

const buildSort = (field, ascending = true) => {
    console.log(field);
    console.log(ascending);
    if (ascending !== undefined && typeof ascending === 'boolean') {
        console.log('rest');
        return `${field}:${ascending ? SORT_ASCENDING : SORT_DESCENDING}`;
    }
    return field ? `${field}:${SORT_ASCENDING}` : undefined;
}

const buildObjectAPISearchParams = (filter, page, pageSize, sort) => {
    const urlSearchParams = new URLSearchParams();
    if (filter)
        urlSearchParams.append(FILTER_PARAM, filter);
    if (page)
        urlSearchParams.append(PAGE_PARAM, page);
    if (pageSize)
        urlSearchParams.append(PAGE_SIZE_PARAM, pageSize);
    if (sort)
        urlSearchParams.append(SORT_PARAM, sort);
    return urlSearchParams;
}

export { customDateFieldFormat, systemDateFieldFormat, buildSort, buildObjectAPISearchParams };