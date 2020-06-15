"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var prisma_lib_1 = require("prisma-client-lib");
var typeDefs = require("./prisma-schema").typeDefs;

var models = [
  {
    name: "User",
    embedded: false
  },
  {
    name: "Item",
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
    name: "ExamCenter",
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
    name: "Presence",
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
    name: "CenterAdmin",
    embedded: false
  },
  {
    name: "Report",
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
    name: "AnnualExamSubjectSeries",
    embedded: false
  },
  {
    name: "AnotherType",
    embedded: false
  }
];
exports.Prisma = prisma_lib_1.makePrismaClientClass({
  typeDefs,
  models,
  endpoint: `https://eu1.prisma.sh/kouatchoua/inex-back/dev`
});
exports.prisma = new exports.Prisma();
