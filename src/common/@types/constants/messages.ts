const common = {
  loginAgain: 'Please login again!',
};

export const Msgs = {
  validation: {},
  exception: {
    tooManyEntitiesRequested: `Too many entities requested.`,
    malformed: `Token malformed! ${common.loginAgain}`,
    expired: `Token expired!. ${common.loginAgain}`,
    notFound: `Token not found!. ${common.loginAgain}`,
    forbidden: `Access Denied. You do not have permission to access this resource.`,
    wrongCredentials: `Invalid email or password. Please check your credentials and try again.`,
    inactiveUser: `Your account has not been activated yet.`,
    sessionExpired: `The session has expired. ${common.loginAgain}`,
    unauthorized: `Unauthorized.`,
  },
};
