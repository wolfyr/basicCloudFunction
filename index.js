const functions = require('firebase-functions');
const gcs = require('@google-cloud/storage')();
const os = require('os');
const path = require('path');

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
exports.onFileChange = functions.storage.object().onFinalize(event => {
    const object = event;
    const bucket = event.bucket;
    const contentType = object.contentType;
    const filePath = object.name;

    console.log('File change detected, function executed');

    if(path.basename(filePath).startsWith('renamed-')){
        return;
    }

    const destBucket = gcs.bucket(bucket);
    const tempFilePath = path.join(os.tmpdir(), path.basename(filePath));
    const metadata = {contentType: contentType};

    return destBucket.file(filePath).download({
        destination: tempFilePath
    }).then(() => {
        return destBucket.upload(tempFilePath, {
            destination: 'renamed-' + path.basename(filePath),
            metadata: metadata
        })
    })
 
});

exports.onFileDelete = functions.storage.object().onDelete(event => {
    console.log(event);
    return;
 
});
