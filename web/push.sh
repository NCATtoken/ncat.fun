ng build --prod
chmod -fR 755 dist/*
rsync -crvz dist/* ncat@149.28.73.165:/var/www/web
