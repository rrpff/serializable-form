async function validateAll ({ value, helpers, validators = [] }) {
  const validate = validator => validator(value, helpers)
  const results = await Promise.all(validators.map(validate))
  const valid = results.every(result => result.valid)
  const errors = results.reduce((acc, result) => {
    if (result.error === null) return acc
    return acc.concat(result.error)
  }, [])

  return { valid, errors }
}

module.exports = validateAll
