const yup = require('yup')

const emailNotLongEnough = 'email must be at least 3 characters'
const nameNotLongEnough = 'name must be at least 3 characters'
const passwordNotLongEnough = 'password must be at least 8 characters'
const invalidEmail = 'email must be a valid email'

const validator = yup.object().shape({
     email: yup
          .string()
          .min(3, emailNotLongEnough)
          .max(100)
          .email(invalidEmail),
     name: yup
          .string()
          .min(3, nameNotLongEnough)
          .max(100),
     password: yup
          .string()
          .min(8, passwordNotLongEnough)
          .max(100),
     confirmPassword: yup
          .string()
          .min(8, passwordNotLongEnough)
          .max(100)
})

const formatYupError = err => {
     const errors = []
     err.inner.forEach(e => {
          errors.push({
               path: e.path,
               message: e.message
          })
     })
     return errors
}

module.exports = { validator, formatYupError }