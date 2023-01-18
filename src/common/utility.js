import { useState } from 'react';
import {
  FILTER_PARAM,
  PAGE_PARAM,
  PAGE_SIZE_PARAM,
  SORT_ASCENDING,
  SORT_DESCENDING,
  SORT_PARAM,
} from './const';

import moment from 'moment';

const pad = (num, size) => {
  num = num.toString();
  while (num.length < size) num = '0' + num;
  return num;
};

// The filter sytax for custom fields within an Object, are simply dates and need to remove the time element
const customDateFieldFormat = (date) => {
  if (date !== undefined && date instanceof Date)
    return `${date.getFullYear()}-${pad(date.getMonth() + 1, 2)}-${pad(
      date.getDate(),
      2
    )}`;
};

// The filter syntax for system date fime fields, such as dateCreated and dateModified, need the time element
const systemDateFieldFormat = (date) => {
  if (date !== undefined && date instanceof Date)
    return `${date.getFullYear()}-${pad(date.getMonth() + 1, 2)}-${pad(
      date.getDate(),
      2
    )}T${pad(date.getHours(), 2)}:${pad(date.getMinutes(), 2)}:${pad(
      date.getSeconds(),
      2
    )}Z`;
};

const buildSort = (field, ascending = true) => {
  if (ascending !== undefined && typeof ascending === 'boolean') {
    return `${field}:${ascending ? SORT_ASCENDING : SORT_DESCENDING}`;
  }
  return field ? `${field}:${SORT_ASCENDING}` : undefined;
};

const buildObjectAPISearchParams = (filter, page, pageSize, sort) => {
  const urlSearchParams = new URLSearchParams();
  if (filter) urlSearchParams.append(FILTER_PARAM, filter);
  if (page) urlSearchParams.append(PAGE_PARAM, page);
  if (pageSize) urlSearchParams.append(PAGE_SIZE_PARAM, pageSize);
  if (sort) urlSearchParams.append(SORT_PARAM, sort);
  return urlSearchParams;
};

const getCssVariable = (variableName) => {
  if (variableName === undefined || typeof variableName !== 'string') {
    return undefined;
  }
  variableName = variableName.startsWith('--')
    ? variableName
    : `--${variableName}`;
  return window.getComputedStyle(document.body).getPropertyValue(variableName);
};

const isNumeric = (str) => {
  if (typeof str != 'string') return false; // we only process strings!
  return (
    !isNaN(str) && // use type coercion to parse the _entirety_ of the string (`parseFloat` alone does not do this)...
    !isNaN(parseFloat(str))
  ); // ...and ensure strings of whitespace fail
};

const propsStrToObj = (strProps) => {
  var objProps = {};
  for (const prop in strProps) {
    const value = strProps[prop];
    if (isNumeric(value)) {
      const num = Number(value);
      objProps[prop] = Number.isInteger(num) ? parseInt(num) : parseFloat(num);
    } else if (moment(value, 'YYYY-MM-DD').isValid()) {
      objProps[prop] = new Date(value);
    } else {
      objProps[prop] = value;
    }
  }
  return objProps;
};

export {
  customDateFieldFormat,
  systemDateFieldFormat,
  buildSort,
  buildObjectAPISearchParams,
  getCssVariable,
  isNumeric,
  propsStrToObj
};
