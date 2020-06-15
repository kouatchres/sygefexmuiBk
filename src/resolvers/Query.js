const { forwardTo } = require('prisma-binding');


const Query = {

    registrationsConnection: forwardTo('db'),


    async candidates(parent, args, { db }, info) {
        const allCandidates = await db.query.candidates();
        return allCandidates;
    },
    async candidate(parent, args, { db }, info) {
        const where = {
            id: args.id
        };
        const oneCandidate = await db.query.candidate({
            where
        }, info);
        return oneCandidate;
    },

    async region(parent, args, { db }, info) {
        const where = {
            id: args.id
        };
        const oneRegion = await db.query.region({
            where
        }, info);
        return oneRegion;
    },

    async regions(parent, args, { db }, info) {
        console.log(args);

        const allRegions = await db.query.regions();
        return allRegions;
    },

    async country(parent, args, { db }, info) {
        const where = {
            id: args.id
        };
        const oneCountry = await db.query.country({
            where
        }, info);
        return oneCountry;
    },

    async countries(parent, args, { db }, info) {
        console.log(args);

        const allCountrys = await db.query.countries();
        return allCountrys;
    },

    async phases(parent, args, { db }, info) {
        console.log(args);
        const allPhases = await db.query.phases();
        return allPhases;
    },

    async phase(parent, args, { db }, info) {
        console.log(args);
        const where = {
            id: args.id
        };
        const onePhase = await db.query.phase({ where }, info);
        return onePhase;
    },

    async genders(parent, args, { db }, info) {
        const allGenders = await db.query.genders();
        return allGenders;
    },
    async gender(parent, args, { db }, info) {
        const where = {
            id: args.id
        };
        const oneGender = await db.query.gender({
            where
        }, info);
        return oneGender;
    },


    async divisions(parent, args, { db }, info) {
        const allDivisions = await db.query.divisions();
        return allDivisions;
    },
    async division(parent, args, { db }, info) {
        const where = {
            id: args.id
        };
        const oneDivision = await db.query.division({
            where
        }, info);
        return oneDivision;
    },

    async subDivisions(parent, args, { db }, info) {
        const allSubDivisions = await db.query.subDivisions();
        return allSubDivisions;
    },
    async subDivision(parent, args, { db }, info) {
        const where = {
            id: args.id
        };
        const oneSubDivision = await db.query.subDivision({
            where
        }, info);
        return oneSubDivision;
    },

    async countRegisteredCandidates(parent, args, { db }, info) {
        console.log('in countRegistered Candidates')
        console.log(args)

        const where = {
            id: args.id
        }
        const getCount = await db.query.centerExamSessions({
            where
        }, info)

        return getCount

    },

    async subjectTypes(parent, args, { db }, info) {
        const allSubjectTypes = await db.query.subjectTypes();
        return allSubjectTypes;
    },
    async subjectType(parent, args, { db }, info) {
        const where = {
            id: args.id
        };
        const oneSubjectType = await db.query.subjectType({
            where
        }, info);
        return oneSubjectType;
    },

    async towns(parent, args, { db }, info) {
        const allTowns = await db.query.towns();
        return allTowns;
    },
    async town(parent, args, { db }, info) {
        const where = {
            id: args.id
        };
        const oneTown = await db.query.town({
            where
        }, info);
        return oneTown;
    },

    async centers(parent, args, { db }, info) {
        const allCenters = await db.query.centers();
        return allCenters;
    },
    async center(parent, args, { db }, info) {
        const where = { id: args.id };
        const oneCenter = await db.query.center({
            where
        }, info);
        return oneCenter;
    },
    async centerByNumber(parent, args, { db }, info) {
        console.log(args)
        const { centerNumber } = { ...args }
        const where = { centerNumber };
        const oneCenter = await db.query.center({ where }, info);

        if (!oneCenter) {
            throw new Error('Numéro de centre inexistent')
        }
        return oneCenter;
    },

    async getCenterByCode(parent, args, { db }, info) {
        console.log(args)
        const { centerSecretCode } = { ...args }
        const where = { centerSecretCode };
        const oneCenter = await db.query.center({ where }, info);

        if (!oneCenter) {
            throw new Error('Code centre inexistent')
        }
        return oneCenter;
    },

    async examinerByCode(parent, args, { db }, info) {
        console.log(args)
        const { examinerCode } = { ...args }
        const where = { examinerCode };
        const oneProf = await db.query.examinerByCode({ where }, info);

        if (!oneProf) {
            throw new Error('Code Prof inexistent')
        }
        return oneProf;
    },

    async exams(parent, args, { db }, info) {
        const allExams = await db.query.exams();
        return allExams;
    },
    async examiner(parent, args, { db }, info) {
        const where = {
            id: args.id
        }
        const examinerDetails = await db.query.examiner({ where }, info);
        return examinerDetails;
    },
    async exam(parent, args, { db }, info) {
        const where = {
            id: args.id
        };
        const oneExam = await db.query.exam({
            where
        }, info);
        return oneExam;
    },

    async scores(parent, args, { db }, info) {
        console.log('this is in the scores query');
        console.log(args);
        const where = {
            candExamSecretCode: args.candExamSecretCode
        };
        const allScores = await db.query.scores({
            where
        }, info);
        return allScores;
    },
    async score(parent, args, { db }, info) {
        const where = {
            id: args.id
        };
        const oneScore = await db.query.score({
            where
        }, info);
        return oneScore;
    },

    async series(parent, args, { db }, info) {
        const allSeries = await db.query.serieses();
        return allSeries;
    },
    async serieses(parent, args, { db }, info) {
        const allSeries = await db.query.serieses();
        return allSeries;
    },

    async subjSeries(parent, args, { db }, info) {
        const where = {
            id: args.id
        };
        let subjsOfSeries = await db.query.series({
            where
        }, info);
        return subjsOfSeries;
    },

    async series(parent, args, { db }, info) {
        const where = {
            id: args.id
        };
        const oneSeries = await db.query.series({
            where
        }, info);
        return oneSeries;
    },

    async getCandidateByCode(parent, args, { db }, info) {
        console.log(args);
        const where = {
            candCode: args.candCode
        };
        const oneCanndidate = await db.query.candidates({
            where
        }, info);
        return oneCanndidate;
    },

    async subjects(parent, args, { db }, info) {
        const allSubject = await db.query.subjects();
        return allSubject;
    },
    async subject(parent, args, { db }, info) {
        const where = {
            id: args.id
        };
        const oneSubject = await db.query.subject({
            where
        }, info);
        return oneSubject;
    },

    async subjectSerieses(parent, args, { db }, info) {
        const allSubjectSeries = await db.query.subjectSerieses();
        return allSubjectSeries;
    },
    async subjectSeries(parent, args, { db }, info) {
        const where = {
            id: args.id
        };
        const oneSubjectSeries = await db.query.subjectSeries({
            where
        }, info);
        return oneSubjectSeries;
    },

    async reports(parent, args, { db }, info) {
        const allReport = await db.query.reports();
        return allReport;
    },
    async report(parent, args, { db }, info) {
        const where = {
            id: args.id
        };
        const oneReport = await db.query.report({
            where
        }, info);
        return oneReport;
    },

    async centerExamSessionSerieses(parent, args, { db }, info) {
        console.log(args);
        const { centerExamSession, series } = {
            ...args
        };

        const where = {
            centerExamSession: {
                id: centerExamSession.id
            },
            series: {
                id: series.id
            }
        };
        return seriesExists = await db.query.centerExamSessionSerieses({
            where
        }, info);

    },


    async centerExamSessionForResults(parent, args, { db }, info) {
        console.log(args);
        const { centerExamSession } = {
            ...args
        };


        const where = {
            centerExamSession: {
                id: centerExamSession.id
            }
        };
        const allCenterExamSessionSeries = await db.query.centerExamSessionForResults({
            where
        }, info);
        return allCenterExamSessionSeries;
    },


    async centerExamSessions(parent, args, { db }, info) {
        console.log(args);
        const { center, examSession } = {
            ...args
        };

        const where = {
            examSession: {
                id: examSession.id
            },
            center: {
                id: center.id
            }
        };
        return [allCenterExamSession] = await db.query.centerExamSessions({
            where
        }, info);
    },

    async centerExamSessionsByCode(parent, args, { db }, info) {
        console.log(args);
        const { center, examSession } = {
            ...args
        };

        const where = {
            examSession: {
                id: examSession.id
            },
            center: {
                id: center.id
            }
        };
        return [allCenterExamSession] = await db.query.centerExamSessions({
            where
        }, info);
    },

    async centerExamSession(parent, args, { db }, info) {
        const where = {
            id: args.id
        };
        const oneCenterExamSession = await db.query.centerExamSession({
            where
        }, info);
        return oneCenterExamSession;
    },
    async centerExamSessionSeries(parent, args, { db }, info) {
        console.log(args)
        const where = {
            id: args.id
        };
        const oneCenterExamSession = await db.query.centerExamSessionSeries({
            where
        }, info);
        return oneCenterExamSession;
    },

    async sessions(parent, args, { db }, info) {
        const allSession = await db.query.sessions();
        return allSession;
    },
    async session(parent, args, { db }, info) {
        const where = {
            id: args.id
        };
        const oneSession = await db.query.session({
            where
        }, info);
        return oneSession;
    },
    async ranks(parent, args, { db }, info) {
        const allRank = await db.query.ranks();
        return allRank;
    },
    async rank(parent, args, { db }, info) {
        const where = {
            id: args.id
        };
        const oneRank = await db.query.rank({
            where
        }, info);
        return oneRank;
    },
    async examSessions(parent, args, { db }, info) {
        console.log(args)
        const { session, exam } = {
            ...args
        }
        const where = {
            session: {
                id: session.id
            },
            exam: {
                id: exam.id
            }
        }
        const allExamSessions = await db.query.examSessions({
            where
        }, info);
        return allExamSessions;
    },


    async examSession(parent, args, { db }, info) {
        const where = {
            id: args.id
        };
        const oneExamSession = await db.query.examSession({
            where
        }, info);
        return oneExamSession;
    },

    async educationTypes(parent, args, { db }, info) {
        const allEducationType = await db.query.educationTypes();
        return allEducationType;
    },
    async educationType(parent, args, { db }, info) {
        const where = {
            id: args.id
        };
        const oneEducationType = await db.query.educationType({
            where
        }, info);
        return oneEducationType;
    },

    async registrations(parent, args, { db }, info) {
        console.log(args)
        const where = {
            id: args.id
        };
        const allRegistration = await db.query.registrations();
        return allRegistration;
    },

    async registration(parent, args, { db }, info) {
        const where = {
            id: args.id
        };
        const oneRegistration = await db.query.registration({
            where
        }, info);
        return oneRegistration;
    },

    // // obtain all rsults for a given center
    // async centerExamSessionIDs(parent, args, {db}, info) {
    // console.log('center registration  infos');
    // console.log(args);
    // const { exam, session, center } = args;
    // const where = {
    // center: { id: center.id },
    // exam: { id: exam.id },
    // session: { id: session.id }
    // };
    // const centerRegisIDs = await db.query.registrations({ where }, `{id}`);
    // return centerRegisIDs;
    // },

    // obtain all results for a given center
    async candidateRegistrationID(parent, args, { db }, info) {
        console.log('cand registration  infos');
        console.log(args);
        const { candidate, centerExamSession } = args;
        const where = {
            centerExamSession: {
                id: centerExamSession.id
            },
            candidate: {
                candCode: candidate.candCode
            }
        };
        const [candidateRegisIDs] = await db.query.registrations({
            where
        }, `{id}`);

        if (!candidateRegisIDs) {
            throw new Error('Vous avez choisi, soit le mauvais examen, soit la mauvaise session, soit votre code candidat est erroné')
        }


        return candidateRegisIDs;
    },
    // obtain all rsults for a given center
    async getPhaseRankID(parent, args, { db }, info) {
        console.log('cand registration  infos');
        console.log(args);
        const { phase, rank } = args;
        const where = {
            phase: {
                id: phase.id
            },
            rank: {
                id: rank.id
            }
        };
        const [phaseRankID] = await db.query.phaseRanks({
            where
        }, `{id}`);

        if (!phaseRankID) {
            throw new Error('Vous avez choisi, soit le mauvais examen, soit la mauvaise session, soit votre code Prof est erroné')
        }


        return phaseRankID;
    },
    // obtain all rsults for a given center
    async candidateRegistrationIDs(parent, args, { db }, info) {
        console.log('cand registration  infos');
        console.log(args);
        const { candidate } = {
            args
        }
        const where = {
            candidate: {
                id: args
            }
        };
        const candidateRegisIDs = await db.query.candidateRegistrationIDs({
            where
        }, info);

        if (!candidateRegisIDs) {
            throw new Error("Vous n'etes pas inscrit a un examen sur la plateforme")
        }


        return candidateRegisIDs;
    },


    async candidateCode(parent, args, { db }, info) {
        console.log('cand ID  infos');
        console.log(args);
        const where = {
            candCode: args.candCode
        };
        const candidateRegisIDs = await db.query.candidate({
            where
        }, `{id}`);

        return candidateRegisIDs;
    },
    async candidateRegistrationNumber(parent, args, { db }, info) {
        console.log('cand ID  infos');
        console.log(args);
        const where = {
            candRegistrationNumber: args.candRegistrationNumber
        };
        const candidateRegisIDs = await db.query.registration({
            where
        }, info);

        return candidateRegisIDs;
    },

    async centerExamSessionExaminers(parent, args, { db }, info) {

        const allCenterExamSessionExaminer = await db.query.centerExamSessionExaminers();
        return allCenterExamSessionExaminer;
    },
    async getCenterExamSessionExaminers(parent, args, { db }, info) {
        console.log(args);
        const { examiner, centerExamSession, ...others } = args

        const where = {
            examiner: { examinerCode: examiner.examinerCode },
            centerExamSession: { id: centerExamSession.id }
        }
        const allCenterExamSessionExaminer = await db.query.centerExamSessionExaminers({ where }, info);
        return allCenterExamSessionExaminer;
    },
    async getCenterResults(parent, args, { db }, info) {
        console.log(args)
        const { centerExamSession } = { ...args }
        const where = { centerExamSession: centerExamSession.id }
        const allCenterExamSessionExaminer = await db.query.centerExamSessionSerieses({
            where
        }, info);
        return allCenterExamSessionExaminer;
    },
    async centerExamSessionExaminer(parent, args, { db }, info) {
        const where = { id: args.id };
        const oneCenterExamSessionExaminer = await db.query.centerExamSessionExaminer({ where }, info);
        return oneCenterExamSessionExaminer;
    },
    async me(parent, args, { db, request }, info) {
        // check if current userID present from jwt
        const getUserID = request.userId
        if (!getUserID) {
            return null
        }
        return db.query.user({ where: { id: getUserID }, info })
    },
    
};

module.exports = Query;
