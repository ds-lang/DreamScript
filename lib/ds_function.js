// The Functional Files
// DreamScript Programming Language Projects


const beautify = require('js-beautify').js_beautify
const ds_tokens = require('./ds_tokens');
const transformer = require('./ds_handler');
const ds_exports = require('./ds_exports');
const fs = require('fs')
const path = require('path')
const chalk = require('chalk')
const recReadSync = require('recursive-readdir-sync')
const mkdirp = require('mkdirp')
const childProcess = require('child_process')


async function compile(_code) {
    return new Promise((resolve, reject) => {
        ds_tokens.lexString(_code, (token, error) => {
            if (error) return reject(error)

            ds_handler.parse(token, compiled => {
                resolve(beautify(compiled))
            })
        })
    })
}

async function run(__code) {
    return new Promise((resolve, reject) => {
        ds_tokens.lexString(__code, (token, error) => {
            if (error) return reject(error)

            ds_handler.parse(token, compiled => {
                ds_exports.run(compiled, resolve)
            })
        })
    })
}

async function compileAndSave(filepath, output) {
    ds_exports.compile(ds_exports.getRealPath(filepath), result => {
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
            const fileDirJs = ds_exports.renameToJs(fileDir)
            const jsName = path.basename(fileDirJs)

            const jsOutputBase = path
                .normalize(fileDirJs.replace(cwd, '')).replace(input, input)

            const jsOutput = path.resolve(cwd, jsOutputBase)

            ds_exports.compile(fileDir, result => {
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
            const fileDirJs = ds_exports.renameToJs(fileDir)
            const jsName = path.basename(fileDirJs)

            const jsOutputBase = path
                .normalize(fileDirJs.replace(cwd, '')).replace(input, output)

            const jsOutput = path.resolve(cwd, jsOutputBase)

            ds_exports.compile(fileDir, result => {
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
    ds_exports.compile(ds_exports.getRealPath(filepath), result => {
        runCompile(result)
})
}

module.exports = {
compile,
run,
compileAndSave,
compileDirectory,
compileAndRun,
compileAndRunDirectory
}
