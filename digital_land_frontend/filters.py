import numbers
import validators
from datetime import datetime
from jinja2 import Markup, evalcontextfilter


def is_list_filter(v):
    """
    Check if variable is list
    """
    return isinstance(v, list)


def is_valid_uri_filter(uri):
    """
    Checks if a string is valid URI
    """
    if validators.url(uri):
        return True
    return False


@evalcontextfilter
def make_link_filter(eval_ctx, url, **kwargs):
    """
    Converts a url string into an anchor element.

    Requires autoescaping option to be set to True
    """
    css_classes = "govuk-link"
    if "css_classes" in kwargs:
        css_classes = kwargs.get("css_classes")

    if url is not None:
        if validators.url(str(url)):
            anchor = f'<a class="{css_classes}" href="{url}">{url}</a>'
            if eval_ctx.autoescape:
                return Markup(anchor)
    return url


def float_to_int_filter(v):
    """
    Converts float (which might be passed as a string) to int

    E.g. 2.0 to 2
    """
    if v:
        try:
            return int(float(v))
        except:
            return v
    return ""


def commanum_filter(v):
    """
    Makes large numbers readable by adding commas

    E.g. 1000000 -> 1,000,000
    """
    if isinstance(v, numbers.Number):
        return "{:,}".format(v)
    return v


def split_to_list_filter(s, delimiter=";"):
    """
    Splits a string on delimiter and returns list

    E.g. "a;b;c" => ['a', 'b', 'c']
    """
    if isinstance(s, str):
        return s.split(delimiter)
    return s


def readable_date_filter(dt, f="%d %B %Y"):
    """
    Takes a datetime and returns a readable date

    Optional format
    """
    if isinstance(dt, datetime):
        return dt.strftime(f)
    return dt


def hex_to_rgb_string_filter(hex):
    """
    Given hex will return rgb string

    E.g. #0b0c0c ==> "11, 12, 12"
    """
    h = hex.lstrip("#")
    rgb = tuple(int(h[i : i + 2], 16) for i in (0, 2, 4))
    return f"{rgb[0]},{rgb[1]},{rgb[2]}"
