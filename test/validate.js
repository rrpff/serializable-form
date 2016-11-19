const form = require('../src')

describe('form', function () {
  describe('#validate', function () {
    it('should support asynchronous validators', async function () {
      const testForm = form({
        fields: {
          username: [
            form.validator(async value => {
              const taken = await Promise.resolve(value === 'this-one-is-taken')
              if (taken) throw new Error('This username is already taken')
              return true
            })
          ]
        }
      })

      expect(await testForm.validate('username', 'this-one-is-taken')).to.deep.equal({
        errors: ['This username is already taken'],
        valid: false
      })

      expect(await testForm.validate('username', 'this-one-is-free')).to.deep.equal({
        errors: [],
        valid: true
      })
    })

    it('should support synchronous validators', async function () {
      const testForm = form({
        fields: {
          age: [
            form.validator(value => value > 18, 'You are too young'),
            form.validator(value => value < 80, 'You are too old'),
          ]
        }
      })

      expect(await testForm.validate('age', 21)).to.deep.equal({
        errors: [],
        valid: true
      })

      expect(await testForm.validate('age', 5)).to.deep.equal({
        errors: ['You are too young'],
        valid: false
      })

      expect(await testForm.validate('age', 500)).to.deep.equal({
        errors: ['You are too old'],
        valid: false
      })
    })

    it('should support missing field definitions', async function () {
      const testForm = form()
      expect(await testForm.validate('some-field', 'blah')).to.deep.equal({
        errors: [],
        valid: true
      })
    })

    it('should support missing validators', async function () {
      const testForm = form({ fields: { thing: [] } })
      expect(await testForm.validate('thing', 'blah')).to.deep.equal({
        errors: [],
        valid: true
      })
    })

    it('should support helper replacement', async function () {
      const testForm = form({
        helpers: { valid: () => false },
        fields: {
          name: [
            form.validator((value, helpers) => helpers.valid())
          ]
        }
      })

      testForm.helpers.valid = () => true
      expect(await testForm.validate('name', 'test')).to.deep.equal({
        errors: [],
        valid: true
      })
    })
  })
})
