#!/usr/bin/env node
const child_process = require("child_process");

// This version of ganache is required globally.
const requiredGanache = "ganache-cli@6.1.3";

const scriptsDir = `${__dirname}/scripts`;

const ProgressBar = require("./lib/progress-bar");

const bar = new ProgressBar(`
    Progress: [:bar] :percent
`, { total: 922 });

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
            console.log(`exec error: ${error}`);
        }
    },
);

// Once we have installed Ganache-CLI, we can init a chain and migrate the contracts.
installGanacheProcess.on("exit", () => {
    const initChainProcess = child_process.spawn(`${scriptsDir}/init_chain.sh`);

    // True once ganache-cli has begun.
    let chainStarted = false;

    initChainProcess.on('exit', function (code, signal) {
        if (!chainStarted) {
            console.error(`
Local blockchain (running on ganache-cli) failed to start!
        `);
        }

        console.error(`
Local blockchain (ganache-cli) exited with
code ${code} and signal ${signal}
    `);
    });

    initChainProcess.stdout.on('data', function (data) {
        chainStarted = true;
        console.log(data.toString());
        bar.tick();
    });

    const migrateContractsProcess = child_process.exec(`${scriptsDir}/migrate_contracts.sh`);

    migrateContractsProcess.stdout.on('data', function (data) {
        console.log(data);
        bar.tick();
    });

    process.on('exit', () => {
        initChainProcess.kill();
    });
});