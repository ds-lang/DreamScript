// The Handler
// DreamScript Programming Language Projects

const { js_beautify } = require('js-beautify')
const { constant } = require('./ds_syntax')
const ds_exports = require('./ds_exports')
const chalk = require('chalk')

exports.parse = (tokens, callback) => {

    const token_handler = {
        REPEAT: repeat_handler,
        EVERY: every_handler,
        PKG: pkg_handler,
        [constant.MEDIAN]: median_handler,
        [constant.INPUT]: input_handler,
        [constant.YN]: yesno_handler,
        [constant.MATH]: math_handler
    }

    let transformed = ''
    let transformTrace = []

    for (let token of tokens) {
        transformTrace.push(`${token.type}:${token.line}`)

        if (token.type.toString() in token_handler) {
            transformed += token_handler[token.type](token)
        } else {
            transformed += token.value + ' '
        }
    }

    ds_exports.info('parse', 'transforming:', chalk.bold.gray(transformTrace.join(',')))

    if (Object.keys(additions).length <= 0) return callback(transformed)

    let additionsString = ''

    for (let key in additions) additionsString += additions[key] + '\n'

    ds_exports.info('parse', 'remove all additions')
    additions = {}

    callback(`${additionsString}\n${transformed}`)
}

let additions = {}

const INPUT = `const readlineSync = require("${require.resolve(
    'readline-sync'
).replace(/\\/g, "\\\\")}");`

const YN = `const readlineSync = require("${require.resolve(
    'readline-sync'
).replace(/\\/g, "\\\\")}");`

const MATH = `const math = require("${require.resolve(
    'mathjs'
).replace(/\\/g, "\\\\")}");`

const MEDIAN = 
`
Array.prototype.median = function () {
  return this.slice().sort((a, b) => a - b)[Math.floor(this.length / 2)]; 
};

`

function repeat_handler(token) {
    let valArr = js_beautify(token.value).split(' ')

    ds_exports.info('repeat_handler', 'array value:', valArr)
    ds_exports.info('repeat_handler', 'array length:', valArr.length)

    if (valArr.length < 5) {
        triggerError("Syntax 'repeat' error", token.line)
        process.exit()
    }

    const intvar = valArr[1]

    ds_exports.info('repeat_handler', 'variable interation:', intvar)

    var parsedJS = `for(var ${intvar} = 0; ${intvar} < ${
        valArr[3]
    }; ${intvar}++)`

    return parsedJS
}

function every_handler(token) {
    const parsed = js_beautify(token.value, {
        indent_level: 4
    }).trim().split(' ')

    ds_exports.info('every_handler', 'parsed:', parsed)

    return `for(var ${parsed[2].slice(0, -1)} of ${parsed[0].split('(')[1]})`
}

function input_handler(token) {

    additions.input = INPUT

    return token.value
}

function yesno_handler(token) {

    additions.yesno = YN

    return token.value
}

function median_handler(token) {

    additions.median = MEDIAN

    return token.value
}

function math_handler(token) {

    additions.math = MATH

    return token.value
}

function pkg_handler(token) {

    const parsed = token.value
        .replace('pkg', 'const')
        .replaceLast('from', '=')
    let packageName = parsed.match(/['`"]([^'`"]+)['`"]/)[0]


    return parsed.replaceLast(packageName, `require(${packageName})`)
}

function triggerError(mess, line) {
    throw `Error at line ${line}: "${mess}"`
}

String.prototype.reverse = function() {
    return this.split('')
        .reverse()
        .join('')
}

String.prototype.replaceLast = function(what, replacement) {
    return this.reverse()
        .replace(new RegExp(what.reverse()), replacement.reverse())
        .reverse()
}