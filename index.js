#!/usr/bin/env node
const child_process = require("child_process");

const scriptsDir = `${__dirname}/scripts`;

const initChainProcess = child_process.exec(`${scriptsDir}/init_chain.sh`);

initChainProcess.stdout.on('data', function(data) {
    console.log(data);
});

const migrateContractsProcess = child_process.exec(`${scriptsDir}/migrate_contracts.sh`);

migrateContractsProcess.stdout.on('data', function(data) {
    console.log(data);
});