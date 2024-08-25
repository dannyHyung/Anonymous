const AWS = require('aws-sdk');

// Initialize the S3 client with your credentials and region
const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION
});

/**
 * Uploads a file to AWS S3.
 */
const uploadFile = (file) => {
    const params = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: file.originalname, // Use a unique identifier if needed
        Body: file.buffer,
        ContentType: file.mimetype
    };

    return s3.upload(params).promise();
};

const deleteFile = async (key) => {
    const params = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: key
    };

    return s3.deleteObject(params).promise();
};

module.exports = { uploadFile, deleteFile };

