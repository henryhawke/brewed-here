#!/bin/sh -l
set -ex

cd app
cat app.json | jq '.expo.sdkVersion' -r > /tmp/expo-sdk-version
yarn global add gulp-cli turtle-cli@$TURTLE_VERSION
turtle setup:$PLATFORM --sdk-version `cat /tmp/expo-sdk-version`
turtle build:android \
  --type app-bundle \
  --build-dir ./build \
  --public-url https://expo.brewedhere.co/android-index.json \
  -o brewed-here.aab
ls && ls ./buil

# yarn global add expo-cli
# yarn
# expo login -u $EXPO_CLI_USERNAME
# expo publish