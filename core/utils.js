'use strict'
const config = require("../config");
const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
const { OpenAI } = require("openai");

const openai = new OpenAI({
    apiKey: config.open_ai_api_key,
});

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

const getLastResponseValue = (answer) => {
    if (answer && answer.versions && answer.versions.length > 0) {
        const last = answer.versions[answer.versions.length - 1];
        if (last.value && !last.markedAsEmpty) return last.value;
    }

    return "";
}

const rampUpElementToText = (ramp_up_content, answers) => {
    let text = "";

    ramp_up_content.forEach(c => {
        c.content?.forEach(c2 => {
            if (c2.type == "text") text += c2.text;

            if (c2.type == "mention" && c2.attrs?.id) {
                text += getLastResponseValue(answers.find(a => a.question_id == c2.attrs.id));
            }
        })
    })

    return (text || "").trim();
}

const processTextWithChatGPT = async (text, temperature, max_tokens) => {
    const resp = await openai.chat.completions.create({
        model: 'gpt-4',
        messages: [{ role: 'user', content: text }],
        max_tokens: max_tokens,
        temperature: temperature,
    });

    return resp?.choices[0]?.message?.content;
}

module.exports = {
    uploadToS3,
    rampUpElementToText,
    processTextWithChatGPT
}