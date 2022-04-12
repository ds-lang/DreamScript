// The Command Lines
// DreamScript Programming Language Projects

const path = require('path')
const fs = require('fs')
const app = require('commander')
const chalk = require('chalk')
const recReadSync = require('recursive-readdir-sync')
const mkdirp = require('mkdirp')
const ON_DEATH = require('death')
const { exec } = require('child_process')
const ds_tokens = require('./ds_tokens')
const ds_handler = require('./ds_handler')
const ds_exports = require('./ds_exports')
const { version, description } = require('../package.json');

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
    ds_exports.run(__code, (err) => {
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
        ds_exports.runFile(filepath + '.ds')
    })

app.command('c <file>')
    .alias('compile')
    .description('Compile ds file and display to console')
    .action(filepath => {
        checkOption()
        ds_exports.compile(ds_exports.getRealPath(filepath + '.ds'), result => {
            console.log(result)
        })
    })

app.command('rc <file>')
    .alias('runcompile')
    .description("Run and Compile DreamScript File, 'ds' is a default command")
    .action(filepath => {
        checkOption()
        ds_exports.compile(ds_exports.getRealPath(filepath), result => {
            runCompile(result)
    })
    })


app.command('out <file>')
    .alias('output')
    .description('Compile and save the files')
    .action(filepath => {
        checkOption()
        ds_exports.compile(ds_exports.getRealPath(filepath + '.ds'), result => {
            fs.writeFile(`${filepath}.js`, result, err => {
                if (err) {
                    console.log('File not Found')
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
            const fileDirJs = ds_exports.renameToJs(fileDir)
            const jsName = path.basename(fileDirJs)

            const jsOutputBase = path
                .normalize(fileDirJs.replace(cwd, '').replace(input, output))
                .slice(1)

            const jsOutput = path.resolve(cwd, jsOutputBase)

            ds_exports.compile(fileDir, result => {
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
            const fileDirJs = ds_exports.renameToJs(fileDir)
            const jsName = path.basename(fileDirJs)

            const jsOutputBase = path
                .normalize(fileDirJs.replace(cwd, '').replace(input, input))
                .slice(1)

            const jsOutput = path.resolve(cwd, jsOutputBase)

            ds_exports.compile(fileDir, result => {
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
.description('Compile the ./ Directory')
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
            const fileDirJs = ds_exports.renameToJs(fileDir)
            const jsName = path.basename(fileDirJs)

            const jsOutputBase = path
                .normalize(fileDirJs.replace(cwd, '').replace(cwd, cwd))
                .slice(1)

            const jsOutput = path.resolve(cwd, jsOutputBase)

            ds_exports.compile(fileDir, result => {
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
        ds_exports.createDir(`${dirpath}`)
        console.log('Folder has been created')
        fs.writeFile(`./${dirpath}/index.ds`, hello_ds, (err) => {
            if (err) {
                console.log('File has not been created');
            }
            })
    })

app.command('t <file>')
    .alias('token')
    .description('Generate token / lex (debug)')
    .action(filepath => {
        checkOption()
        ds_exports.token(ds_exports.getRealPath(filepath), token => {
            console.log(token)
        })
    })

app.command('clean')
    .alias('cl')
    .description('clean ds temp file')
    .action(() => {
        checkOption()
        ds_exports.clean(message => {
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
            if (err) {
                console.log('DS Config is Error');
            }
        })
    })


// Development Codes
app.command('b <file> <output>')
    .alias('build')
    .description('Compile ds file and run the file')
    .action((filepath, output) => {
        checkOption()
        ds_exports.compile(ds_exports.getRealPath(filepath), result => {
            fs.writeFileSync(path.join(process.cwd(), output), result)
            ds_exports.runFile(output)
        })
    })
 
// Development Codes
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
            const fileDirJs = ds_exports.renameToJs(fileDir)
            const jsName = path.basename(fileDirJs)

            const jsOutputBase = path
                .normalize(fileDirJs.replace(cwd, '').replace(input, output))
                .slice(1)

            const jsOutput = path.resolve(cwd, jsOutputBase)

            ds_exports.compile(fileDir, result => {
                console.log(
                    `${chalk.bold(
                        fileDir.replace(cwd, '').slice(1)
                    )} ${chalk.blue('➜')} ${chalk.bold.gray(jsOutputBase)}`
                )

                mkdirp.sync(path.dirname(jsOutput))
                ds_exports.runFile(fileDir)
            })
        }
    })

// Development Codes
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
            const fileDirJs = ds_exports.renameToJs(fileDir)
            const jsName = path.basename(fileDirJs)

            const jsOutputBase = path
                .normalize(fileDirJs.replace(cwd, '').replace(input, input))
                .slice(1)

            const jsOutput = path.resolve(cwd, jsOutputBase)

            ds_exports.compile(fileDir, result => {
                console.log(
                    `${chalk.bold(
                        fileDir.replace(cwd, '').slice(1)
                    )} ${chalk.blue('➜')} ${chalk.bold.gray(jsOutputBase)}`
                )
                ds_exports.runFile(fileDir)
            })
        }
    })

// Development Codes
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
            const fileDirJs = ds_exports.renameToJs(fileDir)
            const jsName = path.basename(fileDirJs)

            const jsOutputBase = path
                .normalize(fileDirJs.replace(cwd, '').replace(__dirname, __dirname)
                .slice(1))

            const jsOutput = path.resolve(cwd, jsOutputBase)

            ds_exports.compile(fileDir, result => {
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
    ds_exports.recover(
        ds_exports.getCompiledPath(),
        fs.readFileSync(global.userFilePath)
    )
})