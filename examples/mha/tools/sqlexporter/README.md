## SQLExporter Tool

Written to export user data from the previous MHA website (MySQL Worpress database) and prep it for upload to new site's MongoDB database. Roughly 3500 users were converted to the new site's format using this process.

## Exporting User Data (Command Lines)

### 1. Create meta data master file.
The user data was spread across two tables in wordpress: wp_users and users_meta (which contains alot of non-wordpress-standard user information.) Rather than run alot of crossreferenced SQL queries on the live DB i simply dump the meta database to a "master meta" text file which is referenced during the final user import to MongoDB.

```
node exporter -m
```

###  2. Create users master data file:
Exports relevant wp_users table data to a text file which is referenced during the final user import to MongoDB.

```
node exporter -eu <user count>
```

### 3. Import users using both exported files into mongo database
See below for the importerTool.js (server side magichorseauction.com) code that references the two exported files and creates mongoDB user documents for the production database.
View here: https://github.com/tri-bit/portfolio-repo/blob/main/examples/mha/mha%20user%20import/importerTool.js

