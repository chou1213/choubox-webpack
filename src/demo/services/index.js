import xhr from 'XHR';

/**
 * 获取天气数据
 * @param {参数} request 
 */
export const weather = (request) => {
    return xhr({
        url: '/v3/weather/weatherInfo',
        params: request
    })
};
