#!/usr/bin/env bash

set -euxo pipefail

mkdir -p build
npm run-script build

if [[ ! -e "build/nodecg" ]]; then
    git clone https://github.com/nodecg/nodecg.git build/nodecg
    cd build/nodecg
    npm install
    cd ../../
else
    cd build/nodecg
    git reset --hard HEAD
    git pull
    npm install
    cd ../../
fi

mkdir -p build/nodecg/bundles/runback
cp -rf {node_modules,dashboard,extension,graphics,package.json,package-lock.json} build/nodecg/bundles/runback
