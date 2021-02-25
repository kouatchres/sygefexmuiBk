const hasPermissions = (user, requiredPermissions) => {
  const matchedPermissions = user.permissions.filter(permissionsUserHas =>
    requiredPermissions.includes(permissionsUserHas),
  )

  if (!matchedPermissions.length) {
    throw new Error(`Insufficient permissions : 
            ${requiredPermissions} you have: ${user.permissions}  `)
  }
}
// hasPermissions(user, ['USER', 'ADMIN', 'CENTER_ADMIN'])

const isCenterAdmin = user => {
  const matchedPermissions = user.permissions.filter(permissionsUserHas =>
    ['USER', 'ADMIN', 'CENTER_ADMIN'].includes(permissionsUserHas),
  )

  if (!matchedPermissions.length) {
    throw new Error('Authorization Insuffissante')
  }
}
const isBoardAdmin = user => {
  const matchedPermissions = user.permissions.filter(permissionsUserHas =>
    ['USER', 'ADMIN'].includes(permissionsUserHas),
  )

  if (!matchedPermissions.length) {
    throw new Error('Authorization Insuffissante')
  }
}
const isExaminer = user => {
  const matchedPermissions = user.permissions.filter(permissionsUserHas =>
    ['USER', 'EXAMINER', 'ADMIN'].includes(permissionsUserHas),
  )

  if (!matchedPermissions.length) {
    throw new Error('Authorization Insuffissante')
  }
}

const isUser = user => {
  const matchedPermissions = user.permissions.filter(permissionsUserHas =>
    ['USER'].includes(permissionsUserHas),
  )
  if (!matchedPermissions.length) {
    throw new Error('Authorization Insuffissante')
  }
}

module.exports = {
  isBoardAdmin,
  isUser,
  isExaminer,
  isCenterAdmin,
  hasPermissions,
}
