# weuse it because Make normally starts a new shell for every line
.ONESHELL:

setup:
	# to install NVM
	curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.3/install.sh | bash

	# load it into your current zsh session	
	export NVM_DIR="$$HOME/.nvm"
	source "$$NVM_DIR/nvm.sh"

	# toinstall and use Node.js
	nvm install 22.22.3
	nvm use 22.22.3
	nvm alias default 22.22.3

	# install project dependencies
	npm install

run:
	npx ng serve

tests:
	npx ng test