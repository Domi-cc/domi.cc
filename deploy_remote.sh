#!/bin/sh -e

echo "deploying..."
cd /var/www/users/domi/content/domi.cc 
echo "git pull..."
su -s /bin/bash -c 'git pull' domi || (echo "failed" && exit 1)
echo "done."


# frontend
echo "composer-asset-plugin LUYA"
cd /var/www/users/domi/content/domi.cc/frontend
su -s /bin/bash -c 'php7 /usr/local/bin/composer global require --ansi fxp/composer-asset-plugin:~1.4' domi || (echo "failed" && exit 1)
echo "done."
echo "composer install LUYA"
cd /var/www/users/domi/content/domi.cc/frontend
su -s /bin/bash -c 'php7 /usr/local/bin/composer install --no-dev --ansi' domi || (echo "failed" && exit 1)
echo "done."
echo "Ensure local config"
su -s /bin/bash -c 'echo "<?php return require \"env-prod.php\";" > /var/www/users/domi/content/domi.cc/frontend/configs/env.php' domi || (echo "failed" && exit 1)
su -s /bin/bash -c 'echo "<?php return [];" > /var/www/users/domi/content/domi.cc/frontend/configs/env-local-db.php' domi || (echo "failed" && exit 1)
echo "done."
echo "LUYA migrate"
su -s /bin/bash -c 'php7 ./luya migrate/up --interactive=0' domi || (echo "failed" && exit 1)
echo "done."
echo "LUYA import"
su -s /bin/bash -c 'php7 ./luya import --interactive=0' domi || (echo "failed" && exit 1)
echo "done."

