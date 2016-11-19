const validator = require('../src/validator')

describe('validator', function () {
  const ageValidator = validator(age => age > 18, 'You are too young')
  const wtfValidator = validator(function () {
    throw new Error('I got nothing')
  })

  it('should return a valid object when the predicate returns true', async function () {
    expect(await ageValidator(30)).to.deep.equal({ error: null, valid: true })
  })

  it('should return an invalid object when the predicate does not return true', async function () {
    expect(await ageValidator(17)).to.deep.equal({ error: 'You are too young', valid: false })
  })

  it('should return an invalid object when the predicate throws an error', async function () {
    expect(await wtfValidator()).to.deep.equal({ error: 'I got nothing', valid: false })
  })
})
