const fetch = require("node-fetch");
const { pipeline } = require("stream");
const { promisify } = require("util");

const streamPipeline = promisify(pipeline);

const regex = /StreamTitle=(.*?);/

module.exports = async radio => {
    const response = await fetch(radio, {
        headers: {
            "Icy-MetaData": 1
        }
    });

    const song = await new Promise(resolve => {
        streamPipeline(response.body, async source => {
            source.setEncoding("utf8");

            for await (const chunk of source) {
                if (regex.test(chunk)) {
                    const song = chunk.match(regex)[1];
                    resolve(song.substring(1, song.length - 1));
                }
            }
        });
    });

    return {
        name: response.headers.get("icy-name"),
        description: response.headers.get("icy-description"),
        genre: response.headers.get("icy-genre"),
        bitrate: parseInt(response.headers.get("icy-br")),
        audioInfo: response.headers.get("ice-audio-info"),
        song
    };
};