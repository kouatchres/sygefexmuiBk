const { verify } = require("jsonwebtoken");
require("dotenv").config({ path: "./variables.env" });

const getUserID = (request) => {
  const header = request.request.headers.authorization;
  if (header) {
    // remove the bearer and space before the token in the header
    const token = header.replace("Bearer ", "");
    //verify that the token has not been tampered with
    const decoded = verify(token, process.env.APP_SECRET);
    const userID = decoded.userId;

    return theUser;
  }
  return null;
};
module.exports = getUserID;
