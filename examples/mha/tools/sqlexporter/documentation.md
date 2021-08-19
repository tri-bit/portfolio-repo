## SQLExporter Tool

Written to export user/auction/bid data from the previous MHA website and prep it for upload to new site's MongoDB database

## Importing Users

1. First Create master meta data file

```
node exporter -m
```

2. Export users

```
node exporter -eu <user count>
```

3. Import users from export file to mongo database (server app importerTool will do this)
