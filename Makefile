.PHONY: package

# current git branch
BRANCH := $(shell git rev-parse --abbrev-ref HEAD)

init::
	pip install -e .[testing]
	npm install

build:
	npm run build

package:
	npm run build:package

test:
	python -m pytest -sv tests/unit

lint:	black-check flake8

black:
	black .

black-check:
	black --check .

flake8:
	flake8 .

commit-package::
	git add package/digital-land-frontend
	git diff --quiet && git diff --staged --quiet || (git commit -m "Rebuilt package $(shell date +%F)"; git push origin $(BRANCH))
