#!/usr/bin/env bash

set -euxo pipefail

mkdir -p build/nodecg/bundles/runback
cd lib/nodecg && npm install && cd ../..
cp -rf lib/nodecg/{index.js,build,lib,schemas,src,types,package-lock.json} build/nodecg/
cp -rf {node_modules,dashboard,extension,graphics,package.json,package-lock.json} build/nodecg/bundles/runback/
cp -rf electron-builder build/nodecg/
cp -rf electron-builder/electron-package.json build/nodecg/package.json
