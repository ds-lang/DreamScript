// The Tokenizer Files
// DreamScript Programming Language Projects

const fs = require('fs')
const beautify = require('js-beautify').js_beautify
const { constant, symbol, handler, keyword } = require('./ds_syntax')
const ds_handler = require('./ds_handler')

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
                }  else if (word == 'inp')
                    this.add(constant.INPUT, keyword.INPUT, lineNumber)
                else if (word == 'yesno')
                    this.add(constant.YN, keyword.YN, lineNumber)
                else if (word == 'Env')
                    this.add(constant.PROCESSENV, keyword.PROCESSENV, lineNumber)
                else if (word == 'Cwd')
                    this.add(constant.PROCESSCWD, keyword.PROCESSCWD, lineNumber)
                else if (word == 'class')
                    this.add(constant.CLASS, keyword.CLASS, lineNumber)
                else if (word == 'struct')
                    this.add(constant.CONSTRUCT, keyword.CONSTRUCT, lineNumber)
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
                else if (word == 'do')
                    this.add(constant.DO, keyword.DO, lineNumber)
                else if (word == 'while')
                    this.add(constant.WHILE, keyword.WHILE, lineNumber)
                else if (word == 'for')
                    this.add(constant.FOR, keyword.FOR, lineNumber)
                else if (word == 'await')
                    this.add(constant.AWAIT, keyword.AWAIT, lineNumber)
                else if (word == '&&' || word == 'and')
                    this.add(constant.AND, symbol.AND, lineNumber)
                else if (word == '||' || word == 'or')
                    this.add(constant.OR, symbol.OR, lineNumber)
                else if (word == 'true' || word == 'valid')
                    this.add(constant.TRUE, keyword.TRUE, lineNumber)
                else if (word == 'false' || word == 'wrong')
                    this.add(constant.FALSE, keyword.FALSE, lineNumber)
                else if (word == '+' || word == 'plus')
                    this.add(constant.PLUS, symbol.PLUS, lineNumber)
                else if (word == '-' || word == 'minus')
                    this.add(constant.MINUS, symbol.MINUS, lineNumber)
                else if (word == '*' || word == 'multy')
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
                    else if (word == 'median')
                    this.add(constant.MEDIAN, keyword.MEDIAN, lineNumber)
                    else if (word == 'math')
                    this.add(constant.MATH, keyword.MATH, lineNumber)
                    else if (word == 'superset')
                    this.add(constant.SUPERSET, keyword.SUPERSET, lineNumber)
                    else if (word == 'func')
                    this.add(constant.FUNC, keyword.FUNC, lineNumber)
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
