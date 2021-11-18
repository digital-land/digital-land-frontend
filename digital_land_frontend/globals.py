import random


def random_int(n=1):
    return "".join([str(random.randint(0, 9)) for i in range(n)])
