setup:
	yarn install
	if [ "$(ENV)" = "development" ] ; then \
		supervisorctl stop nginx ; \
		PORT=80 \
		node_modules/react-scripts/bin/react-scripts.js start ; \
	else \
		node_modules/react-scripts/bin/react-scripts.js build ; \
	fi