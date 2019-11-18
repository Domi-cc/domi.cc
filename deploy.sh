#!/bin/sh -e

scp deploy_remote.sh root@tador.cebe.net:/var/www/users/domi/tmp/deploy_remote.sh
ssh root@tador.cebe.net /var/www/users/domi/tmp/deploy_remote.sh 

