#!/usr/bin/env bash

echo "== main repo reset codebase =="
git reset --hard
git clean -fndx
git clean -fdx

echo "== main repo npm install =="
npm install || true

cd srvcommon
git reset --hard
git clean -fndx
git clean -fdx
cd ..

echo "== sub repo fetch and npm install =="
npm run submoduleinstall:prod || true
