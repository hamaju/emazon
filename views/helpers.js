module.exports = {
  getError(errors, prop) {
    try {
      // give the errors array back as an object
      // prop === "email" || "password" || "passwordConfirmation"
      return errors.mapped()[prop].msg
      // errors.mapped() === { email: { msg: "" }, password: {}, passwordConfirmation: {}}
    } catch (err) {
      return ''
    }
  },
}
