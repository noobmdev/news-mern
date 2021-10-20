const { ROLES } = require("../constants");

exports.hasRole = (roles) => (req, res, next) => {
  const roleValues = Object.values(ROLES);
  if (
    !roles?.length ||
    [...new Set([...roles, ...roleValues])].length > roleValues.length
  )
    return res.status(400).send("invalid ROLES");

  const flag = roles.some(r => req.user.role % r === 0)

  if (flag) next();
  else return res.status(401).send("Unauthorized");
};
