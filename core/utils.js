'use strict'
const config = require("../config");
const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");

const uploadToS3 = async (image_buffer, path, filename, content_type = "image/jpeg") => {
    try {
        if (!image_buffer || !path || !filename) return false; //TODOS OS PARÂMETROS SÃO OBRIGATÓRIOS

        const client = new S3Client({
            credentials: {
                accessKeyId: config.s3_key,
                secretAccessKey: config.s3_secret,
            },
            region: 'sa-east-1',
            signatureVersion: "v4",
        });

        const command = new PutObjectCommand({
            Bucket: config.s3_bucket,
            Key: `${path}/${filename}`,
            ACL: "public-read",
            ContentType: content_type,
            Body: image_buffer,
        });

        await client.send(command);

        return true;
    } catch (err) {
        return false;
    }
}

module.exports = {
    uploadToS3
}