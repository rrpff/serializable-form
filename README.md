# serializable-form

## install

```sh
$ npm install serializable-form --save
```

## why?

* Writing form validation on the client side and the server-side is a pain.
* Creating bespoke form validation over and over is tedious and prone to mistake.
* Many validation libraries do too much.

## examples

### creating a form

```js
const form = require('serializable-form')

const userCreateForm = form({
  helpers: {
    async usernameTaken (username) {
      const response = await fetch(`/taken?username=${username}`)
      const { taken } = await response.json()
      return taken
    }
  },
  fields: {
    username: [
      form.validator(value => value.length >= 5, 'too short'),
      form.validator(value => value.length <= 64, 'too long'),
      form.validator(async (value, helpers) => {
        const taken = await helpers.usernameTaken(value)
        if (taken) throw new Error('already taken')
        return true
      })
    ],
    password: [
      form.validator(value => value.length < 12, 'too short'),
      form.validator(value => value.match(/[a-zA-Z]/g) !== null, 'must contain a letter'),
      form.validator(value => value.match(/[0-9]/g) !== null, 'must contain a number'),
      form.validator(value => value.match(/[A-Z]/g) !== null, 'must contain a capital letter')
    ]
  }
})
```

### serializing a form

```js
await userCreateForm()
// {
//   valid: null,
//   fields: {
//     username: { valid: null, errors: [] },
//     password: { valid: null, errors: [] }
//   }
// }
```

### serializing a form entry with invalid data

```js
await userCreateForm({ username: 'test', password: 'abcdef' })
// {
//   valid: false,
//   fields: {
//     username: {
//       value: 'test',
//       valid: false,
//       errors: [
//         'too short',
//         'already taken'
//       ]
//     },
//     password: {
//       value: 'abcdef',
//       valid: false,
//       errors: [
//         'must contain a number',
//         'must contain a capital letter'
//       ]
//     }
//   }
// }
```

### serializing a form entry with valid data

```js
await userCreateForm({ username: 'zuren', password: 'Password1234' })
// {
//   valid: true,
//   fields: {
//     username: {
//       value: 'zuren',
//       valid: true,
//       errors: []
//     },
//     password: {
//       value: 'Password1234',
//       valid: true,
//       errors: []
//     }
//   }
// }
```

### validating an individual field

```js
await userCreateForm.validate('username', 'test')
// { valid: false, errors: [ 'too short' ] }

await userCreateForm.validate('username', 'zuren')
// { valid: true, errors: [] }
```

### helpers can be overridden, which allows for easy universal use

Would recommend only overriding server-side to keep server code out of your client bundles.

```js
userCreateForm.helpers.usernameTaken = async username => {
  return User.usernameTaken(username)
}
```

## api

### `form(options) -> entry`

Returns a function (lets call it `entry`) which

#### `entry([options]) -> Object`

`entry` is the return value of `form`. When calling `entry` with no arguments, returns an unvalidated schema hash of the form, which can be serialized. When calling `entry` with a hash of fields and values, returns a validated entry hash.

### `form.validator(predicate, [errorMessage]) -> validate`

Returns a `validate` function, which will use the passed error message if available, or any errors thrown if not.

#### `validate(value) -> Object`

Calls `predicate` with `value`. If `predicate` returns true, it will return a 'valid' hash with no errors. If the `predicate` returns false, it will return an 'invalid' hash with the `errorMessage` provided. If the predicate throws an Error, it will use the error.message instead.

* Valid: `{ valid: true, errors: [] }`
* Invalid: `{ valid: false, errors: ['too long'] }`
