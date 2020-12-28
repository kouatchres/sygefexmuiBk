const { forwardTo } = require("prisma-binding");
const hashPassword = require("../utils/hashPassword");
const hasPermissions = require("../utils/hasPermissions");
const getUserID = require("../utils/getUserID");

const Query = {
  registrationsConnection: forwardTo("prismaDB"),

  async candidates(
    parent,
    args,
    { prismaDB, request: { user, userId } },
    info
  ) {
    try {
      if (!userId) {
        throw new Error("Veuillez vous connecter");
      }
      const allCandidates = await prismaDB.query.candidates({
        orderBy: { AND: ["cand1stName_ASC", "cand2ndName_ASC"] },
      });
      return allCandidates;
    } catch (error) {
      throw new Error(`${error.message}`);
    }
  },
  async candidate(parent, args, { prismaDB, request: { user, userId } }, info) {
    try {
      if (!userId) {
        throw new Error("Veuillez vous connecter");
      }
      console.log(args);
      if (!userId) {
        throw new Error("Veuillez vous connecter");
      }

      hasPermissions(user, ["USER", "ADMIN", "CENTER_ADMIN"]);
      const where = {
        id: args.id,
      };
      const oneCandidate = await prismaDB.query.candidate({ where }, info);

      //todo make sure it is the owner carrying out the operation

      // console.log(oneCandidate);
      // if (userId !== oneCandidate.user.id) {
      //   throw new Error("Cette operation vous est interdite");
      // }
      return oneCandidate;
    } catch (error) {
      throw new Error(` ${error.message}`);
    }
  },

  async region(parent, args, { prismaDB, request: { user, userId } }, info) {
    try {
      if (!userId) {
        throw new Error("Veuillez vous connecter");
      }
      const where = {
        id: args.id,
      };
      const oneRegion = await prismaDB.query.region({ where }, info);
      return oneRegion;
    } catch (error) {
      throw new Error(`${error.message}`);
    }
  },

  async regions(parent, args, { prismaDB, request: { userId, user } }, info) {
    try {
      if (!userId) {
        throw new Error("Veuillez vous connecter");
      }
      // todo check if they are logged in
      if (!userId) {
        throw new Error("Veuillez vous connecter");
      }
      // todo check if he haas the permissions to query all the users.
      hasPermissions(user, ["USER", "ADMIN", "PERMISSION_UPDATE"]);

      //todo if they do, then query all the regions.
      const allRegions = await prismaDB.query.regions(
        { orderBy: "regName_ASC" },
        info
      );
      return allRegions;
    } catch (error) {
      throw new Error(`regions Errors, ${error}`);
    }
  },

  async users(parent, args, { prismaDB, request: { userId, user } }, info) {
    try {
      console.log("getting all users!!!!");
      if (!userId) {
        throw new Error("Veuillez vous connecter");
      }
      // todo check if they are logged in
      if (!userId) {
        throw new Error("Veuillez vous connecter");
      }
      // todo check if he haas the permissions to query all the users.
      hasPermissions(user, ["USER", "ADMIN", "PERMISSION_UPDATE"]);
      //todo if they do then query all the users.

      const allUsers = await prismaDB.query.users(
        {
          orderBy: "name_ASC",
        },
        info
      );
      return allUsers;
    } catch (error) {
      throw new Error(` ${error.message}`);
    }
  },

  async phases(parent, args, { prismaDB, request: { user, userId } }, info) {
    try {
      if (!userId) {
        throw new Error("Veuillez vous connecter");
      }
      const allPhases = await prismaDB.query.phases({
        orderBy: "phaseName_ASC",
      });
      return allPhases;
    } catch (error) {
      throw new Error(` ${error.message}`);
    }
  },

  async phase(parent, args, { prismaDB, request: { user, userId } }, info) {
    try {
      if (!userId) {
        throw new Error("Veuillez vous connecter");
      }
      console.log(args);
      const where = {
        id: args.id,
      };
      const onePhase = await prismaDB.query.phase({ where }, info);
      return onePhase;
    } catch (error) {
      throw new Error(`${error.message}`);
    }
  },

  async divisions(parent, args, { prismaDB, request: { user, userId } }, info) {
    try {
      if (!userId) {
        throw new Error("Veuillez vous connecter");
      }
      const allDivisions = await prismaDB.query.divisions({
        orderBy: "divName_ASC",
      });
      return allDivisions;
    } catch (error) {
      throw new Error(` ${error.message}`);
    }
  },
  async division(parent, args, { prismaDB, request: { user, userId } }, info) {
    try {
      if (!userId) {
        throw new Error("Veuillez vous connecter");
      }
      const where = {
        id: args.id,
      };
      const oneDivision = await prismaDB.query.division(
        {
          where,
        },
        info
      );
      return oneDivision;
    } catch (error) {
      throw new Error(` ${error.message}`);
    }
  },

  async subDivisions(
    parent,
    args,
    { prismaDB, request: { user, userId } },
    info
  ) {
    try {
      if (!userId) {
        throw new Error("Veuillez vous connecter");
      }
      const allSubDivisions = await prismaDB.query.subDivisions({
        orderBy: "subDivName_ASC",
      });
      return allSubDivisions;
    } catch (error) {
      throw new Error(` ${error.message}`);
    }
  },
  async subDivision(
    parent,
    args,
    { prismaDB, request: { user, userId } },
    info
  ) {
    try {
      if (!userId) {
        throw new Error("Veuillez vous connecter");
      }
      const where = {
        id: args.id,
      };
      const oneSubDivision = await prismaDB.query.subDivision(
        {
          where,
        },
        info
      );
      return oneSubDivision;
    } catch (error) {
      throw new Error(` ${error.message}`);
    }
  },

  async countRegisteredCandidates(
    parent,
    args,
    { prismaDB, request: { user, userId } },
    info
  ) {
    try {
      if (!userId) {
        throw new Error("Veuillez vous connecter");
      }
      console.log("in countRegistered Candidates");
      console.log(args);

      const where = {
        id: args.id,
      };
      const getCount = await prismaDB.query.centerExamSessions({ where }, info);

      return getCount;
    } catch (error) {
      throw new Error(`${error.message}`);
    }
  },

  async towns(parent, args, { prismaDB, request: { user, userId } }, info) {
    try {
      if (!userId) {
        throw new Error("Veuillez vous connecter");
      }
      const allTowns = await prismaDB.query.towns({ orderBy: "townName_ASC" });
      return allTowns;
    } catch (error) {
      throw new Error(` ${error.message}`);
    }
  },
  async town(parent, args, { prismaDB, request: { user, userId } }, info) {
    try {
      if (!userId) {
        throw new Error("Veuillez vous connecter");
      }
      const where = {
        id: args.id,
      };
      const oneTown = await prismaDB.query.town({ where }, info);
      return oneTown;
    } catch (error) {
      throw new Error(`${error.message}`);
    }
  },

  async centers(parent, args, { prismaDB, request: { user, userId } }, info) {
    try {
      if (!userId) {
        throw new Error("Veuillez vous connecter");
      }
      const allCenters = await prismaDB.query.centers({
        orderBy: "centerName_ASC",
      });
      return allCenters;
    } catch (error) {
      throw new Error(` ${error.message}`);
    }
  },
  async center(parent, args, { prismaDB, request: { user, userId } }, info) {
    try {
      if (!userId) {
        throw new Error("Veuillez vous connecter");
      }
      const where = { id: args.id };
      const oneCenter = await prismaDB.query.center({ where }, info);
      return oneCenter;
    } catch (error) {
      throw new Error(` ${error.message}`);
    }
  },
  async centerByNumber(
    parent,
    args,
    { prismaDB, request: { user, userId } },
    info
  ) {
    try {
      if (!userId) {
        throw new Error("Veuillez vous connecter");
      }
      console.log(args);
      const { centerNumber } = { ...args };
      const where = { centerNumber };
      const oneCenter = await prismaDB.query.center({ where }, info);

      if (!oneCenter) {
        throw new Error("Numéro de centre inexistent");
      }
      return oneCenter;
    } catch (error) {
      throw new Error(` ${error.message}`);
    }
  },

  async getCenterByCode(
    parent,
    args,
    { prismaDB, request: { user, userId } },
    info
  ) {
    try {
      if (!userId) {
        throw new Error("Veuillez vous connecter");
      }
      console.log(args);
      const { centerSecretCode } = { ...args };
      const where = { centerSecretCode };
      const oneCenter = await prismaDB.query.center({ where }, info);

      if (!oneCenter) {
        throw new Error("Code centre inexistent");
      }
      return oneCenter;
    } catch (error) {
      throw new Error(` ${error.message}`);
    }
  },
  async centerBySecretCode(
    parent,
    args,
    { prismaDB, request: { user, userId } },
    info
  ) {
    try {
      if (!userId) {
        throw new Error("Veuillez vous connecter");
      }
      console.log(args);
      const { CESCode } = { ...args };
      const where = { CESCode };
      const oneCenter = await prismaDB.query.center({ where }, info);

      if (!oneCenter) {
        throw new Error("Code centre inexistent");
      }
      return oneCenter;
    } catch (error) {
      throw new Error(`${error.message}`);
    }
  },

  async examinerByCode(
    parent,
    args,
    { prismaDB, request: { user, userId } },
    info
  ) {
    try {
      if (!userId) {
        throw new Error("Veuillez vous connecter");
      }
      console.log(prismaDB);
      const { examinerCode } = { ...args };
      const where = { examinerCode };
      const oneProf = await prismaDB.query.examiner({ where }, info);

      if (!oneProf) {
        throw new Error("Code Prof inexistent");
      }
      return oneProf;
    } catch (error) {
      throw new Error(` ${error.message}`);
    }
  },

  async exams(parent, args, { prismaDB, request: { user, userId } }, info) {
    try {
      if (!userId) {
        throw new Error("Veuillez vous connecter");
      }
      const allExams = await prismaDB.query.exams({ orderBy: "examName_ASC" });
      return allExams;
    } catch (error) {
      throw new Error(`${error.message}`);
    }
  },
  async examiner(parent, args, { prismaDB, request: { user, userId } }, info) {
    try {
      if (!userId) {
        throw new Error("Veuillez vous connecter");
      }
      const where = {
        id: args.id,
      };
      const examinerDetails = await prismaDB.query.examiner({ where }, info);
      return examinerDetails;
    } catch (error) {
      throw new Error(` ${error.message}`);
    }
  },
  async exam(parent, args, { prismaDB, request: { user, userId } }, info) {
    try {
      if (!userId) {
        throw new Error("Veuillez vous connecter");
      }
      const where = {
        id: args.id,
      };
      const oneExam = await prismaDB.query.exam({ where }, info);
      return oneExam;
    } catch (error) {
      throw new Error(` ${error.message}`);
    }
  },

  async scores(parent, args, { prismaDB, request: { user, userId } }, info) {
    try {
      if (!userId) {
        throw new Error("Veuillez vous connecter");
      }
      console.log("this is in the scores query");
      console.log(args);
      const where = {
        candExamSecretCode: args.candExamSecretCode,
      };
      const allScores = await prismaDB.query.scores({ where }, info);
      return allScores;
    } catch (error) {
      throw new Error(` ${error.message}`);
    }
  },
  async score(parent, args, { prismaDB, request: { user, userId } }, info) {
    try {
      if (!userId) {
        throw new Error("Veuillez vous connecter");
      }
      const where = {
        id: args.id,
      };
      const oneScore = await prismaDB.query.score({ where }, info);
      return oneScore;
    } catch (error) {
      throw new Error(` ${error.message}`);
    }
  },

  async specialties(
    parent,
    args,
    { prismaDB, request: { user, userId } },
    info
  ) {
    try {
      if (!userId) {
        throw new Error("Veuillez vous connecter");
      }
      const allSpecialty = await prismaDB.query.specialties({
        orderBy: "specialtyName_ASC",
      });
      return allSpecialty;
    } catch (error) {
      throw new Error(` ${error.message}`);
    }
  },

  async specialty(parent, args, { prismaDB, request: { user, userId } }, info) {
    try {
      if (!userId) {
        throw new Error("Veuillez vous connecter");
      }
      const where = {
        id: args.id,
        //  orderBy: "subjectName_ASC",
      };
      const oneSpecialty = await prismaDB.query.specialty({ where }, info);
      return oneSpecialty;
    } catch (error) {
      throw new Error(` ${error.message}`);
    }
  },

  async getCandidateByCode(
    parent,
    args,
    { prismaDB, request: { user, userId } },
    info
  ) {
    try {
      if (!userId) {
        throw new Error("Veuillez vous connecter");
      }
      console.log(args);
      const where = {
        candCode: args.candCode,
      };
      const oneCanndidate = await prismaDB.query.candidates({ where }, info);
      return oneCanndidate;
    } catch (error) {
      throw new Error(` ${error.message}`);
    }
  },

  async subjects(parent, args, { prismaDB, request: { user, userId } }, info) {
    try {
      if (!userId) {
        throw new Error("Veuillez vous connecter");
      }
      const allSubject = await prismaDB.query.subjects({
        orderBy: "subjectName_ASC",
      });
      return allSubject;
    } catch (error) {
      throw new Error(` ${error.message}`);
    }
  },

  async group1Subjects(
    parent,
    args,
    { prismaDB, request: { user, userId } },
    info
  ) {
    try {
      if (!userId) {
        throw new Error("Veuillez vous connecter");
      }
      console.log(args);
      const allSubject = await prismaDB.query.subjects({
        where: { subjectGroup: "EPF1", educType: args.educType },
        orderBy: "subjectName_ASC",
      });
      return allSubject;
    } catch (error) {
      throw new Error(`${error.message}`);
    }
  },

  async group2Subjects(
    parent,
    args,
    { prismaDB, request: { user, userId } },
    info
  ) {
    try {
      if (!userId) {
        throw new Error("Veuillez vous connecter");
      }
      const allSubject = await prismaDB.query.subjects({
        where: { subjectGroup: "EPF2", educType: args.educType },
        orderBy: "subjectName_ASC",
      });
      return allSubject;
    } catch (error) {
      throw new Error(`Subjects Query ${error.message}`);
    }
  },

  async subject(parent, args, { prismaDB, request: { user, userId } }, info) {
    try {
      if (!userId) {
        throw new Error("Veuillez vous connecter");
      }
      const where = {
        id: args.id,
      };
      const oneSubject = await prismaDB.query.subject({ where }, info);
      return oneSubject;
    } catch (error) {
      throw new Error(`${error.message}`);
    }
  },

  async subjectSpecialties(
    parent,
    args,
    { prismaDB, request: { user, userId } },
    info
  ) {
    try {
      if (!userId) {
        throw new Error("Veuillez vous connecter");
      }
      const allSubjectSpecialty = await prismaDB.query.subjectSpecialties({
        orderBy: "subjectSpecialtyName_ASC",
      });
      return allSubjectSpecialty;
    } catch (error) {
      throw new Error(` ${error.message}`);
    }
  },
  async subjectSpecialty(
    parent,
    args,
    { prismaDB, request: { user, userId } },
    info
  ) {
    try {
      if (!userId) {
        throw new Error("Veuillez vous connecter");
      }
      const where = {
        id: args.id,
      };
      const oneSubjectSpecialty = await prismaDB.query.subjectSpecialty(
        { where },
        info
      );
      return oneSubjectSpecialty;
    } catch (error) {
      throw new Error(` ${error.message}`);
    }
  },

  async reports(parent, args, { prismaDB, request: { user, userId } }, info) {
    try {
      if (!userId) {
        throw new Error("Veuillez vous connecter");
      }
      const allReport = await prismaDB.query.reports({
        orderBy: "createdAt_DESC",
      });
      return allReport;
    } catch (error) {
      throw new Error(` ${error.message}`);
    }
  },
  async report(parent, args, { prismaDB, request: { user, userId } }, info) {
    try {
      if (!userId) {
        throw new Error("Veuillez vous connecter");
      }
      const where = {
        id: args.id,
      };
      const oneReport = await prismaDB.query.report({ where }, info);
      return oneReport;
    } catch (error) {
      throw new Error(`${error.message}`);
    }
  },

  async centerExamSessionForResults(
    parent,
    args,
    { prismaDB, request: { user, userId } },
    info
  ) {
    try {
      if (!userId) {
        throw new Error("Veuillez vous connecter");
      }
      console.log(args);
      const { centerExamSession } = {
        ...args,
      };

      const where = {
        centerExamSession: {
          id: centerExamSession.id,
        },
      };
      const allCenterExamSessionSpecialties = await prismaDB.query.centerExamSessionForResults(
        { where },
        info
      );
      return allCenterExamSessionSpecialties;
    } catch (error) {
      throw new Error(` ${error.message}`);
    }
  },

  async centerExamSessions(
    parent,
    args,
    { prismaDB, request: { user, userId } },
    info
  ) {
    try {
      if (!userId) {
        throw new Error("Veuillez vous connecter");
      }
      console.log(args);
      const { center, examSession } = {
        ...args,
      };

      const where = {
        examSession: {
          id: examSession.id,
        },
        center: {
          id: center.id,
        },
      };
      return ([allCenterExamSession] = await prismaDB.query.centerExamSessions(
        { where },
        info
      ));
    } catch (error) {
      throw new Error(`${error.message}`);
    }
  },

  async getRegistration(
    parent,
    args,
    { prismaDB, request: { user, userId } },
    info
  ) {
    try {
      if (!userId) {
        throw new Error("Veuillez vous connecter");
      }
      console.log(args);
      const { candExamSecretCode } = { ...args };

      const isRegistered = await prismaDB.query.registration(
        { where: { candExamSecretCode } },
        info
      );
      if (!isRegistered) {
        throw new Error("Numéro d'Anomymat inexistant");
      }

      return isRegistered;
    } catch (error) {
      throw new Error(`${error.message}`);
    }
  },

  async centerExamSessionsByCode(
    parent,
    args,
    { prismaDB, request: { user, userId } },
    info
  ) {
    try {
      if (!userId) {
        throw new Error("Veuillez vous connecter");
      }
      console.log(args);
      const { center, examSession } = {
        ...args,
      };

      const where = {
        examSession: { id: examSession.id },
        center: { id: center.id },
      };
      return ([allCenterExamSession] = await prismaDB.query.centerExamSessions(
        { where },
        info
      ));
    } catch (error) {
      throw new Error(` ${error.message}`);
    }
  },

  async centerExamSessionBySecretCode(
    parent,
    args,
    { prismaDB, request: { user, userId } },
    info
  ) {
    try {
      if (!userId) {
        throw new Error("Veuillez vous connecter");
      }
      console.log(args);
      const { CESCode } = { ...args };

      const where = { CESCode };
      return ([allCenterExamSession] = await prismaDB.query.centerExamSessions(
        { where },
        info
      ));
    } catch (error) {
      throw new Error(` ${error.message}`);
    }
  },

  async centerExamSession(
    parent,
    args,
    { prismaDB, request: { user, userId } },
    info
  ) {
    try {
      if (!userId) {
        throw new Error("Veuillez vous connecter");
      }
      const where = {
        id: args.id,
      };
      const oneCenterExamSession = await prismaDB.query.centerExamSession(
        { where },
        info
      );
      return oneCenterExamSession;
    } catch (error) {
      throw new Error(`Ces Query ${error.message}`);
    }
  },

  async centerExamSessionSpecialty(
    parent,
    args,
    { prismaDB, request: { user, userId } },
    info
  ) {
    try {
      if (!userId) {
        throw new Error("Veuillez vous connecter");
      }
      console.log(args);
      const where = {
        id: args.id,
      };
      const oneCenterExamSession = await prismaDB.query.centerExamSessionSpecialty(
        { where },
        info
      );
      return oneCenterExamSession;
    } catch (error) {
      throw new Error(` ${error.message}`);
    }
  },

  async centerExamSessionSpecialties(
    parent,
    args,
    { prismaDB, request: { user, userId } },
    info
  ) {
    try {
      if (!userId) {
        throw new Error("Veuillez vous connecter");
      }
      console.log(args);
      const where = {
        centerExamSession: args.centerExamSession.id,
        specialty: args.specialty.id,
      };
      const allCenterExamSessionSpecialties = await prismaDB.query.centerExamSessionSpecialties(
        { where },
        info
      );
      return allCenterExamSessionSpecialties;
    } catch (error) {
      throw new Error(` ${error.message}`);
    }
  },

  async sessions(parent, args, { prismaDB, request: { user, userId } }, info) {
    try {
      if (!userId) {
        throw new Error("Veuillez vous connecter");
      }
      const allSession = await prismaDB.query.sessions({
        orderBy: "createdAt_DESC",
      });
      return allSession;
    } catch (error) {
      throw new Error(`${error.message}`);
    }
  },
  async session(parent, args, { prismaDB, request: { user, userId } }, info) {
    try {
      if (!userId) {
        throw new Error("Veuillez vous connecter");
      }
      const where = {
        id: args.id,
      };
      const oneSession = await prismaDB.query.session({ where }, info);
      return oneSession;
    } catch (error) {
      throw new Error(` ${error.message}`);
    }
  },
  async ranks(parent, args, { prismaDB, request: { user, userId } }, info) {
    try {
      if (!userId) {
        throw new Error("Veuillez vous connecter");
      }
      const allRank = await prismaDB.query.ranks({ orderBy: "rankName_ASC" });
      return allRank;
    } catch (error) {
      throw new Error(` ${error.message}`);
    }
  },
  async rank(parent, args, { prismaDB, request: { user, userId } }, info) {
    try {
      if (!userId) {
        throw new Error("Veuillez vous connecter");
      }
      const where = {
        id: args.id,
      };
      const oneRank = await prismaDB.query.rank({ where }, info);
      return oneRank;
    } catch (error) {
      throw new Error(` ${error.message}`);
    }
  },
  async examSessions(
    parent,
    args,
    { prismaDB, request: { user, userId } },
    info
  ) {
    try {
      if (!userId) {
        throw new Error("Veuillez vous connecter");
      }
      console.log(args);
      const { session, exam } = { ...args };
      const where = {
        session: { id: session.id },
        exam: { id: exam.id },
      };
      const allExamSessions = await prismaDB.query.examSessions(
        { where },
        info
      );
      return allExamSessions;
    } catch (error) {
      throw new Error(` ${error.message}`);
    }
  },

  async examSession(
    parent,
    args,
    { prismaDB, request: { user, userId } },
    info
  ) {
    try {
      if (!userId) {
        throw new Error("Veuillez vous connecter");
      }
      const where = {
        id: args.id,
      };
      const oneExamSession = await prismaDB.query.examSession({ where }, info);
      return oneExamSession;
    } catch (error) {
      throw new Error(` ${error.message}`);
    }
  },

  async educationTypes(
    parent,
    args,
    { prismaDB, request: { user, userId } },
    info
  ) {
    try {
      if (!userId) {
        throw new Error("Veuillez vous connecter");
      }
      console.log({ args });
      const allEducationType = await prismaDB.query.educationTypes({
        orderBy: "educationTypeName_ASC",
      });
      return allEducationType;
    } catch (error) {
      throw new Error(` ${error.message}`);
    }
  },
  async educationType(
    parent,
    args,
    { prismaDB, request: { user, userId } },
    info
  ) {
    try {
      if (!userId) {
        throw new Error("Veuillez vous connecter");
      }
      const where = {
        id: args.id,
      };
      const oneEducationType = await prismaDB.query.educationType(
        { where },
        info
      );
      return oneEducationType;
    } catch (error) {
      throw new Error(` ${error.message}`);
    }
  },

  async registrations(
    parent,
    args,
    { prismaDB, request: { user, userId } },
    info
  ) {
    try {
      if (!userId) {
        throw new Error("Veuillez vous connecter");
      }
      console.log(args);
      const where = {
        id: args.id,
      };
      const allRegistration = await prismaDB.query.registrations();
      return allRegistration;
    } catch (error) {
      throw new Error(` ${error.message}`);
    }
  },

  async registration(
    parent,
    args,
    { prismaDB, request: { user, userId } },
    info
  ) {
    try {
      if (!userId) {
        throw new Error("Veuillez vous connecter");
      }
      const where = {
        id: args.id,
      };
      const oneRegistration = await prismaDB.query.registration(
        { where },
        info
      );
      return oneRegistration;
    } catch (error) {
      throw new Error(`${error.message}`);
    }
  },

  // obtain all results for a given center
  async candidateRegistrationID(
    parent,
    args,
    { prismaDB, request: { user, userId } },
    info
  ) {
    try {
      if (!userId) {
        throw new Error("Veuillez vous connecter");
      }
      console.log("cand registration  infos");
      console.log(args);
      const { candidate, centerExamSession } = args;
      const where = {
        centerExamSession: {
          id: centerExamSession.id,
        },
        candidate: {
          candCode: candidate.candCode,
        },
      };
      const [candidateRegisIDs] = await prismaDB.query.registrations(
        { where },
        `{id}`
      );

      if (!candidateRegisIDs) {
        throw new Error(
          "Vous avez choisi, soit le mauvais examen, soit la mauvaise session, soit votre code candidat est erroné"
        );
      }

      return candidateRegisIDs;
    } catch (error) {
      throw new Error(` ${error.message}`);
    }
  },
  // obtain all rsults for a given center
  async getPhaseRankID(
    parent,
    args,
    { prismaDB, request: { user, userId } },
    info
  ) {
    try {
      if (!userId) {
        throw new Error("Veuillez vous connecter");
      }
      console.log("cand registration  infos");
      console.log(args);
      const { phase, rank } = args;
      const where = {
        phase: {
          id: phase.id,
        },
        rank: {
          id: rank.id,
        },
      };
      const [phaseRankID] = await prismaDB.query.phaseRanks({ where }, `{id}`);

      if (!phaseRankID) {
        throw new Error(
          "Vous avez choisi, soit le mauvais examen, soit la mauvaise session, soit votre code Prof est erroné"
        );
      }

      return phaseRankID;
    } catch (error) {
      throw new Error(` ${error.message}`);
    }
  },
  // obtain all results for a given center
  async candidateRegistrationIDs(
    parent,
    args,
    { prismaDB, request: { user, userId } },
    info
  ) {
    try {
      if (!userId) {
        throw new Error("Veuillez vous connecter");
      }
      console.log("cand registration  infos");
      console.log(args);
      const { candidate } = {
        args,
      };
      const where = {
        candidate: {
          id: args,
        },
      };
      const candidateRegisIDs = await prismaDB.query.candidateRegistrationIDs(
        { where },
        info
      );

      if (!candidateRegisIDs) {
        throw new Error(
          "Vous n'etes pas inscrit a un examen sur la plateforme"
        );
      }

      return candidateRegisIDs;
    } catch (error) {
      throw new Error(` ${error.message}`);
    }
  },

  async candidateCode(
    parent,
    args,
    { prismaDB, request: { user, userId } },
    info
  ) {
    try {
      if (!userId) {
        throw new Error("Veuillez vous connecter");
      }
      console.log("cand ID  infos");
      console.log(args);
      const where = {
        candCode: args.candCode,
      };
      const candidateRegisIDs = await prismaDB.query.candidate(
        { where },
        `{id}`
      );

      return candidateRegisIDs;
    } catch (error) {
      throw new Error(`${error.message}`);
    }
  },
  async candidateRegistrationNumber(
    parent,
    args,
    { prismaDB, request: { user, userId } },
    info
  ) {
    try {
      if (!userId) {
        throw new Error("Veuillez vous connecter");
      }
      console.log("cand ID  infos");
      console.log(args);
      const where = {
        candRegistrationNumber: args.candRegistrationNumber,
      };
      const candidateRegisIDs = await prismaDB.query.registration(
        { where },
        info
      );

      return candidateRegisIDs;
    } catch (error) {
      throw new Error(` ${error.message}`);
    }
  },

  async centerExamSessionExaminers(
    parent,
    args,
    { prismaDB, request: { user, userId } },
    info
  ) {
    try {
      if (!userId) {
        throw new Error("Veuillez vous connecter");
      }
      const allCenterExamSessionExaminer = await prismaDB.query.centerExamSessionExaminers();
      return allCenterExamSessionExaminer;
    } catch (error) {
      throw new Error(` ${error.message}`);
    }
  },
  async getCenterExamSessionExaminers(
    parent,
    args,
    { prismaDB, request: { user, userId } },
    info
  ) {
    try {
      if (!userId) {
        throw new Error("Veuillez vous connecter");
      }
      console.log(args);
      const { examiner, centerExamSession, ...others } = args;

      const where = {
        examiner: { examinerCode: examiner.examinerCode },
        centerExamSession: { id: centerExamSession.id },
      };
      const allCenterExamSessionExaminer = await prismaDB.query.centerExamSessionExaminers(
        { where },
        info
      );
      return allCenterExamSessionExaminer;
    } catch (error) {
      throw new Error(`${error.message}`);
    }
  },
  async getCenterResults(
    parent,
    args,
    { prismaDB, request: { user, userId } },
    info
  ) {
    try {
      if (!userId) {
        throw new Error("Veuillez vous connecter");
      }
      console.log(args);
      const { centerExamSession } = { ...args };
      const where = { centerExamSession: centerExamSession.id };
      const allCenterExamSessionExaminer = await prismaDB.query.centerExamSessionSpecialties(
        { where },
        info
      );
      return allCenterExamSessionExaminer;
    } catch (error) {
      throw new Error(`${error.message}`);
    }
  },
  async centerExamSessionExaminer(
    parent,
    args,
    { prismaDB, request: { user, userId } },
    info
  ) {
    try {
      if (!userId) {
        throw new Error("Veuillez vous connecter");
      }
      const where = { id: args.id };
      const oneCenterExamSessionExaminer = await prismaDB.query.centerExamSessionExaminer(
        { where },
        info
      );
      return oneCenterExamSessionExaminer;
    } catch (error) {
      throw new Error(` ${error.message}`);
    }
  },

  async me(parent, args, { prismaDB, request }, info) {
    try {
      // check if current userID present from jwt
      const getUserID = request.userId;
      if (!getUserID) {
        return null;
      }
      return prismaDB.query.user({ where: { id: getUserID }, info });
    } catch (error) {
      throw new Error.log(` ${error.message}`);
    }
  },
};

module.exports = Query;
