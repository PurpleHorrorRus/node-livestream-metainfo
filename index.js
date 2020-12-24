const fetch = require("node-fetch");

const regex = /StreamTitle=(.*?);/

module.exports = async radio => {
    const response = await fetch(radio, {
        headers: {
            "Icy-MetaData": 1
        }
    });

    const song = await new Promise(resolve => {
        response.body.on("data", chunk => {
            chunk = chunk.toString();
            
            if (regex.test(chunk)) {
                response.body.destroy();
                const song = chunk.match(regex)[1];
                return resolve(song.substring(1, song.length - 1));
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