#!/usr/bin/env bash

# One time repo setup

npm install
#npm install --no-shrinkwrap
npm run submoduleupdate
npm run submoduleinstall:dev

#The -v option is non-standard and its use in scripts is not recommended.
chmod -Rvv a+x srvcommon/git-hooks/

echo "setting main git hooks"
#The -h, -i, -n and -v options are non-standard
# and their use in scripts is not recommended.
ln -svFf ./../../srvcommon/git-hooks/pre-commit \
		./../../srvcommon/git-hooks/post-checkout \
		./../../srvcommon/git-hooks/post-merge \
		./.git/hooks/

echo "setting sub module git hooks"
ln -svFf ./../../../../srvcommon/git-hooks/pre-commit \
		./../../../../srvcommon/git-hooks/sub-post-checkout \
		./../../../../srvcommon/git-hooks/sub-post-merge \
		./.git/modules/srvcommon/hooks/

echo "setup done"
