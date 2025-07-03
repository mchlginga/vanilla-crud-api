// this provides case sensitive
const normalizeTitle = (t) => {
    try {
        return t.trim().toLowerCase().replace(/\s+/g, '-');
    } catch (error) {
        console.log("Failed to normalize title:", error.meessage);
    }
};

module.exports = normalizeTitle;