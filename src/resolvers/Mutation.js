require("dotenv").config({ path: "../.env" });
const hashPassword = require("../utils/hashPassword");
const { randomBytes } = require("crypto");
const { promisify } = require("util");
const { hash, compare } = require("bcryptjs");
const { sign } = require("jsonwebtoken");
const hasPermissions = require("../utils/hasPermissions");

const Mutation = {
  signout(parent, args, { prismaDB, response }, info) {
    response.clearCookie("token");
    return { message: "Aurevoir de Sygefex!" };
  },

  async requestReset(
    parent,
    args,
    { prismaDB, request: { user, userId } },
    info
  ) {
    try {
      console.log(args);
      //check if the email exists
      const user = await prismaDB.query.user(
        {
          where: { email: args.email },
        },
        info
      );
      if (!user) {
        throw new Error("No such email found");
      }

      const resetToken = (await promisify(randomBytes)(20)).toString("hex");
      const resetTokenExpiry = Date.now() + 3600000; // 1hr from now

      // save the just created variables to the user object
      const res = await prismaDB.mutation.updateUser({
        where: { email: args.email },
        data: { resetToken, resetTokenExpiry },
      });
      console.log(res);
      return { message: "Password Reset link has been emailed to you" };
    } catch (err) {
      throw new Error(err);
    }
  },

  async resetPassword(parent, args, { prismaDB, response }, info) {
    // 1 check if passwords match
    if (!args.password === args.confirmPassword) {
      throw new Error("Your passwords do not match");
    }
    // 2 check if it is  a legit token
    // 3 check if its expired
    const [updatedUser] = await prismaDB.query.users({
      where: {
        resetToken: args.resetToken,
        resetTokenExpiry: Date.now() - 3600000,
      },
    });
    if (!updatedUser) {
      throw new Error("Token is either invalid or expired");
    }
    // 4 hash new password
    const password = await hash(args.password, 10);
    // 5 save new password to the user
    const res = await prismaDB.mutation.updateUser({
      where: { email: updatedUser.email },
      data: {
        password,
        resetToken: null,
        resetTokenExpiry: null,
      },
    });
    // 6 generate jwt
    const token = sign({ userId: updatedUser.id }, process.env.APP_SECRET);
    // 7  set jwt cookie
    response.cookie("token", token, {
      httpOnly: true,
      maxAge: 1000 * 90 * 90 * 24 * 365,
    });
    // 8 check passwords match

    return updatedUser;
  },

  async login(parents, args, { prismaDB, response }, info) {
    try {
      console.log({ args });
      //check if the email exists
      const user = await prismaDB.query.user(
        {
          where: { email: args.email },
        },
        info
      );
      if (!user) {
        throw new Error("Unable to login");
      }
      //compare the provided password with the hashed one coming from the user object
      const isMatched = await compare(args.password, user.password);
      if (!isMatched) {
        throw new Error("Unable to login");
      }

      //generate the jwt for the user
      const token = sign({ userId: user.id }, process.env.APP_SECRET);
      // set the cookie with the token for subsequent transactions
      response.cookie("token", token, {
        httpOnly: true,
        maxAge: 60 * 60 * 24 * 365 * 1000,
      });
      return user;
    } catch (err) {
      throw new Error(err.message);
    }
  },

  async createAttendance(
    parents,
    args,
    { prismaDB, request: { userId, user } },
    info
  ) {
    try {
      if (!userId) {
        throw new Error("Veuillez vous connecter");
      }
      console.log(args);
      hasPermissions(user, ["USER", "ADMIN", "CENTER_ADMIN"]);
      const newAttendance = { ...args };
      // show the region name from the new regions array because will not have to update the id

      const { subjectSpecialty, candExamSecretCode, ...others } = newAttendance;

      const attendance = await prismaDB.mutation.createAttendance(
        {
          data: {
            user: {
              connect: { id: userId },
            },
            registration: {
              connect: { candExamSecretCode },
            },
            subjectSpecialty: {
              connect: { id: subjectSpecialty.id },
            },
            candExamSecretCode,
            ...others,
          },
        },
        info
      );

      return attendance;
    } catch (error) {
      throw new Error(`Attendance Errors, ${error}`);
    }
  },

  async createCandidate(
    parents,
    args,
    { prismaDB, request: { userId, user } },
    info
  ) {
    try {
      if (!userId) {
        throw new Error("Veuillez vous connecter");
      }

      hasPermissions(user, ["USER", "ADMIN", "CENTER_ADMIN"]);
      // const userCreatedCand = await prismaDB.query.candidates(
      //   {
      //     where: {
      //       user: { id: userId },
      //     },
      //   },
      //   info
      // );
      // if (userCreatedCand) {
      //   throw new Error("Vous avez déjà enregistré un candidat");
      // }

      const candidate = await prismaDB.mutation.createCandidate(
        {
          data: {
            user: {
              connect: {
                id: userId,
              },
            },
            ...args,
          },
        },
        info
      );

      return candidate;
    } catch (error) {
      throw new Error(`Candidate Errors, ${error}`);
    }
  },

  async createMultipleCandidates(
    parents,
    args,
    { prismaDB, request: { userId, user } },
    info
  ) {
    try {
      if (!userId) {
        throw new Error("Veuillez vous connecter");
      }

      hasPermissions(user, ["ADMIN", "CENTER_ADMIN"]);
      console.log(args);

      const verifyUserEmailExists = await prismaDB.query.users(
        { where: { email: args.email } },
        info
      );
      if (!verifyUserEmailExists) {
        throw new Error(
          "l'utilisateur avec cet e-mail n'a pas de compte et ne peut pas être enregistré"
        );
      }

      const candidate = await prismaDB.mutation.createCandidate(
        {
          data: {
            user: {
              connect: {
                email: args.email,
              },
            },
            ...args,
          },
        },
        info
      );

      return candidate;
    } catch (error) {
      throw new Error(`Multi cand Errors, ${error}`);
    }
  },

  async createExaminer(
    parents,
    args,
    { prismaDB, request: { userId, user } },
    info
  ) {
    try {
      if (!userId) {
        throw new Error("Veuillez vous connecter");
      }
      hasPermissions(user, ["ADMIN", "EXAMINER"]);
      const newExaminer = await prismaDB.mutation.createExaminer(
        {
          data: {
            user: {
              connect: {
                id: userId,
              },
            },
            ...args,
          },
        },
        info
      );

      return newExaminer;
    } catch (error) {
      throw new Error(`Examiner new Errors, ${error}`);
    }
  },

  async createDivision(
    parents,
    args,
    { prismaDB, request: { userId, user } },
    info
  ) {
    try {
      if (!userId) {
        throw new Error("Veuillez vous connecter");
      }
      hasPermissions(user, ["ADMIN"]);
      const newRegs = {
        ...args,
      };
      // show the region name from the new regions array because will not have to update the id

      const { region, ...others } = newRegs;

      const division = await prismaDB.mutation.createDivision(
        {
          data: {
            ...others,
            region: {
              connect: {
                id: region.id,
              },
            },
          },
        },
        info
      );
      console.log(args);
      return division;
    } catch (error) {
      throw new Error(`Division Errors, ${error}`);
    }
  },

  async createPhaseRank(
    parents,
    args,
    { prismaDB, request: { userId, user } },
    info
  ) {
    try {
      if (!userId) {
        throw new Error("Veuillez vous connecter");
      }
      hasPermissions(user, ["ADMIN"]);
      //    make a copy  of the argsRankphase rank
      const newRank = {
        ...args,
      };
      const { phase, ...others } = newRank;

      const newPhaseRank = await prismaDB.mutation.createPhaseRank(
        {
          data: {
            phase: {
              connect: {
                id: phase.id,
              },
            },
            ...others,
          },
        },
        info
      );
      return newPhaseRank;
    } catch (error) {
      throw new Error(`Phase Rank Errors, ${error}`);
    }
  },

  async createSubDivision(
    parents,
    args,
    { prismaDB, request: { userId, user } },
    info
  ) {
    try {
      if (!userId) {
        throw new Error("Veuillez vous connecter");
      }
      hasPermissions(user, ["ADMIN"]);
      //    make a copy  of the args
      const newDivs = {
        ...args,
      };
      // show the region name from the new regions array because will not have to update the id

      const { division, ...others } = newDivs;

      const subDivision = await prismaDB.mutation.createSubDivision(
        {
          data: {
            division: {
              connect: {
                id: division.id,
              },
            },
            ...others,
          },
        },
        info
      );
      console.log(args);
      return subDivision;
    } catch (error) {
      throw new Error(`Sub Division Errors, ${error}`);
    }
  },

  async createTown(
    parents,
    args,
    { prismaDB, request: { userId, user } },
    info
  ) {
    try {
      if (!userId) {
        throw new Error("Veuillez vous connecter");
      }
      hasPermissions(user, ["ADMIN"]);
      const newTowns = {
        ...args,
      };
      // show the region name from the new regions array because will not have to update the id

      const { subDiv, ...others } = newTowns;

      const town = await prismaDB.mutation.createTown(
        {
          data: {
            subDiv: {
              connect: {
                id: subDiv.id,
              },
            },
            ...others,
          },
        },
        info
      );
      console.log(args);
      return town;
    } catch (error) {
      throw new Error(`Town Errors, ${error}`);
    }
  },

  async createCenter(
    parents,
    args,
    { prismaDB, request: { userId, user } },
    info
  ) {
    try {
      if (!userId) {
        throw new Error("Veuillez vous connecter");
      }
      hasPermissions(user, ["ADMIN", "CENTER_ADMIN"]);
      const newCenters = {
        ...args,
      };
      // show the region name from the new regions array because will not have to update the id

      const { town, ...others } = newCenters;

      const center = await prismaDB.mutation.createCenter(
        {
          data: {
            town: {
              connect: {
                id: town.id,
              },
            },
            ...others,
          },
        },
        info
      );
      console.log(args);
      return center;
    } catch (error) {
      throw new Error(`Center Errors, ${error}`);
    }
  },

  async createCenterExamSession(
    parents,
    args,
    { prismaDB, request: { user, userId } },
    info
  ) {
    try {
      //    make a copy  of the args
      const newCenterRegistration = {
        ...args,
      };
      // show the region name from the new regions array because will not have to update the id

      const { examSession, center } = newCenterRegistration;

      const [alreadyRegistered] = await prismaDB.query.centerExamSessions({
        where: {
          center: {
            id: center.id,
          },
          examSession: {
            id: examSession.id,
          },
        },
      });
      if (alreadyRegistered) {
        throw new Error(
          "Ce Centre est déjà inscrit à cet examen pour cette session."
        );
      }

      const centerExamSession = await prismaDB.mutation.createCenterExamSession(
        {
          data: {
            examSession: {
              connect: {
                id: examSession.id,
              },
            },

            center: {
              connect: {
                id: center.id,
              },
            },
          },
        },
        info
      );
      console.log(args);
      return centerExamSession;
    } catch (error) {
      throw new Error(`Candidate Errors, ${error}`);
    }
  },

  async createExamSession(
    parents,
    args,
    { prismaDB, request: { userId, user } },
    info
  ) {
    try {
      if (!userId) {
        throw new Error("Veuillez vous connecter");
      }
      hasPermissions(user, ["ADMIN"]);
      //    make a copy  of the args
      const newExamSessionRegistration = {
        ...args,
      };
      // show the region name from the new regions array because will not have to update the id

      const { exam, session } = newExamSessionRegistration;

      const [alreadyRegistered] = await prismaDB.query.centerExamSessions({
        where: {
          session: {
            id: session.id,
          },
          exam: {
            id: exam.id,
          },
        },
      });
      if (alreadyRegistered) {
        throw new Error(
          "Ceci est déjà inscrit à cet examen pour cette session."
        );
      }

      const ExamSession = await prismaDB.mutation.createExamSession(
        {
          data: {
            exam: {
              connect: {
                id: exam.id,
              },
            },

            session: {
              connect: {
                id: session.id,
              },
            },
          },
        },
        info
      );
      console.log(args);
      return ExamSession;
    } catch (error) {
      throw new Error(`Exam session Errors, ${error}`);
    }
  },

  async createSubjectSpecialty(
    parents,
    args,
    { prismaDB, request: { userId, user } },
    info
  ) {
    try {
      if (!userId) {
        throw new Error("Veuillez vous connecter");
      }
      hasPermissions(user, ["ADMIN"]);
      //    make a copy  of the args
      const newSubjSpec = { ...args };

      const { specialty, subject, ...others } = newSubjSpec;

      const [
        subjectSpecialtyRegistered,
      ] = await prismaDB.query.subjectSpecialties({
        where: {
          subject: {
            id: subject.id,
          },
          specialty: {
            id: specialty.id,
          },
        },
      });
      if (subjectSpecialtyRegistered) {
        throw new Error("Cette Matière est déjà inscrite à cette specialité.");
      }

      const subjSpecs = await prismaDB.mutation.createSubjectSpecialty(
        {
          data: {
            subject: {
              connect: {
                id: subject.id,
              },
            },

            specialty: {
              connect: {
                id: specialty.id,
              },
            },
            ...others,
          },
        },
        info
      );
      console.log(args);
      return subjSpecs;
    } catch (error) {
      throw new Error(`Subject Specialty Errors, ${error}`);
    }
  },

  async createCenterExamSessionSpecialty(
    parents,
    args,
    { prismaDB, request: { user, userId } },
    info
  ) {
    try {
      //    make a copy  of the args
      const newCenterRegistration = {
        ...args,
      };
      // show the region name from the new regions array because will not have to update the id

      const { centerExamSession, specialty } = newCenterRegistration;

      const [
        alreadyRegistered,
      ] = await prismaDB.query.centerExamSessionSpecialties({
        where: {
          centerExamSession: {
            id: centerExamSession.id,
          },
          specialty: {
            id: specialty.id,
          },
        },
      });
      if (alreadyRegistered) {
        throw new Error("Cette Séries est déjà inscrite à ce centre.");
      }

      const CESS = await prismaDB.mutation.createCenterExamSessionSpecialty(
        {
          data: {
            specialty: {
              connect: {
                id: specialty.id,
              },
            },
            centerExamSession: {
              connect: {
                id: centerExamSession.id,
              },
            },
          },
        },
        info
      );
      console.log(args);
      return CESS;
    } catch (error) {
      throw new Error(`CESS Errors, ${error}`);
    }
  },

  //todo registration including subjects in the scores table
  // async createRegistrationWithScores(
  //   parents,
  //   args,
  //   { prismaDB, request: { user, userId } },
  //   info
  // ) {
  //   try {
  //     // the function that helps to addleading zeroes infront of an interger number
  //     Number.prototype.pad = function(size) {
  //       var s = String(this);
  //       while (s.length < (size || 2)) {
  //         s = "0" + s;
  //       }
  //       return s;
  //     };

  //     console.log(args);
  //     //    make a copy  of the args
  //     const newRegistartionInfos = {
  //       ...args,
  //     };

  //     // show the region name from the new regions array because will not have to update the id
  //     const {
  //       candExamSession,
  //       centerExamSession,
  //       centerExamSessionSpecialty,
  //       candExamSecretCode,
  //       candidate,
  //       specialty,
  //       candRegistrationNumber,
  //     } = newRegistartionInfos;

  //     const [
  //       hasRegisteredForExamInSession,
  //     ] = await prismaDB.query.registrations(
  //       {
  //         where: {
  //           candExamSession,
  //         },
  //       },
  //       info
  //     );
  //     if (hasRegisteredForExamInSession) {
  //       throw new Error(
  //         "Vous êtes déjà inscrit à cet examen pour cette session."
  //       );
  //     }

  //     // get the specialty with all associated subjects while adding the coeff, cand secret code etc
  //     let subjsOfSpecialty = await prismaDB.query.specialty(
  //       {
  //         where: {
  //           id: specialty.id,
  //         },
  //       },
  //       `{
  //       id
  //       subjectSpecialty{
  //         id
  //         coeff
  //         subjectName
  //         subjectCode
  //     }}`
  //     );

  //     const { subjectSpecialty } = subjsOfSpecialty;

  //     // //make an array of the subjects for the candidate according to the chosen specialty
  //     const subjectList = subjectSpecialty.map((item) => {
  //       // each subject with the accompanying attributes
  //       const subjectList = {
  //         subjectSpecialty: {
  //           connect: {
  //             id: item.id,
  //           },
  //         },
  //         candExamSecretCode,
  //         coeff: item.coeff,
  //       };

  //       return subjectList;
  //     });

  //     if (subjectList && subjectList.length === 0) {
  //       throw new Error(
  //         "Pour l'instant, cette série n'est pas disponible pour les inscriptions"
  //       );
  //     }

  //     // cross check  in the registration table to get the count of all records of a given centerExamSession
  //     const candCount = await prismaDB.query.registrationsConnection(
  //       {
  //         where: {
  //           candRegistrationNumber_contains: candRegistrationNumber,
  //         },
  //       },
  //       `{
  // 		aggregate{
  // 			count
  // 		}
  // 	}`
  //     );

  //     const newCount = candCount.aggregate.count + 1;
  //     // recreate the next candidate registration Number
  //     const newCandRegistrationNumber = `${candRegistrationNumber +
  //       newCount.pad(5)}`;
  //     // now  drop the list of subjects on the score table linking it up with the just created registration
  //     const newRegistration = prismaDB.mutation.createRegistration(
  //       {
  //         data: {
  //           candExamSecretCode,
  //           candExamSession,
  //           candRegistrationNumber: newCandRegistrationNumber,
  //           centerExamSessionSpecialty: {
  //             connect: {
  //               id: centerExamSessionSpecialty.id,
  //             },
  //           },
  //           specialty: {
  //             connect: {
  //               id: specialty.id,
  //             },
  //           },
  //           centerExamSession: {
  //             connect: {
  //               id: centerExamSession.id,
  //             },
  //           },

  //           candidate: {
  //             connect: {
  //               candCode: candidate.candCode,
  //             },
  //           },
  //           scores: {
  //             create: subjectList,
  //           },
  //         },
  //       },
  //       info
  //     );

  //     return newRegistration;
  //   } catch (error) {
  //     throw new Error(`new Registration Errors, ${error}`);
  //   }
  // },

  async createRegistration(
    parents,
    args,
    { prismaDB, request: { user, userId } },
    info
  ) {
    try {
      // the function that helps to addleading zeroes infront of an interger number
      Number.prototype.pad = function(size) {
        var s = String(this);
        while (s.length < (size || 2)) {
          s = "0" + s;
        }
        return s;
      };

      console.log(args);
      //    make a copy  of the args
      const newRegistartionInfos = { ...args };

      const {
        candExamSession,
        centerExamSession,
        centerExamSessionSpecialty,
        candExamSecretCode,
        candidate,
        aptitude,
        specialty,
        EPF1,
        EPF2,
        candRegistrationNumber,
      } = newRegistartionInfos;

      const [
        hasRegisteredForExamInSession,
      ] = await prismaDB.query.registrations(
        {
          where: {
            candExamSession,
          },
        },
        info
      );
      if (hasRegisteredForExamInSession) {
        throw new Error(
          "Vous êtes déjà inscrit à cet examen pour cette session."
        );
      }

      // cross check  in the registration table to get the count of all records of a given centerExamSession
      const candCount = await prismaDB.query.registrationsConnection(
        {
          where: {
            candRegistrationNumber_contains: candRegistrationNumber,
          },
        },
        `{
			aggregate{
				count
			}
		}`
      );

      const newCount = candCount.aggregate.count + 1;
      // recreate the next candidate registration Number
      const newCandRegistrationNumber = `${candRegistrationNumber +
        newCount.pad(5)}`;
      // now  drop the list of subjects on the score table linking it up with the just created registration
      const newRegistration = prismaDB.mutation.createRegistration(
        {
          data: {
            candExamSecretCode,
            candExamSession,
            aptitude,
            EPF1,
            EPF2,
            candRegistrationNumber: newCandRegistrationNumber,
            centerExamSessionSpecialty: {
              connect: {
                id: centerExamSessionSpecialty.id,
              },
            },
            specialty: {
              connect: {
                id: specialty.id,
              },
            },
            centerExamSession: {
              connect: {
                id: centerExamSession.id,
              },
            },
            candidate: {
              connect: {
                candCode: candidate.candCode,
              },
            },
          },
        },
        info
      );

      return newRegistration;
    } catch (error) {
      throw new Error(`new Registration Errors, ${error}`);
    }
  },

  async createCenterExamSessionExaminer(
    parents,
    args,
    { prismaDB, request: { user, userId } },
    info
  ) {
    try {
      console.log(args);
      //    make a copy  of the args
      const newCenterAdminInfos = {
        ...args,
      };

      const { centerExamSession, phaseRank, examiner } = newCenterAdminInfos;

      const [rankRegistered] = await prismaDB.query.centerExamSessionExaminers({
        where: {
          centerExamSession: {
            id: centerExamSession.id,
          },
          phaseRank: {
            id: phaseRank.id,
          },
        },
      });
      if (rankRegistered) {
        throw new Error(
          "Poste déjà occupé, Veuillez Verifier avec le chef de centre"
        );
      }

      const prof = await prismaDB.mutation.createCenterExamSessionExaminer(
        {
          data: {
            centerExamSession: {
              connect: {
                id: centerExamSession.id,
              },
            },
            phaseRank: {
              connect: {
                id: phaseRank.id,
              },
            },
            examiner: {
              connect: {
                examinerCode: examiner.examinerCode,
              },
            },
          },
        },
        info
      );
      return prof;
    } catch (error) {
      throw new Error(`Prof Errors, ${error}`);
    }
  },

  // async createSubjectSpecialty(
  //   parents,
  //   args,
  //   { prismaDB, request: { user, userId } },
  //   info
  // ) {
  //   try {
  //     if (!userId) {
  //       throw new Error("Veuillez vous connecter");
  //     }
  //     hasPermissions(user, ["ADMIN"]);

  //     //    make a copy  of the args
  //     const subjSpecialtyInfos = {
  //       ...args,
  //     };
  //     // show the region name from the new regions array because will not have to update the id
  //     console.log(subjSpecialtyInfos);
  //     const { specialty, subjectName, ...others } = subjSpecialtyInfos;
  //     const [existingSubj] = await prismaDB.query.subjectSpecialties({
  //       where: {
  //         specialty: {
  //           id: specialty.id,
  //         },
  //         subjectName,
  //       },
  //     });
  //     if (existingSubj) {
  //       throw new Error("Matière déjà présente pour cette séries");
  //     }

  //     const newSubjSpecialty = await prismaDB.mutation.createSubjectSpecialty(
  //       {
  //         data: {
  //           specialty: {
  //             connect: {
  //               id: specialty.id,
  //             },
  //           },
  //           ...others,
  //           subjectName,
  //         },
  //       },
  //       info
  //     );
  //     console.log(args);
  //     return newSubjSpecialty;
  //   } catch (error) {
  //     throw new Error(`new subj specialty Errors, ${error}`);
  //   }
  // },

  async createRegion(
    parents,
    args,
    { prismaDB, request: { userId, user } },
    info
  ) {
    try {
      if (!userId) {
        throw new Error("Veuillez vous connecter");
      }
      hasPermissions(user, ["ADMIN"]);
      const region = await prismaDB.mutation.createRegion(
        { data: { ...args } },
        info
      );
      return region;
    } catch (error) {
      throw new Error(`create Region Error ${error}`);
    }
  },

  async signup(parents, args, { prismaDB, response }, info) {
    try {
      const user = await prismaDB.mutation.createUser({
        data: {
          ...args,
          email: args.email.toLowerCase(),
          password: await hashPassword(args.password),
          permissions: { set: ["USER", "ADMIN"] },
        },
      });
      const token = sign({ userId: user.id }, process.env.APP_SECRET);
      // set the jwt as a cookie to be sent along for each transaction
      response.cookie("token", token, {
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24 * 365, // token valid for 1 year
      });

      return user;
    } catch (error) {
      throw new Error(`create user Errors, ${error}`);
    }
  },

  async createPhase(
    parents,
    args,
    { prismaDB, request: { userId, user } },
    info
  ) {
    try {
      if (!userId) {
        throw new Error("Veuillez vous connecter");
      }
      hasPermissions(user, ["ADMIN"]);
      const phase = await prismaDB.mutation.createPhase(
        {
          data: { ...args },
        },
        info
      );
      return phase;
    } catch (error) {
      throw new Error(`create phase Errors, ${error}`);
    }
  },

  async createSession(
    parents,
    args,
    { prismaDB, request: { user, userId } },
    info
  ) {
    try {
      if (!userId) {
        throw new Error("Veuillez vous connecter");
      }
      hasPermissions(user, ["ADMIN"]);
      const allExams = await prismaDB.query.exams();
      if (allExams.length === 0) {
        throw new Error(
          "Aucun Examem n'est enrégistré. Veuillez enrégistrer tous les examens d'abord"
        );
      }
      const refinedExams = allExams.map(
        ({ __typename, createdAt, updatedAt, examName, examCode, ...others }) =>
          others
      );

      const getExamItems = refinedExams.map((item) => {
        const getExamItems = {
          exam: {
            connect: {
              id: item.id,
            },
          },
        };
        return getExamItems;
      });

      const session = await prismaDB.mutation.createSession(
        {
          data: {
            ...args,

            examSession: {
              create: getExamItems,
            },
          },
        },
        info
      );
      return session;
    } catch (error) {
      throw new Error(`create Session Errors, ${error}`);
    }
  },

  async createRank(
    parents,
    args,
    { prismaDB, request: { user, userId } },
    info
  ) {
    try {
      if (!userId) {
        throw new Error("Veuillez vous connecter");
      }
      hasPermissions(user, ["ADMIN"]);
      const rank = await prismaDB.mutation.createRank(
        {
          data: {
            ...args,
          },
        },
        info
      );
      return rank;
    } catch (error) {
      throw new Error(`create rank Errors, ${error}`);
    }
  },

  async createEducationType(
    parents,
    args,
    { prismaDB, request: { user, userId } },
    info
  ) {
    try {
      const educationType = await prismaDB.mutation.createEducationType(
        {
          data: {
            ...args,
          },
        },
        info
      );
      return educationType;
    } catch (error) {
      throw new Error(`create educ type Errors, ${error}`);
    }
  },

  async createExam(
    parents,
    args,
    { prismaDB, request: { userId, user } },
    info
  ) {
    try {
      if (!userId) {
        throw new Error("Veuillez vous connecter");
      }
      hasPermissions(user, ["ADMIN"]);
      const exam = await prismaDB.mutation.createExam(
        {
          data: {
            ...args,
          },
        },
        info
      );
      return exam;
    } catch (error) {
      throw new Error(`create Exam Errors, ${error}`);
    }
  },

  async createReport(
    parents,
    args,
    { prismaDB, request: { userId, user } },
    info
  ) {
    try {
      if (!userId) {
        throw new Error("Veuillez vous connecter");
      }
      hasPermissions(user, ["ADMIN", "CENTER_ADMIN"]);
      const allArgs = {
        ...args,
      };
      const { centerExamSessionExaminer, ...others } = allArgs;
      const report = await prismaDB.mutation.createReport(
        {
          data: {
            centerExamSessionExaminer: {
              connect: {
                authCode: centerExamSessionExaminer.authCode,
              },
            },
            ...others,
          },
        },
        info
      );
      return report;
    } catch (error) {
      throw new Error(`create report Errors, ${error}`);
    }
  },

  async createSpecialty(
    parents,
    args,
    { prismaDB, request: { user, userId } },
    info
  ) {
    try {
      // make a copy  of the args
      const newEducTypes = {
        ...args,
      };
      // show the region name from the new regions array because will not have to update the id

      const { educationType, ...others } = newEducTypes;

      const specialty = await prismaDB.mutation.createSpecialty(
        {
          data: {
            educationType: {
              connect: {
                id: educationType.id,
              },
            },
            ...others,
          },
        },
        info
      );
      return specialty;
    } catch (error) {
      throw new Error(`create specialty Errors, ${error}`);
    }
  },

  async createSubject(
    parents,
    args,
    { prismaDB, request: { userId, user } },
    info
  ) {
    try {
      if (!userId) {
        throw new Error("Veuillez vous connecter");
      }
      hasPermissions(user, ["ADMIN"]);

      const newSubjectTypes = {
        ...args,
      };
      const { educType, ...others } = newSubjectTypes;

      const subject = await prismaDB.mutation.createSubject(
        {
          data: {
            educType: {
              connect: {
                id: educType.id,
              },
            },
            ...others,
          },
        },
        info
      );
      return subject;
    } catch (error) {
      throw new Error(`create subj  Errors, ${error}`);
    }
  },

  async enterMarks(
    parents,
    args,
    { prismaDB, request: { user, userId } },
    info
  ) {
    try {
      if (!userId) {
        throw new Error("Veuillez vous connecter");
      }
      hasPermissions(user, ["ADMIN", "MARKS_ADMIN"]);
      //TODO verify if marks exist for the given subject
      console.log(args);
      const { subjectSpecialty, candExamSecretCode, ...updates } = args;
      const [marksExist] = await prismaDB.query.scores(
        {
          where: {
            subjectSpecialty,
            candExamSecretCode,
          },
        },
        `{
                id
                subjectAve
                coeff
                }`
      );
      console.log(marksExist);

      if (marksExist) {
        throw new Error("Ce candidate a déjà une note en cette Matière");
      }
      const getSubjCoeff = await prismaDB.query.subjectSpecialty(
        { where: { id: subjectSpecialty.id } },
        `{coeff}`
      );
      //todo
      const candMarks = await prismaDB.mutation.createScore(
        {
          data: {
            user: {
              connect: { id: userId },
            },
            registration: {
              connect: { candExamSecretCode },
            },
            subjectSpecialty: {
              connect: { id: subjectSpecialty.id },
            },
            coeff: getSubjCoeff.coeff,
            candExamSecretCode,
            ...updates,
          },
        },
        info
      );

      console.log(candMarks);
      return candMarks;
    } catch (error) {
      throw new Error(`Cand Marks Errors, ${error}`);
    }
  },

  updateCandidate(parent, args, { prismaDB, request: { userId, user } }, info) {
    try {
      if (!userId) {
        throw new Error("Veuillez vous connecter");
      }
      //todo make sure it is the owner carrying out the operation

      hasPermissions(user, ["ADMIN", "CENTER_ADMIN"]);
      const { id, ...updates } = args;
      // run the update method
      return prismaDB.mutation.updateCandidate(
        {
          data: {
            ...updates,
          },
          where: { id: args.id },
        },
        info
      );
    } catch (error) {
      throw new Error(`Update candidate Errors, ${error}`);
    }
  },

  updateExaminer(parent, args, { prismaDB, request: [userId, user] }, info) {
    try {
      if (!userId) {
        throw new Error("Veuillez vous connecter");
      }
      //todo make sure it is the owner carrying out the operation
      const samePerson = userId === args.user.id;
      if (!samePerson) {
        throw new Error("Cette operation vous est interdite");
      }
      // hasPermissions(user, ["ADMIN", "CENTER_ADMIN", "EXAMINER"])
      // first get a copy of the updates
      const { id, ...updates } = args;
      // run the update method
      console.log("calling the Examiner update mutation!!");
      return prismaDB.mutation.updateExaminer(
        {
          data: {
            ...updates,
          },
          where: { id: userId },
        },
        info
      );
    } catch (error) {
      throw new Error(`Update Examiner Errors, ${error}`);
    }
  },

  updateDivision(parent, args, { prismaDB, request: { user, userId } }, info) {
    try {
      if (!userId) {
        throw new Error("Veuillez vous connecter");
      }

      hasPermissions(user, ["ADMIN"]);
      const { id, ...updates } = args;
      // run the update method
      console.log("calling division update mutation!");

      return prismaDB.mutation.updateDivision(
        {
          data: updates,
          where: {
            id: args.id,
          },
        },
        info
      );
      console.log(updates);
    } catch (error) {
      throw new Error(`Update division Errors, ${error}`);
    }
  },

  async updateScore(
    parent,
    args,
    { prismaDB, request: { user, userId } },
    info
  ) {
    try {
      if (!userId) {
        throw new Error("Veuillez vous connecter");
      }

      hasPermissions(user, ["ADMIN", "ACCESSOR"]);

      const { subjectSpecialty, candExamSecretCode, ...updates } = args;

      console.log("calling scores update mutation!!");
      if (!subjectSpecialty) {
        throw new Error("Vous n'avez pas choisi de Matière");
      }
      // looking for the score id of the record whose marks will be updated
      const [getScoreID] = await prismaDB.query.scores(
        {
          where: {
            subjectSpecialty,
            candExamSecretCode,
          },
        },
        `{
                id
                subjectAve
                coeff
                }`
      );
      console.log(getScoreID);
      if (!getScoreID) {
        throw new Error("Code candidat erroné ");
      }
      // updating the marks for the given subject for the given student
      return prismaDB.mutation.updateScore(
        {
          data: {
            ...updates,
            user: {
              connect: { id: userId },
            },
          },

          where: {
            id: getScoreID.id,
          },
        },
        info
      );
    } catch (error) {
      throw new Error(`Update score Errors, ${error}`);
    }
  },

  updateRegion(parent, args, { prismaDB, request: { user, userId } }, info) {
    try {
      if (!userId) {
        throw new Error("Veuillez vous connecter");
      }
      hasPermissions(user, ["ADMIN"]);

      const { id, ...updates } = args;
      // run the update method
      console.log("calling the mutation!!");
      return prismaDB.mutation.updateRegion(
        {
          data: updates,
          where: {
            id: args.id,
          },
        },
        info
      );
      console.log(args.id);
    } catch (error) {
      throw new Error(`update region Errors, ${error}`);
    }
  },

  updatePhase(parent, args, { prismaDB, request: { user, userId } }, info) {
    try {
      if (!userId) {
        throw new Error("Veuillez vous connecter");
      }
      hasPermissions(user, ["ADMIN"]);

      const { id, ...updates } = args;
      // run the update method
      console.log("calling the mutation!!");
      return prismaDB.mutation.updatePhase(
        {
          data: updates,
          where: {
            id: args.id,
          },
        },
        info
      );
      console.log(args.id);
    } catch (error) {
      throw new Error(`update Phase Errors, ${error}`);
    }
  },

  updateSpecialty(parent, args, { prismaDB, request: { user, userId } }, info) {
    try {
      if (!userId) {
        throw new Error("Veuillez vous connecter");
      }
      hasPermissions(user, ["ADMIN"]);
      const { id, ...updates } = args;
      // run the update method
      console.log("calling the update specialty mutation!!");
      return prismaDB.mutation.updateSpecialty(
        {
          data: updates,
          where: {
            id: args.id,
          },
        },
        info
      );
      console.log(args.id);
    } catch (error) {
      throw new Error(`update specialty Errors, ${error}`);
    }
  },
  updateRank(parent, args, { prismaDB, request: { user, userId } }, info) {
    try {
      if (!userId) {
        throw new Error("Veuillez vous connecter");
      }
      hasPermissions(user, ["ADMIN"]);
      const { id, ...updates } = args;
      // run the update method
      console.log("calling the update Rank mutation!!");
      return prismaDB.mutation.updateRank(
        {
          data: updates,
          where: {
            id: args.id,
          },
        },
        info
      );
      console.log(args.id);
    } catch (error) {
      throw new Error(`uodate rank Errors, ${error}`);
    }
  },
  updateSession(parent, args, { prismaDB, request: { user, userId } }, info) {
    try {
      if (!userId) {
        throw new Error("Veuillez vous connecter");
      }
      hasPermissions(user, ["ADMIN"]);
      const { id, ...updates } = args;
      // run the update method
      console.log("calling the update Session mutation!!");
      return prismaDB.mutation.updateSession(
        {
          data: updates,
          where: {
            id: args.id,
          },
        },
        info
      );
      console.log(args.id);
    } catch (error) {
      throw new Error(`update session Errors, ${error}`);
    }
  },
  updateEducationType(
    parent,
    args,
    { prismaDB, request: { user, userId } },
    info
  ) {
    try {
      if (!userId) {
        throw new Error("Veuillez vous connecter");
      }
      hasPermissions(user, ["ADMIN"]);
      const { id, ...updates } = args;
      // run the update method
      console.log("calling the update Educ Type mutation!!");
      return prismaDB.mutation.updateEducationType(
        {
          data: updates,
          where: {
            id: args.id,
          },
        },
        info
      );
      console.log(args.id);
    } catch (error) {
      throw new Error(`update educ type Errors, ${error}`);
    }
  },

  updateExam(parent, args, { prismaDB, request: { user, userId } }, info) {
    try {
      if (!userId) {
        throw new Error("Veuillez vous connecter");
      }
      hasPermissions(user, ["ADMIN"]);
      const { id, ...updates } = args;
      // run the update method
      console.log("calling the mutation!!");
      return prismaDB.mutation.updateExam(
        {
          data: updates,
          where: {
            id: args.id,
          },
        },
        info
      );
      console.log(args.id);
    } catch (error) {
      throw new Error(`update exam Errors, ${error}`);
    }
  },

  updateSubject(parent, args, { prismaDB, request: { user, userId } }, info) {
    try {
      if (!userId) {
        throw new Error("Veuillez vous connecter");
      }
      hasPermissions(user, ["ADMIN"]);
      const { id, ...updates } = args;
      // run the update method
      console.log("calling the mutation!!");
      return prismaDB.mutation.updateSubject(
        {
          data: updates,
          where: {
            id: args.id,
          },
        },
        info
      );
      console.log(args.id);
    } catch (error) {
      throw new Error(`update subject Errors, ${error}`);
    }
  },

  updateTown(parent, args, { prismaDB, request: { user, userId } }, info) {
    try {
      if (!userId) {
        throw new Error("Veuillez vous connecter");
      }
      hasPermissions(user, ["ADMIN"]);
      const { id, ...updates } = args;
      // run the update method
      console.log("calling the mutation!!");
      return prismaDB.mutation.updateTown(
        {
          data: updates,
          where: { id: args.id },
        },
        info
      );
      console.log(args.id);
    } catch (error) {
      throw new Error(`update town Errors, ${error}`);
    }
  },
  updateSubDivision(
    parent,
    args,
    { prismaDB, request: { user, userId } },
    info
  ) {
    try {
      if (!userId) {
        throw new Error("Veuillez vous connecter");
      }
      hasPermissions(user, ["ADMIN"]);
      const { id, ...updates } = args;
      // run the update method
      console.log("calling the mutation!!");
      return prismaDB.mutation.updateSubDivision(
        {
          data: updates,
          where: { id: args.id },
        },
        info
      );
      console.log(args.id);
    } catch (error) {
      throw new Error(`update sub div Errors, ${error}`);
    }
  },
  updateCenter(parent, args, { prismaDB, request: { user, userId } }, info) {
    try {
      if (!userId) {
        throw new Error("Veuillez vous connecter");
      }
      hasPermissions(user, ["ADMIN", "CENTER_ADMIN"]);
      console.log(args);
      const { id, ...updates } = args;
      // run the update method
      console.log("calling the update center mutation!!");
      return prismaDB.mutation.updateCenter(
        {
          data: updates,
          where: { id: args.id },
        },
        info
      );
      console.log(args.id);
    } catch (error) {
      throw new Error(`update center Errors, ${error}`);
    }
  },

  async deleteCandidate(
    parent,
    args,
    { prismaDB, request: { user, userId } },
    info
  ) {
    try {
      if (!userId) {
        throw new Error("Veuillez vous connecter");
      }

      hasPermissions(user, ["ADMIN", "CENTER_ADMIN"]);
      const userId = getUserID(request);
      // make a where variable
      const where = { id: userId };
      // 3.delete it
      const delCand = await prismaDB.mutation.deleteCandidate({ where }, info);
      return { message: "Candidate Deletion Successful" };
    } catch (error) {
      throw new Error(` Delete Candidate Errors, ${error}`);
    }
  },

  async deleteRegion(
    parent,
    args,
    { prismaDB, request: { user, userId } },
    info
  ) {
    try {
      if (!userId) {
        throw new Error("Veuillez vous connecter");
      }
      hasPermissions(user, ["ADMIN"]);
      // make a where variable
      const where = { id: args.id };
      // 1 find the item
      // const regionToDelete = await prismaDB.query.region({ where }, info);

      // todo check if they own the item or have the permissions for the item
      // todo delete it  from the database and note its absence
      return prismaDB.mutation.deleteRegion({ where }, info);
    } catch (error) {
      throw new Error(`delete region Errors, ${error}`);
    }
  },
};
module.exports = Mutation;
