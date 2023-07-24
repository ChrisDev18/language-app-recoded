module.exports = {
    resolve: {
        fallback: { "crypto": require.resolve("crypto-browserify") },
        fallback: { "url": require.resolve("url/") },
        fallback:{ "path": require.resolve("path-browserify") },
        fallback: {"fs": false},
    }
};

