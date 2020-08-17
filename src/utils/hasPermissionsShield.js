// todo checking for users permissions
import { and, or, rule, shield } from "graphql-shield";

const hasPermissions = (user, requiredPermissions) => {
  const matchedPermissions = user.permissions.filter((permissionsUserHas) =>
    requiredPermissions.includes(permissionsUserHas)
  );
  if (!matchedPermissions.length) {
    throw new Error(`Insufficient permissions : 
            ${requiredPermissions} you have: ${user.permissions}  `);
  }
};

const isAuthenticated = rule()(({ parent, args, ctx: { user } }) => {
  return user !== null;
});

const canReadAnyUser = rule()(({ parent, args, ctx: { user } }) => {
  return hasPermissions(user, ["ADMIN"]);
});

const canReadOwnUser = rule()(({ parent, args, ctx: { user } }) => {
  return hasPermissions(user, ["ADMIN"]);
});

const isReadingOwnUser = rule()(({ parent, args, ctx }) => {
  return ctx.user && ctx.user.id === args.id;
});

export default shield({
  Query: {
    user: or(and(canReadOwnUser, isReadingOwnUser), canReadAnyUser),
    me: isAuthenticated,
  },
});
module.exports = hasPermissions;
