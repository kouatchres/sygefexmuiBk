
const {hash} = require('bcryptjs')

const hashPassword=(password)=>{
          if(password.length<4){
   throw new Error('password must be 4 characters or more')
          }
return hash(password,12)
}
module.exports= hashPassword