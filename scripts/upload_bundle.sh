#!/bin/sh
cd ios
zip -r  artifacts.zip main.js assets
cd ..
curl -F 'upload=@ios/artifacts.zip' https://a609pi.deta.dev/upload/$1