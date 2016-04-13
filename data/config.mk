# From http://clarkgrubb.com/makefile-style-guide#prologue
MAKEFLAGS += --warn-undefined-variables
SHELL := /bin/bash
.SHELLFLAGS := -eu -o pipefail
.DEFAULT_GOAL := all
.DELETE_ON_ERROR:
.SUFFIXES:

# Variables specific to this build
PG_HOST=localhost
PG_USER=derekeder
PG_DB=wv_eitc
PG_PORT=5432

HOUSE_DATA=wv_eitc_house.csv
SENATE_DATA=wv_eitc_senate.csv
HOUSE_SHAPE=cb_2014_54_sldl_500k
SENATE_SHAPE=cb_2014_54_sldu_500k
