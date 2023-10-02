# Welcome to the Back-End

## Technology used
The back-end API is made using *Flask.py* and the database is *PostgreSQL*.

The interpreter used is Python 3.11 with the packages:
- Flask - for API development
- Flask-Cors - for allowing Cross-Origin Resource Sharing
- psycopg2 - for interfacing with the PostgreSQL database

## Opening / Running the project
The back-end project was made in JetBrains PyCharm and is the suggested IDE to open and edit any back-end code.

## Data Models
Models are slightly abstracted between front-end and back-end,
since one side stores data in a database and the other manipulates it facing the user.

At back-end, data is accessed from the database as entities,
and then converted and sent out the API as objects,
accurately representing ownership hierarchy (e.g. entries belong to a quiz object)

## API Documentation
For documentation of InterAPI's endpoints, [see the relavent GitBooks page](https://christopher-wilson.gitbook.io/interapi/)