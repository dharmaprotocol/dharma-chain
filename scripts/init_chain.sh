#!/usr/bin/env bash

BASEDIR=$(dirname "$0")

ganache-cli --db="$BASEDIR/../data" --networkId 70 --accounts 20 --deterministic --mnemonic="arm impose enemy alpha bird attend hunt host town sleep charge catalog"
curl http://localhost:8545 -X POST --data '{"jsonrpc":"2.0","method":"evm_mine","params":[],"id":1}'
