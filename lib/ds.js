// DreamScript Programming Language Projects
// Based on JavaScript
// Maintained by JahiR
// Development Since December 2021

const fs = require('fs');
const childProcess = require('child_process');
const path = require('path');
const ncp = require('ncp').ncp
const beautify = require('js-beautify').js_beautify
const chalk = require('chalk');
const tempDir = '/../../temp/'
const recReadSync = require('recursive-readdir-sync');
const mkdirp = require('mkdirp');
const app = require('commander');
const ON_DEATH = require('death');
const { version, description } = require('../package.json');


const constant = {
    END: -1,
    PLUS: 0, // +
    MINUS: 1, // -
    TIMES: 2, // *
    DIVIDE: 3, // /
    MOD: 4,
    LESS: 5, // <
    GREATER: 6, // >
    ASSIGN: 7,
    SCOLON: 8, // ;
    LPAREN: 9, // (
    RPAREN: 10, // )
    LBRACE: 11, // {
    RBRACE: 12, // }
    IS: 13, // ==
    IF: 14,
    ELSE: 15,

    TRUE: 16,
    FALSE: 17,
    AND: 18, // &&
    OR: 19, // ||
    NOT: 20, // !

    FUNCTION: 21,
    VAR: 22,
    WORD: 23,
    NUM: 24,
    QUOTE: 25, // String

    PRINT: 26,
    WHILE: 27,
    FOR: 28,
    INPUT: 29,
    ASSIGNMENT: 30,
    PFIX: 31,
    ARITHMATIC: 32,
    VARNAME: 33,
    DOT: 34,
    COMMA: 35,
    COLON: 36,
    NEW: 39,
    THIS: 40,
    RETURN: 41,
    UNKNOWN: 42,
    CLASS: 43,
    CONSTRUCT: 44,
    EXTENDS: 45,
    COMMENT: 46,
    GTOQ: 47,
    LTOQ: 48,
    ARROW: 49,
    NEWLINE: 50,
    NUMBER: 51,
    STRING: 52,
    DO: 53,
    EQUAL: 54,
    BREAK: 55,
    CONTINUE: 56,
    AWAIT: 57,
    YN: 58,
    CONMONGO: 59,
    CRAPP: 60,
    CRSERVER: 61,
    GET: 62,
    POST: 63,
    SCHEMA: 64,
    MODEL: 65,
    MODULES: 66,
    MATH: 67,
    SMTP: 68,
    MYSQL: 69,
    CANVAS: 70,
    CHEERIO: 71,
    CORS: 72,
    SSL: 73,
    CONCAT: 74,
    PROCESSENV: 75,
    PROCESSCWD: 76,
    IMPORT: 77,
    FROM_WORD: 78,
    MEDIAN: 79

}

const symbol = {
    END: -1,
    PLUS: '+',
    MINUS: '-',
    TIMES: '*',
    DIVIDE: '/',
    MOD: '%',
    LESS: '<',
    GREATER: '>',
    ASSIGN: '=',
    SCOLON: ';',
    LPAREN: '(',
    RPAREN: ')',
    LBRACE: '{',
    RBRACE: '}',
    COMMENT: '//',
    EQUAL: '==',
    IS: '===',
    AND: '&&',
    OR: '||',
    NOT: '!='
}

const keyword = {
    IF: 'if',
    ELSE: 'else',

    TRUE: 'true',
    FALSE: 'false',

    FUNCTION: 'function',
    NEW: 'new',
    RETURN: 'return',
    THIS: 'this',
    VAR: 'var',
    WORD: 'variable',
    NUM: 'number',

    PRINT: 'console.log',
    WHILE: 'while',
    FOR: 'for',
    AWAIT: 'await',
    CLASS: 'class',
    EXTENDS: 'extends',
    CONSTRUCT: 'constructor',
    INPUT: 'readlineSync.question',
    YN: 'readlineSync.keyInYN',
    NUMBER: 'Number',
    STRING: 'String',
    DO: 'do',

    BREAK: 'break',
    CONTINUE: 'continue',
    CONMONGO: 'mongoose.connect',
    CRAPP: 'express',
    CRSERVER: 'express.Router',
    GET: 'GET',
    POST: 'axios.post',
    SCHEMA: 'mongoose.schema',
    MODEL: 'mongoose.model',
    MODULES: 'module.exports',
    MATH: 'math',
    SMTP: 'smtp',
    MYSQL: 'mysql',
    CANVAS: 'canvas',
    CHEERIO: 'cheerio',
    CORS: 'cors',
    SSL: 'ssl',
    CONCAT: 'concat',
    PROCESSENV: 'process.env',
    PROCESSCWD: 'process.cwd',
    IMPORT: 'const',
    FROM_WORD: '=',
    MEDIAN: 'median'

}

const handler = ['repeat', 'every']

const union = types => {
    const result = {}
    for (let type of types) {
        result[type] = data => ({
            match: fns => fns[type](data),
        })
    }
    return result
}


exports.info = (parent, text, ...args) => {
    if (global.verbose) {
        console.info(
            `${chalk.green.bold('info')}: [${chalk.magenta(
                parent
            )}] ${chalk.blue(text)}`,
            ...args
        )
    }
}

exports.logExec = (...args) => {
    if (global.verbose) {
        console.info(`${chalk.yellow.bold('EXEC')}:`, chalk.green(...args))
    }
}

class Tokenizer {
    constructor() {
        this.error
        this.tokens = []
    }

