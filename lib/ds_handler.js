// The Handler
// DreamScript Programming Language Projects

const { js_beautify } = require('js-beautify')
const { constant } = require('./ds_syntax')
const ds_exports = require('./ds_exports')
const { Enum, Data, Implements } = require('../type/typing')
const ds_function = require('./ds_function')
const chalk = require('chalk')

exports.parse = (tokens, callback) => {

    const token_handler = {
        REPEAT: repeat_handler,
        EVERY: every_handler,
        PKG: pkg_handler,
        INTERFACE: interface_handler,
        ENUM: enum_handler,
        READONLY: readonly_handler,
        VAL: val_handler,
        FUNC: func_handler,
        GETINTERFACE: getinterface_handler,
        SUMMON: summon_handler,
        WRITELOG: writelog_handler,
        WRITEERROR: writerr_handler,
        WRITEASSERT: writeassert_handler,
        WRITECLEAR: writeclear_handler,
        WRITECOUNT: writecount_handler,
        WRITECOUNTRESET: writecountreset_handler,
        WRITEDEBUG: writedebug_handler,
        WRITEDIR: writedir_handler,
        WRITEDIRXML: writedirxml_handler,
        WRITEGROUP: writegroup_handler,
        WRITEGROUPCOLLAPSED: writegroupcollapsed_handler,
        WRITEGROUPEND: writegroupend_handler,
        WRITEINFO: writeinfo_handler,
        WRITETABLE: writetable_handler,
        WRITEPROFILE: writeprofile_handler,
        WRITEPROFILEEND: writeprofileend_handler,
        WRITETIME: writetime_handler,
        WRITETIMEEND: writetimeend_handler,
        WRITETIMELOG: writetimelog_handler,
        WRITETIMESTAMP: writetimestamp_handler,
        WRITETRACE: writetrace_handler,
        WRITEWARN: writewarn_handler,
        RET: return_handler,
        STRUCT: struct_handler,
        EXPORTSFILE: exportsfile_handler,
        NOTSAME: notsame_handler,
        NOT: not_handler,
        IS: is_handler,
        LESS: less_handler,
        GREATER: greater_handler,
        EQUAL: equal_handler,
        DEFINE: define_handler,
        TUPLE: tuple_handler,
        SUB: sub_handler,
        SUBARRAY: subarray_handler,
        [constant.MEDIAN]: median_handler,
        [constant.SUPERSET]: superset_handler
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


const MEDIAN = 
`
Array.prototype.median = function () {
  return this.slice().sort((a, b) => a - b)[Math.floor(this.length / 2)]; 
};
`
const TUPLE = 
`
class Tuple extends Array { 
  constructor(...items) { 
    super(...items); 
    Object.freeze(this);
  } 
}
`


function repeat_handler(token) {

    let valArr = js_beautify(token.value).split(' ')

    if (valArr.length < 5) {
        triggerError("Syntax 'repeat' is error", token.line)
        process.exit()
    }
    
    const intvar = valArr[1]

    var parsedJS = `for(var ${intvar} = 0; ${intvar} < ${
        valArr[3]
    }; ${intvar}++)`

    return parsedJS
}

function every_handler(token) {
    let words = js_beautify(token.value).split(' ')
    let words2 = js_beautify(token.value).split(' ')
    let words2_parsed = words2[2].replace(')', '')

    const words_parsed = words[0].split('(')[1].replace(')', '')

    var parsedJS = `for(const ${words_parsed} ${words[1]} ${words2_parsed})`

    return parsedJS
}

function enum_handler(token) {

    var words = `= Enum(`

   const parsed = token.value
        .replace('enum', 'const')
        .replace('(', words)

    return parsed
}

function sub_handler(token) {

    let words = token.value.split(' ')
    let words_parsed = words[0].split('(', '')

    let format = /sub ([^)]*[a-zA-Z]): ([^\[\]\(\)\n]+) = \(([^\[\]\(\)\n]+)\)/;
    let match = token.value.match(format);
    if (!match) return triggerError(`Syntax 'sub' is Error`, token.line)


    return `var ${match[1]} = ${match[2]}` + `\ncheckTypes("${match[3]}", ${match[1]})`
}

function subarray_handler(token) {

    let words = token.value.split(' ')
    let words_parsed = words[0].split('(', '')

    let format = /subArray ([^)]*[a-zA-Z]): ([^\[\]\(\)\n]+) = \(([^\[\]\(\)\n]+)\)/;
    let match = token.value.match(format);
    if (!match) return triggerError(`Syntax 'subArray' is Error`, token.line)


    return `var ${match[1]} = [${match[3]}]` + `\ncheckTypes("[${match[2]}]", ${match[1]})`
    
}

