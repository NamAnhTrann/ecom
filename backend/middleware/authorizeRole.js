// middleware/authorizeRole.js
exports.authorizeRoles = function (roles) {
  return function (req, res, next) {
    const userRoles = req.user.roles;
    const allowed = userRoles.some((r) => roles.includes(r));
    if (!allowed) {
      return res.status(403).json({ message: "forbidden: access denied" });
    }
    next();
  };
};
