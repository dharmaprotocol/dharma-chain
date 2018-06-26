#!/usr/bin/env node
const child_process = require("child_process");
const colors = require("colors");

// This version of ganache is required globally.
const requiredGanache = "ganache-cli@6.1.3";

const scriptsDir = `${__dirname}/scripts`;

console.log('Checking Ganache Version...');
console.log(
    "Running:", `npm list ${requiredGanache} -g || npm install ${requiredGanache} -g`
);

const installGanacheProcess = child_process.exec(
    `npm list ${requiredGanache} -g || npm install ${requiredGanache} -g`,
    (error, stdout, stderr) => {
    if (stdout) {
        console.log('Found ganache-cli:', stdout);
    }

    if (stderr) {
        console.log('stderr:', stderr);
    }

    if (error !== null) {
    console.log(`exec error: ${error}`.red);
}
},
);

installGanacheProcess.on("exit", () => {
    const initChainProcess = child_process.spawn(`${scriptsDir}/init_chain.sh`);

// True once ganache-cli has begun.
let chainStarted = false;

initChainProcess.on('exit', function (code, signal) {
    if (!chainStarted) {
        console.error(`
Local blockchain (running on ganache-cli) failed to start!
        `.red);
    }

    console.error(`
Local blockchain (ganache-cli) exited with
code ${code} and signal ${signal}
    `.red);
});

initChainProcess.stdout.on('data', function(data) {
    chainStarted = true;
    console.log(data.toString());
});

const migrateContractsProcess = child_process.exec(`${scriptsDir}/migrate_contracts.sh`);

migrateContractsProcess.stdout.on('data', function(data) {
    console.log(data);
});

process.on('exit', () => {
    initChainProcess.kill();
});
});