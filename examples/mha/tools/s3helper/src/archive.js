const fs = require('fs');
const http = require('http');
const aws = require('aws-sdk');
const PromisePool = require('es6-promise-pool');

const {logg, loggStartRecording, loggStopRecording} = require('./logg');

const linebreak = '--------------------';
const skipExistingFiles = true;
const logSkippedFiles = false;
const logging = true;

const maxConcurrentDownloads = 5;

//new concurrent version
const archiveS3Objects = async ({s3, bucket, objects, archiveDirectory})=> {

    logging && loggStartRecording();

    logg('archiving s3 objects', {bucket, archiveDirectory});

    logg('object count:', objects.length);

    if(!objects || !archiveDirectory) {
        logg('missing properties, archive aborted', {objects, archiveDirectory});
    }

    let downloadCount = 0;
    let skippedFilesCount = 0;
    const downloadLimit = 400;

    const downloadQueue = [];
    let currentDownloadIndex = 0;
    let attemptedFiles = 0;
    let concurrentDownloads = 0;
    let continueDownloading = true;
    let downloadAttempts = 0;
    let downloadingCompleted = false;


    const getNextDownload = ()=> {

        if(!downloadQueue[currentDownloadIndex]) {
             return null;
        }

        const next = downloadQueue[currentDownloadIndex]
        currentDownloadIndex++;

        return next;

    }

    //create download queue
    const complete = await asyncForEachComplete (objects, async(obj) => {

        if(downloadQueue.length >= downloadLimit) {
            return;
        }

        const key = obj?.Key;

        if(!key) {
            logg('missing key error');
            return;
        }

        const filePathDetails = getFilePathDetails({key, archiveDirectory});

        const { fullPath } = filePathDetails;

        if(fs.existsSync(fullPath) && skipExistingFiles) {

            if(logSkippedFiles) {
                logg('object file already exists, skipping download', fullPath);
            }
            skippedFilesCount++;
            return;
        }

        else {

            downloadQueue.push({
                fullPath,
                key
            });

        }

    });

    console.log(`download queue size`, downloadQueue.length);

    //start downloading
    console.log('starting downloads..');

    const downloadNextObject = async({nextDownload})=> {

        console.log(`staring download: ${nextDownload.key}`);
        concurrentDownloads++;

        const params = {
            Bucket:bucket,
            Key:nextDownload.key
        }

        try {

                //https://gist.github.com/apal21/80c2cfe3606d30ae7d1c655ba6100ea4
                const data = await s3.getObject(params).promise();

                if(data) {
                    logg(`file ${downloadCount + 1 }: downloading `, nextDownload.fullPath);
                    writeObjectToFile({object:data, key:params.Key, archiveDirectory});
                    concurrentDownloads--;
                    downloadCount++;
                }

            }  catch(err) {
                console.log('object get error', err);
                concurrentDownloads--;
        }


    }

    const downloadAttempt = () => {

        //console.log('download attempt');

        if(concurrentDownloads < maxConcurrentDownloads) {

            const nextDownload = getNextDownload();
            if(nextDownload) {

                console.log('starting new download', {concurrentDownloads});
                downloadNextObject({nextDownload});

            } else {

                //wait until all downloads are completed
                if(concurrentDownloads === 0 && !downloadingCompleted) {

                    continueDownloading = false;
                    console.log(`finished downloading, total downloads: ${downloadCount}`);
                    logg({skippedFilesCount, downloadCount});
                    loggStopRecording({label:'s3archive'});
                    downloadingCompleted = true;
                }

            }


        } else {

            //waiting

        }

    };

    //we don't use while loop as it blocks the event loop
    const downloadInterval = setInterval(() => {

       if(!continueDownloading) {
           clearInterval(downloadInterval);
       }

       const availableDownloadSlots = maxConcurrentDownloads - concurrentDownloads;

       if(availableDownloadSlots > 0) {


           //console.log(`>> starting ${availableDownloadSlots} downloads..`, {concurrentDownloads});

           new Array(availableDownloadSlots).fill(null).forEach(item => {

               downloadAttempt();

           });

       }


    }, 50);

}


/*
//older single download at-a-time version
const archiveS3ObjectsOlder = async ({s3, bucket, objects, archiveDirectory})=> {

    logging && loggStartRecording();

    logg('archiving s3 objects', {bucket, archiveDirectory});

    logg('object count:', objects.length);

    if(!objects || !archiveDirectory) {
        logg('missing properties, archive aborted', {objects, archiveDirectory});
    }

    let downloadCount = 0;
    let skippedFilesCount = 0;
    const downloadLimit = 6000;
    let currentDownloadIndex = 0;

    const complete = await asyncForEachComplete (objects, async(obj) => {

        if(downloadCount >= downloadLimit) {
            return;
        }

        const key = obj?.Key;

        if(!key) {
            logg('missing key error');
            return;
        }

        const filePathDetails = getFilePathDetails({key, archiveDirectory});

        const { fullPath } = filePathDetails;

        if(fs.existsSync(fullPath) && skipExistingFiles) {

            logg('object file already exists, skipping download', fullPath);
            skippedFilesCount++;
            return;
        }

        const params = {
            Bucket:bucket,
            Key:key
        }

        try {

            //https://gist.github.com/apal21/80c2cfe3606d30ae7d1c655ba6100ea4
            const data = await s3.getObject(params).promise();

            if(data) {
                logg(`file ${downloadCount}: downloading `, fullPath);
                writeObjectToFile({object:data, key, archiveDirectory});
                downloadCount++;
            }

        } catch(err) {
            console.log('object get error', err);
        }

    });

    logg({skippedFilesCount, downloadCount});
    loggStopRecording({label:'s3archive'});

}

*/



const getFilePathDetails = ({key, archiveDirectory})=> {

    const slashLastIndex = key.lastIndexOf('/');

    const keyDirectories = slashLastIndex !== -1 ? key.slice(0, slashLastIndex) : '';
    const writeDir = `${archiveDirectory}${keyDirectories}`;
    const filename = slashLastIndex !== -1 ? key.slice(slashLastIndex+1, key.length) : key;

    const fullPath = `${writeDir}/${filename}`;

    return {
        writeDir,
        filename,
        fullPath
    }
}

const writeObjectToFile = ({object, key, archiveDirectory})=> {


    const {writeDir, filename, fullPath } = getFilePathDetails({key, archiveDirectory});

    logg('writing file', {writeDirectory:writeDir, filename, key});

    if(!fs.existsSync(writeDir)) {

        fs.mkdirSync(writeDir, {recursive:true}, (err)=> {
        logg('error', err);
        });

    }


    fs.writeFile(fullPath, object.Body, (err)=> {

            if(err) {
                logg({fileWriteError:err});
            } else {
                logg('file written');
                logg(linebreak);
            }

    });

}


//https://codeburst.io/javascript-async-await-with-foreach-b6ba62bbf404
const waitFor = (ms) => new Promise(r => setTimeout(r,ms));

async function asyncForEach(array, callback) {
    for(let index = 0; index < array.length; index++) {
        await callback(array[index], index, array);
    }
}

async function asyncForEachComplete(array, callback) {
    for(let index = 0; index < array.length; index++) {
        await callback(array[index], index, array);
    }
    return 'complete';
}



module.exports = {

    archiveS3Objects

}