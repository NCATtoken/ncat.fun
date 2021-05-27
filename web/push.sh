ng build --prod
chmod -fR 755 dist/*
rsync -crvz dist/* ncat@45.77.122.253:/var/www/web
