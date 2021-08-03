PROJECT = <gcp_project>
PROD_VERSION = prod
STAGING_VERSION = staging

# Run `make install` to set up authentication to the NPM repo and to initialize
# the project.
.PHONY: install
install: update-oak node_modules

# The `make run` command starts a dev server and runs gulp in watch mode.
.PHONY: run
run:
	npm run dev:watcher & npm run gulp

# The `make deploy` command deploys oak to App Engine under two different
# services: oak-webui and oak-server. IAP should be configured so that only
# admin users can access oak-webui.
.PHONY: deploy
deploy: node_modules
	npx google-artifactregistry-auth .npmrc
	npm run gulp:prod
	gcloud app deploy -q --project=$(PROJECT) --version=$(PROD_VERSION) webui.yaml app.yaml

# The `make stage` command deploys oak-webui to App Engine under the version
# defined by STAGING_VERSION.
.PHONY: stage
stage: node_modules
	npx google-artifactregistry-auth .npmrc
	npm run gulp:prod
	gcloud app deploy -q --project=$(PROJECT) --version=$(STAGING_VERSION) webui.yaml

# Run `make migratedb` to apply any necessary changes to the database.
.PHONY: migratedb
migratedb: node_modules
	npm run migratedb

# The `make deploy-index` updates the datastore indexes.
.PHONY: deploy-index
deploy-index:
	gcloud app deploy -q --project=$(PROJECT) index.yaml

# Run `make update-oak` to update Oak to the latest version.
.PHONY: update-oak
update-oak: | .npmrc
	npx google-artifactregistry-auth .npmrc
	npm install @oak/oak@latest


# Dependencies.

.npmrc:
	# NOTE: Do not repleace the `--project` flag here, it should be hardcoded as
	# `oakdemo`.
	gcloud beta artifacts print-settings npm --project=oakdemo --repository=oak --location=us-west1 --scope=@oak > .npmrc
	npx google-artifactregistry-auth .npmrc

node_modules: package.json | .npmrc
	npx google-artifactregistry-auth .npmrc
	npm install
