export const Liferay = window.Liferay || {
	ThemeDisplay: {
		getCompanyGroupId: () => 0,
		getScopeGroupId: () => 0,
		getSiteGroupId: () => 0,
		getUserId: () => process.env.REACT_APP_LIFERAY_USER_ID,
	},
	authToken: "",
};