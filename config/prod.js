module.exports = {
    env: "production",
    port: process.env.PORT || 5000,
    dbName: process.env.DB_NAME || "prod_db"
};