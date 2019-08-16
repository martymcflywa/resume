#!/bin/bash

if [ ! -d "./target" ]
  mkdir "./target"
fi

npm run html
npm run deploy