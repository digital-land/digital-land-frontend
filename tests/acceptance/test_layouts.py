"""
Acceptance tests for the layouts.

Apps use digital-land-frontend by extending one of its layouts, so every
layout has to meet these tests. They run against every template in
templates/layouts/, so new layouts are covered automatically.
"""

import re
from pathlib import Path

import pytest
from jinja2 import Environment, PackageLoader, PrefixLoader

from digital_land_frontend.filters import is_list_filter
from digital_land_frontend.globals import random_int

REPO_ROOT = Path(__file__).parents[2]
# the images the npm package ships, which apps copy into their static folder
IMAGES_DIR = REPO_ROOT / "digital_land_frontend" / "src" / "images"

# the loaders the package README tells apps to register
LOADERS = {
    "govuk_frontend_jinja": PackageLoader("govuk_frontend_jinja"),
    "digital-land-frontend": PackageLoader("digital_land_frontend"),
}

LAYOUTS = sorted(
    template
    for template in PackageLoader("digital_land_frontend").list_templates()
    if template.startswith("layouts/")
)


@pytest.fixture
def env():
    """A Jinja environment set up the way an app sets it up"""
    env = Environment(loader=PrefixLoader(LOADERS))
    env.filters["is_list"] = is_list_filter
    env.globals["random_int"] = random_int
    return env


def render_layout(env, layout):
    return env.get_template(f"digital-land-frontend/{layout}").render(
        assetPath="/static"
    )


def test_there_are_layouts_to_test():
    assert LAYOUTS


@pytest.mark.parametrize("layout", LAYOUTS)
def test_layout_only_links_to_images_the_package_ships(env, layout):
    html = render_layout(env, layout)
    images = re.findall(r'"/static/images/([^"?#]+)', html)

    assert images, "expected the layout to link to some images"
    missing = [image for image in images if not (IMAGES_DIR / image).is_file()]
    assert missing == []


@pytest.mark.parametrize("layout", LAYOUTS)
def test_layout_links_a_favicon_and_a_touch_icon(env, layout):
    html = render_layout(env, layout)

    assert 'rel="icon"' in html or 'rel="shortcut icon"' in html
    assert 'rel="apple-touch-icon"' in html
