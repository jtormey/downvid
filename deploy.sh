echo "\n>>> updating node modules\n"
yarn install --ignore-engines

echo "\n>>> building client application\n"
rm -rf ./build
yarn build

echo "\n>>> restarting server\n"
yarn pm2.restart

echo "\n>>> deployed\n"
