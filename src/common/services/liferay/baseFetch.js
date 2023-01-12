import { Liferay } from "./liferay";
import {encode as base64_encode} from 'base-64';

const { REACT_APP_LIFERAY_HOST = window.location.origin, REACT_APP_LIFERAY_BASIC_AUTH } = process.env;

const baseFetch = async (path, searchParams, options = {}) => {
	var url;
	if (searchParams !== undefined && searchParams instanceof URLSearchParams) {
		const queryString = searchParams.toString();
		url = new URL(`${path}?${queryString}`, REACT_APP_LIFERAY_HOST)
	} else {
		url = new URL(path, REACT_APP_LIFERAY_HOST);
	}

	var headers = {
		"Content-Type": "application/json"
	};
	if (Liferay.authToken) { 
		headers["x-csrf-token"] = Liferay.authToken;
	} else if (REACT_APP_LIFERAY_BASIC_AUTH !== undefined) {
		const credentials = base64_encode(REACT_APP_LIFERAY_BASIC_AUTH);
		headers["Authorization"] = `Basic ${credentials}`; 
	}

	return fetch(url, {
		headers,
		...options,
	});
};

const getFetch = async (path, searchParams = undefined, options = {}) => {
    return baseFetch(path, searchParams, { method : 'GET', ...options } );
};

const postFetch = async (path, searchParams = undefined, body, options = {}) => {
    return baseFetch(path, searchParams, { method : 'POST', body, ...options });
};

const putFetch = async (path, searchParams = undefined, body, options = {}) => {
    return baseFetch(path, searchParams, { method : 'PUT', body, ...options });
};

const deleteFetch = async (path, searchParams = undefined, options = {}) => {
    return baseFetch(path, searchParams, { method : 'DELETE', ...options });
};

const patchFetch = async (path, searchParams = undefined, body, options = {}) => {
    return baseFetch(path, searchParams, { method : 'PATCH', body, ...options });
};

export { getFetch, postFetch, putFetch, deleteFetch, patchFetch };