from datetime import datetime

from digital_land_frontend.filters import (
    is_list_filter,
    is_valid_uri_filter,
    float_to_int_filter,
    commanum_filter,
    split_to_list_filter,
    readable_date_filter,
    hex_to_rgb_string_filter,
)


def test_is_list_filter():
    assert is_list_filter([])
    assert is_list_filter(["this", "is", "a", "test"])

    assert not is_list_filter("")
    assert not is_list_filter(1)
    assert not is_list_filter(None)


def test_is_valid_uri_filter():
    url = "https://digital-land.info"
    not_url = "digital-land.info"

    assert is_valid_uri_filter(url)
    assert not is_valid_uri_filter(not_url)


def test_float_to_int_filter():
    assert float_to_int_filter("2.0") == 2
    assert float_to_int_filter("2") == 2
    assert float_to_int_filter("test") == "test"
    assert float_to_int_filter(None) == ""


def test_commanum_filter():
    assert commanum_filter(100) == "100"
    assert commanum_filter(100000) == "100,000"
    assert commanum_filter(1000000) == "1,000,000"

    assert commanum_filter("1000") == "1000"


def test_split_to_list_filter():
    assert split_to_list_filter("a;b;c") == ["a", "b", "c"]
    assert split_to_list_filter("a:b:c", delimiter=":") == ["a", "b", "c"]

    assert split_to_list_filter(1) == 1


def test_readable_date_filter():
    d = datetime(2021, 11, 17)
    assert readable_date_filter(d) == "17 November 2021"
    assert readable_date_filter(d, f="%Y-%m-%d") == "2021-11-17"

    assert readable_date_filter("2021-11-17") == "2021-11-17"
    assert readable_date_filter(1) == 1


def test_hex_to_rgb_string_filter():
    assert hex_to_rgb_string_filter("#0b0c0c") == "11,12,12"
