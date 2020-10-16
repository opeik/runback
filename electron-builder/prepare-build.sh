set -euxo pipefail

mkdir -p build
cp -rf lib/nodecg build/
cp -f electron-builder/electron-package.json build/nodecg/package.json
ln -sf ../../../../runback build/nodecg/bundles/
cd build/nodecg && yarn install
cd bundles/runback && yarn install
