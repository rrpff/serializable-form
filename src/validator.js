const { awaitIfAsync } = require('./helpers')

function validator (predicate, errorMessage) {
  return async function (value, helpers) {
    let valid = false
    let error = null

    try {
      valid = await awaitIfAsync(predicate(value, helpers))
    } catch (e) {
      valid = false
      error = e.message
    }

    if (!valid && !error) {
      error = errorMessage
    }

    return { error, valid }
  }
}

module.exports = validator
