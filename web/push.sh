ng build --prod
chmod -fR 755 dist/*
javascript-obfuscator dist/main-es5*.js --output dist/main-es5*.js --config ./obfuscator.json
javascript-obfuscator dist/main-es2015*.js --output dist/main-es2015*.js --config ./obfuscator.json
rsync -crvz dist/* ncat@45.77.122.253:/var/www/web
