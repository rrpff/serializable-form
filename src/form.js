const validateAll = require('./validateAll')

function emptyFormObject (fields) {
  const fieldMap = Object.keys(fields).reduce((acc, field) => {
    acc[field] = { value: undefined, valid: null, errors: [] }
    return acc
  }, {})

  return { valid: null, fields: fieldMap }
}

async function validatedFormObject (fields, entry, validate) {
  let allValid = true
  const fieldNames = Object.keys(fields)
  const fieldObjects = await Promise.all(fieldNames.map(async field => {
    const value = entry[field]
    const { valid, errors } = await validate(field, value)
    if (!valid) allValid = false
    return { [field]: { value, valid, errors } }
  }))

  const fieldMap = Object.assign({}, ...fieldObjects)

  return { valid: allValid, fields: fieldMap }
}

function form ({ helpers = [], fields = {} } = {}) {
  async function formInstance (entry) {
    if (!entry) return emptyFormObject(fields)
    return await validatedFormObject(fields, entry, formInstance.validate)
  }

  formInstance.helpers = helpers
  formInstance.validate = async (field, value) => validateAll({
    value,
    helpers,
    validators: fields[field]
  })

  return formInstance
}

module.exports = form
