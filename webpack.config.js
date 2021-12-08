const path = require('path');

module.exports = {
    mode: "production",
    entry: {
        app: "./src/client/app.ts"
    },
    output: {
        path: path.resolve(__dirname, 'dist/client'),
        filename: '[name].js'
    },
    resolve: {
        extensions: ['.ts', 'tsx', '.js']
    },
    devtool: 'source-map',
    plugins: [],
    module: {
        rules: [{
            test: /\.tsx?$/,
            loader: 'ts-loader',
            exclude: /node_modules/
        }]
    }
};