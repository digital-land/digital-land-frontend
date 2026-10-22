.PHONY: package

init::
	python -m pip install --upgrade pip
	python -m pip install pip-tools
	python -m piptools compile requirements/requirements.in
	python -m piptools sync requirements/requirements.txt
	npm install

build:
	npm run build

package:
	npm run build:package

test: test-python test-javascript

test-python:
	python -m pytest -sv tests/unit

test-javascript:
	npm test

lint:	black-check flake8

black:
	black .

black-check:
	black --check .

flake8:
	flake8 .
