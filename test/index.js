const form = require('../src')

describe('form', function () {
  const userForm = form({
    fields: {
      age: [
        form.validator(age => age > 18, 'You are too young')
      ]
    }
  })

  describe('when called with no arguments', function () {
    it('should return a serializable form object', async function () {
      const object = await userForm()
      expect(object).to.deep.equal({
        valid: null,
        fields: {
          age: {
            value: undefined,
            valid: null,
            errors: []
          }
        }
      })
    })
  })

  describe('when given an invalid entry', function () {
    it('should return a validated serializable form object', async function () {
      const object = await userForm({ age: 15 })
      expect(object).to.deep.equal({
        valid: false,
        fields: {
          age: {
            value: 15,
            valid: false,
            errors: ['You are too young']
          }
        }
      })
    })
  })

  describe('when given a valid entry', function () {
    it('should return a validated serializable form object', async function () {
      const object = await userForm({ age: 20 })
      expect(object).to.deep.equal({
        valid: true,
        fields: {
          age: {
            value: 20,
            valid: true,
            errors: []
          }
        }
      })
    })
  })
})
