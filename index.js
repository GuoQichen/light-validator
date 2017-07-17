/**
 * @author acky.guo
 */


class Validator {
	constructor(schema, indicateEachError = false) {
		this.schema = this._isValidSchema(schema)
		this.indicateEachError = indicateEachError
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
		let result = true
		let _handleErrorMessage
		const defaultHandleErrorMessage = message => console.log(this._addPrintPrefix(message, `Log`))
		if (!handleErrorMessage || !this._isFunction(handleErrorMessage)) {
			this._hanldeWarn(`validate must need a function as callback to handle error message`)
			_handleErrorMessage = defaultHandleErrorMessage
		} else {
			_handleErrorMessage = handleErrorMessage
		}

		for (let i = 0; i < this.schema.length && (this.indicateEachError || result); i++) {
			const { field = Symbol('field'), rule } = this.schema[i]
			const fieldValue = data[field]
			if (!data.hasOwnProperty(field)) {
				this._handleError(`can't find ${field} on validate data`)
			}
			const _rule = this._isValidRule(rule)
			for (let j = 0; j < _rule.length && (this.indicateEachError || result); j++) {
				const { validate, errorMessage = `invalid field ${field}` } = _rule[j]
				if (!this._isFunction(validate)) {
					this._handleError(`validate must be function`)
				}
				if (!validate.call(null, fieldValue)) {
					result = false
					_handleErrorMessage.call(null, errorMessage)
				}				
			}
		}
		return result
	}
}

module.exports = Validator