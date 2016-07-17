#!/bin/bash

rm -rf dist/*
gulp build
export BRANCH=`git rev-parse --abbrev-ref HEAD`
git add .
git commit
git push origin $BRANCH
date