import glob
import os

from setuptools import setup, find_packages

components = []
directories_jinja = glob.glob("digital_land_frontend/**/**/*.jinja", recursive=True)

for directory in directories_jinja:
    components.append(
        os.path.relpath(os.path.dirname(directory), "digital_land_frontend")
        + "/*.jinja"
    )

setup(
    name="digital-land-frontend",
    version="0.1",
    author="Digital land",
    description="Reusable frontend code for digital land services and products",
    license="MIT",
    packages=find_packages(exclude=["tests"]),
    package_data={"digital-land-frontend": components},
    python_requires=">=3.5",
    install_requires=["govuk-frontend-jinja", "validators"],
    include_package_data=True,
    extras_require={"testing": ["pytest", "flake8"]},
)