function interface_handler(token) {

    var words = `= {`

   const parsed = token.value
        .replace('interface', 'const')
        .replace('(', words)
        .replace(')', '}')

    return parsed

}

function readonly_handler(token) {

    var freeze = `= Object.freeze({`

   const parsed = token.value
        .replace('readonly', 'const')
        .replace('(', freeze)
        .replace(')', ')}')

    return parsed

}

function tuple_handler(token) {

    additions.tuple = TUPLE

   let words = token.value.split(' ')
    let words_parsed = words[0].split('(', '')

    let format = /tuple ([^)]*[a-zA-Z]): ([^\[\]\(\)\n]+) = \(([^\[\]\(\)\n]+)\)/;
    let match = token.value.match(format);
    if (!match) return triggerError(`Syntax 'tuple' is Error`, token.line)


    return `var ${match[1]} = new Tuple(${match[3]})` + `\ncheckTypes("[${match[2]}]", ${match[1]})`

}

function define_handler(token) {

    const words = js_beautify(token.value).split(' ')

    var repl = words[2].replace('(', `', {`)

   const parsed = token.value
        .replace('define', 'Object.defineProperty(')
        .replace(':', `,'`)
        .replace(`' `, `'`)
        .replace(`${words[2]}`, repl)
        .replace(')', '})')
        .replace('(', ', {')
        .replace('(', ', {')
        .replace(', {', '(')
        .replace('readonly: true', 'writable: false')
        .replace('readonly: false', 'writable: true')
        .replace('config', 'configurable')
        .replace('enums', 'enumerable')

    return `const ${words[1].replace(':', '')} = {};` + parsed

}

function val_handler(token) {

    const words = js_beautify(token.value).split(' ')


    var wordss = `= function() {`
    var wors = `_${words[1]}`.replace(':', '')

   const parsed = token.value
        .replace('val', 'const ')
        .replace('const ', 'const _')
        .replace('_ ', '_')
        .replace(':', wordss)
        .replace(')', '}')
        .replace(')', '}')
        .replace('}', ')')
        .replace('getInterface', 'Implements')
        .replace('createProperty', 'Object.getOwnPropertyDescriptors(this), this.constructor.name)')
        .replace(', noProperty', ')')

    return parsed + `var ${words[1].replace(':', '')} = new _${words[1].replace(':', '')}()`
}

function getinterface_handler(token) {

    const words = js_beautify(token.value).split(' ')

   const parsed = token.value
        .replace('getInterface', 'Implements')
        .replace('createProperty', 'Object.getOwnPropertyDescriptors(this), this.constructor.name')
        .replace(', noProperty', '')

    return parsed

}

function summon_handler(token) {

    let words = token.value.split(' ')
    let words_parsed = words[0].split('(', '')

    let format = /summon\(([^)]*[a-zA-Z])/;
    let match = token.value.match(format);


    return `var _${match[1]} = new ${match[1]}()`

}

function exportsfile_handler(token) {

   const parsed = token.value
        .replace('exportsfile', 'module.exports')
        .replace('(', '{')
        .replace(')', '}')

    return parsed

}


function notsame_handler(token) {

   const parsed = token.value
        .replace('notsame()', '!=')

    return parsed

}

