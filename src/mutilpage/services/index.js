import xhr from 'XHR';

/**
 * post 请求
 * @param {参数} request
 */
export const postRequest = (request) => {
    return xhr({
        method: 'POST',
        url: '',
        data: request
    })
};

/**
 * get 请求
 * @param {参数} request
 */
export const getRequest = (request) => {
    return xhr({
        url: '',
        params: request
    })
};
