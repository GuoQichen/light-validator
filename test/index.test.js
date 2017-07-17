const assert = require('assert')
require('mocha')

const Validator = require('../index.js')

describe(`Validator` , function () {
    const fakeData = {
        name: 'ackyguo',
        phone: 12345678901,
    }
    const fakeValidateSchema = [{
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
    }]
    const validate = new Validator(fakeValidateSchema)
    const indicateEachErrorValidate = new Validator(fakeValidateSchema, true)
    describe(`#validate`, function () {
        it(`must contain schema field in data`, function () {
            assert.throws(() => {
                validate({ name: 'ackyguo' })
            }, /can't find phone on validate data/)
        })

        it(`must call validate according order`, function () {
            let resultMessage = ''
            const validate = new Validator({
                field: 'name',
                rule: [{
                    validate: name => {
                        resultMessage += 'one'
                        return true
                    }
                }, {
                    validate: name => {
                        resultMessage += 'two'
                        return true
                    }
                }]
            })
            validate({ name: 'ackyguo' })
            assert.equal(resultMessage, `onetwo`)
        })

        it(`get current errorMessage when error occur`, function () {
            assert.throws(() => {
                validate({
                    name: 'acky'
                }, errorMessage => { 
                    throw new Error(errorMessage)
                })
            }, /name should be 6 to 20 digits, uppercase and lowercase letters, underlined/)
        })

        it(`validate multiple field`, function () {
            assert.throws(() => {
                validate({
                    name: 'ackyguo',
                    phone: 1
                }, errorMessage => {
                    throw new Error(errorMessage)
                })
            }, /phone should be 11 digits number/)
        })

        it(`schema and rule can be object`, function () {
            const validate = new Validator({
                field: 'name',
                rule: {
                    validate: name => !!name,
                    errorMessage: `name cna't be empty`
                }
            })

            assert.throws(() => {
                validate({
                    name: ''
                }, errorMessage => {
                    throw new Error(`name cna't be empty`)
                })
            }, /name cna't be empty/)
        })

        it(`return validate result`, function () {
            assert(validate(fakeData))
            assert.strictEqual(validate({
                name: 'acky',
                phone: 1
            }), false)
        })

        it(`abort if error occur`, function () {
            let errorCount = 0
            validate({
                name: '',
                phone: '',
            }, () => {
                errorCount++
            })
            assert.equal(errorCount, 1)
        })

        it(`indicate each error`, function () {
            let errorCount = 0
            indicateEachErrorValidate({
                name: '',
                phone: '',
            }, () => {
                errorCount++
            })
            assert.equal(errorCount, 4)
        })
    })
})
