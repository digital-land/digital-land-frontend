from digital_land_frontend.globals import random_int


def test_random_int():
    assert len(random_int(5)) == 5
    assert len(random_int()) == 1