    add(type, value, line) {
        this.tokens.push({ type, value, line })
    }

    tokenize(code, callback) {

        let index = 0
        let lineNumber = 1

        while (index < code.length) {
            if (this.error) break

            const currentChar = code[index]
            const lastKey = this.tokens[this.tokens.length - 1]

            let lastTokenIsKeyword = false

            if (lastKey != undefined) {
                if (
                    Object.keys(keyword).includes(
                        this.tokens[this.tokens.length - 1].value.toUpperCase()
                    )
                ) {
                    lastTokenIsKeyword = true
                }
            }

            if (currentChar == '\n') {
                this.add(constant.NEWLINE, currentChar, lineNumber)

                lineNumber++
            } else if (
                currentChar == ' ' ||
                currentChar == String.fromCharCode(13)
            );
            else if (!currentChar.isEmpty() && !isNaN(currentChar)) {

                let number = ''
                while (!isNaN(code[index])) {
                    number += code[index++]
                }
                index--
                this.add(constant.NUM, number, lineNumber)
            } else if (currentChar.isAlphaNumeric() || currentChar == '_') {

                let word = ''

                while (
                    index < code.length &&
                    (code[index].isAlphaNumeric() ||
                        code[index] == '' ||
                        code[index] == '_')
                ) {
                    word += code[index++]
                }
                index--

                if (handler.includes(word) && !lastTokenIsKeyword) {
                    let key = word

                    while (code[index] != ')' && index < code.length) {
                        key += code[++index]
                    }

                    this.add(word.toUpperCase(), key, lineNumber)
                } else if (word == 'pkg' && !lastTokenIsKeyword) {
                    let expression = word

                    while (
                        !(code[index] == ';' || code[index] == '\n') &&
                        index < code.length
                    ) {
                        expression += code[++index]
                    }

                    this.add(word.toUpperCase(), expression, lineNumber)
                } else if (word == 'is' || word == '===') {
                    this.add(constant.IS, symbol.IS, lineNumber)
                } else if (word == 'var')
                    this.add(constant.VAR, keyword.VAR, lineNumber)
                else if (word == 'inp')
                    this.add(constant.INPUT, keyword.INPUT, lineNumber)
                else if (word == 'yesno')
                    this.add(constant.YN, keyword.YN, lineNumber)
                else if (word == 'func')
                    this.add(constant.FUNCTION, keyword.FUNCTION, lineNumber)
                else if (word == 'conc')
                    this.add(constant.CONCAT, keyword.CONCAT, lineNumber)
                else if (word == 'Env')
                    this.add(constant.PROCESSENV, keyword.PROCESSENV, lineNumber)
                else if (word == 'Cwd')
                    this.add(constant.PROCESSCWD, keyword.PROCESSCWD, lineNumber)
                else if (word == 'class')
                    this.add(constant.CLASS, keyword.CLASS, lineNumber)
                else if (word == 'construct' || word == 'struct')
                    this.add(constant.CONSTRUCT, keyword.CONSTRUCT, lineNumber)
                else if (word == 'import')
                    this.add(constant.IMPORT, keyword.IMPORT, lineNumber)
                else if (word == 'from')
                    this.add(constant.FROM_WORD, keyword.FROM_WORD, lineNumber)
                else if (word == 'extends')
                    this.add(constant.EXTENDS, keyword.EXTENDS, lineNumber)
                else if (word == 'new')
                    this.add(constant.NEW, keyword.NEW, lineNumber)
                else if (word == 'this')
                    this.add(constant.THIS, keyword.THIS, lineNumber)
                else if (word == 'return')
                    this.add(constant.RETURN, keyword.RETURN, lineNumber)
                else if (word == 'numb')
                    this.add(constant.NUMBER, keyword.NUMBER, lineNumber)
                else if (word == 'string')
                    this.add(constant.STRING, keyword.STRING, lineNumber)
                else if (word == 'if')
                    this.add(constant.IF, keyword.IF, lineNumber)
                else if (word == 'else')
                    this.add(constant.ELSE, keyword.ELSE, lineNumber)
                else if (word == 'do')
                    this.add(constant.DO, keyword.DO, lineNumber)
                else if (word == 'while')
                    this.add(constant.WHILE, keyword.WHILE, lineNumber)
                else if (word == 'for')
                    this.add(constant.FOR, keyword.FOR, lineNumber)
                else if (word == 'await')
                    this.add(constant.AWAIT, keyword.AWAIT, lineNumber)
                else if (word == 'not' || word == '!=')
                    this.add(constant.NOT, symbol.NOT, lineNumber)
                else if (word == '&&' || word == 'and')
                    this.add(constant.AND, symbol.AND, lineNumber)
                else if (word == '||' || word == 'or')
                    this.add(constant.OR, symbol.OR, lineNumber)
                else if (word == 'console' || word == 'write')
                    this.add(constant.PRINT, keyword.PRINT, lineNumber)
                else if (word == 'exportsfile')
                    this.add(constant.MODULES, keyword.MODULES, lineNumber)
                else if (word == 'true' || word == 'valid')
                    this.add(constant.TRUE, keyword.TRUE, lineNumber)
                else if (word == 'false' || word == 'wrong')
                    this.add(constant.FALSE, keyword.FALSE, lineNumber)
                else if (word == '+' || word == 'plus')
                    this.add(constant.PLUS, symbol.PLUS, lineNumber)
                else if (word == '-' || word == 'minus')
                    this.add(constant.MINUS, symbol.MINUS, lineNumber)
                else if (word == '*')
                    this.add(constant.TIMES, symbol.TIMES, lineNumber)
                else if (word == '/' || word == 'divide')
                    this.add(constant.DIVIDE, symbol.DIVIDE, lineNumber)
                else if (word == '%' || word == 'percent')
                    this.add(constant.MOD, symbol.MOD, lineNumber)
                else if (word == '<' || word == 'less')
                    this.add(constant.LESS, symbol.LESS, lineNumber)
                else if (word == '>' || word == 'greater')
                    this.add(constant.GREATER, symbol.GREATER, lineNumber)
                else if (word == '==' || word == 'equal')
                    this.add(constant.EQUAL, symbol.EQUAL, lineNumber)
                else if (word == 'break')
                    this.add(constant.BREAK, keyword.BREAK, lineNumber)
                else if (word == 'continue')
                    this.add(constant.CONTINUE, keyword.CONTINUE, lineNumber)
                    else if (word == 'connectMongoDB')
                    this.add(constant.CONMONGO, keyword.CONMONGO, lineNumber)
                    else if (word == 'createApp')
                    this.add(constant.CRAPP, keyword.CRAPP, lineNumber)
                    else if (word == 'createRouter')
                    this.add(constant.CRSERVER, keyword.CRSERVER, lineNumber)
                    else if (word == 'GET')
                    this.add(constant.GET, keyword.GET, lineNumber)
                    else if (word == 'POST')
                    this.add(constant.POST, keyword.POST, lineNumber)
                    else if (word == 'schemaMongoDB')
                    this.add(constant.SCHEMA, keyword.SCHEMA, lineNumber)
                    else if (word == 'modelMongoDB')
                    this.add(constant.MODEL, keyword.MODEL, lineNumber)
                    else if (word == 'math')
                    this.add(constant.MATH, keyword.MATH, lineNumber)
                    else if (word == 'smtp')
                    this.add(constant.SMTP, keyword.SMTP, lineNumber)
                    else if (word == 'mysql')
                    this.add(constant.MYSQL, keyword.MYSQL, lineNumber)
                    else if (word == 'canvas')
                    this.add(constant.CANVAS, keyword.CANVAS, lineNumber)
                    else if (word == 'cheerio')
                    this.add(constant.CHEERIO, keyword.CHEERIO, lineNumber)
                    else if (word == 'cors')
                    this.add(constant.CORS, keyword.CORS, lineNumber)
                    else if (word == 'ssl')
                    this.add(constant.SSL, keyword.SSL, lineNumber)
                    else if (word == 'median')
                    this.add(constant.MEDIAN, keyword.MEDIAN, lineNumber)
                else this.add(constant.VARNAME, word, lineNumber)
            } else if (currentChar == '/' && code[index + 1] == '/') {

                let comment = ''

                while (code[index] != '\n' && index < code.length) {
                    comment += code[index++]
                }

                this.add(constant.COMMENT, `\n${comment}\n`, lineNumber)
            } else if (currentChar == '/' && code[index + 1] == '*') {

                let comment = ''

                while (
                    !(code[index] === '*' && code[index + 1] === '/') &&
                    index < code.length
                ) {
                    comment += code[index++]
                }
                index++
                this.add(constant.COMMENT, `\n${comment}*/\n`, lineNumber)
            } else if (currentChar == '+' || currentChar == '-') {

                let expression = currentChar
                if (currentChar == code[index + 1]) {
                    expression += code[index + 1]

                    this.add(constant.PFIX, expression, lineNumber)

                    index++
                } else if (code[index + 1] == '=') {
                    expression += code[index + 1]

                    this.add(constant.ASSIGNMENT, expression, lineNumber)
                } else {
                    this.add(
                        expression == '+' ? constant.PLUS : constant.MINUS,
                        expression,
                        lineNumber
                    )
                }
            } else if ('*/%'.includes(currentChar)) {
                let assignment = currentChar

                if (code[index + 1] == '=') {
                    assignment += code[index + 1]

                    this.add(constant.ASSIGNMENT, assignment, lineNumber)

                    index++
                } else {
                    this.add(constant.ARITHMATIC, currentChar, lineNumber)
                }
            } else if (currentChar == '<' || currentChar == '>') {
                if (code[index + 1] == '=') {
                    this.add(
                        currentChar == '>' ? constant.GTOQ : constant.LTOQ,
                        currentChar + '=',
                        lineNumber
                    )
                    index++
                } else if (currentChar == '<')
                    this.add(constant.LESS, currentChar, lineNumber)
                else this.add(constant.GREATER, currentChar, lineNumber)
            } else if (currentChar == '=') {
                if ('-+*/%'.includes(code[index - 1])) {
                    index++
                } else if (code[index + 1] == '>') {
                    this.add(
                        constant.ARROW,
                        currentChar + code[index + 1],
                        lineNumber
                    )
                    index++
                } else if (code[index + 1] == '=') {
                    this.add(constant.IS, symbol.IS, lineNumber)
                    index++
                } else {
                    this.add(constant.ASSIGN, currentChar, lineNumber)
                }
            } else if (
                ['|', '&'].includes(currentChar) &&
                code[index + 1] === currentChar
            ) {
                const type = currentChar === '|' ? 'OR' : 'AND'

                this.add(constant[type], symbol[type], lineNumber)

                index++
            } else if (currentChar == '.')
                this.add(constant.DOT, currentChar, lineNumber)
            else if (currentChar == ',')
                this.add(constant.COMMA, currentChar, lineNumber)
            else if (currentChar == ':')
                this.add(constant.COLON, currentChar, lineNumber)
            else if (currentChar == ';')
                this.add(constant.SCOLON, currentChar, lineNumber)
            else if (currentChar == '(')
                this.add(constant.LPAREN, currentChar, lineNumber)
            else if (currentChar == ')')
                this.add(constant.RPAREN, currentChar, lineNumber)
            else if (currentChar == '{')
                this.add(constant.LBRACE, currentChar, lineNumber)
            else if (currentChar == '}')
                this.add(constant.RBRACE, currentChar, lineNumber)
            else if (`'"\``.includes(currentChar)) {

                index++
                let quote = ''

                while (code[index] != currentChar) {
                    quote += code[index++]

                    if (index >= code.length) {
                        this.throwError(
                            lineNumber,
                            'unresolved quotes'
                        )
                        break
                    }
                }

                this.add(
                    constant.QUOTE,
                    `${currentChar}${quote}${currentChar}`,
                    lineNumber
                )
            } else this.add(constant.UNKNOWN, currentChar, lineNumber)

            index++

            if (index == code.length && !this.error) {

                return callback(this.tokens, null)
            }
        }

        return callback('', this.error)
    }
    throwError(line, mess) {
        this.info('Tokenizer.error', 'error:', `${line}):${mess}`)
        this.error = new Error(`Error: (${line}):\n${mess}`)
    }
}