function not_handler(token) {

   const parsed = token.value
        .replace('not()', '!')

    return parsed

}

function is_handler(token) {

   const parsed = token.value
        .replace('is()', '===')

    return parsed

}

function less_handler(token) {

   const parsed = token.value
        .replace('less()', '<')

    return parsed

}

function greater_handler(token) {

   const parsed = token.value
        .replace('greater()', '>')

    return parsed

}

function equal_handler(token) {

   const parsed = token.value
        .replace('equal()', '==')

    return parsed

}

function writelog_handler(token) {

   const parsed = token.value
        .replace('writeLog', 'console.log')

    return parsed

}

function writerr_handler(token) {

   const parsed = token.value
        .replace('writeError', 'console.error')

    return parsed

}

function writeassert_handler(token) {

   const parsed = token.value
        .replace('writeAssert', 'console.assert')

    return parsed

}

function writeclear_handler(token) {

   const parsed = token.value
        .replace('writeClear', 'console.clear')

    return parsed

}

function writecount_handler(token) {

   const parsed = token.value
        .replace('writeCount', 'console.count')

    return parsed

}

function writecountreset_handler(token) {

   const parsed = token.value
        .replace('writeCountReset', 'console.error')

    return parsed

}

function writedebug_handler(token) {

   const parsed = token.value
        .replace('writeDebug', 'console.debug')

    return parsed

}

function writedir_handler(token) {

   const parsed = token.value
        .replace('writeDir', 'console.dir')

    return parsed

}

function writedirxml_handler(token) {

   const parsed = token.value
        .replace('writeDirXml', 'console.dirxml')

    return parsed

}

function writegroup_handler(token) {

   const parsed = token.value
        .replace('writeGroup', 'console.group')

    return parsed

}

function writegroupcollapsed_handler(token) {

   const parsed = token.value
        .replace('writeGroupCollapsed', 'console.groupCollapsed')

    return parsed

}

function writegroupend_handler(token) {

   const parsed = token.value
        .replace('writeGroupEnd', 'console.groupEnd')

    return parsed

}

function writeinfo_handler(token) {

   const parsed = token.value
        .replace('writeInfo', 'console.info')

    return parsed

}

function writetable_handler(token) {

   const parsed = token.value
        .replace('writeTable', 'console.table')

    return parsed

}

function writetime_handler(token) {

   const parsed = token.value
        .replace('writeTime', 'console.time')

    return parsed

}

function writetimeend_handler(token) {

   const parsed = token.value
        .replace('writeTimeEnd', 'console.timeEnd')

    return parsed

}

function writetimelog_handler(token) {

   const parsed = token.value
        .replace('writeTimeLog', 'console.timeLog')

    return parsed

}

function writetimestamp_handler(token) {

   const parsed = token.value
        .replace('writeTimeStamp', 'console.timeStamp')

    return parsed

}

function writetrace_handler(token) {

   const parsed = token.value
        .replace('writeTrace', 'console.trace')

    return parsed

}

function writewarn_handler(token) {

   const parsed = token.value
        .replace('writeWarn', 'console.warn')

    return parsed

}

function writeprofile_handler(token) {

   const parsed = token.value
        .replace('writeProfile', 'console.profile')

    return parsed

}

function writeprofileend_handler(token) {

   const parsed = token.value
        .replace('writeProfileEnd', 'console.profileEnd')

    return parsed

}

function func_handler(token) {


    const words = js_beautify(token.value).split('(')


   const parsed = token.value
        .replace('func', 'function')
        
         return `${words[0].replace('func', '')} = checkFuncTypes(${words[0].replace('func', '')})` + parsed

}

function return_handler(token) {

   const parsed = token.value
        .replace('ret()', 'return ')

    return parsed

}

function struct_handler(token) {

   const parsed = token.value
        .replace('struct', 'constructor')

    return parsed

}

function superset_handler(token) {

    return token.value
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

function triggerError(mess, line, token) {
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

module.exports = {
    triggerError
}
