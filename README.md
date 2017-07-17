# light-Validator
light-Validator is a light form validator for reduce boilerplate code 

## motivation
form validate boilerplate code like this

```js
const validate = (data) => {
    if (!data[name]) {
        printError(`name can't be empty`)
    }
    if (!/^\w{6, 20}$/.test(data[name])) {
        printError(`name should be 6 to 20 digits, uppercase and lowercase letters, underlined`)
    }
    if (!data[phone]) {
        printError(`phone can't be empty`)
    }
    if (/^1\d{10}$/.test(data[phone])) {
        printError(`phone should be 11 digits number`)
    }

    // ...
}
```

it look verbose

## usage
```js
// Validator constructor accept objct or array for defined your validate rule
const validate = new Validator([{
    field: 'name',
    rule: [{
        validate: name => !!name,
        errorMessage: `name can't be empty`
    }, {
        validate: name => /^\w{6,20}$/.test(name),
        errorMessage: `name should be 6 to 20 digits, uppercase and lowercase letters, underlined`
    }]
}, {
    field: 'phone',
    rule: [{
        validate: phone => !!phone,
        errorMessage: `phone can't be empty`
    }, {
        validate: phone => /^1\d{10}$/.test(phone),
        errorMessage: `phone should be 11 digits number`
    }]
}])
```

then 

```js
const valideResult = validate({
    name: 'ackyguo',
    phone: 12345678901,
}, errorMessage => {
    // we need a callback for show errorMessage for user
    printError(errorMessage)
})
```

## test 
if you use yarn as package manage

```shell
yarn test
```

if you use npm as package manage

```shell
npm test
```