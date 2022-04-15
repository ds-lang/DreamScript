// Syntax of DreamScript
// DreamScript Programming Language Projects

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
    IF: 14, // If
    ELSE: 15, // Else

    TRUE: 16, // True
    FALSE: 17, // False
    AND: 18, // &&
    OR: 19, // ||
    NOT: 20, // !

    FUNCTION: 21, // Function
    VAR: 22, // Variabel
    WORD: 23, // Word of Tokens
    NUM: 24, // Number
    QUOTE: 25, // String

    PRINT: 26, // Console.log
    WHILE: 27, // While
    FOR: 28, // For
    INPUT: 29, // Input/Prompt
    ASSIGNMENT: 30,
    PFIX: 31,
    ARITHMATIC: 32, // Arithmatic Function
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
    MODULES: 59,
    MATH: 60,
    CONCAT: 61,
    PROCESSENV: 62,
    PROCESSCWD: 63,
    MEDIAN: 64 // .median() Function

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
    GET: 'GET',
    MODULES: 'module.exports',
    MATH: 'math',
    CONCAT: 'concat',
    PROCESSENV: 'process.env',
    PROCESSCWD: 'process.cwd',
    MEDIAN: 'median'

}

const handler = ['repeat', 'every', 'import']

module.exports = {
    constant,
    symbol,
    handler,
    keyword
}
