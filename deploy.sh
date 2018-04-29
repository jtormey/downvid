echo "\n>>> updating node modules\n"
npm install

echo "\n>>> building client application\n"
rm -rf ./build
npm run build

echo "\n>>> restarting server\n"
npm run pm2.restart

echo "\n>>> deployed\n"
