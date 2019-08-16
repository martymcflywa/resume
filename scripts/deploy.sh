#!/bin/bash

if [ ! -d "./target" ]; then
  mkdir "./target"
fi

npm install
npm run html
npm run deploy