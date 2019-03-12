#!/usr/bin/env bash

BASEDIR=$(dirname "$0")

echo "Removing existing pristine blockchain state..."
rm -r "$BASEDIR/../data/pristine"

echo "Copying working blockchain state into pristine blockchain state..."
mv "$BASEDIR/../data/working" "$BASEDIR/../data/pristine"

echo "Removing working blockchain state..."
rm -r "$BASEDIR/../data/working"

echo "Finished replacing prinstine blockchain state with working blockchain state."
