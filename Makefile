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
