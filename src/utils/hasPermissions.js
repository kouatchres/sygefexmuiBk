const hasPermissions = (user, requiredPermissions) => {
  const matchedPermissions = user.permissions.filter((permissionsUserHas) =>
    requiredPermissions.includes(permissionsUserHas)
  );
  if (!matchedPermissions.length) {
    throw new Error(`Insufficient permissions : 
            ${requiredPermissions} you have: ${user.permissions}  `);
  }
};

const patientRetiredExams = (patient, retiredExams) => {
  const patientHasRetiredExams = patient.exams.filter((patientExams) =>
    retiredExams.includes(patientExams)
  );
  if (!patientHasRetiredExams.length) {
    ` ${retiredExams} you have: ${patient.exams}  `;
  }
};

module.exports = hasPermissions;
