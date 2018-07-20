module.exports = {
    plugins: {
        'postcss-import': {},
        'postcss-url': {},
        'autoprefixer': {},
        'postcss-pxtorem': {
            rootValue: 75,
            propWhiteList: ['*']
        }
    }
}
