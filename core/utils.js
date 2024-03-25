'use strict'
const config = require("../config");
const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
const { OpenAI } = require("openai");
const DBController = require("../database/dbController");
const schedule = require("node-schedule");

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


const processAllFormTexts = async (form_response_id) => {
    try {

        let texts = [];
        let calls = [];

        let form_response = await DBController.getFormResponseById(form_response_id);
        form_response.status = 3;
        await DBController.createOrUpdateFormResponse(form_response, "ChatGPT");
        const ramp_up_elements = await DBController.getRampUpElementsByFormId(form_response.form);

        for (const i in ramp_up_elements) {
            const element = ramp_up_elements[i];

            let renderedText = rampUpElementToText(element.content.content, form_response.answers);

            if (renderedText && element.type == 'prompt') {
                calls.push(processTextWithChatGPT(renderedText, element.temperature || 0.5, element.max_tokens || 1000));
                texts.push({ id: element.id, description: element.description, text: "", replace: true, replaceIndex: calls.length - 1 });
            }
            else {
                texts.push({ id: element.id, description: element.description, text: renderedText });
            }
        }

        const call_responses = await Promise.all(calls);

        for (const i in texts) {
            if (texts[i].replace) {
                texts[i].text = call_responses[texts[i].replaceIndex];
            }

            texts[i].versions = [
                {
                    value: texts[i].text,
                    origin: "ChatGPT",
                    createdBy: null,
                    createdAt: new Date()
                }
            ]

            delete texts[i].replace;
            delete texts[i].replaceIndex;
            delete texts[i].text;
        }

        form_response.status = 4;
        form_response.ramp_up_texts = texts;
        await DBController.createOrUpdateFormResponse(form_response, "ChatGPT");

        return { error: false, message: texts };
    }
    catch (err) {
        return { error: true, message: err.message };
    }
}


//A CADA 1 MINUTO
schedule.scheduleJob('*/1 * * * *', async function () {
    const form_response = await DBController.getFormResponseToProcess();
    if (form_response && form_response._id) await processAllFormTexts(form_response._id);
});

module.exports = {
    uploadToS3,
    rampUpElementToText,
    processTextWithChatGPT
}