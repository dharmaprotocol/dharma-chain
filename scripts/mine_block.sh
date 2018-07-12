#!/usr/bin/env bash
PORT=8545

echo "Waiting for the local blockchain to start..."
until nc -z localhost $PORT &>/dev/null; do :; done;

echo "Local blockchain detected at localhost:$PORT."
echo "Mining block to update blockchain time."
curl http://localhost:$PORT -X POST --data '{"jsonrpc":"2.0","method":"evm_mine","params":[],"id":1}' &>/dev/null
