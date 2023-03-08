const { ALLOWED_DOMAINS } = require("./constants");

const checkIfDomainIsAllowed = (origin) => {
  return ALLOWED_DOMAINS.some((allowedDomain) =>
    origin.includes(allowedDomain)
  );
};

const corsOptions = {
  origin: (origin, callback) => {
    if (checkIfDomainIsAllowed(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
};

module.exports = corsOptions;
