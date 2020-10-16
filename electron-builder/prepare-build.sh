set -euxo pipefail

mkdir -p build
cp -rf lib/nodecg build/
cp -f electron-builder/electron-package.json build/nodecg/package.json

if [ "$RUNNER_OS" == "Windows" ]; then
    cp -rf ../runback build/nodecg/bundles/

else
    ln -sf ../../../../runback build/nodecg/bundles/
fi

cd build/nodecg && yarn install
cd bundles/runback && yarn install
