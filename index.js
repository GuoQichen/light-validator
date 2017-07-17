/**
 * @author acky.guo
 */


class Validator {
	constructor(schema) {
        this.schema = this._isValidSchema(schema)
        return this.validate.bind(this)
	}

	_isValidAcceptType(target, message) {
		const toStringOriginal = Object.prototype.toString
		const targetType = toStringOriginal.call(target)
		const object = `[object Object]`
		const array = `[object Array]`
		if (![object, array].includes(targetType)) {
			this._handleError(message)
		}
		return targetType === object
				? [target]
				: target
	}

	_isValidSchema(schema) {
		return this._isValidAcceptType(schema, `Validator constructor only accept object or array`)
	}

	_isValidRule(rule) {
		return this._isValidAcceptType(rule, `rule only accept object or array`)
	}

	_isFunction(value) {
		return typeof value === 'function'
    }
    
    _addPrintPrefix(message, level) {
        return `[validator${level}]${message}`
    }

	_handleError(errorMessage) {
        const _errorMessage = this._addPrintPrefix(errorMessage, `Error`)
        // console.error(errorMessage)
		throw new Error(_errorMessage)
    }
    
    _hanldeWarn(warnMessage) {
        const _warnMessage = this._addPrintPrefix(warnMessage, `Warn`)
        const print = console.warn || console.log
        print.call(console, _warnMessage)
    }

	validate(data, handleErrorMessage) {
        let _handleErrorMessage
        const defaultHandleErrorMessage = message => console.log(this._addPrintPrefix(message, `Log`))
        if (!handleErrorMessage || !this._isFunction(handleErrorMessage)) {
            this._hanldeWarn(`validate must need a function as callback to handle error message`)
            _handleErrorMessage = defaultHandleErrorMessage
        } else {
        	_handleErrorMessage = handleErrorMessage
        }
		this.schema.forEach(({ field = Symbol('field'), rule }) => {
            const fieldValue = data[field]
			if (!data.hasOwnProperty(field)) {
				this._handleError(`can't find ${field} on validate data`)
			}
			const _rule = this._isValidRule(rule)
			_rule.forEach(({ validate, errorMessage = `invalid field ${field}`}) => {
				if (!this._isFunction(validate)) {
					this._handleError(`validate must be function`)
				}
				if (!validate.call(null, fieldValue)) {
					_handleErrorMessage.call(null, errorMessage)
				}
			})
		})
	}
}

module.exports = Validator