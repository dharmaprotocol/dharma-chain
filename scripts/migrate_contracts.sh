#!/bin/bash
CYAN='\033[0;36m'
GREEN='\033[0;32m'
NO_COLOR='\033[0m'

mkdir -p logs

USER_PROJECT_REPO=`pwd`

LOGS=$USER_PROJECT_REPO/logs/dharma_contract_migration.txt

DHARMA_SMART_CONTRACTS=$USER_PROJECT_REPO/node_modules/@dharmaprotocol/dharma.js/node_modules/@dharmaprotocol/contracts
DHARMA_JS=$USER_PROJECT_REPO/node_modules/@dharmaprotocol/dharma.js

# install dharma.js
cd $DHARMA_JS

echo -e "${CYAN}Installing packages to build dharma.js...${NO_COLOR}"
npm install >> $LOGS 2>&1
echo -e "\n"

# install and build contracts
cd $DHARMA_SMART_CONTRACTS

echo -e "${CYAN}Installing Dharma contract deployment dependencies...${NO_COLOR}"
npm install >> $LOGS 2>&1
echo -e "\n"

echo -e "${CYAN}Running Dharma smart contract migrations...${NO_COLOR}"
npm run deploy:development >> $LOGS 2>&1
echo -e "\n"

echo -e "${CYAN}Transpiling newly generated artifacts for usage in the dharma.js repo...${NO_COLOR}"
npm run dist >> $LOGS 2>&1
echo -e "\n"

# build dharma.js
cd $DHARMA_JS

echo -e "${CYAN}Building dharma.js...${NO_COLOR}"
npm run webpack >> $LOGS 2>&1
echo -e "\n"

echo -e "${GREEN}Dependency contract migrations complete, test chain is ready for use!${NO_COLOR}"
echo -e "${GREEN}Artifacts for the contracts deployed to the test chain can be imported directly from the \
@dharmaprotocol/contracts package.${NO_COLOR}"