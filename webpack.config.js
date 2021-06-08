const path = require('path');
const webpack = require('webpack');

module.exports = {
    plugins: [
        new webpack.NormalModuleReplacementPlugin(
            /^pdfjs-dist$/,
            resource => {
                resource.request = path.join(__dirname, './node_modules/pdfjs-dist/webpack');
            },
        ),
        ...
    ],
};


const path = require('path');

module.exports = {
    entry: {
        main: './src/index.tsx',
        // main: './index.js',
        'pdf.worker': path.join(__dirname, './node_modules/pdfjs-dist/build/pdf.worker.js'),
    },
    output: {
        path: path.join(__dirname, 'dist'),
        filename: '[name].bundle.js'
    },
    ...
};