#!/bin/bash

if [ ! -d "./target" ]; then
  mkdir "./target"
fi

npm run html
npm run deploy