exports.lex = (filepath, callback) => {

    const code = beautify(fs.readFileSync(filepath, 'utf8'), {
        end_with_newline: true
    })

    this.lexString(code, callback)
}

exports.lexString = (code, callback) => {
    new Tokenizer().tokenize(code, callback)
}

String.prototype.isEmpty = function() {
    return this.length === 0 || !this.trim()
}

String.prototype.isAlphaNumeric = function() {
    let code, index, length

    for (index = 0, length = this.length; index < length; index++) {
        code = this.charCodeAt(index)

        if (!(code > 64 && code < 91) && !(code > 96 && code < 123)) {
            return false
        }
    }

    return true
}

exports.parse = (tokens, callback) => {

    const token_handler = {
        REPEAT: repeat_handler,
        EVERY: every_handler,
        PKG: pkg_handler,
        [constant.MEDIAN]: median_handler,
        [constant.INPUT]: input_handler,
        [constant.YN]: yesno_handler,
        [constant.CONMONGO]: conmongo_handler,
        [constant.CRAPP]: crapp_handler,
        [constant.CRSERVER]: crserver_handler,
        [constant.GET]: get_handler,
        [constant.POST]: post_handler,
        [constant.SCHEMA]: schema_handler,
        [constant.MODEL]: model_handler,
        [constant.MATH]: math_handler,
        [constant.SMTP]: smtp_handler,
        [constant.MYSQL]: mysql_handler,
        [constant.CANVAS]: canvas_handler,
        [constant.CHEERIO]: cheerio_handler,
        [constant.CORS]: cors_handler,
        [constant.SSL]: ssl_handler
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

    this.info('parse', 'transforming:', chalk.bold.gray(transformTrace.join(',')))

    if (Object.keys(additions).length <= 0) return callback(transformed)

    let additionsString = ''

    for (let key in additions) additionsString += additions[key] + '\n'

    this.info('parse', 'remove all additions')
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

const CONMONGO = `const mongoose = require("${require.resolve(
    'mongoose'
).replace(/\\/g, "\\\\")}");`

const CRAPP = `const express = require("${require.resolve(
    'express'
).replace(/\\/g, "\\\\")}");`

const CRSERVER = `const express = require("${require.resolve(
    'express'
).replace(/\\/g, "\\\\")}");`

const GET =
`
function GET(url) {
    axios.get(url)
}
`
const POST = `const axios = require("axios");`

const SCHEMA = `const mongoose = require("${require.resolve(
    'mongoose'
).replace(/\\/g, "\\\\")}");`

const MODEL = `const mongoose = require("${require.resolve(
    'mongoose'
).replace(/\\/g, "\\\\")}");`

const MATH = `const math = require("${require.resolve(
    'mathjs'
).replace(/\\/g, "\\\\")}");`

const SMTP = `const { smtp } = require("${require.resolve(
    'smtp-client'
).replace(/\\/g, "\\\\")}");`

const MYSQL = `const mysql = require("${require.resolve(
    'mysql2'
).replace(/\\/g, "\\\\")}");`

const CANVAS = `const { createCanvas, loadImage } = require("${require.resolve(
    'canvas'
).replace(/\\/g, "\\\\")}");`

const CHEERIO = `const cheerio = require("${require.resolve(
    'cheerio'
).replace(/\\/g, "\\\\")}");`

const CORS = `const cors = require("${require.resolve(
    'cors'
).replace(/\\/g, "\\\\")}");`

const SSL = `const ssl = require("${require.resolve(
    'ssl-express-www'
).replace(/\\/g, "\\\\")}");`

const MEDIAN = 
`
Array.prototype.median = function () {
  return this.slice().sort((a, b) => a - b)[Math.floor(this.length / 2)]; 
};

`

function repeat_handler(token) {
    let valArr = js_beautify(token.value).split(' ')

    this.info('repeat_handler', 'array value:', valArr)
    this.info('repeat_handler', 'array length:', valArr.length)

    if (valArr.length < 5) {
        triggerError("Syntax 'repeat' error", token.line)
        process.exit()
    }

    const intvar = valArr[1]

    this.info('repeat_handler', 'variable interation:', intvar)

    var parsedJS = `for(var ${intvar} = 0; ${intvar} < ${
        valArr[3]
    }; ${intvar}++)`

    return parsedJS
}

function every_handler(token) {
    const parsed = js_beautify(token.value, {
        indent_level: 4
    }).trim().split(' ')

    this.info('every_handler', 'parsed:', parsed)

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

function conmongo_handler(token) {

    additions.conmongo = CONMONGO

    return token.value
}

function crapp_handler(token) {
 
    additions.crapp = CRAPP

    return token.value
}

function crserver_handler(token) {

    additions.crserver = CRSERVER

    return token.value
}

function post_handler(token) {

    additions.post = POST

    return token.value
}

function schema_handler(token) {

    additions.schema = SCHEMA

    return token.value
}

function get_handler(token) {

    additions.get = GET

    return token.value
}

function model_handler(token) {

    additions.model = MODEL

    return token.value
}

function math_handler(token) {

    additions.math = MATH

    return token.value
}

function smtp_handler(token) {

    additions.smtp = SMTP

    return token.value
}

function mysql_handler(token) {

    additions.mysql = MYSQL

    return token.value
}

function canvas_handler(token) {

    additions.canvas = CANVAS

    return token.value
}

function cheerio_handler(token) {

    additions.cheerio = CHEERIO

    return token.value
}

function cors_handler(token) {

    additions.cors = CORS

    return token.value
}

function ssl_handler(token) {

    additions.ssl = SSL

    return token.value
}

function median_handler(token) {

    additions.median = MEDIAN

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

String.prototype.reverse_import = function() {
    return this.split('')
        .reverse()
}

String.prototype.replaceLast = function(what, replacement) {
    return this.reverse()
        .replace(new RegExp(what.reverse()), replacement.reverse())
        .reverse()
}

String.prototype.replaceLast_import = function(what, replacement) {
    return this.reverse_import()
        .replace(new RegExp(what.reverse_import()), replacement.reverse_import())
        .reverse()
}



exports.compile = (filepath, callback) => {
    this.lex(filepath, token => {
        this.parse(token, compiled => {
            callback(beautify(compiled), {
                end_with_newline: true
            })
        })
    })
}

async function runSc(filepath) {
    var realPath = this.getRealPath(filepath)
    var original = fs.readFileSync(realPath, 'utf8')

    this.info('runDirectory', 'real path:', chalk.bold.gray(realPath))

    this.compile(realPath, result => {
        this.runLocal(result, original)
    })
}

exports.runDirectory = (filepath, callback) => {

    this.lex(filepath, token => {
        this.parse(token, compiled => {
            callback(beautify(compiled))
                end_with_newline: true
                this.runFile(compiled)
        })
    })
}

exports.compiles = filepath => {
    return new Promise((resolve, reject) => {
        this.lexString(filepath, (token, error) => {
            if (error) return reject(error)

            this.parse(token, compiled => {
                resolve(beautify(compiled))
            })
        })
    })
}

exports.token = (filepath, callback) => {

    this.lex(filepath, token => {
        callback(token)
    })
}

exports.clean = callback => {

    this.checkTempDir()

    const tempPath = path.join(__dirname, tempDir)
    const files = fs.readdirSync(tempPath)

    this.info('clean', 'temp path:', chalk.bold.gray(tempPath))
    this.info('clean', 'files length:', chalk.bold.gray(files.length))

    if (files.length <= 0) {
        return callback instanceof Function
            ? callback('No file on temp directory')
            : null
    }

    for (let file of files) {
        const fileLocation = path.join(tempPath, file)
        this.info('clean', 'delete file:', chalk.bold.gray(file))
        if (fs.existsSync(fileLocation)) fs.unlinkSync(fileLocation)
    }

    return callback instanceof Function ? callback('All file cleaned') : null
}

exports.run = (script, callback) => {
    this.checkTempDir()
    const tempFile = path.join(__dirname, tempDir, generateRandomName())
    this.info('run', 'temp file:', tempFile)
    fs.writeFileSync(tempFile, script)

    runScript(tempFile, async () => {
        await this.clean()
        await callback()
    })
}

exports.runLocal = (compiled, original) => {

    const compiledPath = this.getCompiledPath()

    this.info('runLocal', 'compiled path:', chalk.bold.gray(compiledPath))

    fs.writeFileSync(compiledPath, compiled)

    runScript(compiledPath, () => this.recover(compiledPath, original))
}

exports.runFile = filepath => {

    const realPath = this.getRealPath(filepath)
    const original = fs.readFileSync(realPath, 'utf8')

    this.info('runFile', 'real path:', chalk.bold.gray(realPath))

    this.compile(realPath, result => {
        this.runLocal(result, original)
    })
}

exports.runDir = filepath => {

    const realPath = this.getRealPath(filepath)
    const original = fs.readFileSync(realPath, 'utf8')

    this.info('runDir', 'real path:', chalk.bold.gray(realPath))

    this.compile(realPath, result => {
        this.runLocal(result, original)
    })
}

exports.getRealPath = filePath => {

    if (fs.existsSync(filePath)) {
        global.userFilePath = filePath
    } else if (fs.existsSync(path.resolve(process.cwd(), filePath))) {
        global.userFilePath = path.resolve(process.cwd(), filePath)
    } else {
        this.info('getRealPath', 'Invalid file specified')
        process.exit()
    }

    return global.userFilePath
}

exports.getCompiledPath = () => {

    return this.renameToJs(global.userFilePath)
}

exports.renameToJs = filePath => {

    return filePath.replace(/\.[^\.]+$/, '.js')
}

exports.renameToJsx = filePath => {

    return filePath.replace(/\.[^\.]+$/, '.jsx')
}

exports.recover = (compiledPath, original) => {

    if (compiledPath === global.userFilePath) {
        this.info('recover', 'compiled path is user file path')

        return fs.writeFileSync(global.userFilePath, original)
    } else if (fs.existsSync(compiledPath)) {
        this.info('recover', 'compiled path have different name')

        return fs.unlinkSync(compiledPath)
    }

    this.info('recover', 'compiled path does not exist')
}

exports.copyExample = (out, callback) => {

    const exampleFolder = path.join(__dirname, '../compiler')
    ncp(exampleFolder, out, callback)
}


function runScript(scriptPath, callback) {

    let invoked = false
    let process = childProcess.fork(scriptPath)

    process.on('exit', code => {
        if (invoked) return

        invoked = true

        let err = code == 0 ? null : new Error('exit code ' + code)

        callback(err)
    })
}

function generateRandomName(length = 10) {

    let text = ''
    let possible =
        'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890'

    for (let i = 0; i < length; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length))

    this.info('generateRandomName', 'result:', chalk.bold.gray(text))

    return text
}

exports.checkTempDir = () => {

    if (!fs.existsSync(path.join(__dirname, tempDir))) {
        fs.mkdirSync(path.join(__dirname, tempDir))
    }
}

exports.createDir = pathname => {
   const __dirname = path.resolve();
   pathname = pathname.replace(/^\.*\/|\/?[^\/]+\.[a-z]+|\/$/g, '');
   fs.mkdir(path.resolve(__dirname, pathname), { recursive: true }, e => {
       if (e) {
           console.error(e);
       } else {
           console.log('Success');
       }
    });
}

function getext(filepath) {
    return filepath.split("?")[0].split('#')[0].split('.').pop()
}

dsjson = {
  "compilerOptions": {
  "modules": ""
  }
}

var hello_ds = 
`// DreamScript Code
// Build your WebApp


const app = createApp();

app.get('/', function (req, res) {
  res.send('Build WebApp with DreamScript')
})

app.listen(8080)
`


if (
    process.argv[2] &&
    fs.existsSync(path.resolve(process.cwd(), process.argv[2]))
) {
    this.runFile(process.argv[2])
}

function checkOption() {
    if (app.verbose) global.verbose = true
}

async function runCompile(__code) {
    this.run(__code, (err) => {
        if (!err) {
            console.log('Success Running')
        }
    })
}

app.version(version).description(description)

app.option('--verbose', 'debug logging')

app.command('h')
    .alias('help')
    .description('Display Help')
    .action(() => app.help())

app.command('r <file>')
    .alias('run')
    .description("Run DreamScript File, 'ds' is a default command")
    .action(filepath => {
        checkOption()
        this.runFile(filepath + '.ds')
    })

app.command('c <file>')
    .alias('compile')
    .description('Compile and display to console')
    .action(filepath => {
        checkOption()
        this.compile(this.getRealPath(filepath + '.ds'), result => {
            console.log(result)
        })
    })

app.command('rc <file>')
    .alias('runcompile')
    .description("Run and Compile DreamScript File, 'ds' is a default command")
    .action(filepath => {
        checkOption()
        this.compile(this.getRealPath(filepath), result => {
            runCompile(result)
    })
    })


app.command('out <file>')
    .alias('output')
    .description('Compile and save the files')
    .action(filepath => {
        checkOption()
        this.compile(this.getRealPath(filepath + '.ds'), result => {
            fs.writeFile(`${filepath}.js`, result, err => {
                if (!err) {
                    console.log('Success Compile')
                }
            })
        })
    })

app.command('dir <input> <output>')
    .alias('directory')
    .description('Compile directory and save the files')
    .action((input, output) => {
        checkOption()
        const cwd = process.cwd()

        const inputDir = path.resolve(cwd, input)
        const outputDir = path.resolve(cwd, output)

        const isDir = fs.statSync(inputDir).isDirectory()

        if (!isDir) {
            return console.log(
                `input must a ${chalk.bold.red('directory')}`
            )
        }

        if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir)

        for (let fileDir of recReadSync(inputDir)) {
            const fileDirJs = this.renameToJs(fileDir)
            const jsName = path.basename(fileDirJs)

            const jsOutputBase = path
                .normalize(fileDirJs.replace(cwd, '').replace(input, output))
                .slice(1)

            const jsOutput = path.resolve(cwd, jsOutputBase)

            this.compile(fileDir, result => {
                console.log(
                    `${chalk.bold(
                        fileDir.replace(cwd, '').slice(1)
                    )} ${chalk.blue('➜')} ${chalk.bold.gray(jsOutputBase)}`
                )

                mkdirp.sync(path.dirname(jsOutput))

                fs.writeFileSync(jsOutput, result)
            })
        }
    })

app.command('cdirs <input>')
    .alias('directory')
    .description('Compile directory and saves the files')
    .action(input => {
        checkOption()
        const cwd = process.cwd()

        const inputDir = path.resolve(cwd, input)

        const isDir = fs.statSync(inputDir).isDirectory()

        if (!isDir) {
            return console.log(
                `input must a ${chalk.bold.red('directory')}`
            )
        }

        for (let fileDir of recReadSync(inputDir)) {
            const fileDirJs = this.renameToJs(fileDir)
            const jsName = path.basename(fileDirJs)

            const jsOutputBase = path
                .normalize(fileDirJs.replace(cwd, '').replace(input, input))
                .slice(1)

            const jsOutput = path.resolve(cwd, jsOutputBase)

            this.compile(fileDir, result => {
                console.log(
                    `${chalk.bold(
                        fileDir.replace(cwd, '').slice(1)
                    )} ${chalk.blue('➜')} ${chalk.bold.gray(jsOutputBase)}`
                )

                mkdirp.sync(path.dirname(jsOutput))

                fs.writeFileSync(jsOutput, result)
            })
        }
    })

app.command('compile')
.alias('compiledir')
.description('Compile this Directory')
.action(() => {
    checkOption()
    const cwd = process.cwd()

        const inputDir = path.resolve(cwd)

        const isDir = fs.statSync(inputDir).isDirectory()

        if (!isDir) {
            return console.log(
                `input must a ${chalk.bold.red('directory')}`
            )
        }

        for (let fileDir of recReadSync(inputDir)) {
            const fileDirJs = this.renameToJs(fileDir)
            const jsName = path.basename(fileDirJs)

            const jsOutputBase = path
                .normalize(fileDirJs.replace(cwd, '').replace(cwd, cwd))
                .slice(1)

            const jsOutput = path.resolve(cwd, jsOutputBase)

            this.compile(fileDir, result => {
                console.log(
                    `${chalk.bold(
                        fileDir.replace(cwd, '').slice(1)
                    )} ${chalk.blue('➜')} ${chalk.bold.gray(jsOutputBase)}`
                )

                mkdirp.sync(path.dirname(jsOutput))
                fs.writeFileSync(jsOutput, result)
            })
        }

})

app.command('create <output>')
    .alias('cr')
    .description('Create a Webapp with a Dreamscript')
    .action(dirpath => {
        checkOption()
        this.createDir(`${dirpath}`)
        console.log('Folder has been created')
        fs.writeFile(`./${dirpath}/index.ds`, hello_ds, (err) => {
            if (!err) {
                console.log('File has been created');
            }
            })
    })

app.command('t <file>')
    .alias('token')
    .description('Generate token / lex (debug)')
    .action(filepath => {
        checkOption()
        this.token(this.getRealPath(filepath), token => {
            console.log(token)
        })
    })

app.command('clean')
    .alias('cl')
    .description('clean ds temp file')
    .action(() => {
        checkOption()
        this.clean(message => {
            console.log(message)
        })
    })


app.command('i <input>')
    .alias('install')
    .action(package => {
        checkOption()
        childProcess(
            `npm install "${package}"`
            )
    })

app.command('pkg')
    .alias('package')
    .action(() => {
    checkOption()
    childProcess(
        `npm init`
        )
})

app.command('module <input>')
    .alias('mod')
    .action(library => {
        checkOption()
        json = JSON.stringify(dsjson);
        fs.writeFile(`./${library}`, json, (err) => {
            if (!err) {
                console.log('DS Config is success created');
            }
        })
    })

app.command('b <file> <output>')
    .alias('build')
    .description('Compile ds file and run the file')
    .action((filepath, output) => {
        checkOption()
        this.compile(this.getRealPath(filepath), result => {
            fs.writeFileSync(path.join(process.cwd(), output), result)
            this.runFile(output)
        })
    })

app.command('builds <input> <output>')
    .description('Compile directory and run the files')
    .action((input, output) => {
        checkOption()
        const cwd = process.cwd()

        const inputDir = path.resolve(cwd, input)
        const outputDir = path.resolve(cwd, output)

        const isDir = fs.statSync(inputDir).isDirectory()

        if (!isDir) {
            return console.log(
                `input must a ${chalk.bold.red('directory')}`
            )
        }

        if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir)

        for (let fileDir of recReadSync(inputDir)) {
            const fileDirJs = this.renameToJs(fileDir)
            const jsName = path.basename(fileDirJs)

            const jsOutputBase = path
                .normalize(fileDirJs.replace(cwd, '').replace(input, output))
                .slice(1)

            const jsOutput = path.resolve(cwd, jsOutputBase)

            this.compile(fileDir, result => {
                console.log(
                    `${chalk.bold(
                        fileDir.replace(cwd, '').slice(1)
                    )} ${chalk.blue('➜')} ${chalk.bold.gray(jsOutputBase)}`
                )

                mkdirp.sync(path.dirname(jsOutput))
                this.runFile(fileDir)
            })
        }
    })

app.command('rdir <input>')
    .description('Compile directory and run the files')
    .action(input => {
        checkOption()
        const cwd = process.cwd()

        const inputDir = path.resolve(cwd, input)

        const isDir = fs.statSync(inputDir).isDirectory()

        if (!isDir) {
            return console.log(
                `input must a ${chalk.bold.red('directory')}`
            )
        }

        for (let fileDir of recReadSync(inputDir)) {
            const fileDirJs = this.renameToJs(fileDir)
            const jsName = path.basename(fileDirJs)

            const jsOutputBase = path
                .normalize(fileDirJs.replace(cwd, '').replace(input, input))
                .slice(1)

            const jsOutput = path.resolve(cwd, jsOutputBase)

            this.compile(fileDir, result => {
                console.log(
                    `${chalk.bold(
                        fileDir.replace(cwd, '').slice(1)
                    )} ${chalk.blue('➜')} ${chalk.bold.gray(jsOutputBase)}`
                )
                this.runFile(fileDir)
            })
        }
    })

app.command('rdirs')
    .description('Compile directory and run the files')
    .action(() => {
        checkOption()
        const cwd = process.cwd()

        const inputDir = path.resolve(cwd, __dirname)

        const isDir = fs.statSync(inputDir).isDirectory()

        if (!isDir) {
            return console.log(
                `input must a ${chalk.bold.red('directory')}`
            )
        }

        for (let fileDir of recReadSync(inputDir)) {
            const fileDirJs = this.renameToJs(fileDir)
            const jsName = path.basename(fileDirJs)

            const jsOutputBase = path
                .normalize(fileDirJs.replace(cwd, '').replace(__dirname, __dirname)
                .slice(1))

            const jsOutput = path.resolve(cwd, jsOutputBase)

            this.compile(fileDir, result => {
                console.log(
                    `${chalk.bold(
                        fileDir.replace(cwd, '').slice(1)
                    )} ${chalk.blue('➜')} ${chalk.bold.chalk.bold.gray(jsOutputBase)}`
                )
                fs.writeFileSync(fileDir)
            })
        }
    })

app.parse(process.argv)

if (app.args.length < 1) {
    console.log(
        `Dreamscript Version: ${chalk.bold.green(app.version())}, ${chalk.bold.chalk.bold.gray(
            'ds -h'
        )} to help`
    )
}

ON_DEATH(() => {
    console.info('\n\nProcess terminated, recovering...')
    this.recover(
        this.getCompiledPath(),
        fs.readFileSync(global.userFilePath)
    )
})

async function compilee(_code) {
    return new Promise((resolve, reject) => {
        this.lexString(_code, (token, error) => {
            if (error) return reject(error)

            this.parse(token, compiled => {
                resolve(beautify(compiled))
            })
        })
    })
}

async function runn(__code) {
    return new Promise((resolve, reject) => {
        this.lexString(__code, (token, error) => {
            if (error) return reject(error)

            this.parse(token, compiled => {
                this.run(compiled, resolve)
            })
        })
    })
}


async function compileAndSave(filepath, output) {
    this.compile(this.getRealPath(filepath), result => {
        fs.writeFileSync(path.join(process.cwd(), output), result)
})
}


async function compileDirectory(input) {
    const cwd = process.cwd()

    const inputDir = path.resolve(cwd, input)

    const isDir = fs.statSync(inputDir).isDirectory()

    if (!isDir) {
            return console.log(
                `input must a ${chalk.bold.red('directory')}`
            )
        }

        for (let fileDir of recReadSync(inputDir)) {
            const fileDirJs = this.renameToJs(fileDir)
            const jsName = path.basename(fileDirJs)

            const jsOutputBase = path
                .normalize(fileDirJs.replace(cwd, '')).replace(input, input)

            const jsOutput = path.resolve(cwd, jsOutputBase)

            this.compile(fileDir, result => {
                console.log(
                    `${chalk.bold(
                        fileDir.replace(cwd, '').slice(1)
                    )} ${chalk.blue('➜')} ${chalk.bold.chalk.bold.gray(jsOutputBase)}`
                )

                mkdirp.sync(path.dirname(jsOutput))

                fs.writeFileSync(jsOutput, result)
            })
        }
}


async function compileAndRunDirectory(input, output) {
    const cwd = process.cwd()

        const inputDir = path.resolve(cwd, input)
        const outputDir = path.resolve(cwd, output)

        const isDir = fs.statSync(inputDir).isDirectory()

        if (!isDir) {
            return console.log(
                `input must a ${chalk.bold.red('directory')}`
            )
        }

        if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir)

        for (let fileDir of recReadSync(inputDir)) {
            const fileDirJs = this.renameToJs(fileDir)
            const jsName = path.basename(fileDirJs)

            const jsOutputBase = path
                .normalize(fileDirJs.replace(cwd, '')).replace(input, output)

            const jsOutput = path.resolve(cwd, jsOutputBase)

            this.compile(fileDir, result => {
                console.log(
                    `${chalk.bold(
                        fileDir.replace(cwd, '').slice(1)
                    )} ${chalk.blue('➜')} ${chalk.bold.chalk.bold.gray(jsOutputBase)}`
                )

                mkdirp.sync(path.dirname(jsOutput))
                fs.writeFileSync(jsOutput, result)
            })
        }
}

async function compileAndRun(filepath) {
    this.compile(this.getRealPath(filepath), result => {
        runCompile(result)
})
}

async function testCompile(filepath) {
    this.runDirectory(this.getRealPath(filepath), err => {
        if (!err) {
            console.log('Success')
        }
})
}

async function getPath(filepath) {
    this.getRealPath(filepath)
}

async function pekeg(file) {
    fs.readFileSync(__dirname + file)
    .then(res => run(res))
}

async function localrun(compiled, original) {
    this.runLocal(compiled, original)
}

module.exports = {
compilee,
runn,
compileAndSave,
compileDirectory,
compileAndRun,
testCompile,
getPath,
pekeg,
localrun,
compileAndRunDirectory
}