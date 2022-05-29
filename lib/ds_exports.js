// Files of Exports
// DreamScript Programming Language Projects


const fs = require('fs')
const childProcess = require('child_process')
const path = require('path')
const ncp = require('ncp').ncp
const beautify = require('js-beautify').js_beautify
const ds_handler = require('./ds_handler')
const ds_tokens = require('./ds_tokens');
const chalk = require('chalk')


exports.info = (parent, text, ...args) => {
    if (global.verbose) {
        console.info(
            `${chalk.green.bold('INFO')}: [${chalk.magenta(
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

exports.compile = (filepath, callback) => {
    ds_tokens.lex(filepath, token => {
        ds_handler.parse(token, compiled => {
            callback(beautify(compiled), {
                end_with_newline: true
            })
        })
    })
}

async function runSc(filepath) {
    var realPath = this.getRealPath(filepath)
    var original = fs.readFileSync(realPath, 'utf8')

    info('runDirectory', 'real path:', chalk.bold.gray(realPath))

    this.compile(realPath, result => {
        this.runLocal(result, original)
    })
}

exports.runDirectory = (filepath, callback) => {

    ds_tokens.lex(filepath, token => {
        ds_handler.parse(token, compiled => {
            callback(beautify(compiled))
                end_with_newline: true
                this.runFile(compiled)
        })
    })
}

exports.compiles = filepath => {
    return new Promise((resolve, reject) => {
        ds_tokens.lexString(filepath, (token, error) => {
            if (error) return reject(error)

            ds_handler.parse(token, compiled => {
                resolve(beautify(compiled))
            })
        })
    })
}

exports.token = (filepath, callback) => {

    ds_tokens.lex(filepath, token => {
        callback(token)
    })
}

exports.clean = callback => {

    this.checkTempDir()

    const tempPath = path.join(__dirname, tempDir)
    const files = fs.readdirSync(tempPath)

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
    fs.writeFileSync(tempFile, script)

    runScript(tempFile, async () => {
        await this.clean()
        await callback()
    })
}

exports.runLocal = (compiled, original) => {

    const compiledPath = this.getCompiledPath()
    fs.writeFileSync(compiledPath, compiled)
    runScript(compiledPath, () => this.recover(compiledPath, original))
}

exports.runFile = filepath => {

    const realPath = this.getRealPath(filepath)
    const original = fs.readFileSync(realPath, 'utf8')
    this.compile(realPath, result => {
        this.runLocal(result, original)
    })
}

exports.runDir = filepath => {

    const realPath = this.getRealPath(filepath)
    const original = fs.readFileSync(realPath, 'utf8')
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
        console.log('Invalid file specified')
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
           console.log('Success Create Directory');
       }
    });
}

// Under Development Codes
function getext(filepath) {
    return filepath.split("?")[0].split('#')[0].split('.').pop()
}
