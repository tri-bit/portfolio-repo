## S3 Bucket Helper

# Feature 1: Archiving
Download the contents of the entire bucket to your local directory. Supports (adjustable) concurrent downloads.

```js
archiveFiles();
```

# Feature 2: Upload directory to bucket
Upload a directories contents to specific 'directory' in your S3 Bucket

## Example
```js
uploadFiles({

        directory:'panos',
        originParentFolder:'f:/example_directory/',
        destinationParentFolder:'example/upload/path'

});
```

# Required environment variables

| Variable | Description
--- | ---
| ENDPOINT | S3 Endpoint
| KEYID | S3 Key
| ACCESSKEY | S3 Access key
| BUCKET | S3 Bucket name
| DOWNLOADPATH | Local machine archive destination



