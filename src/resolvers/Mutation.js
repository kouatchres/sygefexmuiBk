const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
require('dotenv').config({ path: '../variables.env' });

const Mutation = {
    async createCandidate(parents, args, { db }, info) {
        console.log(args)

        const newCand = {
            ...args
        }
        const {
            gender,
            ...others
        } = newCand
        const candidate = await db.mutation.createCandidate({
            data: {
                gender: {
                    connect: {
                        id: gender.id
                    }
                },
                ...others
            }
        }, info)

        return candidate
    },

    async createExaminer(parents, args, { db }, info) {
        console.log(args)
        const { gender, ...others } = args
        const newExaminer = await db.mutation.createExaminer({
            data: {
                gender: {
                    connect: { id: gender.id }
                },
                ...others
            }
        }, info)

        return newExaminer
    },

    async createDivision(parents, args, { db }, info) {
        console.log('we are in create division of mutations')
        console.log(args)
        //    make a copy  of the args
        const newRegs = { ...args }
        // show the region name from the new regions array because will not have to update the id

        const { region, ...others } = newRegs

        const division = await db.mutation.createDivision({
            data: {
                ...others,
                region: {
                    connect: { id: region.id }
                }
            }
        }, info)
        console.log(args)
        return division
    },

    async createPhaseRank(parents, args, { db }, info) {
        console.log(args)
        //    make a copy  of the argsRankphase rank
        const newRnk = { ...args }
        const { phase, ...others } = newRnk

        const newPhaseRank = await db.mutation.createPhaseRank({
            data: {
                phase: {
                    connect: { id: phase.id }
                },
                ...others
            }
        }, info)
        return newPhaseRank
    },

    async createSubDivision(parents, args, { db }, info) { //    make a copy  of the args
        const newDivs = {
            ...args
        }
        // show the region name from the new regions array because will not have to update the id

        const {
            division,
            ...others
        } = newDivs

        const subDivision = await db.mutation.createSubDivision({
            data: {
                division: {
                    connect: {
                        id: division.id
                    }
                },
                ...others
            }
        }, info)
        console.log(args)
        return subDivision
    },

    async createTown(parents, args, { db }, info) {
        console.log('we are in create town mutation')
        console.log(args)
        //    make a copy  of the args
        const newTowns = {
            ...args
        }
        // show the region name from the new regions array because will not have to update the id

        const {
            subDiv,
            ...others
        } = newTowns

        const town = await db.mutation.createTown({
            data: {
                subDiv: {
                    connect: {
                        id: subDiv.id
                    }
                },
                ...others
            }
        }, info)
        console.log(args)
        return town
    },

    async createCenter(parents, args, { db }, info) { //    make a copy  of the args
        const newCenters = {
            ...args
        }
        // show the region name from the new regions array because will not have to update the id

        const {
            town,
            ...others
        } = newCenters

        const center = await db.mutation.createCenter({
            data: {
                town: {
                    connect: {
                        id: town.id
                    }
                },
                ...others
            }
        }, info)
        console.log(args)
        return center
    },

    async createCenterExamSession(parents, args, { db }, info) { //    make a copy  of the args
        const newCenterRegistration = {
            ...args
        }
        // show the region name from the new regions array because will not have to update the id

        const { examSession, center } = newCenterRegistration

        const [alreadyRegistered] = await db.query.centerExamSessions({
            where: {
                center: {
                    id: center.id
                },
                examSession: {
                    id: examSession.id
                }
            }
        })
        if (alreadyRegistered) {
            throw new Error('Ce Centre est déjà inscrit à cet examen pour cette session.')
        }

        const centerExamSession = await db.mutation.createCenterExamSession({
            data: {
                examSession: {
                    connect: {
                        id: examSession.id
                    }
                },

                center: {
                    connect: {
                        id: center.id
                    }
                }
            }
        }, info)
        console.log(args)
        return centerExamSession
    },

    async createExamSession(parents, args, { db }, info) { //    make a copy  of the args
        const newExamSessionRegistration = {
            ...args
        }
        // show the region name from the new regions array because will not have to update the id

        const { exam, session } = newExamSessionRegistration

        const [alreadyRegistered] = await db.query.centerExamSessions({
            where: {
                session: {
                    id: session.id
                },
                exam: {
                    id: exam.id
                }
            }
        })
        if (alreadyRegistered) {
            throw new Error('Ceci est déjà inscrit à cet examen pour cette session.')
        }

        const ExamSession = await db.mutation.createExamSession({
            data: {
                exam: {
                    connect: {
                        id: exam.id
                    }
                },

                session: {
                    connect: {
                        id: session.id
                    }
                }
            }
        }, info)
        console.log(args)
        return ExamSession
    },

    async createCenterExamSessionSeries(parents, args, { db }, info) { //    make a copy  of the args
        const newCenterRegistration = {
            ...args
        }
        // show the region name from the new regions array because will not have to update the id

        const { centerExamSession, series } = newCenterRegistration

        const [alreadyRegistered] = await db.query.centerExamSessionSerieses({
            where: {
                centerExamSession: {
                    id: centerExamSession.id
                },
                series: {
                    id: series.id
                }
            }
        })
        if (alreadyRegistered) {
            throw new Error('Cette Séries est déjà inscrite à ce centre.')
        }

        const CESS = await db.mutation.createCenterExamSessionSeries({
            data: {
                series: {
                    connect: {
                        id: series.id
                    }
                },
                centerExamSession: {
                    connect: {
                        id: centerExamSession.id
                    }
                }
            }
        }, info)
        console.log(args)
        return CESS
    },

    async createRegistration(parents, args, { db }, info) { // the function that helps to addleading zeroes infront of an interger number
        Number.prototype.pad = function (size) {
            var s = String(this)
            while (s.length < (size || 2)) {
                s = '0' + s
            }
            return s
        }

        console.log(args)
        //    make a copy  of the args
        const newRegistartionInfos = { ...args }

        // show the region name from the new regions array because will not have to update the id
        const {
            candExamSession, centerExamSession, centerExamSessionSeries, candExamSecretCode, candidate, series, candRegistrationNumber, } = newRegistartionInfos

        const [hasRegisteredForExamInSession] = await db.query.registrations(
            { where: { candExamSession } }, info)
        if (hasRegisteredForExamInSession) {
            throw new Error('Vous êtes déjà inscrit à cet examen pour cette session.')
        }

        // get the series with all associated subjects while adding the coeff, cand secret code etc
        let subjsOfSeries = await db.query.series(
            { where: { id: series.id } }, `{ 
        id
        subjectSeries{
          id
          coeff
          subjectName
          subjectCode
      }}`, )

        const { subjectSeries } = subjsOfSeries

        // //make an array of the subjects for the candidate according to the chosen series
        const subjectList = subjectSeries.map(item => { // each subject with the accompanying attributes
            const subjectList = {
                subjectSeries: {
                    connect: {
                        id: item.id
                    }
                },
                candExamSecretCode,
                coeff: item.coeff
            }

            return subjectList
        })

        if (subjectList && subjectList.length === 0) {
            throw new Error("Pour l'instant, cette série n'est pas disponible pour les inscriptions")
        }

        // cross check  in the registration table to get the count of all records of a given centerExamSession
        const candCount = await db.query.registrationsConnection({
            where: {
                candRegistrationNumber_contains: candRegistrationNumber
            }
        }, `{
			aggregate{
				count
			}
		}`,)

        const newCount = candCount.aggregate.count + 1
        // recreate the next candidate registration Number
        const newCandRegistrationNumber = `${
            candRegistrationNumber + newCount.pad(5)
            }`
        // now  drop the list of subjects on the score table linking it up with the just created registration
        const newRegistration = db.mutation.createRegistration({
            data: {
                candExamSecretCode,
                candExamSession,
                candRegistrationNumber: newCandRegistrationNumber,
                centerExamSessionSeries: {
                    connect: {
                        id: centerExamSessionSeries.id
                    }
                },
                series: {
                    connect: {
                        id: series.id
                    }
                },
                centerExamSession: {
                    connect: {
                        id: centerExamSession.id
                    }
                },

                candidate: {
                    connect: {
                        candCode: candidate.candCode
                    }
                },
                scores: {
                    create: subjectList
                }
            }
        }, info)

        return newRegistration
    },

    async createCenterExamSessionExaminer(parents, args, { db }, info) {
        console.log(args)
        //    make a copy  of the args
        const newCenterAdminInfos = { ...args }

        const {
            centerExamSession,
            phaseRank,
            examiner,
        } = newCenterAdminInfos

        const [rankRegistered] = await db.query.centerExamSessionExaminers({
            where: {
                centerExamSession: {
                    id: centerExamSession.id
                },
                phaseRank: {
                    id: phaseRank.id
                }
            }
        })
        if (rankRegistered) {
            throw new Error('Poste déjà occupé, Veuillez Verifier avec le chef de centre')
        }

        const prof = await db.mutation.createCenterExamSessionExaminer({
            data: {
                centerExamSession: {
                    connect: {
                        id: centerExamSession.id
                    }
                },
                phaseRank: {
                    connect: {
                        id: phaseRank.id
                    }
                },
                examiner: {
                    connect: {
                        examinerCode: examiner.examinerCode
                    }
                },

            }
        }, info)
        return prof
    },

    async createSubjectSeries(parents, args, { db }, info) {
        console.log('subject series info')
        console.log(args)
        //    make a copy  of the args
        const subjSeriesInfos = {
            ...args
        }
        // show the region name from the new regions array because will not have to update the id
        console.log(subjSeriesInfos)
        const {
            series,
            subjectName,
            ...others
        } = subjSeriesInfos
        const [existingSubj] = await db.query.subjectSerieses({
            where: {
                series: {
                    id: series.id
                },
                subjectName
            }
        })
        if (existingSubj) {
            throw new Error('Matière déjà présente pour cette séries')
        }

        const newSubjSeries = await db.mutation.createSubjectSeries({
            data: {
                series: {
                    connect: {
                        id: series.id
                    }
                },
                ...others,
                subjectName
            }
        }, info)
        console.log(args)
        return newSubjSeries
    },

    async createRegion(parents, args, { db }, info) {

        const { country, ...others } = args
        const region = await db.mutation.createRegion({
            data: {
                country: {
                    connect: { id: country.id }
                },
                ...others
            }
        }, info)
        return region
    },
    async createCountry(parents, args, { db }, info) {
        const country = await db.mutation.createCountry({
            data: {
                ...args
            }
        }, info)
        return country
    },
    async createUser(parents, args, { db, response }, info) {
        const user = await db.mutation.createUser({
            data: { ...args, email: args.email.toLowerCase(), password: await bcrypt.hash(args.password, 10)}
        }, info)
        // create the user jwt token for signup for just created  user
        const token = jwt.sign({ userId: user.id }, process.env.APP_SECRET)
        // set the jwt as a cookie on the response
        response.cookie('token', token, {
            httpOnly: true,
            maxAge: 1000 * 60 * 60 * 24 * 365  // one year token validity
        })
        return user
    },
    async login(parents, { email, password }, { db, response }, info) {
        // 1 check if there is a user with that email
        const user = await db.query.user({ where: { email }, info })
        if (!user) {
            throw new Error(`pas d'utilisateur avec cet email : ${email}`)
        }
        // 2  check if their password is correct
        const valid = await bcrypt.compare(password, user.password)
        if (!valid) {
            throw new Error('Mot de passe Invalide')
        }
        // create user jwt token for signup for just created  user
        const token = jwt.sign({ userId: user.id }, process.env.APP_SECRET)
        // set the jwt as a cookie on the response
        response.cookie('token', token, {
            httpOnly: true,
            maxAge: 1000 * 60 * 60 * 24 * 365  // one year token validity
        })
        // 5 return user
        return user
    },

    async createPhase(parents, args, { db }, info) {
        const hase = await db.mutation.createPhase({
            data: {
                ...args
            }
        }, info)
        return hase
    },

    async createSession(parents, args, { db }, info) {
        const allExams = await db.query.exams()

        const refinedExams = allExams.map(({ __typename, createdAt, updatedAt, examName, examCode, ...others }) => others)

        const getExamItems = refinedExams.map(item => {
            const getExamItems = {
                exam: {
                    connect: {
                        id: item.id
                    }
                }
            }
            return getExamItems
        })
        // return getExasmItems

        const session = await db.mutation.createSession({
            data: {
                ...args,

                examSession: {
                    create: getExamItems
                }
            }
        }, info)
        return session
    },

    async createSubjectType(parents, args, { db }, info) {
        const subjectType = await db.mutation.createSubjectType({
            data: {
                ...args
            }
        }, info)
        return subjectType
    },

    async createRank(parents, args, { db }, info) {
        const rank = await db.mutation.createRank({
            data: {
                ...args
            }
        }, info)
        return rank
    },

    async createEducationType(parents, args, { db }, info) {
        const educationType = await db.mutation.createEducationType({
            data: {
                ...args
            }
        }, info)
        return educationType
    },

    async createExam(parents, args, { db }, info) {
        const exam = await db.mutation.createExam({
            data: {
                ...args
            }
        }, info)
        return exam
    },

    async createReport(parents, args, { db }, info) {
        const allArgs = {
            ...args
        }
        const {
            centerExamSessionExaminer,
            ...others
        } = allArgs
        const report = await db.mutation.createReport({
            data: {
                centerExamSessionExaminer: {
                    connect: {
                        authCode: centerExamSessionExaminer.authCode
                    }
                },
                ...others
            }
        }, info)
        return report
    },

    async createSeries(parents, args, { db }, info) { // make a copy  of the args
        const newEducTypes = {
            ...args
        }
        // show the region name from the new regions array because will not have to update the id

        const {
            educationType,
            ...others
        } = newEducTypes

        const series = await db.mutation.createSeries({
            data: {
                educationType: {
                    connect: {
                        id: educationType.id
                    }
                },
                ...others
            }
        }, info)
        return series
    },

    async createSubject(parents, args, { db }, info) {
        const newSbujectTypes = {
            ...args
        }
        const {
            educType,
            subjectType,
            ...others
        } = newSbujectTypes

        const subject = await db.mutation.createSubject({
            data: {
                subjectType: {
                    connect: {
                        id: subjectType.id
                    }
                },
                educType: {
                    connect: {
                        id: educType.id
                    }
                },
                ...others
            }
        }, info)
        return subject
    },

    async createGender(parents, args, { db }, info) {
        const gender = await db.mutation.createGender({
            data: {
                ...args
            }
        }, info)

        console.log(gender)
        return gender
    },

    updateCandidate(parent, args, { db }, info) { // first get a copy of the updates
        const { id, gender, ...updates } = args
        console.log(args)

        // run the update method
        console.log('calling the candidate update mutation!!')
        return db.mutation.updateCandidate({
            data: {
                gender: {
                    connect: { id: gender.id }
                },
                ...updates,
            },
            where: { id }

        }, info)
    },

    updateDivision(parent, args, { db }, info) {
        const {
            id,
            ...updates
        } = args
        // run the update method
        console.log('calling division update mutation!')

        return db.mutation.updateDivision({
            data: updates,
            where: {
                id: args.id
            }
        }, info)
        console.log(updates)
    },

    async updateScore(parent, args, { db }, info) {
        console.log(args)

        const {
            subjectSeries,
            candExamSecretCode,
            ...updates
        } = args

        console.log('calling scores update mutation!!')
        if (!subjectSeries) {
            throw new Error("Vous n'avez pas choisi de matiere")
        }
        // looking for the score id of the record whose marks will be updated
        const [getScoreID] = await db.query.scores({
            where: {
                subjectSeries,
                candExamSecretCode
            }
        }, `{
                id
                subjectAve
                coeff
                }`,)
        console.log(getScoreID)
        if (!getScoreID) {
            throw new Error('Code candidat erroné ')
        }
        // updating the marks for the given subject for the given student
        return db.mutation.updateScore({
            data: updates,
            where: {
                id: getScoreID.id
            }
        }, info)
    },

    updateGender(parent, args, { db }, info) { // first get a copy of the updates
        const {
            id,
            ...updates
        } = args
        // run the update method
        console.log('calling Gender update mutation!!')
        return db.mutation.updateGender({
            data: updates,
            where: {
                id: args.id
            }
        }, info)
        console.log(updates)
    },

    updateRegion(parent, args, { db }, info) {
        const {
            id,
            ...updates
        } = args
        // run the update method
        console.log('calling the mutation!!')
        return db.mutation.updateRegion({
            data: updates,
            where: {
                id: args.id
            }
        }, info)
        console.log(args.id)
    },

    updatePhase(parent, args, { db }, info) {
        const {
            id,
            ...updates
        } = args
        // run the update method
        console.log('calling the mutation!!')
        return db.mutation.updatePhase({
            data: updates,
            where: {
                id: args.id
            }
        }, info)
        console.log(args.id)
    },

    updateSubjectType(parent, args, { db }, info) {
        const {
            id,
            ...updates
        } = args
        // run the update method
        console.log('calling the mutation!!')
        return db.mutation.updateSubjectType({
            data: updates,
            where: {
                id: args.id
            }
        }, info)
        console.log(args.id)
    },

    updateSeries(parent, args, { db }, info) {
        const {
            id,
            ...updates
        } = args
        // run the update method
        console.log('calling the update series mutation!!')
        return db.mutation.updateSeries({
            data: updates,
            where: {
                id: args.id
            }
        }, info)
        console.log(args.id)
    },
    updateRank(parent, args, { db }, info) {
        const {
            id,
            ...updates
        } = args
        // run the update method
        console.log('calling the update Rank mutation!!')
        return db.mutation.updateRank({
            data: updates,
            where: {
                id: args.id
            }
        }, info)
        console.log(args.id)
    },
    updateSession(parent, args, { db }, info) {
        const {
            id,
            ...updates
        } = args
        // run the update method
        console.log('calling the update Session mutation!!')
        return db.mutation.updateSession({
            data: updates,
            where: {
                id: args.id
            }
        }, info)
        console.log(args.id)
    },
    updateEducationType(parent, args, { db }, info) {
        const {
            id,
            ...updates
        } = args
        // run the update method
        console.log('calling the update Educ Type mutation!!')
        return db.mutation.updateEducationType({
            data: updates,
            where: {
                id: args.id
            }
        }, info)
        console.log(args.id)
    },

    updateExam(parent, args, { db }, info) {
        const {
            id,
            ...updates
        } = args
        // run the update method
        console.log('calling the mutation!!')
        return db.mutation.updateExam({
            data: updates,
            where: {
                id: args.id
            }
        }, info)
        console.log(args.id)
    },
    updateSubject(parent, args, { db }, info) {
        const {
            id,
            ...updates
        } = args
        // run the update method
        console.log('calling the mutation!!')
        return db.mutation.updateSubject({
            data: updates,
            where: {
                id: args.id
            }
        }, info)
        console.log(args.id)
    },
    updateTown(parent, args, { db }, info) {
        const { id, ...updates } = args
        // run the update method
        console.log('calling the mutation!!')
        return db.mutation.updateTown({
            data: updates,
            where: {
                id: args.id
            }
        }, info)
        console.log(args.id)
    },
    updateSubDivision(parent, args, { db }, info) {
        const {
            id,
            ...updates
        } = args
        // run the update method
        console.log('calling the mutation!!')
        return db.mutation.updateSubDivision({
            data: updates,
            where: {
                id: args.id
            }
        }, info)
        console.log(args.id)
    },
    updateCenter(parent, args, { db }, info) {
        console.log(args)
        const {
            id,
            ...updates
        } = args
        // run the update method
        console.log('calling the update center mutation!!')
        return db.mutation.updateCenter({
            data: updates,
            where: {
                id: args.id
            }
        }, info)
        console.log(args.id)
    },

    async deleteCandidate(parent, args, { db }, info) { // make a where variable
        const where = {
            id: args.id
        }
        // 1 find the item
        const candidate = await db.query.candidate({
            where
        }, info)

        // 2. check if they own the item or have the permissions for the item
        // todo
        // 3.delelte it
        return db.mutation.deleteCandidate({
            where
        }, info)
    },

    async deleteRegion(parent, args, { db }, info) { // make a where variable
        const where = {
            id: args.id
        }
        // 1 find the item
        const regionToDelete = await db.query.region({
            where
        }, info)

        // 2. check if they own the item or have the permissions for the item
        // todo
        // 3.delelte it  form the database and note its absence
        return db.mutation.deleteRegion({
            where
        }, info)
    }
}
module.exports = Mutation
