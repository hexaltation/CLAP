#! /bin/bash

# Setup the git repository to work as needed.
# Run node modules installation
# Links hooks

CUR_PATH=$(pwd)

echo -e "setting git core.hooksPath to $CUR_PATH/hooks\n"
git config core.hooksPath $CUR_PATH/hooks
echo -e "installing node modules"
npm install
echo -e "pruning modules"
npm prune
echo -e "deduping modules"
npm dedupe

echo -e "clap setup done with success"