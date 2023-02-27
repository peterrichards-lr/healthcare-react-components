import { Liferay } from './Liferay';
import { encode as base64_encode } from 'base-64';

const LIFERAY_HOST = process.env.REACT_APP_LIFERAY_HOST || window.location.origin;
const LIFERAY_BASIC_AUTH = process.env.REACT_APP_LIFERAY_BASIC_AUTH;

const HEADER_AUTHORIZATION = 'Authorization';
const HEADER_AUTHORIZATION_BASIC = 'Basic';
const HEADER_AUTH_TOKEN = 'x-csrf-token';
const HEADER_CONTENT_TYPE = 'Content-Type';
const HEADER_CONTENT_TYPE_JSON = 'application/json';

const baseFetch = async (path, searchParams, contentType, options = {}) => {
  var url;
  if (searchParams !== undefined && searchParams instanceof URLSearchParams) {
    const queryString = searchParams.toString();
    url = new URL(`${path}?${queryString}`, LIFERAY_HOST);
  } else {
    url = new URL(path, LIFERAY_HOST);
  }

  var headers = {
    HEADER_CONTENT_TYPE: contentType,
  };
  if (Liferay.authToken !== undefined) {
    headers[HEADER_AUTH_TOKEN] = Liferay.authToken;
  } else if (LIFERAY_BASIC_AUTH !== undefined) {
    const credentials = base64_encode(LIFERAY_BASIC_AUTH);
    headers[
      HEADER_AUTHORIZATION
    ] = `${HEADER_AUTHORIZATION_BASIC} ${credentials}`;
  }

  return fetch(url, {
    headers,
    ...options,
  }).then((response) => {
    const { status } = response;
    const responseContentType = response.headers.get(HEADER_CONTENT_TYPE);

    if (status === 204) {
      return '';
    } else if (
      response.ok &&
      responseContentType === HEADER_CONTENT_TYPE_JSON
    ) {
      return response.json();
    } else {
      return response.text();
    }
  });
};

const getFetch = async (
  path,
  searchParams = undefined,
  contentType = HEADER_CONTENT_TYPE_JSON,
  options = {}
) => {
  return baseFetch(path, searchParams, contentType, {
    method: 'GET',
    ...options,
  });
};

const postFetch = async (
  path,
  searchParams = undefined,
  contentType = HEADER_CONTENT_TYPE_JSON,
  body,
  options = {}
) => {
  return baseFetch(path, searchParams, contentType, {
    method: 'POST',
    body,
    ...options,
  });
};

const putFetch = async (
  path,
  searchParams = undefined,
  contentType = HEADER_CONTENT_TYPE_JSON,
  body,
  options = {}
) => {
  return baseFetch(path, searchParams, contentType, {
    method: 'PUT',
    body,
    ...options,
  });
};

const deleteFetch = async (
  path,
  searchParams = undefined,
  contentType = HEADER_CONTENT_TYPE_JSON,
  options = {}
) => {
  return baseFetch(path, searchParams, contentType, {
    method: 'DELETE',
    ...options,
  });
};

const patchFetch = async (
  path,
  searchParams = undefined,
  contentType = HEADER_CONTENT_TYPE_JSON,
  body,
  options = {}
) => {
  return baseFetch(path, searchParams, contentType, {
    method: 'PATCH',
    body,
    ...options,
  });
};

export { getFetch, postFetch, putFetch, deleteFetch, patchFetch };
