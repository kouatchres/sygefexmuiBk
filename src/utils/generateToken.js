require("dotenv").config({ path: "./variables.env" });
const {sign} = require('jsonwebtoken')

const  generateToken=async (id)=>{
          return sign({id}, process.env.APP_SECRET)
}
module.exports = generateToken