## SQLExporter Tool

Written to export user data from the previous MHA website (MySQL Worpress database) and prep it for upload to new site's MongoDB database. Roughly 3500 users were converted to the new site's format using this process.

## Importing Users

1. First Create master meta data file.
The user data was spread across two tables in wordpress: wp_users and users_meta (which contains alot of non-wordpress specific user information.) Rather than run alot of crossreferenced SQL queries on the live DB i simply dump the meta database to a "master meta" text file which is referenced during the final user import to MongoDB.

```
node exporter -m
```

2. Export users data file:
Exports wp_users table to a text file which is referenced during the final user import to MongoDB.

```
node exporter -eu <user count>
```

3. Import users from both export files to mongo database (server app importerTool will do this)
importerTool.js (server side magichorseauction.com) code that references the two export files and creates a mongoDB user document for the production database.
Available here: https://github.com/tri-bit/portfolio-repo/blob/main/examples/mha/mha%20user%20import/importerTool.js

