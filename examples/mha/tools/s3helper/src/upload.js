const fs = require('fs/promises');
const http = require('http');
const aws = require('aws-sdk');
const mime = require('mime-types');

const { waitFor, asyncForEachComplete } = require('./asyncForEach');
const {logg, loggStartRecording, loggStopRecording} = require('./logg');
const logging = true;

let s3cacheControl = 'public, max-age=31536000';


const uploadS3Objects = async ({s3, bucket, uploadMap, public=true})=> {

    const tempUploadLimit = 3;

    logging && loggStartRecording();

    let uploadCount = 0;

    const complete = await asyncForEachComplete (uploadMap, async(mapItem) => {

        const { local, destination } = mapItem;
        let data = null;

        console.log(uploadCount);

        try {
            data = await fs.readFile(local);
        } catch(err) {
            logg('read file error', err);
            return null;
        }

        if(!data) {
            logg(`no data, skipping ${local}`);
            return null;
        }

        const contentType = mime.lookup(local);

        const params = {

            Bucket: bucket,
            Key: destination,
            Body: data,
            ContentType: contentType,
            CacheControl: s3cacheControl
        };

        if(public) {
            params.ACL = 'public-read';
        }

        await s3.upload(params, function(s3Err, data) {

            if(s3Err) { logg(s3Err) };
            if(s3Err) throw s3Err
            logg(`File uploaded successfully at ${data.Location}`)

        });

        uploadCount++;

    });

    logg('upload complete:', uploadCount);
    loggStopRecording({label:'s3 uploads'});

}

 module.exports = {
     uploadS3Objects
 }