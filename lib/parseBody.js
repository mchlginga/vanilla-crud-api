// parse json body from post
const parseBody = async (req) => {
    return new Promise ((resolve, reject) => {
        let data = "";
        req.on("data", chunk => data += chunk);

        req.on ("end", () => {
            try {
                resolve(JSON.parse(data));
            } catch (error) {
                reject(new Error("Invalid JSON"));
            }
        });

        req.on("error", reject);
    });
};

module.exports = parseBody;