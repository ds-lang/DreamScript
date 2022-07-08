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

    TRUE: 14, // True
    FALSE: 15, // False
    AND: 16, // &&
    OR: 17, // ||
    NOT: 18, // !

    VAR: 20, // Variable
    WORD: 21, // Word of Tokens
    NUM: 22, // Number
    QUOTE: 23, // String

    WHILE: 25, // While
    FOR: 26, // For
    INPUT: 27, // Input/Prompt
    ASSIGNMENT: 28,
    PFIX: 29,
    ARITHMATIC: 30, // Arithmatic Function
    VARNAME: 31,
    DOT: 32,
    COMMA: 32,
    COLON: 33,
    NEW: 34,
    THIS: 35,
    RETURN: 36,
    UNKNOWN: 37,
    CLASS: 38,
    CONSTRUCT: 39,
    EXTENDS: 40,
    COMMENT: 41,
    GTOQ: 42,
    LTOQ: 43,
    ARROW: 44,
    NEWLINE: 45,
    NUMBER: 46,
    STRING: 47,
    DO: 48,
    EQUAL: 49,
    BREAK: 50,
    CONTINUE: 51,
    AWAIT: 52,
    YN: 53,
    MODULES: 54,
    MATH: 55,
    CONCAT: 56,
    PROCESSENV: 57,
    PROCESSCWD: 59,
    MEDIAN: 60, // .median() Function
    START: 61,
    FUNC: 62

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
    TRUE: 'true',
    FALSE: 'false',

    NEW: 'new',
    RETURN: 'return',
    THIS: 'this',
    VAR: 'var',
    WORD: 'variable',
    NUM: 'number',

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
    MODULES: 'module.exports',
    MEDIAN: 'median',
    START: `const { checkTypes, checkFuncTypes, defineType, defineTypeAll, Data, Enum, Implements } = require('ds-langs/build/types.js')`
}

const handler = [
'require',
'repeat',
'every',
'interface',
'enum',
'readonly',
'val',
'func',
'getInterface',
'summon',
'write',
'writeError',
'writeAssert',
'writeClear',
'writeCount',
'writeCountReset',
'writeDebug',
'writeDir',
'writeDirXml',
'writeGroup',
'writeGroupcollapsed',
'writeGroupEnd',
'writeInfo',
'writeTable',
'writeProfile',
'writeProfileEnd',
'writeTime',
'writeTimeEnd',
'writeTimeLog',
'writeTimeStamp',
'writeTrace',
'writeWarn',
'ret',
'struct',
'exportsfile',
'notsame',
'not',
'is',
'less',
'greater',
'equal',
'define',
'tuple',
'set',
'setArray'
]

module.exports = {
    constant,
    symbol,
    handler,
    keyword
}
