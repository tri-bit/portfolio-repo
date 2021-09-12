const fs = require('fs').promises;
const aws = require('aws-sdk');

const archive = require('./src/archive');
const upload = require('./src/upload');
const directoryMapper = require('./src/directoryMapper');

require('dotenv').config();

const endpoint = process.env.ENDPOINT;
const bucket = process.env.BUCKET;
const archiveDirectory = process.env.DOWNLOADPATH;


const setupS3 = ()=> {

    const ep = new aws.Endpoint(process.env.ENDPOINT);

    try {

        const s3 = new aws.S3({

          accessKeyId: process.env.KEYID,
          secretAccessKey: process.env.ACCESSKEY,
          endpoint:ep,

        });

        console.log('s3 endpoint created');
        return s3;

    } catch(err) {

        console.log('error creating s3 endpoint', err);
        return null;

    }


}

const s3 = setupS3();

const getBucketContents = async(cb)=> {

    console.log('Collecting bucket contents...', bucket);

    const params = {
        Bucket:bucket
    }

    let contents = [];
    //with help from stackoverflow.com/questions/30755129/

    let nextContinuationToken = null;
    let shouldContinue = true;

    while(shouldContinue) {


        const response = await s3.listObjectsV2({...params, ContinuationToken: nextContinuationToken || null})
        .promise();

        contents = [...contents, ...response.Contents];
        console.log(`${contents.length} objects found so far...`);

        shouldContinue = response.IsTruncated;
        nextContinuationToken = response?.NextContinuationToken;

    }

    console.log('collected objects count', contents.length);
    return contents;


}

const archiveFiles = async()=> {

    console.log('Archiving files');
    const contents = await getBucketContents();

    if(contents) {
            archive.archiveS3Objects({s3, bucket, objects:contents, archiveDirectory});
    } else {
            console.log('no data found');
    }

}

const uploadFiles = async({directory, originParentFolder, destinationParentFolder})=> {

    const uploadMap = directoryMapper.uploadMap({directory, originParentFolder, destinationParentFolder});

    if(uploadMap) {
        upload.uploadS3Objects({s3, bucket, uploadMap});
    } else {
        console.log('no upload map found');
    }

}

/*
//test
uploadFiles({
        directory:'panos',
        originParentFolder:'f:/dwg/_dwg_tours/cnm',
        destinationParentFolder:'tours/clients/cnm'
});
*/

archiveFiles();



