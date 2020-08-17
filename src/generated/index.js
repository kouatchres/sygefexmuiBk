"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var prisma_lib_1 = require("prisma-client-lib");
var typeDefs = require("./prisma-schema").typeDefs;

var models = [
  {
    name: "Role",
    embedded: false
  },
  {
    name: "User",
    embedded: false
  },
  {
    name: "Region",
    embedded: false
  },
  {
    name: "Division",
    embedded: false
  },
  {
    name: "SubDivision",
    embedded: false
  },
  {
    name: "Town",
    embedded: false
  },
  {
    name: "Center",
    embedded: false
  },
  {
    name: "Series",
    embedded: false
  },
  {
    name: "EducationType",
    embedded: false
  },
  {
    name: "Exam",
    embedded: false
  },
  {
    name: "Subject",
    embedded: false
  },
  {
    name: "Session",
    embedded: false
  },
  {
    name: "Gender",
    embedded: false
  },
  {
    name: "Candidate",
    embedded: false
  },
  {
    name: "Rank",
    embedded: false
  },
  {
    name: "Office",
    embedded: false
  },
  {
    name: "Country",
    embedded: false
  },
  {
    name: "Phase",
    embedded: false
  },
  {
    name: "PhaseRank",
    embedded: false
  },
  {
    name: "Examiner",
    embedded: false
  },
  {
    name: "CenterExamSessionExaminer",
    embedded: false
  },
  {
    name: "Report",
    embedded: false
  },
  {
    name: "CenterExamSession",
    embedded: false
  },
  {
    name: "ExamSession",
    embedded: false
  },
  {
    name: "CenterExamSessionSeries",
    embedded: false
  },
  {
    name: "Score",
    embedded: false
  },
  {
    name: "Registration",
    embedded: false
  },
  {
    name: "SubjectSeries",
    embedded: false
  },
  {
    name: "SubjectType",
    embedded: false
  }
];
exports.Prisma = prisma_lib_1.makePrismaClientClass({
  typeDefs,
  models,
  endpoint: `https://eu1.prisma.sh/kouatchoua/sygefex-back/dev`,
  secret: `jwtsecret123456`
});
exports.prisma = new exports.Prisma();
