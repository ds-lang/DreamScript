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
const ds_handler = require('./ds_handler')
const ds_exports = require('./ds_exports')
const { version, description } = require('../package.json');

var ds_json = 
`
{
  "name": "your_app",
  "version": "0.0.1",
  "description": "your_app",
  "main": "index.js",
  "dependencies": {
    "ds-langs": "^0.6.5"
  },
  "scripts": {
    "start": "node index.js",
    "build": "ds cmp ./"
  }
}
`
var hello_ds = 
`superset;

writeLog("Hello, World")
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

function compileDir(startPath, filter) {

    if (!fs.existsSync(startPath)) {
        console.log("no directory avalaible ", startPath);
        return;
    }

    var files = fs.readdirSync(startPath);
    for (var i = 0; i < files.length; i++) {
        var filename = path.join(startPath, files[i]);
        var stat = fs.lstatSync(filename);
        if (stat.isDirectory()) {
            compileDir(filename, filter);
        } else if (filename.endsWith(filter)) {
            console.log('Compiling the Files.......');
            ds_exports.compile(filename, result => {
                const saves = ds_exports.renameToJs(filename)
            fs.writeFileSync(saves, result)
            })
        };
    };
};

function cleanDir(startPath, filter) {

    if (!fs.existsSync(startPath)) {
        console.log("no directory avalaible ", startPath);
        return;
    }

    var files = fs.readdirSync(startPath);
    for (var i = 0; i < files.length; i++) {
        var filename = path.join(startPath, files[i]);
        var stat = fs.lstatSync(filename);
        if (stat.isDirectory()) {
            compileDir(filename, filter);
        } else if (filename.endsWith(filter)) {
            fs.unlinkSync(filename)
        };
    };
};

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
    .alias('comp')
    .description('Compile ds file and display to console')
    .action(filepath => {
        checkOption()
        ds_exports.compile(ds_exports.getRealPath(filepath + '.ds'), result => {
            console.log(result)
        })
    })

app.command('cmp <file>')
    .alias('compile')
    .description('Compile ds file')
    .action(filepath => {
        checkOption()
        compileDir(`${filepath}`, '.ds')
    })

app.command('rc <path>')
    .description('Compiling and Running ds file')
    .action(filepath => {
        checkOption()
        var files = filepath
        .split(" ")
        var filess = files[0].split("/")
        compileDir('./', '.ds')
        ds_exports.runFile(filepath + '.ds', success => {
            if (success) {
                cleanDir(`./`, `.js`)
            } else {
                console.log(`Failed to Running "ds" Files`)
            }
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

app.command('create <output>')
    .alias('cr')
    .description('Create your_app with a Dreamscript')
    .action(dirpath => {
        checkOption()
        ds_exports.createDir(`${dirpath}`)
        console.log('Folder has been created')
        fs.writeFile(`./${dirpath}/package.json`, ds_json, (err) => {
            if (err) {
                console.log('File has not been created')
            }
        })
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
        exec(
            `npm install "${package}"`
            )
    })

app.command('pkg')
    .alias('package')
    .action(() => {
    checkOption()
    exec(
        `npm init`
        )
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
