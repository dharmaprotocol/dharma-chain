#!/usr/bin/env bash

BASEDIR=$(dirname "$0")
ganache-cli --db="$BASEDIR/../data/working" --networkId 70 --accounts 20 --deterministic --mnemonic="arm impose enemy alpha bird attend hunt host town sleep charge catalog"
