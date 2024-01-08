# -*- coding: utf-8 -*-
import os

basedir = os.path.abspath(os.path.dirname(__file__))


class Config:
    APP_ROOT = os.path.abspath(os.path.dirname(__file__))
    PROJECT_ROOT = os.path.abspath(os.path.join(APP_ROOT, os.pardir))
    DEBUG = False


class DevelopmentConfig(Config):
    ENV = "development"
    DEBUG = True


class TestConfig(Config):
    ENV = "test"
    DEBUG = True
    TESTING = True
